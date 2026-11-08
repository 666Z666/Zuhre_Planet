import * as Sentry from '@sentry/node';

let initialized = false;

export function initServerMonitoring() {
  if (initialized || !process.env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1,
  });

  initialized = true;
}

export function captureServerError(error: unknown, context?: Record<string, unknown>) {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.withScope((scope) => {
    Object.entries(context || {}).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });

    Sentry.captureException(error);
  });
}
