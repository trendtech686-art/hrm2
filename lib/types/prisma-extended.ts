/**
 * Extended Prisma Types with Relations
 * 
 * Các type mở rộng từ Prisma model với relations được include.
 * Sử dụng khi cần access nested data từ Prisma queries với include.
 * 
 * MIGRATION NOTE: Đang trong quá trình migrate từ app types sang Prisma types.
 * File này export cả Prisma types (với hậu tố Model/WithItems) và alias types cho compatibility.
 */

import type { CostAdjustmentModel } from '@/generated/prisma/models/CostAdjustment';
import type { CostAdjustmentItemModel } from '@/generated/prisma/models/CostAdjustmentItem';
import type { InventoryCheckModel } from '@/generated/prisma/models/InventoryCheck';
import type { InventoryCheckItemModel } from '@/generated/prisma/models/InventoryCheckItem';

// ============================================
// COST ADJUSTMENT - PRISMA TYPES
// ============================================

/**
 * CostAdjustment with items relation included (Prisma)
 * Use when query includes: { include: { items: true } }
 */
export type CostAdjustmentWithItems = CostAdjustmentModel & {
  items: CostAdjustmentItemModel[];
};

// Re-export Prisma types with aliases for convenience
export type { CostAdjustmentModel, CostAdjustmentItemModel };

// ============================================
// COST ADJUSTMENT - APP TYPES (for compatibility)
// ============================================

/**
 * CostAdjustment status
 */
export type CostAdjustmentStatus = 'draft' | 'confirmed' | 'cancelled';

/**
 * CostAdjustment type
 */
export type CostAdjustmentType = 'manual' | 'import' | 'batch';

/**
 * App-level CostAdjustmentItem (with app field names)
 * @deprecated Use CostAdjustmentItemModel instead
 */
export type CostAdjustmentItem = {
  productSystemId: string;
  productId: string;
  productName: string;
  productImage?: string;
  oldCostPrice: number;
  newCostPrice: number;
  adjustmentAmount: number;
  adjustmentPercent: number;
  reason?: string;
};

/**
 * App-level CostAdjustment (with app field names)
 * @deprecated Use CostAdjustmentWithItems instead
 */
export type CostAdjustment = {
  systemId: string;
  id: string;
  type: CostAdjustmentType;
  status: CostAdjustmentStatus;
  items: CostAdjustmentItem[];
  note?: string;
  reason?: string;
  referenceCode?: string;
  createdDate?: string | Date | null;
  createdBySystemId?: string | null;
  createdByName?: string | null;
  confirmedDate?: string | Date | null;
  confirmedBySystemId?: string | null;
  confirmedByName?: string | null;
  cancelledDate?: string | Date | null;
  cancelledBySystemId?: string | null;
  cancelledByName?: string | null;
  cancelReason?: string | null;
  // Standard audit fields
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: string;
  updatedBy?: string;
};

// ============================================
// INVENTORY CHECK - PRISMA TYPES
// ============================================

/**
 * InventoryCheck with items relation included (Prisma)
 * Use when query includes: { include: { items: true } }
 */
export type InventoryCheckWithItems = InventoryCheckModel & {
  items: InventoryCheckItemModel[];
};

// Re-export Prisma types with aliases for convenience
export type { InventoryCheckModel, InventoryCheckItemModel };

// ============================================
// INVENTORY CHECK - APP TYPES (for compatibility)
// ============================================

/**
 * InventoryCheck status
 * Note: 'balanced' is legacy status, maps to 'completed' in new Prisma schema
 */
export type InventoryCheckStatus = 'draft' | 'balanced' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Difference reason for inventory check items
 */
export type DifferenceReason = 
  | 'other'       // Khác
  | 'damaged'     // Hư Hỏng
  | 'wear'        // Hao Mòn
  | 'return'      // Trả Hàng
  | 'transfer'    // Chuyển Hàng
  | 'production'; // Sản Xuất

/**
 * App-level InventoryCheckItem
 * @deprecated Use InventoryCheckItemModel instead
 */
export type InventoryCheckItem = {
  productSystemId: string;
  productId: string;
  productName: string;
  unit: string;
  systemQuantity: number;
  actualQuantity: number;
  difference: number;
  reason?: DifferenceReason;
  note?: string;
};

/**
 * App-level InventoryCheck
 * @deprecated Use InventoryCheckWithItems instead
 */
export type InventoryCheck = {
  systemId: string;
  id: string;
  branchSystemId?: string;
  branchName?: string;
  status: InventoryCheckStatus;
  createdBy?: string;
  createdAt?: string | Date;
  balancedAt?: string | Date | null;
  balancedBy?: string | null;
  cancelledAt?: string | Date | null;
  cancelledBy?: string | null;
  cancelledReason?: string | null;
  note?: string | null;
  items: InventoryCheckItem[];
  activityHistory?: HistoryEntry[];
};

// ============================================
// SUPPLIER - APP TYPES (Phase 7)
// ============================================

import type { SystemId, BusinessId } from '@/lib/id-types';
import type { HistoryEntry } from '@/lib/activity-history-helper';

/**
 * Supplier status
 */
export type SupplierStatus = "Đang Giao Dịch" | "Ngừng Giao Dịch";

/**
 * App-level Supplier
 */
export type Supplier = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  taxCode: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  accountManager: string;
  status: SupplierStatus;
  currentDebt?: number;
  bankAccount?: string;
  bankName?: string;
  contactPerson?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  activityHistory?: HistoryEntry[];
};

// ============================================
// CUSTOMER - APP TYPES (Phase 9)
// ============================================

/**
 * Customer status
 */
export type CustomerStatus = "Đang giao dịch" | "Ngừng Giao Dịch" | "inactive" | "active";

/**
 * Customer lifecycle stage
 */
export type CustomerLifecycleStage =
  | "Khách tiềm năng"
  | "Khách mới"
  | "Khách quay lại"
  | "Khách thân thiết"
  | "Khách VIP"
  | "Không hoạt động"
  | "Mất khách";

/**
 * Debt status
 */
export type DebtStatus = 
  | "Chưa đến hạn"
  | "Sắp đến hạn"
  | "Đến hạn hôm nay"
  | "Quá hạn 1-7 ngày"
  | "Quá hạn 8-15 ngày"
  | "Quá hạn 16-30 ngày"
  | "Quá hạn > 30 ngày";

/**
 * Debt transaction
 */
export type DebtTransaction = {
  systemId: SystemId;
  orderId: BusinessId;
  orderDate: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
  paidAmount?: number;
  remainingAmount?: number;
  notes?: string;
};

/**
 * Debt reminder
 */
export type DebtReminder = {
  systemId: SystemId;
  reminderDate: string;
  reminderType: 'Gọi điện' | 'SMS' | 'Email' | 'Gặp trực tiếp' | 'Khác';
  reminderBy: SystemId;
  reminderByName?: string;
  customerResponse?: 'Hứa trả' | 'Từ chối' | 'Không liên lạc được' | 'Đã trả' | 'Khác';
  promisePaymentDate?: string;
  dueDate?: string;
  amountDue?: number;
  notes?: string;
  createdAt?: string;
};

/**
 * Customer address
 */
export type CustomerAddress = {
  id: string;
  label: string;
  street: string;
  ward: string;
  wardId: string;
  district: string;
  districtId: number;
  province: string;
  provinceId: string;
  contactName?: string;
  contactPhone?: string;
  isDefault?: boolean;
  type?: 'shipping' | 'billing' | 'both';
  formattedAddress?: string;
  // Enhanced address fields
  inputLevel: '2-level' | '3-level';
  autoFilled: boolean;
  notes?: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  convertedAt?: string;
  // Deprecated flags
  isShipping?: boolean;
  isBilling?: boolean;
};

/**
 * App-level Customer
 */
export type Customer = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: CustomerStatus;
  taxCode?: string;
  representative?: string;
  position?: string;
  addresses?: CustomerAddress[];
  shippingAddress_street?: string;
  shippingAddress_ward?: string;
  shippingAddress_district?: string;
  shippingAddress_province?: string;
  billingAddress_street?: string;
  billingAddress_ward?: string;
  billingAddress_district?: string;
  billingAddress_province?: string;
  zaloPhone?: string;
  bankName?: string;
  bankAccount?: string;
  currentDebt?: number;
  maxDebt?: number;
  type?: string;
  customerGroup?: string;
  lifecycleStage?: CustomerLifecycleStage;
  rfmScores?: {
    recency: 1 | 2 | 3 | 4 | 5;
    frequency: 1 | 2 | 3 | 4 | 5;
    monetary: 1 | 2 | 3 | 4 | 5;
  };
  segment?: string;
  healthScore?: number;
  churnRisk?: 'low' | 'medium' | 'high';
  debtTransactions?: DebtTransaction[];
  debtReminders?: DebtReminder[];
  oldestDebtDueDate?: string;
  maxDaysOverdue?: number;
  debtStatus?: DebtStatus;
  source?: string;
  campaign?: string;
  referredBy?: SystemId;
  contacts?: Array<{
    id: string;
    name: string;
    role: string;
    phone?: string;
    email?: string;
    isPrimary: boolean;
  }>;
  paymentTerms?: string;
  creditRating?: string;
  allowCredit?: boolean;
  defaultDiscount?: number;
  pricingLevel?: 'Retail' | 'Wholesale' | 'VIP' | 'Partner';
  contract?: {
    number?: string;
    startDate?: string;
    endDate?: string;
    value?: number;
    status?: 'Active' | 'Expired' | 'Pending' | 'Cancelled';
    fileUrl?: string;
    details?: string;
  };
  tags?: string[];
  images?: string[];
  social?: {
    facebook?: string;
    linkedin?: string;
    website?: string;
  };
  notes?: string;
  accountManagerId?: SystemId;
  accountManagerName?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  totalOrders?: number;
  totalSpent?: number;
  totalQuantityPurchased?: number;
  totalQuantityReturned?: number;
  lastPurchaseDate?: string;
  failedDeliveries?: number;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  followUpReason?: string;
  followUpAssigneeId?: SystemId;
  followUpAssigneeName?: string;
  activityHistory?: HistoryEntry[];
};

// ============================================
// EMPLOYEE - APP TYPES (Phase 11)
// ============================================

import type { EmployeeModel } from '@/generated/prisma/models/Employee';

// Re-export Prisma base model
export type { EmployeeModel };

/**
 * Address input level type
 */
export type AddressInputLevel = '2-level' | '3-level';

/**
 * Base address interface
 */
interface BaseAddress {
  street: string;
  province: string;
  provinceId: string;
}

/**
 * Two-level address (theo luật 2025)
 */
export interface TwoLevelAddress extends BaseAddress {
  inputLevel: '2-level';
  ward: string;
  wardId: string;
  district: string;
  districtId: number;
}

/**
 * Three-level address (cũ)
 */
export interface ThreeLevelAddress extends BaseAddress {
  inputLevel: '3-level';
  district: string;
  districtId: number;
  ward: string;
  wardId: string;
}

/**
 * Employee address type
 */
export type EmployeeAddress = TwoLevelAddress | ThreeLevelAddress;

/**
 * Type guard for two-level address
 */
export function isTwoLevelAddress(address: EmployeeAddress): address is TwoLevelAddress {
  return address.inputLevel === '2-level';
}

/**
 * Type guard for three-level address
 */
export function isThreeLevelAddress(address: EmployeeAddress): address is ThreeLevelAddress {
  return address.inputLevel === '3-level';
}

/**
 * Create empty address helper
 */
export function createEmptyAddress(level: AddressInputLevel): EmployeeAddress {
  const base = {
    street: '',
    province: '',
    provinceId: '',
    district: '',
    districtId: 0,
    ward: '',
    wardId: '',
  };
  return { ...base, inputLevel: level } as EmployeeAddress;
}

/**
 * Employee role - matches features/employees/roles.ts
 */
export type EmployeeRole = 'Manager' | 'Sales' | 'Warehouse' | 'Admin';

/**
 * App-level Employee type
 */
