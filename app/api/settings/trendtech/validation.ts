import { z } from 'zod'

export const trendtechSettingsSchema = z.record(z.string(), z.unknown())

export type TrendtechSettingsInput = z.infer<typeof trendtechSettingsSchema>
