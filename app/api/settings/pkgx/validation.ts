import { z } from 'zod'

export const pkgxSettingsSchema = z.record(z.string(), z.unknown())

export type PkgxSettingsInput = z.infer<typeof pkgxSettingsSchema>
