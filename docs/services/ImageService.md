# 图片服务文档

## 概述

图片服务（ImageService）负责处理所有与图片相关的操作，包括上传、处理、存储和删除。该服务确保图片的安全存储和高效访问。

## 功能特性

1. **图片上传**
   - 支持多种图片格式（JPG, PNG, WebP, GIF）
   - 自动生成唯一文件名
   - 文件大小和类型验证

2. **图片处理**
   - 自动生成缩略图
   - 图片压缩和优化
   - 支持自定义尺寸调整

3. **存储管理**
   - 按日期组织文件结构
   - 自动清理未使用的图片
   - 支持多种存储后端

## 实现细节

### 配置选项

```typescript
interface ImageServiceConfig {
  uploadDir: string;          // 上传目录路径
  maxFileSize: number;        // 最大文件大小（字节）
  allowedFormats: string[];   // 允许的文件格式
  thumbnailOptions: {         // 缩略图选项
    width: number;           // 宽度
    height: number;          // 高度
    quality: number;         // 质量（1-100）
  };
  storageType: 'local' | 's3'; // 存储类型
}
```

### 核心方法

#### 上传图片

```typescript
async function uploadImage(file: Express.Multer.File): Promise<UploadResult> {
  // 1. 验证文件
  validateImage(file);
  
  // 2. 生成文件名
  const filename = generateUniqueFilename(file);
  
  // 3. 处理图片
  const processedImage = await processImage(file.buffer);
  
  // 4. 保存图片
  const path = await saveImage(processedImage, filename);
  
  // 5. 生成缩略图
  const thumbnail = await generateThumbnail(processedImage);
  
  return {
    filename,
    path,
    thumbnailPath: thumbnail.path,
    size: processedImage.size,
    mimeType: file.mimetype
  };
}
```

#### 图片处理

```typescript
async function processImage(buffer: Buffer): Promise<ProcessedImage> {
  const image = sharp(buffer);
  
  // 获取图片信息
  const metadata = await image.metadata();
  
  // 根据配置调整图片
  const processed = await image
    .resize({
      width: config.maxWidth,
      height: config.maxHeight,
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: config.quality })
    .toBuffer();
    
  return {
    buffer: processed,
    metadata
  };
}
```

#### 生成缩略图

```typescript
async function generateThumbnail(image: ProcessedImage): Promise<Thumbnail> {
  const thumbnail = await sharp(image.buffer)
    .resize({
      width: config.thumbnailOptions.width,
      height: config.thumbnailOptions.height,
      fit: 'cover'
    })
    .jpeg({ quality: config.thumbnailOptions.quality })
    .toBuffer();
    
  const filename = `thumb_${image.filename}`;
  const path = await saveThumbnail(thumbnail, filename);
  
  return { path, size: thumbnail.length };
}
```

### 错误处理

```typescript
class ImageError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ImageError';
  }
}

// 文件大小错误
class FileSizeError extends ImageError {
  constructor(size: number, maxSize: number) {
    super(
      `文件大小 ${size}B 超过最大限制 ${maxSize}B`,
      'FILE_SIZE_ERROR',
      400
    );
  }
}

// 文件格式错误
class FileFormatError extends ImageError {
  constructor(format: string, allowedFormats: string[]) {
    super(
      `不支持的文件格式 ${format}。允许的格式：${allowedFormats.join(', ')}`,
      'FILE_FORMAT_ERROR',
      400
    );
  }
}
```

## 使用示例

### 基本用法

```typescript
const imageService = new ImageService(config);

// 上传图片
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await imageService.uploadImage(req.file);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    handleImageError(error, res);
  }
});

// 删除图片
app.delete('/images/:filename', async (req, res) => {
  try {
    await imageService.deleteImage(req.params.filename);
    res.json({
      success: true,
      message: '图片删除成功'
    });
  } catch (error) {
    handleImageError(error, res);
  }
});
```

### 自定义处理

```typescript
// 自定义图片处理
async function customImageProcess(file: Express.Multer.File) {
  const image = await imageService.processImage(file.buffer, {
    resize: {
      width: 800,
      height: 600,
      fit: 'cover'
    },
    format: 'webp',
    quality: 85
  });
  
  return image;
}
```

## 最佳实践

1. **性能优化**
   - 使用适当的图片压缩比例
   - 根据用途生成不同尺寸
   - 实现图片懒加载

2. **安全考虑**
   - 验证文件类型和大小
   - 使用安全的文件名生成
   - 限制上传频率

3. **存储管理**
   - 定期清理未使用文件
   - 实现文件备份策略
   - 监控存储空间使用

## 故障排除

### 常见问题

1. **上传失败**
   - 检查文件大小限制
   - 验证文件格式
   - 确认存储权限

2. **图片处理错误**
   - 检查内存使用
   - 验证图片完整性
   - 查看详细错误日志

3. **访问速度慢**
   - 检查图片压缩设置
   - 考虑使用CDN
   - 优化存储结构

### 错误代码

| 代码 | 描述 | 解决方案 |
|------|------|----------|
| FILE_SIZE_ERROR | 文件大小超限 | 压缩图片或调整限制 |
| FILE_FORMAT_ERROR | 不支持的格式 | 转换为支持的格式 |
| STORAGE_ERROR | 存储错误 | 检查存储配置和权限 |
| PROCESS_ERROR | 处理失败 | 检查图片完整性和内存 |

## 更新日志

### v1.0.0 (2023-12-01)
- 初始版本发布
- 基本的上传和处理功能
- 本地存储支持

### v1.1.0 (2023-12-15)
- 添加WebP支持
- 优化缩略图生成
- 改进错误处理
