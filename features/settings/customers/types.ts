// Common base interface for all setting types
export interface BaseSetting {
  systemId: string; // Internal unique ID for store (KHÔNG ĐỔI)
  id: string; // Mã hiển thị cho user (CÓ THỂ ĐỔI)
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 1. Loại khách hàng (Customer Type)
export interface CustomerType extends BaseSetting {
  // Có thể thêm fields đặc thù nếu cần
}

// 2. Nhóm khách hàng (Customer Group)
export interface CustomerGroup extends BaseSetting {
  color?: string; // Màu hiển thị
}

// 3. Nguồn khách hàng (Customer Source)
export interface CustomerSource extends BaseSetting {
  type?: 'Online' | 'Offline' | 'Referral' | 'Other'; // Phân loại nguồn
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
}

// Form data types (for validation)
export type CustomerTypeFormData = Omit<CustomerType, 'id' | 'createdAt' | 'updatedAt'>;
export type CustomerGroupFormData = Omit<CustomerGroup, 'id' | 'createdAt' | 'updatedAt'>;
export type CustomerSourceFormData = Omit<CustomerSource, 'id' | 'createdAt' | 'updatedAt'>;
export type PaymentTermFormData = Omit<PaymentTerm, 'id' | 'createdAt' | 'updatedAt'>;
export type CreditRatingFormData = Omit<CreditRating, 'id' | 'createdAt' | 'updatedAt'>;
