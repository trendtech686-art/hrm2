import { asSystemId, asBusinessId } from '../../../lib/id-types';
import type { CustomerSlaSetting } from './types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

// Đơn giản hóa: Mỗi loại SLA chỉ có 1 record, user edit trực tiếp số ngày
export const defaultCustomerSlaSettings: CustomerSlaSetting[] = [
  // Follow-up SLA - Nhắc liên hệ định kỳ
  {
    systemId: asSystemId('CUSTSLA0000001'),
    id: asBusinessId('SLA-FOLLOWUP'),
    name: 'Liên hệ định kỳ',
    description: 'Nhắc nhở liên hệ khách hàng sau một thời gian không tương tác',
    slaType: 'follow-up',
    targetDays: 14,      // Mục tiêu: liên hệ trong vòng 14 ngày
    warningDays: 3,      // Cảnh báo khi còn 3 ngày
    criticalDays: 7,     // Nghiêm trọng khi quá hạn 7 ngày
    color: '#2196F3',    // Blue
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-01T08:00:00Z' }),
  },

  // Re-engagement SLA - Kích hoạt lại khách hàng không hoạt động
  {
    systemId: asSystemId('CUSTSLA0000002'),
    id: asBusinessId('SLA-REENGAGEMENT'),
    name: 'Kích hoạt lại',
    description: 'Khách hàng không mua hàng cần được kích hoạt lại',
    slaType: 're-engagement',
    targetDays: 60,      // Mục tiêu: kích hoạt trong vòng 60 ngày
    warningDays: 10,     // Cảnh báo khi còn 10 ngày
    criticalDays: 14,    // Nghiêm trọng khi quá hạn 14 ngày
    color: '#FF9800',    // Orange
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-02T08:00:00Z' }),
  },

  // Debt Payment SLA - Nhắc thanh toán công nợ
  {
    systemId: asSystemId('CUSTSLA0000003'),
    id: asBusinessId('SLA-DEBT'),
    name: 'Nhắc công nợ',
    description: 'Nhắc thanh toán công nợ quá hạn',
    slaType: 'debt-payment',
    targetDays: 7,       // Mục tiêu: thanh toán trong vòng 7 ngày sau hạn
    warningDays: 2,      // Cảnh báo khi còn 2 ngày
    criticalDays: 7,     // Nghiêm trọng khi quá hạn 7 ngày
    color: '#E91E63',    // Pink
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-03T08:00:00Z' }),
  },
];

// Helper to get SLA labels
export const SLA_TYPE_LABELS: Record<string, string> = {
  'follow-up': 'Liên hệ định kỳ',
  're-engagement': 'Kích hoạt lại',
  'debt-payment': 'Nhắc công nợ',
};

// Helper to get SLA descriptions
export const SLA_TYPE_DESCRIPTIONS: Record<string, string> = {
  'follow-up': 'Nhắc nhở liên hệ khách hàng theo chu kỳ định kỳ',
  're-engagement': 'Kích hoạt khách hàng không hoạt động trong thời gian dài',
  'debt-payment': 'Nhắc thanh toán công nợ quá hạn',
};
