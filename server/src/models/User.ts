import { Schema, Types } from 'mongoose';
import { IVersionedDocument, BaseModel, defaultSchemaOptions } from '../core/BaseModel';
import bcrypt from 'bcrypt';

export interface IUser extends IVersionedDocument {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  profile?: {
    displayName: string;
    avatar: string;
    bio: string;
    website: string;
    social: {
      twitter?: string;
      github?: string;
      linkedin?: string;
    };
  };
  preferences?: {
    emailNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

class UserModel extends BaseModel<IUser> {
  constructor() {
    const schema = new Schema<IUser>({
      username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
      },
      email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
      },
      password: { 
        type: String, 
        required: true,
        minlength: 8 
      },
      role: { 
        type: String, 
        required: true, 
        enum: ['admin', 'editor', 'user'],
        default: 'user'
      },
      isActive: { 
        type: Boolean, 
        default: true 
      },
      lastLogin: { 
        type: Date 
      },
      profile: {
        displayName: { type: String, trim: true },
        avatar: String,
        bio: { type: String, maxlength: 500 },
        website: String,
        social: {
          twitter: String,
          github: String,
          linkedin: String
        }
      },
      preferences: {
        emailNotifications: { type: Boolean, default: true },
        theme: { 
          type: String, 
          enum: ['light', 'dark', 'system'],
          default: 'system'
        },
        language: { type: String, default: 'en' }
      },
      resetPasswordToken: String,
      resetPasswordExpires: Date
    }, defaultSchemaOptions);

    // 添加索引
    this.addIndexes([
      { username: 1 },
      { email: 1 },
      { role: 1 },
      { isActive: 1 }
    ]);

    // 添加审计和版本字段
    this.addAuditFields();
    this.addVersionFields();

    // 密码哈希中间件
    schema.pre('save', async function(next) {
      if (!this.isModified('password')) {
        return next();
      }

      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (error) {
        next(error as Error);
      }
    });

    // 密码验证方法
    schema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
      try {
        return await bcrypt.compare(candidatePassword, this.password);
      } catch (error) {
        throw error;
      }
    };

    super('User', schema);
  }
}

export default new UserModel().model;
