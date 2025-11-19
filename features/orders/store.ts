import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { formatDate, formatDateCustom, toISODate, toISODateTime } from '../../lib/date-utils.ts';
import { getApiUrl } from '../../lib/api-config.ts';
import { createCrudStore } from '../../lib/store-factory.ts';
import { data as initialDataOmit } from './data.ts';
import type { Order, OrderPayment, Packaging, OrderMainStatus, OrderDeliveryStatus, PackagingStatus, OrderPaymentStatus, OrderDeliveryMethod } from './types.ts';
import type { SystemId, BusinessId } from '../../lib/id-types.ts';
import { asSystemId, asBusinessId } from '../../lib/id-types.ts';

import { useEmployeeStore } from '../employees/store.ts';
// REMOVED: Voucher store no longer exists - using Payment/Receipt stores instead
import { useProductStore } from '../products/store.ts';
import { useStockHistoryStore } from '../stock-history/store.ts';
import { useCustomerStore } from '../customers/store.ts';
import { useReceiptTypeStore } from '../settings/receipt-types/store.ts';
// REMOVED: import type { Voucher } from '../vouchers/types.ts';
import { useCashbookStore } from '../cashbook/store.ts';
import { useReceiptStore } from '../receipts/store.ts';
import { useSalesReturnStore } from '../sales-returns/store.ts';

// ✅ Helper to get branch systemId
const getBranchId = (order: Order) => order.branchSystemId;

