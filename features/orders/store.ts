import { toISODateTime } from '../../lib/date-utils';
import { getApiUrl } from '../../lib/api-config';
import { createCrudStore } from '../../lib/store-factory';
import { data as initialDataOmit } from './data';
import type { Order, OrderPayment, Packaging, OrderMainStatus, OrderDeliveryStatus, PackagingStatus, OrderPaymentStatus, OrderDeliveryMethod } from '@/lib/types/prisma-extended';
import type { GHTKCreateOrderParams } from '../settings/shipping/integrations/ghtk-service';
import type { SystemId, BusinessId } from '../../lib/id-types';
import { asSystemId, asBusinessId } from '../../lib/id-types';
import { generateSystemId, getMaxSystemIdCounter } from '../../lib/id-utils';

import { useEmployeeStore } from '../employees/store';
// REMOVED: Voucher store no longer exists - using Payment/Receipt stores instead
import { useProductStore } from '../products/store';
import { isComboProduct } from '../products/combo-utils';
import { useStockHistoryStore } from '../stock-history/store';
import { useCustomerStore } from '../customers/store';
import { useReceiptTypeStore } from '../settings/receipt-types/store';
// REMOVED: import type { Voucher } from '../vouchers/types';
import { useCashbookStore } from '../cashbook/store';
import { useReceiptStore } from '../receipts/store';
import type { Receipt, ReceiptOrderAllocation } from '../receipts/types';
import { useSalesReturnStore } from '../sales-returns/store';
import { createPaymentDocument, createReceiptDocument } from '../finance/document-helpers';
import { useShipmentStore } from '../shipments/store';
import type { Shipment } from '../shipments/types';

import { getCurrentUserSystemId } from '../../contexts/auth-context';

import { useSalesManagementSettingsStore } from '../settings/sales/sales-management-store';
import {
  getCurrentUserInfo,
  createCreatedEntry,
  createHistoryEntry,
  appendHistoryEntry
} from '../../lib/activity-history-helper';

// ✅ Helper to get branch systemId
const getBranchId = (order: Order) => order.branchSystemId;

const deliveryStatusesBlockedForCancellation: OrderDeliveryStatus[] = [
    'Đang giao hàng',
    'Đã giao hàng',
    'Chờ giao lại',
];

const IN_STORE_PICKUP_PREFIX = 'INSTORE';

const PACKAGING_CODE_PREFIX = 'DG';
const PACKAGING_SYSTEM_ID_PREFIX = 'PACKAGE';

// ✅ Track packaging systemId counter globally
let packagingSystemIdCounter = 0;

// ✅ Initialize counter from all existing packagings across all orders
const _initPackagingCounter = (orders: Order[]): void => {
    const allPackagings = orders.flatMap(o => o.packagings || []);
    packagingSystemIdCounter = getMaxSystemIdCounter(allPackagings, PACKAGING_SYSTEM_ID_PREFIX);
};

// ✅ Generate next packaging systemId
const getNextPackagingSystemId = (): SystemId => {
    packagingSystemIdCounter++;
    return asSystemId(generateSystemId('packaging', packagingSystemIdCounter));
};

const getPackagingSuffixFromOrderId = (orderId?: BusinessId) => {
    if (!orderId) return '';
    const rawValue = `${orderId}`;
    const suffix = rawValue.replace(/^[A-Z-]+/, '');
    return suffix || rawValue;
};

// Count only active packagings (not cancelled) for numbering
const _getActivePackagingCount = (packagings: Packaging[]): number => {
    return packagings.filter(p => p.status !== 'Hủy đóng gói').length;
};

const buildPackagingBusinessId = (orderId: BusinessId, activeIndex: number, activeCount: number): BusinessId => {
    const suffix = getPackagingSuffixFromOrderId(orderId);
    const baseCode = `${PACKAGING_CODE_PREFIX}${suffix || '000000'}`;
    // Only add suffix if there are multiple active packagings
    if (activeCount > 1 && activeIndex > 0) {
        const paddedIndex = String(activeIndex + 1).padStart(2, '0');
        return asBusinessId(`${baseCode}-${paddedIndex}`);
    }
    return asBusinessId(baseCode);
};

const getReturnedValueForOrder = (orderSystemId: SystemId): number => {
    return useSalesReturnStore.getState().data
        .filter(sr => sr.orderSystemId === orderSystemId)
        .reduce((sum, sr) => sum + sr.totalReturnValue, 0);
};

const calculateActualDebt = (order: Order): number => {
    const totalReturnedValue = getReturnedValueForOrder(order.systemId);
    return Math.max(order.grandTotal - totalReturnedValue, 0);
};

const calculateTotalPaid = (payments: OrderPayment[]): number => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
};

const getOrderOutstandingAmount = (order: Order): number => {
    const actualDebt = calculateActualDebt(order);
    const totalPaid = calculateTotalPaid(order.payments ?? []);
    return Math.max(actualDebt - totalPaid, 0);
};

const applyPaymentToOrder = (order: Order, payment: OrderPayment): Order => {
    const updatedPayments = [...(order.payments ?? []), payment];
    const totalPaid = calculateTotalPaid(updatedPayments);
    const actualDebt = calculateActualDebt(order);

    let newPaymentStatus: OrderPaymentStatus = 'Chưa thanh toán';
    if (totalPaid >= actualDebt) {
        newPaymentStatus = 'Thanh toán toàn bộ';
    } else if (totalPaid > 0) {
        newPaymentStatus = 'Thanh toán 1 phần';
    }

    const wasCompleted = order.status === 'Hoàn thành';
    let newStatus = order.status;
    let newCompletedDate = order.completedDate;

    if (newPaymentStatus === 'Thanh toán toàn bộ' && order.deliveryStatus === 'Đã giao hàng') {
        newStatus = 'Hoàn thành';
        newCompletedDate = toISODateTime(new Date());
        if (!wasCompleted) {
            const { incrementOrderStats } = useCustomerStore.getState();
            incrementOrderStats(order.customerSystemId, order.grandTotal);
        }
    }

    const { updateDebtTransactionPayment } = useCustomerStore.getState();
    updateDebtTransactionPayment(order.customerSystemId, order.id, payment.amount);

    return {
        ...order,
        payments: updatedPayments,
        paymentStatus: newPaymentStatus,
        status: newStatus,
        completedDate: newCompletedDate,
        paidAmount: totalPaid,
    };
};

const shouldAutoAllocateReceipt = (receipt: Receipt): boolean => {
    return (
        receipt.status === 'completed' &&
        receipt.affectsDebt &&
        !!receipt.customerSystemId &&
        !receipt.linkedOrderSystemId
    );
};

const getAllocatedAmount = (receipt: Receipt): number => {
    return receipt.orderAllocations?.reduce((sum, allocation) => sum + allocation.amount, 0) ?? 0;
};

const autoAllocateReceiptToOrders = (receipt: Receipt) => {
    if (!shouldAutoAllocateReceipt(receipt)) {
        return;
    }

    const remainingAmount = receipt.amount - getAllocatedAmount(receipt);
    if (remainingAmount <= 0) {
        return;
    }

    const candidateOrders = baseStore.getState().data
        .filter(order => order.customerSystemId === receipt.customerSystemId && order.status !== 'Đã hủy')
        .map(order => ({ order, outstanding: getOrderOutstandingAmount(order) }))
        .filter(entry => entry.outstanding > 0)
        .sort((a, b) => {
            const aTime = a.order.orderDate ? new Date(a.order.orderDate).getTime() : 0;
            const bTime = b.order.orderDate ? new Date(b.order.orderDate).getTime() : 0;
            return aTime - bTime;
        });

    if (!candidateOrders.length) {
        return;
    }

    let amountToDistribute = remainingAmount;
    const updatedOrders = new Map<SystemId, Order>();
    const allocationEntries: ReceiptOrderAllocation[] = [];

    for (const { order } of candidateOrders) {
        if (amountToDistribute <= 0) {
            break;
        }

        const currentOrderState = updatedOrders.get(order.systemId) ?? order;
        const outstanding = getOrderOutstandingAmount(currentOrderState);
        if (outstanding <= 0) {
            continue;
        }

        const allocationAmount = Math.min(outstanding, amountToDistribute);
        if (allocationAmount <= 0) {
            continue;
        }

        const paymentEntry: OrderPayment = {
            systemId: receipt.systemId,
            id: receipt.id,
            date: receipt.date,
            amount: allocationAmount,
            method: receipt.paymentMethodName,
            createdBy: asSystemId(receipt.createdBy),
            description: receipt.description ?? `Thanh toán từ phiếu thu ${receipt.id}`,
        };

        const updatedOrder = applyPaymentToOrder(currentOrderState, paymentEntry);
        updatedOrders.set(order.systemId, updatedOrder);
        allocationEntries.push({
            orderSystemId: order.systemId,
            orderId: order.id,
            amount: allocationAmount,
        });

        amountToDistribute -= allocationAmount;
    }

    if (!allocationEntries.length) {
        return;
    }

    baseStore.setState(state => {
        const data = state.data.map(order => updatedOrders.get(order.systemId) ?? order);
        return { data };
    });

    const receiptStore = useReceiptStore.getState();
    const latestReceipt = receiptStore.findById(receipt.systemId);
    if (!latestReceipt) {
        return;
    }

    receiptStore.update(receipt.systemId, {
        ...latestReceipt,
        orderAllocations: [...(latestReceipt.orderAllocations ?? []), ...allocationEntries],
    });
};

