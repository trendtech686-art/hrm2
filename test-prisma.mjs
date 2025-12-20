/**
 * Test Prisma 7 connection directly
 */
import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

console.log('DATABASE_URL:', connectionString ? 'Set' : 'Not set')

if (!connectionString) {
  console.error('DATABASE_URL is not set!')
  process.exit(1)
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    console.log('Testing database connection...')
    
    // Test simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Connection successful:', result)
    
    // Count users
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
