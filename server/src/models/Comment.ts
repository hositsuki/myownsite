import { Schema, Types } from 'mongoose';
import { IVersionedDocument, BaseModel, defaultSchemaOptions } from '../core/BaseModel';

export interface IComment extends IVersionedDocument {
  postId: Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  content: string;
  likes: number;
  replies: mongoose.Types.ObjectId[];
  parentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
}

class CommentModel extends BaseModel<IComment> {
  constructor() {
    const schema = new Schema<IComment>({
      postId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true,
        index: true 
      },
      authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 2000
      },
      likes: { 
        type: Number, 
        default: 0 
      },
      replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }],
      parentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Comment',
        index: true
      },
      isEdited: { 
        type: Boolean, 
        default: false 
      }
    }, defaultSchemaOptions);

    // 添加索引
    this.addIndexes([
      { postId: 1, createdAt: -1 },
      { parentId: 1, createdAt: -1 }
    ]);

    // 添加审计和版本字段
    this.addAuditFields();
    this.addVersionFields();

    // 添加中间件
    schema.pre('save', function(next) {
      if (this.isModified('content')) {
        this.isEdited = true;
      }
      next();
    });

    super('Comment', schema);
  }
}

export default new CommentModel().model;
