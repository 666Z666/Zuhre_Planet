import { loginLimiter, createRateLimiter, type RateLimitResult } from '@/lib/security/rateLimit';

/** IP bazlı ek sınır: tek IP'den çok sayıda farklı e-postaya deneme (password spraying) engellenir. */
const authIpLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 30 });
const registerIpLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 10 });

export function checkLoginRate(email: string, ip: string): RateLimitResult {
  const byIp = authIpLimiter.check(`ip:${ip}`);
  if (!byIp.allowed) return byIp;
  return loginLimiter.check(`email:${email}`);
}

export function checkRegisterRate(ip: string): RateLimitResult {
  return registerIpLimiter.check(`ip:${ip}`);
}

export const TOO_MANY_ATTEMPTS = 'Çok fazla deneme. Lütfen bir süre sonra tekrar deneyin.';
