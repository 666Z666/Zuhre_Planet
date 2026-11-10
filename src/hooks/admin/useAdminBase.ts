
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import * as adminApi from '@/services/adminApi';
import type { PaginatedResponse } from '@/types/admin';

/**
 * Use fetch data hook with loading, error, and refetch
 */
export interface UseFetchDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Generic data fetching hook
 */
export function useFetchData<T>(
  fetchFn: () => Promise<adminApi.ApiResponse<T>>,
  options: {
    refetchInterval?: number;
    refetchOnWindowFocus?: boolean;
    showToastOnError?: boolean;
    onSuccess?: (data: T) => void;
    deps?: unknown[];
  } = {}
): UseFetchDataResult<T> {
  const {
    refetchInterval,
    refetchOnWindowFocus = true,
    showToastOnError = true,
    onSuccess,
    deps = [],
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasMountedRef = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchFn();

      if (response.success && response.data) {
        setData(response.data);
        onSuccess?.(response.data);
      } else if (response.error) {
        setError(response.error.message);
        if (showToastOnError) {
          toast.error(response.error.message);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bir hata oluştu';
      setError(message);
      if (showToastOnError) {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, showToastOnError, onSuccess]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      fetchData();
      hasMountedRef.current = true;
    }
  }, [fetchData, ...deps]);

  // Auto refetch on interval
  useEffect(() => {
    if (refetchInterval && hasMountedRef.current) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [refetchInterval, fetchData]);

  // Refetch on window focus
  useEffect(() => {
    if (refetchOnWindowFocus && hasMountedRef.current) {
      const handleFocus = () => fetchData();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [refetchOnWindowFocus, fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Use paginated data hook
 */
export interface UsePaginatedDataResult<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
  refetch: () => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  /** Aliased as data for backward compatibility */
  items: T[];
}

export function usePaginatedData<T>(
  fetchFn: (filters: Record<string, unknown>) => Promise<adminApi.ApiResponse<PaginatedResponse<T>>>,
  initialFilters: Record<string, unknown> = {},
  options: {
    refetchInterval?: number;
    showToastOnError?: boolean;
  } = {}
): UsePaginatedDataResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialFilters.page as number || 1);
  const [limit] = useState(initialFilters.limit as number || 20);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [filters] = useState(initialFilters);
  const hasMountedRef = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchFn({ ...filters, page, limit });

      if (response.success && response.data) {
        setData(response.data.items);
        setTotal(response.data.total);
        setHasMore(response.data.hasMore);
        setTotalPages(response.data.totalPages);
      } else if (response.error) {
        setError(response.error.message);
        if (options.showToastOnError) {
          toast.error(response.error.message);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bir hata oluştu';
      setError(message);
      if (options.showToastOnError) {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, filters, page, limit, options.showToastOnError]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      fetchData();
      hasMountedRef.current = true;
    }
  }, [fetchData]);

  // Auto refetch
  useEffect(() => {
    if (options.refetchInterval && hasMountedRef.current) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [options.refetchInterval, fetchData]);

  const nextPage = useCallback(() => {
    if (hasMore) {
      setPage(p => p + 1);
    }
  }, [hasMore]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  return {
    data,
    items: data,
    isLoading,
    error,
    total,
    page,
    limit,
    hasMore,
    totalPages,
    refetch: fetchData,
    nextPage,
    prevPage,
    goToPage,
  };
}
