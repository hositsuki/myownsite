import express from 'express';
import { PostController } from '../controllers/PostController';
import { authenticate, requireAdmin } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import { body, param, query } from 'express-validator';

const router = express.Router();

// 获取所有文章
router.get(
  '/',
  [
    query('status').optional().isString(),
    query('category').optional().isString(),
    validateRequest
  ],
  PostController.getPosts
);

// 获取单篇文章
router.get(
  '/:slug',
  [
    param('slug').notEmpty().withMessage('Slug is required'),
    validateRequest
  ],
  PostController.getPost
);

// 创建文章
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('status').optional().isIn(['draft', 'published', 'scheduled']),
    body('category').optional().isString(),
    validateRequest
  ],
  PostController.createPost
);

// 更新文章
router.put(
  '/:slug',
  authenticate,
  requireAdmin,
  [
    param('slug').notEmpty().withMessage('Slug is required'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    body('status').optional().isIn(['draft', 'published', 'scheduled']),
    body('category').optional().isString(),
    validateRequest
  ],
  PostController.updatePost
);

// 删除文章
router.delete(
  '/:slug',
  authenticate,
  requireAdmin,
  [
    param('slug').notEmpty().withMessage('Slug is required'),
    validateRequest
  ],
  PostController.deletePost
);

// 获取文章历史记录
router.get(
  '/:slug/history',
  authenticate,
  requireAdmin,
  [
    param('slug').notEmpty().withMessage('Slug is required'),
    validateRequest
  ],
  PostController.getPostHistory
);

// 搜索文章
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  validateRequest
], PostController.searchPosts);

export default router;