export type Employee = {
  systemId: SystemId;
  id: BusinessId;
  
  // Personal Info
  fullName: string;
  dob: string;
  placeOfBirth?: string;
  gender: "Nam" | "Nữ" | "Khác";
  nationalId?: string;
  nationalIdIssueDate?: string;
  nationalIdIssuePlace?: string;
  permanentAddress?: EmployeeAddress | null;
  temporaryAddress?: EmployeeAddress | null;
  phone: string;
  personalEmail: string;
  workEmail: string;
  maritalStatus?: "Độc thân" | "Đã kết hôn" | "Khác";
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  personalTaxId?: string;
  socialInsuranceNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  avatarUrl?: string;
  avatar?: string;
  password?: string;
  
  // Employment Info
  jobTitle: string;
  department?: "Kỹ thuật" | "Nhân sự" | "Kinh doanh" | "Marketing";
  departmentId?: SystemId;
  departmentName?: string;
  branchSystemId?: SystemId;
  hireDate: string;
  startDate?: string;
  endDate?: string;
  employeeType?: "Chính thức" | "Thử việc" | "Thực tập sinh" | "Bán thời gian";
  employmentStatus: "Đang làm việc" | "Tạm nghỉ" | "Đã nghỉ việc";
  status?: "active" | "resigned" | "inactive" | "terminated";
  terminationDate?: string;
  reasonForLeaving?: string;
  role: EmployeeRole;
  
  // Salary & Contract
  baseSalary: number;
  socialInsuranceSalary?: number;
  positionAllowance?: number;
  mealAllowance?: number;
  otherAllowances?: number;
  numberOfDependents?: number;
  contractNumber?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  probationEndDate?: string;
  contractType?: "Không xác định" | "Thử việc" | "1 năm" | "2 năm" | "3 năm" | "Vô thời hạn";
  
  // Work Schedule
  workingHoursPerDay?: number;
  workingDaysPerWeek?: number;
  shiftType?: "Hành chính" | "Ca sáng" | "Ca chiều" | "Ca đêm" | "Luân ca";
  
  // Performance & Review
  performanceRating?: "Xuất sắc" | "Tốt" | "Đạt yêu cầu" | "Cần cải thiện";
  lastReviewDate?: string;
  nextReviewDate?: string;
  
  // Skills & Certifications
  skills?: string[];
  certifications?: string[];
  notes?: string;
  
  // Leave
  leaveTaken: number;
  paidLeaveTaken?: number;
  unpaidLeaveTaken?: number;
  annualLeaveTaken?: number;
  annualLeaveBalance?: number;
  
  // Organization Chart
  managerId?: SystemId;
  positionX?: number;
  positionY?: number;
  positionId?: SystemId;
  positionName?: string;
  
  // Audit fields
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  activityHistory?: HistoryEntry[];
};

// ============================================
// PRODUCT - APP TYPES (Phase 12)
// ============================================

import type { ProductModel } from '@/generated/prisma/models/Product';

// Re-export Prisma base model
export type { ProductModel };

// Status & Type enums
export type ProductStatus = 'active' | 'inactive' | 'discontinued';
export type ProductType = 'physical' | 'service' | 'digital' | 'combo';

// SEO types
export type WebsiteSeoData = {
  seoTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
  shortDescription?: string;
  longDescription?: string;
  slug?: string;
  ogImage?: string;
  // Legacy fields (for backward compatibility)
  title?: string;
  description?: string;
  keywords?: string;
};

export type MultiWebsiteSeo = {
  pkgx?: WebsiteSeoData;
  trendtech?: WebsiteSeoData;
};

// Combo types
export type ComboItem = {
  productSystemId: SystemId;
  quantity: number;
};

export type ComboPricingType = 'fixed' | 'sum_discount_percent' | 'sum_discount_amount';

// Variant types
export type ProductVariant = {
  id: string;
  sku?: string;
  barcode?: string;
  name: string;
  attributes: Record<string, string>;
  costPrice?: number;
  sellingPrice?: number;
  prices?: Record<string, number>;
  inventoryByBranch?: Record<SystemId, number>;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type VariantAttribute = {
  name: string;
  code: string;
  options: string[];
};

// Main Product type
export type Product = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  
  // SEO & Content
  ktitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  description?: string;
  shortDescription?: string;
  thumbnailImage?: string;
  galleryImages?: string[];
  images?: string[];
  videoLinks?: string[];
  seoPkgx?: WebsiteSeoData;
  seoTrendtech?: WebsiteSeoData;
  
  // Classification
  type?: ProductType;
  productTypeSystemId?: SystemId;
  categorySystemId?: SystemId;
  categorySystemIds?: SystemId[];
  category?: string;
  categories?: string[];
  subCategory?: string;
  subCategories?: string[];
  brandSystemId?: SystemId;
  productType?: string;
  warehouseLocation?: string;
  storageLocationSystemId?: SystemId;
  tags?: string[];
  status?: ProductStatus;
  pkgxId?: number;
  trendtechId?: number;
  
  // Pricing
  unit: string;
  costPrice: number;
  lastPurchasePrice?: number;
  lastPurchaseDate?: string;
  prices: Record<string, number>;
  minPrice?: number;
  sellingPrice?: number;
  taxRate?: number;
  sku?: string;
  
  // Inventory
  isStockTracked?: boolean;
  inventoryByBranch: Record<SystemId, number>;
  committedByBranch: Record<SystemId, number>;
  inTransitByBranch: Record<SystemId, number>;
  reorderLevel?: number;
  safetyStock?: number;
  maxStock?: number;
  
  // Logistics
  weight?: number;
  weightUnit?: 'g' | 'kg';
  dimensions?: { length?: number; width?: number; height?: number };
  barcode?: string;
  
  // Purchasing & Warranty
  primarySupplierSystemId?: SystemId;
  warrantyPeriodMonths?: number;
  sellerNote?: string;
  
  // Label fields
  nameVat?: string;
  origin?: string;
  usageGuide?: string;
  importerSystemId?: SystemId;
  importerName?: string;
  importerAddress?: string;
  
  // Combo fields
  comboItems?: ComboItem[];
  comboPricingType?: ComboPricingType;
  comboDiscount?: number;
  
  // E-commerce fields
  pkgxSlug?: string;
  trendtechSlug?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  sortOrder?: number;
  publishedAt?: string;
  
  // Variants
  hasVariants?: boolean;
  variantAttributes?: VariantAttribute[];
  variants?: ProductVariant[];
  
  // Analytics
  totalSold?: number;
  totalRevenue?: number;
  lastSoldDate?: string;
  viewCount?: number;
  
  // Lifecycle
  launchedDate?: string;
  discontinuedDate?: string;
  
  // Audit
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  activityHistory?: HistoryEntry[];
};

// ============================================
// ORDER - PRISMA & APP TYPES
// ============================================

import type { OrderModel } from '@/generated/prisma/models/Order';

// Re-export Prisma base model
export type { OrderModel };

// Order status types
export type OrderMainStatus = 'Đặt hàng' | 'Đang giao dịch' | 'Hoàn thành' | 'Đã hủy';
export type OrderPaymentStatus = 'Chưa thanh toán' | 'Thanh toán 1 phần' | 'Thanh toán toàn bộ';
export type PackagingStatus = 'Chờ đóng gói' | 'Đã đóng gói' | 'Hủy đóng gói';
export type OrderDeliveryStatus = 'Chờ đóng gói' | 'Đã đóng gói' | 'Chờ lấy hàng' | 'Đang giao hàng' | 'Đã giao hàng' | 'Chờ giao lại' | 'Đã hủy';
export type OrderPrintStatus = 'Đã in' | 'Chưa in';
export type OrderDeliveryMethod = 'Nhận tại cửa hàng' | 'Dịch vụ giao hàng';
export type OrderStockOutStatus = 'Chưa xuất kho' | 'Xuất kho toàn bộ';
export type OrderReturnStatus = 'Chưa trả hàng' | 'Trả hàng một phần' | 'Trả hàng toàn bộ';

/**
 * Order shipping/billing address
 */
export type OrderAddress = {
  street?: string;
  ward?: string;
  district?: string;
  province?: string;
  contactName?: string;
  phone?: string;
  company?: string;
  note?: string;
  label?: string;
  provinceId?: string;
  districtId?: number | string;
  wardId?: string;
  formattedAddress?: string;
  contactPhone?: string;
  id?: string;
};

/**
 * Order cancellation metadata
 */
export type OrderCancellationMetadata = {
  restockItems: boolean;
  notifyCustomer: boolean;
  emailNotifiedAt?: string;
};

/**
 * Order line item
 */
export type LineItem = {
  productSystemId: SystemId;
  productId: BusinessId;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  tax?: number;
  taxId?: string;
  note?: string;
};

/**
 * Order payment record
 */
export type OrderPayment = {
  systemId: SystemId;
  id: BusinessId;
  date: string;
  method: string;
  amount: number;
  createdBy: SystemId;
  description: string;
  linkedWarrantySystemId?: SystemId;
};

/**
 * Packaging (fulfillment) record for order
 */
export type Packaging = {
  systemId: SystemId;
  id: BusinessId;
  requestDate: string;
  confirmDate?: string;
  cancelDate?: string;
  deliveredDate?: string;
  requestingEmployeeId: SystemId;
  requestingEmployeeName: string;
  confirmingEmployeeId?: SystemId;
  confirmingEmployeeName?: string;
  cancelingEmployeeId?: SystemId;
  cancelingEmployeeName?: string;
  assignedEmployeeId?: SystemId;
  assignedEmployeeName?: string;
  status: PackagingStatus;
  printStatus: OrderPrintStatus;
  cancelReason?: string;
  notes?: string;
  deliveryMethod?: OrderDeliveryMethod;
  deliveryStatus?: OrderDeliveryStatus;
  carrier?: string;
  service?: string;
  trackingCode?: string;
  partnerStatus?: string;
  shippingFeeToPartner?: number;
  codAmount?: number;
  payer?: 'Người gửi' | 'Người nhận';
  reconciliationStatus?: 'Chưa đối soát' | 'Đã đối soát';
  weight?: number;
  dimensions?: string;
  noteToShipper?: string;
  ghtkStatusId?: number;
  ghtkReasonCode?: string;
  ghtkReasonText?: string;
  ghtkTrackingId?: string;
  estimatedPickTime?: string;
  estimatedDeliverTime?: string;
  lastSyncedAt?: string;
  actualWeight?: number;
  actualFee?: number;
  ghtkWebhookHistory?: Array<{
    status_id: number;
    status_text?: string;
    action_time: string;
    reason_code?: string;
    reason_text?: string;
  }>;
};

/**
 * Full Order type for app-level usage
 */
export type Order = {
  systemId: SystemId;
  id: BusinessId;
  customerSystemId: SystemId;
  customerName: string;
  shippingAddress?: string | OrderAddress;
  billingAddress?: string | OrderAddress;
  branchSystemId: SystemId;
  branchName: string;
  salespersonSystemId: SystemId;
  salesperson: string;
  assignedPackerSystemId?: SystemId;
  assignedPackerName?: string;
  orderDate: string;
  sourceSalesReturnId?: BusinessId;
  linkedSalesReturnSystemId?: SystemId;
  linkedSalesReturnValue?: number;
  expectedDeliveryDate?: string;
  expectedPaymentMethod?: string;
  referenceUrl?: string;
  externalReference?: string;
  serviceFees?: Array<{ id: string; name: string; amount: number }>;
  status: OrderMainStatus;
  paymentStatus: OrderPaymentStatus;
  deliveryStatus: OrderDeliveryStatus;
  printStatus: OrderPrintStatus;
  stockOutStatus: OrderStockOutStatus;
  returnStatus: OrderReturnStatus;
  deliveryMethod: OrderDeliveryMethod;
  cancellationReason?: string;
  cancellationMetadata?: OrderCancellationMetadata;
  approvedDate?: string;
  completedDate?: string;
  cancelledDate?: string;
  dispatchedDate?: string;
  dispatchedByEmployeeId?: SystemId;
  dispatchedByEmployeeName?: string;
  codAmount: number;
  lineItems: LineItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  orderDiscount?: number;
  orderDiscountType?: 'percentage' | 'fixed';
  orderDiscountReason?: string;
  voucherCode?: string;
  voucherAmount?: number;
  grandTotal: number;
  paidAmount: number;
  payments: OrderPayment[];
  notes?: string;
  tags?: string[];
  packagings: Packaging[];
  shippingInfo?: {
    carrier: string;
    service: string;
    trackingCode: string;
  };
  source?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
    order: number;
    createdAt: Date;
    completedAt?: Date;
    assigneeId?: string;
    assigneeName?: string;
    parentId?: string;
    metadata?: any;
    dueDate?: string;
  }>;
  activityHistory?: HistoryEntry[];
};

/**
 * GHTK Webhook payload for delivery status updates
 */
export type GHTKWebhookPayload = {
  partner_id: string;
  label_id: string;
  status_id: number;
  action_time: string;
  reason_code?: string;
  reason?: string;
  weight?: number;
  fee?: number;
  pick_money?: number;
  return_part_package?: number;
};

// ============================================
// PURCHASE ORDER - APP TYPES
// ============================================

/**
 * Purchase Order status types
 */
export type PurchaseOrderStatus = "Đặt hàng" | "Đang giao dịch" | "Hoàn thành" | "Đã hủy" | "Kết thúc" | "Đã trả hàng";
export type PurchaseOrderDeliveryStatus = "Chưa nhập" | "Đã nhập một phần" | "Đã nhập";
export type PurchaseOrderPaymentStatus = "Chưa thanh toán" | "Thanh toán một phần" | "Đã thanh toán";
export type PurchaseOrderReturnStatus = "Chưa hoàn trả" | "Hoàn hàng một phần" | "Hoàn hàng toàn bộ";
export type PurchaseOrderRefundStatus = "Chưa hoàn tiền" | "Hoàn tiền một phần" | "Hoàn tiền toàn bộ";

