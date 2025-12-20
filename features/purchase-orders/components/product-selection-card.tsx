import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { NumberInput } from "../../../components/ui/number-input";
import { CurrencyInput } from "../../../components/ui/currency-input";
import { Package, Plus, X, StickyNote, History, Pencil, Eye, ChevronDown, ChevronRight } from "lucide-react";
import { PurchaseProductSearch } from "../../../components/shared/unified-product-search";
import { ProductSelectionDialog } from "../../shared/product-selection-dialog";
import { TaxSelector } from "./tax-selector";
import { useTaxStore } from "../../settings/taxes/store";
import { useProductStore } from "../../products/store";
import { useProductTypeStore } from "../../settings/inventory/product-type-store";
import { usePurchaseOrderStore } from "../store";
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
import { Link } from '@/lib/next-compat';

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
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                <img
                    src={imageUrl}
                    alt={product?.name || ''}
                    className="w-full h-full object-cover transition-all group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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

interface ProductSelectionCardProps {
  items: ProductLineItem[];
  onItemsChange: (items: ProductLineItem[]) => void;
  supplierId?: string | undefined;
}

const formatCurrency = (value: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return new Intl.NumberFormat("vi-VN").format(value);
};

export function ProductSelectionCard({
  items,
  onItemsChange,
  supplierId,
}: ProductSelectionCardProps) {
  const [showBulkSelector, setShowBulkSelector] = React.useState(false);
  const [priceMode, setPriceMode] = React.useState<"cost" | "recent">("cost");
  const [editingNoteIndex, setEditingNoteIndex] = React.useState<number | null>(null);
  const [tempNote, setTempNote] = React.useState<string>("");
  const [previewState, setPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
    open: false, image: '', title: ''
  });
  const [expandedCombos, setExpandedCombos] = React.useState<Record<number, boolean>>({});
  
  // Get default tax from taxes store
  const { data: taxes, getDefaultPurchase } = useTaxStore();
  const defaultPurchaseTax = React.useMemo(() => getDefaultPurchase(), [getDefaultPurchase]);
  
  // Get products store
  const { data: allProducts } = useProductStore();
  
  // Get product type store
  const { findById: findProductTypeById } = useProductTypeStore();
  
  // Get purchase orders for price history
  const { data: purchaseOrders } = usePurchaseOrderStore();

  // Fallback labels for product types
  const productTypeFallbackLabels: Record<string, string> = {
    physical: 'Hàng hóa',
    single: 'Hàng hóa',
    service: 'Dịch vụ',
    digital: 'Sản phẩm số',
    combo: 'Combo',
  };

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
  
  // Get price history for a product
  const getPriceHistory = React.useCallback((productId: string) => {
    return purchaseOrders
      .filter(po => po.status !== 'Đã hủy')
      .flatMap(po => 
        po.lineItems
          .filter(li => li.productSystemId === productId)
          .map(li => ({
            date: po.orderDate,
            price: li.unitPrice,
            orderId: po.id,
            quantity: li.quantity
          }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Lấy 5 lần gần nhất
  }, [purchaseOrders]);
  
  // Calculate average price
  const getAveragePrice = React.useCallback((productId: string) => {
    const history = getPriceHistory(productId);
    if (history.length === 0) return 0;
    const total = history.reduce((sum, h) => sum + h.price, 0);
    return Math.round(total / history.length);
  }, [getPriceHistory]);
  
  // Get default tax rate
  const getDefaultTaxRate = React.useCallback(() => {
    if (defaultPurchaseTax) {
      return defaultPurchaseTax.rate;
    }
    return 0;
  }, [defaultPurchaseTax]);

  // Get price based on price mode
  const getProductPrice = React.useCallback((product: Product) => {
    if (priceMode === 'recent') {
      // Ưu tiên dùng giá nhập gần nhất nếu có
      return product.lastPurchasePrice || product.costPrice;
    }
    // Mặc định dùng giá nhập (costPrice)
    return product.costPrice;
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
  }, [priceMode, items, getProductPrice, onItemsChange]); // eslint-disable-line react-hooks/exhaustive-deps

  // Add single product
  const handleAddProduct = (productId: string) => {
    // Check if product already exists
    const existingIndex = items.findIndex(item => item.product.systemId === productId);
    
    if (existingIndex >= 0) {
      // Product exists, increase quantity
      const updatedItems = [...items];
      updatedItems[existingIndex].quantity += 1;
      updatedItems[existingIndex].total = calculateTotal(updatedItems[existingIndex]);
      onItemsChange(updatedItems);
      return;
    }

    // Find product from store
    const product = allProducts.find((p: Product) => p.systemId === productId);
    if (!product) {
      console.error("Product not found:", productId);
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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Thông tin sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search + Bulk Add + Price Mode - Dùng component dùng chung */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <PurchaseProductSearch
              onSelectProduct={(product) => handleAddProduct(product.systemId)}
              placeholder="Tìm theo tên, mã SKU, hoặc quét mã Barcode...(F3)"
              excludeProductIds={excludedProductIds}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowBulkSelector(true)}
            className="w-full sm:w-auto"
          >
            Chọn nhiều
          </Button>
          <Select value={priceMode} onValueChange={(v: "cost" | "recent") => setPriceMode(v)}>
            <SelectTrigger className="w-full sm:w-[180px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cost">Giá nhập</SelectItem>
              <SelectItem value="recent">Giá nhập gần nhất</SelectItem>
            </SelectContent>
          </Select>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">STT</TableHead>
                  <TableHead className="w-[60px]">Ảnh</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="w-[120px]">Số lượng</TableHead>
                  <TableHead className="w-[180px]">Đơn giá</TableHead>
                  <TableHead className="w-[140px]">Thuế</TableHead>
                  <TableHead className="w-[180px]">Chiết khấu</TableHead>
                  <TableHead className="w-[120px] text-right">Thành tiền</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
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
                    ? (item.product.comboItems ?? []).map((comboItem: any) => {
                        const childProduct = allProducts.find(p => p.systemId === comboItem.productSystemId);
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
                                className="h-6 w-6 p-0"
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
                              <Link 
                                to={`/products/${item.product.systemId}`} 
                                className="font-medium text-primary hover:underline"
                              >
                                {item.product.name}
                              </Link>
                              {isCombo && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
                                  COMBO
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground group/info">
                                <span>{getProductTypeLabel(item.product)}</span>
                                <span>-</span>
                                <Link 
                                  to={`/products/${item.product.systemId}`} 
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
                                      className="opacity-0 group-hover/info:opacity-100 transition-opacity p-0.5 hover:bg-muted rounded"
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
                                    className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground ml-1 opacity-0 group-hover/info:opacity-100 transition-opacity"
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
                        <TableCell>
                          <TaxSelector
                            value={item.taxId || 'none'}
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
                              <SelectTrigger className="h-9 w-[70px]">
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
                          {formatCurrency(item.total)} ₫
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
                          {comboItems.map((comboItem: any, ciIndex: number) => (
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
                                    <Link
                                      to={`/products/${comboItem.product.systemId}`}
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
