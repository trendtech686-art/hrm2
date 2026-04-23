import * as React from "react";
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { mobileBleedCardClass } from "@/components/layout/page-section";
import { Button } from "../../../components/ui/button";
import { NumberInput } from "../../../components/ui/number-input";
import { CurrencyInput } from "../../../components/ui/currency-input";
import { Package, Plus, X, StickyNote, History, Pencil, Eye, ChevronDown, ChevronRight, Calculator, HelpCircle, Trash2 } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { MobileCard, MobileCardBody, MobileCardFooter, MobileCardHeader } from "../../../components/mobile/mobile-card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { PurchaseProductSearch } from "../../../components/shared/unified-product-search";
import { BarcodeScannerButton } from "../../../components/shared/barcode-scanner-button";
import { toast } from "sonner";
import { ProductSelectionDialog } from "../../shared/product-selection-dialog";
import { TaxSelector } from "./tax-selector";
import { useAllTaxesData } from '../../settings/taxes/hooks/use-all-taxes';
import { useProductsByIds } from "../../products/hooks/use-products";
import { useProductTypeFinder } from "../../settings/inventory/hooks/use-all-product-types";
import type { Product } from "../../products/types";
import { useProductImage } from "../../products/components/product-image";
import { ImagePreviewDialog } from "../../../components/ui/image-preview-dialog";
import { formatDateForDisplay } from '@/lib/date-utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";
import Link from 'next/link';

interface ComboItem {
  productSystemId: string;
  quantity: number;
  product?: Product;
}

