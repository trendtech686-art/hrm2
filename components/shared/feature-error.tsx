'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react'
import * as Sentry from '@sentry/nextjs'

interface FeatureErrorProps {
  error: Error & { digest?: string }
  reset: () => void
  featureName: string
  backHref?: string
  backLabel?: string
}

/**
 * Reusable error boundary UI for feature-level error.tsx files.
 * Reports errors to Sentry and provides retry + navigation options.
 */
export function FeatureError({
  error,
  reset,
  featureName,
  backHref = '/dashboard',
  backLabel = 'Về Dashboard',
}: FeatureErrorProps) {
  useEffect(() => {
    // Report to Sentry with feature context
    Sentry.captureException(error, {
      tags: { feature: featureName },
    })
  }, [error, featureName])

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">
            Lỗi tải {featureName}
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/60">
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
          onClick={() => (window.location.href = backHref)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Button>
      </div>
    </div>
  )
}
