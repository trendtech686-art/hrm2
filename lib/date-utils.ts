/**
 * Date utility functions using date-fns
 * Replaces dayjs throughout the application
 * 
 * Reads timezone and time format from settings cache (loaded from database)
 * Falls back to localStorage for backward compatibility
 */

import {
  format as dateFnsFormat,
  parse as dateFnsParse,
  isValid,
  isSameDay,
  isSameMonth,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  addDays as dateFnsAddDays,
  subDays as dateFnsSubDays,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addMonths as dateFnsAddMonths,
  subMonths as dateFnsSubMonths,
  getDay,
  setDay,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { getGeneralSettingsSync } from './settings-cache';

// ===== SETTINGS HELPER =====

type DateSettings = {
  timezone: string;
  dateFormat: string;
  timeFormat: '24h' | '12h';
};

const DEFAULT_DATE_SETTINGS: DateSettings = {
  timezone: 'Asia/Ho_Chi_Minh',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
};

/**
 * Get date settings from cache (falls back to localStorage)
 */
export const getDateSettings = (): DateSettings => {
  try {
    // Use settings cache (loaded from database)
    const settings = getGeneralSettingsSync();
    return {
      timezone: settings.timezone || DEFAULT_DATE_SETTINGS.timezone,
      dateFormat: settings.dateFormat || DEFAULT_DATE_SETTINGS.dateFormat,
      timeFormat: settings.timeFormat || DEFAULT_DATE_SETTINGS.timeFormat,
    };
  } catch (e) { /* ignore */ }
  return DEFAULT_DATE_SETTINGS;
};

/**
 * Get timezone offset in hours from settings
 */
export const getTimezoneOffset = (): number => {
  const { timezone } = getDateSettings();
  const offsets: Record<string, number> = {
    'Asia/Ho_Chi_Minh': 7,
    'Asia/Bangkok': 7,
    'Asia/Singapore': 8,
    'Asia/Tokyo': 9,
  };
  return offsets[timezone] ?? 7; // Default UTC+7
};

/**
 * Get current date in configured timezone
 */
export const getCurrentDateInTimezone = (): Date => {
  const offset = getTimezoneOffset();
  const now = new Date();
  // Adjust to configured timezone
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  return new Date(utcTime + (offset * 60 * 60 * 1000));
};

/**
 * Format local date as YYYY-MM-DD string (without timezone conversion)
 */
export const formatLocalDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Format date for display as DD/MM/YYYY (uses timezone from settings)
 * Replacement for toLocaleDateString('vi-VN')
 */
export const formatDateForDisplay = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '';
  return dateFnsFormat(d, 'dd/MM/yyyy');
};

/**
 * Format time for display as HH:mm or h:mm AM/PM (uses settings)
 * Replacement for toLocaleTimeString('vi-VN')
 */
export const formatTimeForDisplay = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '';
  
  const settings = getDateSettings();
  if (settings.timeFormat === '12h') {
    return dateFnsFormat(d, 'h:mm a');
  }
  return dateFnsFormat(d, 'HH:mm');
};

/**
 * Format date and time for display (uses settings)
 * Replacement for toLocaleString('vi-VN')
 */
export const formatDateTimeForDisplay = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '';
  
  const settings = getDateSettings();
  if (settings.timeFormat === '12h') {
    return dateFnsFormat(d, 'dd/MM/yyyy h:mm a');
  }
  return dateFnsFormat(d, 'dd/MM/yyyy HH:mm');
};

/**
 * Get current timestamp as ISO string
 * Replacement for new Date().toISOString()
 */
export const getCurrentISOTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Build pay period for a given month (uses local dates)
 * Returns { monthKey, startDate, endDate }
 */
export const buildPayPeriodFromMonthKey = (monthKey: string): { monthKey: string; startDate: string; endDate: string } => {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) {
    return { monthKey, startDate: '', endDate: '' };
  }
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of month
  return {
    monthKey,
    startDate: formatLocalDateString(startDate),
    endDate: formatLocalDateString(endDate),
  };
};

// ===== FORMAT FUNCTIONS =====

/**
 * Format date as DD/MM/YYYY
 */
