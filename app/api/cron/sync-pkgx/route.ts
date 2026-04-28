/**
 * PKGX Auto Sync Cron Job
 * Runs on schedule to push HRM data → PKGX for linked products
 *
 * Schedule: Every 30 minutes (configurable via syncSettings.intervalMinutes)
 * Auth: CRON_SECRET header (Vercel Cron)
 */

import { NextRequest } from 'next/server'
import { logError } from '@/lib/logger'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { runPkgxSync } from '@/lib/pkgx/sync-service'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    return process.env.NODE_ENV === 'development'
  }

  return authHeader === `Bearer ${cronSecret}`
}

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return apiError('Unauthorized', 401);
  }

  try {
    const result = await runPkgxSync('cron');

    return apiSuccess(result);
  } catch (error) {
    logError('[Cron sync-pkgx] Error', error)
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return apiError('Unauthorized', 401);
  }

  return apiSuccess({
    status: 'healthy',
    endpoint: 'sync-pkgx',
    description: 'PKGX auto sync cron (HRM → PKGX)',
  });
}
