/**
 * Hook tổng hợp các handlers cho Attendance page
 * Mục tiêu: giảm kích thước page.tsx xuống < 300 lines
 */
import * as React from 'react';
import { toast } from 'sonner';
import { formatDateCustom, getCurrentDate, subtractMonths, addMonths, getDayOfWeek } from '@/lib/date-utils';
import type { SystemId } from '@/lib/id-types';
import type { AttendanceDataRow, DailyRecord, AnyAttendanceDataRow } from '../types';
import { useAttendanceStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { useAllEmployees } from '@/features/employees/hooks/use-all-employees';
import { useAllLeaves } from '@/features/leaves/hooks/use-all-leaves';
import { useEmployeeSettingsStore } from '@/features/settings/employees/employee-settings-store';
import { usePrint } from '@/lib/use-print';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
import { generateEmptyAttendance } from '../data';
import { recalculateSummary } from '../utils';
import { leaveAttendanceSync } from '@/features/leaves/leave-sync-service';
import {
  convertAttendanceSheetForPrint,
  mapAttendanceSheetToPrintData,
  mapAttendanceSheetLineItems,
  createStoreSettings,
} from '@/lib/print/attendance-print-helper';
import { previewAttendancePenalties, confirmCreatePenalties, type PenaltyPreviewItem } from '../penalty-sync-service';

/**
 * Hook for month navigation and lock management
 */
export function useAttendanceMonthControl() {
  const [currentDate, setCurrentDate] = React.useState(getCurrentDate());
  const lockedMonths = useAttendanceStore(useShallow((state) => state.lockedMonths));
  const toggleLock = useAttendanceStore((state) => state.toggleLock);
  
  const currentMonthKey = formatDateCustom(currentDate, 'yyyy-MM');
  const isLocked = !!lockedMonths[currentMonthKey];

  const handleToggleLock = React.useCallback(() => {
    const monthLabel = formatDateCustom(currentDate, 'MM/yyyy');
    const willBeLocked = !isLocked;
    
    React.startTransition(() => {
      toggleLock(currentMonthKey);
    });
    
    if (willBeLocked) {
      toast.success('Đã khóa chấm công', { 
        description: `Tháng ${monthLabel} đã được khóa. Không thể chỉnh sửa dữ liệu.` 
      });
    } else {
      toast.success('Đã mở khóa chấm công', { 
        description: `Tháng ${monthLabel} đã được mở khóa. Có thể chỉnh sửa dữ liệu.` 
      });
    }
  }, [currentDate, currentMonthKey, isLocked, toggleLock]);

  const goToPreviousMonth = React.useCallback(() => {
    const prev = subtractMonths(currentDate, 1);
    if (prev) setCurrentDate(prev);
  }, [currentDate]);

  const goToNextMonth = React.useCallback(() => {
    const next = addMonths(currentDate, 1);
    if (next) setCurrentDate(next);
  }, [currentDate]);

  return {
    currentDate,
    setCurrentDate,
    currentMonthKey,
    isLocked,
    handleToggleLock,
    goToPreviousMonth,
    goToNextMonth,
  };
}

/**
 * Hook for attendance data management (load, save, update)
 */
export function useAttendanceData(currentDate: Date) {
  const { data: employees } = useAllEmployees();
  const { settings } = useEmployeeSettingsStore();
  const { data: leaveRequests } = useAllLeaves();
  
  const saveAttendanceData = useAttendanceStore((state) => state.saveAttendanceData);
  const getAttendanceData = useAttendanceStore((state) => state.getAttendanceData);
  
  const [attendanceData, setAttendanceData] = React.useState<AttendanceDataRow[]>([]);
  const currentMonthKey = formatDateCustom(currentDate, 'yyyy-MM');

  const replayApprovedLeavesForMonth = React.useCallback((monthKey: string) => {
    if (!leaveRequests?.length) return;
    const [yearStr, monthStr] = monthKey.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    if (!year || !month) return;
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    leaveRequests.forEach((leave) => {
      if (leave.status !== 'Đã duyệt') return;
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return;
      }
      if (start <= monthEnd && end >= monthStart) {
        leaveAttendanceSync.apply(leave);
      }
    });
  }, [leaveRequests]);

  // Load data on mount or month change
  React.useEffect(() => {
    const storedMonthData = getAttendanceData(currentMonthKey);
    if (storedMonthData && storedMonthData.length > 0) {
      setAttendanceData(storedMonthData);
    } else {
      const seededData = generateEmptyAttendance(employees, currentDate.getFullYear(), currentDate.getMonth() + 1, settings);
      setAttendanceData(seededData);
      saveAttendanceData(currentMonthKey, seededData);
      replayApprovedLeavesForMonth(currentMonthKey);
    }
  }, [employees, currentDate, settings, currentMonthKey, getAttendanceData, saveAttendanceData, replayApprovedLeavesForMonth]);

  const updateAttendanceRecord = React.useCallback((
    employeeSystemId: SystemId,
    day: number,
    record: DailyRecord
  ) => {
    setAttendanceData(prevData =>
      prevData.map(row => {
        if (row.employeeSystemId === employeeSystemId) {
          const newRow = { ...row } as AnyAttendanceDataRow;
          newRow[`day_${day}`] = record;
          const summary = recalculateSummary(newRow, currentDate.getFullYear(), currentDate.getMonth() + 1, settings);
          return { ...newRow, ...summary } as AttendanceDataRow;
        }
        return row;
      })
    );

    // Save to store
    const updatedData = attendanceData.map(row => {
      if (row.employeeSystemId === employeeSystemId) {
        const newRow = { ...row } as AnyAttendanceDataRow;
        newRow[`day_${day}`] = record;
        const summary = recalculateSummary(newRow, currentDate.getFullYear(), currentDate.getMonth() + 1, settings);
        return { ...newRow, ...summary } as AttendanceDataRow;
      }
      return row;
    });
    saveAttendanceData(currentMonthKey, updatedData);
  }, [attendanceData, currentDate, settings, currentMonthKey, saveAttendanceData]);

  const bulkUpdateAttendance = React.useCallback((
    updates: Array<{ employeeSystemId: SystemId; day: number; record: DailyRecord }>
  ) => {
    const updatedData = attendanceData.map(row => {
      const employeeUpdates = updates.filter(u => u.employeeSystemId === row.employeeSystemId);
      if (employeeUpdates.length > 0) {
        const newRow = { ...row } as AnyAttendanceDataRow;
        employeeUpdates.forEach(update => {
          newRow[`day_${update.day}`] = update.record;
        });
        const summary = recalculateSummary(newRow, currentDate.getFullYear(), currentDate.getMonth() + 1, settings);
        return { ...newRow, ...summary } as AttendanceDataRow;
      }
      return row;
    });

    setAttendanceData(updatedData);
    saveAttendanceData(currentMonthKey, updatedData);
  }, [attendanceData, currentDate, settings, currentMonthKey, saveAttendanceData]);

  return {
    attendanceData,
    setAttendanceData,
    updateAttendanceRecord,
    bulkUpdateAttendance,
    employees,
    settings,
    replayApprovedLeavesForMonth,
  };
}

