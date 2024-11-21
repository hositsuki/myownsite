import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// 文章相关API
export const getPosts = async (params?: { 
  status?: 'draft' | 'published' | 'scheduled' | 'archived'; 
  category?: string;
}) => {
  const response = await axios.get(`${API_URL}/posts`, { params });
  return response.data;
};

export const getPost = async (slug: string) => {
  const response = await axios.get(`${API_URL}/posts/${slug}`);
  return response.data;
};

export const createPost = async (data: any) => {
  const response = await axios.post(`${API_URL}/posts`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const updatePost = async (slug: string, data: any) => {
  const response = await axios.put(`${API_URL}/posts/${slug}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const deletePost = async (slug: string) => {
  const response = await axios.delete(`${API_URL}/posts/${slug}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// 预览相关API
export const createPreview = async (data: any) => {
  const response = await axios.post(`${API_URL}/preview`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const getPreview = async (previewId: string) => {
  const response = await axios.get(`${API_URL}/preview/${previewId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// 评论相关API
export const addComment = async (slug: string, data: any) => {
  const response = await axios.post(`${API_URL}/posts/${slug}/comments`, data);
  return response.data;
};

export const approveComment = async (slug: string, commentId: string) => {
  const response = await axios.patch(
    `${API_URL}/posts/${slug}/comments/${commentId}`,
    { isApproved: true },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

// 分类相关API
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/posts/categories`);
  return response.data;
};

// 标签相关API
export const getPostsByTag = async (tag: string) => {
  const response = await axios.get(`${API_URL}/posts/tags/${tag}`);
  return response.data;
};

// 状态管理API
export const updatePostStatus = async (slug: string, data: { 
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  scheduledPublishDate?: Date;
}) => {
  const response = await axios.patch(`${API_URL}/posts/${slug}/status`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const getPostHistory = async (slug: string) => {
  const response = await axios.get(`${API_URL}/posts/${slug}/history`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// 自动保存API
export const autoSavePost = async (slug: string, content: string) => {
  const response = await axios.post(`${API_URL}/posts/${slug}/autosave`, 
    { content },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

// 相关文章API
export const getRelatedPosts = async (postId: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}/related`);
    return response.data;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
};
