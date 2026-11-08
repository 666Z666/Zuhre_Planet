/**
 * Paylaşılan e-posta yardımcıları (REST /api/auth ve tRPC auth.router ortak kullanır).
 */
const BLOCKED_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.de',
  'guerrillamail.net', 'guerrillamail.org', 'spam4.me', 'trashmail.com',
  'trashmail.me', 'trashmail.io', 'trashmail.net', 'fakeinbox.com',
  'mailnesia.com', 'mailnull.com', 'maildrop.cc', 'spamgourmet.com',
  'spamgourmet.net', 'spamgourmet.org', 'disposableemailaddresses.com',
  'dispostable.com', 'spamfree24.org', 'spamfree24.de', 'spamfree24.eu',
  'spamfree24.info', 'spamfree24.net', 'tempinbox.com', 'temp-mail.org',
  'tempr.email', 'throwam.com', 'throwam.eu', 'throwam.net',
  '10minutemail.com', '10minutemail.net', '20minutemail.com',
  'emailondeck.com', 'getonemail.com', 'mailexpire.com', 'deadaddress.com',
  'spamevader.com', 'deadspam.com', 'spamobox.com', 'disposablemail.es',
  'trbvm.com', 'crazymailing.com', 'fakemail.fr', 'spamgob.com',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length > 254 || !EMAIL_RE.test(trimmed)) return null;
  return trimmed;
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;
  return BLOCKED_EMAIL_DOMAINS.has(domain);
}