/**
 * Hook for import handlers
 */
export function useAttendanceImport(
  setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceDataRow[]>>,
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>,
  _currentMonthKey: string,
) {
  const { data: employees } = useAllEmployees();
  const { settings } = useEmployeeSettingsStore();
  const saveAttendanceData = useAttendanceStore((state) => state.saveAttendanceData);

  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [isPenaltyConfirmOpen, setIsPenaltyConfirmOpen] = React.useState(false);
  const [pendingPenalties, setPendingPenalties] = React.useState<PenaltyPreviewItem[]>([]);
  const [pendingImportDate, setPendingImportDate] = React.useState<Date | null>(null);

  const handleConfirmImport = React.useCallback((
    importedData: Record<SystemId, { day: number; checkIn?: string; morningCheckOut?: string; afternoonCheckIn?: string; checkOut?: string; overtimeCheckIn?: string; overtimeCheckOut?: string }[]>,
    date: Date
  ) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const baseAttendanceData = generateEmptyAttendance(employees, year, month, settings);

    const updatedData = baseAttendanceData.map(employeeRow => {
      const employeeUpdates = importedData[employeeRow.employeeSystemId];
      if (employeeUpdates) {
        const mutableRow: AnyAttendanceDataRow = { ...employeeRow };

        const daysInMonth = new Date(year, month, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
          const workDate = new Date(year, month - 1, d);
          const dayOfWeek = getDayOfWeek(workDate);
          const isWorkingDay = dayOfWeek !== null && settings.workingDays.includes(dayOfWeek);
          mutableRow[`day_${d}`] = { status: isWorkingDay ? 'absent' : 'weekend' };
        }

        employeeUpdates.forEach(update => {
          const dayKey = `day_${update.day}`;
          const hasFullDay = update.checkIn && update.checkOut;
          
          const newRecord: DailyRecord = { 
            status: hasFullDay ? 'present' : 'absent',
            checkIn: update.checkIn || undefined,
            morningCheckOut: update.morningCheckOut || undefined,
            afternoonCheckIn: update.afternoonCheckIn || undefined,
            checkOut: update.checkOut || undefined,
            overtimeCheckIn: update.overtimeCheckIn || undefined,
            overtimeCheckOut: update.overtimeCheckOut || undefined,
          };
          mutableRow[dayKey] = newRecord;
        });
        
        const summary = recalculateSummary(mutableRow, year, month, settings);
        return { ...mutableRow, ...summary } as AttendanceDataRow;
      }
      return employeeRow;
    });
    
    setAttendanceData(updatedData);
    saveAttendanceData(formatDateCustom(date, 'yyyy-MM'), updatedData);
    setCurrentDate(date);
    
    // Preview penalties
    const penaltyPreviews = previewAttendancePenalties(updatedData, year, month);
    
    if (penaltyPreviews.length > 0) {
      setPendingPenalties(penaltyPreviews);
      setPendingImportDate(date);
      setIsPenaltyConfirmOpen(true);
      toast.success('Nhập thành công', {
        description: `Đã cập nhật chấm công cho tháng ${formatDateCustom(date, 'MM/yyyy')}. Phát hiện ${penaltyPreviews.length} vi phạm.`,
      });
    } else {
      toast.success('Nhập thành công', {
        description: `Đã cập nhật chấm công cho tháng ${formatDateCustom(date, 'MM/yyyy')}`,
      });
    }
  }, [employees, settings, saveAttendanceData, setAttendanceData, setCurrentDate]);

  const handleConfirmPenalties = React.useCallback((selectedPenalties: Omit<import('@/features/settings/penalties/types').Penalty, 'systemId'>[]) => {
    const created = confirmCreatePenalties(selectedPenalties);
    toast.success('Tạo phiếu phạt thành công', {
      description: `Đã tạo ${created} phiếu phạt từ dữ liệu chấm công.`,
    });
    setPendingPenalties([]);
    setPendingImportDate(null);
  }, []);

  const handleSkipPenalties = React.useCallback(() => {
    toast.info('Đã bỏ qua tạo phiếu phạt');
    setPendingPenalties([]);
    setPendingImportDate(null);
  }, []);

  return {
    isImportDialogOpen,
    setIsImportDialogOpen,
    isPenaltyConfirmOpen,
    setIsPenaltyConfirmOpen,
    pendingPenalties,
    pendingImportDate,
    handleConfirmImport,
    handleConfirmPenalties,
    handleSkipPenalties,
  };
}

