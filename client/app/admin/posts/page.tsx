'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

interface Post {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  readTime: number;
  tags: string[];
}

export default function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
      await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
      setPosts(posts.filter(post => post.slug !== slug));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
        <Link 
          href="/admin/posts/new" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          新建文章
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <li key={post.slug}>
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-gray-900 truncate">
                      {post.title}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('zh-CN')} · 阅读时间：{post.readTime} 分钟
                  </p>
                </div>
                <div className="ml-6 flex items-center space-x-4">
                  <Link
                    href={`/admin/posts/edit/${post.slug}`}
                    className="text-gray-600 hover:text-blue-600"
                    title="编辑"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="text-gray-600 hover:text-red-600"
                    title="删除"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
