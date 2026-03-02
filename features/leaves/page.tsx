'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useLeaves, useLeaveMutations, useBatchLeaveMutation } from './hooks/use-leaves';
import { getColumns } from './columns';
import type { LeaveRequest, LeaveStatus } from "@/lib/types/prisma-extended";
import type { SystemId } from '@/lib/id-types';
import type { LeaveCreateInput, BatchCreateItem } from './api/leaves-api';
import { usePageHeader } from "../../contexts/page-header-context";
import { useAuth } from "../../contexts/auth-context";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table";
import { PageToolbar } from "../../components/layout/page-toolbar"
import { PageFilters } from "../../components/layout/page-filters";
import { Button } from "../../components/ui/button";
import { PlusCircle, CheckCircle2, XCircle, Download, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "../../components/data-table/dynamic-column-customizer";
import { toast } from "sonner";
import { useBreakpoint } from "../../contexts/breakpoint-context";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { formatDate } from "../../lib/date-utils";
import { DataTableExportDialog } from "../../components/data-table/data-table-export-dialog";
import { DataTableImportDialog, type ImportConfig } from "../../components/data-table/data-table-import-dialog";

const LeaveForm = dynamic(() => import("./components/leave-form").then(mod => ({ default: mod.LeaveForm })), { ssr: false });

export function LeavesPage() {
  const router = useRouter(), { isMobile } = useBreakpoint();
  const { user } = useAuth();

  // Server-side pagination state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<"all" | LeaveStatus>('all');
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [statusFilter]);

  // React Query: fetch from database with server-side pagination
  const { data: leavesResponse, isLoading: isLoadingLeaves } = useLeaves({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });
  const leaveRequests = React.useMemo(() => leavesResponse?.data ?? [], [leavesResponse?.data]);
  const totalRows = leavesResponse?.pagination?.total ?? 0;
  const pageCount = Math.ceil(totalRows / pagination.pageSize);

  const mutations = useLeaveMutations();
  const batchMutation = useBatchLeaveMutation();
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({}), [isAlertOpen, setIsAlertOpen] = React.useState(false), [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null), [isFormOpen, setIsFormOpen] = React.useState(false), [editingRequest, setEditingRequest] = React.useState<LeaveRequest | null>(null);
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20), [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({}), [columnOrder, setColumnOrder] = React.useState<string[]>([]), [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'employeeName']);

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
  const handleEdit = React.useCallback((request: LeaveRequest) => { setEditingRequest(request); setIsFormOpen(true); }, []);
  const columns = React.useMemo(() => getColumns(handleDelete, handleEdit, handleStatusChange, router.push), [handleDelete, handleEdit, handleStatusChange, router]);
  
  React.useEffect(() => {
    const defaultVisibleColumns = ['employeeName', 'employeeId', 'leaveTypeName', 'leaveTypeId', 'dateRange', 'startDate', 'endDate', 'numberOfDays', 'reason', 'status', 'requestDate', 'leaveTypeIsPaid', 'leaveTypeRequiresAttachment', 'createdAt', 'updatedAt'];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => { initialVisibility[c.id!] = c.id === 'select' || c.id === 'actions' ? true : defaultVisibleColumns.includes(c.id!); });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => { setMobileLoadedCount(20); }, [searchQuery, statusFilter]);

  React.useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const scrollPercentage = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100;
      if (scrollPercentage > 80 && mobileLoadedCount < leaveRequests.length) setMobileLoadedCount(prev => Math.min(prev + 20, leaveRequests.length));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, leaveRequests.length]);

  const displayData = isMobile ? leaveRequests.slice(0, mobileLoadedCount) : leaveRequests;
  const allSelectedRows = React.useMemo(() => leaveRequests.filter(lr => rowSelection[lr.systemId]), [leaveRequests, rowSelection]);
  const handleRowClick = React.useCallback((row: LeaveRequest) => {
    setEditingRequest(row);
    setIsFormOpen(true);
  }, []);

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

  const handleSubmit = (values: Omit<LeaveRequest, 'systemId'>) => {
    if (editingRequest) {
      mutations.update.mutate({ systemId: editingRequest.systemId, data: values }, {
        onSuccess: () => { toast.success("Đã cập nhật đơn nghỉ phép", { description: `Đơn ${values.id} đã được cập nhật thành công` }); setIsFormOpen(false); setEditingRequest(null); },
        onError: () => toast.error("Lỗi", { description: "Không thể cập nhật đơn nghỉ phép" }),
      });
    } else {
      const createData: LeaveCreateInput = {
        employeeId: values.employeeSystemId,
        leaveType: values.leaveTypeId || 'ANNUAL',
        leaveTypeName: values.leaveTypeName,
        leaveTypeSystemId: values.leaveTypeSystemId,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason,
        status: 'Chờ duyệt',
        numberOfDays: values.numberOfDays,
        totalDays: values.numberOfDays,
      };
      mutations.create.mutate(createData, {
        onSuccess: () => { toast.success("Đã tạo đơn nghỉ phép mới", { description: `Đơn đã được tạo, đang chờ duyệt` }); setIsFormOpen(false); setEditingRequest(null); },
        onError: () => toast.error("Lỗi", { description: "Không thể tạo đơn nghỉ phép" }),
      });
    }
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

  const headerActions = React.useMemo(() => [<Button key="add" onClick={() => setIsFormOpen(true)} size="sm" className="h-9"><PlusCircle className="mr-2 h-4 w-4" />Tạo đơn nghỉ phép</Button>], []);
  usePageHeader({ actions: headerActions });

  const renderMobileCard = React.useCallback((leave: LeaveRequest) => {
    const statusVariants: Record<LeaveStatus, "success" | "warning" | "destructive"> = { "Chờ duyệt": "warning", "Đã duyệt": "success", "Đã từ chối": "destructive" };
    return (
      <Card key={leave.systemId} className="mb-3">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div><div className="font-medium">{leave.employeeName}</div><div className="text-xs text-muted-foreground">{leave.employeeId}</div></div>
            <Badge variant={statusVariants[leave.status]}>{leave.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Loại phép:</span><div>{leave.leaveTypeName}</div></div>
            <div><span className="text-muted-foreground">Số ngày:</span><div>{leave.numberOfDays}</div></div>
            <div className="col-span-2"><span className="text-muted-foreground">Thời gian:</span><div>{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</div></div>
            {leave.reason && <div className="col-span-2"><span className="text-muted-foreground">Lý do:</span><div className="truncate">{leave.reason}</div></div>}
          </div>
        </CardContent>
      </Card>
    );
  }, []);

  return (
    <div className="space-y-4">
      {!isMobile && (
        <PageToolbar
          leftActions={<><Button variant="outline" size="sm" onClick={() => router.push('/settings/employees')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button><DataTableImportDialog config={importConfig} /><DataTableExportDialog allData={leaveRequests} filteredData={leaveRequests} pageData={leaveRequests} config={exportConfig} /></>}
          rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />}
        />
      )}
      <PageFilters searchValue={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Tìm kiếm đơn...">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeaveStatus | 'all')}>
          <SelectTrigger className="h-9 w-45"><SelectValue placeholder="Lọc trạng thái" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="Chờ duyệt">Chờ duyệt</SelectItem>
            <SelectItem value="Đã duyệt">Đã duyệt</SelectItem>
            <SelectItem value="Đã từ chối">Đã từ chối</SelectItem>
          </SelectContent>
        </Select>
      </PageFilters>
      <ResponsiveDataTable columns={columns} data={displayData} renderMobileCard={renderMobileCard} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} sorting={sorting} setSorting={setSorting} onRowClick={handleRowClick} allSelectedRows={allSelectedRows} onBulkDelete={handleBulkDelete} bulkActions={bulkActions} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} emptyTitle="Không có đơn nghỉ phép" emptyDescription="Tạo đơn nghỉ phép đầu tiên để bắt đầu" isLoading={isLoadingLeaves} />
      {isMobile && (
        <div className="py-6 text-center">
          {mobileLoadedCount < leaveRequests.length ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-sm">Đang tải thêm...</span></div>
          ) : leaveRequests.length > 20 ? (<p className="text-sm text-muted-foreground">Đã hiển thị tất cả {leaveRequests.length} kết quả</p>) : null}
        </div>
      )}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Xóa đơn nghỉ phép?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingRequest ? 'Chỉnh sửa đơn nghỉ phép' : 'Tạo đơn nghỉ phép mới'}</DialogTitle><DialogDescription>Điền thông tin chi tiết cho đơn xin nghỉ phép.</DialogDescription></DialogHeader>
          <LeaveForm initialData={editingRequest} onSubmit={handleSubmit} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
