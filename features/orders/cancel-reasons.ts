export type OrderCancelReasonOption = {
  value: string;
  label: string;
};

export const ORDER_CANCEL_REASONS: OrderCancelReasonOption[] = [
  { value: 'customer_changed_mind', label: 'Khách thay đổi nhu cầu' },
  { value: 'price_issue', label: 'Sai giá/khuyến mãi' },
  { value: 'out_of_stock', label: 'Không đủ tồn kho' },
  { value: 'duplicate_order', label: 'Đơn hàng trùng lặp' },
  { value: 'cannot_contact', label: 'Không liên lạc được khách' },
  { value: 'payment_issue', label: 'Khách không thanh toán' },
  { value: 'other', label: 'Lý do khác' },
];

export const resolveCancelReasonLabel = (value?: string) => {
  if (!value) return '';
  const matched = ORDER_CANCEL_REASONS.find(reason => reason.value === value);
  return matched?.label ?? value;
};
