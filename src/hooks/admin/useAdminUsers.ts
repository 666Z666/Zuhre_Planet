
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useFetchData } from './useAdminBase';
import * as adminApi from '@/services/adminApi';
import type { UserFilters } from '@/types/admin';

/**
 * Use users list hook
 */
export function useUsers(filters: UserFilters = {}) {
  const [page, setPage] = useState(filters.page || 1);
  const limit = filters.limit || 20;

  const query = trpc.admin.getUsers.useQuery({
    page,
    limit,
    search: filters.search
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
 * Use single user hook
 */
export function useUser(id: string) {
  return useFetchData(
    () => adminApi.getUser(id),
    { deps: [id] }
  );
}
