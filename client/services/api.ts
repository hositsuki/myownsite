import api, { ApiResponse } from './axios';

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  tags: string[];
  readTime: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduledPublishDate?: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
}

class BlogAPI {
  private static instance: BlogAPI;
  private constructor() {}

  public static getInstance(): BlogAPI {
    if (!BlogAPI.instance) {
      BlogAPI.instance = new BlogAPI();
    }
    return BlogAPI.instance;
  }

  // 获取所有文章
  async getAllPosts(): Promise<Post[]> {
    try {
      const response = await api.get<ApiResponse<Post[]>>('/posts');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  // 获取单篇文章
  async getPost(slug: string): Promise<Post> {
    try {
      const response = await api.get<ApiResponse<Post>>(`/posts/${slug}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching post ${slug}:`, error);
      throw error;
    }
  }

  // 按标签获取文章
  async getPostsByTag(tag: string): Promise<Post[]> {
    try {
      const response = await api.get<ApiResponse<Post[]>>(`/posts/tags/${tag}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching posts with tag ${tag}:`, error);
      throw error;
    }
  }

  // 搜索文章
  async searchPosts(query: string): Promise<Post[]> {
    try {
      const response = await api.get<ApiResponse<Post[]>>(`/posts/search?q=${encodeURIComponent(query)}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  }

  // 检查管理员状态
  async checkAdminStatus(): Promise<{ isAdmin: boolean }> {
    try {
      const response = await api.get<ApiResponse<{ isAdmin: boolean }>>('/auth/check-admin');
      return response.data.data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return { isAdmin: false };
    }
  }

  // AI生成摘要
  async generateSummary(content: string): Promise<string> {
    try {
      const response = await api.post<ApiResponse<string>>('/ai/generate-summary', { content });
      return response.data.data;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  // AI优化标题
  async optimizeTitle(content: string): Promise<string> {
    try {
      const response = await api.post<ApiResponse<string>>('/ai/optimize-title', { content });
      return response.data.data;
    } catch (error) {
      console.error('Error optimizing title:', error);
      throw error;
    }
  }

  // AI生成标签
  async generateTags(content: string): Promise<string[]> {
    try {
      const response = await api.post<ApiResponse<string[]>>('/ai/generate-tags', { content });
      return response.data.data;
    } catch (error) {
      console.error('Error generating tags:', error);
      throw error;
    }
  }

  // AI改进内容
  async improveContent(content: string): Promise<string> {
    try {
      const response = await api.post<ApiResponse<string>>('/ai/improve-writing', { content });
      return response.data.data;
    } catch (error) {
      console.error('Error improving content:', error);
      throw error;
    }
  }

  // 创建文章
  async createPost(post: Omit<Post, '_id'>): Promise<Post> {
    try {
      const response = await api.post<ApiResponse<Post>>('/posts', post);
      return response.data.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // 更新文章
  async updatePost(id: string, post: Partial<Post>): Promise<Post> {
    try {
      const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, post);
      return response.data.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // 删除文章
  async deletePost(id: string): Promise<void> {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // 上传图片
  async uploadImage(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post<ApiResponse<{ url: string }>>('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}

export const blogAPI = BlogAPI.getInstance();
