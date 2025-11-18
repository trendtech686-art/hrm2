export type CustomerStatus = "Đang giao dịch" | "Ngừng Giao Dịch"

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
  systemId: string;
  orderId: string;           // Mã đơn hàng phát sinh nợ
  orderDate: string;         // Ngày đặt hàng (YYYY-MM-DD)
  amount: number;            // Số tiền nợ
  dueDate: string;           // Ngày đến hạn thanh toán (YYYY-MM-DD)
  isPaid: boolean;           // Đã thanh toán chưa?
  paidDate?: string;         // Ngày thanh toán (YYYY-MM-DD)
  paidAmount?: number;       // Số tiền đã trả (nếu trả một phần)
  remainingAmount?: number;  // Số tiền còn lại
  notes?: string;            // Ghi chú
};

export type DebtReminder = {
  systemId: string;
  reminderDate: string;                                      // Ngày nhắc (YYYY-MM-DD)
  reminderType: 'Gọi điện' | 'SMS' | 'Email' | 'Gặp trực tiếp' | 'Khác';
  reminderBy: string;                                        // Employee systemId
  reminderByName?: string;                                   // Employee name (for display)
  customerResponse?: 'Hứa trả' | 'Từ chối' | 'Không liên lạc được' | 'Đã trả' | 'Khác';
  promisePaymentDate?: string;                               // Ngày KH hứa trả (YYYY-MM-DD)
  notes?: string;                                            // Ghi chú chi tiết
  createdAt?: string;                                        // Timestamp tạo
};

import type { EnhancedCustomerAddress } from './types/enhanced-address';

export type CustomerAddress = EnhancedCustomerAddress;

export type Customer = {
  systemId: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: CustomerStatus;
  
  // Tax & Business Info
  taxCode?: string;
  representative?: string; // Người đại diện
  position?: string; // Chức vụ

  // Multiple Addresses
  addresses?: CustomerAddress[];

  // Legacy flat address fields (backward compatible)
  shippingAddress_street?: string;
  shippingAddress_ward?: string;
  shippingAddress_district?: string;
  shippingAddress_province?: string;
  billingAddress_street?: string;
  billingAddress_ward?: string;
  billingAddress_district?: string;
  billingAddress_province?: string;

  // Contact & Banking
  zaloPhone?: string;
  bankName?: string;
  bankAccount?: string;
  
  // Debt Management
  currentDebt?: number;
  maxDebt?: number; // Hạn mức công nợ
  
  // Customer Classification
  type?: string; // ID của loại khách hàng từ settings
  customerGroup?: string; // ID của nhóm khách hàng từ settings
  lifecycleStage?: CustomerLifecycleStage; // Giai đoạn vòng đời khách hàng
  
  // Customer Intelligence (auto-calculated)
  rfmScores?: {
    recency: 1 | 2 | 3 | 4 | 5;
    frequency: 1 | 2 | 3 | 4 | 5;
    monetary: 1 | 2 | 3 | 4 | 5;
  };
  segment?: string; // RFM segment: Champions, Loyal, At Risk, etc.
  healthScore?: number; // 0-100
  churnRisk?: 'low' | 'medium' | 'high';
  
  // Debt Tracking (NEW)
  debtTransactions?: DebtTransaction[];  // Lịch sử phát sinh nợ từng đơn
  debtReminders?: DebtReminder[];        // Lịch sử nhắc nợ
  oldestDebtDueDate?: string;            // Ngày đến hạn sớm nhất (auto-calculated)
  maxDaysOverdue?: number;               // Số ngày quá hạn lâu nhất (auto-calculated)
  debtStatus?: DebtStatus;               // Trạng thái công nợ (auto-calculated)
  
  // Source & Campaign Tracking
  source?: string; // ID của nguồn khách hàng từ settings
  campaign?: string; // Campaign name or code
  referredBy?: string; // Customer systemId who referred
  
  // Multiple Contacts
  contacts?: Array<{
    id: string;
    name: string;
    role: string; // e.g., "Giám đốc", "Kế toán", "Mua hàng"
    phone?: string;
    email?: string;
    isPrimary: boolean;
  }>;
  
  // Payment Terms & Credit
  paymentTerms?: string; // ID của payment term từ settings (COD, NET7, NET15...)
  creditRating?: string; // ID của credit rating từ settings (AAA, AA, A...)
  allowCredit?: boolean;
  
  // Discount & Pricing Level
  defaultDiscount?: number; // % (0-100)
  pricingLevel?: 'Retail' | 'Wholesale' | 'VIP' | 'Partner';
  
  // Contract Information
  contract?: {
    number?: string;
    startDate?: string; // ISO date
    endDate?: string; // ISO date
    value?: number; // Total contract value
    status?: 'Active' | 'Expired' | 'Pending' | 'Cancelled';
  };
  
  // Tags/Labels for flexible categorization
  tags?: string[];
  
  // Images (avatar, company logo, etc.)
  images?: string[];
  
  // Social Media
  social?: {
    facebook?: string;
    linkedin?: string;
    website?: string;
  };
  
  // Notes
  notes?: string;
  
  // Account Management
  accountManagerId?: string;
  accountManagerName?: string;
  
  // Audit fields
  createdAt?: string; // ISO timestamp (replaces YYYY-MM-DD)
  updatedAt?: string; // ISO timestamp
  deletedAt?: string | null; // ISO timestamp when soft-deleted
  isDeleted?: boolean; // Soft delete flag
  createdBy?: string; // Employee systemId who created this
  updatedBy?: string; // Employee systemId who last updated this
  
  // Statistics
  totalOrders?: number;
  totalSpent?: number;
  totalQuantityPurchased?: number;
  totalQuantityReturned?: number;
  lastPurchaseDate?: string; // YYYY-MM-DD
  failedDeliveries?: number;
}
