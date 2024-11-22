import { Model, Document, FilterQuery, UpdateQuery, Types } from 'mongoose';
import { IBaseDocument } from './BaseModel';

export class BaseRepository<T extends IBaseDocument> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    return await entity.save();
  }

  async findById(id: Types.ObjectId): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    return await this.model.find(filter);
  }

  async update(id: Types.ObjectId, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: Types.ObjectId): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const count = await this.model.countDocuments(filter);
    return count > 0;
  }

  async findWithPagination(
    filter: FilterQuery<T>,
    page: number = 1,
    limit: number = 10,
    sort: any = { createdAt: -1 }
  ): Promise<{ items: T[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit),
      this.model.countDocuments(filter)
    ]);

    return {
      items,
      total,
      pages: Math.ceil(total / limit)
    };
  }

  async bulkCreate(data: Partial<T>[]): Promise<T[]> {
    return await this.model.insertMany(data);
  }

  async bulkUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<{ matched: number; modified: number }> {
    const result = await this.model.updateMany(filter, update);
    return {
      matched: result.matchedCount,
      modified: result.modifiedCount
    };
  }

  async bulkDelete(filter: FilterQuery<T>): Promise<number> {
    const result = await this.model.deleteMany(filter);
    return result.deletedCount;
  }

  async findWithPopulate(
    filter: FilterQuery<T>,
    populate: string | string[]
  ): Promise<T[]> {
    const query = this.model.find(filter);
    if (Array.isArray(populate)) {
      populate.forEach(field => query.populate(field));
    } else {
      query.populate(populate);
    }
    return await query;
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return await this.model.aggregate(pipeline);
  }
}
