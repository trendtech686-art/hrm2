import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Upload, X, Eye, AlertCircle, File, Image, FileText } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { cn } from '../../lib/utils';
import { FileUploadAPI, type StagingFile } from '../../lib/file-upload-api';
import { getFileUrl, getBaseUrl } from '../../lib/api-config';
import { compressImageToWebP } from '../../lib/image-utils';
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
  sessionId?: string;
  onSessionChange?: (sessionId: string) => void;
  disabled?: boolean;
  className?: string;
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
              const compressedFile = new (window as any).File([blob], fileName, {
                type: 'image/webp',
                lastModified: Date.now(),
              }) as File;
              resolve(compressedFile);
            } catch (error) {
              console.warn('WebP creation failed, trying JPEG fallback:', error);
              // Fallback to JPEG if WebP fails
              canvas.toBlob(
                (jpegBlob) => {
                  if (jpegBlob) {
                    try {
                      const jpegFile = new (window as any).File([jpegBlob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                      }) as File;
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

const getFileIcon = (type: string | undefined) => {
  if (!type || typeof type !== 'string') return File;
  if (type.startsWith('image/')) return Image;
  if (type === 'application/pdf') return FileText;
  return File;
};

const getFileIconColor = (type: string | undefined): string => {
  if (!type || typeof type !== 'string') return 'text-muted-foreground';
  if (type.startsWith('image/')) return 'text-blue-500';
  if (type === 'application/pdf') return 'text-red-500';
  return 'text-muted-foreground';
};

export function NewDocumentsUpload({
  accept = { 'image/*': ['.png', '.jpg', '.jpeg'], 'application/pdf': ['.pdf'] },
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
}: NewDocumentsUploadProps) {
  const files = value; // Simple controlled component
  const [isUploading, setIsUploading] = React.useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const [fileToDelete, setFileToDelete] = React.useState<StagingFile | null>(null);
  

  
  // Get session ID: từ prop → từ existing files → tạo mới
  const getInitialSessionId = () => {
    if (sessionId) return sessionId;
    if (files.length > 0 && files[0].sessionId) return files[0].sessionId;
    return '';
  };
  
  const [currentSessionId, setCurrentSessionId] = React.useState(getInitialSessionId);
  
  // Update currentSessionId when sessionId prop or files change
  React.useEffect(() => {
    const newSessionId = getInitialSessionId();
    if (newSessionId && newSessionId !== currentSessionId) {
      setCurrentSessionId(newSessionId);
    }
  }, [sessionId, files, currentSessionId]);

  const onDrop = React.useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files first (format/size issues)
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(rejection => {
        const { file, errors } = rejection;
        errors.forEach((error: any) => {
          switch (error.code) {
            case 'file-too-large':
              toast.error(`File "${file.name}" quá lớn`, {
                description: `Kích thước tối đa: ${formatFileSize(maxSize)}`
              });
              break;
            case 'file-invalid-type':
              // Generate accept message from accept prop
              const acceptedTypes = accept 
                ? Object.values(accept).flat().join(', ').toUpperCase()
                : 'PDF, PNG, JPG';
              toast.error(`File "${file.name}" không đúng định dạng`, {
                description: `Chỉ chấp nhận: ${acceptedTypes}`
              });
              break;
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
    
    console.log('📊 File limit check:', {
      staging: files.length,
      existing: existingFileCount,
      current: currentFileCount,
      max: maxFiles,
      remaining: remainingSlots,
      dropped: totalFilesDropped
    });
    
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
      const fittingFiles = [];
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
              console.log(`📦 Compressed: ${file.name} (${formatFileSize(file.size)} → ${formatFileSize(compressed.size)})`);
              return compressed;
            } catch (error) {
              console.warn('Compression failed:', error);
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
      console.error('Upload failed:', error);
      toast.error('❌ Lỗi khi tải file', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại',
        id: uploadToastId
      });
    } finally {
      setIsUploading(false);
    }
  }, [files, maxFiles, maxSize, onChange, currentSessionId, onSessionChange]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    // Remove maxFiles from dropzone - we'll handle it manually in onDrop
    disabled: disabled || files.length >= maxFiles || isUploading,
  });

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
      await FileUploadAPI.deleteFile(fileToDelete.id);

      const updated = files.filter(f => f.id !== fileToDelete.id);
      onChange?.(updated);

      toast.success('✓ Đã xóa file tạm', {
        description: fileToDelete.originalName || fileToDelete.name,
        id: deleteToastId
      });
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('❌ Không thể xóa file', {
        id: deleteToastId
      });
    } finally {
      setDeleteAlertOpen(false);
      setFileToDelete(null);
    }
  }, [fileToDelete, files, onChange]);

  const getPreviewUrl = (file: StagingFile) => {
    const baseUrl = getBaseUrl();
    
    console.log('🖼️ getPreviewUrl called:', {
      fileName: file.name,
      fileUrl: file.url,
      sessionId: file.sessionId,
      currentSessionId
    });
    
    // Priority 1: Check if file has a URL (permanent or otherwise)
    if (file.url) {
      // Skip blob URLs - these are temporary local previews
      if (file.url.startsWith('blob:')) {
        console.log('  → Case: blob URL, fall through');
        // Fall through to staging URL construction
      }
      // Skip staging URLs - need to reconstruct with current session
      else if (file.url.includes('/api/staging/')) {
        console.log('  → Case: /api/staging/ URL, fall through');
        // Fall through to staging URL construction
      }
      // Absolute URL (http/https) - use as-is
      else if (file.url.startsWith('http://') || file.url.startsWith('https://')) {
        console.log('  → Case: absolute URL, return as-is');
        return file.url;
      }
      // Relative path - prepend baseUrl
      else if (file.url.startsWith('/')) {
        const result = `${baseUrl}${file.url}`;
        console.log('  → Case: relative path, result:', result);
        return result;
      }
    }
    
    // Priority 2: Construct staging URL for newly uploaded files
    // This requires a valid sessionId
    const filename = file.filename || file.name || file.id;
    const sessionId = file.sessionId || currentSessionId;

    // If no sessionId and no valid URL, we can't preview
    if (!sessionId) {
      console.log('  → Case: NO sessionId, return empty');
      return ''; // Return empty - will show broken image
    }
    
    const result = `${baseUrl}/api/staging/files/${sessionId}/${filename}`;
    console.log('  → Case: construct from sessionId, result:', result);
    return result;
  };

  const handlePreview = (file: StagingFile) => {
    const previewUrl = getPreviewUrl(file);

    if (file.type === 'application/pdf') {
      window.open(previewUrl, '_blank');
      return;
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.9); display: flex;
      align-items: center; justify-content: center;
      z-index: 9999; cursor: pointer;
    `;

    const img = document.createElement('img');
    img.src = previewUrl;
    img.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 8px;';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute; top: 20px; right: 20px; background: white;
      border: none; border-radius: 50%; width: 40px; height: 40px;
      font-size: 24px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;

    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => document.body.removeChild(overlay));
    img.addEventListener('click', (e) => e.stopPropagation());
  };

  return (
    <div className={cn('space-y-4', className)}>
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200',
            'hover:border-primary hover:bg-primary/5 hover:scale-[1.01]',
            isDragActive && 'border-primary bg-primary/10 scale-[1.01] shadow-lg',
            isDragReject && 'border-destructive bg-destructive/10',
            (disabled || isUploading) && 'opacity-50 cursor-not-allowed hover:scale-100',
            files.length >= maxFiles && 'border-red-300 bg-red-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />

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
              <div className="text-[10px] text-destructive/80">
                <p>Chỉ chấp nhận: {accept ? Object.values(accept).flat().join(', ').toUpperCase() : 'PDF, PNG, JPG'} (max {formatFileSize(maxSize)})</p>
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
              <p className="text-xs text-muted-foreground">PDF, PNG, JPG (max {formatFileSize(maxSize)})</p>
              <div className="flex items-center justify-center gap-1 pt-1">
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
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
                  <div className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-[10px] font-medium">
                    {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}/{formatFileSize(maxTotalSize)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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
        <div className="grid grid-cols-5 gap-2 mb-2">
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file.type);
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
                      <img
                        src={previewUrl}
                        alt={file.name || file.originalName}
                        className="h-full w-full object-cover"
                        loading="eager"
                        onError={(e) => {
                          console.error('Image failed to load, retrying...:', previewUrl);
                          setTimeout(() => {
                            const img = e.currentTarget;
                            if (img && img.src) {
                              img.src = previewUrl + '?retry=' + Date.now();
                            }
                          }, 1000);
                        }}
                      />
                      
                      {/* Status badge */}
                      {isPermanent && (
                        <div className="absolute top-1 left-1 bg-green-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                          <span>✓</span>
                          <span>Đã lưu vĩnh viễn</span>
                        </div>
                      )}
                      
                      {/* Overlay buttons - chỉ hiện khi hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
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
                    <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                      <FileIcon className={`h-8 w-8 ${getFileIconColor(file.type)}`} />
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-[10px] font-medium truncate">{file.name || file.originalName}</p>
                    <div className="flex items-center gap-1 text-[9px]">
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
            <AlertDialogDescription>
              Bạn có chắc muốn xóa file tạm thời này?
              <br />
              <br />
              <strong>"{fileToDelete?.originalName || fileToDelete?.name}"</strong>
              <br />
              <br />
              File này chưa được lưu. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFile}>Xóa file</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
