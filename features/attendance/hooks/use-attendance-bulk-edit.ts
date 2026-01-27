/**
 * Hook cho bulk edit workflow của Attendance
 * Tách từ page.tsx để giảm kích thước file
 */
import React from 'react';
import { toast } from 'sonner';
import { formatDateCustom } from '@/lib/date-utils';
import type { SystemId } from '@/lib/id-types';
import type { AttendanceDataRow, DailyRecord, AnyAttendanceDataRow } from '../types';
import { useAttendanceStore } from '../store';
import { useEmployeeSettings, DEFAULT_EMPLOYEE_SETTINGS } from '@/features/settings/employees/hooks/use-employee-settings';
import { recalculateSummary } from '../utils';

export function useAttendanceBulkEdit(
  attendanceData: AttendanceDataRow[],
  setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceDataRow[]>>,
  currentDate: Date,
  isLocked: boolean
) {
  const saveAttendanceData = useAttendanceStore((state) => state.saveAttendanceData);
  const { data: rawSettings } = useEmployeeSettings();
  const settings = rawSettings ?? DEFAULT_EMPLOYEE_SETTINGS;
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

  const handleBulkSave = React.useCallback((updates: Array<{ employeeSystemId: SystemId; day: number; record: DailyRecord }>) => {
    setAttendanceData(prevData =>
      prevData.map(row => {
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
      })
    );
    
    // Save to store
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
    saveAttendanceData(currentMonthKey, updatedData);

    setCellSelection({});
    setIsSelectionMode(false);
    toast.success('Cập nhật thành công', {
      description: `Đã chỉnh sửa ${updates.length} ô`,
    });
  }, [attendanceData, currentDate, settings, currentMonthKey, saveAttendanceData, setAttendanceData]);

  const handleQuickFill = React.useCallback((employeeSystemId: SystemId, day: number) => {
    if (isLocked) return;
    
    const defaultRecord: DailyRecord = {
      status: 'present',
      checkIn: settings.workStartTime,
      checkOut: settings.workEndTime,
    };

    setAttendanceData(prevData =>
      prevData.map(row => {
        if (row.employeeSystemId === employeeSystemId) {
          const newRow = { ...row } as AnyAttendanceDataRow;
          newRow[`day_${day}`] = defaultRecord;
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
        newRow[`day_${day}`] = defaultRecord;
        const summary = recalculateSummary(newRow, currentDate.getFullYear(), currentDate.getMonth() + 1, settings);
        return { ...newRow, ...summary } as AttendanceDataRow;
      }
      return row;
    });
    saveAttendanceData(currentMonthKey, updatedData);

    toast('Điền nhanh', {
      description: 'Đã áp dụng giờ làm việc mặc định',
    });
  }, [attendanceData, currentDate, settings, isLocked, currentMonthKey, saveAttendanceData, setAttendanceData]);

  const openBulkEditDialog = React.useCallback(() => {
    if (selectedCellsArray.length === 0) {
      toast.error('Chưa chọn ô nào', {
        description: 'Vui lòng bật chế độ chọn và chọn các ô cần chỉnh sửa',
      });
      return;
    }
    setIsBulkEditDialogOpen(true);
  }, [selectedCellsArray]);

  const closeBulkEditDialog = React.useCallback(() => {
    setIsBulkEditDialogOpen(false);
  }, []);

  const toggleSelectionMode = React.useCallback(() => {
    setIsSelectionMode(prev => !prev);
    if (isSelectionMode) {
      setCellSelection({});
    }
  }, [isSelectionMode]);

  const clearSelection = React.useCallback(() => {
    setCellSelection({});
  }, []);

  return {
    isBulkEditDialogOpen,
    cellSelection,
    isSelectionMode,
    selectedCellsArray,
    toggleCellSelection,
    handleBulkSave,
    handleQuickFill,
    openBulkEditDialog,
    closeBulkEditDialog,
    toggleSelectionMode,
    clearSelection,
  };
}
