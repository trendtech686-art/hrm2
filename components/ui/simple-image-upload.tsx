'use client';

/**
 * Simple Image Upload Component
 * 
 * Flow đơn giản:
 * 1. User upload ảnh → Lưu file + database ngay (permanent)
 * 2. User xóa ảnh → Xóa file + database ngay
 * 3. Khi save form → Dùng URL từ value để cập nhật entity
 * 
 * Không có staging, không có confirm, không có session.
 */

import * as React from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ImagePlus, Trash2, Loader2, Check, FileText, File, Upload } from 'lucide-react';

// Helper function to check if URL is an image
function isImageUrl(url: string, name: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  const lowerName = name.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.endsWith(ext) || lowerName.endsWith(ext));
}

// Helper function to get file icon based on extension
function getFileIcon(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.endsWith('.pdf')) return <FileText className="h-10 w-10 text-red-500" />;
  if (lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) return <FileText className="h-10 w-10 text-blue-500" />;
  return <File className="h-10 w-10 text-muted-foreground" />;
}

export type UploadedImage = {
  id: string;
  url: string;
  name: string;
  size: number;
};

type SimpleImageUploadProps = {
  /**
   * Current image URL(s) - controlled component
   */
  value: UploadedImage | UploadedImage[] | null;
  
  /**
   * Called when images change (upload or delete)
   */
  onChange: (value: UploadedImage | UploadedImage[] | null) => void;
  
  /**
   * Entity type for organizing files: 'products', 'employees', 'customers', etc.
   */
  entityType: string;
  
  /**
   * Entity ID (product systemId, employee systemId, etc.)
   * Can be empty for new entities - will update after save
   */
  entityId?: string;
  
  /**
   * Document name: 'thumbnail', 'gallery', 'avatar', etc.
   */
  documentName: string;
  
  /**
   * Allow multiple files
   */
  multiple?: boolean;
  
  /**
   * Max number of files (for multiple)
   */
  maxFiles?: number;
  
  /**
   * Accepted file types
   */
  accept?: string;
  
  /**
   * Max file size in bytes
   */
  maxSize?: number;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Label text
   */
  label?: string;
  
  /**
   * Helper text
   */
  helperText?: string;
};

