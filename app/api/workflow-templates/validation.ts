import { z } from 'zod'

const workflowStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  order: z.number(),
})

const workflowTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.string(),
  steps: z.array(workflowStepSchema),
  isDefault: z.boolean().optional(),
})

export const saveWorkflowTemplatesSchema = z.object({
  templates: z.array(workflowTemplateSchema),
})

export type WorkflowTemplate = z.infer<typeof workflowTemplateSchema>
export type SaveWorkflowTemplatesInput = z.infer<typeof saveWorkflowTemplatesSchema>
