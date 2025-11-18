import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { CurrencyInput } from "../../../components/ui/currency-input.tsx";
import { Package, Plus, X, StickyNote, History } from "lucide-react";
import { ProductCombobox } from "./product-combobox-virtual.tsx";
import { BulkProductSelectorDialog } from "./bulk-product-selector-dialog.tsx";
import { PriceSelector } from "./price-selector.tsx";
import { TaxSelector } from "./tax-selector.tsx";
import { useTaxSettingsStore } from "../../settings/tax-settings-store.ts";
import { useTaxStore } from "../../settings/taxes/store.ts";
import { useProductStore } from "../../products/store.ts";
import { usePurchaseOrderStore } from "../store.ts";
import type { Product } from "../../products/types.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import { Link } from "react-router-dom";

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
  supplierId?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
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
  
  // Get default tax settings
  const { defaultPurchaseTaxId } = useTaxSettingsStore();
  const { data: taxes } = useTaxStore();
  
  // Get products store
  const { data: allProducts } = useProductStore();
  
  // Get purchase orders for price history
  const { data: purchaseOrders } = usePurchaseOrderStore();
  
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
    if (defaultPurchaseTaxId) {
      const defaultTax = taxes.find(t => t.systemId === defaultPurchaseTaxId);
      return defaultTax ? defaultTax.rate : 0;
    }
    return 0;
  }, [defaultPurchaseTaxId, taxes]);

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
      taxId: defaultPurchaseTaxId || undefined,
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
          taxId: defaultPurchaseTaxId || undefined,
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
        {/* Search + Bulk Add + Price Mode */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <ProductCombobox
              onValueChange={handleAddProduct}
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

        {/* Products Table */}
        <div className="border rounded-lg overflow-hidden">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">STT</TableHead>
                    <TableHead className="w-[60px]">Ảnh</TableHead>
                    <TableHead className="min-w-[200px]">Tên sản phẩm</TableHead>
                    <TableHead className="w-[100px]">Đơn vị</TableHead>
                    <TableHead className="w-[100px]">SL nhập</TableHead>
                    <TableHead className="w-[150px]">Đơn giá</TableHead>
                    <TableHead className="w-[180px]">Thuế</TableHead>
                    <TableHead className="w-[120px]">Chiết khấu</TableHead>
                    <TableHead className="w-[150px]">Thành tiền</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => {
                    // Validation checks
                    const hasZeroPrice = item.unitPrice === 0;
                    const hasInvalidQuantity = item.quantity <= 0;
                    const hasError = hasZeroPrice || hasInvalidQuantity;
                    
                    return (
                    <TableRow key={item.product.systemId} className={hasError ? 'bg-red-50 dark:bg-red-950/20' : ''}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="w-10 h-9 bg-muted rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{item.product.name}</p>
                            {item.notes && (
                              <StickyNote className="h-4 w-4 text-amber-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 group">
                            <Link 
                              to={`/products/${item.product.systemId}`} 
                              target="_blank"
                              className="text-sm text-primary hover:underline"
                            >
                              {item.product.id}
                            </Link>
                            {item.notes && (
                              <span className="text-xs text-muted-foreground italic">
                                • {item.notes}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenNoteDialog(index)}
                              className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {item.notes ? 'Sửa' : 'Thêm ghi chú'}
                            </Button>
                          </div>
                          {hasZeroPrice && (
                            <span className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                              ⚠️ Chưa có giá nhập
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.product.unit}</TableCell>
                      <TableCell>
                        <div>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(index, Number(e.target.value))
                            }
                            className={`w-20 ${hasInvalidQuantity ? 'border-red-500' : ''}`}
                          />
                          {hasInvalidQuantity && (
                            <span className="text-xs text-red-600 block mt-1">Phải &gt; 0</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CurrencyInput
                            value={item.unitPrice}
                            onChange={(value) => handlePriceChange(index, value)}
                            className={`w-36 ${hasZeroPrice ? 'border-red-500' : ''}`}
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
                                          <p className="font-medium">{new Date(h.date).toLocaleDateString('vi-VN')}</p>
                                          <p className="text-xs text-muted-foreground">Đơn: {h.orderId}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-semibold">{formatCurrency(h.price)}</p>
                                          <p className="text-xs text-muted-foreground">SL: {h.quantity}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="pt-2 border-t">
                                    <p className="text-sm text-muted-foreground">
                                      Giá trung bình: <strong className="text-foreground">{formatCurrency(getAveragePrice(item.product.systemId))}</strong>
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
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={item.discount}
                            onChange={(e) =>
                              handleDiscountChange(index, Number(e.target.value))
                            }
                            className="w-24"
                          />
                          <Select
                            value={item.discountType}
                            onValueChange={(v: 'percent' | 'fixed') =>
                              handleDiscountTypeChange(index, v)
                            }
                          >
                            <SelectTrigger className="w-[80px] h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">VND</SelectItem>
                              <SelectItem value="percent">%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(item.total)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>

      {/* Bulk Selector Dialog */}
      <BulkProductSelectorDialog
        open={showBulkSelector}
        onOpenChange={setShowBulkSelector}
        onConfirm={handleBulkAdd}
        excludeProductIds={excludedProductIds}
      />

      {/* Note Dialog */}
      <Dialog open={editingNoteIndex !== null} onOpenChange={(open) => !open && setEditingNoteIndex(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ghi chú sản phẩm</DialogTitle>
            <DialogDescription>
              Thêm ghi chú cho sản phẩm: {editingNoteIndex !== null ? items[editingNoteIndex]?.product.name : ''}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={tempNote}
            onChange={handleNoteInputChange}
            placeholder="Nhập ghi chú..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNoteIndex(null)}>Hủy</Button>
            <Button onClick={handleSaveNote}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
