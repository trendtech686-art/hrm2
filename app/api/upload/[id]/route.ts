// ═══════════════════════════════════════════════════════════════
// FILE DELETE/UPDATE API
// ═══════════════════════════════════════════════════════════════
// DELETE /api/upload/[id] - Delete file
// PATCH /api/upload/[id] - Update file metadata
// ═══════════════════════════════════════════════════════════════

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteFileFromDisk } from '@/lib/upload-utils'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateFileSchema } from './validation'
import { logError } from '@/lib/logger'

// GET /api/upload/[id] - Get single file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { id } = await params
    
    const file = await prisma.file.findUnique({
      where: { systemId: id },
    })
    
    if (!file) {
      return apiError('File không tồn tại', 404)
    }
    
    return apiSuccess({
      id: file.systemId,
      fileName: file.filename,
      originalName: file.originalName,
      mimeType: file.mimetype,
      fileSize: file.filesize,
      url: `/api/files/${file.filepath}`,
      entityType: file.entityType,
      entityId: file.entityId,
      createdAt: file.uploadedAt,
    })
    
  } catch (error) {
    logError('Get file error', error)
    return apiError('Lỗi khi lấy thông tin file', 500)
  }
}

// DELETE /api/upload/[id] - Soft delete file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { id } = await params
    
    const file = await prisma.file.findUnique({
      where: { systemId: id },
    })
    
    if (!file) {
      return apiError('File không tồn tại', 404)
    }
    
    // Check query param for hard delete
    const { searchParams } = new URL(request.url)
    const hardDelete = searchParams.get('hard') === 'true'
    
    if (hardDelete) {
      // Delete from disk
      await deleteFileFromDisk(file.filepath)
      
      // Delete from database
      await prisma.file.delete({
        where: { systemId: id },
      })
      
      return apiSuccess({ success: true, message: 'File đã được xóa vĩnh viễn' })
    } else {
      // Hard delete (soft delete not supported in schema)
      await deleteFileFromDisk(file.filepath)
      
      await prisma.file.delete({
        where: { systemId: id },
      })
      
      return apiSuccess({ success: true, message: 'File đã được xóa' })
    }
    
  } catch (error) {
    logError('Delete file error', error)
    return apiError('Lỗi khi xóa file', 500)
  }
}

// PATCH /api/upload/[id] - Update file metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateFileSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { id } = await params
    
    const file = await prisma.file.findUnique({
      where: { systemId: id },
    })
    
    if (!file) {
      return apiError('File không tồn tại', 404)
    }
    
    // Update allowed fields
    const updateData: Record<string, unknown> = {}
    
    if (body.entityType !== undefined) {
      updateData.entityType = body.entityType
    }
    if (body.entityId !== undefined) {
      updateData.entityId = body.entityId
    }
    if (body.documentType !== undefined) {
      updateData.documentType = body.documentType
    }
    
    const updated = await prisma.file.update({
      where: { systemId: id },
      data: updateData,
    })
    
    return apiSuccess({
      id: updated.systemId,
      entityType: updated.entityType,
      entityId: updated.entityId,
    })
    
  } catch (error) {
    logError('Update file error', error)
    return apiError('Lỗi khi cập nhật file', 500)
  }
}
