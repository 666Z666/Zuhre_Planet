/**
 * API Client Configuration
 * 
 * @module services/api/client
 * @category API Services
 * 
 * Axios-based HTTP client with interceptors for:
 * - Authentication token injection
 * - Error handling and retry logic
 * - Request/response logging (dev only)
 * - Base URL configuration
 * 
 * @example
 * ```typescript
 * import { apiClient } from './client';
 * 
 * const response = await apiClient.get('/users');
 * ```
 */

import { API_BASE_URL, CSRF_HEADER, getCsrfToken, isAuthEndpoint, isUnsafeMethod, refreshSession, resetCsrfToken } from '@/lib/apiSecurity';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * API configuration from environment variables
 */
const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  enableRealAPI: import.meta.env.VITE_ENABLE_REAL_API === 'true',
  isDev: import.meta.env.DEV,
};

/**
 * Token storage key
 * @deprecated Using HttpOnly cookies for better security
 */
const _TOKEN_STORAGE_KEY = 'auth_token';
const _REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

/**
 * Get authentication token from storage
 * @deprecated Token is now managed by browser via HttpOnly cookies
 */
export const getAuthToken = (): string | null => {
  return null;
};

/**
 * Set authentication token to storage
 * @deprecated Token is now managed by browser via HttpOnly cookies
 */
export const setAuthToken = (_token: string): void => {
  // No-op: Token is set via Set-Cookie header from server
};

/**
 * Remove authentication token from storage
 */
export const removeAuthToken = (): void => {
  // Clearing cookies is handled by calling /auth/logout endpoint
};

/**
 * Get refresh token from storage
 * @deprecated Token is now managed by browser via HttpOnly cookies
 */
export const getRefreshToken = (): string | null => {
  return null;
};

/**
 * Set refresh token to storage
 * @deprecated Token is now managed by browser via HttpOnly cookies
 */
export const setRefreshToken = (_token: string): void => {
  // No-op: Token is set via Set-Cookie header from server
};

const SENSITIVE_KEYS = /pass(word)?|token|secret|cvc|cvv|card/i;

function redactSensitive(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data;
  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([k, v]) => [k, SENSITIVE_KEYS.test(k) ? '[REDACTED]' : v]),
  );
}

/**
 * Create Axios instance
 */
const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    withCredentials: true, // Crucial: Send cookies with every request
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Request interceptor
   * - Log requests in dev mode
   */
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Token HttpOnly çerezle gider; state değiştiren isteklere CSRF başlığı eklenir
      if (isUnsafeMethod(config.method)) {
        config.headers.set(CSRF_HEADER, await getCsrfToken());
      }

      // Log in dev mode
      if (API_CONFIG.isDev) {
        console.warn(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          // Şifre vb. hassas alanlar loglanmaz
          data: redactSensitive(config.data),
        });
      }

      return config;
    },
    (error) => {
      if (API_CONFIG.isDev) {
        console.error('[API Request Error]', error);
      }
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor
   * - Handle errors
   * - Log responses in dev mode
   * - Retry on network errors
   */
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log in dev mode
      if (API_CONFIG.isDev) {
        console.warn(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }

      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // Log error in dev mode
      if (API_CONFIG.isDev) {
        console.error('[API Response Error]', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      }

      // CSRF token süresi dolmuş/değişmişse bir kez tazeleyip tekrar dene
      const errorCode = (error.response?.data as { code?: string } | undefined)?.code;
      if (error.response?.status === 403 && errorCode === 'CSRF_INVALID' && !originalRequest._retry) {
        originalRequest._retry = true;
        resetCsrfToken();
        return instance(originalRequest);
      }

      // 401: refresh_token çereziyle oturumu yenile (login/register gibi auth uçları hariç —
      // yanlış şifre 401'i yönlendirme tetiklememeli)
      if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint(originalRequest.url || '')) {
        originalRequest._retry = true;

        const refreshed = await refreshSession();
        if (refreshed) {
          return instance(originalRequest);
        }
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      // Handle network errors with retry
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          // Wait 1 second before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          return instance(originalRequest);
        }
      }

      // Transform error to user-friendly message
      const errorMessage = getErrorMessage(error);
      return Promise.reject(new Error(errorMessage));
    }
  );

  return instance;
};

/**
 * Extract user-friendly error message from API error
 */
const getErrorMessage = (error: AxiosError): string => {
  if (error.response) {
    // Server responded with error status
    const data = error.response.data as { message?: string; error?: string };
    return data.message || data.error || 'Bir hata oluştu';
  } else if (error.request) {
    // Request made but no response
    return 'Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.';
  } else {
    // Error in request setup
    return error.message || 'Beklenmeyen bir hata oluştu';
  }
};

/**
 * Main API client instance
 */
export const apiClient = createApiClient();

/**
 * Check if real API is enabled
 */
export const isRealApiEnabled = (): boolean => {
  return API_CONFIG.enableRealAPI;
};

/**
 * API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Type guard for API errors
 */
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};
