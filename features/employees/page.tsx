'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/router';
import { useActiveEmployees } from "./hooks/use-all-employees";
import { useEmployeeFilterOptions } from "./hooks/use-employee-filter-options";
import { useEmployees, useEmployeeMutations, useTrashMutations, useBulkEmployeeMutations, useEmployeeStats, usePrefetchEmployee, type EmployeeStats, type UpdateEmployeeInput } from "./hooks/use-employees";
import { useAllBranches } from "@/hooks/use-branches";
import { type SystemId } from '@/lib/id-types';
import { getColumns } from "./columns";
import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Upload, Download, Settings } from "lucide-react";
import type { Employee } from '@/lib/types/prisma-extended';
import { usePageHeader } from "@/contexts/page-header-context";
import { useAuth } from "@/contexts/auth-context";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMediaQuery } from "@/lib/use-media-query";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { PageFilters } from "@/components/layout/page-filters";
import { useColumnLayout } from "@/hooks/use-column-visibility";
import { MobileEmployeeCard } from "./components/mobile-employee-card";
import { StatsBar } from "@/components/shared/stats-bar";
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import { FAB } from '@/components/mobile/fab';


const EmployeeImportDialog = dynamic(() => import("./components/employee-import-export-dialogs").then(m => ({ default: m.EmployeeImportDialog })), { ssr: false });
const EmployeeExportDialog = dynamic(() => import("./components/employee-import-export-dialogs").then(m => ({ default: m.EmployeeExportDialog })), { ssr: false });

export interface EmployeesPageProps {
  initialStats?: EmployeeStats;
}

