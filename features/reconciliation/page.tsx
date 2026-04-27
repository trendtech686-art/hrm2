'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { usePageHeader } from '@/contexts/page-header-context'
import { useReconciliationSheets } from './hooks/use-reconciliation-sheets'
import { useConfirmSheet, useDeleteSheet } from './hooks/use-reconciliation-sheets'
import type { ReconciliationSheet, ReconciliationSheetStatus } from './api/reconciliation-sheets-api'
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table'
import { getSheetColumns } from './columns'
import { MobileCard, MobileCardBody, MobileCardHeader } from '@/components/mobile/mobile-card'
import { PageToolbar } from '@/components/layout/page-toolbar'
import { PageFilters } from '@/components/layout/page-filters'
import { Button } from '@/components/ui/button'
import { FilePlus, CheckCircle2, Trash2, Loader2 } from 'lucide-react'
import { Tabs } from '@/components/ui/tabs'
import { MobileTabsList, MobileTabsTrigger } from '@/components/layout/page-section'
import { Badge } from '@/components/ui/badge'
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/contexts/auth-context'
import { useBreakpoint } from '@/contexts/breakpoint-context'
import { ROUTES } from '@/lib/router'
import { formatCurrency } from '@/lib/format-utils'
import { formatDate } from '@/lib/date-utils'
import { useColumnVisibility, useColumnOrder, usePinnedColumns } from '@/hooks/use-column-visibility'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type StatusTab = 'all' | 'DRAFT' | 'CONFIRMED'

