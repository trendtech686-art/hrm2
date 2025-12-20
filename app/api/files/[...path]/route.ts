// ═══════════════════════════════════════════════════════════════
// FILE SERVE API - Serve uploaded files
// ═══════════════════════════════════════════════════════════════
// GET /api/files/[...path] - Serve file by path
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const UPLOAD_BASE = process.env.UPLOAD_DIR || './uploads'

// Cache duration (1 year for immutable files)
const CACHE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year in seconds

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Path không hợp lệ' },
        { status: 400 }
      )
    }
    
    // Build file path
    const relativePath = pathSegments.join('/')
    const filePath = path.join(UPLOAD_BASE, relativePath)
    
    // Security: prevent path traversal
    const normalizedPath = path.normalize(filePath)
    const normalizedBase = path.normalize(UPLOAD_BASE)
    
    if (!normalizedPath.startsWith(normalizedBase)) {
      return NextResponse.json(
        { success: false, message: 'Path không hợp lệ' },
        { status: 403 }
      )
    }
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: 'File không tồn tại' },
        { status: 404 }
      )
    }
    
    // Get file stats
    const fileStat = await stat(filePath)
    
    // Read file
    const fileBuffer = await readFile(filePath)
    
    // Get MIME type
    const ext = path.extname(filePath).toLowerCase()
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream'
    
    // Return file with caching headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': fileStat.size.toString(),
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, immutable`,
        'Last-Modified': fileStat.mtime.toUTCString(),
      },
    })
    
  } catch (error) {
    console.error('File serve error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tải file' },
      { status: 500 }
    )
  }
}
