import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useFormContext, useFieldArray, Controller, useWatch } from 'react-hook-form';
import Link from 'next/link';
import { AlertTriangle, X, Package, Eye, ChevronDown, ChevronRight, StickyNote, Pencil, Trash2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table';
import { NumberInput } from '../../../components/ui/number-input';
import { CurrencyInput } from '../../../components/ui/currency-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { MobileCard, MobileCardBody, MobileCardFooter, MobileCardHeader } from '../../../components/mobile/mobile-card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../../components/ui/sheet';
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
export type FormLineItem = {
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
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onPreview(imageUrl, product?.name || productName); }}
            >
                <LazyImage
                    src={imageUrl}
                    alt={product?.name || productName}
                    className="w-full h-full object-cover transition-all group-hover:brightness-75"
                    loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
const LineItemRow = memo(({
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
    const pricingPolicies = useMemo(() => prefetchedPricingPolicies ?? fetchedPolicies ?? [], [prefetchedPricingPolicies, fetchedPolicies]);
    const effectivePolicyId = useMemo(() => {
        if (pricingPolicyId) {
            return pricingPolicyId;
        }
        const defaultPolicy = pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault);
        return defaultPolicy?.systemId;
    }, [pricingPolicyId, pricingPolicies]);
    const [isComboExpanded, setIsComboExpanded] = useState(false);
    
    // ✅ Watch all fields needed for total calculation
    const quantity = useWatch({ control, name: `${fieldName}.${index}.quantity`, defaultValue: 1 });
    const unitPrice = useWatch({ control, name: `${fieldName}.${index}.unitPrice`, defaultValue: 0 });
    const discount = useWatch({ control, name: `${fieldName}.${index}.discount`, defaultValue: 0 });
    const discountType = useWatch({ control, name: `${fieldName}.${index}.discountType`, defaultValue: 'fixed' });
    const tax = useWatch({ control, name: `${fieldName}.${index}.tax`, defaultValue: 0 });
    const taxId = useWatch({ control, name: `${fieldName}.${index}.taxId`, defaultValue: '' }); // ✅ Watch taxId for TaxSelector
    const note = useWatch({ control, name: `${fieldName}.${index}.note`, defaultValue: '' });
    
    // ✅ Calculate total reactively when any field changes (display only, no setValue)
    const calculatedTotal = useMemo(() => {
        return calculateLineTotalInRow(quantity, unitPrice, discount, discountType as 'percentage' | 'fixed', tax);
    }, [quantity, unitPrice, discount, discountType, tax]);
    
    // Note: total is set by OrderCalculations component in order-form-page.tsx, not here
    
    // ✅ Use productsMap (fetched by useProductsByIds) instead of cache-only useProductFinder
    const product = useMemo(() => productsMap.get(item.productSystemId), [item.productSystemId, productsMap]);
    
    // Check if product is a combo and get combo items
    const isCombo = product?.type === 'combo';
    const comboItems = useMemo(() => {
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
    const displayImage = useMemo(() => {
        // 1. Ảnh từ server (ưu tiên cao nhất)
        if (storeThumbnail) return storeThumbnail;
        if (storeGallery) return storeGallery;
        // 2. Ảnh từ product data (mock/seed)
        if (product) {
            const productImage = product.thumbnailImage || product.imageUrl || product.galleryImages?.[0] || product.images?.[0];
            if (productImage) return productImage;
        }
        // 3. ✅ Fallback to item.thumbnailImage (từ copy hoặc API)
        return item.thumbnailImage;
    }, [storeThumbnail, storeGallery, product, item]);

    // ✅ Fetch image if missing (uses batch queue)
    useEffect(() => {
        if (!displayImage && !lastFetched && item.productSystemId) {
            import('@/features/products/image-store').then(({ queueProductImageFetch }) => {
                queueProductImageFetch(item.productSystemId);
            });
        }
    }, [item.productSystemId, displayImage, lastFetched]);

    // ✅ Memoize stock calculation
    const stockInfo = useMemo(() => {
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
        
        const stock = product.inventoryByBranch[branchSystemId as SystemId] || 0;
        return { stock, isValid: true };
    }, [branchSystemId, product, productsMap]);

    const productTypeLabel = useMemo(() => {
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
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') onPreview(displayImage, item.productName); }}
                        >
                            <LazyImage
                                src={displayImage}
                                alt={item.productName}
                                className="w-full h-full object-cover transition-all group-hover:brightness-75"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
                                                className="md:opacity-0 md:group-hover/info:opacity-100 transition-opacity p-0.5 hover:bg-muted rounded"
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
                                            className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground ml-1 md:opacity-0 md:group-hover/info:opacity-100 transition-opacity"
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
                                    <SelectTrigger className="w-17.5">
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

// =============================================================================
// Mobile: LineItemMobileCard — card tương đương 1 row desktop
// Quick-edit inline: Số lượng, Đơn giá (90% use case)
// Advanced fields (tax, chiết khấu, ghi chú) → bottom Sheet
// =============================================================================
const LineItemMobileCard = memo(({
    item,
    index,
    branchSystemId,
    disabled,
    onRemove,
    control,
    onPreview,
    pricingPolicyId,
    onOpenAdvanced,
    fieldName = 'lineItems',
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
    onOpenAdvanced: (index: number) => void;
    fieldName?: string;
    productsMap: Map<string, Product>;
    prefetchedPricingPolicies?: Array<{ systemId: string; name: string; type: string; isDefault: boolean }>;
}) => {
    const { data: fetchedPolicies } = useAllPricingPolicies({ enabled: !prefetchedPricingPolicies });
    const pricingPolicies = useMemo(() => prefetchedPricingPolicies ?? fetchedPolicies ?? [], [prefetchedPricingPolicies, fetchedPolicies]);
    const effectivePolicyId = useMemo(() => {
        if (pricingPolicyId) return pricingPolicyId;
        const defaultPolicy = pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault);
        return defaultPolicy?.systemId;
    }, [pricingPolicyId, pricingPolicies]);
    const [isComboExpanded, setIsComboExpanded] = useState(false);

    const quantity = useWatch({ control, name: `${fieldName}.${index}.quantity`, defaultValue: 1 });
    const unitPrice = useWatch({ control, name: `${fieldName}.${index}.unitPrice`, defaultValue: 0 });
    const discount = useWatch({ control, name: `${fieldName}.${index}.discount`, defaultValue: 0 });
    const discountType = useWatch({ control, name: `${fieldName}.${index}.discountType`, defaultValue: 'fixed' });
    const tax = useWatch({ control, name: `${fieldName}.${index}.tax`, defaultValue: 0 });
    const note = useWatch({ control, name: `${fieldName}.${index}.note`, defaultValue: '' });

    const calculatedTotal = useMemo(
        () => calculateLineTotalInRow(quantity, unitPrice, discount, discountType as 'percentage' | 'fixed', tax),
        [quantity, unitPrice, discount, discountType, tax],
    );

    const product = useMemo(() => productsMap.get(item.productSystemId), [item.productSystemId, productsMap]);
    const isCombo = product?.type === 'combo';
    const comboItems = useMemo(() => {
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
            return { ...ci, product: childProduct, price };
        });
    }, [isCombo, product?.comboItems, productsMap, effectivePolicyId]);

    const permanentImages = useImageStore(state => state.permanentImages[item.productSystemId]);
    const lastFetched = useImageStore(state => state.permanentMeta[item.productSystemId]?.lastFetched);
    const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
    const storeGallery = permanentImages?.gallery?.[0]?.url;

    const displayImage = useMemo(() => {
        if (storeThumbnail) return storeThumbnail;
        if (storeGallery) return storeGallery;
        if (product) {
            const productImage = product.thumbnailImage || product.imageUrl || product.galleryImages?.[0] || product.images?.[0];
            if (productImage) return productImage;
        }
        return item.thumbnailImage;
    }, [storeThumbnail, storeGallery, product, item]);

    useEffect(() => {
        if (!displayImage && !lastFetched && item.productSystemId) {
            import('@/features/products/image-store').then(({ queueProductImageFetch }) => {
                queueProductImageFetch(item.productSystemId);
            });
        }
    }, [item.productSystemId, displayImage, lastFetched]);

    const stockInfo = useMemo(() => {
        if (!branchSystemId || !product) return { stock: 0, isValid: false };
        if (isComboProduct(product) && product.comboItems?.length) {
            const comboChildProducts = product.comboItems
                .map(ci => productsMap.get(ci.productSystemId))
                .filter((p): p is Product => !!p);
            const available = calculateComboStock(product.comboItems, comboChildProducts, branchSystemId as SystemId);
            return { stock: available, isValid: true };
        }
        if (!product.inventoryByBranch) return { stock: 0, isValid: true };
        const stock = product.inventoryByBranch[branchSystemId as SystemId] || 0;
        return { stock, isValid: true };
    }, [branchSystemId, product, productsMap]);

    const isOutOfStock = stockInfo.isValid && quantity > stockInfo.stock;
    const isService = item.productId === 'DỊCH-VỤ';
    const hasAdvanced = (Number(discount) || 0) > 0 || (Number(tax) || 0) > 0 || !!note;

    return (
        <MobileCard inert emphasis={!isService && isOutOfStock ? 'destructive' : 'none'}>
            <MobileCardHeader className="items-start justify-between gap-3">
                {displayImage ? (
                    <div
                        className="group relative h-12 w-12 shrink-0 rounded-md overflow-hidden border border-muted cursor-pointer"
                        onClick={() => onPreview(displayImage, item.productName)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') onPreview(displayImage, item.productName); }}
                    >
                        <LazyImage
                            src={displayImage}
                            alt={item.productName}
                            className="w-full h-full object-cover transition-all group-hover:brightness-75"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Eye className="w-4 h-4 text-white drop-shadow-md" />
                        </div>
                    </div>
                ) : (
                    <div className="h-12 w-12 shrink-0 bg-muted rounded-md flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-semibold leading-tight line-clamp-2 wrap-break-word">
                            {item.productName}
                        </span>
                        {isCombo && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-medium shrink-0">
                                COMBO
                            </span>
                        )}
                    </div>
                    <Link
                        href={`/products/${item.productSystemId}`}
                        className="text-xs text-primary hover:underline inline-block mt-0.5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {product?.id || item.productId}
                    </Link>
                    {!isService && isOutOfStock && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            <span>Không đủ tồn (còn {stockInfo.stock})</span>
                        </div>
                    )}
                </div>

                {!disabled && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8"
                        onClick={() => onRemove(index)}
                        aria-label="Xoá sản phẩm"
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                )}
            </MobileCardHeader>

            <MobileCardBody>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="text-xs text-muted-foreground">Số lượng</Label>
                        <Controller
                            control={control}
                            name={`${fieldName}.${index}.quantity`}
                            render={({ field }) => (
                                <NumberInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    min={1}
                                    className="h-10 mt-1 text-sm"
                                    format={false}
                                    disabled={disabled}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Đơn giá</Label>
                        <Controller
                            control={control}
                            name={`${fieldName}.${index}.unitPrice`}
                            render={({ field }) => (
                                <CurrencyInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="h-10 mt-1 text-sm"
                                    disabled={disabled}
                                />
                            )}
                        />
                    </div>

                    {/* Advanced summary chips (hiện khi có chiết khấu/thuế/ghi chú) */}
                    {hasAdvanced && (
                        <div className="col-span-2 flex flex-wrap gap-1.5 pt-1">
                            {(Number(tax) || 0) > 0 && (
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                    Thuế {tax}%
                                </span>
                            )}
                            {(Number(discount) || 0) > 0 && (
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                    CK {discountType === 'percentage' ? `${discount}%` : formatCurrency(Number(discount))}
                                </span>
                            )}
                            {note && (
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 inline-flex items-center gap-1 max-w-full">
                                    <StickyNote className="h-3 w-3 shrink-0" />
                                    <span className="truncate">{note}</span>
                                </span>
                            )}
                        </div>
                    )}

                    <div className="col-span-2 flex items-center justify-between border-t border-border/50 pt-2 mt-1">
                        <span className="text-sm text-muted-foreground">Thành tiền</span>
                        <span className="text-base font-bold text-primary">{formatCurrency(calculatedTotal)}</span>
                    </div>

                    {isCombo && comboItems.length > 0 && (
                        <div className="col-span-2">
                            <button
                                type="button"
                                className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground py-1.5"
                                onClick={() => setIsComboExpanded(v => !v)}
                            >
                                <span className="inline-flex items-center gap-1">
                                    {isComboExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                    Thành phần combo ({comboItems.length})
                                </span>
                            </button>
                            {isComboExpanded && (
                                <div className="space-y-1.5 pl-4 border-l border-border/50 mt-1">
                                    {comboItems.map((ci, ciIdx) => (
                                        <div
                                            key={`combo-m-${index}-${ciIdx}`}
                                            className="flex items-center justify-between gap-2 text-xs"
                                        >
                                            <div className="min-w-0 flex-1 truncate text-muted-foreground">
                                                {ci.product?.name || 'Sản phẩm không tồn tại'}
                                            </div>
                                            <div className="shrink-0 text-muted-foreground tabular-nums">
                                                × {ci.quantity * (Number(quantity) || 0)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </MobileCardBody>

            {!disabled && (
                <MobileCardFooter noBorder={false}>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full h-10"
                        onClick={() => onOpenAdvanced(index)}
                    >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                        Sửa chi tiết
                    </Button>
                </MobileCardFooter>
            )}
        </MobileCard>
    );
});

LineItemMobileCard.displayName = 'LineItemMobileCard';

// =============================================================================
// Mobile: LineItemAdvancedSheet — bottom sheet sửa tax / discount / note.
// Binds cùng react-hook-form (Controller) → submit dùng chung state với desktop.
// =============================================================================
const LineItemAdvancedSheet = ({
    open,
    onOpenChange,
    index,
    fieldName,
    control,
    disabled,
    onTaxChange,
    productName,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    index: number | null;
    fieldName: string;
    control: Control<FieldValues>;
    disabled: boolean;
    onTaxChange: (index: number, taxId: string, rate: number) => void;
    productName: string;
}) => {
    const taxId = useWatch({
        control,
        name: index !== null ? `${fieldName}.${index}.taxId` : `${fieldName}.0.taxId`,
        defaultValue: '',
    });
    const discountType = useWatch({
        control,
        name: index !== null ? `${fieldName}.${index}.discountType` : `${fieldName}.0.discountType`,
        defaultValue: 'fixed',
    });
    const isPercentage = discountType === 'percentage';

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[90vh] overflow-y-auto md:hidden">
                <SheetHeader>
                    <SheetTitle>Sửa chi tiết sản phẩm</SheetTitle>
                    {productName && (
                        <p className="text-sm text-muted-foreground text-left line-clamp-2">{productName}</p>
                    )}
                </SheetHeader>

                {index !== null && (
                    <div className="space-y-5 mt-5 pb-10">
                        <div>
                            <Label className="text-sm">Thuế</Label>
                            <div className="mt-1.5">
                                <TaxSelector
                                    value={taxId || ''}
                                    onChange={(newTaxId, rate) => onTaxChange(index, newTaxId, rate)}
                                    disabled={disabled}
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm">Chiết khấu</Label>
                            <div className="mt-1.5 flex items-center gap-2">
                                <Controller
                                    control={control}
                                    name={`${fieldName}.${index}.discountType`}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={disabled}
                                        >
                                            <SelectTrigger className="h-10 w-20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fixed">đ</SelectItem>
                                                <SelectItem value="percentage">%</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {isPercentage ? (
                                    <div className="relative flex-1">
                                        <Controller
                                            control={control}
                                            name={`${fieldName}.${index}.discount`}
                                            render={({ field }) => (
                                                <NumberInput
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    min={0}
                                                    max={100}
                                                    className="h-10"
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
                                    <div className="flex-1">
                                        <Controller
                                            control={control}
                                            name={`${fieldName}.${index}.discount`}
                                            render={({ field }) => (
                                                <CurrencyInput
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="h-10"
                                                    disabled={disabled}
                                                />
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm">Ghi chú</Label>
                            <Controller
                                control={control}
                                name={`${fieldName}.${index}.note`}
                                render={({ field }) => (
                                    <Textarea
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        placeholder="Ghi chú cho sản phẩm..."
                                        rows={3}
                                        disabled={disabled}
                                        className="mt-1.5"
                                    />
                                )}
                            />
                        </div>

                        <Button
                            type="button"
                            className="w-full h-11"
                            onClick={() => onOpenChange(false)}
                        >
                            Xong
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

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
    const lineItemProductIds = useMemo(
        () => fields.map(f => f.productSystemId),
        [fields]
    );
    const { productsMap: baseProductsMap } = useProductsByIds(lineItemProductIds);
    
    // Collect combo children IDs for a second-pass fetch
    const comboChildIds = useMemo(() => {
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
    const productsMap = useMemo(() => {
        const merged = new Map(baseProductsMap);
        for (const [k, v] of comboChildMap) {
            if (!merged.has(k)) merged.set(k, v);
        }
        return merged;
    }, [baseProductsMap, comboChildMap]);
    
    // ✅ Đổi watch ở useWatch để tối ưu performance
    const branchSystemId = useWatch({ control, name: 'branchSystemId' });

    const [previewState, setPreviewState] = useState<{ open: boolean; image: string; title: string }>({
        open: false,
        image: '',
        title: ''
    });

    const handlePreview = useCallback((image: string, title: string) => {
        setPreviewState({ open: true, image, title });
    }, []);

    // State cho dialog ghi chú
    const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
    const [tempNote, setTempNote] = useState('');

    const handleOpenNoteDialog = useCallback((index: number) => {
        const currentNote = getValues(`${fieldName}.${index}.note`) || '';
        setTempNote(currentNote);
        setEditingNoteIndex(index);
    }, [getValues, fieldName]);

    const handleSaveNote = useCallback(() => {
        if (editingNoteIndex !== null) {
            setValue(`${fieldName}.${editingNoteIndex}.note`, tempNote.trim(), { shouldDirty: true });
            setEditingNoteIndex(null);
            setTempNote('');
        }
    }, [editingNoteIndex, tempNote, setValue, fieldName]);

    // Handle tax change
    const handleTaxChange = useCallback((index: number, taxId: string, rate: number) => {
        setValue(`${fieldName}.${index}.taxId`, taxId, { shouldDirty: true });
        setValue(`${fieldName}.${index}.tax`, rate, { shouldDirty: true });
    }, [setValue, fieldName]);

    // ✅ Mobile-only: bottom Sheet cho advanced fields (tax / discount / note)
    const [advancedIdx, setAdvancedIdx] = useState<number | null>(null);
    const handleOpenAdvanced = useCallback((index: number) => {
        setAdvancedIdx(index);
    }, []);
    const handleCloseAdvanced = useCallback((open: boolean) => {
        if (!open) setAdvancedIdx(null);
    }, []);

    return (
        <div className="border border-border rounded-md">
            {/* ===== DESKTOP: Table editable nguyên trạng ===== */}
            <div className="hidden md:block overflow-x-auto">
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
            </div>

            {/* ===== MOBILE: MobileCard stack + inline quick-edit + Sheet advanced ===== */}
            <div className="md:hidden space-y-3">
                {fields.length === 0 && (
                    <div className="py-10 text-center text-sm text-muted-foreground border border-dashed border-border/50 rounded-lg">
                        Chưa có sản phẩm nào
                    </div>
                )}
                {fields.map((item, index) => (
                    <LineItemMobileCard
                        key={item.id}
                        item={item}
                        index={index}
                        {...(branchSystemId ? { branchSystemId } : {})}
                        disabled={disabled}
                        onRemove={remove}
                        control={control}
                        onPreview={handlePreview}
                        onOpenAdvanced={handleOpenAdvanced}
                        {...(typeof pricingPolicyId === 'string' ? { pricingPolicyId } : {})}
                        fieldName={fieldName}
                        productsMap={productsMap}
                        prefetchedPricingPolicies={prefetchedPricingPolicies}
                    />
                ))}

                {/* Service fees — mobile compact list */}
                {serviceFeeFields.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border/50">
                        {serviceFeeFields.map((fee, index) => {
                            const serviceFee = fee as unknown as { id: string; name: string; amount: number };
                            return (
                                <div
                                    key={fee.id}
                                    className="flex items-center justify-between gap-2 rounded-lg bg-orange-50/60 dark:bg-orange-950/30 p-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs text-orange-700 dark:text-orange-300 font-medium">[Phí dịch vụ]</div>
                                        <div className="text-sm font-medium truncate">{serviceFee.name}</div>
                                    </div>
                                    <div className="shrink-0 text-sm font-semibold text-orange-700 dark:text-orange-300 tabular-nums">
                                        {formatCurrency(serviceFee.amount)}
                                    </div>
                                    {!disabled && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0 h-8 w-8"
                                            onClick={() => removeServiceFee(index)}
                                        >
                                            <X className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <ProductTableBottomToolbar disabled={disabled} onAddService={onAddService} onApplyPromotion={onApplyPromotion} />

            {/* Mobile bottom sheet cho advanced edit (tax / CK / ghi chú) */}
            <LineItemAdvancedSheet
                open={advancedIdx !== null}
                onOpenChange={handleCloseAdvanced}
                index={advancedIdx}
                fieldName={fieldName}
                control={control}
                disabled={disabled}
                onTaxChange={handleTaxChange}
                productName={advancedIdx !== null && fields[advancedIdx] ? fields[advancedIdx].productName : ''}
            />

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
