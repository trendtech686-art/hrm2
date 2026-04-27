import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useInfiniteMeiliProductSearch } from "../../hooks/use-meilisearch";
import { Package, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { cn } from "../../lib/utils";
import type { Product } from "../../features/products/types";

interface BulkProductSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selectedProducts: Product[]) => void;
  excludeProductIds?: string[]; // Products to exclude from list
  title?: string;
  description?: string;
  branchSystemId?: string; // Display inventory for specific branch
}

const _formatCurrency = (value: number) => {
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
  branchSystemId: _branchSystemId,
}: BulkProductSelectorDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedProducts, setSelectedProducts] = useState<Map<string, Product>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Use Meilisearch for fast product search with infinite scroll
  const { data: searchResult, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteMeiliProductSearch({ 
    query: search,
    debounceMs: 200,
  });

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedIds(new Set());
      setSelectedProducts(new Map());
    }
  }, [open]);

  // Get search results (exclude already excluded products) - flatten all pages
  const filteredProducts = useMemo(() => {
    const products = searchResult?.pages.flatMap(page => page.data) || [];
    return products.filter(p => !excludeProductIds.includes(p.systemId));
  }, [searchResult, excludeProductIds]);
  
  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;
    
    if (scrollBottom < 100 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Toggle select all visible products
  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set(selectedIds);
    const newProducts = new Map(selectedProducts);
    
    if (checked) {
      filteredProducts.forEach((p) => {
        newSelected.add(p.systemId);
        // Store product data from Meilisearch
        newProducts.set(p.systemId, {
          systemId: p.systemId,
          id: p.id,
          name: p.name,
          barcode: p.barcode || undefined,
          costPrice: p.costPrice || 0,
          thumbnailImage: p.thumbnailImage || undefined,
        } as unknown as Product);
      });
    } else {
      filteredProducts.forEach((p) => {
        newSelected.delete(p.systemId);
        newProducts.delete(p.systemId);
      });
    }
    setSelectedIds(newSelected);
    setSelectedProducts(newProducts);
  };

  // Toggle individual product
  const handleToggleProduct = (productId: string, productData?: typeof filteredProducts[0]) => {
    const newSelected = new Set(selectedIds);
    const newProducts = new Map(selectedProducts);
    
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
      newProducts.delete(productId);
    } else {
      newSelected.add(productId);
      if (productData) {
        newProducts.set(productId, {
          systemId: productData.systemId,
          id: productData.id,
          name: productData.name,
          barcode: productData.barcode || undefined,
          costPrice: productData.costPrice || 0,
          thumbnailImage: productData.thumbnailImage || undefined,
        } as unknown as Product);
      }
    }
    setSelectedIds(newSelected);
    setSelectedProducts(newProducts);
  };

  // Check if all visible products are selected
  const allPageSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.has(p.systemId));

  const handleConfirm = () => {
    // Return selected products (basic data from Meilisearch)
    const selected = Array.from(selectedProducts.values());
    onConfirm(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] sm:max-h-[85vh] flex flex-col p-0 max-md:p-0">
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
              onChange={(e) => setSearch(e.target.value)}
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
          </div>

          {/* Product List with infinite scroll */}
          <div 
            ref={scrollContainerRef}
            className="h-[50vh] sm:h-[calc(90vh-280px)] overflow-y-auto"
            onScroll={handleScroll}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-3" />
                <p>Đang tìm kiếm...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mb-3" />
                <p>Không tìm thấy sản phẩm</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredProducts.map((product) => {
                  const isSelected = selectedIds.has(product.systemId);

                  return (
                    <div
                      key={product.systemId}
                      className={cn(
                        "flex items-center gap-3 sm:gap-4 px-4 sm:px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors",
                        isSelected && "bg-primary/5"
                      )}
                      onClick={() => handleToggleProduct(product.systemId, product)}
                      onKeyDown={(e) => e.key === 'Enter' && handleToggleProduct(product.systemId, product)}
                      role="button"
                      tabIndex={0}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleProduct(product.systemId, product)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      {/* Product Image */}
                      <div className="w-10 h-9 sm:w-12 sm:h-12 shrink-0 bg-muted rounded flex items-center justify-center">
                        <Package className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                      </div>

                      {/* Product Details - Mobile First */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm sm:text-base">{product.name}</p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <span>{product.id}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Loading more indicator */}
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center py-4 text-muted-foreground">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mr-2" />
                    <span className="text-sm">Đang tải thêm...</span>
                  </div>
                )}
                
                {/* Info footer */}
                {hasNextPage && (
                  <div className="text-center py-3 text-sm text-muted-foreground">
                    Cuộn xuống để tải thêm
                  </div>
                )}
              </div>
            )}
          </div>
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
