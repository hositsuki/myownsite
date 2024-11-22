import express from 'express';
import multer from 'multer';
import { ImageController } from '../controllers/ImageController';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import { query } from 'express-validator';

const router = express.Router();

// 配置multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

// 验证中间件
const optimizeValidation = [
  query('width').optional().isInt({ min: 1 }).withMessage('Width must be a positive integer'),
  query('height').optional().isInt({ min: 1 }).withMessage('Height must be a positive integer'),
  query('quality').optional().isInt({ min: 1, max: 100 }).withMessage('Quality must be between 1 and 100'),
];

// 上传图片（需要认证）
router.post(
  '/upload',
  authenticate,
  upload.single('image'),
  ImageController.uploadImage
);

// 获取图片
router.get('/:filename', ImageController.getImage);

// 获取优化后的图片
router.get(
  '/optimize/:filename',
  optimizeValidation,
  validateRequest,
  ImageController.optimizeImage
);

// 删除图片（需要认证）
router.delete(
  '/:filename',
  authenticate,
  ImageController.deleteImage
);

export default router;
