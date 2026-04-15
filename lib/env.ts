/**
 * Runtime Environment Variable Validation
 * 
 * Import this in instrumentation.ts register() to fail fast on startup
 * if critical env vars are missing or malformed.
 */

import { z } from 'zod'

const serverEnvSchema = z.object({
  // Required — server will not start without these
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  AUTH_SECRET: z.string().min(16, 'AUTH_SECRET must be at least 16 characters'),

  // Optional with defaults
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Optional services
  AUTH_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  SENTRY_DSN: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  MEILISEARCH_HOST: z.string().optional(),
  MEILISEARCH_MASTER_KEY: z.string().optional(),
  GHTK_TOKEN: z.string().optional(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

let _env: ServerEnv | null = null

/**
 * Validates environment variables at runtime.
 * Call once during server startup (instrumentation.ts).
 * Throws ZodError with details on missing/invalid vars.
 */
export function validateEnv(): ServerEnv {
  if (_env) return _env
  _env = serverEnvSchema.parse(process.env)
  return _env
}

/**
 * Get validated env (throws if validateEnv() hasn't been called)
 */
export function getEnv(): ServerEnv {
  if (!_env) return validateEnv()
  return _env
}
