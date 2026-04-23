'use client'

// ═══════════════════════════════════════════════════════════════
// DOCUMENTS MANAGER COMPONENT
// ═══════════════════════════════════════════════════════════════
// Unified component for uploading and managing documents
// Replaces: NewDocumentsUpload + ExistingDocumentsViewer
// ═══════════════════════════════════════════════════════════════

import { useCallback, useState } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import { Upload, X, Eye, File as FileIcon, Image as ImageIcon, Loader2, Trash2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { OptimizedImage } from '@/components/ui/optimized-image'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface DocumentFile {
  id: string
  name: string
  originalName: string
  size: number
  type: string
  url: string
  thumbnailUrl?: string
  entityType?: string
  entityId?: string
  documentType?: string
  createdAt?: string
  isNew?: boolean
  markedForDeletion?: boolean
}

interface DocumentsManagerProps {
  entityType: string
  entityId?: string
  documentType?: string
  value?: DocumentFile[]
  onChange?: (files: DocumentFile[]) => void
  existingFiles?: DocumentFile[]
  onExistingFilesChange?: (files: DocumentFile[]) => void
  accept?: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
  maxTotalSize?: number
  multiple?: boolean
  isImage?: boolean
  onUpload?: (files: DocumentFile[]) => void
  onDelete?: (file: DocumentFile) => void
  onError?: (error: Error) => void
  disabled?: boolean
  showExisting?: boolean
  allowDelete?: boolean
  safeDeleteMode?: boolean
  className?: string
  compact?: boolean
  gridCols?: number
}

const DEFAULT_ACCEPT = {
  'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024
const DEFAULT_MAX_FILES = 20

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const isImageFile = (type: string): boolean => {
  return type.startsWith('image/')
}

const compressImage = async (file: globalThis.File, quality = 0.75): Promise<globalThis.File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new globalThis.Image()

    img.onload = () => {
      const maxWidth = 1200
      const maxHeight = 1200
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const fileName = file.name.replace(/\.[^.]+$/, '.webp')
            const compressedFile = new globalThis.File([blob], fileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        },
        'image/webp',
        quality
      )
    }

    img.onerror = () => resolve(file)
    img.src = URL.createObjectURL(file)
  })
}

// ═══════════════════════════════════════════════════════════════
// UPLOAD FUNCTION
// ═══════════════════════════════════════════════════════════════

async function uploadFile(
  file: globalThis.File,
  options: {
    entityType?: string
    entityId?: string
    documentType?: string
    isImage?: boolean
  } = {}
): Promise<DocumentFile> {
  const formData = new FormData()
  formData.append('file', file)
  
  if (options.entityType) formData.append('entityType', options.entityType)
  if (options.entityId) formData.append('entityId', options.entityId)
  if (options.documentType) formData.append('documentType', options.documentType)
  if (options.isImage !== undefined) formData.append('isImage', String(options.isImage))
  
  const endpoint = options.isImage ? '/api/upload/image' : '/api/upload'
  
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  })
  
  const result = await response.json()
  
  if (!result.success || !result.data) {
    throw new Error(result.message || 'Upload failed')
  }
  
  return {
    id: result.data.id,
    name: result.data.fileName || result.data.originalName,
    originalName: result.data.originalName,
    size: result.data.fileSize,
    type: result.data.mimeType,
    url: result.data.url,
    thumbnailUrl: result.data.thumbnailUrl,
    entityType: result.data.entityType,
    entityId: result.data.entityId,
    createdAt: result.data.createdAt || new Date().toISOString(),
    isNew: true,
  }
}

