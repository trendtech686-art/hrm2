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
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
import { PackageOpen, Settings, SearchCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StagingFile } from '@/lib/file-upload-api';
import { ProductSelectionDialog } from '@/features/shared/product-selection-dialog';
import { UnifiedProductSearch } from '@/components/shared/unified-product-search';
import { toast } from 'sonner';
import type { Product } from '@/features/products/types';
import { useAllProducts } from '@/features/products/hooks/use-all-products';
import { useCustomerOrders } from '@/features/customers/hooks/use-customer-related-data';
import { useAllPricingPolicies, useDefaultSellingPolicy } from '@/features/settings/pricing/hooks/use-all-pricing-policies';

// Local imports
import { useProductImagesState, type SimpleImageFile } from '../hooks/use-product-images-state';
import { useProductSelection } from '../hooks/use-product-selection';
import { useClaimedQuantities } from '../hooks/use-claimed-quantities';
import {
  initializePermanentFiles,
  type WarrantyProductField,
} from '../utils/warranty-products-helpers';
import { WarrantyProductsSettingsDialog, type ProductsSectionSettings } from './warranty-products-settings-dialog';
import { WarrantyProductRow } from './warranty-product-row';
import { WarrantyProductMobileCard } from './warranty-product-mobile-card';

interface WarrantyProductsSectionProps {
  disabled?: boolean;
  // Callback để lấy state khi submit (gọi 1 lần, không sync liên tục)
  getImagesStateRef?: React.MutableRefObject<(() => {
    productPermanentFiles: Record<string, SimpleImageFile[]>;
    productStagingFiles: Record<string, StagingFile[]>;
    productSessionIds: Record<string, string>;
    productFilesToDelete: Record<string, string[]>;
  }) | null>;
}

// Empty arrays for default values - memoized to avoid unnecessary re-renders
const EMPTY_FILES_ARRAY: StagingFile[] = [];
const EMPTY_SIMPLE_FILES_ARRAY: SimpleImageFile[] = [];
const EMPTY_STRINGS_ARRAY: string[] = [];

