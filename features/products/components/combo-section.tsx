/**
 * ComboSection - UI Component for managing combo product items
 * ═══════════════════════════════════════════════════════════════
 * Hiển thị khi product type = 'combo'
 * - Cho phép thêm/xóa sản phẩm con
 * - Tính toán giá combo realtime
 * - Hiển thị tồn kho dự kiến
 * - Mobile first, responsive design
 * ═══════════════════════════════════════════════════════════════
 */

import * as React from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Plus, Minus, Trash2, Package, AlertCircle, Info, AlertTriangle, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LazyImage } from '@/components/ui/lazy-image';
import { ProductImage } from './product-image';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
import { ComboProductSearchV2 } from '@/components/shared/unified-product-search';
import { ComboItemsEditTable } from '@/components/shared/combo-items-edit-table';
import { ProductSelectionDialog } from '@/features/shared/product-selection-dialog';
import { useProductStore } from '../store';
import { usePricingPolicyStore } from '@/features/settings/pricing/store';
import { useBranchStore } from '@/features/settings/branches/store';
import { useProductTypeStore } from '@/features/settings/inventory/product-type-store';
import {
  MAX_COMBO_ITEMS,
  MIN_COMBO_ITEMS,
  canAddToCombo,
  calculateComboStock,
  calculateComboPrice,
  calculateComboCostPrice,
} from '../combo-utils';
import type { ProductFormValues } from '../validation';
import type { Product, ComboPricingType } from '../types';
import type { SystemId } from '@/lib/id-types';

// Format currency helper
const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
};

// Product Thumbnail component - shows image or fallback icon using server-priority images
function ProductThumbnail({ product, size = 'md' }: { product?: Product | undefined; size?: 'sm' | 'md' }) {
  const sizeVariant = size === 'sm' ? 'sm' : 'md';
  
  if (!product) {
    const sizeClass = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
    const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className={`${sizeClass} flex-shrink-0 bg-muted rounded flex items-center justify-center`}>
        <Package className={`${iconSize} text-muted-foreground`} />
      </div>
    );
  }
  
  return (
    <ProductImage
      productSystemId={product.systemId}
      productData={product}
      alt={product.name}
      size={sizeVariant}
    />
  );
}

