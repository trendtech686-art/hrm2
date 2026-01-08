import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-utils'

// Health check endpoint - No auth required
export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    return apiSuccess({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return apiError(error instanceof Error ? error.message : 'Unknown error', 503)
  }
}
