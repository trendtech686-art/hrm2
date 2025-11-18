import * as React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePurchaseOrderStore } from './store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useProductStore } from '../products/store.ts';
import { useSupplierStore } from '../suppliers/store.ts';
import { useInventoryReceiptStore } from '../inventory-receipts/store.ts';
import { useStockHistoryStore } from '../stock-history/store.ts';
// REMOVED: Voucher store no longer exists
// import { useVoucherStore } from '../vouchers/store.ts';
import { usePaymentTypeStore } from '../settings/payments/types/store.ts';
import { useCashbookStore } from '../cashbook/store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useToast } from '../../hooks/use-toast.ts';
import { getCurrentDate, toISODate, formatDateCustom } from '../../lib/date-utils.ts';
import type { PurchaseOrder, PaymentStatus, PurchaseOrderStatus, DeliveryStatus } from './types.ts';
import { Button } from '../../components/ui/button.tsx';
import { SupplierSelectionCard } from './components/supplier-selection-card.tsx';
import { OrderInfoCard } from './components/order-info-card.tsx';
import {
  ProductSelectionCard,
  type ProductLineItem,
} from './components/product-selection-card.tsx';
import { OrderNotesCard } from './components/order-notes-card.tsx';
import {
  OrderSummaryCard,
  type DiscountType,
  type Fee,
  type PaymentRecord,
} from './components/order-summary-card.tsx';

