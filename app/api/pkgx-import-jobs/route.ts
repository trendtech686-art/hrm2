/**
 * PKGX Import Jobs API
 * Manages import job tracking in ImportExportLog for PKGX bulk imports
 */

import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createJobSchema = z.object({
  entityType: z.enum(['products', 'brands', 'categories']),
  totalRecords: z.number().min(1),
  notes: z.string().optional(),
})

/**
 * POST /api/pkgx-import-jobs
 * Create a new import job record, return jobId
 */
export const POST = apiHandler(async (request, { session }) => {
  const body = await request.json()
  const parsed = createJobSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.message, 400)

  const { entityType, totalRecords } = parsed.data
  const userName = session?.user?.name || session?.user?.email || 'Hệ thống'

  const job = await prisma.importExportLog.create({
    data: {
      type: 'import',
      entityType: `pkgx_${entityType}`,
      status: 'processing',
      totalRecords,
      successCount: 0,
      errorCount: 0,
      skippedCount: 0,
      insertedCount: 0,
      updatedCount: 0,
      progress: 0,
      processedRecords: 0,
      currentChunk: 0,
      totalChunks: 0,
      performedBy: userName,
      userId: session!.user.id,
      performedAt: new Date(),
      startedAt: new Date(),
      notes: parsed.data.notes || `Import & Mapping ${entityType} từ PKGX`,
    },
  })

  return apiSuccess({ jobId: job.id }, 201)
}, { permission: 'create_products' })

/**
 * GET /api/pkgx-import-jobs?status=processing
 * List active import jobs for current user (for resume after F5)
 */
export const GET = apiHandler(async (request, { session: _session }) => {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const entityType = searchParams.get('entityType')

  const where: Record<string, unknown> = {
    type: 'import',
    entityType: { startsWith: 'pkgx_' },
  }
  if (status) where.status = status
  if (entityType) where.entityType = `pkgx_${entityType}`

  const jobs = await prisma.importExportLog.findMany({
    where,
    orderBy: { performedAt: 'desc' },
    take: 10,
    select: {
      id: true,
      entityType: true,
      status: true,
      totalRecords: true,
      successCount: true,
      errorCount: true,
      progress: true,
      processedRecords: true,
      performedAt: true,
      startedAt: true,
      completedAt: true,
      performedBy: true,
      errors: true,
      notes: true,
    },
  })

  return apiSuccess(jobs)
}, { permission: 'create_products' })
