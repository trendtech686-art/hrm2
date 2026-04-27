import * as React from "react";
import { useInfiniteMeiliProductSearch } from "../../../hooks/use-meilisearch";
import { Package } from "lucide-react";
import { ProductThumbnailCell } from "../../../components/shared/read-only-products-table";
import { ImagePreviewDialog } from "../../../components/ui/image-preview-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import { cn } from "../../../lib/utils";
import type { Product } from "../../products/types";

interface BulkProductSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selectedProducts: Product[]) => void;
  excludeProductIds?: string[]; // Already added products (for display only, can still select)
  existingProductIds?: string[]; // Products already in cart
}

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
  excludeProductIds: _excludeProductIds = [],
  existingProductIds: _existingProductIds = [],
}: BulkProductSelectorDialogProps) {
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [selectedProducts, setSelectedProducts] = React.useState<Map<string, Product>>(new Map());
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // ✅ Use Meilisearch for fast product search with infinite scroll
  const { data: searchResult, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteMeiliProductSearch({ 
    query: search,
    debounceMs: 200,
  });

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedIds(new Set());
      setSelectedProducts(new Map());
    }
  }, [open]);

  // Get search results - Filter out combo products (can't import combos) - flatten all pages
  const filteredProducts = React.useMemo(() => {
    const products = searchResult?.pages.flatMap(page => page.data) || [];
    return products.filter(p => p.status !== 'combo');
  }, [searchResult]);

  // Preview state
  const [previewState, setPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
    open: false, image: '', title: ''
  });

  const handlePreview = React.useCallback((image: string, title: string) => {
    setPreviewState({ open: true, image, title });
  }, []);

  // Infinite scroll handler
  const handleScroll = React.useCallback(() => {
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
    const selected = Array.from(selectedProducts.values());
    onConfirm(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent mobileFullScreen className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chọn nhanh sản phẩm</DialogTitle>
          <DialogDescription>
            Chọn nhiều sản phẩm cùng lúc. Đã chọn: {selectedIds.size}
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Tìm kiếm tên, mã SKU, hoặc quét mã Barcode...(F3)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Table Header */}
        <div className="border rounded-lg overflow-hidden flex-1 flex flex-col">
          <div className="bg-muted/50 border-b px-4 py-2 flex items-center gap-4">
            <Checkbox
              checked={allPageSelected}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium flex-1">
              Chọn tất cả sản phẩm ({filteredProducts.length})
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
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-3" />
                <p>Đang tìm kiếm...</p>
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

                return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- product selector row
                  <div
                    key={product.systemId}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 border-b hover:bg-muted/50 cursor-pointer transition-colors",
                      isSelected && "bg-primary/5"
                    )}
                    onClick={() => handleToggleProduct(product.systemId, product)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleProduct(product.systemId, product)}
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Product Image */}
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- image cell wrapper */}
                    <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                      <ProductThumbnailCell
                        productSystemId={product.systemId}
                        product={product as unknown as Product}
                        productName={product.name}
                        onPreview={handlePreview}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.id} {product.barcode && `| ${product.barcode}`} | ĐVT: {product.unit || "Cái"}
                        </p>
                      </div>
                      <div className="text-sm text-right shrink-0">
                        <p className="text-muted-foreground">
                          Giá nhập: <span className="font-medium text-foreground">{formatCurrency(product.costPrice || 0)}</span>
                        </p>
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
              </>
            )}
          </div>
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

      {/* Image Preview Dialog */}
      <ImagePreviewDialog 
        open={previewState.open} 
        onOpenChange={(open) => setPreviewState(prev => ({ ...prev, open }))} 
        images={[previewState.image]} 
        title={previewState.title}
      />
    </Dialog>
  );
}
