import { Request, Response } from 'express';
import { BaseController } from '../core/BaseController';
import PostService from '../services/PostService';
import { IPost } from '../models/Post';

export class PostController extends BaseController {
  constructor() {
    super('PostController');
  }

  /**
   * 创建文章
   */
  createPost = this.wrapAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString();
    this.validateRequiredParams({ userId }, ['userId']);

    const post = await PostService.createPost(req.body, userId);
    
    this.sendSuccess(res, {
      message: 'Post created successfully',
      data: { post }
    });
  });

  /**
   * 更新文章
   */
  updatePost = this.wrapAsync(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.user?._id.toString();
    
    this.validateRequiredParams({ postId, userId }, ['postId', 'userId']);

    const post = await PostService.updatePost(postId, req.body, userId);
    
    this.sendSuccess(res, {
      message: 'Post updated successfully',
      data: { post }
    });
  });

  /**
   * 删除文章
   */
  deletePost = this.wrapAsync(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.user?._id.toString();
    
    this.validateRequiredParams({ postId, userId }, ['postId', 'userId']);

    await PostService.deletePost(postId, userId);
    
    this.sendSuccess(res, {
      message: 'Post deleted successfully'
    });
  });

  /**
   * 获取单篇文章
   */
  getPost = this.wrapAsync(async (req: Request, res: Response) => {
    const { identifier } = req.params;
    const isPreview = req.query.preview === 'true';
    
    const post = await PostService.getPost(identifier, isPreview);
    
    this.sendSuccess(res, {
      data: { post }
    });
  });

  /**
   * 获取文章列表
   */
  getPosts = this.wrapAsync(async (req: Request, res: Response) => {
    const {
      page,
      limit,
      category,
      tag,
      status,
      author,
      search
    } = req.query;

    const result = await PostService.getPosts({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      category: category as string,
      tag: tag as string,
      status: status as string,
      author: author as string,
      search: search as string
    });
    
    this.sendSuccess(res, {
      data: result
    });
  });
}

export default new PostController();
