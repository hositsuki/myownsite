import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  tags: string[];
  readTime: string;
  slug: string;
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
      const response = await axios.get(`${API_BASE_URL}/posts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  // 获取单篇文章
  async getPost(slug: string): Promise<Post> {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${slug}:`, error);
      throw error;
    }
  }

  // 按标签获取文章
  async getPostsByTag(tag: string): Promise<Post[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/tags/${tag}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts with tag ${tag}:`, error);
      throw error;
    }
  }
}

export const blogAPI = BlogAPI.getInstance();
