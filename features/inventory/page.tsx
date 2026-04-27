'use client'

import * as React from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { Package, MapPin } from "lucide-react"

import { useAllBranches, useBranchFinder } from "../settings/branches/hooks/use-all-branches"
import { usePageHeader } from "@/contexts/page-header-context"
import { useAuth } from "@/contexts/auth-context"
import { useMediaQuery } from "@/lib/use-media-query"
import { useColumnVisibility } from "@/hooks/use-column-visibility"
import { formatCurrency, formatNumber } from "@/lib/format-utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table"
import { TableSkeleton } from "@/components/shared/table-skeleton"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { PageFilters } from "@/components/layout/page-filters"
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel'
import { useFilterPresets } from '@/hooks/use-filter-presets'
import type { ColumnDef } from "@/components/data-table/types"
import { useQuery } from "@tanstack/react-query"

type InventoryFilters = {
  page: number
  limit: number
  search: string
  branchId: string
  hasStock: boolean
  lowStock: boolean
  categorySystemId: string
}

// Query keys factory
export const inventoryKeys = {
  all: ['inventory'] as const,
  list: (filters: InventoryFilters) => [...inventoryKeys.all, filters] as const,
};

// Props from Server Component
export interface InventoryPageProps {
  initialSummary?: {
    totalProducts: number;
    totalOnHand: number;
    totalCommitted: number;
    totalInTransit: number;
    totalInDelivery: number;
    totalAvailable: number;
    totalValue: number;
  };
}

// Types
interface InventoryItem {
  productSystemId: string
  productId: string
  productName: string
  thumbnailImage: string | null
  unit: string
  branchId: string
  branchName: string
  onHand: number
  committed: number
  inTransit: number
  inDelivery: number
  available: number
  reorderLevel: number | null
  costPrice: number
  totalValue: number
}

// Types for data with systemId
type InventoryItemWithSystemId = InventoryItem & { systemId: string }

// Columns definition
function getColumns(): ColumnDef<InventoryItemWithSystemId>[] {
  return [
    {
      id: 'productId',
      accessorKey: 'productId',
      header: 'Mã SP',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.productId}</span>
      ),
    },
    {
      id: 'productName',
      accessorKey: 'productName',
      header: 'Tên sản phẩm',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.thumbnailImage ? (
            <OptimizedImage 
              src={row.thumbnailImage} 
              alt="" 
              width={32} 
              height={32} 
              className="w-8 h-8 rounded object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
              <Package className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
          <span className="font-medium">{row.productName}</span>
        </div>
      ),
    },
    {
      id: 'unit',
      accessorKey: 'unit',
      header: 'ĐVT',
      cell: ({ row }) => row.unit || '-',
    },
    {
      id: 'branchName',
      accessorKey: 'branchName',
      header: 'Chi nhánh',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span>{row.branchName}</span>
        </div>
      ),
    },
    {
      id: 'onHand',
      accessorKey: 'onHand',
      header: 'Tồn kho',
      cell: ({ row }) => {
        const { onHand, reorderLevel } = row
        const isLow = reorderLevel && onHand <= reorderLevel
        return (
          <div className="text-right">
            <span className={isLow ? 'text-destructive font-medium' : ''}>
              {formatNumber(onHand)}
            </span>
            {isLow && (
              <Badge variant="destructive" className="ml-2 text-xs">
                Thấp
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      id: 'committed',
      accessorKey: 'committed',
      header: 'Đang giao dịch',
      cell: ({ row }) => (
        <div className="text-right text-muted-foreground">
          {formatNumber(row.committed)}
        </div>
      ),
    },
    {
      id: 'available',
      accessorKey: 'available',
      header: 'Có thể bán',
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatNumber(row.available)}
        </div>
      ),
    },
    {
      id: 'costPrice',
      accessorKey: 'costPrice',
      header: 'Giá vốn',
      cell: ({ row }) => (
        <div className="text-right">
          {formatCurrency(row.costPrice)}
        </div>
      ),
    },
    {
      id: 'totalValue',
      accessorKey: 'totalValue',
      header: 'Giá trị tồn',
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.totalValue)}
        </div>
      ),
    },
  ]
}

