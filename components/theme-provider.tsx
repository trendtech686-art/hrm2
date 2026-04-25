import * as React from 'react'
import { useEffect, useState } from 'react'

/**
 * ThemeProvider — client-only theme sync
 *
 * Theme is set at SSR time via app/layout.tsx (server injects CSS vars + html class).
 * This provider syncs client state with the server-rendered DOM and listens for
 * theme-change events dispatched by AppearancePage when user saves new preferences.
 * Runs entirely on the client to avoid "window is not defined" SSR errors.
 */

const CSS_VAR_KEYS = [
  '--background', '--foreground', '--card', '--card-foreground',
  '--popover', '--popover-foreground', '--primary', '--primary-foreground',
  '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
  '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
  '--success', '--success-foreground', '--warning', '--warning-foreground', '--info', '--info-foreground',
  '--border', '--input', '--ring',
  '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5',
  '--sidebar', '--sidebar-foreground', '--sidebar-primary', '--sidebar-primary-foreground',
  '--sidebar-accent', '--sidebar-accent-foreground', '--sidebar-border', '--sidebar-ring',
  '--radius',
  '--font-size-h1', '--font-size-h2', '--font-size-h3', '--font-size-h4', '--font-size-h5', '--font-size-h6',
  '--shadow',
] as const

type CustomThemeConfig = Partial<Record<string, string>>
type ThemeSnapshot = { colorMode: string; fontSize: string; customThemeConfig: CustomThemeConfig }

// ── Theme state from DOM (set by server at SSR time) ──────────────────────────

function readThemeFromDOM(): ThemeSnapshot {
  if (typeof document === 'undefined') {
    return { colorMode: 'light', fontSize: 'base', customThemeConfig: {} }
  }
  const root = document.documentElement
  const config: CustomThemeConfig = {}
  for (const varName of CSS_VAR_KEYS) {
    const value = root.style.getPropertyValue(varName).trim()
    if (value) config[varName] = value
  }
  const isDark = root.classList.contains('dark')
  const fontSize = root.classList.contains('font-size-sm')
    ? 'sm'
    : root.classList.contains('font-size-lg')
      ? 'lg'
      : 'base'
  return { colorMode: isDark ? 'dark' : 'light', fontSize, customThemeConfig: config }
}

// ── Apply theme to DOM ────────────────────────────────────────────────────────

function applyThemeToDOM(customThemeConfig: CustomThemeConfig, colorMode: string, fontSize: string) {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  root.classList.remove('light', 'dark')
  root.classList.add(colorMode)

  root.classList.remove('font-size-sm', 'font-size-base', 'font-size-lg')
  root.classList.add(`font-size-${fontSize}`)

  for (const [key, value] of Object.entries(customThemeConfig)) {
    if (value) root.style.setProperty(key, value)
  }
}

export function applyTheme(customThemeConfig: CustomThemeConfig, colorMode: string, fontSize: string) {
  applyThemeToDOM(customThemeConfig, colorMode, fontSize)
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeSnapshot>(() => readThemeFromDOM())

  // Apply theme to DOM whenever theme state changes
  useEffect(() => {
    applyThemeToDOM(theme.customThemeConfig, theme.colorMode, theme.fontSize)
  }, [theme])

  // Subscribe to theme-change events - APPLY IMMEDIATELY to DOM before re-render
  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<ThemeSnapshot>;
      const { colorMode, fontSize, customThemeConfig } = customEvent.detail;

      // Apply to DOM IMMEDIATELY so chart colors are ready when re-render happens
      applyThemeToDOM(customThemeConfig || {}, colorMode, fontSize);

      // Then update state to trigger re-render
      setTheme({ colorMode, fontSize, customThemeConfig: customThemeConfig || {} });
    }

    window.addEventListener('theme-change', handleThemeChange)
    return () => window.removeEventListener('theme-change', handleThemeChange)
  }, [])

  return <>{children}</>
}
