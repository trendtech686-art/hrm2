'use client'
import * as React from "react"
import { useRouter } from 'next/navigation'
import { formatDate } from '../../../lib/date-utils'
import { usePenalties, usePenaltyMutations } from "./hooks/use-penalties";
import type { PenaltyFilters } from "./api/penalties-api";
import { useAllEmployees } from "../../employees/hooks/use-all-employees"
import { useAllBranches } from "../branches/hooks/use-all-branches"
import { fetchPrintData } from '@/lib/lazy-print-data';
import { useDefaultPageSize } from "../global/hooks/use-global-settings"
import { getColumns } from "./columns"
import { ResponsiveDataTable, type BulkAction } from "../../../components/data-table/responsive-data-table"
import { DataTableFacetedFilter } from "../../../components/data-table/data-table-faceted-filter"
import { toast } from "sonner"

import { Button } from "../../../components/ui/button"
import { PlusCircle, User, Calendar, MoreHorizontal, FileText, AlertTriangle, Printer } from "lucide-react"
import type { Penalty, PenaltyStatus } from "./types"
import { penaltyCategoryLabels } from "./types"
import { DataTableExportDialog } from "../../../components/data-table/data-table-export-dialog"
import { DataTableImportDialog, type ImportConfig } from "../../../components/data-table/data-table-import-dialog"
import { usePageHeader } from "../../../contexts/page-header-context"
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '../../../components/data-table/dynamic-column-customizer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { TouchButton } from "../../../components/mobile/touch-button"
import { MobileCard } from "../../../components/mobile/mobile-card"
import { Badge } from "../../../components/ui/badge"
import { useMediaQuery } from "../../../lib/use-media-query"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { PageToolbar } from "../../../components/layout/page-toolbar"
import { PageFilters } from "../../../components/layout/page-filters"
import { usePrint } from "../../../lib/use-print"
import { convertPenaltyForPrint, mapPenaltyToPrintData, createStoreSettings } from "../../../lib/print/penalty-print-helper"
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from "../../../components/shared/simple-print-options-dialog"
import { useColumnLayout } from '../../../hooks/use-column-visibility'
import { useAuth } from '@/contexts/auth-context'
import { ListPageShell } from '@/components/layout/page-section'

const formatCurrency = (v?: number | string) => {
  if (v === undefined || v === null) return '';
  const numValue = typeof v === 'string' ? parseFloat(v) : v;
  if (isNaN(numValue)) return '';
  return new Intl.NumberFormat('vi-VN').format(numValue);
}

