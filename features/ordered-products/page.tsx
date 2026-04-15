'use client'

import * as React from 'react'
import { useOrderedProducts } from './hooks/use-ordered-products'
import { getColumns } from './columns'
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table'
import { PageFilters } from '@/components/layout/page-filters'
import { usePageHeader } from '@/contexts/page-header-context'
import { useBreakpoint } from '@/contexts/breakpoint-context'
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings'
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel'
import { useFilterPresets } from '@/hooks/use-filter-presets'
import { useAllSuppliers } from '@/features/suppliers/hooks/use-all-suppliers'

const PO_STATUSES = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'RECEIVING', label: 'Đang nhận hàng' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
]

export function OrderedProductsPage() {
  const { isMobile } = useBreakpoint()
  const { data: suppliers = [] } = useAllSuppliers()

  // Filter state
  const [searchQuery, setSearchQuery] = React.useState('')
  const [debouncedSearch, setDebouncedSearch] = React.useState('')
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'orderDate', desc: true })
  const [pagination, setPagination] = usePaginationWithGlobalDefault()
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20)

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('ordered-products')
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'status', label: 'Trạng thái', type: 'select' as const, options: PO_STATUSES },
    { id: 'supplier', label: 'Nhà cung cấp', type: 'select' as const, options: [
      { label: 'Tất cả', value: 'all' },
      ...suppliers.map(s => ({ label: s.name, value: s.systemId })),
    ] },
    { id: 'orderDate', label: 'Ngày đặt hàng', type: 'date-range' as const },
  ], [suppliers])
  const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({})
  const panelValues = React.useMemo(() => ({
    status: advancedFilters.status ?? null,
    supplier: advancedFilters.supplier ?? null,
    orderDate: advancedFilters.orderDate ?? null,
  }), [advancedFilters])
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setAdvancedFilters(v)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [setPagination])

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, setPagination])

  // Reset page when filter changes
  React.useEffect(() => {
    setMobileLoadedCount(20)
  }, [searchQuery, advancedFilters, sorting])

  // Server-side query
  const { data: queryData, isLoading } = useOrderedProducts(React.useMemo(() => {
    const dateRange = advancedFilters.orderDate as { from?: string; to?: string } | null
    const status = advancedFilters.status as string | undefined
    const supplier = advancedFilters.supplier as string | undefined
    return {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedSearch || undefined,
      status: status && status !== 'all' ? status : undefined,
      supplierId: supplier && supplier !== 'all' ? supplier : undefined,
      dateFrom: dateRange?.from || undefined,
      dateTo: dateRange?.to || undefined,
      sortBy: sorting.id,
      sortOrder: sorting.desc ? 'desc' : 'asc',
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch, advancedFilters, sorting]))

  const items = React.useMemo(() => queryData?.data ?? [], [queryData?.data])
  const totalRows = queryData?.pagination?.total ?? 0
  const pageCount = queryData?.pagination?.totalPages ?? 1

  // Page header
  usePageHeader({
    title: 'Quản lý hàng đặt',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Quản lý hàng đặt', href: '/ordered-products', isCurrent: true },
    ],
  })

  const columns = React.useMemo(() => getColumns(), [])

  // Mobile infinite scroll
  React.useEffect(() => {
    if (!isMobile) return
    const handleScroll = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight * 0.8) {
        setMobileLoadedCount(prev => prev < items.length ? Math.min(prev + 20, items.length) : prev)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, items.length])

  const displayData = React.useMemo(
    () => isMobile ? items.slice(0, mobileLoadedCount) : items,
    [isMobile, items, mobileLoadedCount],
  )

  return (
    <div className="space-y-4">
      <PageFilters
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm theo tên SP, SKU, mã đơn nhập, NCC..."
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

      <ResponsiveDataTable
        columns={columns}
        data={displayData}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={totalRows}
        sorting={sorting}
        setSorting={setSorting}
        isLoading={isLoading}
        emptyTitle="Không có hàng đặt"
        emptyDescription="Chưa có sản phẩm nào được đặt từ nhà cung cấp"
      />

      {isMobile && mobileLoadedCount < items.length && (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
          <p className="text-sm text-muted-foreground mt-2">Đang tải thêm...</p>
        </div>
      )}
    </div>
  )
}
