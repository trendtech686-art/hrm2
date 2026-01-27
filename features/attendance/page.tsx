'use client';
/**
 * Attendance Page - Thin Page Pattern
 * Target: < 300 lines
 * Logic extracted to: hooks/use-attendance-page-handlers.ts
 */
import * as React from 'react';
import { formatDateCustom, subtractMonths, addMonths, getDayOfWeek } from '@/lib/date-utils';
import { ROUTES } from '@/lib/router';
import { useAllEmployees } from '@/features/employees/hooks/use-all-employees';
import { useAllDepartments } from '@/features/settings/departments/hooks/use-all-departments';
import { usePageHeader } from '@/contexts/page-header-context';
import { useEmployeeSettings, DEFAULT_EMPLOYEE_SETTINGS } from '@/features/settings/employees/hooks/use-employee-settings';
import { useAttendanceByMonth, useAttendanceMutations } from './hooks/use-attendance';
import { generateEmptyAttendance } from './data';
import { getColumns } from './columns';
import { recalculateSummary } from './utils';
import type { AttendanceDataRow, DailyRecord, AnyAttendanceDataRow } from './types';
import type { SystemId } from '@/lib/id-types';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useFuseFilter } from '@/hooks/use-fuse-search';
import { AttendanceEditDialog } from './components/attendance-edit-dialog';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer';
import { AttendanceImportDialog } from './components/attendance-import-dialog';
import { BulkEditDialog } from './components/bulk-edit-dialog';
import { StatisticsDashboard } from './components/statistics-dashboard';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';
import { useAllLeaves } from '@/features/leaves/hooks/use-all-leaves';
import { leaveAttendanceSync } from '@/features/leaves/leave-sync-service';
import { usePrint } from '@/lib/use-print';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
import { convertAttendanceSheetForPrint, mapAttendanceSheetToPrintData, mapAttendanceSheetLineItems, createStoreSettings } from '@/lib/print/attendance-print-helper';
import { previewAttendancePenalties, confirmCreatePenalties, type PenaltyPreviewItem } from './penalty-sync-service';
import { PenaltyConfirmDialog } from './components/penalty-confirm-dialog';

