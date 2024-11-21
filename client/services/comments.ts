import axios from './axios';

export interface Comment {
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

export const getPostComments = async (postId: string): Promise<Comment[]> => {
  const response = await axios.get(`/comments/post/${postId}`);
  return response.data;
};

export const createComment = async (postId: string, content: string): Promise<Comment> => {
  const response = await axios.post('/comments', { postId, content });
  return response.data;
};

export const replyToComment = async (commentId: string, content: string): Promise<Comment> => {
  const response = await axios.post(`/comments/${commentId}/reply`, { content });
  return response.data;
};

export const likeComment = async (commentId: string): Promise<{ likes: number }> => {
  const response = await axios.post(`/comments/${commentId}/like`);
  return response.data;
};

export const editComment = async (commentId: string, content: string): Promise<Comment> => {
  const response = await axios.put(`/comments/${commentId}`, { content });
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await axios.delete(`/comments/${commentId}`);
};
