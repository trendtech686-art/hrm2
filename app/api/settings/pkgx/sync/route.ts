/**
 * PKGX Manual Sync API
 * POST /api/settings/pkgx/sync — Trigger manual sync (HRM → PKGX)
 * GET  /api/settings/pkgx/sync — Get sync log history
 */

import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { runPkgxSync, getPkgxSyncLogs } from '@/lib/pkgx/sync-service'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export const POST = apiHandler(async (_req, { session }) => {
  const result = await runPkgxSync(
    'manual',
    session!.user.id,
    session!.user.name || session!.user.email || undefined,
  )

  if (!result.success && result.error) {
    return apiError(result.error, 400)
  }

  return apiSuccess(result)
}, { permission: 'edit_products' })

export const GET = apiHandler(async () => {
  const logs = await getPkgxSyncLogs()
  return apiSuccess(logs)
}, { permission: 'view_products' })
