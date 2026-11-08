import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

beforeAll(() => {
  process.env.DATABASE_URL ||= 'postgres://u:p@127.0.0.1:5999/x';
  process.env.JWT_SECRET ||= '0123456789abcdef0123456789abcdef0123';
  process.env.JWT_REFRESH_SECRET ||= 'fedcba9876543210fedcba9876543210fedc';
  process.env.CORS_ORIGINS ||= 'http://localhost:5173';
});

function mockRes() {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    cookies: {} as Record<string, string>,
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; },
    cookie(name: string, value: string) { this.cookies[name] = value; return this; },
    clearCookie(name: string) { delete this.cookies[name]; return this; },
  };
  return res as unknown as Response & typeof res;
}

function mockReq(method: string, path: string, cookies: Record<string, string> = {}, headers: Record<string, string> = {}) {
  return {
    method,
    path,
    cookies,
    get: (h: string) => headers[h.toLowerCase()],
  } as unknown as Request;
}

describe('CSRF double-submit', () => {
  it('GET isteklerini engellemez', async () => {
    const { csrfProtection } = await import('../csrf');
    const next = vi.fn() as unknown as NextFunction;
    csrfProtection()(mockReq('GET', '/api/x'), mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it('token olmadan POST isteğini 403 ile reddeder', async () => {
    const { csrfProtection } = await import('../csrf');
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;
    csrfProtection()(mockReq('POST', '/api/auth/login'), res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
  });

  it('çerez ve başlık eşleşmezse reddeder, eşleşirse geçirir', async () => {
    const { csrfProtection, ensureCsrfToken, CSRF_COOKIE } = await import('../csrf');
    const res = mockRes();
    const token = ensureCsrfToken(mockReq('GET', '/'), res);
    expect(res.cookies[CSRF_COOKIE]).toBe(token);

    const bad = mockRes();
    const next1 = vi.fn() as unknown as NextFunction;
    csrfProtection()(mockReq('POST', '/api/trpc/x', { [CSRF_COOKIE]: token }, { 'x-csrf-token': 'yanlis' }), bad, next1);
    expect(next1).not.toHaveBeenCalled();

    const next2 = vi.fn() as unknown as NextFunction;
    csrfProtection()(mockReq('POST', '/api/trpc/x', { [CSRF_COOKIE]: token }, { 'x-csrf-token': token }), mockRes(), next2);
    expect(next2).toHaveBeenCalled();
  });
});

describe('Oturum token’ları', () => {
  it('access ve refresh token farklı secret ile imzalanır ve birbirinin yerine geçmez', async () => {
    const { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } = await import('../lib/session');
    const access = signAccessToken({ id: 7, role: 'customer' });
    const refresh = signRefreshToken({ id: 7, role: 'customer' });
    expect(verifyAccessToken(access).userId).toBe(7);
    expect(verifyRefreshToken(refresh).userId).toBe(7);
    expect(() => verifyAccessToken(refresh)).toThrow();
    expect(() => verifyRefreshToken(access)).toThrow();
  });

  it('issueSession HttpOnly çerezleri yazar', async () => {
    const { issueSession, AUTH_COOKIE, REFRESH_COOKIE } = await import('../lib/session');
    const res = mockRes();
    issueSession(res, { id: 1, role: 'admin' });
    expect(res.cookies[AUTH_COOKIE]).toBeTruthy();
    expect(res.cookies[REFRESH_COOKIE]).toBeTruthy();
  });
});

describe('E-posta doğrulama', () => {
  it('normalize eder ve geçersizleri reddeder', async () => {
    const { normalizeEmail, isDisposableEmail } = await import('../lib/email');
    expect(normalizeEmail('  Ali@Example.COM ')).toBe('ali@example.com');
    expect(normalizeEmail('bad')).toBeNull();
    expect(normalizeEmail(42)).toBeNull();
    expect(isDisposableEmail('x@mailinator.com')).toBe(true);
    expect(isDisposableEmail('x@gmail.com')).toBe(false);
  });
});

describe('Tier limitleri', () => {
  it('tek kaynaktan gelir ve seviyeye göre artar', async () => {
    const { TIER_LIMITS } = await import('../lib/tiers');
    expect(TIER_LIMITS.free.photoLimit).toBeLessThan(TIER_LIMITS.gold.photoLimit);
    expect(TIER_LIMITS.gold.photoLimit).toBeLessThan(TIER_LIMITS.platinum.photoLimit);
  });
});
