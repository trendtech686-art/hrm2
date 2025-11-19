import * as React from "react"
// FIX: Use named imports for react-router-dom to fix module export errors.
import { useNavigate } from 'react-router-dom';
import { useProductStore } from "./store.ts"
import { useProductCategoryStore } from "../settings/inventory/product-category-store.ts"
import { useBranchStore } from "../settings/branches/store.ts"
import { useAuth } from "../../contexts/auth-context.tsx"
import { asSystemId, asBusinessId } from '../../lib/id-types';
import { getColumns } from "./columns.tsx"
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx"
import { DataTableExportDialog } from "../../components/data-table/data-table-export-dialog.tsx";
import { DataTableImportDialog } from "../../components/data-table/data-table-import-dialog.tsx";
import { DataTableDateFilter } from "../../components/data-table/data-table-date-filter.tsx";
import { PageFilters } from "../../components/layout/page-filters.tsx";
import { PageToolbar } from "../../components/layout/page-toolbar.tsx";
import { 
  Card, 
  CardContent, 
} from "../../components/ui/card.tsx"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog.tsx"
import type { Product } from "./types.ts"
import { Button } from "../../components/ui/button.tsx"
import { PlusCircle } from "lucide-react"
import Fuse from "fuse.js"
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar.tsx";
import { useMediaQuery } from "../../lib/use-media-query.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { MoreVertical, Package, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, isDateSame, isDateBetween, isDateAfter, isDateBefore, isValidDate } from '@/lib/date-utils';

const INVENTORY_FIELD_PREFIXES = ['inventory', 'tonkho', 'stock'] as const;
const FALLBACK_INVENTORY_KEYS = ['inventory', 'tonkho', 'stock', 'qty', 'quantity', 'soluong', 'tongton', 'totalsoluong'] as const;

const normalizeFieldKey = (value?: string | number | null) => {
  if (value === undefined || value === null) return '';
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
};

const buildNormalizedRowKeyMap = (row: Record<string, any>) => {
  return Object.keys(row).reduce<Record<string, string>>((acc, key) => {
    const normalizedKey = normalizeFieldKey(key);
    if (normalizedKey && !(normalizedKey in acc)) {
      acc[normalizedKey] = key;
    }
    return acc;
  }, {});
};

const parseNumericValue = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const sanitized = value
      .replace(/\s+/g, '')
      .replace(/,/g, '')
      .replace(/[^0-9.-]/g, '');
    if (!sanitized) return null;
    const parsed = Number(sanitized);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const findMatchingKeyForIdentifier = (normalizedRowKeyMap: Record<string, string>, identifier: string) => {
  if (!identifier) return null;
  if (normalizedRowKeyMap[identifier]) {
    return normalizedRowKeyMap[identifier];
  }

  for (const prefix of INVENTORY_FIELD_PREFIXES) {
    const prefixed = normalizedRowKeyMap[`${prefix}${identifier}`];
    if (prefixed) return prefixed;
  }

  const fallback = Object.entries(normalizedRowKeyMap).find(([normalizedKey]) => normalizedKey.endsWith(identifier));
  return fallback?.[1] ?? null;
};

const getBranchInventoryValue = (
  row: Record<string, any>,
  normalizedRowKeyMap: Record<string, string>,
  identifiers: Set<string>,
) => {
  for (const identifier of identifiers) {
    const originalKey = findMatchingKeyForIdentifier(normalizedRowKeyMap, identifier);
    if (originalKey) {
      const parsed = parseNumericValue(row[originalKey]);
      if (parsed !== null) {
        return parsed;
      }
    }
  }
  return 0;
};

