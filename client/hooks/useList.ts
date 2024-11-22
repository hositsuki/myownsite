import { useState, useCallback, useEffect } from 'react';
import { BaseModel, BaseService, PaginationParams, PaginatedResponse } from '../services/base';

interface UseListOptions<T> {
  initialParams?: PaginationParams;
  autoLoad?: boolean;
  onLoadSuccess?: (data: PaginatedResponse<T>) => void;
  onLoadError?: (error: any) => void;
}

export function useList<T extends BaseModel>(
  service: BaseService<T>,
  options: UseListOptions<T> = {}
) {
  const {
    initialParams = { page: 1, limit: 10 },
    autoLoad = true,
    onLoadSuccess,
    onLoadError,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<PaginatedResponse<T> | null>(null);
  const [params, setParams] = useState<PaginationParams>(initialParams);

  const load = useCallback(
    async (newParams?: PaginationParams) => {
      try {
        setLoading(true);
        setError(null);
        const actualParams = newParams || params;
        const response = await service.list(actualParams);
        setData(response);
        onLoadSuccess?.(response);
        return response;
      } catch (err) {
        setError(err);
        onLoadError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [params, service, onLoadSuccess, onLoadError]
  );

  const refresh = useCallback(() => {
    return load();
  }, [load]);

  const changePage = useCallback(
    (page: number) => {
      const newParams = { ...params, page };
      setParams(newParams);
      return load(newParams);
    },
    [params, load]
  );

  const changePageSize = useCallback(
    (limit: number) => {
      const newParams = { ...params, limit, page: 1 };
      setParams(newParams);
      return load(newParams);
    },
    [params, load]
  );

  const sort = useCallback(
    (sort: string, order: 'asc' | 'desc' = 'asc') => {
      const newParams = { ...params, sort, order };
      setParams(newParams);
      return load(newParams);
    },
    [params, load]
  );

  useEffect(() => {
    if (autoLoad) {
      load();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    loading,
    error,
    data,
    params,
    load,
    refresh,
    changePage,
    changePageSize,
    sort,
  };
}
