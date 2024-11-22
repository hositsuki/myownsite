import { AxiosRequestConfig } from 'axios';
import { BaseModel, BaseService, PaginationParams, QueryOptions } from './base';

export interface Post extends BaseModel {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  categories?: string[];
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  scheduledPublishDate?: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
  metadata?: Record<string, any>;
}

export type CreatePostInput = Omit<Post, keyof BaseModel | 'author'> & {
  authorId: string;
};

export type UpdatePostInput = Partial<CreatePostInput>;

export interface PostSearchParams extends PaginationParams {
  status?: Post['status'];
  author?: string;
  tag?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export class PostService extends BaseService<Post> {
  constructor() {
    super('/posts');
  }

  /**
   * 获取文章列表
   * @param params - 搜索参数
   * @param config - Axios请求配置
   */
  async list(params?: PostSearchParams, config?: AxiosRequestConfig) {
    return super.list(params, config);
  }

  /**
   * 获取单篇文章
   * @param id - 文章ID或slug
   * @param options - 查询选项
   * @param config - Axios请求配置
   */
  async get(id: string, options?: QueryOptions, config?: AxiosRequestConfig) {
    return super.get(id, options, config);
  }

  /**
   * 创建文章
   * @param data - 文章数据
   * @param config - Axios请求配置
   */
  async create(data: CreatePostInput, config?: AxiosRequestConfig) {
    return super.create(data, config);
  }

  /**
   * 更新文章
   * @param id - 文章ID
   * @param data - 更新数据
   * @param config - Axios请求配置
   */
  async update(id: string, data: UpdatePostInput, config?: AxiosRequestConfig) {
    return super.update(id, data, config);
  }

  /**
   * 发布文章
   * @param id - 文章ID
   * @param config - Axios请求配置
   */
  async publish(id: string, config?: AxiosRequestConfig) {
    return this.request<Post>('put', `/${id}/publish`, undefined, undefined, config);
  }

  /**
   * 取消发布文章
   * @param id - 文章ID
   * @param config - Axios请求配置
   */
  async unpublish(id: string, config?: AxiosRequestConfig) {
    return this.request<Post>('put', `/${id}/unpublish`, undefined, undefined, config);
  }

  /**
   * 计划发布文章
   * @param id - 文章ID
   * @param scheduledPublishDate - 计划发布时间
   * @param config - Axios请求配置
   */
  async schedule(id: string, scheduledPublishDate: string, config?: AxiosRequestConfig) {
    return this.request<Post>(
      'put',
      `/${id}/schedule`,
      { scheduledPublishDate },
      undefined,
      config
    );
  }

  /**
   * 取消计划发布
   * @param id - 文章ID
   * @param config - Axios请求配置
   */
  async unschedule(id: string, config?: AxiosRequestConfig) {
    return this.request<Post>('put', `/${id}/unschedule`, undefined, undefined, config);
  }

  /**
   * 获取相关文章
   * @param id - 文章ID
   * @param limit - 返回数量
   * @param config - Axios请求配置
   */
  async getRelated(id: string, limit = 3, config?: AxiosRequestConfig) {
    return this.request<Post[]>('get', `/${id}/related`, undefined, { limit }, config);
  }

  /**
   * 获取热门文章
   * @param limit - 返回数量
   * @param config - Axios请求配置
   */
  async getPopular(limit = 5, config?: AxiosRequestConfig) {
    return this.request<Post[]>('get', '/popular', undefined, { limit }, config);
  }

  /**
   * 获取推荐文章
   * @param limit - 返回数量
   * @param config - Axios请求配置
   */
  async getFeatured(limit = 5, config?: AxiosRequestConfig) {
    return this.request<Post[]>('get', '/featured', undefined, { limit }, config);
  }
}
