import type { Config } from 'drizzle-kit';
import { env } from './src/config/env';

/**
 * Drizzle Kit Configuration - PostgreSQL (Docker/VPS) Support
 */
export default {
  schema: './src/drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql', // VPS Self-Hosted DB
  dbCredentials: {
    url: env.databaseUrl,
  },
} satisfies Config;
