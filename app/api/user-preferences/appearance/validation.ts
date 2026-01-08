import { z } from 'zod'

export const updateAppearanceSchema = z.object({
  sidebarCollapsed: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  compactMode: z.boolean().optional(),
  fontSize: z.enum(['small', 'medium', 'large']).optional(),
  colorScheme: z.string().optional(),
}).passthrough()

export type UpdateAppearanceInput = z.infer<typeof updateAppearanceSchema>