// Component hiển thị ảnh sản phẩm với preview - tương tự LineItemsTable
const ProductThumbnail = ({ 
    product,
    onPreview 
}: { 
    product: Product;
    onPreview: (image: string, title: string) => void;
}) => {
    const imageUrl = useProductImage(product.systemId, product);
    
    if (imageUrl) {
        return (
            <div
                className="group relative w-10 h-9 rounded overflow-hidden border border-muted cursor-pointer"
                onClick={() => onPreview(imageUrl, product.name)}
            >
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="40px"
                    className="object-cover transition-all group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-white drop-shadow-md" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-10 h-9 bg-muted rounded flex items-center justify-center">
            <Package className="h-5 w-5 text-muted-foreground" />
        </div>
    );
};

// Helper component để hiển thị ảnh combo child
const ComboChildImage = ({ 
    product, 
    onPreview 
}: { 
    product?: Product | null; 
    onPreview: (image: string, title: string) => void;
}) => {
    const imageUrl = useProductImage(product?.systemId || '', product);
    
    if (imageUrl) {
        return (
            <div
                className="group relative w-8 h-7 rounded overflow-hidden border border-muted cursor-pointer"
                onClick={() => onPreview(imageUrl, product?.name || '')}
            >
                <Image
                    src={imageUrl}
                    alt={product?.name || ''}
                    fill
                    sizes="32px"
                    className="object-cover transition-all group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-white drop-shadow-md" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-8 h-7 bg-muted rounded flex items-center justify-center">
            <Package className="h-4 w-4 text-muted-foreground" />
        </div>
    );
};

export interface ProductLineItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percent' | 'fixed'; // Thêm loại chiết khấu
  tax: number; // Tax rate (%)
  taxId?: string; // Tax systemId for reference
  total: number;
  notes?: string; // Ghi chú cho sản phẩm
}

export type CostCalculationMethod = "last_purchase" | "weighted_average" | "with_fees";

interface ProductSelectionCardProps {
  items: ProductLineItem[];
  onItemsChange: (items: ProductLineItem[]) => void;
  supplierId?: string | undefined;
  costCalculationMethod?: CostCalculationMethod;
  onCostCalculationMethodChange?: (method: CostCalculationMethod) => void;
  totalFees?: number; // Tổng phí vận chuyển + phí khác
  totalQuantity?: number; // Tổng số lượng sản phẩm
}

const formatCurrency = (value: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return new Intl.NumberFormat("vi-VN").format(value);
};

// Fallback labels for product types (defined outside component for stable reference)
const productTypeFallbackLabels: Record<string, string> = {
  physical: 'Hàng hóa',
  single: 'Hàng hóa',
  service: 'Dịch vụ',
  digital: 'Sản phẩm số',
  combo: 'Combo',
};

export function ProductSelectionCard({
  items,
  onItemsChange,
  supplierId: _supplierId,
  costCalculationMethod = 'with_fees',
  onCostCalculationMethodChange,
  totalFees = 0,
  totalQuantity = 0,
}: ProductSelectionCardProps) {
  const [showBulkSelector, setShowBulkSelector] = React.useState(false);
  const [priceMode, setPriceMode] = React.useState<"cost" | "purchase" | "recent">("recent");
  const [editingNoteIndex, setEditingNoteIndex] = React.useState<number | null>(null);
  const [tempNote, setTempNote] = React.useState<string>("");
  const [previewState, setPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
    open: false, image: '', title: ''
  });
  const [expandedCombos, setExpandedCombos] = React.useState<Record<number, boolean>>({});
  // ✅ Mobile: bottom sheet cho advanced edit
  const [advancedIdx, setAdvancedIdx] = React.useState<number | null>(null);
  
  // Get default tax from taxes store
  const { getDefaultPurchase } = useAllTaxesData();
  const defaultPurchaseTax = React.useMemo(() => getDefaultPurchase(), [getDefaultPurchase]);
  
  // ⚡ OPTIMIZED: Only fetch combo child products (if any) instead of ALL products
  const comboChildIds = React.useMemo(() => {
    const ids: string[] = [];
    for (const item of items) {
      if (item.product.type === 'combo' && item.product.comboItems?.length) {
        for (const ci of item.product.comboItems) {
          if ((ci as ComboItem).productSystemId) ids.push((ci as ComboItem).productSystemId);
        }
      }
    }
    return ids;
  }, [items]);
  const { productsMap: comboChildProductsMap } = useProductsByIds(comboChildIds);
  
  // Get product type store
  const { findById: findProductTypeById } = useProductTypeFinder();
  
  // DISABLED: Price history gây lag do fetch quá nhiều data
  // Có thể enable lại khi có API riêng cho price history
  // const { data: purchaseOrders } = useAllPurchaseOrders();

  // Get product type label
  const getProductTypeLabel = React.useCallback((product: Product) => {
    if (product.productTypeSystemId) {
      const productType = findProductTypeById(product.productTypeSystemId);
      if (productType?.name) return productType.name;
    }
    if (product.type && productTypeFallbackLabels[product.type]) {
      return productTypeFallbackLabels[product.type];
    }
    return 'Hàng hóa';
  }, [findProductTypeById]);

  const handlePreview = React.useCallback((image: string, title: string) => {
    setPreviewState({ open: true, image, title });
  }, []);

  const toggleComboExpanded = React.useCallback((index: number) => {
    setExpandedCombos(prev => ({ ...prev, [index]: !prev[index] }));
  }, []);
  
  // DISABLED: Price history gây lag - sẽ implement API riêng sau
  const getPriceHistory = React.useCallback((_productId: string) => {
    // Tạm return empty array - feature này cần API riêng để không gây lag
    return [] as { date: string; price: number; orderId: string; quantity: number }[];
  }, []);
  
  // Calculate average price
  const getAveragePrice = React.useCallback((_productId: string) => {
    // Tạm return 0 - feature này cần API riêng
    return 0;
  }, []);
  
  // Get default tax rate
  const getDefaultTaxRate = React.useCallback(() => {
    if (defaultPurchaseTax) {
      return defaultPurchaseTax.rate;
    }
    return 0;
  }, [defaultPurchaseTax]);

  // Get price based on price mode
  const getProductPrice = React.useCallback((product: Product) => {
    if (priceMode === 'cost') {
      // Giá vốn (đã bao gồm phí phân bổ)
      return product.costPrice || product.lastPurchasePrice || 0;
    }
    if (priceMode === 'purchase') {
      // Giá nhập (giá mua từ NCC, không bao gồm phí) - dùng lastPurchasePrice
      return product.lastPurchasePrice || product.costPrice || 0;
    }
    // recent: Giá nhập gần nhất = lastPurchasePrice
    return product.lastPurchasePrice || product.costPrice || 0;
  }, [priceMode]);

  // Calculate total based on discount type (memoized)
  const calculateTotal = React.useCallback((item: ProductLineItem) => {
    const subtotal = item.quantity * item.unitPrice * (1 + item.tax / 100);
    if (item.discountType === 'percent') {
      return subtotal * (1 - item.discount / 100);
    } else {
      return subtotal - item.discount;
    }
  }, []);

  // Update all product prices when price mode changes
  const prevPriceModeRef = React.useRef(priceMode);
  
  React.useEffect(() => {
    // Only update if priceMode actually changed (not on initial render)
    if (prevPriceModeRef.current === priceMode || items.length === 0) {
      prevPriceModeRef.current = priceMode;
      return;
    }
    
    prevPriceModeRef.current = priceMode;
    
    const updatedItems = items.map(item => {
      const newPrice = getProductPrice(item.product);
      const subtotal = item.quantity * newPrice * (1 + item.tax / 100);
      const total = item.discountType === 'percent' 
        ? subtotal * (1 - item.discount / 100)
        : subtotal - item.discount;
      
      return {
        ...item,
        unitPrice: newPrice,
        total
      };
    });
    
    onItemsChange(updatedItems);
  }, [priceMode, items, getProductPrice, onItemsChange]);

  // Add single product - nhận trực tiếp product object từ search
  const handleAddProduct = (product: Product) => {
    // Check if product already exists
    const existingIndex = items.findIndex(item => item.product.systemId === product.systemId);
    
    if (existingIndex >= 0) {
      // Product exists, increase quantity
      const updatedItems = [...items];
      updatedItems[existingIndex].quantity += 1;
      updatedItems[existingIndex].total = calculateTotal(updatedItems[existingIndex]);
      onItemsChange(updatedItems);
      return;
    }

    // Add new product with price based on mode
    const defaultTaxRate = getDefaultTaxRate();
    const productPrice = getProductPrice(product);
    const newItem: ProductLineItem = {
      product,
      quantity: 1,
      unitPrice: productPrice,
      discount: 0,
      discountType: 'fixed',
      tax: defaultTaxRate,
      taxId: defaultPurchaseTax?.systemId ?? "",
      total: productPrice * (1 + defaultTaxRate / 100),
      notes: '',
    };

    onItemsChange([...items, newItem]);
  };

  // Add multiple products
  const handleBulkAdd = (products: Product[]) => {
    const newItems: ProductLineItem[] = [];
    
    products.forEach((product) => {
      // Check if product already exists
      const existingIndex = items.findIndex(item => item.product.systemId === product.systemId);
      
      if (existingIndex >= 0) {
        // Product exists, increase quantity
        const updatedItems = [...items];
        updatedItems[existingIndex].quantity += 1;
        updatedItems[existingIndex].total = 
          updatedItems[existingIndex].quantity * updatedItems[existingIndex].unitPrice * 
          (1 + updatedItems[existingIndex].tax / 100) - updatedItems[existingIndex].discount;
        onItemsChange(updatedItems);
      } else {
        // New product, add to newItems with price based on mode
        const defaultTaxRate = getDefaultTaxRate();
        const productPrice = getProductPrice(product);
        newItems.push({
          product,
          quantity: 1,
          unitPrice: productPrice,
          discount: 0,
          discountType: 'fixed', // Mặc định là tiền mặt
          tax: defaultTaxRate,
          taxId: defaultPurchaseTax?.systemId ?? "",
          total: productPrice * (1 + defaultTaxRate / 100),
          notes: '', // Khởi tạo notes rỗng
        });
      }
    });
    
    // Add all new items at once
    if (newItems.length > 0) {
      onItemsChange([...items, ...newItems]);
    }
  };

  // Remove product (memoized)
  const handleRemove = React.useCallback((index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  }, [items, onItemsChange]);

  // Update quantity (memoized)
  const handleQuantityChange = React.useCallback((index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, quantity);
    newItems[index].total = calculateTotal(newItems[index]);
    onItemsChange(newItems);
  }, [items, calculateTotal, onItemsChange]);

  // Update price (memoized)
  const handlePriceChange = React.useCallback((index: number, price: number) => {
    const newItems = [...items];
    newItems[index].unitPrice = price;
    newItems[index].total = calculateTotal(newItems[index]);
    onItemsChange(newItems);
  }, [items, calculateTotal, onItemsChange]);

  // Update discount (memoized)
  const handleDiscountChange = React.useCallback((index: number, discount: number) => {
    const newItems = [...items];
    newItems[index].discount = discount;
    newItems[index].total = calculateTotal(newItems[index]);
    onItemsChange(newItems);
  }, [items, calculateTotal, onItemsChange]);

  // Update discount type (memoized)
  const handleDiscountTypeChange = React.useCallback((index: number, type: 'percent' | 'fixed') => {
    const newItems = [...items];
    newItems[index].discountType = type;
    newItems[index].discount = 0; // Reset discount when changing type
    newItems[index].total = calculateTotal(newItems[index]);
    onItemsChange(newItems);
  }, [items, calculateTotal, onItemsChange]);

  // Update tax (memoized)
  const handleTaxChange = React.useCallback((index: number, taxId: string, rate: number) => {
    const newItems = [...items];
    newItems[index].tax = rate;
    newItems[index].taxId = taxId;
    newItems[index].total = calculateTotal(newItems[index]);
    onItemsChange(newItems);
  }, [items, calculateTotal, onItemsChange]);

  // Open note dialog (memoized to prevent re-creation)
  const handleOpenNoteDialog = React.useCallback((index: number) => {
    setEditingNoteIndex(index);
    setTempNote(items[index].notes || '');
  }, [items]);

  // Save note (memoized to prevent re-creation)
  const handleSaveNote = React.useCallback(() => {
    if (editingNoteIndex !== null) {
      const newItems = [...items];
      newItems[editingNoteIndex].notes = tempNote;
      onItemsChange(newItems);
      setEditingNoteIndex(null);
      setTempNote('');
    }
  }, [editingNoteIndex, items, tempNote, onItemsChange]);

  // Handle textarea input (memoized)
  const handleNoteInputChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempNote(e.target.value);
  }, []);

  // Không exclude sản phẩm nữa - cho phép chọn lại để tăng số lượng
  const excludedProductIds: string[] = [];

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader>
        <CardTitle>Thông tin sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search + Bulk Add + Price Mode - Dùng component dùng chung */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex gap-2">
            <div className="flex-1 min-w-0">
              <PurchaseProductSearch
                onSelectProduct={handleAddProduct}
                placeholder="Tìm theo tên, mã SKU, hoặc quét mã Barcode...(F3)"
                excludeProductIds={excludedProductIds}
              />
            </div>
            <BarcodeScannerButton
              onDetect={async (code) => {
                try {
                  const res = await fetch(`/api/search/products?q=${encodeURIComponent(code)}&limit=5&offset=0`);
                  if (!res.ok) throw new Error('search failed');
                  const json = await res.json() as { data: Product[] };
                  const match = json.data?.[0];
                  if (!match) {
                    toast.error(`Không tìm thấy sản phẩm cho mã "${code}"`);
                    return;
                  }
                  handleAddProduct(match);
                  toast.success(`Đã thêm: ${match.name}`);
                } catch {
                  toast.error('Không thể tra cứu mã vạch. Thử lại.');
                }
              }}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowBulkSelector(true)}
            className="w-full sm:w-auto"
          >
            Chọn nhiều
          </Button>
          <Select value={priceMode} onValueChange={(v: "cost" | "purchase" | "recent") => setPriceMode(v)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cost">
                <div className="flex flex-col">
                  <span>Giá vốn</span>
                  <span className="text-xs text-muted-foreground">Đã bao gồm phí</span>
                </div>
              </SelectItem>
              <SelectItem value="purchase">
                <div className="flex flex-col">
                  <span>Giá nhập (NCC)</span>
                  <span className="text-xs text-muted-foreground">Giá mua từ NCC</span>
                </div>
              </SelectItem>
              <SelectItem value="recent">
                <div className="flex flex-col">
                  <span>Giá nhập gần nhất</span>
                  <span className="text-xs text-muted-foreground">Lần nhập trước</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          {/* Cách tính giá vốn */}
          <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-md">
            <Calculator className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select 
              value={costCalculationMethod} 
              onValueChange={(v) => onCostCalculationMethodChange?.(v as CostCalculationMethod)}
            >
              <SelectTrigger className="w-full sm:w-44 h-8 border-0 bg-transparent p-0 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_purchase">
                  <div className="flex flex-col">
                    <span>Giá vốn = Giá nhập</span>
                    <span className="text-xs text-muted-foreground">Giá vốn mới = giá nhập lần này</span>
                  </div>
                </SelectItem>
                <SelectItem value="weighted_average">
                  <div className="flex flex-col">
                    <span>Bình quân gia quyền</span>
                    <span className="text-xs text-muted-foreground">(Tồn cũ × Giá cũ + SL nhập × Giá nhập) / Tồn mới</span>
                  </div>
                </SelectItem>
                <SelectItem value="with_fees">
                  <div className="flex flex-col">
                    <span>Giá nhập + Phí</span>
                    <span className="text-xs text-muted-foreground">Giá nhập + Tổng chi phí / Số lượng</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-2 text-xs">
                    <p><strong>Giá vốn = Giá nhập:</strong> Lấy trực tiếp giá nhập lần này làm giá vốn</p>
                    <p><strong>Bình quân gia quyền:</strong> Tính trung bình theo số lượng tồn kho và giá nhập</p>
                    <p><strong>Giá nhập + Phí:</strong> Giá nhập + Tổng chi phí / Số lượng</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {costCalculationMethod === 'with_fees' && totalFees > 0 && totalQuantity > 0 && (
              <span className="text-xs text-primary font-medium whitespace-nowrap">
                (+{formatCurrency(Math.round(totalFees / totalQuantity))}đ/SP)
              </span>
            )}
          </div>
        </div>

        {/* Products Table - UI giống LineItemsTable */}
        <div className="border rounded-md">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mb-3" />
              <p>Đơn nhập hàng của bạn chưa có sản phẩm nào</p>
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowBulkSelector(true)}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </div>
          ) : (
            <>
            {/* ===== DESKTOP: Table editable nguyên trạng ===== */}
            <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12.5 text-center">STT</TableHead>
                  <TableHead className="w-15">Ảnh</TableHead>
                  <TableHead className="w-15">Tên sản phẩm</TableHead>
                  <TableHead className="w-30">Số lượng</TableHead>
                  <TableHead className="w-45">Đơn giá</TableHead>
                  <TableHead className="w-32 text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help border-b border-dashed border-muted-foreground">
                            Giá vốn
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <p className="text-xs">
                            Giá vốn dự kiến sau khi nhập kho. 
                            {costCalculationMethod === 'with_fees' 
                              ? ' Đã bao gồm phí vận chuyển và chi phí khác phân bổ theo số lượng.' 
                              : costCalculationMethod === 'weighted_average'
                                ? ' Tính bình quân gia quyền với tồn kho hiện tại.'
                                : ' Bằng giá nhập từ NCC.'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="w-32">Thuế</TableHead>
                  <TableHead className="w-36">Chiết khấu</TableHead>
                  <TableHead className="w-32 text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help border-b border-dashed border-muted-foreground">
                            Thành tiền
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <p className="text-xs">
                            Thành tiền = Số lượng × Đơn giá - Chiết khấu.
                            Đây là số tiền cần trả cho NCC (chưa bao gồm phí vận chuyển).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => {
                  // Validation checks
                  const hasZeroPrice = item.unitPrice === 0;
                  const hasInvalidQuantity = item.quantity <= 0;
                  const hasError = hasZeroPrice || hasInvalidQuantity;
                  const isPercentage = item.discountType === 'percent';
                  
                  // Check if combo
                  const isCombo = item.product.type === 'combo' && item.product.comboItems?.length;
                  const isComboExpanded = !!expandedCombos[index];
                  const comboItems = isCombo
                    ? (item.product.comboItems ?? []).map((comboItem: ComboItem) => {
                        const childProduct = comboChildProductsMap.get(comboItem.productSystemId);
                        return { ...comboItem, product: childProduct };
                      })
                    : [];
                  
                  return (
                    <React.Fragment key={item.product.systemId}>
                      <TableRow className={`${isCombo ? 'bg-muted/30' : ''} ${hasError ? 'bg-red-50 dark:bg-red-950/20' : ''}`}>
                        <TableCell className="text-center text-muted-foreground">
                          <div className="flex items-center justify-center gap-1">
                            {isCombo && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                onClick={() => toggleComboExpanded(index)}
                              >
                                {isComboExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            )}
                            <span>{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <ProductThumbnail
                            product={item.product}
                            onPreview={handlePreview}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Link href={`/products/${item.product.systemId}`} 
                                className="font-medium text-primary hover:underline"
                              >
                                {item.product.name}
                              </Link>
                              {isCombo && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
                                  COMBO
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground group/info">
                                <span>{getProductTypeLabel(item.product)}</span>
                                <span>-</span>
                                <Link href={`/products/${item.product.systemId}`} 
                                  className="text-primary hover:underline"
                                >
                                  {item.product.id}
                                </Link>
                                {item.notes ? (
                                  <>
                                    <span className="text-amber-600">
                                      <StickyNote className="h-3 w-3 inline mr-0.5" />
                                      <span className="italic">{item.notes}</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenNoteDialog(index)}
                                      className="md:opacity-0 md:group-hover/info:opacity-100 transition-opacity p-0.5 hover:bg-muted rounded"
                                    >
                                      <Pencil className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                  </>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenNoteDialog(index)}
                                    className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground ml-1 md:opacity-0 md:group-hover/info:opacity-100 transition-opacity"
                                  >
                                    Thêm ghi chú
                                  </Button>
                                )}
                              </div>
                              {hasZeroPrice && (
                                <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                                  ⚠️ Chưa có giá nhập
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <NumberInput
                            value={item.quantity}
                            onChange={(value) => handleQuantityChange(index, value)}
                            min={1}
                            className={`h-9 ${hasInvalidQuantity ? 'border-red-500' : ''}`}
                            format={false}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CurrencyInput
                              value={item.unitPrice}
                              onChange={(value) => handlePriceChange(index, value)}
                              className={`h-9 ${hasZeroPrice ? 'border-red-500' : ''}`}
                            />
                            {getPriceHistory(item.product.systemId).length > 0 && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <History className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80" align="start">
                                  <div className="space-y-3">
                                    <p className="font-semibold text-sm">Lịch sử giá nhập</p>
                                    <div className="space-y-2">
                                      {getPriceHistory(item.product.systemId).map((h, i) => (
                                        <div key={i} className="flex justify-between text-sm border-b pb-2 last:border-0">
                                          <div>
                                            <p className="font-medium">{formatDateForDisplay(h.date)}</p>
                                            <p className="text-xs text-muted-foreground">Đơn: {h.orderId}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-semibold">{formatCurrency(h.price)} ₫</p>
                                            <p className="text-xs text-muted-foreground">SL: {h.quantity}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="pt-2 border-t">
                                      <p className="text-sm text-muted-foreground">
                                        Giá trung bình: <strong className="text-foreground">{formatCurrency(getAveragePrice(item.product.systemId))} ₫</strong>
                                      </p>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </TableCell>
                        {/* Giá vốn dự kiến - tính cho lô nhập này */}
                        <TableCell className="text-right">
                          {(() => {
                            const feePerUnit = totalQuantity > 0 ? totalFees / totalQuantity : 0;
                            
                            // Giá vốn = Giá nhập + Phí phân bổ (cho lô này)
                            // KHÔNG bình quân với tồn cũ - mỗi lô có giá riêng
                            let estimatedCost = item.unitPrice;
                            if (costCalculationMethod === 'last_purchase') {
                              // Giá nhập gần nhất (không tính phí)
                              estimatedCost = item.unitPrice;
                            } else if (costCalculationMethod === 'weighted_average') {
                              // Bình quân gia quyền không phí = giá nhập
                              estimatedCost = item.unitPrice;
                            } else { // with_fees
                              // Giá nhập + phí phân bổ cho lô này
                              estimatedCost = Math.round(item.unitPrice + feePerUnit);
                            }
                            
                            return (
                              <div className="flex flex-col items-end">
                                <span className="font-medium text-primary">{formatCurrency(estimatedCost)}</span>
                                {costCalculationMethod === 'with_fees' && feePerUnit > 0 && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="text-xs text-muted-foreground cursor-help">
                                          ({formatCurrency(item.unitPrice)} + {formatCurrency(Math.round(feePerUnit))} phí)
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent side="left" className="max-w-xs">
                                        <div className="text-xs space-y-1">
                                          <p><strong>Tính giá vốn:</strong></p>
                                          <p>Đơn giá nhập: {formatCurrency(item.unitPrice)}</p>
                                          <p>+ Phí phân bổ: {formatCurrency(Math.round(feePerUnit))}/SP</p>
                                          <p className="border-t pt-1"><strong>= Giá vốn: {formatCurrency(estimatedCost)}</strong></p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            );
                          })()}
                        </TableCell>
                        <TableCell>
                          <TaxSelector
                            value={item.taxId || ""}
                            onChange={(taxId, rate) => handleTaxChange(index, taxId, rate)}
                            type="purchase"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Select
                              value={item.discountType}
                              onValueChange={(v: 'percent' | 'fixed') => handleDiscountTypeChange(index, v)}
                            >
                              <SelectTrigger className="w-17.5">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed">đ</SelectItem>
                                <SelectItem value="percent">%</SelectItem>
                              </SelectContent>
                            </Select>
                            {isPercentage ? (
                              <div className="relative w-full">
                                <NumberInput
                                  value={item.discount}
                                  onChange={(value) => handleDiscountChange(index, value)}
                                  min={0}
                                  max={100}
                                  className="h-9"
                                  format={false}
                                />
                                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none z-10">
                                  %
                                </span>
                              </div>
                            ) : (
                              <CurrencyInput
                                value={item.discount}
                                onChange={(value) => handleDiscountChange(index, value)}
                                className="h-9"
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">
                                  {formatCurrency(item.total)} ₫
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-xs">
                                <div className="text-xs space-y-1">
                                  <p><strong>Tính thành tiền:</strong></p>
                                  <p>{formatCurrency(item.quantity)} SP × {formatCurrency(item.unitPrice)} ₫ = {formatCurrency(item.quantity * item.unitPrice)} ₫</p>
                                  {item.discount > 0 && (
                                    <p>- Chiết khấu: {item.discountType === 'percent' 
                                      ? `${item.discount}% = ${formatCurrency(item.quantity * item.unitPrice * item.discount / 100)} ₫`
                                      : `${formatCurrency(item.discount)} ₫`
                                    }</p>
                                  )}
                                  <p className="border-t pt-1"><strong>= {formatCurrency(item.total)} ₫</strong></p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(index)}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Combo items expanded view */}
                      {isCombo && isComboExpanded && comboItems.length > 0 && (
                        <>
                          {comboItems.map((comboItem: ComboItem & { product?: Product }, ciIndex: number) => (
                            <TableRow key={`combo-${index}-${ciIndex}`} className="bg-muted/40">
                              <TableCell className="text-center text-muted-foreground pl-8">
                                <span className="text-muted-foreground/50">└</span>
                              </TableCell>
                              <TableCell>
                                <ComboChildImage 
                                  product={comboItem.product}
                                  onPreview={handlePreview}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-0.5">
                                  <p className="text-sm text-muted-foreground">
                                    {comboItem.product?.name || 'Sản phẩm không tồn tại'}
                                  </p>
                                  {comboItem.product && (
                                    <Link href={`/products/${comboItem.product.systemId}`}
                                      className="text-xs text-primary hover:underline"
                                    >
                                      {comboItem.product.id}
                                    </Link>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">{comboItem.quantity * item.quantity}</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">---</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">---</span>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="text-right text-sm text-muted-foreground">---</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          ))}
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
            </div>

            {/* ===== MOBILE: MobileCard stack + inline quick-edit ===== */}
            <div className="md:hidden p-3 space-y-3">
              {items.map((item, index) => {
                const hasZeroPrice = item.unitPrice === 0;
                const hasInvalidQuantity = item.quantity <= 0;
                const hasError = hasZeroPrice || hasInvalidQuantity;
                const isPercentage = item.discountType === 'percent';
                const isComboItem = item.product.type === 'combo' && !!item.product.comboItems?.length;
                const isComboExpanded = !!expandedCombos[index];
                const comboChildList = isComboItem
                  ? (item.product.comboItems ?? []).map((ci: ComboItem) => ({
                      ...ci,
                      product: comboChildProductsMap.get(ci.productSystemId),
                    }))
                  : [];
                const hasAdvanced = item.tax > 0 || item.discount > 0 || !!item.notes;

                const feePerUnit = totalQuantity > 0 ? totalFees / totalQuantity : 0;
                let estimatedCost = item.unitPrice;
                if (costCalculationMethod === 'with_fees') {
                  estimatedCost = Math.round(item.unitPrice + feePerUnit);
                }
                const imageUrl = item.product.thumbnailImage
                  || item.product.galleryImages?.[0]
                  || item.product.images?.[0];

                return (
                  <MobileCard
                    key={item.product.systemId}
                    inert
                    emphasis={hasError ? 'destructive' : 'none'}
                  >
                    <MobileCardHeader className="items-start justify-between gap-3">
                      {imageUrl ? (
                        <div
                          className="group relative h-12 w-12 shrink-0 rounded-md overflow-hidden border border-muted cursor-pointer"
                          onClick={() => handlePreview(imageUrl, item.product.name)}
                        >
                          <Image
                            src={imageUrl}
                            alt={item.product.name}
                            fill
                            sizes="48px"
                            className="object-cover transition-all group-hover:brightness-75"
                          />
                          <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Eye className="w-4 h-4 text-white drop-shadow-md" />
                          </div>
                        </div>
                      ) : (
                        <div className="h-12 w-12 shrink-0 bg-muted rounded-md flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/products/${item.product.systemId}`}
                            className="text-sm font-semibold leading-tight line-clamp-2 hover:underline text-foreground"
                          >
                            {item.product.name}
                          </Link>
                          {isComboItem && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-medium shrink-0">
                              COMBO
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {getProductTypeLabel(item.product)} · <Link
                            href={`/products/${item.product.systemId}`}
                            className="text-primary hover:underline"
                          >{item.product.id}</Link>
                        </div>
                        {hasZeroPrice && (
                          <div className="mt-1 text-xs text-destructive font-medium">
                            Chưa có giá nhập
                          </div>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8"
                        onClick={() => handleRemove(index)}
                        aria-label="Xoá sản phẩm"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </MobileCardHeader>

                    <MobileCardBody>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Số lượng</Label>
                          <NumberInput
                            value={item.quantity}
                            onChange={(v) => handleQuantityChange(index, v)}
                            min={1}
                            className={`h-10 mt-1 text-sm ${hasInvalidQuantity ? 'border-red-500' : ''}`}
                            format={false}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Đơn giá nhập</Label>
                          <CurrencyInput
                            value={item.unitPrice}
                            onChange={(v) => handlePriceChange(index, v)}
                            className={`h-10 mt-1 text-sm ${hasZeroPrice ? 'border-red-500' : ''}`}
                          />
                        </div>

                        {hasAdvanced && (
                          <div className="col-span-2 flex flex-wrap gap-1.5 pt-1">
                            {item.tax > 0 && (
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                Thuế {item.tax}%
                              </span>
                            )}
                            {item.discount > 0 && (
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                CK {isPercentage ? `${item.discount}%` : formatCurrency(item.discount)}
                              </span>
                            )}
                            {item.notes && (
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 inline-flex items-center gap-1 max-w-full">
                                <StickyNote className="h-3 w-3 shrink-0" />
                                <span className="truncate">{item.notes}</span>
                              </span>
                            )}
                          </div>
                        )}

                        {/* Giá vốn dự kiến (read-only) */}
                        <div className="col-span-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>Giá vốn dự kiến</span>
                          <span className="font-medium text-foreground tabular-nums">
                            {formatCurrency(estimatedCost)} ₫
                            {costCalculationMethod === 'with_fees' && feePerUnit > 0 && (
                              <span className="text-muted-foreground font-normal"> (+{formatCurrency(Math.round(feePerUnit))} phí)</span>
                            )}
                          </span>
                        </div>

                        <div className="col-span-2 flex items-center justify-between border-t border-border/50 pt-2 mt-1">
                          <span className="text-sm text-muted-foreground">Thành tiền</span>
                          <span className="text-base font-bold text-primary">{formatCurrency(item.total)} ₫</span>
                        </div>

                        {isComboItem && comboChildList.length > 0 && (
                          <div className="col-span-2">
                            <button
                              type="button"
                              className="w-full flex items-center text-xs text-muted-foreground hover:text-foreground py-1.5"
                              onClick={() => toggleComboExpanded(index)}
                            >
                              {isComboExpanded ? <ChevronDown className="h-3.5 w-3.5 mr-1" /> : <ChevronRight className="h-3.5 w-3.5 mr-1" />}
                              Thành phần combo ({comboChildList.length})
                            </button>
                            {isComboExpanded && (
                              <div className="space-y-1.5 pl-4 border-l border-border/50 mt-1">
                                {comboChildList.map((ci, ciIdx) => (
                                  <div
                                    key={`combo-m-${index}-${ciIdx}`}
                                    className="flex items-center justify-between gap-2 text-xs"
                                  >
                                    <div className="min-w-0 flex-1 truncate text-muted-foreground">
                                      {ci.product?.name || 'Sản phẩm không tồn tại'}
                                    </div>
                                    <div className="shrink-0 text-muted-foreground tabular-nums">
                                      × {ci.quantity * item.quantity}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </MobileCardBody>

                    <MobileCardFooter noBorder={false}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full h-10"
                        onClick={() => setAdvancedIdx(index)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                        Sửa chi tiết (thuế, CK, ghi chú)
                      </Button>
                    </MobileCardFooter>
                  </MobileCard>
                );
              })}
            </div>

            {/* Mobile bottom sheet — tax, CK, ghi chú */}
            <Sheet open={advancedIdx !== null} onOpenChange={(open) => !open && setAdvancedIdx(null)}>
              <SheetContent side="bottom" className="h-[90vh] overflow-y-auto md:hidden">
                <SheetHeader>
                  <SheetTitle>Sửa chi tiết sản phẩm</SheetTitle>
                  {advancedIdx !== null && items[advancedIdx] && (
                    <p className="text-sm text-muted-foreground text-left line-clamp-2">
                      {items[advancedIdx].product.name}
                    </p>
                  )}
                </SheetHeader>

                {advancedIdx !== null && items[advancedIdx] && (
                  <div className="space-y-5 mt-5 pb-10">
                    <div>
                      <Label className="text-sm">Thuế</Label>
                      <div className="mt-1.5">
                        <TaxSelector
                          value={items[advancedIdx].taxId || ''}
                          onChange={(taxId, rate) => handleTaxChange(advancedIdx, taxId, rate)}
                          type="purchase"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Chiết khấu</Label>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Select
                          value={items[advancedIdx].discountType}
                          onValueChange={(v: 'percent' | 'fixed') => handleDiscountTypeChange(advancedIdx, v)}
                        >
                          <SelectTrigger className="h-10 w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">đ</SelectItem>
                            <SelectItem value="percent">%</SelectItem>
                          </SelectContent>
                        </Select>
                        {items[advancedIdx].discountType === 'percent' ? (
                          <div className="relative flex-1">
                            <NumberInput
                              value={items[advancedIdx].discount}
                              onChange={(v) => handleDiscountChange(advancedIdx, v)}
                              min={0}
                              max={100}
                              className="h-10"
                              format={false}
                            />
                            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none z-10">
                              %
                            </span>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <CurrencyInput
                              value={items[advancedIdx].discount}
                              onChange={(v) => handleDiscountChange(advancedIdx, v)}
                              className="h-10"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Ghi chú</Label>
                      <Textarea
                        value={items[advancedIdx].notes || ''}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[advancedIdx].notes = e.target.value;
                          onItemsChange(newItems);
                        }}
                        placeholder="Ghi chú cho sản phẩm..."
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>

                    <Button
                      type="button"
                      className="w-full h-11"
                      onClick={() => setAdvancedIdx(null)}
                    >
                      Xong
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
            </>
          )}
        </div>
      </CardContent>

      {/* Bulk Selector Dialog - Dùng component dùng chung, loại bỏ combo */}
      <ProductSelectionDialog
        isOpen={showBulkSelector}
        onOpenChange={setShowBulkSelector}
        onSelect={(products) => handleBulkAdd(products)}
        excludeTypes={['combo']}
      />

      {/* Note Dialog - UI giống LineItemsTable */}
      <Dialog open={editingNoteIndex !== null} onOpenChange={(open) => !open && setEditingNoteIndex(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ghi chú sản phẩm</DialogTitle>
            <DialogDescription>
              {editingNoteIndex !== null && items[editingNoteIndex] && (
                <span>Ghi chú cho: {items[editingNoteIndex].product.name}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Nhập ghi chú cho sản phẩm..."
              value={tempNote}
              onChange={handleNoteInputChange}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNoteIndex(null)}>
              Hủy
            </Button>
            <Button onClick={handleSaveNote}>
              Lưu ghi chú
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog 
        open={previewState.open} 
        onOpenChange={(open) => setPreviewState(prev => ({ ...prev, open }))} 
        images={[previewState.image]} 
        title={previewState.title}
      />
    </Card>
  );
}
