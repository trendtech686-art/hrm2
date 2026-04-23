import { z } from 'zod'
import { COLOR_MODE_ZOD, FONT_SIZE_ZOD, FONT_ZOD, THEME_ZOD } from '@/lib/appearance-constants'

export const updateAppearanceSchema = z
  .object({
    theme: z.enum(THEME_ZOD).optional(),
    colorMode: z.enum(COLOR_MODE_ZOD).optional(),
    font: z.enum(FONT_ZOD).optional(),
    fontSize: z.enum(FONT_SIZE_ZOD).optional(),
    customThemeConfig: z.record(z.string(), z.string()).optional(),
    sidebarCollapsed: z.boolean().optional(),
    compactMode: z.boolean().optional(),
    colorScheme: z.string().optional(),
  })
  .passthrough()

export type UpdateAppearanceInput = z.infer<typeof updateAppearanceSchema>
