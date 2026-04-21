'use client'

import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function ReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-lg mx-auto">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Không tải được mục báo cáo</AlertTitle>
        <AlertDescription>
          {error.message || 'Đã xảy ra lỗi không mong muốn. Bạn có thể thử lại.'}
        </AlertDescription>
      </Alert>
      <Button type="button" onClick={() => reset()}>
        Thử lại
      </Button>
    </div>
  )
}
