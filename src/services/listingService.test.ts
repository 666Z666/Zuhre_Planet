import { describe, expect, it } from 'vitest';
import { MockListingService } from './listingService';
import { resolveListingSource } from './listingSource';

describe('resolveListingSource', () => {
  it('always selects the real API in production, even if mock is configured', () => {
    expect(resolveListingSource(true, 'mock')).toBe('api');
    expect(resolveListingSource(true)).toBe('api');
  });

  it('keeps demo data available only outside production unless API is selected', () => {
    expect(resolveListingSource(false)).toBe('mock');
    expect(resolveListingSource(false, 'mock')).toBe('mock');
    expect(resolveListingSource(false, 'api')).toBe('api');
  });
});

describe('MockListingService contact actions', () => {
  it('does not expose synthetic phone numbers through tel or WhatsApp links', async () => {
    const result = await new MockListingService().revealContact('1', 'phone');

    expect(result).toEqual({ error: 'Demo ortamında iletişim bağlantısı gösterilmez.' });
    expect('url' in result).toBe(false);
  });
});
