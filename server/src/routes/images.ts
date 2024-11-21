import { Router } from 'express';
import multer from 'multer';
import { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { processImage, deleteImage, getOptimizedImageUrl } from '../services/images';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

const router = Router();

// 配置 multer，使用内存存储
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('只能上传图片文件'));
      return;
    }
    cb(null, true);
  }
});

// 错误处理中间件
const handleError = (err: unknown, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err instanceof Error ? err.message : '上传失败'
  });
};

// 生成加密的图片URL
function encryptImageUrl(originalUrl: string): string {
  const key = process.env.IMAGE_ENCRYPTION_KEY || 'default-key';
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(originalUrl, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// 解密图片URL
function decryptImageUrl(encryptedUrl: string): string {
  const key = process.env.IMAGE_ENCRYPTION_KEY || 'default-key';
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedUrl, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 上传图片
router.post('/upload', auth, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: '没有上传文件' 
      });
    }

    // 处理和优化图片
    const result = await processImage(req.file.buffer);
    const encryptedUrl = encryptImageUrl(result.secure_url);

    res.json({
      success: true,
      data: {
        id: encryptedUrl,
        width: result.width,
        height: result.height,
        format: result.format
      }
    });
  } catch (error) {
    handleError(error, res);
  }
});

// 获取优化的图片URL
router.get('/:imageId', async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const originalUrl = decryptImageUrl(imageId);
    
    // 获取图片参数
    const width = req.query.width ? parseInt(req.query.width as string) : undefined;
    const height = req.query.height ? parseInt(req.query.height as string) : undefined;
    const format = req.query.format as string | undefined;

    // 从原始URL中提取public_id
    const publicId = originalUrl.split('/').pop()!.split('.')[0];

    // 获取优化的图片URL
    const optimizedUrl = getOptimizedImageUrl(publicId, { width, height, format });

    // 重定向到优化后的图片URL
    res.redirect(optimizedUrl);
  } catch (error) {
    handleError(error, res);
  }
});

// 删除图片
router.delete('/:imageId', auth, async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const originalUrl = decryptImageUrl(imageId);
    const publicId = originalUrl.split('/').pop()!.split('.')[0];
    
    await deleteImage(publicId);
    res.json({ 
      success: true,
      message: '图片删除成功'
    });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
