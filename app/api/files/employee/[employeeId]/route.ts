/**
 * Employee Files Delete API
 * DELETE /api/files/employee/[employeeId]
 * 
 * Delete all files for a specific employee
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { getUploadDir } from '@/lib/upload-utils';

const UPLOAD_DIR = getUploadDir();

type Props = {
  params: Promise<{ employeeId: string }>;
};

export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { employeeId } = await params;

    // Delete from database
    const deletedFiles = await prisma.file.deleteMany({
      where: {
        entityType: 'Employee',
        entityId: employeeId,
      },
    });

    // Delete from file system
    const employeeDir = path.join(UPLOAD_DIR, 'employees', employeeId);
    
    try {
      await fs.rm(employeeDir, { recursive: true, force: true });
      console.log(`✅ Deleted employee files directory: ${employeeDir}`);
    } catch {
      // Directory might not exist
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa ${deletedFiles.count} file của nhân viên ${employeeId}`,
      deletedCount: deletedFiles.count,
    });
  } catch (error) {
    console.error('❌ Delete employee files error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa file nhân viên', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
