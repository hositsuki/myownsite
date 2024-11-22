import express from 'express';
import { body } from 'express-validator';
import { CommentController } from '../controllers/CommentController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

// 验证中间件
const commentValidation = [
  body('content').trim().notEmpty().withMessage('Comment content is required'),
];

// 获取文章的评论
router.get('/:postId', CommentController.getPostComments);

// 创建评论（需要认证）
router.post(
  '/:postId',
  authenticate,
  commentValidation,
  validateRequest,
  CommentController.createComment
);

// 回复评论（需要认证）
router.post(
  '/:commentId/reply',
  authenticate,
  commentValidation,
  validateRequest,
  CommentController.replyComment
);

// 更新评论（需要认证）
router.put(
  '/:commentId',
  authenticate,
  commentValidation,
  validateRequest,
  CommentController.updateComment
);

// 删除评论（需要认证）
router.delete(
  '/:commentId',
  authenticate,
  CommentController.deleteComment
);

export default router;
