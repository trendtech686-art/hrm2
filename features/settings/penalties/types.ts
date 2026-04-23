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
  'Chưa thanh toán': 'bg-warning/10 text-warning-foreground border-warning/30',
  'Đã thanh toán': 'bg-success/10 text-success-foreground border-success/30',
  'Đã hủy': 'bg-muted/80 text-muted-foreground border-border',
};

export const penaltyCategoryLabels: Record<PenaltyCategory, string> = {
  complaint: 'Khiếu nại',
  attendance: 'Chấm công',
  performance: 'Hiệu suất',
  other: 'Khác',
};

export const penaltyCategoryColors: Record<PenaltyCategory, string> = {
  complaint: 'bg-destructive/10 text-destructive border-destructive/30',
  attendance: 'bg-warning/10 text-warning-foreground border-warning/30',
  performance: 'bg-info/10 text-info-foreground border-info/30',
  other: 'bg-muted/80 text-muted-foreground border-border',
};
