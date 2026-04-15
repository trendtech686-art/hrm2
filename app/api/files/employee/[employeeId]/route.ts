/**
 * Employee Files Delete API
 * DELETE /api/files/employee/[employeeId]
 * 
 * Delete all files for a specific employee
 */

import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { getUploadDir } from '@/lib/upload-utils';
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils';
import { logError } from '@/lib/logger'

const UPLOAD_DIR = getUploadDir();

type Props = {
  params: Promise<{ employeeId: string }>;
};

export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { employeeId } = await params;

    // Delete from database
    const deletedFiles = await prisma.file.deleteMany({
      where: {
        entityType: 'employee',
        entityId: employeeId,
      },
    });

    // Delete from file system
    const employeeDir = path.join(UPLOAD_DIR, 'employees', employeeId);
    
    try {
      await fs.rm(employeeDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }

    return apiSuccess({
      message: `Đã xóa ${deletedFiles.count} file của nhân viên ${employeeId}`,
      deletedCount: deletedFiles.count,
    });
  } catch (error) {
    logError('❌ Delete employee files error', error);
    return apiError('Lỗi khi xóa file nhân viên', 500);
  }
}
