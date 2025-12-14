/**
 * ComboItemsEditTable - Bảng chỉnh sửa danh sách sản phẩm trong Combo
 * ═══════════════════════════════════════════════════════════════════════════════
 * Dùng cho: Trang tạo/sửa sản phẩm combo
 * 
 * Features:
 * - Hiển thị ảnh SP với preview
 * - Hiển thị Loại SP, Mã SP
 * - Input +/- để chỉnh số lượng
 * - Giá vốn, Đơn giá, Thành tiền
 * - Tồn kho có thể bán
 * - Nút xóa sản phẩm
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Control, useWatch } from 'react-hook-form';
import { Package, Eye, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../ui/table.tsx';
import { Button } from '../ui/button.tsx';
import { FormControl, FormField, FormItem } from '../ui/form.tsx';
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
// QUANTITY INPUT COMPONENT
// ═══════════════════════════════════════════════════════════════

function QuantityInput({ 
    value, 
    onChange, 
    min = 1,
    disabled = false,
}: { 
    value: number; 
    onChange: (value: number) => void; 
    min?: number;
    disabled?: boolean;
}) {
    return (
        <div className="inline-flex h-9 items-center rounded-md border border-input bg-transparent shadow-sm">
            <input
                type="number"
                value={value}
                onChange={(e) => {
                    const newValue = parseInt(e.target.value) || min;
                    onChange(Math.max(min, newValue));
                }}
                disabled={disabled}
                className="h-full w-12 bg-transparent px-2 text-center text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="flex h-full flex-col border-l border-input">
                <button
                    type="button"
                    className="flex h-[calc(50%-0.5px)] w-6 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => onChange(value + 1)}
                    disabled={disabled}
                >
                    <ChevronUp className="h-3 w-3" />
                </button>
                <div className="h-px w-full bg-input" />
                <button
                    type="button"
                    className="flex h-[calc(50%-0.5px)] w-6 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => onChange(Math.max(min, value - 1))}
                    disabled={disabled || value <= min}
                >
                    <ChevronDown className="h-3 w-3" />
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface ComboItemField {
    id: string;
    productSystemId: string;
    quantity: number;
}

export interface ComboItemsEditTableProps {
    /** react-hook-form fields từ useFieldArray */
    fields: ComboItemField[];
    /** Hàm xóa item từ useFieldArray */
    remove: (index: number) => void;
    /** react-hook-form control */
    control: Control<any>;
    /** Field name prefix (mặc định: 'comboItems') */
    fieldName?: string;
    /** Disabled state (khi đang submit) */
    disabled?: boolean;
    /** Callback khi click preview ảnh */
    onImagePreview?: (imageUrl: string, title: string) => void;
}

// ═══════════════════════════════════════════════════════════════
// TABLE ROW COMPONENT
// ═══════════════════════════════════════════════════════════════

