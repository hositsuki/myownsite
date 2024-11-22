import axios from './axios';
import { BaseService, BaseModel } from './base';

export interface Comment extends BaseModel {
  _id: string;
  post: string;
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

class CommentService extends BaseService<Comment> {
  constructor() {
    super('/comments');
  }

  /**
   * 获取文章的评论列表
   */
  async getPostComments(postId: string): Promise<Comment[]> {
    return this.request('get', `/post/${postId}`);
  }

  /**
   * 添加评论
   */
  async createComment(postId: string, content: string): Promise<Comment> {
    return this.request('post', '', { postId, content });
  }

  /**
   * 回复评论
   */
  async replyToComment(commentId: string, content: string): Promise<Comment> {
    return this.request('post', `/${commentId}/reply`, { content });
  }

  /**
   * 点赞评论
   */
  async likeComment(commentId: string): Promise<{ likes: number }> {
    return this.request('post', `/${commentId}/like`);
  }

  /**
   * 编辑评论
   */
  async editComment(commentId: string, content: string): Promise<Comment> {
    return this.request('put', `/${commentId}`, { content });
  }

  /**
   * 删除评论
   */
  async deleteComment(commentId: string): Promise<void> {
    return this.request('delete', `/${commentId}`);
  }
}

export default new CommentService();