async function deleteFile(id: string, hard = false): Promise<void> {
  const url = hard ? `/api/upload/${id}?hard=true` : `/api/upload/${id}`
  const response = await fetch(url, { method: 'DELETE' })
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Delete failed')
  }
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export function DocumentsManager({
  entityType,
  entityId,
  documentType,
  value = [],
  onChange,
  existingFiles = [],
  onExistingFilesChange,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  maxFiles = DEFAULT_MAX_FILES,
  maxTotalSize,
  multiple = true,
  isImage = false,
  onUpload,
  onDelete,
  onError,
  disabled = false,
  showExisting = true,
  allowDelete = true,
  safeDeleteMode = true,
  className,
  compact = false,
  gridCols = 4,
}: DocumentsManagerProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<DocumentFile | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const newFiles = value.filter(f => f.isNew)
  const permanentFiles = existingFiles.filter(f => !f.markedForDeletion)
  const markedForDeletion = existingFiles.filter(f => f.markedForDeletion)
  const totalFileCount = newFiles.length + permanentFiles.length
  
  const onDrop = useCallback(async (acceptedFiles: globalThis.File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(rejection => {
        const { file, errors } = rejection
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error(`File "${file.name}" quá lớn`, {
              description: `Kích thước tối đa: ${formatFileSize(maxSize)}`
            })
          } else if (error.code === 'file-invalid-type') {
            toast.error(`File "${file.name}" không đúng định dạng`)
          } else {
            toast.error(`Lỗi file "${file.name}"`, { description: error.message })
          }
        })
      })
    }
    
    if (acceptedFiles.length === 0) return
    
    const remainingSlots = maxFiles - totalFileCount
    if (remainingSlots <= 0) {
      toast.error('Đã đạt giới hạn số file', { description: `Tối đa ${maxFiles} file` })
      return
    }
    
    const filesToUpload = acceptedFiles.slice(0, remainingSlots)
    if (filesToUpload.length < acceptedFiles.length) {
      toast.warning(`Chỉ upload ${filesToUpload.length}/${acceptedFiles.length} file`)
    }
    
    if (maxTotalSize) {
      const currentSize = [...value, ...existingFiles].reduce((sum, f) => sum + f.size, 0)
      const newSize = filesToUpload.reduce((sum, f) => sum + f.size, 0)
      if (currentSize + newSize > maxTotalSize) {
        toast.error('Vượt quá dung lượng cho phép', {
          description: `Tổng dung lượng tối đa: ${formatFileSize(maxTotalSize)}`
        })
        return
      }
    }
    
    setIsUploading(true)
    setProgress(0)
    
    try {
      const uploadedFiles: DocumentFile[] = []
      
      for (let i = 0; i < filesToUpload.length; i++) {
        let file = filesToUpload[i]
        
        if (isImageFile(file.type)) {
          file = await compressImage(file)
        }
        
        setProgress(Math.round(((i + 0.5) / filesToUpload.length) * 100))
        
        const uploaded = await uploadFile(file, {
          entityType,
          entityId,
          documentType,
          isImage: isImageFile(file.type),
        })
        
        uploadedFiles.push(uploaded)
        setProgress(Math.round(((i + 1) / filesToUpload.length) * 100))
      }
      
      const newValue = [...value, ...uploadedFiles]
      onChange?.(newValue)
      onUpload?.(uploadedFiles)
      
      toast.success(`Đã tải lên ${uploadedFiles.length} file`)
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Upload failed')
      toast.error('Lỗi upload', { description: err.message })
      onError?.(err)
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }, [value, existingFiles, onChange, onUpload, onError, entityType, entityId, documentType, maxFiles, maxSize, maxTotalSize, totalFileCount])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: maxFiles - totalFileCount,
    multiple,
    disabled: disabled || isUploading,
  })
  
  const handleDeleteClick = (file: DocumentFile) => {
    setFileToDelete(file)
    setDeleteDialogOpen(true)
  }
  
  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return
    
    try {
      if (fileToDelete.isNew) {
        await deleteFile(fileToDelete.id, true)
        onChange?.(value.filter(f => f.id !== fileToDelete.id))
        toast.success('Đã xóa file')
      } else if (safeDeleteMode) {
        const updated = existingFiles.map(f => 
          f.id === fileToDelete.id ? { ...f, markedForDeletion: true } : f
        )
        onExistingFilesChange?.(updated)
        toast.info('File sẽ bị xóa khi lưu')
      } else {
        await deleteFile(fileToDelete.id, true)
        onExistingFilesChange?.(existingFiles.filter(f => f.id !== fileToDelete.id))
        toast.success('Đã xóa file')
      }
      onDelete?.(fileToDelete)
    } catch {
      toast.error('Lỗi xóa file')
    } finally {
      setDeleteDialogOpen(false)
      setFileToDelete(null)
    }
  }
  
  const handleRestore = (file: DocumentFile) => {
    const updated = existingFiles.map(f => 
      f.id === file.id ? { ...f, markedForDeletion: false } : f
    )
    onExistingFilesChange?.(updated)
    toast.info('Đã khôi phục file')
  }
  
  const handleRemoveNew = (file: DocumentFile) => {
    onChange?.(value.filter(f => f.id !== file.id))
  }
  
  const handlePreview = (file: DocumentFile) => {
    if (isImageFile(file.type)) {
      setPreviewUrl(file.url)
    } else {
      window.open(file.url, '_blank')
    }
  }
  
  const gridClass = `grid-cols-2 md:grid-cols-${gridCols}`
  
  if (compact) {
    return (
      <div className={cn('space-y-2', className)}>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button type="button" variant="outline" size="sm" disabled={disabled || isUploading}>
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isUploading ? 'Đang tải...' : 'Chọn file'}
          </Button>
        </div>
        {totalFileCount > 0 && (
          <p className="text-sm text-muted-foreground">{totalFileCount} file</p>
        )}
      </div>
    )
  }
  
  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          !isDragActive && 'border-muted-foreground/25 hover:border-primary/50',
          (disabled || isUploading) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
          ) : isImage ? (
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
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
                Tối đa {formatFileSize(maxSize)} / file
                {multiple && ` - ${maxFiles - totalFileCount} file còn lại`}
              </p>
            </>
          )}
        </div>
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">Đang tải lên... {progress}%</p>
        </div>
      )}
      
      {showExisting && permanentFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">File hiện có ({permanentFiles.length})</p>
          <div className={cn('grid gap-2', gridClass)}>
            {permanentFiles.map(file => (
              <FileCard
                key={file.id}
                file={file}
                onPreview={() => handlePreview(file)}
                onDelete={allowDelete ? () => handleDeleteClick(file) : undefined}
                isExisting
              />
            ))}
          </div>
        </div>
      )}
      
      {newFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-green-600">File mới ({newFiles.length})</p>
          <div className={cn('grid gap-2', gridClass)}>
            {newFiles.map(file => (
              <FileCard
                key={file.id}
                file={file}
                onPreview={() => handlePreview(file)}
                onDelete={() => handleRemoveNew(file)}
                isNew
              />
            ))}
          </div>
        </div>
      )}
      
      {safeDeleteMode && markedForDeletion.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-destructive">Sẽ xóa khi lưu ({markedForDeletion.length})</p>
          <div className={cn('grid gap-2', gridClass)}>
            {markedForDeletion.map(file => (
              <FileCard
                key={file.id}
                file={file}
                onRestore={() => handleRestore(file)}
                isMarkedForDeletion
              />
            ))}
          </div>
        </div>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              {safeDeleteMode && !fileToDelete?.isNew
                ? 'File sẽ được đánh dấu xóa và sẽ bị xóa vĩnh viễn khi bạn lưu thay đổi.'
                : 'File sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {previewUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <OptimizedImage src={previewUrl} alt="Preview" width={800} height={600} className="max-w-full max-h-full object-contain" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setPreviewUrl(null)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// FILE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

interface FileCardProps {
  file: DocumentFile
  onPreview?: () => void
  onDelete?: () => void
  onRestore?: () => void
  isNew?: boolean
  isExisting?: boolean
  isMarkedForDeletion?: boolean
}

function FileCard({
  file,
  onPreview,
  onDelete,
  onRestore,
  isNew,
  isMarkedForDeletion,
}: FileCardProps) {
  const isImg = isImageFile(file.type)
  
  return (
    <Card className={cn(
      'relative group overflow-hidden',
      isMarkedForDeletion && 'opacity-50 border-destructive'
    )}>
      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
        {isImg ? (
          <OptimizedImage
            src={file.thumbnailUrl || file.url}
            alt={file.originalName}
            fill
            containerClassName="w-full h-full"
            className="object-cover"
          />
        ) : (
          <FileIcon className="h-12 w-12 text-muted-foreground" />
        )}
        
        <div className="absolute inset-0 bg-black/50 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
          {onPreview && (
            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={onPreview}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {onRestore && (
            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={onRestore}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-2 border-t">
        <p className="text-xs truncate" title={file.originalName}>{file.originalName}</p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          {isNew && <span className="text-xs text-green-600 font-medium">Mới</span>}
          {isMarkedForDeletion && <span className="text-xs text-destructive font-medium">Xóa</span>}
        </div>
      </div>
    </Card>
  )
}

export { formatFileSize, isImageFile, compressImage, uploadFile, deleteFile }