const getFallbackInventoryValue = (
  row: Record<string, any>,
  normalizedRowKeyMap: Record<string, string>,
) => {
  for (const key of FALLBACK_INVENTORY_KEYS) {
    const originalKey = normalizedRowKeyMap[key];
    if (!originalKey) continue;
    const parsed = parseNumericValue(row[originalKey]);
    if (parsed !== null) {
      return parsed;
    }
  }
  return null;
};
export function ProductsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: productsRaw, remove, restore, getActive, getDeleted, addMultiple, update } = useProductStore();
  const { data: categories } = useProductCategoryStore();
  const { data: branches } = useBranchStore();
  const { employee: authEmployee } = useAuth();
  const navigate = useNavigate();

  const defaultBranchSystemId = React.useMemo(() => {
    return branches.find(branch => branch.isDefault)?.systemId ?? branches[0]?.systemId ?? null;
  }, [branches]);

  const branchInventoryIdentifiers = React.useMemo(() => {
    return branches.map(branch => ({
      systemId: branch.systemId,
      identifiers: new Set(
        [branch.systemId, branch.id, branch.name]
          .map(value => normalizeFieldKey(value))
          .filter(Boolean),
      ),
    }));
  }, [branches]);
  
  // ✅ Memoize products để tránh unstable reference
  const products = React.useMemo(() => productsRaw, [productsRaw]);
  
  // ✅ Get deleted count - always recalculate when products change
  const deletedCount = React.useMemo(() => {
    return products.filter(p => p.isDeleted).length;
  }, [products]);
  
  // ✅ State để toggle giữa Active và Deleted
  const [showDeleted, setShowDeleted] = React.useState(false);
  
  // ✅ Memoize headerActions để tránh infinite loop
  const headerActions = React.useMemo(() => [
    <Button 
      key="trash"
      variant="outline"
      size="sm"
      className="h-9"
      onClick={() => navigate('/products/trash')}
    >
      <Package className="mr-2 h-4 w-4" />
      Thùng rác ({deletedCount})
    </Button>,
    <Button key="add" size="sm" className="h-9" onClick={() => navigate('/products/new')}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Thêm sản phẩm
    </Button>
  ], [deletedCount, navigate]);
  
  usePageHeader({
    title: 'Danh sách sản phẩm',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Sản phẩm', href: '/products', isCurrent: true },
    ],
    actions: headerActions,
    showBackButton: false,
  });
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null)
  
  // Table state
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'name', desc: false });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'products-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getColumns(() => {}, () => {}, () => {});
    const allColumnIds = cols.map(c => c.id).filter(Boolean);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (allColumnIds.every(id => id in parsed)) return parsed;
      } catch (e) {}
    }
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  });
  
  React.useEffect(() => {
    localStorage.setItem('products-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  // Filters state
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = React.useState<[string | undefined, string | undefined] | undefined>();

  const handleDelete = React.useCallback((systemId: string) => {
    setIdToDelete(systemId)
    setIsAlertOpen(true)
  }, [])
  
  // ✅ Handle restore cho soft delete
  const handleRestore = React.useCallback((systemId: string) => {
    restore(asSystemId(systemId));
    toast.success('Đã khôi phục sản phẩm');
  }, [restore]);

  const columns = React.useMemo(() => getColumns(handleDelete, handleRestore, navigate), [handleDelete, handleRestore, navigate]);
  
  // ✅ Run once on mount only
  React.useEffect(() => {
    const defaultVisibleColumns = [
      'id', 'name', 'sku', 'categorySystemId', 'type', 
      'status', 'defaultPrice', 'costPrice', 'inventory', 'unit',
      'inventoryWarning', 'weight', 'dimensions', 'brand', 'supplier'
    ];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      if (c.id === 'select' || c.id === 'actions') {
        initialVisibility[c.id!] = true;
      } else {
        initialVisibility[c.id!] = defaultVisibleColumns.includes(c.id!);
      }
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  }, []);

  // ✅ Cache active and deleted products
  const activeProducts = React.useMemo(() => getActive(), [products]);
  const deletedProducts = React.useMemo(() => getDeleted(), [products]);

  const fuse = React.useMemo(() => new Fuse(showDeleted ? deletedProducts : activeProducts, { keys: ["id", "name"] }), [activeProducts, deletedProducts, showDeleted]);
  
  const confirmDelete = () => {
    if (idToDelete) {
      remove(asSystemId(idToDelete));
      toast.success('Đã chuyển sản phẩm vào thùng rác');
    }
    setIsAlertOpen(false)
    setIdToDelete(null)
  }
  
  const filteredData = React.useMemo(() => {
    let sourceData = showDeleted ? deletedProducts : activeProducts;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      sourceData = sourceData.filter(p => p.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      sourceData = sourceData.filter(p => p.type === typeFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      sourceData = sourceData.filter(p => p.categorySystemId === categoryFilter);
    }
    
    // Apply date range filter
    if (dateRangeFilter && (dateRangeFilter[0] || dateRangeFilter[1])) {
      sourceData = sourceData.filter(p => {
        if (!p.createdAt) return false;
        const createdDate = new Date(p.createdAt);
        const fromDate = dateRangeFilter[0] ? new Date(dateRangeFilter[0]) : null;
        const toDate = dateRangeFilter[1] ? new Date(dateRangeFilter[1]) : null;
        
        if (fromDate && isDateBefore(createdDate, fromDate)) return false;
        if (toDate && isDateAfter(createdDate, toDate)) return false;
        return true;
      });
    }
    
    // Apply search filter
    if (globalFilter) {
      return fuse.search(globalFilter).map(result => result.item).filter(item => {
        // Reapply other filters to search results
        let pass = true;
        if (statusFilter !== 'all') pass = pass && item.status === statusFilter;
        if (typeFilter !== 'all') pass = pass && item.type === typeFilter;
        if (categoryFilter !== 'all') pass = pass && item.categorySystemId === categoryFilter;
        return pass;
      });
    }
    
    return sourceData;
  }, [activeProducts, deletedProducts, showDeleted, globalFilter, fuse, statusFilter, typeFilter, categoryFilter, dateRangeFilter]);
  
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);
  
  // Mobile infinite scroll logic
  React.useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight * 0.8 && mobileLoadedCount < sortedData.length) {
        setMobileLoadedCount(prev => Math.min(prev + 20, sortedData.length));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, sortedData.length]);

  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [globalFilter, statusFilter, typeFilter, categoryFilter, dateRangeFilter, showDeleted]);
  
  const allSelectedRows = React.useMemo(() => {
    const sourceData = showDeleted ? deletedProducts : activeProducts;
    return sourceData.filter(p => rowSelection[p.systemId]);
  }, [activeProducts, deletedProducts, showDeleted, rowSelection]);

  const exportConfig = {
    fileName: 'Danh_sach_San_pham',
    columns,
  };

  const importConfig = React.useMemo(() => ({
    importer: (items: any[]) => {
      const currentEmployeeSystemId = authEmployee?.systemId || 'SYSTEM';
      try {
        const processed = items.map((item: any, index: number) => {
          if (!item.name) {
            throw new Error(`Dòng ${index + 1} thiếu tên sản phẩm`);
          }

          const normalizedRowKeyMap = buildNormalizedRowKeyMap(item);
          const inventoryByBranch: Record<string, number> = {};

          branchInventoryIdentifiers.forEach(({ systemId, identifiers }) => {
            inventoryByBranch[systemId] = getBranchInventoryValue(item, normalizedRowKeyMap, identifiers);
          });

          const totalBranchInventory = Object.values(inventoryByBranch).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
          const fallbackInventory = getFallbackInventoryValue(item, normalizedRowKeyMap);

          if (fallbackInventory !== null && totalBranchInventory === 0 && defaultBranchSystemId) {
            inventoryByBranch[defaultBranchSystemId] = fallbackInventory;
          }

          // Không tạo systemId/id thủ công; store sẽ cấp khi addMultiple chạy ID_CONFIG
          return {
            id: item.id || item.sku || '',
            name: item.name,
            sku: item.sku || '',
            type: item.type || 'physical',
            status: item.status || 'active',
            unit: item.unit || '',
            defaultPrice: Number(item.defaultPrice) || 0,
            costPrice: Number(item.costPrice) || 0,
            inventory: Number(item.inventory) || 0,
            inventoryByBranch,
            committedByBranch: {},
            inTransitByBranch: {},
            inventoryWarning: Number(item.inventoryWarning) || 0,
            categorySystemId: item.categorySystemId || '',
            description: item.description || '',
            prices: {},
            isDeleted: false,
            createdAt: new Date().toISOString(),
            createdBy: currentEmployeeSystemId,
            updatedAt: new Date().toISOString(),
            updatedBy: currentEmployeeSystemId,
          } as Omit<Product, 'systemId'>;
        });

        addMultiple(processed);
        toast.success(`Đã nhập ${processed.length} sản phẩm thành công`);
      } catch (error) {
        console.error('[Products Importer] Lỗi nhập sản phẩm', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Không thể nhập sản phẩm. Vui lòng kiểm tra file và thử lại.',
        );
        throw error;
      }
    },
    fileName: 'Mau_Nhap_San_pham',
    existingData: products,
    getUniqueKey: (item: any) => item.id || item.sku,
  }), [addMultiple, authEmployee?.systemId, branchInventoryIdentifiers, defaultBranchSystemId, products]);

  const handleRowClick = (row: Product) => {
    navigate(`/products/${row.systemId}`);
  };

  // Get unique categories for filter - từ settings
  const categoryOptions = React.useMemo(() => {
    return categories
      .filter(c => !c.isDeleted && c.isActive)
      .map(c => ({
        label: c.path || c.name,
        value: c.systemId
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [categories]);

  const bulkActions = [
    {
      label: "Chuyển vào thùng rác",
      onSelect: (selectedRows: Product[]) => {
        const systemIds = selectedRows.map(p => p.systemId);
        systemIds.forEach(id => remove(asSystemId(id)));
        setRowSelection({});
        toast.success(`Đã chuyển ${selectedRows.length} sản phẩm vào thùng rác`);
      }
    },
    {
      label: "Đang hoạt động",
      onSelect: (selectedRows: Product[]) => {
        selectedRows.forEach(product => {
          update(asSystemId(product.systemId), { ...product, status: 'active' });
        });
        setRowSelection({});
        toast.success(`Đã cập nhật ${selectedRows.length} sản phẩm sang trạng thái "Đang hoạt động"`);
      }
    },
    {
      label: "Ngừng kinh doanh",
      onSelect: (selectedRows: Product[]) => {
        selectedRows.forEach(product => {
          update(asSystemId(product.systemId), { ...product, status: 'discontinued' });
        });
        setRowSelection({});
        toast.success(`Đã cập nhật ${selectedRows.length} sản phẩm sang trạng thái "Ngừng kinh doanh"`);
      }
    }
  ];

  const getStatusVariant = (status?: string) => {
    if (!status) return 'secondary';
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'discontinued': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return 'Không xác định';
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Tạm ngừng';
      case 'discontinued': return 'Ngừng kinh doanh';
      default: return status;
    }
  };

  const getTypeLabel = (type?: string) => {
    if (!type) return '';
    switch (type) {
      case 'physical': return 'Hàng hóa';
      case 'service': return 'Dịch vụ';
      case 'digital': return 'Sản phẩm số';
      default: return type;
    }
  };

  const MobileProductCard = ({ product }: { product: Product }) => {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleRowClick(product)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon/Avatar */}
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                <Package className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.id}</p>
                  {product.shortDescription && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {product.shortDescription}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.systemId}/edit`); }}>
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(product.systemId); }}>
                      Chuyển vào thùng rác
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Details */}
              <div className="space-y-1.5 mt-2">
                {product.categorySystemId && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Package className="h-3 w-3 mr-1.5" />
                    <span className="truncate">
                      {categories.find(c => c.systemId === product.categorySystemId)?.name || product.categorySystemId}
                    </span>
                  </div>
                )}
                {product.type && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="truncate">{getTypeLabel(product.type)}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t">
                <Badge variant={getStatusVariant(product.status) as any} className="text-xs">
                  {getStatusLabel(product.status)}
                </Badge>
                {product.unit && (
                  <span className="text-xs text-muted-foreground">
                    ĐVT: {product.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* ===== HÀNG 2: TOOLBAR - Common Actions (Desktop only) ===== */}
      {!isMobile && (
        <PageToolbar
          leftActions={
            <>
              <DataTableImportDialog config={importConfig} />
              <DataTableExportDialog 
                allData={products} 
                filteredData={sortedData} 
                pageData={paginatedData} 
                config={exportConfig} 
              />
            </>
          }
          rightActions={
            <>
              <DataTableColumnCustomizer
                columns={columns}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                columnOrder={columnOrder}
                setColumnOrder={setColumnOrder}
                pinnedColumns={pinnedColumns}
                setPinnedColumns={setPinnedColumns}
              />
            </>
          }
        />
      )}

      {/* ===== HÀNG 3: FILTERS - Search & Custom Filters (1 hàng) ===== */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm kiếm sản phẩm..."
      >
        <DataTableDateFilter
          value={dateRangeFilter}
          onChange={setDateRangeFilter}
          title="Ngày tạo"
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-9">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Tạm ngừng</SelectItem>
            <SelectItem value="discontinued">Ngừng kinh doanh</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-9">
            <SelectValue placeholder="Loại sản phẩm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="physical">Hàng hóa</SelectItem>
            <SelectItem value="service">Dịch vụ</SelectItem>
            <SelectItem value="digital">Sản phẩm số</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-9">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categoryOptions.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageFilters>
      
      {/* ===== DATA TABLE ===== */}
      <div className="pb-4">
        <ResponsiveDataTable
          columns={columns}
          data={isMobile ? sortedData.slice(0, mobileLoadedCount) : paginatedData}
          renderMobileCard={(product) => <MobileProductCard product={product} />}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
          rowCount={filteredData.length}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          allSelectedRows={allSelectedRows}
          onBulkDelete={undefined}
          bulkActions={bulkActions}
          sorting={sorting}
          setSorting={setSorting}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          pinnedColumns={pinnedColumns}
          setPinnedColumns={setPinnedColumns}
          onRowClick={handleRowClick}
          emptyTitle="Không có sản phẩm"
          emptyDescription="Thêm sản phẩm đầu tiên để bắt đầu"
        />
      </div>
      
      {/* Mobile loading indicator */}
      {isMobile && (
        <div className="py-6 text-center">
          {mobileLoadedCount < sortedData.length ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm">Đang tải thêm...</span>
            </div>
          ) : sortedData.length > 20 ? (
            <p className="text-sm text-muted-foreground">
              Đã hiển thị tất cả {sortedData.length} kết quả
            </p>
          ) : null}
        </div>
      )}
    
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Sản phẩm sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9">Hủy</AlertDialogCancel>
            <AlertDialogAction className="h-9" onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
