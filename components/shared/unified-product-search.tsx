/**
 * UnifiedProductSearch - Component tìm kiếm sản phẩm dùng chung
 * ═══════════════════════════════════════════════════════════════
 * Features:
 * - Hiển thị ảnh sản phẩm (ưu tiên server images)
 * - Hiển thị Loại SP, ĐVT
 * - Hiển thị Tồn kho toàn hệ thống & Có thể bán
 * - Tooltip chi tiết tồn theo từng chi nhánh
 * - Action "Thêm sản phẩm mới" với quick form
 * - Hỗ trợ filter loại sản phẩm (exclude combo, service...)
 * ═══════════════════════════════════════════════════════════════
 */

import * as React from 'react';
import { Package, AlertTriangle, Plus, X, Info } from 'lucide-react';
import type { Product, ProductType as ProductTypeEnum } from '../../features/products/types.ts';
import { useProductStore } from '../../features/products/store.ts';
import { usePricingPolicyStore } from '../../features/settings/pricing/store.ts';
import { useBranchStore } from '../../features/settings/branches/store.ts';
import { useProductTypeStore } from '../../features/settings/inventory/product-type-store.ts';
import { useUnitStore } from '../../features/settings/units/store.ts';
import { useImageStore } from '../../features/products/image-store.ts';
import { FileUploadAPI } from '../../lib/file-upload-api.ts';
import { LazyImage } from '../ui/lazy-image.tsx';
import { VirtualizedCombobox, type ComboboxOption } from '../ui/virtualized-combobox.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog.tsx';
import { Button } from '../ui/button.tsx';
import { Input } from '../ui/input.tsx';
import { Label } from '../ui/label.tsx';
import { CurrencyInput } from '../ui/currency-input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip.tsx';
import { toast } from 'sonner';
import type { SystemId, BusinessId } from '@/lib/id-types.ts';
import { asBusinessId } from '@/lib/id-types.ts';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface UnifiedProductSearchProps {
    /** Callback khi chọn sản phẩm */
    onSelectProduct: (product: Product) => void;
    /** Danh sách ID sản phẩm đã chọn (để loại trừ) */
    excludeProductIds?: Set<string> | string[];
    /** Disabled state */
    disabled?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Search placeholder */
    searchPlaceholder?: string;
    /** Loại sản phẩm được phép chọn (mặc định: tất cả) */
    allowedTypes?: ProductTypeEnum[];
    /** Loại sản phẩm bị loại trừ */
    excludeTypes?: ProductTypeEnum[];
    /** Cho phép thêm sản phẩm mới */
    allowCreateNew?: boolean;
    /** Hiển thị giá vốn */
    showCostPrice?: boolean;
    /** Hiển thị giá bán */
    showSellingPrice?: boolean;
    /** Chi nhánh để hiển thị tồn kho (nếu muốn filter theo chi nhánh) */
    branchSystemId?: string;
    /** Custom filter function */
    customFilter?: (product: Product) => boolean;
}

interface BranchStockDetail {
    name: string;
    onHand: number;
    sellable: number;
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT THUMBNAIL COMPONENT
// ═══════════════════════════════════════════════════════════════

const ProductOptionThumbnail = React.memo(({ 
    productSystemId,
    productData 
}: { 
    productSystemId: string;
    productData?: Product;
}) => {
    const permanentImages = useImageStore(state => state.permanentImages[productSystemId]);
    const lastFetched = useImageStore(state => state.permanentMeta[productSystemId]?.lastFetched);
    const updatePermanentImages = useImageStore(state => state.updatePermanentImages);

    const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
    const storeGallery = permanentImages?.gallery?.[0]?.url;
    
    const displayImage = storeThumbnail
        || storeGallery
        || productData?.thumbnailImage
        || productData?.galleryImages?.[0]
        || productData?.images?.[0];

    React.useEffect(() => {
        if (!lastFetched && productSystemId) {
            FileUploadAPI.getProductFiles(productSystemId)
                .then(files => {
                    const mapFile = (f: any) => ({
                        id: f.id, sessionId: '', name: f.name, originalName: f.originalName,
                        slug: f.slug, filename: f.filename, size: f.size, type: f.type, url: f.url,
                        status: 'permanent' as const, uploadedAt: f.uploadedAt, metadata: f.metadata
                    });
                    updatePermanentImages(productSystemId, 'thumbnail', files.filter(f => f.documentName === 'thumbnail').map(mapFile));
                    updatePermanentImages(productSystemId, 'gallery', files.filter(f => f.documentName === 'gallery').map(mapFile));
                })
                .catch(() => {});
        }
    }, [productSystemId, lastFetched, updatePermanentImages]);

    if (displayImage) {
        return (
            <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-muted">
                <LazyImage src={displayImage} alt="" className="w-full h-full object-cover" />
            </div>
        );
    }
    return (
        <div className="w-10 h-10 flex-shrink-0 bg-muted rounded flex items-center justify-center">
            <Package className="h-5 w-5 text-muted-foreground" />
        </div>
    );
});

ProductOptionThumbnail.displayName = 'ProductOptionThumbnail';

// ═══════════════════════════════════════════════════════════════
// QUICK ADD PRODUCT DIALOG
// ═══════════════════════════════════════════════════════════════

interface QuickAddProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onProductCreated: (product: Product) => void;
}

