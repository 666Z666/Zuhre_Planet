import { describe, it, expect } from 'vitest';
import { createResetToken, hashResetToken, resetEmailHtml } from '../lib/passwordReset';

describe('passwordReset', () => {
  it('token tahmin edilemez, veritabanına yalnız özeti gider', () => {
    const a = createResetToken();
    const b = createResetToken();
    expect(a.token).not.toBe(b.token);
    expect(a.token.length).toBeGreaterThanOrEqual(40);
    expect(a.tokenHash).toBe(hashResetToken(a.token));
    expect(a.tokenHash).not.toContain(a.token);
  });
  it('e-posta bağlantıyı kaçışlı içerir', () => {
    expect(resetEmailHtml('https://x.test/reset-password?token=a"b')).toContain('token=a&quot;b');
  });
});
