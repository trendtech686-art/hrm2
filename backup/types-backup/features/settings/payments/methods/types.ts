import type { BusinessId, SystemId } from '@/lib/id-types';

export type PaymentMethod = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  isDefault: boolean;
  isActive: boolean; // Trạng thái hoạt động
  color?: string | undefined; // Màu sắc (e.g., '#10b981')
  icon?: string | undefined; // Tên icon (e.g., 'Wallet', 'CreditCard')
  description?: string | undefined;
  // Bank account info (for transfer methods)
  accountNumber?: string | undefined; // Số tài khoản
  accountName?: string | undefined; // Tên chủ tài khoản
  bankName?: string | undefined; // Tên ngân hàng
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};
