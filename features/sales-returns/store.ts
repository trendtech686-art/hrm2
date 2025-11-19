import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { createCrudStore } from '../../lib/store-factory.ts';
import type { SalesReturn } from './types.ts';
import { data as initialData } from './data.ts';
import { GHTKService, type GHTKCreateOrderParams } from '../settings/shipping/integrations/ghtk-service';
import { loadShippingConfig } from '../../lib/utils/shipping-config-migration';
import { toast } from 'sonner';

// Other stores
import { useOrderStore } from '../orders/store.ts';
import { useProductStore } from '../products/store.ts';
import { useStockHistoryStore } from '../stock-history/store.ts';
import { useCustomerStore } from '../customers/store.ts';
import { usePaymentStore } from '../payments/store.ts';
import { useReceiptStore } from '../receipts/store.ts';
import { usePaymentTypeStore } from '../settings/payments/types/store.ts';
import { useReceiptTypeStore } from '../settings/receipt-types/store.ts';
import { useCashbookStore } from '../cashbook/store.ts';
import { useShippingPartnerStore } from '../settings/shipping/store.ts';
import { useTargetGroupStore } from '../settings/target-groups/store.ts';
import type { Payment } from '../payments/types.ts';
import type { Receipt } from '../receipts/types.ts';
import { asBusinessId, asSystemId, type SystemId } from '../../lib/id-types.ts';

const baseStore = createCrudStore<SalesReturn>(initialData, 'sales-returns', {
  persistKey: 'hrm-sales-returns' // ✅ Enable localStorage persistence
});

const originalAdd = baseStore.getState().add;

