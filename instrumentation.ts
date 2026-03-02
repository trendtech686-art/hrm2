/**
 * Next.js Instrumentation
 * 
 * This file is called once when the Next.js server starts.
 * Use it to initialize:
 * - Database connections
 * - Monitoring/tracing (OpenTelemetry, Sentry, etc.)
 * - Global configuration
 * 
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Initialize Sentry first
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }

  // Only run on server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // eslint-disable-next-line no-console
    console.log('[Instrumentation] 🚀 Server starting...')
    
    // Initialize Prisma connection pool warming
    // This helps reduce cold start latency
    try {
      const { prisma } = await import('@/lib/prisma')
      await prisma.$connect()
      // eslint-disable-next-line no-console
      console.log('[Instrumentation] ✅ Database connection established')
    } catch (error) {
      console.error('[Instrumentation] ❌ Database connection failed:', error)
    }

    // Log environment info
    // eslint-disable-next-line no-console
    console.log('[Instrumentation] Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? '***configured***' : 'NOT SET',
      AUTH_URL: process.env.AUTH_URL || 'NOT SET',
    })

    // Graceful shutdown — clean up PG pool on Docker/process stop
    const shutdown = async () => {
      // eslint-disable-next-line no-console
      console.log('[Instrumentation] Shutting down gracefully...')
      try {
        const { prisma } = await import('@/lib/prisma')
        await prisma.$disconnect()
        // eslint-disable-next-line no-console
        console.log('[Instrumentation] Database disconnected')
      } catch (_e) {
        // Ignore disconnect errors during shutdown
      }
      process.exit(0)
    }
    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)
  }

  // Edge runtime initialization (middleware)
  if (process.env.NEXT_RUNTIME === 'edge') {
    // eslint-disable-next-line no-console
    console.log('[Instrumentation] Edge runtime initialized')
  }
}

/**
 * Called when an uncaught exception occurs
 * Use for error reporting services like Sentry
 */
export async function onRequestError(
  error: Error,
  request: {
    path: string
    method: string
    headers: Record<string, string>
  },
  context: {
    routerKind: 'Pages Router' | 'App Router'
    routePath: string
    routeType: 'render' | 'route' | 'action' | 'middleware'
    renderSource: 'react-server-components' | 'react-server-components-payload' | 'server-rendering'
    revalidateReason: 'on-demand' | 'stale' | undefined
    renderType: 'dynamic' | 'dynamic-resume'
  }
) {
  console.error('[Instrumentation] Request error:', {
    error: error.message,
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
  })
  
  // Send to Sentry if configured
  if (process.env.SENTRY_DSN) {
    const Sentry = await import('@sentry/nextjs')
    Sentry.captureException(error, { 
      extra: { 
        path: request.path,
        method: request.method,
        routePath: context.routePath,
        routeType: context.routeType,
        routerKind: context.routerKind,
      } 
    })
  }
}
