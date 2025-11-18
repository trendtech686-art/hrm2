
import * as React from 'react';
// FIX: Use named imports for react-router-dom to fix module export errors.
import { useParams, useNavigate, Link } from 'react-router-dom';
// FIX: Changed 'FieldArray as useFieldArray' to 'useFieldArray' to correctly import the hook from 'react-hook-form'.
import { useForm, useFieldArray, Controller, useWatch, FormProvider, useFormContext } from 'react-hook-form';
import { toISODateTime } from '../../lib/date-utils.ts';
import { ArrowLeft, PlusCircle, Trash2, CheckCircle2, AlertTriangle, PackageOpen } from 'lucide-react';
import { toast } from 'sonner';
import { GHTKService, type GHTKCreateOrderParams } from '../settings/shipping/integrations/ghtk-service';
import { loadShippingConfig } from '../../lib/utils/shipping-config-migration';

// types
import type { Order } from '../orders/types.ts';
import type { SalesReturn, ReturnLineItem, LineItem as ExchangeLineItem } from './types.ts';
import type { Product } from '../products/types.ts';

// Stores
import { useOrderStore } from '../orders/store.ts';
import { useCustomerStore } from '../customers/store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { useSalesReturnStore } from './store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useProductStore } from '../products/store.ts';
import { useCashbookStore } from '../cashbook/store.ts';

// UI Components
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../../components/ui/form.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../components/ui/table.tsx';
import { NumberInput } from '../../components/ui/number-input.tsx';
import { CurrencyInput } from '../../components/ui/currency-input.tsx';
import { Checkbox } from '../../components/ui/checkbox.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { Input } from '../../components/ui/input.tsx';
import { ProductSearch } from '../orders/components/product-search.tsx';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group.tsx';
import { Separator } from '../../components/ui/separator.tsx';
import { Alert, AlertDescription } from '../../components/ui/alert.tsx';
import { usePaymentMethodStore } from '../settings/payments/methods/store.ts';
// REMOVED: Voucher store no longer exists
// import { useVoucherStore } from '../vouchers/store.ts';
import { useInventoryReceiptStore } from '../inventory-receipts/store.ts';
import { ProductSelectionDialog } from '../shared/product-selection-dialog.tsx';
import { usePricingPolicyStore } from '../settings/pricing/store.ts';
// FIX: Add missing import for `Label` component.
import { Label } from '../../components/ui/label.tsx';
import { ShippingCard } from '../orders/components/shipping-card.tsx';
import { ProductTableToolbar } from '../orders/components/product-table-toolbar.tsx';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

type FormLineItem = ReturnLineItem & {
    total: number;
    returnableQuantity: number;
    orderedQuantity: number;
    originalUnitPrice: number;
};
type FormExchangeItem = ExchangeLineItem & { total: number };

type FormValues = {
  branchSystemId: string;  // ✅ Đổi từ branchId thành branchSystemId cho đúng convention
  returnReason?: string;  // ✅ Lý do trả hàng (dropdown)
  notes?: string;          // ✅ Ghi chú chi tiết
  reference?: string;      // ✅ Mã tham chiếu bên ngoài
  items: FormLineItem[];
  isReceived: boolean;
  exchangeItems: FormExchangeItem[];
  payments: { method: string; accountSystemId: string, amount: number }[];
  refunds: { method: string; accountSystemId: string, amount: number }[];  // ✅ Multiple refunds
  refundMethod: string;  // Legacy field
  accountSystemId: string;     // Legacy field
  refundAmount: number;  // Legacy field
  returnAll: boolean;
  // Exchange order fields
  exchangeNotes?: string;   // Ghi chú đơn đổi
  exchangeTags?: string;    // Tags đơn đổi
  orderDiscount?: number;   // Chiết khấu đơn hàng
  orderDiscountType?: 'fixed' | 'percentage';
  shippingFee?: number;     // Phí giao hàng
  promotionCode?: string;   // Mã giảm giá
  grandTotal?: number;      // ✅ For ShippingIntegration to calculate COD
  // Shipping info for exchange order
  deliveryMethod: string;
  shippingPartnerId?: string;
  shippingServiceId?: string;
  shippingAddress?: any;
  packageInfo?: any;
  configuration?: any;
};


