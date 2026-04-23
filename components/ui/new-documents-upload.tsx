import * as React from 'react';
import Image from 'next/image';
import { useDropzone, FileRejection, FileError } from 'react-dropzone';
import { toast } from 'sonner';
import { Upload, X, Eye, AlertCircle, File as FileIcon, Download, ClipboardPaste } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { cn } from '../../lib/utils';
import { FileUploadAPI, type StagingFile } from '../../lib/file-upload-api';
import { ImagePreviewDialog } from './image-preview-dialog';
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

type NewDocumentsUploadProps = {
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  maxTotalSize?: number; // Total size limit for all files combined
  existingFileCount?: number; // Count of permanent files (for maxFiles validation)
  value?: StagingFile[];
  onChange?: (files: StagingFile[]) => void;
  sessionId?: string | undefined;
  onSessionChange?: (sessionId: string) => void;
  disabled?: boolean;
  className?: string;
  gridTemplateClass?: string; // Allow callers to override the grid layout for previews
  compact?: boolean; // Compact mode for smaller dropzone
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Image compression utility - Enhanced with WebP support
const compressImage = (file: File, quality: number = 0.75): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.createElement('img') as HTMLImageElement;

    img.onload = () => {
      // Reduced max dimensions for faster loading
      const maxWidth = 1200;
      const maxHeight = 1200;

      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      // Try WebP first (better compression)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            try {
              // Convert to WebP with .webp extension
              const fileName = file.name.replace(/\.[^.]+$/, '.webp');
              const compressedFile = new File([blob], fileName, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } catch {
              // Fallback to JPEG if WebP fails
              canvas.toBlob(
                (jpegBlob) => {
                  if (jpegBlob) {
                    try {
                      const jpegFile = new File([jpegBlob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                      });
                      resolve(jpegFile);
                    } catch {
                      resolve(file);
                    }
                  } else {
                    resolve(file);
                  }
                },
                'image/jpeg',
                quality
              );
            }
          } else {
            resolve(file);
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Image component with React-state retry (replaces DOM mutation pattern).
 * Uses next/image for /uploads/ and /api/ URLs, falls back to <img> for blob:/data:.
 */
function RetryImage({ src, alt }: { src: string; alt: string }) {
  const [retryCount, setRetryCount] = React.useState(0);
  const computedSrc = React.useMemo(() => {
    if (retryCount === 0) return src;
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}retry=${Date.now()}-${retryCount}`;
  }, [src, retryCount]);

  const handleError = React.useCallback(() => {
    if (retryCount >= 4) return;
    const delay = (retryCount + 1) * 400;
    setTimeout(() => setRetryCount(prev => prev + 1), delay);
  }, [retryCount]);

  const handleLoad = React.useCallback(() => {
    setRetryCount(0);
  }, []);

  const isOptimizable = src.startsWith('/uploads/') || src.startsWith('/api/');

  if (isOptimizable) {
    return (
      <Image
        key={retryCount}
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 33vw, 150px"
        quality={75}
        className="object-cover"
        onLoad={handleLoad}
        onError={handleError}
        unoptimized
      />
    );
  }

  return (
    <img
      src={computedSrc}
      alt={alt}
      className="h-full w-full object-cover"
      loading="eager"
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}

export function NewDocumentsUpload({
  accept = { 
    'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'], 
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  },
  maxSize = 10 * 1024 * 1024,
  maxFiles = 50,
  maxTotalSize = 50 * 1024 * 1024, // 50MB total limit per document type
  existingFileCount = 0, // Count of permanent files
  value = [],
  onChange,
  sessionId,
  onSessionChange,
  disabled = false,
  className,
  gridTemplateClass = 'grid-cols-5',
  compact = false,
}: NewDocumentsUploadProps) {
  const files = value; // Simple controlled component
  const [isUploading, setIsUploading] = React.useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const [fileToDelete, setFileToDelete] = React.useState<StagingFile | null>(null);
  

  
  // Get session ID: từ prop → từ existing files → tạo mới
  const getInitialSessionId = React.useCallback(() => {
    if (sessionId) return sessionId;
    if (files.length > 0 && files[0].sessionId) return files[0].sessionId;
    return '';
  }, [sessionId, files]);
  
  const [currentSessionId, setCurrentSessionId] = React.useState(getInitialSessionId);
  
  // Update currentSessionId when sessionId prop or files change
  React.useEffect(() => {
    const newSessionId = getInitialSessionId();
    if (newSessionId && newSessionId !== currentSessionId) {
      setCurrentSessionId(newSessionId);
    }
  }, [sessionId, files, currentSessionId, getInitialSessionId]);

  const onDrop = React.useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // Handle rejected files first (format/size issues)
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(rejection => {
        const { file, errors } = rejection;
        errors.forEach((error: FileError) => {
          switch (error.code) {
            case 'file-too-large':
              toast.error(`File "${file.name}" quá lớn`, {
                description: `Kích thước tối đa: ${formatFileSize(maxSize)}`
              });
              break;
            case 'file-invalid-type': {
              // Generate accept message from accept prop
              const acceptedTypes = accept 
                ? Object.values(accept).flat().join(', ').toUpperCase()
                : 'PDF, DOC, DOCX, XLS, XLSX, PNG, JPG';
              toast.error(`File "${file.name}" không đúng định dạng`, {
                description: `Chỉ chấp nhận: ${acceptedTypes}`
              });
              break;
            }
            default:
              toast.error(`Lỗi tải file "${file.name}"`, {
                description: error.message || 'Vui lòng thử lại'
              });
          }
        });
      });
    }

    // Handle file count limit BEFORE processing accepted files
    const currentFileCount = files.length + existingFileCount; // Total = staging + permanent
    const remainingSlots = maxFiles - currentFileCount;
    const totalFilesDropped = acceptedFiles.length;
    
    
    if (currentFileCount >= maxFiles) {
      toast.error(`🚫 Đã đạt giới hạn ${maxFiles} file`, {
        description: `Không thể thêm file mới. Hiện có ${existingFileCount} file vĩnh viễn + ${files.length} file tạm thời.`
      });
      return;
    }
    
    if (totalFilesDropped > remainingSlots) {
      const rejectedCount = totalFilesDropped - remainingSlots;
      
      toast.error(`⚠️ Không thể thêm ${totalFilesDropped} file`, {
        description: `Chỉ có thể thêm tối đa ${remainingSlots} file nữa (hiện có ${currentFileCount}/${maxFiles}). Đã loại bỏ ${rejectedCount} file cuối.`
      });
      
      // Only take the first files that fit
      acceptedFiles = acceptedFiles.slice(0, remainingSlots);
      
      if (acceptedFiles.length > 0) {
        toast.info(`📁 Đã chọn ${acceptedFiles.length} file đầu tiên`, {
          description: 'Xóa file cũ để thêm file mới'
        });
      }
    }

    if (acceptedFiles.length === 0) return;

    // Check total size limit
    const currentTotalSize = files.reduce((sum, file) => sum + file.size, 0);
    const newFilesTotalSize = acceptedFiles.reduce((sum, file) => sum + file.size, 0);
    const proposedTotalSize = currentTotalSize + newFilesTotalSize;

    if (proposedTotalSize > maxTotalSize) {
      const availableSize = maxTotalSize - currentTotalSize;
      toast.error(`📊 Vượt quá giới hạn tổng dung lượng`, {
        description: `Tối đa ${formatFileSize(maxTotalSize)} cho loại tài liệu này. Còn trống: ${formatFileSize(availableSize)}`
      });
      
      // Filter files that fit within size limit
      let runningSize = 0;
      const fittingFiles: File[] = [];
      for (const file of acceptedFiles) {
        if (runningSize + file.size <= availableSize) {
          fittingFiles.push(file);
          runningSize += file.size;
        }
      }
      
      if (fittingFiles.length === 0) {
        return; // No files can fit
      }
      
      acceptedFiles = fittingFiles;
      toast.info(`📁 Đã chọn ${acceptedFiles.length} file phù hợp`, {
        description: `Tổng dung lượng: ${formatFileSize(runningSize)}`
      });
    }

    if (acceptedFiles.length === 0) return;

    setIsUploading(true);

    const uploadToastId = toast.loading(`Đang tải lên ${acceptedFiles.length} file...`, {
      description: 'Đang nén và chuyển đổi sang WebP...'
    });

    try {
      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          // Compress images larger than 500KB (reduced threshold)
          if (file.type.startsWith('image/') && file.size > 512 * 1024) {
            try {
              const compressed = await compressImage(file, 0.75);
              return compressed;
            } catch {
              return file;
            }
          }
          return file;
        })
      );

      const result = await FileUploadAPI.uploadToStaging(processedFiles, currentSessionId);

      if (!currentSessionId || currentSessionId !== result.sessionId) {
        setCurrentSessionId(result.sessionId);
        onSessionChange?.(result.sessionId);
      }

      // Wait a bit for server to finish writing all files
      await new Promise(resolve => setTimeout(resolve, 300));

      // Merge and notify parent immediately
      const updatedFiles = [...files, ...result.files];
      onChange?.(updatedFiles);

      toast.success(`✓ Đã tải lên ${result.files.length} file`, {
        description: '🔄 File tạm - Sẽ lưu vĩnh viễn khi bạn bấm Lưu',
        id: uploadToastId
      });
    } catch (error) {
      logError('Upload failed', error);
      toast.error('❌ Lỗi khi tải file', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại',
        id: uploadToastId
      });
    } finally {
      setIsUploading(false);
    }
  }, [files, maxFiles, maxSize, onChange, currentSessionId, onSessionChange, accept, existingFileCount, maxTotalSize]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    // Remove maxFiles from dropzone - we'll handle it manually in onDrop
    disabled: disabled || files.length >= maxFiles || isUploading,
    // Ensure mobile camera works properly
    useFsAccessApi: false,
  });

  // Ctrl+V paste support — dedicated handler for the paste button
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handlePasteFromClipboard = React.useCallback(async () => {
    if (disabled || isUploading) return;

    try {
      const clipboardItems = await navigator.clipboard.read();
      const pastedFiles: File[] = [];

      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const ext = type.split('/')[1] || 'png';
            const file = new File([blob], `pasted-image-${Date.now()}.${ext}`, { type });
            pastedFiles.push(file);
          }
        }
      }

      if (pastedFiles.length > 0) {
        onDrop(pastedFiles, []);
      } else {
        toast.info('Không tìm thấy ảnh trong clipboard', {
          description: 'Hãy copy ảnh trước rồi bấm nút này'
        });
      }
    } catch {
      // Clipboard API not available or denied - fallback to paste event
      toast.error('Không thể đọc clipboard', {
        description: 'Trình duyệt không cho phép. Hãy thử kéo thả ảnh.'
      });
    }
  }, [disabled, isUploading, onDrop]);

  // Also support Ctrl+V when focus is on the container (not in an input)
  React.useEffect(() => {
    if (disabled || isUploading) return;

    const handlePaste = (e: ClipboardEvent) => {
      // Skip if user is typing in an input/textarea/contenteditable
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      // Only handle if the container is focused or contains the active element
      if (!containerRef.current?.contains(document.activeElement) && document.activeElement !== containerRef.current) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (const item of Array.from(items)) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        e.preventDefault();
        onDrop(pastedFiles, []);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [disabled, isUploading, onDrop]);

  // Check if accept includes images (show paste button only for image uploads)
  const acceptsImages = React.useMemo(() => {
    if (!accept) return true;
    return Object.keys(accept).some(k => k.startsWith('image'));
  }, [accept]);

  const removeFile = React.useCallback(async (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (!fileToRemove) return;

    setFileToDelete(fileToRemove);
    setDeleteAlertOpen(true);
  }, [files]);

  const confirmDeleteFile = React.useCallback(async () => {
    if (!fileToDelete) return;

    const deleteToastId = toast.loading('Đang xóa file...');

    try {
      // Check if this is an external URL (not uploaded to our system)
      const isExternalUrl = fileToDelete.url?.startsWith('http://') || fileToDelete.url?.startsWith('https://');
      const isLocalUpload = fileToDelete.id && !isExternalUrl;
      
      if (isLocalUpload) {
        // Only call delete API for files uploaded to our system
        try {
          await FileUploadAPI.deleteFile(fileToDelete.id);
        } catch (apiError) {
          // If file doesn't exist in database, just remove from UI
          console.warn('File not found in database, removing from UI only:', apiError);
        }
      }

      const updated = files.filter(f => f.id !== fileToDelete.id);
      onChange?.(updated);

      toast.success('✓ Đã xóa file', {
        description: fileToDelete.originalName || fileToDelete.name,
        id: deleteToastId
      });
    } catch (error) {
      logError('Failed to delete', error);
      toast.error('❌ Không thể xóa file', {
        id: deleteToastId
      });
    } finally {
      setDeleteAlertOpen(false);
      setFileToDelete(null);
    }
  }, [fileToDelete, files, onChange]);

  const getPreviewUrl = (file: StagingFile) => {
    // In new system, files are uploaded directly to permanent storage
    // URL is always available and ready to use
    if (file.url) {
      // Absolute URL - use as-is
      if (file.url.startsWith('http://') || file.url.startsWith('https://')) {
        return file.url;
      }
      // Relative path - use directly (Next.js serves from /uploads)
      return file.url;
    }
    
    // Fallback - should not happen in new system
    return '';
  };

  // Image preview state
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  
  // Get all image files for the preview dialog carousel
  const imageFiles = React.useMemo(() => 
    files.filter(f => f.type && typeof f.type === 'string' && f.type.startsWith('image/')),
    [files]
  );

  // Non-image preview state
  const [nonImagePreviewFile, setNonImagePreviewFile] = React.useState<StagingFile | null>(null);

  const handlePreview = (file: StagingFile) => {
    const isImage = file.type && typeof file.type === 'string' && file.type.startsWith('image/');
    
    if (isImage) {
      // Find the index of this file in imageFiles
      const index = imageFiles.findIndex(f => f.id === file.id);
      if (index >= 0) {
        setPreviewIndex(index);
        setPreviewOpen(true);
      }
    } else {
      // Use dialog for PDFs, office docs, etc.
      setNonImagePreviewFile(file);
    }
  };

  return (
    <div ref={containerRef} className={cn(compact ? 'space-y-2' : 'space-y-4', className)}>
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            'relative border-2 border-dashed border-border rounded-lg text-center cursor-pointer transition-all duration-200',
            compact ? 'p-2' : 'p-4',
            'hover:border-primary hover:bg-primary/5 hover:scale-[1.01]',
            isDragActive && 'border-primary bg-primary/10 scale-[1.01] shadow-lg',
            isDragReject && 'border-destructive bg-destructive/10',
            (disabled || isUploading) && 'opacity-50 cursor-not-allowed hover:scale-100',
            files.length >= maxFiles && 'border-red-300 bg-red-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />

          {compact ? (
            // Compact mode - minimal UI
            <div className="flex items-center justify-center gap-2 py-1">
              <Upload className={cn(
                "h-4 w-4 text-muted-foreground",
                isUploading && "animate-bounce text-primary",
                isDragActive && "text-primary"
              )} />
              {isUploading ? (
                <span className="text-xs text-primary">Đang tải...</span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Thêm ảnh ({existingFileCount + files.length}/{maxFiles})
                </span>
              )}
            </div>
          ) : (
            // Normal mode - full UI
            <>
              <div className="relative inline-block mb-2">
                <Upload className={cn(
                  "h-8 w-8 text-muted-foreground transition-all",
                  isUploading && "animate-bounce text-primary",
                  isDragActive && "text-primary scale-110"
                )} />
                {isUploading && (
                  <div className="absolute inset-0 animate-ping">
                    <Upload className="h-8 w-8 text-primary opacity-30" />
                  </div>
                )}
              </div>

              {isUploading ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-primary">Đang tải lên...</p>
                  <div className="h-1 w-32 mx-auto bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-pulse" style={{width: '70%'}}></div>
                  </div>
                </div>
              ) : isDragActive ? (
                <p className="text-sm font-medium text-primary">Thả file vào đây</p>
              ) : isDragReject ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-xs font-medium text-destructive">File không hợp lệ</p>
                  </div>
                  <div className="text-xs text-destructive/80">
                    <p>Chỉ chấp nhận: {accept ? Object.values(accept).flat().join(', ').toUpperCase() : 'PDF, DOC, DOCX, XLS, XLSX, PNG, JPG'} (max {formatFileSize(maxSize)})</p>
                  </div>
                </div>
              ) : files.length >= maxFiles ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-medium text-red-700">Đã đầy</p>
                  </div>
                  <p className="text-xs text-red-600">
                    Đã đạt {maxFiles} file. Xóa file cũ để thêm mới.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Kéo thả hoặc click để chọn</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, XLS, PNG, JPG (max {formatFileSize(maxSize)})</p>
                  <div className="flex items-center justify-center gap-1 pt-1">
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      files.length >= maxFiles 
                        ? 'bg-red-100 text-red-700' 
                        : files.length >= maxFiles * 0.8 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-green-100 text-green-700'
                    }`}>
                      {files.length >= maxFiles 
                        ? 'Đầy' 
                        : files.length >= maxFiles * 0.8 
                          ? 'Gần đầy' 
                          : 'Còn chỗ'
                      } {files.length}/{maxFiles}
                    </div>
                    {files.length > 0 && (
                      <div className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                        {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}/{formatFileSize(maxTotalSize)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Paste button — separate from dropzone so click doesn't open file picker */}
      {acceptsImages && files.length < maxFiles && !disabled && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full text-xs gap-1.5"
          onClick={handlePasteFromClipboard}
          disabled={isUploading}
        >
          <ClipboardPaste className="h-3.5 w-3.5" />
          Dán ảnh từ clipboard (Ctrl+V)
        </Button>
      )}

      {files.length >= maxFiles && (
        <div className="text-center p-4 border border-dashed rounded-lg bg-red-50 border-red-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700 font-medium">
              Đã đạt giới hạn {maxFiles} file
            </p>
          </div>
          <p className="text-xs text-red-600">
            Xóa file cũ để thêm file mới hoặc liên hệ admin để tăng giới hạn
          </p>
        </div>
      )}

      {files.length > 0 && (
        <div className={`grid ${gridTemplateClass} gap-2 mb-2`}>
          {files.map((file) => {
            const isImage = file.type && typeof file.type === 'string' && file.type.startsWith('image/');
            const previewUrl = getPreviewUrl(file);
            // Check if this is a permanent file (existing file with empty sessionId)
            const isPermanent = !file.sessionId || file.sessionId === '';

            return (
              <Card key={file.id} className={`group p-1.5 transition-all duration-200 hover:shadow-md relative ${
                isPermanent ? 'border-green-200 bg-green-50/50' : 'border-amber-200 bg-amber-50/50'
              }`}>
                <div className="space-y-1.5">
                  {isImage ? (
                    <div className="aspect-square rounded overflow-hidden bg-muted relative">
                      <RetryImage src={previewUrl} alt={file.name || file.originalName} />
                      
                      {/* Status badge */}
                      {isPermanent && (
                        <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                          <span>✓</span>
                          <span>Đã lưu vĩnh viễn</span>
                        </div>
                      )}
                      
                      {/* Overlay buttons - chỉ hiện khi hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1 md:opacity-0 md:group-hover:opacity-100">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 bg-white/90 hover:bg-white"
                          onClick={() => handlePreview(file)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 bg-white/90 hover:bg-destructive hover:text-white"
                          onClick={() => removeFile(file.id)}
                          disabled={disabled}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg bg-muted flex items-center justify-center relative group">
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                      
                      {/* Overlay buttons for non-image files */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1 md:opacity-0 md:group-hover:opacity-100">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 bg-white/90 hover:bg-white"
                          onClick={() => handlePreview(file)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 bg-white/90 hover:bg-destructive hover:text-white"
                          onClick={() => removeFile(file.id)}
                          disabled={disabled}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-xs font-medium truncate">{file.name || file.originalName}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {file.size > 0 ? (
                        <>
                          <span className={isPermanent ? 'text-green-700 font-medium' : 'text-muted-foreground'}>
                            {formatFileSize(file.size)}
                          </span>
                          {isPermanent && (
                            <span className="text-green-700">• Vĩnh viễn</span>
                          )}
                        </>
                      ) : isPermanent ? (
                        <span className="text-green-700 font-medium">Đã lưu vĩnh viễn</span>
                      ) : (
                        <span className="text-muted-foreground">Đang tải...</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa file</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>Bạn có chắc muốn xóa file tạm thời này?</p>
                <p className="font-medium text-foreground break-all">
                  "{fileToDelete?.originalName || fileToDelete?.name}"
                </p>
                <p className="text-sm text-muted-foreground">
                  File này chưa được lưu. Hành động này không thể hoàn tác.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFile} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa file
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        images={imageFiles.map(f => getPreviewUrl(f))}
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
                <Button variant="outline" size="sm" onClick={() => {
                  const link = document.createElement('a');
                  link.href = getPreviewUrl(nonImagePreviewFile);
                  link.download = nonImagePreviewFile.originalName || nonImagePreviewFile.name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}>
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
            const fileUrl = getPreviewUrl(nonImagePreviewFile);
            
            if (isPdf) {
              return (
                <div className="w-full h-[75vh] border border-border rounded-lg overflow-hidden bg-gray-50 mt-2">
                  <iframe src={fileUrl} className="w-full h-full" title={nonImagePreviewFile.name} />
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
                    <FileIcon className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium">{nonImagePreviewFile.originalName || nonImagePreviewFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-2">File {fileTypeName} không thể xem trước trên môi trường localhost.</p>
                      <p className="text-xs text-muted-foreground">Vui lòng tải xuống để xem nội dung.</p>
                    </div>
                  </div>
                );
              }
              return (
                <div className="w-full h-[75vh] border border-border rounded-lg overflow-hidden mt-2">
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + fileUrl)}`}
                    className="w-full h-full"
                    title={nonImagePreviewFile.name}
                  />
                </div>
              );
            }
            return (
              <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-muted/30 rounded-lg border-2 border-dashed border-border mt-2">
                <FileIcon className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-medium">{nonImagePreviewFile.originalName || nonImagePreviewFile.name}</p>
                <p className="text-xs text-muted-foreground">Không thể xem trước loại file này</p>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
