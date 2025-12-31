'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw, LayoutDashboard } from 'lucide-react'

export default function AuthenticatedError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Authenticated route error:', error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Không thể tải trang</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            {error.message || 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.'}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Mã lỗi: {error.digest}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => reset()} size="sm" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Thử lại
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = '/dashboard'} 
          className="gap-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          Về Dashboard
        </Button>
      </div>
    </div>
  )
}
