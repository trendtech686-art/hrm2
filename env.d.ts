/**
 * Next.js Environment Variables Type Declarations
 * Runtime validation is in lib/env.ts
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Required
    readonly DATABASE_URL: string
    readonly AUTH_SECRET: string
    
    // Optional
    readonly AUTH_URL?: string
    readonly NEXTAUTH_URL?: string
    readonly NEXTAUTH_DEBUG?: string
    readonly SENTRY_DSN?: string
    readonly SENTRY_AUTH_TOKEN?: string
    readonly CRON_SECRET?: string
    readonly MEILISEARCH_HOST?: string
    readonly MEILISEARCH_MASTER_KEY?: string
    readonly GHTK_TOKEN?: string
    readonly NODE_ENV: 'development' | 'production' | 'test'
    
    // Next.js internal
    readonly NEXT_RUNTIME?: 'nodejs' | 'edge'
  }
}
