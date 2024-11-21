import { FaCalendar, FaTags } from 'react-icons/fa';
import { blogAPI } from '@/services/api';
import { notFound } from 'next/navigation';

// 这里应该从后端API获取文章详情
async function getPost(slug: string) {
  try {
    return await blogAPI.getPost(slug);
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Article Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center justify-center space-x-6 text-gray-500">
            <div className="flex items-center">
              <FaCalendar className="mr-2" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('zh-CN')}
              </time>
            </div>
            <span>{post.readTime}</span>
          </div>
          <div className="mt-6 flex justify-center flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                <FaTags className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg prose-blue mx-auto">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: post.content.replace(
                /!\[(.*?)\]\((.*?)\)/g, 
                (match, alt, src) => `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto;" crossorigin="anonymous" />`
              ) 
            }} 
          />
        </div>

        {/* Advertisement Space */}
        <div className="mt-16 p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center text-gray-500">
            广告位置
          </div>
        </div>

        {/* Author Info */}
        <div className="mt-16 p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-16 w-16 rounded-full"
                src={post.author.avatar}
                alt={post.author.name}
              />
            </div>
            <div className="ml-6">
              <p className="text-sm font-medium text-gray-900">
                作者：{post.author.name}
              </p>
              <p className="text-sm text-gray-500">
                {post.author.bio}
              </p>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
