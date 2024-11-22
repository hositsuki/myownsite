import { Types } from 'mongoose';
import { ApiError } from './ApiError';
import { logger } from '../utils/logger';
import { cacheService } from '../services/cache';

export class BaseService {
  protected static async wrapDbOperation<T>(operation: () => Promise<T>, errorMessage: string): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      logger.error(`${errorMessage}:`, error);
      throw error;
    }
  }

  protected static validateObjectId(id: string, entityName: string): Types.ObjectId {
    try {
      return new Types.ObjectId(id);
    } catch (error) {
      throw new ApiError(400, `Invalid ${entityName} ID`);
    }
  }

  protected static async checkOwnership<T extends { authorId: Types.ObjectId }>(
    entity: T | null,
    userId: string,
    entityName: string
  ): Promise<T> {
    if (!entity) {
      throw new ApiError(404, `${entityName} not found`);
    }

    if (entity.authorId.toString() !== userId) {
      throw new ApiError(403, `No permission to modify this ${entityName}`);
    }

    return entity;
  }

  protected static async getFromCache<T>(
    key: string,
    fetchData: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await cacheService.get<T>(key);
    if (cached) {
      return cached;
    }

    const data = await fetchData();
    await cacheService.set(key, data, ttl);
    return data;
  }

  protected static async clearCache(key: string): Promise<void> {
    await cacheService.del(key);
  }

  protected static async clearCachePattern(pattern: string): Promise<void> {
    await cacheService.delPattern(pattern);
  }
}
