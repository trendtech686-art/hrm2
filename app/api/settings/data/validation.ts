import { z } from 'zod'

/**
 * Chỉ cho phép tạo mới qua /api/settings/data với type **không** đã có bảng + API chuyên dụng.
 * Các master khác: dùng route tương ứng (thuế, PTTT, v.v.).
 */
export const SETTINGS_DATA_CREATE_TYPES = ['custom-field'] as const

export const createSettingsDataSchema = z.object({
  systemId: z.string().optional(),
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.enum(SETTINGS_DATA_CREATE_TYPES),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  createdBy: z.string().optional(),
}).passthrough()

export type CreateSettingsDataInput = z.infer<typeof createSettingsDataSchema>
