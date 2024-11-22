import { notFound } from 'next/navigation';
import { blogAPI } from '@/services/api';
import { PostEditClient } from './PostEditClient';

interface PostEditPageProps {
  params: {
    id: string;
  };
}

async function getPost(id: string) {
  if (id === 'new') return null;
  
  try {
    return await blogAPI.getPost(id);
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function PostEditPage({ params }: PostEditPageProps) {
  const post = params.id === 'new' ? null : await getPost(params.id);

  if (params.id !== 'new' && !post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {post ? '编辑文章' : '新建文章'}
          </h1>
        </div>

        <PostEditClient post={post} />
      </div>
    </div>
  );
}
