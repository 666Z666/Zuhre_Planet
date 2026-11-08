
import { useFetchData } from './useAdminBase';
import * as adminApi from '@/services/adminApi';
import type { SiteSettings } from '@/types/admin';

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
