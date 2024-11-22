import express from 'express';
import { RssController } from '../controllers/RssController';
import { param } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

router.get(
  '/:format?',
  [
    param('format')
      .optional()
      .isIn(['rss', 'atom', 'json'])
      .withMessage('Invalid feed format'),
    validateRequest
  ],
  RssController.generateRssFeed
);

export default router;