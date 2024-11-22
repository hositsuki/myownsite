import { AxiosRequestConfig } from 'axios';
import { BaseModel, BaseService, PaginationParams, QueryOptions } from './base';
import api from './axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

export interface User extends BaseModel {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  preferences?: {
    emailNotifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
    language?: string;
  };
  metadata?: Record<string, any>;
}

export type CreateUserInput = Omit<User, keyof BaseModel> & {
  password: string;
};

export type UpdateUserInput = Partial<Omit<User, keyof BaseModel>>;

export interface UserSearchParams extends PaginationParams {
  role?: User['role'];
  status?: User['status'];
  email?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordInput {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export class UserService extends BaseService<User> {
  protected basePath: string;

  constructor() {
    super(`${API_URL}/users`);
    this.basePath = `${API_URL}/users`;
  }

  async list(params?: UserSearchParams, config?: AxiosRequestConfig) {
    return super.list(params, config);
  }

  async get(id: string, options?: QueryOptions, config?: AxiosRequestConfig) {
    return super.get(id, options, config);
  }

  async create(data: CreateUserInput, config?: AxiosRequestConfig) {
    return super.create(data, config);
  }

  async update(id: string, data: UpdateUserInput, config?: AxiosRequestConfig) {
    return super.update(id, data, config);
  }

  async getCurrentUser(config?: AxiosRequestConfig) {
    return this.request('get', '/me', undefined, undefined, config);
  }

  async updateCurrentUser(data: UpdateUserInput, config?: AxiosRequestConfig) {
    return this.request('put', '/me', data as Record<string, unknown>, undefined, config);
  }

  async changePassword(data: ChangePasswordInput, config?: AxiosRequestConfig) {
    return this.request('post', '/change-password', data as Record<string, unknown>, undefined, config);
  }

  async requestPasswordReset(email: string, config?: AxiosRequestConfig) {
    return this.request('post', '/forgot-password', { email }, undefined, config);
  }

  async resetPassword(data: ResetPasswordInput, config?: AxiosRequestConfig) {
    return this.request('post', '/reset-password', data as Record<string, unknown>, undefined, config);
  }

  async activate(id: string, config?: AxiosRequestConfig) {
    return this.request('post', `/${id}/activate`, {}, undefined, config);
  }

  async deactivate(id: string, config?: AxiosRequestConfig) {
    return this.request('post', `/${id}/deactivate`, {}, undefined, config);
  }

  async ban(id: string, config?: AxiosRequestConfig) {
    return this.request('post', `/${id}/ban`, {}, undefined, config);
  }

  async unban(id: string, config?: AxiosRequestConfig) {
    return this.request('post', `/${id}/unban`, {}, undefined, config);
  }

  async updateProfile(data: UpdateUserInput, config?: AxiosRequestConfig) {
    return this.request('put', '/profile', data as Record<string, unknown>, undefined, config);
  }

  async verifyResetToken(token: string, config?: AxiosRequestConfig) {
    return this.request('post', '/verify-reset-token', { token }, undefined, config);
  }
}

export const userService = new UserService();
