import * as React from 'react';
import Link from 'next/link';
import { Package, Eye, ChevronDown, ChevronRight, StickyNote } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../ui/table';
import { Button } from '../ui/button';
import { OptimizedImage } from '../ui/optimized-image';
import { useProductsByIds } from '../../features/products/hooks/use-products';
import { useProductTypeFinder } from '../../features/settings/inventory/hooks/use-all-product-types';
import { useTaxFinder } from '../../features/settings/taxes/hooks/use-all-taxes';
import { ImagePreviewDialog } from '../ui/image-preview-dialog';
import type { Product } from '../../features/products/types';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

// Fallback labels for product types
const productTypeFallbackLabels: Record<string, string> = {
    physical: 'Hàng hóa',
    single: 'Hàng hóa',
    service: 'Dịch vụ',
    digital: 'Sản phẩm số',
    combo: 'Combo',
};

// Component hiển thị ảnh sản phẩm với preview
const ProductThumbnailCell = ({ 
    productSystemId: _productSystemId, 
    product,
    productName, 
    size = 'md',
    onPreview,
    itemThumbnailImage, // ✅ Fallback từ item khi product cache miss
}: { 
    productSystemId: string; 
    product?: { thumbnailImage?: string; imageUrl?: string; galleryImages?: string[]; images?: string[]; name?: string } | null;
    productName: string;
    size?: 'sm' | 'md';
    onPreview?: (image: string, title: string) => void;
    itemThumbnailImage?: string;
}) => {
    // ✅ Dùng trực tiếp thumbnailImage từ product data (đã lookup từ findProductById)
    // Fallback to itemThumbnailImage if product not found in cache
    const imageUrl = product?.thumbnailImage || product?.imageUrl || product?.galleryImages?.[0] || product?.images?.[0] || itemThumbnailImage;
    
    const sizeClasses = size === 'sm' 
        ? 'w-10 h-9' 
        : 'w-12 h-10';
    const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-4 w-4';
    
    if (imageUrl) {
        const imgContent = (
            <>
                <OptimizedImage src={imageUrl} alt={productName} className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75" width={48} height={40} />
                {onPreview && (
                    <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover/thumbnail:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                )}
            </>
        );
        if (onPreview) {
            return (
                <button
                    type="button"
                    className={`group/thumbnail relative ${sizeClasses} rounded border overflow-hidden bg-muted cursor-pointer`}
                    onClick={() => onPreview(imageUrl, productName)}
                >
                    {imgContent}
                </button>
            );
        }
        return (
            <div className={`group/thumbnail relative ${sizeClasses} rounded border overflow-hidden bg-muted`}>
                {imgContent}
            </div>
        );
    }
    
    return (
        <div className={`${sizeClasses} bg-muted rounded flex items-center justify-center`}>
            <Package className={`${iconSize} text-muted-foreground`} />
        </div>
    );
};

export type LineItem = {
    productSystemId: string;
    productId: string;
    productName: string;
    quantity?: number;
    returnQuantity?: number; // For return items
    unitPrice: number;
    discount?: number;
    discountType?: 'fixed' | 'percentage' | 'percent';
    total?: number;
    totalValue?: number; // For return items
    note?: string;
    thumbnailImage?: string; // ✅ Direct image URL from API (for cases where product cache miss)
    // Tax fields
    tax?: number; // Tax rate in percentage
    taxId?: string; // Tax systemId for reference
    taxAmount?: number; // Calculated tax amount
};

export type ReadOnlyProductsTableProps = {
    /** Line items to display */
    lineItems: LineItem[];
    /** Show storage location column */
    showStorageLocation?: boolean;
    /** Show discount column */
    showDiscount?: boolean;
    /** Show unit column */
    showUnit?: boolean;
    /** Show tax column (for purchase orders) */
    showTax?: boolean;
    /** Custom function to get storage location name */
    getStorageLocationName?: (product: Product | undefined) => string;
    /** Footer summary data */
    summary?: {
        subtotal?: number;
        discount?: number;
        shippingFee?: number;
        grandTotal?: number;
        tax?: number; // Total tax amount
    };
    /** Custom footer label */
    grandTotalLabel?: string;
    /** Custom footer total label for first row */
    footerTotalLabel?: string;
    /** Custom header for quantity column */
    quantityHeader?: string;
    /** Custom header for unit price column */
    unitPriceHeader?: string;
    /** Custom header for discount column */
    discountHeader?: string;
    /** Pre-fetched products map — when provided, skips internal useProductsByIds call */
    externalProductsMap?: Map<string, Product>;
};

