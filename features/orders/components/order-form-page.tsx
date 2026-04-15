'use client'

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { useSearchParamsWithSetter } from '@/lib/hooks/use-search-params-setter';
import { useForm, FormProvider, useWatch, useFieldArray, useFormContext } from 'react-hook-form';
import { formatDateCustom, getCurrentDate, toISODateTime, parseDate } from '@/lib/date-utils';
import { PackageOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// types
import type { Product } from '@/features/products/types';
import type { ProductFormValues } from '@/features/products/validation';
import type { Order, LineItem, OrderMainStatus, OrderDeliveryStatus, Packaging, OrderPaymentStatus, OrderAddress, Customer, CustomerAddress as _CustomerAddress, OrderPrintStatus, OrderStockOutStatus, OrderReturnStatus, OrderDeliveryMethod, OrderInvoiceInfo } from '@/lib/types/prisma-extended';

// stores
import { useProductFinder } from '@/features/products/hooks/use-all-products';
// ✅ REMOVED: useAllProducts - no longer needed, use API validation instead
import { useAllEmployees } from '@/features/employees/hooks/use-all-employees';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { useOrder } from '../hooks/use-orders';
import { useOrderMutations } from '../hooks/use-order-mutations';
import { useOrderActions } from '../hooks/use-order-actions';
// ✅ REMOVED: useOrderFinder - no longer needed, React Query fetches orders directly
import { validateStockAvailability } from '@/features/products/api/products-api';
import { usePaymentMethods } from '@/features/settings/payments/methods/hooks/use-payment-methods';
import { useSalesChannels } from '@/features/settings/sales-channels/hooks/use-sales-channels';
// ✅ REMOVED: import { generateNextId } - use id: '' instead
import { getSalesSettingsSync } from '@/features/settings/sales/sales-management-service';
import { useAllPricingPolicies } from '@/features/settings/pricing/hooks/use-all-pricing-policies';
import { useStockHistoryMutations } from '@/features/stock-history/hooks/use-stock-history';
import { useAllShippingPartners } from '@/features/settings/shipping/hooks/use-all-shipping-partners';
import { useAllTaxesData } from '@/features/settings/taxes/hooks/use-all-taxes';
import { SUPPORTED_SHIPPING_PARTNERS as _SUPPORTED_SHIPPING_PARTNERS, SHIPPING_PARTNER_NAMES as _SHIPPING_PARTNER_NAMES, isSupportedShippingPartner, getPreviewParamsKey, getConfigParamsKey, type ShippingPartnerId as _ShippingPartnerId } from '../shipping-partners-config';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import { generateTempId } from '@/lib/id-utils';

// UI components
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Lazy load heavy dialogs for better initial load performance
const ProductSelectionDialog = dynamic(
  () => import('@/features/shared/product-selection-dialog').then(m => ({ default: m.ProductSelectionDialog })),
  { ssr: false, loading: () => null }
);
const AddServiceDialog = dynamic(
  () => import('./add-service-dialog').then(m => ({ default: m.AddServiceDialog })),
  { ssr: false, loading: () => null }
);
const ApplyPromotionDialog = dynamic(
  () => import('./apply-promotion-dialog').then(m => ({ default: m.ApplyPromotionDialog })),
  { ssr: false, loading: () => null }
);

import { usePageHeader } from '@/contexts/page-header-context';
import { useAuth } from '@/contexts/auth-context';

// Refactored Components
import { CustomerSelector } from './customer-selector';
import { OrderInfoCard } from './order-info-card';
import { OrderProductSearch } from '@/components/shared/unified-product-search';
// LineItemsTable is lazy loaded below for better performance (700+ lines)
import { OrderSummary } from './order-summary';
import { OrderNotes } from './order-notes';
import { OrderTags } from './order-tags';
// AddServiceDialog and ApplyPromotionDialog are dynamically imported above
import { ProductTableToolbar } from './product-table-toolbar';
import type { ProductTableSettings } from './product-table-toolbar';
import { ProductTableBottomToolbar } from './product-table-bottom-toolbar';
// ShippingCard is lazy loaded below for better performance
import { GHTKService, type GHTKCreateOrderParams } from '@/features/settings/shipping/integrations/ghtk-service';
import { loadShippingConfig } from '@/lib/utils/shipping-config-migration';
import { cloneOrderAddress } from '../address-utils';

// Lazy load heavy line items table (700+ lines with complex calculations)
const LineItemsTable = dynamic(
  () => import('./line-items-table').then(m => ({ default: m.LineItemsTable })),
  { 
    ssr: false, 
    loading: () => (
      <div className="animate-pulse bg-muted h-32 rounded-lg" />
    )
  }
);

// Lazy load heavy shipping component (1200+ lines)
const ShippingCard = dynamic(
  () => import('./shipping-card').then(m => ({ default: m.ShippingCard })),
  { 
    ssr: false, 
    loading: () => (
      <div className="animate-pulse bg-muted h-48 rounded-lg" />
    )
  }
);
// Form-specific types
type FormLineItem = {
  id: string; 
  systemId: string;
  productSystemId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  tax: number; // Tax rate (%)
  taxId?: string; // Tax systemId for reference
  total: number;
  note?: string; // Ghi chú cho sản phẩm
  // ✅ Store prices object for policy switching without needing useAllProducts
  prices?: Record<string, number>;
  // ✅ Store thumbnailImage for display
  thumbnailImage?: string;
};

export type OrderFormValues = {
  customer: Customer | null; 
  branchSystemId: string;
  salespersonSystemId: string;
  packerId?: string | undefined;
  orderDate: Date;
  source: string;
  notes: string;
  tags?: (string | undefined)[] | undefined; // Tags phân loại đơn hàng
  
  // Expected dates & payment
  expectedDeliveryDate?: Date | undefined; // Hẹn giao
  expectedPaymentMethod?: string | undefined; // Thanh toán dự kiến
  
  // External references
  referenceUrl?: string | undefined; // Link đơn hàng bên ngoài
  externalReference?: string | undefined; // Mã tham chiếu bên ngoài
  
  // Service fees
  serviceFees?: Array<{ id: string; name: string; amount: number }> | undefined; // Phí dịch vụ khác
  
  // Discount & Promotions
  orderDiscount?: number | undefined;
  orderDiscountType?: 'percentage' | 'fixed' | undefined;
  orderDiscountReason?: string | undefined;
  voucherCode?: string | undefined;
  voucherAmount?: number | undefined;
  
  trackingCode?: string | undefined;
  shippingPartnerId?: string | undefined;
  shippingServiceId?: string | undefined;
  lineItems: FormLineItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  payments: { method: string; amount: number }[];
  deliveryMethod: string;
  // Add shipping details for the form
  codAmount?: number | undefined;
  weight?: number | undefined;
  length?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  payer?: 'Người gửi' | 'Người nhận' | undefined;
  shippingNote?: string | undefined;
  deliveryRequirement?: string | undefined;
  configuration?: Record<string, unknown> | undefined;
  shippingAddress?: OrderAddress | null; // ✅ Selected shipping address from customer
  billingAddress?: OrderAddress | null; // ✅ Selected billing address from customer
  invoiceInfo?: OrderInvoiceInfo | null; // ✅ Invoice info from business profile
};

const normalizeOrderAddress = (address?: string | OrderAddress | null): OrderAddress | undefined => {
        if (!address) return undefined;
        if (typeof address === 'string') {
                return { street: address };
        }
        return cloneOrderAddress(address);
};

const calculateLineTotal = (item: FormLineItem | LineItem): number => {
    if (!item) return 0;
    const { unitPrice = 0, quantity = 0, discount = 0, discountType = 'fixed', tax = 0 } = item as FormLineItem;
    
    const lineGross = (Number(unitPrice) || 0) * (Number(quantity) || 0);
    // Apply tax first
    const lineWithTax = lineGross * (1 + (Number(tax) || 0) / 100);
    // Then apply discount
    let lineDiscountAmount = 0;
    const discountAmount = Number(discount) || 0;
    if (discountAmount > 0) {
        if (discountType === 'percentage') {
            lineDiscountAmount = lineWithTax * (discountAmount / 100);
        } else {
            lineDiscountAmount = discountAmount;
        }
    }
    return lineWithTax - lineDiscountAmount;
};

const OrderCalculations = React.memo(() => {
    const { control, setValue, getValues } = useFormContext<OrderFormValues>();
    const watchedLineItems = useWatch({ control, name: "lineItems" });
    const watchedShippingFee = useWatch({ control, name: "shippingFee" });
    const watchedOrderDiscount = useWatch({ control, name: "orderDiscount" });
    const watchedOrderDiscountType = useWatch({ control, name: "orderDiscountType" });
    const watchedVoucherAmount = useWatch({ control, name: "voucherAmount" });
    const watchedServiceFees = useWatch({ control, name: "serviceFees" });
    
    // Use deferred value to prevent blocking UI during rapid typing
    const deferredLineItems = React.useDeferredValue(watchedLineItems);
    
    // ✅ Track previous calculated values to prevent infinite loops
    const prevValuesRef = React.useRef<{ subtotal: number; tax: number; grandTotal: number } | null>(null);

    React.useEffect(() => {
        const items = deferredLineItems || [];
        const shipping = Number(watchedShippingFee) || 0;
        
        // Calculate subtotal from line items (totals are calculated per-row in LineItemRow)
        const subtotal = items.reduce((sum, item) => {
            // Calculate total inline instead of using item.total to avoid dependency loop
            const lineTotal = calculateLineTotal(item);
            return sum + lineTotal;
        }, 0);
        
        // Calculate total tax from all line items
        const totalTax = items.reduce((sum, item) => {
            const lineGross = (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0);
            const taxAmount = lineGross * ((item as FormLineItem).tax || 0) / 100;
            return sum + taxAmount;
        }, 0);
        
        // Tính chiết khấu toàn đơn
        let orderDiscountAmount = 0;
        if (watchedOrderDiscount) {
            const totalBeforeDiscount = subtotal + shipping;
            if (watchedOrderDiscountType === 'percentage') {
                orderDiscountAmount = Math.round((totalBeforeDiscount * watchedOrderDiscount) / 100);
            } else {
                orderDiscountAmount = watchedOrderDiscount;
            }
        }
        
        // Tính voucher
        const voucherDiscount = Number(watchedVoucherAmount) || 0;
        
        // Tính tổng phí dịch vụ
        const serviceFeeTotal = (watchedServiceFees || []).reduce((sum: number, fee) => sum + (Number(fee.amount) || 0), 0);
        
        // Tổng cộng = Subtotal + Shipping + Service Fees - Order Discount - Voucher
        const grandTotal = Math.max(0, subtotal + shipping + serviceFeeTotal - orderDiscountAmount - voucherDiscount);
        
        // ✅ Only update if values actually changed (prevent infinite loop)
        const prev = prevValuesRef.current;
        if (!prev || prev.subtotal !== subtotal || prev.tax !== totalTax || prev.grandTotal !== grandTotal) {
            prevValuesRef.current = { subtotal, tax: totalTax, grandTotal };
            
            React.startTransition(() => {
                setValue('subtotal', subtotal, { shouldValidate: false });
                setValue('tax', totalTax, { shouldValidate: false });
                setValue('grandTotal', grandTotal, { shouldValidate: false });
            });
        }

    }, [deferredLineItems, watchedShippingFee, watchedOrderDiscount, watchedOrderDiscountType, watchedVoucherAmount, watchedServiceFees, setValue, getValues]);

    return null;
});
OrderCalculations.displayName = 'OrderCalculations';

// Main Component
export function OrderFormPage() {
    const params = useParams();
    const rawSystemId = params.systemId;
    const systemId = Array.isArray(rawSystemId) ? rawSystemId[0] : rawSystemId;
    const router = useRouter();
    const [searchParams] = useSearchParamsWithSetter();
    
    // ✅ Get copy param early
    const copyParam = searchParams.get('copy');
    const copyOrderSystemId = Array.isArray(copyParam) ? copyParam[0] : copyParam;
    
    // React Query mutations for order CRUD
    const { create: add, update } = useOrderMutations({
        onCreateSuccess: () => toast.success('Đơn hàng đã được tạo'),
        onUpdateSuccess: () => toast.success('Đơn hàng đã được cập nhật'),
        onError: (err) => toast.error(err.message),
    });
    
    // React Query for order actions (addPayment)
    const { addPayment: addOrderPayment } = useOrderActions({
        onSuccess: () => toast.success('Thanh toán đã được thêm'),
        onError: (err) => toast.error(err.message),
    });
    
    // ✅ REMOVED: useOrderFinder - no longer needed, React Query fetches orders directly
    
    // React Query for single order (edit mode)
    const { data: orderFromQuery, isLoading: isOrderLoading } = useOrder(systemId);
    
    // ✅ React Query for copy source order - fetch with full data
    const { data: copySourceOrderFromQuery } = useOrder(copyOrderSystemId || undefined);
    
    const { data: employees } = useAllEmployees();
    const { data: branches } = useAllBranches();
    const { data: pricingPolicies } = useAllPricingPolicies();
    const { findById: findProductById } = useProductFinder();
    // ✅ REMOVED: useProductStore, useStockHistoryStore - replaced with React Query hooks
    const { create: createStockHistoryEntry } = useStockHistoryMutations();
    const { data: partners } = useAllShippingPartners();
    const { getDefaultSale } = useAllTaxesData();
    
    // React Query for payment methods and sales channels
    const { data: pmData } = usePaymentMethods({ isActive: true });
    const paymentMethods = React.useMemo(() => pmData?.data ?? [], [pmData?.data]);
    const { data: scData } = useSalesChannels({});
    const salesChannels = React.useMemo(() => scData?.data ?? [], [scData?.data]);

    const isEditing = !!systemId;
    // ✅ Ưu tiên React Query - không cần fallback vì useOrder đã fetch từ API
    const order = React.useMemo(() => {
      if (systemId) {
        return orderFromQuery || null;
      }
      return null;
    }, [systemId, orderFromQuery]);
    
    // ✅ Copy source order - sử dụng React Query (có full data bao gồm customer và product)
    const copySourceOrder = React.useMemo(() => {
        if (isEditing || !copyOrderSystemId) return null;
        return copySourceOrderFromQuery || null;
    }, [isEditing, copyOrderSystemId, copySourceOrderFromQuery]);
    
    // ✅ NEW LOGIC: Kiểm tra xem đơn đã có phiếu đóng gói/xuất kho chưa
    const isPackagedOrDispatched = React.useMemo(() => {
        if (!order) return false;
        
        // ✅ Check if there are any ACTIVE (non-cancelled) packagings
        // Chỉ cần CÓ phiếu đóng gói chưa bị hủy = lock sửa sản phẩm/KH
        const hasActivePackaging = order.packagings?.some(p => 
            p.status !== 'Hủy đóng gói' && 
            p.status !== 'CANCELLED'
        );
        
        if (hasActivePackaging) return true;
        
        // Đã xuất kho hoặc hoàn thành
        return order.stockOutStatus !== 'Chưa xuất kho' || 
               order.status === 'Hoàn thành';
    }, [order]);

    // ✅ Chỉ cho sửa metadata (tags, notes, dates, references) khi đã đóng gói/xuất kho
    const isMetadataOnlyMode = isPackagedOrDispatched;

    // ✅ Xuất kho / Hoàn thành: KHÔNG cho sửa tags, ghi chú (chỉ đóng gói mới được)
    const isShippedOrCompleted = React.useMemo(() => {
        if (!order) return false;
        return order.stockOutStatus !== 'Chưa xuất kho' || order.status === 'Hoàn thành';
    }, [order]);

    const isFullyReadOnly = React.useMemo(() => {
        if (!order) return false;
        // ✅ Chỉ khóa hoàn toàn khi đơn đã hủy. 
        // Đơn hoàn thành/đã giao vẫn cho sửa metadata (Tags, Notes, v.v.)
        return order.status === 'Đã hủy';
    }, [order]);
    
    // Lock Chi nhánh khi đã duyệt
    const isBranchLocked = React.useMemo(() => {
        if (!order) return false;
        return order.status === 'Đang giao dịch' || order.status === 'Hoàn thành';
    }, [order]);

    // ✅ Form disabled: Hoàn toàn read-only (đã hủy, đã giao)
    const isFormDisabled = isFullyReadOnly;

    
    const [isProductSelectionOpen, setIsProductSelectionOpen] = React.useState(false);
    const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = React.useState(false);
    const [isApplyPromotionDialogOpen, setIsApplyPromotionDialogOpen] = React.useState(false);
    const [enableSplitLine, setEnableSplitLine] = React.useState(false);
    const [submitAction, setSubmitAction] = React.useState<'draft' | 'approve'>('draft');
    const [tableSettings, setTableSettings] = React.useState<ProductTableSettings>({
        comboDisplayType: 'value',
        discountDefaultType: 'value',
        productInsertPosition: 'top',
    });
    
    // ✅ OPTIMIZED: Memoize dialog toggle callbacks
    const openProductSelection = React.useCallback(() => setIsProductSelectionOpen(true), []);
    const openAddServiceDialog = React.useCallback(() => setIsAddServiceDialogOpen(true), []);
    const openApplyPromotionDialog = React.useCallback(() => setIsApplyPromotionDialogOpen(true), []);
    
    const { employee: currentEmployee } = useAuth();
    const currentEmployeeName = currentEmployee?.fullName ?? 'Hệ thống';
    const _currentEmployeeSystemId = currentEmployee?.systemId ?? asSystemId('SYSTEM');
    const salesPolicies = React.useMemo(() => pricingPolicies.filter(p => p.type === 'Bán hàng'), [pricingPolicies]);
    const defaultSellingPolicy = React.useMemo(() => salesPolicies.find(p => p.isDefault) || salesPolicies[0], [salesPolicies]);
    const [selectedPolicyId, setSelectedPolicyId] = React.useState<string>(defaultSellingPolicy?.systemId || '');
    
    // Get default branch
    const defaultBranch = React.useMemo(() => branches.find(b => b.isDefault), [branches]);
    
        const form = useForm<OrderFormValues>({
      defaultValues: {
                customer: null, branchSystemId: defaultBranch?.systemId || '', salespersonSystemId: '', orderDate: new Date(), source: '', notes: '', lineItems: [],
        subtotal: 0, shippingFee: 0, tax: 0, grandTotal: 0, payments: [], packerId: '', trackingCode: '',
        shippingPartnerId: undefined, shippingServiceId: undefined, deliveryMethod: 'deliver-later', configuration: {},
                orderDiscount: 0, orderDiscountType: 'fixed',
                expectedPaymentMethod: '',
                payer: 'Người nhận', // ✅ Default: khách hàng trả phí vận chuyển
                referenceUrl: '', // ✅ Prevent undefined
                externalReference: '', // ✅ Prevent undefined
      }
    });
    const { handleSubmit, getValues, setValue, reset, control } = form;
    const { fields, append, prepend, remove, update: updateField } = useFieldArray({ control, name: "lineItems" });
    const selectedBranchSystemId = useWatch({ control, name: 'branchSystemId' });
    const copyPrefillAppliedRef = React.useRef(false);

    const _handleSimplifiedAddProduct = (values: ProductFormValues) => {
        const defaultBranch = branches.find(b => b.isDefault);
        const inventoryByBranch: Record<string, number> = {};
        const initialInventory = values.inventory || 0;
        
        branches.forEach(branch => {
            inventoryByBranch[branch.systemId] = (defaultBranch && branch.systemId === defaultBranch.systemId) ? initialInventory : 0;
        });

                const _productToAdd = { ...values, inventoryByBranch, committedByBranch: {}, inTransitByBranch: {} };
                const createdProduct = null as unknown as Product; // TODO: Replace with useProductMutations().create.mutateAsync
                if (!createdProduct) {
                    return;
                }
        
        branches.forEach(branch => {
            const stockLevel = inventoryByBranch[branch.systemId] || 0;
            if (stockLevel > 0) {
              createStockHistoryEntry.mutate({
                  productId: createdProduct.systemId,
                  employeeName: currentEmployeeName,
                  action: 'Khởi tạo variant',
                  quantityChange: stockLevel,
                  newStockLevel: stockLevel,
                  documentId: createdProduct.id,
                  branchId: branch.systemId,
              });
            }
        });
    };

        const appliedSalesChannels = React.useMemo(() => salesChannels.filter(channel => channel.isApplied), [salesChannels]);
        const defaultSalesChannelName = React.useMemo(() => {
            const preferred = appliedSalesChannels.find(channel => channel.isDefault);
            return preferred?.name || appliedSalesChannels[0]?.name || '';
        }, [appliedSalesChannels]);
        const activePaymentMethods = React.useMemo(() => paymentMethods.filter(method => method.isActive), [paymentMethods]);
        const defaultPaymentMethodName = React.useMemo(() => {
            const preferred = activePaymentMethods.find(method => method.isDefault);
            return preferred?.name || activePaymentMethods[0]?.name || '';
        }, [activePaymentMethods]);

    // ✅ Only run once when defaultSellingPolicy systemId is available
    const defaultSellingPolicyId = defaultSellingPolicy?.systemId || '';
    React.useEffect(() => {
        if (defaultSellingPolicyId && !selectedPolicyId) {
            setSelectedPolicyId(defaultSellingPolicyId);
        }
    }, [defaultSellingPolicyId, selectedPolicyId]);

    // Auto-select default values for new orders
    React.useEffect(() => {
        if (isEditing) return;

        // 1. Branch
        if (defaultBranch && !getValues('branchSystemId')) {
            setValue('branchSystemId', defaultBranch.systemId);
        }

        // 2. Salesperson
        if (currentEmployee?.systemId && !getValues('salespersonSystemId')) {
            setValue('salespersonSystemId', currentEmployee.systemId);
        }

        // 3. Source (Sales Channel)
        if (defaultSalesChannelName) {
            const currentSource = getValues('source');
            if (!currentSource) {
                // Use setTimeout to ensure form is ready and avoid race conditions
                setTimeout(() => {
                    setValue('source', defaultSalesChannelName, { shouldValidate: true, shouldDirty: true });
                }, 100);
            }
        }

        // 4. Payment Method
        if (defaultPaymentMethodName) {
            const currentPayment = getValues('expectedPaymentMethod');
            if (!currentPayment) {
                setTimeout(() => {
                    setValue('expectedPaymentMethod', defaultPaymentMethodName, { shouldValidate: true, shouldDirty: true });
                }, 100);
            }
        }
    }, [isEditing, defaultBranch, currentEmployee, defaultSalesChannelName, defaultPaymentMethodName, getValues, setValue]);

    // ✅ Update prices when pricing policy changes - uses stored prices in line items
    React.useEffect(() => {
        if (!selectedPolicyId || isFormDisabled || isMetadataOnlyMode) return;
        
        const currentItems = getValues('lineItems');
        if (!currentItems || currentItems.length === 0) return;
        
        currentItems.forEach((item, index) => {
            // ✅ Use prices stored in line item instead of looking up from allProducts
            if (item.prices) {
                const newPrice = item.prices[selectedPolicyId] ?? 0;
                const currentPrice = getValues(`lineItems.${index}.unitPrice`);
                if (currentPrice !== newPrice) {
                    setValue(`lineItems.${index}.unitPrice`, newPrice, { shouldDirty: true });
                }
            }
        });
    }, [selectedPolicyId, getValues, setValue, isFormDisabled, isMetadataOnlyMode]); 

    // ✅ Track if edit form has been initialized to prevent re-running reset
    const editFormInitializedRef = React.useRef<string | null>(null);
    
    // ✅ Check if all required data is loaded
    const isDataReady = branches.length > 0 && employees.length > 0;
    
    React.useEffect(() => {
        // Wait for all data to be loaded before resetting form
        if (!isEditing || !order || !isDataReady) return;
        
        // Only run once per order (when order.systemId changes or first load)
        if (editFormInitializedRef.current === order.systemId) return;
        editFormInitializedRef.current = order.systemId;
        
        // ✅ Use order.customer directly from API response (includes customer data)
        const customer = order.customer as Customer | null;
        
        // ✅ Check for active (non-cancelled) packagings with carrier
        const hasActiveShippingPackaging = order.packagings?.some(p => 
            p.carrier && 
            p.status !== 'Hủy đóng gói' && 
            p.status !== 'CANCELLED' &&
            p.deliveryStatus !== 'Đã hủy' &&
            p.deliveryStatus !== 'CANCELLED'
        );
        
        let deliveryMethod = 'deliver-later';
        if (order.deliveryMethod === 'Nhận tại cửa hàng') {
            deliveryMethod = 'pickup';
        } else if (order.shippingInfo?.carrier || hasActiveShippingPackaging) {
            deliveryMethod = 'shipping-partner';
        }

        const savedShippingAddress = normalizeOrderAddress(order.shippingAddress);
        const savedBillingAddress = normalizeOrderAddress(order.billingAddress);

        // ✅ Get packer ID - try order level first, then fallback to first packaging with assigned employee
        const orderPackerId = (order as { assignedPackerId?: string }).assignedPackerId || (order as { packerId?: string }).packerId;
        const packagingPackerId = order.packagings?.find(p => p.assignedEmployeeId)?.assignedEmployeeId;
        const effectivePackerId = orderPackerId || packagingPackerId || '';

        // Debug log to check values

        reset({
            customer: customer || null,
            branchSystemId: order.branchSystemId || '', // ✅ Ensure not undefined
            salespersonSystemId: order.salespersonSystemId || '', // ✅ Ensure not undefined
            packerId: effectivePackerId,
            orderDate: parseDate(order.orderDate) || getCurrentDate(),
            expectedDeliveryDate: order.expectedDeliveryDate ? (parseDate(order.expectedDeliveryDate) || undefined) : undefined,
            notes: order.notes || '',
            tags: order.tags || [], // Tags phân loại đơn hàng
            source: order.source || '',
            trackingCode: order.shippingInfo?.trackingCode || '',
            shippingPartnerId: partners.find(p => p.name === order.shippingInfo?.carrier)?.systemId,
            shippingServiceId: partners.find(p => p.name === order.shippingInfo?.carrier)?.services.find(s => s.name === order.shippingInfo?.service)?.id,
            deliveryMethod,
            // ✅ Load saved addresses from order (if editing)
            shippingAddress: savedShippingAddress || customer?.addresses?.find(a => a.isDefaultShipping) || null,
            billingAddress: savedBillingAddress || customer?.addresses?.find(a => a.isDefaultBilling) || null,
            invoiceInfo: (order.invoiceInfo as OrderInvoiceInfo | null) || null,
            expectedPaymentMethod: order.expectedPaymentMethod || '',
            referenceUrl: (order as { referenceUrl?: string }).referenceUrl || '',
            externalReference: (order as { externalReference?: string }).externalReference || '',
            lineItems: order.lineItems.map(li => {
                // ✅ Lookup product to get correct SKU and thumbnailImage
                const prod = findProductById(asSystemId(li.productSystemId));
                return {
                    id: `li_${li.productSystemId}_${Math.random()}`,
                    systemId: '',
                    productSystemId: li.productSystemId,
                    productId: prod?.id || li.productId,
                    productName: prod?.name || li.productName,
                    quantity: li.quantity,
                    unitPrice: li.unitPrice,
                    discount: li.discount,
                    discountType: li.discountType,
                    tax: (li as { tax?: number; taxId?: string }).tax || 0,
                    taxId: (li as { tax?: number; taxId?: string }).taxId || '',
                    total: calculateLineTotal(li),
                    note: li.note || '',
                    thumbnailImage: prod?.thumbnailImage || (li as { thumbnailImage?: string }).thumbnailImage,
                };
            }),
            subtotal: order.subtotal,
            shippingFee: order.shippingFee,
            tax: order.tax,
            grandTotal: order.grandTotal,
            payments: order.payments.map(p => ({ method: p.method, amount: p.amount })),
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, order?.systemId, isDataReady]); // ✅ Also depend on isDataReady to ensure data is loaded

    React.useEffect(() => {
        if (isEditing || !copySourceOrder || copyPrefillAppliedRef.current) {
            return;
        }

        copyPrefillAppliedRef.current = true;
        
        // ✅ API response includes customer object directly - use it instead of store lookup
        // Type assertion because Order type doesn't include customer object but API does
        const apiResponse = copySourceOrder as unknown as { 
            customer?: { 
                systemId: string; 
                id?: string;
                name?: string; 
                phone?: string; 
                email?: string;
                addresses?: Array<{ isDefaultShipping?: boolean; isDefaultBilling?: boolean; [key: string]: unknown }>;
                [key: string]: unknown;
            };
            lineItems: Array<{
                productSystemId: string;
                productId?: string;
                productName?: string;
                quantity: number;
                unitPrice: number;
                discount: number;
                discountType?: string;
                note?: string;
                product?: {
                    systemId?: string;
                    id?: string;
                    name?: string;
                    imageUrl?: string;
                };
                [key: string]: unknown;
            }>;
        };
        
        // ✅ Use customer from API response directly
        const customer = apiResponse.customer || null;
        const defaultShippingAddress = customer?.addresses?.find(a => a.isDefaultShipping) || null;
        const defaultBillingAddress = customer?.addresses?.find(a => a.isDefaultBilling) || null;
        const copiedShippingAddress = normalizeOrderAddress(copySourceOrder.shippingAddress);
        const copiedBillingAddress = normalizeOrderAddress(copySourceOrder.billingAddress);

        const deliveryMethod = 'deliver-later';
        
        reset({
            customer: customer as Customer | null,
            branchSystemId: copySourceOrder.branchSystemId,
            salespersonSystemId: copySourceOrder.salespersonSystemId,
            packerId: undefined,
            orderDate: getCurrentDate(),
            notes: copySourceOrder.notes || '',
            tags: copySourceOrder.tags || [],
            source: copySourceOrder.source || '',
            trackingCode: '',
            shippingPartnerId: undefined,
            shippingServiceId: undefined,
            deliveryMethod,
            shippingAddress: (copiedShippingAddress || defaultShippingAddress) as OrderAddress | null,
            billingAddress: (copiedBillingAddress || defaultBillingAddress) as OrderAddress | null,
            expectedPaymentMethod: '',
            lineItems: apiResponse.lineItems.map(li => {
                // ✅ API response includes product object with imageUrl - use it directly
                const productFromApi = li.product;
                return {
                    id: `copy_${li.productSystemId}_${Math.random()}`,
                    systemId: '',
                    productSystemId: li.productSystemId,
                    // ✅ Use product.id from API (business ID / SKU), fallback to li.productId
                    productId: productFromApi?.id || li.productId || '',
                    productName: productFromApi?.name || li.productName || '',
                    quantity: li.quantity,
                    unitPrice: li.unitPrice,
                    discount: li.discount,
                    discountType: li.discountType as 'fixed' | 'percentage' | undefined,
                    tax: (li as { tax?: number; taxId?: string }).tax || 0,
                    taxId: (li as { tax?: number; taxId?: string }).taxId || '',
                    total: calculateLineTotal(li as LineItem),
                    note: li.note || '',
                    // ✅ Use thumbnailImage/imageUrl from API response
                    thumbnailImage: (productFromApi as { thumbnailImage?: string; imageUrl?: string })?.thumbnailImage || 
                                    (productFromApi as { thumbnailImage?: string; imageUrl?: string })?.imageUrl || '',
                };
            }),
            subtotal: copySourceOrder.subtotal,
            shippingFee: copySourceOrder.shippingFee,
            tax: copySourceOrder.tax,
            grandTotal: copySourceOrder.grandTotal,
            payments: [],
            orderDiscount: copySourceOrder.orderDiscount ?? 0,
            orderDiscountType: copySourceOrder.orderDiscountType ?? 'fixed',
            orderDiscountReason: copySourceOrder.orderDiscountReason,
            voucherCode: copySourceOrder.voucherCode,
            voucherAmount: copySourceOrder.voucherAmount,
            serviceFees: copySourceOrder.serviceFees ? copySourceOrder.serviceFees.map(fee => ({ ...fee })) : undefined,
            expectedDeliveryDate: copySourceOrder.expectedDeliveryDate ? parseDate(copySourceOrder.expectedDeliveryDate) || undefined : undefined,
            configuration: {},
            codAmount: 0,
        });

        toast.success('Đang sao chép đơn hàng', {
            description: `Dữ liệu từ ${copySourceOrder.id} đã được điền sẵn. Vui lòng kiểm tra trước khi lưu.`,
        });
    }, [isEditing, copySourceOrder, reset]);
    
    const handleSelectProducts = React.useCallback((selectedProducts: Product[], quantities?: Record<string, number>) => {
        const currentItems = getValues('lineItems');

        const newItems: FormLineItem[] = [];
        
        selectedProducts.forEach((product, _idx) => {
            const price = product.prices[selectedPolicyId] || 0;
            // Get quantity from dialog, default to 1 if not provided or 0
            const selectedQty = quantities?.[product.systemId] || 1;
            
            // If split line is disabled, try to find existing item and increase quantity
            if (!enableSplitLine) {
                const existingIndex = currentItems.findIndex(item => item.productSystemId === product.systemId);
                
                if (existingIndex > -1) {
                    const currentItem = getValues(`lineItems.${existingIndex}`);
                    // Add the selected quantity (not just 1)
                    const updatedItem = { ...currentItem, quantity: (Number(currentItem.quantity) || 0) + selectedQty };
                    updateField(existingIndex, updatedItem);
                    return; // Skip adding new line
                }
            }
            
            // Add as new line (either split line is enabled, or product doesn't exist yet)
            // Ensure unique ID by using timestamp + random + index
            const defaultTax = getDefaultSale();
            const taxRate = defaultTax?.rate || 0;
            const newItem = {
                id: generateTempId('item'),
                systemId: '',
                productSystemId: product.systemId,
                productId: product.id,
                productName: product.name,
                quantity: selectedQty, // Use quantity from dialog
                unitPrice: price,
                discount: 0,
                discountType: (tableSettings.discountDefaultType === 'percent' ? 'percentage' : 'fixed') as 'fixed' | 'percentage',
                tax: taxRate,
                taxId: defaultTax?.systemId || '',
                total: price * selectedQty * (1 + taxRate / 100),
                // ✅ Store prices for policy switching without needing useAllProducts
                prices: product.prices || {},
                // ✅ Store thumbnailImage for display
                thumbnailImage: product.thumbnailImage,
            };
            newItems.push(newItem);
        });

        // Add items based on insert position setting
        if (newItems.length > 0) {
            if (tableSettings.productInsertPosition === 'top') {
                // Add to top (prepend in reverse order to maintain selection order)
                newItems.reverse().forEach(item => prepend(item));
            } else {
                // Add to bottom (append)
                newItems.forEach(item => append(item));
            }
        }
    }, [getValues, selectedPolicyId, enableSplitLine, updateField, getDefaultSale, tableSettings, prepend, append]);

    const handleApplyPromotion = React.useCallback(async (code: string) => {
        try {
            const subtotal = getValues('subtotal') || 0;
            const shippingFee = getValues('shippingFee') || 0;
            const orderTotal = subtotal + Number(shippingFee);

            const { validatePromotionCode } = await import('@/features/promotions/api/fetch-promotions');
            const result = await validatePromotionCode(code, orderTotal);

            setValue('voucherCode', result.code, { shouldDirty: true });
            setValue('voucherAmount', result.discountAmount, { shouldDirty: true });
            toast.success(`Áp dụng mã ${result.code}: giảm ${new Intl.NumberFormat('vi-VN').format(result.discountAmount)}đ`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Mã giảm giá không hợp lệ');
        }
    }, [getValues, setValue]);
    
    /**
     * Tạo đơn hàng trên GHTK và lấy mã vận đơn
     * ✅ SINGLE SOURCE OF TRUTH: Nhận params đã build sẵn từ shipping-integration (previewParams)
     * Returns: { label: string, shipMoney: number } | null
     */
    const createGHTKOrder = async (ghtkParams: GHTKCreateOrderParams): Promise<{ label: string; shipMoney: number; trackingId?: number; estimatedPickTime?: string; estimatedDeliverTime?: string } | null> => {
        
        try {
            // Load shipping config
            const shippingConfig = loadShippingConfig();
            const ghtkData = shippingConfig.partners.GHTK;
            
            if (!ghtkData || !ghtkData.accounts || ghtkData.accounts.length === 0) {
                console.error('❌ [createGHTKOrder] No GHTK account configured');
                toast.error('Lỗi cấu hình', { description: 'Chưa cấu hình tài khoản GHTK' });
                return null;
            }
            
            // Get active GHTK account
            const ghtkAccount = ghtkData.accounts.find(a => a.isDefault && a.active)
                || ghtkData.accounts.find(a => a.active)
                || ghtkData.accounts[0];
            
            
            if (!ghtkAccount || !ghtkAccount.active) {
                console.error('❌ [createGHTKOrder] No active GHTK account');
                toast.error('Lỗi cấu hình', { description: 'Không tìm thấy tài khoản GHTK khả dụng' });
                return null;
            }
            
            // Get credentials
            const apiToken = ghtkAccount.credentials.apiToken as string;
            const partnerCode = ghtkAccount.credentials.partnerCode as string;
            
            if (!apiToken) {
                console.error('❌ [createGHTKOrder] Missing API Token');
                toast.error('Lỗi cấu hình', { description: 'Thiếu API Token GHTK' });
                return null;
            }
            
            // Initialize GHTK service
            const ghtkService = new GHTKService(apiToken, partnerCode || '');
            
            // ✅ Call GHTK API with params (already built by shipping-integration previewParams)
            toast.info('Đang tạo đơn trên GHTK...', { duration: 2000 });
            const result = await ghtkService.createOrder(ghtkParams);
            
            if (result.success && result.order) {
                // ✅ GHTK returns 'fee' as string (e.g., "29000"), ship_money may be 0 initially
                const shipFee = parseInt(result.order.fee || '0', 10) || result.order.ship_money || 0;
                toast.success('Đã tạo đơn GHTK thành công', { 
                    description: `Mã vận đơn: ${result.order.label}` 
                });
                return {
                    label: result.order.label,
                    shipMoney: shipFee,
                    trackingId: result.order.tracking_id,
                    estimatedPickTime: result.order.estimated_pick_time,
                    estimatedDeliverTime: result.order.estimated_deliver_time,
                };
            } else {
                console.error('❌ [createGHTKOrder] API returned failure:', result.message);
                toast.error('Tạo đơn GHTK thất bại', { 
                    description: result.message || 'Vui lòng kiểm tra lại thông tin' 
                });
                return null;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Vui lòng thử lại sau';
            console.error('❌ [createGHTKOrder] Exception:', error);
            // Don't stringify error object - may contain circular references
            toast.error('Lỗi tạo đơn GHTK', { 
                description: errorMessage 
            });
            return null;
        }
    };

    /**
     * Gọi GHTK API sau khi order đã được tạo thành công
     * Sau đó update packaging với tracking code
     */
    const createGHTKOrderAndUpdatePackaging = async (
        orderSystemId: string,
        packagingSystemId: string,
        ghtkParams: GHTKCreateOrderParams,
        extra?: { serviceName?: string; codAmount?: number; payer?: string }
    ): Promise<void> => {
        try {
            const result = await createGHTKOrder(ghtkParams);
            if (result) {
                // Update packaging với tracking code từ GHTK
                const response = await fetch(`/api/orders/${orderSystemId}/packaging/${packagingSystemId}/ghtk`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        trackingCode: result.label,
                        trackingId: result.trackingId,
                        estimatedPickTime: result.estimatedPickTime,
                        estimatedDeliverTime: result.estimatedDeliverTime,
                        shippingFee: result.shipMoney,
                        codAmount: extra?.codAmount ?? ghtkParams.pickMoney,
                        payer: extra?.payer ?? (ghtkParams.isFreeship === 1 ? 'Người gửi' : 'Người nhận'),
                        service: extra?.serviceName,
                    }),
                });
                
                if (!response.ok) {
                    console.error('Failed to update packaging with GHTK info');
                    toast.warning('Đã tạo đơn GHTK nhưng chưa cập nhật vào hệ thống', {
                        description: `Mã vận đơn: ${result.label}. Vui lòng cập nhật thủ công.`
                    });
                } else {
                    // Update succeeded - no additional action needed
                }
            }
        } catch (error) {
            console.error('Error creating GHTK order after save:', error);
            // Không throw error vì order đã được tạo thành công
        }
    };
    
    // ✅ Guard to prevent double submission
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    // ✅ Ref-based guard for immediate prevention (state updates are async)
    const isSubmittingRef = React.useRef(false);
    
    // ✅ Ref to store GHTK params for use after order creation
    const pendingGHTKParamsRef = React.useRef<{
        params: GHTKCreateOrderParams;
        partnerId: string;
        partnerName: string;
        serviceName?: string;
        codAmount?: number;
        payer?: string;
    } | null>(null);
    
    // ✅ Helper to generate packaging systemId using proper counter format (PACKAGE000001)
    const packagingCounterRef = React.useRef(0);
    const getNextPackagingSystemId = React.useCallback((): string => {
        packagingCounterRef.current++;
        return `PACKAGE${String(packagingCounterRef.current).padStart(6, '0')}`;
    }, []);
    
    const processSubmit = async (data: OrderFormValues) => {
        // ✅ Prevent double submission with immediate ref check (sync)
        if (isSubmittingRef.current) {
            return;
        }
        
        // Set ref immediately (synchronous)
        isSubmittingRef.current = true;
        setIsSubmitting(true);
        
        try {
            await processSubmitInternal(data);
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    };
    
    const processSubmitInternal = async (data: OrderFormValues) => {
        // ✅ METADATA-ONLY MODE: Skip full validation, only update allowed fields
        if (isMetadataOnlyMode && isEditing && order) {
            
            const metadataUpdate = {
                ...order,
                tags: data.tags || [],
                notes: data.notes || '',
                referenceUrl: data.referenceUrl || '',
                externalReference: data.externalReference || '',
                orderDate: data.orderDate,
                expectedDeliveryDate: data.expectedDeliveryDate || null,
            };
            
            update.mutate({ id: order.systemId, data: metadataUpdate }, {
                onSuccess: () => {
                    toast.success('Đã lưu thay đổi');
                    router.push(`/orders/${order.systemId}`);
                }
            });
            return;
        }
        
        // Debug: Log raw form data
        
        const customer = data.customer;
        const salespersonSystemId = data.salespersonSystemId ? asSystemId(data.salespersonSystemId) : undefined;
        const branchSystemId = data.branchSystemId ? asSystemId(data.branchSystemId) : undefined;
        const packerSystemId = data.packerId ? asSystemId(data.packerId) : undefined;
        const salesperson = salespersonSystemId ? employees.find(e => e.systemId === salespersonSystemId) : undefined;
        const branch = branchSystemId ? branches.find(b => b.systemId === branchSystemId) : undefined;
        const packer = packerSystemId ? employees.find(e => e.systemId === packerSystemId) : undefined;
    
        // Validate basic info
        if (!customer) {
            toast.error('Thiếu thông tin', { description: 'Vui lòng chọn khách hàng' });
            return;
        }
        if (!salesperson) {
            toast.error('Thiếu thông tin', { description: 'Vui lòng chọn nhân viên bán hàng' });
            return;
        }
        
        // Validate line items
        if (!data.lineItems || data.lineItems.length === 0) {
            toast.error('Thiếu thông tin', { description: 'Vui lòng thêm ít nhất một sản phẩm' });
            return;
        }
        
        // Check for empty line items (bug detection)
        const emptyItems = data.lineItems.filter(li => !li.productSystemId);
        if (emptyItems.length > 0) {
            console.error('[OrderForm] Found empty line items:', emptyItems);
            toast.error('Lỗi dữ liệu', { description: 'Một số sản phẩm không có thông tin. Vui lòng xóa và thêm lại.' });
            return;
        }
        if (!branch) {
            toast.error('Thiếu thông tin', { description: 'Vui lòng chọn chi nhánh' });
            return;
        }
        
        // Validate line items
        if (!data.lineItems || data.lineItems.length === 0) {
            toast.error('Đơn hàng trống', { description: 'Vui lòng thêm ít nhất 1 sản phẩm vào đơn hàng' });
            return;
        }
        
        // Validate quantities and prices
        for (const item of data.lineItems) {
            if (!item.quantity || item.quantity <= 0) {
                toast.error('Số lượng không hợp lệ', { 
                    description: `Sản phẩm "${item.productName}" phải có số lượng lớn hơn 0` 
                });
                return;
            }
            if (item.unitPrice < 0) {
                toast.error('Giá không hợp lệ', { 
                    description: `Sản phẩm "${item.productName}" có giá không hợp lệ` 
                });
                return;
            }
        }

        // ✅ Check negative stock settings
        const { allowNegativeOrder, allowNegativeApproval } = getSalesSettingsSync();
        
        // Determine if we need to validate stock based on settings and action
        let shouldValidateStock = false;
        
        // 1. If "Allow Negative Order" is OFF, we must validate ALL orders (Draft or Approve)
        if (!allowNegativeOrder) {
            shouldValidateStock = true;
        } 
        // 2. If "Allow Negative Order" is ON, but "Allow Negative Approval" is OFF
        // We only validate if the user is trying to Approve (submitAction === 'approve')
        else if (submitAction === 'approve' && !allowNegativeApproval) {
            shouldValidateStock = true;
        }

        // ✅ Server-side stock validation - no longer loads all products
        if (shouldValidateStock && branchSystemId) {
            try {
                const stockResult = await validateStockAvailability(
                    branchSystemId,
                    data.lineItems.map(item => ({
                        productSystemId: item.productSystemId,
                        productName: item.productName,
                        quantity: item.quantity,
                    })),
                    isEditing ? systemId : undefined
                );

                if (!stockResult.valid && stockResult.errors.length > 0) {
                    const firstError = stockResult.errors[0];
                    toast.error('Hết hàng', { 
                        description: `Sản phẩm "${firstError.productName}" không đủ tồn kho (Có sẵn: ${firstError.available}, Yêu cầu: ${firstError.requested})` 
                    });
                    return;
                }
            } catch (error) {
                console.error('Stock validation error:', error);
                toast.error('Không thể kiểm tra tồn kho', { 
                    description: 'Vui lòng thử lại sau' 
                });
                return;
            }
        }
        
        // ✅ Validate shipping partner selection (CHỈ khi chọn "Đẩy qua hãng vận chuyển")
        if (data.deliveryMethod === 'shipping-partner') {
            if (!data.shippingPartnerId) {
                toast.error('Thiếu thông tin vận chuyển', { 
                    description: 'Vui lòng chọn đơn vị vận chuyển (GHTK, GHN, v.v.)' 
                });
                return;
            }
            
            if (!data.shippingServiceId) {
                toast.error('Thiếu thông tin vận chuyển', { 
                    description: 'Vui lòng chọn dịch vụ vận chuyển (Tiêu chuẩn, Nhanh, v.v.)' 
                });
                return;
            }
            
            // Get shipping address from either new schema (addresses) or old schema (shippingAddress_*)
            let shippingProvince, _shippingDistrict, shippingWard, shippingStreet;
            
            if (customer.addresses && customer.addresses.length > 0) {
                // New schema: Get default shipping address or first address
                const shippingAddr = customer.addresses.find((a) => a.isDefaultShipping) || customer.addresses[0];
                shippingProvince = shippingAddr.province;
                _shippingDistrict = shippingAddr.district;
                shippingWard = shippingAddr.ward;
                shippingStreet = shippingAddr.street;
            } else {
                // Old schema: Use flat fields
                shippingProvince = customer.shippingAddress_province;
                _shippingDistrict = customer.shippingAddress_district;
                shippingWard = customer.shippingAddress_ward;
                shippingStreet = customer.shippingAddress_street;
            }
            
            // Validate customer address for shipping (GHTK supports 2-level: province + ward OR 3-level: province + district + ward)
            if (!shippingProvince) {
                toast.error('Thiếu địa chỉ giao hàng', { 
                    description: 'Vui lòng cập nhật tỉnh/thành phố giao hàng cho khách hàng' 
                });
                return;
            }
            // ✅ District is optional for 2-level address (province + ward only)
            // if (!shippingDistrict) {
            //     toast.error('Thiếu địa chỉ giao hàng', { 
            //         description: 'Vui lòng cập nhật quận/huyện giao hàng cho khách hàng' 
            //     });
            //     return;
            // }
            if (!shippingWard) {
                toast.error('Thiếu địa chỉ giao hàng', { 
                    description: 'Vui lòng cập nhật phường/xã giao hàng cho khách hàng' 
                });
                return;
            }
            if (!shippingStreet) {
                toast.error('Thiếu địa chỉ giao hàng', { 
                    description: 'Vui lòng cập nhật địa chỉ chi tiết giao hàng cho khách hàng' 
                });
                return;
            }
        }
        
        // ✅ Sanitize user inputs to prevent XSS
        const sanitizeString = (str?: string) => {
            if (!str) return '';
            return str.trim()
                .replace(/[<>]/g, '') // Remove < and >
                .substring(0, 500); // Limit length
        };
        
        const sanitizedNotes = sanitizeString(data.notes || '');
        const sanitizedSource = sanitizeString(data.source ?? '');
        const sanitizedTags = (data.tags || []).map(tag => sanitizeString(tag));
        const sanitizedExpectedPaymentMethod = sanitizeString(data.expectedPaymentMethod || '');
        
        const formPayments = data.payments || [];
        const totalPaid = formPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        let paymentStatus: OrderPaymentStatus = 'Chưa thanh toán';
        if (!isEditing) {
            if (data.grandTotal > 0 && totalPaid >= data.grandTotal) {
                paymentStatus = 'Thanh toán toàn bộ';
            } else if (totalPaid > 0) {
                paymentStatus = 'Thanh toán 1 phần';
            }
        } else if (order) {
            paymentStatus = order.paymentStatus;
        }

        // Auto-duyệt nếu đang submit "draft" nhưng có thanh toán
        let effectiveSubmitAction = submitAction;
        if (submitAction === 'draft' && totalPaid > 0) {
            effectiveSubmitAction = 'approve';
        }

        // ✅ FIX: Preserve existing packagings when editing order
        const packagings: Packaging[] = (isEditing && order?.packagings) ? [...order.packagings] : [];
        let finalMainStatus: OrderMainStatus;
        let finalDeliveryStatus: OrderDeliveryStatus;
        const finalCompletedDate: string | undefined = undefined;
        const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');
        
        // ✅ Generate order ID once - empty string for auto-generate
        const finalOrderId = (isEditing && order) ? order.id : asBusinessId('');

        // ✅ Determine if we should keep existing status/packagings (editing) or create new
        const hasExistingPackagings = isEditing && order?.packagings && order.packagings.length > 0;


        switch (data.deliveryMethod) {
            case 'pickup':
                // Nhận tại cửa hàng - Trạng thái ban đầu: "Chờ đóng gói" (chưa chọn phương thức giao hàng cụ thể)
                finalDeliveryStatus = hasExistingPackagings ? order!.deliveryStatus : 'Chờ đóng gói';
                finalMainStatus = hasExistingPackagings ? order!.status : 'Đang giao dịch';
                // ✅ Only create new packaging if no existing packagings
                if (!hasExistingPackagings) {
                    const newPackagingSystemId = asSystemId(getNextPackagingSystemId());
                    
                    packagings.push({
                        systemId: newPackagingSystemId, // ✅ Use proper format PACKAGE000001
                        id: asBusinessId(''), // ✅ Empty - auto-generate by API
                        requestDate: now,
                        requestingEmployeeId: salesperson.systemId, 
                        requestingEmployeeName: salesperson.fullName,
                        assignedEmployeeId: packerSystemId,
                        assignedEmployeeName: packer?.fullName,
                        status: 'Chờ đóng gói',
                        printStatus: 'Chưa in',
                        // ✅ Set deliveryMethod cho nhận tại cửa hàng
                        // trackingCode sẽ được API backend tự tạo dựa trên packaging.id sau khi order được lưu
                        deliveryMethod: 'Nhận tại cửa hàng' as const,
                        deliveryStatus: 'Chờ đóng gói',
                        carrier: 'Nhận tại cửa hàng',
                        service: 'Nhận tại cửa hàng',
                    });
                }
                break;

            case 'shipping-partner': {
                
                // ✅ Get partner info from localStorage config (not database)
                // since shipping-integration uses localStorage config
                const _shippingConfig = loadShippingConfig();
                
                // Also log database partners for debugging
                
                finalMainStatus = hasExistingPackagings ? order!.status : 'Đang giao dịch';
                finalDeliveryStatus = hasExistingPackagings ? order!.deliveryStatus : 'Chờ lấy hàng';
                
                // ✅ FIX: shippingPartnerId is "GHTK", "GHN" etc from shipping-integration
                // Use it directly as carrier name if database partner not found
                const partnerId = data.shippingPartnerId; // "GHTK", "GHN", etc.
                const partner = partners.find(p => p.id === partnerId || p.systemId === partnerId || p.name === partnerId);
                const partnerName = partner?.name || partnerId; // Fallback to partnerId if not in database
                const service = partner?.services.find(s => s.id === data.shippingServiceId || s.name === data.shippingServiceId);
                const serviceName = service?.name 
                    || (window as unknown as Record<string, unknown>).__shippingServiceName as string | undefined
                    || data.shippingServiceId;
                
                
                // ========================================
                // 🚚 LƯU THÔNG TIN VẬN CHUYỂN ĐỂ GỌI SAU KHI TẠO ĐƠN
                // ========================================
                // ✅ REFACTORED: Không gọi GHTK API ngay - gọi sau khi order được lưu thành công
                // Điều này tránh tình trạng GHTK tạo đơn nhưng DB lưu thất bại
                
                // Reset pending params
                pendingGHTKParamsRef.current = null;
                
                // Kiểm tra nếu đơn vị vận chuyển có API integration
                if (partnerId && isSupportedShippingPartner(partnerId)) {
                    
                    // ✅ Get preview params from window (stored by shipping-integration)
                    const previewParamsKey = getPreviewParamsKey(partnerId);
                    const configParamsKey = getConfigParamsKey(partnerId);
                    const partnerParams = (window as unknown as Record<string, unknown>)[previewParamsKey] || data.configuration?.[configParamsKey];
                    
                    
                    if (!partnerParams) {
                        // ⚠️ Không có params = chưa chọn đầy đủ thông tin vận chuyển
                        console.warn(`⚠️ Missing ${partnerId} preview params - will create order without shipping integration`);
                        toast.info('Đang tạo đơn hàng...', {
                            description: `Vui lòng tạo vận đơn ${partnerName} trong trang chi tiết đơn hàng sau`
                        });
                    } else if (partnerId === 'GHTK') {
                        // ✅ Lưu GHTK params để gọi sau khi order được tạo thành công
                        pendingGHTKParamsRef.current = {
                            params: partnerParams as GHTKCreateOrderParams,
                            partnerId,
                            partnerName: partnerName || 'GHTK',
                            serviceName,
                            codAmount: data.codAmount as number | undefined,
                            payer: data.payer as string | undefined,
                        };
                    } else {
                        // Other partners - show info message
                        toast.info(`${partnerName} API đang được phát triển`, {
                            description: 'Chức năng tạo đơn tự động sẽ sớm được cập nhật'
                        });
                    }
                }
                
                // ✅ Only create new packaging if no existing packagings
                if (!hasExistingPackagings) {
                    // ✅ Tạo packaging TRƯỚC, tracking code sẽ được update sau khi gọi GHTK
                    const newPackaging = {
                        systemId: asSystemId(getNextPackagingSystemId()), // ✅ Use proper format PACKAGE000001
                        id: asBusinessId(''), // ✅ Empty - auto-generate
                        requestDate: now, confirmDate: now,
                        requestingEmployeeId: salesperson.systemId, requestingEmployeeName: salesperson.fullName,
                        confirmingEmployeeId: salesperson.systemId, confirmingEmployeeName: salesperson.fullName,
                        assignedEmployeeId: packerSystemId,
                        assignedEmployeeName: packer?.fullName,
                        status: 'Đã đóng gói' as const,
                        // ✅ Nếu có GHTK params, set status "Chờ lấy hàng" (sẽ gọi API sau)
                        deliveryStatus: pendingGHTKParamsRef.current ? 'Chờ lấy hàng' as const : 'Chờ đóng gói' as const,
                        printStatus: 'Chưa in' as const,
                        deliveryMethod: 'Dịch vụ giao hàng' as const,
                        carrier: partnerName, service: serviceName,
                        trackingCode: data.trackingCode || "", // ✅ Manual tracking code if any
                        shippingFeeToPartner: data.shippingFee || 0,
                        codAmount: data.codAmount, 
                        payer: data.payer, 
                        noteToShipper: sanitizeString(data.shippingNote || ''),
                        weight: data.weight, dimensions: (data.length && data.width && data.height) ? `${data.length}x${data.width}x${data.height}` : undefined,
                    };
                    packagings.push(newPackaging);
                }
                break;
            }
            
            case 'deliver-later':
            default:
                // Áp dụng submitAction: draft = "Đặt hàng", approve = "Đang giao dịch"
                // ✅ Preserve existing status when editing
                if (hasExistingPackagings) {
                    finalMainStatus = order!.status;
                    finalDeliveryStatus = order!.deliveryStatus;
                } else {
                    finalMainStatus = effectiveSubmitAction === 'approve' ? 'Đang giao dịch' : 'Đặt hàng';
                    finalDeliveryStatus = 'Chờ đóng gói';
                }
                break;
        }

        const resolvedShippingAddress = data.shippingAddress || customer.addresses?.find((a) => a.isDefaultShipping) || null;
        const resolvedBillingAddress = data.billingAddress || customer.addresses?.find((a) => a.isDefaultBilling) || null;
        const shippingAddressSnapshot = cloneOrderAddress(resolvedShippingAddress);
        const billingAddressSnapshot = cloneOrderAddress(resolvedBillingAddress);

        const initialPayments = isEditing && order ? order.payments : [];
        const initialPaidAmount = isEditing && order ? order.paidAmount : 0;

        const finalOrderData = {
            id: finalOrderId,
            customerSystemId: customer.systemId, 
            customerName: sanitizeString(customer.name),
            
            // ✅ Save selected addresses from form (snapshot to prevent future mutations)
            shippingAddress: shippingAddressSnapshot,
            billingAddress: billingAddressSnapshot,
            
            branchSystemId: branch.systemId,
            branchName: branch.name,
            salespersonSystemId: salesperson.systemId, 
            salesperson: salesperson.fullName,
            assignedPackerSystemId: packerSystemId,
            assignedPackerName: packer?.fullName,
            orderDate: toISODateTime(data.orderDate),
            expectedPaymentMethod: sanitizedExpectedPaymentMethod || undefined,
            lineItems: data.lineItems.map((li, index) => {
                // Debug: log line item data before processing
                
                if (!li.productSystemId) {
                    console.error(`[OrderForm] Line item ${index} has no productSystemId!`, li);
                }
                
                return {
                    productSystemId: asSystemId(li.productSystemId), 
                    productId: asBusinessId((li.productId || '').trim().toUpperCase() || `SKU${String(index + 1).padStart(6, '0')}`), 
                    productName: sanitizeString(li.productName),
                    quantity: Number(li.quantity), 
                    unitPrice: Number(li.unitPrice), 
                    discount: Number(li.discount), 
                    discountType: li.discountType,
                    tax: Number(li.tax) || 0,
                    taxId: li.taxId || '',
                    note: li.note?.trim() || undefined,
                };
            }),
            subtotal: data.subtotal, 
            shippingFee: data.shippingFee, 
            tax: data.tax, 
            grandTotal: data.grandTotal,
            paidAmount: initialPaidAmount,
            payments: initialPayments,
            notes: sanitizedNotes, 
            tags: sanitizedTags,
            source: sanitizedSource,
            status: finalMainStatus,
            paymentStatus: paymentStatus,
            deliveryStatus: finalDeliveryStatus,
            printStatus: 'Chưa in' as OrderPrintStatus,
            stockOutStatus: 'Chưa xuất kho' as OrderStockOutStatus,
            returnStatus: 'Chưa trả hàng' as OrderReturnStatus,
            deliveryMethod: (data.deliveryMethod === 'pickup' ? 'Nhận tại cửa hàng' : 'Dịch vụ giao hàng') as OrderDeliveryMethod,
            codAmount: data.codAmount || 0,
            invoiceInfo: data.invoiceInfo || undefined,
            packagings: packagings,
            completedDate: finalCompletedDate,
            createdAt: toISODateTime(new Date()), // Thời điểm tạo đơn
        };

        if (isEditing && order) {
            const updatedOrder: Order = { ...order, ...finalOrderData };
            update.mutate({ id: order.systemId, data: updatedOrder }, {
                onSuccess: () => router.push(`/orders/${order.systemId}`)
            });
        } else {
            add.mutate(finalOrderData as Omit<Order, 'systemId'>, {
                onSuccess: async (newItem) => {
                    // ✅ Process payments if any
                    if (!isEditing && formPayments.length > 0) {
                        formPayments.forEach(payment => {
                            const amount = Number(payment.amount) || 0;
                            if (amount <= 0) return;
                            addOrderPayment.mutate({ 
                                systemId: newItem.systemId, 
                                amount, 
                                paymentMethodId: payment.method 
                            });
                        });
                    }

                    // ✅ GỌI GHTK API SAU KHI ORDER ĐƯỢC TẠO THÀNH CÔNG
                    // Điều này đảm bảo order đã có trong DB trước khi tạo đơn GHTK
                    if (pendingGHTKParamsRef.current) {
                        const { params, partnerName, serviceName: svcName, codAmount: cod, payer: payerVal } = pendingGHTKParamsRef.current;
                        const packagingSystemId = newItem.packagings?.[0]?.systemId;
                        
                        if (packagingSystemId) {
                            toast.info('Đang tạo đơn vận chuyển GHTK...', { duration: 3000 });
                            
                            // ✅ Gọi GHTK và update packaging
                            await createGHTKOrderAndUpdatePackaging(
                                newItem.systemId,
                                packagingSystemId,
                                params,
                                { serviceName: svcName, codAmount: cod, payer: payerVal }
                            );
                        } else {
                            console.warn('[OrderFormPage] No packaging found to link GHTK order');
                            toast.warning('Chưa tạo được đơn GHTK', {
                                description: `Vui lòng tạo đơn ${partnerName} trong trang chi tiết đơn hàng`
                            });
                        }
                        
                        // Clear pending params
                        pendingGHTKParamsRef.current = null;
                    }

                    // ✅ Công nợ sẽ được tạo khi đơn hàng giao thành công (completeDelivery)
                    // KHÔNG tạo công nợ ngay khi tạo đơn

                    router.push(`/orders/${newItem.systemId}`);
                }
            });
        }
    };

    // ✅ OPTIMIZED: Memoize button click handlers to prevent re-renders
    const handleExitClick = React.useCallback(() => {
        router.push('/orders');
    }, [router]);
    
    const handleDraftClick = React.useCallback(() => {
        setSubmitAction('draft');
    }, []);
    
    const handleApproveClick = React.useCallback(() => {
        setSubmitAction('approve');
    }, []);

    // ✅ OPTIMIZED: Memoize actions array to prevent usePageHeader re-renders
    const actions = React.useMemo(() => [
        <Button 
            key="exit" 
            type="button" 
            variant="outline" 
            onClick={handleExitClick} 
            size="sm" 
            className="h-9"
        >
            Thoát
        </Button>,
        // ✅ In edit mode: show "Lưu thay đổi" button only
        // ✅ In create mode: show "Tạo đơn và duyệt" button only (removed duplicate "Tạo đơn hàng (F1)")
        <Button 
            key="save-approve" 
            type="submit"
            form="order-form"
            disabled={isFullyReadOnly || isSubmitting}
            onClick={isEditing ? handleDraftClick : handleApproveClick}
            size="sm" 
            className="h-9"
        >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Đang xử lý...' : (isEditing ? 'Lưu thay đổi' : 'Tạo đơn và duyệt')}
        </Button>
    ], [handleExitClick, handleDraftClick, handleApproveClick, isFullyReadOnly, isSubmitting, isEditing]);
    
    // ✅ OPTIMIZED: Memoize breadcrumb to prevent usePageHeader re-renders
    const breadcrumb = React.useMemo(() => order ? [
        { label: 'Trang chủ', href: '/', isCurrent: false },
        { label: 'Đơn hàng', href: '/orders', isCurrent: false },
        { label: order.id, href: `/orders/${order.systemId}`, isCurrent: false },
        { label: isEditing ? 'Chỉnh sửa' : 'Chi tiết', href: '', isCurrent: true }
    ] : [
        { label: 'Trang chủ', href: '/', isCurrent: false },
        { label: 'Đơn hàng', href: '/orders', isCurrent: false },
        { label: 'Tạo mới', href: '', isCurrent: true }
    ], [order, isEditing]);
    
    // ✅ OPTIMIZED: Memoize context to prevent usePageHeader re-renders
    const pageContext = React.useMemo(() => order ? { id: order.id } : undefined, [order]);

    usePageHeader({ 
        actions,
        breadcrumb,
        // ✅ FIX: Pass order context so title shows businessId (DH000007) instead of systemId (ORDER000002)
        context: pageContext
    });
    
    // Loading state for edit mode - optimized skeleton
    if (isEditing && isOrderLoading) {
        return (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-3 text-muted-foreground">Đang tải đơn hàng...</span>
                </div>
                <div className="flex gap-4">
                    <div className="animate-pulse bg-muted h-32 rounded-lg flex-7" />
                    <div className="animate-pulse bg-muted h-32 rounded-lg flex-3" />
                </div>
                <div className="animate-pulse bg-muted h-64 rounded-lg" />
                <div className="flex gap-4">
                    <div className="animate-pulse bg-muted h-48 rounded-lg flex-6" />
                    <div className="animate-pulse bg-muted h-48 rounded-lg flex-4" />
                </div>
            </div>
        );
    }
    
    return (
        <FormProvider {...form}>
            <form id="order-form" onSubmit={handleSubmit(processSubmit)} className="h-full flex flex-col">
                <OrderCalculations />
                <ScrollArea className="grow">
                    <div className="pr-4 space-y-4">
                        {/* ✅ Thông báo khi chỉ sửa metadata */}
                        {isMetadataOnlyMode && (
                            <Card className="border-amber-200 bg-amber-50">
                                <CardContent className="pt-6">
                                    <p className="text-sm text-amber-800">
                                        <strong>Lưu ý:</strong> Đơn hàng đã đóng gói/xuất kho. Chỉ có thể chỉnh sửa: Ngày bán, Hẹn giao, Đường dẫn, Tham chiếu{!isShippedOrCompleted ? ', Tags, Ghi chú' : ''}.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                        
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="grow-7 w-full md:w-0"><CustomerSelector disabled={isFormDisabled || isMetadataOnlyMode} /></div>
                            <div className="grow-3 w-full md:w-0"><OrderInfoCard disabled={isFormDisabled} isBranchLocked={isBranchLocked} isMetadataOnlyMode={isMetadataOnlyMode} /></div>
                        </div>
                        <Card className="flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle>Thông tin sản phẩm</CardTitle>
                                <ProductTableToolbar 
                                    disabled={isFormDisabled || isMetadataOnlyMode} 
                                    enableSplitLine={enableSplitLine}
                                    onSplitLineChange={setEnableSplitLine}
                                    settings={tableSettings}
                                    onSettingsChange={setTableSettings}
                                />
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <div className="flex items-center gap-2">
                                        <OrderProductSearch 
                                            onSelectProduct={(p) => handleSelectProducts([p])}
                                            disabled={isFormDisabled || isMetadataOnlyMode}
                                            allowCreateNew={true}
                                            placeholder="Thêm sản phẩm (F3)"
                                            searchPlaceholder="Tìm kiếm theo tên, mã SKU, barcode..."
                                            pricingPolicyId={selectedPolicyId}
                                            {...(selectedBranchSystemId ? { branchSystemId: selectedBranchSystemId } : {})}
                                        />
                                        <Button type="button" variant="outline" className="h-9 shrink-0" onClick={openProductSelection} disabled={isFormDisabled || isMetadataOnlyMode}>Chọn nhanh</Button>
                                        <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId} disabled={isFormDisabled || isMetadataOnlyMode}>
                                            <SelectTrigger className="h-9 w-45 shrink-0"><SelectValue /></SelectTrigger>
                                            <SelectContent>{salesPolicies.map(p => <SelectItem key={p.systemId} value={p.systemId}>{p.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {fields.length === 0 ? (
                                    <>
                                        <div className="text-center text-muted-foreground p-12 border border-dashed rounded-md">
                                            <PackageOpen className="mx-auto h-12 w-12 text-gray-300" />
                                            <p className="mt-4 text-sm">Chưa có sản phẩm nào trong đơn hàng</p>
                                            <Button type="button" variant="link" className="mt-2" onClick={openProductSelection} disabled={isMetadataOnlyMode}>Thêm sản phẩm</Button>
                                        </div>
                                        <ProductTableBottomToolbar 
                                            disabled={isFormDisabled || isMetadataOnlyMode} 
                                            onAddService={openAddServiceDialog}
                                            onApplyPromotion={openApplyPromotionDialog}
                                        />
                                    </>
                                ) : ( 
                                    <LineItemsTable 
                                        disabled={isFormDisabled || isMetadataOnlyMode} 
                                        onAddService={openAddServiceDialog}
                                        onApplyPromotion={openApplyPromotionDialog}
                                        fields={fields}
                                        remove={remove}
                                        pricingPolicyId={selectedPolicyId}
                                        allowNoteEdit={isMetadataOnlyMode && !isFullyReadOnly}
                                    /> 
                                )}
                            </CardContent>
                        </Card>
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="grow-6 w-full md:w-0 space-y-4">
                                <OrderNotes disabled={isFullyReadOnly || isShippedOrCompleted} />
                                <OrderTags disabled={isFullyReadOnly || isShippedOrCompleted} />
                            </div>
                            <div className="grow-4 w-full md:w-0"><OrderSummary disabled={isFormDisabled || isMetadataOnlyMode} /></div>
                        </div>
                        
                        {/* ✅ CHỈ hiển thị card Giao hàng ở chế độ TẠO đơn hàng, KHÔNG hiển thị ở chế độ SỬA */}
                        <ShippingCard hidden={isEditing} />
                    </div>
                </ScrollArea>
                <ProductSelectionDialog 
                    isOpen={isProductSelectionOpen}
                    onOpenChange={setIsProductSelectionOpen}
                    onSelect={handleSelectProducts}
                    {...(selectedBranchSystemId ? { branchSystemId: selectedBranchSystemId } : {})}
                    pricingPolicyId={selectedPolicyId}
                />
                <AddServiceDialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen} disabled={isFormDisabled} onAppend={append} />
                <ApplyPromotionDialog open={isApplyPromotionDialogOpen} onOpenChange={setIsApplyPromotionDialogOpen} onApply={handleApplyPromotion} disabled={isFormDisabled} />
            </form>
        </FormProvider>
    );
}
