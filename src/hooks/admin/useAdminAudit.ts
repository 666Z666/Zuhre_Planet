
import { usePaginatedData } from './useAdminBase';
import * as adminApi from '@/services/adminApi';
import type { AuditLogFilters } from '@/types/admin';

/**
 * Use audit logs hook
 */
export function useAuditLogs(filters: AuditLogFilters = {}) {
  return usePaginatedData(
    (f) => adminApi.getAuditLogs(f as AuditLogFilters),
    filters
  );
}
