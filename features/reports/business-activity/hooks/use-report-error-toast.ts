'use client'

import * as React from 'react'
import { toast } from 'sonner'

/**
 * Show a single toast when a report query fails (avoids silent tables).
 */
export function useReportErrorToast(isError: boolean, error: unknown) {
  const shownRef = React.useRef(false)

  React.useEffect(() => {
    if (!isError || !error) {
      shownRef.current = false
      return
    }
    if (shownRef.current) return
    shownRef.current = true
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Không tải được báo cáo'
    toast.error(message)
  }, [isError, error])
}
