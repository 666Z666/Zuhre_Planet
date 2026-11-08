import * as Sentry from '@sentry/react';

let initialized = false;

export function initClientMonitoring() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (initialized || !dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
  });

  initialized = true;
}

export function captureClientError(error: unknown, context?: Record<string, unknown>) {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    return;
  }

  Sentry.withScope((scope) => {
    Object.entries(context || {}).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });

    Sentry.captureException(error);
  });
}
