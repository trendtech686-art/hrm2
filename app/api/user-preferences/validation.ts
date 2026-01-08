/**
 * API Validation Schemas for User Preferences
 */
import { z } from 'zod'

// Query params for listing
export const listUserPreferencesSchema = z.object({
  userId: z.string().min(1, 'userId là bắt buộc'),
  key: z.string().optional(),
  category: z.string().optional(),
})

// Create/update preference schema
export const createUserPreferenceSchema = z.object({
  userId: z.string().min(1, 'userId là bắt buộc'),
  key: z.string().min(1, 'key là bắt buộc'),
  value: z.any().optional(),
  category: z.string().optional(),
})

// Bulk update preferences schema
export const bulkUpdatePreferencesSchema = z.object({
  userId: z.string().min(1, 'userId là bắt buộc'),
  preferences: z.array(z.object({
    key: z.string(),
    value: z.any().optional(),
    category: z.string().optional(),
  })),
})

export type ListUserPreferencesInput = z.infer<typeof listUserPreferencesSchema>
export type CreateUserPreferenceInput = z.infer<typeof createUserPreferenceSchema>
export type BulkUpdatePreferencesInput = z.infer<typeof bulkUpdatePreferencesSchema>
