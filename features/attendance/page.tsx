import * as React from 'react';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getStartOfMonth, getEndOfMonth, addMonths, subtractMonths, toISODate, getDayOfWeek, formatMonthYear } from '../../lib/date-utils.ts';
import { ROUTES } from '../../lib/router.ts';
import * as XLSX from 'xlsx';

import { useEmployeeStore } from '../employees/store.ts';
import { useDepartmentStore } from '../settings/departments/store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { generateMockAttendance } from './data.ts';
import { getColumns } from './columns.tsx';
import type { AttendanceDataRow, DailyRecord, AnyAttendanceDataRow, ImportPreviewRow } from './types.ts';
import type { SystemId } from '../../lib/id-types.ts';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table.tsx';
import { Card, CardContent } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Upload, Download, Lock, ChevronLeft, ChevronRight, Search, Edit2, Printer } from 'lucide-react';
import Fuse from 'fuse.js';
import { AttendanceEditDialog } from './components/attendance-edit-dialog.tsx';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle.tsx';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store.ts';
import { useAttendanceStore } from './store.ts';
import { useShallow } from 'zustand/react/shallow';
import { recalculateSummary, excelSerialToTime } from './utils.ts';
import { AttendanceImportDialog } from './components/attendance-import-dialog.tsx';
import { BulkEditDialog } from './components/bulk-edit-dialog.tsx';
import { StatisticsDashboard } from './components/statistics-dashboard.tsx';
import { useDebounce } from '../../hooks/use-debounce.ts';
import { toast } from 'sonner';
import { useLeaveStore } from '../leaves/store.ts';
import { leaveAttendanceSync } from '../leaves/leave-sync-service.ts';
import { usePrint } from '../../lib/use-print.ts';
import { useStoreInfoStore } from '../settings/store-info/store-info-store.ts';
import {
  convertAttendanceSheetForPrint,
  mapAttendanceSheetToPrintData,
  mapAttendanceSheetLineItems,
  createStoreSettings,
} from '../../lib/print/attendance-print-helper.ts';
import { previewAttendancePenalties, confirmCreatePenalties, type PenaltyPreviewItem } from './penalty-sync-service.ts';
import { PenaltyConfirmDialog } from './components/penalty-confirm-dialog.tsx';

const MonthYearPicker = ({ value, onChange }: { value: Date, onChange: (date: Date) => void }) => {
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
    )
}


