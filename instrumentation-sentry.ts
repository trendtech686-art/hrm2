// Sentry instrumentation hook for Next.js
// This file is automatically loaded by Next.js

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

export const onRequestError = (err: unknown) => {
  // Log to Sentry in production
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    // Dynamic import to avoid bundling Sentry in dev
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.captureException(err)
    })
  }
}
