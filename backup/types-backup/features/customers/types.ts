import type { SystemId, BusinessId } from '@/lib/id-types';
import type { HistoryEntry } from '@/lib/activity-history-helper';

export type CustomerStatus = "Đang giao dịch" | "Ngừng Giao Dịch" | "inactive" | "active";
export type CustomerLifecycleStage =
  | "Khách tiềm năng"    // Lead - Chưa mua lần nào
  | "Khách mới"          // First-time - Mua lần đầu
  | "Khách quay lại"     // Repeat - Mua 2-4 lần
  | "Khách thân thiết"   // Loyal - Mua >= 5 lần, RFM score cao
  | "Khách VIP"          // VIP - Top 10% spending
  | "Không hoạt động"    // Dormant - Không mua > 180 ngày
  | "Mất khách";         // Churned - Không mua > 365 ngày

export type DebtStatus = 
  | "Chưa đến hạn"       // Trong hạn thanh toán
  | "Sắp đến hạn"        // Còn 1-3 ngày
  | "Đến hạn hôm nay"    // Ngày đến hạn
  | "Quá hạn 1-7 ngày"   // Nhắc nhẹ
  | "Quá hạn 8-15 ngày"  // Nhắc mạnh
  | "Quá hạn 16-30 ngày" // Cảnh báo nghiêm trọng
  | "Quá hạn > 30 ngày"; // Nguy cơ khó thu hồi

export type DebtTransaction = {
  systemId: SystemId;
  orderId: BusinessId;           // Mã đơn hàng phát sinh nợ
  orderDate: string;         // Ngày đặt hàng (YYYY-MM-DD)
  amount: number;            // Số tiền nợ
  dueDate: string;           // Ngày đến hạn thanh toán (YYYY-MM-DD)
  isPaid: boolean;           // Đã thanh toán chưa?
  paidDate?: string | undefined;         // Ngày thanh toán (YYYY-MM-DD)
  paidAmount?: number;       // Số tiền đã trả (nếu trả một phần)
  remainingAmount?: number;  // Số tiền còn lại
  notes?: string;            // Ghi chú
};

export type DebtReminder = {
  systemId: SystemId;
  reminderDate: string;                                      // Ngày nhắc (YYYY-MM-DD)
  reminderType: 'Gọi điện' | 'SMS' | 'Email' | 'Gặp trực tiếp' | 'Khác';
  reminderBy: SystemId;                                        // Employee systemId
  reminderByName?: string;                                   // Employee name (for display)
  customerResponse?: 'Hứa trả' | 'Từ chối' | 'Không liên lạc được' | 'Đã trả' | 'Khác';
  promisePaymentDate?: string;                               // Ngày KH hứa trả (YYYY-MM-DD)
  dueDate?: string;                                         // Hạn thanh toán liên quan
  amountDue?: number;                                       // Số tiền đến hạn
  notes?: string;                                            // Ghi chú chi tiết
  createdAt?: string;                                        // Timestamp tạo
};

import type { EnhancedCustomerAddress } from './types/enhanced-address';

export type CustomerAddress = EnhancedCustomerAddress;

