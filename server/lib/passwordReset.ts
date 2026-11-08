import { randomBytes, createHash } from 'node:crypto';
import { createRateLimiter } from '@/lib/security/rateLimit';

/** Sıfırlama bağlantısının geçerlilik süresi. */
export const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

/** Bağlantıdaki token (yalnız e-postada) ve veritabanındaki özeti. */
export function createResetToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString('base64url');
  return { token, tokenHash: hashResetToken(token) };
}

export function hashResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** E-posta başına saatte 3, IP başına saatte 10 istek. */
export const resetEmailLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 3 });
export const resetIpLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 10 });

/** Kullanıcı var olsa da olmasa da aynı yanıt (hesap keşfini engeller). */
export const RESET_REQUEST_MESSAGE =
  'Bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi. Gelen kutunuzu ve istenmeyen klasörünü kontrol edin.';

export function resetEmailHtml(link: string): string {
  const safe = link.replace(/"/g, '&quot;');
  return `<!doctype html><html lang="tr"><body style="font-family:Arial,sans-serif;background:#0a0f0d;color:#e8efe9;padding:24px">
  <h2 style="color:#d4af37">Şifre sıfırlama</h2>
  <p>Hesabınız için şifre sıfırlama isteği aldık. Yeni şifre belirlemek için aşağıdaki bağlantıyı 30 dakika içinde kullanın:</p>
  <p><a href="${safe}" style="display:inline-block;background:#1f7a52;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none">Yeni şifre belirle</a></p>
  <p style="font-size:12px;color:#9fb3a8">Bu isteği siz yapmadıysanız bu e-postayı yok sayın; şifreniz değişmez.</p>
</body></html>`;
}
