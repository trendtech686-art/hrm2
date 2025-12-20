// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD UTILITIES
// ═══════════════════════════════════════════════════════════════

import { mkdir, writeFile, unlink, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

// Base upload directory
const UPLOAD_BASE = process.env.UPLOAD_DIR || './uploads'

// Get upload directory
export function getUploadDir(): string {
  return UPLOAD_BASE
}

// Entity directories
export const UPLOAD_DIRS = {
  staging: path.join(UPLOAD_BASE, 'staging'),
  employees: path.join(UPLOAD_BASE, 'permanent', 'employees'),
  products: path.join(UPLOAD_BASE, 'permanent', 'products'),
  customers: path.join(UPLOAD_BASE, 'permanent', 'customers'),
  warranty: path.join(UPLOAD_BASE, 'permanent', 'warranty'),
  complaints: path.join(UPLOAD_BASE, 'permanent', 'complaints'),
  tasks: path.join(UPLOAD_BASE, 'permanent', 'tasks'),
  comments: path.join(UPLOAD_BASE, 'permanent', 'comments'),
  branding: path.join(UPLOAD_BASE, 'permanent', 'branding'),
  wiki: path.join(UPLOAD_BASE, 'permanent', 'wiki'),
  general: path.join(UPLOAD_BASE, 'permanent', 'general'),
} as const

export type EntityType = keyof typeof UPLOAD_DIRS

// Allowed file extensions
export const ALLOWED_EXTENSIONS = {
  IMAGE: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  DOCUMENT: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv'],
  ALL: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv'],
}

// Allowed MIME types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
]

export const ALLOWED_ALL_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES]

// Max file sizes (in bytes)
export const MAX_FILE_SIZE = {
  IMAGE: 10 * 1024 * 1024,     // 10MB
  DOCUMENT: 50 * 1024 * 1024,  // 50MB
  GENERAL: 20 * 1024 * 1024,   // 20MB
  image: 10 * 1024 * 1024,     // 10MB (alias)
  document: 50 * 1024 * 1024,  // 50MB (alias)
  default: 20 * 1024 * 1024,   // 20MB (alias)
}

// Initialize upload directories
export async function initUploadDirs() {
  for (const dir of Object.values(UPLOAD_DIRS)) {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true })
    }
  }
}

// Get date-based subdirectory path (YYYY/MM/DD)
export function getDateBasedPath(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

// Generate unique filename
export function generateFileName(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase()
  const timestamp = Date.now()
  const random = crypto.randomBytes(4).toString('hex')
  return `${timestamp}-${random}${ext}`
}

// Generate file hash (for deduplication)
export function generateFileHash(buffer: Buffer): string {
  return crypto.createHash('md5').update(buffer).digest('hex')
}

// Validate file type
export function validateFileType(
  mimeType: string, 
  allowedTypes: string[] = ALLOWED_ALL_TYPES
): boolean {
  return allowedTypes.includes(mimeType)
}

// Validate file size
export function validateFileSize(size: number, maxSize: number = MAX_FILE_SIZE.default): boolean {
  return size <= maxSize
}

// Get file extension from MIME type
export function getExtensionFromMime(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'text/plain': '.txt',
    'text/csv': '.csv',
  }
  return mimeToExt[mimeType] || ''
}

// Save file to disk
export async function saveFileToDisk(
  buffer: Buffer,
  entityType: EntityType,
  fileName: string,
  entityId?: string
): Promise<{ filePath: string; relativePath: string }> {
  await initUploadDirs()
  
  const baseDir = UPLOAD_DIRS[entityType]
  const datePath = getDateBasedPath()
  
  // Build path: entityType/entityId/YYYY/MM/DD/filename or entityType/YYYY/MM/DD/filename
  const subPath = entityId 
    ? path.join(entityId, datePath)
    : datePath
  
  const fullDir = path.join(baseDir, subPath)
  
  // Ensure directory exists
  if (!existsSync(fullDir)) {
    await mkdir(fullDir, { recursive: true })
  }
  
  const filePath = path.join(fullDir, fileName)
  const relativePath = path.join(entityType === 'staging' ? 'staging' : `permanent/${entityType}`, subPath, fileName)
  
  await writeFile(filePath, buffer)
  
  return { filePath, relativePath }
}

// Delete file from disk
export async function deleteFileFromDisk(filePath: string): Promise<boolean> {
  try {
    if (existsSync(filePath)) {
      await unlink(filePath)
      return true
    }
    return false
  } catch {
    return false
  }
}

// Get file stats
export async function getFileStats(filePath: string) {
  try {
    const stats = await stat(filePath)
    return {
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
    }
  } catch {
    return null
  }
}

// Build public URL for file
export function getPublicUrl(relativePath: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || '/api/files'
  return `${baseUrl}/${relativePath}`
}

// Parse form data from request
export async function parseFormData(request: Request): Promise<{
  file: File | null
  fields: Record<string, string>
}> {
  const formData = await request.formData()
  
  let file: File | null = null
  const fields: Record<string, string> = {}
  
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      file = value
    } else {
      fields[key] = value.toString()
    }
  }
  
  return { file, fields }
}

// Validate file (combined validation)
export function validateFile(
  file: File,
  options: {
    allowedExtensions?: string[]
    maxSize?: number
  } = {}
): { valid: boolean; error?: string } {
  const { 
    allowedExtensions = ALLOWED_EXTENSIONS.ALL, 
    maxSize = MAX_FILE_SIZE.GENERAL 
  } = options

  // Check file size
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File quá lớn. Tối đa ${Math.round(maxSize / 1024 / 1024)}MB` 
    }
  }

  // Check extension
  const ext = path.extname(file.name).toLowerCase()
  if (!allowedExtensions.includes(ext)) {
    return { 
      valid: false, 
      error: `Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${allowedExtensions.join(', ')}` 
    }
  }

  return { valid: true }
}

// Save uploaded file to disk with date-based folder structure
export async function saveUploadedFile(
  buffer: Buffer,
  originalName: string,
  options: {
    subFolder?: string
    customFilename?: string
  } = {}
): Promise<{ filename: string; relativePath: string; fullPath: string } | null> {
  try {
    const { subFolder = '', customFilename } = options
    
    // Create date-based folder structure
    const now = new Date()
    const year = now.getFullYear().toString()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    
    // Generate unique filename
    const ext = path.extname(originalName).toLowerCase()
    const baseName = path.basename(originalName, ext)
    const timestamp = Date.now()
    const uniqueId = uuidv4().substring(0, 8)
    const filename = customFilename || `${baseName}_${timestamp}_${uniqueId}${ext}`
    
    // Build full path
    const relativePath = subFolder 
      ? `${subFolder}/${year}/${month}/${day}/${filename}`
      : `${year}/${month}/${day}/${filename}`
    const fullDir = path.join(UPLOAD_BASE, subFolder, year, month, day)
    const fullPath = path.join(fullDir, filename)
    
    // Ensure directory exists
    if (!existsSync(fullDir)) {
      await mkdir(fullDir, { recursive: true })
    }
    
    // Write file
    await writeFile(fullPath, buffer)
    
    return { filename, relativePath, fullPath }
  } catch (error) {
    console.error('Error saving uploaded file:', error)
    return null
  }
}

