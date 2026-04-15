'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Upload, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { NewDocumentsUpload } from '@/components/ui/new-documents-upload'
import { FileUploadAPI, type StagingFile } from '@/lib/file-upload-api'
import { logError } from '@/lib/logger'

interface WarrantyUploadProcessedImagesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warrantySystemId: string
  existingImages: string[]
  onUploaded: (newImageUrls: string[]) => void
}

/**
 * Dialog upload hình ảnh đã xử lý — mở khi bấm "Đánh dấu Hoàn tất"
 * mà chưa có ảnh xử lý. Upload xong tự lưu vào warranty rồi gọi callback.
 */
export function WarrantyUploadProcessedImagesDialog({
  open,
  onOpenChange,
  warrantySystemId,
  existingImages,
  onUploaded,
}: WarrantyUploadProcessedImagesDialogProps) {
  const [stagingFiles, setStagingFiles] = React.useState<StagingFile[]>([])
  const [sessionId, setSessionId] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset state khi mở dialog
  React.useEffect(() => {
    if (open) {
      setStagingFiles([])
      setSessionId(null)
      setIsSubmitting(false)
    }
  }, [open])

  const handleConfirm = async () => {
    if (stagingFiles.length === 0) {
      toast.error('Vui lòng upload ít nhất 1 hình ảnh đã xử lý')
      return
    }

    const filesWithSession = stagingFiles.filter(f => f.sessionId)
    const actualSessionId = filesWithSession[0]?.sessionId
    if (!actualSessionId) {
      toast.error('Lỗi session upload, vui lòng thử lại')
      return
    }

    setIsSubmitting(true)
    const confirmToast = toast.loading('Đang lưu hình ảnh đã xử lý...')

    try {
      const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
        actualSessionId,
        warrantySystemId,
        'warranty',
        'processed',
      )

      const newUrls = [
        ...existingImages,
        ...confirmedFiles.map(f => f.url),
      ]

      // Update warranty processedImages via API
      const res = await fetch(`/api/warranties/${warrantySystemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processedImages: newUrls }),
      })

      if (!res.ok) {
        throw new Error('Không thể cập nhật hình ảnh')
      }

      // Cleanup staging
      FileUploadAPI.deleteStagingFiles(actualSessionId).catch(() => {})

      toast.success('Đã lưu hình ảnh đã xử lý', { id: confirmToast })
      onUploaded(newUrls)
      onOpenChange(false)
    } catch (error) {
      logError('Upload processed images failed', error)
      toast.error('Lỗi lưu hình ảnh', { id: confirmToast })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload hình ảnh đã xử lý
          </DialogTitle>
          <DialogDescription>
            Vui lòng upload hình ảnh đã xử lý trước khi đánh dấu &quot;Hoàn tất&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <NewDocumentsUpload
            maxFiles={50}
            maxTotalSize={50 * 1024 * 1024}
            existingFileCount={existingImages.length}
            value={stagingFiles}
            onChange={setStagingFiles}
            sessionId={sessionId || undefined}
            onSessionChange={setSessionId}
            disabled={isSubmitting}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || stagingFiles.length === 0}
          >
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</> : `Lưu ${stagingFiles.length > 0 ? `(${stagingFiles.length} ảnh)` : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
