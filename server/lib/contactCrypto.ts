import { createCipheriv, createDecipheriv, randomBytes, createHash, createHmac } from 'node:crypto';

/**
 * İletişim numaraları için AES-256-GCM. Anahtar: CONTACT_ENC_KEY (64 hex = 32 bayt).
 * Biçim: v1:<iv b64>:<tag b64>:<veri b64>
 * Geliştirmede anahtar yoksa JWT_SECRET'tan türetilir (yayında CONTACT_ENC_KEY zorunlu).
 */
function getKey(): Buffer {
  const hex = process.env.CONTACT_ENC_KEY?.trim();
  if (hex) {
    if (!/^[0-9a-fA-F]{64}$/.test(hex)) throw new Error('CONTACT_ENC_KEY 64 hex karakter (32 bayt) olmalı');
    return Buffer.from(hex, 'hex');
  }
  if (process.env.NODE_ENV === 'production') throw new Error('CONTACT_ENC_KEY production ortamında zorunlu');
  const seed = process.env.JWT_SECRET ?? 'dev-only-contact-key';
  return createHash('sha256').update(`contact:${seed}`).digest();
}

export function encryptContact(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return ['v1', iv.toString('base64'), cipher.getAuthTag().toString('base64'), data.toString('base64')].join(':');
}

export function decryptContact(enc: string): string {
  const [v, iv, tag, data] = enc.split(':');
  if (v !== 'v1' || !iv || !tag || !data) throw new Error('Geçersiz şifreli iletişim verisi');
  const decipher = createDecipheriv('aes-256-gcm', getKey(), Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]).toString('utf8');
}

/**
 * Türkiye cep/sabit numarasını E.164'e (+90XXXXXXXXXX) normalize eder; geçersizse null.
 * Kabul: "0532 123 45 67", "+90 532 123 4567", "5321234567", "905321234567".
 */
export function normalizeTrPhone(input: string): string | null {
  let d = input.replace(/[^\d+]/g, '');
  if (d.startsWith('+')) d = d.slice(1);
  if (d.startsWith('0090')) d = d.slice(4);
  else if (d.startsWith('90') && d.length === 12) d = d.slice(2);
  else if (d.startsWith('0') && d.length === 11) d = d.slice(1);
  if (!/^[2-5]\d{9}$/.test(d)) return null;
  return `+90${d}`;
}

/** Sağlayıcının kendi paneli için maskeli gösterim: +90 532 *** ** 67 */
export function maskPhone(e164: string): string {
  const d = e164.replace(/^\+90/, '');
  return `+90 ${d.slice(0, 3)} *** ** ${d.slice(-2)}`;
}

/** Tıklamada dönen bağlantı. */
export function contactLink(channel: 'phone' | 'whatsapp', e164: string): string {
  return channel === 'phone' ? `tel:${e164}` : `https://wa.me/${e164.replace(/^\+/, '')}`;
}

/**
 * Kör indeks: aynı değer → aynı özet, ama özetten değer geri çıkarılamaz.
 * Şifreleme anahtarından ayrı bir alt anahtar kullanılır. `scope` farklı türleri ayırır
 * (ör. "phone" ve "ip" özetleri birbirine eşlenemez).
 */
export function blindIndex(scope: 'phone' | 'ip', value: string): string {
  const sub = createHash('sha256').update(Buffer.concat([Buffer.from('bidx:'), getKey()])).digest();
  return createHmac('sha256', sub).update(`${scope}:${value}`).digest('base64url');
}
