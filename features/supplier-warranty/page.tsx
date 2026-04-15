'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSupplierWarranties, useSupplierWarrantyMutations } from './hooks/use-supplier-warranty'
import { getColumns } from './columns'
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table'
import { PageFilters } from '@/components/layout/page-filters'
import { Button } from '@/components/ui/button'
import { usePageHeader } from '@/contexts/page-header-context'
import { useBreakpoint } from '@/contexts/breakpoint-context'
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings'
import { Plus, Trash2, X } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useAllSuppliers } from '@/features/suppliers/hooks/use-all-suppliers'
import type { SupplierWarranty } from './types'
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel'
import { useFilterPresets } from '@/hooks/use-filter-presets'

const WARRANTY_STATUSES = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'PACKED', label: 'Đã đóng gói' },
  { value: 'EXPORTED', label: 'Đã xuất kho' },
  { value: 'DELIVERED', label: 'Giao thành công' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
]

export function SupplierWarrantyPage() {
  const router = useRouter()
  const { isMobile } = useBreakpoint()
  const { can } = useAuth()
  const { data: suppliers = [] } = useAllSuppliers()

  // Filter presets
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('supplier-warranty')

  // Filter state
  const [searchQuery, setSearchQuery] = React.useState('')
  const [debouncedSearch, setDebouncedSearch] = React.useState('')
  const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({})
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true })
  const [pagination, setPagination] = usePaginationWithGlobalDefault()
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20)
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const { cancel, remove } = useSupplierWarrantyMutations()

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, setPagination])

  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [advancedFilters, setPagination])

  React.useEffect(() => {
    setMobileLoadedCount(20)
  }, [searchQuery, advancedFilters, sorting])

  // Server-side query
  const { data: queryData, isLoading } = useSupplierWarranties({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: (advancedFilters.status as string) || undefined,
    supplierId: (advancedFilters.supplier as string) || undefined,
    startDate: (advancedFilters.dateRange as { from?: string; to?: string } | null)?.from || undefined,
    endDate: (advancedFilters.dateRange as { from?: string; to?: string } | null)?.to || undefined,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  })

  const items = React.useMemo(() => queryData?.data ?? [], [queryData?.data])
  const totalRows = queryData?.pagination?.total ?? 0
  const pageCount = queryData?.pagination?.totalPages ?? 1

  // Row selection
  const allSelectedRows = React.useMemo(
    () => items.filter(item => rowSelection[item.systemId]),
    [items, rowSelection]
  )

  // Bulk actions
  const handleBulkDelete = React.useCallback(async () => {
    const drafts = allSelectedRows.filter(r => r.status === 'DRAFT')
    if (drafts.length === 0) {
      toast.error('Chỉ có thể xóa phiếu ở trạng thái Nháp')
      return
    }
    if (!window.confirm(`Xóa ${drafts.length} phiếu BH nháp?`)) return
    for (const row of drafts) {
      remove.mutate(row.systemId, {
        onError: (err) => toast.error(`Lỗi xóa ${row.id}: ${err.message}`),
      })
    }
    setRowSelection({})
  }, [allSelectedRows, remove])

  const handleBulkCancel = React.useCallback(async () => {
    const cancellable = allSelectedRows.filter(r => ['DRAFT', 'APPROVED', 'PACKED'].includes(r.status))
    if (cancellable.length === 0) {
      toast.error('Không có phiếu nào có thể hủy')
      return
    }
    if (!window.confirm(`Hủy ${cancellable.length} phiếu BH?`)) return
    for (const row of cancellable) {
      cancel.mutate(row.systemId, {
        onError: (err) => toast.error(`Lỗi hủy ${row.id}: ${err.message}`),
      })
    }
    setRowSelection({})
  }, [allSelectedRows, cancel])

  const bulkActions = React.useMemo(() => [
    { label: 'Hủy phiếu', icon: X, onSelect: handleBulkCancel },
    { label: 'Xóa phiếu nháp', icon: Trash2, onSelect: handleBulkDelete },
  ], [handleBulkCancel, handleBulkDelete])

  const canCreate = can('create_supplier_warranty')
  const headerActions = React.useMemo(() => [
    canCreate && <Button key="add" size="sm" onClick={() => router.push('/supplier-warranties/new')}>
      <Plus className="mr-1.5 h-4 w-4" />
      Tạo phiếu BH
    </Button>,
  ].filter(Boolean), [canCreate, router])

  usePageHeader({
    title: 'BH Nhà cung cấp',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'BH Nhà cung cấp', href: '/supplier-warranties', isCurrent: true },
    ],
    actions: headerActions,
    showBackButton: false,
  })

  // Advanced filter configs
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'status', label: 'Trạng thái', type: 'select' as const, options: WARRANTY_STATUSES.filter(s => s.value !== 'all').map(s => ({ value: s.value, label: s.label })) },
    { id: 'supplier', label: 'Nhà cung cấp', type: 'select' as const, options: suppliers.map(s => ({ value: s.systemId, label: s.name })) },
    { id: 'dateRange', label: 'Ngày tạo', type: 'date-range' as const },
  ], [suppliers])

  const panelValues = React.useMemo(() => ({
    status: advancedFilters.status ?? null,
    supplier: advancedFilters.supplier ?? null,
    dateRange: advancedFilters.dateRange ?? null,
  }), [advancedFilters])

  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setAdvancedFilters(v)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [setPagination])

  const columns = React.useMemo(() => getColumns(), [])

  const handleRowClick = React.useCallback((row: SupplierWarranty) => {
    router.push(`/supplier-warranties/${row.systemId}`)
  }, [router])

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
        searchPlaceholder="Tìm theo mã phiếu, NCC, mã vận đơn..."
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
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        sorting={sorting}
        setSorting={setSorting}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        bulkActions={bulkActions}
        allSelectedRows={allSelectedRows}
        emptyTitle="Không có phiếu BH NCC"
        emptyDescription="Chưa có phiếu bảo hành nhà cung cấp nào"
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
