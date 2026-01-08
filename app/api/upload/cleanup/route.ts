// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD API - Cleanup Orphan Staging Files
// ═══════════════════════════════════════════════════════════════
// POST /api/upload/cleanup - Delete staging files older than threshold
// Should be called periodically (cron job) or manually by admin
// ═══════════════════════════════════════════════════════════════

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { cleanupStagingSchema } from './validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Default cleanup threshold: 24 hours
const DEFAULT_THRESHOLD_HOURS = 24

// POST /api/upload/cleanup - Cleanup old staging files
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, cleanupStagingSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const thresholdHours = body.thresholdHours || DEFAULT_THRESHOLD_HOURS
    
    // Calculate threshold date
    const thresholdDate = new Date()
    thresholdDate.setHours(thresholdDate.getHours() - thresholdHours)
    
    // Find staging files older than threshold
    const oldStagingFiles = await prisma.file.findMany({
      where: {
        status: 'staging',
        uploadedAt: {
          lt: thresholdDate,
        },
      },
    })
    
    if (oldStagingFiles.length === 0) {
      return apiSuccess({
        message: 'Không có file staging cần dọn dẹp',
        deletedCount: 0,
        deletedFiles: [],
      })
    }
    
    // Delete files from disk
    const uploadDir = path.join(process.cwd(), 'uploads')
    const deleteResults: { id: string; deleted: boolean; error?: string }[] = []
    
    for (const file of oldStagingFiles) {
      const filePath = path.join(uploadDir, file.filepath)
      try {
        await fs.unlink(filePath)
        deleteResults.push({ id: file.systemId, deleted: true })
      } catch (err) {
        // File might already be deleted or not exist
        const error = err instanceof Error ? err.message : 'Unknown error'
        deleteResults.push({ id: file.systemId, deleted: false, error })
      }
    }
    
    // Delete from database
    const result = await prisma.file.deleteMany({
      where: {
        systemId: {
          in: oldStagingFiles.map(f => f.systemId),
        },
      },
    })
    
    return apiSuccess({
      message: `Đã dọn dẹp ${result.count} file staging cũ hơn ${thresholdHours} giờ`,
      deletedCount: result.count,
      thresholdHours,
      deletedFiles: deleteResults,
    })
    
  } catch (error) {
    console.error('Cleanup staging files error:', error)
    return apiError('Lỗi khi dọn dẹp file staging', 500)
  }
}

// GET /api/upload/cleanup - Get cleanup stats (preview what would be deleted)
export async function GET(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const thresholdHours = parseInt(searchParams.get('thresholdHours') || String(DEFAULT_THRESHOLD_HOURS))
    
    // Calculate threshold date
    const thresholdDate = new Date()
    thresholdDate.setHours(thresholdDate.getHours() - thresholdHours)
    
    // Count staging files older than threshold
    const oldStagingCount = await prisma.file.count({
      where: {
        status: 'staging',
        uploadedAt: {
          lt: thresholdDate,
        },
      },
    })
    
    // Get total staging files
    const totalStagingCount = await prisma.file.count({
      where: {
        status: 'staging',
      },
    })
    
    // Get total permanent files
    const totalPermanentCount = await prisma.file.count({
      where: {
        status: 'permanent',
      },
    })
    
    // Get total disk usage (staging)
    const stagingFiles = await prisma.file.aggregate({
      where: { status: 'staging' },
      _sum: { filesize: true },
    })
    
    // Get total disk usage (permanent)
    const permanentFiles = await prisma.file.aggregate({
      where: { status: 'permanent' },
      _sum: { filesize: true },
    })
    
    return apiSuccess({
      cleanup: {
        thresholdHours,
        thresholdDate: thresholdDate.toISOString(),
        filesWouldBeDeleted: oldStagingCount,
      },
      staging: {
        totalFiles: totalStagingCount,
        totalSize: stagingFiles._sum.filesize || 0,
        totalSizeFormatted: formatBytes(stagingFiles._sum.filesize || 0),
      },
      permanent: {
        totalFiles: totalPermanentCount,
        totalSize: permanentFiles._sum.filesize || 0,
        totalSizeFormatted: formatBytes(permanentFiles._sum.filesize || 0),
      },
    })
    
  } catch (error) {
    console.error('Get cleanup stats error:', error)
    return apiError('Lỗi khi lấy thông tin cleanup', 500)
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
