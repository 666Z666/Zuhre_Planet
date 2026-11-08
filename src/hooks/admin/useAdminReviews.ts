
import { useFetchData, usePaginatedData } from './useAdminBase';
import * as adminApi from '@/services/adminApi';
import type { ReviewFilters } from '@/types/admin';

/**
 * Use reviews hook
 */
export function useReviews(filters: ReviewFilters = {}) {
  return usePaginatedData(
    (f) => adminApi.getReviews(f as ReviewFilters),
    filters,
    { showToastOnError: true }
  );
}

/**
 * Use single review hook
 */
export function useReview(id: string) {
  return useFetchData(
    () => adminApi.getReview(id),
    { deps: [id] }
  );
}
