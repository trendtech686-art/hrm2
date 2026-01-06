/**
 * Zod validation schemas for audit-log module
 */
import { z } from 'zod';

// Audit log action types
export const auditActionSchema = z.enum([
  'CREATE',
  'UPDATE', 
  'DELETE',
  'VIEW',
  'EXPORT',
  'IMPORT',
  'LOGIN',
  'LOGOUT',
  'APPROVE',
  'REJECT',
  'CANCEL',
  'RESTORE',
]);

// Audit log entity types
export const auditEntitySchema = z.enum([
  'Order',
  'Product',
  'Customer',
  'Employee',
  'Supplier',
  'PurchaseOrder',
  'SalesReturn',
  'PurchaseReturn',
  'Payment',
  'Receipt',
  'Complaint',
  'Warranty',
  'Task',
  'Leave',
  'Attendance',
  'Setting',
  'User',
]);

// Audit log filters schema
export const auditLogFiltersSchema = z.object({
  action: auditActionSchema.optional(),
  entityType: auditEntitySchema.optional(),
  entityId: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
});

// Audit log entry schema (for API response validation)
export const auditLogEntrySchema = z.object({
  id: z.string(),
  action: auditActionSchema,
  entityType: auditEntitySchema,
  entityId: z.string(),
  entityName: z.string().optional(),
  userId: z.string(),
  userName: z.string().optional(),
  changes: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  createdAt: z.string().datetime(),
});

// Export types
export type AuditAction = z.infer<typeof auditActionSchema>;
export type AuditEntity = z.infer<typeof auditEntitySchema>;
export type AuditLogFilters = z.infer<typeof auditLogFiltersSchema>;
export type AuditLogEntry = z.infer<typeof auditLogEntrySchema>;
