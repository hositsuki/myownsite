import { BaseModel } from './base';
import { User } from './user';

export interface Comment extends BaseModel {
  content: string;
  author: User;
  authorId: string;
  postId: string;
  parentId?: string;
  status: 'pending' | 'approved' | 'rejected';
  replies?: Comment[];
  likes: number;
  isEdited?: boolean;
}

export interface CreateCommentInput {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}
