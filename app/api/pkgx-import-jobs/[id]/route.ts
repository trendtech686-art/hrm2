/**
 * PKGX Import Jobs - Single Job API
 * Update progress, cancel, get status
 */

import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const updateSchema = z.object({
  processedRecords: z.number().optional(),
  successCount: z.number().optional(),
  errorCount: z.number().optional(),
  insertedCount: z.number().optional(),
  updatedCount: z.number().optional(),
  skippedCount: z.number().optional(),
  status: z.enum(['processing', 'completed', 'partial', 'failed', 'cancelled']).optional(),
  errors: z.string().optional(),
  notes: z.string().optional(),
})

/**
 * GET /api/pkgx-import-jobs/[id]
 * Get job status (for polling / resume)
 */
export const GET = apiHandler(async (_request, { params }) => {
  const { id } = params

  const job = await prisma.importExportLog.findUnique({
    where: { id },
    select: {
      id: true,
      entityType: true,
      status: true,
      totalRecords: true,
      successCount: true,
      errorCount: true,
      insertedCount: true,
      updatedCount: true,
      skippedCount: true,
      progress: true,
      processedRecords: true,
      startedAt: true,
      completedAt: true,
      performedBy: true,
      errors: true,
      notes: true,
    },
  })

  if (!job) return apiError('Job not found', 404)
  return apiSuccess(job)
}, { permission: 'create_products' })

/**
 * PATCH /api/pkgx-import-jobs/[id]
 * Update job progress from client
 */
export const PATCH = apiHandler(async (request, { params }) => {
  const { id } = params
  const body = await request.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.message, 400)

  const updates = parsed.data

  // Calculate progress percentage
  const data: Record<string, unknown> = { ...updates }

  if (updates.processedRecords !== undefined) {
    const job = await prisma.importExportLog.findUnique({
      where: { id },
      select: { totalRecords: true },
    })
    if (job) {
      data.progress = Math.round((updates.processedRecords / job.totalRecords) * 100)
    }
  }

  // Set completedAt when status is final
  if (updates.status && ['completed', 'partial', 'failed', 'cancelled'].includes(updates.status)) {
    data.completedAt = new Date()
    data.progress = updates.status === 'cancelled' ? data.progress : 100
  }

  const updated = await prisma.importExportLog.update({
    where: { id },
    data,
    select: {
      id: true,
      status: true,
      progress: true,
      processedRecords: true,
      successCount: true,
      errorCount: true,
    },
  })

  return apiSuccess(updated)
}, { permission: 'create_products' })
