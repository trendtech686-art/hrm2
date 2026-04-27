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

import {
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type FormEvent,
} from 'react';
import { Package, Plus, Info } from 'lucide-react';
import type { Product, ProductType as ProductTypeEnum } from '../../features/products/types';
import { useProductMutations } from '../../features/products/hooks/use-products';
import { useProduct } from '../../hooks/api/use-products';
import { useInfiniteMeiliProductSearch } from '../../hooks/use-meilisearch';
import { useAllProducts } from '../../features/products/hooks/use-all-products';
import { useAllPricingPolicies } from '../../features/settings/pricing/hooks/use-all-pricing-policies';
import { useAllBranches } from '../../features/settings/branches/hooks/use-all-branches';
import { useProductTypeFinder, useActiveProductTypes } from '../../features/settings/inventory/hooks/use-all-product-types';
import { useAllUnits } from '../../features/settings/units/hooks/use-all-units';
import { useImageStore } from '../../features/products/image-store';
import { LazyImage } from '../ui/lazy-image';
import { VirtualizedCombobox, type ComboboxOption } from '../ui/virtualized-combobox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CurrencyInput } from '../ui/currency-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip';
import { toast } from 'sonner';
import type { SystemId } from '@/lib/id-types';

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
    /** Hiển thị giá nhập */
    showPurchasePrice?: boolean;
    /** Hiển thị giá bán */
    showSellingPrice?: boolean;
    /** Chi nhánh để hiển thị tồn kho (nếu muốn filter theo chi nhánh) */
    branchSystemId?: string;
    /** Custom filter function */
    customFilter?: (product: Product) => boolean;
    /** Pricing policy ID để hiển thị giá theo bảng giá đã chọn */
    pricingPolicyId?: string;
    // ⚡ OPTIMIZED: Optional prefetched data to avoid duplicate API calls
    /** @deprecated Use prefetchedUnits instead */
    _prefetchedUnits?: Array<{ systemId: string; name: string }>;
    /** @deprecated Use prefetchedProductTypes instead */
    _prefetchedProductTypes?: Array<{ systemId: string; name: string }>;
    prefetchedUnits?: Array<{ systemId: string; name: string }>;
    prefetchedProductTypes?: Array<{ systemId: string; name: string }>;
    prefetchedPricingPolicies?: Array<{ systemId: string; name: string; type: string; isDefault: boolean }>;
    prefetchedBranches?: Array<{ systemId: string; name: string }>;
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT THUMBNAIL COMPONENT
// ═══════════════════════════════════════════════════════════════

/**
 * Optimized thumbnail component
 * - Uses thumbnailImage from Meilisearch directly (pre-synced)
 * - Only fetches from server if no image available AND not already fetched
 * - Prevents N+1 API calls when rendering product list
 */
