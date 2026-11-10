import { describe, expect, it } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import { canPublishListing, getListingStatus, publicListingCondition } from '../lib/publicListing';

describe('public listing publication gate', () => {
  it.each([null, undefined, 17, 0, -1, 18.5])('yaş %s olduğunda yayınlamayı reddeder', (age) => {
    expect(canPublishListing(age)).toBe(false);
  });

  it.each([18, 19, 99])('yaş %i olduğunda yayınlamaya izin verir', (age) => {
    expect(canPublishListing(age)).toBe(true);
  });

  it('public SQL koşulunda görünürlük, admin onayı ve en az 18 yaş birlikte aranır', () => {
    const query = new PgDialect().sqlToQuery(publicListingCondition());

    expect(query.sql).toContain('visibility_status');
    expect(query.sql).toContain('verification_status');
    expect(query.sql).toContain('age');
    expect(query.params).toEqual(['public', 'approved', 18]);
  });
});

describe('admin ilan durum etiketi', () => {
  it('aktif etiketi yalnız yayın kapısını geçen ilana verilir', () => {
    expect(getListingStatus({ verificationStatus: 'approved', visibilityStatus: 'public', age: 25 })).toBe('active');
  });

  it('public ama onaysız veya yaşı eksik/18 altı ilan aktif görünmez', () => {
    expect(getListingStatus({ verificationStatus: 'pending_admin', visibilityStatus: 'public', age: 25 })).toBe('pending');
    expect(getListingStatus({ verificationStatus: 'approved', visibilityStatus: 'public', age: null })).toBe('hidden');
    expect(getListingStatus({ verificationStatus: 'approved', visibilityStatus: 'public', age: 17 })).toBe('hidden');
  });

  it('reddedilen ilan her durumda rejected olur', () => {
    expect(getListingStatus({ verificationStatus: 'rejected', visibilityStatus: 'public', age: 30 })).toBe('rejected');
  });
});
