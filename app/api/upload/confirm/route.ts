// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD API - Confirm Staging Files
// ═══════════════════════════════════════════════════════════════
// POST /api/upload/confirm - Convert staging files to permanent
// Called when user saves the form (e.g., creating/updating employee)
// ═══════════════════════════════════════════════════════════════

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { confirmFilesSchema } from './validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/upload/confirm - Confirm staging files
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, confirmFilesSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const { fileIds, sessionId, entityType, entityId, documentType, documentName } = validation.data

  try {
    if (!fileIds?.length && !sessionId) {
      return apiError('Cần cung cấp fileIds hoặc sessionId', 400)
    }
    
    // Build where clause
    const where: Record<string, unknown> = {
      status: 'staging',
    }
    
    if (fileIds?.length) {
      where.systemId = { in: fileIds }
    }
    
    if (sessionId) {
      where.sessionId = sessionId
    }
    
    // DEBUG: Log what we're searching for
    console.log('[API /upload/confirm] Searching for files:', { where, sessionId, fileIds });
    
    // Check if any files exist with this sessionId (regardless of status)
    const existingFiles = await prisma.file.findMany({
      where: sessionId ? { sessionId } : { systemId: { in: fileIds || [] } },
      select: { systemId: true, sessionId: true, status: true, filename: true },
    });
    console.log('[API /upload/confirm] Existing files with sessionId:', existingFiles);
    
    // Build update data
    const updateData: Record<string, unknown> = {
      status: 'permanent',
    }
    
    if (entityType) {
      updateData.entityType = entityType
    }
    
    if (entityId) {
      updateData.entityId = entityId
    }
    
    if (documentType) {
      updateData.documentType = documentType
    }
    
    // Store documentName in documentType if provided (format: type::name)
    if (documentName && documentType) {
      updateData.documentType = `${documentType}::${documentName}`
    }
    
    // Update all matching files
    const result = await prisma.file.updateMany({
      where,
      data: updateData,
    })
    
    console.log('[API /upload/confirm] Updated files count:', result.count);
    
    // Get confirmed files to return
    const confirmedFiles = await prisma.file.findMany({
      where: fileIds?.length 
        ? { systemId: { in: fileIds } }
        : sessionId 
          ? { sessionId }
          : {},
    })
    
    // Normalize filepath to use forward slashes for URLs
    const normalizeUrl = (filepath: string) => `/api/files/${filepath.replace(/\\/g, '/')}`;
    
    console.log('[API /upload/confirm] Returning confirmed files:', confirmedFiles.map(f => ({
      id: f.systemId,
      url: normalizeUrl(f.filepath),
      status: f.status,
    })));
    
    return apiSuccess({
      success: true,
      message: `Đã xác nhận ${result.count} file`,
      confirmedCount: result.count,
      files: confirmedFiles.map(f => ({
        id: f.systemId,
        fileName: f.filename,
        originalName: f.originalName,
        mimeType: f.mimetype,
        fileSize: f.filesize,
        url: normalizeUrl(f.filepath),
        entityType: f.entityType,
        entityId: f.entityId,
        status: f.status,
      })),
    })
    
  } catch (error) {
    console.error('Confirm staging files error:', error)
    return apiError('Lỗi khi xác nhận file', 500)
  }
}

// DELETE /api/upload/confirm - Cancel/delete staging files
// Called when user cancels the form
export async function DELETE(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const fileIdsParam = searchParams.get('fileIds')
    const fileIds = fileIdsParam ? fileIdsParam.split(',') : []
    
    if (!fileIds.length && !sessionId) {
      return apiError('Cần cung cấp fileIds hoặc sessionId', 400)
    }
    
    // Build where clause - only delete staging files
    const where: Record<string, unknown> = {
      status: 'staging',
    }
    
    if (fileIds.length) {
      where.systemId = { in: fileIds }
    }
    
    if (sessionId) {
      where.sessionId = sessionId
    }
    
    // Get files to delete (for removing from disk)
    const filesToDelete = await prisma.file.findMany({ where })
    
    // Delete from database
    const result = await prisma.file.deleteMany({ where })
    
    // TODO: Also delete files from disk
    // For now, the cleanup job will handle orphan files
    
    return apiSuccess({
      success: true,
      message: `Đã xóa ${result.count} file staging`,
      deletedCount: result.count,
      deletedFiles: filesToDelete.map(f => f.systemId),
    })
    
  } catch (error) {
    console.error('Cancel staging files error:', error)
    return apiError('Lỗi khi xóa file staging', 500)
  }
}
