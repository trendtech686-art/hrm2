/**
 * Types for the public complaint tracking endpoint
 * (GET/POST /api/public/complaint-tracking).
 *
 * These types describe the JSON contract between the public tracking page
 * and the API route. Keep in sync with app/api/public/complaint-tracking/route.ts.
 */

import type {
  ComplaintStatus,
  ComplaintType,
  ComplaintVerification,
  ComplaintResolution,
  ComplaintImage,
} from '@/lib/types/prisma-extended';

export interface PublicAffectedProduct {
  productId?: string;
  productSystemId?: string;
  productName?: string;
  productCode?: string;
  productBusinessId?: string;
  productImage?: string;
  quantityOrdered?: number;
  quantityMissing?: number;
  quantityDefective?: number;
  quantityExcess?: number;
  unitPrice?: number;
  issueType: 'excess' | 'missing' | 'defective' | 'other';
  note?: string;
}

export interface PublicTrackingSettings {
  enabled: boolean;
  showEmployeeName: boolean;
  showTimeline: boolean;
  allowCustomerComments: boolean;
  showOrderInfo: boolean;
  showProducts: boolean;
  showImages: boolean;
  showResolution: boolean;
}

export interface PublicTrackingComment {
  systemId: string;
  content: string;
  contentText: string;
  createdBy: string;
  createdBySystemId: string;
  createdAt: string;
  attachments: string[];
  mentions: string[];
  isEdited: boolean;
  parentId: string | undefined;
}

export interface PublicComplaintData {
  systemId?: string;
  id?: string;
  code?: string;
  publicTrackingCode?: string;
  title?: string;
  description?: string;
  status: ComplaintStatus;
  type: ComplaintType;
  verification: ComplaintVerification;
  resolution?: ComplaintResolution;
  resolutionNote?: string;
  investigationNote?: string;
  proposedSolution?: string;
  compensationAmount?: number;
  compensationDescription?: string;
  affectedProducts: PublicAffectedProduct[];
  images?: ComplaintImage[];
  employeeImages?: ComplaintImage[];
  videoLinks?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  resolvedAt?: string | Date;
  endedAt?: string | Date;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderCode?: string;
  orderSystemId?: string;
  orderValue?: number;
  branchName?: string;
  assigneeName?: string;
}

export interface PublicTimelineAction {
  id: string;
  actionType: string;
  performedBy?: string;
  performedByName?: string;
  performedAt: string;
  note?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
}

export interface PublicRelatedOrder {
  systemId?: string;
  id?: string;
  packagings?: Array<{ trackingCode?: string; requestDate?: string | Date }>;
  shippingAddress?: string;
  salesperson?: string;
  orderDate?: string | Date;
  grandTotal?: number;
  expectedDeliveryDate?: string | Date;
  [key: string]: unknown;
}

export interface PublicCompensationItem {
  amount: number;
  description?: string;
  createdAt: string | Date;
}

export interface PublicTrackingResponse {
  complaint: PublicComplaintData;
  relatedOrder: PublicRelatedOrder | null;
  comments: PublicTrackingComment[];
  timelineActions: PublicTimelineAction[];
  settings: PublicTrackingSettings;
  hotline: string;
  companyName: string;
}
