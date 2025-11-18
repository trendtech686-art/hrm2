import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image as ImageIcon, File, Eye, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils.ts';
import { Button } from './button.tsx';
import { Card } from './card.tsx';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from './dialog.tsx';
import { toast } from 'sonner';

export type UploadedFile = {
  id: string;
  name: string;
  filename?: string; // Optional system filename
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
};

type FileUploadProps = {
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  value?: UploadedFile[];
  onChange?: (files: UploadedFile[]) => void;
  disabled?: boolean;
  className?: string;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return ImageIcon;
  if (type.includes('pdf')) return FileText;
  return File;
};

// Helper function to compress images
const compressImage = (file: File, quality: number = 0.7): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 1200px width/height)
      const maxSize = 1200;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = height * (maxSize / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = width * (maxSize / height);
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            try {
              // Create File from blob - with better error handling
              let compressedFile: File;
              try {
                // Try modern File constructor
                compressedFile = new (window as any).File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
              } catch (e) {
                // Fallback: extend blob with file properties  
                const fileBlob = blob as any;
                fileBlob.name = file.name;
                fileBlob.lastModified = Date.now();
                fileBlob.lastModifiedDate = new Date();
                compressedFile = fileBlob as File;
              }
              resolve(compressedFile);
            } catch (error) {
              console.warn('File creation failed, using original file:', error);
              resolve(file); // Fallback to original if File creation fails
            }
          } else {
            resolve(file); // Fallback to original if compression fails
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => resolve(file); // Fallback to original if image load fails
    img.src = URL.createObjectURL(file);
  });
};

