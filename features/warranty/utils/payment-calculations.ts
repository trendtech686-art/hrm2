import type { WarrantyTicket } from '../types';

const MONEY_RESOLUTIONS = new Set(['out_of_stock']);

export function calculateWarrantySettlementTotal(ticket?: WarrantyTicket | null) {
  if (!ticket) {
    return 0;
  }

  const productCompensation = (ticket.products || []).reduce((sum, product) => {
    if (!product) {
      return sum;
    }

    if (MONEY_RESOLUTIONS.has(product.resolution as string)) {
      const quantity = product.quantity ?? 0;
      const unitPrice = product.unitPrice ?? 0;
      return sum + quantity * unitPrice;
    }

    return sum;
  }, 0);

  return productCompensation + (ticket.shippingFee ?? 0);
}