export function SimpleImageUpload({
  value,
  onChange,
  entityType,
  entityId,
  documentName,
  multiple = false,
  maxFiles = 10,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  disabled = false,
  className,
  label,
  helperText,
}: SimpleImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Normalize value to array for easier handling
  const images = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);
  
  const canUploadMore = multiple ? images.length < maxFiles : images.length === 0;
  
  // Common upload handler for both file input and drag & drop
  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    
    // Filter files based on accept type
    const isImageOnly = accept === 'image/*';
    const filteredFiles = isImageOnly 
      ? fileArray.filter(f => f.type.startsWith('image/'))
      : fileArray;
    
    if (filteredFiles.length === 0) {
      toast.error(isImageOnly ? 'Vui lòng chọn file ảnh' : 'Vui lòng chọn file hợp lệ');
      return;
    }
    
    // Validate files
    const filesToUpload: File[] = [];
    for (const file of filteredFiles) {
      if (file.size > maxSize) {
        toast.error(`File "${file.name}" quá lớn. Tối đa ${Math.round(maxSize / 1024 / 1024)}MB`);
        continue;
      }
      filesToUpload.push(file);
    }
    
    if (filesToUpload.length === 0) return;
    
    // Check max files
    const remainingSlots = multiple ? maxFiles - images.length : 1;
    const filesToProcess = filesToUpload.slice(0, remainingSlots);
    
    if (filesToUpload.length > remainingSlots) {
      toast.warning(`Chỉ upload được ${remainingSlots} file nữa`);
    }
    
    setIsUploading(true);
    
    try {
      const uploadedImages: UploadedImage[] = [];
      
      for (const file of filesToProcess) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('entityType', entityType);
        formData.append('documentName', documentName);
        const isImage = file.type.startsWith('image/');
        formData.append('isImage', isImage ? 'true' : 'false');
        if (entityId) {
          formData.append('entityId', entityId);
        }
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        
        if (result.success && result.data) {
          uploadedImages.push({
            id: result.data.id,
            url: result.data.url,
            name: result.data.originalName,
            size: result.data.fileSize,
          });
        } else {
          toast.error(`Lỗi upload "${file.name}": ${result.message || 'Unknown error'}`);
        }
      }
      
      if (uploadedImages.length > 0) {
        if (multiple) {
          onChange([...images, ...uploadedImages]);
        } else {
          onChange(uploadedImages[0]);
        }
        const isImageOnly = accept === 'image/*';
        toast.success(`Đã upload ${uploadedImages.length} ${isImageOnly ? 'ảnh' : 'file'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Lỗi khi upload ảnh');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle file selection from input
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    await processFiles(files);
    
    // Reset input AFTER processing to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Generate unique ID for input-label association
  const inputId = React.useId();
  
  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading && canUploadMore) {
      setIsDragOver(true);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (disabled || isUploading || !canUploadMore) return;
    
    const files = e.dataTransfer.files;
    await processFiles(files);
  };
  
  // Handle delete image
  const handleDelete = async (imageId: string) => {
    setIsDeletingId(imageId);
    
    try {
      const response = await fetch(`/api/upload/${imageId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success || response.status === 404) {
        // Remove from value
        const newImages = images.filter(img => img.id !== imageId);
        
        if (multiple) {
          onChange(newImages.length > 0 ? newImages : null);
        } else {
          onChange(null);
        }
        
        toast.success('Đã xóa ảnh');
      } else {
        toast.error(`Lỗi xóa ảnh: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Lỗi khi xóa ảnh');
    } finally {
      setIsDeletingId(null);
    }
  };
  
  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="text-sm font-medium">{label}</label>
      )}
      
      {/* Files grid */}
      {images.length > 0 && (
        <div className={cn(
          'grid gap-3',
          multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1 max-w-xs'
        )}>
          {images.map((image) => {
            const isImage = isImageUrl(image.url, image.name);
            
            return (
              <div
                key={image.id}
                className="relative group aspect-square rounded-lg overflow-hidden border bg-muted max-w-50"
              >
                {isImage ? (
                  <img
                    src={image.url}
                    alt={image.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
                    {getFileIcon(image.name)}
                  </div>
                )}
                
                {/* Status badge */}
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  <span>Đã lưu</span>
                </div>
                
                {/* Delete button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(image.id)}
                  disabled={disabled || isDeletingId === image.id}
                >
                  {isDeletingId === image.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
                
                {/* File info */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 p-2",
                  isImage ? "bg-linear-to-t from-black/70 to-transparent" : "bg-muted-foreground/10"
                )}>
                  <p className={cn("text-xs truncate", isImage ? "text-white" : "text-foreground")}>{image.name}</p>
                  <p className={cn("text-xs", isImage ? "text-white/70" : "text-muted-foreground")}>
                    {(image.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Upload area - use label for native file input triggering */}
      {canUploadMore && (() => {
        const isImageOnly = accept === 'image/*';
        const uploadIcon = isImageOnly 
          ? <ImagePlus className="h-8 w-8" /> 
          : <Upload className="h-8 w-8" />;
        const fileTypeText = isImageOnly ? 'ảnh' : 'file';
        
        return (
          <label
            htmlFor={disabled || isUploading ? undefined : inputId}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors block',
              isDragOver 
                ? 'border-primary bg-primary/10' 
                : 'hover:border-primary/50 hover:bg-muted/50',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              isUploading && 'pointer-events-none'
            )}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Đang upload...</p>
              </div>
            ) : isDragOver ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-primary">{uploadIcon}</span>
                <p className="text-sm text-primary font-medium">
                  Thả {fileTypeText} vào đây
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="text-muted-foreground">{uploadIcon}</span>
                <p className="text-sm text-muted-foreground">
                  Kéo thả hoặc click để chọn
                </p>
                {helperText && (
                  <p className="text-xs text-muted-foreground">{helperText}</p>
                )}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
        </label>
        );
      })()}
      
      {/* Max files warning */}
      {multiple && !canUploadMore && (
        <p className="text-xs text-orange-500 flex items-center gap-1">
          <span>⚠️</span>
          Đã đạt giới hạn {maxFiles} file. Xóa file cũ để thêm file mới.
        </p>
      )}
    </div>
  );
}
