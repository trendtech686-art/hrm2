/**
 * Theme cookie helpers — chia sẻ giữa server (RSC layout) và client (Zustand store).
 *
 * Mục tiêu: Server-side đọc cookie để render `<html className="dark font-size-base">`
 * NGAY trong HTML markup → loại FOUC class triệt để (không cần đợi hydrate / boot script).
 *
 * Cookie format: `hrm-theme-cookie-v1=<colorMode>:<fontSize>` (ví dụ: `dark:base`).
 * Lý do dùng plain string thay vì JSON: ngắn, parse rẻ ở edge runtime, không cần
 * decodeURIComponent.
 */

import type { ColorMode, FontSize } from './appearance-constants'

export const THEME_COOKIE_NAME = 'hrm-theme-cookie-v1'
/** 1 năm (giây). */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const COLOR_MODES = new Set<ColorMode>(['light', 'dark'])
const FONT_SIZES = new Set<FontSize>(['sm', 'base', 'lg'])

export type ThemeCookieValue = {
  colorMode: ColorMode
  fontSize: FontSize
}

export function serializeThemeCookie(value: ThemeCookieValue): string {
  return `${value.colorMode}:${value.fontSize}`
}

export function parseThemeCookie(raw: string | undefined | null): ThemeCookieValue | null {
  if (!raw) return null
  const [mode, size] = raw.split(':')
  if (!COLOR_MODES.has(mode as ColorMode)) return null
  if (!FONT_SIZES.has(size as FontSize)) return null
  return { colorMode: mode as ColorMode, fontSize: size as FontSize }
}

/** Build classList chuỗi cho `<html>` dựa trên cookie (mặc định light + base). */
export function buildHtmlThemeClassName(cookieValue: ThemeCookieValue | null): string {
  const colorMode = cookieValue?.colorMode ?? 'light'
  const fontSize = cookieValue?.fontSize ?? 'base'
  return `${colorMode} font-size-${fontSize}`
}
