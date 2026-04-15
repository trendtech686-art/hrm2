/**
 * Server Actions Index
 * 
 * Central export point for all Server Actions.
 * Import from this file for convenience:
 * 
 * @example
 * ```ts
 * import { cancelWarrantyAction, createPaymentAction, cancelOrderAction } from '@/app/actions'
 * ```
 */

// Shared Types
export type { ActionResult } from '@/types/action-result'

// Warranty Actions
export {
  cancelWarrantyAction,
  updateWarrantyStatusAction,
  completeWarrantyAction,
  reopenWarrantyAction,
  type CancelWarrantyInput,
  type UpdateStatusInput,
  type CompleteWarrantyInput,
  type ReopenWarrantyInput,
} from './warranty'

// Payment Actions (Phiếu Chi)
export {
  createPaymentAction,
  updatePaymentAction,
  cancelPaymentAction,
  deletePaymentAction,
  batchCancelPaymentsAction,
  type CreatePaymentInput,
  type UpdatePaymentInput,
  type CancelPaymentInput,
  type DeletePaymentInput,
} from './payments'

// Receipt Actions (Phiếu Thu)
export {
  createReceiptAction,
  updateReceiptAction,
  cancelReceiptAction,
  deleteReceiptAction,
  batchCancelReceiptsAction,
  createOrderReceiptAction,
  type CreateReceiptInput,
  type UpdateReceiptInput,
  type CancelReceiptInput,
  type DeleteReceiptInput,
} from './receipts'

// Order Actions (Đơn Hàng)
export {
  cancelOrderAction,
  updateOrderStatusAction,
  addOrderPaymentAction,
  createPackagingAction,
  confirmPackagingAction,
  cancelPackagingAction,
  processInStorePickupAction,
  confirmInStorePickupAction,
  dispatchOrderAction,
  startShippingAction,
  completeDeliveryAction,
  failDeliveryAction,
  cancelDeliveryAction,
  type CancelOrderInput,
  type UpdateOrderStatusInput,
  type AddOrderPaymentInput,
  type CreatePackagingInput,
  type ConfirmPackagingInput,
  type CancelPackagingInput,
  type ProcessInStorePickupInput,
  type DispatchInput,
  type StartShippingInput,
  type CompleteDeliveryInput,
  type FailDeliveryInput,
  type CancelDeliveryInput,
} from './orders'