export function PenaltiesPage() {
  const { can } = useAuth();
  const canCreate = can('edit_employees');
  const canEdit = can('edit_employees');
  const { update } = usePenaltyMutations();
  const { data: employees } = useAllEmployees()
  const { data: branches } = useAllBranches()
  // ⚡ OPTIMIZED: storeInfo lazy loaded in handlePrintConfirm
  const router = useRouter()
  const { printMultiple } = usePrint()
  const defaultPageSize = useDefaultPageSize()
  const isMobile = !useMediaQuery("(min-width: 768px)")

  const [printDialogOpen, setPrintDialogOpen] = React.useState(false), [itemsToPrint, setItemsToPrint] = React.useState<Penalty[]>([])
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'issueDate', desc: true })
  const [globalFilter, setGlobalFilter] = React.useState(''), [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set())
  const [employeeFilter, setEmployeeFilter] = React.useState('all'), [categoryFilter, setCategoryFilter] = React.useState<Set<string>>(new Set())
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: defaultPageSize })
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  // Server-side filters
  const penaltyFilters: PenaltyFilters = React.useMemo(() => ({
    search: debouncedGlobalFilter || undefined,
    employeeSystemId: employeeFilter !== 'all' ? employeeFilter : undefined,
    status: statusFilter.size > 0 ? Array.from(statusFilter).join(',') : undefined,
    category: categoryFilter.size > 0 ? Array.from(categoryFilter).join(',') : undefined,
    sortBy: sorting.id || 'issueDate',
    sortOrder: sorting.desc ? 'desc' : 'asc',
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  }), [debouncedGlobalFilter, employeeFilter, statusFilter, categoryFilter, sorting, pagination]);
  const penaltiesQuery = usePenalties(penaltyFilters);
  const penalties = penaltiesQuery.data?.data || [];
  const isLoadingPenalties = penaltiesQuery.isLoading;
  const paginationInfo = penaltiesQuery.data?.pagination;
  const totalRows = paginationInfo?.total || 0;
  const pageCount = paginationInfo?.totalPages || 0;

  usePageHeader({ actions: React.useMemo(() => [canCreate && <Button key="add" size="sm" onClick={() => router.push('/penalties/new')}><PlusCircle className="mr-2 h-4 w-4" />Tạo phiếu phạt</Button>].filter(Boolean), [router, canCreate]) })
  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t) }, [globalFilter])
  // Reset page when filters change
  React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })) }, [debouncedGlobalFilter, employeeFilter, statusFilter, categoryFilter])

  const [columnLayout, columnLayoutSetters] = useColumnLayout('penalties', React.useMemo(() => ({ visibility: {}, order: [] as string[], pinned: [] as string[] }), []))
  const { visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns } = columnLayout
  const { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns } = columnLayoutSetters

  const handleMarkPaid = React.useCallback((p: Penalty) => { update.mutate({ systemId: p.systemId, data: { status: "Đã thanh toán" as PenaltyStatus, updatedAt: new Date().toISOString() } }, { onSuccess: () => toast.success("Đã cập nhật trạng thái", { description: `Phiếu phạt ${p.id} đã chuyển sang "Đã thanh toán"` }), onError: (err) => toast.error(err.message) }) }, [update])
  const handleCancel = React.useCallback((p: Penalty) => { update.mutate({ systemId: p.systemId, data: { status: "Đã hủy" as PenaltyStatus, updatedAt: new Date().toISOString() } }, { onSuccess: () => toast.success("Đã hủy phiếu phạt", { description: `Phiếu phạt ${p.id} đã bị hủy` }), onError: (err) => toast.error(err.message) }) }, [update])
  const columns = React.useMemo(() => getColumns(handleMarkPaid, handleCancel, router), [handleMarkPaid, handleCancel, router])

  const defaultVisibleCols = React.useMemo(() => new Set(['select', 'id', 'employeeName', 'penaltyTypeName', 'reason', 'amount', 'issueDate', 'issuerName', 'status', 'category', 'linkedComplaintSystemId', 'linkedOrderSystemId', 'deductedInPayrollId', 'createdAt', 'actions']), [])
  const buildDefaultVisibility = React.useCallback(() => Object.fromEntries(columns.map(c => [c.id, c.id === 'select' || c.id === 'actions' || defaultVisibleCols.has(c.id!)])), [columns, defaultVisibleCols])
  const buildDefaultOrder = React.useCallback(() => columns.map(c => c.id).filter(Boolean) as string[], [columns])
  const defaultsInitialized = React.useRef(false)
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { if (columns.length === 0 || defaultsInitialized.current) return; defaultsInitialized.current = true; setColumnVisibility(buildDefaultVisibility()); setColumnOrder(buildDefaultOrder()) }, [])
  const resetColumnLayout = React.useCallback(() => { setColumnVisibility(buildDefaultVisibility()); setColumnOrder(buildDefaultOrder()); setPinnedColumns([]); toast.success('Đã khôi phục bố cục cột mặc định') }, [buildDefaultVisibility, buildDefaultOrder, setColumnVisibility, setColumnOrder, setPinnedColumns])

  const allSelectedRows = React.useMemo(() => (penaltiesQuery.data?.data || []).filter(p => rowSelection[p.systemId]), [penaltiesQuery.data?.data, rowSelection])

  const { create } = usePenaltyMutations();
  const statusOptions = React.useMemo(() => [{ label: 'Chưa thanh toán', value: 'Chưa thanh toán' }, { label: 'Đã thanh toán', value: 'Đã thanh toán' }, { label: 'Đã hủy', value: 'Đã hủy' }], [])
  const categoryOptions = React.useMemo(() => [{ label: 'Khiếu nại', value: 'complaint' }, { label: 'Chấm công', value: 'attendance' }, { label: 'Hiệu suất', value: 'performance' }, { label: 'Khác', value: 'other' }], [])
  const employeeOptions = React.useMemo(() => employees.map(e => ({ value: e.systemId, label: e.fullName })), [employees])

  const exportConfig = { fileName: 'Danh_sach_Phieu_phat', columns }
  const importConfig: ImportConfig<Penalty> = { importer: items => { create.mutate(items.map(({ systemId: _, ...rest }) => rest) as Parameters<typeof create.mutate>[0]); return Promise.resolve(); }, fileName: 'Mau_Nhap_Phieu_phat', existingData: penalties, getUniqueKey: (item) => ('id' in item ? String(item.id) : item.systemId) }

  const handleBulkPrint = React.useCallback((rows: Penalty[]) => { setItemsToPrint(rows); setPrintDialogOpen(true) }, [])
  const handlePrintConfirm = React.useCallback(async (options: SimplePrintOptionsResult) => {
    if (itemsToPrint.length === 0) return
    const { storeInfo } = await fetchPrintData()
    printMultiple('penalty', itemsToPrint.map(penalty => {
      const employee = employees.find(e => e.systemId === penalty.employeeSystemId)
      const selectedBranch = options.branchSystemId ? branches.find(b => b.systemId === options.branchSystemId) : null
      const storeSettings = createStoreSettings(selectedBranch || storeInfo)
      return { data: mapPenaltyToPrintData(convertPenaltyForPrint(penalty, { employee }), storeSettings), lineItems: [], paperSize: options.paperSize }
    }))
    toast.success(`Đang in ${itemsToPrint.length} phiếu phạt`); setItemsToPrint([]); setPrintDialogOpen(false)
  }, [itemsToPrint, employees, branches, printMultiple])

  const bulkActions: BulkAction<Penalty>[] = [
    { label: "In phiếu", icon: Printer, onSelect: handleBulkPrint },
    ...(canEdit ? [{ label: "Đánh dấu đã thanh toán", onSelect: (rows: Penalty[]) => { const total = rows.length; let done = 0; rows.forEach(p => update.mutate({ systemId: p.systemId, data: { status: "Đã thanh toán" as PenaltyStatus } }, { onSuccess: () => { done++; if (done === total) { toast.success("Đã cập nhật trạng thái", { description: `${total} phiếu phạt đã chuyển sang "Đã thanh toán"` }); setRowSelection({}) } }, onError: (err) => toast.error(err.message) })) } }] : []),
    ...(canEdit ? [{ label: "Hủy phiếu phạt", onSelect: (rows: Penalty[]) => { const total = rows.length; let done = 0; rows.forEach(p => update.mutate({ systemId: p.systemId, data: { status: "Đã hủy" as PenaltyStatus } }, { onSuccess: () => { done++; if (done === total) { toast.success("Đã cập nhật trạng thái", { description: `${total} phiếu phạt đã hủy` }); setRowSelection({}) } }, onError: (err) => toast.error(err.message) })) } }] : [])
  ]
  const handleRowClick = (row: Penalty) => router.push(`/penalties/${row.systemId}`)

  const MobilePenaltyCard = ({ penalty }: { penalty: Penalty }) => {
    const statusVariant = { 'Chưa thanh toán': 'warning', 'Đã thanh toán': 'success', 'Đã hủy': 'secondary' }[penalty.status] as "warning" | "success" | "secondary" || 'secondary'
    return (
      <MobileCard onClick={() => handleRowClick(penalty)}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0"><AlertTriangle className="h-4 w-4 text-destructive shrink-0" /><span className="font-semibold text-sm font-mono">{penalty.id}</span><Badge variant={statusVariant} className="text-xs ml-auto">{penalty.status}</Badge></div>
            <DropdownMenu><DropdownMenuTrigger asChild><TouchButton variant="ghost" size="sm" className="h-11 w-11 p-0 shrink-0 -mr-2 -mt-1 ml-2" onClick={e => e.stopPropagation()}><MoreHorizontal className="h-4 w-4" /></TouchButton></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={e => { e.stopPropagation(); router.push(`/penalties/${penalty.systemId}/edit`) }}>Chỉnh sửa</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
          </div>
          <div className="flex items-center text-sm mb-2"><User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" /><span className="font-medium truncate">{penalty.employeeName}</span></div>
          <div className="text-xs text-muted-foreground mb-3 line-clamp-2"><FileText className="h-3 w-3 mr-1.5 inline-flex shrink-0" />{penalty.reason}</div>
          <div className="border-t border-border/50 mt-3 pt-3" />
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3"><span className="font-bold text-destructive text-sm">{formatCurrency(penalty.amount)} đ</span>{penalty.category && <Badge variant="outline" className="text-xs">{penaltyCategoryLabels[penalty.category]}</Badge>}</div>
            <div className="flex items-center text-muted-foreground"><Calendar className="h-3 w-3 mr-1" />{formatDate(penalty.issueDate)}</div>
          </div>
          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">Người lập: {penalty.issuerName}</div>
      </MobileCard>
    )
  }

  return (
    <ListPageShell>
      {!isMobile && <PageToolbar leftActions={<><DataTableImportDialog config={importConfig} /><DataTableExportDialog allData={penalties} filteredData={penalties} pageData={penalties} config={exportConfig} /></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onResetToDefault={resetColumnLayout} />} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm kiếm phiếu phạt (mã, tên NV, lý do)...">
        <Select value={employeeFilter} onValueChange={setEmployeeFilter}><SelectTrigger className="w-full sm:w-45"><SelectValue placeholder="Tất cả nhân viên" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả nhân viên</SelectItem>{employeeOptions.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}</SelectContent></Select>
        <DataTableFacetedFilter title="Trạng thái" options={statusOptions} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} />
        <DataTableFacetedFilter title="Phân loại" options={categoryOptions} selectedValues={categoryFilter} onSelectedValuesChange={setCategoryFilter} />
      </PageFilters>
      <div className="w-full py-4">
        <ResponsiveDataTable columns={columns} data={penalties} renderMobileCard={p => <MobilePenaltyCard penalty={p} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} bulkActions={bulkActions} allSelectedRows={allSelectedRows} expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} isLoading={isLoadingPenalties} emptyTitle="Chưa có phiếu phạt" emptyDescription="Tạo phiếu phạt để ghi nhận vi phạm" mobileInfiniteScroll />
      </div>
      <SimplePrintOptionsDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={itemsToPrint.length} title="In phiếu phạt" />
    </ListPageShell>
  )
}
