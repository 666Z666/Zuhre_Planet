import type { Response, Request } from 'express';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '@/config/env';

/**
 * Tek oturum kaynağı: REST (/api/auth/*) ve tRPC auth.router aynı çerezleri,
 * aynı süreleri ve aynı imzalama mantığını kullanır.
 */
export const AUTH_COOKIE = 'auth_token';
export const REFRESH_COOKIE = 'refresh_token';

const ACCESS_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function baseCookie() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'strict' as const,
    path: '/',
  };
}

export interface SessionUser {
  id: number;
  role: string | null;
}

export function signAccessToken(user: SessionUser): string {
  return jwt.sign({ userId: user.id, role: user.role ?? 'customer' }, env.jwtSecret, {
    expiresIn: env.accessTokenExpiry as SignOptions['expiresIn'],
  });
}

export function signRefreshToken(user: SessionUser): string {
  return jwt.sign({ userId: user.id, typ: 'refresh' }, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenExpiry as SignOptions['expiresIn'],
  });
}

export function issueSession(res: Response, user: SessionUser): void {
  res.cookie(AUTH_COOKIE, signAccessToken(user), { ...baseCookie(), maxAge: ACCESS_COOKIE_MAX_AGE });
  res.cookie(REFRESH_COOKIE, signRefreshToken(user), { ...baseCookie(), maxAge: REFRESH_COOKIE_MAX_AGE });
}

export function clearSession(res: Response): void {
  res.clearCookie(AUTH_COOKIE, baseCookie());
  res.clearCookie(REFRESH_COOKIE, baseCookie());
}

export function verifyAccessToken(token: string): { userId: number; role?: string } {
  const decoded = jwt.verify(token, env.jwtSecret) as { userId?: unknown; role?: string };
  if (typeof decoded.userId !== 'number') {
    throw new Error('Invalid token payload');
  }
  return { userId: decoded.userId, role: decoded.role };
}

export function verifyRefreshToken(token: string): { userId: number } {
  const decoded = jwt.verify(token, env.jwtRefreshSecret) as { userId?: unknown };
  if (typeof decoded.userId !== 'number') {
    throw new Error('Invalid token payload');
  }
  return { userId: decoded.userId };
}

export function clientIp(req: Request): string {
  return req.ip || req.socket.remoteAddress || 'unknown';
}
