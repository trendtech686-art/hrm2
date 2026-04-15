/**
 * Branding Upload API
 * POST /api/branding/upload - Upload logo or favicon
 */

import { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { getUploadDir, parseFormData, validateFileType, ALLOWED_IMAGE_TYPES } from '@/lib/upload-utils'
import { logError } from '@/lib/logger'

const BRANDING_DIR = path.join(getUploadDir(), 'branding')

// Max file size: 2MB for branding
const MAX_SIZE = 2 * 1024 * 1024

export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { file, fields } = await parseFormData(request)

    if (!file) {
      return apiError('Không có file được upload', 400)
    }

    const type = fields.type as 'logo' | 'favicon'
    if (!type || !['logo', 'favicon'].includes(type)) {
      return apiError('Type phải là "logo" hoặc "favicon"', 400)
    }

    // Validate file type
    if (!validateFileType(file.type, ALLOWED_IMAGE_TYPES)) {
      return apiError(`Loại file không được hỗ trợ: ${file.type}`, 400)
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return apiError('File quá lớn. Tối đa 2MB', 400)
    }

    // Ensure branding directory exists
    await fs.mkdir(BRANDING_DIR, { recursive: true })

    // Delete existing file of this type
    try {
      const existingFiles = await fs.readdir(BRANDING_DIR)
      for (const f of existingFiles) {
        if (f.startsWith(`${type}.`) || f.startsWith(`${type}-`)) {
          await fs.unlink(path.join(BRANDING_DIR, f))
        }
      }
    } catch {
      // Directory may not exist yet
    }

    // Determine extension from mime type
    const mimeToExt: Record<string, string> = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'image/svg+xml': '.svg',
      'image/x-icon': '.ico',
    }
    const ext = mimeToExt[file.type] || '.png'
    const filename = `${type}${ext}`

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(BRANDING_DIR, filename)
    await fs.writeFile(filePath, buffer)

    const url = `/api/branding/${filename}`

    return apiSuccess({
      success: true,
      message: type === 'logo' ? 'Upload logo thành công' : 'Upload favicon thành công',
      file: { url, filename },
    })
  } catch (error) {
    logError('Branding upload error', error)
    return apiError('Upload thất bại', 500)
  }
}
