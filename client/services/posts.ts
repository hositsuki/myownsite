import axios from 'axios';
import { BaseService } from './base';
import { Post, CreatePostInput, UpdatePostInput } from '@/types/post';
import { Comment, CreateCommentInput } from '@/types/comment';
import { AxiosRequestConfig } from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

class PostService extends BaseService<Post> {
  constructor() {
    super(`${API_URL}/posts`);
  }

  // 获取文章列表
  async getPosts(params?: { 
    status?: 'draft' | 'published' | 'scheduled' | 'archived';
    category?: string;
  }) {
    return this.request('get', '', undefined, params);
  }

  // 获取已发布的文章列表
  async getPublishedPosts(params?: any) {
    return this.getPosts({ ...params, status: 'published' });
  }

  // 获取草稿列表
  async getDrafts(params?: any) {
    return this.getPosts({ ...params, status: 'draft' });
  }

  // 通过slug获取文章
  async getBySlug(slug: string, config?: AxiosRequestConfig) {
    return this.request('get', `/slug/${slug}`, undefined, undefined, config);
  }

  // 获取文章
  async getPost(slug: string) {
    return this.getBySlug(slug);
  }

  // 获取相关文章
  async getRelatedPosts(postId: string) {
    return this.request('get', `/${postId}/related`);
  }

  // 获取预览
  async getPreview(id: string, config?: AxiosRequestConfig) {
    return this.request('get', `/preview/${id}`, undefined, undefined, config);
  }

  // 创建预览
  async createPreview(data: CreatePostInput, config?: AxiosRequestConfig) {
    return this.request('post', '/preview', data as Record<string, unknown>, undefined, config);
  }

  // 发布文章
  async publish(id: string, config?: AxiosRequestConfig) {
    return this.request('post', `/${id}/publish`, {}, undefined, config);
  }

  // 取消发布文章
  async unpublish(id: string, config?: AxiosRequestConfig) {
    return this.request('post', `/${id}/unpublish`, {}, undefined, config);
  }

  // 获取文章标签列表
  async getTags() {
    return this.request('get', '/tags');
  }

  // 获取热门文章
  async getPopular(limit: number = 5) {
    return this.request('get', '/popular', undefined, { limit });
  }

  // 增加文章浏览次数
  async incrementViews(id: string) {
    return this.request('post', `/${id}/views`);
  }

  // 创建文章
  async createPost(data: CreatePostInput) {
    return this.create(data as unknown as Omit<Post, keyof BaseModel>);
  }

  // 更新文章
  async updatePost(slug: string, data: UpdatePostInput) {
    return this.request('put', `/slug/${slug}`, data as Record<string, unknown>);
  }

  // 删除文章
  async deletePost(slug: string) {
    return this.request('delete', `/slug/${slug}`);
  }

  // 自动保存
  async autoSave(id: string, data: Partial<Post>, config?: AxiosRequestConfig) {
    return this.request('post', `/${id}/autosave`, data as Record<string, unknown>, undefined, config);
  }

  // 评论相关API
  async getComments(postId: string, config?: AxiosRequestConfig) {
    return this.request('get', `/${postId}/comments`, undefined, undefined, config);
  }

  async createComment(data: CreateCommentInput, config?: AxiosRequestConfig) {
    return this.request('post', `/${data.postId}/comments`, data as Record<string, unknown>, undefined, config);
  }

  async approveComment(postId: string, commentId: string, config?: AxiosRequestConfig) {
    return this.request(
      'post',
      `/${postId}/comments/${commentId}/approve`,
      {},
      undefined,
      config
    );
  }

  async rejectComment(postId: string, commentId: string, config?: AxiosRequestConfig) {
    return this.request(
      'post',
      `/${postId}/comments/${commentId}/reject`,
      {},
      undefined,
      config
    );
  }

  // 分类相关API
  async getCategories() {
    return this.request('get', '/categories');
  }

  // 标签相关API
  async getPostsByTag(tag: string) {
    return this.request('get', `/tags/${tag}`);
  }

  // 状态管理API
  async updatePostStatus(slug: string, data: {
    status: 'draft' | 'published' | 'scheduled' | 'archived';
    scheduledPublishDate?: Date;
  }) {
    return this.request('post', `/slug/${slug}/status`, data as Record<string, unknown>);
  }

  // 历史记录API
  async getPostHistory(slug: string) {
    return this.request('get', `/slug/${slug}/history`);
  }
}

export const postService = new PostService();
