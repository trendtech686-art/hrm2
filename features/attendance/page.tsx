'use client';
/**
 * Attendance Page - Thin Page Pattern
 * Target: < 300 lines
 * Logic extracted to: hooks/use-attendance-page-handlers.ts
 */
import * as React from 'react';
import dynamic from 'next/dynamic';
import { formatDateCustom, subtractMonths, addMonths, getDayOfWeek } from '@/lib/date-utils';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/router';
import { useAllEmployees } from '@/features/employees/hooks/use-all-employees';
import { useAllDepartments } from '@/features/settings/departments/hooks/use-all-departments';
import { usePageHeader } from '@/contexts/page-header-context';
import { useEmployeeSettings, DEFAULT_EMPLOYEE_SETTINGS } from '@/features/settings/employees/hooks/use-employee-settings';
import { useAttendanceMutations, attendanceKeys } from './hooks/use-attendance';
import { useAttendancePage } from './hooks/use-attendance-page';
import { useQueryClient } from '@tanstack/react-query';
import { generateEmptyAttendance } from './data';
import { getColumns } from './columns';
import { recalculateSummary } from './utils';
import type { AttendanceDataRow, DailyRecord, AnyAttendanceDataRow } from './types';
import type { SystemId } from '@/lib/id-types';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { PullToRefresh } from '@/components/shared/pull-to-refresh';
import { Card, CardContent } from '@/components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { MobileCard } from '@/components/mobile/mobile-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search, Upload, Download, Printer, Lock, LockOpen, Settings, Clock, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/contexts/breakpoint-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AttendanceEditDialog } from './components/attendance-edit-dialog';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer';
import { StatisticsDashboard } from './components/statistics-dashboard';
import { toast } from 'sonner';
import { usePrint } from '@/lib/use-print';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { convertAttendanceSheetForPrint, mapAttendanceSheetToPrintData, mapAttendanceSheetLineItems, createStoreSettings } from '@/lib/print/attendance-print-helper';
import type { PenaltyPreviewItem } from './penalty-sync-service';
import type { Penalty } from '../settings/penalties/types';
import { useAttendanceLocks } from './hooks/use-attendance-locks';
import { useAuth } from "@/contexts/auth-context";
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import { useColumnVisibility, useColumnOrder, usePinnedColumns } from '@/hooks/use-column-visibility';

// Lazy-load heavy dialogs (only rendered when opened)
const AttendanceImportDialog = dynamic(() => import('./components/attendance-import-dialog').then(m => ({ default: m.AttendanceImportDialog })), { ssr: false });
const BulkEditDialog = dynamic(() => import('./components/bulk-edit-dialog').then(m => ({ default: m.BulkEditDialog })), { ssr: false });
const PenaltyConfirmDialog = dynamic(() => import('./components/penalty-confirm-dialog').then(m => ({ default: m.PenaltyConfirmDialog })), { ssr: false });

