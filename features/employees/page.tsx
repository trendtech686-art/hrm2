'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/router';
import { isDateSame, isDateBetween, isDateAfter, isDateBefore, isValidDate, getStartOfDay, getEndOfDay } from '@/lib/date-utils';
import { useEmployeeStore } from "./store";
import { useActiveEmployees } from "./hooks/use-all-employees";
import { useAllBranches } from "@/hooks/use-branches";
import { useDefaultPageSize } from "../settings/global-settings-store";
import { asSystemId, type SystemId } from '@/lib/id-types';
import { getColumns } from "./columns";
import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Upload, Download } from "lucide-react";
import type { Employee } from '@/lib/types/prisma-extended';
import { useFuseFilter } from "@/hooks/use-fuse-search";
import { usePageHeader } from "@/contexts/page-header-context";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMediaQuery } from "@/lib/use-media-query";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { PageFilters } from "@/components/layout/page-filters";
import { useColumnLayout } from "@/hooks/use-column-visibility";
import { MobileEmployeeCard } from "./components/mobile-employee-card";

const EmployeeImportDialog = dynamic(() => import("./components/employee-import-export-dialogs").then(m => ({ default: m.EmployeeImportDialog })), { ssr: false });
const EmployeeExportDialog = dynamic(() => import("./components/employee-import-export-dialogs").then(m => ({ default: m.EmployeeExportDialog })), { ssr: false });

