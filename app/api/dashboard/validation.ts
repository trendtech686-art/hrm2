/**
 * API Validation Schemas for Dashboard
 */
import { z } from 'zod'

// Query params for dashboard
export const dashboardQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type DashboardQueryInput = z.infer<typeof dashboardQuerySchema>
