
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useFetchData } from './useAdminBase';
import * as adminApi from '@/services/adminApi';
import type { ListingFilters } from '@/types/admin';

/**
 * Use listings hook
 */
export function useListings(filters: ListingFilters = {}) {
  const [page, setPage] = useState(filters.page || 1);
  const limit = filters.limit || 20;

  const query = trpc.admin.getListings.useQuery({
    page,
    limit,
    status: filters.status !== 'all' ? filters.status : undefined
  });

  return {
    data: query.data?.items || [],
    items: query.data?.items || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    total: query.data?.total || 0,
    page,
    limit,
    hasMore: query.data?.hasMore || false,
    totalPages: query.data?.totalPages || 0,
    refetch: async () => { await query.refetch(); },
    nextPage: () => setPage(p => p + 1),
    prevPage: () => setPage(p => Math.max(1, p - 1)),
    goToPage: (p: number) => setPage(p),
  };
}

/**
 * Use single listing hook
 */
export function useListing(id: string) {
  return useFetchData(
    () => adminApi.getListing(id),
    { deps: [id] }
  );
}
