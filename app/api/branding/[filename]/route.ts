/**
 * Branding File Serve API
 * GET /api/branding/[filename] - Serve branding files (logo, favicon)
 * DELETE /api/branding/[type] - Delete branding file
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getUploadDir } from '@/lib/upload-utils';

const BRANDING_DIR = path.join(getUploadDir(), 'branding');

type Props = {
  params: Promise<{ filename: string }>;
};

/**
 * GET /api/branding/[filename]
 * Serve branding file with caching
 */
export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { filename } = await params;
    const filePath = path.join(BRANDING_DIR, filename);

    // Security check - prevent path traversal
    if (!filePath.startsWith(BRANDING_DIR)) {
      return NextResponse.json(
        { success: false, message: 'Invalid path' },
        { status: 400 }
      );
    }

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy file branding' },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();

    // Determine content type
    const contentTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.ico': 'image/x-icon',
      '.svg': 'image/svg+xml',
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('❌ Branding serve error:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể tải file branding' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/branding/[type]
 * Delete branding file (logo or favicon)
 */
export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { filename: type } = await params; // 'logo' or 'favicon'

    // Find and delete any file starting with the type
    const files = await fs.readdir(BRANDING_DIR);
    const targetFile = files.find(f => f.startsWith(type));
    
    if (targetFile) {
      await fs.unlink(path.join(BRANDING_DIR, targetFile));
      console.log(`✅ Deleted branding ${type}:`, targetFile);
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa ${type === 'logo' ? 'logo' : 'favicon'}`
    });
  } catch (error) {
    console.error('❌ Branding delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa file', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
