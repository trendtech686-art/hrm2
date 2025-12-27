import type { Customer } from '@/lib/types/prisma-extended';

export type CreditAlertLevel = 'safe' | 'warning' | 'danger' | 'exceeded';

/**
 * Tính mức độ cảnh báo công nợ
 */
export const getCreditAlertLevel = (customer: Customer): CreditAlertLevel => {
  const currentDebt = customer.currentDebt || 0;
  const maxDebt = customer.maxDebt || 0;
  
  // Nếu không có hạn mức hoặc hạn mức = 0, không cảnh báo
  if (maxDebt === 0) return 'safe';
  
  const debtRatio = (currentDebt / maxDebt) * 100;
  
  if (debtRatio >= 100) return 'exceeded';  // Vượt hạn mức
  if (debtRatio >= 90) return 'danger';     // >= 90%
  if (debtRatio >= 70) return 'warning';    // >= 70%
  return 'safe';                             // < 70%
};

/**
 * Lấy variant Badge cho credit alert
 */
export const getCreditAlertBadgeVariant = (level: CreditAlertLevel): 
  'default' | 'secondary' | 'success' | 'warning' | 'destructive' => {
  switch (level) {
    case 'exceeded':
    case 'danger':
      return 'destructive';
    case 'warning':
      return 'warning';
    case 'safe':
      return 'success';
    default:
      return 'secondary';
  }
};

/**
 * Lấy text cho credit alert
 */
export const getCreditAlertText = (level: CreditAlertLevel): string => {
  switch (level) {
    case 'exceeded':
      return 'Vượt hạn mức';
    case 'danger':
      return 'Sắp vượt hạn';
    case 'warning':
      return 'Cần theo dõi';
    case 'safe':
      return 'An toàn';
    default:
      return '';
  }
};

/**
 * Kiểm tra xem có thể tạo đơn hàng không (dựa vào công nợ)
 */
export const canCreateOrder = (customer: Customer, orderAmount: number): {
  allowed: boolean;
  reason?: string;
} => {
  const currentDebt = customer.currentDebt || 0;
  const maxDebt = customer.maxDebt || 0;
  
  // Nếu không cho phép công nợ và có công nợ hiện tại
  if (!customer.allowCredit && currentDebt > 0) {
    return {
      allowed: false,
      reason: 'Khách hàng không được phép công nợ và còn nợ cũ'
    };
  }
  
  // Nếu có hạn mức công nợ
  if (maxDebt > 0) {
    const newDebt = currentDebt + orderAmount;
    if (newDebt > maxDebt) {
      return {
        allowed: false,
        reason: `Đơn hàng này sẽ vượt hạn mức công nợ (${formatCurrency(newDebt)} / ${formatCurrency(maxDebt)})`
      };
    }
  }
  
  return { allowed: true };
};

/**
 * Lấy danh sách khách hàng có nguy cơ công nợ cao
 */
export const getHighRiskDebtCustomers = (customers: Customer[]): Customer[] => {
  return customers.filter(customer => {
    const level = getCreditAlertLevel(customer);
    return level === 'danger' || level === 'exceeded';
  }).sort((a, b) => {
    const ratioA = ((a.currentDebt || 0) / (a.maxDebt || 1)) * 100;
    const ratioB = ((b.currentDebt || 0) / (b.maxDebt || 1)) * 100;
    return ratioB - ratioA; // Sort by ratio descending
  });
};

/**
 * Helper format currency
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value);
};
