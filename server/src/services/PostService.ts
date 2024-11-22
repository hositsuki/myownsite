import { BaseService } from '../core/BaseService';
import Post, { IPost } from '../models/Post';
import { NotFoundError, ValidationError, ForbiddenError } from '../utils/errors';
import { Types } from 'mongoose';

export class PostService extends BaseService {
  constructor() {
    super('PostService');
  }

  /**
   * 创建新文章
   */
  async createPost(postData: Partial<IPost>, authorId: string): Promise<IPost> {
    return await this.wrapDbOperation('createPost', async () => {
      // 验证必要参数
      this.validateRequiredParams(postData, ['title', 'content', 'category']);

      // 生成 slug
      const slug = await this.generateUniqueSlug(postData.title);

      // 创建文章
      const post = new Post({
        ...postData,
        author: authorId,
        slug,
        status: postData.status || 'draft',
        readTime: this.calculateReadTime(postData.content)
      });

      await post.save();

      // 清除缓存
      await this.clearCache(['posts', `post:${post._id}`, `post:${slug}`]);

      return post;
    });
  }

  /**
   * 更新文章
   */
  async updatePost(postId: string, updates: Partial<IPost>, userId: string): Promise<IPost> {
    return await this.wrapDbOperation('updatePost', async () => {
      // 验证ID
      this.validateObjectId(postId);

      // 获取文章
      const post = await this.getFromCache(`post:${postId}`, async () => {
        const found = await Post.findById(postId);
        if (!found) throw new NotFoundError('Post not found');
        return found;
      });

      // 检查权限
      await this.checkOwnership(post, userId);

      // 如果标题改变，更新 slug
      if (updates.title && updates.title !== post.title) {
        updates.slug = await this.generateUniqueSlug(updates.title);
      }

      // 如果内容改变，更新阅读时间
      if (updates.content) {
        updates.readTime = this.calculateReadTime(updates.content);
      }

      // 如果状态改变，记录历史
      if (updates.status && updates.status !== post.status) {
        post.statusHistory.push({
          status: updates.status,
          date: new Date(),
          updatedBy: userId
        });
      }

      // 更新文章
      Object.assign(post, updates);
      await post.save();

      // 清除缓存
      await this.clearCache(['posts', `post:${postId}`, `post:${post.slug}`]);

      return post;
    });
  }

  /**
   * 删除文章
   */
  async deletePost(postId: string, userId: string): Promise<void> {
    await this.wrapDbOperation('deletePost', async () => {
      // 验证ID
      this.validateObjectId(postId);

      // 获取文章
      const post = await Post.findById(postId);
      if (!post) throw new NotFoundError('Post not found');

      // 检查权限
      await this.checkOwnership(post, userId);

      // 删除文章
      await post.deleteOne();

      // 清除缓存
      await this.clearCache(['posts', `post:${postId}`, `post:${post.slug}`]);
    });
  }

  /**
   * 获取单篇文章
   */
  async getPost(identifier: string, isPreview: boolean = false): Promise<IPost> {
    return await this.wrapDbOperation('getPost', async () => {
      // 判断是通过 ID 还是 slug 查询
      const isId = Types.ObjectId.isValid(identifier);
      const cacheKey = `post:${identifier}`;

      const post = await this.getFromCache(cacheKey, async () => {
        const query = isId 
          ? { _id: identifier }
          : { slug: identifier };

        // 如果不是预览模式，只返回已发布的文章
        if (!isPreview) {
          query['status'] = 'published';
        }

        const found = await Post.findOne(query).populate('author', 'username avatar');
        if (!found) throw new NotFoundError('Post not found');
        return found;
      });

      // 增加浏览次数
      if (!isPreview) {
        post.views += 1;
        await post.save();
      }

      return post;
    });
  }

  /**
   * 获取文章列表
   */
  async getPosts(options: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    status?: string;
    author?: string;
    search?: string;
  } = {}): Promise<{ posts: IPost[]; total: number }> {
    return await this.wrapDbOperation('getPosts', async () => {
      const {
        page = 1,
        limit = 10,
        category,
        tag,
        status = 'published',
        author,
        search
      } = options;

      // 构建查询条件
      const query: any = { status };
      if (category) query.category = category;
      if (tag) query.tags = tag;
      if (author) query.author = author;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }

      // 从缓存获取数据
      const cacheKey = `posts:${JSON.stringify(options)}`;
      return await this.getFromCache(cacheKey, async () => {
        // 获取总数
        const total = await Post.countDocuments(query);

        // 获取文章列表
        const posts = await Post.find(query)
          .populate('author', 'username avatar')
          .sort({ date: -1 })
          .skip((page - 1) * limit)
          .limit(limit);

        return { posts, total };
      });
    });
  }

  /**
   * 生成唯一的 slug
   */
  private async generateUniqueSlug(title: string): Promise<string> {
    let slug = this.slugify(title);
    let counter = 1;
    
    while (await Post.findOne({ slug })) {
      slug = `${this.slugify(title)}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * 将标题转换为 slug
   */
  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // 替换空格为 -
      .replace(/[^\w\-]+/g, '')    // 移除非单词字符
      .replace(/\-\-+/g, '-')      // 替换多个 - 为单个 -
      .replace(/^-+/, '')          // 移除开头的 -
      .replace(/-+$/, '');         // 移除结尾的 -
  }

  /**
   * 计算阅读时间
   */
  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }
}

export default new PostService();
