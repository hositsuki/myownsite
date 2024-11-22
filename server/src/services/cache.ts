import { createClient } from 'redis';
import { IPost } from '../models/Post';
import { Types } from 'mongoose';

class CacheService {
  private client;
  private readonly DEFAULT_EXPIRATION = 3600; // 1 hour in seconds

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.connect();
  }

  async getPost(id: string): Promise<IPost | null> {
    const cachedPost = await this.client.get(`post:${id}`);
    if (cachedPost) {
      return JSON.parse(cachedPost);
    }
    return null;
  }

  async setPost(id: string, post: IPost): Promise<void> {
    await this.client.set(
      `post:${id}`,
      JSON.stringify(post),
      { EX: this.DEFAULT_EXPIRATION }
    );
  }

  async invalidatePost(id: string): Promise<void> {
    await this.client.del(`post:${id}`);
  }

  async getPostList(): Promise<IPost[] | null> {
    const cachedPosts = await this.client.get('posts:list');
    if (cachedPosts) {
      return JSON.parse(cachedPosts);
    }
    return null;
  }

  async setPostList(posts: IPost[]): Promise<void> {
    await this.client.set(
      'posts:list',
      JSON.stringify(posts),
      { EX: this.DEFAULT_EXPIRATION }
    );
  }

  async invalidatePostList(): Promise<void> {
    await this.client.del('posts:list');
  }

  async warmupCache(posts: IPost[]): Promise<void> {
    const pipeline = this.client.multi();
    
    for (const post of posts) {
      pipeline.set(
        `post:${post._id}`,
        JSON.stringify(post),
        { EX: this.DEFAULT_EXPIRATION }
      );
    }

    await pipeline.exec();
  }
}

export const cacheService = new CacheService();
