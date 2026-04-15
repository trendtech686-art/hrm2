'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray, Controller, useWatch, FormProvider } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import { toISODateTime } from '../../lib/date-utils';
import { CheckCircle2, AlertTriangle, PackageOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { GHTKService, type GHTKCreateOrderParams } from '../settings/shipping/integrations/ghtk-service';
import { loadShippingConfig } from '../../lib/utils/shipping-config-migration';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';

// Extracted components
import {
  formatCurrency,
  productTypeFallbackLabels,
  ReturnItemRow,
  ReturnTableFooter,
  SalesReturnSummary,
  type FormValues,
} from './form';

// types
import type { LineItem as ExchangeLineItem, PackageInfo } from '@/lib/types/prisma-extended';
import type { Product } from '@/lib/types/prisma-extended';
import { asSystemId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';

// Stores - Optimized: only load what's needed
import { useOrder } from '../orders/hooks/use-orders';
import { useCustomerFinder } from '../customers/hooks/use-all-customers';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { useSalesReturnMutations } from './hooks/use-sales-returns';
import { useAllSalesReturns } from './hooks/use-all-sales-returns';
import { useProductFinder } from '../products/hooks/use-all-products';
import { useProductTypeFinder } from '../settings/inventory/hooks/use-all-product-types';
import { useAllCashAccounts } from '../cashbook/hooks/use-all-cash-accounts';

// UI Components
import { usePageHeader } from '../../contexts/page-header-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Checkbox } from '../../components/ui/checkbox';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { OrderProductSearch } from '../../components/shared/unified-product-search';
import { LineItemsTable } from '../orders/components/line-items-table';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useAllPaymentMethods } from '../settings/payments/hooks/use-all-payment-methods';
import { ProductSelectionDialog } from '../shared/product-selection-dialog';
import { useAllPricingPolicies } from '../settings/pricing/hooks/use-all-pricing-policies';
import { Label } from '../../components/ui/label';
import { ShippingCard } from '../orders/components/shipping-card';
import { ProductTableToolbar } from '../orders/components/product-table-toolbar';
import { useAuth } from '../../contexts/auth-context';
import { ROUTES, generatePath } from '../../lib/router';
import type { BreadcrumbItem } from '../../lib/breadcrumb-system';
import { SalesReturnWorkflowCard } from './components/sales-return-workflow-card';


// Component to handle complex calculations
const _FinancialCalculations = () => {
    // ... existing code ...
    return null; // Deprecated
};

// NOTE: Removed SalesReturnSummary, ProductThumbnailCell, ReturnItemRow, ReturnTableFooter 
// - They are now imported from './form' barrel export

export function SalesReturnFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch order directly from API (not cache-only)
  const { data: order, isLoading: isOrderLoading } = useOrder(systemId);
  const { findById: findCustomer } = useCustomerFinder();
  const customer = order ? findCustomer(order.customerSystemId) : null;
  const { data: branches } = useAllBranches();
  
  // ✅ Optimized: use dedicated hook that only fetches needed data
  const { data: allSalesReturns } = useAllSalesReturns();
  
  const { create: _create } = useSalesReturnMutations({
    onCreateSuccess: () => {
      toast.success('Tạo phiếu trả hàng thành công');
      router.push(ROUTES.SALES.RETURNS);
    },
    onError: (err) => toast.error(err.message)
  });
  const { employee: authEmployee } = useAuth();
  const creatorName = authEmployee?.fullName ?? 'Hệ thống';
  const creatorSystemId = authEmployee?.systemId ?? 'SYSTEM';
  
  // ✅ Optimized: use finder instead of loading all products
  const { findById: findProductById } = useProductFinder();
    
    const { findById: findProductTypeById } = useProductTypeFinder();
  const { accounts: _accounts } = useAllCashAccounts();
  const { data: _paymentMethodsData } = useAllPaymentMethods();
  const { data: pricingPolicies } = useAllPricingPolicies();
  
  // Get default selling price policy
  const defaultSellingPolicy = React.useMemo(
    () => pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault),
    [pricingPolicies]
  );
  
  const [isProductSelectionOpen, setIsProductSelectionOpen] = React.useState(false);
  const [enableSplitLine, setEnableSplitLine] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false); // ✅ Guard to prevent double submission
  const [selectedPricingPolicy, setSelectedPricingPolicy] = React.useState<string | undefined>(
    defaultSellingPolicy?.systemId
  );
  
  // Image preview state
  const [previewState, setPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
    open: false,
    image: '',
    title: ''
  });
  
  // Combo expand state for return items
  const [expandedCombos, setExpandedCombos] = React.useState<Record<string, boolean>>({});
  
  const getProductTypeLabel = React.useCallback((product: Product | null) => {
    if (!product) return 'Hàng hóa';
    if (product.productTypeSystemId) {
      const productType = findProductTypeById(product.productTypeSystemId);
      if (productType?.name) return productType.name;
    }
    return (product.type && productTypeFallbackLabels[product.type]) || 'Hàng hóa';
  }, [findProductTypeById]);
  
  // ✅ Memoize products lookup for ReturnItemRow - only create when needed
  const getProductData = React.useCallback((productSystemId: string) => {
    return findProductById(productSystemId);
  }, [findProductById]);
  
  const handlePreview = React.useCallback((image: string, title: string) => {
    setPreviewState({ open: true, image, title });
  }, []);
  
  const toggleComboRow = React.useCallback((key: string) => {
    setExpandedCombos(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // State cho dialog ghi chú sản phẩm trả
  const [editingReturnNoteIndex, setEditingReturnNoteIndex] = React.useState<number | null>(null);
  const [tempReturnNote, setTempReturnNote] = React.useState('');
  
  // State cho dialog ghi chú sản phẩm đổi
  const [editingExchangeNoteIndex, setEditingExchangeNoteIndex] = React.useState<number | null>(null);
  const [tempExchangeNote, setTempExchangeNote] = React.useState('');
  
  // Sync selectedPricingPolicy when defaultSellingPolicy loads
  React.useEffect(() => {
    if (defaultSellingPolicy && !selectedPricingPolicy) {
      setSelectedPricingPolicy(defaultSellingPolicy.systemId);
    }
  }, [defaultSellingPolicy, selectedPricingPolicy]);

  // ✅ Check if order has been dispatched - redirect if not
  React.useEffect(() => {
    if (!order) return;
    
    const validDispatchStatuses = ['Xuất kho toàn bộ', 'FULLY_STOCKED_OUT', 'Xuất kho một phần', 'PARTIALLY_STOCKED_OUT'];
    const isDispatched = validDispatchStatuses.includes(order.stockOutStatus || '');
    
    if (!isDispatched) {
      toast.error('Không thể tạo phiếu trả hàng cho đơn chưa xuất kho');
      router.push(`/orders/${systemId}`);
    }
  }, [order, router, systemId]);

  const form = useForm<FormValues>({
    defaultValues: {
      branchSystemId: order?.branchSystemId || branches.find(b => b.isDefault)?.systemId || branches[0]?.systemId,
      items: [],
      isReceived: true,
      exchangeItems: [],
      payments: [],
      refundAmount: 0,
      returnAll: false,
      deliveryMethod: 'deliver-later',
      configuration: {},
      packageInfo: { codAmount: 0 },
      grandTotal: 0,
      shippingAddress: customer?.addresses?.find(a => a.isDefaultShipping) || null,
      subtasks: [],
    },
  });

  const { control, handleSubmit, setValue, reset, getValues, setError, formState: { errors: _errors } } = form;

  // ✅ Update exchangeItems prices when pricing policy changes
  const prevPricingPolicyRef = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    // Skip if policy didn't actually change or is first load
    if (!selectedPricingPolicy || prevPricingPolicyRef.current === selectedPricingPolicy) {
      prevPricingPolicyRef.current = selectedPricingPolicy;
      return;
    }
    prevPricingPolicyRef.current = selectedPricingPolicy;
    
    // Get current exchange items and update their prices
    const currentExchangeItems = getValues('exchangeItems');
    if (!currentExchangeItems || currentExchangeItems.length === 0) return;
    
    currentExchangeItems.forEach((item, index) => {
      const product = findProductById(item.productSystemId);
      if (product?.prices) {
        const newPrice = product.prices[selectedPricingPolicy] ?? product.prices[Object.keys(product.prices)[0]] ?? 0;
        setValue(`exchangeItems.${index}.unitPrice`, newPrice, { shouldDirty: true });
      }
    });
  }, [selectedPricingPolicy, findProductById, getValues, setValue]);

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const { fields: exchangeFields, append: appendExchange, remove: removeExchange } = useFieldArray({
    control,
    name: "exchangeItems",
  });

  // Handlers cho dialog ghi chú sản phẩm trả
  const handleOpenReturnNoteDialog = React.useCallback((index: number) => {
    const currentNote = getValues(`items.${index}.note`) || '';
    setTempReturnNote(currentNote);
    setEditingReturnNoteIndex(index);
  }, [getValues]);

  const handleSaveReturnNote = React.useCallback(() => {
    if (editingReturnNoteIndex !== null) {
      setValue(`items.${editingReturnNoteIndex}.note`, tempReturnNote.trim(), { shouldDirty: true });
      setEditingReturnNoteIndex(null);
      setTempReturnNote('');
    }
  }, [editingReturnNoteIndex, tempReturnNote, setValue]);

  // Handlers cho dialog ghi chú sản phẩm đổi
  const _handleOpenExchangeNoteDialog = React.useCallback((index: number) => {
    const currentNote = getValues(`exchangeItems.${index}.note`) || '';
    setTempExchangeNote(currentNote);
    setEditingExchangeNoteIndex(index);
  }, [getValues]);

  const handleSaveExchangeNote = React.useCallback(() => {
    if (editingExchangeNoteIndex !== null) {
      setValue(`exchangeItems.${editingExchangeNoteIndex}.note`, tempExchangeNote.trim(), { shouldDirty: true });
      setEditingExchangeNoteIndex(null);
      setTempExchangeNote('');
    }
  }, [editingExchangeNoteIndex, tempExchangeNote, setValue]);
  
   const returnableQuantities = React.useMemo(() => {
    if (!order) return {};
    const returnsForThisOrder = allSalesReturns.filter(pr => pr.orderSystemId === order.systemId);
    
    const quantities: Record<string, number> = {};
    order.lineItems.forEach(item => {
        // ✅ Dùng productId hoặc productSystemId (API trả về productId chứa systemId từ DB)
        const productKey = item.productSystemId || item.productId;
        const totalReturned = returnsForThisOrder.reduce((sum, sr) => {
            const returnItem = sr.items.find(i => i.productSystemId === productKey);
            return sum + (returnItem ? returnItem.returnQuantity : 0);
        }, 0);
        quantities[productKey] = item.quantity - totalReturned;
    });
    return quantities;
  }, [order, allSalesReturns]);

  // ✅ Stable ref for returnableQuantities to use in useEffect
  const returnableQuantitiesRef = React.useRef(returnableQuantities);
  returnableQuantitiesRef.current = returnableQuantities;

  // ✅ Track initialization to prevent infinite loops
  const isInitializedRef = React.useRef(false);
  
  React.useEffect(() => {
      // ✅ Wait for all data to be loaded before initializing
      if (!order || !branches.length || allSalesReturns === undefined) return;
      
      // ✅ Only initialize once to prevent infinite loops
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;
      
      // Map items từ đơn hàng - ✅ bao gồm thumbnailImage từ product
      const initialItems = order.lineItems.map(item => {
          // ✅ Dùng productSystemId hoặc productId (API trả về productId chứa systemId từ DB)
          const productKey = (item.productSystemId || item.productId) as string;
          return {
              productSystemId: asSystemId(productKey),
              productId: item.productId,
              productName: item.productName,
              orderedQuantity: item.quantity,
              returnableQuantity: returnableQuantities[productKey] || 0,
              returnQuantity: 0,
              unitPrice: item.unitPrice,
              originalUnitPrice: item.unitPrice,
              totalValue: 0,
              note: item.note || '', // Lấy ghi chú từ đơn hàng
              thumbnailImage: (item as { product?: { thumbnailImage?: string; imageUrl?: string } }).product?.thumbnailImage || (item as { product?: { imageUrl?: string } }).product?.imageUrl,
          };
      });
      
      // Lấy chi nhánh từ đơn hàng, nếu không có thì lấy default
      const branchSystemId = order.branchSystemId || branches.find(b => b.isDefault)?.systemId || branches[0]?.systemId;
      
      // ✅ Lấy địa chỉ giao hàng: ưu tiên từ đơn hàng gốc, fallback sang customer
      const orderShippingAddress = order.shippingAddress;
      const customerDefaultAddr = customer?.addresses?.find(a => a.isDefaultShipping);
      // Cast to FormValues shippingAddress type - using explicit any to bypass complex type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shippingAddress = (orderShippingAddress || customerDefaultAddr || null) as any;
      
      // Reset form với data mới
      reset({
          branchSystemId,
          items: initialItems,
          isReceived: true,
          exchangeItems: [],
          payments: [],
          refunds: [],
          returnAll: false,
          deliveryMethod: 'deliver-later',
          configuration: {},
          packageInfo: { codAmount: 0 },
          grandTotal: 0,
          shippingAddress,
          subtasks: [],
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, branches, allSalesReturns]);
  
  // ✅ NOTE: Removed auto-update shipping address from customer
  // - Shipping address should come from ORDER first, not customer
  
  const watchIsReceived = useWatch({ control, name: "isReceived" }) ?? true;
  
  // Helper to calculate financials for submission
  const calculateFinancials = (values: FormValues) => {
      const returnItems = values.items;
      const exchangeItems = values.exchangeItems;
      
      const totalReturnValue = returnItems.reduce((sum, item) => sum + ((item.returnQuantity || 0) * (item.unitPrice || 0)), 0);
      const subtotalExchangeValue = exchangeItems.reduce((sum, item) => sum + (item.total || 0), 0);
      
      const orderDiscount = values.orderDiscount || 0;
      const orderDiscountType = values.orderDiscountType || 'fixed';
      const shippingFee = values.shippingFee || 0;
      
      const orderDiscountValue = orderDiscountType === 'percentage'
          ? (subtotalExchangeValue * orderDiscount) / 100
          : orderDiscount;
          
      const totalExchangeValue = subtotalExchangeValue - orderDiscountValue + shippingFee;
      const finalAmount = totalExchangeValue - totalReturnValue;
      
      // Max refundable - ✅ Convert Decimal string to Number
      const totalPaidOnOriginalOrder = order ? order.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) : 0;
      const previousReturnsForOrder = order ? allSalesReturns.filter(sr => sr.orderSystemId === order.systemId) : [];
      const totalReturnedValuePreviously = previousReturnsForOrder.reduce((sum, sr) => sum + (Number(sr.totalReturnValue) || 0), 0);
      const totalRefundedPreviously = previousReturnsForOrder.reduce((sum, sr) => sum + (Number(sr.refundAmount) || 0), 0);
      
      const valueOfGoodsKept = (Number(order?.grandTotal) || 0) - totalReturnedValuePreviously - totalReturnValue;
      const netPaid = totalPaidOnOriginalOrder - totalRefundedPreviously;
      const potentialRefund = netPaid - valueOfGoodsKept;
      const maxRefundableAmount = Math.max(0, potentialRefund);
      
      return { finalAmount, maxRefundableAmount, totalReturnValue, totalExchangeValue, subtotalExchangeValue };
  };


    const backDestination = React.useMemo(() => (
        order ? generatePath(ROUTES.SALES.ORDER_VIEW, { systemId: order.systemId }) : ROUTES.SALES.ORDERS
    ), [order]);

    const headerActions = React.useMemo(() => [
        <Button
            key="cancel"
            variant="outline"
            type="button"
            className="h-9 px-4"
            onClick={() => router.push(backDestination)}
        >
            Thoát
        </Button>,
        <Button
            key="submit"
            type="submit"
            form="sales-return-form"
            className="h-9 px-4"
            disabled={isSubmitting}
            onClick={() => {
                // Fallback: manually trigger form submit if form attribute doesn't work
                const formEl = document.getElementById('sales-return-form') as HTMLFormElement;
                if (formEl) {
                    formEl.requestSubmit();
                }
            }}
        >
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang xử lý...</> : 'Hoàn trả'}
        </Button>
    ], [router, backDestination, isSubmitting]);

    const breadcrumb = React.useMemo<BreadcrumbItem[]>(() => {
        const items: BreadcrumbItem[] = [
            { label: 'Trang chủ', href: ROUTES.ROOT },
            { label: 'Đơn hàng', href: ROUTES.SALES.ORDERS },
        ];
        if (order) {
            items.push({
                label: order.id,
                href: generatePath(ROUTES.SALES.ORDER_VIEW, { systemId: order.systemId }),
            });
        } else {
            items.push({ label: 'Chi tiết', href: ROUTES.SALES.ORDERS });
        }
        items.push({ label: 'Tạo phiếu trả', href: ROUTES.SALES.RETURNS, isCurrent: true });
        return items;
    }, [order]);

    const pageHeaderConfig = React.useMemo(() => ({
        title: order ? `Tạo phiếu trả cho ${order.id}` : 'Tạo phiếu trả hàng',
        subtitle: undefined, // Removed subtitle per UX requirement
        breadcrumb,
        showBackButton: true,
        backPath: backDestination,
        actions: headerActions,
    }), [order, backDestination, headerActions, breadcrumb]);

    usePageHeader(pageHeaderConfig);

  // Loading state
  if (!branches.length || isOrderLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center space-y-4">
          <PackageOpen className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">Không tìm thấy đơn hàng</h2>
          <p className="text-muted-foreground">Đơn hàng {systemId} không tồn tại hoặc đã bị xóa.</p>
          <Button variant="outline" onClick={() => router.push('/orders')}>
            ← Quay về danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  // Note: Customer can be null for "Khách lẻ" orders - we allow this
  
  const handleSelectProducts = (selectedProducts: Product[]) => {
      const currentItems = getValues('exchangeItems') || [];
      
      selectedProducts.forEach(product => {
          const policyId = selectedPricingPolicy || defaultSellingPolicy?.systemId;
          const price = (policyId && product.prices?.[policyId]) 
              ? product.prices[policyId]
              : (Object.values(product.prices || {})[0] || 0);
          
          // If split line is disabled, try to find existing item and increase quantity
          if (!enableSplitLine) {
              const existingIndex = currentItems.findIndex(item => item.productSystemId === product.systemId);
              
              if (existingIndex > -1) {
                  const currentItem = getValues(`exchangeItems.${existingIndex}`);
                  const updatedQuantity = (Number(currentItem.quantity) || 0) + 1;
                  const updatedTotal = price * updatedQuantity - (currentItem.discount || 0);
                  
                  setValue(`exchangeItems.${existingIndex}.quantity`, updatedQuantity);
                  setValue(`exchangeItems.${existingIndex}.total`, updatedTotal);
                  return; // Skip adding new line
              }
          }
          
          // Add as new line (either split line is enabled, or product doesn't exist yet)
          appendExchange({
              productSystemId: product.systemId,
              productId: product.id,
              productName: product.name,
              quantity: 1,
              unitPrice: price,
              discount: 0,
              discountType: 'fixed',
              total: price,
          });
      });
  };

  const _handleAddProduct = (_values: ExchangeLineItem) => {
      // Note: This function is deprecated. Use appendExchangeItem directly
      // addProduct expects Product, not LineItem
  };

  const onSubmit = async (values: FormValues) => {
    if (!order) return;
    
    // ✅ Prevent double submission
    if (isSubmitting) {
        return;
    }
    
    setIsSubmitting(true);

    const branch = branches.find(b => b.systemId === values.branchSystemId);
        if (!branch) {
            setError('branchSystemId', { message: 'Chi nhánh không hợp lệ' });
            setIsSubmitting(false);
            return;
        }

        const returnItems = values.items.filter(i => i.returnQuantity > 0);
        if (returnItems.length === 0 && values.exchangeItems.length === 0) {
          toast.error('Vui lòng chọn sản phẩm để trả hoặc đổi.');
          setIsSubmitting(false);
          return;
        }
        
        // ✅ CRITICAL: Validate return quantities BEFORE calling any external API (like GHTK)
        // This prevents creating GHTK orders for invalid sales returns
        for (const item of returnItems) {
            const returnableQty = item.returnableQuantity ?? item.orderedQuantity ?? 0;
            if (item.returnQuantity > returnableQty) {
                const alreadyReturned = (item.orderedQuantity ?? 0) - returnableQty;
                toast.error('Lỗi tạo phiếu trả hàng', {
                    description: `Sản phẩm "${item.productName}" chỉ còn có thể trả ${returnableQty} (đã trả ${alreadyReturned}/${item.orderedQuantity})`,
                });
                setIsSubmitting(false);
                return;
            }
            if (returnableQty <= 0 && item.returnQuantity > 0) {
                toast.error('Lỗi tạo phiếu trả hàng', {
                    description: `Sản phẩm "${item.productName}" đã được trả hết, không thể trả thêm.`,
                });
                setIsSubmitting(false);
                return;
            }
        }
        
        // Calculate financials
        const { finalAmount, maxRefundableAmount, totalReturnValue, totalExchangeValue, subtotalExchangeValue } = calculateFinancials(values);

        // ✅ Validate refunds when finalAmount < 0 AND customer has actually paid
        // Nếu khách chưa thanh toán (maxRefundableAmount = 0), không cần bắt buộc hoàn tiền
        const requiredRefundAmount = Math.min(Math.abs(finalAmount), maxRefundableAmount);
        
    if (finalAmount < 0 && requiredRefundAmount > 0.01) {
        const totalRefunded = (values.refunds || []).reduce((sum, r) => sum + (r.amount || 0), 0);
        const remainingRefund = requiredRefundAmount - totalRefunded;
        
        if (remainingRefund > 0.01) {
            toast.error(`Còn phải hoàn trả khách: ${formatCurrency(remainingRefund)}. Vui lòng thêm phương thức hoàn tiền.`);
            setIsSubmitting(false);
            return;
        }
        
        // Validate each refund has method and account
        for (let i = 0; i < values.refunds.length; i++) {
            const refund = values.refunds[i];
            if (!refund.method) {
                toast.error(`Vui lòng chọn phương thức hoàn tiền cho dòng ${i + 1}`);
                setIsSubmitting(false);
                return;
            }
            if (!refund.accountSystemId) {
                toast.error(`Vui lòng chọn tài khoản quỹ cho dòng ${i + 1}`);
                setIsSubmitting(false);
                return;
            }
            if (!refund.amount || refund.amount <= 0) {
                toast.error(`Vui lòng nhập số tiền hoàn cho dòng ${i + 1}`);
                setIsSubmitting(false);
                return;
            }
        }
    }
    
    // ✅ Validate payment - allow partial payment (customer can pay the rest later on exchange order)
    // Only show warning, don't block submission
    if (finalAmount > 0 && values.payments && values.payments.length > 0) {
        const totalPaymentAmount = values.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        if (totalPaymentAmount > finalAmount) {
            toast.error(`Số tiền thanh toán (${formatCurrency(totalPaymentAmount)}) vượt quá số tiền cần thu (${formatCurrency(finalAmount)}). Vui lòng kiểm tra lại.`);
            setIsSubmitting(false);
            return;
        }
        // Allow partial payment - remaining will be collected on exchange order
        if (totalPaymentAmount < finalAmount) {
            // Partial payment - remaining will be COD on exchange order
        }
    }

    const returnPayload = {
        orderSystemId: order.systemId,
        orderId: order.id,
        customerSystemId: customer?.systemId || order.customerSystemId,
        customerName: customer?.name || order.customerName || 'Khách lẻ',
        branchSystemId: asSystemId(values.branchSystemId),  // ✅ Đúng tên field: branchSystemId
        branchName: branch.name,
        returnDate: toISODateTime(new Date()),
        reason: values.returnReason || values.notes,
        notes: values.notes,
        reference: values.reference,
        items: returnItems.map(({ total: _total, returnableQuantity: _returnableQuantity, orderedQuantity: _orderedQuantity, originalUnitPrice: _originalUnitPrice, ...rest }) => ({
            ...rest, 
            totalValue: rest.returnQuantity * rest.unitPrice,
            note: rest.note?.trim() || undefined,
        })),
        totalReturnValue,
        isReceived: values.isReceived, // ✅ Pass isReceived flag to control inventory update
        exchangeItems: values.exchangeItems.map(({ total: _total, ...rest }) => rest),
        subtotalNew: subtotalExchangeValue, // ✅ Use subtotal (before discount & shipping)
        shippingFeeNew: values.shippingFee || 0,
        grandTotalNew: totalExchangeValue, // ✅ Total after discount & shipping)
        finalAmount,
        payments: finalAmount > 0 ? values.payments?.map(p => ({ ...p, accountSystemId: asSystemId(p.accountSystemId) })) : undefined,
        refunds: finalAmount < 0 ? values.refunds?.map(r => ({ ...r, accountSystemId: asSystemId(r.accountSystemId) })) : undefined, // ✅ Use new refunds array
        creatorName,
        creatorId: creatorSystemId,
        creatorSystemId: asSystemId(creatorSystemId as string), // ✅ Also pass creatorSystemId for SalesReturn type
        // ✅ Pass shipping info for exchange order
        deliveryMethod: values.deliveryMethod,
        shippingPartnerId: values.shippingPartnerId,
        shippingServiceId: values.shippingServiceId,
        shippingAddress: values.shippingAddress ?? undefined,
        packageInfo: values.packageInfo as unknown as PackageInfo | undefined,
        configuration: values.configuration,
    };
    
    
    // ✅ Call GHTK API if using GHTK shipping partner
    
    const isUsingShippingPartner = values.deliveryMethod === 'deliver-later' || values.deliveryMethod === 'shipping-partner';
    
    if (isUsingShippingPartner && values.shippingPartnerId === 'GHTK' && values.exchangeItems.length > 0) {
        
        try {
            // Load shipping config
            const shippingConfig = loadShippingConfig();
            const ghtkData = shippingConfig.partners.GHTK;
            
            if (!ghtkData || !ghtkData.accounts || ghtkData.accounts.length === 0) {
                toast.error('Lỗi cấu hình', { description: 'Chưa cấu hình tài khoản GHTK' });
                setIsSubmitting(false);
                return;
            }
            
            const ghtkAccount = ghtkData.accounts.find(a => a.isDefault && a.active)
                || ghtkData.accounts.find(a => a.active)
                || ghtkData.accounts[0];
            
            if (!ghtkAccount || !ghtkAccount.active) {
                toast.error('Lỗi cấu hình', { description: 'Không tìm thấy tài khoản GHTK khả dụng' });
                setIsSubmitting(false);
                return;
            }
            
            const apiToken = ghtkAccount.credentials.apiToken as string;
            const partnerCode = ghtkAccount.credentials.partnerCode as string;
            
            if (!apiToken) {
                toast.error('Lỗi cấu hình', { description: 'Thiếu API Token GHTK' });
                setIsSubmitting(false);
                return;
            }

            // Build GHTK request body from form data
            // ✅ customer already available from findCustomer() above
            
            // ✅ Use shipping address from FORM, not from original order
            const shippingAddress = values.shippingAddress;
            
            
            if (!shippingAddress) {
                toast.error('Thiếu thông tin giao hàng', { 
                    description: 'Vui lòng cấu hình đầy đủ thông tin vận chuyển GHTK trước khi tạo đơn' 
                });
                setIsSubmitting(false);
                return;
            }

            // Build full address: Try all possible address fields
            // Address may be split across: street, address, fullAddress, houseNumber, etc.
            const shippingAddrAny = shippingAddress as Record<string, unknown>;
            
            // ✅ Get phone number: Try multiple field names
            const customerPhone = (shippingAddrAny.phone as string) || 
                                  (shippingAddrAny.contactPhone as string) || 
                                  (shippingAddrAny.tel as string) ||
                                  customer?.phone || 
                                  order.customerPhone ||
                                  '';
            
            if (!customerPhone) {
                toast.error('Lỗi tạo đơn GHTK', { 
                    description: 'Vui lòng nhập số điện thoại người nhận hàng hóa' 
                });
                setIsSubmitting(false);
                return;
            }
            
            const addressParts = [
                shippingAddrAny.houseNumber as string | undefined,
                shippingAddrAny.street as string | undefined,
                shippingAddrAny.address as string | undefined,
                shippingAddrAny.fullAddress as string | undefined,
            ].filter(Boolean) as string[];
            
            const customerAddress: string = addressParts.length > 0 
                ? addressParts.join(', ')
                : ((shippingAddrAny.address || shippingAddrAny.street || shippingAddrAny.fullAddress || '') as string);
            
            
            if (!customerAddress || !shippingAddress.province || !shippingAddress.district || !shippingAddress.ward) {
                toast.error('Thiếu thông tin địa chỉ', { 
                    description: 'Vui lòng nhập đầy đủ địa chỉ chi tiết, tỉnh/thành, quận/huyện, phường/xã' 
                });
                setIsSubmitting(false);
                return;
            }

            // Build products array from exchange items
            const ghtkProducts = values.exchangeItems.map(item => {
                const productData = findProductById(item.productSystemId);
                return {
                    name: productData?.name || item.productName || 'Sản phẩm',
                    weight: productData?.weight || 100, // Keep in grams (don't divide by 1000)
                    quantity: item.quantity,
                    price: item.unitPrice || 0,
                };
            });

            // Get pickup info from GHTK account settings
            const pickupAddress = (ghtkAccount.pickupAddresses as Array<{
                partnerWarehouseName?: string;
                partnerWarehouseAddress?: string;
                partnerWarehouseTel?: string;
                partnerWarehouseProvince?: string;
                partnerWarehouseDistrict?: string;
                partnerWarehouseWard?: string;
            }>)?.[0]; // Use first pickup address
            if (!pickupAddress) {
                toast.error('Lỗi cấu hình', { 
                    description: 'Chưa cấu hình địa chỉ lấy hàng GHTK' 
                });
                setIsSubmitting(false);
                return;
            }

            const ghtkParams: GHTKCreateOrderParams = {
                // ✅ Unique order ID: Include unique suffix to avoid collision when multiple returns from same order
                orderId: `RETURN_${order?.id}_${generateSubEntityId('R')}`,
                
                // Pickup info from partner warehouse
                pickName: pickupAddress.partnerWarehouseName as string || 'Cửa hàng',
                pickAddress: pickupAddress.partnerWarehouseAddress as string || '',
                pickTel: pickupAddress.partnerWarehouseTel as string || '',
                pickProvince: pickupAddress.partnerWarehouseProvince as string || '',
                pickDistrict: pickupAddress.partnerWarehouseDistrict as string || '',
                pickWard: pickupAddress.partnerWarehouseWard as string || '',
                
                // Customer info from FORM (user may have edited)
                customerName: (shippingAddrAny.name as string) || (shippingAddrAny.contactName as string) || customer?.name || order.customerName || 'Khách lẻ',
                customerTel: customerPhone, // ✅ Use validated phone from above
                // Use the fully built address with all parts
                customerAddress: customerAddress,
                customerProvince: (shippingAddress.province as string) || '',
                customerDistrict: (shippingAddress.district as string) || '',
                customerWard: (shippingAddress.ward as string) || '',
                customerHamlet: 'Khác',
                
                // Products
                products: ghtkProducts,
                
                // Payment
                pickMoney: (values.packageInfo?.codAmount as number) || 0,
                // ✅ value = "Giá trị hàng hoá" = finalAmount if > 0, else totalExchangeValue
                value: finalAmount > 0 ? finalAmount : totalExchangeValue,
                isFreeship: (values.packageInfo?.codAmount || 0) === 0 ? 1 : 0,
                
                // Additional info
                note: values.notes || '',
                transport: 'road',
                // Don't send tags unless user explicitly selects them
            };
            
            const ghtkService = new GHTKService(apiToken, partnerCode || '');
            
            toast.info('Đang tạo đơn trên GHTK...', { duration: 2000 });
            const result = await ghtkService.createOrder(ghtkParams);
            
            if (result.success && result.order) {
                toast.success('Đã tạo đơn GHTK thành công', { 
                    description: `Mã vận đơn: ${result.order.label}` 
                });
                // ✅ Update packageInfo with tracking code AND fee from GHTK response
                // fee = "Phí trả ĐTVC" (shipping fee to delivery partner)
                // Fallback to ship_money if fee is not available
                const ghtkFee = parseInt(result.order.fee || '0') || result.order.ship_money || 0;
                // ✅ isFreeship: 1 = Shop trả = "Người gửi", 0 = Khách trả = "Người nhận"
                const isFreeship = (values.packageInfo?.codAmount || 0) === 0 ? 1 : 0;
                const payer = isFreeship === 1 ? 'Người gửi' : 'Người nhận';
                // ✅ Preserve codAmount from form input
                const formCodAmount = values.packageInfo?.codAmount || 0;
                returnPayload.packageInfo = {
                    ...(returnPayload.packageInfo || { weight: 0, length: 0, width: 0, height: 0 }),
                    codAmount: formCodAmount, // ✅ Explicitly preserve codAmount from form
                    trackingCode: result.order.label,
                    shippingFeeToPartner: ghtkFee, // ✅ Store GHTK fee for API to save
                    payer: payer, // ✅ Store payer for API to save
                } as unknown as PackageInfo;
            } else {
                toast.error('Tạo đơn GHTK thất bại', { 
                    description: result.message || 'Vui lòng kiểm tra lại thông tin' 
                });
                setIsSubmitting(false);
                return; // Don't create return if GHTK failed
            }
        } catch (error: unknown) {
            console.error('❌ GHTK create order error:', error);
            toast.error('Lỗi tạo đơn GHTK', { 
                description: (error as Error)?.message || 'Vui lòng thử lại sau' 
            });
            setIsSubmitting(false);
            return; // Don't create return if GHTK failed
        }
    }
    
    // ✅ Call API to create sales return
    try {
        const returnItems = returnPayload.items?.filter(item => (item.returnQuantity || 0) > 0) || [];
        
        // ✅ Extract trackingCode from packageInfo if set (e.g., from GHTK)
        const ghtkTrackingCode = (returnPayload.packageInfo as unknown as Record<string, unknown>)?.trackingCode as string | undefined;
        
        const response = await fetch('/api/sales-returns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: order.systemId,
                reason: returnPayload.reason,
                branchId: values.branchSystemId,
                isReceived: values.isReceived,
                // ✅ Pass delivery method for exchange order creation
                deliveryMethod: values.deliveryMethod,
                // ✅ Pass tracking code from GHTK if available
                exchangeTrackingCode: ghtkTrackingCode,
                // ✅ Pass shipping info for exchange order
                shippingPartnerId: returnPayload.shippingPartnerId,
                shippingServiceId: returnPayload.shippingServiceId,
                shippingAddress: returnPayload.shippingAddress,
                packageInfo: returnPayload.packageInfo,
                items: returnItems.map(item => ({
                    // ✅ Gửi productSystemId (PROD112654) - API cần systemId để lookup trong order.lineItems
                    productSystemId: item.productSystemId,
                    productId: item.productId, // Business ID (ZP8) - for display
                    quantity: item.returnQuantity,
                    unitPrice: item.unitPrice,
                    reason: item.note,
                })),
                // ✅ Pass exchange items to API - will subtract from inventory
                exchangeItems: values.exchangeItems?.map(item => ({
                    productSystemId: item.productSystemId,
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    discount: item.discount || 0,
                    discountType: item.discountType || 'fixed',
                })),
                createdBy: creatorSystemId,
                // ✅ Pass financial data for payment/receipt voucher creation
                totalReturnValue: returnPayload.totalReturnValue,
                subtotalNew: returnPayload.subtotalNew,
                shippingFeeNew: returnPayload.shippingFeeNew,
                grandTotalNew: returnPayload.grandTotalNew,
                finalAmount: returnPayload.finalAmount,
                payments: returnPayload.payments,
                refunds: returnPayload.refunds,
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create sales return');
        }
        
        const newReturn = await response.json();
        
        // ✅ Invalidate sales returns and cross-module dependencies
        invalidateRelated(queryClient, 'sales-returns');
        
        const hasExchangeItems = values.exchangeItems && values.exchangeItems.length > 0;
        const returnId = newReturn.data?.id || newReturn.id;
        
        toast.success(hasExchangeItems ? 'Tạo phiếu trả hàng và đổi hàng thành công!' : 'Tạo phiếu trả hàng thành công!', {
            description: `Mã phiếu: ${returnId}. Tồn kho đã được cập nhật.`,
            duration: 3000,
        });
        
        // ✅ Always navigate back to order detail page for consistent UX
        router.push(`/orders/${order.systemId}`);
    } catch (error) {
        console.error('❌ Create sales return error:', error);
        toast.error('Lỗi tạo phiếu trả hàng', {
            description: (error as Error)?.message || 'Vui lòng thử lại sau',
        });
    }
    
    setIsSubmitting(false);
  };
  
  // Only disable if order is cancelled (not completed - completed orders can still be returned)
  const isFullyReadOnly = order.status === 'Đã hủy';
  
  return (
    <FormProvider {...form}>
      <form id="sales-return-form" onSubmit={handleSubmit(onSubmit, (validationErrors) => {
        console.error('[SalesReturnForm] Form validation failed:', validationErrors);
        toast.error('Vui lòng kiểm tra lại thông tin form');
      })}>
        <div className="space-y-4">
            {/* Row 1: Thông tin phiếu + Thông tin bổ sung + Quy trình xử lý */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader><CardTitle>Thông tin phiếu</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <p>Khách hàng: <span className="font-semibold text-primary">{customer?.name || order.customerName || 'Khách lẻ'}</span></p>
                            <p>Mã đơn hàng gốc: <Link href={`/orders/${order.systemId}`} className="font-semibold text-primary hover:underline">{order.id}</Link></p>
                            <FormField 
                                control={control} 
                                name="branchSystemId" 
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel>Chi nhánh trả hàng</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            value={field.value || ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-45 h-8">
                                                    <SelectValue placeholder="Chọn chi nhánh" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {branches.map(b => (
                                                    <SelectItem key={b.systemId} value={b.systemId}>
                                                        {b.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} 
                            />
                            <FormField control={control} name="reference" render={({ field }) => (
                                <FormItem className="flex items-center gap-2"><FormLabel>Tham chiếu</FormLabel><FormControl><Input className="h-8" {...field} value={field.value || ''} /></FormControl></FormItem>
                            )} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader><CardTitle>Thông tin bổ sung</CardTitle></CardHeader>
                     <CardContent className="space-y-4">
                        <FormField control={control} name="returnReason" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lý do trả hàng</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn lý do" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Sản phẩm lỗi">Sản phẩm lỗi</SelectItem>
                                        <SelectItem value="Sai mô tả">Sai mô tả</SelectItem>
                                        <SelectItem value="Không vừa ý">Không vừa ý</SelectItem>
                                        <SelectItem value="Giao nhầm sản phẩm">Giao nhầm sản phẩm</SelectItem>
                                        <SelectItem value="Đổi size/màu">Đổi size/màu</SelectItem>
                                        <SelectItem value="Khác">Khác</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                        <FormField control={control} name="notes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ghi chú chi tiết</FormLabel>
                                <FormControl>
                                    <Textarea {...field} value={field.value || ''} rows={3} placeholder="Mô tả chi tiết lý do trả hàng..." />
                                </FormControl>
                            </FormItem>
                        )} />
                     </CardContent>
                </Card>
                <SalesReturnWorkflowCard
                    subtasks={getValues('subtasks') || []}
                    onSubtasksChange={(subtasks) => setValue('subtasks', subtasks)}
                    readonly={true}
                />
            </div>

            {/* Row 2: Products to Return */}
            <Card>
                 <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Sản phẩm trả</CardTitle>
                         <div className="flex items-center space-x-2">
                             <Label htmlFor="returnAll" className="font-normal">Trả toàn bộ</Label>
                            <Controller
                                name="returnAll"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id="returnAll"
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                            const boolChecked = !!checked;
                                            field.onChange(boolChecked);
                                            const currentItems = getValues('items');
                                            currentItems.forEach((item, index) => {
                                                const newQty = boolChecked ? item.returnableQuantity : 0;
                                                setValue(`items.${index}.returnQuantity`, newQty, { shouldDirty: true });
                                            });
                                        }}
                                    />
                                )}
                            />
                         </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md overflow-x-auto">
                        <Table>
                            <TableHeader><TableRow><TableHead className="w-12 text-center">STT</TableHead><TableHead>Sản phẩm</TableHead><TableHead className="w-40">Số lượng trả</TableHead><TableHead className="w-45 text-right">Đơn giá gốc</TableHead><TableHead className="w-45 text-right">Đơn giá trả</TableHead><TableHead className="w-45 text-right">Thành tiền</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <ReturnItemRow
                                        key={field.id}
                                        index={index}
                                        field={field}
                                        control={control}
                                        setValue={setValue}
                                        getProductData={getProductData}
                                        expandedCombos={expandedCombos}
                                        toggleComboRow={toggleComboRow}
                                        handlePreview={handlePreview}
                                        handleOpenReturnNoteDialog={handleOpenReturnNoteDialog}
                                        getProductTypeLabel={getProductTypeLabel}
                                    />
                                ))}
                            </TableBody>
                            <ReturnTableFooter />
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Row 3: Nhận hàng trả lại */}
            <Card>
                <CardHeader><CardTitle>Nhận hàng trả lại</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Hàng trả lại được nhập vào kho chi nhánh {branches.find(b => b.systemId === getValues('branchSystemId'))?.name || 'mặc định'}</p>
                    
                    <FormField control={control} name="isReceived" render={({ field }) => (
                        <RadioGroup onValueChange={(v) => field.onChange(v === 'true')} value={String(field.value)} className="flex gap-4">
                            <Button type="button" asChild variant={field.value ? 'default' : 'outline'}><label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="true" className="sr-only" /> Đã nhận và nhập kho</label></Button>
                            <Button type="button" asChild variant={!field.value ? 'default' : 'outline'}><label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="false" className="sr-only" /> Chưa nhận hàng</label></Button>
                        </RadioGroup>
                    )} />

                    {/* Warning về ảnh hưởng tồn kho */}
                    {watchIsReceived ? (
                        <Alert className="border-green-200 bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-sm text-green-800">
                                <strong>Đã nhận và nhập kho:</strong> Tồn kho sẽ được cập nhật ngay lập tức khi tạo đơn trả hàng. Số lượng hàng trả sẽ được thêm vào kho chi nhánh đã chọn.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert className="border-amber-200 bg-amber-50">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-sm text-amber-800">
                                <strong>Chưa nhận hàng:</strong> Tồn kho sẽ KHÔNG thay đổi. Bạn cần xác nhận nhận hàng sau để cập nhật tồn kho.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Row 4: Đổi hàng */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Đổi hàng</CardTitle>
                    <ProductTableToolbar
                        enableSplitLine={enableSplitLine}
                        onSplitLineChange={setEnableSplitLine}
                        disabled={isFullyReadOnly}
                    />
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <OrderProductSearch
                                onSelectProduct={(p) => handleSelectProducts([p])}
                                disabled={isFullyReadOnly}
                                allowCreateNew={true}
                                placeholder="Thêm sản phẩm (F3)"
                                searchPlaceholder="Tìm kiếm theo tên, mã SKU, barcode..."
                            />
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="h-9 shrink-0"
                                onClick={() => setIsProductSelectionOpen(true)} 
                                disabled={isFullyReadOnly}
                            >
                                Chọn nhanh
                            </Button>
                            <Select 
                                value={selectedPricingPolicy} 
                                onValueChange={setSelectedPricingPolicy}
                                disabled={isFullyReadOnly}
                            >
                                <SelectTrigger className="w-45 h-9 shrink-0">
                                    <SelectValue placeholder="Chọn bảng giá" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pricingPolicies.filter(p => p.type === 'Bán hàng' && p.isActive).map(policy => (
                                        <SelectItem key={policy.systemId} value={policy.systemId}>
                                            {policy.name} {policy.isDefault && '(Mặc định)'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    {exchangeFields.length === 0 ? (
                        <div className="text-center text-muted-foreground p-12 border border-dashed rounded-md">
                            <PackageOpen className="mx-auto h-12 w-12 text-gray-300" />
                            <p className="mt-4 text-sm">Chưa có sản phẩm nào trong đơn hàng</p>
                            <Button 
                                type="button" 
                                variant="link" 
                                className="mt-2" 
                                onClick={() => setIsProductSelectionOpen(true)} 
                                disabled={isFullyReadOnly}
                            >
                                Thêm sản phẩm
                            </Button>
                        </div>
                    ) : (
                        <LineItemsTable
                            disabled={isFullyReadOnly}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            fields={exchangeFields.map(f => ({ ...f, systemId: f.id, tax: f.tax ?? 0 })) as any[]}
                            remove={removeExchange}
                            pricingPolicyId={selectedPricingPolicy}
                            fieldName="exchangeItems"
                        />
                    )}
                </CardContent>
            </Card>

            <SalesReturnSummary />

            {/* Row 7: Giao hàng (chỉ hiển thị khi có sản phẩm đổi) */}
            <ShippingCard hidden={exchangeFields.length === 0} customer={customer} />
        </div>
        <ProductSelectionDialog 
            isOpen={isProductSelectionOpen} 
            onOpenChange={setIsProductSelectionOpen} 
            onSelect={handleSelectProducts}
            pricingPolicyId={selectedPricingPolicy}
        />
        <ImagePreviewDialog
            images={previewState.image ? [previewState.image] : []}
            title={previewState.title}
            open={previewState.open}
            onOpenChange={(open) => setPreviewState(prev => ({ ...prev, open }))}
        />
        
        {/* Return Note Dialog */}
        <Dialog 
            open={editingReturnNoteIndex !== null} 
            onOpenChange={(open) => { if (!open) { setEditingReturnNoteIndex(null); setTempReturnNote(''); } }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ghi chú sản phẩm trả</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        value={tempReturnNote}
                        onChange={(e) => setTempReturnNote(e.target.value)}
                        placeholder="Nhập ghi chú cho sản phẩm..."
                        rows={3}
                    />
                </div>
                <DialogFooter>
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => { setEditingReturnNoteIndex(null); setTempReturnNote(''); }}
                    >
                        Hủy
                    </Button>
                    <Button type="button" onClick={handleSaveReturnNote}>
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        {/* Exchange Note Dialog */}
        <Dialog 
            open={editingExchangeNoteIndex !== null} 
            onOpenChange={(open) => { if (!open) { setEditingExchangeNoteIndex(null); setTempExchangeNote(''); } }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ghi chú sản phẩm đổi</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        value={tempExchangeNote}
                        onChange={(e) => setTempExchangeNote(e.target.value)}
                        placeholder="Nhập ghi chú cho sản phẩm..."
                        rows={3}
                    />
                </div>
                <DialogFooter>
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => { setEditingExchangeNoteIndex(null); setTempExchangeNote(''); }}
                    >
                        Hủy
                    </Button>
                    <Button type="button" onClick={handleSaveExchangeNote}>
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </form>
    </FormProvider>
  );
}
