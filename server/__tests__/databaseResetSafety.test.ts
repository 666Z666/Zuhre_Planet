import { describe, expect, it } from 'vitest';
import { assertSafeDatabaseReset } from '../lib/databaseResetSafety';

const localDevelopmentTarget = {
  databaseUrl: 'postgres://user:password@localhost:5432/zuhre_planet_test',
  nodeEnv: 'development',
  allowReset: 'true',
};

describe('database reset safety guard', () => {
  it.each([
    'postgres://user:password@localhost:5432/zuhre_planet_test',
    'postgresql://user:password@127.0.0.1:5432/zuhre_planet_test',
    'postgres://user:password@[::1]:5432/zuhre_planet_test',
    'postgres://user:password@127.24.8.3:5432/zuhre_planet_test',
  ])('accepts explicit local PostgreSQL target %s', (databaseUrl) => {
    expect(() => assertSafeDatabaseReset({ ...localDevelopmentTarget, databaseUrl })).not.toThrow();
  });

  it.each(['development', 'test'])('accepts opt-in for NODE_ENV=%s on loopback', (nodeEnv) => {
    expect(() => assertSafeDatabaseReset({ ...localDevelopmentTarget, nodeEnv })).not.toThrow();
  });

  it('rejects reset without explicit opt-in', () => {
    expect(() => assertSafeDatabaseReset({ ...localDevelopmentTarget, allowReset: undefined }))
      .toThrow('ALLOW_DB_RESET=true');
  });

  it.each(['production', 'staging', undefined])('rejects unsafe or unknown NODE_ENV=%s', (nodeEnv) => {
    expect(() => assertSafeDatabaseReset({ ...localDevelopmentTarget, nodeEnv }))
      .toThrow('NODE_ENV=development');
  });

  it('rejects remote PostgreSQL hosts even when reset was explicitly enabled', () => {
    expect(() => assertSafeDatabaseReset({
      ...localDevelopmentTarget,
      databaseUrl: 'postgres://user:password@db.example.net:5432/zuhre_planet_test',
    })).toThrow('localhost/loopback');
  });

  it('rejects malformed URLs, non-PostgreSQL URLs, and missing database names', () => {
    expect(() => assertSafeDatabaseReset({ ...localDevelopmentTarget, databaseUrl: 'not-a-url' }))
      .toThrow('geçerli bir PostgreSQL DATABASE_URL');
    expect(() => assertSafeDatabaseReset({ ...localDevelopmentTarget, databaseUrl: 'https://localhost/test' }))
      .toThrow('yalnız PostgreSQL');
    expect(() => assertSafeDatabaseReset({ ...localDevelopmentTarget, databaseUrl: 'postgres://localhost' }))
      .toThrow('veritabanı adı');
  });
});