const ensureOrderPackagingIdentifiers = (order: Order): Order | null => {
    if (!order.packagings || order.packagings.length === 0) {
        return null;
    }

    // Count only active packagings for proper numbering
    const activePackagings = order.packagings.filter(p => p.status !== 'Hủy đóng gói');
    const activeCount = activePackagings.length;
    let changed = false;
    let activeIndex = 0;

    const updatedPackagings = order.packagings.map((pkg, _idx) => {
        const isCancelled = pkg.status === 'Hủy đóng gói';
        const hasId = typeof pkg.id === 'string' && pkg.id.trim().length > 0;
        // ✅ Check for temp systemId or old format (PKG_)
        const hasTempOrOldSystemId = pkg.systemId?.startsWith('PKG_TEMP_') || pkg.systemId?.startsWith('PKG_');
        const hasValidSystemId = pkg.systemId?.startsWith(PACKAGING_SYSTEM_ID_PREFIX);
        const shouldFixTracking = pkg.deliveryMethod === 'Nhận tại cửa hàng' && pkg.trackingCode === `${IN_STORE_PICKUP_PREFIX}-`;

        // For cancelled packagings, keep existing ID
        if (isCancelled) {
            if (!hasId || (hasTempOrOldSystemId && !hasValidSystemId)) {
                // Still need to assign an ID if missing
                const nextPkg = { ...pkg };
                if (!hasId) {
                    nextPkg.id = buildPackagingBusinessId(order.id, 0, 1);
                }
                if (hasTempOrOldSystemId && !hasValidSystemId) {
                    nextPkg.systemId = getNextPackagingSystemId();
                }
                changed = true;
                return nextPkg;
            }
            return pkg;
        }

        // For active packagings, use activeIndex for numbering
        const currentActiveIndex = activeIndex;
        activeIndex++;

        if (hasId && !shouldFixTracking && hasValidSystemId) {
            return pkg;
        }

        const nextPkg = { ...pkg };
        if (!hasId) {
            nextPkg.id = buildPackagingBusinessId(order.id, currentActiveIndex, activeCount);
            changed = true;
        }
        
        // ✅ Fix temporary/old systemId to proper format PACKAGE000001
        if (hasTempOrOldSystemId && !hasValidSystemId) {
            nextPkg.systemId = getNextPackagingSystemId();
            changed = true;
        }

        if (shouldFixTracking) {
            const resolvedId = nextPkg.id ?? buildPackagingBusinessId(order.id, currentActiveIndex, activeCount);
            nextPkg.trackingCode = `${IN_STORE_PICKUP_PREFIX}-${resolvedId}`;
            changed = true;
        }

        return nextPkg;
    });

    return changed ? { ...order, packagings: updatedPackagings } : null;
};

const ensureCancellationAllowed = (order: Order | undefined, actionLabel: string) => {
    if (!order) return false;

    const { allowCancelAfterExport } = useSalesManagementSettingsStore.getState();
    if (allowCancelAfterExport) {
        return true;
    }

    const hasLeftWarehouse =
        order.stockOutStatus === 'Xuất kho toàn bộ' ||
        deliveryStatusesBlockedForCancellation.includes(order.deliveryStatus);

    if (hasLeftWarehouse) {
        alert(
            `Không thể ${actionLabel} vì đơn hàng đã xuất kho. Vào Cấu hình bán hàng -> Thiết lập quản lý bán hàng và bật "Cho phép hủy đơn hàng sau khi xuất kho".`,
        );
        return false;
    }

    return true;
};

/**
 * ✅ Helper để xử lý stock cho combo hoặc sản phẩm thường
 * Combo không có tồn kho thực tế - thao tác trên SP con
 */
type StockOperation = 'commit' | 'uncommit' | 'dispatch' | 'complete' | 'return';

const processLineItemStock = (
    lineItem: { productSystemId: string; quantity: number },
    branchSystemId: string,
    operation: StockOperation,
    orderQuantity: number = 1 // Số lượng đặt của line item
) => {
    const { 
        findById: findProductById, 
        commitStock, 
        uncommitStock, 
        dispatchStock, 
        completeDelivery, 
        returnStockFromTransit 
    } = useProductStore.getState();
    
    const product = findProductById(asSystemId(lineItem.productSystemId));
    
    // Xác định danh sách items cần xử lý (SP con nếu combo, hoặc chính SP nếu thường)
    const itemsToProcess: { productSystemId: SystemId; quantity: number }[] = [];
    
    if (product && isComboProduct(product) && product.comboItems) {
        // Combo: xử lý tất cả SP con
        product.comboItems.forEach(comboItem => {
            itemsToProcess.push({
                productSystemId: asSystemId(comboItem.productSystemId),
                quantity: orderQuantity * comboItem.quantity, // Số lượng combo × số lượng SP con
            });
        });
    } else {
        // Sản phẩm thường
        itemsToProcess.push({
            productSystemId: asSystemId(lineItem.productSystemId),
            quantity: orderQuantity,
        });
    }
    
    // Thực hiện operation cho từng item
    itemsToProcess.forEach(item => {
        const branchId = asSystemId(branchSystemId);
        switch (operation) {
            case 'commit':
                commitStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'uncommit':
                uncommitStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'dispatch':
                dispatchStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'complete':
                completeDelivery(item.productSystemId, branchId, item.quantity);
                break;
            case 'return':
                returnStockFromTransit(item.productSystemId, branchId, item.quantity);
                break;
        }
    });
    
    return itemsToProcess; // Return để có thể dùng cho stock history
};

/**
 * ✅ Helper để lấy danh sách stock items từ line items (mở rộng combo thành SP con)
 * Dùng trong webhook GHTK hoặc các thao tác batch
 */
const getComboStockItems = (lineItems: { productSystemId: string; quantity: number }[]): { productSystemId: SystemId; quantity: number }[] => {
    const { findById: findProductById } = useProductStore.getState();
    const stockItems: { productSystemId: SystemId; quantity: number }[] = [];
    
    lineItems.forEach(item => {
        const product = findProductById(asSystemId(item.productSystemId));
        
        if (product && isComboProduct(product) && product.comboItems) {
            // Combo: mở rộng thành SP con
            product.comboItems.forEach(comboItem => {
                stockItems.push({
                    productSystemId: asSystemId(comboItem.productSystemId),
                    quantity: item.quantity * comboItem.quantity,
                });
            });
        } else {
            // Sản phẩm thường
            stockItems.push({
                productSystemId: asSystemId(item.productSystemId),
                quantity: item.quantity,
            });
        }
    });
    
    return stockItems;
};

const createOrderRefundVoucher = (order: Order, amount: number, employeeId: SystemId) => {
    const lastPositivePayment = [...(order.payments ?? [])].reverse().find(p => p.amount > 0);
    const { document, error } = createPaymentDocument({
        amount,
        description: `Hoàn tiền do hủy đơn ${order.id}`,
        recipientName: order.customerName,
        recipientSystemId: order.customerSystemId,
        customerSystemId: order.customerSystemId,
        customerName: order.customerName,
        branchSystemId: order.branchSystemId,
        branchName: order.branchName,
        createdBy: employeeId,
        paymentMethodName: lastPositivePayment?.method || 'Tiền mặt',
        paymentTypeName: 'Hoàn tiền khách hàng',
        originalDocumentId: order.id,
        linkedOrderSystemId: order.systemId,
        affectsDebt: true,
        category: 'other',
    });

    if (!document) {
        console.error('[cancelOrder] Không thể tạo phiếu chi hoàn tiền', error);
        return null;
    }

    return document;
};

type InitialOrderData = Omit<Order, 'systemId' | 'packagings' | 'lineItems'> & {
  packagingStatus?: string;
  products?: Array<{
    productSystemId?: string;
    productId?: string;
    productName?: string;
    quantity?: number;
    price?: number;
    total?: number;
  }>;
};

