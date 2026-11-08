/**
 * @file src/constants/routes.ts
 * @description Uygulama genelindeki tüm route (yol) sabitlerinin tanımlandığı merkezi dosya.
 * Tüm yönlendirmeler ve linkler bu sabitleri kullanmalıdır.
 */

export const ROUTES = {
  // Public Routes
  HOME: '/',
  CATALOG: '/catalog',
  ESCORT_PROFILE: '/profile/:id',
  LOGIN: '/login',
  ESCORT_LOGIN: '/escort/login',
  REGISTER: '/register',
  REGISTER_CLIENT: '/register-client',
  REGISTER_ESCORT: '/register-escort',
  
  // Auth & Account Routes
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Dashboard Routes
  DASHBOARD: '/dashboard',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ESCORT_DASHBOARD: '/escort/dashboard',
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  
  // Feature Routes
  MESSAGES: '/messages',
  FORUM: '/forum',
  FORUM_NEW_TOPIC: '/forum/new-topic',
  FORUM_CATEGORY: '/forum/:slug',
  FORUM_TOPIC: '/forum/topic/:slug',
  FAVORITES: '/favorites',
  APPOINTMENTS: '/appointments',
  REVIEWS: '/reviews',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
  MARKET: '/market',
  VIP: '/vip',
  TOURS: '/tours',
  AGENCIES: '/agencies',
  NIGHTLIFE: '/nightlife',
  RED_ROOM: '/red-room',
  
  // Legal & Info Routes
  BLOG: '/blog',
  CONTACT: '/contact',
  FAQ: '/faq',
  SUPPORT: '/support',
  KVKK: '/kvkk',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms-of-service',
  COOKIE_POLICY: '/cookie-policy',
  SAFETY: '/safety',
  PRICING: '/pricing',
  
  // Settings
  SETTINGS: '/settings',
  ADMIN_SETTINGS: '/admin/settings',
  ESCORT_SETTINGS: '/escort/settings',
  CUSTOMER_SETTINGS: '/customer/settings',
  
  // Error Routes
  NOT_FOUND: '/404',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

/**
 * Kullanıcı rolüne göre yönlendirilecek varsayılan dashboard route'unu döner.
 */
export const getDashboardRouteByRole = (role?: string | null): string => {
  switch (role) {
    case 'admin':
      return ROUTES.ADMIN_DASHBOARD;
    case 'escort':
      return ROUTES.ESCORT_DASHBOARD;
    case 'customer':
    case 'client':
      return ROUTES.CUSTOMER_DASHBOARD;
    default:
      return ROUTES.LOGIN;
  }
};
