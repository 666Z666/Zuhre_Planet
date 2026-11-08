import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { env } from '@/config/env';

/**
 * Double-submit cookie CSRF koruması.
 *
 * - Sunucu `zp_csrf` çerezine rastgele bir token yazar (HttpOnly değil ama
 *   istemci onu çerezden değil, GET /api/auth/csrf yanıtından okur; böylece
 *   API ile frontend farklı origin'de olsa da çalışır).
 * - State değiştiren her istekte (POST/PUT/PATCH/DELETE) `x-csrf-token`
 *   başlığı çerezdeki değerle birebir aynı olmak zorundadır.
 * - Saldırgan site çerezi okuyamadığı ve başlığı ekleyemediği için istek reddedilir.
 */
export const CSRF_COOKIE = 'zp_csrf';
export const CSRF_HEADER = 'x-csrf-token';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function newToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function cookieOptions() {
  return {
    httpOnly: false,
    secure: env.isProduction,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export function ensureCsrfToken(req: Request, res: Response): string {
  const existing = req.cookies?.[CSRF_COOKIE];
  if (typeof existing === 'string' && existing.length >= 32) {
    return existing;
  }
  const token = newToken();
  res.cookie(CSRF_COOKIE, token, cookieOptions());
  // Aynı istekte sonraki middleware'ler de görebilsin
  req.cookies = { ...(req.cookies ?? {}), [CSRF_COOKIE]: token };
  return token;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export function csrfProtection(options: { excludePaths?: string[] } = {}) {
  const excludePaths = options.excludePaths ?? [];

  return (req: Request, res: Response, next: NextFunction) => {
    if (SAFE_METHODS.has(req.method.toUpperCase())) {
      return next();
    }
    if (excludePaths.some((p) => req.path === p || req.path.startsWith(`${p}/`))) {
      return next();
    }

    const cookieToken = req.cookies?.[CSRF_COOKIE];
    const headerToken = req.get(CSRF_HEADER);

    if (
      typeof cookieToken !== 'string' ||
      typeof headerToken !== 'string' ||
      !safeEqual(cookieToken, headerToken)
    ) {
      return res.status(403).json({ code: 'CSRF_INVALID', message: 'CSRF doğrulaması başarısız.' });
    }

    return next();
  };
}
