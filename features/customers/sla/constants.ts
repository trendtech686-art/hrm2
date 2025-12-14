export const SLA_EVALUATION_KEY = 'hrm-customer-sla-evals';
export const SLA_ACKNOWLEDGEMENTS_KEY = 'hrm-customer-sla-acks';
export const SLA_LAST_RUN_KEY = 'hrm-customer-sla-last-run';

export const SLA_TYPE_BADGES: Record<string, { label: string; color: string }> = {
  'follow-up': {
    label: 'Liên hệ định kỳ',
    color: 'text-blue-600 bg-blue-50'
  },
  're-engagement': {
    label: 'Kích hoạt lại',
    color: 'text-orange-600 bg-orange-50'
  },
  'debt-payment': {
    label: 'Nhắc công nợ',
    color: 'text-rose-600 bg-rose-50'
  }
};
