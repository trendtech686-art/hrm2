export type SupplierStatus = "Đang Giao Dịch" | "Ngừng Giao Dịch";

export type Supplier = {
  systemId: string;
  id: string; // NCC001
  name: string;
  taxCode: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  accountManager: string; // Employee's full name
  status: SupplierStatus;
  currentDebt?: number;
  
  // Banking info
  bankAccount?: string;
  bankName?: string;
  
  // Contact info
  contactPerson?: string;
  notes?: string;
  
  // Audit fields
  createdAt?: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
  deletedAt?: string | null; // ISO timestamp when soft-deleted
  isDeleted?: boolean; // Soft delete flag
  createdBy?: string; // Employee systemId who created this
  updatedBy?: string; // Employee systemId who last updated this
};
