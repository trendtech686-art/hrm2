// ═══════════════════════════════════════════════════════════════
// IMAGE UPLOAD API - Optimized for images with resize
// ═══════════════════════════════════════════════════════════════
// POST /api/upload/image - Upload image with optional resize
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import {
  parseFormData,
  validateFileType,
  validateFileSize,
  generateFileName,
  generateFileHash,
  saveFileToDisk,
  getPublicUrl,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  EntityType,
} from '@/lib/upload-utils'

// Image sizes for thumbnails
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 },
}

export async function POST(request: NextRequest) {
  try {
    const { file, fields } = await parseFormData(request)
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Không có file được upload' },
        { status: 400 }
      )
    }
    
    // Validate image type
    if (!validateFileType(file.type, ALLOWED_IMAGE_TYPES)) {
      return NextResponse.json(
        { success: false, message: `Chỉ chấp nhận file ảnh: ${ALLOWED_IMAGE_TYPES.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Validate file size
    if (!validateFileSize(file.size, MAX_FILE_SIZE.image)) {
      return NextResponse.json(
        { success: false, message: `Ảnh quá lớn. Tối đa ${MAX_FILE_SIZE.image / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }
    
    // Get entity info
    const entityType = (fields.entityType || 'general') as EntityType
    const entityId = fields.entityId || undefined
    const createThumbnail = fields.thumbnail !== 'false'
    const resizeTo = fields.resize as keyof typeof IMAGE_SIZES | undefined
    
    // Read file buffer
    const bytes = await file.arrayBuffer()
    let buffer = Buffer.from(bytes)
    
    // Process with sharp
    let sharpInstance = sharp(buffer)
    const metadata = await sharpInstance.metadata()
    
    // Resize if requested
    if (resizeTo && IMAGE_SIZES[resizeTo]) {
      const size = IMAGE_SIZES[resizeTo]
      sharpInstance = sharpInstance.resize(size.width, size.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }
    
    // Convert to webp for optimization (except SVG)
    const outputFormat = file.type === 'image/svg+xml' ? 'svg' : 'webp'
    if (outputFormat === 'webp') {
      sharpInstance = sharpInstance.webp({ quality: 85 })
    }
    
    buffer = await sharpInstance.toBuffer()
    
    // Generate filename
    const ext = outputFormat === 'webp' ? '.webp' : '.svg'
    const baseName = file.name.replace(/\.[^/.]+$/, '')
    const timestamp = Date.now()
    const fileName = `${timestamp}-${baseName}${ext}`
    const fileHash = generateFileHash(buffer)
    
    // Save main image
    const { filePath, relativePath } = await saveFileToDisk(
      buffer,
      entityType,
      fileName,
      entityId
    )
    
    const publicUrl = getPublicUrl(relativePath)
    
    // Create thumbnail if requested
    let thumbnailUrl: string | null = null
    if (createThumbnail && outputFormat !== 'svg') {
      const thumbBuffer = await sharp(buffer)
        .resize(IMAGE_SIZES.thumbnail.width, IMAGE_SIZES.thumbnail.height, {
          fit: 'cover',
        })
        .webp({ quality: 80 })
        .toBuffer()
      
      const thumbFileName = `${timestamp}-${baseName}-thumb.webp`
      const { relativePath: thumbRelativePath } = await saveFileToDisk(
        thumbBuffer,
        entityType,
        thumbFileName,
        entityId
      )
      thumbnailUrl = getPublicUrl(thumbRelativePath)
    }
    
    // Save metadata to database
    const fileRecord = await prisma.fileUpload.create({
      data: {
        systemId: uuidv4(),
        fileName: fileName,
        originalName: file.name,
        mimeType: outputFormat === 'webp' ? 'image/webp' : file.type,
        fileSize: buffer.length,
        storagePath: filePath,
        publicUrl: publicUrl,
        entityType: entityType,
        entityId: entityId || null,
        metadata: {
          hash: fileHash,
          originalSize: file.size,
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          thumbnailUrl: thumbnailUrl,
          uploadedAt: new Date().toISOString(),
        },
        isPublic: true,
        createdBy: fields.userId || null,
      },
    })
    
    return NextResponse.json({
      success: true,
      message: 'Upload ảnh thành công',
      data: {
        id: fileRecord.systemId,
        fileName: fileRecord.fileName,
        originalName: fileRecord.originalName,
        mimeType: fileRecord.mimeType,
        fileSize: fileRecord.fileSize,
        url: publicUrl,
        thumbnailUrl: thumbnailUrl,
        width: metadata.width,
        height: metadata.height,
        entityType: entityType,
        entityId: entityId,
      },
    })
    
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi upload ảnh' },
      { status: 500 }
    )
  }
}
