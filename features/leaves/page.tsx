'use client'

import * as React from "react";
import { useRouter } from 'next/navigation';
import { useLeaves, useLeaveMutations, useBatchLeaveMutation, leaveKeys } from './hooks/use-leaves';
import { getColumns } from './columns';
import type { LeaveRequest, LeaveStatus } from "@/lib/types/prisma-extended";
import { MobileCard, MobileCardBody, MobileCardHeader } from "@/components/mobile/mobile-card";
import type { SystemId } from '@/lib/id-types';
import type { BatchCreateItem } from './api/leaves-api';
import { fetchLeaveById } from './api/leaves-api';
import { useQueryClient } from '@tanstack/react-query';
import { usePageHeader } from "../../contexts/page-header-context";
import { useAuth } from "../../contexts/auth-context";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table";
import { PageToolbar } from "../../components/layout/page-toolbar"
import { PageFilters } from "../../components/layout/page-filters";
import { Button } from "../../components/ui/button";
import { PlusCircle, CheckCircle2, XCircle, Download, Settings } from "lucide-react";
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";

import { useColumnLayout } from "@/hooks/use-column-visibility";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "../../components/data-table/dynamic-column-customizer";
import { toast } from "sonner";
import { useBreakpoint } from "../../contexts/breakpoint-context";
import { Badge } from "../../components/ui/badge";
import { formatDate } from "../../lib/date-utils";
import { DataTableExportDialog } from "../../components/data-table/data-table-export-dialog";
import { DataTableImportDialog, type ImportConfig } from "../../components/data-table/data-table-import-dialog";
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';

