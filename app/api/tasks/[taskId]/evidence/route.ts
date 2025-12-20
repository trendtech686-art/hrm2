/**
 * Task Evidence Upload API
 * POST /api/tasks/[taskId]/evidence
 * 
 * Upload evidence files for tasks
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveUploadedFile, validateFile, ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from '@/lib/upload-utils';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  params: Promise<{ taskId: string }>;
};

export async function POST(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { taskId } = await params;

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Không có file nào được tải lên' },
        { status: 400 }
      );
    }

    // Limit to 5 files
    if (files.length > 5) {
      return NextResponse.json(
        { success: false, message: 'Chỉ được upload tối đa 5 file cùng lúc' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];

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
      await prisma.fileUpload.create({
        data: {
          id: fileId,
          entityType: 'Task',
          entityId: taskId,
          documentType: 'evidence',
          originalName: file.name,
          fileName: savedFile.filename,
          filePath: savedFile.relativePath,
          fileSize: file.size,
          mimeType: file.type,
          storageProvider: 'local',
          status: 'permanent',
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
      return NextResponse.json(
        { success: false, message: 'Không có file nào được tải lên thành công' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã upload ${uploadedFiles.length} file bằng chứng`,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('❌ Task evidence upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi upload file', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { taskId } = await params;

    const files = await prisma.fileUpload.findMany({
      where: {
        entityType: 'Task',
        entityId: taskId,
        documentType: 'evidence',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      files: files.map(f => ({
        id: f.id,
        name: f.originalName,
        originalName: f.originalName,
        size: f.fileSize,
        type: f.mimeType,
        url: `/api/files/${f.filePath}`,
        uploadedAt: f.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('❌ Get task evidence error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi lấy danh sách file' },
      { status: 500 }
    );
  }
}