export const formatDate = (date: Date | string | null | undefined, formatStr: string = 'dd/MM/yyyy'): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '';
  return dateFnsFormat(d, formatStr);
};

/**
 * Format date as DD/MM/YYYY HH:mm (uses timezone from settings)
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '';
  
  const offset = getTimezoneOffset();
  const settings = getDateSettings();
  
  // Convert to configured timezone
  const utcTime = d.getTime();
  const localTime = new Date(utcTime + (offset * 60 * 60 * 1000));
  
  const day = localTime.getUTCDate().toString().padStart(2, '0');
  const month = (localTime.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = localTime.getUTCFullYear();
  let hours = localTime.getUTCHours();
  const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
  
  // Format time based on settings
  if (settings.timeFormat === '12h') {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  }
  
  return `${day}/${month}/${year} ${hours.toString().padStart(2, '0')}:${minutes}`;
};

/**
 * Format date as DD/MM/YYYY HH:mm:ss (uses timezone from settings)
 */
export const formatDateTimeSeconds = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '';
  
  const offset = getTimezoneOffset();
  const settings = getDateSettings();
  
  // Convert to configured timezone
  const utcTime = d.getTime();
  const localTime = new Date(utcTime + (offset * 60 * 60 * 1000));
  
  const day = localTime.getUTCDate().toString().padStart(2, '0');
  const month = (localTime.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = localTime.getUTCFullYear();
  let hours = localTime.getUTCHours();
  const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
  const seconds = localTime.getUTCSeconds().toString().padStart(2, '0');
  
  // Format time based on settings
  if (settings.timeFormat === '12h') {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  }
  
  return `${day}/${month}/${year} ${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
};

/**
 * Format date with custom format string
 * Common formats: 'dd/MM/yyyy', 'yyyy-MM-dd', 'MMMM yyyy', etc.
 */
export const formatDateCustom = (
  date: Date | string | null | undefined,
  formatString: string
): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '';
  return dateFnsFormat(d, formatString, { locale: vi });
};

/**
 * Format for month and year display (e.g., "Tháng 10 2025")
 */
export const formatMonthYear = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '';
  return dateFnsFormat(d, 'MMMM yyyy', { locale: vi });
};

// ===== PARSE FUNCTIONS =====

/**
 * Parse date string to Date object
 * Supports: DD/MM/YYYY, YYYY-MM-DD (ISO), ISO datetime
 */
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  // Try ISO format first (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
  if (dateString.includes('-') && dateString.length >= 10) {
    const isoDate = new Date(dateString);
    if (isValid(isoDate)) return isoDate;
  }
  
  // Try DD/MM/YYYY format
  const parsed = dateFnsParse(dateString, 'dd/MM/yyyy', new Date());
  return isValid(parsed) ? parsed : null;
};

/**
 * Parse datetime string DD/MM/YYYY HH:mm to Date object
 */
export const parseDateTime = (dateTimeString: string): Date | null => {
  if (!dateTimeString) return null;
  const parsed = dateFnsParse(dateTimeString, 'dd/MM/yyyy HH:mm', new Date());
  return isValid(parsed) ? parsed : null;
};

// ===== VALIDATION FUNCTIONS =====

/**
 * Check if date is valid
 */
export const isValidDate = (date: any): boolean => {
  if (!date) return false;
  const d = typeof date === 'string' ? new Date(date) : date;
  return isValid(d);
};

// ===== COMPARISON FUNCTIONS =====

/**
 * Check if two dates are the same day
 */
export const isDateSame = (
  date1: Date | string | null | undefined,
  date2: Date | string | null | undefined
): boolean => {
  if (!date1 || !date2) return false;
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return isSameDay(d1, d2);
};

/**
 * Check if two dates are in the same month
 */
export const isSameMonthAs = (
  date1: Date | string | null | undefined,
  date2: Date | string | null | undefined
): boolean => {
  if (!date1 || !date2) return false;
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return isSameMonth(d1, d2);
};

/**
 * Check if date is before another date
 */
export const isDateBefore = (
  date: Date | string | null | undefined,
  dateToCompare: Date | string | null | undefined
): boolean => {
  if (!date || !dateToCompare) return false;
  const d1 = typeof date === 'string' ? new Date(date) : date;
  const d2 = typeof dateToCompare === 'string' ? new Date(dateToCompare) : dateToCompare;
  return isBefore(d1, d2);
};

/**
 * Check if date is after another date
 */
export const isDateAfter = (
  date: Date | string | null | undefined,
  dateToCompare: Date | string | null | undefined
): boolean => {
  if (!date || !dateToCompare) return false;
  const d1 = typeof date === 'string' ? new Date(date) : date;
  const d2 = typeof dateToCompare === 'string' ? new Date(dateToCompare) : dateToCompare;
  return isAfter(d1, d2);
};

/**
 * Check if date is between two dates (inclusive)
 */
export const isDateBetween = (
  date: Date | string | null | undefined,
  startDate: Date | string | null | undefined,
  endDate: Date | string | null | undefined
): boolean => {
  if (!date || !startDate || !endDate) return false;
  const d = typeof date === 'string' ? new Date(date) : date;
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return isWithinInterval(d, { start, end });
};

// ===== MANIPULATION FUNCTIONS =====

/**
 * Get current date
 */
export const getCurrentDate = (): Date => {
  return new Date();
};

/**
 * Get start of day (00:00:00)
 */
export const getStartOfDay = (date: Date | string | null | undefined): Date | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return startOfDay(d);
};

/**
 * Get end of day (23:59:59)
 */
export const getEndOfDay = (date: Date | string | null | undefined): Date | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return endOfDay(d);
};

/**
 * Add days to date
 */
export const addDays = (
  date: Date | string | null | undefined,
  amount: number
): Date | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return dateFnsAddDays(d, amount);
};

/**
 * Subtract days from date
 */
export const subtractDays = (
  date: Date | string | null | undefined,
  amount: number
): Date | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return dateFnsSubDays(d, amount);
};

/**
 * Add months to date
 */
export const addMonths = (
  date: Date | string | null | undefined,
  amount: number
): Date | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return dateFnsAddMonths(d, amount);
};

/**
 * Subtract months from date
 */
export const subtractMonths = (
  date: Date | string | null | undefined,
  amount: number
): Date | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return dateFnsSubMonths(d, amount);
};

// ===== PERIOD FUNCTIONS =====

/**
 * Get start of week
 */
export const getStartOfWeek = (date: Date | string | null | undefined): Date | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return startOfWeek(d, { locale: vi });
};

/**
 * Get end of week
 */
export const getEndOfWeek = (date: Date | string | null | undefined): Date | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return endOfWeek(d, { locale: vi });
};

/**
 * Get start of month
 */
export const getStartOfMonth = (date: Date | string | null | undefined): Date | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return startOfMonth(d);
};

/**
 * Get end of month
 */
export const getEndOfMonth = (date: Date | string | null | undefined): Date | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return endOfMonth(d);
};

/**
 * Get day of week (0 = Sunday, 1 = Monday, etc.)
 */
export const getDayOfWeek = (date: Date | string | null | undefined): number | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return getDay(d);
};

/**
 * Get difference in days between two dates
 */
export const getDaysDiff = (
  date1: Date | string | null | undefined,
  date2: Date | string | null | undefined
): number => {
  if (!date1 || !date2) return 0;
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get difference in months between two dates
 */
export const getMonthsDiff = (
  date1: Date | string | null | undefined,
  date2: Date | string | null | undefined
): number => {
  if (!date1 || !date2) return 0;
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
};

/**
 * Convert date to ISO format (YYYY-MM-DD)
 */
export const toISODate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '';
  return dateFnsFormat(d, 'yyyy-MM-dd');
};

/**
 * Convert date to ISO datetime format (YYYY-MM-DDTHH:mm:ss)
 */
export const toISODateTime = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '';
  return dateFnsFormat(d, "yyyy-MM-dd'T'HH:mm:ss");
};

/**
 * Get short weekday names
 */
export const getWeekdaysShort = (): string[] => {
  return ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
};

/**
 * Get full weekday names
 */
export const getWeekdays = (): string[] => {
  return ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
};
