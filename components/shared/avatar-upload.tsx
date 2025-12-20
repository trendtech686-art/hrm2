'use client'

// ═══════════════════════════════════════════════════════════════
// AVATAR UPLOAD COMPONENT
// ═══════════════════════════════════════════════════════════════

import { useCallback, useState } from 'react'
import { Camera, User, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAvatarUpload } from '@/hooks/use-file-upload'

interface AvatarUploadProps {
  entityType: 'employees' | 'customers'
  entityId?: string
  currentUrl?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  editable?: boolean
  onChange?: (url: string) => void
  className?: string
}

const SIZE_MAP = {
  sm: 'h-10 w-10',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
  xl: 'h-32 w-32',
}

const ICON_SIZE_MAP = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-10 w-10',
}

export function AvatarUpload({
  entityType,
  entityId,
  currentUrl,
  name = '',
  size = 'lg',
  editable = true,
  onChange,
  className,
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { uploadAvatar, isUploading, error } = useAvatarUpload(entityType, entityId)
  
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh')
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
    
    try {
      const result = await uploadAvatar(file)
      onChange?.(result.url)
    } catch (err) {
      // Reset preview on error
      setPreviewUrl(null)
    }
  }, [uploadAvatar, onChange])
  
  const displayUrl = previewUrl || currentUrl
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  
  return (
    <div className={cn('relative inline-block', className)}>
      <Avatar className={cn(SIZE_MAP[size])}>
        <AvatarImage src={displayUrl || undefined} alt={name} />
        <AvatarFallback className="bg-muted">
          {initials || <User className={cn(ICON_SIZE_MAP[size], 'text-muted-foreground')} />}
        </AvatarFallback>
      </Avatar>
      
      {editable && (
        <>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id={`avatar-upload-${entityId}`}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <label
            htmlFor={`avatar-upload-${entityId}`}
            className={cn(
              'absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground p-1.5 cursor-pointer hover:bg-primary/90 transition-colors',
              isUploading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isUploading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Camera className="h-3 w-3" />
            )}
          </label>
        </>
      )}
      
      {error && (
        <p className="text-xs text-destructive mt-1">
          {error.message}
        </p>
      )}
    </div>
  )
}