/**
 * Hook for bulk edit / cell selection
 */
export function useAttendanceBulkEdit(
  attendanceData: AttendanceDataRow[],
  currentDate: Date,
  isLocked: boolean,
) {
  const { settings } = useEmployeeSettingsStore();
  const saveAttendanceData = useAttendanceStore((state) => state.saveAttendanceData);
  const currentMonthKey = formatDateCustom(currentDate, 'yyyy-MM');

  const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] = React.useState(false);
  const [cellSelection, setCellSelection] = React.useState<Record<string, boolean>>({});
  const [isSelectionMode, setIsSelectionMode] = React.useState(false);

  const toggleCellSelection = React.useCallback((employeeSystemId: SystemId, day: number) => {
    if (!isSelectionMode || isLocked) return;
    
    const key = `${employeeSystemId}-${day}`;
    setCellSelection(prev => {
      const newSelection = { ...prev };
      if (newSelection[key]) {
        delete newSelection[key];
      } else {
        newSelection[key] = true;
      }
      return newSelection;
    });
  }, [isSelectionMode, isLocked]);

  const selectedCellsArray = React.useMemo<Array<{ employeeSystemId: SystemId; employeeCode: string; employeeName: string; day: number }>>(
    () =>
      Object.keys(cellSelection).map((key) => {
        const [systemId, dayStr] = key.split('-');
        const employeeSystemId = systemId as SystemId;
        const employee = attendanceData.find((e) => e.employeeSystemId === employeeSystemId);
        return {
          employeeSystemId,
          employeeCode: employee?.employeeId ?? '',
          employeeName: employee?.fullName || '',
          day: parseInt(dayStr, 10),
        };
      }),
    [cellSelection, attendanceData]
  );

  const handleBulkSave = React.useCallback((
    updates: Array<{ employeeSystemId: SystemId; day: number; record: DailyRecord }>,
    setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceDataRow[]>>
  ) => {
    const updatedData = attendanceData.map(row => {
      const employeeUpdates = updates.filter(u => u.employeeSystemId === row.employeeSystemId);
      if (employeeUpdates.length > 0) {
        const newRow = { ...row } as AnyAttendanceDataRow;
        employeeUpdates.forEach(update => {
          newRow[`day_${update.day}`] = update.record;
        });
        const summary = recalculateSummary(newRow, currentDate.getFullYear(), currentDate.getMonth() + 1, settings);
        return { ...newRow, ...summary } as AttendanceDataRow;
      }
      return row;
    });

    setAttendanceData(updatedData);
    saveAttendanceData(currentMonthKey, updatedData);

    setCellSelection({});
    setIsSelectionMode(false);
    toast.success('Cập nhật thành công', {
      description: `Đã chỉnh sửa ${updates.length} ô`,
    });
  }, [attendanceData, currentDate, settings, currentMonthKey, saveAttendanceData]);

  const handleQuickFill = React.useCallback((
    employeeSystemId: SystemId,
    day: number,
    setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceDataRow[]>>
  ) => {
    if (isLocked) return;
    
    const defaultRecord: DailyRecord = {
      status: 'present',
      checkIn: settings.workStartTime,
      checkOut: settings.workEndTime,
    };

    const updatedData = attendanceData.map(row => {
      if (row.employeeSystemId === employeeSystemId) {
        const newRow = { ...row } as AnyAttendanceDataRow;
        newRow[`day_${day}`] = defaultRecord;
        const summary = recalculateSummary(newRow, currentDate.getFullYear(), currentDate.getMonth() + 1, settings);
        return { ...newRow, ...summary } as AttendanceDataRow;
      }
      return row;
    });

    setAttendanceData(updatedData);
    saveAttendanceData(currentMonthKey, updatedData);

    toast('Điền nhanh', {
      description: 'Đã áp dụng giờ làm việc mặc định',
    });
  }, [attendanceData, currentDate, settings, isLocked, currentMonthKey, saveAttendanceData]);

  return {
    isBulkEditDialogOpen,
    setIsBulkEditDialogOpen,
    cellSelection,
    setCellSelection,
    isSelectionMode,
    setIsSelectionMode,
    toggleCellSelection,
    selectedCellsArray,
    handleBulkSave,
    handleQuickFill,
  };
}