const initialData: Order[] = (initialDataOmit as InitialOrderData[]).map((o, index: number) => {
    const packagings: Packaging[] = [];
    
    if (o.packagingStatus === 'Đóng gói toàn bộ' || o.packagingStatus === 'Chờ xác nhận đóng gói') {
        const hasDeliveryStarted = o.deliveryStatus && o.deliveryStatus !== 'Chờ đóng gói' && o.deliveryStatus !== 'Đã đóng gói';
        const packagingId = `${PACKAGING_CODE_PREFIX}${o.id.substring(2)}`; // DG000001
        
        const newPkg: Packaging = {
            systemId: asSystemId(`PACKAGE${String(index + 1).padStart(6, '0')}`), // ✅ Use proper format PACKAGE000001
            id: asBusinessId(packagingId),
            requestDate: o.orderDate,
            confirmDate: o.packagingStatus === 'Đóng gói toàn bộ' ? o.orderDate : undefined,
            requestingEmployeeId: o.salespersonSystemId,
            requestingEmployeeName: o.salesperson,
            confirmingEmployeeId: o.packagingStatus === 'Đóng gói toàn bộ' ? o.salespersonSystemId : undefined,
            confirmingEmployeeName: o.packagingStatus === 'Đóng gói toàn bộ' ? o.salesperson : undefined,
            status: o.packagingStatus === 'Đóng gói toàn bộ' ? 'Đã đóng gói' : 'Chờ đóng gói',
            printStatus: o.printStatus,
            deliveryMethod: hasDeliveryStarted ? o.deliveryMethod : undefined,
            deliveryStatus: o.deliveryStatus,
        };

        if (o.id === 'DH000001' && o.deliveryStatus === 'Đã giao hàng') {
            newPkg.carrier = 'Giao Hàng Nhanh';
            newPkg.trackingCode = 'GHN000001'; // Use shipment tracking code from carrier
            newPkg.deliveredDate = '2025-09-22 14:00';
            newPkg.deliveryMethod = 'Dịch vụ giao hàng';
        }
        
        if (o.id === 'DH000003' && o.deliveryStatus === 'Đã giao hàng') {
            newPkg.trackingCode = 'VC000003'; // Use shipment business ID for INSTORE
            newPkg.deliveredDate = '2025-08-01 11:00';
            newPkg.deliveryMethod = 'Nhận tại cửa hàng';
        }

        packagings.push(newPkg);
    }
    
    const { packagingStatus: _packagingStatus, products: _products, ...rest } = o;

    // Transform products array to lineItems
    const lineItems = (o.products || []).map((p, idx: number) => ({
        systemId: `LINE_${o.id}_${idx + 1}`,
        productSystemId: p.productSystemId || `PROD_${idx}`,
        productId: p.productId || `PROD_${idx}`,
        productName: p.productName || '',
        quantity: p.quantity || 0,
        unitPrice: p.price || 0,
        discount: 0,
        discountType: 'fixed' as const,
        total: p.total || 0
    }));

    return {
        ...rest,
        systemId: asSystemId(`ORD${String(index + 1).padStart(8, '0')}`),
        customerSystemId: asSystemId(`CUST_${index + 1}`), // Generate temp customer systemId
        paidAmount: o.paidAmount ?? 0, // ✅ Use value from data.ts, default to 0 if undefined
        packagings,
        lineItems: lineItems.map(l => ({
            ...l,
            systemId: asSystemId(l.systemId),
            productSystemId: asSystemId(l.productSystemId),
            productId: asBusinessId(l.productId),
        })),
    } as Order;
});

const baseStore = createCrudStore<Order>(initialData, 'orders', {
  businessIdField: 'id',
  persistKey: 'hrm-orders',
  getCurrentUser: () => {
    return asSystemId(getCurrentUserSystemId());
  }
});

// ✅ MIGRATION: Ensure all orders have paidAmount field (backward compatibility)
baseStore.setState(state => ({
  data: state.data.map(order => ({
    ...order,
    paidAmount: order.paidAmount ?? 0, // Default to 0 if undefined
  }))
}));

// ✅ MIGRATION: Merge seed data - add new orders from initialData if not exist in persisted store
baseStore.setState(state => {
  const existingIds = new Set(state.data.map(o => o.systemId));
  const newOrders = initialData.filter(o => !existingIds.has(o.systemId));
  if (newOrders.length > 0) {
    return { data: [...state.data, ...newOrders] };
  }
  return state;
});

// ✅ MIGRATION: Fix order status - orders with full payment and delivery should be "Hoàn thành"
baseStore.setState(state => ({
  data: state.data.map(order => {
    // If order is already completed or cancelled, skip
    if (order.status === 'Hoàn thành' || order.status === 'Đã hủy') {
      return order;
    }
    
    // Check if all active packagings are delivered
    const activePackagings = order.packagings.filter(p => p.status !== 'Hủy đóng gói');
    const isAllDelivered = activePackagings.length > 0 && activePackagings.every(p => p.deliveryStatus === 'Đã giao hàng');
    
    // If fully paid and fully delivered, update status to "Hoàn thành"
    if (order.paymentStatus === 'Thanh toán toàn bộ' && (isAllDelivered || order.deliveryStatus === 'Đã giao hàng')) {
      return {
        ...order,
        status: 'Hoàn thành' as OrderMainStatus,
        completedDate: order.completedDate || toISODateTime(new Date()),
      };
    }
    
    return order;
  })
}));

const originalAdd = baseStore.getState().add;

baseStore.setState({
    add: (item) => {
        const { commitStock, findById: findProductById } = useProductStore.getState();
        const userInfo = getCurrentUserInfo();
        const newItem = originalAdd(item);
        if (newItem) {
            const hydratedPackagings = ensureOrderPackagingIdentifiers(newItem);
            if (hydratedPackagings) {
                Object.assign(newItem, hydratedPackagings);
                baseStore.setState(state => ({
                    data: state.data.map(order => order.systemId === hydratedPackagings.systemId ? hydratedPackagings : order),
                }));
            }
            newItem.lineItems.forEach(li => {
                const product = findProductById(asSystemId(li.productSystemId));
                
                // ✅ Xử lý combo: commit stock của SP con thay vì combo
                if (product && isComboProduct(product) && product.comboItems) {
                    product.comboItems.forEach(comboItem => {
                        // Commit stock = số lượng combo × số lượng SP con trong combo
                        const totalQuantity = li.quantity * comboItem.quantity;
                        commitStock(asSystemId(comboItem.productSystemId), asSystemId(newItem.branchSystemId), totalQuantity);
                    });
                } else {
                    // Sản phẩm thường: commit stock như bình thường
                    commitStock(asSystemId(li.productSystemId), asSystemId(newItem.branchSystemId), li.quantity);
                }
            });
            
            // ✅ Cập nhật lastPurchaseDate khi tạo đơn mới (để SLA/churn risk hoạt động đúng)
            if (newItem.customerSystemId) {
                const { update: updateCustomer, findById: findCustomer } = useCustomerStore.getState();
                const customer = findCustomer(newItem.customerSystemId);
                if (customer) {
                    updateCustomer(newItem.customerSystemId, {
                        lastPurchaseDate: new Date().toISOString().split('T')[0],
                    });
                }
            }
            
            // ✅ Add activity history entry
            const historyEntry = createCreatedEntry(
                userInfo,
                `${userInfo.name} đã tạo đơn hàng ${newItem.id} cho khách hàng ${newItem.customerName} (Tổng: ${newItem.grandTotal.toLocaleString('vi-VN')}đ)`
            );
            baseStore.setState(state => ({
                data: state.data.map(order => order.systemId === newItem.systemId ? { ...order, activityHistory: [historyEntry] } : order),
            }));
        }
        return newItem;
    },
});

const backfillPackagingIdentifiers = () => {
    const currentState = baseStore.getState();
    let changed = false;
    const updatedData = currentState.data.map(order => {
        const updatedOrder = ensureOrderPackagingIdentifiers(order);
        if (updatedOrder) {
            changed = true;
            return updatedOrder;
        }
        return order;
    });

    if (changed) {
        baseStore.setState({ data: updatedData });
    }
};

backfillPackagingIdentifiers();

