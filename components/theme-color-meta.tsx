'use client'

import * as React from 'react'

/**
 * Cập nhật <meta name="theme-color"> theo nền hiện tại (--background) sau khi theme áp dụng,
 * thay vì màu cố định trong `layout` viewport.
 * Đọc trực tiếp từ CSS variable đã được ThemeProvider apply vào DOM.
 */
export function ThemeColorMeta() {
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

  // Sync on mount
  React.useEffect(() => {
    sync()
  }, [sync])

  // Re-sync when theme changes (via theme-change event from ThemeProvider)
  React.useEffect(() => {
    const handleThemeChange = () => {
      sync()
    }
    window.addEventListener('theme-change', handleThemeChange)
    return () => window.removeEventListener('theme-change', handleThemeChange)
  }, [sync])

  return null
}
