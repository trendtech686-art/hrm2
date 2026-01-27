'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSearchParamsWithSetter } from '@/lib/hooks/use-search-params-setter';
import { useForm, FormProvider, useWatch, useFieldArray, useFormContext } from 'react-hook-form';
import { formatDateCustom, getCurrentDate, toISODateTime, parseDate } from '@/lib/date-utils';
import { PackageOpen } from 'lucide-react';
import { toast } from 'sonner';

// types
import type { Product } from '@/features/products/types';
import type { ProductFormValues } from '@/features/products/validation';
import type { Order, LineItem, OrderMainStatus, OrderDeliveryStatus, Packaging, OrderPaymentStatus, OrderAddress, Customer, CustomerAddress as _CustomerAddress, OrderPrintStatus, OrderStockOutStatus, OrderReturnStatus, OrderDeliveryMethod } from '@/lib/types/prisma-extended';

// stores
import { useProductStore } from '@/features/products/store';
import { useAllProducts } from '@/features/products/hooks/use-all-products';
import { useAllEmployees } from '@/features/employees/hooks/use-all-employees';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { useOrder } from '../hooks/use-orders';
import { useOrderMutations } from '../hooks/use-order-mutations';
import { useOrderActions } from '../hooks/use-order-actions';
import { useAllOrders, useOrderFinder } from '../hooks/use-all-orders';
import { usePaymentMethods } from '@/features/settings/payments/hooks/use-payment-methods';
import { useSalesChannels } from '@/features/settings/sales-channels/hooks/use-sales-channels';
// ✅ REMOVED: import { generateNextId } - use id: '' instead
import { getSalesSettingsSync } from '@/features/settings/sales/sales-management-service';
import { useAllPricingPolicies } from '@/features/settings/pricing/hooks/use-all-pricing-policies';
import { useStockHistoryStore } from '@/features/stock-history/store';
import { useCustomerStore } from '@/features/customers/store';
import { useAllShippingPartners } from '@/features/settings/shipping/hooks/use-all-shipping-partners';
import { useAllTaxesData } from '@/features/settings/taxes/hooks/use-all-taxes';
import { SUPPORTED_SHIPPING_PARTNERS as _SUPPORTED_SHIPPING_PARTNERS, SHIPPING_PARTNER_NAMES as _SHIPPING_PARTNER_NAMES, isSupportedShippingPartner, getPreviewParamsKey, getConfigParamsKey, type ShippingPartnerId as _ShippingPartnerId } from '../shipping-partners-config';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import { generateSystemId, getMaxSystemIdCounter } from '@/lib/id-utils';

// UI components
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductSelectionDialog } from '@/features/shared/product-selection-dialog';
import { usePageHeader } from '@/contexts/page-header-context';
import { useAuth } from '@/contexts/auth-context';

// Refactored Components
import { CustomerSelector } from './customer-selector';
import { OrderInfoCard } from './order-info-card';
import { OrderProductSearch } from '@/components/shared/unified-product-search';
import { LineItemsTable } from './line-items-table';
import { OrderSummary } from './order-summary';
import { OrderNotes } from './order-notes';
import { OrderTags } from './order-tags';
import { AddServiceDialog } from './add-service-dialog';
import { ApplyPromotionDialog } from './apply-promotion-dialog';
import { ProductTableToolbar } from './product-table-toolbar';
import type { ProductTableSettings } from './product-table-toolbar';
import { ProductTableBottomToolbar } from './product-table-bottom-toolbar';
import { ShippingCard } from './shipping-card';
import { GHTKService, type GHTKCreateOrderParams } from '@/features/settings/shipping/integrations/ghtk-service';
import { loadShippingConfig } from '@/lib/utils/shipping-config-migration';
import { cloneOrderAddress } from '../address-utils';
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

