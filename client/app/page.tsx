import { FaGithub, FaTwitter, FaEnvelope, FaRss, FaTags, FaCalendar } from 'react-icons/fa';
import Link from 'next/link';
import { blogAPI } from '@/services/api';

async function getLatestPosts() {
  try {
    const posts = await blogAPI.getAllPosts();
    return posts.slice(0, 3); // 只获取最新的3篇文章
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
}

export default async function Home() {
  const latestPosts = await getLatestPosts();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            雪桜さゆ
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-blue-100">
            Web开发者 / 技术写作者
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/hositsuki"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-200 transition-colors"
            >
              <FaGithub className="w-8 h-8" />
            </a>
            <a
              href="https://twitter.com/DawnSayu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-200 transition-colors"
            >
              <FaTwitter className="w-8 h-8" />
            </a>
            <a
              href="mailto:yukisakuranoyume@gmail.com"
              className="text-white hover:text-blue-200 transition-colors"
            >
              <FaEnvelope className="w-8 h-8" />
            </a>
            <Link
              href="/rss.xml"
              className="text-white hover:text-blue-200 transition-colors"
            >
              <FaRss className="w-8 h-8" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">最新文章</h2>
            <p className="mt-4 text-xl text-gray-600">
              分享Web开发、工程化实践、性能优化等技术心得
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map(post => (
              <article
                key={post._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <FaCalendar className="mr-2" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('zh-CN')}
                        </time>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
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
                </Link>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              查看全部文章
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            订阅更新
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            订阅我的技术文章更新，第一时间获取最新内容
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="输入您的邮箱地址"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                订阅
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">关于我</h2>
            <div className="prose prose-lg mx-auto">
              <p>
                你好！我是雪桜さゆ（Yuki Sakura Sayu），一名热爱技术的Web开发者。
                我专注于前端开发和工程化实践，喜欢探索新技术并分享学习心得。
              </p>
              <p>
                这个博客是我记录技术成长、分享开发经验的地方。
                我会定期更新关于Web开发、性能优化、工程化实践等方面的文章。
                如果你对这些主题感兴趣，欢迎订阅我的更新！
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
