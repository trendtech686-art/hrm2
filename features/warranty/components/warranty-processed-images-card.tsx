'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { ExistingDocumentsViewer } from '../../../components/ui/existing-documents-viewer';
import { NewDocumentsUpload } from '../../../components/ui/new-documents-upload';
import type { StagingFile } from '../../../lib/file-upload-api';

interface WarrantyProcessedImagesCardProps {
  /** Đang ở chế độ edit không? */
  isEditing: boolean;
  /** Disabled không? */
  disabled?: boolean;
  /** Danh sách file đã lưu permanent */
  permanentFiles: StagingFile[];
  /** Setter cho permanent files */
  setPermanentFiles: React.Dispatch<React.SetStateAction<StagingFile[]>>;
  /** Danh sách file staging mới */
  stagingFiles: StagingFile[];
  /** Setter cho staging files */
  setStagingFiles: React.Dispatch<React.SetStateAction<StagingFile[]>>;
  /** Session ID cho upload */
  sessionId: string | null;
  /** Setter cho session ID */
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  /** Danh sách file ID được đánh dấu xóa */
  filesToDelete: string[];
  /** Handler để toggle đánh dấu xóa */
  onMarkForDeletion: (fileId: string) => void;
}

/**
 * Card hiển thị hình ảnh đã xử lý
 * Bao gồm cả ExistingDocumentsViewer và NewDocumentsUpload
 */
export function WarrantyProcessedImagesCard({
  isEditing,
  disabled = false,
  permanentFiles,
  setPermanentFiles,
  stagingFiles,
  setStagingFiles,
  sessionId,
  setSessionId,
  filesToDelete,
  onMarkForDeletion,
}: WarrantyProcessedImagesCardProps) {
  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader className="pb-3">
        <CardTitle>Hình ảnh đã xử lý</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Existing permanent files */}
        {isEditing && permanentFiles.length > 0 && (
          <div className="space-y-2">
            <ExistingDocumentsViewer
              files={permanentFiles}
              onChange={setPermanentFiles}
              disabled={disabled}
              onMarkForDeletion={onMarkForDeletion}
              markedForDeletion={filesToDelete}
              hideFileInfo={true}
            />
          </div>
        )}
        
        {/* New staging files upload section */}
        <div className="space-y-2">
          {isEditing && permanentFiles.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
              <span>📤</span>
              <span>Thêm file mới (tạm thời)</span>
            </div>
          )}
          <NewDocumentsUpload
            maxFiles={50}
            maxTotalSize={50 * 1024 * 1024} // 50MB
            existingFileCount={permanentFiles.length}
            value={stagingFiles}
            onChange={setStagingFiles}
            sessionId={sessionId || undefined}
            onSessionChange={setSessionId}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
