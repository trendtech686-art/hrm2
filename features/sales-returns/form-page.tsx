
import * as React from 'react';
// FIX: Use named imports for react-router-dom to fix module export errors.
import { useParams, useNavigate, Link } from 'react-router-dom';
// FIX: Changed 'FieldArray as useFieldArray' to 'useFieldArray' to correctly import the hook from 'react-hook-form'.
import { useForm, useFieldArray, Controller, useWatch, FormProvider, useFormContext } from 'react-hook-form';
import { toISODateTime } from '../../lib/date-utils.ts';
import { ArrowLeft, PlusCircle, Trash2, CheckCircle2, AlertTriangle, PackageOpen, Package, ChevronDown, ChevronRight, Eye, StickyNote, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { GHTKService, type GHTKCreateOrderParams } from '../settings/shipping/integrations/ghtk-service';
import { loadShippingConfig } from '../../lib/utils/shipping-config-migration';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog.tsx';
import { useProductImage } from '../products/components/product-image.tsx';

// types
import type { Order } from '../orders/types.ts';
import type { SalesReturn, ReturnLineItem, LineItem as ExchangeLineItem } from './types.ts';
import type { Product } from '../products/types.ts';

// Stores
import { useOrderStore } from '../orders/store.ts';
import { useCustomerStore } from '../customers/store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { useSalesReturnStore } from './store.ts';
import { useProductStore } from '../products/store.ts';
import { useCashbookStore } from '../cashbook/store.ts';
import { useProductTypeStore } from '../settings/inventory/product-type-store.ts';

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog.tsx';
import { OrderProductSearch } from '../../components/shared/unified-product-search.tsx';
import { LineItemsTable } from '../orders/components/line-items-table.tsx';
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
import { useAuth } from '../../contexts/auth-context.tsx';
import { ROUTES, generatePath } from '../../lib/router.ts';
import type { BreadcrumbItem } from '../../lib/breadcrumb-system.ts';
import { SalesReturnWorkflowCard } from './components/sales-return-workflow-card.tsx';
import type { Subtask } from '../../components/shared/subtask-list.tsx';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

// Component hiển thị ảnh sản phẩm với preview - copy từ order-detail-page
const ProductThumbnailCell = ({ 
    productSystemId, 
    product,
    productName, 
    size = 'md',
    onPreview 
}: { 
    productSystemId: string; 
    product?: { thumbnailImage?: string; galleryImages?: string[]; images?: string[]; name?: string } | null;
    productName: string;
    size?: 'sm' | 'md';
    onPreview?: (image: string, title: string) => void;
}) => {
    const imageUrl = useProductImage(productSystemId, product);
    
    const sizeClasses = size === 'sm' 
        ? 'w-10 h-9' 
        : 'w-12 h-10';
    const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-4 w-4';
    
    if (imageUrl) {
        return (
            <div
                className={`group/thumbnail relative ${sizeClasses} rounded border overflow-hidden bg-muted ${onPreview ? 'cursor-pointer' : ''}`}
                onClick={() => onPreview?.(imageUrl, productName)}
            >
                <img src={imageUrl} alt={productName} className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75" />
                {onPreview && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className={`${sizeClasses} bg-muted rounded flex items-center justify-center`}>
            <Package className={`${iconSize} text-muted-foreground`} />
        </div>
    );
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
  // Workflow subtasks
  subtasks?: Subtask[];
};


// Component to handle complex calculations
const FinancialCalculations = () => {
    // ... existing code ...
    return null; // Deprecated
};

const ReturnItemRow = React.memo(({ 
    index, 
    field, 
    control, 
    setValue, 
    products, 
    expandedCombos, 
    toggleComboRow, 
    handlePreview, 
    handleOpenReturnNoteDialog,
    getProductTypeLabel
}: {
    index: number;
    field: any;
    control: any;
    setValue: any;
    products: any[];
    expandedCombos: Record<string, boolean>;
    toggleComboRow: (id: string) => void;
    handlePreview: (img: string, title: string) => void;
    handleOpenReturnNoteDialog: (index: number) => void;
    getProductTypeLabel: (p: any) => string;
}) => {
    const returnQuantity = useWatch({ control, name: `items.${index}.returnQuantity` });
    const unitPrice = useWatch({ control, name: `items.${index}.unitPrice` });
    const note = useWatch({ control, name: `items.${index}.note` });
    
    const product = products.find(p => p.systemId === field.productSystemId);
    const isCombo = product?.type === 'combo' && (product?.comboItems?.length ?? 0) > 0;
    const isExpanded = expandedCombos[field.productSystemId] ?? false;
    const comboItems = isCombo && product?.comboItems
        ? product.comboItems.map((ci: any) => {
            const childProduct = products.find((p: any) => p.systemId === ci.productSystemId);
            return { ...ci, product: childProduct };
            })
        : [];
    
    const totalValue = (returnQuantity || 0) * (unitPrice || 0);

    return (
        <React.Fragment>
            <TableRow>
                <TableCell className="text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-1">
                        {isCombo && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleComboRow(field.productSystemId)}
                            >
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        )}
                        <span>{index + 1}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <ProductThumbnailCell
                            productSystemId={field.productSystemId}
                            product={product}
                            productName={field.productName}
                            onPreview={handlePreview}
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <Link 
                                    to={`/products/${field.productSystemId}`}
                                    className="font-medium text-primary hover:underline"
                                >
                                    {field.productName}
                                </Link>
                                {isCombo && (
                                    <span className="text-body-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                                        COMBO
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-body-xs text-muted-foreground group/info flex-wrap">
                                <span>{getProductTypeLabel(product)}</span>
                                <span>-</span>
                                <Link 
                                    to={`/products/${field.productSystemId}`}
                                    className="hover:text-primary hover:underline"
                                >
                                    {field.productId}
                                </Link>
                                {note ? (
                                    <>
                                        <span className="text-amber-600">
                                            <StickyNote className="h-3 w-3 inline mr-0.5" />
                                            <span className="italic">{note}</span>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleOpenReturnNoteDialog(index)}
                                            className="opacity-0 group-hover/info:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </button>
                                    </>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        onClick={() => handleOpenReturnNoteDialog(index)}
                                        className="opacity-0 group-hover/info:opacity-100 transition-opacity h-auto p-0 text-body-xs text-muted-foreground hover:text-foreground"
                                    >
                                        Thêm ghi chú
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
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
                <TableCell className="text-right font-semibold">{formatCurrency(totalValue)}</TableCell>
            </TableRow>
            {/* Combo child rows */}
            {isCombo && isExpanded && comboItems.map((ci: any, ciIndex: number) => (
                <TableRow key={`${field.id}-combo-${ciIndex}`} className="bg-muted/40">
                    <TableCell className="text-center text-muted-foreground pl-8">
                        <span className="text-muted-foreground/60">└</span>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <ProductThumbnailCell
                                productSystemId={ci.productSystemId}
                                product={ci.product}
                                productName={ci.product?.name || 'N/A'}
                                size="sm"
                                onPreview={handlePreview}
                            />
                            <div>
                                <p className="text-body-sm font-medium">{ci.product?.name || 'Sản phẩm không tồn tại'}</p>
                                <p className="text-body-xs text-muted-foreground">{ci.product?.id} × {ci.quantity}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell colSpan={5}></TableCell>
                </TableRow>
            ))}
        </React.Fragment>
    );
});

const ReturnTableFooter = () => {
    const { control } = useFormContext<FormValues>();
    const watchedReturnItems = useWatch({ control, name: "items" }) || [];
    
    const totalReturnValue = React.useMemo(() => 
        watchedReturnItems.reduce((sum, item) => sum + ((item.returnQuantity || 0) * (item.unitPrice || 0)), 0), 
        [watchedReturnItems]
    );
    
    const totalReturnQuantity = React.useMemo(() => 
        watchedReturnItems.reduce((sum, item) => sum + (item.returnQuantity || 0), 0), 
        [watchedReturnItems]
    );

    return (
        <TableFooter>
            <TableRow>
                <TableCell colSpan={2}>
                    Số lượng trả ({totalReturnQuantity} sản phẩm)
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-semibold">Cần hoàn tiền trả hàng</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(totalReturnValue)}</TableCell>
                <TableCell></TableCell>
            </TableRow>
        </TableFooter>
    );
};

const SalesReturnSummary = () => {
    const { control, setValue, getValues } = useFormContext<FormValues>();
    const { systemId } = useParams<{ systemId: string }>();
    
    // Watch everything needed for calculations
    const watchedReturnItems = useWatch({ control, name: "items" }) || [];
    const watchedExchangeItems = useWatch({ control, name: "exchangeItems" }) || [];
    const watchedPayments = useWatch({ control, name: "payments" }) || [];
    const watchedRefunds = useWatch({ control, name: "refunds" }) || [];
    const watchedOrderDiscount = useWatch({ control, name: "orderDiscount" }) || 0;
    const watchedOrderDiscountType = useWatch({ control, name: "orderDiscountType" }) || 'fixed';
    const watchedShippingFee = useWatch({ control, name: "shippingFee" }) || 0;

    // Stores
    const { findById: findOrder } = useOrderStore();
    const order = findOrder(systemId!);
    const { data: allSalesReturns } = useSalesReturnStore();
    const { accounts } = useCashbookStore();
    const { data: paymentMethodsData } = usePaymentMethodStore();

    // Calculations
    const totalReturnValue = React.useMemo(() => 
        watchedReturnItems.reduce((sum, item) => sum + ((item.returnQuantity || 0) * (item.unitPrice || 0)), 0), 
        [watchedReturnItems]
    );
    
    const subtotalExchangeValue = React.useMemo(() => 
        (watchedExchangeItems || []).reduce((sum, item) => sum + item.total, 0), 
        [watchedExchangeItems]
    );
    
    const totalExchangeValue = React.useMemo(() => {
        const orderDiscountValue = watchedOrderDiscountType === 'percentage'
        ? (subtotalExchangeValue * watchedOrderDiscount) / 100
        : watchedOrderDiscount;
        
        return subtotalExchangeValue - orderDiscountValue + watchedShippingFee;
    }, [subtotalExchangeValue, watchedOrderDiscount, watchedOrderDiscountType, watchedShippingFee]);
    
    const finalAmount = totalExchangeValue - totalReturnValue;
    const isRefunding = finalAmount < 0;

    // Side effects (moved from main component)
    const prevFinalAmountRef = React.useRef<number>(finalAmount);
    React.useEffect(() => {
        if (prevFinalAmountRef.current !== finalAmount) {
            if (finalAmount > 0) {
                setValue('packageInfo.codAmount', finalAmount, { shouldDirty: false });
                setValue('grandTotal', finalAmount, { shouldDirty: false });
            } else {
                setValue('packageInfo.codAmount', 0, { shouldDirty: false });
                setValue('grandTotal', 0, { shouldDirty: false });
            }
            prevFinalAmountRef.current = finalAmount;
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

    const prevRefundStateRef = React.useRef<{ finalAmount: number; isRefunding: boolean; maxRefundableAmount: number }>({ 
        finalAmount, 
        isRefunding, 
        maxRefundableAmount 
    });
    React.useEffect(() => {
        const prev = prevRefundStateRef.current;
        if (prev.finalAmount !== finalAmount || prev.isRefunding !== isRefunding || prev.maxRefundableAmount !== maxRefundableAmount) {
            if(isRefunding) {
                setValue('refundAmount', Math.min(Math.abs(finalAmount), maxRefundableAmount), { shouldDirty: false });
            } else {
                setValue('refundAmount', 0, { shouldDirty: false });
            }
            prevRefundStateRef.current = { finalAmount, isRefunding, maxRefundableAmount };
        }
    }, [finalAmount, isRefunding, maxRefundableAmount, setValue]);

    return (
        <>
             {/* Row 5: Layout 2 cột - Ghi chú/Tags + Thanh toán */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
                {/* Left: Ghi chú và Tags */}
                <div className="flex-grow-[6] w-full md:w-0 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-h4">Ghi chú đơn hàng</CardTitle>
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
                            <CardTitle className="text-h4">Tags</CardTitle>
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
                            <CardTitle className="text-h4">Thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-body-sm">
                                <span className="text-muted-foreground">Tổng tiền ({watchedExchangeItems.length} sản phẩm)</span>
                                <span>{formatCurrency(subtotalExchangeValue)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-body-sm">
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
                            
                            <div className="flex justify-between items-center text-body-sm">
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
                                <span className="text-h3">{formatCurrency(totalExchangeValue)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Row 6: Thanh toán - LUÔN HIỂN THỊ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-h4">
                        {finalAmount < 0 ? 'Hoàn tiền' : finalAmount > 0 ? 'Thanh toán' : 'Thanh toán'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 text-body-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Cần hoàn tiền trả hàng</span>
                            <span className="font-medium">{formatCurrency(totalReturnValue)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Khách cần trả đơn đổi</span>
                            <span className="font-medium">{formatCurrency(totalExchangeValue)}</span>
                        </div>
                        
                        <Separator />
                        
                        {/* Case 1: Đơn đổi < Đơn trả → Có thể cần hoàn tiền cho khách */}
                        {finalAmount < 0 && (
                            <>
                                <div className="flex justify-between font-semibold text-h4 text-green-600">
                                    <span>Tổng tiền cần hoàn trả khách</span>
                                    <span>{formatCurrency(Math.min(Math.abs(finalAmount), maxRefundableAmount))}</span>
                                </div>
                                {maxRefundableAmount < Math.abs(finalAmount) && (
                                    <div className="text-body-xs text-muted-foreground">
                                        (Khách đã thanh toán: {formatCurrency(totalPaidOnOriginalOrder)} - Chỉ hoàn tối đa số tiền đã thu)
                                    </div>
                                )}
                                {maxRefundableAmount === 0 && (
                                    <div className="text-body-xs text-blue-600 bg-blue-50 p-2 rounded">
                                        ✓ Khách chưa thanh toán đơn hàng gốc, không cần hoàn tiền. Chỉ cần nhận lại hàng.
                                    </div>
                                )}
                            </>
                        )}
                        
                        {/* Case 2: Đơn đổi > Đơn trả → Khách phải trả thêm */}
                        {finalAmount > 0 && (
                            <>
                                <div className="flex justify-between font-semibold text-h4 text-amber-600">
                                    <span>Tổng tiền khách phải trả</span>
                                    <span>{formatCurrency(Math.abs(finalAmount))}</span>
                                </div>
                            </>
                        )}
                        
                        {/* Case 3: Bằng nhau */}
                        {finalAmount === 0 && (
                            <div className="flex justify-between font-semibold text-h4 text-muted-foreground">
                                <span>Không phát sinh thanh toán</span>
                                <span>{formatCurrency(0)}</span>
                            </div>
                        )}
                    </div>

                    {/* Form hoàn tiền - CHỈ hiển thị nếu cần hoàn tiền VÀ khách đã thanh toán */}
                    {finalAmount < 0 && maxRefundableAmount > 0 && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-body-sm font-medium">Đã hoàn tiền</span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        const refunds = getValues('refunds') || [];
                                        const defaultMethod = paymentMethodsData.find(pm => pm.isDefault)?.name || 'Tiền mặt';
                                        const defaultAccount = accounts.find(acc => acc.isDefault);
                                        const requiredRefundAmount = Math.min(Math.abs(finalAmount), maxRefundableAmount);
                                        setValue('refunds', [
                                            ...refunds,
                                            { 
                                                method: defaultMethod, 
                                                accountSystemId: defaultAccount?.systemId || accounts[0]?.systemId || '', 
                                                amount: requiredRefundAmount
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
                                                <Label className="text-body-xs mb-1 block">Phương thức</Label>
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
                                                <Label className="text-body-xs mb-1 block">Tài khoản</Label>
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
                                                                        {acc.name} {acc.isDefault && '(Mặc định)'}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <Label className="text-body-xs mb-1 block">Số tiền</Label>
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
                                    <div className="flex justify-between pt-2 border-t text-body-sm">
                                        <span className="font-medium">Tổng đã hoàn:</span>
                                        <span className="font-semibold">
                                            {formatCurrency((watchedRefunds || []).reduce((sum, r) => sum + (r.amount || 0), 0))}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-body-sm text-muted-foreground text-center py-4">
                                    Chưa có phương thức hoàn tiền. Nhấn "Thêm phương thức" để bắt đầu.
                                </p>
                            )}

                            <Separator />

                            <div className="flex justify-between items-center">
                                <span className="text-body-sm font-medium">Đã hoàn tiền</span>
                                <span className="text-h4 font-semibold">
                                    {formatCurrency((watchedRefunds || []).reduce((sum, r) => sum + (r.amount || 0), 0))}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-body-sm font-medium">Còn phải hoàn trả khách</span>
                                <span className="text-h3 font-bold text-green-600">
                                    {formatCurrency(Math.min(Math.abs(finalAmount), maxRefundableAmount) - ((watchedRefunds || []).reduce((sum, r) => sum + (r.amount || 0), 0)))}
                                </span>
                            </div>
                        </div>
                    )}
                    
                    {/* Form thanh toán - CHỈ hiển thị nếu finalAmount > 0 (khách phải trả thêm) */}
                    {finalAmount > 0 && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-body-sm font-medium">Đã thanh toán</span>
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
                                                <Label className="text-body-xs mb-1 block">Phương thức</Label>
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
                                                <Label className="text-body-xs mb-1 block">Tài khoản</Label>
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
                                                                        {acc.name} {acc.isDefault && '(Mặc định)'}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <Label className="text-body-xs mb-1 block">Số tiền</Label>
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
                                    <div className="flex justify-between pt-2 border-t text-body-sm">
                                        <span className="font-medium">Tổng đã thanh toán:</span>
                                        <span className="font-semibold">
                                            {formatCurrency((watchedPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0))}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-body-sm text-muted-foreground text-center py-4">
                                    Chưa có phương thức thanh toán. Nhấn "Thêm phương thức" để bắt đầu.
                                </p>
                            )}

                            <Separator />

                            <div className="flex justify-between items-center">
                                <span className="text-body-sm font-medium">Đã thanh toán</span>
                                <span className="text-h4 font-semibold">
                                    {formatCurrency((watchedPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0))}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-body-sm font-medium">Khách còn phải trả</span>
                                <span className="text-h3 font-bold text-amber-600">
                                    {formatCurrency(Math.abs(finalAmount) - ((watchedPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0)))}
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
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
    const { employee: authEmployee } = useAuth();
    const creatorName = authEmployee?.fullName ?? 'Hệ thống';
    const creatorSystemId = authEmployee?.systemId ?? 'SYSTEM';
    const { add: addProduct, data: allProducts } = useProductStore(); // For GHTK API
    const products = React.useMemo(() => Array.isArray(allProducts) ? allProducts : [], [allProducts]);
    const { findById: findProductTypeById } = useProductTypeStore();
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
  
  // Image preview state
  const [previewState, setPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
    open: false,
    image: '',
    title: ''
  });
  
  // Combo expand state for return items
  const [expandedCombos, setExpandedCombos] = React.useState<Record<string, boolean>>({});

  // Product type label fallbacks
  const productTypeFallbackLabels: Record<string, string> = {
    physical: 'Hàng hóa',
    combo: 'Combo',
    service: 'Dịch vụ',
    digital: 'Sản phẩm số',
  };
  
  const getProductTypeLabel = React.useCallback((product: any) => {
    if (!product) return 'Hàng hóa';
    if (product.productTypeId) {
      const productType = findProductTypeById(product.productTypeId);
      if (productType?.name) return productType.name;
    }
    return productTypeFallbackLabels[product.type] || 'Hàng hóa';
  }, [findProductTypeById]);
  
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

  const { control, handleSubmit, setValue, reset, getValues, setError } = form;

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
  const handleOpenExchangeNoteDialog = React.useCallback((index: number) => {
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
          note: item.note || '', // Lấy ghi chú từ đơn hàng
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
          subtasks: [],
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
      
      // Max refundable
      const totalPaidOnOriginalOrder = order ? order.payments.reduce((sum, p) => sum + p.amount, 0) : 0;
      const previousReturnsForOrder = order ? allSalesReturns.filter(sr => sr.orderSystemId === order.systemId) : [];
      const totalReturnedValuePreviously = previousReturnsForOrder.reduce((sum, sr) => sum + sr.totalReturnValue, 0);
      const totalRefundedPreviously = previousReturnsForOrder.reduce((sum, sr) => sum + (sr.refundAmount || 0), 0);
      
      const valueOfGoodsKept = (order?.grandTotal || 0) - totalReturnedValuePreviously - totalReturnValue;
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
            onClick={() => navigate(backDestination)}
        >
            Thoát
        </Button>,
        <Button
            key="submit"
            type="submit"
            form="sales-return-form"
            className="h-9 px-4"
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Đang xử lý...' : 'Hoàn trả'}
        </Button>
    ], [navigate, backDestination, isSubmitting]);

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
        subtitle: order ? `${customer?.name || 'Khách lẻ'} | ${order.branchName}` : 'Chọn đơn hàng để bắt đầu khởi tạo phiếu trả',
        breadcrumb,
        showBackButton: true,
        backPath: backDestination,
        actions: headerActions,
    }), [order, customer?.name, order?.branchName, backDestination, headerActions, breadcrumb]);

    usePageHeader(pageHeaderConfig);

  if (!order || !customer || !branches.length) {
    return <div>Đang tải hoặc không tìm thấy đơn hàng...</div>;
  }
  
  const handleSelectProducts = (selectedProducts: Product[]) => {
      const currentItems = getValues('exchangeItems') || [];
      
      selectedProducts.forEach(product => {
          const policyId = selectedPricingPolicy || defaultSellingPolicy?.systemId;
          const price = (policyId && product.prices?.[policyId]) 
              ? product.prices[policyId]
              : (product.sellingPrice || Object.values(product.prices || {})[0] || 0);
          
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
          toast.error('Vui lòng chọn sản phẩm để trả hoặc đổi.');
          setIsSubmitting(false);
          return;
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
    
    // ✅ Validate payment total when finalAmount > 0
    if (finalAmount > 0 && values.payments && values.payments.length > 0) {
        const totalPaymentAmount = values.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const difference = Math.abs(totalPaymentAmount - finalAmount);
        if (difference > 0.01) {
            toast.error(`Tổng thanh toán (${formatCurrency(totalPaymentAmount)}) không khớp với số tiền cần thu (${formatCurrency(finalAmount)}). Vui lòng kiểm tra lại.`);
            setIsSubmitting(false);
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
        items: returnItems.map(({ total, returnableQuantity, orderedQuantity, originalUnitPrice, ...rest }) => ({
            ...rest, 
            totalValue: rest.returnQuantity * rest.unitPrice,
            note: rest.note?.trim() || undefined,
        })),
        totalReturnValue,
        isReceived: values.isReceived, // ✅ Pass isReceived flag to control inventory update
        exchangeItems: values.exchangeItems.map(({ total, ...rest }) => rest),
        subtotalNew: subtotalExchangeValue, // ✅ Use subtotal (before discount & shipping)
        shippingFeeNew: values.shippingFee || 0,
        grandTotalNew: totalExchangeValue, // ✅ Total after discount & shipping)
        finalAmount,
        payments: finalAmount > 0 ? values.payments : undefined,
        refunds: finalAmount < 0 ? values.refunds : undefined, // ✅ Use new refunds array
        creatorName,
        creatorId: creatorSystemId,
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
                const product = products.find(p => p.systemId === item.productSystemId);
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
            {/* Row 1: Thông tin phiếu + Thông tin bổ sung + Quy trình xử lý */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader><CardTitle className="text-h4">Thông tin phiếu</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-body-sm">
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
                <Card>
                     <CardHeader><CardTitle className="text-h4">Thông tin bổ sung</CardTitle></CardHeader>
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
                        <CardTitle className="text-h4">Sản phẩm trả</CardTitle>
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
                            <TableHeader><TableRow><TableHead className="w-12 text-center">STT</TableHead><TableHead>Sản phẩm</TableHead><TableHead className="w-40">Số lượng trả</TableHead><TableHead className="w-[180px] text-right">Đơn giá gốc</TableHead><TableHead className="w-[180px] text-right">Đơn giá trả</TableHead><TableHead className="w-[180px] text-right">Thành tiền</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <ReturnItemRow
                                        key={field.id}
                                        index={index}
                                        field={field}
                                        control={control}
                                        setValue={setValue}
                                        products={products}
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
                <CardHeader><CardTitle className="text-h4">Nhận hàng trả lại</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-body-sm text-muted-foreground">Hàng trả lại được nhập vào kho chi nhánh {branches.find(b => b.systemId === getValues('branchSystemId'))?.name || 'mặc định'}</p>
                    
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
                            <AlertDescription className="text-body-sm text-green-800">
                                <strong>Đã nhận và nhập kho:</strong> Tồn kho sẽ được cập nhật ngay lập tức khi tạo đơn trả hàng. Số lượng hàng trả sẽ được thêm vào kho chi nhánh đã chọn.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert className="border-amber-200 bg-amber-50">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-body-sm text-amber-800">
                                <strong>Chưa nhận hàng:</strong> Tồn kho sẽ KHÔNG thay đổi. Bạn cần xác nhận nhận hàng sau để cập nhật tồn kho.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Row 4: Đổi hàng */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-h4">Đổi hàng</CardTitle>
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
                                className="h-9 flex-shrink-0"
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
                                <SelectTrigger className="w-[180px] h-9 flex-shrink-0">
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
                            <p className="mt-4 text-body-sm">Chưa có sản phẩm nào trong đơn hàng</p>
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
                            fields={exchangeFields}
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
