/**
 * Admin Data Hooks
 *
 * Custom React hooks for fetching and managing admin data.
 * Provides loading states, error handling, and caching.
 *
 * @module hooks/useAdminData
 * @category Hooks - Admin
 *
 * Features:
 * - Automatic loading states
 * - Error handling with toast notifications
 * - Data caching with cache invalidation
 * - Automatic refetching on interval
 * - Pagination support
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { captureClientError } from '@/lib/monitoring/sentry';
import type {
  SiteSettings,
  NavigationItem,
  Page,
  PhotoApproval,
  FeaturedEscort,
  UserFilters,
  ListingFilters,
  ReviewFilters,
  ReportFilters,
  AuditLogFilters,
  PaginatedResponse,
} from '@/types/admin';
import * as adminApi from '@/services/adminApi';

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC DATA FETCHING HOOK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use fetch data hook with loading, error, and refetch
 */
interface UseFetchDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Generic data fetching hook
 */
function useFetchData<T>(
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
  // useFetchData, çağıran taraftan gelen değişken sayıda bağımlılığı destekliyor.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

function toIsoString(value: string | Date | null | undefined) {
  if (!value) {
    return new Date().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATED DATA HOOK
// ─────────────────────────────────────────────────────────────────────────────

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
  const [limit, _setLimit] = useState(initialFilters.limit as number || 20);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, _setFilters] = useState(initialFilters);
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

// ─────────────────────────────────────────────────────────────────────────────
// STATS & OVERVIEW HOOKS
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// USERS HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use users list hook
 */
export function useUsers(filters: UserFilters = {}, search?: string) {
  const [page, setPage] = useState(filters.page || 1);
  const limit = filters.limit || 20;

  useEffect(() => {
    setPage(filters.page || 1);
  }, [filters.page]);

  const query = trpc.admin.getUsers.useQuery({
    page,
    limit,
    search: search || filters.search,
    role: filters.role !== 'all' ? filters.role : undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
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
    setPage,
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

// ─────────────────────────────────────────────────────────────────────────────
// LISTINGS HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use listings hook
 */
export function useListings(filters: ListingFilters = {}, search?: string) {
  const [page, setPage] = useState(filters.page || 1);
  const limit = filters.limit || 20;

  useEffect(() => {
    setPage(filters.page || 1);
  }, [filters.page]);

  const query = trpc.admin.getListings.useQuery({
    page,
    limit,
    search: search || filters.search,
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
    setPage,
    nextPage: () => setPage(p => p + 1),
    prevPage: () => setPage(p => Math.max(1, p - 1)),
    goToPage: (p: number) => setPage(p),
  };
}

// Dummy export to avoid truncation issues if any
export function useListingsOld(filters: ListingFilters = {}) {
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

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use reviews hook
 */
export function useReviews(filters: ReviewFilters = {}) {
  const [page, setPage] = useState(filters.page || 1);
  const limit = filters.limit || 20;

  useEffect(() => {
    setPage(filters.page || 1);
  }, [filters.page]);

  const query = trpc.admin.getReviews.useQuery({
    page,
    limit,
    status: filters.status !== 'all' ? filters.status : undefined,
    search: filters.search,
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
    setPage,
    nextPage: () => setPage(p => p + 1),
    prevPage: () => setPage(p => Math.max(1, p - 1)),
    goToPage: (p: number) => setPage(p),
  };
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

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use reports hook
 */
export function useReports(filters: ReportFilters = {}) {
  const [page, setPage] = useState(filters.page || 1);
  const limit = filters.limit || 20;

  useEffect(() => {
    setPage(filters.page || 1);
  }, [filters.page]);

  const query = trpc.admin.getReports.useQuery({
    page,
    limit,
    status: filters.status !== 'all' ? filters.status : undefined,
    search: filters.search,
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
    setPage,
    nextPage: () => setPage(p => p + 1),
    prevPage: () => setPage(p => Math.max(1, p - 1)),
    goToPage: (p: number) => setPage(p),
  };
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

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use site settings hook
 */
export function useSiteSettings() {
  return useFetchData<SiteSettings>(
    () => adminApi.getSiteSettings()
  );
}

/**
 * Use theme settings hook
 */
export function useThemeSettings() {
  return useFetchData<SiteSettings['theme']>(
    () => adminApi.getThemeSettings()
  );
}

/**
 * Use media settings hook
 */
export function useMediaSettings() {
  return useFetchData<SiteSettings['media']>(
    () => adminApi.getMediaSettings()
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use navigation items hook
 */
export function useNavigationItems() {
  return useFetchData<NavigationItem[]>(
    () => adminApi.getNavigationItems()
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGES HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use pages hook
 */
export function usePages() {
  return useFetchData<Page[]>(
    () => adminApi.getPages()
  );
}

/**
 * Use single page hook
 */
export function usePage(id: string) {
  return useFetchData(
    () => adminApi.getPage(id),
    { deps: [id] }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOWCASE & FEATURED HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use featured escorts hook
 */
export function useFeaturedEscorts(refetchInterval?: number) {
  const query = trpc.admin.getListings.useQuery({
    page: 1,
    limit: 6,
    status: 'active',
  }, {
    refetchInterval: refetchInterval || false,
  });

  const data: FeaturedEscort[] = (query.data?.items || []).map((listing, index) => ({
    id: listing.id,
    escortId: listing.escortId,
    escortName: listing.escortName,
    position: index + 1,
    badge: listing.isFeatured ? 'Vitrin' : listing.isVerified ? 'Onaylı' : 'Yeni',
    enabled: Boolean(listing.isFeatured),
    assignedAt: null,
    assignedBy: 'system',
    name: listing.escortName,
    location: listing.location,
    image: listing.escortAvatar || listing.thumbnail,
  }));

  return {
    data,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch: async () => { await query.refetch(); },
  };
}

/**
 * Use hero banner hook
 */
export function useHeroBanner() {
  return useFetchData(
    () => adminApi.getHeroBanner()
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO APPROVAL HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use pending photos hook
 */
export function usePendingPhotos(refetchInterval?: number) {
  const query = trpc.admin.getPendingPhotos.useQuery(undefined, {
    refetchInterval: refetchInterval || false,
  });

  const data: PhotoApproval[] = (query.data || []).map((photo, index) => ({
    id: String(photo.id),
    escortId: String(photo.escortId),
    escortName: photo.escort?.displayName || photo.escort?.stageName || `Profil #${photo.escortId}`,
    photoUrl: photo.url,
    thumbnailUrl: photo.blurredUrl || photo.watermarkedUrl || photo.url,
    status: 'pending',
    uploadedAt: toIsoString(photo.createdAt),
    reportCount: 0,
    isPrimary: index === 0,
    order: index + 1,
    originalUrl: photo.url,
    processedUrl: photo.watermarkedUrl || photo.blurredUrl || undefined,
    watermarkedUrl: photo.watermarkedUrl || undefined,
    blurredUrl: photo.blurredUrl || undefined,
    type: photo.type,
    privacyLevel: photo.privacyLevel ?? undefined,
    imageProcessingOptions: {
      faceMaskingEnabled: Boolean(photo.blurredUrl),
      blurBackground: photo.privacyLevel !== 'public',
      privacyLevel: photo.privacyLevel ?? undefined,
    },
  }));

  return {
    data,
    items: data,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    total: data.length,
    page: 1,
    limit: data.length || 20,
    hasMore: false,
    totalPages: data.length > 0 ? 1 : 0,
    refetch: async () => { await query.refetch(); },
    nextPage: () => {},
    prevPage: () => {},
    goToPage: () => {},
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use audit logs hook
 */
export function useAuditLogs(filters: AuditLogFilters = {}) {
return usePaginatedData(
(f) => adminApi.getAuditLogs(f as AuditLogFilters),
filters
);
}

/**
 * Use admin intel hook
 */
export function useAdminIntel() {
  return {
    data: [],
    isLoading: false,
    error: null,
    refetch: async () => {}
  };
}

/**
 * Use admin economy hook
 */
export function useAdminEconomy() {
  return {
    data: { 
      conversionRate: 10, 
      referralBonus: 500, 
      bookingBonus: 200 
    },
    isLoading: false,
    error: null,
    refetch: async () => {}
  };
}

/**
 * Use admin store hook
 */
export function useAdminStore() {
  return {
    data: [],
    isLoading: false,
    error: null,
    refetch: async () => {}
  };
}

/**
 * Use admin approvals hook (Phase 13)
 */
export function useAdminApprovals() {
  return {
    data: [],
    isLoading: false,
    error: null,
    refetch: async () => {}
  };
}

/**
 * Use admin ad slots hook (Phase 13)
 */
// ─────────────────────────────────────────────────────────────────────────────
// COMPATIBILITY ALIASES (Phase 17+)
// ─────────────────────────────────────────────────────────────────────────────

export { usePlatformStats as useAdminStats };
export { useUsers as useAdminUsers };
export { useListings as useAdminListings };
export { useReviews as useAdminReviews };
export { useReports as useAdminReports };
export { useReports as useAdminReportsV2 };

// ─────────────────────────────────────────────────────────────────────────────
// ACTION & MUTATION HOOKS (Phase 18)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use ban user mutation hook
 */
export function useBanUser() {
  const mutation = trpc.admin.banUser.useMutation({
    onSuccess: () => toast.success('Kullanıcı yasaklandı')
  });
  return {
    execute: async (userId: string, reason?: string) => {
      try {
        await mutation.mutateAsync({ userId, reason });
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    isLoading: mutation.isPending
  };
}

/**
 * Use verify user mutation hook
 */
export function useVerifyUser() {
  const mutation = trpc.admin.verifyUser.useMutation({
    onSuccess: () => toast.success('Kullanıcı doğrulandı')
  });
  return {
    execute: async (userId: string) => {
      try {
        await mutation.mutateAsync({ userId });
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    isLoading: mutation.isPending
  };
}

/**
 * Use approve listing mutation hook
 */
export function useApproveListing() {
  const mutation = trpc.admin.approveListing.useMutation({
    onSuccess: () => toast.success('İlan onaylandı')
  });
  return {
    execute: async (listingId: string) => {
      try {
        await mutation.mutateAsync({ listingId });
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    isLoading: mutation.isPending
  };
}

/**
 * Use reject listing mutation hook
 */
export function useRejectListing() {
  const mutation = trpc.admin.rejectListing.useMutation({
    onSuccess: () => toast.info('İlan reddedildi')
  });
  return {
    execute: async (listingId: string, reason?: string) => {
      try {
        await mutation.mutateAsync({ listingId, reason });
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    isLoading: mutation.isPending
  };
}

/**
 * Use delete listing mutation hook
 */
export function useDeleteListing() {
  const mutation = trpc.admin.deleteListing.useMutation({
    onSuccess: () => toast.success('İlan silindi')
  });
  return {
    execute: async (listingId: string) => {
      try {
        await mutation.mutateAsync({ listingId });
        return { success: true };
      } catch {
        return { success: false };
      }
    },
    isLoading: mutation.isPending
  };
}

function normalizeNumericId(id: string | number) {
  return typeof id === 'number' ? id : Number(id);
}

/**
 * Use approve review mutation hook
 */
export function useApproveReview() {
  const mutation = trpc.admin.approveReview.useMutation({
    onSuccess: () => toast.success('Değerlendirme onaylandı')
  });
  return {
    execute: async (reviewId: string | number) => {
      try {
        await mutation.mutateAsync({ reviewId: normalizeNumericId(reviewId) });
        return { success: true };
      } catch (error) {
        captureClientError(error, { scope: 'admin', action: 'approve_review', reviewId });
        return { success: false };
      }
    },
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending
  };
}

/**
 * Use reject review mutation hook
 */
export function useRejectReview() {
  const mutation = trpc.admin.rejectReview.useMutation({
    onSuccess: () => toast.info('Değerlendirme reddedildi')
  });
  return {
    execute: async (reviewId: string | number, reason?: string) => {
      try {
        await mutation.mutateAsync({ reviewId: normalizeNumericId(reviewId), reason });
        return { success: true };
      } catch (error) {
        captureClientError(error, { scope: 'admin', action: 'reject_review', reviewId });
        return { success: false };
      }
    },
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending
  };
}

/**
 * Use hide review mutation hook
 */
export function useHideReview() {
  const mutation = trpc.admin.hideReview.useMutation({
    onSuccess: () => toast.success('Değerlendirme gizlendi')
  });
  return {
    execute: async (reviewId: string | number) => {
      try {
        await mutation.mutateAsync({ reviewId: normalizeNumericId(reviewId) });
        return { success: true };
      } catch (error) {
        captureClientError(error, { scope: 'admin', action: 'hide_review', reviewId });
        return { success: false };
      }
    },
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending
  };
}

/**
 * Use delete review mutation hook
 */
export function useDeleteReview() {
  const mutation = trpc.admin.deleteReview.useMutation({
    onSuccess: () => toast.success('Değerlendirme silindi')
  });
  return {
    execute: async (reviewId: string | number) => {
      try {
        await mutation.mutateAsync({ reviewId: normalizeNumericId(reviewId) });
        return { success: true };
      } catch (error) {
        captureClientError(error, { scope: 'admin', action: 'delete_review', reviewId });
        return { success: false };
      }
    },
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending
  };
}

/**
 * Use update report status mutation hook
 */
export function useUpdateReportStatus() {
  const mutation = trpc.admin.updateReportStatus.useMutation({
    onSuccess: () => toast.success('Rapor durumu güncellendi')
  });
  return {
    execute: async (reportId: string | number, status: 'pending' | 'resolved' | 'dismissed') => {
      try {
        await mutation.mutateAsync({ reportId: normalizeNumericId(reportId), status });
        return { success: true };
      } catch (error) {
        captureClientError(error, { scope: 'admin', action: 'update_report_status', reportId, status });
        return { success: false };
      }
    },
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending
  };
}

/**
 * Use approve photo mutation hook
 */
export function useApprovePhoto() {
  const mutation = trpc.admin.approvePhoto.useMutation({
    onSuccess: () => toast.success('Fotoğraf onaylandı')
  });
  return {
    execute: async (photoId: string | number) => {
      try {
        await mutation.mutateAsync({ photoId: normalizeNumericId(photoId) });
        return { success: true };
      } catch (error) {
        captureClientError(error, { scope: 'admin', action: 'approve_photo', photoId });
        return { success: false };
      }
    },
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending
  };
}

/**
 * Use reject photo mutation hook
 */
export function useRejectPhoto() {
  const mutation = trpc.admin.rejectPhoto.useMutation({
    onSuccess: () => toast.info('Fotoğraf reddedildi')
  });
  return {
    execute: async (photoId: string | number, reason?: string) => {
      try {
        await mutation.mutateAsync({ photoId: normalizeNumericId(photoId), reason });
        return { success: true };
      } catch (error) {
        captureClientError(error, { scope: 'admin', action: 'reject_photo', photoId });
        return { success: false };
      }
    },
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending
  };
}
