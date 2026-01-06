import { z } from 'zod';

// Create schema
export const createDepartmentSchema = z.object({
  id: z.string().min(1, 'Mã phòng ban không được để trống'),
  name: z.string().min(1, 'Tên phòng ban không được để trống').max(100, 'Tên không được vượt quá 100 ký tự'),
  managerId: z.string().optional(),
  jobTitleIds: z.array(z.string()).default([]),
});

// Update schema (all optional)
export const updateDepartmentSchema = createDepartmentSchema.partial();

// Filter schema
export const departmentFilterSchema = z.object({
  search: z.string().optional(),
  managerId: z.string().optional(),
});

// Types from schemas
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type DepartmentFilter = z.infer<typeof departmentFilterSchema>;
