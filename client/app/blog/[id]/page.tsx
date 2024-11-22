import { FaCalendar, FaTags } from 'react-icons/fa';
import { blogAPI } from '@/services/api';
import { notFound } from 'next/navigation';
import { Advertisement } from '@/components/Advertisement';
import { SocialShare } from '@/components/SocialShare';

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

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${params.id}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Article Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {post.excerpt}
          </p>
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
          <div className="mt-6">
            <SocialShare
              url={currentUrl}
              title={post.title}
              description={post.excerpt || ''}
              className="justify-center"
            />
          </div>
        </div>

        {/* Top Advertisement */}
        <div className="mb-8">
          <Advertisement
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_TOP || ''}
            format="horizontal"
            className="mx-auto max-w-3xl"
          />
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

        {/* Bottom Advertisement */}
        <div className="mt-8 mb-16">
          <Advertisement
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_BOTTOM || ''}
            format="horizontal"
            className="mx-auto max-w-3xl"
          />
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

        {/* Share Again */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            分享这篇文章
          </h3>
          <SocialShare
            url={currentUrl}
            title={post.title}
            description={post.excerpt || ''}
            className="justify-center"
          />
        </div>
      </article>

      {/* Sidebar Advertisement (Fixed Position) */}
      <div className="hidden xl:block fixed top-1/4 right-8">
        <Advertisement
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_SIDEBAR || ''}
          format="vertical"
          className="w-[300px]"
        />
      </div>
    </main>
  );
}