const OrderCalculations = () => {
    const { control, setValue, getValues } = useFormContext<OrderFormValues>();
    const watchedLineItems = useWatch({ control, name: "lineItems" });
    const watchedShippingFee = useWatch({ control, name: "shippingFee" });
    const watchedOrderDiscount = useWatch({ control, name: "orderDiscount" });
    const watchedOrderDiscountType = useWatch({ control, name: "orderDiscountType" });
    const watchedVoucherAmount = useWatch({ control, name: "voucherAmount" });
    const watchedServiceFees = useWatch({ control, name: "serviceFees" });

    React.useEffect(() => {
        const items = watchedLineItems || [];
        const shipping = Number(watchedShippingFee) || 0;
        
        items.forEach((item, index) => {
            const total = calculateLineTotal(item);
            if (item.total !== total) {
                if (getValues(`lineItems.${index}.total`) !== total) {
                    setValue(`lineItems.${index}.total`, total, { shouldValidate: false });
                }
            }
        });
        
        const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
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
        
        setValue('subtotal', subtotal, { shouldValidate: false });
        setValue('tax', totalTax, { shouldValidate: false });
        setValue('grandTotal', grandTotal, { shouldValidate: false });

    }, [watchedLineItems, watchedShippingFee, watchedOrderDiscount, watchedOrderDiscountType, watchedVoucherAmount, watchedServiceFees, setValue, getValues]);

    return null;
}

