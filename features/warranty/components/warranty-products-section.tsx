import * as React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { PackageOpen, Trash2, Settings } from 'lucide-react';
import { Button } from '../../../components/ui/button.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { NumberInput } from '../../../components/ui/number-input.tsx';
import { CurrencyInput } from '../../../components/ui/currency-input.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table.tsx';
import { Switch } from '../../../components/ui/switch.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group.tsx';
import type { StagingFile } from '../../../lib/file-upload-api.ts';
import { VirtualizedCombobox, type ComboboxOption } from '../../../components/ui/virtualized-combobox.tsx';
import { ProductSelectionDialog } from '../../shared/product-selection-dialog.tsx';
import { useProductStore } from '../../products/store.ts';
import type { Product } from '../../products/types.ts';
import { checkWarrantyStatus, type WarrantyCheckResult } from '../utils/warranty-checker.ts';
import { useOrderStore } from '../../orders/store.ts';
import { toast } from 'sonner';
import { ExistingDocumentsViewer } from '../../../components/ui/existing-documents-viewer.tsx';
import { NewDocumentsUpload } from '../../../components/ui/new-documents-upload.tsx';

interface WarrantyProductsSectionProps {
  disabled?: boolean;
  onProductImagesStateChange?: (data: {
    productPermanentFiles: Record<string, StagingFile[]>;
    productStagingFiles: Record<string, StagingFile[]>;
    productSessionIds: Record<string, string | null>;
    productFilesToDelete: Record<string, string[]>;
  }) => void;
}

/**
 * Danh sách sản phẩm bảo hành - INLINE VERSION
 * 
 * - Ghi chú: Textarea inline trong table (như Product form)
 * - Hình ảnh: ImageUploadManager inline, mở rộng khi click
 * - Không dùng dialog popup
 */
