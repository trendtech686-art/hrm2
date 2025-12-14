import * as React from 'react';
import { Card } from './card';
import { Button } from './button';
import { toast } from 'sonner';
import { Eye, X, Download, File, RotateCcw } from 'lucide-react';
import { FileUploadAPI } from '../../lib/file-upload-api';
import { getFileUrl, getBaseUrl } from '../../lib/api-config';
import { ProgressiveImage } from './progressive-image';
import type { StagingFile } from '../../lib/file-upload-api';
import { useLazyImage } from '../../hooks/use-lazy-image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';

type ExistingDocumentsViewerProps = {
  files: StagingFile[];
  onChange?: (files: StagingFile[]) => void;
  disabled?: boolean;
  className?: string;
  onRefresh?: () => Promise<void>;
  // New prop for safe deletion mode
  onMarkForDeletion?: (fileId: string) => void;
  markedForDeletion?: string[]; // List of file IDs marked for deletion
  hideFileInfo?: boolean; // Hide filename, size, and badge
  gridTemplateClass?: string; // Allow callers to override the grid columns
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function ExistingDocumentsViewer({
  files,
  onChange,
  disabled = false,
  className,
  onRefresh,
  onMarkForDeletion,
  markedForDeletion = [],
  hideFileInfo = false,
  gridTemplateClass = 'grid-cols-5',
}: ExistingDocumentsViewerProps) {
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const [bulkDeleteAlertOpen, setBulkDeleteAlertOpen] = React.useState(false);
  const [fileToDelete, setFileToDelete] = React.useState<StagingFile | null>(null);
  const [deleteMode, setDeleteMode] = React.useState<'mark' | 'direct'>('direct');

  const handleDelete = React.useCallback(async (fileId: string) => {
    const fileToDelete = files.find(f => f.id === fileId);
    if (!fileToDelete) return;

    // If safe deletion mode is enabled, just mark for deletion
    if (onMarkForDeletion) {
      const isMarked = markedForDeletion.includes(fileId);
      
      if (isMarked) {
        // Unmark (restore)
        onMarkForDeletion(fileId);
        toast.success('✓ Đã khôi phục file', {
          description: `"${fileToDelete.originalName || fileToDelete.name}" sẽ được giữ lại`
        });
      } else {
        // Mark for deletion - NO POPUP, just mark immediately
        onMarkForDeletion(fileToDelete.id);
        toast.warning('⚠️ Đã đánh dấu xóa', {
          description: `"${fileToDelete.originalName || fileToDelete.name}" - Nhấn nút Lưu để xóa vĩnh viễn`,
          duration: 4000
        });
      }
      return;
    }

    // Direct deletion mode (old behavior) - show confirmation dialog
    setFileToDelete(fileToDelete);
    setDeleteMode('direct');
    setDeleteAlertOpen(true);
  }, [files, onMarkForDeletion, markedForDeletion]);

  const confirmDelete = React.useCallback(async () => {
    if (!fileToDelete) return;

    if (deleteMode === 'mark' && onMarkForDeletion) {
      // Mark for deletion
      onMarkForDeletion(fileToDelete.id);
      toast.warning('⚠️ Đã đánh dấu xóa', {
        description: `"${fileToDelete.originalName || fileToDelete.name}" - Nhấn nút Lưu ở dưới để XÁC NHẬN XÓA vĩnh viễn`,
        duration: 5000
      });
      setDeleteAlertOpen(false);
      setFileToDelete(null);
      return;
    }

    // Direct deletion
    const deleteToastId = toast.loading('Đang xóa file...');

    try {
      await FileUploadAPI.deleteFile(fileToDelete.id);
      
      // Update local state
      const updated = files.filter(f => f.id !== fileToDelete.id);
      onChange?.(updated);
      
      // Optionally refresh from server
      if (onRefresh) {
        await onRefresh();
      }

      toast.success('✓ Đã xóa file vĩnh viễn', {
        description: fileToDelete.originalName || fileToDelete.name,
        id: deleteToastId
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      toast.error('❌ Không thể xóa file', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại',
        id: deleteToastId
      });
    } finally {
      setDeleteAlertOpen(false);
      setFileToDelete(null);
    }
  }, [fileToDelete, deleteMode, files, onChange, onRefresh, onMarkForDeletion]);

  const handlePreview = React.useCallback((file: StagingFile) => {
    const previewUrl = getFileUrl(file.url);

    if (file.type === 'application/pdf') {
      window.open(previewUrl, '_blank');
      return;
    }

    // Create image preview modal
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      cursor: pointer;
    `;

    const img = document.createElement('img');
    img.src = previewUrl;
    img.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: 8px;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;

    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    img.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }, []);

  const handleDownload = React.useCallback(async (file: StagingFile) => {
    try {
      const downloadUrl = getFileUrl(file.url);

      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.originalName || file.name;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('✓ Đã tải xuống file');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('❌ Không thể tải file');
    }
  }, []);

  if (files.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg bg-muted/30">
        <File className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="text-sm text-muted-foreground">Chưa có file nào được lưu</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={`grid ${gridTemplateClass} gap-2 mb-2`}>
        {files.map((file) => (
          <LazyFileCard
            key={file.id}
            file={file}
            isMarkedForDeletion={markedForDeletion.includes(file.id)}
            hideFileInfo={hideFileInfo}
            disabled={disabled}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteMode === 'mark' ? '🗑️ Đánh dấu xóa file?' : '⚠️ Xóa file đã lưu vĩnh viễn?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {fileToDelete && (
                <>
                  <strong>"{fileToDelete.originalName || fileToDelete.name}"</strong>
                  <br />
                  <br />
                  {deleteMode === 'mark' ? (
                    <>
                      <span className="text-amber-600 font-medium">⚠️ LƯU Ý:</span>
                      <br />
                      • File sẽ chỉ bị xóa KHI BẠN NHẤN NÚT LƯU
                      <br />
                      • Bạn có thể khôi phục bằng cách nhấn lại nút này
                      <br />
                      • File đã xóa KHÔNG THỂ KHÔI PHỤC
                      <br />
                      <br />
                      Bạn có chắc muốn đánh dấu xóa?
                    </>
                  ) : (
                    <>
                      <span className="text-destructive font-medium">
                        ⚠️ File này đã được lưu trên server!
                      </span>
                      <br />
                      Hành động này không thể hoàn tác.
                    </>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {deleteMode === 'mark' ? 'Đánh dấu xóa' : 'Xóa vĩnh viễn'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================
// LAZY FILE CARD COMPONENT
// ============================================

type LazyFileCardProps = {
  file: StagingFile;
  isMarkedForDeletion: boolean;
  hideFileInfo: boolean;
  disabled: boolean;
  onPreview: (file: StagingFile) => void;
  onDownload: (file: StagingFile) => void;
  onDelete: (fileId: string) => void;
};

function LazyFileCard({
  file,
  isMarkedForDeletion,
  hideFileInfo,
  disabled,
  onPreview,
  onDownload,
  onDelete,
}: LazyFileCardProps) {
  const { ref, isInView, isLoaded, setIsLoaded } = useLazyImage();
  
  const isImage = file.type && typeof file.type === 'string' && file.type.startsWith('image/');
  const previewUrl = getFileUrl(file.url);

  const handleImageRetry = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const attempts = Number(img.dataset.retryCount || '0');
    if (attempts >= 4) {
      console.warn('Permanent image failed after retries:', previewUrl);
      return;
    }
    const nextAttempts = attempts + 1;
    img.dataset.retryCount = String(nextAttempts);
    const delay = nextAttempts * 400;
    setTimeout(() => {
      const separator = previewUrl.includes('?') ? '&' : '?';
      img.src = `${previewUrl}${separator}retry=${Date.now()}-${nextAttempts}`;
    }, delay);
  };

  return (
    <Card 
      ref={ref}
      className={`group p-1.5 transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
        isMarkedForDeletion 
          ? 'border-red-300 bg-red-50/50 opacity-60' 
          : 'border-green-200 bg-green-50/30'
      }`}
    >
      <div className="flex flex-col gap-1.5">
        {/* Thumbnail/Icon with Lazy Loading */}
        <div className="w-full aspect-square rounded bg-muted flex items-center justify-center overflow-hidden">
          {isImage ? (
            isInView ? (
              <>
                {/* Skeleton while loading */}
                {!isLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted" />
                )}
                <img
                  src={previewUrl}
                  alt={file.name}
                  loading="lazy"
                  className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onClick={() => onPreview(file)}
                  onLoad={(e) => {
                    e.currentTarget.dataset.retryCount = '0';
                    setIsLoaded(true);
                  }}
                  onError={handleImageRetry}
                />
              </>
            ) : (
              // Placeholder before entering viewport
              <div className="w-full h-full animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted" />
            )
          ) : (
            <File className="w-12 h-12 text-muted-foreground" />
          )}
        </div>

        {/* File Info */}
        {!hideFileInfo && (
          <div className="space-y-0.5">
            <p className="text-xs font-medium truncate" title={file.name || file.originalName}>
              {file.name || file.originalName}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
            {isMarkedForDeletion ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium animate-pulse">
                <span>🗑️</span> Sẽ xóa khi Lưu
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <span>✓</span> Đã lưu vĩnh viễn
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-1 h-7 px-1"
            onClick={() => onDownload(file)}
            title="Tải xuống"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          {isImage && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-1 h-7 px-1"
              onClick={() => onPreview(file)}
              title="Xem trước"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`flex-1 h-7 px-1 ${
              isMarkedForDeletion 
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' 
                : 'hover:bg-destructive/10 hover:text-destructive'
            }`}
            onClick={() => onDelete(file.id)}
            disabled={disabled}
            title={isMarkedForDeletion ? 'Khôi phục file' : 'Đánh dấu xóa'}
          >
            {isMarkedForDeletion ? <RotateCcw className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
