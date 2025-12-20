'use client'

// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD COMPONENT
// ═══════════════════════════════════════════════════════════════

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, File, Image, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useFileUpload, UploadedFile, UploadOptions } from '@/hooks/use-file-upload'

interface FileUploadProps {
  // Entity info
  entityType?: string
  entityId?: string
  
  // Config
  accept?: Record<string, string[]>
  maxSize?: number // in bytes
  maxFiles?: number
  multiple?: boolean
  
  // Image specific
  isImage?: boolean
  thumbnail?: boolean
  resize?: 'thumbnail' | 'small' | 'medium' | 'large'
  
  // Callbacks
  onUpload?: (files: UploadedFile[]) => void
  onError?: (error: Error) => void
  
  // Styling
  className?: string
  compact?: boolean
}

const DEFAULT_MAX_SIZE = 20 * 1024 * 1024 // 20MB

export function FileUpload({
  entityType,
  entityId,
  accept,
  maxSize = DEFAULT_MAX_SIZE,
  maxFiles = 10,
  multiple = true,
  isImage = false,
  thumbnail = true,
  resize,
  onUpload,
  onError,
  className,
  compact = false,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const { upload, uploadMultiple, isUploading, progress, error, reset } = useFileUpload()
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    
    const options: UploadOptions = {
      entityType,
      entityId,
      isImage,
      thumbnail,
      resize,
      onError,
    }
    
    try {
      let results: UploadedFile[]
      
      if (acceptedFiles.length === 1) {
        const result = await upload(acceptedFiles[0], options)
        results = [result]
      } else {
        results = await uploadMultiple(acceptedFiles, options)
      }
      
      setUploadedFiles(prev => [...prev, ...results])
      onUpload?.(results)
    } catch (err) {
      // Error already handled by hook
    }
  }, [upload, uploadMultiple, entityType, entityId, isImage, thumbnail, resize, onUpload, onError])
  
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: accept ?? (isImage 
      ? { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'] }
      : undefined
    ),
    maxSize,
    maxFiles,
    multiple,
    disabled: isUploading,
  })
  
  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }
  
  const clearAll = () => {
    setUploadedFiles([])
    reset()
  }
  
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : isImage ? (
              <Image className="h-4 w-4 mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isUploading ? 'Đang tải...' : 'Chọn file'}
          </Button>
        </div>
        {uploadedFiles.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {uploadedFiles.length} file đã tải
          </span>
        )}
      </div>
    )
  }
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          !isDragActive && 'border-muted-foreground/25 hover:border-primary/50',
          isUploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
          ) : isImage ? (
            <Image className="h-10 w-10 text-muted-foreground" />
          ) : (
            <Upload className="h-10 w-10 text-muted-foreground" />
          )}
          
          {isDragActive ? (
            <p className="text-sm text-primary">Thả file vào đây...</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Kéo thả file vào đây, hoặc <span className="text-primary">chọn file</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {isImage ? 'JPG, PNG, GIF, WebP, SVG' : 'Tất cả định dạng'} - 
                Tối đa {maxSize / (1024 * 1024)}MB
                {multiple && ` - ${maxFiles} files`}
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Progress */}
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">
            Đang tải lên... {progress}%
          </p>
        </div>
      )}
      
      {/* Error */}
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error.message}
        </div>
      )}
      
      {/* File rejections */}
      {fileRejections.length > 0 && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name}>
              <strong>{file.name}</strong>: {errors.map(e => e.message).join(', ')}
            </div>
          ))}
        </div>
      )}
      
      {/* Uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Đã tải ({uploadedFiles.length} files)
            </span>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Xóa tất cả
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {uploadedFiles.map(file => (
              <div
                key={file.id}
                className="relative group border rounded-lg overflow-hidden"
              >
                {file.mimeType.startsWith('image/') ? (
                  <img
                    src={file.thumbnailUrl || file.url}
                    alt={file.originalName}
                    className="w-full h-24 object-cover"
                  />
                ) : (
                  <div className="w-full h-24 flex items-center justify-center bg-muted">
                    <File className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-2">
                  <p className="text-xs truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.fileSize / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
