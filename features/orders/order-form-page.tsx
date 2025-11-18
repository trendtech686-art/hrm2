import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider, useWatch, useFieldArray, useFormContext } from 'react-hook-form';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, toISODateTime } from '@/lib/date-utils';
import { ArrowLeft, PackageOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useRouteMeta } from '../../hooks/use-route-meta';

// types
import type { Product } from '../products/types.ts';
import type { ProductFormValues } from '../products/product-form.tsx';
import type { Order, LineItem, OrderMainStatus, OrderDeliveryStatus, Packaging, OrderPaymentStatus } from './types.ts';

// stores
import { useProductStore } from '../products/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { useOrderStore } from './store.ts';
// ✅ REMOVED: import { generateNextId } - use id: '' instead
import { usePricingPolicyStore } from '../settings/pricing/store.ts';
import { useStockHistoryStore } from '../stock-history/store.ts';
import { useCustomerStore } from '../customers/store.ts';
import { useShippingPartnerStore } from '../settings/shipping/store.ts';
import { SUPPORTED_SHIPPING_PARTNERS, SHIPPING_PARTNER_NAMES, isSupportedShippingPartner, getPreviewParamsKey, getConfigParamsKey, type ShippingPartnerId } from './shipping-partners-config.ts';

// UI components
import { Button } from '../../components/ui/button.tsx';
import { ScrollArea } from '../../components/ui/scroll-area.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { ProductSelectionDialog } from '../shared/product-selection-dialog.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';

// Refactored Components
import { CustomerSelector } from './components/customer-selector.tsx';
import { OrderInfoCard } from './components/order-info-card.tsx';
import { ProductSearch } from './components/product-search.tsx';
import { LineItemsTable } from './components/line-items-table.tsx';
import { OrderSummary } from './components/order-summary.tsx';
import { OrderNotes } from './components/order-notes.tsx';
import { OrderTags } from './components/order-tags.tsx';
import { AddServiceDialog } from './components/add-service-dialog.tsx';
import { ApplyPromotionDialog } from './components/apply-promotion-dialog.tsx';
import { ProductTableToolbar } from './components/product-table-toolbar.tsx';
import type { ProductTableSettings } from './components/product-table-toolbar.tsx';
import { ProductTableBottomToolbar } from './components/product-table-bottom-toolbar.tsx';
import { ShippingCard } from './components/shipping-card.tsx';
import { GHTKService, type GHTKCreateOrderParams } from '../settings/shipping/integrations/ghtk-service';
import { loadShippingConfig } from '../../lib/utils/shipping-config-migration';
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
  total: number;
};

export type OrderFormValues = {
  customer: any; 
  branchSystemId: string;
  salespersonSystemId: string;
  packerId?: string;
  orderDate: Date;
  source: string;
  notes: string;
  tags?: string[]; // Tags phân loại đơn hàng
  
  // Expected dates & payment
  expectedDeliveryDate?: Date; // Hẹn giao
  expectedPaymentMethod?: string; // Thanh toán dự kiến
  
  // External references
  referenceUrl?: string; // Link đơn hàng bên ngoài
  externalReference?: string; // Mã tham chiếu bên ngoài
  
  // Service fees
  serviceFees?: Array<{ id: string; name: string; amount: number }>; // Phí dịch vụ khác
  
  // Discount & Promotions
  orderDiscount?: number;
  orderDiscountType?: 'percentage' | 'fixed';
  orderDiscountReason?: string;
  voucherCode?: string;
  voucherAmount?: number;
  
  trackingCode?: string;
  shippingPartnerId?: string;
  shippingServiceId?: string;
  lineItems: FormLineItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  payments: { method: string; amount: number }[];
  deliveryMethod: string;
  // Add shipping details for the form
  codAmount?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  payer?: 'Người gửi' | 'Người nhận';
  shippingNote?: string;
  deliveryRequirement?: string;
  configuration?: Record<string, any>;
  shippingAddress?: any; // ✅ Selected shipping address from customer
  billingAddress?: any; // ✅ Selected billing address from customer
};

