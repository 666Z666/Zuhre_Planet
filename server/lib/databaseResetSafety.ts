export interface DatabaseResetSafetyOptions {
  databaseUrl: string;
  nodeEnv: string | undefined;
  allowReset: string | undefined;
}

const LOOPBACK_HOSTS = new Set(['localhost', '::1']);

function isLoopbackHost(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (LOOPBACK_HOSTS.has(host)) return true;

  const octets = host.split('.');
  return octets.length === 4
    && octets[0] === '127'
    && octets.every((octet) => /^\d{1,3}$/.test(octet) && Number(octet) <= 255);
}

/** Destructive schema reset is limited to an explicit opt-in on a local dev/test database. */
export function assertSafeDatabaseReset({ databaseUrl, nodeEnv, allowReset }: DatabaseResetSafetyOptions): void {
  if (nodeEnv !== 'development' && nodeEnv !== 'test') {
    throw new Error('db:reset yalnız NODE_ENV=development veya NODE_ENV=test ortamında çalıştırılabilir.');
  }

  if (allowReset !== 'true') {
    throw new Error('db:reset için ALLOW_DB_RESET=true açık onayı gereklidir.');
  }

  let target: URL;
  try {
    target = new URL(databaseUrl);
  } catch {
    throw new Error('db:reset için geçerli bir PostgreSQL DATABASE_URL gereklidir.');
  }

  if (target.protocol !== 'postgres:' && target.protocol !== 'postgresql:') {
    throw new Error('db:reset yalnız PostgreSQL hedeflerinde çalıştırılabilir.');
  }

  if (!isLoopbackHost(target.hostname)) {
    throw new Error('db:reset güvenlik gereği yalnız localhost/loopback veritabanı hedefinde çalıştırılabilir.');
  }

  if (!target.pathname || target.pathname === '/') {
    throw new Error('db:reset için hedef veritabanı adı DATABASE_URL içinde belirtilmelidir.');
  }
}
