import { describe, it, expect } from 'vitest';
import { contactFormSchema } from '../lib/contactForm';

const ok = { name: 'Ada', email: 'ada@ornek.test', subject: 'Soru', message: 'Merhaba, bir sorum var.' };

describe('contactFormSchema', () => {
  it('geçerli formu kabul eder', () => expect(contactFormSchema.safeParse(ok).success).toBe(true));
  it('bot tuzağı doluysa reddeder', () => expect(contactFormSchema.safeParse({ ...ok, website: 'spam.com' }).success).toBe(false));
  it('kısa mesaj ve geçersiz e-postayı reddeder', () => {
    expect(contactFormSchema.safeParse({ ...ok, message: 'kısa' }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...ok, email: 'x' }).success).toBe(false);
  });
});
