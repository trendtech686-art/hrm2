import type { Customer, DebtStatus, DebtTransaction } from './types';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, addDays, getDaysDiff, isDateBefore, toISODate } from '@/lib/date-utils';
/**
 * Tính ngày đến hạn dựa trên ngày đơn hàng và payment terms
 */
export const calculateDueDate = (orderDate: string, paymentTermsDays: number): string => {
  return toISODate(addDays(new Date(orderDate), paymentTermsDays));
};

/**
 * Parse payment terms string thành số ngày
 * "NET30" → 30, "NET15" → 15, "COD" → 0
 */
export const parsePaymentTerms = (paymentTerms?: string): number => {
  if (!paymentTerms) return 0;
  
  const match = paymentTerms.match(/NET(\d+)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  if (paymentTerms.toUpperCase() === 'COD') {
    return 0; // COD = thanh toán ngay
  }
  
  return 30; // Default 30 ngày
};

/**
 * Tính số ngày quá hạn (nếu > 0 thì quá hạn)
 */
export const calculateDaysOverdue = (dueDate: string): number => {
  const days = getDaysDiff(getCurrentDate(), new Date(dueDate));
  return days > 0 ? days : 0;
};

/**
 * Tính số ngày còn lại đến hạn (nếu > 0 thì chưa đến hạn)
 */
export const calculateDaysUntilDue = (dueDate: string): number => {
  return getDaysDiff(new Date(dueDate), getCurrentDate());
};

/**
 * Phân loại trạng thái công nợ dựa trên ngày đến hạn
 */
export const getDebtStatus = (dueDate: string, hasDebt: boolean): DebtStatus | null => {
  if (!hasDebt) return null;
  
  const daysUntilDue = calculateDaysUntilDue(dueDate);
  
  // Chưa đến hạn
  if (daysUntilDue > 3) return "Chưa đến hạn";
  
  // Sắp đến hạn (1-3 ngày)
  if (daysUntilDue >= 1 && daysUntilDue <= 3) return "Sắp đến hạn";
  
  // Đến hạn hôm nay
  if (daysUntilDue === 0) return "Đến hạn hôm nay";
  
  // Quá hạn
  const daysOverdue = Math.abs(daysUntilDue);
  
  if (daysOverdue >= 1 && daysOverdue <= 7) return "Quá hạn 1-7 ngày";
  if (daysOverdue >= 8 && daysOverdue <= 15) return "Quá hạn 8-15 ngày";
  if (daysOverdue >= 16 && daysOverdue <= 30) return "Quá hạn 16-30 ngày";
  
  return "Quá hạn > 30 ngày";
};

/**
 * Lấy variant cho badge trạng thái công nợ
 */
export const getDebtStatusVariant = (status?: DebtStatus | null): 
  'default' | 'secondary' | 'success' | 'warning' | 'destructive' => {
  if (!status) return 'secondary';
  
  switch (status) {
    case "Chưa đến hạn":
      return "secondary";
    case "Sắp đến hạn":
      return "default";
    case "Đến hạn hôm nay":
      return "warning";
    case "Quá hạn 1-7 ngày":
      return "warning";
    case "Quá hạn 8-15 ngày":
    case "Quá hạn 16-30 ngày":
    case "Quá hạn > 30 ngày":
      return "destructive";
    default:
      return "secondary";
  }
};

/**
 * Tính toán debt tracking info cho customer
 */
export const calculateDebtTrackingInfo = (customer: Customer): {
  oldestDebtDueDate?: string;
  maxDaysOverdue: number;
  debtStatus?: DebtStatus | null;
} => {
  const debtTransactions = customer.debtTransactions || [];
  const unpaidTransactions = debtTransactions.filter(t => !t.isPaid);
  
  if (unpaidTransactions.length === 0 || !customer.currentDebt || customer.currentDebt === 0) {
    return {
      maxDaysOverdue: 0,
      debtStatus: null
    };
  }
  
  // Tìm giao dịch có dueDate sớm nhất (nợ lâu nhất)
  const oldestTransaction = unpaidTransactions.reduce((oldest, current) => {
    return isDateBefore(new Date(current.dueDate), new Date(oldest.dueDate)) ? current : oldest;
  });
  
  const oldestDebtDueDate = oldestTransaction.dueDate;
  const maxDaysOverdue = calculateDaysOverdue(oldestDebtDueDate);
  const debtStatus = getDebtStatus(oldestDebtDueDate, true);
  
  return {
    oldestDebtDueDate,
    maxDaysOverdue,
    debtStatus
  };
};

/**
 * Lấy danh sách khách hàng có nợ quá hạn, sắp xếp theo mức độ ưu tiên
 */
export const getOverdueDebtCustomers = (customers: Customer[]): Customer[] => {
  return customers
    .filter(c => {
      const info = calculateDebtTrackingInfo(c);
      return info.maxDaysOverdue > 0; // Chỉ lấy KH quá hạn
    })
    .sort((a, b) => {
      const infoA = calculateDebtTrackingInfo(a);
      const infoB = calculateDebtTrackingInfo(b);
      
      // Sắp xếp theo số ngày quá hạn (giảm dần)
      return (infoB.maxDaysOverdue || 0) - (infoA.maxDaysOverdue || 0);
    });
};

/**
 * Lấy danh sách khách hàng sắp đến hạn thanh toán (1-3 ngày)
 */
export const getDueSoonCustomers = (customers: Customer[]): Customer[] => {
  return customers
    .filter(c => {
      const info = calculateDebtTrackingInfo(c);
      if (!info.oldestDebtDueDate) return false;
      
      const daysUntil = calculateDaysUntilDue(info.oldestDebtDueDate);
      return daysUntil >= 1 && daysUntil <= 3;
    })
    .sort((a, b) => {
      const infoA = calculateDebtTrackingInfo(a);
      const infoB = calculateDebtTrackingInfo(b);
      
      const daysA = infoA.oldestDebtDueDate ? calculateDaysUntilDue(infoA.oldestDebtDueDate) : 999;
      const daysB = infoB.oldestDebtDueDate ? calculateDaysUntilDue(infoB.oldestDebtDueDate) : 999;
      
      return daysA - daysB; // Sắp xếp theo ngày đến hạn (tăng dần)
    });
};

/**
 * Tính tổng công nợ quá hạn
 */
export const calculateTotalOverdueDebt = (customers: Customer[]): number => {
  return getOverdueDebtCustomers(customers).reduce((sum, c) => sum + (c.currentDebt || 0), 0);
};

/**
 * Tính tổng công nợ sắp đến hạn
 */
export const calculateTotalDueSoonDebt = (customers: Customer[]): number => {
  return getDueSoonCustomers(customers).reduce((sum, c) => sum + (c.currentDebt || 0), 0);
};

/**
 * Format ngày hiển thị
 */
export const formatDebtDate = (dateString?: string): string => {
  if (!dateString) return '-';
  return formatDate(dateString);
};

/**
 * Helper format currency
 */
export const formatCurrency = (value?: number): string => {
  if (typeof value !== 'number') return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
