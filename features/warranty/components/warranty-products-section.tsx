'use client';

/**
 * Warranty Products Section - Refactored version
 * 
 * Tách từ file gốc 909 dòng:
 * - use-product-images-state.ts: Hook quản lý state hình ảnh per-product
 * - use-product-selection.ts: Hook xử lý chọn sản phẩm + warranty check
 * - warranty-products-helpers.ts: Helper functions & CSS styles
 * - warranty-products-settings-dialog.tsx: Settings dialog component
 * - warranty-product-row.tsx: Product row component
 */
import * as React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { StagingFile } from '@/lib/file-upload-api';
import { VirtualizedCombobox, type ComboboxOption } from '@/components/ui/virtualized-combobox';
import { ProductSelectionDialog } from '@/features/shared/product-selection-dialog';
import { useProductStore } from '@/features/products/store';
import { useAllOrders } from '@/features/orders/hooks/use-all-orders';

// Local imports
import { useProductImagesState, type SimpleImageFile } from '../hooks/use-product-images-state';
import { useProductSelection } from '../hooks/use-product-selection';
import {
  initializePermanentFiles,
  syncFilesToProductImages,
  filterDeletedImagesFromProducts,
  type WarrantyProductField,
} from '../utils/warranty-products-helpers';
import { WarrantyProductsSettingsDialog, type ProductsSectionSettings } from './warranty-products-settings-dialog';
import { WarrantyProductRow } from './warranty-product-row';

interface WarrantyProductsSectionProps {
  disabled?: boolean;
  onProductImagesStateChange?: (data: {
    productPermanentFiles: Record<string, SimpleImageFile[]>;
    productStagingFiles: Record<string, StagingFile[]>;
    productSessionIds: Record<string, string>;
    productFilesToDelete: Record<string, string[]>;
  }) => void;
}

