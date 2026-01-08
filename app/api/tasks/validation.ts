/**
 * API Validation Schemas for Tasks
 */
import { z } from 'zod'

// Query params for listing
export const listTasksSchema = z.object({
  status: z.string().optional(),
  assigneeId: z.string().optional(),
  priority: z.string().optional(),
})

// Create task schema
export const createTaskSchema = z.object({
  systemId: z.string().optional(),
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  creatorId: z.string().min(1, 'Creator ID is required'),
  status: z.string().optional().default('TODO'),
  priority: z.string().optional().default('MEDIUM'),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// Update task schema
export const updateTaskSchema = createTaskSchema.partial()

export type ListTasksInput = z.infer<typeof listTasksSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
