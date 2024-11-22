'use client';

import { FaTags, FaCalendar, FaClock } from 'react-icons/fa';
import Link from 'next/link';
import { Card } from './card';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: {
    _id: string;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    tags: string[];
    coverImage?: string;
    readingTime?: string;
  };
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  return (
    <Card className={cn("group overflow-hidden hover:shadow-lg transition-all duration-300", className)}>
      <Link href={`/blog/${post.slug}`}>
        <div className="relative">
          {post.coverImage ? (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600" />
          )}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-6 relative">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <FaCalendar className="mr-2" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('zh-CN')}
              </time>
            </div>
            {post.readingTime && (
              <div className="flex items-center">
                <FaClock className="mr-2" />
                <span>{post.readingTime}</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200"
              >
                <FaTags className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </Card>
  );
}
