
import { useFetchData } from './useAdminBase';
import * as adminApi from '@/services/adminApi';
import type { FeaturedEscort, PhotoApproval } from '@/types/admin';

/**
 * Use featured escorts hook
 */
export function useFeaturedEscorts(refetchInterval?: number) {
  return useFetchData<FeaturedEscort[]>(
    () => adminApi.getFeaturedEscorts(),
    { refetchInterval }
  );
}

/**
 * Use hero banner hook
 */
export function useHeroBanner() {
  return useFetchData(
    () => adminApi.getHeroBanner()
  );
}

/**
 * Use pending photos hook
 */
export function usePendingPhotos(refetchInterval?: number) {
  return useFetchData<PhotoApproval[]>(
    () => adminApi.getPendingPhotos(),
    { refetchInterval }
  );
}
