import express from 'express';
import { PreviewController } from '../controllers/PreviewController';
import { validateRequest } from '../middleware/validateRequest';
import { body, param } from 'express-validator';

const router = express.Router();

router.post(
  '/markdown',
  [
    body('markdown').notEmpty().withMessage('Markdown content is required'),
    validateRequest
  ],
  PreviewController.previewMarkdown
);

router.get(
  '/post/:slug',
  [
    param('slug').notEmpty().withMessage('Post slug is required'),
    validateRequest
  ],
  PreviewController.previewPost
);

export default router;