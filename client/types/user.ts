import { BaseModel } from './base';

export interface User extends BaseModel {
  name: string;
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  lastLoginAt?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    emailNotifications?: boolean;
    language?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateUserInput {
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    emailNotifications?: boolean;
    language?: string;
  };
}