export function ReconciliationPage() {
  const router = useRouter()
  const { can } = useAuth()
  const canCreate = can('create_reconciliation')
  const { isMobile } = useBreakpoint()

  const [statusTab, setStatusTab] = useState<StatusTab>('all')
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true })

  // Server-side pagination query
  const { data: sheetsResponse, isLoading, isFetching } = useReconciliationSheets({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter || undefined,
    status: statusTab !== 'all' ? statusTab as ReconciliationSheetStatus : undefined,
  })

  // Move sheets inside useMemo to avoid logical expression in dependencies
  const sheets = useMemo(() => sheetsResponse?.data ?? [], [sheetsResponse?.data]);
  const totalCount = sheetsResponse?.pagination?.total ?? 0;
  const pageCount = sheetsResponse?.pagination?.totalPages ?? 0;

  // Row selection for bulk actions
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Hooks for bulk actions
  const confirmSheet = useConfirmSheet();
  const deleteSheet = useDeleteSheet();

  const selectedSheets = useMemo(
    () => sheets.filter(s => rowSelection[s.systemId]),
    [sheets, rowSelection],
  );

  // Column visibility
  const columns = useMemo(() => getSheetColumns(), [])

  const defaultColumnVisibility = useMemo(() => {
    const initial: Record<string, boolean> = {}
    columns.forEach(c => { if (c.id) initial[c.id] = true })
    return initial
  }, [columns])
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('reconciliation-sheets', defaultColumnVisibility)
  const [columnOrder, setColumnOrder] = useColumnOrder('reconciliation-sheets')
  const [pinnedColumns, setPinnedColumns] = usePinnedColumns('reconciliation-sheets')

  // Row click → navigate to detail
  const handleRowClick = useCallback((sheet: ReconciliationSheet) => {
    router.push(`/reconciliation/${sheet.systemId}`)
  }, [router])

  // Confirm selected DRAFT sheets
  const handleConfirm = async () => {
    const drafts = selectedSheets.filter(s => s.status === 'DRAFT')
    for (const sheet of drafts) {
      confirmSheet.mutate(sheet.systemId, {
        onSuccess: () => toast.success(`Đã xác nhận phiếu ${sheet.id}`),
        onError: (err: Error) => toast.error(`Lỗi xác nhận ${sheet.id}: ${err.message}`),
      })
    }
    setRowSelection({})
    setConfirmDialogOpen(false)
  }

  // Delete selected DRAFT sheets
  const handleBulkDelete = async () => {
    const drafts = selectedSheets.filter(s => s.status === 'DRAFT')
    for (const sheet of drafts) {
      deleteSheet.mutate(sheet.systemId, {
        onSuccess: () => toast.success(`Đã xóa phiếu ${sheet.id}`),
        onError: (err: Error) => toast.error(`Lỗi xóa ${sheet.id}: ${err.message}`),
      })
    }
    setRowSelection({})
    setDeleteDialogOpen(false)
  }

  // Bulk action handlers
  const handleBulkConfirmClick = useCallback(() => {
    const drafts = selectedSheets.filter(s => s.status === 'DRAFT')
    if (!drafts.length) { toast.info('Không có phiếu nháp nào để xác nhận'); return }
    setConfirmDialogOpen(true)
  }, [selectedSheets])

  const handleBulkDeleteClick = useCallback(() => {
    const drafts = selectedSheets.filter(s => s.status === 'DRAFT')
    if (!drafts.length) { toast.info('Không có phiếu nháp nào để xóa'); return }
    setDeleteDialogOpen(true)
  }, [selectedSheets])

  const bulkActions = useMemo(() => [
    { label: 'Xác nhận', icon: CheckCircle2, onSelect: handleBulkConfirmClick },
    { label: 'Xóa phiếu', icon: Trash2, onSelect: handleBulkDeleteClick, variant: 'destructive' as const },
  ], [handleBulkConfirmClick, handleBulkDeleteClick])

  const _selectedCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection])
  const draftSelectedCount = useMemo(
    () => selectedSheets.filter(s => s.status === 'DRAFT').length,
    [selectedSheets],
  )

  usePageHeader(useMemo(() => ({
    title: 'Đối soát COD',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Đối soát COD', href: ROUTES.INTERNAL.RECONCILIATION, isCurrent: true },
    ],
    showBackButton: false,
    actions: [
      canCreate && <Button
        key="create-sheet"
        size="sm"
        className="px-4"
        onClick={() => router.push('/reconciliation/create')}
      >
        <FilePlus className="mr-2 h-4 w-4" />
        Tạo phiếu đối soát
      </Button>,
      draftSelectedCount > 0 && <Button
        key="confirm"
        size="sm"
        className="px-4"
        onClick={() => setConfirmDialogOpen(true)}
      >
        <CheckCircle2 className="mr-2 h-4 w-4" />
        Xác nhận ({draftSelectedCount})
      </Button>,
    ].filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [canCreate, draftSelectedCount]))

  // Column defaults
  const columnDefaultsInitialized = useRef(false)
  useEffect(() => {
    if (columnDefaultsInitialized.current) return
    if (columns.length === 0) return
    const initialVisibility: Record<string, boolean> = {}
    columns.forEach(c => { if (c.id) initialVisibility[c.id] = true })
    setColumnVisibility(initialVisibility)
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[])
    columnDefaultsInitialized.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Status Tabs */}
      <Tabs value={statusTab} onValueChange={(v) => { setStatusTab(v as StatusTab); setRowSelection({}); setPagination(p => ({ ...p, pageIndex: 0 })) }}>
        <MobileTabsList>
          <MobileTabsTrigger value="all">
            Tất cả
          </MobileTabsTrigger>
          <MobileTabsTrigger value="DRAFT">
            Nháp
          </MobileTabsTrigger>
          <MobileTabsTrigger value="CONFIRMED">
            Đã xác nhận
          </MobileTabsTrigger>
        </MobileTabsList>
      </Tabs>

      {/* Toolbar */}
      {!isMobile && (
        <PageToolbar
          rightActions={
            <DataTableColumnCustomizer
              columns={columns}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              pinnedColumns={pinnedColumns}
              setPinnedColumns={setPinnedColumns}
            />
          }
        />
      )}

      {/* Search */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={(v) => { setGlobalFilter(v); setPagination(p => ({ ...p, pageIndex: 0 })) }}
        searchPlaceholder="Tìm mã phiếu, đối tác vận chuyển..."
      />

      {/* Data Table */}
      <div className={cn(isFetching && !isLoading && 'opacity-70 transition-opacity')}>
      <ResponsiveDataTable<ReconciliationSheet>
        className="row"
        columns={columns}
        data={sheets}
        rowCount={totalCount}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        allSelectedRows={selectedSheets}
        bulkActions={bulkActions}
        showBulkDeleteButton={false}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
        expanded={{}}
        setExpanded={() => {}}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        mobileInfiniteScroll
        renderMobileCard={(sheet) => (
          <MobileCard onClick={() => handleRowClick(sheet)}>
            <MobileCardHeader className="items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Phiếu đối soát</div>
                <div className="mt-0.5 flex items-center gap-2">
                  <div className="text-sm font-semibold text-foreground truncate font-mono">{sheet.id}</div>
                  <Badge
                    variant={sheet.status === 'CONFIRMED' ? 'default' : sheet.status === 'CANCELLED' ? 'destructive' : 'secondary'}
                    className="text-xs shrink-0"
                  >
                    {sheet.status === 'CONFIRMED' ? 'Đã xác nhận' : sheet.status === 'CANCELLED' ? 'Đã hủy' : 'Nháp'}
                  </Badge>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold leading-none">{sheet._count?.items ?? 0}</div>
                <div className="mt-1 text-xs text-muted-foreground">Vận đơn</div>
              </div>
            </MobileCardHeader>
            <MobileCardBody>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
                <div className="col-span-2">
                  <dt className="text-xs text-muted-foreground">Đơn vị vận chuyển</dt>
                  <dd className="font-medium truncate">{sheet.carrier}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">COD hệ thống</dt>
                  <dd className="font-medium">{formatCurrency(sheet.totalCodSystem)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Lệch COD</dt>
                  <dd className={cn('font-medium', sheet.codDifference !== 0 ? 'text-destructive' : 'text-green-600')}>
                    {formatCurrency(sheet.codDifference)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Ngày tạo</dt>
                  <dd className="font-medium">{formatDate(sheet.createdAt)}</dd>
                </div>
              </dl>
            </MobileCardBody>
          </MobileCard>
        )}
      />
      </div>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận phiếu đối soát?</AlertDialogTitle>
            <AlertDialogDescription>
              Xác nhận {draftSelectedCount} phiếu nháp đã chọn. Sau khi xác nhận sẽ không thể chỉnh sửa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={confirmSheet.isPending}>
              {confirmSheet.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...</> : 'Xác nhận'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa phiếu đối soát?</AlertDialogTitle>
            <AlertDialogDescription>
              Xóa {draftSelectedCount} phiếu nháp đã chọn. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={deleteSheet.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteSheet.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xóa...</> : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

