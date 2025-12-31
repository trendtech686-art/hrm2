'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Đã xảy ra lỗi!</h2>
          <p className="max-w-md text-muted-foreground">
            {error.message || 'Có lỗi không mong muốn xảy ra. Vui lòng thử lại.'}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Mã lỗi: {error.digest}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => reset()} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Thử lại
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'} className="gap-2">
          <Home className="h-4 w-4" />
          Về trang chủ
        </Button>
      </div>
    </div>
  )
}
