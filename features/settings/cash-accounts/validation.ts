import { z } from 'zod';

// Cash Account Schema
export const createCashAccountSchema = z.object({
  code: z.string().min(1, 'Mã tài khoản không được để trống'),
  name: z.string().min(1, 'Tên tài khoản không được để trống'),
  type: z.enum(['cash', 'bank', 'e-wallet']),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountHolder: z.string().optional(),
  branchSystemId: z.string().optional(),
  initialBalance: z.number().default(0),
  currentBalance: z.number().default(0),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
});

export const updateCashAccountSchema = createCashAccountSchema.partial();

// Filter Schema
export const cashAccountFilterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['cash', 'bank', 'e-wallet']).optional(),
  branchSystemId: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Types
export type CreateCashAccountInput = z.infer<typeof createCashAccountSchema>;
export type UpdateCashAccountInput = z.infer<typeof updateCashAccountSchema>;
export type CashAccountFilter = z.infer<typeof cashAccountFilterSchema>;
