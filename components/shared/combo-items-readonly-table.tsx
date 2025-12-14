/**
 * ComboItemsReadOnlyTable - Hiển thị danh sách sản phẩm trong Combo (Read-only)
 * ═══════════════════════════════════════════════════════════════════════════════
 * Dùng cho: Trang chi tiết sản phẩm combo
 * 
 * Features:
 * - Hiển thị ảnh SP với preview
 * - Hiển thị Loại SP, Mã SP
 * - Giá vốn, Đơn giá, Thành tiền
 * - Tồn kho có thể bán
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../ui/table.tsx';
import { useProductStore } from '../../features/products/store.ts';
import { useProductTypeStore } from '../../features/settings/inventory/product-type-store.ts';
import { usePricingPolicyStore } from '../../features/settings/pricing/store.ts';
import { useBranchStore } from '../../features/settings/branches/store.ts';
import { useProductImage } from '../../features/products/components/product-image.tsx';
import { ImagePreviewDialog } from '../ui/image-preview-dialog.tsx';
import type { Product } from '../../features/products/types.ts';
import type { SystemId } from '@/lib/id-types.ts';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

// ═══════════════════════════════════════════════════════════════
// PRODUCT THUMBNAIL COMPONENT
// ═══════════════════════════════════════════════════════════════

const ProductThumbnailCell = ({ 
    productSystemId, 
    product,
    productName, 
    onPreview 
}: { 
    productSystemId: string; 
    product?: Product | null;
    productName: string;
    onPreview?: (image: string, title: string) => void;
}) => {
    const imageUrl = useProductImage(productSystemId, product);
    
    if (imageUrl) {
        return (
            <div
                className={`group/thumbnail relative w-10 h-10 rounded border overflow-hidden bg-muted ${onPreview ? 'cursor-pointer' : ''}`}
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
        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
            <Package className="h-4 w-4 text-muted-foreground" />
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface ComboItem {
    productSystemId: string;
    quantity: number;
}

export interface ComboItemsReadOnlyTableProps {
    /** Danh sách sản phẩm trong combo */
    comboItems: ComboItem[];
    /** Hiển thị cột Giá vốn (mặc định: true) */
    showCostPrice?: boolean;
    /** Hiển thị cột Có thể bán (mặc định: true) */
    showStock?: boolean;
    /** Callback khi click preview ảnh */
    onImagePreview?: (imageUrl: string, title: string) => void;
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function ComboItemsReadOnlyTable({
    comboItems,
    showCostPrice = true,
    showStock = true,
    onImagePreview,
}: ComboItemsReadOnlyTableProps) {
    const { findById: findProductById, data: allProducts } = useProductStore();
    const { findById: findProductTypeById } = useProductTypeStore();
    const { data: pricingPolicies } = usePricingPolicyStore();
    const { data: branches } = useBranchStore();
    
    const [previewState, setPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
        open: false, image: '', title: ''
    });

    // Get default selling policy
    const defaultPricingPolicy = React.useMemo(() => {
        return pricingPolicies.find(p => p.isDefault && p.type === 'Bán hàng');
    }, [pricingPolicies]);

    // Handle preview
    const handlePreview = React.useCallback((image: string, title: string) => {
        if (onImagePreview) {
            onImagePreview(image, title);
        } else {
            setPreviewState({ open: true, image, title });
        }
    }, [onImagePreview]);

    // Get product type name
    const getProductTypeName = React.useCallback((product?: Product | null) => {
        if (!product?.productTypeSystemId) return 'Hàng hóa';
        const productType = findProductTypeById(product.productTypeSystemId as SystemId);
        return productType?.name || 'Hàng hóa';
    }, [findProductTypeById]);

    // Get unit price from pricing policy
    const getUnitPrice = React.useCallback((product?: Product | null) => {
        if (!product) return 0;
        if (defaultPricingPolicy && product.prices?.[defaultPricingPolicy.systemId]) {
            return product.prices[defaultPricingPolicy.systemId];
        }
        // Fallback to first available price
        const prices = Object.values(product.prices || {});
        if (prices.length > 0) return prices[0];
        return product.costPrice || 0;
    }, [defaultPricingPolicy]);

    // Get available stock (sellable) across all branches
    const getAvailableStock = React.useCallback((product?: Product | null) => {
        if (!product) return 0;
        const inventoryByBranch = product.inventoryByBranch || {};
        const committedByBranch = product.committedByBranch || {};
        
        let totalSellable = 0;
        for (const branch of branches) {
            const onHand = inventoryByBranch[branch.systemId as SystemId] || 0;
            const committed = committedByBranch[branch.systemId as SystemId] || 0;
            totalSellable += Math.max(0, onHand - committed);
        }
        return totalSellable;
    }, [branches]);

    // Process combo items with product details
    const itemsWithDetails = React.useMemo(() => {
        return comboItems.map(item => {
            const product = findProductById(item.productSystemId);
            const unitPrice = getUnitPrice(product);
            const costPrice = product?.costPrice || 0;
            const availableStock = getAvailableStock(product);
            
            return {
                ...item,
                product,
                unitPrice,
                costPrice,
                lineTotal: unitPrice * item.quantity,
                lineCostTotal: costPrice * item.quantity,
                availableStock,
            };
        });
    }, [comboItems, findProductById, getUnitPrice, getAvailableStock]);

    // Calculate totals
    const totalOriginalPrice = itemsWithDetails.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalCostPrice = itemsWithDetails.reduce((sum, item) => sum + item.lineCostTotal, 0);

    // Calculate column count
    let colCount = 4; // Sản phẩm, SL, Đơn giá, Thành tiền
    if (showCostPrice) colCount++;
    if (showStock) colCount++;

    return (
        <>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sản phẩm</TableHead>
                            <TableHead className="text-center w-16">SL</TableHead>
                            {showCostPrice && <TableHead className="text-right w-28">Giá vốn</TableHead>}
                            <TableHead className="text-right w-28">Đơn giá</TableHead>
                            <TableHead className="text-right w-28">Thành tiền</TableHead>
                            {showStock && <TableHead className="text-right w-24">Có thể bán</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {itemsWithDetails.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={colCount} className="text-center py-8 text-muted-foreground">
                                    Chưa có sản phẩm nào trong combo
                                </TableCell>
                            </TableRow>
                        ) : (
                            itemsWithDetails.map((item, index) => (
                                <TableRow key={item.productSystemId || index}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <ProductThumbnailCell
                                                productSystemId={item.productSystemId}
                                                product={item.product}
                                                productName={item.product?.name || 'Sản phẩm'}
                                                onPreview={handlePreview}
                                            />
                                            {item.product ? (
                                                <div className="min-w-0">
                                                    <Link 
                                                        to={`/products/${item.product.systemId}`}
                                                        className="font-medium text-primary hover:underline block truncate"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.product.id} · {getProductTypeName(item.product)}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">Sản phẩm không tồn tại</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                                    {showCostPrice && (
                                        <TableCell className="text-right text-muted-foreground">
                                            {formatCurrency(item.costPrice)}
                                        </TableCell>
                                    )}
                                    <TableCell className="text-right">
                                        {formatCurrency(item.unitPrice)}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatCurrency(item.lineTotal)}
                                    </TableCell>
                                    {showStock && (
                                        <TableCell className="text-right">
                                            <span className={item.availableStock <= 0 ? 'text-destructive font-medium' : ''}>
                                                {item.availableStock}
                                            </span>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={showCostPrice ? 4 : 3} className="text-right font-medium">
                                Tổng giá gốc:
                            </TableCell>
                            <TableCell className="text-right font-bold">
                                {formatCurrency(totalOriginalPrice)}
                            </TableCell>
                            {showStock && <TableCell />}
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>

            {/* Built-in Image Preview Dialog */}
            {!onImagePreview && previewState.open && (
                <ImagePreviewDialog
                    images={[previewState.image]}
                    open={previewState.open}
                    onOpenChange={(open) => !open && setPreviewState({ open: false, image: '', title: '' })}
                    title={previewState.title}
                />
            )}
        </>
    );
}
