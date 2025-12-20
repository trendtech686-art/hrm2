'use client'

import * as React from 'react';
import { useNavigate, useParams, useSearchParamsWithSetter } from '@/lib/next-compat';
import { usePurchaseOrderStore } from './store';
import { ROUTES } from '../../lib/router';
import { useBranchStore } from '../settings/branches/store';
import { useEmployeeStore } from '../employees/store';
import { useAuth } from '../../contexts/auth-context';
import { useProductStore } from '../products/store';
import { useSupplierStore } from '../suppliers/store';
import { useInventoryReceiptStore } from '../inventory-receipts/store';
import { useStockHistoryStore } from '../stock-history/store';
// REMOVED: Voucher store no longer exists
// import { useVoucherStore } from '../vouchers/store';
import { usePaymentTypeStore } from '../settings/payments/types/store';
import { useCashbookStore } from '../cashbook/store';
import { usePaymentStore } from '../payments/store';
import type { Payment } from '../payments/types';
import { usePageHeader } from '../../contexts/page-header-context';
import { toast } from 'sonner';
import { getCurrentDate, toISODate, formatDateCustom } from '../../lib/date-utils';
import type { PurchaseOrder, PaymentStatus, PurchaseOrderStatus, DeliveryStatus } from './types';
import { Button } from '../../components/ui/button';
import { SupplierSelectionCard } from './components/supplier-selection-card';
import { OrderInfoCard } from './components/order-info-card';
import {
  ProductSelectionCard,
  type ProductLineItem,
} from './components/product-selection-card';
import { OrderNotesCard } from './components/order-notes-card';
import {
  OrderSummaryCard,
  type DiscountType,
  type Fee,
  type PaymentRecord,
} from './components/order-summary-card';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { SystemId } from '@/lib/id-types';

