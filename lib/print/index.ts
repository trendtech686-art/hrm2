/**
 * Print Helpers Index
 * Export tất cả print helpers từ một nơi
 */

// Order related
export {
  convertOrderForPrint,
  convertPackagingToDeliveryForPrint,
  convertToShippingLabelForPrint,
  convertToPackingForPrint,
  createStoreSettings,
  mapOrderToPrintData,
  mapOrderLineItems,
  mapDeliveryToPrintData,
  mapDeliveryLineItems,
  mapShippingLabelToPrintData,
  mapPackingToPrintData,
  mapPackingLineItems,
} from './order-print-helper';

// Sales return / Return order
export {
  convertSalesReturnForPrint,
  createStoreSettingsFromBranch,
  mapSalesReturnToPrintData,
  mapSalesReturnLineItems,
} from './sales-return-print-helper';

export { convertReturnOrderForPrint } from './return-order-print-helper';

// Inventory
export {
  convertStockTransferForPrint,
  mapStockTransferToPrintData,
  mapStockTransferLineItems,
} from './stock-transfer-print-helper';

export {
  convertStockInForPrint,
  mapStockInToPrintData,
  mapStockInLineItems,
} from './stock-in-print-helper';

export {
  convertInventoryCheckForPrint,
  mapInventoryCheckToPrintData,
  mapInventoryCheckLineItems,
} from './inventory-check-print-helper';

// Cost Adjustment
export {
  convertCostAdjustmentForPrint,
  mapCostAdjustmentToPrintData,
  mapCostAdjustmentLineItems,
} from './cost-adjustment-print-helper';

// Purchase
export {
  convertPurchaseOrderForPrint,
  mapPurchaseOrderToPrintData,
  mapPurchaseOrderLineItems,
} from './purchase-order-print-helper';

export {
  convertSupplierReturnForPrint,
  mapSupplierReturnToPrintData,
  mapSupplierReturnLineItems,
} from './supplier-return-print-helper';

// Finance
export {
  convertReceiptForPrint,
  mapReceiptToPrintData,
} from './receipt-print-helper';

export {
  convertPaymentForPrint,
  mapPaymentToPrintData,
} from './payment-print-helper';

export {
  convertRefundForPrint,
  mapRefundConfirmationToPrintData,
} from './refund-print-helper';

// Shipment
export {
  convertShipmentToDeliveryForPrint,
  convertShipmentsToHandoverForPrint,
  mapHandoverToPrintData,
  mapHandoverLineItems,
} from './shipment-print-helper';

// Quote
export {
  convertQuoteForPrint,
  mapQuoteToPrintData,
  mapQuoteLineItems,
} from './quote-print-helper';

// Warranty
export {
  convertWarrantyForPrint,
  convertWarrantyRequestForPrint,
  mapWarrantyToPrintData,
  mapWarrantyLineItems,
  mapWarrantyRequestToPrintData,
  mapWarrantyRequestLineItems,
} from './warranty-print-helper';

// Complaint
export {
  convertComplaintForPrint,
  mapComplaintToPrintData,
} from './complaint-print-helper';

// HR - Penalty
export {
  convertPenaltyForPrint,
  mapPenaltyToPrintData,
} from './penalty-print-helper';

// HR - Leave
export {
  convertLeaveForPrint,
  mapLeaveToPrintData,
} from './leave-print-helper';

// Product
export {
  convertProductForLabel,
  convertProductsForLabels,
  mapProductLabelToPrintData,
} from './product-print-helper';

// Reports
export {
  convertSalesSummaryForPrint,
  mapSalesSummaryToPrintData,
} from './sales-summary-print-helper';
