import * as React from 'react';
import { Package } from 'lucide-react';
import type { Product } from '../../features/products/types';
import { useProductStore } from '../../features/products/store';
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
  showStock = true,
  branchSystemId,
}: ProductSearchComboboxProps) {
  const { data: allProducts, getActive } = useProductStore();
  const [selectedValue, setSelectedValue] = React.useState<ComboboxOption | null>(null);

  // Only show active products not yet added
  const availableProducts = React.useMemo(() => {
    const active = getActive();
    return active.filter(p => !excludeProductIds.includes(p.systemId));
  }, [allProducts, getActive, excludeProductIds]);

  // Get total inventory across ALL branches
  const getInventory = (product: Product): number => {
    const inventoryByBranch = product.inventoryByBranch || {};
    return Object.values(inventoryByBranch).reduce((sum, qty) => sum + qty, 0);
  };

  // Get total available stock across ALL branches
  const getAvailableStock = (product: Product): number => {
    const onHand = Object.values(product.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0);
    const committed = Object.values(product.committedByBranch || {}).reduce((sum, qty) => sum + qty, 0);
    return onHand - committed;
  };

  // Convert to ComboboxOption format
  const options: ComboboxOption[] = React.useMemo(() => {
    return availableProducts.map((p) => {
      const stock = getInventory(p);
      const availableStock = getAvailableStock(p);
      const price = Object.values(p.prices || {})[0] || 0;
      
      return {
        value: p.systemId,
        label: p.name,
        subtitle: p.id,
        metadata: {
          price,
          stock,
          availableStock,
          unit: p.unit || 'Cái',
        }
      } as ComboboxOption;
    });
  }, [availableProducts]);

  const handleChange = (option: ComboboxOption | null) => {
    if (option) {
      const product = availableProducts.find(p => p.systemId === option.value);
      if (product) {
        onSelect(product);
      }
    }
    
    // Reset selection after selecting
    setSelectedValue(null);
  };

  const renderOption = (option: ComboboxOption) => {
    return (
      <div className="flex items-center gap-3 w-full">
        <div className="w-10 h-9 flex-shrink-0 bg-muted rounded flex items-center justify-center">
          <Package className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{option.label}</p>
          <p className="text-xs text-muted-foreground">
            {option.subtitle}
            {option.metadata?.unit && ` | ${option.metadata.unit}`}
            {showStock && ` | Tồn: ${option.metadata?.stock || 0}`}
            {showStock && ` | Có thể bán: ${option.metadata?.availableStock || 0}`}
          </p>
        </div>
        {showPrice && (
          <div className="text-sm font-semibold text-right flex-shrink-0">
            {formatCurrency(option.metadata?.price)}
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
      placeholder={placeholder}
      searchPlaceholder="Tìm kiếm theo tên, mã SKU, barcode..."
      emptyPlaceholder="Không tìm thấy sản phẩm"
      disabled={disabled}
      renderOption={renderOption}
    />
  );
}
