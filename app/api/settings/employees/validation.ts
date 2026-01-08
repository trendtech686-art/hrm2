import { z } from 'zod'

export const employeeSettingsSchema = z.record(z.string(), z.unknown())

export type EmployeeSettingsInput = z.infer<typeof employeeSettingsSchema>