const augmentedMethods = {
  addWithSideEffects: (item: Omit<SalesReturn, 'systemId' | 'id'> & { creatorId: string }) => {
    const orderSystemId = asSystemId(item.orderSystemId);
    const orderBusinessId = asBusinessId(item.orderId);
    const customerSystemId = asSystemId(item.customerSystemId);
    const branchSystemId = asSystemId(item.branchSystemId);
    const creatorSystemId = asSystemId(item.creatorSystemId ?? item.creatorId ?? 'SYSTEM');
    const exchangeOrderSystemId = item.exchangeOrderSystemId ? asSystemId(item.exchangeOrderSystemId) : undefined;
    const accountSystemId = item.accountSystemId ? asSystemId(item.accountSystemId) : undefined;
    const paymentVoucherSystemId = item.paymentVoucherSystemId ? asSystemId(item.paymentVoucherSystemId) : undefined;
    const paymentVoucherSystemIds = item.paymentVoucherSystemIds?.map(asSystemId);
    const receiptVoucherSystemIds = item.receiptVoucherSystemIds?.map(asSystemId);

    const formattedItems = item.items.map(lineItem => ({
      ...lineItem,
      productSystemId: asSystemId(lineItem.productSystemId),
      productId: asBusinessId(lineItem.productId),
    }));

    const formattedPayments = item.payments?.map(payment => ({
      ...payment,
      accountSystemId: asSystemId(payment.accountSystemId),
    }));

    const formattedRefunds = item.refunds?.map(refund => ({
      ...refund,
      accountSystemId: asSystemId(refund.accountSystemId),
    }));

    const newItemData: Omit<SalesReturn, 'systemId'> = {
      id: asBusinessId(''),
      orderSystemId,
      orderId: orderBusinessId,
      customerSystemId,
      customerName: item.customerName,
      branchSystemId,
      branchName: item.branchName,
      returnDate: item.returnDate,
      reason: item.reason,
      note: item.note,
      notes: item.notes,
      reference: item.reference,
      items: formattedItems,
      totalReturnValue: item.totalReturnValue,
      isReceived: item.isReceived,
      exchangeItems: item.exchangeItems ?? [],
      exchangeOrderSystemId,
      subtotalNew: item.subtotalNew,
      shippingFeeNew: item.shippingFeeNew,
      discountNew: item.discountNew,
      discountNewType: item.discountNewType,
      grandTotalNew: item.grandTotalNew,
      deliveryMethod: item.deliveryMethod,
      shippingPartnerId: item.shippingPartnerId,
      shippingServiceId: item.shippingServiceId,
      shippingAddress: item.shippingAddress,
      packageInfo: item.packageInfo,
      configuration: item.configuration,
      finalAmount: item.finalAmount,
      refundMethod: item.refundMethod,
      refundAmount: item.refundAmount,
      accountSystemId,
      refunds: formattedRefunds,
      payments: formattedPayments,
      paymentVoucherSystemId,
      paymentVoucherSystemIds,
      receiptVoucherSystemIds,
      creatorSystemId,
      creatorName: item.creatorName,
    };

    // --- Side Effects ---
    const { update: updateOrder, findById: findOrderById, add: addOrder } = useOrderStore.getState();
    const { updateInventory } = useProductStore.getState();
    const { addEntry: addStockHistory } = useStockHistoryStore.getState();
    const { updateDebt } = useCustomerStore.getState();
    const { add: addPayment } = usePaymentStore.getState();
    const { add: addReceipt } = useReceiptStore.getState();
    const { data: paymentTypes } = usePaymentTypeStore.getState();
    const { data: receiptTypes } = useReceiptTypeStore.getState();
    const { accounts } = useCashbookStore.getState();
    const { data: targetGroups } = useTargetGroupStore.getState();
    const customerGroupBusinessId = asBusinessId('KHACHHANG');
    const customerTargetGroup = targetGroups.find(group => group.id === customerGroupBusinessId);
    const customerTypeSystemId = customerTargetGroup?.systemId ?? targetGroups[0]?.systemId ?? asSystemId('TARGETGROUP000000');
    const customerTypeName = customerTargetGroup?.name ?? targetGroups[0]?.name ?? 'Khách hàng';
    
    const order = findOrderById(newItemData.orderSystemId);
    if (!order) return { newReturn: null, newOrderSystemId: null };

    // ✅ IMPORTANT: Create the return FIRST to get IDs for exchange order
    const newReturn = originalAdd(newItemData);
    if (!newReturn) return { newReturn: null, newOrderSystemId: null };

    let newOrderSystemId: SystemId | undefined;

    // Create a new sales order for the exchange items
    if (newItemData.exchangeItems && newItemData.exchangeItems.length > 0) {
        console.log('🔄 [Sales Return] Creating exchange order...', {
        exchangeItems: newItemData.exchangeItems,
        finalAmount: newItemData.finalAmount,
        payments: newItemData.payments,
        });
        
      // ✅ Calculate payments for exchange order based on sales return logic
      const exchangeOrderPayments =
        newItemData.finalAmount > 0 && newItemData.payments
        ? newItemData.payments.map(p => ({
          method: p.method,
          accountSystemId: p.accountSystemId,
          amount: p.amount,
          }))
        : [];
        // If company refunded customer (finalAmount < 0)
        // The exchange order will have COD = grandTotal (shipper collects on delivery)
        // No payments array needed - will be handled by COD in shipping
        
        // ✅ Determine status and packagings based on delivery method
        let finalMainStatus: 'Đặt hàng' | 'Đang giao dịch' = 'Đặt hàng';
        let finalDeliveryStatus: string = 'Chờ đóng gói';
        const packagings: any[] = [];
        const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');
        
        // Check if using shipping partner or pickup
      const isPickup = newItemData.deliveryMethod === 'pickup';
      const isShippingPartner = newItemData.shippingPartnerId && newItemData.shippingServiceId;
        
        if (isPickup) {
            // Nhận tại cửa hàng - Tạo packaging request ngay
            finalMainStatus = 'Đang giao dịch';
            finalDeliveryStatus = 'Chờ đóng gói';
            packagings.push({
                systemId: `PKG_NEW_${Date.now()}`,
                id: '',
                requestDate: now,
          requestingEmployeeId: creatorSystemId,
          requestingEmployeeName: newItemData.creatorName,
                status: 'Chờ đóng gói',
                printStatus: 'Chưa in',
                deliveryStatus: 'Chờ đóng gói',
            });
        } else if (isShippingPartner) {
            // Đẩy qua hãng vận chuyển - Tạo packaging đã đóng gói với tracking
            finalMainStatus = 'Đang giao dịch';
            finalDeliveryStatus = 'Chờ lấy hàng';
            
            // Get partner info
            const { data: partners } = useShippingPartnerStore.getState();
            const partner = partners.find(p => p.systemId === newItemData.shippingPartnerId);
            const service = partner?.services.find(s => s.id === newItemData.shippingServiceId);
            
            packagings.push({
                systemId: `PKG_NEW_${Date.now()}`,
                id: '',
                requestDate: now,
                confirmDate: now,
              requestingEmployeeId: creatorSystemId,
              requestingEmployeeName: newItemData.creatorName,
              confirmingEmployeeId: creatorSystemId,
              confirmingEmployeeName: newItemData.creatorName,
                status: 'Đã đóng gói',
                deliveryStatus: 'Chờ lấy hàng',
                printStatus: 'Chưa in',
                deliveryMethod: 'Dịch vụ giao hàng',
                carrier: partner?.name,
                service: service?.name,
              trackingCode: newItemData.packageInfo?.trackingCode || `VC${Date.now()}`,
              shippingFeeToPartner: newItemData.shippingFeeNew,
                codAmount: 0, // Will be calculated based on payments
                payer: 'Người nhận',
              weight: newItemData.packageInfo?.weight,
              dimensions: newItemData.packageInfo?.dimensions,
            });
        }
        // else: deliver-later → keep default 'Đặt hàng', 'Chờ đóng gói', no packagings
        
        const newOrderPayload = {
            id: '', // ✅ Empty string triggers auto-generation of business ID (DH...)
            customerSystemId: order.customerSystemId,
            customerName: order.customerName,
            branchSystemId: order.branchSystemId, // ✅ Use systemId only
            branchName: order.branchName,
            salespersonId: creatorSystemId,
            salesperson: newItemData.creatorName,
            orderDate: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
            lineItems: newItemData.exchangeItems,
            subtotal: newItemData.subtotalNew,
            shippingFee: newItemData.shippingFeeNew,
            tax: 0,
            // ✅ IMPORTANT: grandTotal should be NET amount (after subtracting return value)
            // grandTotal = subtotalNew + shippingFee - totalReturnValue
            grandTotal: newItemData.finalAmount > 0 ? newItemData.finalAmount : newItemData.grandTotalNew,
            // ✅ Store return value info for display
            linkedSalesReturnId: newReturn.id, // ✅ Fixed: Use newReturn.id (business ID)
            linkedSalesReturnValue: newItemData.totalReturnValue, // Value of returned items
            payments: exchangeOrderPayments, // ✅ Set payments based on sales return scenario
            notes: `Đơn hàng đổi từ phiếu trả ${newReturn.id} của đơn hàng ${order.id}`, // ✅ Fixed: Use newReturn.id
            sourceSalesReturnId: newReturn.id, // ✅ Fixed: Use newReturn.id
            // ✅ Pass shipping info from form
            deliveryMethod: newItemData.deliveryMethod === 'pickup' ? 'Nhận tại cửa hàng' : 'Dịch vụ giao hàng',
            shippingPartnerId: newItemData.shippingPartnerId,
            shippingServiceId: newItemData.shippingServiceId,
            shippingAddress: newItemData.shippingAddress,
            packageInfo: newItemData.packageInfo,
            configuration: newItemData.configuration,
            // ✅ Add required status fields based on delivery method
            status: finalMainStatus,
            paymentStatus: exchangeOrderPayments.length > 0 ? 
              (exchangeOrderPayments.reduce((sum, p) => sum + p.amount, 0) >= newItemData.grandTotalNew ? 'Thanh toán toàn bộ' : 'Thanh toán 1 phần') 
                : 'Chưa thanh toán' as const,
            deliveryStatus: finalDeliveryStatus,
            printStatus: 'Chưa in' as const,
            stockOutStatus: 'Chưa xuất kho' as const,
            returnStatus: 'Chưa trả hàng' as const,
            codAmount: 0, // Will be calculated by ShippingIntegration based on payments
            packagings: packagings,
        };
        
        console.log('📦 [Sales Return] New order payload:', newOrderPayload);
        
        const newOrder = addOrder(newOrderPayload as any);
        
        console.log('✅ [Sales Return] New order created:', newOrder);
        
        if (newOrder) {
          newOrderSystemId = asSystemId(newOrder.systemId);
          // ✅ Save exchange order systemId to sales return
          (newItemData as SalesReturn).exchangeOrderSystemId = newOrderSystemId;
            
            console.log('🎉 [Sales Return] Exchange order systemId:', newOrderSystemId);
        } else {
            console.error('❌ [Sales Return] Failed to create exchange order!');
        }
    }

    // Adjust customer debt if needed
    const creditAmount = newItemData.totalReturnValue - newItemData.grandTotalNew - (newItemData.refundAmount || 0);
    if (creditAmount > 0) {
      updateDebt(newItemData.customerSystemId, -creditAmount);
    }
    
    // ✅ newReturn already created above, use it directly
    // ✅ NOW create vouchers with correct originalDocumentId
    // Handle Financials AFTER creating the return
    const finalAmount = newItemData.finalAmount;

    if (finalAmount < 0 && newItemData.refunds && newItemData.refunds.length > 0) { // Company needs to refund the customer
        const refundCategory = paymentTypes.find(pt => pt.name === 'Hoàn tiền khách hàng');
      const createdVoucherIds: SystemId[] = [];
        
        // ✅ Create multiple payment vouchers for each refund method
      newItemData.refunds.forEach(refund => {
        const account = accounts.find(acc => acc.systemId === refund.accountSystemId);
            if (refundCategory && account && refund.amount > 0) {
                const newPayment: Omit<Payment, 'systemId'> = {
                    id: asBusinessId(''), // Let payment store generate PC ID
                    date: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
                    amount: refund.amount,
            recipientTypeSystemId: customerTypeSystemId,
            recipientTypeName: customerTypeName,
                    recipientName: newItemData.customerName,
                    recipientSystemId: newItemData.customerSystemId,
                    description: `Hoàn tiền đổi/trả hàng từ đơn ${order.id} (Phiếu: ${newReturn.id}) qua ${refund.method}`, // ✅ Display IDs - OK
            paymentMethodSystemId: asSystemId(refund.method === 'Tiền mặt' ? 'PAYMENT_METHOD_CASH' : 'PAYMENT_METHOD_BANK'),
            paymentMethodName: refund.method,
            accountSystemId: account.systemId, // ✅ accountSystemId
                    paymentReceiptTypeSystemId: refundCategory.systemId,
                    paymentReceiptTypeName: refundCategory.name,
                    branchSystemId: newReturn.branchSystemId,
                    branchName: newReturn.branchName,
            createdBy: creatorSystemId,
                    createdAt: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
                    status: 'completed',
                    category: 'complaint_refund',
                    originalDocumentId: newReturn.id, // Link to sales return business ID
                    customerSystemId: newItemData.customerSystemId,
                    customerName: newItemData.customerName,
                    affectsDebt: false,
                };
                const createdPayment = addPayment(newPayment);
                if(createdPayment) {
            createdVoucherIds.push(asSystemId(createdPayment.systemId));
                }
            }
        });
        
        if (createdVoucherIds.length > 0) {
            // Update the newReturn with voucher IDs
        baseStore.getState().update(newReturn.systemId, {
                ...newReturn,
                paymentVoucherSystemIds: createdVoucherIds,
            });
        }
    } else if (finalAmount > 0 && newItemData.payments && newItemData.payments.length > 0) { // Customer paid immediately
        const receiptCategory = receiptTypes.find(rt => rt.name === 'Thanh toán cho đơn hàng');
      const createdVoucherIds: SystemId[] = [];
      newItemData.payments.forEach(payment => {
         const account = accounts.find(acc => acc.systemId === payment.accountSystemId);
             if (receiptCategory && account && payment.amount > 0) {
                const newReceipt: Omit<Receipt, 'systemId'> = {
                    id: asBusinessId(''), // Let receipt store generate PT ID
                    date: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
                    amount: payment.amount,
            payerTypeSystemId: customerTypeSystemId,
            payerTypeName: customerTypeName,
                    payerName: newReturn.customerName,
                    payerSystemId: newItemData.customerSystemId,
                    description: `Thu tiền chênh lệch đổi hàng từ đơn ${order.id} (Phiếu: ${newReturn.id})`, // ✅ Display IDs - OK
            paymentMethodSystemId: asSystemId(payment.method === 'Tiền mặt' ? 'PAYMENT_METHOD_CASH' : 'PAYMENT_METHOD_BANK'),
            paymentMethodName: payment.method,
                    accountSystemId: account.systemId, // ✅ accountSystemId
                    paymentReceiptTypeSystemId: receiptCategory.systemId,
                    paymentReceiptTypeName: receiptCategory.name,
                    branchSystemId: newReturn.branchSystemId,
                    branchName: newReturn.branchName,
            createdBy: creatorSystemId,
                    createdAt: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
                    status: 'completed',
                    category: 'sale',
                    originalDocumentId: newReturn.id, // Link to sales return business ID
                    customerSystemId: newItemData.customerSystemId,
                    customerName: newItemData.customerName,
                    affectsDebt: false,
                };
                const createdReceipt = addReceipt(newReceipt);
                if (createdReceipt) {
            createdVoucherIds.push(asSystemId(createdReceipt.systemId));
                }
            }
        });
        
        if (createdVoucherIds.length > 0) {
            // Update the newReturn with voucher IDs
        baseStore.getState().update(newReturn.systemId, {
                ...newReturn,
                receiptVoucherSystemIds: createdVoucherIds,
            });
        }
    }

    // ✅ Update inventory for returned items ONLY if isReceived = true
    if (newReturn.isReceived) {
        console.log('✅ [Sales Return] Updating inventory - items received');
        newReturn.items.forEach(lineItem => {
          if (lineItem.returnQuantity > 0) {
            const product = useProductStore.getState().findById(lineItem.productSystemId);
            const oldStock = product?.inventoryByBranch[newReturn.branchSystemId] || 0;
            updateInventory(lineItem.productSystemId, newReturn.branchSystemId, lineItem.returnQuantity); // Add stock back
            addStockHistory({
              productId: lineItem.productSystemId,
              date: getCurrentDate().toISOString(),
              employeeName: newReturn.creatorName,
              action: 'Nhập hàng từ khách trả',
              quantityChange: lineItem.returnQuantity,
              newStockLevel: oldStock + lineItem.returnQuantity,
              documentId: newReturn.id, // ✅ Use business ID for document reference
              branchSystemId: newReturn.branchSystemId,
              branch: newReturn.branchName,
            });
          }
        });
    } else {
        console.log('⏸️ [Sales Return] Inventory NOT updated - waiting for receipt confirmation');
    }

    // Update original order's return status
    const previousReturnsForOrder = baseStore.getState().data.filter(r => r.orderSystemId === order.systemId);
    const totalReturnedQty = previousReturnsForOrder.flatMap(r => r.items).reduce((sum, item) => sum + item.returnQuantity, 0);
    const totalOrderedQty = order.lineItems.reduce((sum, item) => sum + item.quantity, 0);
    const newReturnStatus = totalReturnedQty >= totalOrderedQty ? 'Trả hàng toàn bộ' : 'Trả hàng một phần';
    updateOrder(order.systemId, { ...order, returnStatus: newReturnStatus });
    
    return { newReturn, newOrderSystemId };
  },
  
  /**
   * ✅ Confirm receipt of returned items and update inventory
   * Use this when isReceived was false initially and items are now received
   */
  confirmReceipt: (returnSystemId: SystemId) => {
    const salesReturn = baseStore.getState().findById(returnSystemId);
    if (!salesReturn) {
      console.error('❌ [Sales Return] Return not found:', returnSystemId);
      return { success: false, message: 'Không tìm thấy phiếu trả hàng' };
    }
    
    if (salesReturn.isReceived) {
      console.warn('⚠️ [Sales Return] Already received:', returnSystemId);
      return { success: false, message: 'Hàng đã được nhận trước đó' };
    }
    
    const { updateInventory } = useProductStore.getState();
    const { addEntry: addStockHistory } = useStockHistoryStore.getState();
    
    // Update inventory for all returned items
    salesReturn.items.forEach(lineItem => {
      if (lineItem.returnQuantity > 0) {
        const product = useProductStore.getState().findById(lineItem.productSystemId);
        const oldStock = product?.inventoryByBranch[salesReturn.branchSystemId] || 0;
        updateInventory(lineItem.productSystemId, salesReturn.branchSystemId, lineItem.returnQuantity);
        addStockHistory({
          productId: lineItem.productSystemId,
          date: getCurrentDate().toISOString(),
          employeeName: salesReturn.creatorName,
          action: 'Nhập hàng từ khách trả (xác nhận)',
          quantityChange: lineItem.returnQuantity,
          newStockLevel: oldStock + lineItem.returnQuantity,
          documentId: salesReturn.id,
          branchSystemId: salesReturn.branchSystemId,
          branch: salesReturn.branchName,
        });
      }
    });
    
    // Update the return record
    baseStore.getState().update(returnSystemId, {
      ...salesReturn,
      isReceived: true,
    });
    
    console.log('✅ [Sales Return] Receipt confirmed and inventory updated:', returnSystemId);
    return { success: true, message: 'Đã xác nhận nhận hàng và cập nhật tồn kho' };
  },
};

// Export typed hook
export const useSalesReturnStore = (): any => {
  const state = baseStore();
  return {
    ...state,
    ...augmentedMethods,
  };
};

// Export getState for non-hook usage
useSalesReturnStore.getState = (): any => {
  const state = baseStore.getState();
  return {
    ...state,
    ...augmentedMethods,
  };
};
