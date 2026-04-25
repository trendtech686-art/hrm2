/**
 * Convert oklch color string to hex
 * 
 * Sử dụng thư viện culori để convert chính xác
 */

import { parse, converter } from 'culori'

/**
 * Convert oklch color string to hex
 */
export function oklchToHex(oklch: string): string {
  if (!oklch || !oklch.includes('oklch')) {
    return oklch
  }

  try {
    const toRgb = converter('rgb')
    const color = parse(oklch)
    if (!color) return oklch
    
    const rgb = toRgb(color)
    if (!rgb) return oklch

    const r = Math.round((rgb.r ?? 0) * 255)
    const g = Math.round((rgb.g ?? 0) * 255)
    const b = Math.round((rgb.b ?? 0) * 255)

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  } catch {
    return oklch
  }
}
