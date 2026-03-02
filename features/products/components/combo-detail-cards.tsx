'use client';

/**
 * Combo Detail Cards - Components cho trang chi tiết sản phẩm combo
 * Tách từ detail-page.tsx để giảm kích thước file
 */

import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle, Eye, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LazyImage } from '@/components/ui/lazy-image';
import { useAllProducts } from '../hooks/use-all-products';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { calculateComboStock } from '../combo-utils';
import type { Product } from '../types';
import type { SystemId } from '@/lib/id-types';

// Utility functions
const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '-';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getTypeLabel = (type?: string) => {
  switch (type) {
    case 'physical': return 'Hàng hóa';
    case 'service': return 'Dịch vụ';
    case 'digital': return 'Sản phẩm số';
    case 'combo': return 'Combo';
    default: return 'Không xác định';
  }
};

// ============================================
// COMBO ITEMS CARD
// ============================================

interface ComboItemsCardProps {
  product: Product;
  pricingPolicies: { systemId: string; name: string; isDefault?: boolean; type: string }[];
  onImagePreview?: (imageUrl: string) => void;
}

/**
 * ComboItemsCard - Hiển thị thành phần combo trong trang Detail
 */
export function ComboItemsCard({ 
  product, 
  pricingPolicies,
  onImagePreview,
}: ComboItemsCardProps) {
  const { data: allProducts } = useAllProducts();
  const defaultPricingPolicy = pricingPolicies.find(p => p.isDefault && p.type === 'Bán hàng');
  
  // Get combo items with product details
  const comboItemsWithDetails = React.useMemo(() => {
    if (!product.comboItems) return [];
    return product.comboItems.map(item => {
      const childProduct = allProducts.find(p => p.systemId === item.productSystemId);
      
      // Fallback price: 1) default policy price, 2) first available price, 3) costPrice, 4) 0
      let unitPrice = 0;
      if (childProduct) {
        if (defaultPricingPolicy && childProduct.prices?.[defaultPricingPolicy.systemId]) {
          unitPrice = childProduct.prices[defaultPricingPolicy.systemId];
        } else if (childProduct.prices && Object.keys(childProduct.prices).length > 0) {
          const firstPriceKey = Object.keys(childProduct.prices)[0];
          unitPrice = childProduct.prices[firstPriceKey] || 0;
        } else if (childProduct.costPrice) {
          unitPrice = childProduct.costPrice;
        }
      }
      
      const costPrice = childProduct?.costPrice || 0;
      
      return {
        ...item,
        product: childProduct,
        unitPrice,
        costPrice,
        lineTotal: unitPrice * item.quantity,
        lineCostTotal: costPrice * item.quantity,
      };
    });
  }, [product.comboItems, allProducts, defaultPricingPolicy]);
  
  // Calculate totals
  const totalOriginalPrice = comboItemsWithDetails.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalCostPrice = comboItemsWithDetails.reduce((sum, item) => sum + item.lineCostTotal, 0);
  
  // Get pricing type label
  const getPricingTypeLabel = () => {
    switch (product.comboPricingType) {
      case 'fixed': return 'Giá cố định';
      case 'sum_discount_percent': return `Giảm ${product.comboDiscount || 0}%`;
      case 'sum_discount_amount': return `Giảm ${formatCurrency(product.comboDiscount || 0)}`;
      default: return 'Chưa cài đặt';
    }
  };
  
  // Calculate final combo price
  const comboPrice = React.useMemo(() => {
    if (product.comboPricingType === 'fixed') {
      return product.comboDiscount || 0;
    }
    if (product.comboPricingType === 'sum_discount_percent') {
      return Math.round(totalOriginalPrice * (1 - (product.comboDiscount || 0) / 100));
    }
    if (product.comboPricingType === 'sum_discount_amount') {
      return Math.max(0, totalOriginalPrice - (product.comboDiscount || 0));
    }
    return totalOriginalPrice;
  }, [product.comboPricingType, product.comboDiscount, totalOriginalPrice]);
  
  const savings = totalOriginalPrice > comboPrice ? totalOriginalPrice - comboPrice : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle size="lg">
          Thành phần Combo
          <Badge variant="secondary" className="ml-2">{comboItemsWithDetails.length} sản phẩm</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Combo Items Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead className="text-center w-16">SL</TableHead>
                <TableHead className="text-right w-28">Đơn giá</TableHead>
                <TableHead className="text-right w-28">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comboItemsWithDetails.map((item, index) => (
                <TableRow key={item.productSystemId || index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {item.product?.thumbnailImage ? (
                        <div 
                          className="group/thumbnail relative w-10 h-10 rounded-md border overflow-hidden bg-muted shrink-0 cursor-pointer"
                          onClick={() => onImagePreview?.(item.product!.thumbnailImage!)}
                        >
                          <LazyImage
                            src={item.product.thumbnailImage}
                            alt={item.product.name}
                            className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-opacity">
                            <Eye className="w-4 h-4 text-white drop-shadow-md" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-md border bg-muted shrink-0 flex items-center justify-center text-muted-foreground text-body-xs">
                          N/A
                        </div>
                      )}
                      {item.product ? (
                        <div className="min-w-0">
                          <Link 
                            href={`/products/${item.product.systemId}`}
                            className="text-primary hover:underline font-medium block truncate"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-body-xs text-muted-foreground truncate">
                            {item.product.id} · {getTypeLabel(item.product.type)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-body-sm">Sản phẩm không tồn tại</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p>{formatCurrency(item.unitPrice)}</p>
                      <p className="text-body-xs text-muted-foreground">Vốn: {formatCurrency(item.costPrice)}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(item.lineTotal)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={3} className="text-right text-body-sm text-muted-foreground">Tổng giá gốc:</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(totalOriginalPrice)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        {/* Pricing Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div>
            <p className="text-body-sm text-muted-foreground mb-1">Cách tính giá</p>
            <p className="font-medium">{getPricingTypeLabel()}</p>
          </div>
          <div>
            <p className="text-body-sm text-muted-foreground mb-1">Giá combo</p>
            <p className="text-h3 text-primary">{formatCurrency(comboPrice)}</p>
          </div>
          <div>
            <p className="text-body-sm text-muted-foreground mb-1">Tiết kiệm</p>
            <p className="font-medium">
              {savings > 0 ? (
                <>
                  <span className="text-green-600">{formatCurrency(savings)}</span>
                  {totalOriginalPrice > 0 && (
                    <span className="text-body-xs ml-1 text-muted-foreground">
                      ({Math.round((savings / totalOriginalPrice) * 100)}%)
                    </span>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-body-sm text-muted-foreground mb-1">Giá vốn combo</p>
            <p className="font-medium">{formatCurrency(totalCostPrice)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// COMBO LOW STOCK WARNING
// ============================================

interface ComboLowStockWarningProps {
  product: Product;
  allProducts: Product[];
}

/**
 * ComboLowStockWarning - Hiển thị cảnh báo khi combo sắp hết hàng
 */
export function ComboLowStockWarning({ product, allProducts }: ComboLowStockWarningProps) {
  const { data: branches } = useAllBranches();
  
  // Calculate total combo stock across all branches
  const totalComboStock = React.useMemo(() => {
    let total = 0;
    branches.forEach(branch => {
      const branchStock = calculateComboStock(
        product.comboItems || [],
        allProducts,
        branch.systemId
      );
      total += branchStock;
    });
    return total;
  }, [product.comboItems, allProducts, branches]);
  
  const reorderLevel = product.reorderLevel ?? 0;
  const safetyStock = product.safetyStock ?? 0;
  
  // Determine alert level
  const isCritical = totalComboStock <= safetyStock && safetyStock > 0;
  const isLow = totalComboStock <= reorderLevel && reorderLevel > 0;
  
  if (!isCritical && !isLow) return null;
  
  return (
    <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${
      isCritical 
        ? 'bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800' 
        : 'bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800'
    }`}>
      <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${
        isCritical ? 'text-red-600' : 'text-amber-600'
      }`} />
      <div className="text-body-sm">
        {isCritical ? (
          <>
            <p className="font-medium text-red-700 dark:text-red-400">
              Tồn kho dưới mức an toàn!
            </p>
            <p className="text-red-600 dark:text-red-500">
              Hiện có {totalComboStock} combo, dưới mức an toàn ({safetyStock}).
            </p>
          </>
        ) : (
          <>
            <p className="font-medium text-amber-700 dark:text-amber-400">
              Cần đặt hàng bổ sung
            </p>
            <p className="text-amber-600 dark:text-amber-500">
              Hiện có {totalComboStock} combo, dưới mức đặt hàng lại ({reorderLevel}).
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================
// COMBO INVENTORY CARD
// ============================================

interface ComboInventoryCardProps {
  product: Product;
  branches: { systemId: SystemId; name: string }[];
  allProducts: Product[];
  onCommittedClick?: (branch: { systemId: SystemId; name: string }) => void;
  onInTransitClick?: (branch: { systemId: SystemId; name: string }) => void;
}

/**
 * ComboInventoryCard - Hiển thị tồn kho combo theo chi nhánh
 * Combo không có tồn kho riêng, tính từ MIN(tồn SP con / số lượng trong combo)
 */
export function ComboInventoryCard({ 
  product, 
  branches,
  allProducts,
  onCommittedClick,
  onInTransitClick,
}: ComboInventoryCardProps) {
  // Calculate combo stock for each branch
  const comboStockByBranch = React.useMemo(() => {
    return branches.map(branch => {
      const comboStock = calculateComboStock(
        product.comboItems || [],
        allProducts,
        branch.systemId
      );
      
      // Get committed and inTransit for THIS combo product (not child products)
      const committed = product.committedByBranch?.[branch.systemId] || 0;
      const inTransit = product.inTransitByBranch?.[branch.systemId] || 0;
      
      // Available = comboStock - committed
      const available = Math.max(0, comboStock - committed);
      
      return {
        branch,
        comboStock,
        available,
        committed,
        inTransit,
      };
    });
  }, [product.comboItems, product.committedByBranch, product.inTransitByBranch, allProducts, branches]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle size="lg">Tồn kho theo chi nhánh</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chi nhánh</TableHead>
                <TableHead>Điểm lưu kho</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Tồn kho (Combo)
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Có thể bán
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Đang giao dịch
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Hàng đang về
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Đang giao
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comboStockByBranch.map(({ branch, comboStock, available, committed, inTransit }) => (
                <TableRow key={branch.systemId}>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell className="text-muted-foreground">Mặc định</TableCell>
                  <TableCell className="font-semibold">{comboStock}</TableCell>
                  <TableCell className={available > 0 ? 'font-medium' : 'text-muted-foreground'}>{available}</TableCell>
                  <TableCell 
                    className={committed > 0 ? 'text-primary cursor-pointer hover:underline font-medium' : ''}
                    onClick={() => {
                      if (committed > 0 && onCommittedClick) {
                        onCommittedClick(branch);
                      }
                    }}
                  >
                    {committed}
                  </TableCell>
                  <TableCell className={inTransit > 0 ? 'font-medium' : ''}>{inTransit}</TableCell>
                  <TableCell 
                    className={inTransit > 0 ? 'text-primary cursor-pointer hover:underline font-medium' : ''}
                    onClick={() => {
                      if (inTransit > 0 && onInTransitClick) {
                        onInTransitClick(branch);
                      }
                    }}
                  >
                    {inTransit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
