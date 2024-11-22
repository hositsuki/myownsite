import { useState, useCallback } from 'react';
import { BaseModel, BaseService } from '../services/base';

interface UseFormOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  transform?: (values: any) => any;
}

export function useForm<T extends BaseModel>(
  service: BaseService<T>,
  options: UseFormOptions<T> = {}
) {
  const { onSuccess, onError, transform } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const submit = useCallback(
    async (values: any, id?: string) => {
      try {
        setLoading(true);
        setError(null);

        const transformedValues = transform ? transform(values) : values;
        let response: T;

        if (id) {
          response = await service.update(id, transformedValues);
        } else {
          response = await service.create(transformedValues);
        }

        onSuccess?.(response);
        return response;
      } catch (err) {
        setError(err);
        onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, transform, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    submit,
    reset,
  };
}