const ComboItemRow = React.memo(({
    field,
    index,
    control,
    fieldName,
    disabled,
    onRemove,
    onPreview,
    getProductTypeName,
    getUnitPrice,
    getAvailableStock,
}: {
    field: ComboItemField;
    index: number;
    control: Control<any>;
    fieldName: string;
    disabled: boolean;
    onRemove: (index: number) => void;
    onPreview: (image: string, title: string) => void;
    getProductTypeName: (product?: Product | null) => string;
    getUnitPrice: (product?: Product | null) => number;
    getAvailableStock: (product?: Product | null) => number;
}) => {
    const { findById: findProductById } = useProductStore();
    
    // Watch quantity for this row
    const quantity = useWatch({ control, name: `${fieldName}.${index}.quantity`, defaultValue: 1 });
    
    const product = React.useMemo(() => findProductById(field.productSystemId), [field.productSystemId, findProductById]);
    const unitPrice = getUnitPrice(product);
    const costPrice = product?.costPrice || 0;
    const lineTotal = unitPrice * quantity;
    const availableStock = getAvailableStock(product);
    const isLowStock = availableStock <= 0;

    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-3">
                    <ProductThumbnailCell
                        productSystemId={field.productSystemId}
                        product={product}
                        productName={product?.name || 'Sản phẩm'}
                        onPreview={onPreview}
                    />
                    {product ? (
                        <div className="min-w-0">
                            <Link 
                                to={`/products/${product.systemId}`}
                                className="font-medium text-primary hover:underline block truncate"
                            >
                                {product.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                                <Link 
                                    to={`/products/${product.systemId}`}
                                    className="hover:text-primary hover:underline"
                                >
                                    {product.id}
                                </Link>
                                {' · '}{getProductTypeName(product)}
                            </p>
                        </div>
                    ) : (
                        <span className="text-muted-foreground italic">Sản phẩm không tồn tại</span>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-center">
                <div className="flex justify-center">
                    <FormField
                        control={control}
                        name={`${fieldName}.${index}.quantity`}
                        render={({ field: formField }) => (
                            <FormItem className="space-y-0">
                                <FormControl>
                                    <QuantityInput
                                        value={formField.value ?? 1}
                                        onChange={formField.onChange}
                                        disabled={disabled}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
                {formatCurrency(costPrice)}
            </TableCell>
            <TableCell className="text-right">
                {formatCurrency(unitPrice)}
            </TableCell>
            <TableCell className="text-right font-medium">
                {formatCurrency(lineTotal)}
            </TableCell>
            <TableCell className="text-right">
                <span className={isLowStock ? 'text-destructive font-medium' : ''}>
                    {availableStock}
                </span>
            </TableCell>
            <TableCell className="text-center">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemove(index)}
                    disabled={disabled}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
});

ComboItemRow.displayName = 'ComboItemRow';

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function ComboItemsEditTable({
    fields,
    remove,
    control,
    fieldName = 'comboItems',
    disabled = false,
    onImagePreview,
}: ComboItemsEditTableProps) {
    const { findById: findProductById } = useProductStore();
    const { findById: findProductTypeById } = useProductTypeStore();
    const { data: pricingPolicies } = usePricingPolicyStore();
    const { data: branches } = useBranchStore();
    
    const [previewState, setPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
        open: false, image: '', title: ''
    });

    // Watch all combo items for total calculation
    const comboItems = useWatch({ control, name: fieldName }) || [];

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

    // Calculate total
    const totalOriginalPrice = React.useMemo(() => {
        return comboItems.reduce((sum: number, item: any) => {
            const product = findProductById(item?.productSystemId);
            const unitPrice = getUnitPrice(product);
            const quantity = item?.quantity || 1;
            return sum + (unitPrice * quantity);
        }, 0);
    }, [comboItems, findProductById, getUnitPrice]);

    return (
        <>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[35%]">Sản phẩm</TableHead>
                            <TableHead className="w-[12%] text-center">Số lượng</TableHead>
                            <TableHead className="w-[12%] text-right">Giá vốn</TableHead>
                            <TableHead className="w-[12%] text-right">Đơn giá</TableHead>
                            <TableHead className="w-[12%] text-right">Thành tiền</TableHead>
                            <TableHead className="w-[10%] text-right">Có thể bán</TableHead>
                            <TableHead className="w-[7%]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    Chưa có sản phẩm nào trong combo
                                </TableCell>
                            </TableRow>
                        ) : (
                            fields.map((field, index) => (
                                <ComboItemRow
                                    key={field.id}
                                    field={field}
                                    index={index}
                                    control={control}
                                    fieldName={fieldName}
                                    disabled={disabled}
                                    onRemove={remove}
                                    onPreview={handlePreview}
                                    getProductTypeName={getProductTypeName}
                                    getUnitPrice={getUnitPrice}
                                    getAvailableStock={getAvailableStock}
                                />
                            ))
                        )}
                    </TableBody>
                    {fields.length > 0 && (
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4} className="text-right font-medium">
                                    Tổng giá gốc:
                                </TableCell>
                                <TableCell className="text-right font-bold">
                                    {formatCurrency(totalOriginalPrice)}
                                </TableCell>
                                <TableCell colSpan={2} />
                            </TableRow>
                        </TableFooter>
                    )}
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
