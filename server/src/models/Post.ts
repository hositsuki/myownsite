import { Schema, Types } from 'mongoose';
import { IVersionedDocument, BaseModel, defaultSchemaOptions } from '../core/BaseModel';

export interface IPost extends IVersionedDocument {
  title: string;
  content: string;
  excerpt: string;
  date: Date;
  tags: string[];
  readTime: string;
  slug: string;
  author: Types.ObjectId;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  category: string;
  views: number;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  comments?: Array<{
    author: string;
    content: string;
    date: Date;
    email: string;
    isApproved: boolean;
  }>;
  scheduledPublishDate?: Date;
  statusHistory: Array<{
    status: string;
    date: Date;
    updatedBy: string;
  }>;
  autoSaveContent?: string;
  autoSaveDate?: Date;
  history: Array<{
    content: string;
    date: Date;
    version: number;
  }>;
  lastModified: Date;
}

class PostModel extends BaseModel<IPost> {
  constructor() {
    const schema = new Schema<IPost>({
      title: { type: String, required: true },
      content: { type: String, required: true },
      excerpt: { type: String, required: true },
      date: { type: Date, default: Date.now },
      tags: [{ type: String }],
      readTime: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
      },
      comments: [{
        author: String,
        content: String,
        date: { type: Date, default: Date.now },
        email: String,
        isApproved: { type: Boolean, default: false }
      }],
      scheduledPublishDate: Date,
      statusHistory: [{
        status: { type: String, required: true },
        date: { type: Date, default: Date.now },
        updatedBy: { type: String, required: true }
      }],
      autoSaveContent: { type: String },
      autoSaveDate: { type: Date },
      history: [{
        content: String,
        date: { type: Date, default: Date.now },
        version: Number
      }],
      lastModified: { type: Date, default: Date.now }
    }, defaultSchemaOptions);

    // 添加索引
    this.addIndexes([
      { slug: 1 },
      { status: 1 },
      { category: 1 },
      { tags: 1 },
      { createdAt: -1 }
    ]);

    // 添加审计和版本字段
    this.addAuditFields();
    this.addVersionFields();

    // 添加中间件
    schema.pre('save', function(next) {
      if (!this.excerpt) {
        this.excerpt = this.content.substring(0, 200) + '...';
      }
      next();
    });

    schema.pre('save', function(next) {
      if (this.isModified('content')) {
        this.version += 1;
        this.lastModified = new Date();
      }
      next();
    });

    schema.pre('save', function(next) {
      if (this.isModified('status')) {
        this.statusHistory.push({
          status: this.status,
          date: new Date(),
          updatedBy: this.author.toString() // 转换为字符串
        });
      }
      next();
    });

    super('Post', schema);
  }
}

export default new PostModel().model;
