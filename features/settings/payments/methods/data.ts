import type { PaymentMethod } from './types.ts';

export const data: PaymentMethod[] = [
  { systemId: 'PM000001', id: 'TIEN_MAT', name: 'Tiền mặt', isDefault: true, isActive: true, color: '#10b981', icon: 'Wallet' },
  { systemId: 'PM000002', id: 'CHUYEN_KHOAN', name: 'Chuyển khoản', isDefault: false, isActive: true, color: '#3b82f6', icon: 'ArrowRightLeft' },
  { systemId: 'PM000003', id: 'QUET_THE', name: 'Quẹt thẻ', isDefault: false, isActive: true, color: '#8b5cf6', icon: 'CreditCard' },
  { systemId: 'PM000004', id: 'COD', name: 'COD', isDefault: false, isActive: true, color: '#f59e0b', icon: 'Package' },
];
