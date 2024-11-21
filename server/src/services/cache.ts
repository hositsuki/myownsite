import { createClient } from 'redis';
import { Post } from '../models/Post';

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

    async getPost(id: string): Promise<Post | null> {
        const cachedPost = await this.client.get(`post:${id}`);
        if (cachedPost) {
            return JSON.parse(cachedPost);
        }
        return null;
    }

    async setPost(id: string, post: Post): Promise<void> {
        await this.client.set(
            `post:${id}`,
            JSON.stringify(post),
            { EX: this.DEFAULT_EXPIRATION }
        );
    }

    async invalidatePost(id: string): Promise<void> {
        await this.client.del(`post:${id}`);
    }

    async getPostList(page: number, limit: number): Promise<Post[] | null> {
        const cachedPosts = await this.client.get(`posts:${page}:${limit}`);
        if (cachedPosts) {
            return JSON.parse(cachedPosts);
        }
        return null;
    }

    async setPostList(page: number, limit: number, posts: Post[]): Promise<void> {
        await this.client.set(
            `posts:${page}:${limit}`,
            JSON.stringify(posts),
            { EX: this.DEFAULT_EXPIRATION }
        );
    }

    async invalidatePostList(): Promise<void> {
        const keys = await this.client.keys('posts:*');
        if (keys.length > 0) {
            await this.client.del(keys);
        }
    }

    async warmupCache(posts: Post[]): Promise<void> {
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
