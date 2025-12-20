// ═══════════════════════════════════════════════════════════════
// USE FILE UPLOAD HOOK
// ═══════════════════════════════════════════════════════════════
// React hook for file uploads with progress tracking
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Types
export interface UploadedFile {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  fileSize: number
  url: string
  thumbnailUrl?: string
  entityType?: string
  entityId?: string
  createdAt?: string
  width?: number
  height?: number
}

export interface UploadOptions {
  entityType?: string
  entityId?: string
  isImage?: boolean
  thumbnail?: boolean
  resize?: 'thumbnail' | 'small' | 'medium' | 'large'
  userId?: string
  onProgress?: (progress: number) => void
  onSuccess?: (file: UploadedFile) => void
  onError?: (error: Error) => void
}

export interface UseFileUploadReturn {
  upload: (file: File, options?: UploadOptions) => Promise<UploadedFile>
  uploadMultiple: (files: File[], options?: UploadOptions) => Promise<UploadedFile[]>
  isUploading: boolean
  progress: number
  error: Error | null
  reset: () => void
}

// Upload single file
async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadedFile> {
  const formData = new FormData()
  formData.append('file', file)
  
  if (options.entityType) formData.append('entityType', options.entityType)
  if (options.entityId) formData.append('entityId', options.entityId)
  if (options.isImage !== undefined) formData.append('isImage', String(options.isImage))
  if (options.thumbnail !== undefined) formData.append('thumbnail', String(options.thumbnail))
  if (options.resize) formData.append('resize', options.resize)
  if (options.userId) formData.append('userId', options.userId)
  
  // Choose endpoint based on image flag
  const endpoint = options.isImage ? '/api/upload/image' : '/api/upload'
  
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  })
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.message || 'Upload failed')
  }
  
  return result.data
}

// Delete file
async function deleteFile(id: string, hard = false): Promise<void> {
  const url = hard ? `/api/upload/${id}?hard=true` : `/api/upload/${id}`
  
  const response = await fetch(url, {
    method: 'DELETE',
  })
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.message || 'Delete failed')
  }
}

// Get files by entity
async function getFiles(entityType?: string, entityId?: string): Promise<UploadedFile[]> {
  const params = new URLSearchParams()
  if (entityType) params.append('entityType', entityType)
  if (entityId) params.append('entityId', entityId)
  
  const response = await fetch(`/api/upload?${params}`)
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to get files')
  }
  
  return result.data
}

// Main upload hook
export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  
  const upload = useCallback(async (file: File, options: UploadOptions = {}) => {
    setIsUploading(true)
    setProgress(0)
    setError(null)
    
    try {
      // Simulate progress (real progress would need XHR)
      setProgress(30)
      
      const result = await uploadFile(file, {
        ...options,
        isImage: options.isImage ?? file.type.startsWith('image/'),
      })
      
      setProgress(100)
      options.onSuccess?.(result)
      
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed')
      setError(error)
      options.onError?.(error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [])
  
  const uploadMultiple = useCallback(async (files: File[], options: UploadOptions = {}) => {
    const results: UploadedFile[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setProgress(Math.round((i / files.length) * 100))
      
      const result = await upload(file, options)
      results.push(result)
    }
    
    setProgress(100)
    return results
  }, [upload])
  
  const reset = useCallback(() => {
    setIsUploading(false)
    setProgress(0)
    setError(null)
  }, [])
  
  return {
    upload,
    uploadMultiple,
    isUploading,
    progress,
    error,
    reset,
  }
}

// Hook for entity files (with React Query)
export function useEntityFiles(entityType?: string, entityId?: string) {
  const queryClient = useQueryClient()
  
  const queryKey = ['files', entityType, entityId]
  
  const { data: files = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: () => getFiles(entityType, entityId),
    enabled: !!entityType,
  })
  
  const deleteMutation = useMutation({
    mutationFn: ({ id, hard }: { id: string; hard?: boolean }) => deleteFile(id, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
  
  return {
    files,
    isLoading,
    error,
    deleteFile: (id: string, hard = false) => deleteMutation.mutate({ id, hard }),
    isDeleting: deleteMutation.isPending,
    refetch: () => queryClient.invalidateQueries({ queryKey }),
  }
}

// Hook for avatar upload (employee/customer)
export function useAvatarUpload(entityType: 'employees' | 'customers', entityId?: string) {
  const { upload, isUploading, error, progress } = useFileUpload()
  const queryClient = useQueryClient()
  
  const uploadAvatar = useCallback(async (file: File) => {
    const result = await upload(file, {
      entityType,
      entityId,
      isImage: true,
      thumbnail: true,
      resize: 'medium',
    })
    
    // Invalidate entity query to refresh avatar
    queryClient.invalidateQueries({ queryKey: [entityType, entityId] })
    
    return result
  }, [upload, entityType, entityId, queryClient])
  
  return {
    uploadAvatar,
    isUploading,
    error,
    progress,
  }
}

// Hook for product images
export function useProductImages(productId?: string) {
  const { upload, uploadMultiple, isUploading, error, progress } = useFileUpload()
  const { files, deleteFile, refetch } = useEntityFiles('products', productId)
  
  const uploadImages = useCallback(async (imageFiles: File[]) => {
    const results = await uploadMultiple(imageFiles, {
      entityType: 'products',
      entityId: productId,
      isImage: true,
      thumbnail: true,
    })
    
    refetch()
    return results
  }, [uploadMultiple, productId, refetch])
  
  return {
    images: files,
    uploadImages,
    deleteImage: deleteFile,
    isUploading,
    error,
    progress,
    refetch,
  }
}