// Main Component
export function OrderFormPage() {
    const params = useParams();
    const rawSystemId = params.systemId;
    const systemId = Array.isArray(rawSystemId) ? rawSystemId[0] : rawSystemId;
    const router = useRouter();
    const [searchParams] = useSearchParamsWithSetter();
    
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
    
    const { data: allOrders } = useAllOrders();
    const { findById } = useOrderFinder();
    
    // React Query for single order (edit mode)
    const { data: orderFromQuery, isLoading: isOrderLoading } = useOrder(systemId);
    
    const { data: employees } = useAllEmployees();
    const { data: branches } = useAllBranches();
    const { data: pricingPolicies } = useAllPricingPolicies();
    const { add: baseAddProduct } = useProductStore();
    const { data: allProducts } = useAllProducts();
    const { addEntry: addStockHistoryEntry } = useStockHistoryStore();
    const { data: partners } = useAllShippingPartners();
    const { getDefaultSale } = useAllTaxesData();
    
    // React Query for payment methods and sales channels
    const { data: pmData } = usePaymentMethods({ limit: 1000 });
    const paymentMethods = React.useMemo(() => pmData?.data ?? [], [pmData?.data]);
    const { data: scData } = useSalesChannels({ limit: 1000 });
    const salesChannels = React.useMemo(() => scData?.data ?? [], [scData?.data]);

    const isEditing = !!systemId;
    // ✅ Ưu tiên React Query, fallback to store finder
    const order = React.useMemo(() => {
      if (systemId) {
        return orderFromQuery || findById(systemId) || null;
      }
      return null;
    }, [systemId, orderFromQuery, findById]);
    const copyParam = searchParams.get('copy');
    const copyOrderSystemId = Array.isArray(copyParam) ? copyParam[0] : copyParam;
    const copySourceOrder = React.useMemo(() => {
        if (isEditing || !copyOrderSystemId) return null;
        return findById(copyOrderSystemId) || null;
    }, [isEditing, copyOrderSystemId, findById]);
    
    // ✅ NEW LOGIC: Kiểm tra xem đơn đã đóng gói/xuất kho chưa
    const isPackagedOrDispatched = React.useMemo(() => {
        if (!order) return false;
        // Đã đóng gói hoặc đã xuất kho hoặc hoàn thành
        return order.stockOutStatus !== 'Chưa xuất kho' || 
               order.deliveryStatus === 'Đã đóng gói' ||
               order.deliveryStatus === 'Chờ lấy hàng' ||
               order.deliveryStatus === 'Đang giao hàng' ||
               order.deliveryStatus === 'Đã giao hàng' ||
               order.deliveryStatus === 'Chờ giao lại' ||
               order.status === 'Hoàn thành';
    }, [order]);

    // ✅ Chỉ cho sửa metadata (tags, notes, dates, references) khi đã đóng gói/xuất kho
    const isMetadataOnlyMode = isPackagedOrDispatched;

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
        subtotal: 0, shippingFee: 0, tax: 0, grandTotal: 0, payments: [], packerId: undefined, trackingCode: '',
        shippingPartnerId: undefined, shippingServiceId: undefined, deliveryMethod: 'deliver-later', configuration: {},
                orderDiscount: 0, orderDiscountType: 'fixed',
                expectedPaymentMethod: '',
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

                const productToAdd = { ...values, inventoryByBranch, committedByBranch: {}, inTransitByBranch: {} };
                const createdProduct = baseAddProduct(productToAdd as unknown as Omit<Product, 'systemId'>);
                if (!createdProduct) {
                    return;
                }
        
        branches.forEach(branch => {
            const stockLevel = inventoryByBranch[branch.systemId] || 0;
            if (stockLevel > 0) {
              addStockHistoryEntry({
                                    productId: createdProduct.systemId,
                  date: getCurrentDate().toISOString(),
                  employeeName: currentEmployeeName,
                  action: 'Khởi tạo variant',
                  quantityChange: stockLevel,
                  newStockLevel: stockLevel,
                                    documentId: createdProduct.id,
                                    branch: branch.name,
                                    branchSystemId: branch.systemId,
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

        React.useEffect(() => {
      setSelectedPolicyId(defaultSellingPolicy?.systemId || '');
    }, [defaultSellingPolicy]);

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

    React.useEffect(() => {
        if (!selectedPolicyId || isFormDisabled || isMetadataOnlyMode) return;
        const currentItems = getValues('lineItems');
        currentItems.forEach((item, index) => {
            const product = allProducts.find(p => p.systemId === item.productSystemId);
            if (product) {
                const newPrice = product.prices[selectedPolicyId] || 0;
                if (getValues(`lineItems.${index}.unitPrice`) !== newPrice) {
                    setValue(`lineItems.${index}.unitPrice`, newPrice, { shouldDirty: true });
                }
            }
        });
    }, [selectedPolicyId, getValues, setValue, allProducts, isFormDisabled, isMetadataOnlyMode]); 

    React.useEffect(() => {
        if (isEditing && order) {
            const customer = useCustomerStore.getState().data.find(c => c.systemId === order.customerSystemId);
            let deliveryMethod = 'deliver-later';
            if (order.deliveryMethod === 'Nhận tại cửa hàng') {
                deliveryMethod = 'pickup';
            } else if (order.shippingInfo?.carrier || order.packagings.some(p => p.carrier)) {
                deliveryMethod = 'shipping-partner';
            }

            const savedShippingAddress = normalizeOrderAddress(order.shippingAddress);
            const savedBillingAddress = normalizeOrderAddress(order.billingAddress);

            reset({
                customer: customer || null,
                branchSystemId: order.branchSystemId, // ✅ Use systemId only
                salespersonSystemId: order.salespersonSystemId,
                packerId: order.assignedPackerSystemId || (order as { packerId?: string }).packerId,
                orderDate: parseDate(order.orderDate) || getCurrentDate(),
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
                expectedPaymentMethod: order.expectedPaymentMethod || '',
                lineItems: order.lineItems.map(li => ({
                    id: `li_${li.productSystemId}_${Math.random()}`,
                    systemId: '',
                    productSystemId: li.productSystemId,
                    productId: li.productId,
                    productName: li.productName,
                    quantity: li.quantity,
                    unitPrice: li.unitPrice,
                    discount: li.discount,
                    discountType: li.discountType,
                    tax: (li as { tax?: number; taxId?: string }).tax || 0,
                    taxId: (li as { tax?: number; taxId?: string }).taxId || '',
                    total: calculateLineTotal(li),
                    note: li.note || '',
                })),
                subtotal: order.subtotal,
                shippingFee: order.shippingFee,
                tax: order.tax,
                grandTotal: order.grandTotal,
                payments: order.payments.map(p => ({ method: p.method, amount: p.amount })),
            });
        }
    }, [isEditing, order, reset, branches, currentEmployee, setValue, partners]);

    React.useEffect(() => {
        if (isEditing || !copySourceOrder || copyPrefillAppliedRef.current) {
            return;
        }

        copyPrefillAppliedRef.current = true;
        const customer = useCustomerStore.getState().data.find(c => c.systemId === copySourceOrder.customerSystemId);
        const defaultShippingAddress = customer?.addresses?.find(a => a.isDefaultShipping) || null;
        const defaultBillingAddress = customer?.addresses?.find(a => a.isDefaultBilling) || null;
        const copiedShippingAddress = normalizeOrderAddress(copySourceOrder.shippingAddress);
        const copiedBillingAddress = normalizeOrderAddress(copySourceOrder.billingAddress);

        const deliveryMethod = 'deliver-later';

        reset({
            customer: customer || null,
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
            shippingAddress: copiedShippingAddress || defaultShippingAddress,
            billingAddress: copiedBillingAddress || defaultBillingAddress,
            expectedPaymentMethod: '',
            lineItems: copySourceOrder.lineItems.map(li => ({
                id: `copy_${li.productSystemId}_${Math.random()}`,
                systemId: '',
                productSystemId: li.productSystemId,
                productId: li.productId,
                productName: li.productName,
                quantity: li.quantity,
                unitPrice: li.unitPrice,
                discount: li.discount,
                discountType: li.discountType,
                tax: (li as { tax?: number; taxId?: string }).tax || 0,
                taxId: (li as { tax?: number; taxId?: string }).taxId || '',
                total: calculateLineTotal(li),
                note: li.note || '',
            })),
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
    
    const handleSelectProducts = (selectedProducts: Product[], quantities?: Record<string, number>) => {
        const currentItems = getValues('lineItems');

        const newItems: FormLineItem[] = [];
        
        selectedProducts.forEach((product, idx) => {
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
                id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${idx}`,
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
    };

    const handleApplyPromotion = (code: string) => {
        // TODO: Implement promotion logic
        // For now, just show success message
        toast.success(`Đã áp dụng mã giảm giá: ${code}`);
    };
    
    /**
     * Tạo đơn hàng trên GHTK và lấy mã vận đơn
     * ✅ SINGLE SOURCE OF TRUTH: Nhận params đã build sẵn từ shipping-integration (previewParams)
     */
    const createGHTKOrder = async (ghtkParams: GHTKCreateOrderParams): Promise<string | null> => {
        
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
                toast.error('Lỗi cấu hình', { description: 'Không tìm thấy tài khoản GHTK khả dụng' });
                return null;
            }
            
            // Get credentials
            const apiToken = ghtkAccount.credentials.apiToken as string;
            const partnerCode = ghtkAccount.credentials.partnerCode as string;
            
            if (!apiToken) {
                toast.error('Lỗi cấu hình', { description: 'Thiếu API Token GHTK' });
                return null;
            }
            
            // Initialize GHTK service
            const ghtkService = new GHTKService(apiToken, partnerCode || '');
            
            // ✅ Call GHTK API with params (already built by shipping-integration previewParams)
            toast.info('Đang tạo đơn trên GHTK...', { duration: 2000 });
            const result = await ghtkService.createOrder(ghtkParams);
            
            if (result.success && result.order) {
                toast.success('Đã tạo đơn GHTK thành công', { 
                    description: `Mã vận đơn: ${result.order.label}` 
                });
                return result.order.label;
            } else {
                toast.error('Tạo đơn GHTK thất bại', { 
                    description: result.message || 'Vui lòng kiểm tra lại thông tin' 
                });
                return null;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Vui lòng thử lại sau';
            console.error('❌ GHTK create order error:', error);
            // Don't stringify error object - may contain circular references
            toast.error('Lỗi tạo đơn GHTK', { 
                description: errorMessage 
            });
            return null;
        }
    };
    
    // ✅ Guard to prevent double submission
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    
    // ✅ Helper to generate packaging systemId (proper format: PACKAGE000001)
    const PACKAGING_SYSTEM_ID_PREFIX = 'PACKAGE';
    const getNextPackagingSystemId = React.useCallback((): string => {
        const allPackagings = allOrders.flatMap(o => o.packagings || []);
        const maxCounter = getMaxSystemIdCounter(allPackagings, PACKAGING_SYSTEM_ID_PREFIX);
        return generateSystemId('packaging', maxCounter + 1);
    }, [allOrders]);
    
    const processSubmit = async (data: OrderFormValues) => {
        // ✅ Prevent double submission
        if (isSubmitting) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            await processSubmitInternal(data);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const processSubmitInternal = async (data: OrderFormValues) => {
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

        if (shouldValidateStock && branchSystemId) {
            for (const item of data.lineItems) {
                const product = allProducts.find(p => p.systemId === item.productSystemId);
                if (product) {
                    const currentStock = product.inventoryByBranch?.[branchSystemId] || 0;
                    const committed = product.committedByBranch?.[branchSystemId] || 0;
                    let available = currentStock - committed;

                    // If editing an active order, add back the quantity currently held by this order
                    // This prevents "false positive" out of stock when updating an existing order
                    if (isEditing && order && ['Đang giao dịch', 'Chờ lấy hàng', 'Đang giao hàng', 'Chờ giao lại'].includes(order.status)) {
                        const existingItem = order.lineItems.find(li => li.productSystemId === item.productSystemId);
                        if (existingItem) {
                            available += existingItem.quantity;
                        }
                    }
                    
                    if (available < item.quantity) {
                        toast.error('Hết hàng', { 
                            description: `Sản phẩm "${item.productName}" không đủ tồn kho (Có sẵn: ${available}, Yêu cầu: ${item.quantity})` 
                        });
                        return;
                    }
                }
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
                    packagings.push({
                        systemId: asSystemId(getNextPackagingSystemId()), // ✅ Use proper format PACKAGE000001
                        id: asBusinessId(''), // ✅ Empty - auto-generate
                        requestDate: now,
                        requestingEmployeeId: salesperson.systemId, 
                        requestingEmployeeName: salesperson.fullName,
                        assignedEmployeeId: packerSystemId,
                        assignedEmployeeName: packer?.fullName,
                        status: 'Chờ đóng gói',
                        printStatus: 'Chưa in',
                        // ✅ Không set deliveryMethod ngay, để sau khi đóng gói mới chọn
                        deliveryStatus: 'Chờ đóng gói',
                    });
                }
                break;

            case 'shipping-partner': {
                finalMainStatus = hasExistingPackagings ? order!.status : 'Đang giao dịch';
                finalDeliveryStatus = hasExistingPackagings ? order!.deliveryStatus : 'Chờ lấy hàng';
                // ✅ FIX: Find partner by ID (not systemId) because form stores partner.id
                const partner = data.shippingPartnerId ? partners.find(p => p.id === data.shippingPartnerId) : undefined;
                const service = partner?.services.find(s => s.id === data.shippingServiceId);
                
                
                // ========================================
                // 🚚 TẠO ĐƠN VẬN CHUYỂN QUA API ĐỐI TÁC
                // ========================================
                // Hỗ trợ nhiều đơn vị: GHTK, GHN, J&T, VTP, SPX, v.v.
                // Logic tổng quát cho tất cả đơn vị vận chuyển
                
                let partnerTrackingCode: string | null = null;
                const partnerId = partner?.id;
                
                // Kiểm tra nếu đơn vị vận chuyển có API integration
                if (partnerId && isSupportedShippingPartner(partnerId)) {
                    
                    // ✅ Get preview params from window (stored by shipping-integration)
                    // Mỗi đơn vị vận chuyển sẽ có params riêng
                    const previewParamsKey = getPreviewParamsKey(partnerId);
                    const configParamsKey = getConfigParamsKey(partnerId);
                    const partnerParams = (window as unknown as Record<string, unknown>)[previewParamsKey] || data.configuration?.[configParamsKey];
                    
                    if (!partnerParams) {
                        // ⚠️ CRITICAL: Không có params = chưa chọn đầy đủ thông tin vận chuyển
                        console.error(`❌ Missing ${partnerId} preview params (key: ${previewParamsKey}). Cannot create order.`);
                        toast.error(`Thiếu thông tin vận chuyển ${partner.name}`, { 
                            description: `Vui lòng cấu hình đầy đủ thông tin vận chuyển (địa chỉ, dịch vụ, phí) trong tab "Đẩy qua hãng vận chuyển" trước khi tạo đơn.`,
                            duration: 5000
                        });
                        return; // ❌ STOP: Không cho tạo đơn
                    }
                    
                    
                    try {
                        // Gọi API tương ứng với từng đơn vị
                        switch (partnerId) {
                            case 'GHTK':
                                partnerTrackingCode = await createGHTKOrder(partnerParams as GHTKCreateOrderParams);
                                break;
                            
                            case 'GHN':
                                // TODO: Implement GHN API call
                                // partnerTrackingCode = await createGHNOrder(partnerParams);
                                toast.info('GHN API đang được phát triển', {
                                    description: 'Chức năng tạo đơn tự động với GHN sẽ sớm được cập nhật'
                                });
                                break;
                            
                            case 'JNT':
                                // TODO: Implement J&T API call
                                // partnerTrackingCode = await createJNTOrder(partnerParams);
                                toast.info('J&T Express API đang được phát triển', {
                                    description: 'Chức năng tạo đơn tự động với J&T sẽ sớm được cập nhật'
                                });
                                break;
                            
                            case 'VTP':
                                // TODO: Implement ViettelPost API call
                                // partnerTrackingCode = await createVTPOrder(partnerParams);
                                toast.info('ViettelPost API đang được phát triển', {
                                    description: 'Chức năng tạo đơn tự động với ViettelPost sẽ sớm được cập nhật'
                                });
                                break;
                            
                            case 'SPX':
                                // TODO: Implement Shopee Express API call
                                // partnerTrackingCode = await createSPXOrder(partnerParams);
                                toast.info('Shopee Express API đang được phát triển', {
                                    description: 'Chức năng tạo đơn tự động với Shopee Express sẽ sớm được cập nhật'
                                });
                                break;
                            
                            default:
                                // Đơn vị vận chuyển mới chưa implement
                                toast.warning(`${partner.name} chưa được tích hợp`, {
                                    description: 'Vui lòng tạo vận đơn thủ công trên trang của đối tác'
                                });
                        }
                        
                        
                        if (!partnerTrackingCode) {
                            throw new Error(`${partner.name} API không trả về mã vận đơn`);
                        }
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
                        console.error(`❌ ${partnerId} API Error:`, error);
                        
                        // Hỏi user có muốn tiếp tục không
                        const shouldContinue = confirm(
                            `Không tạo được đơn trên ${partner.name}:\n${errorMessage}\n\n` +
                            `Bạn có muốn lưu đơn hàng với mã vận đơn tạm thời không?\n` +
                            `(Bạn có thể tạo vận đơn ${partner.name} sau trong trang chi tiết đơn hàng)`
                        );
                        if (!shouldContinue) {
                            return; // ❌ STOP: User không muốn tiếp tục
                        }
                        // User chọn tiếp tục → sẽ dùng tracking code tạm
                    }
                }
                
                // ✅ Only create new packaging if no existing packagings
                if (!hasExistingPackagings) {
                    const _allTrackingCodes = allOrders.flatMap(o => o.packagings).map(p => ({ id: p.trackingCode })).filter(p => p.id);
                    packagings.push({
                        systemId: asSystemId(getNextPackagingSystemId()), // ✅ Use proper format PACKAGE000001
                        id: asBusinessId(''), // ✅ Empty - auto-generate
                        requestDate: now, confirmDate: now,
                        requestingEmployeeId: salesperson.systemId, requestingEmployeeName: salesperson.fullName,
                        confirmingEmployeeId: salesperson.systemId, confirmingEmployeeName: salesperson.fullName,
                        assignedEmployeeId: packerSystemId,
                        assignedEmployeeName: packer?.fullName,
                        status: 'Đã đóng gói',
                        deliveryStatus: 'Chờ lấy hàng',
                        printStatus: 'Chưa in',
                        deliveryMethod: 'Dịch vụ giao hàng',
                        carrier: partner?.name, service: service?.name,
                        trackingCode: partnerTrackingCode || data.trackingCode || "", // ✅ Empty tracking code
                        shippingFeeToPartner: data.shippingFee,
                        codAmount: data.codAmount, 
                        payer: data.payer, 
                        noteToShipper: sanitizeString(data.shippingNote || ''),
                        weight: data.weight, dimensions: (data.length && data.width && data.height) ? `${data.length}x${data.width}x${data.height}` : undefined,
                    });
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
            lineItems: data.lineItems.map((li, index) => ({
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
            })),
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
                onSuccess: (newItem) => {
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

                    // ✅ Công nợ sẽ được tạo khi đơn hàng giao thành công (completeDelivery)
                    // KHÔNG tạo công nợ ngay khi tạo đơn

                    router.push(`/orders/${newItem.systemId}`);
                }
            });
        }
    };

    // Page header actions
    const actions = [
        <Button 
            key="exit" 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/orders')} 
            size="sm" 
            className="h-9"
        >
            Thoát
        </Button>,
        <Button 
            key="save" 
            type="submit" 
            form="order-form"
            variant="outline"
            disabled={isFullyReadOnly}
            onClick={(_e) => {
                setSubmitAction('draft');
                // Don't preventDefault - let form submit naturally
            }}
            size="sm" 
            className="h-9"
        >
            {isEditing ? 'Lưu thay đổi' : 'Tạo đơn hàng (F1)'}
        </Button>,
        ...(!isEditing ? [
            <Button 
                key="save-approve" 
                type="submit"
                form="order-form"
                disabled={isFullyReadOnly}
                onClick={(_e) => {
                    setSubmitAction('approve');
                    // Don't preventDefault - let form submit naturally
                }}
                size="sm" 
                className="h-9"
            >
                Tạo đơn và duyệt
            </Button>
        ] : [])
    ];

    usePageHeader({ 
        actions,
        breadcrumb: order ? [
            { label: 'Trang chủ', href: '/', isCurrent: false },
            { label: 'Đơn hàng', href: '/orders', isCurrent: false },
            { label: order.id, href: `/orders/${order.systemId}`, isCurrent: false },
            { label: isEditing ? 'Chỉnh sửa' : 'Chi tiết', href: '', isCurrent: true }
        ] : [
            { label: 'Trang chủ', href: '/', isCurrent: false },
            { label: 'Đơn hàng', href: '/orders', isCurrent: false },
            { label: 'Tạo mới', href: '', isCurrent: true }
        ],
        // ✅ FIX: Pass order context so title shows businessId (DH000007) instead of systemId (ORDER000002)
        context: order ? { id: order.id } : undefined
    });
    
    // Loading state for edit mode
    if (isEditing && isOrderLoading) {
        return (
            <div className="space-y-4">
                <div className="animate-pulse bg-muted h-32 rounded-lg" />
                <div className="animate-pulse bg-muted h-64 rounded-lg" />
                <div className="animate-pulse bg-muted h-48 rounded-lg" />
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
                                    <p className="text-body-sm text-amber-800">
                                        <strong>Lưu ý:</strong> Đơn hàng đã đóng gói/xuất kho. Chỉ có thể chỉnh sửa: Tags, Ghi chú, Đường dẫn đơn hàng, Tham chiếu.
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
                                <CardTitle className="text-h4">Thông tin sản phẩm</CardTitle>
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
                                            {...(selectedBranchSystemId ? { branchSystemId: selectedBranchSystemId } : {})}
                                        />
                                        <Button type="button" variant="outline" className="h-9 shrink-0" onClick={() => setIsProductSelectionOpen(true)} disabled={isFormDisabled || isMetadataOnlyMode}>Chọn nhanh</Button>
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
                                            <p className="mt-4 text-body-sm">Chưa có sản phẩm nào trong đơn hàng</p>
                                            <Button type="button" variant="link" className="mt-2" onClick={() => setIsProductSelectionOpen(true)} disabled={isMetadataOnlyMode}>Thêm sản phẩm</Button>
                                        </div>
                                        <ProductTableBottomToolbar 
                                            disabled={isFormDisabled || isMetadataOnlyMode} 
                                            onAddService={() => setIsAddServiceDialogOpen(true)}
                                            onApplyPromotion={() => setIsApplyPromotionDialogOpen(true)}
                                        />
                                    </>
                                ) : ( 
                                    <LineItemsTable 
                                        disabled={isFormDisabled || isMetadataOnlyMode} 
                                        onAddService={() => setIsAddServiceDialogOpen(true)}
                                        onApplyPromotion={() => setIsApplyPromotionDialogOpen(true)}
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
                                <OrderNotes disabled={isFullyReadOnly} />
                                <OrderTags disabled={isFullyReadOnly} />
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
                />
                <AddServiceDialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen} disabled={isFormDisabled} onAppend={append} />
                <ApplyPromotionDialog open={isApplyPromotionDialogOpen} onOpenChange={setIsApplyPromotionDialogOpen} onApply={handleApplyPromotion} disabled={isFormDisabled} />
            </form>
        </FormProvider>
    );
}
