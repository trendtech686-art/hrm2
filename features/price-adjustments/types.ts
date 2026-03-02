/**
 * PriceAdjustment types
 */

export type PriceAdjustmentStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';

export interface PriceAdjustmentItem {
  systemId: string;
  adjustmentId: string;
  productSystemId: string;
  productId: string;
  productName: string | null;
  productImage: string | null;
  oldPrice: number;
  newPrice: number;
  adjustmentAmount: number;
  adjustmentPercent: number;
  note: string | null;
}

export interface PriceAdjustment {
  systemId: string;
  id: string;
  branchId: string;
  employeeId: string | null;
  pricingPolicyId: string;
  pricingPolicyName: string | null;
  adjustmentDate: Date;
  status: PriceAdjustmentStatus;
  type: string;
  reason: string | null;
  note: string | null;
  referenceCode: string | null;
  createdDate: Date;
  createdBySystemId: string | null;
  createdByName: string | null;
  confirmedDate: Date | null;
  confirmedBy: string | null;
  confirmedBySystemId: string | null;
  confirmedByName: string | null;
  cancelledDate: Date | null;
  cancelledBy: string | null;
  cancelledBySystemId: string | null;
  cancelledByName: string | null;
  cancelReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
  items: PriceAdjustmentItem[];
}

export interface PriceAdjustmentCreateInput {
  pricingPolicyId: string;
  pricingPolicyName?: string;
  items: {
    productSystemId: string;
    productId: string;
    productName?: string;
    productImage?: string;
    oldPrice: number;
    newPrice: number;
    adjustmentAmount?: number;
    adjustmentPercent?: number;
    note?: string;
  }[];
  type?: string;
  reason?: string;
  note?: string;
  referenceCode?: string;
  businessId?: string;
  createdBy?: string;
  createdByName?: string;
}

export interface PriceAdjustmentUpdateInput {
  reason?: string;
  note?: string;
  referenceCode?: string;
  status?: PriceAdjustmentStatus;
  confirmedBy?: string;
  confirmedByName?: string;
  cancelledBy?: string;
  cancelledByName?: string;
  cancelReason?: string;
}
