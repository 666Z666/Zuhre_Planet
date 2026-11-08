/**
 * İstemci tarafı oturum/CSRF yardımcıları.
 *
 * - CSRF token GET /api/auth/csrf yanıtından alınır ve bellekte tutulur
 *   (API ile frontend farklı origin'de olsa da çalışır).
 * - State değiştiren tüm istekler `x-csrf-token` başlığıyla gider.
 * - 401 alındığında refresh_token çereziyle tek seferlik oturum yenileme yapılır
 *   (aynı anda gelen 401'ler tek bir refresh isteğini paylaşır).
 */

export const API_BASE_URL: string = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');
export const SERVER_BASE_URL: string = API_BASE_URL.replace(/\/api$/, '');
export const CSRF_HEADER = 'x-csrf-token';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;
let refreshPromise: Promise<boolean> | null = null;

export function isUnsafeMethod(method?: string): boolean {
  return !SAFE_METHODS.has((method || 'GET').toUpperCase());
}

export async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (forceRefresh) {
    csrfToken = null;
    csrfPromise = null;
  }
  if (csrfToken) return csrfToken;
  if (!csrfPromise) {
    csrfPromise = fetch(`${API_BASE_URL}/auth/csrf`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`CSRF token alınamadı (${res.status})`);
        const data = (await res.json()) as { csrfToken?: string };
        if (!data.csrfToken) throw new Error('CSRF token yanıtı boş');
        csrfToken = data.csrfToken;
        return data.csrfToken;
      })
      .finally(() => {
        csrfPromise = null;
      });
  }
  return csrfPromise;
}

export function resetCsrfToken(): void {
  csrfToken = null;
  csrfPromise = null;
}

/** Oturumu refresh_token çereziyle yeniler. Başarılıysa true döner. */
export function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const token = await getCsrfToken();
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', [CSRF_HEADER]: token },
          body: '{}',
        });
        return res.ok;
      } catch {
        return false;
      } finally {
        // Bir sonraki 401 dalgası için kilidi bırak
        setTimeout(() => {
          refreshPromise = null;
        }, 0);
      }
    })();
  }
  return refreshPromise;
}

/** Oturum yenilemesi denenmemesi gereken uç noktalar (yanlış şifre 401'i yenileme tetiklememeli). */
export function isAuthEndpoint(url: string): boolean {
  return /\/auth\/(login|register|refresh|csrf|logout)(\?|$)/.test(url) || /auth\.(login|register|socialAuth)/.test(url);
}

/**
 * tRPC ve diğer fetch tabanlı çağrılar için güvenli fetch:
 * çerez gönderir, CSRF başlığı ekler, 401'de bir kez oturum yenileyip tekrar dener,
 * 403 CSRF hatasında token'ı tazeleyip bir kez tekrar dener.
 */
export async function secureFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const method = init.method || (input instanceof Request ? input.method : 'GET');

  const send = async (forceCsrf = false): Promise<Response> => {
    const headers = new Headers(init.headers);
    if (isUnsafeMethod(method)) {
      headers.set(CSRF_HEADER, await getCsrfToken(forceCsrf));
    }
    return fetch(input, { ...init, headers, credentials: 'include' });
  };

  let res = await send();

  if (res.status === 403 && isUnsafeMethod(method)) {
    const body = await res.clone().json().catch(() => null) as { code?: string } | null;
    if (body?.code === 'CSRF_INVALID') {
      res = await send(true);
    }
  }

  if (res.status === 401 && !isAuthEndpoint(url)) {
    const refreshed = await refreshSession();
    if (refreshed) {
      res = await send();
    }
  }

  return res;
}
