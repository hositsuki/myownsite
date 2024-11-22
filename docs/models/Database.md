# 数据库模型文档

## 概述

本应用使用 MongoDB 作为主要数据库，使用 Mongoose 作为 ODM（对象文档映射器）。本文档概述了数据库架构设计和模型实现。

## 模型

### 文章模型（Post Model）

代表系统中的一篇博客文章。

```typescript
interface IPost {
  title: string;           // 文章标题
  content: string;         // 文章内容（Markdown格式）
  excerpt?: string;        // 文章摘要
  date: Date;             // 发布日期
  tags: string[];         // 标签列表
  readTime: string;       // 预计阅读时间
  slug: string;           // URL友好的标识符
  author: Types.ObjectId; // 作者ID
  status: string;         // 状态（草稿/已发布/定时发布）
  category?: string;      // 分类
  views: number;          // 访问次数
  version: number;        // 版本号
  lastModified: Date;     // 最后修改时间
  scheduledPublishDate?: Date; // 定时发布时间
  history: {              // 历史版本记录
    content: string;      // 历史版本内容
    date: Date;          // 修改日期
    version: number;      // 版本号
  }[];
}

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: String,
  date: { type: Date, default: Date.now },
  tags: [String],
  readTime: String,
  slug: { type: String, required: true, unique: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft'
  },
  category: String,
  views: { type: Number, default: 0 },
  version: { type: Number, default: 1 },
  lastModified: { type: Date, default: Date.now },
  scheduledPublishDate: Date,
  history: [{
    content: String,
    date: Date,
    version: Number
  }]
});
```

### 评论模型（Comment Model）

代表博客文章的评论。

```typescript
interface IComment {
  post: Types.ObjectId;    // 关联的文章ID
  author: string;          // 评论者名称
  email: string;          // 评论者邮箱
  content: string;        // 评论内容
  date: Date;            // 评论日期
  approved: boolean;      // 是否已审核
  replyTo?: Types.ObjectId; // 回复的评论ID
}

const CommentSchema = new Schema<IComment>({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
  replyTo: { type: Schema.Types.ObjectId, ref: 'Comment' }
});
```

### 图片模型（Image Model）

代表上传的图片。

```typescript
interface IImage {
  filename: string;       // 文件名
  originalName: string;   // 原始文件名
  path: string;          // 存储路径
  thumbnailPath?: string; // 缩略图路径
  size: number;          // 文件大小（字节）
  mimeType: string;      // MIME类型
  uploadDate: Date;      // 上传日期
  uploadedBy?: Types.ObjectId; // 上传者ID
}

const ImageSchema = new Schema<IImage>({
  filename: { type: String, required: true, unique: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  thumbnailPath: String,
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});
```

## 索引

### 文章模型索引

```typescript
// 为slug创建唯一索引
PostSchema.index({ slug: 1 }, { unique: true });

// 为标题创建全文搜索索引
PostSchema.index({ title: 'text', content: 'text', tags: 'text' });

// 为状态和发布日期创建复合索引
PostSchema.index({ status: 1, scheduledPublishDate: 1 });
```

### 评论模型索引

```typescript
// 为文章ID创建索引以加快查询速度
CommentSchema.index({ post: 1 });

// 为审核状态创建索引
CommentSchema.index({ approved: 1 });
```

### 图片模型索引

```typescript
// 为文件名创建唯一索引
ImageSchema.index({ filename: 1 }, { unique: true });

// 为上传日期创建索引
ImageSchema.index({ uploadDate: -1 });
```

## 中间件

### 文章模型中间件

```typescript
// 保存前的处理
PostSchema.pre('save', async function(next) {
  // 如果是新文档或内容被修改
  if (this.isNew || this.isModified('content')) {
    // 生成标签和阅读时间
    const [tags, readTime] = await Promise.all([
      generateTags(this.content),
      estimateReadTime(this.content)
    ]);
    
    this.tags = tags;
    this.readTime = readTime;
  }
  
  // 如果内容被修改且不是新文档
  if (!this.isNew && this.isModified('content')) {
    // 保存历史版本
    this.history.push({
      content: this.content,
      date: new Date(),
      version: this.version
    });
    this.version += 1;
  }
  
  next();
});
```

### 评论模型中间件

```typescript
// 保存前的处理
CommentSchema.pre('save', async function(next) {
  // 如果是新评论，发送通知
  if (this.isNew) {
    await sendCommentNotification(this);
  }
  next();
});
```

## 数据验证

### 文章模型验证

```typescript
PostSchema.path('title').validate(function(title) {
  return title.length >= 3 && title.length <= 200;
}, '标题长度必须在3到200个字符之间');

PostSchema.path('content').validate(function(content) {
  return content.length >= 10;
}, '内容长度必须至少为10个字符');

PostSchema.path('slug').validate(function(slug) {
  return /^[a-z0-9-]+$/.test(slug);
}, 'Slug只能包含小写字母、数字和连字符');
```

### 评论模型验证

```typescript
CommentSchema.path('email').validate(function(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}, '无效的邮箱格式');

CommentSchema.path('content').validate(function(content) {
  return content.length >= 2 && content.length <= 1000;
}, '评论长度必须在2到1000个字符之间');
```

## 虚拟属性

### 文章模型虚拟属性

```typescript
PostSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

PostSchema.virtual('readingTime').get(function() {
  return `${this.readTime} 分钟阅读`;
});
```

### 评论模型虚拟属性

```typescript
CommentSchema.virtual('isReply').get(function() {
  return !!this.replyTo;
});
```

## 最佳实践

1. 始终使用 TypeScript 接口以确保类型安全
2. 实现适当的数据验证
3. 使用中间件处理复杂操作
4. 创建适当的索引以优化查询性能
5. 正确处理错误
6. 对复杂操作使用事务
7. 实现适当的数据清理

## 使用示例

```typescript
// 创建新文章
const post = new Post({
  title: '我的新文章',
  content: '# 你好世界\n\n这是我的第一篇文章。',
  slug: 'my-new-post',
  author: userId
});

await post.save();

// 使用分页查找文章
const posts = await Post.find({ status: 'published' })
  .sort({ date: -1 })
  .skip(page * limit)
  .limit(limit)
  .select('title excerpt date tags readTime slug');

// 更新文章
await Post.findOneAndUpdate(
  { slug },
  { $set: { title, content } },
  { new: true }
);

// 删除文章
await Post.findOneAndDelete({ slug });
