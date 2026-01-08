import { z } from 'zod'

export const warrantySettingTypeSchema = z.enum(['sla-targets', 'notifications', 'tracking', 'reminder-templates'])

export const slaTargetsSchema = z.object({
  response: z.number().min(0),
  processing: z.number().min(0),
  return: z.number().min(0),
})

export const notificationSettingsSchema = z.object({
  emailOnCreate: z.boolean(),
  emailOnAssign: z.boolean(),
  emailOnProcessing: z.boolean(),
  emailOnProcessed: z.boolean(),
  emailOnReturned: z.boolean(),
  emailOnOverdue: z.boolean(),
  smsOnOverdue: z.boolean(),
  inAppNotifications: z.boolean(),
  reminderNotifications: z.boolean(),
})

export const trackingSettingsSchema = z.object({
  enabled: z.boolean(),
  allowCustomerComments: z.boolean(),
  showEmployeeName: z.boolean(),
  showTimeline: z.boolean(),
})

export const updateWarrantySettingsSchema = z.object({
  type: warrantySettingTypeSchema,
  data: z.union([slaTargetsSchema, notificationSettingsSchema, trackingSettingsSchema, z.array(z.unknown())]),
})

export type WarrantySettingType = z.infer<typeof warrantySettingTypeSchema>
export type UpdateWarrantySettingsInput = z.infer<typeof updateWarrantySettingsSchema>