export function EmployeesPage() {
  const { data: employees, remove, restore, addMultiple, update } = useEmployeeStore();
  const { data: activeEmployees } = useActiveEmployees();
  const { data: branches } = useAllBranches();
  const router = useRouter();
  const defaultPageSize = useDefaultPageSize();
  const isMobile = !useMediaQuery("(min-width: 768px)");

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);
  const [isImportV2Open, setIsImportV2Open] = React.useState(false);
  const [isExportV2Open, setIsExportV2Open] = React.useState(false);
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [dateFilter, _setDateFilter] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [departmentFilter, setDepartmentFilter] = React.useState<Set<string>>(new Set());
  const [jobTitleFilter, setJobTitleFilter] = React.useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: defaultPageSize });
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);

  const columnLayoutDefaults = React.useMemo(() => ({ visibility: {}, order: [] as string[], pinned: [] as string[] }), []);
  const [columnLayout, columnLayoutSetters, isColumnLayoutLoading] = useColumnLayout('employees', columnLayoutDefaults);
  const { visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns } = columnLayout;
  const { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns } = columnLayoutSetters;

  const handleDelete = React.useCallback((systemId: string) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const restoreRef = React.useRef(restore); restoreRef.current = restore;
  const handleRestore = React.useCallback((systemId: string) => { restoreRef.current(asSystemId(systemId)); toast.success("Đã khôi phục nhân viên"); }, []);

  const columns = React.useMemo(() => getColumns(handleDelete, handleRestore, router, branches), [handleDelete, handleRestore, router, branches]);
  const deletedCount = React.useMemo(() => employees.filter((e: { isDeleted?: boolean }) => e.isDeleted).length, [employees]);

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

  const confirmDelete = () => { if (idToDelete) { const emp = employees.find(e => e.systemId === idToDelete); remove(asSystemId(idToDelete)); toast.success("Đã xóa nhân viên vào thùng rác", { description: `Nhân viên ${emp?.fullName || ''} đã được chuyển vào thùng rác.` }); } setIsAlertOpen(false); setIdToDelete(null); };
  const confirmBulkDelete = () => { 
    const idsToDelete = Object.keys(rowSelection);
    idsToDelete.forEach(s => remove(asSystemId(s))); 
    toast.success("Đã xóa nhân viên vào thùng rác", { description: `Đã chuyển ${idsToDelete.length} nhân viên vào thùng rác.` }); 
    setRowSelection({}); 
    setIsBulkDeleteAlertOpen(false); 
  };

  const fuseOpts = React.useMemo(() => ({ keys: ["id", "fullName", "workEmail", "phone", "personalEmail", "department", "jobTitle"], threshold: 0.3, ignoreLocation: true, useExtendedSearch: false }), []);
  const searchedEmployees = useFuseFilter(activeEmployees, debouncedGlobalFilter.trim(), fuseOpts);
  const getDeptName = React.useCallback((d: unknown): string | undefined => typeof d === 'object' && d ? (d as { name?: string }).name : d as string | undefined, []);
  const getJobTitleName = React.useCallback((j: unknown): string | undefined => typeof j === 'object' && j ? (j as { name?: string }).name : j as string | undefined, []);

  const filteredData = React.useMemo(() => { let f = activeEmployees; if (branchFilter !== 'all') f = f.filter(e => e.branchSystemId === branchFilter); if (departmentFilter.size > 0) f = f.filter(e => { const n = getDeptName(e.department); return n && departmentFilter.has(n); }); if (jobTitleFilter.size > 0) f = f.filter(e => { const n = getJobTitleName(e.jobTitle); return n && jobTitleFilter.has(n); }); if (statusFilter.size > 0) f = f.filter(e => e.employmentStatus && statusFilter.has(e.employmentStatus)); if (debouncedGlobalFilter?.trim()) { const ids = new Set(searchedEmployees.map(e => e.systemId)); f = f.filter(e => ids.has(e.systemId)); } if (dateFilter && (dateFilter[0] || dateFilter[1])) { const [start, end] = dateFilter; const s = start ? getStartOfDay(start) : null, e = end ? getEndOfDay(end) : null; f = f.filter(emp => { const d = new Date(emp.hireDate); if (!isValidDate(d)) return false; if (s && !e) return isDateAfter(d, s) || isDateSame(d, s); if (!s && e) return isDateBefore(d, e) || isDateSame(d, e); if (s && e) return isDateBetween(d, s, e); return true; }); } return f; }, [activeEmployees, debouncedGlobalFilter, dateFilter, searchedEmployees, branchFilter, departmentFilter, jobTitleFilter, statusFilter, getDeptName, getJobTitleName]);

  React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); }, [debouncedGlobalFilter, branchFilter, departmentFilter, jobTitleFilter, statusFilter, dateFilter]);

  const sortedData = React.useMemo(() => { const s = [...filteredData]; if (sorting.id) s.sort((a, b) => { const av = a[sorting.id as keyof Employee], bv = b[sorting.id as keyof Employee]; if (av == null) return 1; if (bv == null) return -1; if (sorting.id === 'createdAt' || sorting.id === 'hireDate') { const at = av ? new Date(av as string | number | Date).getTime() : 0, bt = bv ? new Date(bv as string | number | Date).getTime() : 0; return sorting.desc ? bt - at : at - bt; } if (av < bv) return sorting.desc ? 1 : -1; if (av > bv) return sorting.desc ? -1 : 1; return 0; }); return s; }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);
  const allSelectedRows = React.useMemo(() => employees.filter(e => rowSelection[e.systemId]), [employees, rowSelection]);

  const departmentOpts = React.useMemo(() => { const set = new Set<string>(); activeEmployees.forEach(e => { const n = getDeptName(e.department); if (n) set.add(n); }); return Array.from(set).sort().map(d => ({ label: d, value: d })); }, [activeEmployees, getDeptName]);
  const jobTitleOpts = React.useMemo(() => { const set = new Set<string>(); activeEmployees.forEach(e => { const n = getJobTitleName(e.jobTitle); if (n) set.add(n); }); return Array.from(set).sort().map(j => ({ label: j, value: j })); }, [activeEmployees, getJobTitleName]);
  const statusOpts = React.useMemo(() => [{ label: 'Đang làm việc', value: 'Đang làm việc' }, { label: 'Đã nghỉ việc', value: 'Đã nghỉ việc' }, { label: 'Tạm nghỉ', value: 'Tạm nghỉ' }], []);

  const handleImportV2 = React.useCallback(async (data: Partial<Employee>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string) => { let inserted = 0, updated = 0, skipped = 0, failed = 0; const errors: Array<{ row: number; message: string }> = []; for (let i = 0; i < data.length; i++) { const item = data[i]; try { const existing = item.id ? activeEmployees.find(e => e.id === item.id) : null; if (existing) { if (mode === 'insert-only') { skipped++; continue; } update(existing.systemId, { ...existing, ...item } as Employee); updated++; } else { if (mode === 'update-only') { errors.push({ row: i + 2, message: `Không tìm thấy nhân viên với mã ${item.id}` }); failed++; continue; } const { systemId: _s, ...newData } = item as Partial<Employee> & { systemId?: string }; addMultiple([newData as Omit<Employee, 'systemId'>]); inserted++; } } catch (e) { errors.push({ row: i + 2, message: String(e) }); failed++; } } return { success: inserted + updated, failed, inserted, updated, skipped, errors }; }, [activeEmployees, update, addMultiple]);

  const currentUser = React.useMemo(() => ({ name: 'Admin', systemId: 'USR000001' as SystemId }), []);
  const bulkActions = [{ label: "Chuyển vào thùng rác", onSelect: () => setIsBulkDeleteAlertOpen(true) }, { label: "Đang làm việc", onSelect: (rows: Employee[]) => { rows.forEach(e => update(e.systemId, { ...e, employmentStatus: "Đang làm việc" })); toast.success("Đã cập nhật trạng thái", { description: `${rows.length} nhân viên đã chuyển sang "Đang làm việc"` }); setRowSelection({}); } }, { label: "Nghỉ việc", onSelect: (rows: Employee[]) => { rows.forEach(e => update(e.systemId, { ...e, employmentStatus: "Đã nghỉ việc" })); toast.success("Đã cập nhật trạng thái", { description: `${rows.length} nhân viên đã chuyển sang "Đã nghỉ việc"` }); setRowSelection({}); } }];
  const handleRowClick = (row: Employee) => router.push(ROUTES.HRM.EMPLOYEE_VIEW.replace(':systemId', row.systemId));

  const headerActions = React.useMemo(() => [<Button key="trash" variant="outline" size="sm" className="h-9" onClick={() => router.push('/employees/trash')}><Trash2 className="mr-2 h-4 w-4" />Thùng rác ({deletedCount})</Button>, <Button key="add" size="sm" className="h-9" onClick={() => router.push('/employees/new')}><PlusCircle className="mr-2 h-4 w-4" />Thêm nhân viên</Button>], [router, deletedCount]);
  usePageHeader({ title: 'Danh sách nhân viên', breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Nhân viên', href: '/employees', isCurrent: true }], actions: headerActions, showBackButton: false });

  return (
    <div className="flex flex-col w-full h-full">
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" className="h-9" onClick={() => setIsImportV2Open(true)}><Upload className="mr-2 h-4 w-4" />Nhập Excel</Button><Button variant="outline" size="sm" className="h-9" onClick={() => setIsExportV2Open(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onResetToDefault={resetColumnLayout} />} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm kiếm nhân viên (tên, mã, email, SĐT)..."><Select value={branchFilter} onValueChange={setBranchFilter}><SelectTrigger className="w-full sm:w-[180px] h-9"><SelectValue placeholder="Tất cả chi nhánh" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả chi nhánh</SelectItem>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent></Select>{departmentOpts.length > 0 && <DataTableFacetedFilter title="Phòng ban" options={departmentOpts} selectedValues={departmentFilter} onSelectedValuesChange={setDepartmentFilter} />}{jobTitleOpts.length > 0 && <DataTableFacetedFilter title="Chức danh" options={jobTitleOpts} selectedValues={jobTitleFilter} onSelectedValuesChange={setJobTitleFilter} />}<DataTableFacetedFilter title="Trạng thái" options={statusOpts} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} /></PageFilters>
      <div className="w-full py-4"><ResponsiveDataTable columns={columns} data={paginatedData} renderMobileCard={e => <MobileEmployeeCard employee={e} onDelete={handleDelete} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={filteredData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={() => setIsBulkDeleteAlertOpen(true)} bulkActions={bulkActions} allSelectedRows={allSelectedRows} expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} /></div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xác nhận xóa nhân viên</AlertDialogTitle><AlertDialogDescription>Nhân viên sẽ được chuyển vào thùng rác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Hủy</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmDelete}>Tiếp tục</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xác nhận xóa {Object.keys(rowSelection).length} nhân viên</AlertDialogTitle><AlertDialogDescription>Các nhân viên sẽ được chuyển vào thùng rác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Hủy</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmBulkDelete}>Tiếp tục</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <EmployeeImportDialog open={isImportV2Open} onOpenChange={setIsImportV2Open} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} requireBranch={true} defaultBranchId={branches[0]?.systemId} existingData={activeEmployees} onImport={handleImportV2} currentUser={currentUser} />
      <EmployeeExportDialog open={isExportV2Open} onOpenChange={setIsExportV2Open} allData={activeEmployees} filteredData={sortedData} currentPageData={paginatedData} selectedData={allSelectedRows} appliedFilters={{ branch: branchFilter !== 'all' ? branchFilter : undefined, department: departmentFilter.size > 0 ? Array.from(departmentFilter) : undefined, jobTitle: jobTitleFilter.size > 0 ? Array.from(jobTitleFilter) : undefined, status: statusFilter.size > 0 ? Array.from(statusFilter) : undefined, search: debouncedGlobalFilter || undefined }} currentUser={currentUser} />
    </div>
  );
}
