export type PaymentMethod = {
  systemId: string;
  id: string;
  name: string;
  isDefault: boolean;
  isActive: boolean; // Trạng thái hoạt động
  color?: string; // Màu sắc (e.g., '#10b981')
  icon?: string; // Tên icon (e.g., 'Wallet', 'CreditCard')
  description?: string;
  // Bank account info (for transfer methods)
  accountNumber?: string; // Số tài khoản
  accountName?: string; // Tên chủ tài khoản
  bankName?: string; // Tên ngân hàng
};
