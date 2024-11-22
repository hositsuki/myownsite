import api, { ApiResponse, PaginatedResponse as ApiPaginatedResponse } from './axios';
import { AxiosRequestConfig } from 'axios';

export interface BaseModel {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterOperators {
  $eq?: any;
  $ne?: any;
  $gt?: number | string | Date;
  $gte?: number | string | Date;
  $lt?: number | string | Date;
  $lte?: number | string | Date;
  $in?: any[];
  $nin?: any[];
  $regex?: string;
  $options?: string;
}

export type FilterValue = FilterOperators | string | number | boolean | Date | null;

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string | { [key: string]: 'asc' | 'desc' };
  search?: string;
  filter?: Record<string, FilterValue>;
  select?: string[];
  populate?: string[];
}

export interface PaginatedResponse<T> extends Omit<ApiPaginatedResponse<T>, 'data'> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface BulkOperation<T> {
  id: string;
  data: Partial<T>;
}

export interface BulkResponse<T> {
  success: T[];
  failed: Array<{
    id: string;
    error: string;
  }>;
}

export interface QueryOptions {
  select?: string[];
  populate?: string[];
}

export class BaseService<T extends BaseModel> {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  /**
   * 获取列表
   * @param params - 分页和过滤参数
   * @param config - Axios请求配置
   */
  async list(params?: PaginationParams, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> {
    const response = await api.get<ApiResponse<PaginatedResponse<T>>>(
      this.basePath,
      { 
        ...config,
        params: {
          ...params,
          sort: typeof params?.sort === 'object' ? JSON.stringify(params.sort) : params?.sort,
          select: params?.select?.join(' '),
          populate: params?.populate?.join(' ')
        }
      }
    );
    return response.data.data;
  }

  /**
   * 获取单个项目
   * @param id - 项目ID
   * @param options - 查询选项
   * @param config - Axios请求配置
   */
  async get(id: string, options?: QueryOptions, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.get<ApiResponse<T>>(
      `${this.basePath}/${id}`,
      {
        ...config,
        params: {
          select: options?.select?.join(' '),
          populate: options?.populate?.join(' ')
        }
      }
    );
    return response.data.data;
  }

  /**
   * 创建
   * @param data - 创建数据
   * @param config - Axios请求配置
   */
  async create(data: Omit<T, keyof BaseModel>, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.post<ApiResponse<T>>(this.basePath, data, config);
    return response.data.data;
  }

  /**
   * 更新
   * @param id - 项目ID
   * @param data - 更新数据
   * @param config - Axios请求配置
   */
  async update(
    id: string,
    data: Partial<Omit<T, keyof BaseModel>>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await api.put<ApiResponse<T>>(
      `${this.basePath}/${id}`,
      data,
      config
    );
    return response.data.data;
  }

  /**
   * 删除
   * @param id - 项目ID
   * @param config - Axios请求配置
   */
  async delete(id: string, config?: AxiosRequestConfig): Promise<void> {
    await api.delete(`${this.basePath}/${id}`, config);
  }

  /**
   * 批量创建
   * @param data - 批量创建数据
   * @param config - Axios请求配置
   */
  async bulkCreate(
    data: Array<Omit<T, keyof BaseModel>>,
    config?: AxiosRequestConfig
  ): Promise<BulkResponse<T>> {
    const response = await api.post<ApiResponse<BulkResponse<T>>>(
      `${this.basePath}/bulk`,
      data,
      config
    );
    return response.data.data;
  }

  /**
   * 批量更新
   * @param operations - 批量更新操作
   * @param config - Axios请求配置
   */
  async bulkUpdate(
    operations: BulkOperation<Omit<T, keyof BaseModel>>[],
    config?: AxiosRequestConfig
  ): Promise<BulkResponse<T>> {
    const response = await api.put<ApiResponse<BulkResponse<T>>>(
      `${this.basePath}/bulk`,
      operations,
      config
    );
    return response.data.data;
  }

  /**
   * 批量删除
   * @param ids - 要删除的ID列表
   * @param config - Axios请求配置
   */
  async bulkDelete(ids: string[], config?: AxiosRequestConfig): Promise<void> {
    await api.delete(`${this.basePath}/bulk`, {
      ...config,
      data: { ids }
    });
  }

  /**
   * 自定义请求
   * @param method - 请求方法
   * @param path - 请求路径
   * @param data - 请求数据
   * @param params - URL参数
   * @param config - Axios请求配置
   */
  protected async request<R>(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    data?: Record<string, unknown>,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<R> {
    const response = await api.request<ApiResponse<R>>({
      ...config,
      method,
      url: `${this.basePath}${path}`,
      data,
      params,
    });
    return response.data.data;
  }
}
