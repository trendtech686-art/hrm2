
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useInfiniteMeiliProductSearch, type ProductSearchResult } from '../../hooks/use-meilisearch';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { fetchProductsByIds } from '../products/api/products-api';
import type { Product } from '../products/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Package, Minus, Plus, Loader2, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { LazyImage } from '../../components/ui/lazy-image';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
};

interface ProductSelectionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (products: Product[], quantities?: Record<string, number>) => void;
    branchSystemId?: string; // Chi nhánh để lọc tồn kho
    showQuantityInput?: boolean; // Hiển thị ô nhập số lượng
    excludeTypes?: ('combo' | 'service' | 'digital')[]; // Loại sản phẩm bị loại trừ
    pricingPolicyId?: string; // Bảng giá được chọn để hiển thị giá
    showCostPrice?: boolean; // Hiển thị giá vốn thay vì giá bán (dùng cho điều chỉnh giá vốn)
    showPurchasePrice?: boolean; // Hiển thị giá nhập (lastPurchasePrice) thay vì giá bán
    // ⚡ OPTIMIZED: Optional prefetched data to avoid duplicate API calls
    prefetchedBranches?: Array<{ systemId: string; name: string }>;
}

export function ProductSelectionDialog({ isOpen, onOpenChange, onSelect, branchSystemId, showQuantityInput = true, excludeTypes = [], pricingPolicyId, showCostPrice = false, showPurchasePrice = false, prefetchedBranches }: ProductSelectionDialogProps) {
    // ⚡ OPTIMIZED: Use prefetched data if available, otherwise fetch
    const { data: fetchedBranches } = useAllBranches({ enabled: !prefetchedBranches });
    const branches = useMemo(() => prefetchedBranches ?? fetchedBranches ?? [], [prefetchedBranches, fetchedBranches]);
    
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [isConfirming, setIsConfirming] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    // ⚡ Use Meilisearch for fast search with infinite scroll — NO useAllProducts needed
    const { data: searchResult, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteMeiliProductSearch({
        query: search,
        debounceMs: 200,
        enabled: isOpen,
    });
    
    // ✅ Get products from Meilisearch response and filter - flatten all pages
    const filteredProducts = useMemo(() => {
        const products = searchResult?.pages.flatMap(page => page.data) || [];
        return products.filter((p) => 
            p.status !== 'combo' &&
            !excludeTypes.includes(p.status as 'combo' | 'service' | 'digital')
        );
    }, [searchResult?.pages, excludeTypes]);

    // ⚡ Use Meilisearch inventory data directly (synced on every product mutation)
    // Meilisearch already contains branchStocks with branchName, use it directly
    const getProductInventory = useCallback((meiliProduct: ProductSearchResult): { totalStock: number; branchStock: number; branchStocks: Array<{ branchId: string; branchName: string; onHand: number }> } => {
        const meiliStocks = meiliProduct.branchStocks || [];
        
        // Get selected branch stock
        const branchStock = branchSystemId 
            ? (meiliStocks.find(s => s.branchId === branchSystemId)?.onHand ?? 0)
            : meiliProduct.totalStock || 0;
        
        return {
            totalStock: meiliProduct.totalStock || 0,
            branchStock,
            branchStocks: meiliStocks // Use Meilisearch data directly - it already has branchName
        };
    }, [branchSystemId]);

    // Get price for product based on selected pricing policy
    const getDisplayPrice = useCallback((product: typeof filteredProducts[0]) => {
        if (pricingPolicyId && product.prices?.[pricingPolicyId]) {
            return product.prices[pricingPolicyId];
        }
        return product.price || 0;
    }, [pricingPolicyId]);
    
    const totalProducts = filteredProducts.length;
    
    // Infinite scroll handler
    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const { scrollTop, scrollHeight, clientHeight } = container;
        const scrollBottom = scrollHeight - scrollTop - clientHeight;
        
        // Load more when near bottom (within 100px)
        if (scrollBottom < 100 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
    
    const selectedBranchName = useMemo(() => {
        if (!branchSystemId) return '';
        return branches.find(branch => branch.systemId === branchSystemId)?.name || '';
    }, [branches, branchSystemId]);

    // Reset state when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setSearch('');
            setSelectedIds(new Set());
            setQuantities({});
        }
    }, [isOpen]);

    // Toggle select all visible products
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const newSelected = new Set(selectedIds);
            const newQuantities = { ...quantities };
            filteredProducts.forEach((p) => {
                newSelected.add(p.systemId);
                // Set default quantity to 1 if not already set
                if (!newQuantities[p.systemId]) {
                    newQuantities[p.systemId] = 1;
                }
            });
            setSelectedIds(newSelected);
            setQuantities(newQuantities);
        } else {
            const newSelected = new Set(selectedIds);
            const newQuantities = { ...quantities };
            filteredProducts.forEach((p) => {
                newSelected.delete(p.systemId);
                delete newQuantities[p.systemId];
            });
            setSelectedIds(newSelected);
            setQuantities(newQuantities);
        }
    };

    // Toggle individual product
    const handleToggleProduct = (productId: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
            // Also remove quantity
            const newQuantities = { ...quantities };
            delete newQuantities[productId];
            setQuantities(newQuantities);
        } else {
            newSelected.add(productId);
            // Set default quantity to 1
            setQuantities(prev => ({ ...prev, [productId]: 1 }));
        }
        setSelectedIds(newSelected);
    };

    // Update quantity for a product
    const handleQuantityChange = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            // Remove from selection if quantity is 0 or less
            const newSelected = new Set(selectedIds);
            newSelected.delete(productId);
            setSelectedIds(newSelected);
            const newQuantities = { ...quantities };
            delete newQuantities[productId];
            setQuantities(newQuantities);
        } else {
            // Add to selection if not already selected
            if (!selectedIds.has(productId)) {
                const newSelected = new Set(selectedIds);
                newSelected.add(productId);
                setSelectedIds(newSelected);
            }
            setQuantities(prev => ({ ...prev, [productId]: quantity }));
        }
    };

    // Get total quantity selected
    const totalQuantity = useMemo(() => {
        return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    }, [quantities]);

    // Check if all visible products are selected
    const allPageSelected =
        filteredProducts.length > 0 &&
        filteredProducts.every((p) => selectedIds.has(p.systemId));

    const handleConfirm = async () => {
        if (selectedIds.size === 0) return;
        setIsConfirming(true);
        try {
            // ⚡ Fetch full Product data only for selected items (typically 5-20)
            // instead of loading ALL 3200+ products upfront
            const selectedProducts = await fetchProductsByIds(Array.from(selectedIds));
            onSelect(selectedProducts, quantities);
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to fetch selected products:', error);
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent mobileFullScreen className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Chọn nhanh sản phẩm</DialogTitle>
                    <DialogDescription>
                        Chọn nhiều sản phẩm cùng lúc. Đã chọn: {selectedIds.size} sản phẩm{showQuantityInput && `, tổng số lượng: ${totalQuantity}`}
                    </DialogDescription>
                </DialogHeader>

                {/* Search */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Tìm kiếm theo tên, mã SKU, barcode... (F3)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1"
                    />
                </div>
                {branchSystemId && (
                    <p className="text-xs text-muted-foreground">
                        Đang hiển thị tồn kho theo chi nhánh: <span className="font-semibold">{selectedBranchName || branchSystemId}</span>
                    </p>
                )}

                {/* Table Header */}
                <div className="border border-border rounded-lg overflow-hidden flex-1 flex flex-col">
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- select all checkbox row */}
                    <div
                        className="bg-muted/50 border-b border-border px-4 py-2 flex items-center gap-4 cursor-pointer hover:bg-muted/70 transition-colors"
                        onClick={() => handleSelectAll(!allPageSelected)}
                    >
                        <Checkbox
                            checked={allPageSelected}
                            onCheckedChange={handleSelectAll}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-sm font-medium flex-1">
                            Chọn Tất Cả Sản Phẩm
                        </span>
                    </div>

                    {/* Product List with infinite scroll */}
                    <div 
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto"
                        onScroll={handleScroll}
                    >
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Loader2 className="h-8 w-8 mb-3 animate-spin" />
                                <p>Đang tải sản phẩm...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Package className="h-12 w-12 mb-3" />
                                <p>Không tìm thấy sản phẩm</p>
                            </div>
                        ) : (
                            <>
                            {filteredProducts.map((product) => {
                                const isSelected = selectedIds.has(product.systemId);
                                const displayPrice = getDisplayPrice(product);
                                // ⚡ Use Meilisearch inventory data directly (synced on mutation)
                                const inventory = getProductInventory(product);
                                const costPrice = product.costPrice ?? 0;
                                const purchasePrice = product.lastPurchasePrice ?? 0;

                                return (
                                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- product row
                                    <div
                                        key={product.systemId}
                                        className={cn(
                                            "flex flex-col md:flex-row md:items-center gap-2 md:gap-2.5 px-3 py-2.5 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors",
                                            isSelected && "bg-primary/5"
                                        )}
                                        onClick={() => handleToggleProduct(product.systemId)}
                                    >
                                        <div className="flex items-center gap-2.5 md:contents">
                                        {/* Checkbox - always show */}
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => handleToggleProduct(product.systemId)}
                                            onClick={(e) => e.stopPropagation()}
                                        />

                                        {/* Product Image with Thumbnail - using simple placeholder */}
                                        <div className="w-10 h-10 shrink-0 bg-muted rounded flex items-center justify-center">
                                            {product.thumbnailImage ? (
                                                <LazyImage
                                                    src={product.thumbnailImage}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            ) : (
                                                <Package className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{product.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {product.id} · {product.unit || "Cái"}
                                                </p>
                                            </div>
                                            <div className="text-xs text-left md:text-right shrink-0 flex items-center md:items-end gap-2 md:gap-0 md:flex-col">
                                                <p className="text-muted-foreground whitespace-nowrap">
                                                    <span className="md:hidden">Giá:</span>
                                                    <span className="hidden md:inline">{showPurchasePrice ? 'Giá nhập' : showCostPrice ? 'Giá vốn' : 'Giá bán'}:</span>
                                                    <span className="font-medium text-foreground ml-1">{formatCurrency(showPurchasePrice ? purchasePrice : showCostPrice ? costPrice : displayPrice)}</span>
                                                </p>
                                                <p className="text-muted-foreground flex items-center justify-end gap-1 whitespace-nowrap">
                                                    Tồn: {inventory.branchStock}
                                                    <TooltipProvider delayDuration={0}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button type="button" className="inline-flex p-1 -m-1" onClick={(e) => e.stopPropagation()}>
                                                                    <Info className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="left" className="max-w-xs">
                                                                <div className="text-xs space-y-1">
                                                                    <p className="font-medium border-b pb-1 mb-1">Tồn kho theo chi nhánh:</p>
                                                                    {inventory.branchStocks.length > 0 ? (
                                                                        inventory.branchStocks.map((bs) => (
                                                                            <div key={bs.branchId} className={cn(
                                                                                "flex justify-between gap-4",
                                                                                branchSystemId === bs.branchId && "font-semibold text-primary"
                                                                            )}>
                                                                                <span className="truncate">{bs.branchName || bs.branchId}</span>
                                                                                <span className="font-medium">{bs.onHand}</span>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <p className="text-muted-foreground italic">Chưa có dữ liệu tồn kho</p>
                                                                    )}
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </p>
                                            </div>
                                        </div>
                                        </div>

                                        {/* Quantity Input */}
                                        {showQuantityInput && (
                                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- input wrapper */}
                                            <div className="shrink-0 md:ml-auto" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center gap-1 md:gap-1 justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleQuantityChange(product.systemId, (quantities[product.systemId] || 0) - 1)}
                                                        disabled={!isSelected}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        value={quantities[product.systemId] || 0}
                                                        onChange={(e) => handleQuantityChange(product.systemId, parseInt(e.target.value, 10) || 0)}
                                                        className="h-8 w-16 text-center px-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleQuantityChange(product.systemId, (quantities[product.systemId] || 0) + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            
                            {/* Loading more indicator */}
                            {isFetchingNextPage && (
                                <div className="flex items-center justify-center py-4 text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    <span className="text-sm">Đang tải thêm...</span>
                                </div>
                            )}
                            
                            {/* Info footer */}
                            <div className="border-t border-border px-4 py-2 text-center">
                                <span className="text-sm text-muted-foreground">
                                    Hiển thị {filteredProducts.length} / {totalProducts} sản phẩm
                                    {hasNextPage && ' • Cuộn xuống để tải thêm'}
                                </span>
                            </div>
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Thoát
                    </Button>
                    <Button onClick={handleConfirm} disabled={selectedIds.size === 0 || isConfirming}>
                        {isConfirming ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Đang xử lý...</>
                        ) : (
                            <>Xác nhận ({selectedIds.size}{showQuantityInput && ` SP, ${totalQuantity} SL`})</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
