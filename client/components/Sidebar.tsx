'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTag, FiFolder, FiClock, FiStar } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Category {
  name: string;
  count: number;
  slug: string;
}

interface Tag {
  name: string;
  count: number;
  slug: string;
}

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
  recentPosts: Array<{ title: string; slug: string; date: string }>;
  popularPosts: Array<{ title: string; slug: string; views: number }>;
}

const Sidebar = ({ categories, tags, recentPosts, popularPosts }: SidebarProps) => {
  const [activeSection, setActiveSection] = useState<string>('categories');

  return (
    <aside className="w-full lg:w-64 space-y-8">
      {/* 分类切换按钮 */}
      <div className="flex space-x-2 p-2 bg-gray-50 rounded-lg">
        {['categories', 'tags'].map((section) => (
          <Button
            key={section}
            variant={activeSection === section ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection(section)}
            className="flex-1 capitalize"
          >
            {section === 'categories' ? '分类' : '标签'}
          </Button>
        ))}
      </div>

      {/* 分类/标签内容 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <ScrollArea className="h-48">
            {activeSection === 'categories' ? (
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="flex items-center space-x-2">
                      <FiFolder className="text-gray-400" />
                      <span>{category.name}</span>
                    </span>
                    <Badge variant="secondary">{category.count}</Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link key={tag.slug} href={`/tag/${tag.slug}`}>
                    <Badge
                      variant="outline"
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      {tag.name} ({tag.count})
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </ScrollArea>
        </motion.div>
      </AnimatePresence>

      {/* 最近文章 */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center space-x-2">
          <FiClock />
          <span>最近文章</span>
        </h3>
        <ul className="space-y-2">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <h4 className="text-sm font-medium line-clamp-1">{post.title}</h4>
                <p className="text-xs text-gray-500">{post.date}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 热门文章 */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center space-x-2">
          <FiStar />
          <span>热门文章</span>
        </h3>
        <ul className="space-y-2">
          {popularPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <h4 className="text-sm font-medium line-clamp-1">{post.title}</h4>
                <p className="text-xs text-gray-500">{post.views} 次阅读</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
