import { z } from 'zod'

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  status: z.enum(['todo', 'in_progress', 'review', 'done', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
})

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
