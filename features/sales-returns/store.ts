import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { createCrudStore } from '../../lib/store-factory.ts';
import type { SalesReturn, ReturnLineItem } from './types.ts';
import { data as initialData } from './data.ts';
import { GHTKService, type GHTKCreateOrderParams } from '../settings/shipping/integrations/ghtk-service';
import { loadShippingConfig } from '../../lib/utils/shipping-config-migration';
import { toast } from 'sonner';

// Other stores
import { useOrderStore } from '../orders/store.ts';
import { useProductStore } from '../products/store.ts';
import { useStockHistoryStore } from '../stock-history/store.ts';
import { useCustomerStore } from '../customers/store.ts';
import { createPaymentDocument, createReceiptDocument } from '../finance/document-helpers.ts';
import { useShippingPartnerStore } from '../settings/shipping/store.ts';
import { asBusinessId, asSystemId, type SystemId } from '../../lib/id-types.ts';
import { isComboProduct } from '../products/combo-utils.ts';
import { generateSystemId, getMaxSystemIdCounter } from '../../lib/id-utils.ts';

/**
 * ✅ Helper: Expand combo return items to child products
 * When a combo is returned, we need to add stock back to child products
 */
const getReturnStockItems = (returnItems: ReturnLineItem[]) => {
    const { findById } = useProductStore.getState();
    const expandedItems: { productSystemId: SystemId; productName: string; quantity: number }[] = [];
    
    returnItems.forEach(item => {
        const product = findById(item.productSystemId);
        if (product && isComboProduct(product) && product.comboItems) {
            // Combo → expand to child products
            product.comboItems.forEach(comboItem => {
                const childProduct = findById(comboItem.productSystemId);
                expandedItems.push({
                    productSystemId: comboItem.productSystemId,
                    productName: childProduct?.name || 'SP không xác định',
                    quantity: comboItem.quantity * item.returnQuantity
                });
            });
        } else {
            // Regular product
            expandedItems.push({
                productSystemId: asSystemId(item.productSystemId),
                productName: item.productName,
                quantity: item.returnQuantity
            });
        }
    });
    return expandedItems;
};

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
    const { updateDebt, incrementReturnStats } = useCustomerStore.getState();
    const order = findOrderById(newItemData.orderSystemId);
    if (!order) return { newReturn: null, newOrderSystemId: null };

    // ✅ IMPORTANT: Create the return FIRST to get IDs for exchange order
    const newReturn = originalAdd(newItemData);
    if (!newReturn) return { newReturn: null, newOrderSystemId: null };

    // ✅ Update customer return stats
    const totalReturnQty = newItemData.items.reduce((sum, item) => sum + item.returnQuantity, 0);
    if (totalReturnQty > 0) {
        incrementReturnStats(newItemData.customerSystemId, totalReturnQty);
    }

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
        
        // ✅ Helper to get next packaging systemId
        const PACKAGING_SYSTEM_ID_PREFIX = 'PACKAGE';
        const allOrders = useOrderStore.getState().data;
        const allPackagings = allOrders.flatMap(o => o.packagings || []);
        const maxPackagingCounter = getMaxSystemIdCounter(allPackagings, PACKAGING_SYSTEM_ID_PREFIX);
        let packagingCounter = maxPackagingCounter;
        const getNextPackagingSystemId = () => {
            packagingCounter++;
            return asSystemId(generateSystemId('packaging', packagingCounter));
        };
        
        // Check if using shipping partner or pickup
      const isPickup = newItemData.deliveryMethod === 'pickup';
      const isShippingPartner = newItemData.shippingPartnerId && newItemData.shippingServiceId;
        
        if (isPickup) {
            // Nhận tại cửa hàng - Tạo packaging request ngay
            finalMainStatus = 'Đang giao dịch';
            finalDeliveryStatus = 'Chờ đóng gói';
            packagings.push({
                systemId: getNextPackagingSystemId(), // ✅ Use proper format PACKAGE000001
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
                systemId: getNextPackagingSystemId(), // ✅ Use proper format PACKAGE000001
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
            linkedSalesReturnSystemId: newReturn.systemId, // ✅ Add systemId for linking
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

    if (finalAmount < 0 && newItemData.refunds && newItemData.refunds.length > 0) {
      const createdVoucherIds: SystemId[] = [];

      newItemData.refunds.forEach(refund => {
        if (!refund.amount || refund.amount <= 0) {
          return;
        }

        const { document, error } = createPaymentDocument({
          amount: refund.amount,
          description: `Hoàn tiền đổi/trả hàng từ đơn ${order.id} (Phiếu: ${newReturn.id}) qua ${refund.method}`,
          recipientName: newItemData.customerName,
          recipientSystemId: newItemData.customerSystemId,
          customerSystemId: newItemData.customerSystemId,
          customerName: newItemData.customerName,
          paymentMethodName: refund.method,
          accountSystemId: refund.accountSystemId,
          paymentTypeName: 'Hoàn tiền khách hàng',
          branchSystemId: newReturn.branchSystemId,
          branchName: newReturn.branchName,
          createdBy: creatorSystemId,
          originalDocumentId: newReturn.id,
          linkedSalesReturnSystemId: newReturn.systemId,
          linkedOrderSystemId: newReturn.orderSystemId,
          category: 'complaint_refund',
          affectsDebt: true, // ✅ Hoàn tiền khách hàng ảnh hưởng công nợ (giảm công nợ)
        });

        if (error) {
          console.error('[Sales Return] Failed to create payment voucher:', error);
          toast.error(`Không thể tạo phiếu chi hoàn tiền: ${error}`);
          return;
        }

        if (document) {
          createdVoucherIds.push(asSystemId(document.systemId));
        }
      });

      if (createdVoucherIds.length > 0) {
        baseStore.getState().update(newReturn.systemId, {
          ...newReturn,
          paymentVoucherSystemIds: createdVoucherIds,
        });
      }
    } else if (finalAmount > 0 && newItemData.payments && newItemData.payments.length > 0) {
      const createdVoucherIds: SystemId[] = [];

      newItemData.payments.forEach(payment => {
        if (!payment.amount || payment.amount <= 0) {
          return;
        }

        const { document, error } = createReceiptDocument({
          amount: payment.amount,
          description: `Thu tiền chênh lệch đổi hàng từ đơn ${order.id} (Phiếu: ${newReturn.id})`,
          customerName: newReturn.customerName,
          customerSystemId: newItemData.customerSystemId,
          paymentMethodName: payment.method,
          accountSystemId: payment.accountSystemId,
          receiptTypeName: 'Thanh toán cho đơn hàng',
          branchSystemId: newReturn.branchSystemId,
          branchName: newReturn.branchName,
          createdBy: creatorSystemId,
          originalDocumentId: newReturn.id,
          linkedSalesReturnSystemId: newReturn.systemId,
          linkedOrderSystemId: newReturn.orderSystemId,
          category: 'sale',
          affectsDebt: false,
        });

        if (error) {
          console.error('[Sales Return] Failed to create receipt voucher:', error);
          toast.error(`Không thể tạo phiếu thu đổi hàng: ${error}`);
          return;
        }

        if (document) {
          createdVoucherIds.push(asSystemId(document.systemId));
        }
      });

      if (createdVoucherIds.length > 0) {
        baseStore.getState().update(newReturn.systemId, {
          ...newReturn,
          receiptVoucherSystemIds: createdVoucherIds,
        });
      }
    }

    // ✅ Update inventory for returned items ONLY if isReceived = true
    // ✅ For combo products, add stock to child products instead
    if (newReturn.isReceived) {
        console.log('✅ [Sales Return] Updating inventory - items received');
        
        // Expand combo items to child products
        const stockItems = getReturnStockItems(newReturn.items);
        
        stockItems.forEach(item => {
          if (item.quantity > 0) {
            const product = useProductStore.getState().findById(item.productSystemId);
            const oldStock = product?.inventoryByBranch[newReturn.branchSystemId] || 0;
            updateInventory(item.productSystemId, newReturn.branchSystemId, item.quantity); // Add stock back
            addStockHistory({
              productId: item.productSystemId,
              date: getCurrentDate().toISOString(),
              employeeName: newReturn.creatorName,
              action: 'Nhập hàng từ khách trả',
              quantityChange: item.quantity,
              newStockLevel: oldStock + item.quantity,
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
   * ✅ For combo products, add stock to child products instead
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
    
    // ✅ Expand combo items to child products
    const stockItems = getReturnStockItems(salesReturn.items);
    
    // Update inventory for all returned items (including expanded combo children)
    stockItems.forEach(item => {
      if (item.quantity > 0) {
        const product = useProductStore.getState().findById(item.productSystemId);
        const oldStock = product?.inventoryByBranch[salesReturn.branchSystemId] || 0;
        updateInventory(item.productSystemId, salesReturn.branchSystemId, item.quantity);
        addStockHistory({
          productId: item.productSystemId,
          date: getCurrentDate().toISOString(),
          employeeName: salesReturn.creatorName,
          action: 'Nhập hàng từ khách trả (xác nhận)',
          quantityChange: item.quantity,
          newStockLevel: oldStock + item.quantity,
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
