/**
 * API Route: GET /api/employees/filter-options
 * 
 * Returns distinct department names and job title names for filter dropdowns.
 * This is MUCH cheaper than fetching all employees just to extract unique values.
 * 
 * Response: { departments: string[], jobTitles: string[] }
 */

import { prisma } from '@/lib/prisma'
import { apiSuccessCached } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'

export const dynamic = 'force-dynamic'

export const GET = apiHandler(async () => {
  // Run both queries in parallel — each uses SELECT DISTINCT via groupBy
  const [departmentResults, jobTitleResults] = await Promise.all([
    prisma.department.findMany({
      where: { isDeleted: false },
      select: { name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.jobTitle.findMany({
      where: { isDeleted: false },
      select: { name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return apiSuccessCached({
    departments: departmentResults.map(d => d.name),
    jobTitles: jobTitleResults.map(j => j.name),
  })
})
