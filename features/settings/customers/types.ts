// Re-export from prisma-extended
export type {
  CustomerType,
  CustomerGroup,
  CustomerSource,
  PaymentTerm,
  CreditRating,
  LifecycleStage,
  CustomerSlaType,
  CustomerSlaSetting,
  CustomerTypeFormData,
  CustomerGroupFormData,
  CustomerSourceFormData,
  PaymentTermFormData,
  CreditRatingFormData,
  LifecycleStageFormData,
  CustomerSlaSettingFormData,
  CustomerSettingBase as BaseSetting,
} from '@/lib/types/prisma-extended';

// SLA Type Labels for UI display
export const SLA_TYPE_LABELS: Record<string, string> = {
  'follow-up': 'Liên hệ định kỳ',
  're-engagement': 'Kích hoạt lại',
  'debt-payment': 'Nhắc công nợ',
};

// SLA Type Descriptions
export const SLA_TYPE_DESCRIPTIONS: Record<string, string> = {
  'follow-up': 'Nhắc nhở liên hệ khách hàng theo chu kỳ định kỳ',
  're-engagement': 'Kích hoạt khách hàng không hoạt động trong thời gian dài',
  'debt-payment': 'Nhắc thanh toán công nợ quá hạn',
};

