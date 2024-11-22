import express from 'express';
import { body } from 'express-validator';
import { OpenAIController } from '../controllers/OpenAIController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

// 验证中间件
const contentValidation = [
  body('content').trim().notEmpty().withMessage('Content is required'),
];

const promptValidation = [
  body('prompt').trim().notEmpty().withMessage('Prompt is required'),
];

// 生成标题
router.post(
  '/generate-title',
  authenticate,
  contentValidation,
  validateRequest,
  OpenAIController.generateTitle
);

// 生成摘要
router.post(
  '/generate-summary',
  authenticate,
  contentValidation,
  validateRequest,
  OpenAIController.generateSummary
);

// 生成标签
router.post(
  '/generate-tags',
  authenticate,
  contentValidation,
  validateRequest,
  OpenAIController.generateTags
);

// 改进写作
router.post(
  '/improve-writing',
  authenticate,
  contentValidation,
  validateRequest,
  OpenAIController.improveWriting
);

// 生成图片
router.post(
  '/generate-image',
  authenticate,
  promptValidation,
  validateRequest,
  OpenAIController.generateImage
);

export default router;
