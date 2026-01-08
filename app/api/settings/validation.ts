/**
 * API Validation Schemas for Settings
 */
import { z } from 'zod'

// Query params for listing
export const listSettingsSchema = z.object({
  group: z.string().optional(),
  key: z.string().optional(),
})

// Create/update setting schema
export const createSettingSchema = z.object({
  key: z.string().min(1, 'Key là bắt buộc'),
  group: z.string().min(1, 'Group là bắt buộc'),
  type: z.string().optional().default('string'),
  category: z.string().optional().default('system'),
  value: z.any().optional(),
  description: z.string().optional(),
})

// Bulk update settings schema
export const bulkUpdateSettingsSchema = z.object({
  settings: z.array(z.object({
    key: z.string(),
    group: z.string(),
    value: z.any().optional(),
    description: z.string().optional(),
    type: z.string().optional(),
    category: z.string().optional(),
  })),
})

export type ListSettingsInput = z.infer<typeof listSettingsSchema>
export type CreateSettingInput = z.infer<typeof createSettingSchema>
export type BulkUpdateSettingsInput = z.infer<typeof bulkUpdateSettingsSchema>