// API fetch function
async function fetchInventory(filters: InventoryFilters) {
  const params = new URLSearchParams()
  params.set('page', String(filters.page))
  params.set('limit', String(filters.limit))
  if (filters.search) params.set('search', filters.search)
  if (filters.branchId) params.set('branchId', filters.branchId)
  if (filters.hasStock) params.set('hasStock', 'true')
  if (filters.lowStock) params.set('lowStock', 'true')
  if (filters.categorySystemId) params.set('categorySystemId', filters.categorySystemId)
  
  const res = await fetch(`/api/inventory?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch inventory')
  return res.json()
}

export function InventoryPage(_props: InventoryPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { can } = useAuth()
  const { setPageHeader } = usePageHeader()
  const _canEdit = can('edit_inventory');
  const _canView = can('view_inventory');
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Get branches
  const { data: branches = [] } = useAllBranches()
  const _getBranchName = useBranchFinder()

  // Filter presets
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('inventory')
  
  // Filters state
  const [filters, setFilters] = React.useState<InventoryFilters>({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 50,
    search: searchParams.get('search') || '',
    branchId: searchParams.get('branchId') || '',
    hasStock: searchParams.get('hasStock') === 'true',
    lowStock: searchParams.get('lowStock') === 'true',
    categorySystemId: searchParams.get('categorySystemId') || '',
  })
  const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({});
  
  // Debounced search
  const [searchInput, setSearchInput] = React.useState(filters.search)
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)
  
  React.useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput, page: 1 }))
    }, 300)
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchInput])

  // Sync advancedFilters to filters state
  React.useEffect(() => {
    setFilters(prev => ({
      ...prev,
      branchId: (advancedFilters.branchId as string) || '',
      hasStock: !!(advancedFilters.hasStock),
      lowStock: !!(advancedFilters.lowStock),
      page: 1,
    }))
  }, [advancedFilters])
  
  // Fetch inventory data
  const { data, isLoading, error } = useQuery({
    queryKey: inventoryKeys.list(filters),
    queryFn: () => fetchInventory(filters),
    staleTime: 30000, // 30 seconds
  })
  
  // Update URL params
  React.useEffect(() => {
    const params = new URLSearchParams()
    if (filters.page > 1) params.set('page', String(filters.page))
    if (filters.search) params.set('search', filters.search)
    if (filters.branchId) params.set('branchId', filters.branchId)
    if (filters.hasStock) params.set('hasStock', 'true')
    if (filters.lowStock) params.set('lowStock', 'true')
    
    const search = params.toString()
    router.replace(`/inventory${search ? `?${search}` : ''}`, { scroll: false })
  }, [filters, router])
  
  // Set page header
  React.useEffect(() => {
    setPageHeader({
      title: 'Tồn kho',
      subtitle: 'Quản lý tồn kho theo sản phẩm và chi nhánh',
    })
  }, [setPageHeader])
  
  // Column visibility
  const [columnVisibility, setColumnVisibility] = useColumnVisibility(
    'inventory-column-visibility',
    {
      productId: true,
      productName: true,
      unit: true,
      branchName: true,
      onHand: true,
      committed: !isMobile,
      available: true,
      costPrice: !isMobile,
      totalValue: !isMobile,
    }
  )
  
  const columns = React.useMemo(
    () => getColumns(),
    []
  )

  // Advanced filter configs
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'branchId', label: 'Chi nhánh', type: 'select' as const, options: branches.map(b => ({ value: b.systemId, label: b.name })) },
    { id: 'hasStock', label: 'Còn hàng', type: 'boolean' as const },
    { id: 'lowStock', label: 'Tồn thấp', type: 'boolean' as const },
  ], [branches])

  const panelValues = React.useMemo(() => ({
    branchId: advancedFilters.branchId ?? null,
    hasStock: advancedFilters.hasStock ?? false,
    lowStock: advancedFilters.lowStock ?? false,
  }), [advancedFilters])

  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setAdvancedFilters(v)
  }, [])
  
  // Summary cards
  const summary = React.useMemo(() => {
    if (!data?.data) return null
    const items = data.data as InventoryItem[]
    return {
      totalProducts: data.pagination?.total || 0,
      totalValue: items.reduce((sum, item) => sum + item.totalValue, 0),
      lowStockCount: items.filter(item => 
        item.reorderLevel && item.onHand <= item.reorderLevel
      ).length,
    }
  }, [data])
  
  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Có lỗi xảy ra khi tải dữ liệu tồn kho
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle size="sm">Tổng sản phẩm</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.totalProducts)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle size="sm">Giá trị tồn kho</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle size="sm">Tồn kho thấp</CardTitle>
              <Package className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatNumber(summary.lowStockCount)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Filters */}
      <PageFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Tìm theo mã, tên, barcode..."
      >
        <AdvancedFilterPanel
          filters={filterConfigs}
          values={panelValues}
          onApply={handlePanelApply}
          presets={presets.map(p => ({ ...p, filters: p.filters }))}
          onSavePreset={(preset) => savePreset(preset.name, panelValues)}
          onDeletePreset={deletePreset}
          onUpdatePreset={updatePreset}
        />
      </PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />
      
      {/* Data Table */}
      {isLoading ? (
        <TableSkeleton columns={7} rows={10} />
      ) : (
        <ResponsiveDataTable
          data={(data?.data || []).map((item: InventoryItem) => ({ ...item, systemId: item.productSystemId }))}
          columns={columns}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          pageCount={data?.pagination?.totalPages || 1}
          pagination={{
            pageIndex: filters.page - 1,
            pageSize: filters.limit,
          }}
          setPagination={(updater) => {
            const newPagination = typeof updater === 'function' 
              ? updater({ pageIndex: filters.page - 1, pageSize: filters.limit })
              : updater
            setFilters(prev => ({ ...prev, page: newPagination.pageIndex + 1, limit: newPagination.pageSize }))
          }}
          rowCount={data?.pagination?.total || 0}
          sorting={{ id: '', desc: false }}
          setSorting={() => {}}
          emptyTitle="Không có dữ liệu tồn kho"
        />
      )}
    </div>
  )
}

export default InventoryPage
