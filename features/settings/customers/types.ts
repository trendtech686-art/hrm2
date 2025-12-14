import { SystemId, BusinessId } from '../../../lib/id-types.ts';

// Common base interface for all setting types
export interface BaseSetting {
  systemId: SystemId; // Internal unique ID for store (KHÔNG ĐỔI)
  id: BusinessId; // Mã hiển thị cho user (CÓ THỂ ĐỔI)
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
}

// 1. Loại khách hàng (Customer Type)
export interface CustomerType extends BaseSetting {
  isDefault?: boolean; // Là loại khách hàng mặc định
}

// 2. Nhóm khách hàng (Customer Group)
export interface CustomerGroup extends BaseSetting {
  color?: string; // Màu hiển thị
  defaultCreditLimit?: number; // Hạn mức công nợ mặc định
  defaultPriceListId?: string; // Bảng giá áp dụng mặc định
  isDefault?: boolean; // Là nhóm khách hàng mặc định
}

// 3. Nguồn khách hàng (Customer Source)
export interface CustomerSource extends BaseSetting {
  type?: 'Online' | 'Offline' | 'Referral' | 'Other'; // Phân loại nguồn
  isDefault?: boolean; // Là nguồn khách hàng mặc định
}

// 4. Hạn thanh toán (Payment Term)
export interface PaymentTerm extends BaseSetting {
  days: number; // Số ngày thanh toán
  isDefault?: boolean; // Là hạn thanh toán mặc định
}

// 5. Xếp hạng tín dụng (Credit Rating)
export interface CreditRating extends BaseSetting {
  level: number; // Mức độ ưu tiên (1-5, 1 = cao nhất)
  maxCreditLimit?: number; // Hạn mức tín dụng tối đa cho rating này
  color?: string; // Màu hiển thị
  isDefault?: boolean; // Là xếp hạng tín dụng mặc định
}

// 6. Giai đoạn vòng đời (Lifecycle Stage)
export interface LifecycleStage extends BaseSetting {
  color?: string; // Màu hiển thị
  orderIndex?: number; // Thứ tự hiển thị
  probability?: number; // Xác suất chuyển đổi (%)
  isDefault?: boolean; // Là giai đoạn mặc định
}

// 7. Cài đặt SLA Khách hàng (Customer SLA Settings)
// Đơn giản hóa: mỗi loại chỉ có 1 record, không cần isDefault
export type CustomerSlaType = 'follow-up' | 're-engagement' | 'debt-payment';

export interface CustomerSlaSetting extends BaseSetting {
  slaType: CustomerSlaType;
  targetDays: number; // Số ngày mục tiêu
  warningDays: number; // Ngưỡng cảnh báo (trước target bao nhiêu ngày)
  criticalDays: number; // Ngưỡng nghiêm trọng (quá hạn bao nhiêu ngày)
  color: string; // Màu hiển thị
}

// Form data types (for validation)
export type CustomerTypeFormData = Omit<CustomerType, 'id' | 'createdAt' | 'updatedAt'>;
export type CustomerGroupFormData = Omit<CustomerGroup, 'id' | 'createdAt' | 'updatedAt'>;
export type CustomerSourceFormData = Omit<CustomerSource, 'id' | 'createdAt' | 'updatedAt'>;
export type PaymentTermFormData = Omit<PaymentTerm, 'id' | 'createdAt' | 'updatedAt'>;
export type CreditRatingFormData = Omit<CreditRating, 'id' | 'createdAt' | 'updatedAt'>;
export type LifecycleStageFormData = Omit<LifecycleStage, 'id' | 'createdAt' | 'updatedAt'>;
export type CustomerSlaSettingFormData = Omit<CustomerSlaSetting, 'id' | 'createdAt' | 'updatedAt'>;

