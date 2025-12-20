// ═══════════════════════════════════════════════════════════════
// FILE DELETE/UPDATE API
// ═══════════════════════════════════════════════════════════════
// DELETE /api/upload/[id] - Delete file
// PATCH /api/upload/[id] - Update file metadata
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteFileFromDisk } from '@/lib/upload-utils'

// GET /api/upload/[id] - Get single file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const file = await prisma.fileUpload.findUnique({
      where: { systemId: id },
    })
    
    if (!file || file.isDeleted) {
      return NextResponse.json(
        { success: false, message: 'File không tồn tại' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: file.systemId,
        fileName: file.fileName,
        originalName: file.originalName,
        mimeType: file.mimeType,
        fileSize: file.fileSize,
        url: file.publicUrl,
        entityType: file.entityType,
        entityId: file.entityId,
        createdAt: file.createdAt,
      },
    })
    
  } catch (error) {
    console.error('Get file error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lấy thông tin file' },
      { status: 500 }
    )
  }
}

// DELETE /api/upload/[id] - Soft delete file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const file = await prisma.fileUpload.findUnique({
      where: { systemId: id },
    })
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'File không tồn tại' },
        { status: 404 }
      )
    }
    
    // Check query param for hard delete
    const { searchParams } = new URL(request.url)
    const hardDelete = searchParams.get('hard') === 'true'
    
    if (hardDelete) {
      // Delete from disk
      await deleteFileFromDisk(file.storagePath)
      
      // Delete from database
      await prisma.fileUpload.delete({
        where: { systemId: id },
      })
      
      return NextResponse.json({
        success: true,
        message: 'File đã được xóa vĩnh viễn',
      })
    } else {
      // Soft delete
      await prisma.fileUpload.update({
        where: { systemId: id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      })
      
      return NextResponse.json({
        success: true,
        message: 'File đã được xóa',
      })
    }
    
  } catch (error) {
    console.error('Delete file error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa file' },
      { status: 500 }
    )
  }
}

// PATCH /api/upload/[id] - Update file metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const file = await prisma.fileUpload.findUnique({
      where: { systemId: id },
    })
    
    if (!file || file.isDeleted) {
      return NextResponse.json(
        { success: false, message: 'File không tồn tại' },
        { status: 404 }
      )
    }
    
    // Update allowed fields
    const updateData: Record<string, unknown> = {}
    
    if (body.entityType !== undefined) {
      updateData.entityType = body.entityType
    }
    if (body.entityId !== undefined) {
      updateData.entityId = body.entityId
    }
    if (body.isPublic !== undefined) {
      updateData.isPublic = body.isPublic
    }
    if (body.metadata !== undefined) {
      updateData.metadata = {
        ...(file.metadata as object || {}),
        ...body.metadata,
      }
    }
    
    const updated = await prisma.fileUpload.update({
      where: { systemId: id },
      data: updateData,
    })
    
    return NextResponse.json({
      success: true,
      message: 'Cập nhật thành công',
      data: {
        id: updated.systemId,
        entityType: updated.entityType,
        entityId: updated.entityId,
      },
    })
    
  } catch (error) {
    console.error('Update file error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi cập nhật file' },
      { status: 500 }
    )
  }
}
