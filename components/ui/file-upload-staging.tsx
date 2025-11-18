import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Upload, X, Eye, AlertCircle, File, Image, FileText } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
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
import { cn } from '../../lib/utils';
import { FileUploadAPI, type StagingFile } from '../../lib/file-upload-api';
import { getFileUrl, getBaseUrl } from '../../lib/api-config';

type FileUploadProps = {
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  value?: StagingFile[];
  onChange?: (files: StagingFile[]) => void;
  sessionId?: string;
  onSessionChange?: (sessionId: string) => void;
  disabled?: boolean;
  className?: string;
  isEditMode?: boolean; // Add this to detect if we're editing existing employee
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Image compression utility
const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.createElement('img') as HTMLImageElement;
    
    img.onload = () => {
      // Calculate new dimensions (max 1920x1080)
      const maxWidth = 1920;
      const maxHeight = 1080;
      
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
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            try {
              // Create compressed file - fix for TypeScript
              const compressedFile = new (window as any).File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              }) as File;
              resolve(compressedFile);
            } catch (error) {
              console.warn('File creation failed, using original:', error);
              resolve(file);
            }
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) {
    return Image;
  }
  if (type === 'application/pdf') {
    return FileText;
  }
  if (type.includes('word') || type.includes('document')) {
    return FileText;
  }
  if (type.includes('excel') || type.includes('spreadsheet')) {
    return File;
  }
  return File;
};

const getFileIconColor = (type: string): string => {
  if (type.startsWith('image/')) return 'text-blue-500';
  if (type === 'application/pdf') return 'text-red-500';
  if (type.includes('word')) return 'text-blue-600';
  if (type.includes('excel')) return 'text-green-600';
  return 'text-muted-foreground';
};