export function AttendancePage() {
    const { data: employees } = useEmployeeStore();
    const { data: departments } = useDepartmentStore();
    const { settings } = useEmployeeSettingsStore();
    
    // Use selectors to minimize re-renders - functions are stable, only lockedMonths needs shallow compare
    const lockedMonths = useAttendanceStore(useShallow((state) => state.lockedMonths));
    const toggleLock = useAttendanceStore((state) => state.toggleLock);
    const saveAttendanceData = useAttendanceStore((state) => state.saveAttendanceData);
    const getAttendanceData = useAttendanceStore((state) => state.getAttendanceData);
    
    const { data: leaveRequests } = useLeaveStore();
    
    // Print integration
    const { info: storeInfo } = useStoreInfoStore();
    const { print } = usePrint();

    // State
    const [currentDate, setCurrentDate] = React.useState(getCurrentDate());
    const [departmentFilter, setDepartmentFilter] = React.useState('all');
    const [globalFilter, setGlobalFilter] = React.useState('');
    const debouncedGlobalFilter = useDebounce(globalFilter, 300); // Debounce search
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
    const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
    const [attendanceData, setAttendanceData] = React.useState<AttendanceDataRow[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [editingRecordInfo, setEditingRecordInfo] = React.useState<{ employeeSystemId: SystemId; day: number; record: DailyRecord } | null>(null);
    const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
    
    // Bulk edit states
    const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] = React.useState(false);
    const [cellSelection, setCellSelection] = React.useState<Record<string, boolean>>({}); // key: "employeeSystemId-day"
    const [isSelectionMode, setIsSelectionMode] = React.useState(false);

    // Penalty confirmation states
    const [isPenaltyConfirmOpen, setIsPenaltyConfirmOpen] = React.useState(false);
    const [pendingPenalties, setPendingPenalties] = React.useState<PenaltyPreviewItem[]>([]);
    const [pendingImportDate, setPendingImportDate] = React.useState<Date | null>(null);

    const currentMonthKey = formatDateCustom(currentDate, 'yyyy-MM');
    const isLocked = !!lockedMonths[currentMonthKey];

    // Handle lock with feedback - use startTransition to prevent UI blocking
    const handleToggleLock = React.useCallback(() => {
        const monthLabel = formatDateCustom(currentDate, 'MM/yyyy');
        const willBeLocked = !isLocked;
        
        // Use startTransition for non-urgent update
        React.startTransition(() => {
            toggleLock(currentMonthKey);
        });
        
        // Show toast immediately (outside transition)
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

    
    
    const handleConfirmImport = (
        importedData: Record<SystemId, { day: number; checkIn?: string; morningCheckOut?: string; afternoonCheckIn?: string; checkOut?: string; overtimeCheckIn?: string; overtimeCheckOut?: string }[]>,
        date: Date
    ) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const baseAttendanceData = generateMockAttendance(employees, year, month, settings);

        const updatedData = baseAttendanceData.map(employeeRow => {
            const employeeUpdates = importedData[employeeRow.employeeSystemId];
            if (employeeUpdates) {
                // @ts-ignore
                let mutableRow: AnyAttendanceDataRow = { ...employeeRow };

                const dateObj = currentDate;
                const daysInMonth = new Date(year, month, 0).getDate();
                for (let d = 1; d <= daysInMonth; d++) {
                    const workDate = new Date(year, month - 1, d);
                    const dayOfWeek = getDayOfWeek(workDate);
                    const isWorkingDay = dayOfWeek !== null && settings.workingDays.includes(dayOfWeek);
                    // Clear existing data for this employee
                    mutableRow[`day_${d}`] = { status: isWorkingDay ? 'absent' : 'weekend' };
                }

                employeeUpdates.forEach(update => {
                    const dayKey = `day_${update.day}`;
                    // Debug: Log imported data
                    if (update.day === 3) {
                        console.log('Import day 3:', JSON.stringify(update));
                    }
                    // Chỉ tính công khi có checkOut (giờ ra cuối ngày)
                    // - Có checkIn VÀ checkOut → present (1 công)
                    // - Chỉ có checkIn (quên chấm ra) → absent (không tính công, nhưng ghi nhận giờ vào)
                    // - Chỉ có checkOut (hiếm) → absent
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
                    // Debug: Log saved record
                    if (update.day === 3) {
                        console.log('Saved record day 3:', JSON.stringify(newRecord));
                    }
                    mutableRow[dayKey] = newRecord;
                });
                
                const summary = recalculateSummary(mutableRow, year, month, settings);
                return { ...mutableRow, ...summary } as AttendanceDataRow;
            }
            return employeeRow;
        });
        
        setAttendanceData(updatedData);
        saveAttendanceData(formatDateCustom(date, 'yyyy-MM'), updatedData); // Save to store
        setCurrentDate(date);
        
        // Preview phiếu phạt cho các vi phạm đi trễ/về sớm (không tạo ngay)
        const penaltyPreviews = previewAttendancePenalties(updatedData, year, month);
        
        if (penaltyPreviews.length > 0) {
            // Có vi phạm → hiển thị dialog xác nhận
            setPendingPenalties(penaltyPreviews);
            setPendingImportDate(date);
            setIsPenaltyConfirmOpen(true);
            toast.success('Nhập thành công', {
                description: `Đã cập nhật chấm công cho tháng ${formatDateCustom(date, 'MM/yyyy')}. Phát hiện ${penaltyPreviews.length} vi phạm.`,
            });
        } else {
            // Không có vi phạm
            toast.success('Nhập thành công', {
                description: `Đã cập nhật chấm công cho tháng ${formatDateCustom(date, 'MM/yyyy')}`,
            });
        }
    };

    // Handler khi user xác nhận tạo phiếu phạt
    const handleConfirmPenalties = (selectedPenalties: Omit<import('../settings/penalties/types.ts').Penalty, 'systemId'>[]) => {
        const created = confirmCreatePenalties(selectedPenalties);
        toast.success('Tạo phiếu phạt thành công', {
            description: `Đã tạo ${created} phiếu phạt từ dữ liệu chấm công.`,
        });
        setPendingPenalties([]);
        setPendingImportDate(null);
    };

    // Handler khi user bỏ qua tạo phiếu phạt
    const handleSkipPenalties = () => {
        toast.info('Đã bỏ qua tạo phiếu phạt');
        setPendingPenalties([]);
        setPendingImportDate(null);
    };

    // Bulk edit handlers
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

    const handleBulkSave = (updates: Array<{ employeeSystemId: SystemId; day: number; record: DailyRecord }>) => {
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
    };

    const handleQuickFill = React.useCallback((employeeSystemId: SystemId, day: number) => {
        if (isLocked) return;
        
        // Double-click to quick fill with default work hours
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
    }, [attendanceData, currentDate, settings, isLocked, currentMonthKey, saveAttendanceData, toast]);

     React.useEffect(() => {
        // Load from store first, fallback to auto-filled data theo ca làm
        const storedMonthData = getAttendanceData(currentMonthKey);
        if (storedMonthData && storedMonthData.length > 0) {
            setAttendanceData(storedMonthData);
        } else {
            const seededData = generateMockAttendance(employees, currentDate.getFullYear(), currentDate.getMonth() + 1, settings);
            setAttendanceData(seededData);
            saveAttendanceData(currentMonthKey, seededData); // Save initial data
            replayApprovedLeavesForMonth(currentMonthKey);
        }
    }, [employees, currentDate, settings, currentMonthKey, getAttendanceData, saveAttendanceData, replayApprovedLeavesForMonth]);
    
    // Filtering logic with debounced search
    const filteredData = React.useMemo(() => {
        let data = attendanceData;
        if (departmentFilter !== 'all') {
            data = data.filter(row => row.department === departmentFilter);
        }
        if (debouncedGlobalFilter) {
            const fuse = new Fuse(data, { keys: ["fullName", "employeeId"], threshold: 0.3 });
            return fuse.search(debouncedGlobalFilter).map(result => result.item);
        }
        return data;
    }, [attendanceData, debouncedGlobalFilter, departmentFilter]);
    
     const sortedData = React.useMemo(() => {
        const sorted = [...filteredData];
        if (sorting.id) {
          sorted.sort((a, b) => {
            const aValue = (a as any)[sorting.id];
            const bValue = (b as any)[sorting.id];
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;
            // Special handling for date columns
            if (sorting.id === 'createdAt') {
              const aTime = aValue ? new Date(aValue).getTime() : 0;
              const bTime = bValue ? new Date(bValue).getTime() : 0;
              return sorting.desc ? bTime - aTime : aTime - bTime;
            }
            if (aValue < bValue) return sorting.desc ? 1 : -1;
            if (aValue > bValue) return sorting.desc ? -1 : 1;
            return 0;
          });
        }
        return sorted;
     }, [filteredData, sorting]);

        const handleExport = React.useCallback(() => {
            // Re-check data at call time to avoid stale closure
            const currentFilteredData = (() => {
                let data = attendanceData;
                if (departmentFilter !== 'all') {
                    data = data.filter(row => row.department === departmentFilter);
                }
                if (debouncedGlobalFilter) {
                    const fuse = new Fuse(data, { keys: ["fullName", "employeeId"], threshold: 0.3 });
                    return fuse.search(debouncedGlobalFilter).map(result => result.item);
                }
                return data;
            })();
            
            // Debug: Log data để kiểm tra
            console.log('Export - currentMonthKey:', formatDateCustom(currentDate, 'yyyy-MM'));
            console.log('Export - attendanceData length:', attendanceData.length);
            console.log('Export - currentFilteredData length:', currentFilteredData.length);
            
            // Check store directly
            const storeData = getAttendanceData(formatDateCustom(currentDate, 'yyyy-MM'));
            console.log('Export - storeData:', storeData ? `${storeData.length} rows` : 'NULL');
            if (storeData && storeData.length > 0) {
                console.log('Export - Store sample day_1:', JSON.stringify(storeData[0]?.day_1));
                console.log('Export - Store sample day_3:', JSON.stringify(storeData[0]?.day_3));
            }
            
            if (currentFilteredData.length > 0) {
                console.log('Export - State sample day_1:', JSON.stringify(currentFilteredData[0]?.day_1));
                console.log('Export - State sample day_3:', JSON.stringify(currentFilteredData[0]?.day_3));
            }
            
            const dataToExport = currentFilteredData;
            if (dataToExport.length === 0) {
                toast.error('Không có dữ liệu', {
                    description: 'Không có dữ liệu để xuất file',
                });
                return;
            }

            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const daysInMonth = new Date(year, month, 0).getDate();
            const startMonth = getStartOfMonth(currentDate);
            const endMonth = getEndOfMonth(currentDate);
            const startDate = startMonth ? toISODate(startMonth) : '';
            const endDate = endMonth ? toISODate(endMonth) : '';

            const wb = XLSX.utils.book_new();

            const employeeChunks: AttendanceDataRow[][] = [];
            for (let i = 0; i < dataToExport.length; i += 3) {
                employeeChunks.push(dataToExport.slice(i, i + 3));
            }

            employeeChunks.forEach((chunk, chunkIndex) => {
                const ws_data: any[][] = [];
                const merges: XLSX.Range[] = [];
            
                // General Headers - Row 0: Title
                ws_data[0] = [];
                ws_data[0][11] = 'Bảng nhật ký chấm công';
                
                // Row 1: Date info
                ws_data[1] = [];
                ws_data[1][33] = `Chấm công từ:${startDate}~${endDate}`;
                
                // Row 2: Created date
                ws_data[2] = [];
                ws_data[2][33] = `Ngày tạo:${formatDateCustom(new Date(), 'yyyy-MM-dd HH:mm:ss')}`;

                chunk.forEach((emp, empIndex) => {
                    // 15 cols per employee to match machine format
                    const startCol = empIndex * 15;

                    // Row 3: Employee name info
                    ws_data[3] = ws_data[3] || [];
                    ws_data[3][startCol + 0] = 'Phòng ban';
                    ws_data[3][startCol + 1] = 'CÔNG TY';
                    merges.push({ s: { r: 3, c: startCol + 1 }, e: { r: 3, c: startCol + 7 } });
                    ws_data[3][startCol + 8] = 'Họ tên';
                    ws_data[3][startCol + 9] = emp.fullName;
                    merges.push({ s: { r: 3, c: startCol + 9 }, e: { r: 3, c: startCol + 14 } });
                    
                    // Row 4: Date range & Employee ID
                    ws_data[4] = ws_data[4] || [];
                    ws_data[4][startCol + 0] = 'Ngày';
                    ws_data[4][startCol + 1] = `${startDate}~${endDate}`;
                    merges.push({ s: { r: 4, c: startCol + 1 }, e: { r: 4, c: startCol + 7 } });
                    ws_data[4][startCol + 8] = 'Mã';
                    ws_data[4][startCol + 9] = emp.employeeId;

                    // Row 5-6: Summary headers
                    ws_data[5] = ws_data[5] || [];
                    ws_data[5][startCol + 0] = 'Nghỉ không\nphép (ngày)';
                    ws_data[5][startCol + 1] = 'Nghỉ\nphép\n(ngày)';
                    ws_data[5][startCol + 2] = 'Công tác\n(ngày)';
                    ws_data[5][startCol + 4] = 'Đi làm\n(ngày)';
                    ws_data[5][startCol + 5] = 'Tăng ca (tiếng)';
                    merges.push({ s: { r: 5, c: startCol + 5 }, e: { r: 5, c: startCol + 7 } });
                    ws_data[5][startCol + 8] = 'Đến muộn';
                    merges.push({ s: { r: 5, c: startCol + 8 }, e: { r: 5, c: startCol + 10 } });
                    ws_data[5][startCol + 11] = 'Về sớm';
                    merges.push({ s: { r: 5, c: startCol + 11 }, e: { r: 5, c: startCol + 13 } });
                    
                    ws_data[6] = ws_data[6] || [];
                    ws_data[6][startCol + 5] = 'Bình\nthường';
                    ws_data[6][startCol + 7] = 'Đặc\nbiệt';
                    ws_data[6][startCol + 8] = '(Lần)';
                    ws_data[6][startCol + 9] = '(Phút)';
                    ws_data[6][startCol + 11] = '(Lần)';
                    ws_data[6][startCol + 13] = '(Phút)';
                    
                    // Row 7: Summary data
                    ws_data[7] = ws_data[7] || [];
                    ws_data[7][startCol + 0] = emp.absentDays || 0;
                    ws_data[7][startCol + 1] = emp.leaveDays || 0;
                    ws_data[7][startCol + 2] = 0; // Công tác
                    ws_data[7][startCol + 4] = emp.workDays || 0;
                    ws_data[7][startCol + 5] = emp.otHours || 0;
                    ws_data[7][startCol + 8] = emp.lateArrivals || 0;
                    ws_data[7][startCol + 11] = emp.earlyDepartures || 0;

                    // Row 9: "Bảng chấm công" header
                    ws_data[9] = ws_data[9] || [];
                    ws_data[9][startCol + 0] = 'Bảng chấm công';
                    merges.push({ s: { r: 9, c: startCol + 0 }, e: { r: 9, c: startCol + 14 } });

                    // Row 10: Main headers (Ngày Thứ, Sáng, Chiều, Tăng ca)
                    ws_data[10] = ws_data[10] || [];
                    ws_data[10][startCol + 0] = 'Ngày Thứ';
                    merges.push({ s: { r: 10, c: startCol + 0 }, e: { r: 11, c: startCol + 0 } });
                    ws_data[10][startCol + 1] = 'Sáng';
                    merges.push({ s: { r: 10, c: startCol + 1 }, e: { r: 10, c: startCol + 5 } });
                    ws_data[10][startCol + 6] = 'Chiều';
                    merges.push({ s: { r: 10, c: startCol + 6 }, e: { r: 10, c: startCol + 9 } });
                    ws_data[10][startCol + 10] = 'Tăng ca';
                    merges.push({ s: { r: 10, c: startCol + 10 }, e: { r: 10, c: startCol + 14 } });

                    // Row 11: Sub headers
                    ws_data[11] = ws_data[11] || [];
                    ws_data[11][startCol + 1] = 'Làm việc';
                    merges.push({ s: { r: 11, c: startCol + 1 }, e: { r: 11, c: startCol + 2 } });
                    ws_data[11][startCol + 3] = 'Tan làm';
                    merges.push({ s: { r: 11, c: startCol + 3 }, e: { r: 11, c: startCol + 5 } });
                    ws_data[11][startCol + 6] = 'Làm việc';
                    merges.push({ s: { r: 11, c: startCol + 6 }, e: { r: 11, c: startCol + 7 } });
                    ws_data[11][startCol + 8] = 'Tan làm';
                    merges.push({ s: { r: 11, c: startCol + 8 }, e: { r: 11, c: startCol + 9 } });
                    ws_data[11][startCol + 10] = 'Đánh dấu\nđến';
                    merges.push({ s: { r: 11, c: startCol + 10 }, e: { r: 11, c: startCol + 11 } });
                    ws_data[11][startCol + 12] = 'Đánh dấu\nvề';
                    merges.push({ s: { r: 11, c: startCol + 12 }, e: { r: 11, c: startCol + 14 } });

                    // Data rows - start from row 12
                    for (let day = 1; day <= daysInMonth; day++) {
                        const rowIndex = 11 + day;
                        const dataRow = ws_data[rowIndex] = ws_data[rowIndex] || [];
                        const date = new Date(year, month - 1, day);
                        const dayOfWeek = date.getDay();
                        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                        const dayStr = `${String(day).padStart(2, '0')} ${dayNames[dayOfWeek]}`;
                        
                        const dayKey = `day_${day}` as keyof AttendanceDataRow;
                        const record = emp[dayKey] as DailyRecord | undefined;

                        // Debug: Log record when exporting day 3
                        if (day === 3 && chunkIndex === 0 && empIndex === 0) {
                            console.log('Export Record day_3 for emp 0:', JSON.stringify(record));
                        }

                        dataRow[startCol + 0] = dayStr;
                        dataRow[startCol + 1] = record?.checkIn || null;           // Sáng - Làm việc
                        dataRow[startCol + 3] = record?.morningCheckOut || null;   // Sáng - Tan làm
                        dataRow[startCol + 6] = record?.afternoonCheckIn || null;  // Chiều - Làm việc
                        dataRow[startCol + 8] = record?.checkOut || null;          // Chiều - Tan làm
                        dataRow[startCol + 10] = record?.overtimeCheckIn || null;  // Tăng ca - Đánh dấu đến
                        dataRow[startCol + 12] = record?.overtimeCheckOut || null; // Tăng ca - Đánh dấu về
                    }
                });

                const ws = XLSX.utils.aoa_to_sheet(ws_data);
                ws['!merges'] = merges;
                XLSX.utils.book_append_sheet(wb, ws, chunkIndex === 0 ? '1,2,3' : `${chunkIndex * 3 + 1},${chunkIndex * 3 + 2},${chunkIndex * 3 + 3}`);
            });

            XLSX.writeFile(wb, `Bang_cham_cong_thang_${month}-${year}.xlsx`);

            toast.success('Xuất file thành công', {
                description: `Đã xuất ${dataToExport.length} nhân viên sang Excel`,
            });
        }, [attendanceData, departmentFilter, debouncedGlobalFilter, currentDate]);

        const handlePrint = React.useCallback(() => {
            if (!sortedData?.length) return;

            const storeSettings = createStoreSettings(storeInfo);
            const monthKey = formatDateCustom(currentDate, 'yyyy-MM');
            const departmentName = departmentFilter !== 'all' 
                ? departments.find(d => d.systemId === departmentFilter)?.name 
                : undefined;

            const sheetForPrint = convertAttendanceSheetForPrint(
                monthKey,
                sortedData as any, // Cast to flexible interface
                {
                    isLocked,
                    departmentName,
                }
            );

            print('attendance', {
                data: mapAttendanceSheetToPrintData(sheetForPrint, storeSettings),
                lineItems: mapAttendanceSheetLineItems(sheetForPrint.employees, monthKey),
            });
        }, [sortedData, currentDate, departmentFilter, departments, isLocked, storeInfo, print]);

        const pageActions = React.useMemo(() => [
            isSelectionMode ? (
                <Button key="bulk-edit" variant="default" size="sm" className="h-9" disabled={selectedCellsArray.length === 0} onClick={() => setIsBulkEditDialogOpen(true)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Sửa {selectedCellsArray.length} ô
                </Button>
            ) : null,
            <Button 
                key="selection-mode" 
                variant={isSelectionMode ? "secondary" : "outline"} 
                size="sm" 
                className="h-9" 
                disabled={isLocked}
                onClick={() => {
                    setIsSelectionMode(!isSelectionMode);
                    if (isSelectionMode) setCellSelection({});
                }}
            >
                {isSelectionMode ? 'Thoát chế độ chọn' : 'Chọn nhiều ô'}
            </Button>,
            <Button key="print" variant="outline" size="sm" className="h-9" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                In
            </Button>,
            <Button key="import" variant="outline" size="sm" className="h-9" disabled={isLocked} onClick={() => setIsImportDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Nhập file
            </Button>,
            <Button key="export" variant="outline" size="sm" className="h-9" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Xuất file
            </Button>,
            <Button key={`lock-${currentMonthKey}`} size="sm" className="h-9" onClick={handleToggleLock}>
                <Lock className="mr-2 h-4 w-4" />
                {isLocked ? 'Mở khóa' : 'Khóa'}
            </Button>
        ].filter(Boolean), [
            isSelectionMode,
            selectedCellsArray.length,
            isLocked,
            handlePrint,
            handleExport,
            currentMonthKey,
            handleToggleLock
        ]);

        usePageHeader({
            title: 'Chấm công',
            breadcrumb: [
                { label: 'Nhân sự', href: ROUTES.HRM.EMPLOYEES, isCurrent: false },
                { label: 'Chấm công', href: ROUTES.HRM.ATTENDANCE, isCurrent: true }
            ],
            actions: pageActions
        });

    const handleEditRecord = React.useCallback((employeeSystemId: SystemId, day: number) => {
        if (isLocked) return;
        
        // If in selection mode, toggle selection instead
        if (isSelectionMode) {
            toggleCellSelection(employeeSystemId, day);
            return;
        }
        
        const employeeData = attendanceData.find(emp => emp.employeeSystemId === employeeSystemId);
        if (employeeData) {
            setEditingRecordInfo({
                employeeSystemId,
                day,
                record: employeeData[`day_${day}`] as DailyRecord,
            });
            setIsEditModalOpen(true);
        }
    }, [attendanceData, isLocked, isSelectionMode, toggleCellSelection]);

    const handleSaveRecord = (updatedRecord: DailyRecord) => {
        if (!editingRecordInfo) return;
    
        const updatedData = attendanceData.map(row => {
            if (row.employeeSystemId === editingRecordInfo.employeeSystemId) {
                const newRow = { ...row } as AnyAttendanceDataRow;
                newRow[`day_${editingRecordInfo.day}`] = updatedRecord;

                const summary = recalculateSummary(newRow, currentDate.getFullYear(), currentDate.getMonth() + 1, settings);

                return { ...newRow, ...summary } as AttendanceDataRow;
            }
            return row;
        });

        setAttendanceData(updatedData);
        saveAttendanceData(currentMonthKey, updatedData); // Save to store
    
        setIsEditModalOpen(false);
        setEditingRecordInfo(null);
        
        toast.success('Cập nhật thành công', {
            description: `Đã lưu chấm công ngày ${editingRecordInfo.day}`,
        });
    };

    // Columns - Pass cell selection state
    const columns = React.useMemo(
        () => getColumns(
            currentDate.getFullYear(), 
            currentDate.getMonth() + 1, 
            handleEditRecord, 
            settings, 
            isLocked,
            isSelectionMode,
            cellSelection,
            handleQuickFill
        ),
        [currentDate, handleEditRecord, settings, isLocked, isSelectionMode, cellSelection, handleQuickFill]
    );
    
    React.useEffect(() => {
        const initialVisibility: Record<string, boolean> = {};
        columns.forEach(c => {
          initialVisibility[c.id!] = true;
        });
        setColumnVisibility(initialVisibility);
        setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
        setPinnedColumns(['select', 'fullName']);
      }, [columns]);

    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const paginatedData = sortedData.slice(pagination.pageIndex * pagination.pageSize, pagination.pageIndex * pagination.pageSize + pagination.pageSize);

         const allSelectedRows = React.useMemo(() => 
                attendanceData.filter(att => rowSelection[att.systemId]),
            [attendanceData, rowSelection]);

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Statistics Dashboard */}
            <StatisticsDashboard data={filteredData} currentDate={currentDate} />
            
            <Card className="flex-shrink-0">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                           <MonthYearPicker value={currentDate} onChange={setCurrentDate} />
                           <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="h-9 w-full sm:w-[180px]">
                                    <SelectValue placeholder="Tất cả phòng ban" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả phòng ban</SelectItem>
                                    {departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                                </SelectContent>
                           </Select>
                           <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm nhân viên..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="h-9 w-[200px] pl-8"
                                />
                           </div>
                        </div>
                         <div className="flex items-center justify-end gap-2">
                            <DataTableColumnCustomizer
                                columns={columns}
                                columnVisibility={columnVisibility}
                                setColumnVisibility={setColumnVisibility}
                                columnOrder={columnOrder}
                                setColumnOrder={setColumnOrder}
                                pinnedColumns={pinnedColumns}
                                setPinnedColumns={setPinnedColumns}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ResponsiveDataTable
                columns={columns}
                data={paginatedData}
                rowCount={filteredData.length}
                pageCount={pageCount}
                pagination={pagination}
                setPagination={setPagination}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                sorting={sorting}
                setSorting={setSorting}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                columnOrder={columnOrder}
                setColumnOrder={setColumnOrder}
                pinnedColumns={pinnedColumns}
                setPinnedColumns={setPinnedColumns}
                className="flex-grow"
                allSelectedRows={allSelectedRows}
                expanded={{}}
                setExpanded={() => {}}
            />

            <AttendanceEditDialog
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                recordData={editingRecordInfo}
                onSave={handleSaveRecord}
                monthDate={currentDate}
            />

            <AttendanceImportDialog
                isOpen={isImportDialogOpen}
                onOpenChange={setIsImportDialogOpen}
                onConfirmImport={handleConfirmImport}
                employees={employees}
            />

            <BulkEditDialog
                isOpen={isBulkEditDialogOpen}
                onOpenChange={setIsBulkEditDialogOpen}
                selectedCells={selectedCellsArray}
                onSave={handleBulkSave}
            />

            <PenaltyConfirmDialog
                isOpen={isPenaltyConfirmOpen}
                onOpenChange={setIsPenaltyConfirmOpen}
                penalties={pendingPenalties}
                onConfirm={handleConfirmPenalties}
                onSkip={handleSkipPenalties}
            />
        </div>
    );
}
