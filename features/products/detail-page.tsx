import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useProductStore } from './store.ts';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { formatDateForDisplay, formatDateTimeForDisplay } from '@/lib/date-utils';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useAuth } from '../../contexts/auth-context.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Edit, Info, Printer, TrendingUp, AlertTriangle, Eye, Trash2 } from 'lucide-react';
import { usePrint } from '@/lib/use-print';
import { mapProductToLabelPrintData } from '@/lib/print-mappers/product-label.mapper';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { DetailField } from '../../components/ui/detail-field.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Separator } from '../../components/ui/separator.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.tsx';
import { LazyImage } from '../../components/ui/lazy-image.tsx';
import { Comments, type Comment as CommentType } from '../../components/Comments.tsx';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory.tsx';
import { usePricingPolicyStore } from '../settings/pricing/store.ts';
import { useSupplierStore } from '../suppliers/store.ts';
import { useStockHistoryStore } from '../stock-history/store.ts';
import { getStockHistoryColumns } from '../stock-history/columns.tsx';
import { purchasePriceHistoryColumns, type PriceHistoryEntry } from './purchase-price-history-columns.tsx';
import { RelatedDataTable } from '../../components/data-table/related-data-table.tsx';
import { useBranchStore } from '../settings/branches/store.ts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { usePurchaseOrderStore } from '../purchase-orders/store.ts';
import { useInventoryReceiptStore } from '../inventory-receipts/store.ts';
import { useOrderStore } from '../orders/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useWarrantyStore } from '../warranty/store.ts';
import { useInventoryCheckStore } from '../inventory-checks/store.ts';
import { useStockTransferStore } from '../stock-transfers/store.ts';
import { CommittedStockDialog } from './components/committed-stock-dialog.tsx';
import { InTransitStockDialog } from './components/in-transit-stock-dialog.tsx';
import { useImageStore } from './image-store.ts';
import { FileUploadAPI } from '@/lib/file-upload-api.ts';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog.tsx';
import { calculateComboStock, calculateComboCostPrice, isComboProduct } from './combo-utils.ts';
import { StockAlertBadges } from './components/stock-alert-badges.tsx';
import { getProductStockAlerts, getTotalAvailableStock, getTotalOnHandStock, getSuggestedOrderQuantity } from './stock-alert-utils.ts';
import { useProductTypeStore } from '../settings/inventory/product-type-store.ts';
import { useProductCategoryStore } from '../settings/inventory/product-category-store.ts';
import { useStorageLocationStore } from '../settings/inventory/storage-location-store.ts';
import { useBrandStore } from '../settings/inventory/brand-store.ts';
import { sanitizeHtml } from '@/lib/sanitize.ts';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog.tsx';


const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getStatusBadgeVariant = (status?: string) => {
  switch (status) {
    case 'active': return 'success';
    case 'discontinued': return 'destructive';
    default: return 'secondary';
  }
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'active': return 'Đang hoạt động';
    case 'inactive': return 'Tạm ngừng';
    case 'discontinued': return 'Ngừng kinh doanh';
    default: return 'Không xác định';
  }
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

/**
 * ComboItemsCard - Hiển thị thành phần combo trong trang Detail
 */
