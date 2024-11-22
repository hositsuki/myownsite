import { useState, useCallback } from 'react';
import { useUIStore } from '@/store';

interface UseApiOptions<T> {
  showNotification?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiResult<T, P extends any[]> {
  loading: boolean;
  error: Error | null;
  execute: (...args: P) => Promise<T>;
}

export function useApi<T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiResult<T, P> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useUIStore();

  const execute = useCallback(
    async (...args: P) => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFunction(...args);
        
        if (options.showNotification) {
          addNotification('success', 'Operation successful');
        }
        
        options.onSuccess?.(data);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        
        if (options.showNotification) {
          addNotification('error', error.message || 'Operation failed');
        }
        
        options.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options, addNotification]
  );

  return { loading, error, execute };
}
