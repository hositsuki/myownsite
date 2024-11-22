import { Request } from 'express';
import { Types } from 'mongoose';

export interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    username: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  profile?: {
    displayName?: string;
    avatar?: string;
  };
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileUpdate {
  displayName?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  preferences?: {
    emailNotifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
    language?: string;
  };
}
