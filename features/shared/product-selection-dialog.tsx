
import * as React from 'react';
import { useAllProducts } from '../products/hooks/use-all-products';
import { useInfiniteMeiliProductSearch } from '../../hooks/use-meilisearch';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import type { Product } from '../products/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Package, Minus, Plus, Loader2, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { isComboProduct, calculateComboStockAllBranches } from '../products/combo-utils';
import { LazyImage } from '../../components/ui/lazy-image';
import type { SystemId } from '@/lib/id-types';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
};

// Quantity selector with +/- buttons
function _QuantitySelector({ 
    value, 
    onChange,
    onRemove 
}: { 
    value: number; 
    onChange: (value: number) => void;
    onRemove: () => void;
}) {
    if (value === 0) {
        return (
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3"
                onClick={(e) => {
                    e.stopPropagation();
                    onChange(1);
                }}
            >
                <Plus className="h-3 w-3 mr-1" />
                Thêm
            </Button>
        );
    }
    
    return (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                    if (value <= 1) {
                        onRemove();
                    } else {
                        onChange(value - 1);
                    }
                }}
            >
                <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center font-medium text-sm">{value}</span>
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onChange(value + 1)}
            >
                <Plus className="h-3 w-3" />
            </Button>
        </div>
    );
}

interface ProductSelectionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (products: Product[], quantities?: Record<string, number>) => void;
    branchSystemId?: string; // Chi nhánh để lọc tồn kho
    showQuantityInput?: boolean; // Hiển thị ô nhập số lượng
    excludeTypes?: ('combo' | 'service' | 'digital')[]; // Loại sản phẩm bị loại trừ
    pricingPolicyId?: string; // Bảng giá được chọn để hiển thị giá
    showCostPrice?: boolean; // Hiển thị giá vốn thay vì giá bán (dùng cho điều chỉnh giá vốn)
}

