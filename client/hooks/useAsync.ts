import { useState, useCallback } from 'react';

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  onFinally?: () => void;
}

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const { onSuccess, onError, onFinally } = options;

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const data = await asyncFunction(...args);
        setState((prev) => ({ ...prev, data, loading: false }));
        onSuccess?.(data);
        return data;
      } catch (error) {
        setState((prev) => ({ ...prev, error, loading: false }));
        onError?.(error);
        throw error;
      } finally {
        onFinally?.();
      }
    },
    [asyncFunction, onSuccess, onError, onFinally]
  );

  return {
    execute,
    ...state,
    // 重置状态
    reset: useCallback(() => {
      setState({
        data: null,
        loading: false,
        error: null,
      });
    }, []),
  };
}

// 使用示例：
/*
const {
  execute: fetchUser,
  data: user,
  loading,
  error,
} = useAsync(
  (id: string) => api.get(`/users/${id}`),
  {
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error),
  }
);

// 在组件中使用
useEffect(() => {
  fetchUser(userId);
}, [fetchUser, userId]);
*/