export function ReadOnlyProductsTable({
    lineItems,
    showStorageLocation = true,
    showDiscount = true,
    showUnit = true,
    showTax = false,
    getStorageLocationName,
    summary,
    grandTotalLabel = 'Khách phải trả',
    footerTotalLabel = 'Tổng cộng',
    quantityHeader = 'Số lượng',
    unitPriceHeader = 'Đơn giá',
    discountHeader = 'Chiết khấu',
    externalProductsMap,
}: ReadOnlyProductsTableProps) {
    // Skip internal fetch when parent provides productsMap (avoids duplicate API calls)
    const productIds = React.useMemo(
        () => externalProductsMap ? [] : lineItems.map(li => li.productSystemId),
        [lineItems, externalProductsMap]
    );
    const { productsMap: internalProductsMap } = useProductsByIds(productIds);
    const productsMap = externalProductsMap ?? internalProductsMap;
    const findProductById = React.useCallback(
        (id: string | undefined) => id ? productsMap.get(id) : undefined,
        [productsMap]
    );
    const { findById: findProductTypeById } = useProductTypeFinder();
    const { findById: findTaxById } = useTaxFinder({ enabled: showTax });
    
    const [expandedCombos, setExpandedCombos] = React.useState<Record<string, boolean>>({});
    const [previewState, setPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
        open: false, image: '', title: ''
    });

    const toggleComboRow = React.useCallback((key: string) => {
        setExpandedCombos(prev => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const handlePreview = React.useCallback((image: string, title: string) => {
        setPreviewState({ open: true, image, title });
    }, []);

    // Function to get tax name from taxId
    const getTaxName = React.useCallback((taxId?: string) => {
        if (!taxId) return undefined;
        const tax = findTaxById(taxId);
        return tax?.name;
    }, [findTaxById]);

    // Function to get product type label (same as order-detail-page)
    const getProductTypeLabel = React.useCallback((productSystemId: string) => {
        const product = findProductById(productSystemId);
        if (!product) return '---';

        if (product.productTypeSystemId) {
            const productType = findProductTypeById(product.productTypeSystemId);
            if (productType?.name) {
                return productType.name;
            }
        }

        if (product.type && productTypeFallbackLabels[product.type]) {
            return productTypeFallbackLabels[product.type];
        }

        return 'Hàng hóa';
    }, [findProductById, findProductTypeById]);

    const totalQuantity = lineItems.reduce((sum, item) => sum + (item.quantity ?? item.returnQuantity ?? 0), 0);

    // Calculate column count for colSpan
    let colCount = 5; // STT, Ảnh, Tên SP, Số lượng, Thành tiền
    if (showUnit) colCount++;
    if (showStorageLocation) colCount++;
    if (showDiscount) colCount += 2; // Đơn giá + Chiết khấu
    else colCount++; // Chỉ Đơn giá
    if (showTax) colCount++; // Tax column

    // Shared line item calculation helper
    const getLineItemCalc = React.useCallback((item: LineItem) => {
        const itemQuantity = item.quantity ?? item.returnQuantity ?? 0;
        const isPercentDiscount = item.discountType === 'percentage' || item.discountType === 'percent';
        let discountValue = 0;
        if (item.discount && item.discount > 0) {
            discountValue = isPercentDiscount
                ? item.unitPrice * itemQuantity * (item.discount / 100)
                : item.discount;
        }
        const taxAmount = item.taxAmount ?? (item.tax ? (item.unitPrice * itemQuantity - discountValue) * (item.tax / 100) : 0);
        const lineTotal = item.total ?? item.totalValue ?? ((item.unitPrice * itemQuantity - discountValue) + taxAmount);
        return { itemQuantity, discountValue, isPercentDiscount, taxAmount, lineTotal };
    }, []);

    return (
        <>
            {/* ─── Mobile Card View ─── */}
            <div className="md:hidden space-y-0 border rounded-md divide-y">
                {lineItems.map((item, index) => {
                    const product = findProductById(item.productSystemId);
                    const { itemQuantity, lineTotal } = getLineItemCalc(item);
                    const isCombo = !!(product?.type === 'combo' && product.comboItems?.length);
                    const comboKey = `${item.productSystemId}-${index}`;
                    const isComboExpanded = !!expandedCombos[comboKey];
                    const comboItems = isCombo
                        ? (product?.comboItems ?? []).map((ci) => ({
                              ...ci, product: findProductById(ci.productSystemId),
                          }))
                        : [];

                    return (
                        <div key={`mobile-${item.productSystemId}-${index}`} className="p-3 space-y-2">
                            <div className="flex items-start gap-3">
                                <ProductThumbnailCell
                                    productSystemId={item.productSystemId}
                                    product={product}
                                    productName={item.productName}
                                    onPreview={handlePreview}
                                    itemThumbnailImage={item.thumbnailImage}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium line-clamp-2">{item.productName}</p>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 flex-wrap">
                                                <Link href={`/products/${item.productSystemId}`} className="text-primary hover:underline">
                                                    {product?.id || item.productId}
                                                </Link>
                                                <span>-</span>
                                                <span>{getProductTypeLabel(item.productSystemId)}</span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold tabular-nums shrink-0">
                                            {formatCurrency(lineTotal)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                        <span>{formatCurrency(item.unitPrice)}</span>
                                        <span>×</span>
                                        <span>{itemQuantity}</span>
                                    </div>
                                    {item.note && (
                                        <p className="text-xs text-amber-600 mt-1">
                                            <StickyNote className="h-3 w-3 inline mr-0.5" />
                                            <span className="italic">{item.note}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Combo toggle */}
                            {isCombo && (
                                <Button type="button" variant="ghost" size="sm" className="h-6 text-xs px-2 -ml-1" onClick={() => toggleComboRow(comboKey)}>
                                    {isComboExpanded ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronRight className="h-3 w-3 mr-1" />}
                                    {comboItems.length} sản phẩm
                                </Button>
                            )}
                            {isCombo && isComboExpanded && comboItems.map((ci, childIdx) => (
                                <div key={`mobile-combo-${ci.productSystemId}-${childIdx}`} className="flex items-center gap-2 pl-6 py-1 bg-muted/30 rounded">
                                    {ci.product ? (
                                        <ProductThumbnailCell productSystemId={ci.product.systemId} product={ci.product} productName={ci.product.name || ''} size="sm" onPreview={handlePreview} />
                                    ) : (
                                        <div className="w-10 h-9 bg-muted rounded flex items-center justify-center"><Package className="h-4 w-4 text-muted-foreground" /></div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm truncate">{ci.product?.name || 'Sản phẩm không tồn tại'}</p>
                                        <p className="text-xs text-muted-foreground">SL: {ci.quantity * itemQuantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
                {/* Mobile footer: total */}
                <div className="p-3 bg-muted/30">
                    <div className="flex items-center justify-between text-sm font-bold">
                        <span>{footerTotalLabel}</span>
                        <span>{formatCurrency(summary?.subtotal ?? lineItems.reduce((sum, item) => sum + (getLineItemCalc(item).lineTotal), 0))}</span>
                    </div>
                </div>
            </div>

            {/* ─── Desktop Table View ─── */}
            <div className="hidden md:block border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12 text-center">STT</TableHead>
                            <TableHead className="w-16">Ảnh</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            {showUnit && <TableHead>Đơn vị</TableHead>}
                            <TableHead className="text-center">{quantityHeader}</TableHead>
                            {showStorageLocation && <TableHead>Điểm lưu kho</TableHead>}
                            <TableHead className="text-right">{unitPriceHeader}</TableHead>
                            {showTax && <TableHead className="text-right">Thuế</TableHead>}
                            {showDiscount && <TableHead className="text-right">{discountHeader}</TableHead>}
                            <TableHead className="text-right">Thành tiền</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lineItems.map((item, index) => {
                            const product = findProductById(item.productSystemId);
                            const storageLocationName = getStorageLocationName?.(product) || '---';
                            const { itemQuantity, discountValue, isPercentDiscount, taxAmount, lineTotal } = getLineItemCalc(item);
                            
                            // Check if combo
                            const isCombo = !!(product?.type === 'combo' && product.comboItems?.length);
                            const comboKey = `${item.productSystemId}-${index}`;
                            const isComboExpanded = !!expandedCombos[comboKey];
                            const comboItems = isCombo
                                ? (product?.comboItems ?? []).map((comboItem) => {
                                    const childProduct = findProductById(comboItem.productSystemId);
                                    return { ...comboItem, product: childProduct };
                                })
                                : [];

                            return (
                                <React.Fragment key={`${item.productSystemId}-${index}`}>
                                    <TableRow className={isCombo ? 'bg-muted/30' : ''}>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                {isCombo && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => toggleComboRow(comboKey)}
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
                                            <ProductThumbnailCell 
                                                productSystemId={item.productSystemId}
                                                product={product}
                                                productName={item.productName}
                                                onPreview={handlePreview}
                                                itemThumbnailImage={item.thumbnailImage}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                        {item.productName}
                                                    </span>
                                                    {isCombo && (
                                                        <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                                                            COMBO
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
                                                    <Link href={`/products/${item.productSystemId}`} 
                                                        className="text-primary hover:underline"
                                                    >
                                                        {product?.id || item.productId}
                                                    </Link>
                                                    <span>-</span>
                                                    <span>{getProductTypeLabel(item.productSystemId)}</span>
                                                    {item.note && (
                                                        <span className="text-amber-600">
                                                            <StickyNote className="h-3 w-3 inline mr-0.5" />
                                                            <span className="italic">{item.note}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        {showUnit && <TableCell>sản phẩm</TableCell>}
                                        <TableCell className="text-center">{itemQuantity}</TableCell>
                                        {showStorageLocation && <TableCell>{storageLocationName}</TableCell>}
                                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                        {showTax && (
                                            <TableCell className="text-right">
                                                {item.tax ? (
                                                    <div className="flex flex-col items-end">
                                                        <span>{getTaxName(item.taxId) || `${item.tax}%`}</span>
                                                        <span className="text-xs text-muted-foreground">{formatCurrency(taxAmount)}</span>
                                                    </div>
                                                ) : '---'}
                                            </TableCell>
                                        )}
                                        {showDiscount && (
                                            <TableCell className="text-right">
                                                {item.discount && item.discount > 0 ? (
                                                    <div className="flex flex-col items-end">
                                                        <span>{isPercentDiscount ? `${item.discount}%` : formatCurrency(item.discount)}</span>
                                                        {isPercentDiscount && <span className="text-xs text-muted-foreground">{formatCurrency(discountValue)}</span>}
                                                    </div>
                                                ) : '---'}
                                            </TableCell>
                                        )}
                                        <TableCell className="text-right font-medium">{formatCurrency(lineTotal)}</TableCell>
                                    </TableRow>

                                    {/* Combo child items */}
                                    {isCombo && isComboExpanded && comboItems.length > 0 && (
                                        comboItems.map((comboItem, childIndex: number) => {
                                            const totalChildQuantity = comboItem.quantity * itemQuantity;
                                            const childStorageLocationName = getStorageLocationName?.(comboItem.product) || '---';
                                            return (
                                                <TableRow
                                                    key={`${comboKey}-child-${comboItem.productSystemId}-${childIndex}`}
                                                    className="bg-muted/40"
                                                >
                                                    <TableCell className="text-center text-muted-foreground pl-8">
                                                        <span className="text-muted-foreground/60">└</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {comboItem.product?.systemId ? (
                                                            <ProductThumbnailCell 
                                                                productSystemId={comboItem.product.systemId}
                                                                product={comboItem.product}
                                                                productName={comboItem.product?.name || item.productName}
                                                                size="sm"
                                                                onPreview={handlePreview}
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-9 bg-muted rounded flex items-center justify-center">
                                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-0.5 text-sm">
                                                            <span className="font-medium text-foreground">
                                                                {comboItem.product?.name || 'Sản phẩm không tồn tại'}
                                                            </span>
                                                            {comboItem.product && (
                                                                <>
                                                                    <div className="text-xs text-muted-foreground">{getProductTypeLabel(comboItem.product.systemId)}</div>
                                                                    <Link href={`/products/${comboItem.product.systemId}`}
                                                                        className="text-xs text-muted-foreground hover:text-primary hover:underline"
                                                                    >
                                                                        {comboItem.product.id}
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    {showUnit && <TableCell className="text-muted-foreground">sản phẩm</TableCell>}
                                                    <TableCell className="text-center text-muted-foreground">{totalChildQuantity}</TableCell>
                                                    {showStorageLocation && <TableCell className="text-muted-foreground">{childStorageLocationName}</TableCell>}
                                                    <TableCell className="text-right text-muted-foreground">---</TableCell>
                                                    {showTax && <TableCell className="text-right text-muted-foreground">---</TableCell>}
                                                    {showDiscount && <TableCell className="text-right text-muted-foreground">---</TableCell>}
                                                    <TableCell className="text-right text-muted-foreground">---</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={showUnit ? 4 : 3} className="text-right font-bold">{footerTotalLabel}</TableCell>
                            <TableCell className="text-center font-bold">{totalQuantity}</TableCell>
                            <TableCell colSpan={colCount - (showUnit ? 5 : 4)} className="text-right font-bold">
                                {formatCurrency(summary?.subtotal ?? lineItems.reduce((sum, item) => {
                                    const qty = item.quantity ?? item.returnQuantity ?? 0;
                                    let discountValue = 0;
                                    if (item.discount && item.discount > 0) {
                                        discountValue = item.discountType === 'fixed' ? item.discount : item.unitPrice * (item.discount / 100);
                                    }
                                    return sum + (item.total ?? item.totalValue ?? ((item.unitPrice - discountValue) * qty));
                                }, 0))}
                            </TableCell>
                        </TableRow>
                        {summary && (
                            <>
                                <TableRow>
                                    <TableCell colSpan={colCount - 1} className="text-right">Tổng tiền</TableCell>
                                    <TableCell className="text-right">{formatCurrency(summary.subtotal)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={colCount - 1} className="text-right">Chiết khấu</TableCell>
                                    <TableCell className="text-right">{formatCurrency(summary.discount ?? 0)}</TableCell>
                                </TableRow>
                                {showTax && summary.tax !== undefined && (
                                    <TableRow>
                                        <TableCell colSpan={colCount - 1} className="text-right">Thuế</TableCell>
                                        <TableCell className="text-right">{formatCurrency(summary.tax)}</TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell colSpan={colCount - 1} className="text-right">Phí giao hàng</TableCell>
                                    <TableCell className="text-right">{formatCurrency(summary.shippingFee ?? 0)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={colCount - 1} className="text-right font-bold text-base">{grandTotalLabel}</TableCell>
                                    <TableCell className="text-right font-bold text-base">{formatCurrency(summary.grandTotal)}</TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableFooter>
                </Table>
            </div>

            <ImagePreviewDialog 
                open={previewState.open} 
                onOpenChange={(open) => setPreviewState(prev => ({ ...prev, open }))} 
                images={[previewState.image]} 
                title={previewState.title}
            />
        </>
    );
}

// Export ProductThumbnailCell for use in other components
export { ProductThumbnailCell };
