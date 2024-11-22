// 导入所需的依赖
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '../utils/logger';
import { BadRequestError, InternalError } from '../core/ApiError';

// 定义图片处理选项接口
interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
}

export class ImageService {
  /**
   * 处理并优化上传的图片
   * @param file - 上传的文件buffer
   * @param options - 处理选项（宽度、高度、质量）
   * @returns Promise<{filename: string, path: string}> - 返回处理后的文件名和路径
   * @throws {BadRequestError} 当文件格式不支持时
   * @throws {InternalError} 当处理过程出错时
   */
  static async processImage(
    file: Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<{ filename: string; path: string }> {
    try {
      // 生成唯一的文件名
      const filename = `${uuidv4()}.webp`;

      // 使用sharp处理图片
      const processedImage = await sharp(file)
        // 调整图片大小，保持比例，不放大
        .resize(options.width, options.height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        // 转换为webp格式，设置质量
        .webp({ quality: options.quality || 80 })
        .toBuffer();

      // 确保上传目录存在
      const uploadDir = process.env.UPLOAD_DIR!;
      await fs.mkdir(uploadDir, { recursive: true });

      // 保存处理后的图片
      const imagePath = path.join(uploadDir, filename);
      await fs.writeFile(imagePath, processedImage);

      return { filename, path: imagePath };
    } catch (error) {
      logger.error('图片处理失败:', error);
      if (error instanceof Error) {
        throw new InternalError(`图片处理失败: ${error.message}`);
      }
      throw new InternalError('图片处理失败');
    }
  }

  /**
   * 为图片生成缩略图
   * @param originalPath - 原始图片路径
   * @returns Promise<string> - 缩略图路径
   * @throws {InternalError} 当生成缩略图失败时
   */
  static async createThumbnail(originalPath: string): Promise<string> {
    try {
      const thumbnailPath = path.join(
        path.dirname(originalPath),
        `thumb_${path.basename(originalPath)}`
      );

      await sharp(originalPath)
        .resize(200, 200, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(thumbnailPath);

      return thumbnailPath;
    } catch (error) {
      logger.error('缩略图生成失败:', error);
      if (error instanceof Error) {
        throw new InternalError(`缩略图生成失败: ${error.message}`);
      }
      throw new InternalError('缩略图生成失败');
    }
  }

  /**
   * 删除图片及其缩略图
   * @param filename - 图片文件名
   * @returns Promise<void>
   */
  static async deleteImage(filename: string): Promise<void> {
    try {
      const uploadDir = process.env.UPLOAD_DIR!;
      const imagePath = path.join(uploadDir, filename);
      const thumbnailPath = path.join(uploadDir, `thumb_${filename}`);

      // 删除原图
      await fs.unlink(imagePath).catch(() => {});
      // 删除缩略图
      await fs.unlink(thumbnailPath).catch(() => {});
    } catch (error) {
      logger.error('图片删除失败:', error);
      if (error instanceof Error) {
        throw new InternalError(`图片删除失败: ${error.message}`);
      }
      throw new InternalError('图片删除失败');
    }
  }
}
