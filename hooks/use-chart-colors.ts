/**
 * Theme Store - Global state cho chart colors
 * 
 * Architecture:
 * - Theme settings được save qua API và lưu vào DB
 * - Khi save, apply vào DOM ngay lập tức
 * - Khi chart mount, đọc colors từ DOM (đã được apply bởi ThemeProvider)
 * - Khi theme-change event fire, chart force re-render
 */

import { oklchToHex } from '@/lib/oklch-to-hex'

// Default colors
const DEFAULT_COLORS: Record<string, string> = {
  '--chart-1': 'oklch(0.646 0.222 41.116)',
  '--chart-2': 'oklch(0.6 0.118 184.704)',
  '--chart-3': 'oklch(0.398 0.07 227.392)',
  '--chart-4': 'oklch(0.828 0.189 84.429)',
  '--chart-5': 'oklch(0.769 0.188 70.08)',
}

export interface ChartColors {
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
}

// ──────────────────────────────────────────────────────────────────────────────
// Global State
// ──────────────────────────────────────────────────────────────────────────────

// Initial default colors (for SSR)
const initialColors: ChartColors = {
  chart1: '#22c55e',
  chart2: '#06b6d4',
  chart3: '#6366f1',
  chart4: '#eab308',
  chart5: '#f97316',
}

// Đọc colors từ DOM - LUÔN đọc fresh, không cache
function readColorsFromDOM(): ChartColors {
  if (typeof document === 'undefined') {
    return initialColors
  }

  const root = document.documentElement
  const chart1 = root.style.getPropertyValue('--chart-1').trim() || DEFAULT_COLORS['--chart-1']
  const chart2 = root.style.getPropertyValue('--chart-2').trim() || DEFAULT_COLORS['--chart-2']
  const chart3 = root.style.getPropertyValue('--chart-3').trim() || DEFAULT_COLORS['--chart-3']
  const chart4 = root.style.getPropertyValue('--chart-4').trim() || DEFAULT_COLORS['--chart-4']
  const chart5 = root.style.getPropertyValue('--chart-5').trim() || DEFAULT_COLORS['--chart-5']

  return {
    chart1: oklchToHex(chart1),
    chart2: oklchToHex(chart2),
    chart3: oklchToHex(chart3),
    chart4: oklchToHex(chart4),
    chart5: oklchToHex(chart5),
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Get chart colors - LUÔN đọc fresh từ DOM
 */
export function getChartColors(): ChartColors {
  return readColorsFromDOM()
}

/**
 * Subscribe vào theme changes - trigger re-render cho components
 */
const themeListeners = new Set<() => void>()

export function subscribeToThemeChanges(callback: () => void): () => void {
  themeListeners.add(callback)
  return () => {
    themeListeners.delete(callback)
  }
}

/**
 * Notify theme changed - gọi từ theme save handler
 */
export function notifyThemeChanged(): void {
  // Delay nhỏ để đảm bảo CSS vars đã được apply vào DOM
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      themeListeners.forEach(cb => cb())
    })
  } else {
    themeListeners.forEach(cb => cb())
  }
}
