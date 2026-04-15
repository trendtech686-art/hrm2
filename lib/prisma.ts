/**
 * Prisma Client Singleton - Prisma 7 with Driver Adapter
 * 
 * @see https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql
 */
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const isDev = process.env.NODE_ENV !== 'production'

// Strip quotes from DATABASE_URL if present (dotenv may include them)
let connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

// Remove surrounding quotes if present
connectionString = connectionString.replace(/^["']|["']$/g, '')

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// Reuse pool across HMR in dev to prevent connection leaks
const pool = globalForPrisma.pool ?? new Pool({
  connectionString,
  // Dev: smaller pool, longer timeouts (Turbopack compile blocks event loop)
  // Prod: larger pool, shorter timeouts
  max: isDev
    ? parseInt(process.env.DATABASE_POOL_SIZE || '5', 10)
    : parseInt(process.env.DATABASE_POOL_SIZE || '20', 10),
  idleTimeoutMillis: isDev ? 60_000 : 30_000,
  connectionTimeoutMillis: isDev ? 30_000 : 10_000,
  // Keep TCP connections alive to prevent timeout during long compiles
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
  // Fail fast on broken connections instead of hanging
  allowExitOnIdle: isDev,
})

if (isDev) globalForPrisma.pool = pool

// Log pool errors to prevent unhandled rejections
pool.on('error', (err) => {
  console.error('[Prisma Pool] Unexpected pool error:', err.message)
})

const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  // Dev: only error+warn (query log causes significant overhead)
  log: isDev
    ? [
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ]
    : ['error'],
})

if (isDev) globalForPrisma.prisma = prisma

// Default export for backwards compatibility
export default prisma
