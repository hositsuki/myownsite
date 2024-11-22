import { body, param, query } from 'express-validator';

export const createPostValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'scheduled'])
    .withMessage('Invalid status'),
  body('scheduledPublishDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
];

export const updatePostValidator = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required'),
  ...createPostValidator,
];

export const getPostValidator = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required'),
];

export const getPostsValidator = [
  query('status')
    .optional()
    .isIn(['draft', 'published', 'scheduled'])
    .withMessage('Invalid status'),
  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters'),
];
