import * as React from 'react'
import { useAppearanceStore, loadAppearanceFromDatabase } from '../features/settings/appearance/store'
import type { CustomThemeConfig } from '../features/settings/appearance/store'

/**
 * CSS variables applied to <html>. We intentionally do NOT set --font-sans / --font-serif / --font-mono
 * here: those are defined by next/font on <body> (see app/layout.tsx). Values in customThemeConfig
 * for those keys are still persisted for the Appearance settings UI / DB, but overriding them on
 * :root would fight the self-hosted font stacks and often had no visible effect on body text.
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
] as const satisfies readonly (keyof CustomThemeConfig)[]

function applyTheme(customThemeConfig: CustomThemeConfig, colorMode: string, fontSize: string) {
  const root = window.document.documentElement

  root.classList.remove('light', 'dark')
  root.classList.add(colorMode)

  root.classList.remove('font-size-sm', 'font-size-base', 'font-size-lg')
  root.classList.add(`font-size-${fontSize}`)

  for (const varName of CSS_VAR_KEYS) {
    const value = customThemeConfig[varName]
    if (value) root.style.setProperty(varName, value)
  }

  const shadow = `${customThemeConfig['--shadow-x'] || '0px'} ${customThemeConfig['--shadow-y'] || '1px'} ${customThemeConfig['--shadow-blur'] || '2px'} ${customThemeConfig['--shadow-spread'] || '0px'} ${customThemeConfig['--shadow-color'] || 'hsl(0 0% 0% / 0.05)'}`
  root.style.setProperty('--shadow', shadow)
}

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const customThemeConfig = useAppearanceStore(s => s.customThemeConfig)
  const colorMode = useAppearanceStore(s => s.colorMode)
  const fontSize = useAppearanceStore(s => s.fontSize)

  React.useEffect(() => {
    if (!customThemeConfig) return
    applyTheme(customThemeConfig, colorMode, fontSize)
  }, [customThemeConfig, colorMode, fontSize])

  React.useEffect(() => {
    void loadAppearanceFromDatabase()
  }, [])

  return <>{children}</>
}