const initialData: Order[] = initialDataOmit.map((o: any, index: number) => {
    const packagings: Packaging[] = [];
    
    if (o.packagingStatus === 'Đóng gói toàn bộ' || o.packagingStatus === 'Chờ xác nhận đóng gói') {
        const hasDeliveryStarted = o.deliveryStatus && o.deliveryStatus !== 'Chờ đóng gói' && o.deliveryStatus !== 'Đã đóng gói';
        const packagingId = `FUN${o.id.substring(2)}`;
        
        const newPkg: Packaging = {
            systemId: asSystemId(`PKG_${o.id}_1`),
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
            newPkg.trackingCode = 'GHN-FUN000001';
            newPkg.deliveredDate = '2025-09-22 14:00';
            newPkg.deliveryMethod = 'Dịch vụ giao hàng';
        }
        
        if (o.id === 'DH000003' && o.deliveryStatus === 'Đã giao hàng') {
            newPkg.trackingCode = `ATSHOP-${packagingId}`;
            newPkg.deliveredDate = '2025-08-01 11:00';
            newPkg.deliveryMethod = 'Nhận tại cửa hàng';
        }

        packagings.push(newPkg);
    }
    
    const { packagingStatus, products, ...rest } = o;

    // Transform products array to lineItems
    const lineItems = (products || []).map((p: any, idx: number) => ({
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
        systemId: `ORD${String(index + 1).padStart(8, '0')}`,
        customerSystemId: `CUST_${index + 1}`, // Generate temp customer systemId
        paidAmount: o.paidAmount ?? 0, // ✅ Use value from data.ts, default to 0 if undefined
        packagings,
        lineItems,
    };
});

const baseStore = createCrudStore<Order>(initialData, 'orders', {
  businessIdField: 'id',
  persistKey: 'hrm-orders',
  getCurrentUser: () => {
    const user = useEmployeeStore.getState().data.find(e => e.systemId === 'NV00000001');
    return user?.systemId;
  }
});

// ✅ MIGRATION: Ensure all orders have paidAmount field (backward compatibility)
baseStore.setState(state => ({
  data: state.data.map(order => ({
    ...order,
    paidAmount: order.paidAmount ?? 0, // Default to 0 if undefined
  }))
}));

const originalAdd = baseStore.getState().add;

baseStore.setState({
    add: (item) => {
        const { commitStock } = useProductStore.getState();
        const newItem = originalAdd(item);
        if (newItem) {
            newItem.lineItems.forEach(li => {
                commitStock(asSystemId(li.productSystemId), asSystemId(newItem.branchSystemId), li.quantity);
            });
        }
        return newItem;
    },
});

const augmentedMethods = {
    cancelOrder: (systemId: SystemId, employeeId: SystemId) => {
        baseStore.setState(state => {
            const orderToCancel = state.data.find(o => o.systemId === systemId);
            if (!orderToCancel || orderToCancel.status === 'Đã hủy' || orderToCancel.status === 'Hoàn thành') {
                return state;
            }

            const { uncommitStock } = useProductStore.getState();
            orderToCancel.lineItems.forEach(item => {
                uncommitStock(asSystemId(item.productSystemId), asSystemId(orderToCancel.branchSystemId), item.quantity);
            });

            const updatedOrder = {
                ...orderToCancel,
                status: 'Đã hủy' as OrderMainStatus,
                cancelledDate: toISODateTime(new Date()),
            };

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
        
        // Get necessary stores for creating a receipt
        const { add: addReceipt } = useReceiptStore.getState();
        const { data: receiptTypes } = useReceiptTypeStore.getState();
        const { accounts } = useCashbookStore.getState();

        const receiptCategory = receiptTypes.find(rt => rt.name === 'Thanh toán cho đơn hàng');
        // Find a suitable cash/bank account in the order's branch
        const account = accounts.find(acc => acc.type === (paymentData.method === 'Tiền mặt' ? 'cash' : 'bank') && acc.branchSystemId === order.branchSystemId) 
                        || accounts.find(acc => acc.type === (paymentData.method === 'Tiền mặt' ? 'cash' : 'bank'));
        
        if (!receiptCategory || !account) {
            console.error("Payment category or cash account not found.", { receiptCategory, account });
            alert("Lỗi: Không tìm thấy loại phiếu thu hoặc tài khoản quỹ phù hợp. Vui lòng kiểm tra cài đặt.");
            return;
        }

        // 1. Create the new Receipt
        const newReceiptData = {
            id: '',
            date: toISODateTime(new Date()),
            amount: paymentData.amount,
            payerType: 'Khách hàng',
            payerName: order.customerName,
            description: `Thanh toán cho đơn hàng ${order.id}`,
            paymentMethod: paymentData.method,
            accountSystemId: account.systemId,
            originalDocumentId: order.systemId,
            createdBy: employee.fullName,
            branchSystemId: order.branchSystemId,
            branchName: order.branchName,
            paymentReceiptTypeSystemId: receiptCategory.systemId,
            paymentReceiptTypeName: receiptCategory.name,
            status: 'completed' as const,
            createdAt: toISODateTime(new Date()),
            updatedAt: toISODateTime(new Date()),
            affectsDebt: true,
        };

        const createdReceipt = addReceipt(newReceiptData as any);

        if (!createdReceipt) {
            console.error("Failed to create receipt.");
            return;
        }

        // 2. Now, update the order state with the created receipt info
        baseStore.setState(state => {
            const orderIndex = state.data.findIndex(o => o.systemId === orderSystemId);
            if (orderIndex === -1) return state;

            const orderToUpdate = state.data[orderIndex];

            // Create the OrderPayment object using data from the *actually created* receipt
            const newPayment: OrderPayment = {
                systemId: createdReceipt.systemId,
                id: createdReceipt.id,
                date: createdReceipt.date,
                amount: createdReceipt.amount,
                method: createdReceipt.paymentMethodName,
                createdBy: asSystemId(createdReceipt.createdBy),
                description: createdReceipt.description,
            };

            const updatedPayments = [...orderToUpdate.payments, newPayment];
            const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
            
            // Consider returned items when calculating debt
            const totalReturnedValue = useSalesReturnStore.getState().data
                .filter(sr => sr.orderSystemId === orderToUpdate.systemId)
                .reduce((sum, sr) => sum + sr.totalReturnValue, 0);
            const actualDebt = orderToUpdate.grandTotal - totalReturnedValue;

            let newPaymentStatus: OrderPaymentStatus = 'Chưa thanh toán';
            if (totalPaid >= actualDebt) {
                newPaymentStatus = 'Thanh toán toàn bộ';
            } else if (totalPaid > 0) {
                newPaymentStatus = 'Thanh toán 1 phần';
            }
            
            let newMainStatus = orderToUpdate.status;
            let newCompletedDate = orderToUpdate.completedDate;
            if (newPaymentStatus === 'Thanh toán toàn bộ' && orderToUpdate.deliveryStatus === 'Đã giao hàng') {
                newMainStatus = 'Hoàn thành';
                newCompletedDate = toISODateTime(new Date());
                
                // Update customer stats when order is completed via payment
                if (orderToUpdate.status !== 'Hoàn thành') {
                    const { incrementOrderStats } = useCustomerStore.getState();
                    incrementOrderStats(orderToUpdate.customerSystemId, orderToUpdate.grandTotal);
                }
            }
            
            const updatedOrder = { 
                ...orderToUpdate, 
                payments: updatedPayments, 
                paymentStatus: newPaymentStatus,
                status: newMainStatus,
                completedDate: newCompletedDate,
            };
            
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
            
            const newPackaging: Packaging = {
                systemId: asSystemId(`PKG_${order.id}_${order.packagings.length + 1}`),
                id: asBusinessId(`FUN${order.id.substring(2)}`),
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
    
            const updatedPackagings = order.packagings.map(p => {
                if (p.systemId === packagingSystemId) {
                    return {
                        ...p,
                        deliveryMethod: 'Nhận tại cửa hàng' as OrderDeliveryMethod,
                        deliveryStatus: 'Đã đóng gói' as OrderDeliveryStatus,
                        trackingCode: `ATSHOP-${p.id}`, // Generate an internal tracking code
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
        
        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) {
                console.error('❌ [confirmInStorePickup] Order not found:', orderSystemId);
                return state;
            }
    
            console.log('📋 [confirmInStorePickup] Order found:', order.id);
            console.log('📋 [confirmInStorePickup] Line items:', order.lineItems.length);
            
            // Stock logic
            const { dispatchStock } = useProductStore.getState();
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
                
                // Get current stock level BEFORE dispatching
                const product = useProductStore.getState().findById(item.productSystemId as SystemId);
                const currentStock = product?.inventoryByBranch?.[getBranchId(order)] || 0;
                const newStockLevel = currentStock - item.quantity;
                
                dispatchStock(asSystemId(item.productSystemId), asSystemId(getBranchId(order)), item.quantity);
                
                // ✅ Add stock history entry for each item with actual stock level
                addStockHistory({
                    date: now,
                    productId: item.productSystemId, // ✅ Use systemId (internal key), not SKU
                    action: 'Xuất kho (Đơn hàng)',
                    quantityChange: -item.quantity, // Negative for stock out
                    newStockLevel: newStockLevel, // Actual stock after dispatching
                    documentId: order.id, // Display ID (DH00001) for reference
                    branchSystemId: getBranchId(order),
                    branch: order.branchName,
                    employeeName: employeeData?.fullName || 'Hệ thống',
                });
            });
    
            // Status update logic
            const updatedPackagings = order.packagings.map(p => {
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
            
            let newStatus = order.status;
            let newCompletedDate = order.completedDate;
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
                stockOutStatus: 'Xuất kho toàn bộ' as const,
                dispatchedDate: toISODateTime(new Date()),
                dispatchedByEmployeeId: employeeId,
                dispatchedByEmployeeName: employee?.fullName,
            };
    
            console.log('✅ [confirmInStorePickup] Stock dispatched successfully');
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },    
    confirmPartnerShipment: async (orderSystemId: SystemId, packagingSystemId: SystemId, shipmentData: any): Promise<{ success: boolean; message: string }> => {
        try {
            const order = baseStore.getState().data.find(o => o.systemId === orderSystemId);
            if (!order) {
                return { success: false, message: 'Không tìm thấy đơn hàng' };
            }

            // ✅ Get GHTK preview params from window (set by ShippingIntegration)
            const ghtkParams = (window as any).__ghtkPreviewParams;
            
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
                            service: result.order.fee ? `${result.order.fee}đ` : 'Standard',
                            trackingCode: trackingCode,
                            shippingFeeToPartner: parseInt(result.order.fee) || 0,
                            codAmount: ghtkParams.pick_money || 0,
                            payer: (ghtkParams.is_freeship === 1 ? 'Người gửi' : 'Người nhận') as 'Người gửi' | 'Người nhận',
                            noteToShipper: ghtkParams.note || '',
                            weight: ghtkParams.weight,
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
        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;

            const { dispatchStock } = useProductStore.getState();
            const { addEntry: addStockHistory } = useStockHistoryStore.getState();
            const employeeData = useEmployeeStore.getState().findById(employeeId as SystemId);
            const now = toISODateTime(new Date());
            
            order.lineItems.forEach(item => {
                // Get current stock level BEFORE dispatching
                const product = useProductStore.getState().findById(item.productSystemId as SystemId);
                const currentStock = product?.inventoryByBranch?.[getBranchId(order)] || 0;
                const newStockLevel = currentStock - item.quantity;
                
                dispatchStock(asSystemId(item.productSystemId), asSystemId(getBranchId(order)), item.quantity);
                
                // ✅ Add stock history entry for each item with actual stock level
                addStockHistory({
                    date: now,
                    productId: item.productSystemId, // ✅ Use systemId (internal key), not SKU
                    action: 'Xuất kho (Đơn hàng)',
                    quantityChange: -item.quantity,
                    newStockLevel: newStockLevel, // Actual stock after dispatching
                    documentId: order.id, // Display ID (DH00001) for reference
                    branchSystemId: getBranchId(order),
                    branch: order.branchName,
                    employeeName: employeeData?.fullName || 'Hệ thống',
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
            };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },

    completeDelivery: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId) => {
        baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            const { completeDelivery: completeProductDelivery } = useProductStore.getState();
             order.lineItems.forEach(item => {
                completeProductDelivery(asSystemId(item.productSystemId), asSystemId(getBranchId(order)), item.quantity);
            });

            const updatedPackagings = order.packagings.map(p => 
                p.systemId === packagingSystemId ? { ...p, deliveryStatus: 'Đã giao hàng' as OrderDeliveryStatus, deliveredDate: toISODateTime(new Date()) } : p
            );
            
            const isAllDelivered = updatedPackagings.every(p => p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            let newStatus = order.status;
            let newCompletedDate = order.completedDate;
            if (isAllDelivered && order.paymentStatus === 'Thanh toán toàn bộ') {
                newStatus = 'Hoàn thành';
                newCompletedDate = toISODateTime(new Date());
                
                // Update customer stats when order is completed (only if not already completed)
                if (order.status !== 'Hoàn thành') {
                    const { incrementOrderStats } = useCustomerStore.getState();
                    incrementOrderStats(order.customerSystemId, order.grandTotal);
                }
            }

            const updatedOrder = { ...order, packagings: updatedPackagings, deliveryStatus: 'Đã giao hàng' as OrderDeliveryStatus, status: newStatus, completedDate: newCompletedDate };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
        });
    },

    failDelivery: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId, reason: string) => {
         baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            const { returnStockFromTransit } = useProductStore.getState();
            order.lineItems.forEach(item => {
                returnStockFromTransit(asSystemId(item.productSystemId), asSystemId(getBranchId(order)), item.quantity);
            });

            const updatedPackagings = order.packagings.map(p => 
                p.systemId === packagingSystemId ? { ...p, deliveryStatus: 'Chờ giao lại' as OrderDeliveryStatus, notes: `Giao thất bại: ${reason}` } : p
            );
            
            const updatedOrder = { ...order, packagings: updatedPackagings, deliveryStatus: 'Chờ giao lại' as OrderDeliveryStatus };
            return { data: state.data.map(o => o.systemId === orderSystemId ? updatedOrder : o) };
         });
    },

    // ✅ Hủy giao hàng - KHÔNG trả hàng về kho (hàng bị thất tung/shipper giữ)
    cancelDeliveryOnly: (orderSystemId: SystemId, packagingSystemId: SystemId, employeeId: SystemId, reason: string) => {
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
         baseStore.setState(state => {
            const order = state.data.find(o => o.systemId === orderSystemId);
            if (!order) return state;
            
            // ✅ TRẢ hàng từ "đang giao" về "tồn kho"
            const { returnStockFromTransit } = useProductStore.getState();
            order.lineItems.forEach(item => {
                returnStockFromTransit(asSystemId(item.productSystemId), asSystemId(getBranchId(order)), item.quantity);
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
    
        const createdReceipts: (any & { shipmentSystemIds: string[] })[] = [];
    
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
                const newReceipt = addReceipt(newReceiptData as any);
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
                    const updatedOrder = { ...order };
    
                    updatedOrder.packagings = updatedOrder.packagings.map(p =>
                        orderUpdates.reconciledShipmentIds.includes(p.systemId)
                            ? { ...p, reconciliationStatus: 'Đã đối soát' as const }
                            : p
                    );
    
                    updatedOrder.payments = [...updatedOrder.payments, ...orderUpdates.newPayments];
    
                    const totalPaid = updatedOrder.payments.reduce((sum, p) => sum + p.amount, 0);

                    // Correctly calculate payment status considering returns
                    const totalReturnedValue = useSalesReturnStore.getState().data
                        .filter(sr => sr.orderSystemId === updatedOrder.systemId)
                        .reduce((sum, sr) => sum + sr.totalReturnValue, 0);
                    const actualDebt = updatedOrder.grandTotal - totalReturnedValue;

                    let newPaymentStatus: OrderPaymentStatus = 'Chưa thanh toán';
                    if (totalPaid >= actualDebt) {
                        newPaymentStatus = 'Thanh toán toàn bộ';
                    } else if (totalPaid > 0) {
                        newPaymentStatus = 'Thanh toán 1 phần';
                    }
                    updatedOrder.paymentStatus = newPaymentStatus;
    
                    if (newPaymentStatus === 'Thanh toán toàn bộ' && updatedOrder.deliveryStatus === 'Đã giao hàng') {
                        updatedOrder.status = 'Hoàn thành';
                        updatedOrder.completedDate = toISODateTime(new Date());
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
                const { dispatchStock, completeDelivery, returnStockFromTransit } = useProductStore.getState();
                
                order.lineItems.forEach(item => {
                    switch (statusMapping.stockAction) {
                        case 'dispatch':
                            // Status 3: Đã lấy hàng -> Move to transit
                            dispatchStock(asSystemId(item.productSystemId), asSystemId(getBranchId(order)), item.quantity);
                            break;
                        case 'complete':
                            // Status 5: Đã giao hàng -> Complete delivery
                            completeDelivery(asSystemId(item.productSystemId), asSystemId(getBranchId(order)), item.quantity);
                            break;
                        case 'return':
                            // Status -1, 7, 9, 13, 20: Failed/Returned -> Return stock
                            returnStockFromTransit(asSystemId(item.productSystemId), asSystemId(getBranchId(order)), item.quantity);
                            break;
                    }
                });
                
                console.log('[GHTK Webhook] Stock updated:', {
                    action: statusMapping.stockAction,
                    items: order.lineItems.length
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
            } catch (error: any) {
                return {
                    success: false,
                    message: error.message || 'Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.'
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
            
        } catch (error: any) {
            console.error('[GHTK] Cancel error:', error);
            return { 
                success: false, 
                message: error.message || 'Lỗi khi hủy vận đơn GHTK' 
            };
        }
    },
};


// Export typed hook with all augmented methods
export const useOrderStore = (): any => {
  const state = baseStore();
  return {
    ...state,
    ...augmentedMethods,
  };
};

// Export getState for non-hook usage
useOrderStore.getState = (): any => {
  const state = baseStore.getState();
  return {
    ...state,
    ...augmentedMethods,
  };
};