function QuickAddProductDialog({ open, onOpenChange, onProductCreated }: QuickAddProductDialogProps) {
    const { add: addProduct, data: products } = useProductStore();
    const { data: productTypes, getActive: getActiveProductTypes } = useProductTypeStore();
    const { data: units } = useUnitStore();
    const { data: pricingPolicies } = usePricingPolicyStore();
    
    const [formData, setFormData] = React.useState({
        name: '',
        productTypeSystemId: '',
        unit: 'Chiếc',
        costPrice: 0,
        sellingPrice: 0,
        barcode: '',
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Get default pricing policy
    const defaultSellingPolicy = React.useMemo(() => {
        return pricingPolicies.find(p => p.isDefault && p.type === 'Bán hàng');
    }, [pricingPolicies]);

    // Generate next product ID
    const generateNextProductId = React.useCallback(() => {
        const existingIds = products.map(p => p.id).filter(id => id.startsWith('SP'));
        const numbers = existingIds.map(id => {
            const num = parseInt(id.replace('SP', ''), 10);
            return isNaN(num) ? 0 : num;
        });
        const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
        return `SP${String(maxNum + 1).padStart(6, '0')}`;
    }, [products]);

    // Reset form when dialog opens
    React.useEffect(() => {
        if (open) {
            const defaultType = getActiveProductTypes().find(t => t.isDefault);
            setFormData({
                name: '',
                productTypeSystemId: defaultType?.systemId || '',
                unit: 'Chiếc',
                costPrice: 0,
                sellingPrice: 0,
                barcode: '',
            });
        }
    }, [open, getActiveProductTypes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên sản phẩm');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Build prices object
            const prices: Record<string, number> = {};
            if (defaultSellingPolicy && formData.sellingPrice > 0) {
                prices[defaultSellingPolicy.systemId] = formData.sellingPrice;
            }
            
            const newProduct = addProduct({
                id: asBusinessId(generateNextProductId()),
                name: formData.name.trim(),
                type: 'physical',
                productTypeSystemId: formData.productTypeSystemId as SystemId || undefined,
                unit: formData.unit || 'Chiếc',
                costPrice: formData.costPrice,
                prices,
                barcode: formData.barcode || undefined,
                status: 'active',
                inventoryByBranch: {},
                committedByBranch: {},
                inTransitByBranch: {},
            });
            
            toast.success(`Đã tạo sản phẩm "${newProduct.name}"`);
            onProductCreated(newProduct);
            onOpenChange(false);
        } catch (error) {
            toast.error('Không thể tạo sản phẩm');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                    <DialogDescription>
                        Tạo nhanh sản phẩm với thông tin cơ bản. Bạn có thể bổ sung chi tiết sau.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tên sản phẩm */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên sản phẩm <span className="text-destructive">*</span></Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nhập tên sản phẩm..."
                            autoFocus
                        />
                    </div>
                    
                    {/* Row: Loại SP + ĐVT */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Loại sản phẩm</Label>
                            <Select
                                value={formData.productTypeSystemId}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, productTypeSystemId: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại SP" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getActiveProductTypes().map(type => (
                                        <SelectItem key={type.systemId} value={type.systemId}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Đơn vị tính</Label>
                            <Select
                                value={formData.unit}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn ĐVT" />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.filter(u => u.isActive).map(unit => (
                                        <SelectItem key={unit.systemId} value={unit.name}>
                                            {unit.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    {/* Row: Giá vốn + Giá bán */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Giá vốn</Label>
                            <CurrencyInput
                                value={formData.costPrice}
                                onChange={(value) => setFormData(prev => ({ ...prev, costPrice: value }))}
                                placeholder="0"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Giá bán {defaultSellingPolicy && `(${defaultSellingPolicy.name})`}</Label>
                            <CurrencyInput
                                value={formData.sellingPrice}
                                onChange={(value) => setFormData(prev => ({ ...prev, sellingPrice: value }))}
                                placeholder="0"
                            />
                        </div>
                    </div>
                    
                    {/* Barcode */}
                    <div className="space-y-2">
                        <Label>Mã vạch (tùy chọn)</Label>
                        <Input
                            value={formData.barcode}
                            onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                            placeholder="Nhập mã vạch..."
                        />
                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang tạo...' : 'Tạo sản phẩm'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ═══════════════════════════════════════════════════════════════
// STOCK TOOLTIP COMPONENT
// ═══════════════════════════════════════════════════════════════

function StockTooltip({ 
    branchDetails, 
    totalOnHand, 
    totalSellable,
    children 
}: { 
    branchDetails: BranchStockDetail[];
    totalOnHand: number;
    totalSellable: number;
    children: React.ReactNode;
}) {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side="left" className="p-3">
                    <div className="space-y-2">
                        {branchDetails.map((branch, idx) => (
                            <div key={idx} className="flex justify-between gap-4">
                                <span className="text-muted-foreground">{branch.name}:</span>
                                <span>Tồn: {branch.onHand} | Có thể bán: {branch.sellable}</span>
                            </div>
                        ))}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function UnifiedProductSearch({
    onSelectProduct,
    excludeProductIds = [],
    disabled = false,
    placeholder = 'Thêm sản phẩm (F3)',
    searchPlaceholder = 'Tìm kiếm theo tên, mã SKU, barcode...',
    allowedTypes,
    excludeTypes = [],
    allowCreateNew = true,
    showCostPrice = true,
    showSellingPrice = false,
    branchSystemId,
    customFilter,
}: UnifiedProductSearchProps) {
    const { data: allProducts, getActive } = useProductStore();
    const { data: pricingPolicies } = usePricingPolicyStore();
    const { data: branches } = useBranchStore();
    const { findById: findProductTypeById } = useProductTypeStore();
    
    const [selectedValue, setSelectedValue] = React.useState<ComboboxOption | null>(null);
    const [showQuickAdd, setShowQuickAdd] = React.useState(false);

    // Normalize excludeProductIds to Set
    const excludeSet = React.useMemo(() => {
        if (excludeProductIds instanceof Set) return excludeProductIds;
        return new Set(excludeProductIds);
    }, [excludeProductIds]);

    // Get default selling policy
    const defaultPricingPolicy = React.useMemo(() => {
        return pricingPolicies.find(p => p.isDefault && p.type === 'Bán hàng');
    }, [pricingPolicies]);

    // Filter products
    const availableProducts = React.useMemo(() => {
        return getActive().filter(p => {
            // Exclude already selected
            if (excludeSet.has(p.systemId)) return false;
            
            // Type filter
            if (allowedTypes && allowedTypes.length > 0) {
                if (!p.type || !allowedTypes.includes(p.type)) return false;
            }
            if (excludeTypes.length > 0 && p.type && excludeTypes.includes(p.type)) {
                return false;
            }
            
            // Custom filter
            if (customFilter && !customFilter(p)) return false;
            
            return true;
        });
    }, [allProducts, getActive, excludeSet, allowedTypes, excludeTypes, customFilter]);

    // Calculate stock helpers
    const getStockInfo = (product: Product) => {
        const inventoryByBranch = product.inventoryByBranch || {};
        const committedByBranch = product.committedByBranch || {};
        
        let totalOnHand = 0;
        let totalSellable = 0;
        const branchDetails: BranchStockDetail[] = [];
        
        for (const branch of branches) {
            const onHand = inventoryByBranch[branch.systemId as SystemId] || 0;
            const committed = committedByBranch[branch.systemId as SystemId] || 0;
            const sellable = Math.max(0, onHand - committed);
            
            totalOnHand += onHand;
            totalSellable += sellable;
            
            branchDetails.push({
                name: branch.name,
                onHand,
                sellable,
            });
        }
        
        return { totalOnHand, totalSellable, branchDetails };
    };

    // Get product type name
    const getProductTypeName = (productTypeSystemId?: string) => {
        if (!productTypeSystemId) return 'Không xác định';
        const productType = findProductTypeById(productTypeSystemId as SystemId);
        return productType?.name || 'Không xác định';
    };

    // Convert to ComboboxOption format
    const options: ComboboxOption[] = React.useMemo(() => {
        return availableProducts.map((p) => {
            const stockInfo = getStockInfo(p);
            const price = defaultPricingPolicy 
                ? p.prices?.[defaultPricingPolicy.systemId] 
                : (Object.values(p.prices || {})[0] || 0);
            
            return {
                value: p.systemId,
                label: p.name,
                subtitle: p.id,
                metadata: {
                    product: p,
                    price: price || 0,
                    costPrice: p.costPrice || 0,
                    totalOnHand: stockInfo.totalOnHand,
                    totalSellable: stockInfo.totalSellable,
                    branchDetails: stockInfo.branchDetails,
                    isLowStock: stockInfo.totalSellable <= 0,
                    productTypeName: getProductTypeName(p.productTypeSystemId),
                    unit: p.unit || 'Cái',
                }
            } as ComboboxOption;
        });
    }, [availableProducts, defaultPricingPolicy, branches, findProductTypeById]);

    const handleChange = (option: ComboboxOption | null) => {
        if (option) {
            const product = option.metadata?.product as Product;
            if (product) {
                onSelectProduct(product);
            }
        }
        setSelectedValue(null);
    };

    const handleProductCreated = (product: Product) => {
        onSelectProduct(product);
    };

    // Render option
    const renderOption = (option: ComboboxOption) => {
        const { 
            product, 
            costPrice, 
            price,
            totalOnHand, 
            totalSellable, 
            branchDetails,
            isLowStock,
            productTypeName,
            unit,
        } = option.metadata || {};
        
        const displayPrice = showSellingPrice ? price : costPrice;
        
        return (
            <div className="flex items-center gap-3 w-full py-1">
                <ProductOptionThumbnail 
                    productSystemId={option.value} 
                    productData={product}
                />
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{option.label}</p>
                    <p className="text-xs text-muted-foreground">
                        {option.subtitle} | {productTypeName} | ĐVT: {unit}
                    </p>
                </div>
                <div className="text-right flex-shrink-0 min-w-[140px]">
                    <p className="font-semibold">{formatCurrency(displayPrice)}</p>
                    <StockTooltip 
                        branchDetails={branchDetails || []}
                        totalOnHand={totalOnHand || 0}
                        totalSellable={totalSellable || 0}
                    >
                        <p className={`text-xs cursor-help inline-flex items-center gap-1 ${isLowStock ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {isLowStock && <AlertTriangle className="h-3 w-3" />}
                            Tồn: {totalOnHand || 0} | Bán: {totalSellable || 0}
                            <Info className="h-3 w-3 opacity-60" />
                        </p>
                    </StockTooltip>
                </div>
            </div>
        );
    };

    // Custom header with "Add new product" action
    const renderHeader = allowCreateNew ? () => (
        <button
            type="button"
            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-primary hover:bg-accent transition-colors border-b"
            onClick={() => setShowQuickAdd(true)}
        >
            <Plus className="h-4 w-4" />
            <span>Thêm mới sản phẩm</span>
        </button>
    ) : undefined;

    return (
        <>
            <VirtualizedCombobox
                options={options}
                value={selectedValue}
                onChange={handleChange}
                placeholder={placeholder}
                searchPlaceholder={searchPlaceholder}
                emptyPlaceholder="Không tìm thấy sản phẩm phù hợp"
                disabled={disabled}
                renderOption={renderOption}
                renderHeader={renderHeader}
            />
            
            {allowCreateNew && (
                <QuickAddProductDialog
                    open={showQuickAdd}
                    onOpenChange={setShowQuickAdd}
                    onProductCreated={handleProductCreated}
                />
            )}
        </>
    );
}

// ═══════════════════════════════════════════════════════════════
// PRESET VARIANTS
// ═══════════════════════════════════════════════════════════════

/** Search chỉ hiển thị sản phẩm có thể thêm vào combo (loại trừ combo, service) */
export function ComboProductSearchV2(props: Omit<UnifiedProductSearchProps, 'excludeTypes' | 'customFilter'>) {
    return (
        <UnifiedProductSearch
            {...props}
            excludeTypes={['combo', 'service']}
            allowCreateNew={props.allowCreateNew ?? true}
        />
    );
}

/** Search cho đơn hàng - hiển thị tất cả sản phẩm active */
export function OrderProductSearch(props: Omit<UnifiedProductSearchProps, 'showSellingPrice'>) {
    return (
        <UnifiedProductSearch
            {...props}
            showSellingPrice={true}
            showCostPrice={false}
        />
    );
}

/** Search cho nhập hàng - hiển thị giá vốn, loại bỏ combo */
export function PurchaseProductSearch(props: Omit<UnifiedProductSearchProps, 'showCostPrice' | 'excludeTypes'>) {
    return (
        <UnifiedProductSearch
            {...props}
            showCostPrice={true}
            showSellingPrice={false}
            excludeTypes={['combo']}
        />
    );
}
