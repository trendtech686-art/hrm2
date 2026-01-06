import { z } from 'zod';

// Store Info Schema
export const storeInfoSchema = z.object({
  name: z.string().min(1, 'Tên cửa hàng không được để trống'),
  shortName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  address: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  taxCode: z.string().optional(),
  website: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  logo: z.string().optional(),
  description: z.string().optional(),
});

export const updateStoreInfoSchema = storeInfoSchema.partial();

// Types
export type StoreInfoInput = z.infer<typeof storeInfoSchema>;
export type UpdateStoreInfoInput = z.infer<typeof updateStoreInfoSchema>;