const augmentedMethods = {
    cancelOrder: (
        systemId: SystemId,
        employeeId: SystemId,
        options?: { reason?: string; restock?: boolean }
    ) => {
        const { reason, restock = true } = options ?? {};
        const currentOrder = baseStore.getState().data.find(o => o.systemId === systemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy đơn hàng')) {
            return;
        }

        baseStore.setState(state => {
            const orderToCancel = state.data.find(o => o.systemId === systemId);
            if (!orderToCancel || orderToCancel.status === 'Đã hủy') {
                return state;
            }

            const employee = useEmployeeStore.getState().findById(employeeId as SystemId);
            const now = toISODateTime(new Date());
            const cancellationReason = (reason && reason.trim().length > 0)
                ? reason.trim()
                : orderToCancel.cancellationReason || `Hủy bởi ${employee?.fullName || 'Hệ thống'}`;

            // ✅ Uncommit stock (hỗ trợ combo)
            if (restock) {
                orderToCancel.lineItems.forEach(item => {
                    processLineItemStock(item, orderToCancel.branchSystemId, 'uncommit', item.quantity);
                });
            }

            const hasDispatchedStock = orderToCancel.stockOutStatus === 'Xuất kho toàn bộ'
                || ['Chờ lấy hàng', 'Đang giao hàng', 'Đã giao hàng', 'Chờ giao lại'].includes(orderToCancel.deliveryStatus);

            // ✅ Return stock from transit (hỗ trợ combo)
            if (restock && hasDispatchedStock) {
                orderToCancel.lineItems.forEach(item => {
                    processLineItemStock(item, orderToCancel.branchSystemId, 'return', item.quantity);
                });
            }

            const existingPayments = orderToCancel.payments ?? [];
            const netCollected = existingPayments.reduce((sum, payment) => sum + payment.amount, 0);
            let refundPaymentEntry: OrderPayment | null = null;
            const refundAmount = netCollected > 0 ? netCollected : 0;

            if (refundAmount > 0) {
                const refundVoucher = createOrderRefundVoucher(orderToCancel, refundAmount, employeeId);
                if (!refundVoucher) {
                    alert('Không thể tạo phiếu chi hoàn tiền. Vui lòng kiểm tra cấu hình tài chính trước khi hủy đơn.');
                    return state;
                }

                refundPaymentEntry = {
                    systemId: refundVoucher.systemId,
                    id: refundVoucher.id,
                    date: refundVoucher.date,
                    amount: -refundAmount,
                    method: refundVoucher.paymentMethodName,
                    createdBy: employeeId,
                    description: `Hoàn tiền khi hủy đơn ${orderToCancel.id}`,
                };
            }

            const updatedPayments = refundPaymentEntry ? [...existingPayments, refundPaymentEntry] : existingPayments;
            const updatedPaidAmount = Math.max(0, (orderToCancel.paidAmount ?? 0) - refundAmount);
            const updatedPackagings = orderToCancel.packagings.map(pkg => {
                if (pkg.status === 'Hủy đóng gói' && pkg.deliveryStatus === 'Đã hủy') {
                    return pkg;
                }
                return {
                    ...pkg,
                    status: 'Hủy đóng gói' as PackagingStatus,
                    deliveryStatus: 'Đã hủy' as OrderDeliveryStatus,
                    cancelDate: now,
                    cancelReason: pkg.cancelReason ?? cancellationReason,
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employee?.fullName || 'Hệ thống',
                };
            });

            const updatedOrder = {
                ...orderToCancel,
                status: 'Đã hủy' as OrderMainStatus,
                cancelledDate: now,
                cancellationReason,
                deliveryStatus: 'Đã hủy' as OrderDeliveryStatus,
                stockOutStatus: restock ? 'Chưa xuất kho' as const : orderToCancel.stockOutStatus,
                payments: updatedPayments,
                paidAmount: updatedPaidAmount,
                paymentStatus: refundPaymentEntry ? 'Chưa thanh toán' as OrderPaymentStatus : orderToCancel.paymentStatus,
                packagings: updatedPackagings,
                cancellationMetadata: {
                    restockItems: restock,
                    notifyCustomer: false,
                    emailNotifiedAt: undefined,
                },
                activityHistory: appendHistoryEntry(
                    orderToCancel.activityHistory,
                    createHistoryEntry(
                        'cancelled',
                        getCurrentUserInfo(),
                        `${employee?.fullName || 'Hệ thống'} đã hủy đơn hàng. Lý do: ${cancellationReason}${refundAmount > 0 ? `. Hoàn tiền: ${refundAmount.toLocaleString('vi-VN')}đ` : ''}`
                    )
                ),
            };

            // ✅ Remove debt transaction from customer
            useCustomerStore.getState().removeDebtTransaction(orderToCancel.customerSystemId, orderToCancel.id);

            return { data: state.data.map(o => (o.systemId === systemId ? updatedOrder : o)) };
        });
    },

    addPayment: (orderSystemId: SystemId, paymentData: { amount: number; method: string }, employeeId: SystemId) => {
        // --- Side effects must happen outside setState ---
        const order = baseStore.getState().findById(orderSystemId as SystemId);
        const employee = useEmployeeStore.getState().findById(employeeId as SystemId);

        if (!order || !employee) {
            console.error("Order or employee not found for payment.");
            return;
        }

        const { document: createdReceipt, error } = createReceiptDocument({
            amount: paymentData.amount,
            description: `Thanh toán cho đơn hàng ${order.id}`,
            customerName: order.customerName,
            customerSystemId: order.customerSystemId,
            branchSystemId: order.branchSystemId,
            branchName: order.branchName,
            createdBy: employeeId,
            paymentMethodName: paymentData.method,
            receiptTypeName: 'Thanh toán cho đơn hàng',
            originalDocumentId: order.id,
            linkedOrderSystemId: order.systemId,
            affectsDebt: true,
        });

        if (!createdReceipt) {
            console.error('Failed to create receipt', error);
            alert('Không thể tạo phiếu thu cho đơn hàng. Vui lòng kiểm tra cấu hình chứng từ.');
            return;
        }

        // 2. Now, update the order state with the created receipt info
        baseStore.setState(state => {
            const orderIndex = state.data.findIndex(o => o.systemId === orderSystemId);
            if (orderIndex === -1) return state;

            const orderToUpdate = state.data[orderIndex];
            const newPayment: OrderPayment = {
                systemId: createdReceipt.systemId,
                id: createdReceipt.id,
                date: createdReceipt.date,
                amount: createdReceipt.amount,
                method: createdReceipt.paymentMethodName,
                createdBy: asSystemId(createdReceipt.createdBy),
                description: createdReceipt.description,
            };

            const updatedOrder = applyPaymentToOrder(orderToUpdate, newPayment);
            
            // ✅ Add activity history entry
            updatedOrder.activityHistory = appendHistoryEntry(
                orderToUpdate.activityHistory,
                createHistoryEntry(
                    'payment_made',
                    getCurrentUserInfo(),
                    `${employee?.fullName || 'Nhân viên'} đã thanh toán ${paymentData.amount.toLocaleString('vi-VN')}đ bằng ${paymentData.method}`
                )
            );
            
            const newData = [...state.data];
            newData[orderIndex] = updatedOrder;

            return { data: newData };
        });
    },

    requestPackaging: (orderSystemId: SystemId, employeeId: SystemId, assignedEmployeeId?: SystemId) => {
        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            const employee = useEmployeeStore.getState().findById(employeeId as SystemId);
            const assignedEmployee = assignedEmployeeId ? useEmployeeStore.getState().findById(assignedEmployeeId as SystemId) : null;
            
            // Count only active packagings for proper numbering
            const activePackagings = order.packagings.filter(p => p.status !== 'Hủy đóng gói');
            const activeCountAfterInsert = activePackagings.length + 1;
            const newActiveIndex = activePackagings.length; // This will be the index in active packagings
            
            const newPackaging: Packaging = {
                systemId: getNextPackagingSystemId(), // ✅ Use proper format PACKAGE000001
                id: buildPackagingBusinessId(order.id, newActiveIndex, activeCountAfterInsert),
                requestDate: toISODateTime(new Date()),
                requestingEmployeeId: employeeId,
                requestingEmployeeName: employee?.fullName || 'N/A',
                assignedEmployeeId,
                assignedEmployeeName: assignedEmployee?.fullName,
                status: 'Chờ đóng gói',
                printStatus: 'Chưa in',
            };

            const updatedOrder = { ...order, packagings: [...order.packagings, newPackaging], deliveryStatus: 'Chờ đóng gói' as OrderDeliveryStatus };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },

    confirmPackaging: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId) => {
        // ✅ Check negative packing setting
        const { allowNegativePacking } = useSalesManagementSettingsStore.getState();
        if (!allowNegativePacking) {
            const order = baseStore.getState().data.find(o => o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = useProductStore.getState();
                for (const item of order.lineItems) {
                    const product = findProductById(asSystemId(item.productSystemId));
                    
                    if (product && isComboProduct(product) && product.comboItems) {
                        for (const comboItem of product.comboItems) {
                            const childProduct = findProductById(asSystemId(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                alert(`Không thể đóng gói: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            alert(`Không thể đóng gói: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }

        baseStore.setState(state => {
            const dataCopy = [...state.data];
            const orderIndex = dataCopy.findIndex(o => o.systemId === orderSystemId);
            if (orderIndex === -1) return state;
    
        const orderCopy = { ...dataCopy[orderIndex] };
            const packagingIndex = orderCopy.packagings.findIndex(p => p.systemId === packagingSystemId);
            if (packagingIndex === -1) return state;
            
            const employee = useEmployeeStore.getState().findById(employeeId as SystemId);
    
        const packagingsCopy = [...orderCopy.packagings];
            packagingsCopy[packagingIndex] = {
                ...packagingsCopy[packagingIndex],
                status: 'Đã đóng gói' as PackagingStatus,
                confirmDate: toISODateTime(new Date()),
                confirmingEmployeeId: employeeId,
                confirmingEmployeeName: employee?.fullName || 'N/A',
            };
    
        orderCopy.packagings = packagingsCopy;
        orderCopy.deliveryStatus = 'Đã đóng gói' as OrderDeliveryStatus;
            
            dataCopy[orderIndex] = orderCopy;
    
        return { data: dataCopy };
        });
    },

    cancelPackagingRequest: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId, reason: string) => {
        baseStore.setState(state => {
             const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            const employee = useEmployeeStore.getState().findById(employeeId as SystemId);

            const updatedPackagings = order.packagings.map(p => {
                if (p.systemId === packagingSystemId) {
                    return {
                        ...p,
                        status: 'Hủy đóng gói' as PackagingStatus,
                        cancelDate: toISODateTime(new Date()),
                        cancelingEmployeeId: employeeId,
                        cancelingEmployeeName: employee?.fullName || 'N/A',
                        cancelReason: reason,
                    };
                }
                return p;
            });
            const isAnyActivePackaging = updatedPackagings.some(p => p.status !== 'Hủy đóng gói');
            const updatedOrder = { ...order, packagings: updatedPackagings, deliveryStatus: isAnyActivePackaging ? order.deliveryStatus : 'Chờ đóng gói' as OrderDeliveryStatus };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },
    
    processInStorePickup: (orderSystemId: SystemId, packagingSystemId: SystemId) => {
        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
    
            const totalCount = order.packagings.length;
            const updatedPackagings = order.packagings.map((p, index) => {
                if (p.systemId === packagingSystemId) {
                    const hasId = typeof p.id === 'string' && p.id.trim().length > 0;
                    const resolvedId = hasId ? p.id : buildPackagingBusinessId(order.id, index, totalCount);
                    return {
                        ...p,
                        id: resolvedId,
                        deliveryMethod: 'Nhận tại cửa hàng' as OrderDeliveryMethod,
                        deliveryStatus: 'Đã đóng gói' as OrderDeliveryStatus,
                        // trackingCode will be set when shipment is created in confirmInStorePickup
                    };
                }
                return p;
            });
            
            const updatedOrder = { 
                ...order, 
                packagings: updatedPackagings, 
                deliveryStatus: 'Đã đóng gói' as OrderDeliveryStatus 
            };
    
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },
    
    confirmInStorePickup: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId) => {
        console.log('🟢 [confirmInStorePickup] Called with:', { orderSystemId, packagingSystemId, employeeId });
        
        // ✅ Check negative stock out setting
        const { allowNegativeStockOut } = useSalesManagementSettingsStore.getState();
        if (!allowNegativeStockOut) {
            const order = baseStore.getState().data.find(o => o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = useProductStore.getState();
                for (const item of order.lineItems) {
                    const product = findProductById(asSystemId(item.productSystemId));
                    
                    if (product && isComboProduct(product) && product.comboItems) {
                        for (const comboItem of product.comboItems) {
                            const childProduct = findProductById(asSystemId(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                alert(`Không thể xuất kho: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            alert(`Không thể xuất kho: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }

        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) {
                console.error('❌ [confirmInStorePickup] Order not found:', orderSystemId);
                return state;
            }
    
            console.log('📋 [confirmInStorePickup] Order found:', order.id);
            console.log('📋 [confirmInStorePickup] Line items:', order.lineItems.length);
            
            // Stock logic
            const { addEntry: addStockHistory } = useStockHistoryStore.getState();
            const employeeData = useEmployeeStore.getState().findById(employeeId as SystemId);
            const now = toISODateTime(new Date());
    
            order.lineItems.forEach((item, index) => {
                console.log(`📦 [confirmInStorePickup] Dispatching item ${index + 1}:`, {
                    productSystemId: item.productSystemId,
                    productName: item.productName,
                    quantity: item.quantity,
                    branchSystemId: getBranchId(order)
                });
                
                // ✅ Dispatch stock (hỗ trợ combo - sẽ dispatch SP con)
                const processedItems = processLineItemStock(item, getBranchId(order), 'dispatch', item.quantity);
                
                // ✅ Add stock history entry for each processed item (SP con nếu combo)
                processedItems.forEach(processedItem => {
                    const product = useProductStore.getState().findById(processedItem.productSystemId);
                    const currentStock = product?.inventoryByBranch?.[getBranchId(order)] || 0;
                    
                    addStockHistory({
                        date: now,
                        productId: processedItem.productSystemId,
                        action: 'Xuất kho (Đơn hàng)',
                        quantityChange: -processedItem.quantity,
                        newStockLevel: currentStock, // After dispatch
                        documentId: order.id,
                        branchSystemId: getBranchId(order),
                        branch: order.branchName,
                        employeeName: employeeData?.fullName || 'Hệ thống',
                    });
                });
            });
    
            // Status update logic - will be updated with trackingCode after shipment creation
            let updatedPackagings = order.packagings.map(p => {
                if (p.systemId === packagingSystemId) {
                    return { 
                        ...p, 
                        deliveryStatus: 'Đã giao hàng' as OrderDeliveryStatus, 
                        deliveredDate: toISODateTime(new Date()) 
                    };
                }
                return p;
            });
    
            const isAllDelivered = updatedPackagings.every(p => p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            
            let newStatus = order.status === 'Đặt hàng' ? 'Đang giao dịch' : order.status;
            let newCompletedDate = order.completedDate;
            if (isAllDelivered && order.paymentStatus === 'Thanh toán toàn bộ') {
                newStatus = 'Hoàn thành';
                newCompletedDate = toISODateTime(new Date());
            }
    
            
            const employee = useEmployeeStore.getState().findById(employeeId as SystemId);
            
            // ✅ Create shipment record for INSTORE pickup
            const packaging = order.packagings.find(p => p.systemId === packagingSystemId);
            let newShipment: Shipment | null = null;
            if (packaging) {
                const { createShipment, updateShipment } = useShipmentStore.getState();
                newShipment = createShipment({
                    packagingSystemId: packagingSystemId,
                    orderSystemId: orderSystemId,
                    orderId: order.id,
                    trackingCode: '', // Will be set to shipment business ID below
                    carrier: 'Nhận tại cửa hàng',
                    service: 'Nhận tại cửa hàng',
                    deliveryStatus: 'Đã giao hàng',
                    printStatus: 'Chưa in',
                    reconciliationStatus: 'Chưa đối soát',
                    shippingFeeToPartner: 0,
                    codAmount: 0,
                    payer: 'Người gửi',
                    createdAt: now,
                    dispatchedAt: now,
                    deliveredAt: now,
                });
                // Update shipment trackingCode to use its own business ID
                if (newShipment) {
                    updateShipment(newShipment.systemId, {
                        trackingCode: newShipment.id, // Use shipment business ID (VC000XXX)
                    });
                    // Update packaging with shipment trackingCode
                    updatedPackagings = updatedPackagings.map(p => {
                        if (p.systemId === packagingSystemId) {
                            return { ...p, trackingCode: newShipment!.id };
                        }
                        return p;
                    });
                }
                console.log('✅ [confirmInStorePickup] Shipment created:', newShipment?.id);
            }
            
            const updatedOrder = { 
                ...order, 
                packagings: updatedPackagings, 
                deliveryStatus: 'Đã giao hàng' as OrderDeliveryStatus,
                status: newStatus,
                completedDate: newCompletedDate,
                stockOutStatus: 'Xuất kho toàn bộ' as const,
                dispatchedDate: toISODateTime(new Date()),
                dispatchedByEmployeeId: employeeId,
                dispatchedByEmployeeName: employee?.fullName,
            };
    
            console.log('✅ [confirmInStorePickup] Stock dispatched successfully');
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },    
    confirmPartnerShipment: async (orderSystemId: SystemId, packagingSystemId: SystemId, _shipmentData: Record<string, unknown>): Promise<{ success: boolean; message: string }> => {
        try {
            const order = baseStore.getState().data.find(o => o.systemId === orderSystemId);
            if (!order) {
                return { success: false, message: 'Không tìm thấy đơn hàng' };
            }

            // ✅ Check negative packing setting (covers creating shipment)
            const { allowNegativePacking } = useSalesManagementSettingsStore.getState();
            if (!allowNegativePacking) {
                const { findById: findProductById } = useProductStore.getState();
                for (const item of order.lineItems) {
                    const product = findProductById(asSystemId(item.productSystemId));
                    
                    if (product && isComboProduct(product) && product.comboItems) {
                        for (const comboItem of product.comboItems) {
                            const childProduct = findProductById(asSystemId(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                return { success: false, message: `Không thể tạo vận đơn: Sản phẩm "${childProduct?.name}" không đủ tồn kho` };
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            return { success: false, message: `Không thể tạo vận đơn: Sản phẩm "${item.productName}" không đủ tồn kho` };
                        }
                    }
                }
            }

            // ✅ Get GHTK preview params from window (set by ShippingIntegration)
            const ghtkParams = (window as unknown as Record<string, unknown>).__ghtkPreviewParams as GHTKCreateOrderParams | undefined;
            
            if (!ghtkParams) {
                return { success: false, message: 'Thiếu thông tin vận chuyển. Vui lòng chọn dịch vụ vận chuyển.' };
            }

            // ✅ Import GHTK service dynamically
            const { GHTKService } = await import('../settings/shipping/integrations/ghtk-service');
            const { getGHTKCredentials } = await import('../../lib/utils/get-shipping-credentials');
            
            const { apiToken, partnerCode } = getGHTKCredentials();
            const ghtkService = new GHTKService(apiToken, partnerCode);

            console.log('📤 [confirmPartnerShipment] Calling GHTK API with params:', ghtkParams);

            // ✅ Call real GHTK API
            const result = await ghtkService.createOrder(ghtkParams);

            if (!result.success || !result.order) {
                throw new Error(result.message || 'Không thể tạo đơn vận chuyển');
            }

            // ✅ Update order with real tracking code from GHTK
            const trackingCode = result.order.label;
            const ghtkTrackingId = result.order.tracking_id;
            const estimatedPickTime = result.order.estimated_pick_time;
            const estimatedDeliverTime = result.order.estimated_deliver_time;

            baseStore.setState(state => {
                const updatedPackagings = order.packagings.map(p => {
                    if (p.systemId === packagingSystemId) {
                        return {
                            ...p,
                            deliveryMethod: 'Dịch vụ giao hàng' as OrderDeliveryMethod,
                            deliveryStatus: 'Chờ lấy hàng' as OrderDeliveryStatus,
                            carrier: 'GHTK',
                            service: result.order?.fee ? `${result.order.fee}đ` : 'Standard',
                            trackingCode: trackingCode,
                            shippingFeeToPartner: parseInt(result.order?.fee || '0') || 0,
                            codAmount: ghtkParams.pickMoney || 0,
                            payer: (ghtkParams.isFreeship === 1 ? 'Người gửi' : 'Người nhận') as 'Người gửi' | 'Người nhận',
                            noteToShipper: ghtkParams.note || '',
                            weight: ghtkParams.totalWeight || 0,
                            dimensions: `${ghtkParams.products?.[0]?.length || 10}×${ghtkParams.products?.[0]?.width || 10}×${ghtkParams.products?.[0]?.height || 10}`,
                            // ✅ Store GHTK specific data
                            ghtkTrackingId: String(ghtkTrackingId),
                            estimatedPickTime: estimatedPickTime,
                            estimatedDeliverTime: estimatedDeliverTime,
                        };
                    }
                    return p;
                });
                
                const updatedOrder = { 
                    ...order, 
                    packagings: updatedPackagings, 
                    deliveryStatus: 'Chờ lấy hàng' as OrderDeliveryStatus, 
                    status: 'Đang giao dịch' as OrderMainStatus 
                };
                
                return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
            });

            console.log('✅ [confirmPartnerShipment] GHTK order created successfully:', {
                trackingCode,
                ghtkTrackingId,
                estimatedPickTime,
                estimatedDeliverTime
            });

            return { 
                success: true, 
                message: `Tạo vận đơn thành công! Mã vận đơn: ${trackingCode}` 
            };

        } catch (error) {
            console.error('❌ [confirmPartnerShipment] Error:', error);
            
            let errorMessage = 'Vui lòng thử lại';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            return { 
                success: false, 
                message: `Lỗi tạo đơn vận chuyển: ${errorMessage}` 
            };
        }
    },

    dispatchFromWarehouse: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId) => {
        // ✅ Check negative stock out setting
        const { allowNegativeStockOut } = useSalesManagementSettingsStore.getState();
        if (!allowNegativeStockOut) {
            const order = baseStore.getState().data.find(o => o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = useProductStore.getState();
                for (const item of order.lineItems) {
                    const product = findProductById(asSystemId(item.productSystemId));
                    
                    if (product && isComboProduct(product) && product.comboItems) {
                        for (const comboItem of product.comboItems) {
                            const childProduct = findProductById(asSystemId(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                alert(`Không thể xuất kho: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            alert(`Không thể xuất kho: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }

        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;

            const { addEntry: addStockHistory } = useStockHistoryStore.getState();
            const employeeData = useEmployeeStore.getState().findById(employeeId as SystemId);
            const now = toISODateTime(new Date());
            
            order.lineItems.forEach(item => {
                // ✅ Dispatch stock (hỗ trợ combo - sẽ dispatch SP con)
                const processedItems = processLineItemStock(item, getBranchId(order), 'dispatch', item.quantity);
                
                // ✅ Add stock history entry for each processed item
                processedItems.forEach(processedItem => {
                    const product = useProductStore.getState().findById(processedItem.productSystemId);
                    const currentStock = product?.inventoryByBranch?.[getBranchId(order)] || 0;
                    
                    addStockHistory({
                        date: now,
                        productId: processedItem.productSystemId,
                        action: 'Xuất kho (Đơn hàng)',
                        quantityChange: -processedItem.quantity,
                        newStockLevel: currentStock,
                        documentId: order.id,
                        branchSystemId: getBranchId(order),
                        branch: order.branchName,
                        employeeName: employeeData?.fullName || 'Hệ thống',
                    });
                });
            });
            
            const now2 = toISODateTime(new Date());
            
            const updatedPackagings = order.packagings.map(p => 
                p.systemId === packagingSystemId ? { ...p, deliveryStatus: 'Đang giao hàng' as OrderDeliveryStatus } : p
            );

            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đang giao hàng' as OrderDeliveryStatus,
                stockOutStatus: 'Xuất kho toàn bộ' as const,
                dispatchedDate: now2,
                dispatchedByEmployeeId: employeeId,
                dispatchedByEmployeeName: employeeData?.fullName,
                status: order.status === 'Đặt hàng' ? 'Đang giao dịch' : order.status,
            };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },

    completeDelivery: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId) => {
        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            
            // ✅ Complete delivery (hỗ trợ combo - sẽ complete SP con)
            order.lineItems.forEach(item => {
                processLineItemStock(item, getBranchId(order), 'complete', item.quantity);
            });

            const updatedPackagings = order.packagings.map(p => 
                p.systemId === packagingSystemId ? { ...p, deliveryStatus: 'Đã giao hàng' as OrderDeliveryStatus, deliveredDate: toISODateTime(new Date()) } : p
            );
            
            const isAllDelivered = updatedPackagings.every(p => p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            let newStatus = order.status;
            let newCompletedDate = order.completedDate;
            
            // ✅ Khi tất cả đơn đã giao → tạo công nợ (nếu có) và cập nhật stats
            if (isAllDelivered && order.status !== 'Hoàn thành') {
                // Tính công nợ còn lại
                const totalPaid = (order.payments || []).reduce((sum, p) => sum + p.amount, 0);
                const debtAmount = Math.max(0, order.grandTotal - totalPaid);
                
                // ✅ Tạo công nợ CHỈ KHI giao hàng thành công
                if (debtAmount > 0) {
                    const { addDebtTransaction } = useCustomerStore.getState();
                    const dueDate = new Date();
                    dueDate.setDate(dueDate.getDate() + 30);
                    addDebtTransaction(order.customerSystemId, {
                        systemId: asSystemId(`DEBT_${order.systemId}`),
                        orderId: order.id,
                        orderDate: order.orderDate.split('T')[0],
                        amount: debtAmount,
                        dueDate: dueDate.toISOString().split('T')[0],
                        isPaid: false,
                        remainingAmount: debtAmount,
                        notes: 'Công nợ từ đơn hàng đã giao thành công',
                    });
                }
                
                // Update customer stats
                const { incrementOrderStats } = useCustomerStore.getState();
                incrementOrderStats(order.customerSystemId, order.grandTotal);
            }
            
            // Check if order is fully complete (delivered + fully paid)
            if (isAllDelivered && order.paymentStatus === 'Thanh toán toàn bộ') {
                newStatus = 'Hoàn thành';
                newCompletedDate = toISODateTime(new Date());
            }

            const employee = useEmployeeStore.getState().findById(employeeId as SystemId);
            const updatedOrder = { 
                ...order, 
                packagings: updatedPackagings, 
                deliveryStatus: 'Đã giao hàng' as OrderDeliveryStatus, 
                status: newStatus, 
                completedDate: newCompletedDate,
                activityHistory: appendHistoryEntry(
                    order.activityHistory,
                    createHistoryEntry(
                        'status_changed',
                        getCurrentUserInfo(),
                        `${employee?.fullName || 'Nhân viên'} đã xác nhận giao hàng thành công${newStatus === 'Hoàn thành' ? '. Đơn hàng hoàn thành' : ''}`
                    )
                ),
            };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },

    failDelivery: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId, reason: string) => {
        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            const { incrementFailedDeliveryStats } = useCustomerStore.getState();
            
            // ✅ Return stock from transit (hỗ trợ combo - sẽ return SP con)
            order.lineItems.forEach(item => {
                processLineItemStock(item, getBranchId(order), 'return', item.quantity);
            });

            // ✅ Update customer failed delivery stats
            incrementFailedDeliveryStats(order.customerSystemId);

            const updatedPackagings = order.packagings.map(p => 
                p.systemId === packagingSystemId ? { ...p, deliveryStatus: 'Chờ giao lại' as OrderDeliveryStatus, notes: `Giao thất bại: ${reason}` } : p
            );
            
            const updatedOrder = { ...order, packagings: updatedPackagings, deliveryStatus: 'Chờ giao lại' as OrderDeliveryStatus };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
         });
    },

    // ✅ Hủy giao hàng - KHÔNG trả hàng về kho (hàng bị thất tung/shipper giữ)
    cancelDeliveryOnly: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId, reason: string) => {
        const currentOrder = baseStore.getState().data.find(o => o.systemId === orderSystemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy giao hàng')) {
            return;
        }

        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;

            // ✅ Get employee info for canceller
            const employeeData = useEmployeeStore.getState().findById(employeeId as SystemId);

            const updatedPackagings = order.packagings.map(p => 
                p.systemId === packagingSystemId ? { 
                    ...p, 
                    status: 'Hủy đóng gói' as PackagingStatus,
                    deliveryStatus: 'Đã hủy' as OrderDeliveryStatus,
                    cancelReason: `Hủy giao hàng: ${reason}`, 
                    cancelDate: toISODateTime(new Date()),
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employeeData?.fullName || 'Hệ thống',
                } : p
            );
            
            // ✅ Check if all packagings are cancelled, update order status accordingly
            const allCancelled = updatedPackagings.every(p => p.deliveryStatus === 'Đã hủy' || p.status === 'Hủy đóng gói');
            const hasAnyActive = updatedPackagings.some(p => p.deliveryStatus && p.deliveryStatus !== 'Đã hủy' && p.status !== 'Hủy đóng gói');
            
            let newOrderStatus = order.status;
            let newDeliveryStatus = order.deliveryStatus;
            
            if (allCancelled) {
                // All packagings cancelled → order goes back to pending state
                newOrderStatus = 'Đang giao dịch' as OrderMainStatus;
                newDeliveryStatus = 'Chưa giao hàng' as OrderDeliveryStatus;
            } else if (hasAnyActive) {
                // Some packagings still active → keep current delivery status of remaining active packaging
                const activePackaging = updatedPackagings.find(p => p.deliveryStatus && p.deliveryStatus !== 'Đã hủy');
                if (activePackaging?.deliveryStatus) {
                    newDeliveryStatus = activePackaging.deliveryStatus;
                }
            }
            
            const updatedOrder = { 
                ...order, 
                packagings: updatedPackagings,
                status: newOrderStatus,
                deliveryStatus: newDeliveryStatus
            };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
         });
    },

    // ✅ Hủy giao và nhận lại hàng - TRẢ hàng về kho (đã nhận lại từ shipper)
    cancelDelivery: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId, reason: string) => {
        const currentOrder = baseStore.getState().data.find(o => o.systemId === orderSystemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy giao hàng')) {
            return;
        }

         baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            
            // ✅ TRẢ hàng từ "đang giao" về "tồn kho" (hỗ trợ combo - sẽ return SP con)
            order.lineItems.forEach(item => {
                processLineItemStock(item, getBranchId(order), 'return', item.quantity);
            });

            // ✅ Get employee info for canceller
            const employeeData = useEmployeeStore.getState().findById(employeeId as SystemId);

            const updatedPackagings = order.packagings.map(p => 
                p.systemId === packagingSystemId ? { 
                    ...p, 
                    status: 'Hủy đóng gói' as PackagingStatus,
                    deliveryStatus: 'Đã hủy' as OrderDeliveryStatus,
                    cancelReason: `Hủy giao hàng: ${reason}`, 
                    cancelDate: toISODateTime(new Date()),
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employeeData?.fullName || 'Hệ thống',
                } : p
            );
            
            // ✅ Check if all packagings are cancelled, update order status accordingly
            const allCancelled = updatedPackagings.every(p => p.deliveryStatus === 'Đã hủy' || p.status === 'Hủy đóng gói');
            const hasAnyActive = updatedPackagings.some(p => p.deliveryStatus && p.deliveryStatus !== 'Đã hủy' && p.status !== 'Hủy đóng gói');
            
            let newOrderStatus = order.status;
            let newDeliveryStatus = order.deliveryStatus;
            
            if (allCancelled) {
                // All packagings cancelled → order goes back to pending state
                newOrderStatus = 'Đang giao dịch' as OrderMainStatus;
                newDeliveryStatus = 'Chưa giao hàng' as OrderDeliveryStatus;
            } else if (hasAnyActive) {
                // Some packagings still active → keep current delivery status of remaining active packaging
                const activePackaging = updatedPackagings.find(p => p.deliveryStatus && p.deliveryStatus !== 'Đã hủy');
                if (activePackaging?.deliveryStatus) {
                    newDeliveryStatus = activePackaging.deliveryStatus;
                }
            }
            
            const updatedOrder = { 
                ...order, 
                packagings: updatedPackagings,
                status: newOrderStatus,
                deliveryStatus: newDeliveryStatus
            };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
         });
    },

    confirmCodReconciliation: (shipments: (Packaging & { orderSystemId: SystemId })[], employeeId: SystemId) => {
        const { add: addReceipt } = useReceiptStore.getState();
        const { accounts } = useCashbookStore.getState();
        const { data: receiptTypes } = useReceiptTypeStore.getState();
        const employee = useEmployeeStore.getState().findById(employeeId as SystemId);
        const allOrders = baseStore.getState().data;
    
        const totalByPartnerAndBranch: Record<string, { total: number; ids: string[]; branchSystemId: string; branchName: string; partnerName: string; shipmentSystemIds: string[] }> = {};
    
        shipments.forEach(shipment => {
            const order = allOrders.find(o => o.systemId === shipment.orderSystemId);
            if (!order || !shipment.carrier) return;
    
            const key = `${shipment.carrier}-${getBranchId(order)}`;
            if (!totalByPartnerAndBranch[key]) {
                totalByPartnerAndBranch[key] = { total: 0, ids: [], branchSystemId: getBranchId(order), branchName: order.branchName, partnerName: shipment.carrier, shipmentSystemIds: [] };
            }
            totalByPartnerAndBranch[key].total += shipment.codAmount || 0;
            totalByPartnerAndBranch[key].ids.push(shipment.trackingCode || shipment.id);
            totalByPartnerAndBranch[key].shipmentSystemIds.push(shipment.systemId);
        });
    
        const createdReceipts: (Receipt & { shipmentSystemIds: string[] })[] = [];
    
        Object.values(totalByPartnerAndBranch).forEach(group => {
            const account = accounts.find(acc => acc.type === 'bank' && acc.branchSystemId === group.branchSystemId) || accounts.find(acc => acc.type === 'bank');
            const category = receiptTypes.find(c => c.id === 'DOISOATCOD');
            if (account && category) {
                const newReceiptData = {
                    id: '',
                    date: toISODateTime(new Date()),
                    amount: group.total,
                    payerType: 'Đối tác vận chuyển',
                    payerName: group.partnerName,
                    description: `Đối soát COD cho các vận đơn: ${group.ids.join(', ')}`,
                    paymentMethod: 'Chuyển khoản',
                    accountSystemId: account.systemId,
                    originalDocumentId: group.ids.join(', '),
                    createdBy: employee?.fullName || 'N/A',
                    branchSystemId: group.branchSystemId,
                    branchName: group.branchName,
                    paymentReceiptTypeSystemId: category.systemId,
                    paymentReceiptTypeName: category.name,
                    status: 'completed' as const,
                    createdAt: toISODateTime(new Date()),
                    updatedAt: toISODateTime(new Date()),
                    affectsDebt: false,
                };
                const newReceipt = addReceipt(newReceiptData as unknown as Omit<Receipt, 'systemId'>);
                if (newReceipt) {
                    createdReceipts.push({ ...newReceipt, shipmentSystemIds: group.shipmentSystemIds });
                }
            }
        });
    
        baseStore.setState(state => {
            const updates = new Map<string, { newPayments: OrderPayment[]; reconciledShipmentIds: string[] }>();
    
            shipments.forEach(shipment => {
                const receiptForShipment = createdReceipts.find(v => v.shipmentSystemIds.includes(shipment.systemId));
                if (!receiptForShipment || !shipment.codAmount || shipment.codAmount <= 0) return;
    
                const orderSystemId = shipment.orderSystemId;
                const orderUpdates = updates.get(orderSystemId) || { newPayments: [], reconciledShipmentIds: [] };
    
                const newPayment: OrderPayment = {
                    systemId: receiptForShipment.systemId,
                    id: receiptForShipment.id,
                    date: receiptForShipment.date,
                    method: 'Đối soát COD',
                    amount: shipment.codAmount || 0,
                    createdBy: asSystemId('SYSTEM'),
                    description: `Thanh toán COD cho vận đơn ${shipment.trackingCode || shipment.id}`,
                };
                orderUpdates.newPayments.push(newPayment);
                orderUpdates.reconciledShipmentIds.push(shipment.systemId);
                updates.set(orderSystemId, orderUpdates);
            });
    
            if (updates.size === 0) return state;
    
            const newData = state.data.map(order => {
                if (updates.has(order.systemId)) {
                    const orderUpdates = updates.get(order.systemId)!;
                    let updatedOrder = { ...order };

                    updatedOrder.packagings = updatedOrder.packagings.map(p =>
                        orderUpdates.reconciledShipmentIds.includes(p.systemId)
                            ? { ...p, reconciliationStatus: 'Đã đối soát' as const }
                            : p
                    );

                    for (const payment of orderUpdates.newPayments) {
                        updatedOrder = applyPaymentToOrder(updatedOrder, payment);
                    }
    
                    return updatedOrder;
                }
                return order;
            });
    
            return { data: newData };
        });
    },

    // ============================================
    // GHTK INTEGRATION METHODS
    // ============================================

    /**
     * Process GHTK webhook update
     * Called when GHTK pushes status update or from tracking API
     */
    processGHTKWebhook: (webhookData: import('./types').GHTKWebhookPayload) => {
        baseStore.setState(state => {
            // Find order by tracking code or partner_id
            const order = state.data.find(o => 
                o.packagings.some(p => 
                    p.trackingCode === webhookData.label_id || 
                    p.systemId === webhookData.partner_id ||
                    o.systemId === webhookData.partner_id
                )
            );
            
            if (!order) {
                console.warn('[GHTK Webhook] Order not found for:', {
                    label_id: webhookData.label_id,
                    partner_id: webhookData.partner_id
                });
                return state;
            }
            
            // Import status mapping
            const { getGHTKStatusInfo, getGHTKReasonText } = require('../../lib/ghtk-constants');
            
            const statusMapping = getGHTKStatusInfo(webhookData.status_id);
            if (!statusMapping) {
                console.warn('[GHTK Webhook] Unknown status:', webhookData.status_id);
                return state;
            }
            
            console.log('[GHTK Webhook] Processing update:', {
                order: order.id,
                trackingCode: webhookData.label_id,
                statusId: webhookData.status_id,
                statusText: statusMapping.statusText,
                deliveryStatus: statusMapping.deliveryStatus
            });
            
            // Update packaging with new status
            const updatedPackagings = order.packagings.map(p => {
                if (p.trackingCode !== webhookData.label_id && 
                    p.systemId !== webhookData.partner_id) {
                    return p;
                }
                
                return {
                    ...p,
                    deliveryStatus: statusMapping.deliveryStatus,
                    partnerStatus: statusMapping.statusText,
                    ghtkStatusId: webhookData.status_id,
                    ghtkReasonCode: webhookData.reason_code,
                    ghtkReasonText: webhookData.reason 
                        ? webhookData.reason 
                        : (webhookData.reason_code ? getGHTKReasonText(webhookData.reason_code) : undefined),
                    actualWeight: webhookData.weight,
                    actualFee: webhookData.fee,
                    lastSyncedAt: toISODateTime(new Date()),
                    // Update reconciliation status if status = 6 (Đã đối soát)
                    reconciliationStatus: webhookData.status_id === 6 
                        ? 'Đã đối soát' as const 
                        : p.reconciliationStatus,
                    // Update delivered date if status = 5 or 6
                    deliveredDate: [5, 6].includes(webhookData.status_id) && !p.deliveredDate
                        ? toISODateTime(new Date())
                        : p.deliveredDate,
                };
            });
            
            // Handle stock updates based on status
            if (statusMapping.shouldUpdateStock && statusMapping.stockAction) {
                const { dispatchStock, completeDelivery: productCompleteDelivery, returnStockFromTransit } = useProductStore.getState();
                const { incrementFailedDeliveryStats } = useCustomerStore.getState();
                
                // ✅ Expand combo items to child products
                const stockItems = getComboStockItems(order.lineItems);
                
                stockItems.forEach(item => {
                    switch (statusMapping.stockAction) {
                        case 'dispatch':
                            // Status 3: Đã lấy hàng -> Move to transit
                            dispatchStock(item.productSystemId, asSystemId(getBranchId(order)), item.quantity);
                            break;
                        case 'complete':
                            // Status 5: Đã giao hàng -> Complete delivery
                            productCompleteDelivery(item.productSystemId, asSystemId(getBranchId(order)), item.quantity);
                            break;
                        case 'return':
                            // Status -1, 7, 9, 13, 20: Failed/Returned -> Return stock
                            returnStockFromTransit(item.productSystemId, asSystemId(getBranchId(order)), item.quantity);
                            break;
                    }
                });
                
                // ✅ Increment failed delivery stats for customer if return (moved outside loop)
                if (statusMapping.stockAction === 'return') {
                    const failureStatuses = [7, 9, 13, 20, 21];
                    const currentPackaging = order.packagings.find(p => p.trackingCode === webhookData.label_id);
                    const previousStatusId = currentPackaging?.ghtkStatusId;
                    
                    if (failureStatuses.includes(webhookData.status_id) && (!previousStatusId || !failureStatuses.includes(previousStatusId))) {
                        incrementFailedDeliveryStats(order.customerSystemId);
                    }
                }
                
                console.log('[GHTK Webhook] Stock updated:', {
                    action: statusMapping.stockAction,
                    items: stockItems.length
                });
            }
            
            // Determine order-level delivery status
            const allPackagingsDelivered = updatedPackagings.every(p => 
                p.status === 'Hủy đóng gói' || 
                p.deliveryStatus === 'Đã giao hàng'
            );
            
            let newOrderDeliveryStatus = order.deliveryStatus;
            let newOrderStatus = order.status;
            let newCompletedDate = order.completedDate;
            let newStockOutStatus = order.stockOutStatus;
            
            // Update order delivery status
            if (allPackagingsDelivered) {
                newOrderDeliveryStatus = 'Đã giao hàng';
                
                // Auto-complete order if delivered + paid
                if (order.paymentStatus === 'Thanh toán toàn bộ' && order.status !== 'Hoàn thành') {
                    newOrderStatus = 'Hoàn thành';
                    newCompletedDate = toISODateTime(new Date());
                    
                    // Update customer stats
                    const { incrementOrderStats } = useCustomerStore.getState();
                    incrementOrderStats(order.customerSystemId, order.grandTotal);
                    
                    console.log('[GHTK Webhook] Order completed:', order.id);
                }
            } else if (statusMapping.statusId === 3) {
                // Status 3: Đã lấy hàng
                newOrderDeliveryStatus = 'Đang giao hàng';
                newStockOutStatus = 'Xuất kho toàn bộ';
            } else if ([4, 10].includes(statusMapping.statusId)) {
                // Status 4, 10: Đang giao
                newOrderDeliveryStatus = 'Đang giao hàng';
            }
            
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: newOrderDeliveryStatus,
                status: newOrderStatus,
                completedDate: newCompletedDate,
                stockOutStatus: newStockOutStatus,
            };
            
            return {
                data: state.data.map(o => o.systemId === order.systemId ? updatedOrder : o)
            };
        });
    },

    /**
     * Cancel GHTK shipment
     * ⚠️ Chỉ hủy được khi đơn ở trạng thái: 1, 2, 12 (Chưa tiếp nhận, Đã tiếp nhận, Đang lấy hàng)
     */
    cancelGHTKShipment: async (orderSystemId: SystemId, packagingSystemId: SystemId, trackingCode: string) => {
        try {
            console.log('[GHTK] Cancelling shipment:', trackingCode);
            
            // ✅ Lấy credentials từ shipping_partners_config
            const { getGHTKCredentials } = await import('../../lib/utils/get-shipping-credentials');
            let credentials;
            
            try {
                credentials = getGHTKCredentials();
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.';
                return {
                    success: false,
                    message: errorMessage
                };
            }
            
            const response = await fetch(getApiUrl('/shipping/ghtk/cancel-order'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trackingCode,
                    apiToken: credentials.apiToken,
                    partnerCode: credentials.partnerCode,
                }),
            });
            
            const data = await response.json();
            
            // ✅ Kiểm tra response từ GHTK
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to cancel GHTK shipment');
            }
            
            // ✅ GHTK trả success: false khi không thể hủy (đã lấy hàng)
            if (data.success === false) {
                console.log('[GHTK] Cannot cancel:', data.message);
                return { 
                    success: false, 
                    message: data.message || 'Không thể hủy đơn hàng' 
                };
            }
            
            console.log('[GHTK] Cancellation successful:', data.message);
            
            // ✅ CHỈ update state khi GHTK xác nhận hủy thành công
            baseStore.setState(state => {
                const order = state.data.find(o => o.systemId === orderSystemId);
                if (!order) return state;
                
                const updatedPackagings = order.packagings.map(p => {
                    if (p.systemId !== packagingSystemId) return p;
                    
                    return {
                        ...p,
                        status: 'Hủy đóng gói' as PackagingStatus,
                        deliveryStatus: 'Đã hủy' as OrderDeliveryStatus,
                        cancelDate: toISODateTime(new Date()),
                        cancelReason: 'Hủy vận đơn GHTK',
                        ghtkStatusId: -1,
                        partnerStatus: 'Hủy đơn hàng',
                    };
                });
                
                // ✅ KHÔNG rollback stock - để user tự quyết định (nút "Hủy giao và nhận lại hàng")
                
                const updatedOrder = {
                    ...order,
                    packagings: updatedPackagings,
                };
                
                return {
                    data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o)
                };
            });
            
            return { 
                success: true, 
                message: data.message || 'Đã hủy vận đơn GHTK thành công' 
            };
            
        } catch (error) {
            console.error('[GHTK] Cancel error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Lỗi khi hủy vận đơn GHTK';
            return { 
                success: false, 
                message: errorMessage
            };
        }
    },
};

// Auto-allocate historical receipts on startup
useReceiptStore.getState().data.forEach(receipt => {
    autoAllocateReceiptToOrders(receipt);
});

// React to newly created receipts
useReceiptStore.subscribe(
    state => state.data,
    (currentReceipts, previousReceipts) => {
        const previousIds = new Set((previousReceipts ?? []).map(r => r.systemId));
        currentReceipts.forEach(receipt => {
            if (!previousIds.has(receipt.systemId)) {
                autoAllocateReceiptToOrders(receipt);
            }
        });
    }
);


// Export typed hook with all augmented methods
export const useOrderStore = () => {
  const state = baseStore();
  return {
    ...state,
    ...augmentedMethods,
  };
};

// Export getState for non-hook usage
useOrderStore.getState = () => {
  const state = baseStore.getState();
  return {
    ...state,
    ...augmentedMethods,
  };
};