// Quantity Input with +/- buttons
function QuantityInput({ 
  value, 
  onChange, 
  min = 1 
}: { 
  value: number; 
  onChange: (value: number) => void; 
  min?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 flex-shrink-0"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Math.max(min, parseInt(e.target.value, 10) || min))}
        className="h-8 w-14 text-center px-1"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 flex-shrink-0"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

type ComboItemField = {
  productSystemId: string;
  quantity: number;
};

export function ComboSection() {
  const { data: allProducts } = useProductStore();
  const { data: pricingPolicies } = usePricingPolicyStore();
  const { data: branches } = useBranchStore();
  const { findById: findProductTypeById } = useProductTypeStore();
  const [isProductSelectionOpen, setIsProductSelectionOpen] = React.useState(false);
  
  const form = useFormContext<ProductFormValues>();
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'comboItems',
  });
  
  // Watch combo fields for realtime calculations
  const comboItems = useWatch({ control: form.control, name: 'comboItems' }) || [];
  const comboPricingType = useWatch({ control: form.control, name: 'comboPricingType' });
  const comboDiscount = useWatch({ control: form.control, name: 'comboDiscount' }) || 0;
  
  // Filter products that can be added to combo (exclude combos and discontinued)
  const availableProducts = React.useMemo(() => {
    return allProducts.filter(p => canAddToCombo(p));
  }, [allProducts]);
  
  // Product options for combobox (exclude already selected)
  const selectedProductIds = React.useMemo(() => {
    return new Set(comboItems.map(item => item.productSystemId));
  }, [comboItems]);
  
  const productOptions = React.useMemo(() => {
    return availableProducts
      .filter(p => !selectedProductIds.has(p.systemId))
      .map(p => ({
        value: p.systemId,
        label: `${p.name} (${p.id})`,
      }));
  }, [availableProducts, selectedProductIds]);
  
  // Get default pricing policy
  const defaultPricingPolicy = React.useMemo(() => {
    return pricingPolicies.find(p => p.isDefault && p.type === 'Bán hàng');
  }, [pricingPolicies]);

  // Get product type name
  const getProductTypeName = React.useCallback((product?: Product) => {
    if (!product?.productTypeSystemId) return 'Hàng hóa';
    const productType = findProductTypeById(product.productTypeSystemId as SystemId);
    return productType?.name || 'Hàng hóa';
  }, [findProductTypeById]);
  
  const resolveUnitPrice = React.useCallback((product?: Product) => {
    if (!product) return 0;
    if (defaultPricingPolicy) {
      const policyPrice = product.prices?.[defaultPricingPolicy.systemId] ?? 0;
      if (policyPrice > 0) {
        return policyPrice;
      }
    }
    const firstDefinedPrice = Object.values(product.prices || {}).find(
      (value): value is number => typeof value === 'number'
    );
    if (typeof firstDefinedPrice === 'number') {
      return firstDefinedPrice;
    }
    return product.suggestedRetailPrice || product.minPrice || 0;
  }, [defaultPricingPolicy]);

  // Calculate totals
  const calculations = React.useMemo(() => {
    if (!comboItems || comboItems.length === 0) {
      return { totalOriginalPrice: 0, comboPrice: 0, costPrice: 0, savings: 0 };
    }

    // Calculate total original price
    let totalOriginalPrice = 0;
    for (const item of comboItems) {
      const product = allProducts.find(p => p.systemId === item.productSystemId);
      const unitPrice = resolveUnitPrice(product);
      totalOriginalPrice += unitPrice * item.quantity;
    }
    
    // Calculate combo price based on pricing type
    let comboPrice = totalOriginalPrice;
    if (comboPricingType === 'fixed') {
      comboPrice = comboDiscount;
    } else if (comboPricingType === 'sum_discount_percent') {
      comboPrice = Math.round(totalOriginalPrice * (1 - comboDiscount / 100));
    } else if (comboPricingType === 'sum_discount_amount') {
      comboPrice = Math.max(0, totalOriginalPrice - comboDiscount);
    }
    
    // Calculate cost price
    const costPrice = calculateComboCostPrice(
      comboItems.map(item => ({
        productSystemId: item.productSystemId as SystemId,
        quantity: item.quantity,
      })),
      allProducts,
      defaultPricingPolicy ? { fallbackPricingPolicyId: defaultPricingPolicy.systemId } : undefined
    );
    
    const savings = totalOriginalPrice - comboPrice;
    
    return { totalOriginalPrice, comboPrice, costPrice, savings };
  }, [comboItems, comboPricingType, comboDiscount, allProducts, resolveUnitPrice]);
  
  // Calculate stock for all branches (Sapo: tổng tồn tại tất cả chi nhánh)
  const comboStockInfo = React.useMemo(() => {
    if (!comboItems || comboItems.length === 0 || branches.length === 0) {
      return { totalStock: 0, stockByBranch: {} as Record<string, number> };
    }
    
    const stockByBranch: Record<string, number> = {};
    let totalStock = 0;
    
    for (const branch of branches) {
      const branchStock = calculateComboStock(
        comboItems.map(item => ({
          productSystemId: item.productSystemId as SystemId,
          quantity: item.quantity,
        })),
        allProducts,
        branch.systemId
      );
      stockByBranch[branch.systemId] = branchStock;
      totalStock += branchStock;
    }
    
    return { totalStock, stockByBranch };
  }, [comboItems, allProducts, branches]);

  // Realtime validation for combo items (debounced)
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const errors: string[] = [];
      
      if (!comboItems || comboItems.length === 0) {
        setValidationErrors([]);
        return;
      }
      
      // Check for duplicates
      const productIds = comboItems.map(item => item.productSystemId);
      const duplicates = productIds.filter((id, index) => productIds.indexOf(id) !== index);
      if (duplicates.length > 0) {
        errors.push('Có sản phẩm bị trùng lặp trong combo');
      }
      
      // Check each item
      comboItems.forEach((item, index) => {
        const product = allProducts.find(p => p.systemId === item.productSystemId);
        
        // Check if product exists
        if (!product) {
          errors.push(`Sản phẩm #${index + 1} không tồn tại trong hệ thống`);
          return;
        }
        
        // Check if product is valid for combo
        if (!canAddToCombo(product)) {
          errors.push(`"${product.name}" không thể thêm vào combo (có thể đã ngừng kinh doanh hoặc là combo khác)`);
        }
        
        // Check quantity
        if (!item.quantity || item.quantity < 1) {
          errors.push(`"${product.name}" cần số lượng tối thiểu là 1`);
        }
        
        // Check stock availability
        if (product.isStockTracked !== false) {
          const totalStock = Object.values(product.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0);
          if (totalStock === 0) {
            errors.push(`"${product.name}" đã hết hàng`);
          } else if (totalStock < item.quantity * 3) {
            // Warn if stock is low (less than 3x the quantity needed per combo)
            errors.push(`"${product.name}" có tồn kho thấp (${totalStock})`);
          }
        }
      });
      
      setValidationErrors(errors);
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [comboItems, allProducts]);
  
  // Get product info by systemId
  const getProduct = (systemId: string): Product | undefined => {
    return allProducts.find(p => p.systemId === systemId);
  };

  // Check if any product has stock issues
  const getProductStockWarning = (product: Product | undefined): string | null => {
    if (!product) return null;
    
    // Check if product is not stock tracked
    if (product.isStockTracked === false) {
      return 'Sản phẩm này không theo dõi tồn kho';
    }
    
    // Calculate total available stock across all branches
    const totalAvailable = Object.keys(product.inventoryByBranch || {}).reduce((sum, branchId) => {
      const onHand = product.inventoryByBranch?.[branchId as SystemId] || 0;
      const committed = product.committedByBranch?.[branchId as SystemId] || 0;
      return sum + (onHand - committed);
    }, 0);
    
    if (totalAvailable <= 0) {
      return 'Sản phẩm đã hết hàng';
    }
    
    return null;
  };

  // Get total available stock for a product
  const getProductTotalStock = (product: Product | undefined): number => {
    if (!product) return 0;
    return Object.keys(product.inventoryByBranch || {}).reduce((sum, branchId) => {
      const onHand = product.inventoryByBranch?.[branchId as SystemId] || 0;
      const committed = product.committedByBranch?.[branchId as SystemId] || 0;
      return sum + Math.max(0, onHand - committed);
    }, 0);
  };
  
  // Handle add product from search
  const handleSelectProduct = (product: Product) => {
    if (fields.length >= MAX_COMBO_ITEMS) return;
    // Skip if already added
    if (selectedProductIds.has(product.systemId)) return;
    append({ productSystemId: product.systemId, quantity: 1 });
  };

  // Handle select multiple products from dialog
  const handleSelectMultipleProducts = (products: Product[], quantities?: Record<string, number>) => {
    for (const product of products) {
      if (!canAddToCombo(product)) continue;
      
      const quantity = quantities?.[product.systemId] || 1;
      
      // Check if product already exists in combo
      const existingIndex = fields.findIndex(f => f.productSystemId === product.systemId);
      
      if (existingIndex >= 0) {
        // Product exists - add quantity to existing
        const currentQty = form.getValues(`comboItems.${existingIndex}.quantity`) || 0;
        form.setValue(`comboItems.${existingIndex}.quantity`, currentQty + quantity);
      } else {
        // Product doesn't exist - add new if not at max
        if (fields.length < MAX_COMBO_ITEMS) {
          append({ productSystemId: product.systemId, quantity });
        }
      }
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle className="text-h3">Thành phần Combo</CardTitle>
            <Badge variant="secondary">{fields.length}/{MAX_COMBO_ITEMS}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Search Bar - Responsive layout */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1">
            <ComboProductSearchV2
              onSelectProduct={handleSelectProduct}
              excludeProductIds={selectedProductIds}
              disabled={fields.length >= MAX_COMBO_ITEMS}
              placeholder="Thêm sản phẩm (F3)"
              allowCreateNew={true}
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            className="h-9 w-full sm:w-auto flex-shrink-0" 
            onClick={() => setIsProductSelectionOpen(true)} 
            disabled={fields.length >= MAX_COMBO_ITEMS}
          >
            Chọn nhanh
          </Button>
        </div>

        {/* Product Selection Dialog */}
        <ProductSelectionDialog
          isOpen={isProductSelectionOpen}
          onOpenChange={setIsProductSelectionOpen}
          onSelect={handleSelectMultipleProducts}
        />
        
        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-body-sm">
            Combo cần tối thiểu {MIN_COMBO_ITEMS} sản phẩm, tối đa {MAX_COMBO_ITEMS} sản phẩm. 
            Không thể thêm combo khác hoặc phiên bản quy đổi vào combo.
          </AlertDescription>
        </Alert>

        {/* Warning if any product has stock issues */}
        {comboItems.some(item => {
          const product = getProduct(item.productSystemId);
          return product && getProductStockWarning(product);
        }) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-body-sm">
              Một số sản phẩm trong combo đang hết hàng hoặc tồn kho thấp. 
              Điều này sẽ ảnh hưởng đến số lượng combo có thể bán.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Combo Items - Mobile: Cards, Desktop: Table */}
        {fields.length > 0 ? (
          <>
            {/* Mobile View: Card-based layout */}
            <div className="block sm:hidden space-y-3">
              {fields.map((field, index) => {
                const selectedProduct = getProduct(comboItems[index]?.productSystemId || '');
                const unitPrice = resolveUnitPrice(selectedProduct);
                const quantity = comboItems[index]?.quantity || 1;
                const lineTotal = unitPrice * quantity;
                const stockWarning = selectedProduct ? getProductStockWarning(selectedProduct) : null;
                
                return (
                  <div key={field.id} className="p-3 border rounded-lg bg-card space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <ProductThumbnail product={selectedProduct} size="sm" />
                        <div className="min-w-0">
                          <p className="text-body-sm font-medium truncate">{selectedProduct?.name || 'Chưa chọn'}</p>
                          <p className="text-body-xs text-muted-foreground">{selectedProduct?.id} | {getProductTypeName(selectedProduct)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-body-sm">
                      <div>
                        <p className="text-muted-foreground text-body-xs mb-1">Số lượng</p>
                        <FormField
                          control={form.control}
                          name={`comboItems.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <QuantityInput 
                                  value={field.value ?? 1}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-body-xs mb-1">Giá vốn</p>
                        <p className="font-mono text-muted-foreground h-9 flex items-center">{formatCurrency(selectedProduct?.costPrice || 0)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-body-xs mb-1">Đơn giá</p>
                        <p className="font-mono h-9 flex items-center">{formatCurrency(unitPrice)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-body-xs mb-1">Thành tiền</p>
                        <p className="font-mono font-medium h-9 flex items-center">{formatCurrency(lineTotal)}</p>
                      </div>
                    </div>
                    
                    {selectedProduct && (
                      <div className="flex items-center justify-between pt-2 border-t text-body-sm">
                        <span className="text-muted-foreground text-body-xs">Có thể bán:</span>
                        {getProductStockWarning(selectedProduct) ? (
                          <span className="text-destructive font-medium flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {getProductTotalStock(selectedProduct)}
                          </span>
                        ) : (
                          <span className="font-mono">{getProductTotalStock(selectedProduct)}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Mobile Total Row */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-body-sm font-medium">Tổng giá gốc:</span>
                  <span className="font-mono font-bold">{formatCurrency(calculations.totalOriginalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Desktop View: Use ComboItemsEditTable component */}
            <div className="hidden sm:block">
              <ComboItemsEditTable
                fields={fields}
                remove={remove}
                control={form.control}
                fieldName="comboItems"
                disabled={false}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border rounded-md border-dashed">
            <Package className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-body-sm">Chưa có sản phẩm nào trong combo</p>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setIsProductSelectionOpen(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Thêm sản phẩm đầu tiên
            </Button>
          </div>
        )}
        
        {/* Realtime Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-body-sm text-amber-800 dark:text-amber-200">
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Validation Error for comboItems */}
        {form.formState.errors.comboItems && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-body-sm">
              {form.formState.errors.comboItems.message || 'Vui lòng kiểm tra lại danh sách sản phẩm'}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Pricing Section - Only show when has items */}
        {fields.length >= MIN_COMBO_ITEMS && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-body-sm font-medium">Cách tính giá Combo</h4>
            
            {/* Pricing Type Radio Cards */}
            <FormField
              control={form.control}
              name="comboPricingType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {/* Fixed Price */}
                      <label
                        className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${
                          field.value === 'fixed' 
                            ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                            : 'hover:border-muted-foreground hover:bg-muted/30'
                        }`}
                      >
                        <input
                          type="radio"
                          checked={field.value === 'fixed'}
                          onChange={() => field.onChange('fixed')}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            field.value === 'fixed' ? 'border-primary' : 'border-muted-foreground'
                          }`}>
                            {field.value === 'fixed' && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="text-body-sm font-medium">Giá cố định</span>
                        </div>
                        <p className="text-body-xs text-muted-foreground pl-6">
                          Nhập giá bán cố định
                        </p>
                      </label>
                      
                      {/* Discount Percent */}
                      <label
                        className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${
                          field.value === 'sum_discount_percent' 
                            ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                            : 'hover:border-muted-foreground hover:bg-muted/30'
                        }`}
                      >
                        <input
                          type="radio"
                          checked={field.value === 'sum_discount_percent'}
                          onChange={() => field.onChange('sum_discount_percent')}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            field.value === 'sum_discount_percent' ? 'border-primary' : 'border-muted-foreground'
                          }`}>
                            {field.value === 'sum_discount_percent' && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="text-body-sm font-medium">Giảm theo %</span>
                        </div>
                        <p className="text-body-xs text-muted-foreground pl-6">
                          Tổng giá gốc - giảm %
                        </p>
                      </label>
                      
                      {/* Discount Amount */}
                      <label
                        className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${
                          field.value === 'sum_discount_amount' 
                            ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                            : 'hover:border-muted-foreground hover:bg-muted/30'
                        }`}
                      >
                        <input
                          type="radio"
                          checked={field.value === 'sum_discount_amount'}
                          onChange={() => field.onChange('sum_discount_amount')}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            field.value === 'sum_discount_amount' ? 'border-primary' : 'border-muted-foreground'
                          }`}>
                            {field.value === 'sum_discount_amount' && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="text-body-sm font-medium">Giảm tiền</span>
                        </div>
                        <p className="text-body-xs text-muted-foreground pl-6">
                          Tổng giá gốc - số tiền
                        </p>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Discount/Price Input - Inline with label */}
            {comboPricingType && (
              <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                <FormField
                  control={form.control}
                  name="comboDiscount"
                  render={({ field }) => (
                    <FormItem className="flex-1 sm:max-w-xs">
                      <FormLabel>
                        {comboPricingType === 'fixed' && 'Giá combo (VND)'}
                        {comboPricingType === 'sum_discount_percent' && 'Phần trăm giảm'}
                        {comboPricingType === 'sum_discount_amount' && 'Số tiền giảm (VND)'}
                      </FormLabel>
                      <FormControl>
                        {comboPricingType === 'sum_discount_percent' ? (
                          <div className="relative">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              className="h-9 pr-8"
                              {...field}
                              value={field.value ?? 0}
                              onChange={(e) => field.onChange(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-body-sm">%</span>
                          </div>
                        ) : (
                          <CurrencyInput
                            value={field.value ?? 0}
                            onChange={field.onChange}
                            placeholder="Nhập giá"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Quick Preview */}
                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg sm:flex-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-body-xs text-muted-foreground">Giá gốc</p>
                    <p className="font-mono text-body-sm line-through text-muted-foreground truncate">
                      {formatCurrency(calculations.totalOriginalPrice)}
                    </p>
                  </div>
                  <div className="text-muted-foreground">→</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-xs text-muted-foreground">Giá combo</p>
                    <p className="font-mono text-body-sm font-bold text-primary truncate">
                      {formatCurrency(calculations.comboPrice)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Summary Stats */}
            {comboPricingType && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-lg border">
                <div className="text-center sm:text-left">
                  <p className="text-body-xs text-muted-foreground mb-1">Giá vốn combo</p>
                  <p className="font-mono text-body-sm sm:text-base font-semibold">
                    {formatCurrency(calculations.costPrice)}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-body-xs text-muted-foreground mb-1">Giá bán combo</p>
                  <p className="font-mono text-body-sm sm:text-base font-bold text-primary">
                    {formatCurrency(calculations.comboPrice)}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-body-xs text-muted-foreground mb-1">Tiết kiệm</p>
                  <p className="font-mono text-body-sm sm:text-base font-semibold text-green-600">
                    {formatCurrency(calculations.savings)}
                    {calculations.totalOriginalPrice > 0 && (
                      <span className="text-body-xs ml-1">
                        ({Math.round((calculations.savings / calculations.totalOriginalPrice) * 100)}%)
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-body-xs text-muted-foreground mb-1">Có thể bán</p>
                  <p className="font-mono text-body-sm sm:text-base font-semibold">
                    {comboStockInfo.totalStock} combo
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
