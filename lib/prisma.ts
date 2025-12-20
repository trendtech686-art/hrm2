/**
 * Prisma Client Singleton - Prisma 7 with Driver Adapter
 * 
 * @see https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql
 */
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL!

const adapter = new PrismaPg({ connectionString })

const globalForPrisma = globalThis as unknown as {
  prisma: typeof prismaClient | undefined
}

const prismaClient = new PrismaClient({ adapter })

export const prisma = globalForPrisma.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