/**
 * Purchase Order payment record
 */
export type PurchaseOrderPayment = {
  systemId: string;
  id: string;
  method: string;
  amount: number;
  paymentDate: string;
  reference?: string;
  payerName: string;
};

/**
 * Purchase Order line item
 */
export type PurchaseOrderLineItem = {
  productSystemId: string;
  productId: string;
  productName: string;
  sku?: string;
  unit?: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  taxRate: number;
  note?: string;
};

/**
 * Full Purchase Order type
 */
export type PurchaseOrder = {
  systemId: string;
  id: string;
  supplierSystemId: string;
  supplierName: string;
  branchSystemId: string;
  branchName: string;
  orderDate: string;
  deliveryDate?: string;
  buyerSystemId: string;
  buyer: string;
  creatorSystemId: string;
  creatorName: string;
  status: PurchaseOrderStatus;
  deliveryStatus: PurchaseOrderDeliveryStatus;
  paymentStatus: PurchaseOrderPaymentStatus;
  returnStatus?: PurchaseOrderReturnStatus;
  refundStatus?: PurchaseOrderRefundStatus;
  lineItems: PurchaseOrderLineItem[];
  subtotal: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  shippingFee: number;
  tax: number;
  grandTotal: number;
  payments: PurchaseOrderPayment[];
  inventoryReceiptIds?: string[];
  notes?: string;
  reference?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  activityHistory?: HistoryEntry[];
};

// ============================================
// SHIPMENT - APP TYPES
// ============================================

export type ShipmentReconciliationStatus = 'Chưa đối soát' | 'Đã đối soát';
export type ShipmentPayer = 'Người gửi' | 'Người nhận';

/**
 * Shipment entity - vận đơn
 * Linked với Packaging qua packagingSystemId
 */
export type Shipment = {
  // IDs
  systemId: SystemId;
  id: BusinessId;
  packagingSystemId: SystemId;
  orderSystemId: SystemId;
  orderId: BusinessId;
  
  // Carrier Info
  trackingCode?: string;
  carrier?: string;
  service?: string;
  
  // Status
  deliveryStatus?: OrderDeliveryStatus;
  printStatus: OrderPrintStatus;
  reconciliationStatus?: ShipmentReconciliationStatus;
  partnerStatus?: string;
  
  // Financial
  shippingFeeToPartner?: number;
  codAmount?: number;
  payer?: ShipmentPayer;
  
  // Dates
  createdAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  
  // Physical Properties
  weight?: number;
  dimensions?: string;
  noteToShipper?: string;
  
  // GHTK Specific
  ghtkStatusId?: number;
  ghtkReasonCode?: string;
  ghtkReasonText?: string;
  ghtkTrackingId?: string;
  estimatedPickTime?: string;
  estimatedDeliverTime?: string;
  lastSyncedAt?: string;
  actualWeight?: number;
  actualFee?: number;
  activityHistory?: HistoryEntry[];
};

/**
 * ShipmentView - Extended type for list display
 */
export type ShipmentView = Shipment & {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerEmail: string;
  branchName: string;
  packagingDate?: string;
  totalProductQuantity: number;
  customerDue: number;
  creatorEmployeeName: string;
  dispatchEmployeeName?: string;
  cancelingEmployeeName?: string;
};

// ============================================
// PACKAGING SLIP - VIEW TYPE
// ============================================

/**
 * PackagingSlip - View type for packaging list display
 */
export type PackagingSlip = {
  systemId: string;
  id: string;
  requestDate: string;
  confirmDate?: string;
  cancelDate?: string;
  requestingEmployeeName: string;
  confirmingEmployeeName?: string;
  cancelingEmployeeName?: string;
  assignedEmployeeName?: string;
  status: PackagingStatus;
  printStatus: OrderPrintStatus;
  cancelReason?: string;
  orderId: string;
  orderSystemId: string;
  customerName: string;
  branchName: string;
};

// ============================================
// SALES RETURN - APP TYPES
// ============================================

import type { SalesReturnModel } from '@/generated/prisma/models/SalesReturn';
export type { SalesReturnModel };

/**
 * Return line item
 */
export type ReturnLineItem = {
  productSystemId: SystemId;
  productId: BusinessId;
  productName: string;
  returnQuantity: number;
  unitPrice: number;
  totalValue: number;
  note?: string;
};

/**
 * Sales return payment
 */
export type SalesReturnPayment = {
  method: string;
  accountSystemId: SystemId;
  amount: number;
};

/**
 * Full Sales Return type
 */
