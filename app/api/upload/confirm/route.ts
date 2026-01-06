// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD API - Confirm Staging Files
// ═══════════════════════════════════════════════════════════════
// POST /api/upload/confirm - Convert staging files to permanent
// Called when user saves the form (e.g., creating/updating employee)
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ConfirmRequest {
  fileIds?: string[]        // Specific file IDs to confirm
  sessionId?: string        // Confirm all files with this sessionId
  entityType?: string       // Update entityType when confirming
  entityId?: string         // Update entityId when confirming
}

// POST /api/upload/confirm - Confirm staging files
export async function POST(request: NextRequest) {
  try {
    const body: ConfirmRequest = await request.json()
    const { fileIds, sessionId, entityType, entityId } = body
    
    if (!fileIds?.length && !sessionId) {
      return NextResponse.json(
        { success: false, message: 'Cần cung cấp fileIds hoặc sessionId' },
        { status: 400 }
      )
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
    
    // Update all matching files
    const result = await prisma.file.updateMany({
      where,
      data: updateData,
    })
    
    // Get confirmed files to return
    const confirmedFiles = await prisma.file.findMany({
      where: fileIds?.length 
        ? { systemId: { in: fileIds } }
        : sessionId 
          ? { sessionId }
          : {},
    })
    
    return NextResponse.json({
      success: true,
      message: `Đã xác nhận ${result.count} file`,
      data: {
        confirmedCount: result.count,
        files: confirmedFiles.map(f => ({
          id: f.systemId,
          fileName: f.filename,
          originalName: f.originalName,
          mimeType: f.mimetype,
          fileSize: f.filesize,
          url: `/uploads/${f.filepath}`,
          entityType: f.entityType,
          entityId: f.entityId,
          status: f.status,
        })),
      },
    })
    
  } catch (error) {
    console.error('Confirm staging files error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xác nhận file' },
      { status: 500 }
    )
  }
}

// DELETE /api/upload/confirm - Cancel/delete staging files
// Called when user cancels the form
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const fileIdsParam = searchParams.get('fileIds')
    const fileIds = fileIdsParam ? fileIdsParam.split(',') : []
    
    if (!fileIds.length && !sessionId) {
      return NextResponse.json(
        { success: false, message: 'Cần cung cấp fileIds hoặc sessionId' },
        { status: 400 }
      )
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
    
    return NextResponse.json({
      success: true,
      message: `Đã xóa ${result.count} file staging`,
      data: {
        deletedCount: result.count,
        deletedFiles: filesToDelete.map(f => f.systemId),
      },
    })
    
  } catch (error) {
    console.error('Cancel staging files error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa file staging' },
      { status: 500 }
    )
  }
}