const calculateLineTotal = (item: FormLineItem | LineItem): number => {
    if (!item) return 0;
    const { unitPrice = 0, quantity = 0, discount = 0, discountType = 'fixed' } = item;
    
    const lineGross = (Number(unitPrice) || 0) * (Number(quantity) || 0);
    let lineDiscountAmount = 0;
    const discountAmount = Number(discount) || 0;
    if (discountAmount > 0) {
        if (discountType === 'percentage') {
            lineDiscountAmount = lineGross * (discountAmount / 100);
        } else {
            lineDiscountAmount = discountAmount;
        }
    }
    return lineGross - lineDiscountAmount;
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
        const tax = 0; // Tax logic removed as per new UI
        
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
        const serviceFeeTotal = (watchedServiceFees || []).reduce((sum: number, fee: any) => sum + (Number(fee.amount) || 0), 0);
        
        // Tổng cộng = Subtotal + Shipping + Service Fees - Order Discount - Voucher
        const grandTotal = Math.max(0, subtotal + shipping + serviceFeeTotal + tax - orderDiscountAmount - voucherDiscount);
        
        setValue('subtotal', subtotal, { shouldValidate: false });
        setValue('tax', tax, { shouldValidate: false });
        setValue('grandTotal', grandTotal, { shouldValidate: false });

    }, [watchedLineItems, watchedShippingFee, watchedOrderDiscount, watchedOrderDiscountType, watchedVoucherAmount, watchedServiceFees, setValue, getValues]);

    return null;
}

