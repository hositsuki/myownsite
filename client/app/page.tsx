import { FaGithub, FaTwitter, FaEnvelope, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import { blogAPI } from '@/services/api';
import { PostCard } from '@/components/ui/post-card';
import { Button } from '@/components/ui/button';
import { Search } from '@/components/ui/search'; // Import the new Search component

async function getLatestPosts() {
  try {
    const posts = await blogAPI.getAllPosts();
    return posts.slice(0, 6); // 获取最新的6篇文章
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const posts = await blogAPI.getAllPosts();
    const categories = new Map();
    posts.forEach(post => {
      post.tags.forEach(tag => {
        categories.set(tag, (categories.get(tag) || 0) + 1);
      });
    });
    return Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // 获取前10个最常用的标签
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home() {
  const [latestPosts, categories] = await Promise.all([
    getLatestPosts(),
    getCategories(),
  ]);

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
          {/* 搜索框 */}
          <div className="max-w-lg mx-auto mt-8">
            <Search />
          </div>
          {/* 社交链接 */}
          <div className="flex justify-center space-x-6 mt-8">
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
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">知识分类</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(([category, count]) => (
              <Link
                key={category}
                href={`/blog/category/${category}`}
                className="px-6 py-3 rounded-full bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200"
              >
                {category} ({count})
              </Link>
            ))}
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
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/blog">
                查看全部文章
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
