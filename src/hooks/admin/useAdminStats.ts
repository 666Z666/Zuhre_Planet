
import { trpc } from '@/lib/trpc';
import { useFetchData } from './useAdminBase';
import * as adminApi from '@/services/adminApi';

/**
 * Use platform stats hook
 */
export function usePlatformStats(refetchInterval?: number) {
  const query = trpc.admin.getPlatformStats.useQuery(undefined, {
    refetchInterval: refetchInterval || false
  });

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch: async () => { await query.refetch(); }
  };
}

/**
 * Use revenue stats hook
 */
export function useRevenueStats(period: 'day' | 'week' | 'month' | 'year' = 'month') {
  return useFetchData(
    () => adminApi.getRevenueStats(period),
    { deps: [period] }
  );
}

/**
 * Use user stats hook
 */
export function useUserStats() {
  return useFetchData(
    () => adminApi.getUserStats()
  );
}

/**
 * Use chart data hook
 */
export function useChartData(
  type: 'revenue' | 'users' | 'listings' | 'reviews',
  period: 'day' | 'week' | 'month' | 'year' = 'month'
) {
  return useFetchData(
    () => adminApi.getChartData(type, period),
    { deps: [type, period] }
  );
}