// Main Component
export function OrderFormPage() {
    const { systemId } = useParams();
    const navigate = useNavigate();
    const { findById, add, update, data: allOrders } = useOrderStore();
    const { data: employees } = useEmployeeStore();
    const { data: branches } = useBranchStore();
    const { data: pricingPolicies } = usePricingPolicyStore();
    const { data: allProducts, add: baseAddProduct } = useProductStore();
    const { addEntry: addStockHistoryEntry } = useStockHistoryStore();
    const { data: partners } = useShippingPartnerStore();

    const isEditing = !!systemId;
    const order = React.useMemo(() => (systemId ? findById(systemId) : null), [systemId, findById]);
    
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
        return order.status === 'Đã hủy' || order.deliveryStatus === 'Đã giao hàng';
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
    const loggedInUser = useEmployeeStore().data[0];
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
        orderDiscount: 0, orderDiscountType: 'fixed'
      }
    });
    const { handleSubmit, getValues, setValue, reset, control } = form;
    const { fields, append, prepend, remove, update: updateField } = useFieldArray({ control, name: "lineItems" });

    const handleSimplifiedAddProduct = (values: ProductFormValues) => {
        const defaultBranch = branches.find(b => b.isDefault);
        const inventoryByBranch: Record<string, number> = {};
        const initialInventory = values.inventory || 0;
        
        branches.forEach(branch => {
            inventoryByBranch[branch.systemId] = (defaultBranch && branch.systemId === defaultBranch.systemId) ? initialInventory : 0;
        });

        const productToAdd = { ...values, inventoryByBranch, committedByBranch: {}, inTransitByBranch: {} };
        baseAddProduct(productToAdd as any);
        
        branches.forEach(branch => {
            const stockLevel = inventoryByBranch[branch.systemId] || 0;
            if (stockLevel > 0) {
              addStockHistoryEntry({
                  productId: values.id,
                  date: getCurrentDate().toISOString(),
                  employeeName: loggedInUser.fullName,
                  action: 'Khởi tạo variant',
                  quantityChange: stockLevel,
                  newStockLevel: stockLevel,
                  documentId: values.id,
                  branch: branch.name,
                  branchSystemId: branch.systemId,
              });
            }
        });
    };

    React.useEffect(() => {
      setSelectedPolicyId(defaultSellingPolicy?.systemId || '');
    }, [defaultSellingPolicy]);

    // Auto-select default branch for new orders
    React.useEffect(() => {
        if (!isEditing && defaultBranch && !getValues('branchSystemId')) {
            setValue('branchSystemId', defaultBranch.systemId);
        }
    }, [isEditing, defaultBranch, getValues, setValue]);

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

            reset({
                customer: customer || null,
                branchSystemId: order.branchSystemId, // ✅ Use systemId only
                salespersonSystemId: order.salespersonSystemId,
                packerId: (order as any).packerId,
                orderDate: parseDate(order.orderDate) || getCurrentDate(),
                notes: order.notes || '',
                tags: order.tags || [], // Tags phân loại đơn hàng
                source: order.source || '',
                trackingCode: order.shippingInfo?.trackingCode || '',
                shippingPartnerId: partners.find(p => p.name === order.shippingInfo?.carrier)?.systemId,
                shippingServiceId: partners.find(p => p.name === order.shippingInfo?.carrier)?.services.find(s => s.name === order.shippingInfo?.service)?.id,
                deliveryMethod,
                // ✅ Load saved addresses from order (if editing)
                shippingAddress: order.shippingAddress ? { street: order.shippingAddress } : (customer?.addresses?.find(a => a.isDefaultShipping) || null),
                billingAddress: order.billingAddress ? { street: order.billingAddress } : (customer?.addresses?.find(a => a.isDefaultBilling) || null),
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
                    total: calculateLineTotal(li),
                })),
                subtotal: order.subtotal,
                shippingFee: order.shippingFee,
                tax: order.tax,
                grandTotal: order.grandTotal,
                payments: order.payments.map(p => ({ method: p.method, amount: p.amount })),
            });
        } else {
             const defaultBranch = branches.find(b => b.isDefault);
             if (defaultBranch) setValue('branchSystemId', defaultBranch.systemId);
             if (loggedInUser) setValue('salespersonSystemId', loggedInUser.systemId);
        }
    }, [isEditing, order, reset, branches, loggedInUser, setValue, partners]);
    
    const handleSelectProducts = (selectedProducts: Product[]) => {
        const currentItems = getValues('lineItems');

        const newItems: any[] = [];
        
        selectedProducts.forEach((product, idx) => {
            const price = product.prices[selectedPolicyId] || 0;
            
            // If split line is disabled, try to find existing item and increase quantity
            if (!enableSplitLine) {
                const existingIndex = currentItems.findIndex(item => item.productSystemId === product.systemId);
                
                if (existingIndex > -1) {
                    const currentItem = getValues(`lineItems.${existingIndex}`);
                    const updatedItem = { ...currentItem, quantity: (Number(currentItem.quantity) || 0) + 1 };
                    updateField(existingIndex, updatedItem);
                    return; // Skip adding new line
                }
            }
            
            // Add as new line (either split line is enabled, or product doesn't exist yet)
            // Ensure unique ID by using timestamp + random + index
            const newItem = {
                id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${idx}`,
                systemId: '',
                productSystemId: product.systemId,
                productId: product.id,
                productName: product.name,
                quantity: 1,
                unitPrice: price,
                discount: 0,
                discountType: tableSettings.discountDefaultType === 'percent' ? 'percentage' : 'fixed',
                total: price,
            };
            newItems.push(newItem);
        });

        // Add items based on insert position setting
        if (newItems.length > 0) {
            if (tableSettings.productInsertPosition === 'top') {
                // Add to top (prepend in reverse order to maintain selection order)
                newItems.reverse().forEach(item => prepend(item as any));
            } else {
                // Add to bottom (append)
                newItems.forEach(item => append(item as any));
            }
        }
    };

    const handleApplyPromotion = (code: string) => {
        // TODO: Implement promotion logic
        // For now, just show success message
        alert(`Đã áp dụng mã giảm giá: ${code}`);
    };
    
    /**
     * Tạo đơn hàng trên GHTK và lấy mã vận đơn
     * ✅ SINGLE SOURCE OF TRUTH: Nhận params đã build sẵn từ shipping-integration (previewParams)
     */
    const createGHTKOrder = async (ghtkParams: GHTKCreateOrderParams): Promise<string | null> => {
        console.log('🔵 [createGHTKOrder] Function called with params:', ghtkParams);
        
        try {
            console.log('📦 [createGHTKOrder] Step 1: Loading shipping config...');
            // Load shipping config
            const shippingConfig = loadShippingConfig();
            console.log('📦 [createGHTKOrder] Step 2: Shipping config loaded:', { 
                hasGHTK: !!shippingConfig?.partners?.GHTK,
                accountsCount: shippingConfig?.partners?.GHTK?.accounts?.length || 0
            });
            const ghtkData = shippingConfig.partners.GHTK;
            
            console.log('📦 [createGHTKOrder] Step 3: Checking GHTK data...', {
                hasGHTKData: !!ghtkData,
                hasAccounts: !!ghtkData?.accounts,
                accountsLength: ghtkData?.accounts?.length
            });
            
            if (!ghtkData || !ghtkData.accounts || ghtkData.accounts.length === 0) {
                console.error('❌ [createGHTKOrder] No GHTK account configured');
                toast.error('Lỗi cấu hình', { description: 'Chưa cấu hình tài khoản GHTK' });
                return null;
            }
            
            console.log('📦 [createGHTKOrder] Step 4: Finding active GHTK account...');
            // Get active GHTK account
            const ghtkAccount = ghtkData.accounts.find(a => a.isDefault && a.active)
                || ghtkData.accounts.find(a => a.active)
                || ghtkData.accounts[0];
            
            console.log('📦 [createGHTKOrder] Step 5: GHTK account found:', {
                hasAccount: !!ghtkAccount,
                isActive: ghtkAccount?.active,
                hasCredentials: !!ghtkAccount?.credentials
            });
            
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
            console.log('� [createGHTKOrder] Calling GHTK API with params:', ghtkParams);
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
        } catch (error: any) {
            console.error('❌ GHTK create order error:', error);
            console.error('❌ Error message:', error?.message);
            console.error('❌ Error stack:', error?.stack);
            // Don't stringify error object - may contain circular references
            toast.error('Lỗi tạo đơn GHTK', { 
                description: error?.message || 'Vui lòng thử lại sau' 
            });
            return null;
        }
    };
    
    // ✅ Guard to prevent double submission
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    
    const processSubmit = async (data: OrderFormValues) => {
        // ✅ Prevent double submission
        if (isSubmitting) {
            console.warn('⚠️ Submission already in progress, skipping...');
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
        const salesperson = employees.find(e => e.systemId === data.salespersonSystemId);
        const branch = branches.find(b => b.systemId === data.branchSystemId);
    
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
            let shippingProvince, shippingDistrict, shippingWard, shippingStreet;
            
            if (customer.addresses && customer.addresses.length > 0) {
                // New schema: Get default shipping address or first address
                const shippingAddr = customer.addresses.find((a: any) => a.isDefaultShipping) || customer.addresses[0];
                shippingProvince = shippingAddr.province;
                shippingDistrict = shippingAddr.district;
                shippingWard = shippingAddr.ward;
                shippingStreet = shippingAddr.street;
            } else {
                // Old schema: Use flat fields
                shippingProvince = customer.shippingAddress_province;
                shippingDistrict = customer.shippingAddress_district;
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
        const sanitizeString = (str: string) => {
            if (!str) return '';
            return str.trim()
                .replace(/[<>]/g, '') // Remove < and >
                .substring(0, 500); // Limit length
        };
        
        const sanitizedNotes = sanitizeString(data.notes || '');
        const sanitizedSource = sanitizeString(data.source || '');
        const sanitizedTags = (data.tags || []).map(tag => sanitizeString(tag));
        
        const totalPaid = data.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        let paymentStatus: OrderPaymentStatus = 'Chưa thanh toán';
        if (data.grandTotal > 0 && totalPaid >= data.grandTotal) {
            paymentStatus = 'Thanh toán toàn bộ';
        } else if (totalPaid > 0) {
            paymentStatus = 'Thanh toán 1 phần';
        }

        // Auto-duyệt nếu đang submit "draft" nhưng có thanh toán
        let effectiveSubmitAction = submitAction;
        if (submitAction === 'draft' && totalPaid > 0) {
            effectiveSubmitAction = 'approve';
        }

        let packagings: Packaging[] = [];
        let finalMainStatus: OrderMainStatus;
        let finalDeliveryStatus: OrderDeliveryStatus;
        let finalCompletedDate: string | undefined = undefined;
        const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');
        
        // ✅ Generate order ID once - empty string for auto-generate
        const finalOrderId = (isEditing && order) ? order.id : "";

        switch (data.deliveryMethod) {
            case 'pickup':
                // Nhận tại cửa hàng - Trạng thái ban đầu: "Chờ đóng gói" (chưa chọn phương thức giao hàng cụ thể)
                finalDeliveryStatus = 'Chờ đóng gói';
                finalMainStatus = 'Đang giao dịch';
                packagings.push({
                    systemId: `PKG_NEW_${Date.now()}`,
                    id: "", // ✅ Empty - auto-generate
                    requestDate: now,
                    requestingEmployeeId: salesperson.systemId, 
                    requestingEmployeeName: salesperson.fullName,
                    status: 'Chờ đóng gói',
                    printStatus: 'Chưa in',
                    // ✅ Không set deliveryMethod ngay, để sau khi đóng gói mới chọn
                    deliveryStatus: 'Chờ đóng gói',
                });
                break;

            case 'shipping-partner':
                finalMainStatus = 'Đang giao dịch';
                finalDeliveryStatus = 'Chờ lấy hàng';
                // ✅ FIX: Find partner by ID (not systemId) because form stores partner.id
                const partner = data.shippingPartnerId ? partners.find(p => p.id === data.shippingPartnerId) : undefined;
                const service = partner?.services.find(s => s.id === data.shippingServiceId);
                
                console.log('🔍 [DEBUG] Shipping Partner Info:', {
                    deliveryMethod: data.deliveryMethod,
                    shippingPartnerId: data.shippingPartnerId,
                    shippingServiceId: data.shippingServiceId,
                    partner: partner ? {
                        id: partner.id,
                        systemId: partner.systemId,
                        name: partner.name
                    } : null,
                    service: service ? {
                        id: service.id,
                        name: service.name
                    } : null,
                    allPartners: partners.map(p => ({ id: p.id, systemId: p.systemId, name: p.name }))
                });
                
                // ========================================
                // 🚚 TẠO ĐƠN VẬN CHUYỂN QUA API ĐỐI TÁC
                // ========================================
                // Hỗ trợ nhiều đơn vị: GHTK, GHN, J&T, VTP, SPX, v.v.
                // Logic tổng quát cho tất cả đơn vị vận chuyển
                
                let partnerTrackingCode: string | null = null;
                const partnerId = partner?.id;
                
                // Kiểm tra nếu đơn vị vận chuyển có API integration
                if (partnerId && isSupportedShippingPartner(partnerId)) {
                    console.log(`=== 🚀 FRONTEND: Calling ${partnerId} API ===`);
                    console.log('Partner:', partner.name, `(${SHIPPING_PARTNER_NAMES[partnerId]})`);
                    console.log('Order ID:', finalOrderId);
                    
                    // ✅ Get preview params from window (stored by shipping-integration)
                    // Mỗi đơn vị vận chuyển sẽ có params riêng
                    const previewParamsKey = getPreviewParamsKey(partnerId);
                    const configParamsKey = getConfigParamsKey(partnerId);
                    const partnerParams = (window as any)[previewParamsKey] || data.configuration?.[configParamsKey];
                    
                    if (!partnerParams) {
                        // ⚠️ CRITICAL: Không có params = chưa chọn đầy đủ thông tin vận chuyển
                        console.error(`❌ Missing ${partnerId} preview params (key: ${previewParamsKey}). Cannot create order.`);
                        toast.error(`Thiếu thông tin vận chuyển ${partner.name}`, { 
                            description: `Vui lòng cấu hình đầy đủ thông tin vận chuyển (địa chỉ, dịch vụ, phí) trong tab "Đẩy qua hãng vận chuyển" trước khi tạo đơn.`,
                            duration: 5000
                        });
                        return; // ❌ STOP: Không cho tạo đơn
                    }
                    
                    console.log(`✅ Using ${partnerId} preview params:`, partnerParams);
                    
                    try {
                        // Gọi API tương ứng với từng đơn vị
                        switch (partnerId) {
                            case 'GHTK':
                                partnerTrackingCode = await createGHTKOrder(partnerParams);
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
                                console.warn(`⚠️ Partner ${partnerId} not implemented yet`);
                                toast.warning(`${partner.name} chưa được tích hợp`, {
                                    description: 'Vui lòng tạo vận đơn thủ công trên trang của đối tác'
                                });
                        }
                        
                        console.log(`✅ Received tracking code from ${partnerId}:`, partnerTrackingCode);
                        
                        if (!partnerTrackingCode) {
                            throw new Error(`${partner.name} API không trả về mã vận đơn`);
                        }
                    } catch (error: any) {
                        console.error(`❌ ${partnerId} API Error:`, error);
                        console.error('Error message:', error?.message);
                        
                        // Hỏi user có muốn tiếp tục không
                        const shouldContinue = confirm(
                            `Không tạo được đơn trên ${partner.name}:\n${error?.message || 'Lỗi không xác định'}\n\n` +
                            `Bạn có muốn lưu đơn hàng với mã vận đơn tạm thời không?\n` +
                            `(Bạn có thể tạo vận đơn ${partner.name} sau trong trang chi tiết đơn hàng)`
                        );
                        if (!shouldContinue) {
                            return; // ❌ STOP: User không muốn tiếp tục
                        }
                        // User chọn tiếp tục → sẽ dùng tracking code tạm
                    }
                    console.log('==========================================');
                }
                
                const allTrackingCodes = allOrders.flatMap(o => o.packagings).map(p => ({ id: p.trackingCode })).filter(p => p.id);
                packagings.push({
                    systemId: `PKG_NEW_${Date.now()}`,
                    id: "", // ✅ Empty - auto-generate
                    requestDate: now, confirmDate: now,
                    requestingEmployeeId: salesperson.systemId, requestingEmployeeName: salesperson.fullName,
                    confirmingEmployeeId: salesperson.systemId, confirmingEmployeeName: salesperson.fullName,
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
                break;
            
            case 'deliver-later':
            default:
                // Áp dụng submitAction: draft = "Đặt hàng", approve = "Đang giao dịch"
                finalMainStatus = effectiveSubmitAction === 'approve' ? 'Đang giao dịch' : 'Đặt hàng';
                finalDeliveryStatus = 'Chờ đóng gói';
                break;
        }

        const finalOrderData = {
            id: finalOrderId, // ✅ Use the same ID generated at the beginning (avoid duplicate generation)
            customerSystemId: customer.systemId, 
            customerName: sanitizeString(customer.name),
            
            // ✅ Save selected addresses from form (or fallback to default)
            shippingAddress: data.shippingAddress ? 
                [data.shippingAddress.street, data.shippingAddress.ward, data.shippingAddress.district, data.shippingAddress.province].filter(Boolean).join(', ') :
                (customer.addresses?.find(a => a.isDefaultShipping) ? 
                    [customer.addresses.find(a => a.isDefaultShipping)?.street, 
                     customer.addresses.find(a => a.isDefaultShipping)?.ward,
                     customer.addresses.find(a => a.isDefaultShipping)?.district,
                     customer.addresses.find(a => a.isDefaultShipping)?.province].filter(Boolean).join(', ') : 
                    undefined),
            billingAddress: data.billingAddress ? 
                [data.billingAddress.street, data.billingAddress.ward, data.billingAddress.district, data.billingAddress.province].filter(Boolean).join(', ') :
                (customer.addresses?.find(a => a.isDefaultBilling) ? 
                    [customer.addresses.find(a => a.isDefaultBilling)?.street, 
                     customer.addresses.find(a => a.isDefaultBilling)?.ward,
                     customer.addresses.find(a => a.isDefaultBilling)?.district,
                     customer.addresses.find(a => a.isDefaultBilling)?.province].filter(Boolean).join(', ') : 
                    undefined),
            
            branchSystemId: data.branchSystemId, // ✅ Form branchSystemId field contains systemId
            branchName: branch.name,
            salespersonSystemId: data.salespersonSystemId, 
            salesperson: salesperson.fullName,
            orderDate: toISODateTime(data.orderDate),
            lineItems: data.lineItems.map(li => ({
                productSystemId: li.productSystemId, 
                productId: sanitizeString(li.productId), 
                productName: sanitizeString(li.productName),
                quantity: Number(li.quantity), 
                unitPrice: Number(li.unitPrice), 
                discount: Number(li.discount), 
                discountType: li.discountType,
            })),
            subtotal: data.subtotal, 
            shippingFee: data.shippingFee, 
            tax: data.tax, 
            grandTotal: data.grandTotal,
            payments: (data.payments || []).map(p => ({ 
                systemId: '', 
                id: '', 
                date: '', 
                createdBy: '', 
                description: '', 
                method: p.method, 
                amount: Number(p.amount) 
            })),
            notes: sanitizedNotes, 
            tags: sanitizedTags,
            source: sanitizedSource,
            status: finalMainStatus,
            paymentStatus: paymentStatus,
            deliveryStatus: finalDeliveryStatus,
            printStatus: 'Chưa in',
            stockOutStatus: 'Chưa xuất kho',
            returnStatus: 'Chưa trả hàng',
            deliveryMethod: data.deliveryMethod === 'pickup' ? 'Nhận tại cửa hàng' : 'Dịch vụ giao hàng',
            codAmount: data.codAmount || 0,
            packagings: packagings,
            completedDate: finalCompletedDate,
        };

        if (isEditing && order) {
            const updatedOrder: Order = { ...order, ...finalOrderData };
            update(order.systemId, updatedOrder);
            navigate(`/orders/${order.systemId}`);
        } else {
            console.log('🔵 [DEBUG] Creating new order with data:', finalOrderData);
            const newItem = add(finalOrderData as Omit<Order, 'systemId'>);
            console.log('🔵 [DEBUG] New item returned from add():', newItem);
            console.log('🔵 [DEBUG] New item systemId:', newItem?.systemId);
            console.log('🔵 [DEBUG] Navigating to:', `/orders/${newItem?.systemId}`);
            if (newItem) {
                navigate(`/orders/${newItem.systemId}`);
            } else {
                console.error('❌ [DEBUG] add() returned null/undefined!');
                navigate('/orders'); // Fallback
            }
        }
    };

    // Page header actions
    const actions = [
        <Button 
            key="exit" 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/orders')} 
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
            onClick={(e) => {
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
                onClick={(e) => {
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

    const routeMeta = useRouteMeta();

    usePageHeader({ 
        actions,
        breadcrumb: order ? [
            { label: 'Trang chủ', href: '/', isCurrent: false },
            { label: 'Đơn hàng', href: '/orders', isCurrent: false },
            { label: order.id, href: `/orders/${order.systemId}`, isCurrent: false },
            { label: isEditing ? 'Chỉnh sửa' : 'Chi tiết', href: '', isCurrent: true }
        ] : routeMeta?.breadcrumb as any
        // KHÔNG truyền title - để auto-generate từ MODULES config
    });
    
    return (
        <FormProvider {...form}>
            <form id="order-form" onSubmit={handleSubmit(processSubmit)} className="h-full flex flex-col">
                <OrderCalculations />
                <ScrollArea className="flex-grow">
                    <div className="pr-4 space-y-4">
                        {/* ✅ Thông báo khi chỉ sửa metadata */}
                        {isMetadataOnlyMode && (
                            <Card className="border-amber-200 bg-amber-50">
                                <CardContent className="pt-6">
                                    <p className="text-sm text-amber-800">
                                        <strong>Lưu ý:</strong> Đơn hàng đã đóng gói/xuất kho. Chỉ có thể chỉnh sửa: Tags, Ghi chú, Hẹn giao, Ngày bán, Đường dẫn đơn hàng, Tham chiếu.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                        
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="flex-grow-[7] w-full md:w-0"><CustomerSelector disabled={isFormDisabled || isMetadataOnlyMode} /></div>
                            <div className="flex-grow-[3] w-full md:w-0"><OrderInfoCard disabled={isFormDisabled} isBranchLocked={isBranchLocked} isMetadataOnlyMode={isMetadataOnlyMode} /></div>
                        </div>
                        <Card className="flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="text-base font-semibold">Thông tin sản phẩm</CardTitle>
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
                                        <ProductSearch onSelectProduct={(p) => handleSelectProducts([p])} onAddProduct={handleSimplifiedAddProduct} disabled={isFormDisabled || isMetadataOnlyMode} defaultPolicyId={defaultSellingPolicy?.systemId} />
                                        <Button type="button" variant="outline" className="h-9 flex-shrink-0" onClick={() => setIsProductSelectionOpen(true)} disabled={isFormDisabled || isMetadataOnlyMode}>Chọn nhanh</Button>
                                        <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId} disabled={isFormDisabled || isMetadataOnlyMode}>
                                            <SelectTrigger className="h-9 w-[180px] flex-shrink-0"><SelectValue /></SelectTrigger>
                                            <SelectContent>{salesPolicies.map(p => <SelectItem key={p.systemId} value={p.systemId}>{p.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {fields.length === 0 ? (
                                    <>
                                        <div className="text-center text-muted-foreground p-12 border border-dashed rounded-md">
                                            <PackageOpen className="mx-auto h-12 w-12 text-gray-300" />
                                            <p className="mt-4 text-sm">Chưa có sản phẩm nào trong đơn hàng</p>
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
                                    /> 
                                )}
                            </CardContent>
                        </Card>
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="flex-grow-[6] w-full md:w-0 space-y-4">
                                <OrderNotes disabled={isFullyReadOnly} />
                                <OrderTags disabled={isFullyReadOnly} />
                            </div>
                            <div className="flex-grow-[4] w-full md:w-0"><OrderSummary disabled={isFormDisabled || isMetadataOnlyMode} /></div>
                        </div>
                        
                        {/* ✅ CHỈ hiển thị card Giao hàng ở chế độ TẠO đơn hàng, KHÔNG hiển thị ở chế độ SỬA */}
                        <ShippingCard hidden={isEditing} />
                    </div>
                </ScrollArea>
                <ProductSelectionDialog isOpen={isProductSelectionOpen} onOpenChange={setIsProductSelectionOpen} onSelect={handleSelectProducts} />
                <AddServiceDialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen} disabled={isFormDisabled} onAppend={append} />
                <ApplyPromotionDialog open={isApplyPromotionDialogOpen} onOpenChange={setIsApplyPromotionDialogOpen} onApply={handleApplyPromotion} disabled={isFormDisabled} />
            </form>
        </FormProvider>
    );
}
