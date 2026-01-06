import { z } from 'zod';

// Create schema
export const createJobTitleSchema = z.object({
  id: z.string().min(1, 'Mã chức vụ không được để trống'),
  name: z.string().min(1, 'Tên chức vụ không được để trống').max(100, 'Tên không được vượt quá 100 ký tự'),
  description: z.string().optional(),
});

// Update schema (all optional)
export const updateJobTitleSchema = createJobTitleSchema.partial();

// Filter schema
export const jobTitleFilterSchema = z.object({
  search: z.string().optional(),
});

// Types from schemas
export type CreateJobTitleInput = z.infer<typeof createJobTitleSchema>;
export type UpdateJobTitleInput = z.infer<typeof updateJobTitleSchema>;
export type JobTitleFilter = z.infer<typeof jobTitleFilterSchema>;
