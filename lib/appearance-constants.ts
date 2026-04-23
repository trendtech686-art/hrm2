/**
 * Một nguồn sự thật cho preset giao diện (Cài đặt > Giao diện).
 * Dùng bởi: Zustand store, API `PUT /api/user-preferences/appearance`, shadcn theme presets.
 */
export const THEME_SLUGS = [
  'slate',
  'blue',
  'green',
  'amber',
  'rose',
  'purple',
  'orange',
  'teal',
  'custom',
] as const

export type Theme = (typeof THEME_SLUGS)[number]

export const FONT_SLUGS = ['inter', 'poppins', 'roboto', 'source-sans-3'] as const
export type Font = (typeof FONT_SLUGS)[number]

export const FONT_SIZE_SLUGS = ['sm', 'base', 'lg'] as const
export type FontSize = (typeof FONT_SIZE_SLUGS)[number]

export const COLOR_MODES = ['light', 'dark'] as const
export type ColorMode = (typeof COLOR_MODES)[number]

/** Tuple (mutable) cho `z.enum` — `as const` thường là readonly nên cần ép. */
export const THEME_ZOD = THEME_SLUGS as unknown as [string, ...string[]]
export const FONT_ZOD = FONT_SLUGS as unknown as [string, ...string[]]
export const FONT_SIZE_ZOD = FONT_SIZE_SLUGS as unknown as [string, ...string[]]
export const COLOR_MODE_ZOD = COLOR_MODES as unknown as [string, ...string[]]