export function PurchaseOrderFormPage() {
  const { systemId: systemIdParam } = useParams<{ systemId: string }>();
  const [searchParams] = useSearchParamsWithSetter();
  const navigate = useNavigate();
  const { add, update, findById, data: allOrders, processInventoryReceipt } = usePurchaseOrderStore();
  const { data: branches } = useBranchStore();
  const { data: employees } = useEmployeeStore();
  const { employee: authEmployee } = useAuth();
  const { data: products, updateInventory, findById: findProductById } = useProductStore();
  const { data: suppliers } = useSupplierStore();
  const { data: allReceipts, add: addInventoryReceipt } = useInventoryReceiptStore();
  const { addEntry: addStockHistoryEntry } = useStockHistoryStore();
  const { add: addPayment } = usePaymentStore();
  const { data: paymentTypes } = usePaymentTypeStore();
  const { accounts } = useCashbookStore();

  const purchaseOrderSystemId = systemIdParam ? asSystemId(systemIdParam) : null;
  const isEditMode = Boolean(purchaseOrderSystemId);
  const existingOrder = purchaseOrderSystemId ? findById(purchaseOrderSystemId) : null;
  
  // Copy mode: ?copy=systemId
  const copyFromId = searchParams.get('copy');
  const copyFromSystemId = copyFromId ? asSystemId(copyFromId) : null;
  const copyFromOrder = copyFromSystemId ? findById(copyFromSystemId) : null;

  // Kiểm tra nếu đơn đã nhập kho thì không cho sửa (theo chuẩn Sapo)
  React.useEffect(() => {
    if (isEditMode && existingOrder && existingOrder.deliveryStatus !== 'Chưa nhập') {
      toast.error('Không thể sửa đơn', {
        description: 'Đơn đã nhập kho không thể sửa. Vui lòng sử dụng chức năng Hoàn trả để điều chỉnh.',
      });
      navigate(`/purchase-orders/${existingOrder.systemId}`);
    }
  }, [isEditMode, existingOrder, navigate, toast]);

  // Form state
  const [supplierId, setSupplierId] = React.useState<SystemId | null>(
    existingOrder?.supplierSystemId ? asSystemId(existingOrder.supplierSystemId) : null
  );

  // Wrap setSupplierId to add logging
  const handleSetSupplierId = React.useCallback((id: SystemId | null) => {
    console.log('=== setSupplierId called with:', id);
    setSupplierId(id);
  }, []);

  console.log('Form render - supplierId state:', supplierId);

  // Use ref to keep latest supplierId value
  const supplierIdRef = React.useRef<SystemId | null>(supplierId);
  React.useEffect(() => {
    supplierIdRef.current = supplierId;
  }, [supplierId]);

  const defaultBranchId: SystemId | null = existingOrder?.branchSystemId
    ? asSystemId(existingOrder.branchSystemId)
    : branches[0]?.systemId
    ? asSystemId(branches[0].systemId)
    : null;
  const [branchId, setBranchId] = React.useState<SystemId | null>(defaultBranchId);
  const defaultEmployeeSystemId: SystemId | null = existingOrder?.buyerSystemId
    ? asSystemId(existingOrder.buyerSystemId)
    : authEmployee?.systemId
    ? asSystemId(authEmployee.systemId)
    : null;
  const [employeeId, setEmployeeId] = React.useState<SystemId | null>(defaultEmployeeSystemId);
  React.useEffect(() => {
    if (!isEditMode && !employeeId && authEmployee?.systemId) {
      setEmployeeId(asSystemId(authEmployee.systemId));
    }
  }, [isEditMode, employeeId, authEmployee]);
  const [reference, setReference] = React.useState<string>(
    existingOrder?.reference || ''
  );
  const [orderId, setOrderId] = React.useState<string>(existingOrder?.id || '');
  const [deliveryDate, setDeliveryDate] = React.useState<Date | undefined>(
    existingOrder?.deliveryDate ? new Date(existingOrder.deliveryDate) : undefined
  );
  const [items, setItems] = React.useState<ProductLineItem[]>([]);
  
  // Use ref to keep latest items value
  const itemsRef = React.useRef(items);
  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  const [notes, setNotes] = React.useState<string>(existingOrder?.notes || '');
  const [tags, setTags] = React.useState<string>('');
  const [discount, setDiscount] = React.useState<number>(0);
  const [discountType, setDiscountType] = React.useState<DiscountType>('fixed');
  const [shippingFees, setShippingFees] = React.useState<Fee[]>([]);
  const [otherFees, setOtherFees] = React.useState<Fee[]>([]);
  const [payments, setPayments] = React.useState<PaymentRecord[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // Use refs to keep latest values
  const shippingFeesRef = React.useRef(shippingFees);
  const otherFeesRef = React.useRef(otherFees);
  const paymentsRef = React.useRef(payments);
  const discountRef = React.useRef(discount);
  const discountTypeRef = React.useRef(discountType);

  React.useEffect(() => {
    shippingFeesRef.current = shippingFees;
    otherFeesRef.current = otherFees;
    paymentsRef.current = payments;
    discountRef.current = discount;
    discountTypeRef.current = discountType;
  }, [shippingFees, otherFees, payments, discount, discountType]);

  // Track changes để cảnh báo khi thoát
  React.useEffect(() => {
    if (!isEditMode && (
      supplierId || 
      items.length > 0 || 
      notes || 
      discount > 0 ||
      shippingFees.length > 0 ||
      otherFees.length > 0 ||
      payments.length > 0
    )) {
      setHasUnsavedChanges(true);
    }
  }, [supplierId, items, notes, discount, shippingFees, otherFees, payments, isEditMode]);

  // Ngăn chặn reload/close tab khi có thay đổi
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isSaving) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, isSaving]);

  // Logic copy từ đơn cũ
  React.useEffect(() => {
    if (copyFromOrder && !isEditMode) {
      console.log('=== Copying from order:', copyFromOrder.id);
      
      // Copy supplier
      setSupplierId(asSystemId(copyFromOrder.supplierSystemId));
      
      // Copy branch và employee
      setBranchId(asSystemId(copyFromOrder.branchSystemId));
      setEmployeeId(asSystemId(copyFromOrder.buyerSystemId));
      
      // Copy delivery date nếu có
      if (copyFromOrder.deliveryDate) {
        setDeliveryDate(new Date(copyFromOrder.deliveryDate));
      }
      
      // Copy line items
      const copiedItems: ProductLineItem[] = copyFromOrder.lineItems
        .map(li => {
          const product = findProductById(asSystemId(li.productSystemId));
          if (!product) return null;
          
          return {
            product,
            quantity: li.quantity,
            unitPrice: li.unitPrice,
            discount: li.discount || 0,
            discountType: li.discountType === 'percentage' ? 'percent' as const : 'fixed' as const,
            tax: li.taxRate || 0,
            total: li.quantity * li.unitPrice,
            notes: li.note,
          } as ProductLineItem;
        })
        .filter((item): item is ProductLineItem => item !== null);
      
      setItems(copiedItems);
      
      // Copy discount
      if (copyFromOrder.discount) {
        setDiscount(copyFromOrder.discount);
        setDiscountType(copyFromOrder.discountType || 'fixed');
      }
      
      // Copy shipping fee
      if (copyFromOrder.shippingFee && copyFromOrder.shippingFee > 0) {
        setShippingFees([{
          id: 'shipping-1',
          name: 'Phí vận chuyển',
          amount: copyFromOrder.shippingFee
        }]);
      }
      
      // Copy tax/other fees
      if (copyFromOrder.tax && copyFromOrder.tax > 0) {
        setOtherFees([{
          id: 'tax-1',
          name: 'Thuế',
          amount: copyFromOrder.tax
        }]);
      }
      
      // Copy notes với prefix
      setNotes(`Sao chép từ đơn ${copyFromOrder.id}\n${copyFromOrder.notes || ''}`);
      
      // Hiện toast thông báo
      toast('Đã sao chép đơn hàng', {
        description: `Dữ liệu từ đơn ${copyFromOrder.id} đã được điền sẵn. Vui lòng kiểm tra lại trước khi lưu.`,
      });
    }
  }, [copyFromOrder, isEditMode, findProductById, toast]);

  // Generate order ID for new orders
  React.useEffect(() => {
    if (!isEditMode && !orderId) {
      setOrderId('');
    }
  }, [isEditMode, orderId]);

  // Load existing order items
  React.useEffect(() => {
    if (existingOrder && existingOrder.lineItems) {
      const loadedItems: ProductLineItem[] = existingOrder.lineItems
        .map((item) => {
          const product = products.find(
            (p) => p.systemId === item.productSystemId
          );
          if (!product) return null;
          return {
            product,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            total: item.quantity * item.unitPrice - item.discount,
          };
        })
        .filter((item): item is ProductLineItem => item !== null);
      setItems(loadedItems);
    }
  }, [existingOrder, products]);

  // Calculate totals
  const subtotal = React.useMemo(
    () => items.reduce((sum, item) => sum + item.total, 0),
    [items]
  );

  const { preTaxSubtotal, totalTax } = React.useMemo(() => {
    return items.reduce((acc, item) => {
      const taxRate = item.tax || 0;
      const itemTotal = item.total;
      const preTax = itemTotal / (1 + taxRate / 100);
      const tax = itemTotal - preTax;
      return {
        preTaxSubtotal: acc.preTaxSubtotal + preTax,
        totalTax: acc.totalTax + tax
      };
    }, { preTaxSubtotal: 0, totalTax: 0 });
  }, [items]);

  const totalQuantity = React.useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const discountAmount =
    discountType === 'percentage' ? (subtotal * discount) / 100 : discount;
  const totalShippingFees = shippingFees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalOtherFees = otherFees.reduce((sum, fee) => sum + fee.amount, 0);
  const grandTotal = subtotal - discountAmount;

  const handleSave = async (receiveImmediately: boolean = false) => {
    // Use ref to get latest values
    const currentSupplierId = supplierIdRef.current;
    const currentItems = itemsRef.current;
    const currentShippingFees = shippingFeesRef.current;
    const currentOtherFees = otherFeesRef.current;
    const currentPayments = paymentsRef.current;
    const currentDiscount = discountRef.current;
    const currentDiscountType = discountTypeRef.current;
    
    console.log('=== handleSave called ===', { 
      receiveImmediately, 
      supplierId: currentSupplierId, 
      branchId, 
      employeeId, 
      itemsCount: currentItems.length,
      shippingFeesCount: currentShippingFees.length,
      otherFeesCount: currentOtherFees.length,
      discount: currentDiscount
    });
    
    // Validation
    if (!currentSupplierId) {
      console.log('Validation failed: No supplier, supplierId =', currentSupplierId);
      toast.error('Lỗi', {
        description: 'Vui lòng chọn nhà cung cấp',
      });
      return;
    }

    if (!branchId) {
      console.log('Validation failed: No branch');
      toast.error('Lỗi', {
        description: 'Vui lòng chọn chi nhánh',
      });
      return;
    }

    if (!employeeId) {
      console.log('Validation failed: No employee');
      toast.error('Lỗi', {
        description: 'Vui lòng chọn nhân viên',
      });
      return;
    }

    const branchSystemId: SystemId = branchId;
    const employeeSystemId: SystemId = employeeId;

    if (currentItems.length === 0) {
      console.log('Validation failed: No items, items.length =', currentItems.length);
      toast.error('Lỗi', {
        description: 'Vui lòng thêm ít nhất một sản phẩm',
      });
      return;
    }

    // Kiểm tra items có giá = 0
    const itemsWithZeroPrice = currentItems.filter(item => item.unitPrice === 0);
    if (itemsWithZeroPrice.length > 0) {
      const itemNames = itemsWithZeroPrice.map(item => item.product.name).join(', ');
      console.log('Validation failed: Items with zero price:', itemNames);
      toast.error('Cảnh báo', {
        description: `Các sản phẩm sau chưa có giá: ${itemNames}. Vui lòng nhập giá trước khi lưu.`,
      });
      return;
    }

      console.log('All validations passed, starting save...');
      setIsSaving(true);

      try {
        console.log('Building order data...');
        const supplier = suppliers.find((s) => s.systemId === currentSupplierId);
        const branch = branches.find((b) => b.systemId === branchSystemId);
        const employee = employees.find((e) => e.systemId === employeeSystemId);

        // Use order ID from state (will be auto-generated if empty)
        const finalOrderId = orderId || '';
        
        // Tính toán tất cả giá trị
        const calculatedSubtotal = currentItems.reduce((sum, item) => {
          const lineGross = item.quantity * item.unitPrice;
          const itemDiscount = item.discountType === 'percent' 
            ? lineGross * (item.discount / 100) 
            : item.discount;
          return sum + (lineGross - itemDiscount);
        }, 0);
        
        const calculatedDiscountAmount = currentDiscountType === 'percentage' 
          ? (calculatedSubtotal * currentDiscount) / 100 
          : currentDiscount;
        
        const calculatedShippingFee = currentShippingFees.reduce((sum, fee) => sum + fee.amount, 0);
        const calculatedTax = currentOtherFees.reduce((sum, fee) => sum + fee.amount, 0);
        const calculatedGrandTotal = calculatedSubtotal - calculatedDiscountAmount;

        console.log('Fee arrays:', {
          shippingFees: currentShippingFees,
          otherFees: currentOtherFees,
          shippingFeesLength: currentShippingFees.length,
          otherFeesLength: currentOtherFees.length
        });
        
        console.log('Calculated values:', {
          subtotal: calculatedSubtotal,
          discount: calculatedDiscountAmount,
          shippingFee: calculatedShippingFee,
          tax: calculatedTax,
          grandTotal: calculatedGrandTotal
        });

        // Tính payment status
        let initialPaymentStatus: PaymentStatus = 'Chưa thanh toán';
        const totalPayments = currentPayments.reduce((sum, p) => sum + p.amount, 0);
        if (totalPayments > 0) {
          if (totalPayments >= calculatedGrandTotal) {
            initialPaymentStatus = 'Đã thanh toán';
          } else {
            initialPaymentStatus = 'Thanh toán một phần';
          }
        }

        // Delivery status luôn là 'Chưa nhập' khi tạo mới (sẽ update sau khi tạo PNK)
        const deliveryStatus: DeliveryStatus = 'Chưa nhập';

        // Tính main status
        let initialStatus: PurchaseOrderStatus;
        // Khi tạo mới, delivery luôn là 'Chưa nhập'
        if (initialPaymentStatus === 'Chưa thanh toán') {
          initialStatus = 'Đặt hàng';
        } else {
          initialStatus = 'Đang giao dịch';
        }

        const orderData: Omit<PurchaseOrder, 'systemId'> = {
          id: finalOrderId,
          supplierSystemId: currentSupplierId,
          supplierName: supplier?.name || '',
          branchSystemId,
          branchName: branch?.name || '',
          buyerSystemId: employeeSystemId,
          buyer: employee?.fullName || '',
          reference: reference || undefined,
          orderDate: toISODate(getCurrentDate()),
          deliveryDate: deliveryDate ? toISODate(deliveryDate) : undefined,
          lineItems: currentItems.map((item) => ({
            productSystemId: item.product.systemId,
            productId: item.product.id || item.product.systemId,
            productName: item.product.name,
            sku: item.product.id,
            unit: item.product.unit,
            imageUrl: item.product.thumbnailImage ?? item.product.images?.[0],
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            discountType: item.discountType === 'percent' ? 'percentage' : 'fixed',
            taxRate: item.tax || 0,
            note: item.notes,
          })),
          subtotal: calculatedSubtotal,
          discount: currentDiscount,
          discountType: currentDiscountType,
          shippingFee: calculatedShippingFee,
          tax: calculatedTax,
          grandTotal: calculatedGrandTotal,
          notes: notes || undefined,
          status: initialStatus,
          deliveryStatus: deliveryStatus,
          paymentStatus: initialPaymentStatus,
          payments: [],
          creatorSystemId: employeeSystemId,
          creatorName: employee?.fullName || '',
        };

        console.log('Final order data:', orderData);

        let createdOrder: PurchaseOrder;
        if (isEditMode && purchaseOrderSystemId) {
          console.log('Updating existing order:', purchaseOrderSystemId);
          update(purchaseOrderSystemId, { ...orderData, systemId: purchaseOrderSystemId });
          createdOrder = { ...orderData, systemId: purchaseOrderSystemId };
          toast.success('Thành công', {
            description: 'Đã cập nhật đơn nhập hàng',
          });
        } else {
          console.log('Creating new order...');
          createdOrder = add(orderData);
          console.log('Order created:', createdOrder);
          toast.success('Thành công', {
            description: `Đã tạo đơn nhập hàng ${finalOrderId}`,
          });
        }

      // ========================================
      // XỬ LÝ KHI "TẠO & NHẬP HÀNG"
      // ========================================
      if (receiveImmediately && !isEditMode) {
        console.log('Processing inventory receipt...');
        // 1. Tạo phiếu nhập kho
        const receiptData = {
          id: asBusinessId(''),
          purchaseOrderSystemId: asSystemId(createdOrder.systemId),
          purchaseOrderId: createdOrder.id ? asBusinessId(createdOrder.id) : asBusinessId(''),
          supplierSystemId: asSystemId(createdOrder.supplierSystemId),
          supplierName: createdOrder.supplierName,
          receivedDate: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
          receiverSystemId: employeeSystemId,
          receiverName: employee?.fullName || '',
          branchSystemId,
          branchName: branch?.name,
          warehouseName: branch?.name ? `Kho ${branch.name}` : undefined,
          items: currentItems.map(item => ({
            productSystemId: item.product.systemId,
            productId: item.product.id,
            productName: item.product.name,
            orderedQuantity: item.quantity,
            receivedQuantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          notes: 'Nhập kho tự động khi tạo đơn',
        };

        const createdReceipt = addInventoryReceipt(receiptData);

        // 2. Cập nhật tồn kho + ghi lịch sử
        currentItems.forEach(item => {
          const productBeforeUpdate = findProductById(item.product.systemId);
          const oldStock = productBeforeUpdate?.inventoryByBranch?.[branchSystemId] || 0;
          
          // Cập nhật tồn kho
          updateInventory(item.product.systemId, branchSystemId, item.quantity);

          // Ghi lịch sử kho
          addStockHistoryEntry({
            productId: item.product.systemId,
            date: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
            employeeName: employee?.fullName || '',
            action: 'Nhập hàng từ NCC',
            quantityChange: item.quantity,
            newStockLevel: oldStock + item.quantity,
            documentId: createdReceipt.id,
            branch: branch?.name || '',
            branchSystemId,
          });
        });

        // 3. Cập nhật delivery status trong store
        processInventoryReceipt(createdOrder.systemId); // ✅ Fixed: Use systemId

        // 4. Xử lý thanh toán nếu có payment records
        if (currentPayments.length > 0) {
          const totalPayments = currentPayments.reduce((sum, p) => sum + p.amount, 0);
          
          currentPayments.forEach((payment, index) => {
            const paymentCategory = paymentTypes.find(pt => pt.name === 'Thanh toán cho đơn nhập hàng');

            const timestamp = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');
            const newPayment: Omit<Payment, 'systemId'> = {
              id: '' as any, // Let Payment store auto-generate PC-XXXXXX
              date: timestamp,
              amount: payment.amount,
              recipientTypeSystemId: 'NHACUNGCAP',
              recipientTypeName: 'Nhà cung cấp',
              recipientName: supplier?.name || '',
              recipientSystemId: supplier?.systemId,
              description: payment.note || `Thanh toán đơn nhập hàng ${finalOrderId}`,
              paymentMethodSystemId: payment.paymentMethodSystemId || 'BANK_TRANSFER',
              paymentMethodName: payment.paymentMethodName || 'Chuyển khoản',
              accountSystemId: '', // TODO: Add accountSystemId to PaymentRecord
              paymentReceiptTypeSystemId: paymentCategory?.systemId || '',
              paymentReceiptTypeName: paymentCategory?.name || 'Thanh toán cho đơn nhập hàng',
              branchSystemId,
              branchName: branch?.name || '',
              createdBy: employee?.fullName || '',
              createdAt: timestamp,
              status: 'completed',
              category: 'supplier_payment',
              affectsDebt: true,
              purchaseOrderSystemId: createdOrder.systemId,
              purchaseOrderId: createdOrder.id,
              originalDocumentId: createdOrder.id,
            } as any;

            addPayment(newPayment);
          });

          // Cập nhật payment status
          const updatedPaymentStatus = totalPayments >= grandTotal ? 'Đã thanh toán' : 'Thanh toán một phần';
          update(createdOrder.systemId, {
            ...createdOrder,
            paymentStatus: updatedPaymentStatus,
            payments: currentPayments.map((p, idx) => ({
              systemId: `PAY${finalOrderId}${String(idx + 1).padStart(3, '0')}`,
              id: `PAY_${finalOrderId}_${idx + 1}`,
              method: p.paymentMethodName,
              amount: p.amount,
              paymentDate: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd'),
              reference: p.note,
              payerName: employee?.fullName || '',
            })),
          });
        }

        // Tính tổng số phiếu chi đã tạo (bao gồm thanh toán NCC + phí vận chuyển + chi phí khác)
        const shippingFeeCount = currentShippingFees.filter(f => f.amount > 0).length;
        const otherFeeCount = currentOtherFees.filter(f => f.amount > 0).length;
        const totalVoucherCount = currentPayments.length + shippingFeeCount + otherFeeCount;

        if (totalVoucherCount > 0) {
          toast.success('Hoàn tất', {
            description: `Đã nhập kho và tạo ${totalVoucherCount} phiếu chi`,
          });
        } else {
          toast.success('Hoàn tất', {
            description: `Đã nhập kho ${currentItems.length} sản phẩm`,
          });
        }

        // 5. Tạo phiếu chi cho Phí vận chuyển và Chi phí khác (Trả bên thứ 3)
        if (currentShippingFees.length > 0 || currentOtherFees.length > 0) {
          const expenseCategory = paymentTypes.find(pt => pt.name === 'Chi phí nhập hàng') || paymentTypes[0];
          const timestamp = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');

          // Tạo phiếu chi cho từng khoản phí vận chuyển
          currentShippingFees.forEach(fee => {
             if (fee.amount <= 0) return;
             const feePayment: Omit<Payment, 'systemId'> = {
              id: '' as any,
              date: timestamp,
              amount: fee.amount,
              recipientTypeSystemId: 'KHAC',
              recipientTypeName: 'Khác',
              recipientName: 'Đơn vị vận chuyển',
              recipientSystemId: '',
              description: `Chi phí vận chuyển cho đơn nhập hàng ${finalOrderId} - ${fee.name}`,
              paymentMethodSystemId: 'CASH', // Mặc định tiền mặt
              paymentMethodName: 'Tiền mặt',
              accountSystemId: '',
              paymentReceiptTypeSystemId: expenseCategory?.systemId || '',
              paymentReceiptTypeName: 'Chi phí nhập hàng',
              branchSystemId,
              branchName: branch?.name || '',
              createdBy: employee?.fullName || '',
              createdAt: timestamp,
              status: 'completed',
              category: 'expense',
              affectsDebt: false,
              purchaseOrderSystemId: createdOrder.systemId,
              purchaseOrderId: createdOrder.id,
              originalDocumentId: createdOrder.id,
            } as any;
            addPayment(feePayment);
          });

          // Tạo phiếu chi cho từng khoản phí khác
          currentOtherFees.forEach(fee => {
             if (fee.amount <= 0) return;
             const feePayment: Omit<Payment, 'systemId'> = {
              id: '' as any,
              date: timestamp,
              amount: fee.amount,
              recipientTypeSystemId: 'KHAC',
              recipientTypeName: 'Khác',
              recipientName: 'Bên thứ 3',
              recipientSystemId: '',
              description: `Chi phí khác cho đơn nhập hàng ${finalOrderId} - ${fee.name}`,
              paymentMethodSystemId: 'CASH', // Mặc định tiền mặt
              paymentMethodName: 'Tiền mặt',
              accountSystemId: '',
              paymentReceiptTypeSystemId: expenseCategory?.systemId || '',
              paymentReceiptTypeName: 'Chi phí nhập hàng',
              branchSystemId,
              branchName: branch?.name || '',
              createdBy: employee?.fullName || '',
              createdAt: timestamp,
              status: 'completed',
              category: 'expense',
              affectsDebt: false,
              purchaseOrderSystemId: createdOrder.systemId,
              purchaseOrderId: createdOrder.id,
              originalDocumentId: createdOrder.id,
            } as any;
            addPayment(feePayment);
          });
        }
      }

      // Chuyển đến trang chi tiết đơn vừa tạo/cập nhật
      navigate(`/purchase-orders/${createdOrder.systemId}`);
    } catch (error) {
      toast.error('Lỗi', {
        description: 'Không thể lưu đơn nhập hàng. Vui lòng thử lại.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Page header with action buttons
  const handleExit = () => {
    console.log('Exit button clicked');
    
    if (hasUnsavedChanges && !isSaving) {
      if (window.confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn thoát?')) {
        navigate('/purchase-orders');
      }
    } else {
      navigate('/purchase-orders');
    }
  };

  const handleSaveWithoutReceive = () => {
    console.log('Tạo & chưa nhập button clicked');
    setHasUnsavedChanges(false); // Reset flag khi save
    handleSave(false);
  };

  const handleSaveWithReceive = () => {
    console.log('Tạo & nhập hàng button clicked');
    setHasUnsavedChanges(false); // Reset flag khi save
    handleSave(true);
  };

  const headerActions = [
    <Button 
      key="exit" 
      type="button" 
      variant="outline" 
      onClick={handleExit} 
      size="sm" 
      className="h-9"
      disabled={isSaving}
    >
      Thoát
    </Button>,
    <Button 
      key="save" 
      type="button" 
      variant="outline" 
      onClick={handleSaveWithoutReceive} 
      size="sm" 
      className="h-9"
      disabled={isSaving}
    >
      {isSaving ? "Đang lưu..." : "Tạo & chưa nhập"}
    </Button>,
    <Button 
      key="save-receive" 
      type="button" 
      onClick={handleSaveWithReceive} 
      size="sm" 
      className="h-9"
      disabled={isSaving}
    >
      {isSaving ? "Đang lưu..." : "Tạo & nhập hàng"}
    </Button>,
  ];

  const headerTitle = isEditMode
    ? `Chỉnh sửa đơn nhập hàng ${existingOrder?.id ?? ''}`.trim()
    : 'Tạo đơn nhập hàng mới';

  usePageHeader({ 
    title: headerTitle,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Đơn nhập hàng', href: ROUTES.PROCUREMENT.PURCHASE_ORDERS, isCurrent: false },
      { label: isEditMode ? 'Chỉnh sửa' : 'Tạo mới', href: isEditMode ? `${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${existingOrder?.systemId}/edit` : `${ROUTES.PROCUREMENT.PURCHASE_ORDER_NEW}`, isCurrent: true }
    ],
    actions: headerActions,
    showBackButton: true,
    backPath: ROUTES.PROCUREMENT.PURCHASE_ORDERS
  });

  return (
    <div className="w-full h-full space-y-4 pb-20 lg:pb-4">
      {/* Row 1: Supplier Info (70%) + Order Info (30%) - Mobile: Stack vertical */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 h-auto lg:h-[340px]">
        <div className="lg:col-span-7 h-full overflow-hidden order-2 lg:order-1">
          <SupplierSelectionCard value={supplierId ?? undefined} onChange={handleSetSupplierId} />
        </div>
        <div className="lg:col-span-3 h-full overflow-hidden order-1 lg:order-2">
          <OrderInfoCard
            branchSystemId={branchId ?? ''}
            employeeSystemId={employeeId ?? ''}
            reference={reference}
            orderId={orderId}
            deliveryDate={deliveryDate}
            onBranchChange={(nextBranchId) =>
              setBranchId(nextBranchId ? asSystemId(nextBranchId) : null)
            }
            onEmployeeChange={(nextEmployeeId) =>
              setEmployeeId(nextEmployeeId ? asSystemId(nextEmployeeId) : null)
            }
            onReferenceChange={setReference}
            onOrderIdChange={setOrderId}
            onDeliveryDateChange={setDeliveryDate}
          />
        </div>
      </div>

        {/* Row 2: Product Selection (100%) */}
        <ProductSelectionCard
          items={items}
          onItemsChange={setItems}
          supplierId={supplierId ?? undefined}
        />

        {/* Row 3: Notes (60%) + Summary (40%) - Mobile: Stack vertical */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <OrderNotesCard
              notes={notes}
              tags={tags}
              onNotesChange={setNotes}
              onTagsChange={setTags}
            />
          </div>
          <div className="lg:col-span-4 order-1 lg:order-2">
            <OrderSummaryCard
              subtotal={preTaxSubtotal}
              tax={totalTax}
              discount={discount}
              discountType={discountType}
              shippingFees={shippingFees}
              otherFees={otherFees}
              totalQuantity={totalQuantity}
              payments={payments}
              onDiscountChange={setDiscount}
              onDiscountTypeChange={setDiscountType}
              onShippingFeesChange={setShippingFees}
              onOtherFeesChange={setOtherFees}
              onPaymentsChange={setPayments}
            />
          </div>
        </div>
        
        {/* Mobile Sticky Footer - Chỉ hiện trên mobile */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t p-4 flex gap-2 z-50 shadow-lg">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleExit}
            className="flex-1"
            disabled={isSaving}
          >
            Thoát
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSaveWithoutReceive}
            className="flex-1"
            disabled={isSaving}
          >
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
          <Button 
            type="button" 
            onClick={handleSaveWithReceive}
            className="flex-1"
            disabled={isSaving}
          >
            {isSaving ? "Đang lưu..." : "Lưu & Nhập"}
          </Button>
        </div>
    </div>
  );
}
