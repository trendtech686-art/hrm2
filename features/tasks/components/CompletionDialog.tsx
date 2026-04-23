'use client'

import * as React from 'react'
import { useState } from 'react'
import { CheckCircle2, Loader2, Upload, X } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

import { FileUploadAPI, type UploadedAsset } from '@/lib/file-upload-api'
import { logError } from '@/lib/logger'
import { cn } from '@/lib/utils'
import { useTasksSettings } from '@/features/settings/tasks/hooks/use-tasks-settings'

import type { Task } from '../types'

const QUICK_NOTE_OPTIONS = [
  'Đã hoàn thành đúng yêu cầu',
  'Đã sắp xếp/dọn dẹp xong khu vực được giao',
  'Đã kiểm tra và xác nhận hàng hóa đầy đủ',
  'Đã xử lý đơn hàng và giao cho vận chuyển',
  'Đã cập nhật thông tin sản phẩm trên hệ thống',
  'Đã liên hệ khách hàng và giải quyết vấn đề',
] as const

const CUSTOM_NOTE_VALUE = '__custom__'

interface CompletionDialogProps {
  task: Task
  open: boolean
  onClose: () => void
  onSubmit: (taskId: string, evidence: { images: string[]; note: string }) => Promise<void>
  initialImages?: UploadedAsset[]
}

type EvidenceFile = UploadedAsset

