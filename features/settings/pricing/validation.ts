import { z } from 'zod';

export const pricingPolicySchema = z.object({
  id: z.string()
    .min(1, 'Mã không được để trống')
    .max(20, 'Mã không được quá 20 ký tự')
    .regex(/^[A-Z0-9]+$/, 'Mã chỉ được chứa chữ in hoa và số'),
  name: z.string()
    .min(1, 'Tên không được để trống')
    .max(100, 'Tên không được quá 100 ký tự'),
  description: z.string()
    .max(500, 'Mô tả không được quá 500 ký tự')
    .optional(),
  type: z.enum(['Bán hàng', 'Nhập hàng'], {
    message: 'Vui lòng chọn loại giá',
  }),
  isActive: z.boolean(),
});

export type PricingPolicyFormData = z.infer<typeof pricingPolicySchema>;

export const validateUniqueId = (id: string, existingIds: string[], currentId?: string) => {
  const upperId = id.toUpperCase();
  if (currentId && upperId === currentId.toUpperCase()) {
    return true;
  }
  return !existingIds.some(existingId => existingId.toUpperCase() === upperId);
};
