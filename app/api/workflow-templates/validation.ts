import { z } from 'zod'

const dateField = z.union([z.string(), z.date()]).optional().nullable()

const subtaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  order: z.number(),
  createdAt: dateField,
  completedAt: dateField,
}).passthrough()

const workflowTemplateSchema = z.object({
  systemId: z.string().optional(),
  id: z.string().optional(),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  subtasks: z.array(subtaskSchema).default([]),
  isDefault: z.boolean().optional(),
  createdAt: dateField,
  updatedAt: dateField,
}).passthrough()

export const saveWorkflowTemplatesSchema = z.object({
  templates: z.array(workflowTemplateSchema),
})

export type WorkflowTemplate = z.infer<typeof workflowTemplateSchema>
export type SaveWorkflowTemplatesInput = z.infer<typeof saveWorkflowTemplatesSchema>