export function PurchaseOrderFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { add, update, findById, data: allOrders, processInventoryReceipt } = usePurchaseOrderStore();
  const { data: branches } = useBranchStore();
  const { data: employees } = useEmployeeStore();
  const { data: products, updateInventory, findById: findProductById } = useProductStore();
  const { data: suppliers } = useSupplierStore();
  const { data: allReceipts, add: addInventoryReceipt } = useInventoryReceiptStore();
  const { addEntry: addStockHistoryEntry } = useStockHistoryStore();
  const { add: addPayment } = usePaymentStore();
  const { data: paymentTypes } = usePaymentTypeStore();
  const { accounts } = useCashbookStore();

  const isEditMode = Boolean(systemId);
  const existingOrder = isEditMode ? findById(systemId!) : null;
  
  // Copy mode: ?copy=systemId
  const copyFromId = searchParams.get('copy');
  const copyFromOrder = copyFromId ? findById(copyFromId) : null;

  // Kiểm tra nếu đơn đã nhập kho thì không cho sửa (theo chuẩn Sapo)
  React.useEffect(() => {
    if (isEditMode && existingOrder && existingOrder.deliveryStatus !== 'Chưa nhập') {
      toast({
        title: 'Không thể sửa đơn',
        description: 'Đơn đã nhập kho không thể sửa. Vui lòng sử dụng chức năng Hoàn trả để điều chỉnh.',
        variant: 'destructive',
      });
      navigate(`/purchase-orders/${systemId}`);
    }
  }, [isEditMode, existingOrder, navigate, systemId, toast]);

  // Form state
  const [supplierId, setSupplierId] = React.useState<string>(
    existingOrder?.supplierSystemId || ''
  );

  // Wrap setSupplierId to add logging
  const handleSetSupplierId = React.useCallback((id: string) => {
    console.log('=== setSupplierId called with:', id);
    setSupplierId(id);
  }, []);

  console.log('Form render - supplierId state:', supplierId);

  // Use ref to keep latest supplierId value
  const supplierIdRef = React.useRef(supplierId);
  React.useEffect(() => {
    supplierIdRef.current = supplierId;
  }, [supplierId]);

  const [branchId, setBranchId] = React.useState<string>(
    existingOrder?.branchSystemId || (branches[0]?.systemId || '')
  );
  const [employeeId, setEmployeeId] = React.useState<string>(
    existingOrder?.buyerSystemId || (employees[0]?.systemId || '')
  );
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
      setSupplierId(copyFromOrder.supplierSystemId);
      
      // Copy branch và employee
      setBranchId(copyFromOrder.branchSystemId);
      setEmployeeId(copyFromOrder.buyerSystemId);
      
      // Copy delivery date nếu có
      if (copyFromOrder.deliveryDate) {
        setDeliveryDate(new Date(copyFromOrder.deliveryDate));
      }
      
      // Copy line items
      const copiedItems: ProductLineItem[] = copyFromOrder.lineItems
        .map(li => {
          const product = findProductById(li.productSystemId);
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
      toast({
        title: 'Đã sao chép đơn hàng',
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

  const totalQuantity = React.useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const discountAmount =
    discountType === 'percentage' ? (subtotal * discount) / 100 : discount;
  const totalShippingFees = shippingFees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalOtherFees = otherFees.reduce((sum, fee) => sum + fee.amount, 0);
  const grandTotal = subtotal - discountAmount + totalShippingFees + totalOtherFees;

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
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn nhà cung cấp',
        variant: 'destructive',
      });
      return;
    }

    if (!branchId) {
      console.log('Validation failed: No branch');
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn chi nhánh',
        variant: 'destructive',
      });
      return;
    }

    if (!employeeId) {
      console.log('Validation failed: No employee');
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn nhân viên',
        variant: 'destructive',
      });
      return;
    }

    if (currentItems.length === 0) {
      console.log('Validation failed: No items, items.length =', currentItems.length);
      toast({
        title: 'Lỗi',
        description: 'Vui lòng thêm ít nhất một sản phẩm',
        variant: 'destructive',
      });
      return;
    }

    // Kiểm tra items có giá = 0
    const itemsWithZeroPrice = currentItems.filter(item => item.unitPrice === 0);
    if (itemsWithZeroPrice.length > 0) {
      const itemNames = itemsWithZeroPrice.map(item => item.product.name).join(', ');
      console.log('Validation failed: Items with zero price:', itemNames);
      toast({
        title: 'Cảnh báo',
        description: `Các sản phẩm sau chưa có giá: ${itemNames}. Vui lòng nhập giá trước khi lưu.`,
        variant: 'destructive'
      });
      return;
    }

      console.log('All validations passed, starting save...');
      setIsSaving(true);

      try {
        console.log('Building order data...');
        const supplier = suppliers.find((s) => s.systemId === currentSupplierId);
        const branch = branches.find((b) => b.systemId === branchId);
        const employee = employees.find((e) => e.systemId === employeeId);

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
        const calculatedGrandTotal = calculatedSubtotal - calculatedDiscountAmount + calculatedShippingFee + calculatedTax;

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
          branchSystemId: branchId,
          branchName: branch?.name || '',
          buyerSystemId: employeeId,
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
            imageUrl: item.product.images?.[0],
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
          creatorSystemId: employeeId,
          creatorName: employee?.fullName || '',
        };

        console.log('Final order data:', orderData);

        let createdOrder: PurchaseOrder;      if (isEditMode && systemId) {
        console.log('Updating existing order:', systemId);
        update(systemId, { ...orderData, systemId });
        createdOrder = { ...orderData, systemId };
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật đơn nhập hàng',
        });
      } else {
        console.log('Creating new order...');
        createdOrder = add(orderData);
        console.log('Order created:', createdOrder);
        toast({
          title: 'Thành công',
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
          id: '',
          purchaseOrderId: createdOrder.systemId, // ✅ Fixed: Use systemId for foreign key
          supplierSystemId: createdOrder.supplierSystemId,
          supplierName: createdOrder.supplierName,
          receivedDate: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
          receiverSystemId: employeeId,
          receiverName: employee?.fullName || '',
          items: currentItems.map(item => ({
            productSystemId: item.product.systemId,
            productId: item.product.id || item.product.systemId,
            productName: item.product.name,
            orderedQuantity: item.quantity,
            receivedQuantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          notes: 'Nhập kho tự động khi tạo đơn',
        };

        addInventoryReceipt(receiptData);

        // 2. Cập nhật tồn kho + ghi lịch sử
        currentItems.forEach(item => {
          const productBeforeUpdate = findProductById(item.product.systemId);
          const oldStock = productBeforeUpdate?.inventoryByBranch?.[branchId] || 0;
          
          // Cập nhật tồn kho
          updateInventory(item.product.systemId, branchId, item.quantity);

          // Ghi lịch sử kho
          addStockHistoryEntry({
            productId: item.product.id || item.product.systemId,
            date: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
            employeeName: employee?.fullName || '',
            action: 'Nhập hàng từ NCC',
            quantityChange: item.quantity,
            newStockLevel: oldStock + item.quantity,
            documentId: newReceiptId,
            branch: branch?.name || '',
            branchSystemId: branchId,
          });
        });

        // 3. Cập nhật delivery status trong store
        processInventoryReceipt(createdOrder.systemId); // ✅ Fixed: Use systemId

        // 4. Xử lý thanh toán nếu có payment records
        if (currentPayments.length > 0) {
          const totalPayments = currentPayments.reduce((sum, p) => sum + p.amount, 0);
          
          currentPayments.forEach((payment, index) => {
            const paymentCategory = paymentTypes.find(pt => pt.name === 'Thanh toán cho đơn nhập hàng');

            const newPayment: Omit<Payment, 'systemId'> = {
              id: '' as any, // Let Payment store auto-generate PC-XXXXXX
              date: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
              amount: payment.amount,
              recipientType: 'Nhà cung cấp',
              recipientName: supplier?.name || '',
              description: payment.note || `Thanh toán đơn nhập hàng ${finalOrderId}`,
              paymentMethod: payment.paymentMethodName,
              accountSystemId: '', // TODO: Add accountSystemId to PaymentRecord
              paymentReceiptTypeSystemId: paymentCategory?.systemId || '',
              paymentReceiptTypeName: paymentCategory?.name || 'Thanh toán cho đơn nhập hàng',
              branchSystemId: branchId,
              branchName: branch?.name || '',
              createdBy: employee?.fullName || '',
              createdAt: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
              status: 'completed',
              category: 'supplier_payment',
              affectsDebt: true,
            };

            addPayment(newPayment);
          });

          // Cập nhật payment status
          const updatedPaymentStatus = totalPayments >= grandTotal ? 'Đã thanh toán' : 'Thanh toán một phần';
          update(createdOrder.systemId, {
            ...createdOrder,
            paymentStatus: updatedPaymentStatus,
            payments: payments.map((p, idx) => ({
              systemId: `PAY${finalOrderId}${String(idx + 1).padStart(3, '0')}`,
              id: `PAY_${finalOrderId}_${idx + 1}`,
              method: p.paymentMethodName,
              amount: p.amount,
              paymentDate: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd'),
              reference: p.note,
              payerName: employee?.fullName || '',
            })),
          });

          toast({
            title: 'Hoàn tất',
            description: `Đã nhập kho và tạo ${payments.length} phiếu chi`,
          });
        } else {
          toast({
            title: 'Hoàn tất',
            description: `Đã nhập kho ${items.length} sản phẩm`,
          });
        }
      }

      // Chuyển đến trang chi tiết đơn vừa tạo/cập nhật
      navigate(`/purchase-orders/${createdOrder.systemId}`);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu đơn nhập hàng. Vui lòng thử lại.',
        variant: 'destructive',
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

  const actions = [
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

  usePageHeader({ 
    actions,
    title: isEditMode ? "Chỉnh sửa đơn nhập hàng" : "Tạo đơn mua hàng mới"
  });

  return (
    <div className="w-full h-full space-y-4 pb-20 lg:pb-4">
      {/* Row 1: Supplier Info (70%) + Order Info (30%) - Mobile: Stack vertical */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 h-auto lg:h-[340px]">
        <div className="lg:col-span-7 h-full overflow-hidden order-2 lg:order-1">
          <SupplierSelectionCard value={supplierId} onChange={handleSetSupplierId} />
        </div>
        <div className="lg:col-span-3 h-full overflow-hidden order-1 lg:order-2">
          <OrderInfoCard
            branchSystemId={branchId}
            employeeSystemId={employeeId}
            reference={reference}
            orderId={orderId}
            deliveryDate={deliveryDate}
            onBranchChange={setBranchId}
            onEmployeeChange={setEmployeeId}
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
          supplierId={supplierId}
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
              subtotal={subtotal}
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
