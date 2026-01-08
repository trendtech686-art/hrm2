/**
 * API Validation Schemas for Comments
 */
import { z } from 'zod'

// Query params for listing
export const listCommentsSchema = z.object({
  entityType: z.string().min(1, 'entityType là bắt buộc'),
  entityId: z.string().min(1, 'entityId là bắt buộc'),
})

// Create comment schema
export const createCommentSchema = z.object({
  entityType: z.string().min(1, 'entityType là bắt buộc'),
  entityId: z.string().min(1, 'entityId là bắt buộc'),
  content: z.string().min(1, 'content là bắt buộc'),
  attachments: z.array(z.string()).optional(),
  createdBy: z.string().optional(),
  createdByName: z.string().optional(),
  author: z.string().optional(),
})

// Update comment schema
export const updateCommentSchema = z.object({
  content: z.string().optional(),
  attachments: z.array(z.string()).optional(),
})

export type ListCommentsInput = z.infer<typeof listCommentsSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
