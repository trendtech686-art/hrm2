import { z } from 'zod';

// System Log Filter Schema
export const systemLogFilterSchema = z.object({
  search: z.string().optional(),
  level: z.enum(['info', 'warning', 'error', 'debug']).optional(),
  module: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  userId: z.string().optional(),
});

// ID Counter Settings Schema
export const idCounterSettingsSchema = z.object({
  prefix: z.string().min(1, 'Prefix không được để trống'),
  separator: z.string().max(2).default('-'),
  paddingLength: z.number().min(3).max(10).default(6),
  currentValue: z.number().min(0).default(0),
  resetPolicy: z.enum(['never', 'yearly', 'monthly', 'daily']).default('never'),
  isActive: z.boolean().default(true),
});

export const updateIdCounterSchema = idCounterSettingsSchema.partial();

// Import/Export Log Schema
export const importExportLogSchema = z.object({
  type: z.enum(['import', 'export']),
  module: z.string().min(1),
  filename: z.string().min(1),
  totalRecords: z.number().min(0),
  successRecords: z.number().min(0),
  failedRecords: z.number().min(0),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  errors: z.array(z.string()).optional(),
  userId: z.string().optional(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

// Filter
export const importExportLogFilterSchema = z.object({
  type: z.enum(['import', 'export']).optional(),
  module: z.string().optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Types
export type SystemLogFilter = z.infer<typeof systemLogFilterSchema>;
export type IdCounterSettings = z.infer<typeof idCounterSettingsSchema>;
export type UpdateIdCounterInput = z.infer<typeof updateIdCounterSchema>;
export type ImportExportLog = z.infer<typeof importExportLogSchema>;
export type ImportExportLogFilter = z.infer<typeof importExportLogFilterSchema>;
