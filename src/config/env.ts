import 'dotenv/config';
import { z } from 'zod';

const emptyToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const csvOrigins = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    )
    .pipe(z.array(z.string().url()).min(1, 'CORS_ORIGINS en az bir geçerli origin içermeli'))
);

const optionalString = z.preprocess(emptyToUndefined, z.string().optional());
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    DATABASE_URL: z.preprocess(
      emptyToUndefined,
      z.string().url('DATABASE_URL geçerli bir veritabanı URL değeri olmalı')
    ),
    JWT_SECRET: z.preprocess(
      emptyToUndefined,
      z.string().min(32, 'JWT_SECRET en az 32 karakter olmalı')
    ),
    JWT_REFRESH_SECRET: z.preprocess(
      emptyToUndefined,
      z.string().min(32, 'JWT_REFRESH_SECRET en az 32 karakter olmalı')
    ),
    ACCESS_TOKEN_EXPIRY: z.preprocess(emptyToUndefined, z.string().default('15m')),
    REFRESH_TOKEN_EXPIRY: z.preprocess(emptyToUndefined, z.string().default('7d')),
    CORS_ORIGINS: csvOrigins,
    IYZICO_API_KEY: optionalString,
    IYZICO_SECRET_KEY: optionalString,
    IYZICO_BASE_URL: z.preprocess(
      emptyToUndefined,
      z.string().url().default('https://sandbox-api.iyzipay.com')
    ),
    EMAIL_HOST: z.preprocess(emptyToUndefined, z.string().default('smtp.gmail.com')),
    EMAIL_PORT: z.coerce.number().int().positive().default(587),
    EMAIL_SECURE: z.preprocess(
      emptyToUndefined,
      z
        .enum(['true', 'false'])
        .default('false')
        .transform((value) => value === 'true')
    ),
    EMAIL_USER: optionalString,
    EMAIL_PASSWORD: optionalString,
    EMAIL_FROM: z.preprocess(emptyToUndefined, z.string().email().default('noreply@zuhreplanet.local')),
    EMAIL_FROM_NAME: z.preprocess(emptyToUndefined, z.string().default('Zuhre Planet')),
    APP_URL: optionalUrl,
    VITE_APP_URL: optionalUrl,
    VITE_API_URL: optionalUrl,
    SENTRY_DSN: optionalUrl,
    GOOGLE_CLIENT_ID: optionalString,
    CONTACT_ENC_KEY: z.preprocess(emptyToUndefined, z.string().regex(/^[0-9a-fA-F]{64}$/, 'CONTACT_ENC_KEY 64 hex karakter olmalı').optional()),
    ALLOW_INSECURE_SOCIAL_AUTH: z.preprocess(
      emptyToUndefined,
      z
        .enum(['true', 'false'])
        .default('false')
        .transform((value) => value === 'true')
    ),
  })
  .superRefine((value, ctx) => {
    if (value.NODE_ENV !== 'production') {
      return;
    }

    const productionRequired: Array<keyof typeof value> = [
      'IYZICO_API_KEY',
      'IYZICO_SECRET_KEY',
      'EMAIL_USER',
      'EMAIL_PASSWORD',
      'CONTACT_ENC_KEY',
    ];

    for (const key of productionRequired) {
      if (!value[key]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: `${key} production ortamında zorunlu`,
        });
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  console.error(`Ortam değişkenleri doğrulanamadı:\n${details}`);
  throw new Error('Eksik veya hatalı ortam değişkenleri nedeniyle uygulama başlatılamadı.');
}

const rawEnv = parsed.data;

export const env = {
  nodeEnv: rawEnv.NODE_ENV,
  isProduction: rawEnv.NODE_ENV === 'production',
  isDevelopment: rawEnv.NODE_ENV === 'development',
  port: rawEnv.PORT,
  databaseUrl: rawEnv.DATABASE_URL,
  jwtSecret: rawEnv.JWT_SECRET,
  jwtRefreshSecret: rawEnv.JWT_REFRESH_SECRET,
  accessTokenExpiry: rawEnv.ACCESS_TOKEN_EXPIRY,
  refreshTokenExpiry: rawEnv.REFRESH_TOKEN_EXPIRY,
  corsOrigins: rawEnv.CORS_ORIGINS,
  iyzico: {
    apiKey: rawEnv.IYZICO_API_KEY ?? '',
    secretKey: rawEnv.IYZICO_SECRET_KEY ?? '',
    baseUrl: rawEnv.IYZICO_BASE_URL,
    enabled: Boolean(rawEnv.IYZICO_API_KEY && rawEnv.IYZICO_SECRET_KEY),
  },
  email: {
    host: rawEnv.EMAIL_HOST,
    port: rawEnv.EMAIL_PORT,
    secure: rawEnv.EMAIL_SECURE,
    user: rawEnv.EMAIL_USER ?? '',
    password: rawEnv.EMAIL_PASSWORD ?? '',
    fromName: rawEnv.EMAIL_FROM_NAME,
    fromEmail: rawEnv.EMAIL_FROM,
    enabled: Boolean(rawEnv.EMAIL_USER && rawEnv.EMAIL_PASSWORD),
  },
  appUrl: rawEnv.APP_URL ?? rawEnv.VITE_APP_URL ?? rawEnv.VITE_API_URL?.replace(/\/api$/, '') ?? 'http://localhost:5173',
  sentryDsn: rawEnv.SENTRY_DSN,
  googleClientId: rawEnv.GOOGLE_CLIENT_ID,
  allowInsecureSocialAuth: rawEnv.ALLOW_INSECURE_SOCIAL_AUTH,
} as const;

export type AppEnv = typeof env;

export function validateEnvOnStartup(): AppEnv {
  return env;
}