// MonthYearPicker component
function MonthYearPicker({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
  const displayText = formatDateCustom(value, 'MM/yyyy');
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="h-9 w-10" onClick={() => { const prev = subtractMonths(value, 1); if (prev) onChange(prev); }}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="font-semibold text-body-sm w-24 text-center">{displayText}</div>
      <Button variant="outline" size="icon" className="h-9 w-10" onClick={() => { const next = addMonths(value, 1); if (next) onChange(next); }}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function AttendancePage() {
  const { data: employees } = useAllEmployees();
  const { data: departments } = useAllDepartments();
  const { data: rawSettings } = useEmployeeSettings();
  const settings = rawSettings ?? DEFAULT_EMPLOYEE_SETTINGS;
  const { data: leaveRequests } = useAllLeaves();
  const { info: storeInfo } = useStoreInfoData();
  const { print } = usePrint();

  // Core state
  const [currentDate, setCurrentDate] = React.useState(() => new Date());
  const currentMonthKey = formatDateCustom(currentDate, 'yyyy-MM');
  
  // Fetch attendance data from database
  const { data: dbAttendanceData } = useAttendanceByMonth(currentMonthKey);
  
  // Local state for UI
  const [attendanceData, setAttendanceData] = React.useState<AttendanceDataRow[]>([]);
  const [lockedMonths, setLockedMonths] = React.useState<Record<string, boolean>>({});
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
  const [departmentFilter, setDepartmentFilter] = React.useState('all');
  const [globalFilter, setGlobalFilter] = React.useState('');
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

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

  // Use ref for leaveRequests to avoid effect re-runs
  const leaveRequestsRef = React.useRef(leaveRequests);
  leaveRequestsRef.current = leaveRequests;

  // Replay approved leaves - use ref to avoid dependency on leaveRequests
  const replayApprovedLeavesForMonth = React.useCallback((monthKey: string) => {
    const currentLeaves = leaveRequestsRef.current;
    if (!currentLeaves?.length) return;
    const [yearStr, monthStr] = monthKey.split('-');
    const year = Number(yearStr), month = Number(monthStr);
    if (!year || !month) return;
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);
    currentLeaves.forEach((leave) => {
      if (leave.status !== 'Đã duyệt') return;
      const start = new Date(leave.startDate), end = new Date(leave.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= monthEnd && end >= monthStart) {
        leaveAttendanceSync.apply(leave);
      }
    });
  }, []);

  // Track if data has been loaded for current month to prevent re-runs
  const loadedMonthRef = React.useRef<string | null>(null);

  // Load attendance data - stabilized effect
  React.useEffect(() => {
    // Skip if we already loaded this month's data
    if (loadedMonthRef.current === currentMonthKey) return;
    // Skip if employees not loaded yet
    if (!employees?.length) return;
    
    // If no data from DB, generate empty structure
    if (!dbAttendanceData || dbAttendanceData.length === 0) {
      const seededData = generateEmptyAttendance(employees, currentDate.getFullYear(), currentDate.getMonth() + 1, settings);
      setAttendanceData(seededData);
      replayApprovedLeavesForMonth(currentMonthKey);
      loadedMonthRef.current = currentMonthKey;
    } else {
      setAttendanceData(dbAttendanceData);
      loadedMonthRef.current = currentMonthKey;
    }
  }, [employees, currentDate, settings, currentMonthKey, dbAttendanceData, replayApprovedLeavesForMonth]);

  // Toggle lock handler
  const _handleToggleLock = React.useCallback(() => {
    const monthLabel = formatDateCustom(currentDate, 'MM/yyyy');
    setLockedMonths(prev => {
      const newLocked = { ...prev };
      if (newLocked[currentMonthKey]) {
        delete newLocked[currentMonthKey];
      } else {
        newLocked[currentMonthKey] = true;
      }
      return newLocked;
    });
    toast.success(isLocked ? 'Đã mở khóa chấm công' : 'Đã khóa chấm công', { description: `Tháng ${monthLabel}` });
  }, [currentDate, currentMonthKey, isLocked]);

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
    const updatedData = attendanceData.map(row => {
      if (row.employeeSystemId === employeeSystemId) {
        const newRow = { ...row } as AnyAttendanceDataRow;
        newRow[`day_${day}`] = defaultRecord;
        return { ...newRow, ...recalculateSummary(newRow, currentDate.getFullYear(), currentDate.getMonth() + 1, settings) } as AttendanceDataRow;
      }
      return row;
    });
    setAttendanceData(updatedData);
    
    // Save single record to database
    updateAttendance.mutate({
      systemId: employeeSystemId,
      data: {
        action: 'save',
        monthKey: currentMonthKey,
        employeeSystemId,
        dayKey: `day_${day}`,
        record: defaultRecord,
      },
    });
    
    toast('Điền nhanh', { description: 'Đã áp dụng giờ làm việc mặc định' });
  }, [attendanceData, currentDate, settings, isLocked, currentMonthKey, updateAttendance]);

  // Edit record handler
  const handleEditRecord = React.useCallback((employeeSystemId: SystemId, day: number) => {
    if (isLocked) return;
    if (isSelectionMode) { toggleCellSelection(employeeSystemId, day); return; }
    const emp = attendanceData.find(e => e.employeeSystemId === employeeSystemId);
    if (emp) { setEditingRecordInfo({ employeeSystemId, day, record: emp[`day_${day}`] as DailyRecord }); setIsEditModalOpen(true); }
  }, [attendanceData, isLocked, isSelectionMode, toggleCellSelection]);

  // Save record handler
  const handleSaveRecord = React.useCallback((updatedRecord: DailyRecord) => {
    if (!editingRecordInfo) return;
    const updatedData = attendanceData.map(row => {
      if (row.employeeSystemId === editingRecordInfo.employeeSystemId) {
        const newRow = { ...row } as AnyAttendanceDataRow;
        newRow[`day_${editingRecordInfo.day}`] = updatedRecord;
        return { ...newRow, ...recalculateSummary(newRow, currentDate.getFullYear(), currentDate.getMonth() + 1, settings) } as AttendanceDataRow;
      }
      return row;
    });
    setAttendanceData(updatedData);
    
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
    });
    
    setIsEditModalOpen(false);
    setEditingRecordInfo(null);
    toast.success('Cập nhật thành công', { description: `Đã lưu chấm công ngày ${editingRecordInfo.day}` });
  }, [editingRecordInfo, attendanceData, currentDate, settings, currentMonthKey, updateAttendance]);

  // Bulk save handler
  const handleBulkSave = React.useCallback((updates: Array<{ employeeSystemId: SystemId; day: number; record: DailyRecord }>) => {
    const updatedData = attendanceData.map(row => {
      const empUpdates = updates.filter(u => u.employeeSystemId === row.employeeSystemId);
      if (empUpdates.length > 0) {
        const newRow = { ...row } as AnyAttendanceDataRow;
        empUpdates.forEach(u => { newRow[`day_${u.day}`] = u.record; });
        return { ...newRow, ...recalculateSummary(newRow, currentDate.getFullYear(), currentDate.getMonth() + 1, settings) } as AttendanceDataRow;
      }
      return row;
    });
    setAttendanceData(updatedData);
    
    // Save to database
    const records = updates.map(u => ({
      systemId: u.employeeSystemId,
      data: {
        action: 'save',
        monthKey: currentMonthKey,
        employeeSystemId: u.employeeSystemId,
        dayKey: `day_${u.day}`,
        record: u.record,
      } as any,
    }));
    bulkUpdateAttendance.mutate(records);
    
    setCellSelection({});
    setIsSelectionMode(false);
    toast.success('Cập nhật thành công', { description: `Đã chỉnh sửa ${updates.length} ô` });
  }, [attendanceData, currentDate, settings, currentMonthKey, bulkUpdateAttendance]);

  // Import confirm handler
  const handleConfirmImport = React.useCallback((importedData: Record<SystemId, { day: number; checkIn?: string; morningCheckOut?: string; afternoonCheckIn?: string; checkOut?: string; overtimeCheckIn?: string; overtimeCheckOut?: string }[]>, date: Date) => {
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
    setAttendanceData(updatedData);
    
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
    
    if (records.length > 0) {
      bulkUpdateAttendance.mutate(records);
    }
    
    setCurrentDate(date);
    const penalties = previewAttendancePenalties(updatedData, year, month);
    if (penalties.length > 0) { setPendingPenalties(penalties); setIsPenaltyConfirmOpen(true); }
    toast.success('Nhập thành công', { description: `Đã cập nhật chấm công cho tháng ${formatDateCustom(date, 'MM/yyyy')}` });
  }, [employees, settings, bulkUpdateAttendance]);

  const handleConfirmPenalties = React.useCallback((selectedPenalties: Parameters<typeof confirmCreatePenalties>[0]) => {
    const created = confirmCreatePenalties(selectedPenalties);
    toast.success('Tạo phiếu phạt thành công', { description: `Đã tạo ${created} phiếu phạt` });
    setPendingPenalties([]);
  }, []);

  const handleSkipPenalties = React.useCallback(() => { toast.info('Đã bỏ qua tạo phiếu phạt'); setPendingPenalties([]); }, []);

  // Selected cells array
  const selectedCellsArray = React.useMemo(() => Object.keys(cellSelection).map(key => { const [sId, dayStr] = key.split('-'); const emp = attendanceData.find(e => e.employeeSystemId === sId); return { employeeSystemId: sId as SystemId, employeeCode: emp?.employeeId ?? '', employeeName: emp?.fullName ?? '', day: parseInt(dayStr, 10) }; }), [cellSelection, attendanceData]);

  // Filtering
  const fuseOptions = React.useMemo(() => ({ keys: ['employeeId', 'fullName', 'department'] }), []);
  const searchedData = useFuseFilter(attendanceData, debouncedGlobalFilter, fuseOptions);
  const filteredData = React.useMemo(() => { let data = searchedData; if (departmentFilter !== 'all') data = data.filter(r => r.department === departmentFilter); return data; }, [searchedData, departmentFilter]);
  const sortedData = React.useMemo(() => { const s = [...filteredData]; if (sorting.id) s.sort((a, b) => { const aV = (a as Record<string, unknown>)[sorting.id] as string | number | null | undefined, bV = (b as Record<string, unknown>)[sorting.id] as string | number | null | undefined; if (aV == null && bV == null) return 0; if (aV == null) return 1; if (bV == null) return -1; if (aV < bV) return sorting.desc ? 1 : -1; if (aV > bV) return sorting.desc ? -1 : 1; return 0; }); return s; }, [filteredData, sorting]);

  // Print & Export handlers (must be after sortedData)
  const _handlePrint = React.useCallback(() => {
    if (!sortedData?.length) return;
    const storeSettings = createStoreSettings(storeInfo);
    const sheetForPrint = convertAttendanceSheetForPrint(currentMonthKey, sortedData as Parameters<typeof convertAttendanceSheetForPrint>[1], { isLocked, departmentName: departmentFilter !== 'all' ? departments.find(d => d.name === departmentFilter)?.name : undefined });
    print('attendance', { data: mapAttendanceSheetToPrintData(sheetForPrint, storeSettings), lineItems: mapAttendanceSheetLineItems(sheetForPrint.employees, currentMonthKey) });
  }, [sortedData, currentMonthKey, departmentFilter, departments, isLocked, storeInfo, print]);

  const _handleExport = React.useCallback(async () => {
    const XLSX = await import('xlsx');
    const year = currentDate.getFullYear(), month = currentDate.getMonth() + 1, daysInMonth = new Date(year, month, 0).getDate();
    const headers = ['Mã NV', 'Họ tên', 'Phòng ban'];
    for (let d = 1; d <= daysInMonth; d++) headers.push(`${d}`);
    headers.push('Ngày công', 'Nghỉ phép', 'Vắng');
    const rows = sortedData.map(row => {
      const r: (string | number)[] = [row.employeeId, row.fullName, row.department ?? ''];
      for (let d = 1; d <= daysInMonth; d++) { const rec = row[`day_${d}` as keyof AttendanceDataRow] as DailyRecord | undefined; r.push(!rec ? '' : rec.status === 'present' ? 'X' : rec.status === 'leave' ? 'P' : rec.status === 'absent' ? 'V' : rec.status === 'weekend' ? '-' : rec.status === 'holiday' ? 'L' : ''); }
      r.push(row.workDays ?? 0, row.leaveDays ?? 0, row.absentDays ?? 0);
      return r;
    });
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Chấm công T${month}`);
    XLSX.writeFile(wb, `cham-cong-${formatDateCustom(currentDate, 'yyyy-MM')}.xlsx`);
    toast.success('Xuất Excel thành công', { description: `Đã xuất ${sortedData.length} nhân viên` });
  }, [sortedData, currentDate]);

  // Page actions (after handlers)
  usePageHeader(React.useMemo(() => ({
    title: 'Chấm công',
    breadcrumb: [
      { label: 'Nhân sự', href: ROUTES.HRM.EMPLOYEES, isCurrent: false },
      { label: 'Chấm công', href: ROUTES.HRM.ATTENDANCE, isCurrent: true }
    ],
    // ⚠️ Tạm bỏ actions khỏi header để tránh vòng lặp setState khi actions thay đổi liên tục
  }), []));

  // Columns - separate stable config from selection state
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const columns = React.useMemo(() => getColumns(year, month, handleEditRecord, settings, isLocked, isSelectionMode, cellSelection, handleQuickFill), [year, month, handleEditRecord, settings, isLocked, isSelectionMode, cellSelection, handleQuickFill]);

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


  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize);
  const allSelectedRows = React.useMemo(() => attendanceData.filter(a => rowSelection[a.systemId]), [attendanceData, rowSelection]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <StatisticsDashboard data={filteredData} currentDate={currentDate} />
      <Card className="flex-shrink-0"><CardContent className="p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex flex-wrap items-center gap-2"><MonthYearPicker value={currentDate} onChange={setCurrentDate} /><Select value={departmentFilter} onValueChange={setDepartmentFilter}><SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Tất cả phòng ban" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả phòng ban</SelectItem>{departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent></Select><div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Tìm nhân viên..." value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} className="h-9 w-[200px] pl-8" /></div></div><div className="flex items-center justify-end gap-2"><DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} /></div></div></CardContent></Card>
      <ResponsiveDataTable columns={columns} data={paginatedData} rowCount={filteredData.length} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowSelection={rowSelection} setRowSelection={setRowSelection} sorting={sorting} setSorting={setSorting} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} className="flex-grow" allSelectedRows={allSelectedRows} expanded={{}} setExpanded={() => {}} />
      <AttendanceEditDialog isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} recordData={editingRecordInfo} onSave={handleSaveRecord} monthDate={currentDate} />
      <AttendanceImportDialog isOpen={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} onConfirmImport={handleConfirmImport} employees={employees} />
      <BulkEditDialog isOpen={isBulkEditDialogOpen} onOpenChange={setIsBulkEditDialogOpen} selectedCells={selectedCellsArray} onSave={handleBulkSave} />
      <PenaltyConfirmDialog isOpen={isPenaltyConfirmOpen} onOpenChange={setIsPenaltyConfirmOpen} penalties={pendingPenalties} onConfirm={handleConfirmPenalties} onSkip={handleSkipPenalties} />
    </div>
  );
}
