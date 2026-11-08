
import { useFetchData, usePaginatedData } from './useAdminBase';
import * as adminApi from '@/services/adminApi';
import type { ReportFilters } from '@/types/admin';

/**
 * Use reports hook
 */
export function useReports(filters: ReportFilters = {}) {
  return usePaginatedData(
    (f) => adminApi.getReports(f as ReportFilters),
    filters,
    { showToastOnError: true }
  );
}

/**
 * Use single report hook
 */
export function useReport(id: string) {
  return useFetchData(
    () => adminApi.getReport(id),
    { deps: [id] }
  );
}
