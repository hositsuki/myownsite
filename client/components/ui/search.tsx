'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './input';
import { Button } from './button';
import { Card } from './card';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDebounce } from '@/hooks/use-debounce';
import { blogAPI } from '@/services/api';

export function Search() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const posts = await blogAPI.searchPosts(searchQuery);
      setResults(posts);
    } catch (error) {
      console.error('Error searching posts:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Input
          type="search"
          placeholder="搜索文章..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder:text-white/70 border-white/20 focus:border-white/40"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
          >
            <FaTimes />
          </Button>
        )}
      </div>

      {isOpen && (query || isLoading) && (
        <Card className="absolute top-full mt-2 left-0 right-0 max-h-[80vh] overflow-auto z-50 bg-white shadow-xl">
          <div className="p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((post) => (
                  <button
                    key={post._id}
                    className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => {
                      router.push(`/blog/${post.slug}`);
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <h3 className="font-medium text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {post.excerpt}
                    </p>
                  </button>
                ))}
              </div>
            ) : query ? (
              <p className="text-center text-gray-500 py-8">未找到相关文章</p>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
}