const ProductOptionThumbnail = memo(({ 
    productSystemId,
    productData 
}: { 
    productSystemId: string;
    productData?: Product;
}) => {
    // Get image from productData first (from Meilisearch)
    const meiliImage = productData?.thumbnailImage 
        || productData?.galleryImages?.[0]
        || productData?.images?.[0];
    
    // Only access store if no Meilisearch image
    const permanentImages = useImageStore(state => 
        meiliImage ? null : state.permanentImages[productSystemId]
    );
    const lastFetched = useImageStore(state => 
        meiliImage ? true : state.permanentMeta[productSystemId]?.lastFetched
    );

    const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
    const storeGallery = permanentImages?.gallery?.[0]?.url;
    
    // Prioritize Meilisearch image (already synced)
    const displayImage = meiliImage || storeThumbnail || storeGallery;

    // Only fetch if: no image from Meilisearch AND never fetched before (uses batch queue)
    useEffect(() => {
        if (!meiliImage && !lastFetched && productSystemId) {
            import('@/features/products/image-store').then(({ queueProductImageFetch }) => {
                queueProductImageFetch(productSystemId);
            });
        }
    }, [productSystemId, meiliImage, lastFetched]);

    if (displayImage) {
        return (
            <div className="w-10 h-10 shrink-0 rounded overflow-hidden bg-muted">
                <LazyImage src={displayImage} alt="" className="w-full h-full object-cover" />
            </div>
        );
    }
    return (
        <div className="w-10 h-10 shrink-0 bg-muted rounded flex items-center justify-center">
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
    const { data: products } = useAllProducts({ enabled: open });
    const productMutations = useProductMutations({
        onCreateSuccess: (product) => {
            if (product && typeof product === 'object' && 'name' in product) {
                toast.success(`Đã tạo sản phẩm "${(product as Product).name}"`);
                onProductCreated(product as unknown as Product);
                onOpenChange(false);
            }
        },
        onError: () => toast.error('Không thể tạo sản phẩm'),
    });
    const { data: _productTypes } = useActiveProductTypes({ enabled: open });
    const getActiveProductTypes = useCallback(() => _productTypes, [_productTypes]);
    const { data: units } = useAllUnits({ enabled: open });
    const { data: pricingPolicies = [] } = useAllPricingPolicies({ enabled: open });
    
    const [formData, setFormData] = useState({
        name: '',
        productTypeSystemId: '',
        unit: 'Chiếc',
        costPrice: 0,
        sellingPrice: 0,
        barcode: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get default pricing policy
    const defaultSellingPolicy = useMemo(() => {
        return pricingPolicies.find(p => p.isDefault && p.type === 'Bán hàng');
    }, [pricingPolicies]);

    // Generate next product ID
    const _generateNextProductId = useCallback(() => {
        const existingIds = products.map(p => p.id).filter(id => id.startsWith('SP'));
        const numbers = existingIds.map(id => {
            const num = parseInt(id.replace('SP', ''), 10);
            return isNaN(num) ? 0 : num;
        });
        const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
        return `SP${String(maxNum + 1).padStart(6, '0')}`;
    }, [products]);

    // Reset form when dialog opens
    useEffect(() => {
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

    const handleSubmit = async (e: FormEvent) => {
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
            
            productMutations.create.mutate({
                name: formData.name.trim(),
                type: 'physical',
                productTypeSystemId: formData.productTypeSystemId || undefined,
                unit: formData.unit || 'Chiếc',
                costPrice: formData.costPrice,
                barcode: formData.barcode || undefined,
            } as Parameters<typeof productMutations.create.mutate>[0]);
        } catch (_error) {
            toast.error('Không thể tạo sản phẩm');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-125">
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
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export function UnifiedProductSearch({
    onSelectProduct,
    excludeProductIds = [],
    disabled = false,
    placeholder = 'Thêm sản phẩm (F3)',
    searchPlaceholder = 'Tìm kiếm theo tên, mã SKU, barcode...',
    allowedTypes: _allowedTypes,
    excludeTypes: _excludeTypes = [],
    allowCreateNew = true,
    showCostPrice = false,
    showPurchasePrice = false,
    showSellingPrice: _showSellingPrice = false,
    branchSystemId: _branchSystemId,
    customFilter: _customFilter,
    pricingPolicyId,
    _prefetchedUnits,
    _prefetchedProductTypes,
    prefetchedPricingPolicies,
    prefetchedBranches,
}: UnifiedProductSearchProps) {
    // ⚡ OPTIMIZED: Use prefetched data if available, otherwise fetch
    const { data: fetchedPricingPolicies = [] } = useAllPricingPolicies({ enabled: !prefetchedPricingPolicies });
    const pricingPolicies = prefetchedPricingPolicies ?? fetchedPricingPolicies;
    const { data: fetchedBranches = [] } = useAllBranches({ enabled: !prefetchedBranches });
    const branches = prefetchedBranches ?? fetchedBranches;
    const { findById: findProductTypeById } = useProductTypeFinder();
    
    const [selectedValue, setSelectedValue] = useState<ComboboxOption | null>(null);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pendingProductId, setPendingProductId] = useState<string | null>(null);
    // ⚡ Track if user has interacted with combobox
    const [hasInteracted, setHasInteracted] = useState(false);

    // ✅ Use Meilisearch for fast product search
    // ✅ Infinite scroll support - load more on scroll
    // ⚡ OPTIMIZED: Only fetch when user interacts or types (lazy load)
    const {
        data: searchResult,
        isLoading: isLoadingSearch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteMeiliProductSearch({ 
        query: searchQuery,
        debounceMs: 150,
        enabled: hasInteracted,
    });
    
    // ✅ Fetch full product data when selected from Meilisearch
    const { data: selectedProduct } = useProduct(pendingProductId ?? undefined);
    
    // When full product is loaded, call onSelectProduct
    useEffect(() => {
        if (selectedProduct && pendingProductId) {
            // Guard against stale/cached data from a previous query
            if (selectedProduct.systemId !== pendingProductId) return;
            onSelectProduct(selectedProduct);
            setPendingProductId(null);
        }
    }, [selectedProduct, pendingProductId, onSelectProduct]);

    // Normalize excludeProductIds to Set
    const excludeSet = useMemo(() => {
        if (excludeProductIds instanceof Set) return excludeProductIds;
        return new Set(excludeProductIds);
    }, [excludeProductIds]);

    // Get default selling policy
    const defaultPricingPolicy = useMemo(() => {
        return pricingPolicies.find(p => p.isDefault && p.type === 'Bán hàng');
    }, [pricingPolicies]);

    // ✅ Filter Meilisearch results - flatten all pages
    const searchProducts = useMemo(() => {
        const products = searchResult?.pages.flatMap(page => page.data) || [];
        return products.filter(p => {
            // Exclude already selected
            if (excludeSet.has(p.systemId)) return false;
            return true;
        });
    }, [searchResult, excludeSet]);

    // Get product type name
    const _getProductTypeName = (productTypeSystemId?: string) => {
        if (!productTypeSystemId) return 'Không xác định';
        const productType = findProductTypeById(productTypeSystemId as SystemId);
        return productType?.name || 'Không xác định';
    };

    // Convert Meilisearch results to ComboboxOption format
    // ✅ Uses Meilisearch data directly (synced on every product mutation via Prisma hooks)
    // Full product data is fetched via useProduct() when user actually selects a product
    const options: ComboboxOption[] = useMemo(() => {
        return searchProducts.map((p) => {
            // Get display price based on pricingPolicyId
            let displayPrice = p.price || 0;
            if (pricingPolicyId && p.prices && p.prices[pricingPolicyId] !== undefined) {
                displayPrice = p.prices[pricingPolicyId];
            } else if (defaultPricingPolicy && p.prices && p.prices[defaultPricingPolicy.systemId] !== undefined) {
                displayPrice = p.prices[defaultPricingPolicy.systemId];
            }
            
            // Use Meilisearch inventory data (synced in real-time)
            let branchStocks = p.branchStocks || [];
            if (branchStocks.length === 0) {
                branchStocks = branches.map(b => ({
                    branchId: b.systemId,
                    branchName: b.name,
                    onHand: 0,
                }));
            }
            const totalStock = p.totalStock || branchStocks.reduce((sum, bs) => sum + bs.onHand, 0);
            
            return {
                value: p.systemId,
                label: p.name,
                subtitle: p.id,
                metadata: {
                    thumbnailImage: p.thumbnailImage,
                    displayPrice,
                    costPrice: p.costPrice ?? 0,
                    lastPurchasePrice: p.lastPurchasePrice ?? 0,
                    unit: p.unit || 'Cái',
                    totalStock,
                    branchStocks,
                }
            } as ComboboxOption;
        });
    }, [searchProducts, pricingPolicyId, defaultPricingPolicy, branches]);

    const handleChange = useCallback((option: ComboboxOption | null) => {
        if (option) {
            // Set pending product ID to trigger full product fetch
            setPendingProductId(option.value);
        }
        setSelectedValue(null);
    }, []);

    const handleProductCreated = useCallback((product: Product) => {
        onSelectProduct(product);
    }, [onSelectProduct]);

    // Render option - with image, price, stock and branch tooltip
    // Wrapped in useCallback to prevent re-creating function every render
    const renderOption = useCallback((option: ComboboxOption) => {
        const meta = option.metadata as {
            thumbnailImage?: string | null;
            displayPrice?: number;
            costPrice?: number;
            lastPurchasePrice?: number;
            unit?: string;
            totalStock?: number;
            branchStocks?: { branchId: string; branchName: string; onHand: number }[];
        } | undefined;
        const { 
            thumbnailImage,
            displayPrice,
            costPrice,
            lastPurchasePrice,
            unit,
            totalStock,
            branchStocks,
        } = meta || {};
        
        // Determine which price to show
        const shownPrice = showPurchasePrice ? (lastPurchasePrice || 0) : showCostPrice ? (costPrice || 0) : (displayPrice || 0);
        
        return (
            <div className="flex items-center gap-2.5 w-full py-1">
                <ProductOptionThumbnail 
                    productSystemId={option.value} 
                    productData={{ thumbnailImage } as Product}
                />
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{option.label}</p>
                    <p className="text-xs text-muted-foreground truncate">
                        {option.subtitle} · {unit || 'Cái'}
                    </p>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-0.5">
                    <p className="font-semibold text-primary text-sm whitespace-nowrap">{formatCurrency(shownPrice)}đ</p>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
                        <span>Tồn: {formatCurrency(totalStock || 0)}</span>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="hidden md:inline-flex cursor-help">
                                        <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="max-w-62.5">
                                    <div className="space-y-1 text-xs">
                                        <p className="font-semibold">Tồn kho theo chi nhánh:</p>
                                        {branchStocks && branchStocks.length > 0 ? (
                                            branchStocks.map((bs) => (
                                                <div key={bs.branchId} className="flex justify-between gap-4">
                                                    <span className="truncate">{bs.branchName}</span>
                                                    <span className="font-medium">{formatCurrency(bs.onHand)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground italic">Chưa có dữ liệu tồn kho</p>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        );
    }, [showCostPrice, showPurchasePrice]);

    // Custom header with "Add new product" action
    const renderHeader = useMemo(() => {
        if (!allowCreateNew) return undefined;
        return () => (
            <button
                type="button"
                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-primary hover:bg-accent transition-colors border-b"
                onClick={() => setShowQuickAdd(true)}
            >
                <Plus className="h-4 w-4" />
                <span>Thêm mới sản phẩm</span>
            </button>
        );
    }, [allowCreateNew]);

    // Memoize onLoadMore to prevent re-renders
    const handleLoadMore = useCallback(() => {
        fetchNextPage();
    }, [fetchNextPage]);

    return (
        <>
            <VirtualizedCombobox
                options={options}
                value={selectedValue}
                onChange={handleChange}
                onSearchChange={setSearchQuery}
                onOpenChange={(open) => { if (open) setHasInteracted(true); }}
                isLoading={isLoadingSearch || !!pendingProductId}
                placeholder={placeholder}
                searchPlaceholder={searchPlaceholder}
                emptyPlaceholder={hasInteracted ? "Không tìm thấy sản phẩm phù hợp" : "Nhập để tìm kiếm..."}
                disabled={disabled}
                onLoadMore={handleLoadMore}
                hasMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
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
export function OrderProductSearch(props: Omit<UnifiedProductSearchProps, 'showSellingPrice'> & { pricingPolicyId?: string }) {
    return (
        <UnifiedProductSearch
            {...props}
            showSellingPrice={true}
            showCostPrice={false}
            pricingPolicyId={props.pricingPolicyId}
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
