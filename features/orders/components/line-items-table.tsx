import * as React from 'react';
import { useFormContext, useFieldArray, Controller, useWatch } from 'react-hook-form';
import Link from 'next/link';
import { AlertTriangle, X, Package, Eye, ChevronDown, ChevronRight, StickyNote, Pencil } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table';
import { NumberInput } from '../../../components/ui/number-input';
import { CurrencyInput } from '../../../components/ui/currency-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Textarea } from '../../../components/ui/textarea';
import { useProductsByIds } from '../../products/hooks/use-products';
import { useAllPricingPolicies } from '../../settings/pricing/hooks/use-all-pricing-policies';
import { Separator } from '../../../components/ui/separator';
import { ProductTableBottomToolbar } from './product-table-bottom-toolbar';
import { useImageStore } from '../../products/image-store';
import { useProductImage } from '../../products/components/product-image';
import { ImagePreviewDialog } from '../../../components/ui/image-preview-dialog';
import { LazyImage } from '../../../components/ui/lazy-image';
import { isComboProduct, calculateComboStock } from '../../products/combo-utils';
import { TaxSelector } from './tax-selector';
import type { Product } from '../../products/types';
import type { SystemId } from '@/lib/id-types';
import type { Control, FieldValues } from 'react-hook-form';


// Type for line item in the form
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
    tax: number;
    taxId?: string;
    total: number;
    note?: string;
    thumbnailImage?: string;
};

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

