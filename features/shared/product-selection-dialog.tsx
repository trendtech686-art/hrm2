
import * as React from 'react';
import { useProductStore } from '../products/store';
import { useBranchStore } from '../settings/branches/store';
import { useProductTypeStore } from '../settings/inventory/product-type-store';
import type { Product } from '../products/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Package, ChevronLeft, ChevronRight, Minus, Plus, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { isComboProduct, calculateComboStockAllBranches, calculateComboCostPrice } from '../products/combo-utils';
import { LazyImage } from '../../components/ui/lazy-image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { useImageStore } from '../products/image-store';
import { FileUploadAPI } from '../../lib/file-upload-api';
import type { SystemId } from '@/lib/id-types';

const ITEMS_PER_PAGE = 10;

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
};

// Product Thumbnail component - loads image from server
function ProductThumbnail({ product }: { product: Product }) {
    // Get image from store (uploaded images from server)
    const permanentImages = useImageStore(state => state.permanentImages[product.systemId]);
    const lastFetched = useImageStore(state => state.permanentMeta[product.systemId]?.lastFetched);
    const updatePermanentImages = useImageStore(state => state.updatePermanentImages);

    const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
    const storeGallery = permanentImages?.gallery?.[0]?.url;
    
    // ✅ Ưu tiên ảnh từ server (upload thực) trước, sau đó mới đến mock data
    const displayImage = storeThumbnail           // Ưu tiên 1: thumbnail từ server
        || storeGallery                           // Ưu tiên 2: gallery từ server
        || product.thumbnailImage                 // Ưu tiên 3: từ product data
        || product.galleryImages?.[0]
        || product.images?.[0];

    // Fetch image if missing and not yet fetched
    React.useEffect(() => {
        if (!lastFetched && product.systemId) {
            FileUploadAPI.getProductFiles(product.systemId)
                .then(files => {
                    const mapToServerFile = (f: any) => ({
                        id: f.id,
                        sessionId: '',
                        name: f.name,
                        originalName: f.originalName,
                        slug: f.slug,
                        filename: f.filename,
                        size: f.size,
                        type: f.type,
                        url: f.url,
                        status: 'permanent' as const,
                        uploadedAt: f.uploadedAt,
                        metadata: f.metadata
                    });

                    const thumbnailFiles = files.filter(f => f.documentName === 'thumbnail').map(mapToServerFile);
                    const galleryFiles = files.filter(f => f.documentName === 'gallery').map(mapToServerFile);
                    
                    updatePermanentImages(product.systemId, 'thumbnail', thumbnailFiles);
                    updatePermanentImages(product.systemId, 'gallery', galleryFiles);
                })
                .catch(err => console.error("Failed to load product image", err));
        }
    }, [product.systemId, displayImage, lastFetched, updatePermanentImages]);

    if (displayImage) {
        return (
            <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
                <LazyImage
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }
    return (
        <div className="w-12 h-12 flex-shrink-0 bg-muted rounded flex items-center justify-center">
            <Package className="h-6 w-6 text-muted-foreground" />
        </div>
    );
}

// Quantity selector with +/- buttons
function QuantitySelector({ 
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
}

export function ProductSelectionDialog({ isOpen, onOpenChange, onSelect, branchSystemId, showQuantityInput = true, excludeTypes = [] }: ProductSelectionDialogProps) {
    const { data: allProducts, getActive } = useProductStore();
    const { data: branches } = useBranchStore();
    const { findById: findProductTypeById } = useProductTypeStore();
    const [search, setSearch] = React.useState('');
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
    const [quantities, setQuantities] = React.useState<Record<string, number>>({});
    const [currentPage, setCurrentPage] = React.useState(0);
    const selectedBranchName = React.useMemo(() => {
        if (!branchSystemId) return '';
        return branches.find(branch => branch.systemId === branchSystemId)?.name || '';
    }, [branches, branchSystemId]);

    const getComboStockRecord = React.useCallback((product: Product): Record<SystemId, number> => {
        if (!isComboProduct(product) || !product.comboItems?.length) {
            return {};
        }
        return calculateComboStockAllBranches(product.comboItems, allProducts);
    }, [allProducts]);

    const getBranchStockDetails = React.useCallback((product: Product) => {
        if (isComboProduct(product) && product.comboItems?.length) {
            const comboStock = getComboStockRecord(product);
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
    }, [branches, getComboStockRecord]);

    // Reset state when dialog closes
    React.useEffect(() => {
        if (!isOpen) {
            setSearch('');
            setSelectedIds(new Set());
            setQuantities({});
            setCurrentPage(0);
        }
    }, [isOpen]);

    // Get available products
    const availableProducts = React.useMemo(() => {
        let products = getActive();
        // Filter by excludeTypes
        if (excludeTypes.length > 0) {
            products = products.filter(p => !excludeTypes.includes(p.type as any));
        }
        return products;
    }, [allProducts, getActive, excludeTypes]);

    // Filter products by search
    const filteredProducts = React.useMemo(() => {
        if (!search) return availableProducts;
        
        const searchLower = search.toLowerCase();
        return availableProducts.filter(
            (product) =>
                product.name.toLowerCase().includes(searchLower) ||
                product.id.toLowerCase().includes(searchLower) ||
                product.barcode?.toLowerCase().includes(searchLower)
        );
    }, [availableProducts, search]);

    // Paginate
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = React.useMemo(() => {
        const start = currentPage * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const getTotalInventory = React.useCallback((product: Product): number => {
        if (isComboProduct(product) && product.comboItems?.length) {
            const comboStock = getComboStockRecord(product);
            return Object.values(comboStock).reduce((sum, qty) => sum + qty, 0);
        }
        const inventoryByBranch = product.inventoryByBranch || {};
        return Object.values(inventoryByBranch).reduce((sum, qty) => sum + qty, 0);
    }, [getComboStockRecord]);

    const getAvailableStock = React.useCallback((product: Product): number => {
        if (isComboProduct(product) && product.comboItems?.length) {
            const comboStock = getComboStockRecord(product);
            return Object.values(comboStock).reduce((sum, qty) => sum + qty, 0);
        }
        const inventoryByBranch = product.inventoryByBranch || {};
        const committedByBranch = product.committedByBranch || {};
        return Object.entries(inventoryByBranch).reduce((sum, [branchId, stock]) => {
            const committed = committedByBranch[branchId as SystemId] || 0;
            return sum + Math.max(0, (stock as number) - committed);
        }, 0);
    }, [getComboStockRecord]);

    const getCostPrice = React.useCallback((product: Product): number => {
        if (isComboProduct(product) && product.comboItems?.length) {
            return calculateComboCostPrice(product.comboItems, allProducts);
        }
        return product.costPrice || 0;
    }, [allProducts]);

    // Toggle select all on current page
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const newSelected = new Set(selectedIds);
            const newQuantities = { ...quantities };
            paginatedProducts.forEach((p) => {
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
            paginatedProducts.forEach((p) => {
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

    // Check if all on page are selected
    const allPageSelected =
        paginatedProducts.length > 0 &&
        paginatedProducts.every((p) => selectedIds.has(p.systemId));

    const handleConfirm = () => {
        const selectedProducts = availableProducts.filter(p => selectedIds.has(p.systemId));
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
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="flex-1"
                    />
                </div>
                {branchSystemId && (
                    <p className="text-xs text-muted-foreground">
                        Đang hiển thị tồn kho theo chi nhánh: <span className="font-semibold">{selectedBranchName || branchSystemId}</span>
                    </p>
                )}

                {/* Table Header */}
                <div className="border rounded-lg overflow-hidden flex-1 flex flex-col">
                    <div 
                        className="bg-muted/50 border-b px-4 py-2 flex items-center gap-4 cursor-pointer hover:bg-muted/70 transition-colors"
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

                    {/* Product List */}
                    <div className="flex-1 overflow-y-auto">
                        {paginatedProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Package className="h-12 w-12 mb-3" />
                                <p>Không tìm thấy sản phẩm</p>
                            </div>
                        ) : (
                            paginatedProducts.map((product) => {
                                const totalStock = getTotalInventory(product);
                                const availableStock = getAvailableStock(product);
                                const isSelected = selectedIds.has(product.systemId);
                                const branchStockDetails = getBranchStockDetails(product);
                                const branchLines = branchStockDetails.length > 0
                                    ? branchStockDetails.map(detail => `${detail.branchName}: Tồn ${detail.stock} | Có thể bán ${Math.max(0, detail.available)}`)
                                    : ['Tất cả chi nhánh đã hết hàng'];

                                return (
                                    <div
                                        key={product.systemId}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 border-b hover:bg-muted/50 cursor-pointer transition-colors",
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

                                        {/* Product Image with Thumbnail */}
                                        <ProductThumbnail product={product} />

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {product.id} | {findProductTypeById(product.productTypeSystemId as SystemId)?.name || 'Hàng hóa'} | ĐVT: {product.unit || "Cái"}
                                                </p>
                                            </div>
                                            <div className="text-sm text-right flex-shrink-0">
                                                <p className="text-muted-foreground">
                                                    Giá vốn: <span className="font-medium text-foreground">{formatCurrency(getCostPrice(product))}</span>
                                                </p>
                                                <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                                                    <span>Tồn: {totalStock}</span>
                                                    <span>|</span>
                                                    <span>Có thể bán: <span className="font-semibold text-primary">{availableStock}</span></span>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help ml-1" />
                                                            </TooltipTrigger>
                                                            <TooltipContent side="left" className="max-w-xs">
                                                                <div className="text-xs space-y-1">
                                                                    {branchLines.map((line, idx) => (
                                                                        <p key={idx}>{line}</p>
                                                                    ))}
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity Input */}
                                        {showQuantityInput && (
                                            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="border-t px-4 py-2 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Trang {currentPage + 1} / {totalPages} • {filteredProducts.length} sản phẩm
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                                    disabled={currentPage === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
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
