import type { SystemId, BusinessId } from '../../lib/id-types.ts';
import type { HistoryEntry } from '@/lib/activity-history-helper';

export type SupplierStatus = "Đang Giao Dịch" | "Ngừng Giao Dịch";

export type Supplier = {
  systemId: SystemId;
  id: BusinessId; // NCC001
  name: string;
  taxCode: string;
  phone: string;
  email: string;
  address: string;
  website?: string | undefined;
  accountManager: string; // Employee's full name
  status: SupplierStatus;
  currentDebt?: number | undefined;
  
  // Banking info
  bankAccount?: string | undefined;
  bankName?: string | undefined;
  
  // Contact info
  contactPerson?: string | undefined;
  notes?: string | undefined;
  
  // Audit fields
  createdAt?: string | undefined; // ISO timestamp
  updatedAt?: string | undefined; // ISO timestamp
  deletedAt?: string | null | undefined; // ISO timestamp when soft-deleted
  isDeleted?: boolean | undefined; // Soft delete flag
  createdBy?: SystemId | undefined; // Employee systemId who created this
  updatedBy?: SystemId | undefined; // Employee systemId who last updated this
  activityHistory?: HistoryEntry[];
};
