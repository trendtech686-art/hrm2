
import * as React from 'react';
import { useProductStore } from '../products/store.ts';
import type { Product } from '../products/types.ts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../components/ui/dialog.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Checkbox } from '../../components/ui/checkbox.tsx';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils.ts';

const ITEMS_PER_PAGE = 10;

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
};

interface ProductSelectionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (products: Product[]) => void;
}

export function ProductSelectionDialog({ isOpen, onOpenChange, onSelect }: ProductSelectionDialogProps) {
    const { data: allProducts, getActive } = useProductStore();
    const [search, setSearch] = React.useState('');
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = React.useState(0);

    // Reset state when dialog closes
    React.useEffect(() => {
        if (!isOpen) {
            setSearch('');
            setSelectedIds(new Set());
            setCurrentPage(0);
        }
    }, [isOpen]);

    // Get available products
    const availableProducts = React.useMemo(() => {
        return getActive();
    }, [allProducts, getActive]);

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

    // Calculate total inventory (on-hand stock)
    const getTotalInventory = (product: Product): number => {
        const inventoryByBranch = product.inventoryByBranch || {};
        return Object.values(inventoryByBranch).reduce((sum, qty) => sum + qty, 0);
    };

    // Calculate available stock (on-hand - committed)
    const getAvailableStock = (product: Product): number => {
        const onHand = getTotalInventory(product);
        const committedByBranch = product.committedByBranch || {};
        const committed = Object.values(committedByBranch).reduce((sum, qty) => sum + qty, 0);
        return onHand - committed;
    };

    // Toggle select all on current page
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const newSelected = new Set(selectedIds);
            paginatedProducts.forEach((p) => newSelected.add(p.systemId));
            setSelectedIds(newSelected);
        } else {
            const newSelected = new Set(selectedIds);
            paginatedProducts.forEach((p) => newSelected.delete(p.systemId));
            setSelectedIds(newSelected);
        }
    };

    // Toggle individual product
    const handleToggleProduct = (productId: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
        } else {
            newSelected.add(productId);
        }
        setSelectedIds(newSelected);
    };

    // Check if all on page are selected
    const allPageSelected =
        paginatedProducts.length > 0 &&
        paginatedProducts.every((p) => selectedIds.has(p.systemId));

    const handleConfirm = () => {
        const selectedProducts = availableProducts.filter(p => selectedIds.has(p.systemId));
        onSelect(selectedProducts);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Chọn nhanh sản phẩm</DialogTitle>
                    <DialogDescription>
                        Chọn nhiều sản phẩm cùng lúc. Đã chọn: {selectedIds.size}
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

                                return (
                                    <div
                                        key={product.systemId}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-3 border-b hover:bg-muted/50 cursor-pointer transition-colors",
                                            isSelected && "bg-primary/5"
                                        )}
                                        onClick={() => handleToggleProduct(product.systemId)}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => handleToggleProduct(product.systemId)}
                                            onClick={(e) => e.stopPropagation()}
                                        />

                                        {/* Product Image Placeholder */}
                                        <div className="w-12 h-12 flex-shrink-0 bg-muted rounded flex items-center justify-center">
                                            <Package className="h-6 w-6 text-muted-foreground" />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {product.id} | ĐVT: {product.unit || "Cái"}
                                                </p>
                                            </div>
                                            <div className="text-sm text-right space-y-1 flex-shrink-0">
                                                <p className="text-muted-foreground">
                                                    Giá bán: <span className="font-medium text-foreground">{formatCurrency(Object.values(product.prices || {})[0] || 0)}</span>
                                                </p>
                                                <p className="text-muted-foreground">
                                                    Tồn: <span className="font-medium text-foreground">{totalStock}</span> | Có thể bán: <span 
                                                    className={cn(
                                                        "font-medium",
                                                        availableStock > 0 ? "text-green-600" : "text-red-600"
                                                    )}
                                                >
                                                    {availableStock}
                                                </span>
                                                </p>
                                            </div>
                                        </div>
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
                        Xác nhận ({selectedIds.size})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