export function LeavesPage() {
  const router = useRouter(), { isMobile } = useBreakpoint();
  const queryClient = useQueryClient();
  const {  user, can } = useAuth();
  const canCreate = can('create_leaves');
  const canEditSettings = can('edit_settings');

  // Server-side pagination state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = usePaginationWithGlobalDefault();

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, setPagination]);

  const mutations = useLeaveMutations();
  const batchMutation = useBatchLeaveMutation();
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({}), [isAlertOpen, setIsAlertOpen] = React.useState(false), [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('leaves');
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'status', label: 'Trạng thái', type: 'select' as const, options: [
      { value: 'all', label: 'Tất cả' },
      { value: 'Chờ duyệt', label: 'Chờ duyệt' },
      { value: 'Đã duyệt', label: 'Đã duyệt' },
      { value: 'Đã từ chối', label: 'Đã từ chối' },
    ] },
    { id: 'leaveType', label: 'Loại phép', type: 'select' as const, options: [
      { value: 'all', label: 'Tất cả' },
      { value: 'ANNUAL', label: 'Phép năm' },
      { value: 'SICK', label: 'Nghỉ ốm' },
      { value: 'UNPAID', label: 'Nghỉ không lương' },
      { value: 'MATERNITY', label: 'Thai sản' },
      { value: 'PATERNITY', label: 'Nghỉ chăm con' },
      { value: 'BEREAVEMENT', label: 'Nghỉ tang' },
      { value: 'WEDDING', label: 'Nghỉ cưới' },
      { value: 'OTHER', label: 'Khác' },
    ] },
    { id: 'dateRange', label: 'Ngày bắt đầu', type: 'date-range' as const },
  ], []);
  const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({});
  const panelValues = React.useMemo(() => ({
    status: advancedFilters.status ?? null,
    leaveType: advancedFilters.leaveType ?? null,
    dateRange: advancedFilters.dateRange ?? null,
  }), [advancedFilters]);
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setAdvancedFilters(v);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [setPagination]);

  // React Query: fetch with server-side filters
  const { data: leavesResponse, isLoading: isLoadingLeaves, isFetching } = useLeaves(React.useMemo(() => {
    const status = advancedFilters.status as string | undefined;
    const leaveType = advancedFilters.leaveType as string | undefined;
    const dateRange = advancedFilters.dateRange as { from?: string; to?: string } | null;
    return {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedSearch || undefined,
      status: status && status !== 'all' ? status : undefined,
      leaveType: leaveType && leaveType !== 'all' ? leaveType : undefined,
      fromDate: dateRange?.from || undefined,
      toDate: dateRange?.to || undefined,
      sortBy: sorting.id,
      sortOrder: sorting.desc ? 'desc' : 'asc',
    };
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch, advancedFilters, sorting]));
  const leaveRequests = React.useMemo(() => leavesResponse?.data ?? [], [leavesResponse?.data]);
  const totalRows = leavesResponse?.pagination?.total ?? 0;
  const pageCount = leavesResponse?.pagination?.totalPages ?? 1;

  const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = useColumnLayout('leaves', {
    pinned: ['select', 'employeeName'],
  });

  const handleStatusChange = React.useCallback((systemId: SystemId, status: LeaveStatus) => {
    const request = leaveRequests.find(r => r.systemId === systemId);
    if (!request) return;
    
    const currentUserName = user?.name || user?.email || 'Unknown';
    
    if (status === 'Đã duyệt') {
      mutations.approve.mutate({ systemId, approvedBy: currentUserName }, {
        onSuccess: () => toast.success("Đã duyệt đơn nghỉ phép", { description: `Đơn ${request.id} đã được duyệt` }),
        onError: () => toast.error("Lỗi", { description: "Không thể duyệt đơn nghỉ phép" }),
      });
    } else if (status === 'Đã từ chối') {
      mutations.reject.mutate({ systemId, rejectedBy: currentUserName, reason: 'Từ chối' }, {
        onSuccess: () => toast.success("Đã từ chối đơn", { description: `Đơn ${request.id} đã bị từ chối` }),
        onError: () => toast.error("Lỗi", { description: "Không thể từ chối đơn" }),
      });
    } else {
      mutations.update.mutate({ systemId, data: { status } }, {
        onSuccess: () => toast.success("Đã cập nhật trạng thái", { description: `Đơn ${request.id} đã được cập nhật` }),
        onError: () => toast.error("Lỗi", { description: "Không thể cập nhật trạng thái" }),
      });
    }
  }, [leaveRequests, mutations, user]);

  const handleDelete = React.useCallback((systemId: SystemId) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const columns = React.useMemo(() => getColumns(handleDelete, handleStatusChange, router.push), [handleDelete, handleStatusChange, router]);
  
  const columnDefaultsInitialized = React.useRef(false);
  React.useEffect(() => {
    if (columnDefaultsInitialized.current || !columns.length) return;
    if (Object.keys(columnVisibility).length > 0) { columnDefaultsInitialized.current = true; return; }
    columnDefaultsInitialized.current = true;
    const defaultVisibleColumns = ['employeeName', 'employeeId', 'leaveTypeName', 'leaveTypeId', 'dateRange', 'startDate', 'endDate', 'numberOfDays', 'reason', 'status', 'requestDate', 'leaveTypeIsPaid', 'leaveTypeRequiresAttachment', 'createdAt', 'updatedAt'];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => { initialVisibility[c.id!] = c.id === 'select' || c.id === 'actions' ? true : defaultVisibleColumns.includes(c.id!); });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  }, [columns, columnVisibility, setColumnVisibility, setColumnOrder]);

  const allSelectedRows = React.useMemo(() => leaveRequests.filter(lr => rowSelection[lr.systemId]), [leaveRequests, rowSelection]);
  const handleRowClick = React.useCallback((row: LeaveRequest) => {
    router.push(`/leaves/${row.systemId}`);
  }, [router]);

  const handleRowHover = React.useCallback((row: LeaveRequest) => {
    queryClient.prefetchQuery({
      queryKey: leaveKeys.detail(row.systemId),
      queryFn: () => fetchLeaveById(row.systemId),
      staleTime: 60_000,
    });
  }, [queryClient]);

  const confirmDelete = () => {
    if (idToDelete) {
      const request = leaveRequests.find(r => r.systemId === idToDelete);
      mutations.remove.mutate(idToDelete, {
        onSuccess: () => toast.success("Đã xóa đơn nghỉ phép", { description: `Đơn của ${request?.employeeName || 'nhân viên'} đã được xóa` }),
        onError: () => toast.error("Lỗi", { description: "Không thể xóa đơn nghỉ phép" }),
      });
    }
    setIsAlertOpen(false);
  };

  const handleBulkApprove = React.useCallback(() => {
    const currentUserName = user?.name || user?.email || 'Unknown';
    const systemIds = allSelectedRows.map(row => row.systemId);
    batchMutation.mutate(
      { action: 'approve', systemIds, approvedBy: currentUserName },
      {
        onSuccess: (result) => {
          toast.success(`Đã duyệt ${result.approved ?? 0} đơn nghỉ phép`, {
            description: result.skipped ? `${result.skipped} đơn bị bỏ qua (không hợp lệ)` : undefined,
          });
          setRowSelection({});
        },
        onError: () => toast.error('Lỗi khi duyệt hàng loạt'),
      },
    );
  }, [allSelectedRows, batchMutation, user]);
  
  const handleBulkReject = React.useCallback(() => {
    const currentUserName = user?.name || user?.email || 'Unknown';
    const systemIds = allSelectedRows.map(row => row.systemId);
    batchMutation.mutate(
      { action: 'reject', systemIds, rejectedBy: currentUserName, reason: 'Từ chối hàng loạt' },
      {
        onSuccess: (result) => {
          toast.success(`Đã từ chối ${result.rejected ?? 0} đơn nghỉ phép`, {
            description: result.skipped ? `${result.skipped} đơn bị bỏ qua` : undefined,
          });
          setRowSelection({});
        },
        onError: () => toast.error('Lỗi khi từ chối hàng loạt'),
      },
    );
  }, [allSelectedRows, batchMutation, user]);
  
  const handleBulkDelete = React.useCallback(() => {
    if (allSelectedRows.length === 0) return;
    allSelectedRows.forEach(row => mutations.remove.mutate(row.systemId));
    setRowSelection({});
    toast.success(`Đã xóa ${allSelectedRows.length} đơn nghỉ phép`);
  }, [allSelectedRows, mutations]);

  const exportConfig = React.useMemo(() => ({ fileName: 'Danh_sach_Nghi_phep', columns }), [columns]);
  const importConfig: ImportConfig<LeaveRequest> = React.useMemo(() => ({
    importer: (items) => {
      const batchItems: BatchCreateItem[] = items.map(item => ({
        employeeId: item.employeeSystemId || '',
        leaveType: item.leaveTypeId || 'ANNUAL',
        startDate: item.startDate || new Date().toISOString().split('T')[0],
        endDate: item.endDate || new Date().toISOString().split('T')[0],
        reason: item.reason,
        status: 'Chờ duyệt',
      }));
      batchMutation.mutate(
        { action: 'create', items: batchItems },
        {
          onSuccess: (result) => {
            toast.success(`Đã nhập ${result.created ?? 0} đơn nghỉ phép`, {
              description: result.errors?.length ? `${result.errors.length} lỗi` : undefined,
            });
          },
          onError: () => toast.error('Lỗi khi nhập hàng loạt'),
        },
      );
    },
    fileName: 'Mau_Nhap_Nghi_phep', existingData: leaveRequests, getUniqueKey: (item: Partial<LeaveRequest>) => item.id || `${item.employeeId}-${item.startDate}`,
  }), [batchMutation, leaveRequests]);

  const bulkActions = React.useMemo(() => [
    { label: 'Duyệt đã chọn', icon: CheckCircle2, onSelect: () => handleBulkApprove() },
    { label: 'Từ chối đã chọn', icon: XCircle, onSelect: () => handleBulkReject() },
    { label: 'Xuất Excel đã chọn', icon: Download, onSelect: (selectedRows: LeaveRequest[]) => toast.success(`Xuất ${selectedRows.length} đơn nghỉ phép`) }
  ], [handleBulkApprove, handleBulkReject]);

  const headerActions = React.useMemo(() => [canCreate && <Button key="add" onClick={() => router.push('/leaves/create')} size="sm"><PlusCircle className="mr-2 h-4 w-4" />Tạo đơn nghỉ phép</Button>].filter(Boolean), [canCreate, router]);
  usePageHeader({ actions: headerActions });

  const renderMobileCard = React.useCallback((leave: LeaveRequest) => {
    const statusVariants: Record<LeaveStatus, "success" | "warning" | "destructive"> = { "Chờ duyệt": "warning", "Đã duyệt": "success", "Đã từ chối": "destructive" };
    return (
      <MobileCard key={leave.systemId} inert>
        <MobileCardHeader className="items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Nhân viên</div>
            <div className="mt-0.5 text-sm font-semibold text-foreground truncate">{leave.employeeName}</div>
            <div className="text-xs text-muted-foreground font-mono truncate">{leave.employeeId}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold leading-none">{leave.numberOfDays}</div>
            <div className="mt-1 text-xs text-muted-foreground">Ngày</div>
          </div>
        </MobileCardHeader>
        <MobileCardBody>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Loại phép</dt>
              <dd className="font-medium truncate">{leave.leaveTypeName}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Trạng thái</dt>
              <dd>
                <Badge variant={statusVariants[leave.status]} className="text-xs">{leave.status}</Badge>
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Thời gian</dt>
              <dd className="font-medium">{formatDate(leave.startDate)} – {formatDate(leave.endDate)}</dd>
            </div>
            {leave.reason && (
              <div className="col-span-2">
                <dt className="text-xs text-muted-foreground">Lý do</dt>
                <dd className="font-medium line-clamp-2">{leave.reason}</dd>
              </div>
            )}
          </dl>
        </MobileCardBody>
      </MobileCard>
    );
  }, []);

  return (
    <div className="space-y-4">
      {!isMobile && (
        <PageToolbar
          leftActions={<>{canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/employees')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}<DataTableImportDialog config={importConfig} /><DataTableExportDialog allData={leaveRequests} filteredData={leaveRequests} pageData={leaveRequests} config={exportConfig} /></>}
          rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />}
        />
      )}
      <PageFilters searchValue={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Tìm kiếm đơn...">
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
      <div className={cn(isFetching && 'opacity-60 pointer-events-none transition-opacity')}>
      <ResponsiveDataTable columns={columns} data={leaveRequests} renderMobileCard={renderMobileCard} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} sorting={sorting} setSorting={setSorting} onRowClick={handleRowClick} onRowHover={handleRowHover} allSelectedRows={allSelectedRows} onBulkDelete={handleBulkDelete} bulkActions={bulkActions} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} emptyTitle="Không có đơn nghỉ phép" emptyDescription="Tạo đơn nghỉ phép đầu tiên để bắt đầu" isLoading={isLoadingLeaves} mobileInfiniteScroll />
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Xóa đơn nghỉ phép?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
