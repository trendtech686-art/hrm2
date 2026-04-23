'use client'

import * as React from 'react'
import { useAppearanceStore } from '@/features/settings/appearance/store'

/**
 * Cập nhật <meta name="theme-color"> theo nền hiện tại (--background) sau khi theme áp dụng,
 * thay vì màu cố định trong `layout` viewport.
 */
export function ThemeColorMeta() {
  const customThemeConfig = useAppearanceStore((s) => s.customThemeConfig)
  const colorMode = useAppearanceStore((s) => s.colorMode)

  const sync = React.useCallback(() => {
    if (typeof document === 'undefined') return
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
    if (!bg) return
    let meta = document.querySelector('meta[name="theme-color"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'theme-color')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', bg)
  }, [])

  React.useEffect(() => {
    // Sau khi class light/dark + biến CSS từ ThemeProvider ổn định
    sync()
  }, [customThemeConfig, colorMode, sync])

  return null
}
