/**
 * Zod validation schemas for cashbook module
 */
import { z } from 'zod';
import { systemIdSchema } from '@/lib/id-types';

// Account type enum
export const cashAccountTypeSchema = z.enum([
  'cash',
  'bank',
  'other'
]);

// Create account schema
export const createCashAccountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên tài khoản không được để trống'),
  type: cashAccountTypeSchema,
  branchSystemId: z.string().optional(),
  branchName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  accountType: z.string().optional(),
  initialBalance: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  notes: z.string().optional(),
});

// Update account schema
export const updateCashAccountSchema = createCashAccountSchema.partial();

// Transaction type enum
export const transactionTypeSchema = z.enum([
  'receipt',
  'payment',
  'transfer_in',
  'transfer_out',
  'adjustment'
]);

// Create transaction schema
export const createCashTransactionSchema = z.object({
  accountSystemId: systemIdSchema,
  type: transactionTypeSchema,
  amount: z.number().min(0, 'Số tiền phải >= 0'),
  date: z.string().min(1, 'Ngày giao dịch không được để trống'),
  description: z.string().optional(),
  referenceId: z.string().optional(),
  referenceType: z.string().optional(),
  createdBy: z.string().optional(),
});

// Filter schema
export const cashAccountFiltersSchema = z.object({
  branchSystemId: z.string().optional(),
  type: cashAccountTypeSchema.optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

export const cashTransactionFiltersSchema = z.object({
  accountSystemId: z.string().optional(),
  type: transactionTypeSchema.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type CashAccountType = z.infer<typeof cashAccountTypeSchema>;
export type TransactionType = z.infer<typeof transactionTypeSchema>;
export type CreateCashAccountInput = z.infer<typeof createCashAccountSchema>;
export type UpdateCashAccountInput = z.infer<typeof updateCashAccountSchema>;
export type CreateCashTransactionInput = z.infer<typeof createCashTransactionSchema>;
export type CashAccountFilters = z.infer<typeof cashAccountFiltersSchema>;
export type CashTransactionFilters = z.infer<typeof cashTransactionFiltersSchema>;