// Component to handle complex calculations
const FinancialCalculations = () => {
    const { control, getValues, setValue } = useFormContext<FormValues>();
    const watchedReturnItems = useWatch({ control, name: "items" });
    const watchedExchangeItems = useWatch({ control, name: "exchangeItems" });
    const { systemId } = useParams<{ systemId: string }>();
    const order = useOrderStore().findById(systemId!);
    const { data: allSalesReturns } = useSalesReturnStore();


    const totalPaidOnOriginalOrder = React.useMemo(() => {
        if (!order) return 0;
        return order.payments.reduce((sum, p) => sum + p.amount, 0);
    }, [order]);

    const previousReturnsForOrder = React.useMemo(() => {
        if (!order) return [];
        return allSalesReturns.filter(sr => sr.orderSystemId === order.systemId);
    }, [order, allSalesReturns]);

    const totalReturnedValuePreviously = React.useMemo(() => {
        return previousReturnsForOrder.reduce((sum, sr) => sum + sr.totalReturnValue, 0);
    }, [previousReturnsForOrder]);

    const totalRefundedPreviously = React.useMemo(() => {
        return previousReturnsForOrder.reduce((sum, sr) => sum + (sr.refundAmount || 0), 0);
    }, [previousReturnsForOrder]);


    const totalReturnValue = React.useMemo(() =>
        (watchedReturnItems || []).reduce((sum, item) => sum + (item.returnQuantity * item.unitPrice), 0),
        [watchedReturnItems]
    );

    const totalExchangeValue = React.useMemo(() =>
        (watchedExchangeItems || []).reduce((sum, item) => sum + (item.total || 0), 0),
        [watchedExchangeItems]
    );

    const finalAmount = totalExchangeValue - totalReturnValue;

    const maxRefundableAmount = React.useMemo(() => {
        if (!order) return 0;
        const valueOfGoodsKept = order.grandTotal - totalReturnedValuePreviously - totalReturnValue;
        const netPaid = totalPaidOnOriginalOrder - totalRefundedPreviously;
        const potentialRefund = netPaid - valueOfGoodsKept;
        return Math.max(0, potentialRefund);
    }, [order, totalPaidOnOriginalOrder, totalReturnValue, totalReturnedValuePreviously, totalRefundedPreviously]);
    
    React.useEffect(() => {
       setValue('refundAmount', maxRefundableAmount);
    }, [maxRefundableAmount, setValue]);


    return (
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Cần hoàn tiền trả hàng</span>
                <span>{formatCurrency(totalReturnValue)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Khách cần trả đơn đổi</span>
                <span>{formatCurrency(totalExchangeValue)}</span>
            </div>
            <Separator />
            
            {/* Case 1: Đơn đổi < Đơn trả → Hoàn tiền cho khách */}
            {finalAmount < 0 && (
                <div className="flex justify-between font-semibold text-base text-green-600">
                    <span>Tổng tiền cần hoàn trả khách</span>
                    <span>{formatCurrency(Math.abs(finalAmount))}</span>
                </div>
            )}
            
            {/* Case 2: Đơn đổi > Đơn trả → Khách phải trả thêm */}
            {finalAmount > 0 && (
                <div className="flex justify-between font-semibold text-base text-amber-600">
                    <span>Tổng tiền khách phải trả</span>
                    <span>{formatCurrency(Math.abs(finalAmount))}</span>
                </div>
            )}
            
            {/* Case 3: Bằng nhau */}
            {finalAmount === 0 && (
                <div className="flex justify-between font-semibold text-base text-muted-foreground">
                    <span>Không phát sinh thanh toán</span>
                    <span>{formatCurrency(0)}</span>
                </div>
            )}
        </div>
    );
};


export function SalesReturnFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();

  // Stores
  const { data: orderData, findById: findOrder } = useOrderStore();
  const order = findOrder(systemId!);
  const { data: customerData, findById: findCustomer } = useCustomerStore();
  const customers = customerData; // For GHTK API
  const customer = order ? findCustomer(order.customerSystemId) : null;
  const { data: branches } = useBranchStore();
  const { addWithSideEffects: addReturn, data: allSalesReturns } = useSalesReturnStore();
  const loggedInUser = useEmployeeStore().data[0];
  const { add: addProduct, data: allProducts } = useProductStore(); // For GHTK API
  const { accounts } = useCashbookStore();
  const { data: paymentMethodsData } = usePaymentMethodStore();
  const { data: pricingPolicies } = usePricingPolicyStore();
  
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
  
  // Sync selectedPricingPolicy when defaultSellingPolicy loads
  React.useEffect(() => {
    if (defaultSellingPolicy && !selectedPricingPolicy) {
      setSelectedPricingPolicy(defaultSellingPolicy.systemId);
    }
  }, [defaultSellingPolicy, selectedPricingPolicy]);

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
    },
  });

  const { control, handleSubmit, setValue, reset, getValues, setError } = form;

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const { fields: exchangeFields, append: appendExchange, remove: removeExchange } = useFieldArray({
    control,
    name: "exchangeItems",
  });
  
   const returnableQuantities = React.useMemo(() => {
    if (!order) return {};
    const returnsForThisOrder = allSalesReturns.filter(pr => pr.orderSystemId === order.systemId);
    const quantities: Record<string, number> = {};
    order.lineItems.forEach(item => {
        const totalReturned = returnsForThisOrder.reduce((sum, sr) => {
            const returnItem = sr.items.find(i => i.productSystemId === item.productSystemId);
            return sum + (returnItem ? returnItem.returnQuantity : 0);
        }, 0);
        quantities[item.productSystemId] = item.quantity - totalReturned;
    });
    return quantities;
  }, [order, allSalesReturns]);


  React.useEffect(() => {
      if (!order || !branches.length) return;
      
      // Map items từ đơn hàng
      const initialItems = order.lineItems.map(item => ({
          productSystemId: item.productSystemId,
          productId: item.productId,
          productName: item.productName,
          orderedQuantity: item.quantity,
          returnableQuantity: returnableQuantities[item.productSystemId] || 0,
          returnQuantity: 0,
          unitPrice: item.unitPrice,
          originalUnitPrice: item.unitPrice,
          totalValue: 0,
      }));
      
      // Lấy chi nhánh từ đơn hàng, nếu không có thì lấy default
      const branchSystemId = order.branchSystemId || branches.find(b => b.isDefault)?.systemId || branches[0]?.systemId;
      
      console.log('✅ Setting branchSystemId to:', branchSystemId, 'from order:', order.branchSystemId);
      
      // Reset form với data mới
      reset({
          branchSystemId,
          items: initialItems as any,
          isReceived: true,
          exchangeItems: [],
          payments: [],
          refunds: [],
          returnAll: false,
          deliveryMethod: 'deliver-later',
          configuration: {},
          packageInfo: { codAmount: 0 },
          grandTotal: 0,
          shippingAddress: customer?.addresses?.find(a => a.isDefaultShipping) || null,
      });
  }, [order, branches, reset, returnableQuantities, customer]);
  
  // ✅ Update shipping address when customer is loaded/changed
  React.useEffect(() => {
    if (customer && customer.addresses && customer.addresses.length > 0) {
      const defaultShippingAddr = customer.addresses.find(a => a.isDefaultShipping);
      if (defaultShippingAddr) {
        console.log('🔵 [Sales Return] Setting default shipping address:', defaultShippingAddr);
        setValue('shippingAddress', defaultShippingAddr);
      }
    }
  }, [customer, setValue]);
  
  const watchedReturnItems = useWatch({ control, name: "items" }) || [];
  const watchedExchangeItems = useWatch({ control, name: "exchangeItems" }) || [];
  const watchedPayments = useWatch({ control, name: "payments" }) || [];
  const watchedRefunds = useWatch({ control, name: "refunds" }) || [];
  const watchedOrderDiscount = useWatch({ control, name: "orderDiscount" }) || 0;
  const watchedOrderDiscountType = useWatch({ control, name: "orderDiscountType" }) || 'fixed';
  const watchedShippingFee = useWatch({ control, name: "shippingFee" }) || 0;
  const watchIsReceived = useWatch({ control, name: "isReceived" }) ?? true;
  
  // Recalculate line totals when quantities or return prices change
  React.useEffect(() => {
    const items = getValues('items');
    items.forEach((item, index) => {
      const newTotal = (item.returnQuantity || 0) * (item.unitPrice || 0);
      if (getValues(`items.${index}.totalValue`) !== newTotal) {
        setValue(`items.${index}.totalValue`, newTotal, { shouldValidate: false });
      }
    });
  }, [watchedReturnItems, setValue, getValues]);
  
  const totalReturnValue = React.useMemo(() => (watchedReturnItems || []).reduce((sum, item) => sum + (item.totalValue || 0), 0), [watchedReturnItems]);
  const totalReturnQuantity = React.useMemo(() => (watchedReturnItems || []).reduce((sum, item) => sum + (item.returnQuantity || 0), 0), [watchedReturnItems]);
  
  const subtotalExchangeValue = React.useMemo(() => (watchedExchangeItems || []).reduce((sum, item) => sum + item.total, 0), [watchedExchangeItems]);
  
  // Calculate total exchange value with discount and shipping
  const totalExchangeValue = React.useMemo(() => {
    const orderDiscountValue = watchedOrderDiscountType === 'percentage'
      ? (subtotalExchangeValue * watchedOrderDiscount) / 100
      : watchedOrderDiscount;
    
    return subtotalExchangeValue - orderDiscountValue + watchedShippingFee;
  }, [subtotalExchangeValue, watchedOrderDiscount, watchedOrderDiscountType, watchedShippingFee]);
  
  const finalAmount = totalExchangeValue - totalReturnValue;
  const isRefunding = finalAmount < 0;
  
  // ✅ Auto-fill COD amount when customer needs to pay (finalAmount > 0)
  React.useEffect(() => {
    if (finalAmount > 0) {
      // Auto-fill COD field
      setValue('packageInfo.codAmount', finalAmount);
      setValue('grandTotal', finalAmount);
    } else {
      setValue('packageInfo.codAmount', 0);
      setValue('grandTotal', 0);
    }
  }, [finalAmount, setValue]);
  
  const totalPaidOnOriginalOrder = React.useMemo(() => {
    if (!order) return 0;
    return order.payments.reduce((sum, p) => sum + p.amount, 0);
  }, [order]);
  
  const previousReturnsForOrder = React.useMemo(() => {
    if (!order) return [];
    return allSalesReturns.filter(sr => sr.orderSystemId === order.systemId);
  }, [order, allSalesReturns]);

  const totalReturnedValuePreviously = React.useMemo(() => {
      return previousReturnsForOrder.reduce((sum, sr) => sum + sr.totalReturnValue, 0);
  }, [previousReturnsForOrder]);

  const totalRefundedPreviously = React.useMemo(() => {
      return previousReturnsForOrder.reduce((sum, sr) => sum + (sr.refundAmount || 0), 0);
  }, [previousReturnsForOrder]);

  const maxRefundableAmount = React.useMemo(() => {
    if (!order) return 0;
    const valueOfGoodsKept = order.grandTotal - totalReturnedValuePreviously - totalReturnValue;
    const netPaid = totalPaidOnOriginalOrder - totalRefundedPreviously;
    const potentialRefund = netPaid - valueOfGoodsKept;
    return Math.max(0, potentialRefund);
  }, [order, totalPaidOnOriginalOrder, totalReturnValue, totalReturnedValuePreviously, totalRefundedPreviously]);
  
  React.useEffect(() => {
    if(isRefunding) {
        setValue('refundAmount', Math.min(Math.abs(finalAmount), maxRefundableAmount));
    } else {
        setValue('refundAmount', 0);
    }
  }, [finalAmount, isRefunding, maxRefundableAmount, setValue]);


  usePageHeader({
    title: 'Tạo đơn trả hàng',
    breadcrumb: [
      { label: 'Đơn hàng', href: '/orders' },
      { label: 'Chi tiết', href: `/orders/${systemId}` },
      { label: 'Tạo đơn trả hàng', href: '' },
    ],
    actions: [
      <Button key="cancel" variant="outline" type="button" onClick={() => navigate(-1)}>Thoát</Button>,
      <Button key="submit" type="submit" form="sales-return-form" disabled={isSubmitting}>
        {isSubmitting ? 'Đang xử lý...' : 'Hoàn trả'}
      </Button>
    ],
  });

  if (!order || !customer || !branches.length) {
    return <div>Đang tải hoặc không tìm thấy đơn hàng...</div>;
  }
  
  const handleSelectProducts = (selectedProducts: Product[]) => {
      const currentItems = getValues('exchangeItems') || [];
      
      selectedProducts.forEach(product => {
          const policyId = selectedPricingPolicy || defaultSellingPolicy?.systemId;
          const price = policyId 
              ? (product.prices[policyId] || 0)
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

  const handleAddProduct = (values: any) => {
      addProduct(values as any);
  };

  const onSubmit = async (values: FormValues) => {
    if (!order || !customer) return;
    
    // ✅ Prevent double submission
    if (isSubmitting) {
        console.warn('⚠️ Submission already in progress, skipping...');
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
          alert('Vui lòng chọn sản phẩm để trả hoặc đổi.');
          setIsSubmitting(false);
          return;
        }

        // ✅ Validate refunds when finalAmount < 0
    if (finalAmount < 0) {
        const totalRefunded = (values.refunds || []).reduce((sum, r) => sum + (r.amount || 0), 0);
        const remainingRefund = Math.abs(finalAmount) - totalRefunded;
        
        if (remainingRefund > 0.01) {
            alert(`⚠️ Còn phải hoàn trả khách: ${formatCurrency(remainingRefund)}. Vui lòng thêm phương thức hoàn tiền.`);
            return;
        }
        
        // Validate each refund has method and account
        for (let i = 0; i < values.refunds.length; i++) {
            const refund = values.refunds[i];
            if (!refund.method) {
                alert(`⚠️ Vui lòng chọn phương thức hoàn tiền cho dòng ${i + 1}`);
                return;
            }
            if (!refund.accountSystemId) {
                alert(`⚠️ Vui lòng chọn tài khoản quỹ cho dòng ${i + 1}`);
                return;
            }
            if (!refund.amount || refund.amount <= 0) {
                alert(`⚠️ Vui lòng nhập số tiền hoàn cho dòng ${i + 1}`);
                return;
            }
        }
    }
    
    // ✅ Validate payment total when finalAmount > 0
    if (finalAmount > 0 && values.payments && values.payments.length > 0) {
        const totalPaymentAmount = values.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const difference = Math.abs(totalPaymentAmount - finalAmount);
        if (difference > 0.01) {
            alert(`⚠️ Tổng thanh toán (${formatCurrency(totalPaymentAmount)}) không khớp với số tiền cần thu (${formatCurrency(finalAmount)}). Vui lòng kiểm tra lại.`);
            return;
        }
    }

    const returnPayload = {
        orderSystemId: order.systemId,
        orderId: order.id,
        customerSystemId: customer.systemId,
        customerName: customer.name,
        branchSystemId: values.branchSystemId,  // ✅ Đúng tên field: branchSystemId
        branchName: branch.name,
        returnDate: toISODateTime(new Date()),
        reason: values.returnReason || values.notes,
        notes: values.notes,
        reference: values.reference,
        items: returnItems.map(({ total, returnableQuantity, orderedQuantity, originalUnitPrice, ...rest }) => ({...rest, totalValue: rest.returnQuantity * rest.unitPrice})),
        totalReturnValue,
        isReceived: values.isReceived, // ✅ Pass isReceived flag to control inventory update
        exchangeItems: values.exchangeItems.map(({ total, ...rest }) => rest),
        subtotalNew: subtotalExchangeValue, // ✅ Use subtotal (before discount & shipping)
        shippingFeeNew: values.shippingFee || 0,
        grandTotalNew: totalExchangeValue, // ✅ Total after discount & shipping)
        finalAmount,
        payments: finalAmount > 0 ? values.payments : undefined,
        refunds: finalAmount < 0 ? values.refunds : undefined, // ✅ Use new refunds array
        creatorName: loggedInUser.fullName,
        creatorId: loggedInUser.systemId,
        // ✅ Pass shipping info for exchange order
        deliveryMethod: values.deliveryMethod,
        shippingPartnerId: values.shippingPartnerId,
        shippingServiceId: values.shippingServiceId,
        shippingAddress: values.shippingAddress,
        packageInfo: values.packageInfo,
        configuration: values.configuration,
    };
    
    console.log('📋 [Sales Return Form] Exchange items count:', values.exchangeItems.length);
    console.log('📋 [Sales Return Form] Exchange items:', values.exchangeItems);
    console.log('📋 [Sales Return Form] Return payload exchangeItems:', returnPayload.exchangeItems);
    
    // ✅ Call GHTK API if using GHTK shipping partner
    console.log('🔍 [GHTK Check] deliveryMethod:', values.deliveryMethod);
    console.log('🔍 [GHTK Check] shippingPartnerId:', values.shippingPartnerId);
    console.log('🔍 [GHTK Check] exchangeItems.length:', values.exchangeItems.length);
    
    const isUsingShippingPartner = values.deliveryMethod === 'deliver-later' || values.deliveryMethod === 'shipping-partner';
    console.log('🔍 [GHTK Check] isUsingShippingPartner:', isUsingShippingPartner);
    console.log('🔍 [GHTK Check] Condition result:', isUsingShippingPartner && values.shippingPartnerId === 'GHTK' && values.exchangeItems.length > 0);
    
    if (isUsingShippingPartner && values.shippingPartnerId === 'GHTK' && values.exchangeItems.length > 0) {
        console.log('📦 [Sales Return] Calling GHTK API for exchange order...');
        
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
            const customer = customers.find(c => c.systemId === order?.customerSystemId);
            
            // ✅ Use shipping address from FORM, not from original order
            const shippingAddress = values.shippingAddress;
            
            console.log('🏠 [GHTK] Shipping address from form:', shippingAddress);
            
            if (!shippingAddress || !customer) {
                toast.error('Thiếu thông tin giao hàng', { 
                    description: 'Vui lòng cấu hình đầy đủ thông tin vận chuyển GHTK trước khi tạo đơn' 
                });
                setIsSubmitting(false);
                return;
            }

            // Build full address: Try all possible address fields
            // Address may be split across: street, address, fullAddress, houseNumber, etc.
            const addressParts = [
                shippingAddress.houseNumber,
                shippingAddress.street,
                shippingAddress.address,
                shippingAddress.fullAddress,
            ].filter(Boolean);
            
            const customerAddress = addressParts.length > 0 
                ? addressParts.join(', ')
                : (shippingAddress.address || shippingAddress.street || shippingAddress.fullAddress || '');
            
            console.log('🏠 [GHTK] Built customer address:', customerAddress);
            
            if (!customerAddress || !shippingAddress.province || !shippingAddress.district || !shippingAddress.ward) {
                toast.error('Thiếu thông tin địa chỉ', { 
                    description: 'Vui lòng nhập đầy đủ địa chỉ chi tiết, tỉnh/thành, quận/huyện, phường/xã' 
                });
                setIsSubmitting(false);
                return;
            }

            // Build products array from exchange items
            const products = values.exchangeItems.map(item => {
                const product = allProducts.find(p => p.systemId === item.productSystemId);
                return {
                    name: product?.name || item.productName || 'Sản phẩm',
                    weight: product?.weight || 100, // Keep in grams (don't divide by 1000)
                    quantity: item.quantity,
                    price: item.unitPrice || 0,
                };
            });

            // Get pickup info from GHTK account settings
            const pickupAddress = ghtkAccount.pickupAddresses?.[0]; // Use first pickup address
            if (!pickupAddress) {
                toast.error('Lỗi cấu hình', { 
                    description: 'Chưa cấu hình địa chỉ lấy hàng GHTK' 
                });
                setIsSubmitting(false);
                return;
            }

            const ghtkParams: GHTKCreateOrderParams = {
                // ✅ Unique order ID: Include timestamp to avoid collision when multiple returns from same order
                orderId: `RETURN_${order?.id}_${Date.now()}`,
                
                // Pickup info from partner warehouse
                pickName: pickupAddress.partnerWarehouseName || 'Cửa hàng',
                pickAddress: pickupAddress.partnerWarehouseAddress || '',
                pickTel: pickupAddress.partnerWarehouseTel || '',
                pickProvince: pickupAddress.partnerWarehouseProvince || '',
                pickDistrict: pickupAddress.partnerWarehouseDistrict || '',
                pickWard: pickupAddress.partnerWarehouseWard || '',
                
                // Customer info from FORM (user may have edited)
                customerName: shippingAddress.name || customer.name || '',
                customerTel: shippingAddress.phone || customer.phone || '',
                // Use the fully built address with all parts
                customerAddress: customerAddress,
                customerProvince: shippingAddress.province || '',
                customerDistrict: shippingAddress.district || '',
                customerWard: shippingAddress.ward || '',
                customerHamlet: 'Khác',
                
                // Products
                products,
                
                // Payment
                pickMoney: values.packageInfo?.codAmount || 0,
                // ✅ value = "Giá trị hàng hoá" = finalAmount if > 0, else totalExchangeValue
                value: finalAmount > 0 ? finalAmount : totalExchangeValue,
                isFreeship: (values.packageInfo?.codAmount || 0) === 0 ? 1 : 0,
                
                // Additional info
                note: values.notes || '',
                transport: 'road',
                // Don't send tags unless user explicitly selects them
            };
            
            const ghtkService = new GHTKService(apiToken, partnerCode || '');
            
            console.log('📦 [Sales Return] Calling GHTK API with params:', ghtkParams);
            toast.info('Đang tạo đơn trên GHTK...', { duration: 2000 });
            const result = await ghtkService.createOrder(ghtkParams);
            
            if (result.success && result.order) {
                toast.success('Đã tạo đơn GHTK thành công', { 
                    description: `Mã vận đơn: ${result.order.label}` 
                });
                // Update packageInfo with tracking code
                returnPayload.packageInfo = {
                    ...returnPayload.packageInfo,
                    trackingCode: result.order.label,
                };
            } else {
                toast.error('Tạo đơn GHTK thất bại', { 
                    description: result.message || 'Vui lòng kiểm tra lại thông tin' 
                });
                setIsSubmitting(false);
                return; // Don't create return if GHTK failed
            }
        } catch (error: any) {
            console.error('❌ GHTK create order error:', error);
            toast.error('Lỗi tạo đơn GHTK', { 
                description: error?.message || 'Vui lòng thử lại sau' 
            });
            setIsSubmitting(false);
            return; // Don't create return if GHTK failed
        }
    }
    
    console.log('📋 [Form] Submitting return payload:', returnPayload);

    const { newReturn, newOrderSystemId } = addReturn(returnPayload);
    
    console.log('✅ [Form] Return created:', { newReturn, newOrderSystemId });
    
    // ✅ Navigate to new exchange order if created, otherwise back to original order
    if (newOrderSystemId) {
        toast.success('Tạo phiếu trả hàng và đơn đổi hàng thành công!', {
            description: `Đang chuyển đến đơn đổi hàng mới...`,
            duration: 2000,
        });
        // Navigate to the new exchange order
        setTimeout(() => {
            navigate(`/orders/${newOrderSystemId}`);
        }, 500);
    } else if (newReturn) {
        toast.success('Tạo phiếu trả hàng thành công!');
        // Navigate back to original order if no exchange order
        navigate(`/orders/${order.systemId}`);
    }
    
    setIsSubmitting(false);
  };
  
  // Only disable if order is cancelled (not completed - completed orders can still be returned)
  const isFullyReadOnly = order.status === 'Đã hủy';
  
  return (
    <FormProvider {...form}>
      <form id="sales-return-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
            {/* Row 1: Info */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-2">
                    <CardHeader><CardTitle className="text-base">Thông tin phiếu</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <p>Khách hàng: <a className="font-semibold text-primary hover:underline">{customer.name}</a></p>
                            <p>Mã đơn hàng gốc: <Link to={`/orders/${order.systemId}`} className="font-semibold text-primary hover:underline">{order.id}</Link></p>
                            <FormField 
                                control={control} 
                                name="branchSystemId" 
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormLabel>Chi nhánh trả hàng</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-[180px] h-8">
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
                <Card className="col-span-1">
                     <CardHeader><CardTitle className="text-base">Thông tin bổ sung</CardTitle></CardHeader>
                     <CardContent className="space-y-4">
                        <FormField control={control} name="returnReason" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lý do trả hàng</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
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
            </div>

            {/* Row 2: Products to Return */}
            <Card>
                 <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Sản phẩm trả</CardTitle>
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
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader><TableRow><TableHead>Sản phẩm</TableHead><TableHead className="w-40">Số lượng trả</TableHead><TableHead className="w-[180px] text-right">Đơn giá gốc</TableHead><TableHead className="w-[180px] text-right">Đơn giá trả</TableHead><TableHead className="w-[180px] text-right">Thành tiền</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell>
                                            <p className="font-medium">{field.productName}</p>
                                            <p className="text-sm text-muted-foreground">{field.productId}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Controller
                                                    control={control}
                                                    name={`items.${index}.returnQuantity`}
                                                    render={({ field: qtyField }) => (
                                                        <NumberInput
                                                            {...qtyField}
                                                            className="h-8 text-center"
                                                            format={false}
                                                            min={0}
                                                            max={field.returnableQuantity}
                                                            onChange={(val) => {
                                                                qtyField.onChange(val);
                                                                setValue('returnAll', false);
                                                            }}
                                                         />
                                                    )}
                                                />
                                                <span>/ {field.returnableQuantity}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{formatCurrency(field.originalUnitPrice)}</TableCell>
                                        <TableCell>
                                            <Controller
                                                control={control}
                                                name={`items.${index}.unitPrice`}
                                                render={({ field: priceField }) => (
                                                    <CurrencyInput
                                                        value={priceField.value as number}
                                                        onChange={priceField.onChange}
                                                        className="h-8 text-right"
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">{formatCurrency(watchedReturnItems[index]?.totalValue || 0)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        Số lượng trả ({totalReturnQuantity} sản phẩm)
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">Cần hoàn tiền trả hàng</TableCell>
                                    <TableCell className="text-right font-bold">{formatCurrency(totalReturnValue)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Row 3: Nhận hàng trả lại */}
            <Card>
                <CardHeader><CardTitle className="text-base">Nhận hàng trả lại</CardTitle></CardHeader>
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
                    <CardTitle className="text-base font-semibold">Đổi hàng</CardTitle>
                    <div className="flex items-center gap-2">
                        <ProductTableToolbar
                            enableSplitLine={enableSplitLine}
                            onSplitLineChange={setEnableSplitLine}
                            disabled={isFullyReadOnly}
                        />
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
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
                            <SelectTrigger className="w-[180px] h-9">
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
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <ProductSearch
                                onSelectProduct={(p) => handleSelectProducts([p])}
                                onAddProduct={(values) => {
                                    handleAddProduct(values);
                                    const newProduct = useProductStore.getState().data.find(prod => prod.id === values.id);
                                    if (newProduct) handleSelectProducts([newProduct]);
                                }}
                                disabled={isFullyReadOnly}
                                defaultPolicyId={selectedPricingPolicy}
                            />
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
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sản phẩm đổi</TableHead>
                                        <TableHead className="w-24">SL</TableHead>
                                        <TableHead className="w-32 text-right">Đơn giá</TableHead>
                                        <TableHead className="w-32">Giảm giá</TableHead>
                                        <TableHead className="w-32 text-right">Thành tiền</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {exchangeFields.map((field, index) => {
                                    const item = watchedExchangeItems[index];
                                    const quantity = item?.quantity || 1;
                                    const unitPrice = (field as any).unitPrice || 0;
                                    const discount = item?.discount || 0;
                                    const discountType = item?.discountType || 'fixed';
                                    
                                    const discountValue = discountType === 'percentage' 
                                        ? (unitPrice * quantity * discount) / 100
                                        : discount;
                                    
                                    const lineTotal = (unitPrice * quantity) - discountValue;
                                    
                                    return (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{(field as any).productName}</p>
                                                    <p className="text-xs text-muted-foreground">{(field as any).productId}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Controller control={control} name={`exchangeItems.${index}.quantity`} render={({ field: qtyField }) => (
                                                    <NumberInput 
                                                        {...qtyField} 
                                                        min={1} 
                                                        className="h-8 w-20" 
                                                        format={false} 
                                                        onChange={v => { 
                                                            qtyField.onChange(v);
                                                            const currentDiscount = getValues(`exchangeItems.${index}.discount`) || 0;
                                                            const currentDiscountType = getValues(`exchangeItems.${index}.discountType`) || 'fixed';
                                                            const discVal = currentDiscountType === 'percentage' 
                                                                ? (unitPrice * v * currentDiscount) / 100
                                                                : currentDiscount;
                                                            setValue(`exchangeItems.${index}.total`, (unitPrice * v) - discVal);
                                                        }} 
                                                    />
                                                )}/>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(unitPrice)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Controller 
                                                        control={control} 
                                                        name={`exchangeItems.${index}.discount`} 
                                                        render={({ field: discountField }) => (
                                                            <NumberInput 
                                                                {...discountField} 
                                                                min={0} 
                                                                className="h-8 w-16 text-right" 
                                                                format={false}
                                                                onChange={v => {
                                                                    discountField.onChange(v);
                                                                    const discType = getValues(`exchangeItems.${index}.discountType`) || 'fixed';
                                                                    const discVal = discType === 'percentage' 
                                                                        ? (unitPrice * quantity * v) / 100
                                                                        : v;
                                                                    setValue(`exchangeItems.${index}.total`, (unitPrice * quantity) - discVal);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    <Controller
                                                        control={control}
                                                        name={`exchangeItems.${index}.discountType`}
                                                        render={({ field: typeField }) => (
                                                            <Select 
                                                                value={typeField.value} 
                                                                onValueChange={(val) => {
                                                                    typeField.onChange(val);
                                                                    const disc = getValues(`exchangeItems.${index}.discount`) || 0;
                                                                    const discVal = val === 'percentage' 
                                                                        ? (unitPrice * quantity * disc) / 100
                                                                        : disc;
                                                                    setValue(`exchangeItems.${index}.total`, (unitPrice * quantity) - discVal);
                                                                }}
                                                            >
                                                                <SelectTrigger className="h-8 w-14">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="fixed">₫</SelectItem>
                                                                    <SelectItem value="percentage">%</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {formatCurrency(lineTotal)}
                                            </TableCell>
                                            <TableCell>
                                                <Button type="button" size="icon" variant="ghost" onClick={() => removeExchange(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Row 5: Layout 2 cột - Ghi chú/Tags + Thanh toán */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
                {/* Left: Ghi chú và Tags */}
                <div className="flex-grow-[6] w-full md:w-0 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Ghi chú đơn hàng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField control={control} name="exchangeNotes" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea 
                                            {...field}
                                            value={field.value || ''}
                                            placeholder="VD: Hàng tăng góc riêng" 
                                            rows={3}
                                        />
                                    </FormControl>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField control={control} name="exchangeTags" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            value={field.value || ''} 
                                            placeholder="Nhập tag và nhấn Enter để thêm" 
                                        />
                                    </FormControl>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right: Thanh toán */}
                <div className="flex-grow-[4] w-full md:w-0">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tổng tiền ({exchangeFields.length} sản phẩm)</span>
                                <span>{formatCurrency(subtotalExchangeValue)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Phí giao hàng (F7)</span>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={() => {
                                            // Logic thêm phí sẽ được implement sau
                                        }}
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Controller
                                    control={control}
                                    name="shippingFee"
                                    render={({ field }) => (
                                        <CurrencyInput 
                                            value={field.value as number || 0}
                                            onChange={field.onChange}
                                            className="h-9 w-40 text-right"
                                        />
                                    )}
                                />
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Chiết khấu toàn đơn</span>
                                <div className="flex items-center gap-1">
                                    <Controller
                                        control={control}
                                        name="orderDiscount"
                                        render={({ field }) => (
                                            <CurrencyInput 
                                                value={field.value as number || 0}
                                                onChange={field.onChange}
                                                className="h-9 w-32 text-right"
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="orderDiscountType"
                                        render={({ field }) => (
                                            <Select value={field.value || 'fixed'} onValueChange={field.onChange}>
                                                <SelectTrigger className="h-9 w-16">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fixed">₫</SelectItem>
                                                    <SelectItem value="percentage">%</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-between font-semibold">
                                <span>Khách phải trả</span>
                                <span className="text-lg">{formatCurrency(totalExchangeValue)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Row 6: Hoàn tiền - LUÔN HIỂN THỊ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Hoàn tiền</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Cần hoàn tiền trả hàng</span>
                            <span className="font-medium">{formatCurrency(totalReturnValue)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Khách cần trả đơn đổi</span>
                            <span className="font-medium">{formatCurrency(totalExchangeValue)}</span>
                        </div>
                        
                        <Separator />
                        
                        {/* Case 1: Đơn đổi < Đơn trả → Hoàn tiền cho khách */}
                        {finalAmount < 0 && (
                            <>
                                <div className="flex justify-between font-semibold text-base text-green-600">
                                    <span>Tổng tiền cần hoàn trả khách</span>
                                    <span>{formatCurrency(Math.abs(finalAmount))}</span>
                                </div>
                            </>
                        )}
                        
                        {/* Case 2: Đơn đổi > Đơn trả → Khách phải trả thêm */}
                        {finalAmount > 0 && (
                            <>
                                <div className="flex justify-between font-semibold text-base text-amber-600">
                                    <span>Tổng tiền khách phải trả</span>
                                    <span>{formatCurrency(Math.abs(finalAmount))}</span>
                                </div>
                            </>
                        )}
                        
                        {/* Case 3: Bằng nhau */}
                        {finalAmount === 0 && (
                            <div className="flex justify-between font-semibold text-base text-muted-foreground">
                                <span>Không phát sinh thanh toán</span>
                                <span>{formatCurrency(0)}</span>
                            </div>
                        )}
                    </div>

                    {/* Form hoàn tiền - CHỈ hiển thị nếu finalAmount < 0 (cần hoàn tiền cho khách) */}
                    {finalAmount < 0 && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Đã hoàn tiền</span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        const refunds = getValues('refunds') || [];
                                        const defaultMethod = paymentMethodsData.find(pm => pm.isDefault)?.name || 'Tiền mặt';
                                        const defaultAccount = accounts.find(acc => acc.isDefault);
                                        setValue('refunds', [
                                            ...refunds,
                                            { 
                                                method: defaultMethod, 
                                                accountSystemId: defaultAccount?.systemId || accounts[0]?.systemId || '', 
                                                amount: Math.abs(finalAmount)
                                            }
                                        ]);
                                    }}
                                >
                                    <PlusCircle className="h-4 w-4 mr-1" />
                                    Thêm phương thức
                                </Button>
                            </div>

                            {/* Refund List */}
                            {watchedRefunds && watchedRefunds.length > 0 ? (
                                <div className="space-y-3">
                                    {watchedRefunds.map((refund, index) => {
                                        const selectedMethod = refund?.method || '';
                                        const filteredAccounts = selectedMethod === 'Tiền mặt'
                                            ? accounts.filter(acc => acc.type === 'cash')
                                            : accounts.filter(acc => acc.type === 'bank');
                                        
                                        // Sort: default first
                                        const sortedAccounts = [...filteredAccounts].sort((a, b) => {
                                            if (a.isDefault && !b.isDefault) return -1;
                                            if (!a.isDefault && b.isDefault) return 1;
                                            return 0;
                                        });
                                        
                                        return (
                                        <div key={index} className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg">
                                            <div className="col-span-4">
                                                <Label className="text-xs mb-1 block">Phương thức</Label>
                                                <Controller
                                                    control={control}
                                                    name={`refunds.${index}.method`}
                                                    render={({ field }) => (
                                                        <Select onValueChange={(val) => {
                                                            field.onChange(val);
                                                            // Auto-select default account of selected method
                                                            const newFilteredAccounts = val === 'Tiền mặt'
                                                                ? accounts.filter(acc => acc.type === 'cash')
                                                                : accounts.filter(acc => acc.type === 'bank');
                                                            const defaultAcc = newFilteredAccounts.find(a => a.isDefault) || newFilteredAccounts[0];
                                                            if (defaultAcc) {
                                                                setValue(`refunds.${index}.accountSystemId`, defaultAcc.systemId);
                                                            }
                                                        }} value={field.value}>
                                                            <SelectTrigger className="h-9">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {paymentMethodsData.filter(pm => pm.isActive).map(pm => (
                                                                    <SelectItem key={pm.systemId} value={pm.name}>{pm.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <Label className="text-xs mb-1 block">Tài khoản</Label>
                                                <Controller
                                                    control={control}
                                                    name={`refunds.${index}.accountSystemId`}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="h-9">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {sortedAccounts.map(acc => (
                                                                    <SelectItem key={acc.systemId} value={acc.systemId}>
                                                                        {acc.name} {acc.isDefault && '⭐'}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <Label className="text-xs mb-1 block">Số tiền</Label>
                                                <Controller
                                                    control={control}
                                                    name={`refunds.${index}.amount`}
                                                    render={({ field }) => (
                                                        <CurrencyInput 
                                                            value={field.value as number} 
                                                            onChange={field.onChange}
                                                            className="h-9"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1 pt-5">
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-10"
                                                    onClick={() => {
                                                        const currentRefunds = getValues('refunds') || [];
                                                        setValue('refunds', currentRefunds.filter((_, i) => i !== index));
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        );
                                    })}
                                    <div className="flex justify-between pt-2 border-t text-sm">
                                        <span className="font-medium">Tổng đã hoàn:</span>
                                        <span className="font-semibold">
                                            {formatCurrency((watchedRefunds || []).reduce((sum, r) => sum + (r.amount || 0), 0))}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Chưa có phương thức hoàn tiền. Nhấn "Thêm phương thức" để bắt đầu.
                                </p>
                            )}

                            <Separator />

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Đã hoàn tiền</span>
                                <span className="text-base font-semibold">
                                    {formatCurrency((watchedRefunds || []).reduce((sum, r) => sum + (r.amount || 0), 0))}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Còn phải hoàn trả khách</span>
                                <span className="text-lg font-bold text-green-600">
                                    {formatCurrency(Math.abs(finalAmount) - ((watchedRefunds || []).reduce((sum, r) => sum + (r.amount || 0), 0)))}
                                </span>
                            </div>
                        </div>
                    )}
                    
                    {/* Form thanh toán - CHỈ hiển thị nếu finalAmount > 0 (khách phải trả thêm) */}
                    {finalAmount > 0 && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Đã thanh toán</span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        const payments = getValues('payments') || [];
                                        const defaultMethod = paymentMethodsData.find(pm => pm.isDefault)?.name || 'Tiền mặt';
                                        const defaultAccount = accounts.find(acc => acc.isDefault);
                                        setValue('payments', [
                                            ...payments,
                                            { 
                                                method: defaultMethod, 
                                                accountSystemId: defaultAccount?.systemId || accounts[0]?.systemId || '', 
                                                amount: Math.abs(finalAmount)
                                            }
                                        ]);
                                    }}
                                >
                                    <PlusCircle className="h-4 w-4 mr-1" />
                                    Thêm phương thức
                                </Button>
                            </div>

                            {/* Payment List */}
                            {watchedPayments && watchedPayments.length > 0 ? (
                                <div className="space-y-3">
                                    {watchedPayments.map((payment, index) => {
                                        const selectedMethod = payment?.method || '';
                                        const filteredAccounts = selectedMethod === 'Tiền mặt'
                                            ? accounts.filter(acc => acc.type === 'cash')
                                            : accounts.filter(acc => acc.type === 'bank');
                                        
                                        const sortedAccounts = [...filteredAccounts].sort((a, b) => {
                                            if (a.isDefault && !b.isDefault) return -1;
                                            if (!a.isDefault && b.isDefault) return 1;
                                            return 0;
                                        });
                                        
                                        return (
                                        <div key={index} className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg">
                                            <div className="col-span-4">
                                                <Label className="text-xs mb-1 block">Phương thức</Label>
                                                <Controller
                                                    control={control}
                                                    name={`payments.${index}.method`}
                                                    render={({ field }) => (
                                                        <Select onValueChange={(val) => {
                                                            field.onChange(val);
                                                            const newFilteredAccounts = val === 'Tiền mặt'
                                                                ? accounts.filter(acc => acc.type === 'cash')
                                                                : accounts.filter(acc => acc.type === 'bank');
                                                            const defaultAcc = newFilteredAccounts.find(a => a.isDefault) || newFilteredAccounts[0];
                                                            if (defaultAcc) {
                                                                setValue(`payments.${index}.accountSystemId`, defaultAcc.systemId);
                                                            }
                                                        }} value={field.value}>
                                                            <SelectTrigger className="h-9">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {paymentMethodsData.filter(pm => pm.isActive).map(pm => (
                                                                    <SelectItem key={pm.systemId} value={pm.name}>{pm.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <Label className="text-xs mb-1 block">Tài khoản</Label>
                                                <Controller
                                                    control={control}
                                                    name={`payments.${index}.accountSystemId`}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="h-9">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {sortedAccounts.map(acc => (
                                                                    <SelectItem key={acc.systemId} value={acc.systemId}>
                                                                        {acc.name} {acc.isDefault && '⭐'}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <Label className="text-xs mb-1 block">Số tiền</Label>
                                                <Controller
                                                    control={control}
                                                    name={`payments.${index}.amount`}
                                                    render={({ field }) => (
                                                        <CurrencyInput 
                                                            value={field.value as number} 
                                                            onChange={field.onChange}
                                                            className="h-9"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1 pt-5">
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-10"
                                                    onClick={() => {
                                                        const currentPayments = getValues('payments') || [];
                                                        setValue('payments', currentPayments.filter((_, i) => i !== index));
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        );
                                    })}
                                    <div className="flex justify-between pt-2 border-t text-sm">
                                        <span className="font-medium">Tổng đã thanh toán:</span>
                                        <span className="font-semibold">
                                            {formatCurrency((watchedPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0))}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Chưa có phương thức thanh toán. Nhấn "Thêm phương thức" để bắt đầu.
                                </p>
                            )}

                            <Separator />

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Đã thanh toán</span>
                                <span className="text-base font-semibold">
                                    {formatCurrency((watchedPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0))}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Khách còn phải trả</span>
                                <span className="text-lg font-bold text-amber-600">
                                    {formatCurrency(Math.abs(finalAmount) - ((watchedPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0)))}
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Row 7: Giao hàng (chỉ hiển thị khi có sản phẩm đổi) */}
            <ShippingCard hidden={exchangeFields.length === 0} customer={customer} />
        </div>
        <ProductSelectionDialog 
            isOpen={isProductSelectionOpen} 
            onOpenChange={setIsProductSelectionOpen} 
            onSelect={handleSelectProducts} 
        />
      </form>
    </FormProvider>
  );
}
