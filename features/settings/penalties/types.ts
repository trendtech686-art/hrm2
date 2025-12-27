// Re-export types from prisma-extended
export type { 
  Penalty, 
  PenaltyStatus, 
  PenaltyCategory, 
  PenaltyType 
} from '@/lib/types/prisma-extended';

// Import types for use in constants
import type { PenaltyStatus, PenaltyCategory } from '@/lib/types/prisma-extended';

// =============================================
// CONSTANTS
// =============================================

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
