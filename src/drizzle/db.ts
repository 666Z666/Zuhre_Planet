import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/config/env';
import * as schema from './schema';

const isDev = !env.isProduction;

const client = postgres(env.databaseUrl, {
  max: isDev ? 5 : 20,          // Max connections in pool
  idle_timeout: 30,              // Close idle connections after 30s
  connect_timeout: 10,           // Fail fast if DB unreachable
  prepare: false,                // Disable prepared statements (Supabase compat)
  onnotice: isDev ? console.warn : undefined,
});

export const db = drizzle(client, { schema });
