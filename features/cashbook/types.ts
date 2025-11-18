import type { Branch } from '../settings/branches/types.ts';

export type CashAccount = {
  systemId: string;
  id: string; // e.g., 'cash', 'vcb'
  name: string; // e.g., 'Quỹ tiền mặt', 'Tài khoản VCB'
  initialBalance: number;
  type: 'cash' | 'bank';
  bankAccountNumber?: string;
  bankBranch?: string;
  branchSystemId?: string; // ✅ Branch systemId (optional)
  // Nâng cấp cấp 1 & 2
  isActive: boolean; // Trạng thái hoạt động
  isDefault?: boolean; // Tài khoản mặc định cho loại này (cash hoặc bank)
  bankName?: string; // Tên ngân hàng (e.g., 'Vietcombank')
  bankCode?: string; // Mã ngân hàng (e.g., 'VCB')
  accountHolder?: string; // Chủ tài khoản
  minBalance?: number; // Số dư tối thiểu cảnh báo
  maxBalance?: number; // Số dư tối đa cảnh báo
  managedBy?: string; // Người quản lý (systemId)
};
