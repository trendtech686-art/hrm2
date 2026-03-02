import { healthCheck, getStats } from '@/lib/meilisearch'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

/**
 * Meilisearch Health & Stats API
 * 
 * GET /api/search/health - Check Meilisearch status
 */

export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const isHealthy = await healthCheck()
    
    if (!isHealthy) {
      return NextResponse.json({
        status: 'unavailable',
        message: 'Meilisearch is not running. Start with: docker-compose up -d meilisearch',
      }, { status: 503 })
    }
    
    const stats = await getStats()
    
    return NextResponse.json({
      status: 'available',
      indexes: stats.indexes,
      lastUpdate: stats.lastUpdate,
    })
  } catch (error) {
    console.error('Meilisearch health check error:', error)
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
