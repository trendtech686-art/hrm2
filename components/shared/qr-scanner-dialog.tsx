'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { X, Upload, Camera } from 'lucide-react'

interface QrScannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onScan: (value: string) => void
  title?: string
}

function canUseCamera(): boolean {
  if (typeof window === 'undefined') return false
  if (typeof navigator === 'undefined') return false
  // Some browsers expose mediaDevices only in secure contexts; trust isSecureContext
  // and also verify the getUserMedia method is actually callable.
  if (window.isSecureContext === false) return false
  return !!navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function'
}

export function QrScannerDialog({ open, onOpenChange, onScan, title = 'Quét mã QR / Barcode' }: QrScannerDialogProps) {
  const scannerRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const html5QrCodeRef = React.useRef<import('html5-qrcode').Html5Qrcode | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isStarting, setIsStarting] = React.useState(false)
  // true → hiển thị UI "Chụp/Chọn ảnh"; false → hiển thị live camera stream.
  const [useFileFallback, setUseFileFallback] = React.useState(false)

  React.useEffect(() => {
    if (!open) return

    if (!canUseCamera()) {
      setUseFileFallback(true)
      setError(null)
      return
    }
    setUseFileFallback(false)

    let cancelled = false
    let isRunning = false

    const startScanner = async () => {
      setIsStarting(true)
      setError(null)

      try {
        const { Html5Qrcode } = await import('html5-qrcode')

        if (cancelled) return

        const scannerId = 'qr-scanner-region'
        const scanner = new Html5Qrcode(scannerId)
        html5QrCodeRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            onScan(decodedText)
            onOpenChange(false)
          },
          () => {
            // ignore scan failures (no QR detected in frame)
          }
        )
        isRunning = true
      } catch (err) {
        if (!cancelled) {
          const name = err instanceof Error ? err.name : ''
          const msg = err instanceof Error ? err.message : String(err)
          // Camera runtime errors → switch to file fallback automatically so user still có đường dùng.
          if (
            name === 'NotAllowedError' ||
            name === 'SecurityError' ||
            name === 'NotReadableError' ||
            msg.includes('NotAllowedError') ||
            msg.includes('Permission')
          ) {
            setError('Vui lòng cấp quyền camera hoặc chọn ảnh mã để quét.')
            setUseFileFallback(true)
          } else if (name === 'NotFoundError' || msg.includes('NotFoundError') || msg.includes('no camera')) {
            setError('Không tìm thấy camera — bạn có thể chọn ảnh mã để quét.')
            setUseFileFallback(true)
          } else {
            setError('Không thể khởi động camera: ' + msg)
          }
        }
      } finally {
        if (!cancelled) setIsStarting(false)
      }
    }

    startScanner()

    return () => {
      cancelled = true
      const scanner = html5QrCodeRef.current
      if (scanner && isRunning) {
        scanner.stop().then(() => scanner.clear()).catch(() => {})
      }
      html5QrCodeRef.current = null
    }
  }, [open, onScan, onOpenChange])

  const handleFileSelect = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode('qr-file-scanner')
      const result = await scanner.scanFile(file, true)
      onScan(result)
      onOpenChange(false)
    } catch {
      setError('Không tìm thấy mã QR/Barcode trong ảnh. Vui lòng chụp rõ hơn.')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [onScan, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden [&>button]:hidden">
        <DialogHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base">{title}</DialogTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {useFileFallback ? (
          /* Fallback: chụp/chọn ảnh mã để quét (khi camera không khả dụng hoặc bị chặn). */
          <div className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Camera không khả dụng. Bạn có thể chụp ảnh mã QR/Barcode để quét.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Chọn ảnh / Chụp ảnh
            </Button>
            {canUseCamera() && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-2 text-muted-foreground"
                onClick={() => {
                  setError(null)
                  setUseFileFallback(false)
                }}
              >
                <Camera className="h-4 w-4" />
                Thử lại camera
              </Button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            {/* Hidden div for html5-qrcode scanFile */}
            <div id="qr-file-scanner" className="hidden" />
          </div>
        ) : (
          /* Normal mode: camera streaming */
          <>
            <div className="relative bg-black">
              <div
                ref={scannerRef}
                id="qr-scanner-region"
                className="w-full aspect-square"
              />
              {isStarting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span className="text-sm text-white">Đang khởi động camera...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 px-6">
                  <div className="text-center space-y-3">
                    <p className="text-sm text-white">{error}</p>
                    <div className="flex flex-col gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setUseFileFallback(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Chuyển sang chụp ảnh
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white" onClick={() => onOpenChange(false)}>
                        Đóng
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">Hướng camera vào mã QR hoặc barcode để quét</p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
