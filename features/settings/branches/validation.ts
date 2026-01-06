import { z } from 'zod';

// Address level enum
export const AddressLevelEnum = z.enum(['2-level', '3-level']);

// Create schema
export const createBranchSchema = z.object({
  id: z.string().min(1, 'Mã chi nhánh không được để trống'),
  name: z.string().min(1, 'Tên chi nhánh không được để trống'),
  address: z.string().min(1, 'Địa chỉ không được để trống'),
  phone: z.string().min(1, 'Số điện thoại không được để trống'),
  managerId: z.string().optional(),
  isDefault: z.boolean().default(false),
  addressLevel: AddressLevelEnum.optional(),
  province: z.string().optional(),
  provinceId: z.string().optional(),
  district: z.string().optional(),
  districtId: z.number().optional(),
  ward: z.string().optional(),
  wardCode: z.string().optional(),
});

// Update schema (all optional)
export const updateBranchSchema = createBranchSchema.partial();

// Filter schema
export const branchFilterSchema = z.object({
  search: z.string().optional(),
  isDefault: z.boolean().optional(),
  provinceId: z.string().optional(),
});

// Types from schemas
export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
export type BranchFilter = z.infer<typeof branchFilterSchema>;
