import { describe, expect, it } from 'vitest';
import { resolveApiBaseUrl } from './apiSecurity';

describe('resolveApiBaseUrl', () => {
  it('uses same-origin API paths in production unless a URL is configured', () => {
    expect(resolveApiBaseUrl(true)).toBe('/api');
    expect(resolveApiBaseUrl(true, 'https://api.example.test/api/')).toBe('https://api.example.test/api');
  });

  it('keeps the local API origin for development', () => {
    expect(resolveApiBaseUrl(false)).toBe('http://localhost:4000/api');
  });
});
