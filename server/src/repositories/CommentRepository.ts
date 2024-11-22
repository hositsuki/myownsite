import { Types } from 'mongoose';
import Comment, { IComment } from '../models/Comment';
import { ApiError } from '../core/ApiError';

interface CreateCommentData {
  postId: Types.ObjectId;
  content: string;
  authorId: Types.ObjectId;
  parentId?: Types.ObjectId;
}

export class CommentRepository {
  async findByPostId(postId: Types.ObjectId): Promise<IComment[]> {
    return Comment.find({ postId })
      .populate('authorId', 'username avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'authorId',
          select: 'username avatar'
        }
      })
      .sort({ createdAt: -1 });
  }

  async create(data: CreateCommentData): Promise<IComment> {
    const comment = new Comment({
      postId: data.postId,
      content: data.content,
      authorId: data.authorId,
      parentId: data.parentId
    });

    await comment.save();
    return comment.populate('authorId', 'username avatar');
  }

  async findById(id: Types.ObjectId): Promise<IComment | null> {
    return Comment.findById(id).populate('authorId', 'username avatar');
  }

  async update(id: Types.ObjectId, content: string): Promise<IComment | null> {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { content, updatedAt: new Date() },
      { new: true }
    ).populate('authorId', 'username avatar');

    if (!comment) {
      throw new ApiError(404, '评论未找到');
    }

    return comment;
  }

  async delete(id: Types.ObjectId): Promise<IComment | null> {
    const comment = await Comment.findByIdAndDelete(id);
    
    if (!comment) {
      throw new ApiError(404, '评论未找到');
    }

    // 如果是父评论，删除所有回复
    if (!comment.parentId) {
      await Comment.deleteMany({ parentId: id });
    }

    return comment;
  }

  async addReply(commentId: Types.ObjectId, replyId: Types.ObjectId): Promise<IComment | null> {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: replyId } },
      { new: true }
    ).populate('authorId', 'username avatar');

    if (!comment) {
      throw new ApiError(404, '评论未找到');
    }

    return comment;
  }
}
