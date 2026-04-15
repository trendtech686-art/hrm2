/**
 * Centralized Error Logger
 * 
 * Routes errors to Sentry in production, console in development.
 * Use this instead of raw console.error in server-side code.
 * 
 * @example
 * ```ts
 * import { logError, logWarn } from '@/lib/logger'
 * 
 * try {
 *   await riskyOperation()
 * } catch (error) {
 *   logError('Failed to sync data', error, { orderId: '123' })
 * }
 * ```
 */

type LogExtra = Record<string, unknown>

/**
 * Log an error — console.error always, Sentry.captureException in production
 */
export function logError(message: string, error: unknown, extra?: LogExtra) {
  console.error(`[ERROR] ${message}`, error, extra ?? '')

  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    import('@sentry/nextjs').then(Sentry => {
      Sentry.captureException(
        error instanceof Error ? error : new Error(String(error)),
        {
          extra: { message, ...extra },
        }
      )
    }).catch(() => {
      // Sentry import failed — already logged to console above
    })
  }
}

/**
 * Log a warning — console.warn always, Sentry.captureMessage in production
 */
export function logWarn(message: string, extra?: LogExtra) {
  console.warn(`[WARN] ${message}`, extra)

  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    import('@sentry/nextjs').then(Sentry => {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra,
      })
    }).catch(() => {
      // Sentry import failed — already logged to console above
    })
  }
}

/**
 * Log info — console only (no Sentry)
 */
export function logInfo(message: string, ...args: unknown[]) {
  // eslint-disable-next-line no-console
  console.log(`[INFO] ${message}`, ...args)
}
