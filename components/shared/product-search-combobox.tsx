import * as React from 'react';
import { Package } from 'lucide-react';
import type { Product } from '../../features/products/types';
import { useInfiniteMeiliProductSearch } from '../../hooks/use-meilisearch';
import { useProduct } from '../../hooks/api/use-products';
import { VirtualizedCombobox, type ComboboxOption } from '../ui/virtualized-combobox';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

interface ProductSearchComboboxProps {
  onSelect: (product: Product) => void;
  disabled?: boolean;
  placeholder?: string;
  excludeProductIds?: string[]; // Products already added
  showPrice?: boolean;
  showStock?: boolean;
  branchSystemId?: string; // For branch-specific stock display
}

export function ProductSearchCombobox({
  onSelect,
  disabled = false,
  placeholder = 'Tìm kiếm sản phẩm...',
  excludeProductIds = [],
  showPrice = false,
  showStock: _showStock = true,
  branchSystemId: _branchSystemId,
}: ProductSearchComboboxProps) {
  const [selectedValue, setSelectedValue] = React.useState<ComboboxOption | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [pendingProductId, setPendingProductId] = React.useState<string | null>(null);
  
  // ✅ Use Meilisearch for fast search with infinite scroll
  const { 
    data: searchResult, 
    isLoading: isSearching, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteMeiliProductSearch({ 
    query: searchQuery,
    debounceMs: 200,
  });

  // Fetch full product data when selected
  const { data: fullProduct } = useProduct(pendingProductId || '');

  // Call onSelect when full product data is loaded
  React.useEffect(() => {
    if (fullProduct && pendingProductId) {
      onSelect(fullProduct);
      setPendingProductId(null);
      setSelectedValue(null);
    }
  }, [fullProduct, pendingProductId, onSelect]);
  
  // Filter out already added products - flatten all pages
  const availableProducts = React.useMemo(() => {
    const products = searchResult?.pages.flatMap(page => page.data) || [];
    return products.filter((p) => !excludeProductIds.includes(p.systemId));
  }, [searchResult, excludeProductIds]);

  // Convert to ComboboxOption format
  const options: ComboboxOption[] = React.useMemo(() => {
    return availableProducts.map((p) => {
      return {
        value: p.systemId,
        label: p.name,
        subtitle: `${p.id}${p.barcode ? ` | ${p.barcode}` : ''}`,
        metadata: {
          price: p.price || 0,
          unit: p.unit || 'Cái',
        }
      } as ComboboxOption;
    });
  }, [availableProducts]);

  const handleChange = (option: ComboboxOption | null) => {
    if (option) {
      setPendingProductId(option.value);
    }
    setSelectedValue(null);
  };

  const renderOption = (option: ComboboxOption) => {
    const meta = option.metadata as { unit?: string; price?: number } | undefined;
    return (
      <div className="flex items-center gap-3 w-full">
        <div className="w-10 h-9 shrink-0 bg-muted rounded flex items-center justify-center">
          <Package className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{option.label}</p>
          <p className="text-xs text-muted-foreground">
            {option.subtitle}
            {meta?.unit && ` | ${meta.unit}`}
          </p>
        </div>
        {showPrice && (
          <div className="text-sm font-semibold text-right shrink-0">
            {formatCurrency(meta?.price)}
          </div>
        )}
      </div>
    );
  };

  return (
    <VirtualizedCombobox
      options={options}
      value={selectedValue}
      onChange={handleChange}
      onSearchChange={setSearchQuery}
      isLoading={isSearching || !!pendingProductId}
      placeholder={placeholder}
      searchPlaceholder="Tìm kiếm sản phẩm..."
      emptyPlaceholder="Không tìm thấy sản phẩm"
      disabled={disabled}
      onLoadMore={() => fetchNextPage()}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
      renderOption={renderOption}
    />
  );
}
