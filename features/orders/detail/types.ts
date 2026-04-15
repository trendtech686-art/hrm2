// OrderMainStatus removed - not used in this file
import type { SystemId } from '@/lib/id-types';
import type { Comment as CommentType } from '@/components/Comments';

export type OrderComment = CommentType<SystemId>;

export const statusVariants: Record<string, "success" | "default" | "secondary" | "warning" | "destructive" | "info"> = {
    "Đặt hàng": "info",
    "Đang giao dịch": "warning",
    "Hoàn thành": "success",
    "Đã hủy": "destructive",
    // Prisma enum values
    "PENDING": "info",
    "CONFIRMED": "info",
    "PROCESSING": "warning",
    "PACKING": "warning",
    "PACKED": "warning",
    "READY_FOR_PICKUP": "warning",
    "SHIPPING": "warning",
    "DELIVERED": "success",
    "COMPLETED": "success",
    "FAILED_DELIVERY": "destructive",
    "RETURNED": "destructive",
    "CANCELLED": "destructive",
};

export const productTypeFallbackLabels: Record<string, string> = {
    physical: 'Hàng hóa',
    service: 'Dịch vụ',
    digital: 'Sản phẩm số',
    combo: 'Combo',
};

// Helper functions
export const normalizeCurrencyValue = (value?: number) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 0;
    return Math.abs(value) < 0.005 ? 0 : value;
};

export const formatCurrency = (value?: number) => {
    const normalized = normalizeCurrencyValue(value);
    return new Intl.NumberFormat('vi-VN').format(normalized);
};

export const formatNumber = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

export const getCustomerAddress = (customer: { addresses?: Array<{ type?: string; isDefault?: boolean; street?: string; ward?: string; district?: string; province?: string }> }, type: 'shipping' | 'billing'): string => {
    if (!customer?.addresses || customer.addresses.length === 0) return '';
    
    // Find address by type, or use default if type not found
    let address = customer.addresses.find((addr) => addr.type === type);
    
    // Fallback to default address if specific type not found
    if (!address) {
        address = customer.addresses.find((addr) => addr.isDefault);
    }
    
    // Fallback to first address
    if (!address) {
        address = customer.addresses[0];
    }
    
    if (!address) return '';
    
    // Format: street, ward, district, province
    return [
        address.street,
        address.ward,
        address.district,
        address.province
    ].filter(Boolean).join(', ');
};

export interface PaymentFormValues {
  method: string;
  amount: number;
  reference?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
}