function ComboItemsCard({ 
  product, 
  pricingPolicies,
  onImagePreview,
}: { 
  product: import('./types').Product;
  pricingPolicies: { systemId: string; name: string; isDefault?: boolean; type: string }[];
  onImagePreview?: (imageUrl: string) => void;
}) {
  const { data: allProducts } = useProductStore();
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
          // Get first available price from any pricing policy
          const firstPriceKey = Object.keys(childProduct.prices)[0];
          unitPrice = childProduct.prices[firstPriceKey] || 0;
        } else if (childProduct.costPrice) {
          // Fallback to cost price if no selling price available
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
  
  // Savings = how much customer saves (should be positive)
  // If totalOriginalPrice is 0 or less than comboPrice, savings = 0
  const savings = totalOriginalPrice > comboPrice ? totalOriginalPrice - comboPrice : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3">
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
                          className="group/thumbnail relative w-10 h-10 rounded-md border overflow-hidden bg-muted flex-shrink-0 cursor-pointer"
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
                        <div className="w-10 h-10 rounded-md border bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground text-body-xs">
                          N/A
                        </div>
                      )}
                      {item.product ? (
                        <div className="min-w-0">
                          <ReactRouterDOM.Link 
                            to={`/products/${item.product.systemId}`}
                            className="text-primary hover:underline font-medium block truncate"
                          >
                            {item.product.name}
                          </ReactRouterDOM.Link>
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

/**
 * ComboLowStockWarning - Hiển thị cảnh báo khi combo sắp hết hàng
 */
function ComboLowStockWarning({
  product,
  allProducts
}: {
  product: import('./types').Product;
  allProducts: import('./types').Product[];
}) {
  const { data: branches } = useBranchStore();
  
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
      <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
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

/**
 * ComboInventoryCard - Hiển thị tồn kho combo theo chi nhánh
 * Combo không có tồn kho riêng, tính từ MIN(tồn SP con / số lượng trong combo)
 */
function ComboInventoryCard({ 
  product, 
  branches,
  allProducts,
  onCommittedClick,
  onInTransitClick,
}: { 
  product: import('./types').Product;
  branches: { systemId: SystemId; name: string }[];
  allProducts: import('./types').Product[];
  onCommittedClick?: (branch: { systemId: SystemId; name: string }) => void;
  onInTransitClick?: (branch: { systemId: SystemId; name: string }) => void;
}) {
  // Get combo items with product details
  const comboItemsWithDetails = React.useMemo(() => {
    if (!product.comboItems) return [];
    return product.comboItems.map(item => {
      const childProduct = allProducts.find(p => p.systemId === item.productSystemId);
      return {
        ...item,
        product: childProduct,
      };
    });
  }, [product.comboItems, allProducts]);
  
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
        <CardTitle className="text-h3">Tồn kho theo chi nhánh</CardTitle>
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

export function ProductDetailPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById: findProductById, data: allProducts, remove } = useProductStore();
  const { findById: findSupplierById } = useSupplierStore();
  const { data: pricingPolicies } = usePricingPolicyStore();
  const { getHistoryForProduct } = useStockHistoryStore();
  const { data: branches } = useBranchStore();
  const { data: allPurchaseOrders } = usePurchaseOrderStore();
  const { data: allInventoryReceipts } = useInventoryReceiptStore();
  const { data: allOrders } = useOrderStore();
  const { findById: findEmployeeById } = useEmployeeStore();
  const { data: allWarranties } = useWarrantyStore();
  const { data: allInventoryChecks } = useInventoryCheckStore();
  const { data: allStockTransfers } = useStockTransferStore();
  const { findById: findProductTypeById } = useProductTypeStore();
  const { findById: findCategoryById } = useProductCategoryStore();
  const { findById: findStorageLocationById } = useStorageLocationStore();
  const { findById: findBrandById } = useBrandStore();
  const { employee: authEmployee } = useAuth();
  
  const [historyBranchFilter, setHistoryBranchFilter] = React.useState<'all' | SystemId>('all');
  const [priceHistoryBranchFilter, setPriceHistoryBranchFilter] = React.useState<'all' | SystemId>('all');
  const [committedDialogOpen, setCommittedDialogOpen] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState<{ systemId: SystemId; name: string } | null>(null);
  const [inTransitDialogOpen, setInTransitDialogOpen] = React.useState(false);
  const [inTransitBranch, setInTransitBranch] = React.useState<{ systemId: SystemId; name: string } | null>(null);

  const product = React.useMemo(() => (systemId ? findProductById(asSystemId(systemId)) : null), [systemId, findProductById]);
  const productSystemId = product?.systemId ?? null;
  const supplier = React.useMemo(() => (product?.primarySupplierSystemId ? findSupplierById(product.primarySupplierSystemId) : null), [product, findSupplierById]);
  const createdByEmployee = React.useMemo(() => (product?.createdBy ? findEmployeeById(product.createdBy) : null), [product, findEmployeeById]);
  const updatedByEmployee = React.useMemo(() => (product?.updatedBy ? findEmployeeById(product.updatedBy) : null), [product, findEmployeeById]);
  const productType = React.useMemo(() => (product?.productTypeSystemId ? findProductTypeById(product.productTypeSystemId) : null), [product, findProductTypeById]);
  const category = React.useMemo(() => (product?.categorySystemId ? findCategoryById(product.categorySystemId) : null), [product, findCategoryById]);
  const brand = React.useMemo(() => (product?.brandSystemId ? findBrandById(product.brandSystemId) : null), [product, findBrandById]);
  const { findBySystemId: findStorageLocationBySystemId } = useStorageLocationStore();
  const storageLocation = React.useMemo(() => (product?.storageLocationSystemId ? findStorageLocationBySystemId(product.storageLocationSystemId) : null), [product, findStorageLocationBySystemId]);

  // Comments state with localStorage persistence
  type ProductComment = CommentType<SystemId>;
  const [comments, setComments] = React.useState<ProductComment[]>(() => {
    const saved = localStorage.getItem(`product-comments-${systemId}`);
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    if (systemId) {
      localStorage.setItem(`product-comments-${systemId}`, JSON.stringify(comments));
    }
  }, [comments, systemId]);

  const handleAddComment = React.useCallback((content: string, parentId?: string) => {
    const newComment: ProductComment = {
      id: asSystemId(`comment-${Date.now()}`),
      content,
      author: {
        systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
        name: authEmployee?.fullName || 'Hệ thống',
      },
      createdAt: new Date(),
      parentId: parentId as SystemId | undefined,
    };
    setComments(prev => [...prev, newComment]);
  }, [authEmployee]);

  const handleUpdateComment = React.useCallback((commentId: string, content: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, content, updatedAt: new Date() } : c
    ));
  }, []);

  const handleDeleteComment = React.useCallback((commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, []);

  const commentCurrentUser = React.useMemo(() => ({
    systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
    name: authEmployee?.fullName || 'Hệ thống',
  }), [authEmployee]);

  // Build activity history from product data
  const activityHistory = React.useMemo((): HistoryEntry[] => {
    if (!product) return [];
    const entries: HistoryEntry[] = [];
    
    // Created entry
    if (product.createdAt) {
      entries.push({
        id: `${product.systemId}-created`,
        action: 'created',
        timestamp: new Date(product.createdAt),
        user: {
          systemId: product.createdBy || '',
          name: createdByEmployee?.fullName || 'Hệ thống',
        },
        description: `Tạo sản phẩm ${product.name}`,
      });
    }
    
    // Updated entry
    if (product.updatedAt && product.updatedAt !== product.createdAt) {
      entries.push({
        id: `${product.systemId}-updated`,
        action: 'updated',
        timestamp: new Date(product.updatedAt),
        user: {
          systemId: product.updatedBy || '',
          name: updatedByEmployee?.fullName || 'Hệ thống',
        },
        description: 'Cập nhật thông tin sản phẩm',
      });
    }
    
    return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [product, createdByEmployee, updatedByEmployee]);

  // ✅ FIX: Use product.systemId (internal key) instead of product.id (SKU) for querying
  // For combo products: show combo's own history (not child products)
  const productHistory = React.useMemo(() => {
    if (!product) return [];
    
    // Get history for THIS product (whether combo or regular)
    // Combo has its own stock history entries (Khởi tạo sản phẩm, Xuất kho for combo sales, etc.)
    return getHistoryForProduct(product.systemId, historyBranchFilter);
  }, [product, getHistoryForProduct, historyBranchFilter]);
  
  const purchasePriceHistory = React.useMemo<PriceHistoryEntry[]>(() => {
    if (!productSystemId) return [];
    
    const history: PriceHistoryEntry[] = [];

    // Add history from Inventory Receipts
    allInventoryReceipts.forEach(receipt => {
      // Filter by branch
      if (priceHistoryBranchFilter !== 'all' && receipt.branchSystemId !== priceHistoryBranchFilter) {
        return;
      }

      const item = receipt.items.find(i => i.productSystemId === productSystemId);
      if (item) {
        const entry: PriceHistoryEntry = {
          systemId: `receipt-${receipt.id}`,
          id: `receipt-${receipt.id}`,
          date: receipt.receivedDate,
          price: item.unitPrice,
          supplierName: receipt.supplierName,
          reference: receipt.id,
          type: 'receipt',
          note: `Nhập ${item.receivedQuantity} ${product?.unit || ''}`,
        };
        if (receipt.branchSystemId) {
          entry.branchSystemId = receipt.branchSystemId;
        }
        if (typeof receipt.branchName === 'string') {
          entry.branchName = receipt.branchName;
        }
        history.push(entry);
      }
    });

    // If we had a log of manual price changes, we would add them here.
    // For now, we only have the current lastPurchasePrice on the product, 
    // but no history of manual changes unless we implement an audit log for it.
    // We will stick to receipt history for now as that's the primary source of truth for "updates via import".

    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allInventoryReceipts, productSystemId, product?.unit, priceHistoryBranchFilter]);

  const stockHistoryColumns = React.useMemo(() => 
    getStockHistoryColumns(allPurchaseOrders, allInventoryReceipts, allOrders, allWarranties, allInventoryChecks, allStockTransfers),
    [allPurchaseOrders, allInventoryReceipts, allOrders, allWarranties, allInventoryChecks, allStockTransfers]
  );

  const imageStore = useImageStore();
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  
  // Subscribe to store changes properly
  const permanentImagesState = useImageStore(state => state.permanentImages);
  const permanentMetaState = useImageStore(state => state.permanentMeta);
  
  const permanentFiles = React.useMemo(() => ({
    thumbnail: productSystemId ? (permanentImagesState[productSystemId]?.thumbnail || []) : [],
    gallery: productSystemId ? (permanentImagesState[productSystemId]?.gallery || []) : []
  }), [productSystemId, permanentImagesState]);

  // Use ref to prevent infinite loop - imageStore reference is stable
  const imageStoreRef = React.useRef(imageStore);
  imageStoreRef.current = imageStore;
  
  const loadPermanentFiles = React.useCallback(async (productId: string, options?: { silent?: boolean }): Promise<void> => {
    const silent = options?.silent ?? false;
    if (!silent) {
      setIsImageLoading(true);
    }
    try {
      const files = await FileUploadAPI.getProductFiles(productId);
      const fetchedAt = Date.now();
      ['thumbnail' as const, 'gallery' as const].forEach(type => {
        const typeFiles = files.filter(f => f.documentName === type);
        imageStoreRef.current.updatePermanentImages(
          productId,
          type,
          typeFiles.map(f => ({
            id: f.id,
            sessionId: '',
            name: f.name,
            originalName: f.originalName,
            slug: f.slug,
            filename: f.filename,
            size: f.size,
            type: f.type,
            url: f.url,
            status: 'permanent' as const,
            uploadedAt: f.uploadedAt,
            metadata: f.metadata
          })),
          fetchedAt
        );
      });
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      // Always set loading to false when done
      setIsImageLoading(false);
    }
  }, []); // Empty deps - uses imageStoreRef which is always current

  // Track if we've already fetched for this product to prevent double-fetch
  const fetchedProductRef = React.useRef<string | null>(null);
  // Track if fetch completed (even if no images found)
  const [hasFetched, setHasFetched] = React.useState(false);
  
  const hasCachedImages = (permanentFiles.thumbnail.length + permanentFiles.gallery.length) > 0;

  React.useEffect(() => {
    if (!productSystemId) {
      return;
    }

    // Reset when product changes
    if (fetchedProductRef.current !== productSystemId) {
      setHasFetched(false);
    }

    // Already fetched for this product - don't fetch again
    if (fetchedProductRef.current === productSystemId && hasFetched) {
      setIsImageLoading(false);
      return;
    }

    // Need to fetch - silent if we already have cached images
    const silent = hasCachedImages;
    fetchedProductRef.current = productSystemId;
    loadPermanentFiles(productSystemId, { silent }).then(() => {
      setHasFetched(true);
    });
  }, [productSystemId, hasCachedImages, hasFetched, loadPermanentFiles]); // Add proper deps

  const managedThumbnail = permanentFiles.thumbnail[0]?.url ?? null;
  const managedGallery = React.useMemo(() => permanentFiles.gallery.map(file => file.url), [permanentFiles.gallery]);

  const thumbnailImage = managedThumbnail;
  const galleryImages = managedGallery;
  const hasImages = Boolean(thumbnailImage) || galleryImages.length > 0;

  const previewSources = React.useMemo(() => {
    const sources: string[] = [];
    const seen = new Set<string>();
    if (thumbnailImage && !seen.has(thumbnailImage)) {
      seen.add(thumbnailImage);
      sources.push(thumbnailImage);
    }
    galleryImages.forEach((url) => {
      if (url && !seen.has(url)) {
        seen.add(url);
        sources.push(url);
      }
    });
    return sources;
  }, [thumbnailImage, galleryImages]);

  const handleOpenPreview = React.useCallback((targetUrl: string) => {
    if (!targetUrl) return;
    const index = previewSources.findIndex(url => url === targetUrl);
    if (index === -1) return;
    setPreviewImages(previewSources);
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  }, [previewSources]);

  const { print: printLabel } = usePrint();
  const storeInfo = useStoreInfoStore(state => state.info);
  const storeSettings = React.useMemo(() => ({
    name: storeInfo.brandName || storeInfo.companyName,
    address: storeInfo.headquartersAddress,
    phone: storeInfo.hotline,
    email: storeInfo.email,
  }), [storeInfo]);

  // Default selling policy for price lookup
  const defaultSellingPolicy = React.useMemo(
    () => pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault),
    [pricingPolicies]
  );

  const handlePrintLabel = React.useCallback(() => {
    if (!product) return;
    // Resolve category & brand name for label
    const categoryName = product.categorySystemId
      ? useProductCategoryStore.getState().findById(product.categorySystemId)?.name || product.category
      : product.category;
    const brandName = product.brandSystemId
      ? useBrandStore.getState().findById(product.brandSystemId)?.name || ''
      : '';
    const defaultPrice = defaultSellingPolicy
      ? product.prices?.[defaultSellingPolicy.systemId]
      : undefined;
    const printData = mapProductToLabelPrintData(product, storeSettings, {
      category: categoryName,
      brand: brandName,
      price: defaultPrice ?? product.sellingPrice ?? product.suggestedRetailPrice,
    });
    printLabel('product-label', { data: printData });
  }, [product, printLabel, storeSettings, defaultSellingPolicy]);

  const handleMoveToTrash = React.useCallback(() => {
    if (!product) return;
    remove(product.systemId);
    toast.success('Đã chuyển sản phẩm vào thùng rác', {
      description: `${product.name} (${product.id})`,
      action: {
        label: 'Xem thùng rác',
        onClick: () => navigate('/products/trash'),
      },
    });
    navigate('/products');
  }, [product, remove, navigate]);

  const headerActions = React.useMemo(() => {
    if (!product) return [];
    return [
      <Button
        key="edit"
        variant="default"
        size="sm"
        className="h-9"
        onClick={() => navigate(`/products/${product.systemId}/edit`)}
      >
        <Edit className="mr-2 h-4 w-4" />
        Chỉnh sửa
      </Button>,
      <Button
        key="print"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={handlePrintLabel}
      >
        <Printer className="mr-2 h-4 w-4" />
        In tem phụ
      </Button>,
      <AlertDialog key="trash">
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Chuyển vào thùng rác
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận chuyển vào thùng rác</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn chuyển sản phẩm "{product.name}" ({product.id}) vào thùng rác?
              <br />
              <span className="text-muted-foreground">Sản phẩm có thể được khôi phục từ thùng rác.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMoveToTrash}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Chuyển vào thùng rác
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ];
  }, [product, navigate, handlePrintLabel, handleMoveToTrash]);

  // Calculate combo stock for low stock warning in header
  const comboTotalStock = React.useMemo(() => {
    if (!product || !isComboProduct(product)) return 0;
    let total = 0;
    branches.forEach(branch => {
      total += calculateComboStock(product.comboItems || [], allProducts, branch.systemId);
    });
    return total;
  }, [product, allProducts, branches]);

  // Determine stock alerts for header
  const stockAlerts = React.useMemo(() => {
    if (!product) return { isLow: false, isCritical: false, message: '' };
    
    const reorderLevel = product.reorderLevel ?? 0;
    const safetyStock = product.safetyStock ?? 0;
    
    // For combo products, use calculated combo stock
    const currentStock = isComboProduct(product) 
      ? comboTotalStock 
      : getTotalOnHandStock(product);
    
    const isCritical = safetyStock > 0 && currentStock <= safetyStock;
    const isLow = reorderLevel > 0 && currentStock <= reorderLevel;
    
    let message = '';
    if (isCritical) {
      message = `Tồn kho: ${currentStock} (dưới mức an toàn ${safetyStock})`;
    } else if (isLow) {
      message = `Tồn kho: ${currentStock} (cần đặt hàng, mức đặt lại ${reorderLevel})`;
    }
    
    return { isLow, isCritical, message };
  }, [product, comboTotalStock]);

  // Header badges including status and stock alerts
  const headerBadges = React.useMemo(() => {
    if (!product) return undefined;
    
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={getStatusBadgeVariant(product.status) as any}>
          {getStatusLabel(product.status)}
        </Badge>
        {stockAlerts.isCritical && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Dưới mức an toàn
          </Badge>
        )}
        {!stockAlerts.isCritical && stockAlerts.isLow && (
          <Badge variant="outline" className="gap-1 border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30">
            <AlertTriangle className="h-3 w-3" />
            Cần đặt hàng
          </Badge>
        )}
      </div>
    );
  }, [product, stockAlerts]);

  usePageHeader({
    title: product?.name || 'Chi tiết sản phẩm',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Sản phẩm', href: '/products', isCurrent: false },
      { label: product?.name ?? 'Chi tiết', href: product ? `/products/${product.systemId}` : '/products', isCurrent: true }
    ],
    badge: headerBadges,
    showBackButton: true,
    backPath: '/products',
    actions: headerActions,
  });

  if (!product) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-h2">Không tìm thấy sản phẩm</h2>
          <p className="text-muted-foreground mt-2">Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
          <Button onClick={() => navigate('/products')} className="mt-4 h-9">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay về danh sách
          </Button>
        </div>
      </div>
    );
  }
  
  const salesPolicies = pricingPolicies.filter(p => p.type === 'Bán hàng');
  const totalInventory = Object.values(product.inventoryByBranch || {}).reduce<number>((sum, qty) => sum + Number(qty || 0), 0);

  return (
    <div className="space-y-4 md:space-y-6">
        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-h3">Hình ảnh sản phẩm</CardTitle>
          </CardHeader>
          {hasImages ? (
            <CardContent className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-10">
                <div className="space-y-3 lg:col-span-3">
                  <p className="text-body-sm font-medium text-muted-foreground flex items-center justify-between">
                    <span>Ảnh sản phẩm</span>
                    {thumbnailImage && (
                      <Badge variant="secondary" className="text-[11px] font-medium">
                        Thumbnail
                      </Badge>
                    )}
                  </p>
                  {thumbnailImage ? (
                    <div
                      className="relative aspect-square md:aspect-[4/5] rounded-lg overflow-hidden border bg-muted cursor-pointer"
                      onClick={() => handleOpenPreview(thumbnailImage)}
                    >
                      <LazyImage
                        src={thumbnailImage}
                        alt={`${product.name} - Ảnh thumbnail`}
                        className="w-full h-full object-cover"
                        rootMargin="400px"
                        skeletonClassName="rounded-none"
                      />
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed bg-muted/40 text-center text-body-xs text-muted-foreground py-10">
                      Chưa có ảnh thumbnail
                    </div>
                  )}
                </div>

                <div className="space-y-3 lg:col-span-7">
                  <p className="text-body-sm font-semibold text-muted-foreground">
                    Thư viện ({galleryImages.length})
                  </p>
                  {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {galleryImages.map((imageUrl, index) => (
                        <div
                          key={`${imageUrl}-${index}`}
                          className="relative aspect-square rounded-lg overflow-hidden border bg-muted hover:opacity-90 transition-opacity cursor-pointer"
                          onClick={() => handleOpenPreview(imageUrl)}
                        >
                          <LazyImage
                            src={imageUrl}
                            alt={`${product.name} - Ảnh thư viện ${index + 1}`}
                            className="w-full h-full object-cover"
                            rootMargin="400px"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed bg-muted/40 text-center text-body-xs text-muted-foreground py-10">
                      Chưa có ảnh thư viện
                    </div>
                  )}
                </div>
              </div>

              {/* Video Links Section */}
              {product.videoLinks && product.videoLinks.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <p className="text-body-sm font-semibold text-muted-foreground">
                    Video ({product.videoLinks.length})
                  </p>
                  <div className="space-y-2">
                    {product.videoLinks.map((link, index) => (
                      <a
                        key={`${link}-${index}`}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-body-sm text-primary hover:underline"
                      >
                        <span className="text-muted-foreground">🎬</span>
                        <span className="truncate">{link}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </CardContent>
          ) : (
            <CardContent>
              <div className="text-center text-body-sm text-muted-foreground border border-dashed rounded-md py-8">
                {isImageLoading ? 'Đang tải hình ảnh...' : 'Chưa có hình ảnh nào được lưu cho sản phẩm này.'}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-h3">Thông tin cơ bản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <DetailField label="Mã SKU" value={product.id} />
                        <DetailField label="Tên sản phẩm/dịch vụ" value={product.name} />
                        <DetailField label="Loại hình" value={getTypeLabel(product.type)} />
                        {productType && <DetailField label="Loại sản phẩm" value={productType.name} />}
                        {(category || product.category) && <DetailField label="Danh mục" value={category ? (category.path || category.name) : product.category} />}
                        {product.subCategory && <DetailField label="Danh mục con" value={product.subCategory} />}
                        <DetailField label="Thương hiệu" value={brand ? brand.name : '-'} />
                        <DetailField 
                          label="Tags" 
                          value={
                            product.tags && product.tags.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {product.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-body-xs">{tag}</Badge>
                                ))}
                              </div>
                            ) : '-'
                          } 
                        />
                        <DetailField label="Đơn vị tính" value={product.unit} />
                        <DetailField label="Mã vạch" value={product.barcode || '-'} />
                        {product.pkgxId && <DetailField label="ID PKGX" value={product.pkgxId} />}
                        {typeof product.warrantyPeriodMonths === 'number' && product.warrantyPeriodMonths > 0 && (
                          <DetailField label="Bảo hành" value={`${product.warrantyPeriodMonths} tháng`} />
                        )}
                    </CardContent>
                 </Card>

                 {/* SEO & Mô tả */}
                 {(product.ktitle || product.seoDescription) && (
                   <Card>
                      <CardHeader>
                        <CardTitle className="text-h3">SEO</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {product.ktitle && <DetailField label="Tiêu đề SEO" value={product.ktitle} />}
                        {product.seoDescription && <DetailField label="Mô tả SEO" value={product.seoDescription} />}
                      </CardContent>
                   </Card>
                 )}

                 {product.shortDescription && (
                   <Card>
                      <CardHeader>
                        <CardTitle className="text-h3">Mô tả ngắn</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div 
                            className="prose prose-sm max-w-none text-body-sm text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.shortDescription) }}
                        />
                      </CardContent>
                   </Card>
                 )}

                 {product.description && (
                   <Card>
                      <CardHeader>
                        <CardTitle className="text-h3">Mô tả chi tiết</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div 
                            className="prose prose-sm max-w-none text-body-sm text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                        />
                      </CardContent>
                   </Card>
                 )}

                 {/* Combo Items Card - Only show for combo products */}
                 {isComboProduct(product) && product.comboItems && product.comboItems.length > 0 && (
                   <ComboItemsCard 
                     product={product}
                     pricingPolicies={pricingPolicies}
                     onImagePreview={(imageUrl) => {
                       setPreviewImages([imageUrl]);
                       setPreviewIndex(0);
                       setIsPreviewOpen(true);
                     }}
                   />
                 )}

            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-4">
                 {/* Stock Alerts Card - Only show if there are alerts */}
                 {getProductStockAlerts(product).length > 0 && (
                   <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
                      <CardHeader className="pb-2">
                          <CardTitle className="text-h3 flex items-center gap-2">
                            <span className="text-amber-600">⚠️</span>
                            Cảnh báo tồn kho
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                          <StockAlertBadges product={product} showDescription />
                          {getSuggestedOrderQuantity(product) > 0 && (
                            <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
                              <p className="text-body-sm text-muted-foreground">
                                <span className="font-medium">Đề xuất đặt thêm:</span>{' '}
                                <span className="font-semibold text-amber-700 dark:text-amber-400">
                                  {getSuggestedOrderQuantity(product)} {product.unit}
                                </span>
                              </p>
                            </div>
                          )}
                      </CardContent>
                   </Card>
                 )}

                 <Card>
                    <CardHeader>
                        <CardTitle className="text-h3">Giá & Kho</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <DetailField label="Giá vốn" value={formatCurrency(product.costPrice)} />
                        {/* Hide purchase-related fields for combo products - combo doesn't have purchase price */}
                        {product.type !== 'combo' && (
                          <>
                            <DetailField 
                              label="Giá nhập gần nhất" 
                              value={product.lastPurchasePrice ? formatCurrency(product.lastPurchasePrice) : '-'} 
                            />
                            <DetailField 
                              label="Nhà cung cấp chính" 
                              value={supplier ? (
                                <ReactRouterDOM.Link 
                                  to={`/suppliers/${supplier.systemId}`}
                                  className="text-primary hover:underline font-medium"
                                >
                                  {supplier.name}
                                </ReactRouterDOM.Link>
                              ) : '-'} 
                            />
                            <DetailField 
                              label="Ngày nhập gần nhất" 
                              value={product.lastPurchaseDate ? formatDateForDisplay(product.lastPurchaseDate) : '-'} 
                            />
                          </>
                        )}
                        <DetailField 
                          label="Giá tối thiểu" 
                          value={product.minPrice ? formatCurrency(product.minPrice) : '-'} 
                        />
                        <Separator />
                        <DetailField label="Theo dõi tồn kho" value={product.isStockTracked ? 'Có' : 'Không'} />
                        {/* Only show inventory summary for non-combo products - combo shows in Tồn kho tab */}
                        {product.type !== 'combo' && (
                          <>
                            <DetailField 
                              label="Tổng tồn kho (Toàn hệ thống)" 
                              value={<span className="font-semibold">{totalInventory}</span>} 
                            />
                            <DetailField 
                              label="Đang giao dịch" 
                              value={Object.values(product.committedByBranch || {}).reduce((sum, qty) => sum + qty, 0)} 
                            />
                            <DetailField 
                              label="Đang về" 
                              value={Object.values(product.inTransitByBranch || {}).reduce((sum, qty) => sum + qty, 0)} 
                            />
                            <DetailField 
                              label="Đã bán" 
                              value={product.totalSold ?? 0} 
                            />
                          </>
                        )}
                        <Separator />
                        <DetailField 
                          label="Mức đặt hàng lại" 
                          value={product.reorderLevel ?? 0} 
                        />
                        <DetailField 
                          label="Tồn kho an toàn" 
                          value={product.safetyStock ?? 0} 
                        />
                        <DetailField 
                          label="Mức tồn tối đa" 
                          value={product.maxStock ?? 0} 
                        />
                        {storageLocation && (
                          <DetailField label="Điểm lưu kho mặc định" value={storageLocation.name} />
                        )}
                    </CardContent>
                 </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="text-h3">Bảng giá bán</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {salesPolicies.map(policy => (
                            <DetailField 
                                key={policy.systemId}
                                label={`${policy.name}${policy.isDefault ? ' (Mặc định)' : ''}`}
                                value={formatCurrency(product.prices[policy.systemId])} 
                            />
                        ))}
                    </CardContent>
                 </Card>

                 {(product.weight !== undefined || product.dimensions) && (
                   <Card>
                      <CardHeader>
                        <CardTitle className="text-h3">Logistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          {product.weight !== undefined && (
                            <DetailField label="Khối lượng" value={`${product.weight} ${product.weightUnit}`} />
                          )}
                          {product.dimensions && (
                            <DetailField 
                              label="Kích thước (D×R×C)" 
                              value={`${product.dimensions.length || 0}×${product.dimensions.width || 0}×${product.dimensions.height || 0} cm`} 
                            />
                          )}
                      </CardContent>
                   </Card>
                 )}

                 {(product.totalSold || product.totalRevenue || product.viewCount || product.lastSoldDate) && (
                   <Card>
                      <CardHeader>
                        <CardTitle className="text-h3">Phân tích bán hàng</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          {product.totalSold !== undefined && (
                            <DetailField label="Tổng đã bán" value={product.totalSold} />
                          )}
                          {product.totalRevenue && (
                            <DetailField label="Tổng doanh thu" value={formatCurrency(product.totalRevenue)} />
                          )}
                          {product.viewCount && (
                            <DetailField label="Lượt xem" value={product.viewCount} />
                          )}
                          {product.lastSoldDate && (
                            <DetailField 
                              label="Bán gần nhất" 
                              value={formatDateForDisplay(product.lastSoldDate)} 
                            />
                          )}
                      </CardContent>
                   </Card>
                 )}

                 {/* E-commerce Card */}
                 {(product.isPublished || product.isFeatured || product.isNewArrival || product.isBestSeller || product.isOnSale || product.slug || product.publishedAt) && (
                   <Card>
                      <CardHeader>
                        <CardTitle className="text-h3">E-commerce</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          {product.slug && (
                            <DetailField label="Slug (URL)" value={product.slug} />
                          )}
                          <DetailField 
                            label="Trạng thái web" 
                            value={
                              <Badge variant={product.isPublished ? 'success' : 'secondary'}>
                                {product.isPublished ? 'Đã đăng' : 'Chưa đăng'}
                              </Badge>
                            } 
                          />
                          {product.publishedAt && (
                            <DetailField 
                              label="Ngày đăng web" 
                              value={formatDateForDisplay(product.publishedAt)} 
                            />
                          )}
                          {(product.isFeatured || product.isNewArrival || product.isBestSeller || product.isOnSale) && (
                            <DetailField 
                              label="Badge" 
                              value={
                                <div className="flex flex-wrap gap-1">
                                  {product.isFeatured && <Badge variant="default">Nổi bật</Badge>}
                                  {product.isNewArrival && <Badge variant="outline">Mới về</Badge>}
                                  {product.isBestSeller && <Badge variant="destructive">Bán chạy</Badge>}
                                  {product.isOnSale && <Badge variant="warning">Sale</Badge>}
                                </div>
                              } 
                            />
                          )}
                          {product.sortOrder !== undefined && product.sortOrder > 0 && (
                            <DetailField label="Thứ tự hiển thị" value={product.sortOrder} />
                          )}
                      </CardContent>
                   </Card>
                 )}

                 {(product.launchedDate || product.discontinuedDate || product.createdAt || product.updatedAt || createdByEmployee || updatedByEmployee) && (
                   <Card>
                      <CardHeader>
                        <CardTitle className="text-h3">Thông tin hệ thống</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          {product.launchedDate && (
                            <DetailField 
                              label="Ngày ra mắt" 
                              value={formatDateForDisplay(product.launchedDate)} 
                            />
                          )}
                          {product.discontinuedDate && (
                            <DetailField 
                              label="Ngày ngừng KD" 
                              value={formatDateForDisplay(product.discontinuedDate)} 
                            />
                          )}
                          <Separator />
                          {product.createdAt && (
                            <DetailField 
                              label="Ngày tạo" 
                              value={formatDateTimeForDisplay(product.createdAt)} 
                            />
                          )}
                          {createdByEmployee && (
                            <DetailField 
                              label="Người tạo" 
                              value={
                                <ReactRouterDOM.Link 
                                  to={`/employees/${createdByEmployee.systemId}`}
                                  className="text-primary hover:underline font-medium"
                                >
                                  {createdByEmployee.fullName}
                                </ReactRouterDOM.Link>
                              } 
                            />
                          )}
                          {product.updatedAt && (
                            <DetailField 
                              label="Cập nhật lần cuối" 
                              value={formatDateTimeForDisplay(product.updatedAt)} 
                            />
                          )}
                          {updatedByEmployee && (
                            <DetailField 
                              label="Người cập nhật" 
                              value={
                                <ReactRouterDOM.Link 
                                  to={`/employees/${updatedByEmployee.systemId}`}
                                  className="text-primary hover:underline font-medium"
                                >
                                  {updatedByEmployee.fullName}
                                </ReactRouterDOM.Link>
                              } 
                            />
                          )}
                      </CardContent>
                   </Card>
                 )}
            </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="inventory" className="w-full">
            <TabsList>
                <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
                <TabsTrigger value="history">Lịch sử kho</TabsTrigger>
                {product.type !== 'combo' && (
                    <TabsTrigger value="price-history">Lịch sử giá nhập</TabsTrigger>
                )}
            </TabsList>
            <TabsContent value="inventory" className="mt-4">
                {product.type === 'combo' ? (
                    <ComboInventoryCard 
                        product={product} 
                        branches={branches} 
                        allProducts={allProducts}
                        onCommittedClick={(branch) => {
                          setSelectedBranch({ systemId: branch.systemId, name: branch.name });
                          setCommittedDialogOpen(true);
                        }}
                        onInTransitClick={(branch) => {
                          setInTransitBranch({ systemId: branch.systemId, name: branch.name });
                          setInTransitDialogOpen(true);
                        }}
                    />
                ) : (
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-h3">Tồn kho theo chi nhánh</CardTitle>
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
                                        Tồn kho 
                                        <Info className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1">
                                        Giá trị tồn
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
                            {branches.map(branch => {
                                const onHand = product.inventoryByBranch[branch.systemId] || 0;
                                const committed = product.committedByBranch[branch.systemId] || 0;
                                const inTransit = product.inTransitByBranch[branch.systemId] || 0;
                                const available = onHand - committed;
                                
                                const incomingQuantity = allPurchaseOrders
                                  .filter(po => 
                                    po.branchSystemId === branch.systemId &&
                                    (po.status === 'Đặt hàng' || po.status === 'Đang giao dịch') &&
                                    po.deliveryStatus !== 'Đã nhập'
                                  )
                                  .reduce((total, po) => {
                                    const itemInPO = po.lineItems.find(item => item.productSystemId === product.systemId);
                                    if (!itemInPO) return total;

                                    const poSystemId = asSystemId(po.systemId);
                                    const totalReceivedForPO = allInventoryReceipts
                                      .filter(receipt => receipt.purchaseOrderSystemId === poSystemId)
                                      .reduce((receivedSum, receipt) => {
                                        const itemInReceipt = receipt.items.find(item => item.productSystemId === product.systemId);
                                        return receivedSum + (itemInReceipt ? Number(itemInReceipt.receivedQuantity) : 0);
                                      }, 0);
                                    
                                    const remainingToReceive = itemInPO.quantity - totalReceivedForPO;
                                    return total + (remainingToReceive > 0 ? remainingToReceive : 0);
                                  }, 0);

                                return (
                                <TableRow key={branch.systemId}>
                                    <TableCell className="font-medium">{branch.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{storageLocation?.name || 'Mặc định'}</TableCell>
                                    <TableCell className="font-semibold">{onHand}</TableCell>
                                    <TableCell>{formatCurrency(onHand * (product.costPrice || 0))}</TableCell>
                                    <TableCell className={available > 0 ? 'font-medium' : 'text-muted-foreground'}>{available}</TableCell>
                                    <TableCell 
                                      className={committed > 0 ? 'text-primary cursor-pointer hover:underline font-medium' : ''}
                                      onClick={() => {
                                        if (committed > 0) {
                                          setSelectedBranch({ systemId: branch.systemId, name: branch.name });
                                          setCommittedDialogOpen(true);
                                        }
                                      }}
                                    >
                                      {committed}
                                    </TableCell>
                                    <TableCell className={incomingQuantity > 0 ? 'font-medium' : 'text-muted-foreground'}>{incomingQuantity}</TableCell>
                                    <TableCell 
                                      className={inTransit > 0 ? 'text-primary cursor-pointer hover:underline font-medium' : ''}
                                      onClick={() => {
                                        if (inTransit > 0) {
                                          setInTransitBranch({ systemId: branch.systemId, name: branch.name });
                                          setInTransitDialogOpen(true);
                                        }
                                      }}
                                    >
                                      {inTransit}
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                       </Table>
                       </div>
                    </CardContent>
                </Card>
                )}
            </TabsContent>
            <TabsContent value="history" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-h3">
                            Lịch sử xuất nhập kho
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={productHistory} 
                            columns={stockHistoryColumns} 
                            searchKeys={['action', 'documentId', 'employeeName']}
                            searchPlaceholder="Tìm kiếm lịch sử..."
                            dateFilterColumn="date"
                            dateFilterTitle="Ngày ghi nhận"
                            exportFileName={`Lich_su_kho_${product.id}`}
                        >
                            <Select
                              value={historyBranchFilter}
                              onValueChange={(value) =>
                                setHistoryBranchFilter(value === 'all' ? 'all' : asSystemId(value))
                              }
                            >
                                <SelectTrigger className="h-8 w-full sm:w-[200px]">
                                    <SelectValue placeholder="Lọc chi nhánh" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                                    {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </RelatedDataTable>
                    </CardContent>
                </Card>
            </TabsContent>
            {product.type !== 'combo' && (
            <TabsContent value="price-history" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-h3">Lịch sử giá nhập</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={purchasePriceHistory} 
                            columns={purchasePriceHistoryColumns} 
                            searchKeys={['supplierName', 'reference', 'note']}
                            searchPlaceholder="Tìm kiếm lịch sử giá..."
                            dateFilterColumn="date"
                            dateFilterTitle="Ngày cập nhật"
                            exportFileName={`Lich_su_gia_${product.id}`}
                        >
                            <Select
                              value={priceHistoryBranchFilter}
                              onValueChange={(value) =>
                                setPriceHistoryBranchFilter(value === 'all' ? 'all' : asSystemId(value))
                              }
                            >
                                <SelectTrigger className="h-8 w-full sm:w-[200px]">
                                    <SelectValue placeholder="Lọc chi nhánh" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                                    {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </RelatedDataTable>
                    </CardContent>
                </Card>
            </TabsContent>
            )}
        </Tabs>

        {/* Comments */}
        <Comments
            entityType="product"
            entityId={product.systemId}
            comments={comments}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            currentUser={commentCurrentUser}
            title="Bình luận"
            placeholder="Thêm bình luận về sản phẩm..."
        />

        {/* Activity History */}
        <ActivityHistory
            history={activityHistory}
            title="Lịch sử hoạt động"
            emptyMessage="Chưa có lịch sử hoạt động"
            groupByDate
            maxHeight="600px"
        />

        {/* Committed Stock Dialog */}
        {selectedBranch && (
          <CommittedStockDialog
            open={committedDialogOpen}
            onOpenChange={setCommittedDialogOpen}
            productSystemId={product.systemId}
            branchSystemId={selectedBranch.systemId}
            branchName={selectedBranch.name}
            productName={product.name}
          />
        )}
        {inTransitBranch && (
          <InTransitStockDialog
            open={inTransitDialogOpen}
            onOpenChange={setInTransitDialogOpen}
            productSystemId={product.systemId}
            branchSystemId={inTransitBranch.systemId}
            branchName={inTransitBranch.name}
            productName={product.name}
          />
        )}
        <ImagePreviewDialog
          images={previewImages}
          initialIndex={previewIndex}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          title={`Hình ảnh sản phẩm - ${product.name}`}
        />
    </div>
  );
}
