
import { useFetchData } from './useAdminBase';
import * as adminApi from '@/services/adminApi';
import type { NavigationItem, Page } from '@/types/admin';

/**
 * Use navigation items hook
 */
export function useNavigationItems() {
  return useFetchData<NavigationItem[]>(
    () => adminApi.getNavigationItems()
  );
}

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