export function FileUploadStaging({
  accept = { 'image/*': ['.png', '.jpg', '.jpeg'], 'application/pdf': ['.pdf'] },
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  value = [],
  onChange,
  sessionId,
  onSessionChange,
  disabled = false,
  className,
  isEditMode = false,
}: FileUploadProps) {
  const files = value;
  const [isUploading, setIsUploading] = React.useState(false);
  const [previewFile, setPreviewFile] = React.useState<StagingFile | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
  const [fileToDelete, setFileToDelete] = React.useState<StagingFile | null>(null);
  const [currentSessionId, setCurrentSessionId] = React.useState(sessionId || '');

  const onDrop = React.useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
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
              toast.error(`File "${file.name}" không đúng định dạng`, {
                description: 'Chỉ hỗ trợ PDF, PNG, JPG'
              });
              break;
            case 'too-many-files':
              toast.error('Quá nhiều file', {
                description: `Tối đa ${maxFiles} file`
              });
              break;
            default:
              toast.error(`Lỗi tải file "${file.name}"`);
          }
        });
      });
    }

    if (acceptedFiles.length === 0) return;

    // Check if adding these files would exceed the limit
    const remainingSlots = maxFiles - files.length;
    if (acceptedFiles.length > remainingSlots) {
      toast.error('Quá nhiều file', {
        description: `Chỉ có thể thêm ${remainingSlots} file nữa`
      });
      acceptedFiles = acceptedFiles.slice(0, remainingSlots);
    }

    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    
    // Show upload progress toast
    const uploadToastId = toast.loading(`Đang tải lên ${acceptedFiles.length} file...`, {
      description: 'Đang nén ảnh và upload lên server'
    });

    try {
      // Compress images trước khi upload
      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          if (file.type.startsWith('image/') && file.size > 1024 * 1024) { // >1MB
            try {
              const compressed = await compressImage(file, 0.8);
              const reduction = ((1 - compressed.size / file.size) * 100).toFixed(0);
              console.log(`Image compressed: ${file.name} from ${(file.size/1024/1024).toFixed(2)}MB to ${(compressed.size/1024/1024).toFixed(2)}MB (${reduction}% reduction)`);
              return compressed;
            } catch (error) {
              console.warn('Compression failed, using original:', error);
              return file;
            }
          }
          return file;
        })
      );
      
      // Upload vào staging
      const result = await FileUploadAPI.uploadToStaging(processedFiles, currentSessionId);
      
      // Cập nhật session ID nếu mới
      if (!currentSessionId || currentSessionId !== result.sessionId) {
        setCurrentSessionId(result.sessionId);
        onSessionChange?.(result.sessionId);
      }
      
      // Cập nhật files với files mới từ staging
      const updatedFiles = [...files, ...result.files];
      onChange?.(updatedFiles);
      
      // Success toast with details
      toast.success(`✓ Đã tải lên ${result.files.length} file`, {
        description: '🔄 File tạm - Sẽ lưu vĩnh viễn khi bạn bấm Lưu',
        id: uploadToastId
      });
      
    } catch (error) {
      console.error('Staging upload failed:', error);
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
    maxFiles: maxFiles - files.length,
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

    // Detect if permanent or staging file
    const isPermanent = fileToDelete.url && fileToDelete.url.includes('/permanent/');
    const fileType = isPermanent ? 'đã lưu vĩnh viễn' : 'tạm thời';
    
    // Delete from server
    const deleteToastId = toast.loading('Đang xóa file...');
    
    try {
      // Use appropriate delete API
      await FileUploadAPI.deleteFile(fileToDelete.id);
      
      // Remove from UI
      const updated = files.filter(f => f.id !== fileToDelete.id);
      onChange?.(updated);
      
      toast.success(`✓ Đã xóa file ${fileType}`, {
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
  }, [fileToDelete, files, onChange]);

  // Get preview URL for staging file
  const getPreviewUrl = (file: StagingFile) => {
    // Check if this is a permanent file (URL starts with /uploads/permanent/)
    if (file.url && file.url.includes('/permanent/')) {
      console.log('Preview permanent file:', file.url);
      return getFileUrl(file.url);
    }
    
    // Otherwise, staging file - use filename from server
    const sessionId = file.sessionId || currentSessionId;
    
    if (!sessionId) {
      console.error('No sessionId available for preview:', file);
      return '';
    }
    
    // Use filename (UUID) from server, NOT the display name
    const serverFilename = file.filename || file.id;
    const baseUrl = getBaseUrl();
    const previewUrl = `${baseUrl}/api/staging/files/${sessionId}/${serverFilename}`;
    
    console.log('Preview staging file:', {
      sessionId,
      filename: serverFilename,
      url: previewUrl,
      file
    });
    
    return previewUrl;
  };

  const handlePreview = (file: StagingFile) => {
    const previewUrl = getPreviewUrl(file);
    
    if (file.type === 'application/pdf') {
      window.open(previewUrl, '_blank');
    } else {
      setPreviewFile(file);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
            'hover:border-primary hover:bg-primary/5 hover:scale-[1.02]',
            isDragActive && 'border-primary bg-primary/10 scale-[1.02] shadow-lg',
            isDragReject && 'border-destructive bg-destructive/10',
            (disabled || isUploading) && 'opacity-50 cursor-not-allowed hover:scale-100'
          )}
        >
          <input {...getInputProps()} />
          
          {/* Animated upload icon */}
          <div className="relative inline-block mb-4">
            <Upload className={cn(
              "h-12 w-12 text-muted-foreground transition-all",
              isUploading && "animate-bounce text-primary",
              isDragActive && "text-primary scale-110"
            )} />
            {isUploading && (
              <div className="absolute inset-0 animate-ping">
                <Upload className="h-12 w-12 text-primary opacity-30" />
              </div>
            )}
          </div>
          
          {isUploading ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">Đang tải lên và nén ảnh...</p>
              <div className="h-1.5 w-48 mx-auto bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse" style={{width: '70%'}}></div>
              </div>
              <p className="text-xs text-muted-foreground">Vui lòng đợi</p>
            </div>
          ) : isDragActive ? (
            <div className="space-y-1">
              <p className="text-base font-medium text-primary">Thả file vào đây</p>
              <p className="text-xs text-muted-foreground">Hệ thống sẽ tự động nén và đổi tên</p>
            </div>
          ) : isDragReject ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm font-medium text-destructive">File không hợp lệ</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Chỉ hỗ trợ PDF, PNG, JPG (tối đa {formatFileSize(maxSize)})
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-base font-semibold">Kéo thả file hoặc click để chọn</p>
              <p className="text-sm text-muted-foreground">
                PDF, PNG, JPG (tối đa {formatFileSize(maxSize)})
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                  {files.length}/{maxFiles} file
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                  ✓ Tự động nén ảnh
                </div>
                <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                  ✓ Tên file thông minh
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show message when max files reached */}
      {files.length >= maxFiles && (
        <div className="text-center p-4 border border-dashed rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Đã đạt giới hạn {maxFiles} file. Xóa file cũ để thêm file mới.
          </p>
        </div>
      )}

      {/* File List with improved visuals */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type);
            const isImage = file.type.startsWith('image/');
            const isPermanent = file.url && file.url.includes('/permanent/');
            
            return (
              <Card key={file.id} className={cn(
                "group p-3 transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                isPermanent ? "border-blue-200 bg-blue-50/50" : "border-amber-200 bg-amber-50/50"
              )}>
                <div className="flex items-center justify-between gap-3">
                  {/* File icon/thumbnail */}
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {isImage ? (
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted group-hover:ring-2 group-hover:ring-primary/50 transition-all">
                        <img 
                          src={getPreviewUrl(file)} 
                          alt={file.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <FileIcon className="hidden h-6 w-6 text-muted-foreground absolute inset-0 m-auto" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                        <FileIcon className={`h-6 w-6 ${getFileIconColor(file.type)} group-hover:scale-110 transition-all`} />
                      </div>
                    )}
                    
                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        <span className="font-medium">{formatFileSize(file.size)}</span>
                        <span>•</span>
                        {isPermanent ? (
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                              <span className="text-green-600">✓</span> Đã lưu vĩnh viễn
                            </span>
                            {isEditMode && (
                              <span className="text-xs text-blue-600">(Từ server)</span>
                            )}
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium flex items-center gap-1">
                            <span className="animate-pulse">⏳</span> File tạm - Chưa lưu
                          </span>
                        )}
                        {file.originalName && file.originalName !== file.name && (
                          <>
                            <span>•</span>
                            <span className="text-xs text-blue-600" title={`Tên gốc: ${file.originalName}`}>
                              Gốc: {file.originalName.length > 15 ? `${file.originalName.substring(0, 15)}...` : file.originalName}
                            </span>
                          </>
                        )}
                        {file.metadata && file.metadata !== 'none' && (
                          <>
                            <span>•</span>
                            <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full" title={`Metadata: ${file.metadata}`}>
                              {file.metadata}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons - show on hover */}
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    {isImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => handlePreview(file)}
                        title="Xem trước"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeFile(file.id)}
                      disabled={disabled}
                      title="Xóa file"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Xem trước: {previewFile?.name}</DialogTitle>
          </DialogHeader>
          {previewFile && (
            <div className="max-h-[70vh] overflow-auto">
              {previewFile.type.startsWith('image/') ? (
                <img 
                  src={getPreviewUrl(previewFile)}
                  alt={previewFile.name}
                  className="max-w-full h-auto mx-auto"
                />
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  Không thể xem trước file này
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa file</AlertDialogTitle>
            <AlertDialogDescription>
              {fileToDelete && (
                <>
                  Bạn có chắc muốn xóa file{' '}
                  {fileToDelete.url?.includes('/permanent/') ? 'đã lưu vĩnh viễn' : 'tạm thời'} này?
                  <br />
                  <br />
                  <strong>"{fileToDelete.originalName || fileToDelete.name}"</strong>
                  <br />
                  <br />
                  {fileToDelete.url?.includes('/permanent/') ? (
                    <span className="text-destructive font-medium">⚠️ File này đã được lưu trên server!</span>
                  ) : (
                    'File này chưa được lưu.'
                  )}
                  <br />
                  Hành động này không thể hoàn tác.
                </>
              )}
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