export function EmployeesPage({ initialStats }: EmployeesPageProps = {}) {
  // Permission checks
  const { can } = useAuth();
  const canCreate = can('create_employees');
  const canDelete = can('delete_employees');
  const canEdit = can('edit_employees');
  const canEditSettings = can('edit_settings');
  
  // Stats from Server Component (instant, no loading)
  const { data: stats } = useEmployeeStats(initialStats);
  
  // useTransition for non-blocking filter updates
  const [isFilterPending, startFilterTransition] = React.useTransition();

  // Server-side pagination state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState('');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [departmentFilter, setDepartmentFilter] = React.useState<Set<string>>(new Set());
  const [jobTitleFilter, setJobTitleFilter] = React.useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [pagination, setPagination] = usePaginationWithGlobalDefault();
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  
  // Debounce search with transition
  React.useEffect(() => {
    const timer = setTimeout(() => {
      startFilterTransition(() => {
        setDebouncedSearchQuery(searchQuery);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Reset page when filters change (wrapped in transition)
  React.useEffect(() => {
    startFilterTransition(() => {
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    });
  }, [branchFilter, departmentFilter, jobTitleFilter, statusFilter]);
  
  // Server-side paginated query
  const { data: employeesData, isLoading: isLoadingEmployees, isFetching: isFetchingEmployees } = useEmployees({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearchQuery || undefined,
    branchId: branchFilter !== 'all' ? branchFilter : undefined,
    department: departmentFilter.size === 1 ? Array.from(departmentFilter)[0] : undefined,
    jobTitle: jobTitleFilter.size === 1 ? Array.from(jobTitleFilter)[0] : undefined,
    status: statusFilter.size === 1 ? Array.from(statusFilter)[0] : undefined,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });
  
  const employees = React.useMemo(() => employeesData?.data ?? [], [employeesData?.data]);
  const totalRows = employeesData?.pagination?.total ?? 0;
  const pageCount = employeesData?.pagination?.totalPages ?? 1;
  
  // ✅ Lightweight filter options — replaces heavy useActiveEmployees() for dropdown filters
  const { departments: filterDepartments, jobTitles: filterJobTitles } = useEmployeeFilterOptions();
  
  const { data: branches } = useAllBranches();
  const { create, update, remove: deleteMutation } = useEmployeeMutations({
    onCreateSuccess: () => toast.success("Đã thêm nhân viên mới"),
    onUpdateSuccess: () => toast.success("Đã cập nhật nhân viên"),
    onDeleteSuccess: () => {},
    onError: (error) => toast.error("Có lỗi xảy ra: " + error.message),
  });
  const { restore: restoreMutation } = useTrashMutations();
  const { bulkDelete } = useBulkEmployeeMutations();
  const router = useRouter();
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const prefetchEmployee = usePrefetchEmployee();

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);
  const [isImportV2Open, setIsImportV2Open] = React.useState(false);
  const [isExportV2Open, setIsExportV2Open] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  // ✅ Lazy-load all employees ONLY when import/export dialog is open (not for filters!)
  const { data: allEmployeesForFilters } = useActiveEmployees({ enabled: isImportV2Open || isExportV2Open });

  const columnLayoutDefaults = React.useMemo(() => ({ visibility: {}, order: [] as string[], pinned: [] as string[] }), []);
  const [columnLayout, columnLayoutSetters, isColumnLayoutLoading] = useColumnLayout('employees', columnLayoutDefaults);
  const { visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns } = columnLayout;
  const { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns } = columnLayoutSetters;

  const handleDelete = React.useCallback((systemId: string) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleRestore = React.useCallback((systemId: string) => {
    restoreMutation.mutate(systemId, {
      onSuccess: () => toast.success("Đã khôi phục nhân viên"),
      onError: () => toast.error("Có lỗi khi khôi phục nhân viên"),
    });
  }, [restoreMutation]);

  const columns = React.useMemo(() => getColumns(handleDelete, handleRestore, router, branches), [handleDelete, handleRestore, router, branches]);
  const deletedCount = stats?.deleted ?? 0;

  const defaultVisibleColumns = React.useMemo(() => new Set(['id', 'fullName', 'workEmail', 'phone', 'branch', 'department', 'jobTitle', 'hireDate', 'employmentStatus', 'dob', 'gender', 'nationalId', 'permanentAddress', 'bankName', 'bankAccountNumber', 'baseSalary', 'contractType', 'annualLeaveBalance', 'sickLeaveBalance']), []);
  const defaultsInitialized = React.useRef(false);
  React.useEffect(() => { 
    // Wait for DB load to complete and only init if no data from DB
    if (columns.length === 0 || defaultsInitialized.current || isColumnLayoutLoading) return; 
    // Check if we have data from DB (columnVisibility has keys)
    if (Object.keys(columnVisibility).length > 0) { defaultsInitialized.current = true; return; }
    defaultsInitialized.current = true; 
    const iv: Record<string, boolean> = {}; 
    columns.forEach(c => { if (!c.id) return; iv[c.id] = c.id === 'select' || c.id === 'actions' || defaultVisibleColumns.has(c.id); }); 
    setColumnVisibility(iv); 
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); 
  }, [columns, defaultVisibleColumns, setColumnVisibility, setColumnOrder, isColumnLayoutLoading, columnVisibility]);
  const resetColumnLayout = React.useCallback(() => { const iv: Record<string, boolean> = {}; columns.forEach(c => { if (!c.id) return; iv[c.id] = c.id === 'select' || c.id === 'actions' || defaultVisibleColumns.has(c.id); }); setColumnVisibility(iv); setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); setPinnedColumns([]); toast.success('Đã khôi phục bố cục cột mặc định'); }, [columns, defaultVisibleColumns, setColumnVisibility, setColumnOrder, setPinnedColumns]);

  const confirmDelete = () => { 
    if (idToDelete) { 
      const emp = employees.find(e => e.systemId === idToDelete); 
      deleteMutation.mutate(idToDelete, {
        onSuccess: () => {
          toast.success("Đã xóa nhân viên vào thùng rác", { description: `Nhân viên ${emp?.fullName || ''} đã được chuyển vào thùng rác.` });
        },
        onError: () => {
          toast.error("Có lỗi khi xóa nhân viên");
        }
      });
    } 
    setIsAlertOpen(false); 
    setIdToDelete(null); 
  };
  const confirmBulkDelete = () => { 
    const idsToDelete = Object.keys(rowSelection);
    bulkDelete.mutate(idsToDelete, {
      onSuccess: (result) => {
        toast.success("Đã xóa nhân viên vào thùng rác", { description: `Đã chuyển ${result.data?.affected ?? idsToDelete.length} nhân viên vào thùng rác.` });
      },
      onError: () => {
        toast.error("Có lỗi khi xóa nhân viên");
      },
    });
    setRowSelection({}); 
    setIsBulkDeleteAlertOpen(false); 
  };

  // Server-side pagination: data is already filtered/sorted/paginated by API
  const allSelectedRows = React.useMemo(() => employees.filter(e => rowSelection[e.systemId]), [employees, rowSelection]);

  // ✅ Filter options from dedicated lightweight API (NOT from all employees)
  const departmentOpts = React.useMemo(() => filterDepartments.map(d => ({ label: d, value: d })), [filterDepartments]);
  const jobTitleOpts = React.useMemo(() => filterJobTitles.map(j => ({ label: j, value: j })), [filterJobTitles]);
  const statusOpts = React.useMemo(() => [{ label: 'Đang làm việc', value: 'Đang làm việc' }, { label: 'Đã nghỉ việc', value: 'Đã nghỉ việc' }, { label: 'Tạm nghỉ', value: 'Tạm nghỉ' }], []);

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('employees');
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'branch', label: 'Chi nhánh', type: 'select', options: branches.map(b => ({ value: b.systemId, label: b.name })) },
    { id: 'department', label: 'Phòng ban', type: 'multi-select', options: departmentOpts },
    { id: 'jobTitle', label: 'Chức danh', type: 'multi-select', options: jobTitleOpts },
    { id: 'status', label: 'Trạng thái', type: 'multi-select', options: statusOpts },
  ], [branches, departmentOpts, jobTitleOpts, statusOpts]);
  const panelValues = React.useMemo(() => ({
    branch: branchFilter !== 'all' ? branchFilter : null,
    department: Array.from(departmentFilter),
    jobTitle: Array.from(jobTitleFilter),
    status: Array.from(statusFilter),
  }), [branchFilter, departmentFilter, jobTitleFilter, statusFilter]);
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    startFilterTransition(() => {
      setBranchFilter((v.branch as string) || 'all');
      setDepartmentFilter(new Set((v.department as string[]) ?? []));
      setJobTitleFilter(new Set((v.jobTitle as string[]) ?? []));
      setStatusFilter(new Set((v.status as string[]) ?? []));
    });
  }, []);

  const handleImportV2 = React.useCallback(async (data: Partial<Employee>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string) => { let inserted = 0, updated = 0, skipped = 0, failed = 0; const errors: Array<{ row: number; message: string }> = []; for (let i = 0; i < data.length; i++) { const item = data[i]; try { const existing = item.id ? (allEmployeesForFilters ?? []).find(e => e.id === item.id) : null; if (existing) { if (mode === 'insert-only') { skipped++; continue; } await update.mutateAsync({ systemId: existing.systemId, ...item } as UpdateEmployeeInput); updated++; } else { if (mode === 'update-only') { errors.push({ row: i + 2, message: `Không tìm thấy nhân viên với mã ${item.id}` }); failed++; continue; } const { systemId: _s, ...newData } = item as Partial<Employee> & { systemId?: string }; await create.mutateAsync(newData as Omit<Employee, 'systemId'>); inserted++; } } catch (e) { errors.push({ row: i + 2, message: String(e) }); failed++; } } return { success: inserted + updated, failed, inserted, updated, skipped, errors }; }, [allEmployeesForFilters, update, create]);

  const currentUser = React.useMemo(() => ({ name: 'Admin', systemId: 'USR000001' as SystemId }), []);
  const bulkActions = [...(canDelete ? [{ label: "Chuyển vào thùng rác", onSelect: () => setIsBulkDeleteAlertOpen(true) }] : []), ...(canEdit ? [{ label: "Đang làm việc", onSelect: (rows: Employee[]) => { Promise.all(rows.map(e => update.mutateAsync({ systemId: e.systemId, employmentStatus: "Đang làm việc" } as UpdateEmployeeInput))).then(() => { toast.success("Đã cập nhật trạng thái", { description: `${rows.length} nhân viên đã chuyển sang "Đang làm việc"` }); setRowSelection({}); }).catch(() => toast.error("Có lỗi khi cập nhật trạng thái")); } }, { label: "Nghỉ việc", onSelect: (rows: Employee[]) => { Promise.all(rows.map(e => update.mutateAsync({ systemId: e.systemId, employmentStatus: "Đã nghỉ việc" } as UpdateEmployeeInput))).then(() => { toast.success("Đã cập nhật trạng thái", { description: `${rows.length} nhân viên đã chuyển sang "Đã nghỉ việc"` }); setRowSelection({}); }).catch(() => toast.error("Có lỗi khi cập nhật trạng thái")); } }] : [])];
  const handleRowClick = (row: Employee) => router.push(ROUTES.HRM.EMPLOYEE_VIEW.replace(':systemId', row.systemId));
  const handleRowHover = React.useCallback((row: Employee) => prefetchEmployee(row.systemId), [prefetchEmployee]);

  const headerActions = React.useMemo(() => [...(canDelete ? [<Button key="trash" variant="outline" size="sm" className="h-9" onClick={() => router.push('/employees/trash')}><Trash2 className="mr-2 h-4 w-4" />Thùng rác ({deletedCount})</Button>] : []), ...(canCreate ? [<Button key="add" size="sm" className="h-9" onClick={() => router.push('/employees/new')}><PlusCircle className="mr-2 h-4 w-4" />Thêm nhân viên</Button>] : [])], [router, deletedCount, canCreate, canDelete]);
  usePageHeader({ title: 'Danh sách nhân viên', breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Nhân viên', href: '/employees', isCurrent: true }], actions: headerActions, showBackButton: false });

  return (
    <div className="flex flex-col w-full h-full">
      {/* Stats Bar - instant display from Server Component */}
      <StatsBar
        className="mb-4"
        items={[
          { key: 'total', label: 'Tổng nhân viên', value: stats?.total ?? 0 },
          { key: 'active', label: 'Đang làm việc', value: stats?.active ?? 0 },
          { key: 'onLeave', label: 'Nghỉ phép', value: stats?.onLeave ?? 0 },
        ]}
      />

      {!isMobile && <PageToolbar leftActions={<>{canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/employees')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}{canCreate && <Button variant="outline" size="sm" className="h-9" onClick={() => setIsImportV2Open(true)}><Upload className="mr-2 h-4 w-4" />Nhập Excel</Button>}<Button variant="outline" size="sm" className="h-9" onClick={() => setIsExportV2Open(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onResetToDefault={resetColumnLayout} />} />}
      <PageFilters searchValue={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Tìm kiếm nhân viên (tên, mã, email, SĐT)..."><Select value={branchFilter} onValueChange={setBranchFilter}><SelectTrigger className="w-full sm:w-45 h-9"><SelectValue placeholder="Tất cả chi nhánh" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả chi nhánh</SelectItem>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent></Select>{departmentOpts.length > 0 && <DataTableFacetedFilter title="Phòng ban" options={departmentOpts} selectedValues={departmentFilter} onSelectedValuesChange={setDepartmentFilter} />}{jobTitleOpts.length > 0 && <DataTableFacetedFilter title="Chức danh" options={jobTitleOpts} selectedValues={jobTitleFilter} onSelectedValuesChange={setJobTitleFilter} />}<DataTableFacetedFilter title="Trạng thái" options={statusOpts} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} /><AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} /></PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />

      <div className={`w-full py-4${isFilterPending || (isFetchingEmployees && !isLoadingEmployees) ? ' opacity-70 transition-opacity duration-200' : ''}`}><ResponsiveDataTable columns={columns} data={employees} renderMobileCard={e => <MobileEmployeeCard employee={e} onDelete={handleDelete} canEdit={canEdit} canDelete={canDelete} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={() => setIsBulkDeleteAlertOpen(true)} bulkActions={bulkActions} allSelectedRows={allSelectedRows} expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} onRowHover={handleRowHover} isLoading={isLoadingEmployees} mobileInfiniteScroll /></div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xác nhận xóa nhân viên</AlertDialogTitle><AlertDialogDescription>Nhân viên sẽ được chuyển vào thùng rác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Hủy</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmDelete}>Tiếp tục</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xác nhận xóa {Object.keys(rowSelection).length} nhân viên</AlertDialogTitle><AlertDialogDescription>Các nhân viên sẽ được chuyển vào thùng rác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Hủy</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmBulkDelete}>Tiếp tục</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <EmployeeImportDialog open={isImportV2Open} onOpenChange={setIsImportV2Open} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} requireBranch={true} defaultBranchId={branches[0]?.systemId} existingData={allEmployeesForFilters ?? []} onImport={handleImportV2} currentUser={currentUser} />
      <EmployeeExportDialog open={isExportV2Open} onOpenChange={setIsExportV2Open} allData={allEmployeesForFilters ?? []} filteredData={employees} currentPageData={employees} selectedData={allSelectedRows} appliedFilters={{ branch: branchFilter !== 'all' ? branchFilter : undefined, department: departmentFilter.size > 0 ? Array.from(departmentFilter) : undefined, jobTitle: jobTitleFilter.size > 0 ? Array.from(jobTitleFilter) : undefined, status: statusFilter.size > 0 ? Array.from(statusFilter) : undefined, search: debouncedSearchQuery || undefined }} currentUser={currentUser} />
      {isMobile && canCreate && <FAB onClick={() => router.push('/employees/new')} />}
    </div>
  );
}