export type Customer = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  email: string;
  phone: string;
  company?: string | undefined;
  status: CustomerStatus;
  
  // Tax & Business Info
  taxCode?: string | undefined;
  representative?: string | undefined; // Người đại diện
  position?: string | undefined; // Chức vụ

  // Multiple Addresses
  addresses?: CustomerAddress[] | undefined;

  // Legacy flat address fields (backward compatible)
  shippingAddress_street?: string | undefined;
  shippingAddress_ward?: string | undefined;
  shippingAddress_district?: string | undefined;
  shippingAddress_province?: string | undefined;
  billingAddress_street?: string | undefined;
  billingAddress_ward?: string | undefined;
  billingAddress_district?: string | undefined;
  billingAddress_province?: string | undefined;

  // Contact & Banking
  zaloPhone?: string | undefined;
  bankName?: string | undefined;
  bankAccount?: string | undefined;
  
  // Debt Management
  currentDebt?: number | undefined;
  maxDebt?: number | undefined; // Hạn mức công nợ
  
  // Customer Classification
  type?: string | undefined; // ID của loại khách hàng từ settings
  customerGroup?: string | undefined; // ID của nhóm khách hàng từ settings
  lifecycleStage?: CustomerLifecycleStage | undefined; // Giai đoạn vòng đời khách hàng
  
  // Customer Intelligence (auto-calculated)
  rfmScores?: {
    recency: 1 | 2 | 3 | 4 | 5;
    frequency: 1 | 2 | 3 | 4 | 5;
    monetary: 1 | 2 | 3 | 4 | 5;
  } | undefined;
  segment?: string | undefined; // RFM segment: Champions, Loyal, At Risk, etc.
  healthScore?: number | undefined; // 0-100
  churnRisk?: 'low' | 'medium' | 'high';
  
  // Debt Tracking (NEW)
  debtTransactions?: DebtTransaction[];  // Lịch sử phát sinh nợ từng đơn
  debtReminders?: DebtReminder[];        // Lịch sử nhắc nợ
  oldestDebtDueDate?: string;            // Ngày đến hạn sớm nhất (auto-calculated)
  maxDaysOverdue?: number;               // Số ngày quá hạn lâu nhất (auto-calculated)
  debtStatus?: DebtStatus;               // Trạng thái công nợ (auto-calculated)
  
  // Source & Campaign Tracking
  source?: string | undefined; // ID của nguồn khách hàng từ settings
  campaign?: string | undefined; // Campaign name or code
  referredBy?: SystemId | undefined; // Customer systemId who referred
  
  // Multiple Contacts
  contacts?: Array<{
    id: string;
    name: string;
    role: string; // e.g., "Giám đốc", "Kế toán", "Mua hàng"
    phone?: string | undefined;
    email?: string | undefined;
    isPrimary: boolean;
  }> | undefined;
  
  // Payment Terms & Credit
  paymentTerms?: string | undefined; // ID của payment term từ settings (COD, NET7, NET15...)
  creditRating?: string | undefined; // ID của credit rating từ settings (AAA, AA, A...)
  allowCredit?: boolean | undefined;
  
  // Discount & Pricing Level
  defaultDiscount?: number | undefined; // % (0-100)
  pricingLevel?: 'Retail' | 'Wholesale' | 'VIP' | 'Partner' | undefined;
  
  // Contract Information
  contract?: {
    number?: string | undefined;
    startDate?: string | undefined; // ISO date
    endDate?: string | undefined; // ISO date
    value?: number | undefined; // Total contract value
    status?: 'Active' | 'Expired' | 'Pending' | 'Cancelled' | undefined;
    fileUrl?: string | undefined; // Link to contract file
    details?: string | undefined; // Contract terms/details
  } | undefined;
  
  // Tags/Labels for flexible categorization
  tags?: string[] | undefined;
  
  // Images (avatar, company logo, etc.)
  images?: string[] | undefined;
  
  // Social Media
  social?: {
    facebook?: string | undefined;
    linkedin?: string | undefined;
    website?: string | undefined;
  } | undefined;
  
  // Notes
  notes?: string | undefined;
  
  // Account Management
  accountManagerId?: SystemId | undefined;
  accountManagerName?: string | undefined;
  
  // Audit fields
  createdAt?: string | undefined; // ISO timestamp (replaces YYYY-MM-DD)
  updatedAt?: string | undefined; // ISO timestamp
  deletedAt?: string | null | undefined; // ISO timestamp when soft-deleted
  isDeleted?: boolean | undefined; // Soft delete flag
  createdBy?: SystemId | undefined; // Employee systemId who created this
  updatedBy?: SystemId | undefined; // Employee systemId who last updated this
  
  // Statistics
  totalOrders?: number | undefined;
  totalSpent?: number | undefined;
  totalQuantityPurchased?: number | undefined;
  totalQuantityReturned?: number | undefined;
  lastPurchaseDate?: string | undefined; // YYYY-MM-DD
  failedDeliveries?: number | undefined;

  // Relationship tracking
  lastContactDate?: string | undefined; // YYYY-MM-DD
  nextFollowUpDate?: string | undefined; // YYYY-MM-DD
  followUpReason?: string | undefined;
  followUpAssigneeId?: SystemId | undefined;
  followUpAssigneeName?: string | undefined;

  // Activity History
  activityHistory?: HistoryEntry[];
}
