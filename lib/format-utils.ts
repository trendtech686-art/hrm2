/**
 * Format bytes to human readable string
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @param locale - Locale for formatting (default: 'vi-VN')
 */
export function formatNumber(num: number, locale: string = 'vi-VN'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'VND')
 * @param locale - Locale for formatting (default: 'vi-VN')
 */
export function formatCurrency(amount: number, currency: string = 'VND', locale: string = 'vi-VN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format percentage
 * @param value - Value to format (0-1 or 0-100)
 * @param decimals - Number of decimal places (default: 2)
 * @param isAlreadyPercent - If true, value is already 0-100 (default: false)
 */
export function formatPercent(value: number, decimals: number = 2, isAlreadyPercent: boolean = false): string {
  const percent = isAlreadyPercent ? value : value * 100;
  return `${percent.toFixed(decimals)}%`;
}

/**
 * Format date to Vietnamese locale
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', options || {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format datetime to Vietnamese locale
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 */
export function formatDateTime(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('vi-VN', options || {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
