import { useEffect, useRef, useCallback, useState } from 'react';
import { BaseModel, BaseService, PaginatedResponse } from '../services/base';

interface UseInfiniteScrollOptions<T> {
  initialParams?: any;
  threshold?: number;
  onLoadMore?: (data: PaginatedResponse<T>) => void;
  onError?: (error: any) => void;
}

export function useInfiniteScroll<T extends BaseModel>(
  service: BaseService<T>,
  options: UseInfiniteScrollOptions<T> = {}
) {
  const {
    initialParams = {},
    threshold = 100,
    onLoadMore,
    onError,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prev) => prev + 1);
          }
        },
        {
          rootMargin: `${threshold}px`,
        }
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, threshold]
  );

  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await service.list({
        ...initialParams,
        page,
        limit: 10,
      });

      setItems((prev) => [...prev, ...response.items]);
      setHasMore(page < response.totalPages);
      onLoadMore?.(response);
    } catch (err) {
      setError(err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [service, page, initialParams, onLoadMore, onError]);

  useEffect(() => {
    loadMore();
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    loading,
    error,
    items,
    hasMore,
    lastItemRef,
    refresh,
  };
}

// 使用示例：
/*
function PostList() {
  const {
    items: posts,
    loading,
    error,
    lastItemRef,
  } = useInfiniteScroll(postService, {
    initialParams: { status: 'published' },
    onLoadMore: (data) => console.log('Loaded more:', data),
    onError: (error) => console.error('Error:', error),
  });

  return (
    <div>
      {posts.map((post, index) => (
        <div
          key={post._id}
          ref={index === posts.length - 1 ? lastItemRef : undefined}
        >
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
*/
