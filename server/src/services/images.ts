import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';

// 配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 处理和上传图片
export const processImage = async (buffer: Buffer) => {
  try {
    // 将 buffer 转换为 base64
    const base64Image = buffer.toString('base64');
    const dataURI = `data:image/jpeg;base64,${base64Image}`;

    // 上传到 Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
      folder: 'blog',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    return result;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

// 删除图片
export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// 获取优化的图片URL
export const getOptimizedImageUrl = (
  publicId: string,
  { width, height, format }: { width?: number; height?: number; format?: string }
) => {
  const transformation = [];
  
  if (width || height) {
    transformation.push({
      width,
      height,
      crop: 'fill'
    });
  }
  
  if (format) {
    transformation.push({ fetch_format: format });
  }
  
  return cloudinary.url(publicId, {
    transformation,
    secure: true
  });
};
