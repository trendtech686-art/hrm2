import { z } from 'zod';

// Province Schema
export const createProvinceSchema = z.object({
  code: z.string().min(1, 'Mã tỉnh/thành không được để trống'),
  name: z.string().min(1, 'Tên tỉnh/thành không được để trống'),
  nameEn: z.string().optional(),
  type: z.enum(['province', 'city']).optional(),
  isActive: z.boolean().default(true),
});

export const updateProvinceSchema = createProvinceSchema.partial();

// District Schema
export const createDistrictSchema = z.object({
  code: z.string().min(1, 'Mã quận/huyện không được để trống'),
  name: z.string().min(1, 'Tên quận/huyện không được để trống'),
  nameEn: z.string().optional(),
  provinceCode: z.string().min(1, 'Tỉnh/thành không được để trống'),
  type: z.enum(['district', 'city', 'town']).optional(),
  isActive: z.boolean().default(true),
});

export const updateDistrictSchema = createDistrictSchema.partial();

// Ward Schema
export const createWardSchema = z.object({
  code: z.string().min(1, 'Mã phường/xã không được để trống'),
  name: z.string().min(1, 'Tên phường/xã không được để trống'),
  nameEn: z.string().optional(),
  districtCode: z.string().min(1, 'Quận/huyện không được để trống'),
  type: z.enum(['ward', 'commune', 'town']).optional(),
  isActive: z.boolean().default(true),
});

export const updateWardSchema = createWardSchema.partial();

// Filter Schema
export const provinceFilterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['province', 'city']).optional(),
  isActive: z.boolean().optional(),
});

// Types
export type CreateProvinceInput = z.infer<typeof createProvinceSchema>;
export type UpdateProvinceInput = z.infer<typeof updateProvinceSchema>;
export type CreateDistrictInput = z.infer<typeof createDistrictSchema>;
export type UpdateDistrictInput = z.infer<typeof updateDistrictSchema>;
export type CreateWardInput = z.infer<typeof createWardSchema>;
export type UpdateWardInput = z.infer<typeof updateWardSchema>;
export type ProvinceFilter = z.infer<typeof provinceFilterSchema>;
