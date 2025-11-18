import * as React from "react";
import { useProductStore } from "../../features/products/store.ts";
import { Package, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.tsx";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { Checkbox } from "../ui/checkbox.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { cn } from "../../lib/utils.ts";
import type { Product } from "../../features/products/types.ts";

interface BulkProductSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selectedProducts: Product[]) => void;
  excludeProductIds?: string[]; // Products to exclude from list
  title?: string;
  description?: string;
  branchSystemId?: string; // Display inventory for specific branch
}

const ITEMS_PER_PAGE = 10;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export function BulkProductSelectorDialog({
  open,
  onOpenChange,
  onConfirm,
  excludeProductIds = [],
  title = "Chọn nhanh sản phẩm",
  description,
  branchSystemId,
}: BulkProductSelectorDialogProps) {
  const { data: products, getActive } = useProductStore();
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = React.useState(0);

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedIds(new Set());
      setCurrentPage(0);
    }
  }, [open]);

  // Get available products
  const availableProducts = React.useMemo(() => {
    const active = getActive();
    return active.filter(p => !excludeProductIds.includes(p.systemId));
  }, [products, getActive, excludeProductIds]);

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

  // Calculate total inventory across ALL branches
  const getTotalInventory = (product: Product): number => {
    const inventoryByBranch = product.inventoryByBranch || {};
    return Object.values(inventoryByBranch).reduce((sum, qty) => sum + qty, 0);
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
    const selected = availableProducts.filter((p) =>
      selectedIds.has(p.systemId)
    );
    onConfirm(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] sm:max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-6 pb-4 sm:px-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description || `Chọn nhiều sản phẩm cùng lúc. Đã chọn: ${selectedIds.size}`}
          </DialogDescription>
        </DialogHeader>

        {/* Search - Mobile optimized */}
        <div className="px-4 sm:px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tên, mã, barcode..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(0);
              }}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table/List */}
        <div className="flex-1 border-y overflow-hidden">
          {/* Header - Desktop */}
          <div className="hidden sm:flex bg-muted/50 border-b px-4 py-3 items-center gap-4">
            <Checkbox
              checked={allPageSelected}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium flex-1">
              Sản phẩm ({filteredProducts.length})
            </span>
            <span className="text-sm font-medium w-24 text-right">Tồn kho</span>
          </div>

          {/* Product List */}
          <ScrollArea className="h-[50vh] sm:h-[calc(90vh-280px)]">
            {paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mb-3" />
                <p>Không tìm thấy sản phẩm</p>
              </div>
            ) : (
              <div className="divide-y">
                {paginatedProducts.map((product) => {
                  const totalStock = getTotalInventory(product);
                  const isSelected = selectedIds.has(product.systemId);

                  return (
                    <div
                      key={product.systemId}
                      className={cn(
                        "flex items-center gap-3 sm:gap-4 px-4 sm:px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors",
                        isSelected && "bg-primary/5"
                      )}
                      onClick={() => handleToggleProduct(product.systemId)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleProduct(product.systemId)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      {/* Product Image */}
                      <div className="w-10 h-9 sm:w-12 sm:h-12 flex-shrink-0 bg-muted rounded flex items-center justify-center">
                        <Package className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                      </div>

                      {/* Product Details - Mobile First */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm sm:text-base">{product.name}</p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <span>{product.id}</span>
                          <span>•</span>
                          <span>{product.unit || "Cái"}</span>
                          <span className="sm:hidden">•</span>
                          <span className="sm:hidden font-medium text-foreground">Tồn: {totalStock}</span>
                        </div>
                      </div>

                      {/* Stock - Desktop */}
                      <div className="hidden sm:block text-sm font-medium w-24 text-right">
                        {totalStock}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t px-4 py-3 flex items-center justify-between bg-background">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Trang {currentPage + 1} / {totalPages}
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={currentPage >= totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-4 py-4 sm:px-6 gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={selectedIds.size === 0}
            className="flex-1 sm:flex-none"
          >
            Xác nhận ({selectedIds.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
