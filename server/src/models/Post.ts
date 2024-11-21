import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  excerpt: string;
  date: Date;
  tags: string[];
  readTime: string;
  slug: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  status: string;
  category: string;
  views: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  comments: Array<{
    author: string;
    content: string;
    date: Date;
    email: string;
    isApproved: boolean;
  }>;
  statusHistory: Array<{
    status: string;
    date: Date;
    updatedBy: string;
  }>;
  scheduledPublishDate?: Date;
  version: number;
  lastModified: Date;
  autoSaveContent?: string;
  autoSaveDate?: Date;
}

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  date: { type: Date, default: Date.now },
  tags: [{ type: String }],
  readTime: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    bio: { type: String, required: true }
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['draft', 'published', 'scheduled', 'archived'], 
    default: 'draft' 
  },
  category: { 
    type: String, 
    required: true 
  },
  views: { 
    type: Number, 
    default: 0 
  },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }]
  },
  comments: [{
    author: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    email: { type: String, required: true },
    isApproved: { type: Boolean, default: false }
  }],
  statusHistory: [{
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    updatedBy: { type: String, required: true }
  }],
  scheduledPublishDate: { type: Date },
  version: { type: Number, default: 1 },
  lastModified: { type: Date, default: Date.now },
  autoSaveContent: { type: String },
  autoSaveDate: { type: Date }
});

// 创建文章摘要
PostSchema.pre('save', function(next) {
  if (!this.excerpt) {
    this.excerpt = this.content.substring(0, 200) + '...';
  }
  next();
});

// 更新版本号和最后修改时间
PostSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.version += 1;
    this.lastModified = new Date();
  }
  next();
});

// 添加状态历史
PostSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
      updatedBy: this.author.name // 这里应该使用实际的用户ID
    });
  }
  next();
});

export default mongoose.model<IPost>('Post', PostSchema);