// MonthYearPicker component
function MonthYearPicker({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
  const displayText = formatDateCustom(value, 'MM/yyyy');
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="w-10" onClick={() => { const prev = subtractMonths(value, 1); if (prev) onChange(prev); }}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="font-semibold text-sm w-24 text-center">{displayText}</div>
      <Button variant="outline" size="icon" className="w-10" onClick={() => { const next = addMonths(value, 1); if (next) onChange(next); }}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function AttendancePage() {
  // Permission checks
  const { can } = useAuth();
  const canEditSettings = can('edit_settings');
  const { isMobile } = useBreakpoint();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: employees } = useAllEmployees();
  const { data: departments } = useAllDepartments();
  const { data: rawSettings } = useEmployeeSettings();
  const settings = rawSettings ?? DEFAULT_EMPLOYEE_SETTINGS;
  // ⚡ OPTIMIZED: storeInfo lazy loaded in print handler
  const { print } = usePrint();

  // Core state - hydration-safe initialization
  const [currentDate, setCurrentDate] = React.useState<Date | undefined>(undefined);
  const currentMonthKey = formatDateCustom(currentDate ?? new Date(), 'yyyy-MM');
  
  // Initialize on client to avoid hydration mismatch
  React.useEffect(() => {
    setCurrentDate(new Date());
  }, []);
  
  // Server-side: fetch paginated attendance data
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('all');
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = usePaginationWithGlobalDefault();
  
  // Debounce search for server-side filtering
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilter);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter, setPagination]);

  const { data: attendanceData, isFetching } = useAttendancePage(currentMonthKey, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    department: departmentFilter !== 'all' ? departmentFilter : undefined,
  });
  
  // Extract data and pagination info from server response
  const paginatedData = React.useMemo(() => attendanceData?.data ?? [], [attendanceData?.data]);
  const totalRows = attendanceData?.pagination?.total ?? 0;
  const pageCount = attendanceData?.pagination?.totalPages ?? 1;
  
  // ✅ Use React Query hook for locked months (syncs via database)
  const { lockedMonths, toggleLock } = useAttendanceLocks();
  const isLocked = !!lockedMonths[currentMonthKey];
  
  // Mutations
  const { update: updateAttendance, bulkUpdate: bulkUpdateAttendance } = useAttendanceMutations({
    onSuccess: () => {
      toast.success('Đã lưu chấm công');
    },
    onError: (error) => {
      toast.error('Lỗi khi lưu chấm công', { description: error.message });
    },
  });

  // Filter state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('attendance', {});
  const [columnOrder, setColumnOrder] = useColumnOrder('attendance');
  const [pinnedColumns, setPinnedColumns] = usePinnedColumns('attendance');

  // Edit dialog state
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingRecordInfo, setEditingRecordInfo] = React.useState<{ employeeSystemId: SystemId; day: number; record: DailyRecord } | null>(null);

  // Import/Export state
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);

  // Bulk edit state
  const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] = React.useState(false);
  const [cellSelection, setCellSelection] = React.useState<Record<string, boolean>>({});
  const [isSelectionMode, setIsSelectionMode] = React.useState(false);

  // Penalty state
  const [isPenaltyConfirmOpen, setIsPenaltyConfirmOpen] = React.useState(false);
  const [pendingPenalties, setPendingPenalties] = React.useState<PenaltyPreviewItem[]>([]);

  // Invalidate attendance query after mutations
  const invalidateAttendanceQuery = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: attendanceKeys.page(currentMonthKey, {}) });
  }, [queryClient, currentMonthKey]);

  // Toggle lock handler - uses database-backed hook
  const handleToggleLock = React.useCallback(async () => {
    const monthLabel = formatDateCustom(currentDate, 'MM/yyyy');
    const wasLocked = isLocked;
    try {
      await toggleLock(currentMonthKey);
      toast.success(wasLocked ? 'Đã mở khóa chấm công' : 'Đã khóa chấm công', { description: `Tháng ${monthLabel}` });
    } catch (error) {
      toast.error('Lỗi khi thay đổi trạng thái khóa', { description: String(error) });
    }
  }, [currentDate, currentMonthKey, isLocked, toggleLock]);

  // Cell selection toggle
  const toggleCellSelection = React.useCallback((employeeSystemId: SystemId, day: number) => {
    if (!isSelectionMode || isLocked) return;
    const key = `${employeeSystemId}-${day}`;
    setCellSelection(prev => { const n = { ...prev }; if (n[key]) delete n[key]; else n[key] = true; return n; });
  }, [isSelectionMode, isLocked]);

  // Quick fill handler
  const handleQuickFill = React.useCallback((employeeSystemId: SystemId, day: number) => {
    if (isLocked) return;
    const defaultRecord: DailyRecord = { status: 'present', checkIn: settings.workStartTime, checkOut: settings.workEndTime };
    
    // Optimistically update local cache
    queryClient.setQueryData(
      attendanceKeys.page(currentMonthKey, {}),
      (old: { data: AttendanceDataRow[]; pagination: { page: number; limit: number; total: number; totalPages: number } } | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(row => {
            if (row.employeeSystemId === employeeSystemId) {
              const newRow = { ...row } as AnyAttendanceDataRow;
              newRow[`day_${day}`] = defaultRecord;
              return { ...newRow, ...recalculateSummary(newRow, (currentDate ?? new Date()).getFullYear(), (currentDate ?? new Date()).getMonth() + 1, settings) } as AttendanceDataRow;
            }
            return row;
          }),
        };
      }
    );
    
    // Save to database
    updateAttendance.mutate({
      systemId: employeeSystemId,
      data: {
        action: 'save',
        monthKey: currentMonthKey,
        employeeSystemId,
        dayKey: `day_${day}`,
        record: defaultRecord,
      },
    }, {
      onSettled: () => invalidateAttendanceQuery(),
    });
    
    toast('Điền nhanh', { description: 'Đã áp dụng giờ làm việc mặc định' });
  }, [currentDate, settings, isLocked, currentMonthKey, updateAttendance, queryClient, invalidateAttendanceQuery]);

  // Edit record handler
  const handleEditRecord = React.useCallback((employeeSystemId: SystemId, day: number) => {
    if (isLocked) return;
    if (isSelectionMode) { toggleCellSelection(employeeSystemId, day); return; }
    const emp = paginatedData.find(e => e.employeeSystemId === employeeSystemId);
    if (emp) { setEditingRecordInfo({ employeeSystemId, day, record: emp[`day_${day}`] as DailyRecord }); setIsEditModalOpen(true); }
  }, [paginatedData, isLocked, isSelectionMode, toggleCellSelection]);

  // Save record handler
  const handleSaveRecord = React.useCallback((updatedRecord: DailyRecord) => {
    if (!editingRecordInfo) return;
    
    // Optimistically update local cache
    queryClient.setQueryData(
      attendanceKeys.page(currentMonthKey, {}),
      (old: { data: AttendanceDataRow[]; pagination: { page: number; limit: number; total: number; totalPages: number } } | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(row => {
            if (row.employeeSystemId === editingRecordInfo.employeeSystemId) {
              const newRow = { ...row } as AnyAttendanceDataRow;
              newRow[`day_${editingRecordInfo.day}`] = updatedRecord;
              return { ...newRow, ...recalculateSummary(newRow, (currentDate ?? new Date()).getFullYear(), (currentDate ?? new Date()).getMonth() + 1, settings) } as AttendanceDataRow;
            }
            return row;
          }),
        };
      }
    );
    
    // Save to database
    updateAttendance.mutate({
      systemId: editingRecordInfo.employeeSystemId,
      data: {
        action: 'save',
        monthKey: currentMonthKey,
        employeeSystemId: editingRecordInfo.employeeSystemId,
        dayKey: `day_${editingRecordInfo.day}`,
        record: updatedRecord,
      },
    }, {
      onSettled: () => invalidateAttendanceQuery(),
    });
    
    setIsEditModalOpen(false);
    setEditingRecordInfo(null);
    toast.success('Cập nhật thành công', { description: `Đã lưu chấm công ngày ${editingRecordInfo.day}` });
  }, [editingRecordInfo, currentDate, settings, currentMonthKey, updateAttendance, queryClient, invalidateAttendanceQuery]);

  // Bulk save handler
  const handleBulkSave = React.useCallback((updates: Array<{ employeeSystemId: SystemId; day: number; record: DailyRecord }>) => {
    // Optimistically update local cache
    queryClient.setQueryData(
      attendanceKeys.page(currentMonthKey, {}),
      (old: { data: AttendanceDataRow[]; pagination: { page: number; limit: number; total: number; totalPages: number } } | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(row => {
            const empUpdates = updates.filter(u => u.employeeSystemId === row.employeeSystemId);
            if (empUpdates.length > 0) {
              const newRow = { ...row } as AnyAttendanceDataRow;
              empUpdates.forEach(u => { newRow[`day_${u.day}`] = u.record; });
              return { ...newRow, ...recalculateSummary(newRow, (currentDate ?? new Date()).getFullYear(), (currentDate ?? new Date()).getMonth() + 1, settings) } as AttendanceDataRow;
            }
            return row;
          }),
        };
      }
    );
    
    // Save to database
    const records = updates.map(u => ({
      systemId: u.employeeSystemId,
      data: {
        action: 'save' as const,
        monthKey: currentMonthKey,
        employeeSystemId: u.employeeSystemId,
        dayKey: `day_${u.day}`,
        record: u.record,
      },
    }));
    bulkUpdateAttendance.mutate(records, {
      onSettled: () => invalidateAttendanceQuery(),
    });
    
    setCellSelection({});
    setIsSelectionMode(false);
    toast.success('Cập nhật thành công', { description: `Đã chỉnh sửa ${updates.length} ô` });
  }, [currentDate, settings, currentMonthKey, bulkUpdateAttendance, queryClient, invalidateAttendanceQuery]);

  // Import confirm handler
  const handleConfirmImport = React.useCallback(async (importedData: Record<SystemId, { day: number; checkIn?: string; morningCheckOut?: string; afternoonCheckIn?: string; checkOut?: string; overtimeCheckIn?: string; overtimeCheckOut?: string }[]>, date: Date) => {
    const year = date.getFullYear(), month = date.getMonth() + 1;
    const baseData = generateEmptyAttendance(employees, year, month, settings);
    const updatedData = baseData.map(empRow => {
      const empUpdates = importedData[empRow.employeeSystemId];
      if (empUpdates) {
        const mutableRow = { ...empRow } as AnyAttendanceDataRow;
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
          const workDate = new Date(year, month - 1, d);
          const dayOfWeek = getDayOfWeek(workDate);
          mutableRow[`day_${d}`] = { status: dayOfWeek !== null && settings.workingDays.includes(dayOfWeek) ? 'absent' : 'weekend' };
        }
        empUpdates.forEach(u => { mutableRow[`day_${u.day}`] = { status: u.checkIn && u.checkOut ? 'present' : 'absent', checkIn: u.checkIn, morningCheckOut: u.morningCheckOut, afternoonCheckIn: u.afternoonCheckIn, checkOut: u.checkOut, overtimeCheckIn: u.overtimeCheckIn, overtimeCheckOut: u.overtimeCheckOut }; });
        return { ...mutableRow, ...recalculateSummary(mutableRow, year, month, settings) } as AttendanceDataRow;
      }
      return empRow;
    });
    
    // Save entire month to database
    const monthKey = formatDateCustom(date, 'yyyy-MM');
    const records = updatedData.flatMap(empRow => {
      const updates: Array<{ systemId: SystemId; data: Record<string, unknown> }> = [];
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dayRecord = empRow[`day_${d}`] as DailyRecord;
        if (dayRecord && dayRecord.status !== 'weekend' && dayRecord.status !== 'future' && dayRecord.status !== 'empty') {
          updates.push({
            systemId: empRow.employeeSystemId,
            data: {
              action: 'save',
              monthKey,
              employeeSystemId: empRow.employeeSystemId,
              dayKey: `day_${d}`,
              record: dayRecord,
            },
          });
        }
      }
      return updates;
    });
    
    setCurrentDate(date);
    
    // Invalidate query to refresh data from server after import and save data
    const newMonthKey = formatDateCustom(date, 'yyyy-MM');
    if (records.length > 0) {
      bulkUpdateAttendance.mutate(records);
    }
    queryClient.invalidateQueries({ queryKey: attendanceKeys.page(newMonthKey, {}) });
    
    // Lazy-load penalty service (only needed after import)
    const { loadExistingPenalties, previewAttendancePenalties } = await import('./penalty-sync-service');
    await loadExistingPenalties();
    const penalties = previewAttendancePenalties(updatedData, year, month);
    if (penalties.length > 0) { setPendingPenalties(penalties); setIsPenaltyConfirmOpen(true); }
    toast.success('Nhập thành công', { description: `Đã cập nhật chấm công cho tháng ${formatDateCustom(date, 'MM/yyyy')}` });
  }, [employees, settings, bulkUpdateAttendance, queryClient]);

  const handleConfirmPenalties = React.useCallback(async (selectedPenalties: Omit<Penalty, 'systemId'>[]) => {
    const { confirmCreatePenalties } = await import('./penalty-sync-service');
    const created = await confirmCreatePenalties(selectedPenalties as PenaltyPreviewItem[]);
    toast.success('Tạo phiếu phạt thành công', { description: `Đã tạo ${created} phiếu phạt` });
    setPendingPenalties([]);
  }, []);

  const handleSkipPenalties = React.useCallback(() => { toast.info('Đã bỏ qua tạo phiếu phạt'); setPendingPenalties([]); }, []);

  // Selected cells array
  const selectedCellsArray = React.useMemo(() => Object.keys(cellSelection).map(key => { const [sId, dayStr] = key.split('-'); const emp = paginatedData.find(e => e.employeeSystemId === sId); return { employeeSystemId: sId as SystemId, employeeCode: emp?.employeeId ?? '', employeeName: emp?.fullName ?? '', day: parseInt(dayStr, 10) }; }), [cellSelection, paginatedData]);

  // Server-side filtered/sorted data from API (search and department handled by API)
  const serverData = React.useMemo(() => {
    // Sort client-side for now (API doesn't support sorting yet)
    if (!paginatedData.length) return [];
    const s = [...paginatedData];
    if (sorting.id) {
      s.sort((a, b) => {
        const aV = (a as Record<string, unknown>)[sorting.id] as string | number | null | undefined;
        const bV = (b as Record<string, unknown>)[sorting.id] as string | number | null | undefined;
        if (aV == null && bV == null) return 0;
        if (aV == null) return 1;
        if (bV == null) return -1;
        if (aV < bV) return sorting.desc ? 1 : -1;
        if (aV > bV) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return s;
  }, [paginatedData, sorting]);

  // Print & Export handlers (must be after sortedData)
  const handlePrint = React.useCallback(async () => {
    if (!serverData?.length) return;
    const { storeInfo } = await fetchPrintData();
    const storeSettings = createStoreSettings(storeInfo);
    const sheetForPrint = convertAttendanceSheetForPrint(currentMonthKey, serverData as Parameters<typeof convertAttendanceSheetForPrint>[1], { isLocked, departmentName: departmentFilter !== 'all' ? departments.find(d => d.name === departmentFilter)?.name : undefined });
    print('attendance', { data: mapAttendanceSheetToPrintData(sheetForPrint, storeSettings), lineItems: mapAttendanceSheetLineItems(sheetForPrint.employees, currentMonthKey) });
  }, [serverData, currentMonthKey, departmentFilter, departments, isLocked, print]);

  const handleExport = React.useCallback(async () => {
    const XLSX = await import('xlsx');
    const effectiveDate = currentDate ?? new Date();
    const year = effectiveDate.getFullYear(), month = effectiveDate.getMonth() + 1, daysInMonth = new Date(year, month, 0).getDate();
    const headers = ['Mã NV', 'Họ tên', 'Phòng ban'];
    for (let d = 1; d <= daysInMonth; d++) headers.push(`${d}`);
    headers.push('Ngày công', 'Nghỉ phép', 'Vắng');
    const rows = serverData.map(row => {
      const r: (string | number)[] = [row.employeeId, row.fullName, row.department ?? ''];
      for (let d = 1; d <= daysInMonth; d++) { const rec = row[`day_${d}` as keyof AttendanceDataRow] as DailyRecord | undefined; r.push(!rec ? '' : rec.status === 'present' ? 'X' : rec.status === 'leave' ? 'P' : rec.status === 'absent' ? 'V' : rec.status === 'weekend' ? '-' : rec.status === 'holiday' ? 'L' : ''); }
      r.push(row.workDays ?? 0, row.leaveDays ?? 0, row.absentDays ?? 0);
      return r;
    });
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Chấm công T${month}`);
    XLSX.writeFile(wb, `cham-cong-${formatDateCustom(effectiveDate, 'yyyy-MM')}.xlsx`);
    toast.success('Xuất Excel thành công', { description: `Đã xuất ${serverData.length} nhân viên` });
  }, [serverData, currentDate]);

  // Page actions (after handlers)
  usePageHeader(React.useMemo(() => ({
    title: 'Chấm công',
    breadcrumb: [
      { label: 'Nhân sự', href: ROUTES.HRM.EMPLOYEES, isCurrent: false },
      { label: 'Chấm công', href: ROUTES.HRM.ATTENDANCE, isCurrent: true }
    ],
    // ⚠️ Tạm bỏ actions khỏi header để tránh vòng lặp setState khi actions thay đổi liên tục
  }), []));

  // Columns - use refs for cellSelection/isSelectionMode to keep column defs stable
  const effectiveDate = currentDate ?? new Date();
  const year = effectiveDate.getFullYear();
  const month = effectiveDate.getMonth() + 1;
  const cellSelectionRef = React.useRef(cellSelection);
  cellSelectionRef.current = cellSelection;
  const isSelectionModeRef = React.useRef(isSelectionMode);
  isSelectionModeRef.current = isSelectionMode;
  const columns = React.useMemo(() => getColumns(year, month, handleEditRecord, settings, isLocked, isSelectionModeRef, cellSelectionRef, handleQuickFill), [year, month, handleEditRecord, settings, isLocked, handleQuickFill]);

  // Init column visibility - only run once when columns are first available
  const initRef = React.useRef(false);
  React.useEffect(() => { 
    if (initRef.current) return; 
    // Only initialize when we have valid columns based on year/month
    const daysInMonth = new Date(year, month, 0).getDate();
    if (daysInMonth <= 0) return;
    
    const v: Record<string, boolean> = {}; 
    columns.forEach(c => { if (c.id) v[c.id] = true; }); 
    setColumnVisibility(v); 
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); 
    setPinnedColumns(['select', 'fullName']); 
    initRef.current = true; 
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only run once on initial mount
  }, [year, month]);

  // Server-side pagination: data already sorted/filtered by API
  const allSelectedRows = React.useMemo(() => paginatedData.filter(a => rowSelection[a.systemId]), [paginatedData, rowSelection]);

  // Mobile employee card renderer
  const renderMobileEmployeeCard = React.useCallback((row: AttendanceDataRow) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return (
      <MobileCard key={row.employeeSystemId} inert>
        <div className="flex items-center justify-between mb-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{row.fullName}</p>
            <p className="text-xs text-muted-foreground truncate">{row.department ?? 'Chưa xếp phòng'}</p>
          </div>
          <span className="text-xs text-muted-foreground font-mono shrink-0 ml-2">{row.employeeId}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="text-center rounded-lg bg-green-50 dark:bg-green-950/30 p-2">
            <p className="text-lg font-semibold text-green-600">{row.workDays}</p>
            <p className="text-xs text-muted-foreground">Công</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 dark:bg-blue-950/30 p-2">
            <p className="text-lg font-semibold text-blue-600">{row.leaveDays}</p>
            <p className="text-xs text-muted-foreground">Phép</p>
          </div>
          <div className="text-center rounded-lg bg-red-50 dark:bg-red-950/30 p-2">
            <p className="text-lg font-semibold text-red-600">{row.absentDays}</p>
            <p className="text-xs text-muted-foreground">Vắng</p>
          </div>
          <div className="text-center rounded-lg bg-orange-50 dark:bg-orange-950/30 p-2">
            <p className="text-lg font-semibold text-orange-600">{row.lateArrivals}</p>
            <p className="text-xs text-muted-foreground">Trễ</p>
          </div>
        </div>
        {/* Mini day grid - compact 7-col calendar view */}
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const rec = row[`day_${day}` as keyof AttendanceDataRow] as DailyRecord | undefined;
            const status = rec?.status;
            const bg = status === 'present' ? 'bg-green-500' : status === 'leave' ? 'bg-blue-400' : status === 'half-day' ? 'bg-yellow-400' : status === 'absent' ? 'bg-red-400' : status === 'weekend' ? 'bg-muted' : status === 'holiday' ? 'bg-purple-300' : 'bg-muted/50';
            return (
              <button
                key={day}
                type="button"
                className={`h-6 rounded text-xs font-medium ${bg} ${status === 'weekend' || status === 'holiday' ? 'text-muted-foreground' : 'text-white'} touch-manipulation`}
                onClick={() => handleEditRecord(row.employeeSystemId, day)}
              >
                {day}
              </button>
            );
          })}
        </div>
        {row.otHours > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-purple-600">
            <Clock className="h-3 w-3" />
            <span>OT: {row.otHours}h</span>
          </div>
        )}
      </MobileCard>
    );
  }, [year, month, handleEditRecord]);

  const handlePullRefresh = React.useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
  }, [queryClient]);

  return (
    <PullToRefresh onRefresh={handlePullRefresh} disabled={!isMobile}>
    <div className="flex flex-col h-full space-y-4">
      <StatisticsDashboard data={serverData} currentDate={effectiveDate} />

      {/* Toolbar */}
      <Card className={cn(mobileBleedCardClass, 'shrink-0')}>
        <CardContent className="p-4">
          {isMobile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <MonthYearPicker value={effectiveDate} onChange={setCurrentDate} />
                <div className="flex items-center gap-1">
                  <Button variant={isLocked ? 'default' : 'outline'} size="icon" className="w-9" onClick={handleToggleLock}>
                    {isLocked ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="w-9"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handlePrint}><Printer className="mr-2 h-4 w-4" />In</DropdownMenuItem>
                      <DropdownMenuItem disabled={isLocked} onClick={() => setIsImportDialogOpen(true)}><Upload className="mr-2 h-4 w-4" />Nhập file</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExport}><Download className="mr-2 h-4 w-4" />Xuất file</DropdownMenuItem>
                      {canEditSettings && <DropdownMenuItem onClick={() => router.push('/settings/employees')}><Settings className="mr-2 h-4 w-4" />Cài đặt</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Tất cả phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả phòng ban</SelectItem>
                    {departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm NV..." value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} className="pl-8" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <MonthYearPicker value={effectiveDate} onChange={setCurrentDate} />
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full sm:w-45">
                    <SelectValue placeholder="Tất cả phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả phòng ban</SelectItem>
                    {departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm nhân viên..." value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} className="w-50 pl-8" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                {canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/employees')}><Settings className="mr-2 h-4 w-4" />Cài đặt</Button>}
                <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" />In</Button>
                <Button variant="outline" size="sm" disabled={isLocked} onClick={() => setIsImportDialogOpen(true)}><Upload className="mr-2 h-4 w-4" />Nhập file</Button>
                <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Xuất file</Button>
                <Button variant={isLocked ? 'default' : 'outline'} size="sm" onClick={handleToggleLock}>{isLocked ? <LockOpen className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}{isLocked ? 'Mở khóa' : 'Khóa'}</Button>
                <DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data display */}
      <div className={cn((isFetching) && 'opacity-60 pointer-events-none transition-opacity')}>
        <ResponsiveDataTable columns={columns} data={serverData} rowCount={totalRows} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowSelection={rowSelection} setRowSelection={setRowSelection} sorting={sorting} setSorting={setSorting} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} className="grow" allSelectedRows={allSelectedRows} expanded={{}} setExpanded={() => {}} renderMobileCard={renderMobileEmployeeCard} mobileInfiniteScroll isLoading={isFetching} />
      </div>

      <AttendanceEditDialog isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} recordData={editingRecordInfo} onSave={handleSaveRecord} monthDate={effectiveDate} isSaving={updateAttendance.isPending} />
      <AttendanceImportDialog isOpen={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} onConfirmImport={handleConfirmImport} employees={employees} />
      <BulkEditDialog isOpen={isBulkEditDialogOpen} onOpenChange={setIsBulkEditDialogOpen} selectedCells={selectedCellsArray} onSave={handleBulkSave} />
      <PenaltyConfirmDialog isOpen={isPenaltyConfirmOpen} onOpenChange={setIsPenaltyConfirmOpen} penalties={pendingPenalties} onConfirm={handleConfirmPenalties} onSkip={handleSkipPenalties} />
    </div>
    </PullToRefresh>
  );
}
