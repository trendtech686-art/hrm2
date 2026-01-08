import { z } from 'zod'

export const shippingSettingsSchema = z.record(z.string(), z.unknown())

export type ShippingSettingsInput = z.infer<typeof shippingSettingsSchema>