export function CompletionDialog({
  task,
  open,
  onClose,
  onSubmit,
  initialImages,
}: CompletionDialogProps) {
  const [note, setNote] = useState('')
  const [images, setImages] = useState<EvidenceFile[]>(initialImages ?? [])
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    if (open && initialImages && initialImages.length > 0) {
      setImages(initialImages)
    }
  }, [open, initialImages])

  const { data: tasksSettings } = useTasksSettings()
  const evidenceSettings = tasksSettings.evidence
  const maxImages = evidenceSettings.maxImages
  const minNoteLength = evidenceSettings.minNoteLength
  const maxSizeMB = evidenceSettings.imageMaxSizeMB
  const requireNote = evidenceSettings.requireNoteWithImages

  const isQuickNote = (QUICK_NOTE_OPTIONS as readonly string[]).includes(note)
  const radioValue = isQuickNote ? note : note.length > 0 ? CUSTOM_NOTE_VALUE : ''

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setError(null)

    if (images.length + files.length > maxImages) {
      setError(`Chỉ được upload tối đa ${maxImages} ảnh`)
      return
    }

    const oversizedFiles = files.filter((f) => f.size > maxSizeMB * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError(`Mỗi ảnh không được vượt quá ${maxSizeMB}MB`)
      return
    }

    setIsUploading(true)
    try {
      const uploaded = await FileUploadAPI.uploadTaskEvidence(task.systemId, files)
      setImages((prev) => [...prev, ...uploaded])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi khi upload ảnh. Vui lòng thử lại.')
      logError('Error uploading task evidence', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async (imageId: string) => {
    const target = images.find((img) => img.id === imageId)
    if (!target) return
    setIsUploading(true)
    try {
      await FileUploadAPI.deleteFile(target.id)
      setImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa file. Vui lòng thử lại.')
      logError('Error deleting task file', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async () => {
    setError(null)

    if (images.length === 0) {
      setError('Vui lòng upload ít nhất 1 ảnh bằng chứng')
      return
    }

    if (requireNote && note.trim().length < minNoteLength) {
      setError(`Ghi chú phải có ít nhất ${minNoteLength} ký tự`)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(task.systemId, {
        images: images.map((img) => img.url),
        note: note.trim(),
      })
      setNote('')
      setImages([])
      onClose()
    } catch (err) {
      setError('Có lỗi khi gửi bằng chứng. Vui lòng thử lại.')
      logError('Error submitting completion evidence', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setNote('')
      setError(null)
      setImages([])
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          'p-0 gap-0',
          'max-w-[100vw] h-dvh rounded-none sm:h-auto sm:max-w-2xl sm:rounded-lg sm:max-h-[90vh]',
          'flex flex-col',
        )}
      >
        <DialogHeader className="border-b px-4 py-3 sm:px-6 sm:py-4 text-left">
          <DialogTitle>Hoàn thành công việc</DialogTitle>
          <DialogDescription>
            Gửi ảnh bằng chứng và mô tả để quản lý kiểm tra.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-5">
          {/* Task info */}
          <div className="rounded-md border bg-muted/30 p-3">
            <p className="text-sm font-medium line-clamp-2">{task.title}</p>
            {task.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-3">
                {task.description}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="flex items-baseline justify-between gap-2">
              <span>
                Ảnh bằng chứng <span className="text-destructive">*</span>
              </span>
              <span className="text-[11px] font-normal text-muted-foreground">
                Tối đa {maxImages} ảnh · {maxSizeMB}MB/ảnh
              </span>
            </Label>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square overflow-hidden rounded-md border bg-muted group"
                  >
                    <OptimizedImage
                      src={image.url}
                      alt="Evidence"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow"
                      onClick={() => handleRemoveImage(image.id)}
                      disabled={isUploading || isSubmitting}
                      aria-label="Xóa ảnh"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {images.length < maxImages && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="evidence-upload"
                  disabled={isUploading || isSubmitting}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10"
                  disabled={isUploading || isSubmitting}
                  asChild
                >
                  <label htmlFor="evidence-upload" className="cursor-pointer">
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang upload...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Chọn ảnh ({images.length}/{maxImages})
                      </>
                    )}
                  </label>
                </Button>
              </>
            )}
          </div>

          {/* Quick note + custom note */}
          <div className="space-y-2">
            <Label className="flex items-baseline justify-between gap-2">
              <span>
                Mô tả hoàn thành {requireNote && <span className="text-destructive">*</span>}
              </span>
              {minNoteLength > 0 && (
                <span className="text-[11px] font-normal text-muted-foreground">
                  Tối thiểu {minNoteLength} ký tự
                </span>
              )}
            </Label>

            <RadioGroup
              value={radioValue}
              onValueChange={(v) => {
                const next = String(v)
                if (next === CUSTOM_NOTE_VALUE) {
                  if (isQuickNote) setNote('')
                } else {
                  setNote(next)
                }
              }}
              className="gap-1.5"
            >
              {QUICK_NOTE_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={cn(
                    'flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors text-sm',
                    note === option
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50',
                  )}
                >
                  <RadioGroupItem value={option} disabled={isSubmitting} />
                  <span className="flex-1">{option}</span>
                </label>
              ))}
              <label
                className={cn(
                  'flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors text-sm',
                  radioValue === CUSTOM_NOTE_VALUE
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50',
                )}
              >
                <RadioGroupItem value={CUSTOM_NOTE_VALUE} disabled={isSubmitting} />
                <span className="flex-1">Khác (tự nhập)</span>
              </label>
            </RadioGroup>

            <Textarea
              id="completion-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Hoặc tự nhập mô tả chi tiết..."
              rows={3}
              disabled={isSubmitting}
              className={cn(
                requireNote &&
                  note.length > 0 &&
                  note.length < minNoteLength &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>
                {requireNote && minNoteLength > 0 && note.length > 0 && (
                  note.length < minNoteLength
                    ? `Còn ${minNoteLength - note.length} ký tự nữa`
                    : 'Đủ ký tự'
                )}
              </span>
              <span className="tabular-nums">{note.length} ký tự</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Sau khi gửi, admin sẽ xem xét và phê duyệt. Bạn sẽ nhận được thông báo khi có kết
              quả.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="border-t px-4 py-3 sm:px-6 sm:py-4 flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              isUploading ||
              images.length === 0 ||
              (requireNote && note.trim().length < minNoteLength)
            }
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Gửi hoàn thành
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
