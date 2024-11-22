import { User } from './user';
import { Comment } from './comment';
import { BaseModel } from './base';

export interface Post extends BaseModel {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  author: User;
  authorId: string;
  coverImage?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  scheduledPublishDate?: string;
  publishedAt?: string;
  readingTime?: string;
  comments?: Comment[];
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface CreatePostInput {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  authorId: string;
  coverImage?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  scheduledPublishDate?: string;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  slug?: string;
}
