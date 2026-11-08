import { describe, it, expect, beforeAll } from 'vitest';
import { encryptContact, decryptContact, normalizeTrPhone, maskPhone, contactLink } from '../lib/contactCrypto';

beforeAll(() => {
  process.env.CONTACT_ENC_KEY = 'a'.repeat(64);
});

describe('contactCrypto', () => {
  it('şifreler ve geri çözer; her seferinde farklı çıktı', () => {
    const a = encryptContact('+905321234567');
    const b = encryptContact('+905321234567');
    expect(a).not.toBe(b);
    expect(a).not.toContain('5321234567');
    expect(decryptContact(a)).toBe('+905321234567');
  });
  it('kurcalanmış veriyi reddeder (GCM etiketi)', () => {
    const parts = encryptContact('+905321234567').split(':');
    const data = Buffer.from(parts[3], 'base64');
    data[0] ^= 0xff;
    parts[3] = data.toString('base64');
    expect(() => decryptContact(parts.join(':'))).toThrow();
  });
  it('yanlış anahtarla çözülemez', () => {
    const enc = encryptContact('+905321234567');
    process.env.CONTACT_ENC_KEY = 'b'.repeat(64);
    expect(() => decryptContact(enc)).toThrow();
    process.env.CONTACT_ENC_KEY = 'a'.repeat(64);
  });
});

describe('normalizeTrPhone', () => {
  it.each([
    ['0532 123 45 67', '+905321234567'],
    ['+90 532 123 4567', '+905321234567'],
    ['5321234567', '+905321234567'],
    ['905321234567', '+905321234567'],
    ['0090 212 555 00 11', '+902125550011'],
  ])('%s → %s', (input, out) => expect(normalizeTrPhone(input)).toBe(out));
  it.each(['123', '0532 123', '+1 202 555 0101', '0132 123 45 67', 'abc'])('geçersiz: %s', (input) =>
    expect(normalizeTrPhone(input)).toBeNull());
});

describe('maskPhone / contactLink', () => {
  it('maskeler', () => expect(maskPhone('+905321234567')).toBe('+90 532 *** ** 67'));
  it('bağlantı üretir', () => {
    expect(contactLink('phone', '+905321234567')).toBe('tel:+905321234567');
    expect(contactLink('whatsapp', '+905321234567')).toBe('https://wa.me/905321234567');
  });
});
