/**
 * Supplier Warranty Types (BH Nhà cung cấp)
 */

export interface SupplierWarrantyItem {
  systemId: string;
  warrantyId: string;
  productSystemId: string | null;
  productId: string;
  productName: string;
  productImage: string | null;
  sentQuantity: number;
  approvedQuantity: number;
  returnedQuantity: number;
  unitPrice: number;
  warrantyCost: number;
  itemNote: string | null;
  warrantyResult: string | null;
}

/** Packaging fields used in warranty UI (subset of Prisma Packaging model) */
export interface WarrantyPackagingSlip {
  systemId: string;
  id: string;
  status: string;
  deliveryStatus: string | null;
  deliveryMethod: string | null;
  trackingCode: string | null;
  carrier: string | null;
  service: string | null;
  notes: string | null;
  cancelReason: string | null;
  requestingEmployeeName: string | null;
  confirmDate: string | null;
  cancelDate: string | null;
  deliveredDate: string | null;
  shippingFeeToPartner: number | null;
  codAmount: number | null;
  payer: string | null;
  reconciliationStatus: string | null;
  weight: number | null;
  dimensions: string | null;
  noteToShipper: string | null;
  createdAt: string;
}

export interface SupplierWarranty {
  systemId: string;
  id: string;
  supplierSystemId: string;
  supplierName: string;
  branchSystemId: string | null;
  branchName: string | null;
  trackingNumber: string | null;
  sentDate: string | null;
  deliveryMethod: string | null;
  status: 'DRAFT' | 'APPROVED' | 'PACKED' | 'EXPORTED' | 'SENT' | 'DELIVERED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  subtasks: Array<{ id: string; title: string; completed: boolean; order?: number; completedAt?: string }> | null;
  createdBySystemId: string | null;
  createdByName: string | null;
  assignedToSystemId: string | null;
  assignedToName: string | null;
  approvedBySystemId: string | null;
  approvedByName: string | null;
  confirmedBySystemId: string | null;
  confirmedByName: string | null;
  totalWarrantyCost: number;
  totalReturnedItems: number;
  reason: string | null;
  notes: string | null;
  confirmNotes: string | null;
  approvedAt: string | null;
  packedAt: string | null;
  exportedAt: string | null;
  deliveredAt: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  items: SupplierWarrantyItem[];
  packagings: WarrantyPackagingSlip[];
}

export interface SupplierWarrantyParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  supplierId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SupplierWarrantyListResponse {
  data: SupplierWarranty[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
