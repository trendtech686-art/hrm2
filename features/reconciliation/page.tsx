'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { usePageHeader } from '@/contexts/page-header-context'
import { useReconciliationSheets, useConfirmSheet, useDeleteSheet } from './hooks/use-reconciliation-sheets'
import type { ReconciliationSheet, ReconciliationSheetStatus } from './api/reconciliation-sheets-api'
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table'
import { getSheetColumns } from './columns'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { PageToolbar } from '@/components/layout/page-toolbar'
import { PageFilters } from '@/components/layout/page-filters'
import { Button } from '@/components/ui/button'
import { FilePlus, CheckCircle2, Trash2, Loader2 } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

  const [statusTab, setStatusTab] = React.useState<StatusTab>('all')
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 })
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true })

  // Server-side pagination query
  const { data: sheetsResponse, isLoading, isFetching } = useReconciliationSheets({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter || undefined,
    status: statusTab !== 'all' ? statusTab as ReconciliationSheetStatus : undefined,
  })

  const sheets = sheetsResponse?.data ?? []
  const totalCount = sheetsResponse?.pagination?.total ?? 0
  const pageCount = sheetsResponse?.pagination?.totalPages ?? 0

  const confirmSheet = useConfirmSheet()
  const deleteSheet = useDeleteSheet()

  // Row selection for bulk actions
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const selectedSheets = React.useMemo(
    () => sheets.filter(s => rowSelection[s.systemId]),
    [sheets, rowSelection],
  )

  // Column visibility
  const columns = React.useMemo(() => getSheetColumns(), [])

  const defaultColumnVisibility = React.useMemo(() => {
    const initial: Record<string, boolean> = {}
    columns.forEach(c => { if (c.id) initial[c.id] = true })
    return initial
  }, [columns])
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('reconciliation-sheets', defaultColumnVisibility)
  const [columnOrder, setColumnOrder] = useColumnOrder('reconciliation-sheets')
  const [pinnedColumns, setPinnedColumns] = usePinnedColumns('reconciliation-sheets')

  // Row click → navigate to detail
  const handleRowClick = React.useCallback((sheet: ReconciliationSheet) => {
    router.push(`/reconciliation/${sheet.systemId}`)
  }, [router])

  // Confirm selected DRAFT sheets
  const handleConfirm = async () => {
    const drafts = selectedSheets.filter(s => s.status === 'DRAFT')
    for (const sheet of drafts) {
      confirmSheet.mutate(sheet.systemId, {
        onSuccess: () => toast.success(`Đã xác nhận phiếu ${sheet.id}`),
        onError: (err) => toast.error(`Lỗi xác nhận ${sheet.id}: ${err.message}`),
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
        onError: (err) => toast.error(`Lỗi xóa ${sheet.id}: ${err.message}`),
      })
    }
    setRowSelection({})
    setDeleteDialogOpen(false)
  }

  // Bulk action handlers
  const handleBulkConfirmClick = React.useCallback(() => {
    const drafts = selectedSheets.filter(s => s.status === 'DRAFT')
    if (!drafts.length) { toast.info('Không có phiếu nháp nào để xác nhận'); return }
    setConfirmDialogOpen(true)
  }, [selectedSheets])

  const handleBulkDeleteClick = React.useCallback(() => {
    const drafts = selectedSheets.filter(s => s.status === 'DRAFT')
    if (!drafts.length) { toast.info('Không có phiếu nháp nào để xóa'); return }
    setDeleteDialogOpen(true)
  }, [selectedSheets])

  const bulkActions = React.useMemo(() => [
    { label: 'Xác nhận', icon: CheckCircle2, onSelect: handleBulkConfirmClick },
    { label: 'Xóa phiếu', icon: Trash2, onSelect: handleBulkDeleteClick, variant: 'destructive' as const },
  ], [handleBulkConfirmClick, handleBulkDeleteClick])

  const selectedCount = React.useMemo(() => Object.keys(rowSelection).length, [rowSelection])
  const draftSelectedCount = React.useMemo(
    () => selectedSheets.filter(s => s.status === 'DRAFT').length,
    [selectedSheets],
  )

  usePageHeader(React.useMemo(() => ({
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
        className="h-9 px-4"
        onClick={() => router.push('/reconciliation/create')}
      >
        <FilePlus className="mr-2 h-4 w-4" />
        Tạo phiếu đối soát
      </Button>,
      draftSelectedCount > 0 && <Button
        key="confirm"
        size="sm"
        className="h-9 px-4"
        onClick={() => setConfirmDialogOpen(true)}
      >
        <CheckCircle2 className="mr-2 h-4 w-4" />
        Xác nhận ({draftSelectedCount})
      </Button>,
    ].filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [canCreate, draftSelectedCount]))

  // Column defaults
  const columnDefaultsInitialized = React.useRef(false)
  React.useEffect(() => {
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
        <TabsList className="inline-flex w-auto gap-1 p-1 h-auto">
          <TabsTrigger value="all" className="shrink-0 px-3 h-9 text-sm">
            Tất cả
          </TabsTrigger>
          <TabsTrigger value="DRAFT" className="shrink-0 px-3 h-9 text-sm">
            Nháp
          </TabsTrigger>
          <TabsTrigger value="CONFIRMED" className="shrink-0 px-3 h-9 text-sm">
            Đã xác nhận
          </TabsTrigger>
        </TabsList>
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
        renderMobileCard={(sheet) => (
          <Card className="cursor-pointer" onClick={() => handleRowClick(sheet)}>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle size="sm">{sheet.id}</CardTitle>
                  <div className="text-sm text-muted-foreground">{sheet.carrier}</div>
                </div>
                <Badge variant={sheet.status === 'CONFIRMED' ? 'default' : sheet.status === 'CANCELLED' ? 'destructive' : 'secondary'}>
                  {sheet.status === 'CONFIRMED' ? 'Đã xác nhận' : sheet.status === 'CANCELLED' ? 'Đã hủy' : 'Nháp'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground">Số vận đơn</div>
                  <div className="font-semibold">{sheet._count?.items ?? 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">COD hệ thống</div>
                  <div className="font-semibold">{formatCurrency(sheet.totalCodSystem)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Lệch COD</div>
                  <div className={sheet.codDifference !== 0 ? 'text-destructive font-semibold' : 'text-green-600'}>
                    {formatCurrency(sheet.codDifference)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Ngày tạo</div>
                  <div>{formatDate(sheet.createdAt)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
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

