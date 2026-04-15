import * as React from 'react';
import Image from 'next/image';
import { Card } from './card';
import { Button } from './button';
import { toast } from 'sonner';
import { Eye, X, Download, File, RotateCcw } from 'lucide-react';
import { FileUploadAPI } from '../../lib/file-upload-api';
import type { StagingFile } from '../../lib/file-upload-api';
import { useLazyImage } from '../../hooks/use-lazy-image';
import { ImagePreviewDialog } from './image-preview-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { logError } from '@/lib/logger'
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
  const [_bulkDeleteAlertOpen, _setBulkDeleteAlertOpen] = React.useState(false);
  const [fileToDelete, setFileToDelete] = React.useState<StagingFile | null>(null);
  const [deleteMode, setDeleteMode] = React.useState<'mark' | 'direct'>('direct');
  
  // Image preview state
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewIndex, setPreviewIndex] = React.useState(0);

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
      logError('Failed to delete file', error);
      toast.error('❌ Không thể xóa file', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại',
        id: deleteToastId
      });
    } finally {
      setDeleteAlertOpen(false);
      setFileToDelete(null);
    }
  }, [fileToDelete, deleteMode, files, onChange, onRefresh, onMarkForDeletion]);

  // Get all image files for the preview dialog carousel
  const imageFiles = React.useMemo(() => 
    files.filter(f => f.type && typeof f.type === 'string' && f.type.startsWith('image/')),
    [files]
  );
  
  // Non-image file preview state
  const [nonImagePreviewFile, setNonImagePreviewFile] = React.useState<StagingFile | null>(null);

  const handlePreview = React.useCallback((file: StagingFile) => {
    const isImage = file.type && typeof file.type === 'string' && file.type.startsWith('image/');
    
    if (isImage) {
      // Find the index of this file in imageFiles
      const index = imageFiles.findIndex(f => f.id === file.id);
      if (index >= 0) {
        setPreviewIndex(index);
        setPreviewOpen(true);
      }
    } else {
      // Use FilePreviewDialog for PDFs, office docs, etc.
      setNonImagePreviewFile(file);
    }
  }, [imageFiles]);

  const handleDownload = React.useCallback(async (file: StagingFile) => {
    try {
      const downloadUrl = file.url;

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
      logError('Download failed', error);
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
            skipLazyLoad={true} // Permanent files are cached, no need for lazy loading
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

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        images={imageFiles.map(f => f.url)}
        initialIndex={previewIndex}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title="Xem ảnh"
      />

      {/* Non-image File Preview Dialog */}
      <Dialog open={!!nonImagePreviewFile} onOpenChange={(open) => { if (!open) setNonImagePreviewFile(null); }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg">
                {nonImagePreviewFile?.originalName || nonImagePreviewFile?.name || 'Xem trước tài liệu'}
              </DialogTitle>
              {nonImagePreviewFile && (
                <Button variant="outline" size="sm" onClick={() => handleDownload(nonImagePreviewFile)}>
                  <Download className="mr-2 h-4 w-4" />
                  Tải xuống
                </Button>
              )}
            </div>
          </DialogHeader>
          {nonImagePreviewFile && (() => {
            const ext = (nonImagePreviewFile.originalName || nonImagePreviewFile.name || '').split('.').pop()?.toLowerCase();
            const isPdf = nonImagePreviewFile.type === 'application/pdf' || ext === 'pdf';
            const isOffice = ['xlsx', 'xls', 'csv', 'doc', 'docx', 'ppt', 'pptx'].includes(ext || '');
            
            if (isPdf) {
              return (
                <div className="w-full h-[75vh] border border-border rounded-lg overflow-hidden bg-gray-50 mt-2">
                  <iframe src={nonImagePreviewFile.url} className="w-full h-full" title={nonImagePreviewFile.name} />
                </div>
              );
            }
            if (isOffice) {
              // Office Online can't access localhost URLs
              const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
              if (isLocalhost) {
                const fileTypeName = ext === 'xlsx' || ext === 'xls' ? 'Excel' : 
                                    ext === 'doc' || ext === 'docx' ? 'Word' : 
                                    ext === 'ppt' || ext === 'pptx' ? 'PowerPoint' : 'Office';
                return (
                  <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-muted/30 rounded-lg border-2 border-dashed border-border mt-2">
                    <File className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium">{nonImagePreviewFile.originalName || nonImagePreviewFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-2">File {fileTypeName} không thể xem trước trên môi trường localhost.</p>
                      <p className="text-xs text-muted-foreground">Vui lòng tải xuống để xem nội dung.</p>
                    </div>
                    <Button size="sm" onClick={() => handleDownload(nonImagePreviewFile)}>
                      <Download className="mr-2 h-4 w-4" />
                      Tải xuống để xem
                    </Button>
                  </div>
                );
              }
              return (
                <div className="w-full h-[75vh] border border-border rounded-lg overflow-hidden mt-2">
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + nonImagePreviewFile.url)}`}
                    className="w-full h-full"
                    title={nonImagePreviewFile.name}
                  />
                </div>
              );
            }
            return (
              <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-muted/30 rounded-lg border-2 border-dashed border-border mt-2">
                <File className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-medium">{nonImagePreviewFile.originalName || nonImagePreviewFile.name}</p>
                <p className="text-xs text-muted-foreground">Không thể xem trước loại file này</p>
                <Button size="sm" onClick={() => handleDownload(nonImagePreviewFile)}>
                  <Download className="mr-2 h-4 w-4" />
                  Tải xuống để xem
                </Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
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
  skipLazyLoad?: boolean; // Skip lazy loading for permanent files
};

function LazyFileCard({
  file,
  isMarkedForDeletion,
  hideFileInfo,
  disabled,
  onPreview,
  onDownload,
  onDelete,
  skipLazyLoad = false,
}: LazyFileCardProps) {
  const { ref, isInView: lazyIsInView, isLoaded, setIsLoaded } = useLazyImage();
  
  // Skip lazy loading if requested - show immediately
  const isInView = skipLazyLoad ? true : lazyIsInView;
  // For permanent files (skipLazyLoad), consider them already loaded to avoid skeleton flash
  const effectiveIsLoaded = skipLazyLoad ? true : isLoaded;
  
  const isImage = file.type && typeof file.type === 'string' && file.type.startsWith('image/');
  const previewUrl = file.url;

  // React-state based retry (replaces DOM mutation pattern)
  const [retryCount, setRetryCount] = React.useState(0);
  const computedSrc = React.useMemo(() => {
    if (retryCount === 0) return previewUrl;
    const separator = previewUrl.includes('?') ? '&' : '?';
    return `${previewUrl}${separator}retry=${Date.now()}-${retryCount}`;
  }, [previewUrl, retryCount]);

  const handleImageRetry = React.useCallback(() => {
    if (retryCount >= 4) return;
    const delay = (retryCount + 1) * 400;
    setTimeout(() => {
      setRetryCount(prev => prev + 1);
    }, delay);
  }, [retryCount]);

  // Check if URL is optimizable by next/image
  const isOptimizable = previewUrl.startsWith('/uploads/') || previewUrl.startsWith('/api/');

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
        <div className="relative w-full aspect-square rounded bg-muted flex items-center justify-center overflow-hidden">
          {isImage ? (
            isInView ? (
              <>
                {/* Skeleton while loading - skip for permanent files */}
                {!effectiveIsLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-linear-to-r from-muted via-muted/50 to-muted" />
                )}
                {isOptimizable ? (
                  <Image
                    key={retryCount}
                    src={previewUrl}
                    alt={file.name}
                    fill
                    sizes="(max-width: 640px) 33vw, 150px"
                    quality={75}
                    className={`object-cover cursor-pointer ${
                      skipLazyLoad ? '' : `transition-opacity duration-300 ${effectiveIsLoaded ? 'opacity-100' : 'opacity-0'}`
                    }`}
                    onClick={() => onPreview(file)}
                    onLoad={() => {
                      setRetryCount(0);
                      setIsLoaded(true);
                    }}
                    onError={handleImageRetry}
                    unoptimized
                  />
                ) : (
                  <img
                    src={computedSrc}
                    alt={file.name}
                    loading={skipLazyLoad ? "eager" : "lazy"}
                    className={`w-full h-full object-cover cursor-pointer ${
                      skipLazyLoad ? '' : `transition-opacity duration-300 ${effectiveIsLoaded ? 'opacity-100' : 'opacity-0'}`
                    }`}
                    onClick={() => onPreview(file)}
                    onLoad={() => {
                      setRetryCount(0);
                      setIsLoaded(true);
                    }}
                    onError={handleImageRetry}
                  />
                )}
              </>
            ) : (
              // Placeholder before entering viewport
              <div className="w-full h-full animate-pulse bg-linear-to-r from-muted via-muted/50 to-muted" />
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
