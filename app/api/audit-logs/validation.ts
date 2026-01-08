/**
 * API Validation Schemas for Audit Logs
 */
import { z } from 'zod'

// Query params for listing
export const listAuditLogsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '50')),
  entity: z.string().optional(),
  entityId: z.string().optional(),
  action: z.string().optional(),
  userId: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
})

// Create audit log schema
export const createAuditLogSchema = z.object({
  entityType: z.string().min(1, 'entityType là bắt buộc'),
  entityId: z.string().min(1, 'entityId là bắt buộc'),
  action: z.string().min(1, 'action là bắt buộc'),
  oldData: z.any().optional(),
  newData: z.any().optional(),
  entityName: z.string().optional(),
  description: z.string().optional(),
  userId: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
})

export type ListAuditLogsInput = z.infer<typeof listAuditLogsSchema>
export type CreateAuditLogInput = z.infer<typeof createAuditLogSchema>
