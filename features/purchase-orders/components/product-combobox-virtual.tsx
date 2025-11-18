import * as React from "react";
import { Plus, Package } from "lucide-react";
import { useProductStore } from "../../products/store.ts";
import { VirtualizedCombobox, type ComboboxOption } from "../../../components/ui/virtualized-combobox.tsx";
import { QuickAddProductDialog } from "../../products/components/quick-add-product-dialog.tsx";

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
  className,
  excludeProductIds = [],
}: ProductComboboxProps) {
  const { data: products, getActive } = useProductStore();
  const [showAddDialog, setShowAddDialog] = React.useState(false);

  // Only show active products not yet added
  const availableProducts = React.useMemo(() => {
    const active = getActive();
    return active.filter((p) => !excludeProductIds.includes(p.systemId));
  }, [products, excludeProductIds]);

  // Find selected product
  const selectedProduct = React.useMemo(
    () => availableProducts.find((p) => p.systemId === value),
    [availableProducts, value]
  );

  // Calculate total inventory (on-hand stock)
  const getTotalInventory = (product: any): number => {
    if (!product.inventoryByBranch) return 0;
    const values = Object.values(product.inventoryByBranch) as number[];
    return values.reduce((sum: number, qty: number) => sum + (qty || 0), 0);
  };

  // Calculate available stock (on-hand - committed)
  const getAvailableStock = (product: any): number => {
    const onHand = getTotalInventory(product);
    if (!product.committedByBranch) return onHand;
    const committedValues = Object.values(product.committedByBranch) as number[];
    const committed: number = committedValues.reduce((sum: number, qty: number) => sum + (qty || 0), 0);
    return onHand - committed;
  };

  // Convert to ComboboxOption format with "Add new" button at top
  const options: ComboboxOption[] = React.useMemo(() => {
    const addNewOption: ComboboxOption = {
      value: ADD_NEW_VALUE,
      label: "Thêm mới sản phẩm",
      subtitle: "",
    };

    const productOptions: ComboboxOption[] = availableProducts.map((p) => {
      const totalStock = getTotalInventory(p);
      const availableStock = getAvailableStock(p);
      return {
        value: p.systemId,
        label: p.name,
        subtitle: p.id,
        metadata: {
          costPrice: p.costPrice,
          stock: totalStock,
          availableStock: availableStock,
        }
      } as ComboboxOption;
    });

    return [addNewOption, ...productOptions];
  }, [availableProducts]);

  // Selected value in ComboboxOption format
  const selectedValue: ComboboxOption | null = selectedProduct
    ? ({
        value: selectedProduct.systemId,
        label: selectedProduct.name,
        subtitle: selectedProduct.id,
        metadata: {
          costPrice: selectedProduct.costPrice,
          stock: getTotalInventory(selectedProduct),
          availableStock: getAvailableStock(selectedProduct),
        }
      } as ComboboxOption)
    : null;

  const handleChange = (option: ComboboxOption | null) => {
    if (option?.value === ADD_NEW_VALUE) {
      setShowAddDialog(true);
    } else {
      onValueChange(option?.value || "");
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
        placeholder={placeholder}
        searchPlaceholder="Tìm kiếm tên, mã SKU, Barcode..."
        emptyPlaceholder="Không tìm thấy sản phẩm"
        estimatedItemHeight={64}
        renderOption={(option, isSelected) => {
          // Special render for "Add new" button
          if (option.value === ADD_NEW_VALUE) {
            return (
              <div className="flex items-center gap-2 text-primary">
                <Plus className="h-4 w-4" />
                <span className="font-medium">{option.label}</span>
              </div>
            );
          }

          // Normal product render - giống bulk selector
          const meta = (option as any).metadata;
          return (
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-9 flex-shrink-0 bg-muted rounded flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{option.label}</p>
                  {option.subtitle && (
                    <p className="text-xs text-muted-foreground">{option.subtitle}</p>
                  )}
                </div>
                {meta && (
                  <div className="text-xs text-right space-y-0.5 flex-shrink-0">
                    <p className="text-muted-foreground">
                      Giá: <span className="font-medium text-foreground">{formatCurrency(meta.costPrice)}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Tồn: <span className="font-medium text-foreground">{meta.stock}</span> | 
                      Có thể bán: <span className={`font-medium ${meta.availableStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {meta.availableStock}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              {isSelected && (
                <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