export function ProductSelectionDialog({ isOpen, onOpenChange, onSelect, branchSystemId, showQuantityInput = true, excludeTypes = [], pricingPolicyId, showCostPrice = false }: ProductSelectionDialogProps) {
    const { data: allProducts } = useAllProducts(); // Keep for combo calculations only
    const { data: branches } = useAllBranches();
    
    // Get price based on selected pricing policy, fallback to sellingPrice
    const _getProductPrice = React.useCallback((product: Product): number => {
        if (pricingPolicyId && product.prices && product.prices[pricingPolicyId]) {
            return Number(product.prices[pricingPolicyId]) || 0;
        }
        // Use sellingPrice from product (may come from API transform)
        return Number((product as { sellingPrice?: number }).sellingPrice) || 0;
    }, [pricingPolicyId]);
    const [search, setSearch] = React.useState('');
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
    const [quantities, setQuantities] = React.useState<Record<string, number>>({});
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    
    // ✅ Use Meilisearch for fast search with infinite scroll
    const { data: searchResult, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteMeiliProductSearch({
        query: search,
        debounceMs: 200,
        enabled: isOpen, // Only fetch when dialog is open
    });
    
    // ✅ Get products from Meilisearch response and filter - flatten all pages
    const filteredProducts = React.useMemo(() => {
        const products = searchResult?.pages.flatMap(page => page.data) || [];
        // Filter by excludeTypes and only active products
        return products.filter((p) => 
            p.status !== 'combo' && // Meilisearch uses status instead of type
            !excludeTypes.includes(p.status as 'combo' | 'service' | 'digital')
        );
    }, [searchResult?.pages, excludeTypes]);

    // ✅ Create a map of allProducts for quick lookup of inventory data
    const allProductsMap = React.useMemo(() => {
        const map = new Map<string, Product>();
        for (const p of allProducts) {
            map.set(p.systemId, p);
        }
        return map;
    }, [allProducts]);

    // ✅ Helper to get real-time inventory from allProducts (React Query) instead of Meilisearch
    const getProductInventory = React.useCallback((meiliProduct: typeof filteredProducts[0]): { totalStock: number; branchStocks: Array<{ branchId: string; branchName: string; onHand: number }> } => {
        const realProduct = allProductsMap.get(meiliProduct.systemId);
        if (realProduct) {
            const totalStock = (realProduct as unknown as { totalInventory?: number }).totalInventory || Object.values(realProduct.inventoryByBranch || {}).reduce((sum, v) => sum + (v || 0), 0);
            // Show all branches with inventory data (including 0 for clarity)
            const branchStocks = branches.map(branch => ({
                branchId: branch.systemId,
                branchName: branch.name,
                onHand: realProduct.inventoryByBranch?.[branch.systemId] || 0
            }));
            return { totalStock, branchStocks };
        }
        // Fallback to Meilisearch data if not found in allProducts
        // Also show all branches for consistency
        const meiliStocks = meiliProduct.branchStocks || [];
        const stockMap = new Map(meiliStocks.map(s => [s.branchId, s.onHand]));
        const branchStocks = branches.map(branch => ({
            branchId: branch.systemId,
            branchName: branch.name,
            onHand: stockMap.get(branch.systemId) || 0
        }));
        return {
            totalStock: meiliProduct.totalStock || 0,
            branchStocks
        };
    }, [allProductsMap, branches]);

    // Get price for product based on selected pricing policy
    const getDisplayPrice = React.useCallback((product: typeof filteredProducts[0]) => {
        if (pricingPolicyId && product.prices?.[pricingPolicyId]) {
            return product.prices[pricingPolicyId];
        }
        return product.price || 0;
    }, [pricingPolicyId]);
    
    const totalProducts = filteredProducts.length;
    
    // Infinite scroll handler
    const handleScroll = React.useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const { scrollTop, scrollHeight, clientHeight } = container;
        const scrollBottom = scrollHeight - scrollTop - clientHeight;
        
        // Load more when near bottom (within 100px)
        if (scrollBottom < 100 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
    
    const selectedBranchName = React.useMemo(() => {
        if (!branchSystemId) return '';
        return branches.find(branch => branch.systemId === branchSystemId)?.name || '';
    }, [branches, branchSystemId]);

    const _getComboStockRecord = React.useCallback((product: Product): Record<SystemId, number> => {
        if (!isComboProduct(product) || !product.comboItems?.length) {
            return {};
        }
        return calculateComboStockAllBranches(product.comboItems, allProducts);
    }, [allProducts]);

    const _getBranchStockDetails = React.useCallback((product: Product) => {
        if (isComboProduct(product) && product.comboItems?.length) {
            const comboStock = _getComboStockRecord(product);
            return branches
                .map(branch => {
                    const available = comboStock[branch.systemId] || 0;
                    return {
                        branchSystemId: branch.systemId,
                        branchName: branch.name,
                        stock: available,
                        available,
                    };
                })
                .filter(detail => detail.stock > 0 || detail.available > 0);
        }

        const inventoryByBranch = product.inventoryByBranch || {};
        const committedByBranch = product.committedByBranch || {};
        return branches
            .map(branch => {
                const stock = inventoryByBranch[branch.systemId] || 0;
                const committed = committedByBranch[branch.systemId] || 0;
                const available = Math.max(0, stock - committed);
                return {
                    branchSystemId: branch.systemId,
                    branchName: branch.name,
                    stock,
                    available,
                };
            })
            .filter(detail => detail.stock > 0 || detail.available > 0);
    }, [branches, _getComboStockRecord]);

    // Reset state when dialog closes
    React.useEffect(() => {
        if (!isOpen) {
            setSearch('');
            setSelectedIds(new Set());
            setQuantities({});
        }
    }, [isOpen]);

    const _getTotalInventory = React.useCallback((product: Product): number => {
        if (isComboProduct(product) && product.comboItems?.length) {
            const comboStock = _getComboStockRecord(product);
            return Object.values(comboStock).reduce((sum, qty) => sum + qty, 0);
        }
        const inventoryByBranch = product.inventoryByBranch || {};
        return Object.values(inventoryByBranch).reduce((sum, qty) => sum + qty, 0);
    }, [_getComboStockRecord]);

    const _getAvailableStock = React.useCallback((product: Product): number => {
        if (isComboProduct(product) && product.comboItems?.length) {
            const comboStock = _getComboStockRecord(product);
            return Object.values(comboStock).reduce((sum, qty) => sum + qty, 0);
        }
        const inventoryByBranch = product.inventoryByBranch || {};
        const committedByBranch = product.committedByBranch || {};
        return Object.entries(inventoryByBranch).reduce((sum, [branchId, stock]) => {
            const committed = committedByBranch[branchId as SystemId] || 0;
            return sum + Math.max(0, (stock as number) - committed);
        }, 0);
    }, [_getComboStockRecord]);

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
    const totalQuantity = React.useMemo(() => {
        return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    }, [quantities]);

    // Check if all visible products are selected
    const allPageSelected =
        filteredProducts.length > 0 &&
        filteredProducts.every((p) => selectedIds.has(p.systemId));

    const handleConfirm = () => {
        // Note: With server-side pagination, we can only confirm products that are currently loaded
        // For selected products from previous pages, we need to use allProducts (which has 500 limit)
        // This is a trade-off for supporting 3000+ products with search
        const allAvailableProducts = allProducts.filter((p: Product) => 
            !p.isDeleted && 
            (p as { isActive?: boolean }).isActive !== false &&
            !excludeTypes.includes(p.type as 'combo' | 'service' | 'digital')
        );
        const selectedProducts = allAvailableProducts.filter((p: Product) => selectedIds.has(p.systemId));
        onSelect(selectedProducts, quantities);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
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
                                // ✅ Get real-time inventory from allProducts (React Query)
                                const inventory = getProductInventory(product);
                                // ✅ Get real-time costPrice from allProducts (React Query)
                                const realProduct = allProductsMap.get(product.systemId);
                                const realCostPrice = realProduct?.costPrice ?? product.costPrice ?? 0;

                                return (
                                    <div
                                        key={product.systemId}
                                        className={cn(
                                            "flex items-center gap-2.5 px-3 py-2 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors",
                                            isSelected && "bg-primary/5"
                                        )}
                                        onClick={() => handleToggleProduct(product.systemId)}
                                    >
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
                                        <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {product.id} | ĐVT: {product.unit || "Cái"}
                                                </p>
                                            </div>
                                            <div className="text-xs text-right shrink-0">
                                                <p className="text-muted-foreground">
                                                    {showCostPrice ? 'Giá vốn' : 'Giá bán'}: <span className="font-medium text-foreground">{formatCurrency(showCostPrice ? realCostPrice : displayPrice)}</span>
                                                </p>
                                                <p className="text-muted-foreground flex items-center justify-end gap-1">
                                                    Tồn kho: {inventory.totalStock}
                                                    <TooltipProvider delayDuration={100}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Info className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
                                                            </TooltipTrigger>
                                                            <TooltipContent side="left" className="max-w-xs">
                                                                <div className="text-xs space-y-1">
                                                                    <p className="font-medium border-b pb-1 mb-1">Tồn kho theo chi nhánh:</p>
                                                                    {inventory.branchStocks.length > 0 ? (
                                                                        inventory.branchStocks.map((bs) => (
                                                                            <div key={bs.branchId} className="flex justify-between gap-4">
                                                                                <span className="truncate">{bs.branchName}</span>
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

                                        {/* Quantity Input */}
                                        {showQuantityInput && (
                                            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center gap-1">
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
                    <Button onClick={handleConfirm} disabled={selectedIds.size === 0}>
                        Xác nhận ({selectedIds.size}{showQuantityInput && ` SP, ${totalQuantity} SL`})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
