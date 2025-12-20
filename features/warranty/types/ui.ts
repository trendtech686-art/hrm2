import type { Customer } from '../../customers/types';

export interface WarrantyCustomerInfo {
  name: string;
  phone: string;
  systemId?: string | undefined;
  address?: string | undefined;
  addresses?: Customer['addresses'] | undefined;
}

export interface WarrantyBranchContext {
  branchSystemId?: string | undefined;
  branchName?: string | undefined;
}

export interface WarrantyVoucherDialogBaseProps extends WarrantyBranchContext {
  warrantyId: string;
  warrantySystemId: string;
  customer: WarrantyCustomerInfo;
  linkedOrderId?: string | undefined;
  defaultAmount?: number | undefined;
}