// Helper component để hiển thị ảnh combo child với server priority
const ComboChildImage = ({ 
    product, 
    productName, 
    onPreview 
}: { 
    product?: Product | null; 
    productName: string;
    onPreview: (image: string, title: string) => void;
}) => {
    const imageUrl = useProductImage(product?.systemId || '', product);
    
    if (imageUrl) {
        return (
            <div
                className="group relative w-8 h-7 rounded overflow-hidden border border-muted cursor-pointer"
                onClick={() => onPreview(imageUrl, product?.name || productName)}
            >
                <LazyImage
                    src={imageUrl}
                    alt={product?.name || productName}
                    className="w-full h-full object-cover transition-all group-hover:brightness-75"
                    loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-white drop-shadow-md" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-8 h-7 bg-muted rounded flex items-center justify-center">
            <Package className="h-4 w-4 text-muted-foreground" />
        </div>
    );
};

// Helper function to calculate line item total
const calculateLineTotalInRow = (quantity: number, unitPrice: number, discount: number, discountType: 'percentage' | 'fixed', tax: number): number => {
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

// ✅ Memoized row component để tránh re-render không cần thiết
const LineItemRow = React.memo(({
    item,
    index,
    branchSystemId,
    disabled,
    onRemove,
    control,
    onPreview,
    pricingPolicyId,
    onEditNote,
    allowNoteEdit,
    fieldName = 'lineItems',
    onTaxChange,
    productsMap,
    prefetchedPricingPolicies,
}: {
    item: FormLineItem;
    index: number;
    branchSystemId?: string;
    disabled: boolean;
    onRemove: (index: number) => void;
    control: Control<FieldValues>;
    onPreview: (image: string, title: string) => void;
    pricingPolicyId?: string;
    onEditNote: (index: number) => void;
    allowNoteEdit?: boolean;
    fieldName?: string;
    onTaxChange: (index: number, taxId: string, rate: number) => void;
    productsMap: Map<string, Product>;
    // ⚡ OPTIMIZED: Optional prefetched data
    prefetchedPricingPolicies?: Array<{ systemId: string; name: string; type: string; isDefault: boolean }>;
}) => {
    // ⚡ OPTIMIZED: Use prefetched data if available, otherwise fetch
    const { data: fetchedPolicies } = useAllPricingPolicies({ enabled: !prefetchedPricingPolicies });
    const pricingPolicies = prefetchedPricingPolicies ?? fetchedPolicies ?? [];
    const effectivePolicyId = React.useMemo(() => {
        if (pricingPolicyId) {
            return pricingPolicyId;
        }
        const defaultPolicy = pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault);
        return defaultPolicy?.systemId;
    }, [pricingPolicyId, pricingPolicies]);
    const [isComboExpanded, setIsComboExpanded] = React.useState(false);
    
    // ✅ Watch all fields needed for total calculation
    const quantity = useWatch({ control, name: `${fieldName}.${index}.quantity`, defaultValue: 1 });
    const unitPrice = useWatch({ control, name: `${fieldName}.${index}.unitPrice`, defaultValue: 0 });
    const discount = useWatch({ control, name: `${fieldName}.${index}.discount`, defaultValue: 0 });
    const discountType = useWatch({ control, name: `${fieldName}.${index}.discountType`, defaultValue: 'fixed' });
    const tax = useWatch({ control, name: `${fieldName}.${index}.tax`, defaultValue: 0 });
    const taxId = useWatch({ control, name: `${fieldName}.${index}.taxId`, defaultValue: '' }); // ✅ Watch taxId for TaxSelector
    const note = useWatch({ control, name: `${fieldName}.${index}.note`, defaultValue: '' });
    
    // ✅ Calculate total reactively when any field changes (display only, no setValue)
    const calculatedTotal = React.useMemo(() => {
        return calculateLineTotalInRow(quantity, unitPrice, discount, discountType as 'percentage' | 'fixed', tax);
    }, [quantity, unitPrice, discount, discountType, tax]);
    
    // Note: total is set by OrderCalculations component in order-form-page.tsx, not here
    
    // ✅ Use productsMap (fetched by useProductsByIds) instead of cache-only useProductFinder
    const product = React.useMemo(() => productsMap.get(item.productSystemId), [item.productSystemId, productsMap]);
    
    // Check if product is a combo and get combo items
    const isCombo = product?.type === 'combo';
    const comboItems = React.useMemo(() => {
        if (!isCombo || !product?.comboItems) return [];
        return product.comboItems.map(ci => {
            const childProduct = productsMap.get(ci.productSystemId);
            let price = 0;
            if (childProduct) {
                if (effectivePolicyId && childProduct.prices?.[effectivePolicyId]) {
                    price = childProduct.prices[effectivePolicyId] || 0;
                } else if (childProduct.prices && Object.keys(childProduct.prices).length > 0) {
                    const firstPolicy = Object.keys(childProduct.prices)[0];
                    price = childProduct.prices[firstPolicy] || 0;
                } else if (typeof childProduct.costPrice === 'number') {
                    price = childProduct.costPrice || 0;
                }
            }
            return {
                ...ci,
                product: childProduct,
                price,
            };
        });
    }, [isCombo, product?.comboItems, productsMap, effectivePolicyId]);

    // ✅ Get image from store
    const permanentImages = useImageStore(state => state.permanentImages[item.productSystemId]);
    const lastFetched = useImageStore(state => state.permanentMeta[item.productSystemId]?.lastFetched);

    const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
    const storeGallery = permanentImages?.gallery?.[0]?.url;
    
    // ✅ Ưu tiên ảnh từ server trước, sau đó mới đến product data, rồi đến item data
    const displayImage = React.useMemo(() => {
        // 1. Ảnh từ server (ưu tiên cao nhất)
        if (storeThumbnail) return storeThumbnail;
        if (storeGallery) return storeGallery;
        // 2. Ảnh từ product data (mock/seed)
        if (product) {
            const productImage = product.thumbnailImage || product.galleryImages?.[0] || product.images?.[0];
            if (productImage) return productImage;
        }
        // 3. ✅ Fallback to item.thumbnailImage (từ copy hoặc API)
        return item.thumbnailImage;
    }, [storeThumbnail, storeGallery, product, item]);

    // ✅ Fetch image if missing (uses batch queue)
    React.useEffect(() => {
        if (!displayImage && !lastFetched && item.productSystemId) {
            import('@/features/products/image-store').then(({ queueProductImageFetch }) => {
                queueProductImageFetch(item.productSystemId);
            });
        }
    }, [item.productSystemId, displayImage, lastFetched]);

    // ✅ Memoize stock calculation
    const stockInfo = React.useMemo(() => {
        if (!branchSystemId || !product) {
            return { stock: 0, isValid: false };
        }

        if (isComboProduct(product) && product.comboItems?.length) {
            const comboChildProducts = product.comboItems
                .map(ci => productsMap.get(ci.productSystemId))
                .filter((p): p is Product => !!p);
            const available = calculateComboStock(product.comboItems, comboChildProducts, branchSystemId as SystemId);
            return { stock: available, isValid: true };
        }
        
        if (!product.inventoryByBranch) {
            return { stock: 0, isValid: true };
        }
        
        const stock = product.inventoryByBranch[branchSystemId] || 0;
        return { stock, isValid: true };
    }, [branchSystemId, product, productsMap]);

    const productTypeLabel = React.useMemo(() => {
        if (!product) return '';
        switch (product.type) {
            case 'combo':
                return 'Combo';
            case 'service':
                return 'Dịch vụ';
            case 'digital':
                return 'Sản phẩm số';
            default:
                return 'Hàng hóa';
        }
    }, [product]);
    
    const isOutOfStock = stockInfo.isValid && quantity > stockInfo.stock;
    const isService = item.productId === 'DỊCH-VỤ';
    const isPercentage = discountType === 'percentage';
    
    return (
        <>
            <TableRow className={isCombo ? 'bg-muted/30' : ''}>
                <TableCell className="text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-1">
                        {isCombo && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0"
                                onClick={() => setIsComboExpanded(!isComboExpanded)}
                            >
                                {isComboExpanded ? (
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
                    {displayImage ? (
                        <div
                            className="group relative w-10 h-9 rounded overflow-hidden border border-muted cursor-pointer"
                            onClick={() => onPreview(displayImage, item.productName)}
                        >
                            <LazyImage
                                src={displayImage}
                                alt={item.productName}
                                className="w-full h-full object-cover transition-all group-hover:brightness-75"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-4 h-4 text-white drop-shadow-md" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-10 h-9 bg-muted rounded flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                    )}
                </TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">
                                {item.productName}
                            </span>
                            {isCombo && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
                                    COMBO
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground group/info">
                                <span>{productTypeLabel}</span>
                                <span>-</span>
                                <Link href={`/products/${item.productSystemId}`}
                                    className="text-primary hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* ✅ Use product.id (business ID) if available, fallback to item.productId */}
                                    {product?.id || item.productId}
                                </Link>
                                {note ? (
                                    <>
                                        <span className="text-amber-600">
                                            <StickyNote className="h-3 w-3 inline mr-0.5" />
                                            <span className="italic">{note}</span>
                                        </span>
                                        {(!disabled || allowNoteEdit) && (
                                            <button
                                                type="button"
                                                onClick={() => onEditNote(index)}
                                                className="opacity-0 group-hover/info:opacity-100 transition-opacity p-0.5 hover:bg-muted rounded"
                                            >
                                                <Pencil className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    (!disabled || allowNoteEdit) && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEditNote(index)}
                                            className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground ml-1 opacity-0 group-hover/info:opacity-100 transition-opacity"
                                        >
                                            Thêm ghi chú
                                        </Button>
                                    )
                                )}
                            </div>
                            {!isService && isOutOfStock && (
                                <div className="flex items-center gap-1 text-destructive">
                                    <AlertTriangle className="h-3 w-3" />
                                    <span>Không đủ</span>
                                </div>
                            )}
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Controller
                        control={control}
                        name={`${fieldName}.${index}.quantity`}
                        render={({ field }) => (
                            <NumberInput
                                value={field.value}
                                onChange={field.onChange}
                                min={1}
                                className="h-9"
                                format={false}
                                disabled={disabled}
                            />
                        )}
                    />
                </TableCell>
                <TableCell>
                    <Controller
                        control={control}
                        name={`${fieldName}.${index}.unitPrice`}
                        render={({ field }) => (
                            <CurrencyInput
                                value={field.value}
                                onChange={field.onChange}
                                className="h-9"
                                disabled={disabled}
                            />
                        )}
                    />
                </TableCell>
                <TableCell>
                    <TaxSelector
                        value={taxId || ''}
                        onChange={(newTaxId, rate) => onTaxChange(index, newTaxId, rate)}
                        disabled={disabled}
                    />
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-1">
                        <Controller
                            control={control}
                            name={`${fieldName}.${index}.discountType`}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                                    <SelectTrigger className="h-9 w-17.5">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed">d</SelectItem>
                                        <SelectItem value="percentage">%</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {isPercentage ? (
                            <div className="relative w-full">
                                <Controller
                                    control={control}
                                    name={`${fieldName}.${index}.discount`}
                                    render={({ field }) => (
                                        <NumberInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            min={0}
                                            max={100}
                                            className="h-9"
                                            disabled={disabled}
                                            format={false}
                                        />
                                    )}
                                />
                                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none z-10">
                                    %
                                </span>
                            </div>
                        ) : (
                            <Controller
                                control={control}
                                name={`${fieldName}.${index}.discount`}
                                render={({ field }) => (
                                    <CurrencyInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="h-9"
                                        disabled={disabled}
                                    />
                                )}
                            />
                        )}
                    </div>
                </TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(calculatedTotal)}</TableCell>
                <TableCell>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(index)}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4 text-destructive" />
                    </Button>
                </TableCell>
            </TableRow>

            {/* Combo items expanded view */}
            {isCombo && isComboExpanded && comboItems.length > 0 && (
                <>
                    {comboItems.map((comboItem, ciIndex) => {
                        return (
                        <TableRow key={`combo-${index}-${ciIndex}`} className="bg-muted/30">
                            <TableCell className="text-center text-muted-foreground pl-8">
                                <span className="text-muted-foreground/50">+</span>
                            </TableCell>
                            <TableCell>
                                <ComboChildImage 
                                    product={comboItem.product}
                                    productName={item.productName}
                                    onPreview={onPreview}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-sm text-muted-foreground">
                                        {comboItem.product?.name || 'Sản phẩm không tồn tại'}
                                    </p>
                                    {comboItem.product && (
                                        <Link href={`/products/${comboItem.product.systemId}`}
                                            className="text-xs text-primary hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {comboItem.product.id}
                                        </Link>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">{comboItem.quantity * quantity}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">{formatCurrency(comboItem.price)}</span>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">
                                {formatCurrency(comboItem.price * comboItem.quantity * quantity)}
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    );
                    })}
                </>
            )}
        </>
    );
});

LineItemRow.displayName = 'LineItemRow';

export const LineItemsTable = ({ disabled, onAddService, onApplyPromotion, fields: parentFields, remove: parentRemove, pricingPolicyId, allowNoteEdit, fieldName = 'lineItems', prefetchedPricingPolicies }: { 
    disabled: boolean; 
    onAddService?: () => void;
    onApplyPromotion?: () => void;
    fields: FormLineItem[];
    remove: (index: number) => void;
    pricingPolicyId?: string;
    allowNoteEdit?: boolean;
    fieldName?: string;
    // ⚡ OPTIMIZED: Optional prefetched data to avoid duplicate API calls
    prefetchedPricingPolicies?: Array<{ systemId: string; name: string; type: string; isDefault: boolean }>;
}) => {
    const { control, setValue, getValues } = useFormContext();
    
    const fields = parentFields;
    const remove = parentRemove;
    
    const { fields: serviceFeeFields, remove: removeServiceFee } = useFieldArray({
        control,
        name: "serviceFees",
    });
    
    // ✅ Batch-fetch only the products in the current form (NOT all products)
    const lineItemProductIds = React.useMemo(
        () => fields.map(f => f.productSystemId),
        [fields]
    );
    const { productsMap: baseProductsMap } = useProductsByIds(lineItemProductIds);
    
    // Collect combo children IDs for a second-pass fetch
    const comboChildIds = React.useMemo(() => {
        const ids: string[] = [];
        for (const [, product] of baseProductsMap) {
            if (product.type === 'combo' && product.comboItems?.length) {
                for (const ci of product.comboItems) {
                    ids.push(ci.productSystemId);
                }
            }
        }
        return ids;
    }, [baseProductsMap]);
    const { productsMap: comboChildMap } = useProductsByIds(comboChildIds);
    
    // Merge maps for a single lookup
    const productsMap = React.useMemo(() => {
        const merged = new Map(baseProductsMap);
        for (const [k, v] of comboChildMap) {
            if (!merged.has(k)) merged.set(k, v);
        }
        return merged;
    }, [baseProductsMap, comboChildMap]);
    
    // ✅ Đổi watch ở useWatch để tối ưu performance
    const branchSystemId = useWatch({ control, name: 'branchSystemId' });

    const [previewState, setPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
        open: false,
        image: '',
        title: ''
    });

    const handlePreview = React.useCallback((image: string, title: string) => {
        setPreviewState({ open: true, image, title });
    }, []);

    // State cho dialog ghi chú
    const [editingNoteIndex, setEditingNoteIndex] = React.useState<number | null>(null);
    const [tempNote, setTempNote] = React.useState('');

    const handleOpenNoteDialog = React.useCallback((index: number) => {
        const currentNote = getValues(`${fieldName}.${index}.note`) || '';
        setTempNote(currentNote);
        setEditingNoteIndex(index);
    }, [getValues, fieldName]);

    const handleSaveNote = React.useCallback(() => {
        if (editingNoteIndex !== null) {
            setValue(`${fieldName}.${editingNoteIndex}.note`, tempNote.trim(), { shouldDirty: true });
            setEditingNoteIndex(null);
            setTempNote('');
        }
    }, [editingNoteIndex, tempNote, setValue, fieldName]);

    // Handle tax change
    const handleTaxChange = React.useCallback((index: number, taxId: string, rate: number) => {
        setValue(`${fieldName}.${index}.taxId`, taxId, { shouldDirty: true });
        setValue(`${fieldName}.${index}.tax`, rate, { shouldDirty: true });
    }, [setValue, fieldName]);

    return (
        <div className="border border-border rounded-md overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12.5 text-center">STT</TableHead>
                        <TableHead className="w-15">Ảnh</TableHead>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead className="w-35">Số lượng</TableHead>
                        <TableHead className="w-50">Đơn giá</TableHead>
                        <TableHead className="w-35">Thuế</TableHead>
                        <TableHead className="w-50">Chiết khấu</TableHead>
                        <TableHead className="w-30 text-right">Thành tiền</TableHead>
                        <TableHead className="w-12.5"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* ✅ Dùng LineItemRow component đã được memoized */}
                    {fields.map((item, index) => (
                        <LineItemRow
                            key={item.id}
                            item={item}
                            index={index}
                            {...(branchSystemId ? { branchSystemId } : {})}
                            disabled={disabled}
                            onRemove={remove}
                            control={control}
                            onPreview={handlePreview}
                            onEditNote={handleOpenNoteDialog}
                            onTaxChange={handleTaxChange}
                            {...(typeof pricingPolicyId === 'string' ? { pricingPolicyId } : {})}
                            allowNoteEdit={allowNoteEdit}
                            fieldName={fieldName}
                            productsMap={productsMap}
                            prefetchedPricingPolicies={prefetchedPricingPolicies}
                        />
                    ))}
                    
                    {serviceFeeFields.length > 0 && (
                        <>
                            <TableRow>
                                <TableCell colSpan={8} className="p-0">
                                    <Separator />
                                </TableCell>
                            </TableRow>
                            {serviceFeeFields.map((fee, index) => {
                                const serviceFee = fee as unknown as { id: string; name: string; amount: number };
                                return (
                                <TableRow key={fee.id} className="bg-orange-50/50">
                                    <TableCell className="text-center text-muted-foreground">{fields.length + index + 1}</TableCell>
                                    <TableCell colSpan={5}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-orange-700">[Phí dịch vụ]</span>
                                            <span className="font-medium">{serviceFee.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-orange-700">
                                        {formatCurrency(serviceFee.amount)}
                                    </TableCell>
                                    <TableCell>
                                        {!disabled && (
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => removeServiceFee(index)}
                                            >
                                                <X className="h-4 w-4 text-destructive"/>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                            })}
                        </>
                    )}
                </TableBody>
            </Table>
            <ProductTableBottomToolbar disabled={disabled} onAddService={onAddService} onApplyPromotion={onApplyPromotion} />
            
            <ImagePreviewDialog 
                open={previewState.open} 
                onOpenChange={(open) => setPreviewState(prev => ({ ...prev, open }))} 
                images={[previewState.image]} 
                title={previewState.title}
            />

            {/* Dialog ghi chú cho sản phẩm */}
            <Dialog open={editingNoteIndex !== null} onOpenChange={(open) => !open && setEditingNoteIndex(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ghi chú sản phẩm</DialogTitle>
                        <DialogDescription>
                            {editingNoteIndex !== null && fields[editingNoteIndex] && (
                                <span>Ghi chú cho: {fields[editingNoteIndex].productName}</span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Nhập ghi chú cho sản phẩm..."
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingNoteIndex(null)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSaveNote}>
                            Lưu ghi chú
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
