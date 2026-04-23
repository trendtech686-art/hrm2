'use client'

import { useState } from 'react'
import { Calendar, User, X } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { cn } from '@/lib/utils'

import type { CompletionEvidence } from '../types'

interface EvidenceViewerProps {
  evidence: CompletionEvidence
  open: boolean
  onClose: () => void
}

export function EvidenceViewer({ evidence, open, onClose }: EvidenceViewerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          className={cn(
            'p-0 gap-0 flex flex-col',
            'max-w-[100vw] h-dvh rounded-none sm:h-auto sm:max-w-4xl sm:rounded-lg sm:max-h-[90vh]',
          )}
        >
          <DialogHeader className="border-b px-4 py-3 sm:px-6 sm:py-4 text-left">
            <DialogTitle>Bằng chứng hoàn thành</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-5">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{evidence.submittedByName}</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(evidence.submittedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </span>
              </div>
              <Badge variant="outline">{evidence.images.length} ảnh</Badge>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Ảnh bằng chứng</h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {evidence.images.map((imageUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    className="relative h-36 overflow-hidden rounded-md border cursor-pointer group"
                    onClick={() => setSelectedImage(imageUrl)}
                  >
                    <OptimizedImage
                      src={imageUrl}
                      alt={`Evidence ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover transition-transform group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            {evidence.note && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Mô tả</h4>
                <div className="rounded-md border bg-muted/30 p-3 text-sm whitespace-pre-wrap">
                  {evidence.note}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Full image viewer */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent
            className={cn(
              'p-0 gap-0 border-0 bg-black',
              'max-w-[100vw] h-dvh rounded-none sm:h-auto sm:max-w-[95vw] sm:max-h-[95vh] sm:rounded-lg',
            )}
          >
            <div className="relative min-h-[80vh] w-full">
              <OptimizedImage
                src={selectedImage}
                alt="Evidence full"
                fill
                unoptimized
                className="object-contain"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 hover:bg-background"
                onClick={() => setSelectedImage(null)}
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border bg-background/80 px-3 py-2">
                {evidence.images.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(url)}
                    className={cn(
                      'h-2 w-2 rounded-full transition-colors',
                      url === selectedImage ? 'bg-foreground' : 'bg-muted-foreground/40',
                    )}
                    aria-label={`Xem ảnh ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
