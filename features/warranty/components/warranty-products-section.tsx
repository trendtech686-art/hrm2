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
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { StagingFile } from '@/lib/file-upload-api';
import { ProductSelectionDialog } from '@/features/shared/product-selection-dialog';
// ✅ Use UnifiedProductSearch giống trang đơn hàng, có ảnh, giá, tồn kho
import { UnifiedProductSearch } from '@/components/shared/unified-product-search';
import { BarcodeScannerButton } from '@/components/shared/barcode-scanner-button';
import { toast } from 'sonner';
import type { Product } from '@/features/products/types';
import { useAllProducts } from '@/features/products/hooks/use-all-products';
import { useCustomerOrders } from '@/features/customers/hooks/use-customer-related-data';
import { useAllPricingPolicies, useDefaultSellingPolicy } from '@/features/settings/pricing/hooks/use-all-pricing-policies';

// Local imports
import { useProductImagesState, type SimpleImageFile } from '../hooks/use-product-images-state';
import { useProductSelection } from '../hooks/use-product-selection';
import {
  initializePermanentFiles,
  checkMultipleProductsWarranty,
  type WarrantyProductField,
  type WarrantyCheckResult,
} from '../utils/warranty-products-helpers';
import { getWarrantyStatusBadge } from '../utils/warranty-checker';
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
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  // Local UI state
  const [isProductSelectionOpen, setIsProductSelectionOpen] = React.useState(false);
  const [enableSplitLine, setEnableSplitLine] = React.useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);
  const [showWarrantyCheckDialog, setShowWarrantyCheckDialog] = React.useState(false);
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
  const { handleSelectProduct, handleSelectProducts } = useProductSelection({
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

      <CardContent className="space-y-6">
        {/* Product search - Giống trang đơn hàng */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[200px]">
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
            <SelectTrigger className="w-[180px]">
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
          >
            Chọn nhanh
          </Button>
          
          {/* Nút kiểm tra bảo hành */}
          <Button
            type="button"
            variant="default"
            onClick={() => setShowWarrantyCheckDialog(true)}
            disabled={disabled || !customerName || products.length === 0}
            title="Kiểm tra bảo hành các sản phẩm đã chọn"
          >
            <SearchCheck className="h-4 w-4 mr-2" />
            Kiểm tra BH
          </Button>
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

      {/* Dialog kiểm tra bảo hành */}
      <WarrantyCheckDialog
        open={showWarrantyCheckDialog}
        onOpenChange={setShowWarrantyCheckDialog}
        customerName={customerName}
        products={products}
        allOrders={customerOrders || []}
      />
    </Card>
  );
}

// ============================================
// Warranty Check Dialog Component
// ============================================
interface WarrantyCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  products: WarrantyProductField[];
  allOrders: import('@/features/orders/types').Order[];
}

function WarrantyCheckDialog({
  open,
  onOpenChange,
  customerName,
  products,
  allOrders,
}: WarrantyCheckDialogProps) {
  const [checkResults, setCheckResults] = React.useState<Record<string, WarrantyCheckResult>>({});
  const [hasChecked, setHasChecked] = React.useState(false);

  const handleCheck = React.useCallback(() => {
    if (!customerName || products.length === 0) return;

    // Convert WarrantyProductField to ProductForSelection
    const productsForCheck = products.map(p => ({
      systemId: p.productSystemId || p.systemId || '',
      id: p.sku || '',
      name: p.productName || '',
      costPrice: p.unitPrice,
      warrantyPeriodMonths: 12, // Default warranty period
    }));

    // Call checkMultipleProductsWarranty once with all products
    const { results } = checkMultipleProductsWarranty(
      customerName,
      productsForCheck,
      allOrders
    );

    setCheckResults(results);
    setHasChecked(true);
  }, [customerName, products, allOrders]);

  const summary = React.useMemo(() => {
    const allValid = Object.values(checkResults).every(r => r.isValid);
    const someValid = Object.values(checkResults).some(r => r.isValid && r.availableQuantity > 0);
    const totalAvailable = Object.values(checkResults).reduce((sum, r) => sum + r.availableQuantity, 0);
    const totalExpired = Object.values(checkResults).reduce((sum, r) => sum + r.totalExpired, 0);
    return { allValid, someValid, totalAvailable, totalExpired };
  }, [checkResults]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Kiểm tra bảo hành</DialogTitle>
          <DialogDescription>
            {customerName ? `Khách hàng: ${customerName}` : 'Chưa chọn khách hàng'}
            {products.length > 0 && ` - ${products.length} sản phẩm`}
          </DialogDescription>
        </DialogHeader>

        {!hasChecked ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              Bấm nút bên dưới để kiểm tra bảo hành cho các sản phẩm đã chọn
            </p>
            <Button onClick={handleCheck} disabled={!customerName || products.length === 0}>
              <SearchCheck className="h-4 w-4 mr-2" />
              Kiểm tra bảo hành
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Summary */}
            <div className="flex gap-4 text-sm">
              {summary.someValid ? (
                <div className="flex items-center gap-2 text-green-600">
                  <span className="font-medium">{summary.totalAvailable} sản phẩm</span>
                  <span>còn bảo hành</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <span className="font-medium">Không có sản phẩm nào còn bảo hành</span>
                </div>
              )}
              {summary.totalExpired > 0 && (
                <div className="flex items-center gap-2 text-orange-600">
                  <span>{summary.totalExpired} sản phẩm</span>
                  <span>đã hết hạn</span>
                </div>
              )}
            </div>

            {/* Product results */}
            {Object.entries(checkResults).map(([productName, result]) => {
              const badge = getWarrantyStatusBadge(
                result.availableQuantity > 0
                  ? Math.max(...result.productHistory.filter(h => !h.isExpired).map(h => h.daysRemaining))
                  : -1
              );

              return (
                <div key={productName} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{productName}</h4>
                    <Badge variant={badge.variant as 'default' | 'success' | 'warning' | 'destructive'}>
                      {badge.label}
                    </Badge>
                  </div>

                  {result.warnings.length > 0 && (
                    <div className="space-y-1">
                      {result.warnings.map((warning, i) => (
                        <p key={i} className="text-sm text-muted-foreground whitespace-pre-line">
                          {warning}
                        </p>
                      ))}
                    </div>
                  )}

                  {result.productHistory.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <p>Mua lần đầu: {result.productHistory[0]?.orderDate}</p>
                      <p>Tổng đã mua: {result.totalPurchased} cái</p>
                      {result.totalStillUnderWarranty > 0 && (
                        <p className="text-green-600">Còn bảo hành: {result.totalStillUnderWarranty} cái</p>
                      )}
                      {result.totalExpired > 0 && (
                        <p className="text-red-600">Đã hết hạn: {result.totalExpired} cái</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {hasChecked && (
            <Button variant="outline" onClick={handleCheck}>
              Kiểm tra lại
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