export function FileUpload({
  accept = { 'image/*': ['.png', '.jpg', '.jpeg'], 'application/pdf': ['.pdf'] },
  maxSize = 10 * 1024 * 1024, // Tăng lên 10MB vì server xử lý
  maxFiles = 5,
  value = [],
  onChange,
  disabled = false,
  className,
}: FileUploadProps) {
  // Remove internal state - make it purely controlled
  const files = value; // Use prop directly
  const [isUploading, setIsUploading] = React.useState(false);

  // Debug logging (only when files count changes, not content)
  React.useEffect(() => {
    console.log('FileUpload - files count changed:', files.length);
  }, [files.length]);

  const onDrop = React.useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
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

    // Validate file sizes and types manually as backup
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File "${file.name}" quá lớn (${formatFileSize(file.size)})`);
        return false;
      }
      
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error(`File "${file.name}" không đúng định dạng`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Check if adding these files would exceed the limit
    const remainingSlots = maxFiles - files.length;
    if (validFiles.length > remainingSlots) {
      toast.error('Quá nhiều file', {
        description: `Chỉ có thể thêm ${remainingSlots} file nữa`
      });
      acceptedFiles = validFiles.slice(0, remainingSlots);
    } else {
      acceptedFiles = validFiles;
    }

    if (acceptedFiles.length === 0) return;

    setIsUploading(true);

    const processFiles = async () => {
      try {
        const uploadedFiles: UploadedFile[] = [];
        
        for (const file of acceptedFiles) {
          try {
            // Check if localStorage has enough space
            const estimatedSize = file.size * 1.37; // base64 is ~37% larger
            const currentStorageSize = JSON.stringify(localStorage).length;
            const maxStorageSize = 5 * 1024 * 1024; // 5MB limit
            
            if (currentStorageSize + estimatedSize > maxStorageSize) {
              toast.error(`Không đủ dung lượng lưu trữ cho file "${file.name}"`, {
                description: `Đã sử dụng ${Math.round(currentStorageSize / 1024 / 1024 * 10) / 10}MB/5MB. Hãy xóa bớt file cũ hoặc làm mới trang để dọn dẹp.`,
                action: {
                  label: "Dọn dẹp",
                  onClick: () => {
                    // Clear some old data (keep only last 50% of storage)
                    try {
                      const keys = Object.keys(localStorage);
                      const documentKeys = keys.filter(k => k.includes('document-store'));
                      if (documentKeys.length > 0) {
                        localStorage.removeItem(documentKeys[0]);
                        toast.success('Đã dọn dẹp dung lượng. Hãy thử upload lại.');
                      }
                    } catch (e) {
                      console.warn('Cleanup failed:', e);
                    }
                  }
                }
              });
              continue;
            }
            
            // Compress image if it's too large (more aggressive compression)
            let processedFile = file;
            if (file.type.startsWith('image/')) {
              if (file.size > 2 * 1024 * 1024) { // > 2MB
                processedFile = await compressImage(file, 0.4); // Heavy compression
              } else if (file.size > 1 * 1024 * 1024) { // > 1MB
                processedFile = await compressImage(file, 0.6); // Medium compression
              } else if (file.size > 500 * 1024) { // > 500KB
                processedFile = await compressImage(file, 0.8); // Light compression
              }
            }
            
            const result = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              
              reader.onload = (e) => {
                if (e.target?.result) {
                  resolve(e.target.result as string);
                } else {
                  reject(new Error('Không thể đọc file'));
                }
              };
              
              reader.onerror = (error) => {
                console.error('FileReader error:', error);
                reject(new Error(`Lỗi đọc file: ${processedFile.name}`));
              };
              
              reader.onabort = () => {
                reject(new Error(`Việc đọc file bị hủy: ${processedFile.name}`));
              };
              
              // Add timeout to prevent hanging
              setTimeout(() => {
                reject(new Error(`Timeout khi đọc file: ${processedFile.name}`));
              }, 30000); // 30 seconds timeout
              
              reader.readAsDataURL(processedFile);
            });
            
            uploadedFiles.push({
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${uploadedFiles.length}`,
              name: file.name, // Keep original name
              size: processedFile.size, // Use compressed size
              type: file.type,
              url: result,
              uploadedAt: new Date().toISOString(),
            });
          } catch (fileError) {
            console.error(`Error processing file ${file.name}:`, fileError);
            toast.error(`Lỗi xử lý file "${file.name}"`, {
              description: fileError instanceof Error ? fileError.message : 'Lỗi không xác định'
            });
          }
        }
        
        if (uploadedFiles.length > 0) {
          // Direct parent state update - no internal state
          const updated = [...files, ...uploadedFiles];
          
          // Call parent onChange immediately
          onChange?.(updated);
          
          // Success feedback
          if (uploadedFiles.length === 1) {
            toast.success(`Đã tải lên file "${uploadedFiles[0].name}"`);
          } else {
            toast.success(`Đã tải lên ${uploadedFiles.length} file thành công`);
          }
          
          // Storage warning with action
          try {
            const storageUsed = JSON.stringify(localStorage).length;
            const storageLimit = 5 * 1024 * 1024; // 5MB
            const usagePercent = (storageUsed / storageLimit * 100);
            
            if (usagePercent > 90) { // 90% full - critical
              toast.warning('Dung lượng lưu trữ gần đầy!', {
                description: `${Math.round(usagePercent)}% đầy (${Math.round(storageUsed / 1024 / 1024 * 10) / 10}MB/5MB)`,
                action: {
                  label: "Dọn dẹp ngay",
                  onClick: () => window.location.reload()
                }
              });
            } else if (usagePercent > 75) { // 75% full - warning
              toast.info('Dung lượng lưu trữ sắp đầy', {
                description: `${Math.round(usagePercent)}% đầy. Hãy cân nhắc dọn dẹp file cũ.`
              });
            }
          } catch (storageError) {
            console.warn('Storage check failed:', storageError);
          }
        } else {
          toast.error('Không có file nào được tải lên', {
            description: 'Vui lòng kiểm tra file và thử lại'
          });
        }
      } catch (error) {
        console.error('Error uploading files:', error);
        if (error instanceof Error && error.message.includes('quota')) {
          toast.error('Hết dung lượng lưu trữ', {
            description: 'LocalStorage đã đầy. Hãy xóa bớt file cũ để tiếp tục.'
          });
        } else {
          toast.error('Lỗi khi tải file', {
            description: error instanceof Error ? error.message : 'Lỗi không xác định'
          });
        }
      } finally {
        setIsUploading(false);
      }
    };

    processFiles();
  }, [files, maxFiles, maxSize, onChange]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: true,
    disabled: disabled || files.length >= maxFiles || isUploading,
  });

  const removeFile = (id: string) => {
    const updated = files.filter(f => f.id !== id);
    onChange?.(updated);
    toast.success('Đã xóa file');
  };

  // Helper to get storage usage info
  const getStorageInfo = () => {
    try {
      const used = JSON.stringify(localStorage).length;
      const limit = 5 * 1024 * 1024; // 5MB
      return {
        used: Math.round(used / 1024 / 1024 * 10) / 10,
        limit: 5,
        percentage: Math.round(used / limit * 100)
      };
    } catch {
      return { used: 0, limit: 5, percentage: 0 };
    }
  };

  const previewFile = (file: UploadedFile) => {
    if (file.type === 'application/pdf') {
      // For PDF files, open in new tab
      const link = document.createElement('a');
      link.href = file.url;
      link.target = '_blank';
      link.click();
    }
  };

  const FileIcon = getFileIcon('');

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            'hover:border-primary hover:bg-muted/50',
            isDragActive && 'border-primary bg-muted/50',
            isDragReject && 'border-destructive bg-destructive/10',
            (disabled || isUploading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <Upload className={cn(
            "h-9 w-10 mx-auto mb-4 text-muted-foreground",
            isUploading && "animate-spin"
          )} />
          {isUploading ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-primary">Đang xử lý file...</p>
              <p className="text-xs text-muted-foreground">Vui lòng đợi</p>
            </div>
          ) : isDragActive ? (
            <p className="text-sm text-muted-foreground">Thả file vào đây...</p>
          ) : isDragReject ? (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm font-medium text-destructive">File không hợp lệ</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Chỉ hỗ trợ PDF, PNG, JPG (tối đa {formatFileSize(maxSize)})
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium">Kéo thả file hoặc click để chọn</p>
              <p className="text-xs text-muted-foreground">
                PDF, PNG, JPG (tối đa {formatFileSize(maxSize)}) • {files.length}/{maxFiles} file
              </p>
              {files.length > 0 && (
                <p className="text-xs text-primary font-medium">
                  ✓ Đã có {files.length} file
                </p>
              )}
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

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(file => {
            const Icon = getFileIcon(file.type);
            const isImage = file.type.startsWith('image/');
            const isPDF = file.type === 'application/pdf';
            return (
              <Card key={file.id} className="p-3 group hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  {isImage ? (
                    <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0 bg-muted">
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <Icon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{new Date(file.uploadedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Preview Button */}
                    {(isImage || isPDF) && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            disabled={disabled}
                            title="Xem trước"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                          <DialogHeader>
                            <DialogTitle className="truncate">{file.name}</DialogTitle>
                          </DialogHeader>
                          <div className="flex items-center justify-center p-4">
                            {isImage ? (
                              <img 
                                src={file.url} 
                                alt={file.name}
                                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                              />
                            ) : isPDF ? (
                              <div className="text-center space-y-4">
                                <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                                <div className="space-y-2">
                                  <p className="font-medium">{file.name}</p>
                                  <p className="text-sm text-muted-foreground">PDF • {formatFileSize(file.size)}</p>
                                  <Button 
                                    onClick={() => previewFile(file)}
                                    className="mt-4"
                                  >
                                    Mở trong tab mới
                                  </Button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {/* Delete Button */}
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
      
      {/* Storage info - only show when there are files or storage is getting full */}
      {(files.length > 0 || getStorageInfo().percentage > 50) && (
        <div className="text-center p-2 text-xs text-muted-foreground border-t">
          {(() => {
            const { used, limit, percentage } = getStorageInfo();
            return (
              <div className="flex items-center justify-between">
                <span>Lưu trữ: {used}MB/{limit}MB ({percentage}%)</span>
                {percentage > 80 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => {
                      if (confirm('Dọn dẹp localStorage sẽ xóa tất cả file đã upload. Bạn có chắc?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                  >
                    Dọn dẹp
                  </Button>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
