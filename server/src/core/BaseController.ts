import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from './ApiResponse';
import { ApiError } from './ApiError';
import { logger } from '../utils/logger';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export class BaseController {
  /**
   * 包装异步请求处理器，统一处理错误
   * @param handler 异步请求处理函数
   */
  protected static wrapAsync(handler: AsyncRequestHandler) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next);
      } catch (error) {
        logger.error(`Error in ${handler.name}:`, error);
        next(error);
      }
    };
  }

  /**
   * 验证请求参数是否存在
   * @param params 参数对象
   * @param requiredFields 必需的字段数组
   */
  protected static validateRequiredParams(params: Record<string, any>, requiredFields: string[]) {
    const missingFields = requiredFields.filter(field => !params[field]);
    if (missingFields.length > 0) {
      throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  /**
   * 发送成功响应
   * @param res Response 对象
   * @param data 响应数据
   * @param message 可选的成功消息
   */
  protected static sendSuccess(res: Response, data: any, message?: string) {
    res.json(ApiResponse.success(data, message));
  }

  /**
   * 发送文件响应
   * @param res Response 对象
   * @param buffer 文件数据
   * @param contentType 内容类型
   */
  protected static sendFile(res: Response, buffer: Buffer, contentType: string) {
    res.contentType(contentType);
    res.send(buffer);
  }

  /**
   * 检查请求参数中的 ID 是否有效
   * @param id ID 字符串
   * @param paramName 参数名称
   */
  protected static validateId(id: string, paramName: string = 'id') {
    if (!id || typeof id !== 'string') {
      throw new ApiError(400, `Invalid ${paramName}`);
    }
  }

  /**
   * 检查分页参数
   * @param page 页码
   * @param limit 每页限制
   * @returns 标准化的分页参数
   */
  protected static validatePagination(page?: number, limit?: number) {
    const validPage = Math.max(1, Number(page) || 1);
    const validLimit = Math.min(100, Math.max(1, Number(limit) || 10));
    return { page: validPage, limit: validLimit };
  }

  /**
   * 检查排序参数
   * @param sort 排序字段
   * @param order 排序顺序
   * @param allowedFields 允许的排序字段
   * @returns 标准化的排序参数
   */
  protected static validateSort(
    sort?: string,
    order?: 'asc' | 'desc',
    allowedFields: string[] = []
  ) {
    if (!sort || !allowedFields.includes(sort)) {
      return { sort: allowedFields[0], order: 'desc' };
    }
    return { sort, order: order === 'asc' ? 'asc' : 'desc' };
  }
}
