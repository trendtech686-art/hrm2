/**
 * GET /api/reconciliation-sheets/carriers
 * Returns distinct carrier names from packagings that have COD
 */

import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export const GET = apiHandler(async (_req, _ctx) => {
  const carriers = await prisma.$queryRawUnsafe(`
    SELECT DISTINCT carrier, COUNT(*)::int as cnt
    FROM packagings
    WHERE carrier IS NOT NULL
      AND "codAmount" > 0
      AND "trackingCode" IS NOT NULL
      AND "sourceType" = 'ORDER'
    GROUP BY carrier
    ORDER BY cnt DESC
  `) as Array<{ carrier: string; cnt: number }>

  return apiSuccess(carriers.map(c => c.carrier))
}, { permission: 'view_reconciliation' })
