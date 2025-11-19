import type { Customer } from '../../customers/types.ts';

export interface WarrantyCustomerInfo {
  name: string;
  phone: string;
  systemId?: string;
  address?: string;
  addresses?: Customer['addresses'];
}

export interface WarrantyBranchContext {
  branchSystemId?: string;
  branchName?: string;
}

export interface WarrantyVoucherDialogBaseProps extends WarrantyBranchContext {
  warrantyId: string;
  warrantySystemId: string;
  customer: WarrantyCustomerInfo;
  linkedOrderId?: string;
  defaultAmount?: number;
}
