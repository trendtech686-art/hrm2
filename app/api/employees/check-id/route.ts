/**
 * Employee ID Uniqueness Check API
 * 
 * GET /api/employees/check-id?id=xxx&exclude=yyy
 * Returns { exists: boolean } — whether the business ID is already taken
 * 
 * ✅ Phase A6: Replaces client-side useAllEmployees() for ID validation
 */

import { prisma } from '@/lib/prisma'
import { apiSuccess } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const exclude = searchParams.get('exclude') // Exclude current employee's ID when editing

  if (!id) {
    return apiSuccess({ exists: false })
  }

  const where: { id: string; NOT?: { id: string } } = { id }
  if (exclude) {
    where.NOT = { id: exclude }
  }

  const count = await prisma.employee.count({ where })

  return apiSuccess({ exists: count > 0 })
})
