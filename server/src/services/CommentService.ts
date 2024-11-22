import { BaseService } from '../core/BaseService';
import Comment, { IComment } from '../models/Comment';
import Post from '../models/Post';
import { NotFoundError, ValidationError, ForbiddenError } from '../utils/errors';
import { validateEmail } from '../utils/validation';

export class CommentService extends BaseService {
  constructor() {
    super('CommentService');
  }

  /**
   * 创建评论
   */
  async createComment(commentData: Partial<IComment>): Promise<IComment> {
    return await this.wrapDbOperation('createComment', async () => {
      // 验证必要参数
      this.validateRequiredParams(commentData, ['postId', 'author', 'email', 'content']);

      // 验证邮箱格式
      if (!validateEmail(commentData.email)) {
        throw new ValidationError('Invalid email format');
      }

      // 验证文章是否存在
      this.validateObjectId(commentData.postId);
      const post = await Post.findById(commentData.postId);
      if (!post) {
        throw new NotFoundError('Post not found');
      }

      // 如果是回复其他评论，验证父评论是否存在
      if (commentData.parentCommentId) {
        this.validateObjectId(commentData.parentCommentId);
        const parentComment = await Comment.findById(commentData.parentCommentId);
        if (!parentComment) {
          throw new NotFoundError('Parent comment not found');
        }
      }

      // 创建评论
      const comment = new Comment(commentData);
      await comment.save();

      // 清除缓存
      await this.clearCache([
        `comments:${commentData.postId}`,
        `comment:${comment._id}`
      ]);

      return comment;
    });
  }

  /**
   * 获取评论
   */
  async getComment(commentId: string): Promise<IComment> {
    return await this.wrapDbOperation('getComment', async () => {
      // 验证ID
      this.validateObjectId(commentId);

      // 从缓存获取评论
      const comment = await this.getFromCache(`comment:${commentId}`, async () => {
        const found = await Comment.findById(commentId);
        if (!found) throw new NotFoundError('Comment not found');
        return found;
      });

      return comment;
    });
  }

  /**
   * 获取文章的评论列表
   */
  async getComments(postId: string, options: {
    page?: number;
    limit?: number;
    isApproved?: boolean;
  } = {}): Promise<{ comments: IComment[]; total: number }> {
    return await this.wrapDbOperation('getComments', async () => {
      // 验证文章ID
      this.validateObjectId(postId);

      const {
        page = 1,
        limit = 10,
        isApproved = true
      } = options;

      // 构建查询条件
      const query: any = { 
        postId,
        parentCommentId: { $exists: false } // 只获取顶级评论
      };
      if (typeof isApproved === 'boolean') {
        query.isApproved = isApproved;
      }

      // 从缓存获取数据
      const cacheKey = `comments:${postId}:${JSON.stringify(options)}`;
      return await this.getFromCache(cacheKey, async () => {
        // 获取总数
        const total = await Comment.countDocuments(query);

        // 获取评论列表
        const comments = await Comment.find(query)
          .sort({ date: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('replies');

        return { comments, total };
      });
    });
  }

  /**
   * 更新评论
   */
  async updateComment(commentId: string, updates: Partial<IComment>, userEmail: string): Promise<IComment> {
    return await this.wrapDbOperation('updateComment', async () => {
      // 验证ID
      this.validateObjectId(commentId);

      // 获取评论
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new NotFoundError('Comment not found');
      }

      // 验证权限
      if (comment.email !== userEmail) {
        throw new ForbiddenError('You can only edit your own comments');
      }

      // 只允许更新内容
      if (updates.content) {
        comment.content = updates.content;
        comment.isEdited = true;
        comment.lastEditDate = new Date();
      }

      await comment.save();

      // 清除缓存
      await this.clearCache([
        `comments:${comment.postId}`,
        `comment:${commentId}`
      ]);

      return comment;
    });
  }

  /**
   * 删除评论
   */
  async deleteComment(commentId: string, userEmail: string): Promise<void> {
    await this.wrapDbOperation('deleteComment', async () => {
      // 验证ID
      this.validateObjectId(commentId);

      // 获取评论
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new NotFoundError('Comment not found');
      }

      // 验证权限
      if (comment.email !== userEmail) {
        throw new ForbiddenError('You can only delete your own comments');
      }

      // 删除评论及其所有回复
      await Comment.deleteMany({
        $or: [
          { _id: commentId },
          { parentCommentId: commentId }
        ]
      });

      // 清除缓存
      await this.clearCache([
        `comments:${comment.postId}`,
        `comment:${commentId}`
      ]);
    });
  }

  /**
   * 审核评论
   */
  async approveComment(commentId: string, isApproved: boolean): Promise<IComment> {
    return await this.wrapDbOperation('approveComment', async () => {
      // 验证ID
      this.validateObjectId(commentId);

      // 更新评论状态
      const comment = await Comment.findByIdAndUpdate(
        commentId,
        { isApproved },
        { new: true }
      );

      if (!comment) {
        throw new NotFoundError('Comment not found');
      }

      // 清除缓存
      await this.clearCache([
        `comments:${comment.postId}`,
        `comment:${commentId}`
      ]);

      return comment;
    });
  }

  /**
   * 获取评论回复
   */
  async getReplies(commentId: string): Promise<IComment[]> {
    return await this.wrapDbOperation('getReplies', async () => {
      // 验证ID
      this.validateObjectId(commentId);

      // 获取回复
      const replies = await Comment.find({
        parentCommentId: commentId,
        isApproved: true
      }).sort({ date: 1 });

      return replies;
    });
  }
}

export default new CommentService();
