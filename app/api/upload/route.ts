// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD API - Next.js App Router with Staging Support
// ═══════════════════════════════════════════════════════════════
// POST /api/upload - Upload file (permanent or staging)
// 
// Staging Workflow:
// 1. Upload with status='staging' + sessionId → file saved as temp
// 2. User saves form → POST /api/upload/confirm → converts to permanent
// 3. User cancels → DELETE /api/upload/confirm → deletes staging files
// 4. Cleanup job deletes orphan staging files after 24h
//
// Direct Workflow:
// 1. Upload with status='permanent' → file saved immediately
// 
// Supports: employees, products, customers, warranty, complaints, tasks, wiki
// ═══════════════════════════════════════════════════════════════

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { checkRateLimit } from '@/lib/security-utils'
import { logError } from '@/lib/logger'
import {
  parseFormData,
  validateFileType,
  validateFileSize,
  validateExtension,
  generateFileName,
  generateFileHash,
  saveFileToDisk,
  getPublicUrl,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_ALL_TYPES,
  ALLOWED_EXTENSIONS,
  EntityType,
} from '@/lib/upload-utils'
import { getFileSizeLimits, getMaxFileSizeBytes } from '@/lib/file-size-limits'

// Route Segment Config - App Router uses these exports instead of config object
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// Allow large file uploads (default is ~1MB which blocks 10-50MB files)
export const maxDuration = 60 // seconds

// POST /api/upload
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  // Rate limit: 30 uploads per minute per user
  const rateLimit = checkRateLimit(`upload:${session.user?.email || 'anon'}`, 30, 60_000)
  if (!rateLimit.allowed) {
    return apiError('Upload quá nhanh. Vui lòng đợi.', 429)
  }

  try {
    const { file, fields } = await parseFormData(request)
    
    if (!file) {
      return apiError('Không có file được upload', 400)
    }
    
    // Get entity info from form fields
    const entityType = (fields.entityType || 'general') as EntityType
    const entityId = fields.entityId || undefined
    const isImage = fields.isImage === 'true'
    const documentName = fields.documentName || fields.documentType || null // thumbnail, gallery, etc.
    
    // Staging support: check if client wants staging or permanent
    const requestedStatus = fields.status === 'staging' ? 'staging' : 'permanent'
    const sessionId = fields.sessionId || null
    
    // Validate file type (MIME + extension)
    const allowedTypes = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_ALL_TYPES
    if (!validateFileType(file.type, allowedTypes)) {
      return apiError(`Loại file không được hỗ trợ: ${file.type}`, 400)
    }
    
    // Validate file extension matches allowed list (defense-in-depth against MIME spoofing)
    const allowedExts = isImage ? ALLOWED_EXTENSIONS.IMAGE : ALLOWED_EXTENSIONS.ALL
    if (!validateExtension(file.name, allowedExts)) {
      return apiError(`Phần mở rộng file không được hỗ trợ`, 400)
    }
    
    // Validate file size
    const fileSizeLimits = await getFileSizeLimits()
    const maxFileSizes = getMaxFileSizeBytes(fileSizeLimits)
    const maxSize = isImage ? maxFileSizes.image : maxFileSizes.default
    if (!validateFileSize(file.size, maxSize)) {
      const maxMB = maxSize / (1024 * 1024)
      return apiError(`File quá lớn. Tối đa ${maxMB}MB`, 400)
    }
    
    // Read file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Generate unique filename
    const fileName = generateFileName(file.name)
    const _fileHash = generateFileHash(buffer)
    
    // Save to disk
    const { filePath: _filePath, relativePath } = await saveFileToDisk(
      buffer,
      entityType,
      fileName,
      entityId
    )
    
    // Get public URL
    const publicUrl = getPublicUrl(relativePath)
    
    // DEBUG: Log what we're saving
    
    // Save metadata to database - respect staging status from client
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
        documentType: documentName, // thumbnail, gallery, avatar, etc.
        uploadedBy: fields.userId || null,
        status: requestedStatus, // Respect client's staging/permanent choice
        sessionId: requestedStatus === 'staging' ? sessionId : null, // Only store sessionId for staging
      },
    })
    
    
    return apiSuccess({
      success: true,
      data: {
        id: fileRecord.systemId,
        fileName: fileRecord.filename,
        originalName: fileRecord.originalName,
        mimeType: fileRecord.mimetype,
        fileSize: fileRecord.filesize,
        url: publicUrl,
        entityType: entityType,
        entityId: entityId,
        documentName: documentName,
        status: requestedStatus,
        sessionId: requestedStatus === 'staging' ? sessionId : undefined,
      }
    }, 201)
    
  } catch (error) {
    logError('Upload error', error)
    return apiError('Lỗi khi upload file', 500)
  }
}

// GET /api/upload - Get upload info (only permanent files by default)
// Supports batch fetching with comma-separated entityIds
export async function GET(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { searchParams } = new URL(request.url)
  const entityType = searchParams.get('entityType')
  const entityId = searchParams.get('entityId')
  const entityIds = searchParams.get('entityIds') // Batch support: comma-separated IDs
  const includeStaging = searchParams.get('includeStaging') === 'true'
  const sessionId = searchParams.get('sessionId')
  
  try {
    const where: Record<string, unknown> = {}
    
    if (entityType) {
      where.entityType = entityType
    }
    
    // Support batch fetching with multiple entityIds
    if (entityIds) {
      const ids = entityIds.split(',').map(id => id.trim()).filter(Boolean)
      if (ids.length > 0) {
        where.entityId = { in: ids }
      }
    } else if (entityId) {
      where.entityId = entityId
    }
    
    // By default only show permanent files, unless includeStaging=true or sessionId provided
    if (sessionId) {
      where.sessionId = sessionId
    } else if (!includeStaging) {
      where.status = 'permanent'
    } else {
      where.status = { in: ['staging', 'permanent'] }
    }
    
    const files = await prisma.file.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      take: 500, // Increased for batch requests
    })
    
    return apiSuccess({
      success: true,
      data: files.map(f => {
        // documentType field now stores the document name directly (thumbnail, gallery, etc.)
        // Legacy format "type::name" is also supported for backward compatibility
        const docTypeParts = f.documentType?.split('::') || []
        const documentName = docTypeParts.length > 1 ? docTypeParts[1] : f.documentType || ''
        const documentType = docTypeParts.length > 1 ? docTypeParts[0] : ''
        
        return {
          id: f.systemId,
          fileName: f.filename,
          originalName: f.originalName,
          mimeType: f.mimetype,
          fileSize: f.filesize,
          url: `/api/files/${f.filepath}`,
          entityType: f.entityType,
          entityId: f.entityId,
          documentType: documentType,
          documentName: documentName,
          status: f.status,
          sessionId: f.sessionId,
          createdAt: f.uploadedAt,
        }
      })
    })
    
  } catch (error) {
    logError('Get files error', error)
    return apiError('Lỗi khi lấy danh sách file', 500)
  }
}
