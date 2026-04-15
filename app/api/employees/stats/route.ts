/**
 * API Route: GET /api/employees/stats
 * Returns employee statistics
 */

import { getEmployeeStats } from '@/lib/data/employees'
import { apiSuccess } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'

export const GET = apiHandler(async () => {
  const stats = await getEmployeeStats()
  return apiSuccess(stats)
})