/**
 * Hook for print handlers
 */
export function useAttendancePrint(attendanceData: AttendanceDataRow[], currentDate: Date) {
  const { info: storeInfo } = useStoreInfoData();
  const { print } = usePrint();

  const handlePrint = React.useCallback(() => {
    const monthKey = formatDateCustom(currentDate, 'yyyy-MM');
    const storeSettings = createStoreSettings(storeInfo);
    const sheetData = convertAttendanceSheetForPrint(monthKey, attendanceData, {});
    
    print('attendance', {
      data: mapAttendanceSheetToPrintData(sheetData, storeSettings),
      lineItems: mapAttendanceSheetLineItems(sheetData.employees),
    });
    
    toast.success('Đang in bảng chấm công', {
      description: `Tháng ${formatDateCustom(currentDate, 'MM/yyyy')}`,
    });
  }, [attendanceData, currentDate, storeInfo, print]);

  return { handlePrint };
}

/**
 * Hook for export to Excel
 */
export function useAttendanceExport(filteredData: AttendanceDataRow[], currentDate: Date) {
  const handleExport = React.useCallback(async () => {
    // Lazy load XLSX (~500KB)
    const XLSX = await import('xlsx');
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    // Build header row
    const headers = ['Mã NV', 'Họ tên', 'Phòng ban'];
    for (let d = 1; d <= daysInMonth; d++) {
      headers.push(`${d}`);
    }
    headers.push('Ngày công', 'Nghỉ phép', 'Vắng');

    // Build data rows
    const rows = filteredData.map(row => {
      const rowData: (string | number)[] = [
        row.employeeId,
        row.fullName,
        row.department ?? '',
      ];
      
      for (let d = 1; d <= daysInMonth; d++) {
        const dayKey = `day_${d}` as keyof AttendanceDataRow;
        const record = row[dayKey] as DailyRecord | undefined;
        
        if (!record) {
          rowData.push('');
        } else if (record.status === 'present') {
          rowData.push('X');
        } else if (record.status === 'leave') {
          rowData.push('P');
        } else if (record.status === 'absent') {
          rowData.push('V');
        } else if (record.status === 'weekend') {
          rowData.push('-');
        } else if (record.status === 'holiday') {
          rowData.push('L');
        } else {
          rowData.push('');
        }
      }
      
      rowData.push(row.workDays ?? 0);
      rowData.push(row.leaveDays ?? 0);
      rowData.push(row.absentDays ?? 0);
      
      return rowData;
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Chấm công T${month}`);
    
    XLSX.writeFile(wb, `cham-cong-${formatDateCustom(currentDate, 'yyyy-MM')}.xlsx`);
    
    toast.success('Xuất Excel thành công', {
      description: `Đã xuất ${filteredData.length} nhân viên`,
    });
  }, [filteredData, currentDate]);

  return { handleExport };
}

/**
 * Hook for edit single record dialog
 */
export function useAttendanceEditDialog() {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingRecordInfo, setEditingRecordInfo] = React.useState<{
    employeeSystemId: SystemId;
    day: number;
    record: DailyRecord;
  } | null>(null);

  const openEditDialog = React.useCallback((
    employeeSystemId: SystemId,
    day: number,
    record: DailyRecord
  ) => {
    setEditingRecordInfo({ employeeSystemId, day, record });
    setIsEditModalOpen(true);
  }, []);

  const closeEditDialog = React.useCallback(() => {
    setIsEditModalOpen(false);
    setEditingRecordInfo(null);
  }, []);

  return {
    isEditModalOpen,
    setIsEditModalOpen,
    editingRecordInfo,
    openEditDialog,
    closeEditDialog,
  };
}

/**
 * Hook for filter state
 */
export function useAttendanceFilters() {
  const [departmentFilter, setDepartmentFilter] = React.useState('all');
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  return {
    departmentFilter,
    setDepartmentFilter,
    globalFilter,
    setGlobalFilter,
    rowSelection,
    setRowSelection,
    sorting,
    setSorting,
    pagination,
    setPagination,
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
    pinnedColumns,
    setPinnedColumns,
  };
}
