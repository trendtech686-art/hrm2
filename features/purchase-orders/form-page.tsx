'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSearchParamsWithSetter } from '@/lib/hooks/use-search-params-setter';
import { usePurchaseOrderMutations } from './hooks/use-purchase-orders';
import { usePurchaseOrder } from './hooks/use-purchase-orders';
import { useAllPurchaseOrders } from './hooks/use-all-purchase-orders';
import { ROUTES } from '../../lib/router';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { useAllEmployees } from '../employees/hooks/use-all-employees';
import { useAuth } from '../../contexts/auth-context';
import { useAllProducts, useProductFinder } from '../products/hooks/use-all-products';
import { useAllSuppliers } from '../suppliers/hooks/use-all-suppliers';
import { useInventoryReceiptMutations } from '../inventory-receipts/hooks/use-inventory-receipts';
import { useAllInventoryReceipts } from '../inventory-receipts/hooks/use-all-inventory-receipts';
import { useStockHistoryMutations } from '../stock-history/hooks/use-stock-history';
// REMOVED: Voucher store no longer exists
// import { useVoucherStore } from '../vouchers/store';
import { useAllPaymentTypes } from '../settings/payments/types/hooks/use-all-payment-types';
import { useAllCashAccounts } from '../cashbook/hooks/use-all-cash-accounts';
import { usePaymentMutations } from '../payments/hooks/use-payments';
import type { Payment } from '../payments/types';
import { usePageHeader } from '../../contexts/page-header-context';
import { toast } from 'sonner';
import { getCurrentDate, toISODate, formatDateCustom } from '../../lib/date-utils';
import type { PurchaseOrderPaymentStatus as PaymentStatus, PurchaseOrderStatus, PurchaseOrderDeliveryStatus as DeliveryStatus } from '@/lib/types/prisma-extended';
import { Button } from '../../components/ui/button';
import { SupplierSelectionCard } from './components/supplier-selection-card';
import { OrderInfoCard } from './components/order-info-card';
import {
  ProductSelectionCard,
  type ProductLineItem,
  type CostCalculationMethod,
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
  const router = useRouter();
  
  const purchaseOrderSystemId = systemIdParam ? asSystemId(systemIdParam) : null;
  
  const { data: _allOrders } = useAllPurchaseOrders();
  const { data: existingOrder } = usePurchaseOrder(purchaseOrderSystemId);
  
  const { create, update } = usePurchaseOrderMutations({
    // Không redirect trong callback - để handleSave xử lý tuần tự
    onCreateSuccess: () => {
      // Không redirect ở đây vì cần đợi các operations khác hoàn tất
    },
    onUpdateSuccess: () => {
      // Không redirect ở đây vì cần đợi các operations khác hoàn tất
    },
    onError: (err) => toast.error(err.message)
  });
  
  // Helper function for processing inventory receipt
  const _processInventoryReceipt = React.useCallback((poSystemId: string) => {
    update.mutate({ systemId: poSystemId, data: { deliveryStatus: 'Đã nhập' as DeliveryStatus } });
  }, [update]);
  
  const { data: branches } = useAllBranches();
  const { data: employees } = useAllEmployees();
  const { employee: authEmployee } = useAuth();
  const { data: products } = useAllProducts();
  const { findById: findProductById } = useProductFinder();
  const { data: suppliers } = useAllSuppliers();
  
  // Refs để giữ giá trị mới nhất của data (tránh stale closure)
  const suppliersRef = React.useRef(suppliers);
  const branchesRef = React.useRef(branches);
  const employeesRef = React.useRef(employees);
  React.useEffect(() => {
    suppliersRef.current = suppliers;
    branchesRef.current = branches;
    employeesRef.current = employees;
  }, [suppliers, branches, employees]);
  
  const { data: _allReceipts } = useAllInventoryReceipts();
  const { create: createInventoryReceipt } = useInventoryReceiptMutations({
    onCreateSuccess: () => {},
    onError: (err) => toast.error(err.message)
  });
  const { create: _createStockHistory } = useStockHistoryMutations({
    onSuccess: () => {},
    onError: (err) => toast.error(err.message)
  });
  const { create: createPayment } = usePaymentMutations({
    onCreateSuccess: () => {},
    onError: (err) => toast.error(err.message)
  });
  const { data: paymentTypes } = useAllPaymentTypes();
  const { accounts: _accounts } = useAllCashAccounts();

  const isEditMode = Boolean(purchaseOrderSystemId);
  
  // Copy mode: ?copy=systemId
  const copyFromId = searchParams.get('copy');
  const copyFromSystemId = copyFromId ? asSystemId(copyFromId) : null;
  const copyFromOrder = copyFromSystemId ? _allOrders.find(o => o.systemId === copyFromSystemId) : null;

  // Kiểm tra nếu đơn đã nhập kho thì không cho sửa (theo chuẩn Sapo)
  React.useEffect(() => {
    if (isEditMode && existingOrder && existingOrder.deliveryStatus !== 'Chưa nhập') {
      toast.error('Không thể sửa đơn', {
        description: 'Đơn đã nhập kho không thể sửa. Vui lòng sử dụng chức năng Hoàn trả để điều chỉnh.',
      });
      router.push(`/purchase-orders/${existingOrder.systemId}`);
    }
  }, [isEditMode, existingOrder, router]);

  // Form state
  const [supplierId, setSupplierId] = React.useState<SystemId | null>(
    existingOrder?.supplierSystemId ? asSystemId(existingOrder.supplierSystemId) : null
  );

  // Wrap setSupplierId to add logging
  const handleSetSupplierId = React.useCallback((id: SystemId | null) => {
    setSupplierId(id);
  }, []);


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
  
  // Ref để giữ giá trị mới nhất của branchId
  const branchIdRef = React.useRef<SystemId | null>(branchId);
  React.useEffect(() => {
    branchIdRef.current = branchId;
  }, [branchId]);
  
  // Set branchId mặc định khi branches load xong
  React.useEffect(() => {
    if (!isEditMode && !branchId && branches.length > 0) {
      const defaultBranch = branches.find(b => b.isDefault) || branches[0];
      if (defaultBranch?.systemId) {
        setBranchId(asSystemId(defaultBranch.systemId));
      }
    }
  }, [isEditMode, branchId, branches]);
  
  const defaultEmployeeSystemId: SystemId | null = existingOrder?.buyerSystemId
    ? asSystemId(existingOrder.buyerSystemId)
    : authEmployee?.systemId
    ? asSystemId(authEmployee.systemId)
    : null;
  const [employeeId, setEmployeeId] = React.useState<SystemId | null>(defaultEmployeeSystemId);
  
  // Ref để giữ giá trị mới nhất của employeeId
  const employeeIdRef = React.useRef<SystemId | null>(employeeId);
  React.useEffect(() => {
    employeeIdRef.current = employeeId;
  }, [employeeId]);
  
  // Set employeeId mặc định khi authEmployee load xong
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
  const [costCalculationMethod, setCostCalculationMethod] = React.useState<CostCalculationMethod>('with_fees');
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
  }, [copyFromOrder, isEditMode, findProductById]);

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
  const _totalShippingFees = shippingFees.reduce((sum, fee) => sum + fee.amount, 0);
  const _totalOtherFees = otherFees.reduce((sum, fee) => sum + fee.amount, 0);
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
    const currentBranchId = branchIdRef.current;
    const currentEmployeeId = employeeIdRef.current;
    
    // Validation
    if (!currentSupplierId) {
      toast.error('Lỗi', {
        description: 'Vui lòng chọn nhà cung cấp',
      });
      return;
    }

    if (!currentBranchId) {
      toast.error('Lỗi', {
        description: 'Vui lòng chọn chi nhánh',
      });
      return;
    }

    if (!currentEmployeeId) {
      toast.error('Lỗi', {
        description: 'Vui lòng chọn nhân viên',
      });
      return;
    }

    const branchSystemId: SystemId = currentBranchId;
    const employeeSystemId: SystemId = currentEmployeeId;

    if (currentItems.length === 0) {
      toast.error('Lỗi', {
        description: 'Vui lòng thêm ít nhất một sản phẩm',
      });
      return;
    }

    // Kiểm tra items có giá = 0
    const itemsWithZeroPrice = currentItems.filter(item => item.unitPrice === 0);
    if (itemsWithZeroPrice.length > 0) {
      const itemNames = itemsWithZeroPrice.map(item => item.product.name).join(', ');
      toast.error('Cảnh báo', {
        description: `Các sản phẩm sau chưa có giá: ${itemNames}. Vui lòng nhập giá trước khi lưu.`,
      });
      return;
    }

      setIsSaving(true);

      try {
        // Sử dụng refs để lấy giá trị mới nhất (tránh stale closure)
        const currentSuppliers = suppliersRef.current || [];
        const currentBranches = branchesRef.current || [];
        const currentEmployees = employeesRef.current || [];
        
        const supplier = currentSuppliers.find((s) => s.systemId === currentSupplierId);
        const branch = currentBranches.find((b) => b.systemId === branchSystemId);
        const employee = currentEmployees.find((e) => e.systemId === employeeSystemId);

        // Debug logging

        if (!supplier) {
          console.error('[PO Form] Supplier not found. Available suppliers:', currentSuppliers.map(s => ({ systemId: s.systemId, id: s.id, name: s.name })));
          toast.error('Lỗi', {
            description: 'Không tìm thấy thông tin nhà cung cấp. Vui lòng chọn lại.',
          });
          setIsSaving(false);
          return;
        }

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

        const orderData = {
          id: finalOrderId,
          // API validation cần supplierId
          supplierId: currentSupplierId,
          supplierSystemId: currentSupplierId,
          supplierName: supplier?.name || '',
          branchSystemId,
          branchName: branch?.name || '',
          buyerSystemId: employeeSystemId,
          buyer: employee?.fullName || '',
          reference: reference || undefined,
          orderDate: toISODate(getCurrentDate()),
          expectedDate: deliveryDate ? toISODate(deliveryDate) : undefined,
          deliveryDate: deliveryDate ? toISODate(deliveryDate) : undefined,
          // API validation cần items với productId
          items: currentItems.map((item) => ({
            productId: item.product.systemId, // API dùng productId để tham chiếu
            productSystemId: item.product.systemId,
            productName: item.product.name,
            sku: item.product.id,
            unit: item.product.unit,
            imageUrl: item.product.thumbnailImage ?? item.product.images?.[0],
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            discountType: (item.discountType === 'percent' ? 'percentage' : 'fixed') as 'percentage' | 'fixed',
            taxRate: item.tax || 0,
            total: item.total,
            note: item.notes,
          })),
          lineItems: currentItems.map((item) => {
            const discountTypeValue: 'percentage' | 'fixed' = item.discountType === 'percent' ? 'percentage' : 'fixed';
            return {
              productSystemId: item.product.systemId,
              productId: item.product.id || item.product.systemId,
              productName: item.product.name,
              sku: item.product.id,
              unit: item.product.unit,
              imageUrl: item.product.thumbnailImage ?? item.product.images?.[0],
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              discountType: discountTypeValue,
              taxRate: item.tax || 0,
              note: item.notes,
            };
          }),
          subtotal: calculatedSubtotal,
          discount: currentDiscount,
          discountType: currentDiscountType,
          shippingFee: calculatedShippingFee,
          tax: calculatedTax,
          total: calculatedGrandTotal,
          grandTotal: calculatedGrandTotal,
          notes: notes || undefined,
          status: initialStatus,
          deliveryStatus: deliveryStatus,
          paymentStatus: initialPaymentStatus,
          payments: [],
          creatorSystemId: employeeSystemId,
          creatorName: employee?.fullName || '',
        };


        // Both create and update mutations return the Prisma PurchaseOrder type with similar shape
        // We use const assignment to let TypeScript infer the type correctly
        let createdOrderResult: Awaited<ReturnType<typeof create.mutateAsync>> | Awaited<ReturnType<typeof update.mutateAsync>>;
        if (isEditMode && purchaseOrderSystemId) {
          // Update mode - đợi kết quả để đảm bảo update thành công
          createdOrderResult = await update.mutateAsync({ 
            systemId: purchaseOrderSystemId, 
            data: orderData 
          });
          toast.success('Thành công', {
            description: 'Đã cập nhật đơn nhập hàng',
          });
        } else {
          // Create mode - đợi kết quả để có systemId thực từ DB
          createdOrderResult = await create.mutateAsync(orderData);
          toast.success('Thành công', {
            description: `Đã tạo đơn nhập hàng ${createdOrderResult.id}`,
          });
        }
        // Extract fields we need with proper typing
        const createdOrder = {
          systemId: createdOrderResult.systemId,
          id: createdOrderResult.id,
          supplierSystemId: createdOrderResult.supplierSystemId,
          supplierName: createdOrderResult.supplierName,
          shippingFee: createdOrderResult.shippingFee,
          tax: createdOrderResult.tax,
        };

      // ========================================
      // XỬ LÝ KHI "TẠO & NHẬP HÀNG"
      // ========================================
      if (receiveImmediately && !isEditMode) {
        // ✅ Lấy fees từ order đã create (đảm bảo data consistent)
        // createdOrder đã có shippingFee và tax (chi phí khác) từ DB
        const totalShippingFee = Number(createdOrder.shippingFee) || currentShippingFees.reduce((sum, fee) => sum + fee.amount, 0);
        const totalOtherFees = Number(createdOrder.tax) || currentOtherFees.reduce((sum, fee) => sum + fee.amount, 0);
        
        
        // 1. Tạo phiếu nhập kho và đợi kết quả
        // Note: shippingFee, otherFees, costCalculationMethod are stored in the PurchaseOrder
        // and will be used when calculating inventory costs on the server side
        const receiptData = {
          type: 'PURCHASE' as const,
          branchId: branchSystemId,
          branchSystemId,
          branchName: branch?.name,
          supplierSystemId: createdOrder.supplierSystemId ?? undefined,
          supplierName: createdOrder.supplierName ?? undefined,
          purchaseOrderSystemId: createdOrder.systemId,
          purchaseOrderId: createdOrder.id,
          receiptDate: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
          notes: `Nhập kho tự động khi tạo đơn. Chi phí vận chuyển: ${totalShippingFee}, Chi phí khác: ${totalOtherFees}`,
          createdBy: employee?.systemId,
          items: currentItems.map(item => ({
            productId: item.product.systemId, // use systemId as productId
            productSku: item.product.id || '', // use business id as sku
            productName: item.product.name,
            quantity: item.quantity,
            unitCost: item.unitPrice,
            totalCost: item.quantity * item.unitPrice,
          })),
        };

        // Đợi tạo phiếu nhập kho thành công trước khi update status
        await createInventoryReceipt.mutateAsync(receiptData);

        // Note: Inventory updates and stock history are now handled server-side
        // in the inventory-receipts API, no need to call separately

        // 3. Cập nhật delivery status - đợi để đảm bảo thành công
        await update.mutateAsync({ 
          systemId: createdOrder.systemId, 
          data: { deliveryStatus: 'Đã nhập' as DeliveryStatus } 
        });

        // 4. Xử lý thanh toán nếu có payment records
        if (currentPayments.length > 0) {
          const totalPayments = currentPayments.reduce((sum, p) => sum + p.amount, 0);
          
          // Tạo thanh toán tuần tự để tránh race condition với systemId
          for (const payment of currentPayments) {
            const paymentCategory = paymentTypes.find(pt => pt.name === 'Thanh toán cho đơn nhập hàng');

            const timestamp = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');
            const newPayment = {
              id: '' as Payment['id'], // Let Payment store auto-generate PC-XXXXXX
              date: timestamp,
              amount: payment.amount,
              recipientTypeSystemId: asSystemId('NHACUNGCAP'),
              recipientTypeName: 'Nhà cung cấp',
              recipientName: supplier?.name || '',
              recipientSystemId: supplier?.systemId,
              description: payment.note || `Thanh toán đơn nhập hàng ${finalOrderId}`,
              paymentMethodSystemId: asSystemId(payment.paymentMethodSystemId || 'BANK_TRANSFER'),
              paymentMethodName: payment.paymentMethodName || 'Chuyển khoản',
              accountSystemId: asSystemId(''), // TODO: Add accountSystemId to PaymentRecord
              paymentReceiptTypeSystemId: asSystemId(paymentCategory?.systemId || ''),
              paymentReceiptTypeName: paymentCategory?.name || 'Thanh toán cho đơn nhập hàng',
              branchSystemId: asSystemId(branchSystemId),
              branchName: branch?.name || '',
              createdBy: asSystemId(employee?.systemId || ''),
              createdAt: timestamp,
              status: 'completed' as const,
              category: 'supplier_payment' as const,
              affectsDebt: true,
              // Link to purchase order - use systemId for FK, id for display
              purchaseOrderId: asBusinessId(createdOrder.systemId), // FK reference
              purchaseOrderSystemId: asSystemId(createdOrder.systemId), // Additional linking field
              purchaseOrderBusinessId: asBusinessId(createdOrder.id || ''), // Business ID for display
              originalDocumentId: createdOrder.id || '', // Business ID for matching
            } satisfies Omit<Payment, 'systemId'>;

            await createPayment.mutateAsync(newPayment);
          }

          // Cập nhật payment status
          // Note: payments are stored separately via createPayment.mutateAsync above
          // The paymentStatus field is updated here to reflect the payment state
          const updatedPaymentStatus = totalPayments >= grandTotal ? 'Đã thanh toán' : 'Thanh toán một phần';
          update.mutate({
            systemId: createdOrder.systemId,
            data: {
              paymentStatus: updatedPaymentStatus,
            }
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

        // Note: Chi phí vận chuyển và chi phí khác (trả bên thứ 3) được lưu vào đơn hàng
        // để tính giá vốn, nhưng KHÔNG tự động tạo phiếu chi.
        // Phiếu chi sẽ được tạo riêng khi user thực sự thanh toán cho bên thứ 3.
      }

      // Chuyển đến trang chi tiết đơn vừa tạo/cập nhật
      router.push(`/purchase-orders/${createdOrder.systemId}`);
    } catch (_error) {
      toast.error('Lỗi', {
        description: 'Không thể lưu đơn nhập hàng. Vui lòng thử lại.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Page header with action buttons
  const handleExit = () => {
    
    if (hasUnsavedChanges && !isSaving) {
      if (window.confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn thoát?')) {
        router.push('/purchase-orders');
      }
    } else {
      router.push('/purchase-orders');
    }
  };

  const handleSaveWithoutReceive = () => {
    setHasUnsavedChanges(false); // Reset flag khi save
    handleSave(false);
  };

  const handleSaveWithReceive = () => {
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
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 h-auto lg:h-85">
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
          costCalculationMethod={costCalculationMethod}
          onCostCalculationMethodChange={setCostCalculationMethod}
          totalFees={shippingFees.reduce((sum, f) => sum + f.amount, 0) + otherFees.reduce((sum, f) => sum + f.amount, 0)}
          totalQuantity={totalQuantity}
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
