import { describe, it, expect, vi } from 'vitest';
vi.mock('@/lib/trpc', () => ({ trpc: {} }));
import { validateNewPassword } from '@/pages/auth/ResetPassword';

describe('validateNewPassword', () => {
  it('kısa şifreyi ve eşleşmeyeni reddeder', () => {
    expect(validateNewPassword('kisa', 'kisa')).toMatch(/8 karakter/);
    expect(validateNewPassword('uzunsifre1', 'uzunsifre2')).toMatch(/eşleşmiyor/);
  });
  it('geçerli şifreyi kabul eder', () => expect(validateNewPassword('uzunsifre1', 'uzunsifre1')).toBeNull());
});
