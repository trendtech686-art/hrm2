import { z } from 'zod';

// Task Status Schema
export const createTaskStatusSchema = z.object({
  name: z.string().min(1, 'Tên trạng thái không được để trống'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Màu không hợp lệ'),
  isFinal: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  sortOrder: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateTaskStatusSchema = createTaskStatusSchema.partial();

// Task Priority Schema
export const createTaskPrioritySchema = z.object({
  name: z.string().min(1, 'Tên độ ưu tiên không được để trống'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Màu không hợp lệ'),
  level: z.number().min(1).max(10),
  isDefault: z.boolean().default(false),
  sortOrder: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateTaskPrioritySchema = createTaskPrioritySchema.partial();

// Task Settings Schema
export const taskSettingsSchema = z.object({
  defaultPriorityId: z.string().optional(),
  defaultStatusId: z.string().optional(),
  notifyOnAssign: z.boolean().default(true),
  notifyOnDueDate: z.boolean().default(true),
  notifyOnComplete: z.boolean().default(true),
  allowSubtasks: z.boolean().default(true),
  maxSubtaskDepth: z.number().min(1).max(5).default(3),
  requireApproval: z.boolean().default(false),
  approvalWorkflowId: z.string().optional(),
});

// Types
export type CreateTaskStatusInput = z.infer<typeof createTaskStatusSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type CreateTaskPriorityInput = z.infer<typeof createTaskPrioritySchema>;
export type UpdateTaskPriorityInput = z.infer<typeof updateTaskPrioritySchema>;
export type TaskSettings = z.infer<typeof taskSettingsSchema>;