export function WarrantyProductsSection({ 
  disabled = false, 
  onProductImagesStateChange 
}: WarrantyProductsSectionProps) {
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  // Local UI state
  const [isProductSelectionOpen, setIsProductSelectionOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<ComboboxOption | null>(null);
  const [enableSplitLine, setEnableSplitLine] = React.useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);
  const [settings, setSettings] = React.useState<ProductsSectionSettings>({
    discountDefaultType: 'value',
    productInsertPosition: 'top',
  });

  // Use extracted hooks
  const {
    productPermanentFiles,
    productStagingFiles,
    productSessionIds,
    productFilesToDelete,
    setProductPermanentFiles,
    handleMarkForDeletion,
    handleStagingFilesChange,
    handleSessionChange,
  } = useProductImagesState();

  // Store data
  const { getActive } = useProductStore();
  const { data: allOrders } = useAllOrders();
  
  // Watch customer and products
  const customer = watch('customer');
  const customerName = customer?.name || '';
  const watchedProducts = watch('products');
  const products: WarrantyProductField[] = React.useMemo(() => watchedProducts || [], [watchedProducts]);

  // Use product selection hook
  const { handleSelectProduct, handleSelectProducts } = useProductSelection({
    customerName,
    allOrders: allOrders || [],
    productInsertPosition: settings.productInsertPosition,
    append,
  });

  // Get active products for combobox
  const availableProducts = React.useMemo(() => getActive(), [getActive]);

  const productOptions: ComboboxOption[] = React.useMemo(() => {
    return availableProducts.map((p) => ({
      value: p.systemId,
      label: p.name,
      subtitle: p.id,
      metadata: {
        costPrice: p.costPrice || 0,
      },
    }));
  }, [availableProducts]);

  // ===== LOAD EXISTING PRODUCT IMAGES INTO STATE =====
  React.useEffect(() => {
    const initialFiles = initializePermanentFiles(products);
    if (Object.keys(initialFiles).length > 0) {
      setProductPermanentFiles(prev => {
        // Only update if there are new products with images
        const newProducts = Object.keys(initialFiles).filter(key => !prev[key]);
        if (newProducts.length === 0) return prev;
        return { ...prev, ...initialFiles };
      });
    }
  }, [products, setProductPermanentFiles]);

  // ===== SYNC STATE TO FORM =====
  React.useEffect(() => {
    const updatedProducts = syncFilesToProductImages(products, productPermanentFiles, productStagingFiles);
    if (JSON.stringify(updatedProducts) !== JSON.stringify(products)) {
      setValue('products', updatedProducts, { shouldDirty: false });
    }
  }, [productPermanentFiles, productStagingFiles, products, setValue]);

  // ===== NOTIFY PARENT OF STATE CHANGES =====
  React.useEffect(() => {
    onProductImagesStateChange?.({
      productPermanentFiles,
      productStagingFiles,
      productSessionIds,
      productFilesToDelete,
    });
  }, [productPermanentFiles, productStagingFiles, productSessionIds, productFilesToDelete, onProductImagesStateChange]);

  // ===== AUTO-FILTER MARKED IMAGES =====
  React.useEffect(() => {
    const { updatedProducts, hasChanges } = filterDeletedImagesFromProducts(products, productFilesToDelete);
    if (hasChanges) {
      setValue('products', updatedProducts, { shouldDirty: true });
    }
  }, [productFilesToDelete, products, setValue]);

  // Combobox handler
  const handleComboboxChange = (option: ComboboxOption | null) => {
    if (option) {
      const product = availableProducts.find((p) => p.systemId === option.value);
      if (product) {
        handleSelectProduct(product);
      }
    }
    setSelectedValue(null);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-h4">Danh sách sản phẩm bảo hành</CardTitle>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              id="split-line"
              checked={enableSplitLine}
              onCheckedChange={setEnableSplitLine}
              disabled={disabled}
            />
            <Label htmlFor="split-line" className="text-body-sm font-normal cursor-pointer">
              Tách dòng
            </Label>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowSettingsDialog(true)}
            disabled={disabled}
            title="Tùy chỉnh hiển thị"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Product search */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <VirtualizedCombobox
              options={productOptions}
              value={selectedValue}
              onChange={handleComboboxChange}
              placeholder="Thêm sản phẩm (F3)"
              searchPlaceholder="Tìm kiếm theo tên, mã SKU..."
              disabled={disabled}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsProductSelectionOpen(true)}
            disabled={disabled}
          >
            Chọn nhanh
          </Button>
        </div>

        {/* Products table */}
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
            <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-body-sm text-muted-foreground">Chưa có sản phẩm nào</p>
            <p className="text-body-xs text-muted-foreground mt-1">
              Sử dụng ô tìm kiếm bên trên để thêm sản phẩm
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-auto">
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">STT</TableHead>
                    <TableHead className="w-[220px]">Tên sản phẩm</TableHead>
                    <TableHead className="w-[90px]">Số lượng</TableHead>
                    <TableHead className="w-[160px]">Đơn giá</TableHead>
                    <TableHead className="w-[280px]">Hình ảnh</TableHead>
                    <TableHead className="w-[110px]">Kết quả</TableHead>
                    <TableHead className="w-[280px]">Ghi chú</TableHead>
                    <TableHead className="w-[130px] text-right">Thành tiền</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    const typedField = field as unknown as WarrantyProductField;
                    const productSystemId = typedField.systemId || '';
                    
                    return (
                      <WarrantyProductRow
                        key={field.id}
                        index={index}
                        field={typedField}
                        control={control}
                        availableProducts={availableProducts.map(p => ({
                          systemId: p.systemId,
                          id: p.id,
                          name: p.name,
                          costPrice: p.costPrice,
                          warrantyPeriodMonths: p.warrantyPeriodMonths,
                        }))}
                        disabled={disabled}
                        permanentFiles={productPermanentFiles[productSystemId] || []}
                        stagingFiles={productStagingFiles[productSystemId] || []}
                        sessionId={productSessionIds[productSystemId]}
                        filesToDelete={productFilesToDelete[productSystemId] || []}
                        onMarkForDeletion={(fileId) => handleMarkForDeletion(productSystemId, fileId)}
                        onStagingFilesChange={(files) => handleStagingFilesChange(productSystemId, files)}
                        onSessionChange={(sessionId) => handleSessionChange(productSystemId, sessionId)}
                        onRemove={() => remove(index)}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>

      {/* Product selection dialog */}
      <ProductSelectionDialog
        isOpen={isProductSelectionOpen}
        onOpenChange={setIsProductSelectionOpen}
        onSelect={handleSelectProducts}
      />

      {/* Settings dialog */}
      <WarrantyProductsSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </Card>
  );
}