export function WarrantyProductsSection({ disabled = false, onProductImagesStateChange }: WarrantyProductsSectionProps) {
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const [isProductSelectionOpen, setIsProductSelectionOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<ComboboxOption | null>(null);
  const [enableSplitLine, setEnableSplitLine] = React.useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);
  const [discountDefaultType, setDiscountDefaultType] = React.useState<'value' | 'percent'>('value');
  const [productInsertPosition, setProductInsertPosition] = React.useState<'top' | 'bottom'>('top');
  
  // ===== IMAGE UPLOAD STATE - PER PRODUCT (like receivedImages pattern) =====
  // Separate state for permanent and staging files per product
  const [productPermanentFiles, setProductPermanentFiles] = React.useState<Record<string, StagingFile[]>>({});
  const [productStagingFiles, setProductStagingFiles] = React.useState<Record<string, StagingFile[]>>({});
  const [productSessionIds, setProductSessionIds] = React.useState<Record<string, string | null>>({});
  const [productFilesToDelete, setProductFilesToDelete] = React.useState<Record<string, string[]>>({});
  
  // Warranty check results
  const [warrantyCheckResults, setWarrantyCheckResults] = React.useState<Record<string, WarrantyCheckResult>>({});

  const { data: allProducts, getActive } = useProductStore();
  const { data: allOrders } = useOrderStore();
  
  // Watch customer name
  const customer = watch('customer');
  const customerName = customer?.name || '';
  
  // Watch products to filter marked images before save
  const products = watch('products') || [];
  
  // ===== LOAD EXISTING PRODUCT IMAGES INTO STATE (on mount / products change) =====
  React.useEffect(() => {
    // Load existing product images into separate state
    products.forEach((product: any) => {
      if (!product.systemId) return;
      
      const productSystemId = product.systemId;
      const images = product.productImages || [];
      
      // Only load if not already loaded
      if (productPermanentFiles[productSystemId] || productStagingFiles[productSystemId]) {
        return; // Already loaded
      }
      
      // Split permanent vs staging (permanent = no /staging/ in URL)
      const permanentUrls = images.filter((url: string) => 
        url && typeof url === 'string' && !url.includes('/staging/')
      );
      const stagingUrls = images.filter((url: string) => 
        url && typeof url === 'string' && url.includes('/staging/')
      );
      
      // Convert permanent URLs to StagingFile objects
      const permanentFiles: StagingFile[] = permanentUrls.map((url: string, idx: number) => {
        const filename = (url && typeof url === 'string') ? url.split('/').pop() || `image-${idx}` : `image-${idx}`;
        return {
          id: `existing-product-${productSystemId}-${idx}`,
          sessionId: '', // Empty for permanent files
          name: filename,
          originalName: filename,
          slug: filename,
          filename: filename,
          size: 0, // Size unknown for existing files
          type: 'image/jpeg',
          url,
          status: 'staging' as const,
          uploadedAt: new Date().toISOString(),
          metadata: '',
        };
      });
      
      // Convert staging URLs to StagingFile objects (extract sessionId)
      const stagingFiles: StagingFile[] = stagingUrls.map((url: string, idx: number) => {
        const sessionIdMatch = (url && typeof url === 'string') ? url.match(/\/staging\/files\/([^\/]+)\//) : null;
        const extractedSessionId = sessionIdMatch ? sessionIdMatch[1] : '';
        const filename = (url && typeof url === 'string') ? url.split('/').pop() || `staging-${idx}` : `staging-${idx}`;
        
        return {
          id: `existing-staging-${productSystemId}-${idx}`,
          sessionId: extractedSessionId,
          name: filename,
          originalName: filename,
          slug: filename,
          filename: filename,
          size: 0, // Will be loaded by component
          type: 'image/jpeg',
          url,
          status: 'staging' as const,
          uploadedAt: new Date().toISOString(),
          metadata: '',
        };
      });
      
      // Update states if we have files
      if (permanentFiles.length > 0) {
        setProductPermanentFiles(prev => ({
          ...prev,
          [productSystemId]: permanentFiles,
        }));
      }
      
      if (stagingFiles.length > 0) {
        setProductStagingFiles(prev => ({
          ...prev,
          [productSystemId]: stagingFiles,
        }));
        
        // Also set session ID if found
        if (stagingFiles[0]?.sessionId) {
          setProductSessionIds(prev => ({
            ...prev,
            [productSystemId]: stagingFiles[0].sessionId,
          }));
        }
      }
    });
  }, [products]); // Re-run when products change (e.g., load from server)
  
  // ===== SYNC IMAGE STATES TO FORM - PER PRODUCT (like receivedImages) =====
  React.useEffect(() => {
    // Sync each product's permanent + staging files to form field
    const updatedProducts = products.map((product: any) => {
      if (!product.systemId) return product;
      
      const permanent = productPermanentFiles[product.systemId] || [];
      const staging = productStagingFiles[product.systemId] || [];
      
      const allUrls = [
        ...permanent.map(f => f.url),
        ...staging.map(f => f.url),
      ];
      
      // Only update if changed
      const currentUrls = product.productImages || [];
      if (JSON.stringify(allUrls) !== JSON.stringify(currentUrls)) {
        return { ...product, productImages: allUrls };
      }
      return product;
    });
    
    // Check if any changes
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
  
  // Auto-filter marked product images
  React.useEffect(() => {
    // Filter out marked images from each product
    let hasChanges = false;
    const updatedProducts = products.map((product: any) => {
      if (!product.systemId) return product;
      
      const markedFiles = productFilesToDelete[product.systemId] || [];
      if (markedFiles.length === 0) return product;
      
      const images = product.productImages || [];
      const permanentFiles = images
        .filter((url: string) => url && typeof url === 'string' && !url.includes('/staging/'))
        .map((url: string, idx: number) => ({
          id: `product-${product.systemId}-${idx}`,
          url,
        }));
      
      const cleanedImages = images.filter((url: string) => {
        if (!url || typeof url !== 'string') return false;
        const fileId = permanentFiles.find(f => f.url === url)?.id;
        return !fileId || !markedFiles.includes(fileId);
      });
      
      if (cleanedImages.length !== images.length) {
        hasChanges = true;
        return { ...product, productImages: cleanedImages };
      }
      return product;
    });
    
    if (hasChanges) {
      setValue('products', updatedProducts, { shouldDirty: true });
    }
  }, [productFilesToDelete, products, setValue]);

  // Get active products
  const availableProducts = React.useMemo(() => {
    return getActive();
  }, [allProducts, getActive]);

  // Convert to Combobox options
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

  const handleSelectProduct = (product: Product) => {
    const newProduct = {
      systemId: `WP_${Date.now()}`,
      sku: product.id, // ✅ Add SKU
      productName: product.name,
      quantity: 1,
      unitPrice: product.costPrice || 0,
      issueDescription: '',
      resolution: 'return',
      deductionAmount: 0,
      productImages: [],
    };

    if (productInsertPosition === 'top') {
      append(newProduct);
    } else {
      append(newProduct);
    }
    setSelectedValue(null);
    
    // Kiểm tra bảo hành nếu đã chọn khách hàng
    if (customerName) {
      const checkResult = checkWarrantyStatus(
        customerName,
        product.name,
        1,
        allOrders,
        product.warrantyPeriodMonths || 12
      );
      
      // Show toast if there are warnings
      if (checkResult.warnings.length > 0) {
        if (checkResult.isValid) {
          // Warning only
          toast.warning(`Cảnh báo: ${product.name}`, {
            description: checkResult.warnings.join('\n'),
            duration: 5000,
          });
        } else {
          // Error - warranty expired or insufficient
          toast.error(`Không hợp lệ: ${product.name}`, {
            description: checkResult.warnings.join('\n'),
            duration: 6000,
          });
        }
      }
      
      // Store for future reference if needed
      setWarrantyCheckResults(prev => ({
        ...prev,
        [product.name]: checkResult,
      }));
    }
  };

  const handleSelectProducts = (products: Product[]) => {
    const newProducts = products.map((product) => ({
      systemId: `WP_${Date.now()}_${Math.random()}`,
      sku: product.id, // ✅ Add SKU (Product.id is the user-facing code)
      productName: product.name,
      quantity: 1,
      unitPrice: product.costPrice || 0,
      issueDescription: '',
      resolution: 'return',
      deductionAmount: 0,
      productImages: [],
    }));

    if (productInsertPosition === 'top') {
      newProducts.reverse().forEach((p) => append(p));
    } else {
      newProducts.forEach((p) => append(p));
    }
    
    // Kiểm tra bảo hành cho tất cả sản phẩm
    if (customerName) {
      const newResults: Record<string, WarrantyCheckResult> = {};
      const warningsToShow: string[] = [];
      
      products.forEach(product => {
        const checkResult = checkWarrantyStatus(
          customerName,
          product.name,
          1,
          allOrders,
          product.warrantyPeriodMonths || 12
        );
        newResults[product.name] = checkResult;
        
        // Collect warnings
        if (checkResult.warnings.length > 0) {
          warningsToShow.push(`${product.name}: ${checkResult.warnings[0]}`);
        }
      });
      
      setWarrantyCheckResults(prev => ({ ...prev, ...newResults }));
      
      // Show consolidated toast if there are warnings
      if (warningsToShow.length > 0) {
        toast.warning(`Cảnh báo bảo hành (${warningsToShow.length} SP)`, {
          description: warningsToShow.slice(0, 3).join('\n') + (warningsToShow.length > 3 ? `\n...và ${warningsToShow.length - 3} SP khác` : ''),
          duration: 6000,
        });
      }
    }
  };

  const handleComboboxChange = (option: ComboboxOption | null) => {
    if (option) {
      const product = availableProducts.find((p) => p.systemId === option.value);
      if (product) {
        handleSelectProduct(product);
      }
    }
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
                {fields.map((field: any, index) => {
                  // ✅ FIX: Find product by SKU (Product.id) instead of name
                  const product = field.sku 
                    ? availableProducts.find((p) => p.id === field.sku)
                    : availableProducts.find((p) => p.name === field.productName);
                  const quantity = field.quantity || 1;
                  const unitPrice = field.unitPrice || 0;
                  const total = quantity * unitPrice;

                  return (
                    <TableRow key={field.id}>
                      <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>

                      {/* Tên sản phẩm */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <p className="font-medium">{field.productName}</p>
                          {product && (
                            <a
                              href={`/products/${product.systemId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-body-xs text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {product.id}
                            </a>
                          )}
                        </div>
                      </TableCell>

                      {/* Số lượng */}
                      <TableCell>
                        <Controller
                          control={control}
                          name={`products.${index}.quantity`}
                          render={({ field }) => (
                            <NumberInput
                              value={field.value || 1}
                              onChange={field.onChange}
                              min={1}
                              format={false}
                              disabled={disabled}
                            />
                          )}
                        />
                      </TableCell>

                      {/* Đơn giá */}
                      <TableCell>
                        <Controller
                          control={control}
                          name={`products.${index}.unitPrice`}
                          render={({ field }) => (
                            <CurrencyInput
                              value={field.value || 0}
                              onChange={field.onChange}
                              disabled={disabled}
                            />
                          )}
                        />
                      </TableCell>

                      {/* Hình ảnh */}
                      <TableCell>
                        {(() => {
                          const productSystemId = field.systemId;
                          const permanentFiles = productPermanentFiles[productSystemId] || [];
                          const stagingFiles = productStagingFiles[productSystemId] || [];
                          
                          // Handler - mark for deletion
                          const handleMarkForDeletion = (fileId: string) => {
                            setProductFilesToDelete(prev => {
                              const currentMarked = prev[productSystemId] || [];
                              if (currentMarked.includes(fileId)) {
                                return {
                                  ...prev,
                                  [productSystemId]: currentMarked.filter(id => id !== fileId),
                                };
                              } else {
                                return {
                                  ...prev,
                                  [productSystemId]: [...currentMarked, fileId],
                                };
                              }
                            });
                          };
                          
                          // Handler - staging files change
                          const handleStagingFilesChange = (updatedFiles: StagingFile[]) => {
                            setProductStagingFiles(prev => ({
                              ...prev,
                              [productSystemId]: updatedFiles,
                            }));
                          };
                          
                          // Handler - session change
                          const handleSessionChange = (sessionId: string) => {
                            setProductSessionIds(prev => ({
                              ...prev,
                              [productSystemId]: sessionId,
                            }));
                          };
                          
                          return (
                            <div className="flex flex-col gap-1">
                              {/* Permanent files section */}
                              {permanentFiles.length > 0 && (
                                <div>
                                  <style dangerouslySetInnerHTML={{__html: `
                                    .product-images-grid .grid {
                                      display: grid !important;
                                      grid-template-columns: repeat(5, 80px) !important;
                                      gap: 8px !important;
                                    }
                                    .product-images-grid .grid > div {
                                      border: 1px solid #e5e7eb !important;
                                      background: white !important;
                                      box-shadow: none !important;
                                      padding: 0 !important;
                                      width: 80px !important;
                                      height: 80px !important;
                                      border-radius: 6px !important;
                                      overflow: hidden !important;
                                    }
                                    .product-images-grid .grid > div > div {
                                      height: 80px !important;
                                      width: 80px !important;
                                      padding: 0 !important;
                                      gap: 0 !important;
                                      display: block !important;
                                    }
                                    .product-images-grid .grid > div > div > div {
                                      height: 80px !important;
                                      width: 80px !important;
                                      aspect-ratio: unset !important;
                                      border-radius: 0 !important;
                                    }
                                    .product-images-grid img {
                                      height: 80px !important;
                                      width: 80px !important;
                                      object-fit: cover !important;
                                      display: block !important;
                                    }
                                    .product-images-grid button {
                                      position: absolute !important;
                                      top: 4px !important;
                                      right: 4px !important;
                                      height: 24px !important;
                                      width: 24px !important;
                                      opacity: 0 !important;
                                      transition: opacity 0.2s !important;
                                      z-index: 10 !important;
                                      background: rgba(255, 255, 255, 0.95) !important;
                                      border-radius: 4px !important;
                                      box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                                    }
                                    .product-images-grid .grid > div:hover button {
                                      opacity: 1 !important;
                                    }
                                    .product-images-grid button:hover {
                                      background: white !important;
                                      box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
                                    }
                                    .product-images-grid button svg {
                                      height: 12px !important;
                                      width: 12px !important;
                                      color: #dc2626 !important;
                                    }
                                    .product-images-grid p,
                                    .product-images-grid span:not(.sr-only),
                                    .product-images-grid .space-y-0\.5,
                                    .product-images-grid .space-y-1\.5 {
                                      display: none !important;
                                    }
                                  `}} />
                                  <div className="product-images-grid">
                                    <ExistingDocumentsViewer
                                      files={permanentFiles}
                                      disabled={disabled}
                                      onMarkForDeletion={handleMarkForDeletion}
                                      markedForDeletion={productFilesToDelete[productSystemId] || []}
                                    />
                                  </div>
                                </div>
                              )}
                              
                              {/* Staging files section */}
                              <div>
                                <style dangerouslySetInnerHTML={{__html: `
                                  .compact-upload [role="presentation"] {
                                    min-height: 36px !important;
                                    padding: 8px !important;
                                    width: 256px !important;
                                    max-width: 256px !important;
                                  }
                                  .compact-upload [role="presentation"],
                                  .compact-upload [role="presentation"] > div,
                                  .compact-upload [role="presentation"] > div > div {
                                    display: flex !important;
                                    flex-direction: row !important;
                                    align-items: center !important;
                                    justify-content: center !important;
                                    gap: 8px !important;
                                    flex-wrap: nowrap !important;
                                  }
                                  .compact-upload [role="presentation"] *,
                                  .compact-upload [role="presentation"] > div *,
                                  .compact-upload [role="presentation"] > div > div * {
                                    margin: 0 !important;
                                  }
                                  .compact-upload [role="presentation"] svg {
                                    width: 16px !important;
                                    height: 16px !important;
                                    flex-shrink: 0 !important;
                                  }
                                  .compact-upload [role="presentation"] p {
                                    display: none !important;
                                  }
                                  .compact-upload [role="presentation"] span:not(.sr-only) {
                                    display: inline !important;
                                    font-size: 11px !important;
                                    white-space: nowrap !important;
                                  }
                                  .compact-upload [role="alert"],
                                  .compact-upload .bg-red-50,
                                  .compact-upload .border-red-200,
                                  .compact-upload .text-destructive {
                                    display: none !important;
                                  }
                                  .compact-upload .grid {
                                    display: grid !important;
                                    grid-template-columns: repeat(5, 80px) !important;
                                    gap: 8px !important;
                                    margin-top: 8px !important;
                                  }
                                  .compact-upload .grid > div {
                                    border: 1px solid #e5e7eb !important;
                                    background: white !important;
                                    padding: 0 !important;
                                    box-shadow: none !important;
                                    width: 80px !important;
                                    height: 80px !important;
                                    border-radius: 6px !important;
                                    overflow: hidden !important;
                                  }
                                  .compact-upload .grid > div > div {
                                    padding: 0 !important;
                                    gap: 0 !important;
                                    display: block !important;
                                  }
                                  .compact-upload .grid > div > div > div {
                                    height: 80px !important;
                                    width: 80px !important;
                                    aspect-ratio: unset !important;
                                    border-radius: 0 !important;
                                  }
                                  .compact-upload .grid img {
                                    height: 80px !important;
                                    width: 80px !important;
                                    object-fit: cover !important;
                                    display: block !important;
                                  }
                                  .compact-upload .grid > div p,
                                  .compact-upload .grid > div span:not(.sr-only),
                                  .compact-upload .grid > div .space-y-1\.5 {
                                    display: none !important;
                                  }
                                  .compact-upload .grid > div button {
                                    position: absolute !important;
                                    top: 4px !important;
                                    right: 4px !important;
                                    height: 24px !important;
                                    width: 24px !important;
                                    opacity: 0 !important;
                                    transition: opacity 0.2s !important;
                                    z-index: 10 !important;
                                    background: rgba(255, 255, 255, 0.95) !important;
                                    border-radius: 4px !important;
                                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                                  }
                                  .compact-upload .grid > div:hover button {
                                    opacity: 1 !important;
                                  }
                                  .compact-upload .grid > div button:hover {
                                    background: white !important;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
                                  }
                                  .compact-upload .grid > div button svg {
                                    height: 12px !important;
                                    width: 12px !important;
                                    color: #dc2626 !important;
                                  }
                                `}} />
                                <div className="compact-upload">
                                  <NewDocumentsUpload
                                    value={stagingFiles}
                                    onChange={handleStagingFilesChange}
                                    sessionId={productSessionIds[productSystemId] || undefined}
                                    onSessionChange={handleSessionChange}
                                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
                                    maxFiles={3}
                                    existingFileCount={permanentFiles.length}
                                    disabled={disabled}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </TableCell>

                      {/* Kết quả */}
                      <TableCell>
                        <Controller
                          control={control}
                          name={`products.${index}.resolution`}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="return">Trả lại</SelectItem>
                                <SelectItem value="replace">Đổi mới</SelectItem>
                                <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </TableCell>

                      {/* Ghi chú - Inline Input */}
                      <TableCell>
                        <Controller
                          control={control}
                          name={`products.${index}.issueDescription`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Mô tả tình trạng..."
                              disabled={disabled}
                              className="w-full text-body-sm"
                            />
                          )}
                        />
                      </TableCell>

                      {/* Thành tiền */}
                      <TableCell className="text-right font-medium">
                        {new Intl.NumberFormat('vi-VN').format(total)} đ
                      </TableCell>

                      {/* Delete button */}
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={disabled}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
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
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tùy chỉnh hiển thị</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-body-sm font-medium">Chiết khấu mặc định theo:</Label>
                <div className="flex items-center gap-3">
                  <span className="text-body-sm text-muted-foreground">Giá trị</span>
                  <Switch
                    id="discount-type"
                    checked={discountDefaultType === 'percent'}
                    onCheckedChange={(checked) => setDiscountDefaultType(checked ? 'percent' : 'value')}
                  />
                  <span className="text-body-sm text-muted-foreground">%</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-body-sm font-medium">Thứ tự hiển thị hàng hóa:</Label>
                <RadioGroup
                  value={productInsertPosition}
                  onValueChange={(value: 'top' | 'bottom') => setProductInsertPosition(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="top" id="top" />
                    <Label htmlFor="top" className="font-normal cursor-pointer">
                      Thêm sau lên trên
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bottom" id="bottom" />
                    <Label htmlFor="bottom" className="font-normal cursor-pointer">
                      Thêm sau xuống dưới
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Đóng
            </Button>
            <Button type="button" onClick={() => setShowSettingsDialog(false)}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
