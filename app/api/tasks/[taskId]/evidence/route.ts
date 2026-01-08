/**
 * Task Evidence Upload API
 * POST /api/tasks/[taskId]/evidence
 * 
 * Upload evidence files for tasks
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveUploadedFile, validateFile, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from '@/lib/upload-utils';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';

type Props = {
  params: Promise<{ taskId: string }>;
};

export async function POST(
  request: NextRequest,
  { params }: Props
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { taskId } = await params;

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return apiError('Không có file nào được tải lên', 400);
    }

    // Limit to 5 files
    if (files.length > 5) {
      return apiError('Chỉ được upload tối đa 5 file cùng lúc', 400);
    }

    const uploadedFiles: Array<{
      id: string;
      name: string;
      originalName: string;
      size: number;
      type: string;
      url: string;
      uploadedAt: string;
    }> = [];

    for (const file of files) {
      // Validate file
      const validation = validateFile(file, {
        allowedExtensions: ALLOWED_EXTENSIONS.ALL,
        maxSize: MAX_FILE_SIZE.GENERAL,
      });

      if (!validation.valid) {
        continue; // Skip invalid files
      }

      const fileId = uuidv4();
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Save file to disk
      const savedFile = await saveUploadedFile(buffer, file.name, {
        subFolder: `tasks/${taskId}/evidence`,
      });

      if (!savedFile) {
        continue;
      }

      // Save to database
      await prisma.file.create({
        data: {
          systemId: fileId,
          entityType: 'Task',
          entityId: taskId,
          originalName: file.name,
          filename: savedFile.filename,
          filepath: savedFile.relativePath,
          filesize: file.size,
          mimetype: file.type,
          documentType: 'evidence',
        },
      });

      uploadedFiles.push({
        id: fileId,
        name: file.name,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: `/api/files/${savedFile.relativePath}`,
        uploadedAt: new Date().toISOString(),
      });
    }

    if (uploadedFiles.length === 0) {
      return apiError('Không có file nào được tải lên thành công', 400);
    }

    return apiSuccess({
      message: `Đã upload ${uploadedFiles.length} file bằng chứng`,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('❌ Task evidence upload error:', error);
    return apiError('Lỗi server khi upload file', 500);
  }
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { taskId } = await params;

    const files = await prisma.file.findMany({
      where: {
        entityType: 'Task',
        entityId: taskId,
        documentType: 'evidence',
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    return apiSuccess({
      files: files.map(f => ({
        id: f.systemId,
        name: f.originalName,
        originalName: f.originalName,
        size: f.filesize,
        type: f.mimetype,
        url: `/api/files/${f.filepath}`,
        uploadedAt: f.uploadedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('❌ Get task evidence error:', error);
    return apiError('Lỗi server khi lấy danh sách file', 500);
  }
}
