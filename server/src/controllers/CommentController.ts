import { Request, Response } from 'express';
import { BaseController } from '../core/BaseController';
import CommentService from '../services/CommentService';
import { IComment } from '../models/Comment';

export class CommentController extends BaseController {
  constructor() {
    super('CommentController');
  }

  /**
   * 创建评论
   */
  createComment = this.wrapAsync(async (req: Request, res: Response) => {
    const comment = await CommentService.createComment(req.body);
    
    this.sendSuccess(res, {
      message: 'Comment created successfully',
      data: { comment }
    });
  });

  /**
   * 获取评论
   */
  getComment = this.wrapAsync(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    this.validateRequiredParams({ commentId }, ['commentId']);

    const comment = await CommentService.getComment(commentId);
    
    this.sendSuccess(res, {
      data: { comment }
    });
  });

  /**
   * 获取文章的评论列表
   */
  getComments = this.wrapAsync(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const {
      page,
      limit,
      isApproved
    } = req.query;

    this.validateRequiredParams({ postId }, ['postId']);

    const result = await CommentService.getComments(postId, {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      isApproved: isApproved ? isApproved === 'true' : undefined
    });
    
    this.sendSuccess(res, {
      data: result
    });
  });

  /**
   * 更新评论
   */
  updateComment = this.wrapAsync(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const userEmail = req.user?.email;
    
    this.validateRequiredParams({ commentId, userEmail }, ['commentId', 'userEmail']);

    const comment = await CommentService.updateComment(commentId, req.body, userEmail);
    
    this.sendSuccess(res, {
      message: 'Comment updated successfully',
      data: { comment }
    });
  });

  /**
   * 删除评论
   */
  deleteComment = this.wrapAsync(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const userEmail = req.user?.email;
    
    this.validateRequiredParams({ commentId, userEmail }, ['commentId', 'userEmail']);

    await CommentService.deleteComment(commentId, userEmail);
    
    this.sendSuccess(res, {
      message: 'Comment deleted successfully'
    });
  });

  /**
   * 审核评论
   */
  approveComment = this.wrapAsync(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const { isApproved } = req.body;
    
    this.validateRequiredParams({ commentId, isApproved }, ['commentId', 'isApproved']);

    const comment = await CommentService.approveComment(commentId, isApproved);
    
    this.sendSuccess(res, {
      message: `Comment ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: { comment }
    });
  });

  /**
   * 获取评论回复
   */
  getReplies = this.wrapAsync(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    this.validateRequiredParams({ commentId }, ['commentId']);

    const replies = await CommentService.getReplies(commentId);
    
    this.sendSuccess(res, {
      data: { replies }
    });
  });
}

export default new CommentController();
