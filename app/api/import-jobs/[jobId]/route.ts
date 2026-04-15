import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

interface Params {
  params: Promise<{ jobId: string }>
}

/**
 * GET /api/import-jobs/[jobId]
 * 
 * Get status and details of a specific import job
 */
export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await requireAuth()
    if (!session) return apiError('Unauthorized', 401)

    const { jobId } = await params

    const job = await prisma.importExportLog.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        type: true,
        entityType: true,
        status: true,
        totalRecords: true,
        successCount: true,
        errorCount: true,
        skippedCount: true,
        insertedCount: true,
        updatedCount: true,
        progress: true,
        processedRecords: true,
        currentChunk: true,
        totalChunks: true,
        fileName: true,
        fileSize: true,
        importMode: true,
        branchId: true,
        errors: true,
        performedAt: true,
        startedAt: true,
        completedAt: true,
        performedBy: true,
        userId: true,
      },
    })

    if (!job) {
      return apiError('Job not found', 404)
    }

    // Parse errors JSON if exists
    let errors: unknown[] = []
    try { errors = job.errors ? JSON.parse(job.errors) : [] } catch { errors = [] }

    return apiSuccess({
      ...job,
      errors,
      // Calculate duration
      duration: job.startedAt && job.completedAt
        ? Math.round((new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()) / 1000)
        : null,
      // Calculate speed (records per second)
      speed: job.startedAt && job.completedAt && job.processedRecords > 0
        ? Math.round(job.processedRecords / ((new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()) / 1000))
        : null,
    })
  } catch (error) {
    logError('Error getting import job', error)
    return apiError('Failed to get import job', 500)
  }
}

/**
 * DELETE /api/import-jobs/[jobId]
 * 
 * Cancel a pending/processing import job
 */
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await requireAuth()
    if (!session) return apiError('Unauthorized', 401)

    const { jobId } = await params

    const job = await prisma.importExportLog.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      return apiError('Job not found', 404)
    }

    if (job.status === 'completed' || job.status === 'failed') {
      return apiError('Cannot cancel completed or failed jobs', 400)
    }

    // Mark as cancelled
    await prisma.importExportLog.update({
      where: { id: jobId },
      data: {
        status: 'cancelled',
        completedAt: new Date(),
        importData: null, // Clear data
      },
    })

    return apiSuccess({ message: 'Job cancelled' })
  } catch (error) {
    logError('Error cancelling import job', error)
    return apiError('Failed to cancel import job', 500)
  }
}