export function WarrantyProductsSection({ 
  disabled = false, 
  getImagesStateRef,
}: WarrantyProductsSectionProps) {
  const { control, watch, setValue, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  // Local UI state
  const [isProductSelectionOpen, setIsProductSelectionOpen] = React.useState(false);
  const [enableSplitLine, setEnableSplitLine] = React.useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);
  const [selectedPricingPolicyId, setSelectedPricingPolicyId] = React.useState<string>('');
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
  
  // ✅ Use refs to always get latest state values when getImagesState is called
  const productPermanentFilesRef = React.useRef(productPermanentFiles);
  const productStagingFilesRef = React.useRef(productStagingFiles);
  const productSessionIdsRef = React.useRef(productSessionIds);
  const productFilesToDeleteRef = React.useRef(productFilesToDelete);
  
  // Keep refs in sync with state
  React.useEffect(() => { productPermanentFilesRef.current = productPermanentFiles; }, [productPermanentFiles]);
  React.useEffect(() => { productStagingFilesRef.current = productStagingFiles; }, [productStagingFiles]);
  React.useEffect(() => { productSessionIdsRef.current = productSessionIds; }, [productSessionIds]);
  React.useEffect(() => { productFilesToDeleteRef.current = productFilesToDelete; }, [productFilesToDelete]);
  
  // Watch customer and products
  const customer = watch('customer');
  const customerName = customer?.name || '';
  const customerSystemId = customer?.systemId || null;
  
  // ⚡ PERFORMANCE: Only fetch orders for the selected customer
  const { data: customerOrders } = useCustomerOrders(customerSystemId);

  // ✅ Lấy số lượng đã bảo hành trước đó của khách hàng
  const { claimedQuantities, claimedProductTickets, isLoading: isLoadingClaimed } = useClaimedQuantities(customerSystemId, customerName);
  
  // Pricing policies
  const { data: pricingPolicies = [] } = useAllPricingPolicies();
  const { defaultPolicy } = useDefaultSellingPolicy();
  
  // Set default policy on mount if not selected
  React.useEffect(() => {
    if (!selectedPricingPolicyId && defaultPolicy) {
      setSelectedPricingPolicyId(defaultPolicy.systemId);
    }
  }, [defaultPolicy, selectedPricingPolicyId]);
  
  // ✅ Lấy danh sách tất cả sản phẩm để hiển thị thông tin trong row
  const { data: allProducts = [] } = useAllProducts();
  
  // ✅ PERFORMANCE: Memoize mapped products để tránh re-render
  const mappedProducts = React.useMemo(() => {
    return allProducts.map(p => ({
      systemId: p.systemId,
      id: p.id,
      name: p.name,
      costPrice: p.costPrice,
      warrantyPeriodMonths: (p as { warrantyPeriodMonths?: number }).warrantyPeriodMonths,
    }));
  }, [allProducts]);
  
  const watchedProducts = watch('products');
  const products: WarrantyProductField[] = React.useMemo(() => watchedProducts || [], [watchedProducts]);

  // Danh sách product systemId đã chọn để exclude khỏi search
  const excludeProductIds = React.useMemo(() => {
    return new Set(products.map(p => p.systemId).filter(Boolean));
  }, [products]);

  // Use product selection hook
  const {
    warrantyCheckResults,
    handleSelectProduct,
    handleSelectProducts,
    checkAllProductsWarranty,
  } = useProductSelection({
    customerName,
    allOrders: customerOrders || [],
    productInsertPosition: settings.productInsertPosition,
    append,
    pricingPolicyId: selectedPricingPolicyId || undefined,
  });
  
  // ✅ Handler khi chọn sản phẩm từ UnifiedProductSearch
  const onSelectProduct = React.useCallback((product: Product) => {
    handleSelectProduct(product);
  }, [handleSelectProduct]);

  // ✅ Track if we've initialized permanent files to avoid re-running
  const hasInitializedRef = React.useRef(false);
  const productsLengthRef = React.useRef(0);
  // ✅ Track product systemIds to detect when editing a different warranty
  const lastProductIdsRef = React.useRef<string>('');

  // ===== LOAD EXISTING PRODUCT IMAGES INTO STATE (run once on mount) =====
  React.useEffect(() => {
    const currentProducts = watchedProducts || [];
    if (currentProducts.length === 0) return;
    
    // ✅ Create a signature from product systemIds to detect changes
    const productIds = currentProducts.map((p: WarrantyProductField) => p.systemId || '').join(',');
    
    // ✅ Reset initialization if this is a different set of products (different warranty)
    if (lastProductIdsRef.current !== productIds) {
      hasInitializedRef.current = false;
      lastProductIdsRef.current = productIds;
    }
    
    // Only run once per warranty
    if (hasInitializedRef.current) return;
    
    // Mark as initialized
    hasInitializedRef.current = true;
    productsLengthRef.current = currentProducts.length;
    
    const initialFiles = initializePermanentFiles(currentProducts as WarrantyProductField[]);
    if (Object.keys(initialFiles).length > 0) {
      setProductPermanentFiles(initialFiles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedProducts]); // ✅ Depend on full array to detect changes

  // ===== EXPOSE getImagesState VIA REF FOR PARENT TO CALL AT SUBMIT =====
  // ✅ Use refs to always get LATEST values when called (avoids stale closure)
  React.useEffect(() => {
    if (getImagesStateRef) {
      getImagesStateRef.current = () => {
        const state = {
          productPermanentFiles: productPermanentFilesRef.current,
          productStagingFiles: productStagingFilesRef.current,
          productSessionIds: productSessionIdsRef.current,
          productFilesToDelete: productFilesToDeleteRef.current,
        };
        return state;
      };
    }
    return () => {
      if (getImagesStateRef) {
        getImagesStateRef.current = null;
      }
    };
  }, [getImagesStateRef]); // Only depend on ref itself, function reads from refs

  return (
    <Card className={cn(mobileBleedCardClass, 'flex flex-col')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Danh sách sản phẩm bảo hành</CardTitle>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              id="split-line"
              checked={enableSplitLine}
              onCheckedChange={setEnableSplitLine}
              disabled={disabled}
            />
            <Label htmlFor="split-line" className="text-sm font-normal cursor-pointer">
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

      <CardContent className="space-y-4">
        {/* Product search + controls row */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
          <div className="flex-1 min-w-0">
            <UnifiedProductSearch
              onSelectProduct={onSelectProduct}
              excludeProductIds={excludeProductIds}
              disabled={disabled}
              placeholder="Thêm sản phẩm bảo hành (F3)"
              searchPlaceholder="Tìm kiếm theo tên, mã SKU, barcode..."
              showCostPrice={true}
              allowCreateNew={false}
            />
          </div>

          {/* Dropdown chọn bảng giá */}
          <Select value={selectedPricingPolicyId} onValueChange={setSelectedPricingPolicyId}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Chọn bảng giá" />
            </SelectTrigger>
            <SelectContent>
              {pricingPolicies
                .filter(p => p.type === 'Bán hàng')
                .map(policy => (
                  <SelectItem key={policy.systemId} value={policy.systemId}>
                    {policy.name} {policy.isDefault && '(Mặc định)'}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsProductSelectionOpen(true)}
            disabled={disabled}
            className="w-full sm:w-auto"
          >
            Chọn nhanh
          </Button>

          {/* Nút kiểm tra bảo hành */}
          <Button
            type="button"
            variant="default"
            onClick={() => {
              if (!customerName) {
                toast.warning('Vui lòng chọn khách hàng trước khi kiểm tra bảo hành');
                return;
              }
              if (products.length === 0) {
                toast.warning('Vui lòng thêm ít nhất 1 sản phẩm để kiểm tra bảo hành');
                return;
              }
              checkAllProductsWarranty(products, customerName, customerOrders || [], claimedQuantities, claimedProductTickets);
            }}
            disabled={disabled}
            title="Kiểm tra bảo hành các sản phẩm đã chọn"
            className="w-full sm:w-auto"
          >
            <SearchCheck className="h-4 w-4 mr-2" />
            Kiểm tra BH
          </Button>

          {/* Nút đánh dấu sản phẩm chưa mua thành "Trả lại" - cùng hàng với nút kiểm tra BH */}
          {Object.values(warrantyCheckResults).some(r => r?.warnings.some(w => w.includes('chưa từng mua'))) && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
            onClick={() => {
              let count = 0;
              // Lấy toàn bộ products từ form
              const allProducts = getValues('products');
              if (!allProducts || !Array.isArray(allProducts)) return;

              fields.forEach((field, idx) => {
                const typedField = field as unknown as WarrantyProductField;
                const result = warrantyCheckResults[typedField.productName];
                if (result?.warnings?.some((w: string) => w.includes('chưa từng mua'))) {
                  // Update trực tiếp vào array
                  if (allProducts[idx]) {
                    allProducts[idx] = {
                      ...allProducts[idx],
                      resolution: 'return', // Trả lại
                      issueDescription: `❌ Khách hàng chưa từng mua "${typedField.productName}"`,
                    };
                    count++;
                  }
                }
              });

              if (count > 0) {
                // Reset với products đã được update
                setValue('products', allProducts, { shouldValidate: true });
                toast.success(`Đã đánh dấu ${count} sản phẩm chưa mua thành "Trả lại"`);
              }
            }}
              disabled={disabled}
              title="Đánh dấu các sản phẩm chưa mua thành Trả lại"
              className="w-full sm:w-auto"
            >
              <span className="mr-1">❌</span>
              Chưa mua → Trả lại
            </Button>
          )}
        </div>

        {/* Products table */}
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
            <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Chưa có sản phẩm nào</p>
            <p className="text-xs text-muted-foreground mt-1">
              Sử dụng ô tìm kiếm bên trên để thêm sản phẩm
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* ===== DESKTOP: Table editable nguyên trạng ===== */}
            <div className="hidden md:block border rounded-lg overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">STT</TableHead>
                    <TableHead className="w-30">Sản phẩm</TableHead>
                    <TableHead className="w-24">Số lượng</TableHead>
                    <TableHead className="w-65">Đơn giá</TableHead>
                    <TableHead className="w-35">Hình ảnh BH</TableHead>
                    <TableHead className="w-28">Kết quả</TableHead>
                    <TableHead className="min-w-45">Ghi chú</TableHead>
                    <TableHead className="w-32 text-right">Thành tiền</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    const typedField = field as unknown as WarrantyProductField;
                    const productSystemId = typedField.systemId || '';
                    // Lấy kết quả kiểm tra BH cho sản phẩm này
                    const checkResult = warrantyCheckResults[typedField.productName];

                    return (
                      <WarrantyProductRow
                        key={field.id}
                        index={index}
                        field={typedField}
                        control={control}
                        availableProducts={mappedProducts}
                        disabled={disabled}
                        permanentFiles={productPermanentFiles[productSystemId] || EMPTY_SIMPLE_FILES_ARRAY}
                        stagingFiles={productStagingFiles[productSystemId] || EMPTY_FILES_ARRAY}
                        sessionId={productSessionIds[productSystemId]}
                        filesToDelete={productFilesToDelete[productSystemId] || EMPTY_STRINGS_ARRAY}
                        onMarkForDeletion={(fileId) => handleMarkForDeletion(productSystemId, fileId)}
                        onStagingFilesChange={(files) => handleStagingFilesChange(productSystemId, files)}
                        onSessionChange={(sessionId) => handleSessionChange(productSystemId, sessionId)}
                        onRemove={() => remove(index)}
                        warrantyCheckResult={checkResult}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* ===== MOBILE: MobileCard stack ===== */}
            <div className="md:hidden space-y-3">
              {fields.map((field, index) => {
                const typedField = field as unknown as WarrantyProductField;
                const productSystemId = typedField.systemId || '';
                const checkResult = warrantyCheckResults[typedField.productName];

                return (
                  <WarrantyProductMobileCard
                    key={field.id}
                    index={index}
                    field={typedField}
                    control={control}
                    availableProducts={mappedProducts}
                    disabled={disabled}
                    permanentFiles={productPermanentFiles[productSystemId] || EMPTY_SIMPLE_FILES_ARRAY}
                    stagingFiles={productStagingFiles[productSystemId] || EMPTY_FILES_ARRAY}
                    sessionId={productSessionIds[productSystemId]}
                    filesToDelete={productFilesToDelete[productSystemId] || EMPTY_STRINGS_ARRAY}
                    onMarkForDeletion={(fileId) => handleMarkForDeletion(productSystemId, fileId)}
                    onStagingFilesChange={(files) => handleStagingFilesChange(productSystemId, files)}
                    onSessionChange={(sessionId) => handleSessionChange(productSystemId, sessionId)}
                    onRemove={() => remove(index)}
                    warrantyCheckResult={checkResult}
                  />
                );
              })}
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
