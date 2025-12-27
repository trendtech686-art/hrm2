// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD API - Main Upload Route
// ═══════════════════════════════════════════════════════════════
// POST /api/upload - Upload file
// Supports: employees, products, customers, warranty, complaints, tasks, wiki
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import {
  parseFormData,
  validateFileType,
  validateFileSize,
  generateFileName,
  generateFileHash,
  saveFileToDisk,
  getPublicUrl,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_ALL_TYPES,
  MAX_FILE_SIZE,
  EntityType,
} from '@/lib/upload-utils'

// Route Segment Config - App Router uses these exports instead of config object
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/upload
export async function POST(request: NextRequest) {
  try {
    const { file, fields } = await parseFormData(request)
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Không có file được upload' },
        { status: 400 }
      )
    }
    
    // Get entity info from form fields
    const entityType = (fields.entityType || 'general') as EntityType
    const entityId = fields.entityId || undefined
    const isImage = fields.isImage === 'true'
    
    // Validate file type
    const allowedTypes = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_ALL_TYPES
    if (!validateFileType(file.type, allowedTypes)) {
      return NextResponse.json(
        { success: false, message: `Loại file không được hỗ trợ: ${file.type}` },
        { status: 400 }
      )
    }
    
    // Validate file size
    const maxSize = isImage ? MAX_FILE_SIZE.image : MAX_FILE_SIZE.default
    if (!validateFileSize(file.size, maxSize)) {
      const maxMB = maxSize / (1024 * 1024)
      return NextResponse.json(
        { success: false, message: `File quá lớn. Tối đa ${maxMB}MB` },
        { status: 400 }
      )
    }
    
    // Read file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Generate unique filename
    const fileName = generateFileName(file.name)
    const fileHash = generateFileHash(buffer)
    
    // Save to disk
    const { filePath, relativePath } = await saveFileToDisk(
      buffer,
      entityType,
      fileName,
      entityId
    )
    
    // Get public URL
    const publicUrl = getPublicUrl(relativePath)
    
    // Save metadata to database
    const fileRecord = await prisma.file.create({
      data: {
        systemId: uuidv4(),
        filename: fileName,
        originalName: file.name,
        mimetype: file.type,
        filesize: file.size,
        filepath: relativePath,
        entityType: entityType,
        entityId: entityId || '',
        documentType: fields.documentType || null,
        uploadedBy: fields.userId || null,
      },
    })
    
    return NextResponse.json({
      success: true,
      message: 'Upload thành công',
      data: {
        id: fileRecord.systemId,
        fileName: fileRecord.filename,
        originalName: fileRecord.originalName,
        mimeType: fileRecord.mimetype,
        fileSize: fileRecord.filesize,
        url: publicUrl,
        entityType: entityType,
        entityId: entityId,
      },
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi upload file' },
      { status: 500 }
    )
  }
}

// GET /api/upload - Get upload info
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const entityType = searchParams.get('entityType')
  const entityId = searchParams.get('entityId')
  
  try {
    const where: Record<string, unknown> = {}
    
    if (entityType) {
      where.entityType = entityType
    }
    if (entityId) {
      where.entityId = entityId
    }
    
    const files = await prisma.file.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      take: 100,
    })
    
    return NextResponse.json({
      success: true,
      data: files.map(f => ({
        id: f.systemId,
        fileName: f.filename,
        originalName: f.originalName,
        mimeType: f.mimetype,
        fileSize: f.filesize,
        url: `/uploads/${f.filepath}`,
        entityType: f.entityType,
        entityId: f.entityId,
        createdAt: f.uploadedAt,
      })),
    })
    
  } catch (error) {
    console.error('Get files error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lấy danh sách file' },
      { status: 500 }
    )
  }
}
