/**
 * Prisma Client Singleton - Prisma 7 with Driver Adapter
 * 
 * @see https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql
 */
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Strip quotes from DATABASE_URL if present (dotenv may include them)
let connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

// Remove surrounding quotes if present
connectionString = connectionString.replace(/^["']|["']$/g, '')

const pool = new Pool({ 
  connectionString,
  // Pool configuration for production stability
  max: parseInt(process.env.DATABASE_POOL_SIZE || '20', 10),
  idleTimeoutMillis: 30000,       // Close idle connections after 30s
  connectionTimeoutMillis: 10000,  // Fail fast if can't connect in 10s
})
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Default export for backwards compatibility
export default prisma
