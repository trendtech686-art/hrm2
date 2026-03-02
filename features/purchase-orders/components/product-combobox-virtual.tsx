import * as React from "react";
import { Plus, Package } from "lucide-react";
import { useProduct } from "../../../hooks/api/use-products";
import { useInfiniteMeiliProductSearch } from "../../../hooks/use-meilisearch";
import { VirtualizedCombobox, type ComboboxOption } from "../../../components/ui/virtualized-combobox";
import { QuickAddProductDialog } from "../../products/components/quick-add-product-dialog";

interface ProductComboboxProps {
  value?: string; // product systemId
  onValueChange: (productId: string) => void;
  placeholder?: string;
  className?: string;
  excludeProductIds?: string[]; // Products already added
}

const ADD_NEW_VALUE = "__ADD_NEW__";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export function ProductCombobox({
  value,
  onValueChange,
  placeholder = "Tìm kiếm sản phẩm...",
  className: _className,
  excludeProductIds = [],
}: ProductComboboxProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [pendingProductId, setPendingProductId] = React.useState<string | null>(null);
  
  // ✅ Use Meilisearch for fast product search
  // ✅ Infinite scroll support - load more on scroll
  const {
    data: searchResult,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMeiliProductSearch({ 
    query: searchQuery,
    debounceMs: 150,
  });
  
  // ✅ Fetch full product data when selected from Meilisearch
  const { data: selectedProduct } = useProduct(pendingProductId ?? value ?? undefined);
  
  // When full product is loaded, call onValueChange
  React.useEffect(() => {
    if (selectedProduct && pendingProductId) {
      onValueChange(selectedProduct.systemId);
      setPendingProductId(null);
    }
  }, [selectedProduct, pendingProductId, onValueChange]);
  
  // ✅ Filter Meilisearch results (exclude already added and combo products) - flatten pages
  const searchProducts = React.useMemo(() => {
    const products = searchResult?.pages.flatMap(page => page.data) || [];
    return products.filter(p => 
      !excludeProductIds.includes(p.systemId) && 
      p.status !== 'combo'
    );
  }, [searchResult, excludeProductIds]);

  // Convert to ComboboxOption format with "Add new" button at top
  const options: ComboboxOption[] = React.useMemo(() => {
    const addNewOption: ComboboxOption = {
      value: ADD_NEW_VALUE,
      label: "Thêm mới sản phẩm",
      subtitle: "",
    };

    const productOptions: ComboboxOption[] = searchProducts.map((p) => {
      return {
        value: p.systemId,
        label: p.name,
        subtitle: p.id,
        metadata: {
          costPrice: p.costPrice || 0,
        }
      } as ComboboxOption;
    });

    return [addNewOption, ...productOptions];
  }, [searchProducts]);

  // Selected value in ComboboxOption format
  const selectedValue: ComboboxOption | null = selectedProduct
    ? ({
        value: selectedProduct.systemId,
        label: selectedProduct.name,
        subtitle: selectedProduct.id,
        metadata: {
          costPrice: selectedProduct.costPrice,
        }
      } as ComboboxOption)
    : null;

  const handleChange = (option: ComboboxOption | null) => {
    if (option?.value === ADD_NEW_VALUE) {
      setShowAddDialog(true);
    } else if (option) {
      // Set pending product ID to trigger full product fetch
      setPendingProductId(option.value);
    }
  };

  const handleAddSuccess = (productId: string) => {
    onValueChange(productId);
  };

  return (
    <>
      <VirtualizedCombobox
        value={selectedValue}
        onChange={handleChange}
        options={options}
        onSearchChange={setSearchQuery}
        isLoading={isLoading || !!pendingProductId}
        placeholder={placeholder}
        searchPlaceholder="Tìm kiếm tên, mã SKU, Barcode..."
        emptyPlaceholder="Không tìm thấy sản phẩm"
        estimatedItemHeight={64}
        onLoadMore={() => fetchNextPage()}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        renderOption={(option, isSelected) => {
          // Special render for "Add new" button
          if (option.value === ADD_NEW_VALUE) {
            return (
              <div className="flex items-center gap-2 text-primary">
                <Plus className="h-4 w-4" />
                <span className="text-body-sm font-medium">{option.label}</span>
              </div>
            );
          }

          // Normal product render - simplified for Meilisearch
          const meta = (option as { metadata?: { costPrice?: number } }).metadata;
          return (
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-9 shrink-0 bg-muted rounded flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-medium truncate">{option.label}</p>
                  {option.subtitle && (
                    <p className="text-body-xs text-muted-foreground">{option.subtitle}</p>
                  )}
                </div>
                {meta && (
                  <div className="text-body-xs text-right shrink-0">
                    <p className="text-muted-foreground">
                      Giá: <span className="font-medium text-foreground">{formatCurrency(meta.costPrice ?? 0)}</span>
                    </p>
                  </div>
                )}
              </div>
              {isSelected && (
                <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          );
        }}
      />

      <QuickAddProductDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleAddSuccess}
      />
    </>
  );
}