export type SalesReturn = {
  systemId: SystemId;
  id: BusinessId;
  orderSystemId: SystemId;
  orderId: BusinessId;
  customerSystemId: SystemId;
  customerName: string;
  branchSystemId: SystemId;
  branchName: string;
  returnDate: string;
  reason?: string;
  note?: string;
  notes?: string;
  reference?: string;
  items: ReturnLineItem[];
  totalReturnValue: number;
  isReceived: boolean;
  exchangeItems: LineItem[];
  exchangeOrderSystemId?: SystemId;
  subtotalNew: number;
  shippingFeeNew: number;
  discountNew?: number;
  discountNewType?: 'percentage' | 'fixed';
  grandTotalNew: number;
  deliveryMethod?: string;
  shippingPartnerId?: string;
  shippingServiceId?: string;
  shippingAddress?: any;
  packageInfo?: any;
  configuration?: any;
  finalAmount: number;
  refundMethod?: string;
  refundAmount?: number;
  accountSystemId?: SystemId;
  refunds?: SalesReturnPayment[];
  payments?: SalesReturnPayment[];
  paymentVoucherSystemId?: SystemId;
  paymentVoucherSystemIds?: SystemId[];
  receiptVoucherSystemIds?: SystemId[];
  creatorSystemId: SystemId;
  creatorName: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================================================
// PURCHASE RETURN TYPES
// ============================================================================

/**
 * Thông tin chi tiết từng sản phẩm trong phiếu hoàn trả
 */
export type PurchaseReturnLineItem = {
  productSystemId: SystemId;      // ID hệ thống của sản phẩm
  productId: BusinessId;          // Mã SKU sản phẩm (hiển thị)
  productName: string;            // Tên sản phẩm
  orderedQuantity: number;        // Số lượng đã đặt trong đơn nhập gốc
  returnQuantity: number;         // Số lượng thực tế hoàn trả lần này
  unitPrice: number;              // Đơn giá (lấy từ đơn nhập gốc)
  note?: string | undefined;      // Ghi chú riêng cho sản phẩm này (lý do trả cụ thể)
};

/**
 * Phiếu hoàn trả hàng cho nhà cung cấp
 * 
 * Quy trình:
 * 1. Tạo từ đơn nhập hàng đã có phiếu nhập kho
 * 2. Số lượng có thể trả = Tổng đã nhận về kho - Tổng đã trả trước đó
 * 3. Có thể yêu cầu NCC hoàn tiền nếu đã thanh toán trước
 * 4. Tiền hoàn lại sẽ được ghi nhận vào sổ quỹ (nếu có)
 */
export type PurchaseReturn = {
  systemId: SystemId;                 // ID hệ thống tự động (PRETURN000001, PRETURN000002, ...)
  id: BusinessId;                     // Mã phiếu hiển thị do người dùng nhập hoặc tự động (TH000001 - 6 số)
  purchaseOrderSystemId: SystemId;    // SystemId đơn nhập hàng gốc dùng cho foreign key
  purchaseOrderId: BusinessId;        // Mã đơn nhập hàng gốc (Business ID hiển thị)
  supplierSystemId: SystemId;         // ID nhà cung cấp
  supplierName: string;               // Tên nhà cung cấp (snapshot)
  branchSystemId: SystemId;           // Branch systemId only
  branchName: string;                 // Tên chi nhánh (snapshot)
  returnDate: string;                 // Ngày hoàn trả (YYYY-MM-DD)
  reason?: string | undefined;        // Lý do hoàn trả chung (tùy chọn)
  items: PurchaseReturnLineItem[];    // Danh sách sản phẩm hoàn trả
  totalReturnValue: number;           // Tổng giá trị hàng hoàn trả
  refundAmount: number;               // Số tiền thực tế nhận lại từ NCC (có thể = 0)
  refundMethod: string;               // Hình thức nhận tiền: "Tiền mặt" | "Chuyển khoản"
  accountSystemId?: SystemId | undefined;  // ID tài khoản quỹ nhận tiền (nếu có hoàn tiền)
  creatorName: string;                // Tên người tạo phiếu hoàn trả
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  activityHistory?: HistoryEntry[];
};

// ============================================
// INVENTORY RECEIPT - APP TYPES
// ============================================

export type InventoryReceiptLineItem = {
  productSystemId: SystemId;
  productId: BusinessId;
  productName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitPrice: number;
};

export type InventoryReceipt = {
  systemId: SystemId;
  id: BusinessId;
  purchaseOrderId: BusinessId;
  purchaseOrderSystemId: SystemId;
  supplierSystemId: SystemId;
  supplierName: string;
  receivedDate: string;
  receiverSystemId: SystemId;
  receiverName: string;
  branchSystemId?: SystemId;
  branchName?: string;
  warehouseName?: string;
  notes?: string;
  items: InventoryReceiptLineItem[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// PAYMENT TYPE (Loại Phiếu Chi)
// ============================================
export type PaymentType = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string | undefined;
  isBusinessResult: boolean;
  createdAt: string;
  isActive: boolean;
  color?: string | undefined;
};

// ============================================
// PAYMENT (Phiếu Chi)
// ============================================
export type PaymentStatus = 'completed' | 'cancelled';

export type PaymentCategory = 
  | 'purchase'
  | 'complaint_refund'
  | 'warranty_refund'
  | 'salary'
  | 'expense'
  | 'supplier_payment'
  | 'other';

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export const PAYMENT_CATEGORY_LABELS: Record<PaymentCategory, string> = {
  purchase: 'Mua hàng',
  complaint_refund: 'Hoàn tiền khiếu nại',
  warranty_refund: 'Hoàn tiền bảo hành',
  salary: 'Chi lương',
  expense: 'Chi phí',
  supplier_payment: 'Thanh toán NCC',
  other: 'Khác',
};

export type Payment = {
  systemId: SystemId;
  id: BusinessId;
  date: string;
  amount: number;
  recipientTypeSystemId: SystemId;
  recipientTypeName: string;
  recipientName: string;
  recipientSystemId?: SystemId | undefined;
  description: string;
  paymentMethodSystemId: SystemId;
  paymentMethodName: string;
  accountSystemId: SystemId;
  paymentReceiptTypeSystemId: SystemId;
  paymentReceiptTypeName: string;
  branchSystemId: SystemId;
  branchName: string;
  createdBy: SystemId;
  createdAt: string;
  status: PaymentStatus;
  category?: PaymentCategory | undefined;
  recognitionDate?: string | undefined;
  updatedAt?: string | undefined;
  cancelledAt?: string | undefined;
  originalDocumentId?: string | undefined;
  purchaseOrderSystemId?: SystemId | undefined;
  purchaseOrderId?: BusinessId | undefined;
  linkedWarrantySystemId?: SystemId | undefined;
  linkedComplaintSystemId?: SystemId | undefined;
  linkedOrderSystemId?: SystemId | undefined;
  linkedSalesReturnSystemId?: SystemId | undefined;
  linkedPayrollBatchSystemId?: SystemId | undefined;
  linkedPayslipSystemId?: SystemId | undefined;
  customerSystemId?: SystemId | undefined;
  customerName?: string | undefined;
  affectsDebt: boolean;
  runningBalance?: number | undefined;
  activityHistory?: HistoryEntry[] | undefined;
};

// ============================================
// RECEIPT TYPE (Loại Phiếu Thu)
// ============================================
export type ReceiptType = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string | undefined;
  isBusinessResult: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  isActive: boolean;
  isDefault?: boolean;
  color?: string | undefined;
};

// ============================================
// RECEIPT (Phiếu Thu)
// ============================================
export type ReceiptStatus = 'completed' | 'cancelled';

export type ReceiptCategory = 
  | 'sale'
  | 'complaint_penalty'
  | 'warranty_additional'
  | 'customer_payment'
  | 'other';

export const RECEIPT_STATUS_LABELS: Record<ReceiptStatus, string> = {
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export const RECEIPT_CATEGORY_LABELS: Record<ReceiptCategory, string> = {
  sale: 'Bán hàng',
  complaint_penalty: 'Phạt nhân viên',
  warranty_additional: 'Thu thêm bảo hành',
  customer_payment: 'Thu tiền khách',
  other: 'Khác',
};

export type ReceiptOrderAllocation = {
  orderSystemId: SystemId;
  orderId: BusinessId;
  amount: number;
};

export type Receipt = {
  systemId: SystemId;
  id: BusinessId;
  date: string;
  amount: number;
  payerTypeSystemId: SystemId;
  payerTypeName: string;
  payerName: string;
  payerSystemId?: SystemId | undefined;
  description: string;
  paymentMethodSystemId: SystemId;
  paymentMethodName: string;
  accountSystemId: SystemId;
  paymentReceiptTypeSystemId: SystemId;
  paymentReceiptTypeName: string;
  branchSystemId: SystemId;
  branchName: string;
  createdBy: SystemId;
  createdAt: string;
  status: ReceiptStatus;
  category?: ReceiptCategory | undefined;
  recognitionDate?: string | undefined;
  updatedAt?: string | undefined;
  cancelledAt?: string | undefined;
  originalDocumentId?: BusinessId | undefined;
  purchaseOrderSystemId?: SystemId | undefined;
  purchaseOrderId?: BusinessId | undefined;
  linkedWarrantySystemId?: SystemId | undefined;
  linkedComplaintSystemId?: SystemId | undefined;
  linkedOrderSystemId?: SystemId | undefined;
  linkedSalesReturnSystemId?: SystemId | undefined;
  customerSystemId?: SystemId | undefined;
  customerName?: string | undefined;
  affectsDebt: boolean;
  runningBalance?: number | undefined;
  orderAllocations?: ReceiptOrderAllocation[] | undefined;
  activityHistory?: HistoryEntry[] | undefined;
};

// ============================================
// CASH ACCOUNT (Tài khoản tiền mặt/ngân hàng)
// ============================================
export type CashAccount = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  initialBalance: number;
  type: 'cash' | 'bank';
  bankAccountNumber?: string;
  bankBranch?: string;
  branchSystemId?: SystemId;
  isActive: boolean;
  isDefault?: boolean;
  bankName?: string;
  bankCode?: string;
  accountHolder?: string;
  minBalance?: number;
  maxBalance?: number;
  managedBy?: SystemId;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// STOCK HISTORY
// ============================================
export type StockHistoryAction = 
  | 'Nhập hàng từ NCC' 
  | 'Xuất bán' 
  | 'Kiểm kho'
  | 'Nhập kho (Kiểm hàng)'
  | 'Xuất kho (Kiểm hàng)'
  | 'Trả hàng'
  | 'Khác';

export type StockHistoryEntry = {
  systemId: SystemId;
  productId: SystemId;
  date: string;
  employeeName: string;
  action: StockHistoryAction | string;
  quantityChange: number;
  newStockLevel: number;
  documentId: BusinessId;
  branchSystemId: SystemId;
  branch: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// STOCK LOCATION
// ============================================
export type StockLocation = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  branchSystemId: SystemId;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// STOCK TRANSFER
// ============================================
export type StockTransferStatus = 'pending' | 'transferring' | 'completed' | 'cancelled';

export type StockTransferItem = {
  productSystemId: SystemId;
  productId: BusinessId;
  productName: string;
  quantity: number;
  receivedQuantity?: number;
  note?: string;
};

export type StockTransfer = {
  systemId: SystemId;
  id: BusinessId;
  referenceCode?: string;
  fromBranchSystemId: SystemId;
  fromBranchName: string;
  toBranchSystemId: SystemId;
  toBranchName: string;
  status: StockTransferStatus;
  items: StockTransferItem[];
  createdDate: string;
  createdBySystemId: SystemId;
  createdByName: string;
  transferredDate?: string;
  transferredBySystemId?: SystemId;
  transferredByName?: string;
  receivedDate?: string;
  receivedBySystemId?: SystemId;
  receivedByName?: string;
  cancelledDate?: string;
  cancelledBySystemId?: SystemId;
  cancelledByName?: string;
  cancelReason?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

export type StockTransferFormData = {
  fromBranchSystemId: string;
  toBranchSystemId: string;
  referenceCode?: string;
  items: {
    productSystemId: string;
    quantity: number;
    note?: string;
  }[];
  note?: string;
};

// ============================================
// TASK TYPES
// ============================================
export const TASK_PRIORITIES = ['Thấp', 'Trung bình', 'Cao', 'Khẩn cấp', 'low', 'medium', 'high', 'urgent'] as const;
export type TaskPriority = typeof TASK_PRIORITIES[number];

export const TASK_STATUSES = [
  'Chưa bắt đầu',
  'Đang thực hiện',
  'Đang chờ',
  'Chờ duyệt',
  'Chờ xử lý',
  'Hoàn thành',
  'Đã hủy'
] as const;
export type TaskStatus = typeof TASK_STATUSES[number];

export const ASSIGNEE_ROLES = ['owner', 'contributor', 'reviewer'] as const;
export type AssigneeRole = typeof ASSIGNEE_ROLES[number];

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type TaskActivityAction = 
  | 'created' 
  | 'updated' 
  | 'status_changed' 
  | 'assigned' 
  | 'assignee_added'
  | 'assignee_removed'
  | 'priority_changed'
  | 'progress_updated'
  | 'timer_started'
  | 'timer_stopped'
  | 'subtask_completed'
  | 'subtask_uncompleted'
  | 'completed'
  | 'commented'
  | 'evidence_submitted'
  | 'evidence_approved'
  | 'evidence_rejected';

export type TaskActivity = {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  action: TaskActivityAction;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  description?: string;
  timestamp: string;
};

export type TaskComment = {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
};

export type TaskAttachment = {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
};

export type CompletionEvidence = {
  images: string[];
  note: string;
  submittedAt: string;
  submittedBy: string;
  submittedByName: string;
};

export type ApprovalHistory = {
  id: string;
  status: ApprovalStatus;
  reviewedBy: string;
  reviewedByName: string;
  reviewedAt: string;
  reason?: string;
};

export type TaskAssignee = {
  systemId: SystemId;
  employeeSystemId: SystemId;
  employeeName: string;
  role: AssigneeRole;
  assignedAt: string;
  assignedBy: SystemId;
};

export type Task = {
  systemId: SystemId;
  id: BusinessId;
  title: string;
  description: string;
  type?: string;
  assignees: TaskAssignee[];
  assigneeId: SystemId;
  assigneeName: string;
  assignerId: SystemId;
  assignerName: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress: number;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  subtasks?: Array<{ id: string; title: string; completed: boolean }>;
  activities?: TaskActivity[];
  timerRunning?: boolean;
  timerStartedAt?: string;
  totalTrackedSeconds?: number;
  requiresEvidence?: boolean;
  completionEvidence?: CompletionEvidence;
  approvalStatus?: ApprovalStatus;
  approvalHistory?: ApprovalHistory[];
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: SystemId;
  updatedBy: SystemId;
  isDeleted?: boolean;
};

// ============================================
// WIKI TYPES
// ============================================
export type WikiArticle = {
  systemId: SystemId;
  id: BusinessId;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  author: string;
};

// ============================================
// WARRANTY TYPES
// ============================================
export type WarrantyStatus = 
  | 'incomplete'
  | 'pending'
  | 'processed'
  | 'returned'
  | 'completed'
  | 'cancelled';

export const WARRANTY_STATUS_LABELS: Record<WarrantyStatus, string> = {
  incomplete: 'Chưa đầy đủ',
  pending: 'Chưa xử lý',
  processed: 'Đã xử lý',
  returned: 'Đã trả',
  completed: 'Kết thúc',
  cancelled: 'Đã hủy',
};

export const WARRANTY_STATUS_COLORS: Record<WarrantyStatus, string> = {
  incomplete: 'bg-orange-100 text-orange-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processed: 'bg-green-100 text-green-800',
  returned: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800 line-through',
};

export type WarrantySettlementStatus = 'pending' | 'partial' | 'completed';

export const WARRANTY_SETTLEMENT_STATUS_LABELS: Record<WarrantySettlementStatus, string> = {
  pending: 'Chưa thanh toán',
  partial: 'Thanh toán một phần',
  completed: 'Đã thanh toán',
};

export const WARRANTY_SETTLEMENT_STATUS_COLORS: Record<WarrantySettlementStatus, string> = {
  pending: 'bg-red-100 text-red-800',
  partial: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
};

export type ResolutionType = 
  | 'return'
  | 'replace'
  | 'deduct'
  | 'out_of_stock';

export const RESOLUTION_LABELS: Record<ResolutionType, string> = {
  return: 'Trả lại',
  replace: 'Đổi mới',
  deduct: 'Trừ tiền',
  out_of_stock: 'Hết hàng',
};

export type SettlementType = 
  | 'cash'
  | 'transfer'
  | 'debt'
  | 'voucher'
  | 'order_deduction'
  | 'mixed';

export const SETTLEMENT_TYPE_LABELS: Record<SettlementType, string> = {
  cash: 'Trả tiền mặt',
  transfer: 'Chuyển khoản',
  debt: 'Ghi công nợ',
  voucher: 'Tạo voucher',
  order_deduction: 'Trừ vào tiền hàng',
  mixed: 'Kết hợp nhiều phương thức',
};

export type SettlementStatus = 'pending' | 'partial' | 'completed' | 'cancelled';

export const SETTLEMENT_STATUS_LABELS: Record<SettlementStatus, string> = {
  pending: 'Chưa bù trừ',
  partial: 'Bù trừ 1 phần',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã hủy',
};

export const WARRANTY_STATUS_TRANSITIONS: Record<WarrantyStatus, WarrantyStatus[]> = {
  incomplete: ['pending'],
  pending: ['processed'],
  processed: ['returned'],
  returned: ['completed'],
  completed: [],
  cancelled: [],
};

export function canTransitionStatus(currentStatus: WarrantyStatus, newStatus: WarrantyStatus): boolean {
  return WARRANTY_STATUS_TRANSITIONS[currentStatus].includes(newStatus);
}

export function getNextAllowedStatuses(currentStatus: WarrantyStatus): WarrantyStatus[] {
  return WARRANTY_STATUS_TRANSITIONS[currentStatus];
}

export type UnsettledProduct = {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  reason: 'out_of_stock' | 'discontinued' | 'defective';
};

export type SettlementMethod = {
  systemId: SystemId;
  type: Exclude<SettlementType, 'mixed'>;
  amount: number;
  status: SettlementStatus;
  linkedOrderSystemId?: SystemId;
  paymentVoucherId?: SystemId;
  debtTransactionId?: SystemId;
  voucherCode?: string;
  bankAccount?: string;
  transactionCode?: string;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
};

export type WarrantySettlement = {
  systemId: SystemId;
  warrantyId: SystemId;
  settlementType: SettlementType;
  totalAmount: number;
  settledAmount: number;
  remainingAmount: number;
  unsettledProducts: UnsettledProduct[];
  paymentVoucherId?: SystemId;
  debtTransactionId?: SystemId;
  voucherCode?: string;
  linkedOrderSystemId?: SystemId;
  methods?: SettlementMethod[];
  status: SettlementStatus;
  settledAt?: string;
  settledBy?: SystemId;
  notes: string;
  createdAt: string;
  updatedAt?: string;
};

export type WarrantyProduct = {
  systemId: SystemId;
  productSystemId?: SystemId;
  sku?: BusinessId;
  productName: string;
  quantity?: number;
  unitPrice?: number;
  issueDescription: string;
  resolution: ResolutionType;
  deductionAmount?: number;
  productImages: string[];
  notes?: string;
};

export type WarrantyHistory = {
  systemId: SystemId;
  action: string;
  actionLabel: string;
  entityType?: string;
  entityId?: SystemId;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  performedBy: string;
  performedBySystemId?: SystemId;
  performedAt: string;
  note?: string;
  metadata?: Record<string, any>;
  linkedOrderSystemId?: SystemId;
  linkedVoucherSystemId?: SystemId;
};

export type WarrantyComment = {
  systemId: SystemId;
  content: string;
  contentText: string;
  createdBy: string;
  createdBySystemId: SystemId;
  createdAt: string;
  updatedAt?: string;
  attachments?: string[];
  mentions?: SystemId[];
  parentId?: SystemId;
  isEdited?: boolean;
  isDeleted?: boolean;
};

export type WarrantyTicket = {
  systemId: SystemId;
  id: BusinessId;
  branchSystemId: SystemId;
  branchName: string;
  employeeSystemId: SystemId;
  employeeName: string;
  customerSystemId?: SystemId;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  trackingCode: string;
  publicTrackingCode?: string;
  shippingFee?: number;
  referenceUrl?: string;
  externalReference?: string;
  receivedImages: string[];
  products: WarrantyProduct[];
  processedImages?: string[];
  status: WarrantyStatus;
  statusReason?: string;
  settlementStatus?: WarrantySettlementStatus;
  stockDeducted?: boolean;
  processingStartedAt?: string;
  processedAt?: string;
  returnedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  linkedOrderSystemId?: SystemId;
  notes?: string;
  summary: {
    totalProducts: number;
    totalReplaced: number;
    totalReturned?: number;
    totalDeduction: number;
    totalOutOfStock?: number;
    totalSettlement?: number;
  };
  settlement?: WarrantySettlement;
  history: WarrantyHistory[];
  comments: WarrantyComment[];
  subtasks?: import('@/components/shared/subtask-list').Subtask[];
  createdBy: string;
  createdBySystemId?: SystemId;
  createdAt: string;
  updatedAt: string;
  updatedBySystemId?: SystemId;
};

export type WarrantyCustomerInfoLocal = {
  name: string;
  phone: string;
  systemId?: string;
  address?: string;
  addresses?: Customer['addresses'];
};

export type WarrantyFormValues = {
  id?: BusinessId;
  customer: (Customer | WarrantyCustomerInfoLocal) | null;
  branchSystemId: SystemId;
  employeeSystemId: SystemId;
  trackingCode: string;
  shippingFee?: number;
  referenceUrl?: string;
  externalReference?: string;
  receivedImages: string[];
  processedImages?: string[];
  products: WarrantyProduct[];
  notes?: string;
  status: WarrantyStatus;
  settlementMethod?: string;
  settlementAmount?: number;
  settlementBankAccount?: string;
  settlementTransactionCode?: string;
  settlementDueDate?: string;
  settlementVoucherCode?: string;
  linkedOrderSystemId?: SystemId;
};

// ============================================
// ATTENDANCE TYPES
// ============================================
export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'half-day' | 'weekend' | 'holiday' | 'future';

export type DailyRecord = {
  status: AttendanceStatus;
  checkIn?: string | undefined;
  morningCheckOut?: string | undefined;
  afternoonCheckIn?: string | undefined;
  checkOut?: string | undefined;
  overtimeCheckIn?: string | undefined;
  overtimeCheckOut?: string | undefined;
  notes?: string | undefined;
};

export type DepartmentName = "Kỹ thuật" | "Nhân sự" | "Kinh doanh" | "Marketing";

export type AttendanceDayKey = `day_${number}`;

export type AttendanceDayRecords = Partial<Record<AttendanceDayKey, DailyRecord>>;

export type AttendanceSummaryFields = {
  systemId: SystemId;
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  fullName: string;
  department: DepartmentName | undefined;
  workDays: number;
  leaveDays: number;
  absentDays: number;
  lateArrivals: number;
  earlyDepartures: number;
  otHours: number;
  otHoursWeekday?: number;
  otHoursWeekend?: number;
  otHoursHoliday?: number;
};

export type AttendanceDataRow = AttendanceSummaryFields & AttendanceDayRecords;

export type AnyAttendanceDataRow = AttendanceDayRecords & {
  systemId: SystemId;
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  fullName: string;
  department: DepartmentName | undefined;
  workDays?: number;
  leaveDays?: number;
  absentDays?: number;
  lateArrivals?: number;
  earlyDepartures?: number;
  otHours?: number;
  otHoursWeekday?: number;
  otHoursWeekend?: number;
  otHoursHoliday?: number;
  [key: string]: unknown;
};

export type ImportPreviewRow = {
  excelRow: number;
  sheetName: string;
  employeeSystemId?: SystemId | undefined;
  employeeId?: BusinessId | undefined;
  employeeName?: string | undefined;
  day: number;
  checkIn?: string | undefined;
  morningCheckOut?: string | undefined;
  afternoonCheckIn?: string | undefined;
  checkOut?: string | undefined;
  overtimeCheckIn?: string | undefined;
  overtimeCheckOut?: string | undefined;
  status: 'ok' | 'error' | 'warning';
  message: string;
  error?: string | undefined;
  rawData: unknown[];
};

// ============================================
// AUDIT LOG TYPES
// ============================================
export type LogChange = {
  field: string;
  oldValue: any;
  newValue: any;
  description?: string;
};

export type LogEntry = {
  systemId: string;
  id: string;
  timestamp: string;
  entityType: 'PurchaseOrder' | 'Warranty' | 'Order' | 'Voucher';
  entityId: string;
  userId: string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'CANCEL';
  changes: LogChange[];
};

// ============================================
// LEAVE TYPES
// ============================================
export type LeaveStatus = "Chờ duyệt" | "Đã duyệt" | "Đã từ chối";

export type LeaveRequest = {
  systemId: SystemId;
  id: BusinessId;
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  employeeName: string;
  leaveTypeSystemId?: SystemId;
  leaveTypeId?: BusinessId;
  leaveTypeName: string;
  leaveTypeIsPaid?: boolean;
  leaveTypeRequiresAttachment?: boolean;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: LeaveStatus;
  requestDate: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  activityHistory?: HistoryEntry[];
};

// ============================================
// COMPLAINT TYPES
// ============================================
export type ComplaintType =
  | "wrong-product"
  | "missing-items"
  | "wrong-packaging"
  | "warehouse-defect"
  | "product-condition";

export type ComplaintStatus =
  | "pending"
  | "investigating"
  | "resolved"
  | "cancelled"
  | "ended";

export type ComplaintResolution =
  | "refund"
  | "return-shipping"
  | "advice-only"
  | "replacement"
  | "rejected";

export type ComplaintVerification =
  | "verified-correct"
  | "verified-incorrect"
  | "pending-verification";

export type ComplaintImage = {
  id: SystemId;
  url: string;
  uploadedBy: SystemId;
  uploadedAt: Date;
  description?: string;
  type: "initial" | "evidence";
};

export type ComplaintAction = {
  id: SystemId;
  actionType: 
    | "created" 
    | "assigned" 
    | "investigated" 
    | "verified" 
    | "verified-correct"
    | "verified-incorrect"
    | "resolved" 
    | "rejected" 
    | "cancelled"
    | "ended"
    | "reopened"
    | "status-changed"
    | "commented";
  performedBy: SystemId;
  performedAt: Date;
  note?: string;
  images?: string[];
  metadata?: Record<string, any>;
};

export type Complaint = {
  systemId: SystemId;
  id: BusinessId;
  publicTrackingCode?: string;
  orderSystemId: SystemId;
  orderCode?: string;
  orderValue?: number;
  branchSystemId: SystemId;
  branchName: string;
  customerSystemId: SystemId;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  type: ComplaintType;
  description: string;
  images: ComplaintImage[];
  employeeImages?: Array<{
    id: SystemId;
    url: string;
    uploadedBy: SystemId;
    uploadedAt: Date;
  }>;
  status: ComplaintStatus;
  verification: ComplaintVerification;
  resolution?: ComplaintResolution;
  createdBy: SystemId;
  createdAt: Date;
  assignedTo?: SystemId;
  assigneeName?: string;
  assignedAt?: Date;
  investigationNote?: string;
  evidenceImages?: string[];
  proposedSolution?: string;
  resolutionNote?: string;
  isVerifiedCorrect?: boolean;
  responsibleUserId?: SystemId;
  affectedProducts?: Array<{
    productSystemId: SystemId;
    productId: string;
    productName: string;
    unitPrice: number;
    quantityOrdered: number;
    quantityReceived: number;
    quantityMissing: number;
    quantityDefective: number;
    quantityExcess: number;
    issueType: 'excess' | 'missing' | 'defective' | 'other';
    note?: string;
    resolutionType?: 'refund' | 'replacement' | 'ignore';
  }>;
  inventoryAdjustment?: {
    adjusted: boolean;
    adjustedBy: SystemId;
    adjustedAt: Date;
    adjustmentNote: string;
    inventoryCheckSystemId?: SystemId;
    items: Array<{
      productSystemId: SystemId;
      productId: string;
      productName: string;
      quantityAdjusted: number;
      reason: string;
      branchSystemId: SystemId;
    }>;
  };
  cancelledPaymentsReceipts?: Array<{
    paymentReceiptSystemId: SystemId;
    paymentReceiptId: BusinessId;
    type: 'payment' | 'receipt';
    amount: number;
    cancelledAt: Date;
    cancelledBy: SystemId;
    cancelledReason: string;
  }>;
  inventoryHistory?: Array<{
    adjustedAt: Date;
    adjustedBy: SystemId;
    adjustmentType: 'initial' | 'reversed';
    reason: string;
    items: Array<{
      productSystemId: SystemId;
      productId: string;
      productName: string;
      quantityAdjusted: number;
      branchSystemId: SystemId;
    }>;
  }>;
  resolvedBy?: SystemId;
  resolvedAt?: Date;
  cancelledBy?: SystemId;
  cancelledAt?: Date;
  endedBy?: SystemId;
  endedAt?: Date;
  updatedAt: Date;
  priority: "low" | "medium" | "high" | "urgent";
  tags?: string[];
  timeline: ComplaintAction[];
  subtasks?: import('@/components/shared/subtask-list').Subtask[];
};

export const complaintTypeLabels: Record<ComplaintType, string> = {
  "wrong-product": "Sai hàng",
  "missing-items": "Thiếu hàng",
  "wrong-packaging": "Đóng gói sai quy cách",
  "warehouse-defect": "Trả hàng lỗi do kho",
  "product-condition": "Phàn nàn về tình trạng hàng",
};

export const complaintTypeColors: Record<ComplaintType, string> = {
  "wrong-product": "bg-red-500/10 text-red-700 border-red-200",
  "missing-items": "bg-orange-500/10 text-orange-700 border-orange-200",
  "wrong-packaging": "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  "warehouse-defect": "bg-purple-500/10 text-purple-700 border-purple-200",
  "product-condition": "bg-pink-500/10 text-pink-700 border-pink-200",
};

export const complaintStatusLabels: Record<ComplaintStatus, string> = {
  pending: "Chờ xử lý",
  investigating: "Đang kiểm tra",
  resolved: "Đã giải quyết",
  cancelled: "Đã hủy",
  ended: "Kết thúc",
};

export const complaintStatusColors: Record<ComplaintStatus, string> = {
  pending: "bg-gray-500/10 text-gray-700 border-gray-200",
  investigating: "bg-blue-500/10 text-blue-700 border-blue-200",
  resolved: "bg-green-500/10 text-green-700 border-green-200",
  cancelled: "bg-red-500/10 text-red-700 border-red-200",
  ended: "bg-purple-500/10 text-purple-700 border-purple-200",
};

export const complaintResolutionLabels: Record<ComplaintResolution, string> = {
  refund: "Trừ tiền vào đơn hàng",
  "return-shipping": "Gửi trả hàng (shop chịu phí)",
  "advice-only": "Tư vấn/Hỗ trợ",
  replacement: "Đổi sản phẩm",
  rejected: "Từ chối khiếu nại",
};

export const complaintVerificationLabels: Record<ComplaintVerification, string> = {
  "verified-correct": "Xác nhận đúng",
  "verified-incorrect": "Xác nhận sai",
  "pending-verification": "Chưa xác minh",
};

export const complaintVerificationColors: Record<ComplaintVerification, string> = {
  "verified-correct": "bg-red-500/10 text-red-700 border-red-200",
  "verified-incorrect": "bg-green-500/10 text-green-700 border-green-200",
  "pending-verification": "bg-gray-500/10 text-gray-700 border-gray-200",
};

export const complaintPriorityLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  urgent: "Khẩn cấp",
};

export const complaintPriorityColors = {
  low: "bg-gray-500/10 text-gray-700 border-gray-200",
  medium: "bg-blue-500/10 text-blue-700 border-blue-200",
  high: "bg-orange-500/10 text-orange-700 border-orange-200",
  urgent: "bg-red-500/10 text-red-700 border-red-200",
};

export function getComplaintTypeLabel(type: ComplaintType): string {
  return complaintTypeLabels[type];
}

export function getComplaintStatusLabel(status: ComplaintStatus): string {
  return complaintStatusLabels[status];
}

export function getComplaintResolutionLabel(resolution: ComplaintResolution): string {
  return complaintResolutionLabels[resolution];
}

// ============================================
// SETTINGS - BRANCH
// ============================================
export type Branch = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  address: string;
  phone: string;
  managerId?: SystemId | undefined;
  isDefault: boolean;
  addressLevel?: '2-level' | '3-level' | undefined;
  province?: string | undefined;
  provinceId?: string | undefined;
  district?: string | undefined;
  districtId?: number | undefined;
  ward?: string | undefined;
  wardCode?: string | undefined;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// SETTINGS - DEPARTMENT
// ============================================
export type Department = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  managerId?: SystemId | undefined;
  jobTitleIds: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// SETTINGS - JOB TITLE
// ============================================
export type JobTitle = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// SETTINGS - UNIT
// ============================================
export type Unit = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string;
  isDefault?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// SETTINGS - TAX
// ============================================
export type Tax = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  rate: number;
  isDefaultSale: boolean;
  isDefaultPurchase: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// SETTINGS - SALES CHANNEL
// ============================================
export type SalesChannel = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  isApplied: boolean;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// SETTINGS - TARGET GROUP
// ============================================
export type TargetGroup = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  isActive?: boolean;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// SETTINGS - PAYMENT METHOD
// ============================================
export type PaymentMethod = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  color?: string | undefined;
  icon?: string | undefined;
  description?: string | undefined;
  accountNumber?: string | undefined;
  accountName?: string | undefined;
  bankName?: string | undefined;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// SETTINGS - SHIPPING PARTNER
// ============================================
export type ShippingPartnerStatus = 'Đang hợp tác' | 'Ngừng hợp tác';

export type ShippingService = {
  systemId?: SystemId | undefined;
  id: string;
  name: string;
};

export type CredentialField = {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  type?: 'text' | 'password' | 'email' | undefined;
};

export type AdditionalService = {
  systemId?: SystemId | undefined;
  id: string;
  label: string;
  tooltip?: string | undefined;
  type?: 'checkbox' | 'radio' | 'select' | 'text' | 'number' | 'date' | undefined;
  options?: (string | { label: string; value: string })[] | undefined;
  placeholder?: string | undefined;
  buttonLabel?: string | undefined;
  disabled?: boolean | undefined;
  gridSpan?: 1 | 2 | undefined;
};

export type PartnerConfiguration = {
  credentialFields: CredentialField[];
  payerOptions: ('shop' | 'customer')[];
  additionalServices: AdditionalService[];
};

export type ShippingPartner = {
  systemId: SystemId;
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  phone: string;
  address: string;
  contactPerson?: string | undefined;
  status: ShippingPartnerStatus;
  services: ShippingService[];
  isConnected: boolean;
  config: PartnerConfiguration;
  credentials: Record<string, any>;
  configuration: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// SETTINGS - PROVINCES
// ============================================
export type Province = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

export type District = {
  systemId: SystemId;
  id: number;
  name: string;
  provinceId: BusinessId;
  provinceName?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

export type Ward = {
  systemId: SystemId;
  id: string;
  name: string;
  provinceId: BusinessId;
  provinceName?: string;
  districtId?: number;
  districtName?: string;
  level?: '2-level' | '3-level' | 'new' | 'old';
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// PENALTY TYPES
// ============================================
export type PenaltyStatus = 'Chưa thanh toán' | 'Đã thanh toán' | 'Đã hủy';
export type PenaltyCategory = 'complaint' | 'attendance' | 'performance' | 'other';

export type Penalty = {
  systemId: SystemId;
  id: BusinessId;
  employeeSystemId: SystemId;
  employeeName: string;
  reason: string;
  amount: number;
  issueDate: string;
  status: PenaltyStatus;
  issuerName: string;
  issuerSystemId?: SystemId;
  linkedComplaintSystemId?: SystemId;
  linkedOrderSystemId?: SystemId;
  penaltyTypeSystemId?: SystemId;
  penaltyTypeName?: string;
  category?: PenaltyCategory;
  deductedInPayrollId?: string;
  deductedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  activityHistory?: HistoryEntry[];
};

export type PenaltyType = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string;
  defaultAmount: number;
  category: PenaltyCategory;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

export const penaltyStatusLabels: Record<PenaltyStatus, string> = {
  'Chưa thanh toán': 'Chưa thanh toán',
  'Đã thanh toán': 'Đã thanh toán',
  'Đã hủy': 'Đã hủy',
};

export const penaltyStatusColors: Record<PenaltyStatus, string> = {
  'Chưa thanh toán': 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  'Đã thanh toán': 'bg-green-500/10 text-green-700 border-green-200',
  'Đã hủy': 'bg-gray-500/10 text-gray-700 border-gray-200',
};

export const penaltyCategoryLabels: Record<PenaltyCategory, string> = {
  complaint: 'Khiếu nại',
  attendance: 'Chấm công',
  performance: 'Hiệu suất',
  other: 'Khác',
};

export const penaltyCategoryColors: Record<PenaltyCategory, string> = {
  complaint: 'bg-red-500/10 text-red-700 border-red-200',
  attendance: 'bg-orange-500/10 text-orange-700 border-orange-200',
  performance: 'bg-blue-500/10 text-blue-700 border-blue-200',
  other: 'bg-gray-500/10 text-gray-700 border-gray-200',
};

// ============================================
// INVENTORY SETTINGS
// ============================================

export type ProductTypeSettings = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string | undefined;
  isDefault?: boolean | undefined;
  isActive?: boolean | undefined;
  isDeleted?: boolean | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type ProductCategory = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  slug?: string | undefined;
  seoTitle?: string | undefined;
  metaDescription?: string | undefined;
  seoKeywords?: string | undefined;
  shortDescription?: string | undefined;
  longDescription?: string | undefined;
  websiteSeo?: MultiWebsiteSeo | undefined;
  parentId?: SystemId | undefined;
  path?: string | undefined;
  level?: number | undefined;
  color?: string | undefined;
  icon?: string | undefined;
  thumbnailImage?: string | undefined;
  sortOrder?: number | undefined;
  isActive?: boolean | undefined;
  isDeleted?: boolean | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type Brand = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string | undefined;
  website?: string | undefined;
  logo?: string | undefined;
  seoTitle?: string | undefined;
  metaDescription?: string | undefined;
  seoKeywords?: string | undefined;
  shortDescription?: string | undefined;
  longDescription?: string | undefined;
  websiteSeo?: MultiWebsiteSeo | undefined;
  isActive?: boolean | undefined;
  isDeleted?: boolean | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type Importer = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  address?: string | undefined;
  origin?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  taxCode?: string | undefined;
  usageGuide?: string | undefined;
  isDefault?: boolean | undefined;
  isActive?: boolean | undefined;
  isDeleted?: boolean | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

// ============================================
// PRICING POLICY
// ============================================
export type PricingPolicy = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string | undefined;
  type: 'Nhập hàng' | 'Bán hàng';
  isDefault: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

export type BasePricingSetting = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string | undefined;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};

// ============================================
// SETTINGS - CUSTOMERS
// ============================================

// Common base interface for all setting types
export interface CustomerSettingBase {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
}

// 1. Loại khách hàng (Customer Type)
export interface CustomerType extends CustomerSettingBase {
  isDefault?: boolean;
}

// 2. Nhóm khách hàng (Customer Group)
export interface CustomerGroup extends CustomerSettingBase {
  color?: string;
  defaultCreditLimit?: number;
  defaultPriceListId?: string;
  isDefault?: boolean;
}

// 3. Nguồn khách hàng (Customer Source)
export interface CustomerSource extends CustomerSettingBase {
  type?: 'Online' | 'Offline' | 'Referral' | 'Other';
  isDefault?: boolean;
}

// 4. Hạn thanh toán (Payment Term)
export interface PaymentTerm extends CustomerSettingBase {
  days: number;
  isDefault?: boolean;
}

// 5. Xếp hạng tín dụng (Credit Rating)
export interface CreditRating extends CustomerSettingBase {
  level: number;
  maxCreditLimit?: number;
  color?: string;
  isDefault?: boolean;
}

// 6. Giai đoạn vòng đời (Lifecycle Stage)
export interface LifecycleStage extends CustomerSettingBase {
  color?: string;
  orderIndex?: number;
  probability?: number;
  isDefault?: boolean;
}

// 7. Cài đặt SLA Khách hàng (Customer SLA Settings)
export type CustomerSlaType = 'follow-up' | 're-engagement' | 'debt-payment';

export interface CustomerSlaSetting extends CustomerSettingBase {
  slaType: CustomerSlaType;
  targetDays: number;
  warningDays: number;
  criticalDays: number;
  color: string;
}

// Form data types
export type CustomerTypeFormData = Omit<CustomerType, 'id' | 'createdAt' | 'updatedAt'>;
export type CustomerGroupFormData = Omit<CustomerGroup, 'id' | 'createdAt' | 'updatedAt'>;
export type CustomerSourceFormData = Omit<CustomerSource, 'id' | 'createdAt' | 'updatedAt'>;
export type PaymentTermFormData = Omit<PaymentTerm, 'id' | 'createdAt' | 'updatedAt'>;
export type CreditRatingFormData = Omit<CreditRating, 'id' | 'createdAt' | 'updatedAt'>;
export type LifecycleStageFormData = Omit<LifecycleStage, 'id' | 'createdAt' | 'updatedAt'>;
export type CustomerSlaSettingFormData = Omit<CustomerSlaSetting, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// SETTINGS - EMPLOYEES
// ============================================

type EmployeeAuditFields = {
  createdAt?: string;
  createdBy?: SystemId;
  updatedAt?: string;
  updatedBy?: SystemId;
};

export type WorkShift = EmployeeAuditFields & {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes?: number;
  description?: string;
  applicableDepartmentSystemIds: SystemId[];
};

export type LeaveType = EmployeeAuditFields & {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  numberOfDays: number;
  isPaid: boolean;
  requiresAttachment: boolean;
  applicableGender: 'All' | 'Male' | 'Female';
  applicableDepartmentSystemIds: SystemId[];
};

export type SalaryComponentCategory = 'earning' | 'deduction' | 'contribution';

export type SalaryComponent = EmployeeAuditFields & {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string;
  category: SalaryComponentCategory;
  type: 'fixed' | 'formula';
  amount?: number;
  formula?: string;
  taxable: boolean;
  partOfSocialInsurance: boolean;
  isActive: boolean;
  sortOrder: number;
  applicableDepartmentSystemIds: SystemId[];
};

export type InsuranceRates = {
  socialInsurance: {
    employeeRate: number;
    employerRate: number;
  };
  healthInsurance: {
    employeeRate: number;
    employerRate: number;
  };
  unemploymentInsurance: {
    employeeRate: number;
    employerRate: number;
  };
  insuranceSalaryCap: number;
  baseSalaryReference: number;
};

export type TaxBracket = {
  fromAmount: number;
  toAmount: number | null;
  rate: number;
};

export type TaxSettings = {
  personalDeduction: number;
  dependentDeduction: number;
  taxBrackets: TaxBracket[];
};

export type MinimumWageByRegion = {
  region1: number;
  region2: number;
  region3: number;
  region4: number;
};

export type LatePenaltyTier = {
  fromMinutes: number;
  toMinutes: number | null;
  amount: number;
};

export type EmployeeSettings = {
  workStartTime: string;
  workEndTime: string;
  lunchBreakDuration: number;
  lunchBreakStart: string;
  lunchBreakEnd: string;
  workingDays: number[];
  workShifts: WorkShift[];
  otHourlyRate: number;
  otRateWeekend: number;
  otRateHoliday: number;
  allowedLateMinutes: number;
  latePenaltyTiers: LatePenaltyTier[];
  earlyLeavePenaltyTiers: LatePenaltyTier[];
  leaveTypes: LeaveType[];
  baseAnnualLeaveDays: number;
  annualLeaveSeniorityBonus: {
    years: number;
    additionalDays: number;
  };
  allowRollover: boolean;
  rolloverExpirationDate: string;
  salaryComponents: SalaryComponent[];
  payrollCycle: 'monthly' | 'weekly' | 'bi-weekly';
  payday: number;
  payrollLockDate: number;
  insuranceRates: InsuranceRates;
  taxSettings: TaxSettings;
  minimumWage: MinimumWageByRegion;
  standardWorkDays: number;
  mealAllowancePerDay: number;
};

// ============================================
// SETTINGS - INVENTORY
// ============================================

export interface ProductSlaSettings {
  defaultReorderLevel?: number | undefined;
  defaultSafetyStock?: number | undefined;
  defaultMaxStock?: number | undefined;
  deadStockDays?: number | undefined;
  slowMovingDays?: number | undefined;
  enableEmailAlerts?: boolean | undefined;
  alertEmailRecipients?: string[] | undefined;
  alertFrequency?: 'daily' | 'weekly' | 'realtime' | undefined;
  showOnDashboard?: boolean | undefined;
  dashboardAlertTypes?: ('out_of_stock' | 'low_stock' | 'below_safety' | 'over_stock' | 'dead_stock')[] | undefined;
}

export type LogisticsPreset = {
  weight?: number | undefined;
  weightUnit?: 'g' | 'kg' | undefined;
  length?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
};

export interface ProductLogisticsSettings {
  physicalDefaults: LogisticsPreset;
  comboDefaults: LogisticsPreset;
}

// ============================================
// SETTINGS - PRINTER
// ============================================

export type TemplateType = 
  | 'order' 
  | 'receipt' 
  | 'payment' 
  | 'warranty' 
  | 'inventory-check' 
  | 'stock-transfer'
  | 'sales-return'
  | 'purchase-order'
  | 'packing'
  | 'quote'
  | 'delivery'
  | 'shipping-label'
  | 'product-label'
  | 'stock-in'
  | 'supplier-return'
  | 'complaint'
  | 'penalty'
  | 'leave'
  | 'cost-adjustment'
  | 'handover'
  | 'payroll'
  | 'payslip'
  | 'attendance';

export type PaperSize = 'A4' | 'A5' | 'A6' | 'K80' | 'K57';

export interface PrintTemplate {
  id: string;
  type: TemplateType;
  name: string;
  content: string;
  paperSize: PaperSize;
  isActive: boolean;
  updatedAt: string;
}

export interface TemplateVariable {
  key: string;
  label: string;
  description?: string;
  group?: string;
}

export const TEMPLATE_TYPES: { value: TemplateType; label: string }[] = [
  { value: 'order', label: 'Đơn bán hàng' },
  { value: 'quote', label: 'Phiếu đơn tạm tính' },
  { value: 'sales-return', label: 'Đơn đổi trả hàng' },
  { value: 'packing', label: 'Phiếu đóng gói' },
  { value: 'delivery', label: 'Phiếu giao hàng' },
  { value: 'shipping-label', label: 'Nhãn giao hàng' },
  { value: 'product-label', label: 'Tem phụ sản phẩm' },
  { value: 'purchase-order', label: 'Đơn đặt hàng nhập' },
  { value: 'stock-in', label: 'Phiếu nhập kho' },
  { value: 'stock-transfer', label: 'Phiếu chuyển kho' },
  { value: 'inventory-check', label: 'Phiếu kiểm kho' },
  { value: 'cost-adjustment', label: 'Phiếu điều chỉnh giá vốn' },
  { value: 'receipt', label: 'Phiếu thu' },
  { value: 'payment', label: 'Phiếu chi' },
  { value: 'warranty', label: 'Phiếu bảo hành' },
  { value: 'supplier-return', label: 'Phiếu trả hàng NCC' },
  { value: 'complaint', label: 'Phiếu khiếu nại' },
  { value: 'penalty', label: 'Phiếu phạt' },
  { value: 'payroll', label: 'Bảng lương' },
  { value: 'payslip', label: 'Phiếu lương' },
  { value: 'attendance', label: 'Bảng chấm công' },
];

export const PAPER_SIZES: { value: PaperSize; label: string }[] = [
  { value: 'A4', label: 'Khổ A4' },
  { value: 'A5', label: 'Khổ A5' },
  { value: 'A6', label: 'Khổ A6' },
  { value: 'K80', label: 'Khổ K80 (Máy in nhiệt)' },
  { value: 'K57', label: 'Khổ K57 (Máy in nhiệt nhỏ)' },
];

// ============================================
// SETTINGS - WEBSITES
// ============================================

export type WebsiteCode = 'pkgx' | 'trendtech' | string;

export interface WebsiteDefinition {
  code: WebsiteCode;
  name: string;
  shortName: string;
  description?: string;
  baseUrl: string;
  adminUrl?: string;
  apiUrl?: string;
  platform?: 'ecshop' | 'wordpress' | 'shopify' | 'custom';
  isActive: boolean;
  sortOrder: number;
  logo?: string;
  color?: string;
  features?: {
    syncProducts?: boolean;
    syncCategories?: boolean;
    syncBrands?: boolean;
    syncInventory?: boolean;
    syncPrices?: boolean;
    syncSeo?: boolean;
    uploadImages?: boolean;
  };
}

export const PREDEFINED_WEBSITES: WebsiteDefinition[] = [
  {
    code: 'pkgx',
    name: 'Phụ kiện giá xưởng',
    shortName: 'PKGX',
    description: 'Website phukiengiaxuong.com.vn',
    baseUrl: 'https://phukiengiaxuong.com.vn',
    adminUrl: 'https://phukiengiaxuong.com.vn/admin',
    apiUrl: 'https://phukiengiaxuong.com.vn/admin/api_product_hrm_v1.php',
    platform: 'ecshop',
    isActive: true,
    sortOrder: 1,
    color: '#ef4444',
    features: {
      syncProducts: true,
      syncCategories: true,
      syncBrands: true,
      syncInventory: true,
      syncPrices: true,
      syncSeo: true,
      uploadImages: true,
    },
  },
  {
    code: 'trendtech',
    name: 'Trendtech',
    shortName: 'Trendtech',
    description: 'Website Trendtech (sắp ra mắt)',
    baseUrl: '',
    platform: 'custom',
    isActive: true,
    sortOrder: 2,
    color: '#3b82f6',
    features: {
      syncProducts: true,
      syncCategories: true,
      syncBrands: true,
      syncInventory: true,
      syncPrices: true,
      syncSeo: true,
      uploadImages: true,
    },
  },
];

export function getWebsiteByCode(code: WebsiteCode): WebsiteDefinition | undefined {
  return PREDEFINED_WEBSITES.find(w => w.code === code);
}

export function getActiveWebsites(): WebsiteDefinition[] {
  return PREDEFINED_WEBSITES.filter(w => w.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getWebsiteName(code: WebsiteCode): string {
  const website = getWebsiteByCode(code);
  return website?.name || code.toUpperCase();
}

export function getWebsiteColor(code: WebsiteCode): string {
  const website = getWebsiteByCode(code);
  return website?.color || '#6b7280';
}

// ============================================
// SETTINGS - PKGX
// ============================================

export type PkgxCategory = {
  id: number;
  name: string;
  parentId?: number;
  sortOrder?: number;
  isShow?: number;
  cat_desc?: string;
  long_desc?: string;
  keywords?: string;
  meta_title?: string;
  meta_desc?: string;
  cat_alias?: string;
  style?: string;
  grade?: number;
  filter_attr?: string;
};

export type PkgxBrand = {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  siteUrl?: string;
  sortOrder?: number;
  isShow?: number;
  keywords?: string;
  metaTitle?: string;
  metaDesc?: string;
  shortDescription?: string;
  longDescription?: string;
  brand_logo?: string;
  brand_desc?: string;
  site_url?: string;
  sort_order?: number;
};

export type PkgxGalleryImage = {
  img_id: number;
  goods_id: number;
  img_url: string;
  thumb_url: string;
  img_desc?: string;
  img_original?: string;
};

export type PkgxCategoryMapping = {
  id: string;
  hrmCategorySystemId: SystemId;
  hrmCategoryName: string;
  pkgxCatId: number;
  pkgxCatName: string;
};

export type PkgxBrandMapping = {
  id: string;
  hrmBrandSystemId: SystemId;
  hrmBrandName: string;
  pkgxBrandId: number;
  pkgxBrandName: string;
};

export type PkgxPriceMapping = {
  shopPrice: SystemId | null;
  marketPrice: SystemId | null;
  partnerPrice: SystemId | null;
  acePrice: SystemId | null;
  dealPrice: SystemId | null;
};

// Pkgx API Types
export type PkgxProduct = {
  goods_id: number;
  goods_name: string;
  goods_sn: string;
  cat_id: number;
  brand_id: number;
  shop_price: number;
  market_price: number;
  partner_price: number;
  ace_price: number;
  deal_price: number;
  goods_img: string;
  goods_thumb: string;
  original_img: string;
  goods_desc: string;
  goods_brief: string;
  add_time: number;
  last_update: number;
  is_delete: number;
  is_on_sale: number;
  is_best: number;
  is_new: number;
  is_hot: number;
  sort_order: number;
  warn_number: number;
  goods_number: number;
  cat_name?: string;
  brand_name?: string;
};

export type PkgxProductsResponse = {
  error: boolean;
  message: string;
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
  data: PkgxProduct[];
};

export type PkgxImageUploadResponse = {
  error: boolean;
  message: string;
  data: {
    img_url: string;
    thumb_url: string;
    original_url: string;
    img_desc: string;
    goods_img: string;
    goods_thumb: string;
    original_img: string;
  };
};

export type PkgxCategoryFromApi = {
  cat_id: number;
  cat_name: string;
  parent_id: number;
  cat_desc?: string;
  long_desc?: string;
  sort_order: number;
  keywords?: string;
  cat_title?: string;
  meta_title?: string;
  meta_desc?: string;
  cat_alias?: string;
  style?: string;
  grade?: number;
  filter_attr?: string;
  is_leaf?: number;
  show_in_nav?: number;
  is_show?: number;
};

export type PkgxCategoriesResponse = {
  error: boolean;
  message: string;
  total: number;
  data: PkgxCategoryFromApi[];
};

export type PkgxBrandFromApi = {
  brand_id: number;
  brand_name: string;
  brand_logo?: string;
  brand_desc?: string;
  short_desc?: string;
  long_desc?: string;
  keywords?: string;
  meta_title?: string;
  meta_desc?: string;
  site_url?: string;
  sort_order: number;
  is_show?: number;
  brand_alias?: string;
  brand_keywords?: string;
  brand_title?: string;
};

export type PkgxBrandsResponse = {
  error: boolean;
  message: string;
  total: number;
  data: PkgxBrandFromApi[];
};

export type PkgxGalleryResponse = {
  error: boolean;
  message: string;
  goods_id: number;
  total: number;
  data: PkgxGalleryImage[];
};

export type PkgxProductPayload = {
  goods_name?: string;
  goods_sn?: string;
  cat_id?: number;
  brand_id?: number;
  shop_price?: number;
  market_price?: number;
  partner_price?: number;
  ace_price?: number;
  deal_price?: number;
  goods_img?: string;
  goods_thumb?: string;
  original_img?: string;
  goods_desc?: string;
  goods_brief?: string;
  is_on_sale?: number;
  is_best?: number;
  is_new?: number;
  is_hot?: number;
  sort_order?: number;
  warn_number?: number;
  goods_number?: number;
  keywords?: string;
};

// Pkgx Sync Settings Types
export type PkgxSyncSettings = {
  autoSyncEnabled: boolean;
  intervalMinutes: number;
  syncInventory: boolean;
  syncPrice: boolean;
  syncSeo: boolean;
  syncOnProductUpdate: boolean;
  notifyOnError: boolean;
};

export type PkgxSyncLog = {
  id: string;
  timestamp: string;
  action: 
    | 'test_connection'
    | 'ping'
    | 'sync_all'
    | 'sync_price'
    | 'sync_inventory'
    | 'sync_seo'
    | 'sync_description'
    | 'sync_flags'
    | 'sync_basic'
    | 'sync_basic_info'
    | 'sync_images'
    | 'create_product'
    | 'update_product'
    | 'link_product'
    | 'unlink_product'
    | 'unlink_mapping'
    | 'batch_unlink'
    | 'bulk_sync_all'
    | 'bulk_sync_basic'
    | 'bulk_sync_price'
    | 'bulk_sync_inventory'
    | 'bulk_sync_seo'
    | 'bulk_sync_description'
    | 'bulk_sync_flags'
    | 'bulk_sync_images'
    | 'sync_categories'
    | 'sync_brands'
    | 'get_products'
    | 'upload_image'
    | 'save_config'
    | 'save_mapping';
  status: 'success' | 'error' | 'partial' | 'info';
  message: string;
  userId?: string;
  userName?: string;
  details?: {
    url?: string;
    method?: string;
    responseTime?: number;
    httpStatus?: number;
    total?: number;
    success?: number;
    failed?: number;
    productId?: string;
    productName?: string;
    pkgxId?: number;
    inventory?: number;
    categoryId?: number;
    brandId?: number;
    error?: string;
    errorCode?: string;
  };
};

export type PkgxSyncResult = {
  status: 'success' | 'partial' | 'error';
  total: number;
  success: number;
  failed: number;
  errors?: string[];
};

export type PkgxSettings = {
  apiUrl: string;
  apiKey: string;
  enabled: boolean;
  categories: PkgxCategory[];
  brands: PkgxBrand[];
  priceMapping: PkgxPriceMapping;
  categoryMappings: PkgxCategoryMapping[];
  brandMappings: PkgxBrandMapping[];
  syncSettings: PkgxSyncSettings;
  lastSyncAt?: string;
  lastSyncResult?: PkgxSyncResult;
  connectionStatus?: 'connected' | 'disconnected' | 'error';
  connectionError?: string;
  logs: PkgxSyncLog[];
  pkgxProducts: PkgxProduct[];
  pkgxProductsLastFetch?: string;
};

export const DEFAULT_PKGX_SETTINGS: PkgxSettings = {
  apiUrl: '',
  apiKey: '',
  enabled: false,
  categories: [],
  brands: [],
  priceMapping: {
    shopPrice: null,
    marketPrice: null,
    partnerPrice: null,
    acePrice: null,
    dealPrice: null,
  },
  categoryMappings: [],
  brandMappings: [],
  syncSettings: {
    autoSyncEnabled: false,
    intervalMinutes: 60,
    syncInventory: true,
    syncPrice: true,
    syncSeo: false,
    syncOnProductUpdate: false,
    notifyOnError: true,
  },
  logs: [],
  pkgxProducts: [],
  pkgxProductsLastFetch: undefined,
};

export const SYNC_INTERVAL_OPTIONS = [
  { value: 15, label: '15 phút' },
  { value: 30, label: '30 phút' },
  { value: 60, label: '1 giờ' },
  { value: 120, label: '2 giờ' },
  { value: 240, label: '4 giờ' },
];

// ============================================
// ORDERS - SHIPPING TYPES
// ============================================

export type DeliveryMethod = 
  | 'shipping-partner'
  | 'external'
  | 'pickup'
  | 'deliver-later';

export interface OrderShippingService {
  partnerId: string;
  partnerCode: string;
  partnerName: string;
  accountSystemId: string;
  serviceId: string;
  serviceName: string;
  fee: number;
  estimatedDays: string;
  expectedDeliveryDate?: string;
  note?: string;
}

export interface ShippingCalculationRequest {
  fromProvinceId: number;
  fromDistrictId: number;
  fromWardCode?: string | undefined;
  fromAddress?: string | undefined;
  fromProvince?: string | undefined;
  fromDistrict?: string | undefined;
  toProvinceId: number;
  toDistrictId: number;
  toWardCode?: string | undefined;
  toWard?: string | undefined;
  toAddress: string;
  toProvince?: string | undefined;
  toDistrict?: string | undefined;
  weight: number;
  length?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  codAmount?: number | undefined;
  insuranceValue?: number | undefined;
  options?: {
    transport?: 'road' | 'fly' | undefined;
    tags?: number[] | undefined;
    pickWorkShift?: 1 | 2 | undefined;
    deliverWorkShift?: 1 | 2 | undefined;
    orderValue?: number | undefined;
    pickAddressId?: string | undefined;
    specificAddress?: string | undefined;
  } | undefined;
}

export interface ShippingCalculationResult {
  partnerId: string;
  partnerCode: string;
  partnerName: string;
  accountSystemId: string;
  status: 'loading' | 'success' | 'error';
  services: OrderShippingService[];
  error?: string | undefined;
}

export interface SelectedShippingConfig {
  service: OrderShippingService;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  pickupAddressId: string | undefined;
  deliveryAddress: ShippingAddressInfo | null | undefined;
  options: ShippingOptions | undefined;
}

export interface ShippingAddressInfo {
  name: string;
  phone: string;
  address: string;
  province: string;
  provinceId: number;
  district: string;
  districtId: number;
  ward?: string;
  wardCode?: string;
}

export interface PackageInfo {
  weight: number;
  weightUnit?: 'gram' | 'kilogram';
  length: number;
  width: number;
  height: number;
  codAmount: number;
  insuranceValue?: number;
}

export interface ShippingCacheKey {
  fromDistrictId: number;
  toDistrictId: number;
  weight: number;
  codAmount: number;
}

export interface ShippingOptions {
  insurance?: boolean | undefined;
  cod?: number | undefined;
  payer?: 'SHOP' | 'CUSTOMER' | undefined;
  requirement?: string | undefined;
  note?: string | undefined;
  partialDelivery?: boolean | undefined;
  collectFeedback?: boolean | undefined;
  collectOnFailure?: boolean | undefined;
  pickupMethod?: 'AT_WAREHOUSE' | 'AT_POST_OFFICE' | undefined;
  transport?: 'road' | 'fly' | undefined;
  pickWorkShift?: 1 | 2 | undefined;
  deliverWorkShift?: 1 | 2 | undefined;
  pickOption?: 'cod' | 'post' | undefined;
  pickAddressId?: string | undefined;
  specificAddress?: string | undefined;
  pickDate?: string | undefined;
  deliverDate?: string | undefined;
  useReturnAddress?: 0 | 1 | undefined;
  returnAddress?: string | undefined;
  returnProvince?: string | undefined;
  returnProvinceId?: number | undefined;
  returnDistrict?: string | undefined;
  returnDistrictId?: number | undefined;
  returnWard?: string | undefined;
  returnWardId?: string | undefined;
  returnName?: string | undefined;
  returnTel?: string | undefined;
  orderValue?: number | undefined;
  totalBox?: number | undefined;
  tags?: number[] | undefined;
  subTags?: number[] | undefined;
  failedDeliveryFee?: number | undefined;
  transportType?: 'road' | 'fly' | undefined;
  ghtkTags?: number[] | undefined;
  expectedDelivery?: string | undefined;
  schedulePickup?: string | undefined;
  pickupAtPostOffice?: boolean | undefined;
  inspection?: boolean | undefined;
  intactPackage?: boolean | undefined;
  partialReturn?: boolean | undefined;
  cancelFee?: boolean | undefined;
  freshFood?: boolean | undefined;
  highValueRequirement?: boolean | undefined;
  fragileItem?: boolean | undefined;
  bulkyItem?: boolean | undefined;
  callOnIssue?: boolean | undefined;
  noXRay?: boolean | undefined;
  deliverAtBranch?: boolean | undefined;
  highValue?: boolean | undefined;
  coldChain?: boolean | undefined;
  returnOutbound?: boolean | undefined;
  returnInbound?: boolean | undefined;
  returnBothWays?: boolean | undefined;
  deliverInPerson?: boolean | undefined;
  tryBeforeBuy?: boolean | undefined;
  rejectFee?: boolean | undefined;
}

// ============================================
// CUSTOMERS - SLA TYPES
// ============================================

export type SlaAlertLevel = 'normal' | 'warning' | 'critical' | 'overdue';

export interface CustomerSlaAlert {
  systemId: SystemId;
  customer: Customer;
  slaType: CustomerSlaType;
  slaName: string;
  daysRemaining: number;
  alertLevel: SlaAlertLevel;
  targetDate: string;
  lastActivityDate?: string;
  assignee?: string;
}

export interface DebtAlert {
  systemId: SystemId;
  customer: Customer;
  totalDebt: number;
  overdueAmount: number;
  daysOverdue: number;
  debtStatus: DebtStatus;
  oldestDueDate?: string;
}

export interface CustomerHealthAlert {
  systemId: SystemId;
  customer: Customer;
  healthScore: number;
  churnRisk: 'low' | 'medium' | 'high';
  segment?: string;
  daysSinceLastPurchase: number;
  totalOrders: number;
  totalSpent: number;
}

export interface CustomerSlaIndexEntry {
  customer: Customer;
  alerts: CustomerSlaAlert[];
  debtAlert?: DebtAlert;
  healthAlert?: CustomerHealthAlert;
}

export interface CustomerSlaIndex {
  entries: Record<SystemId, CustomerSlaIndexEntry>;
  followUpAlerts: CustomerSlaAlert[];
  reEngagementAlerts: CustomerSlaAlert[];
  debtAlerts: DebtAlert[];
  healthAlerts: CustomerHealthAlert[];
}

export interface SlaReportSummary {
  totalCustomers: number;
  followUpAlerts: number;
  reEngagementAlerts: number;
  debtAlerts: number;
  healthAlerts: number;
  criticalCount: number;
  _lastAckAt?: string;
}

export type SlaActionType = 'acknowledged' | 'snoozed' | 'resolved' | 'escalated';

export interface CustomerSlaAcknowledgement {
  slaType: CustomerSlaType;
  targetDate: string;
  acknowledgedAt: string;
  actionType: SlaActionType;
  snoozeUntil?: string;
  notes?: string;
}

export interface SlaActivityLog {
  id: string;
  customerId: SystemId;
  slaType: CustomerSlaType;
  actionType: SlaActionType;
  performedAt: string;
  performedBy?: string;
  notes?: string;
  previousState?: {
    daysRemaining: number;
    alertLevel: SlaAlertLevel;
  };
}

export type CustomerSlaAckMap = Record<SystemId, Partial<Record<CustomerSlaType, CustomerSlaAcknowledgement>>>;

// ============================================
// REPORTS - BUSINESS ACTIVITY
// ============================================

export type ReportType = 
  | 'sales'
  | 'delivery'
  | 'returns'
  | 'payments'
  | 'statistics';

export type GroupByOption = 
  | 'time'
  | 'employee'
  | 'product'
  | 'order'
  | 'branch'
  | 'source'
  | 'customer'
  | 'customer-group'
  | 'shipment'
  | 'carrier'
  | 'channel'
  | 'payment-method';

export type TimeGrouping = 
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

export type ChartType = 
  | 'bar'
  | 'line'
  | 'area'
  | 'combo'
  | 'pie'
  | 'donut';

export interface ReportDateRange {
  from: string;
  to: string;
}

export interface ReportFilters {
  dateRange: ReportDateRange;
  reportType: ReportType;
  groupBy: GroupByOption;
  timeGrouping: TimeGrouping;
  branchIds?: SystemId[];
  employeeIds?: SystemId[];
  customerIds?: SystemId[];
  productIds?: SystemId[];
  categoryIds?: SystemId[];
  sourceIds?: string[];
  channelIds?: string[];
  paymentMethodIds?: string[];
  carrierIds?: SystemId[];
  orderStatuses?: string[];
  shipmentStatuses?: string[];
}

export interface SalesTimeReportRow {
  key: string;
  label: string;
  orderCount: number;
  productAmount: number;
  returnAmount: number;
  taxAmount: number;
  shippingFee: number;
  revenue: number;
  grossProfit: number;
}

// ============================================
// REPORTS - CUSTOMER SLA
// ============================================

export type CustomerSlaReportTab = 'follow-up' | 're-engagement' | 'debt' | 'health' | 'all';

// ============================================
// REPORTS - INVENTORY
// ============================================

export type InventoryReportRow = {
  systemId: string;
  productSystemId: string;
  productName: string;
  sku: string;
  branchName: string;
  branchSystemId: string;
  onHand: number;
  committed: number;
  available: number;
  inTransit: number;
  costPrice: number;
  isCombo: boolean;
  comboAvailable?: number;
  bottleneckProducts?: string[];
};

export type ProductTypeFilter = 'all' | 'single' | 'combo';

// ============================================
// REPORTS - PRODUCT SLA
// ============================================

export type StockAlertReportRow = {
  systemId: string;
  productSystemId: SystemId;
  productName: string;
  sku: string;
  alertType: 'out_of_stock' | 'low_stock' | 'below_safety' | 'over_stock';
  alertLabel: string;
  severity: 'critical' | 'warning' | 'info';
  totalOnHand: number;
  totalAvailable: number;
  reorderLevel: number | null;
  safetyStock: number | null;
  maxStock: number | null;
  suggestedOrder: number;
  costPrice: number;
  unit: string;
  primarySupplierName?: string;
  lastPurchaseDate?: string;
};

export type StockAlertFilter = 'all' | 'out_of_stock' | 'low_stock' | 'below_safety' | 'over_stock';

// ============================================
// REPORTS - SALES
// ============================================

export type OrderWithProfit = Order & {
  profit: number;
  costOfGoods: number;
};

// ============================================
// REPORTS - BUSINESS ACTIVITY TYPES
// ============================================

export interface SalesProductReportRow {
  productSystemId: SystemId;
  productName: string;
  productCode?: string;
  sku?: string;
  categoryName?: string;
  brandName?: string;
  
  quantitySold: number;
  quantityReturned: number;
  netQuantity: number;
  productAmount: number;
  returnAmount: number;
  revenue: number;
  grossProfit: number;
  averagePrice: number;
}

export interface SalesBranchReportRow {
  branchSystemId: SystemId;
  branchName: string;
  branchCode?: string;
  
  orderCount: number;
  customerCount: number;
  productAmount: number;
  returnAmount: number;
  taxAmount: number;
  shippingFee: number;
  revenue: number;
  grossProfit: number;
}

export interface ChartDataPoint {
  name: string;
  label?: string;
  [key: string]: string | number | undefined;
}

export interface ComboChartConfig {
  bars: {
    dataKey: string;
    name: string;
    color: string;
    stackId?: string;
  }[];
  lines: {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
  }[];
}

// Additional Sales Report Types
export interface SalesTimeReportRow {
  key: string;
  label: string;
  orderCount: number;
  productAmount: number;
  returnAmount: number;
  taxAmount: number;
  shippingFee: number;
  revenue: number;
  grossProfit: number;
  costOfGoods?: number;
  discount?: number;
}

export interface SalesEmployeeReportRow {
  employeeSystemId: SystemId;
  employeeName: string;
  employeeCode?: string;
  branchName?: string;
  orderCount: number;
  productAmount: number;
  returnAmount: number;
  revenue: number;
  grossProfit: number;
}

export interface SalesOrderReportRow {
  orderSystemId: SystemId;
  orderId: string;
  orderDate: string;
  customerSystemId?: SystemId;
  customerName?: string;
  employeeSystemId?: SystemId;
  employeeName?: string;
  branchSystemId?: SystemId;
  branchName?: string;
  status?: string;
  itemCount: number;
  productAmount: number;
  discountAmount: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;
  costOfGoods: number;
  grossProfit: number;
  paidAmount: number;
  debtAmount: number;
}

export interface SalesCustomerReportRow {
  customerSystemId: SystemId;
  customerName: string;
  customerCode?: string;
  customerPhone?: string;
  customerGroup?: string;
  orderCount: number;
  productAmount: number;
  returnAmount: number;
  taxAmount: number;
  shippingFee: number;
  revenue: number;
  grossProfit: number;
  averageOrderValue: number;
}

export interface SalesReportSummary {
  orderCount: number;
  productAmount: number;
  returnAmount: number;
  taxAmount: number;
  shippingFee: number;
  revenue: number;
  grossProfit: number;
}

// Alias for backward compatibility
export type ReportSummary = SlaReportSummary;

// ============================================
// REPORTS - TABS
// ============================================

export type ReportTab = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
};
