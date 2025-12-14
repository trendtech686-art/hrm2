/**
 * Print Mappers - Shared Types
 * Types và utilities dùng chung cho tất cả mappers
 */

export { 
  formatCurrency, 
  numberToWords, 
  formatDate, 
  formatTime,
  getStoreData,
} from '../print-service';

export type { 
  PrintData, 
  PrintLineItem, 
  StoreSettings
} from '../print-service';

/**
 * Helper: Ẩn 4 số giữa của SĐT
 * VD: 0912345678 -> 0912***678
 */
export const hidePhoneMiddle = (phone?: string): string => {
  if (!phone || phone.length < 8) return phone || '';
  return phone.slice(0, 4) + '***' + phone.slice(-3);
};

/**
 * Helper: Format ngày dạng chữ
 * VD: 05/12/2025 -> Ngày 05 tháng 12 năm 2025
 * Note: This is a specific Vietnamese text format, not using date-utils
 */
export const formatDateText = (date?: string | Date): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `Ngày ${day} tháng ${month} năm ${year}`;
};
