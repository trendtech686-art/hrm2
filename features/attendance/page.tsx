import * as React from 'react';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getStartOfMonth, getEndOfMonth, addMonths, subtractMonths, toISODate, getDayOfWeek, formatMonthYear } from '../../lib/date-utils.ts';
import * as XLSX from 'xlsx';

import { useEmployeeStore } from '../employees/store.ts';
import { useDepartmentStore } from '../settings/departments/store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { generateMockAttendance } from './data.ts';
import { getColumns } from './columns.tsx';
import type { AttendanceDataRow, DailyRecord, AnyAttendanceDataRow, ImportPreviewRow } from './types.ts';
import { DataTable } from '../../components/data-table/data-table.tsx';
import { Card, CardContent } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Upload, Download, Lock, ChevronLeft, ChevronRight, Search, Edit2 } from 'lucide-react';
import Fuse from 'fuse.js';
import { AttendanceEditDialog } from './components/attendance-edit-dialog.tsx';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle.tsx';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store.ts';
import { useAttendanceStore } from './store.ts';
import { recalculateSummary, excelSerialToTime } from './utils.ts';
import { AttendanceImportDialog } from './components/attendance-import-dialog.tsx';
import { BulkEditDialog } from './components/bulk-edit-dialog.tsx';
import { StatisticsDashboard } from './components/statistics-dashboard.tsx';
import { useDebounce } from '../../hooks/use-debounce.ts';
import { useToast } from '../../hooks/use-toast.ts';

const MonthYearPicker = ({ value, onChange }: { value: Date, onChange: (date: Date) => void }) => {
    const displayText = formatDateCustom(value, 'MM/yyyy');
    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-10" onClick={() => { const prev = subtractMonths(value, 1); if (prev) onChange(prev); }}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-semibold text-sm w-24 text-center">{displayText}</div>
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
    const { lockedMonths, toggleLock, attendanceData: storedData, saveAttendanceData, getAttendanceData } = useAttendanceStore();
    const { toast } = useToast();

    // State
    const [currentDate, setCurrentDate] = React.useState(getCurrentDate());
    const [departmentFilter, setDepartmentFilter] = React.useState('all');
    const [globalFilter, setGlobalFilter] = React.useState('');
    const debouncedGlobalFilter = useDebounce(globalFilter, 300); // Debounce search
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'fullName', desc: false });
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
    const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
    const [attendanceData, setAttendanceData] = React.useState<AttendanceDataRow[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [editingRecordInfo, setEditingRecordInfo] = React.useState<{ employeeId: string; day: number; record: DailyRecord } | null>(null);
    const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
    
    // Bulk edit states
    const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] = React.useState(false);
    const [cellSelection, setCellSelection] = React.useState<Record<string, boolean>>({}); // key: "employeeId-day"
    const [isSelectionMode, setIsSelectionMode] = React.useState(false);

    const currentMonthKey = formatDateCustom(currentDate, 'yyyy-MM');
    const isLocked = !!lockedMonths[currentMonthKey];

    const handleExport = () => {
        const dataToExport = sortedData;
        if (dataToExport.length === 0) {
            toast({
                title: "Không có dữ liệu",
                description: "Không có dữ liệu để xuất file",
                variant: "destructive",
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
    
        const employeeChunks = [];
        for (let i = 0; i < dataToExport.length; i += 3) {
            employeeChunks.push(dataToExport.slice(i, i + 3));
        }
    
        employeeChunks.forEach((chunk, chunkIndex) => {
            const ws_data: any[][] = [];
            const merges: XLSX.Range[] = [];
            
            // General Headers
            ws_data[2] = [];
            ws_data[2][28] = `Chấm công từ:${startDate}~${endDate}`;
            ws_data[3] = [];
            ws_data[3][13] = 'Bảng nhật ký chấm công';
            merges.push({ s: { r: 3, c: 13 }, e: { r: 3, c: 15 } }); // Merge title
    
            chunk.forEach((emp, empIndex) => {
                const startCol = empIndex * 13;
                
                // Employee Info Header
                ws_data[4] = ws_data[4] || [];
                ws_data[4][startCol + 1] = 'Phòng ban';
                ws_data[4][startCol + 2] = 'CÔNG TY';
                merges.push({ s: { r: 4, c: startCol + 2 }, e: { r: 4, c: startCol + 4 } });
                ws_data[4][startCol + 5] = 'Họ tên';
                ws_data[4][startCol + 6] = emp.fullName;
                merges.push({ s: { r: 4, c: startCol + 6 }, e: { r: 4, c: startCol + 8 } });
                ws_data[4][startCol + 9] = 'Mã NV';
                ws_data[4][startCol + 10] = emp.id;
                
                const summaryRow = ws_data[6] = ws_data[6] || [];
                summaryRow[startCol+1] = 'Nghỉ không phép (ngày)';
                summaryRow[startCol+2] = emp.absentDays;
                summaryRow[startCol+3] = 'Công tác (ngày)';
                summaryRow[startCol+4] = 0; // Placeholder
                summaryRow[startCol+5] = 'Đi muộn (Lần)';
                summaryRow[startCol+6] = emp.lateArrivals;
                summaryRow[startCol+7] = 'Về sớm (Lần)';
                summaryRow[startCol+8] = emp.earlyDepartures || 0;

                const headerRow1 = ws_data[10] = ws_data[10] || [];
                headerRow1[startCol + 1] = 'Bảng chấm công';
                merges.push({ s: { r: 10, c: startCol + 1 }, e: { r: 10, c: startCol + 9 } });

                const headerRow2 = ws_data[11] = ws_data[11] || [];
                headerRow2[startCol + 1] = 'Ngày/Thứ'; merges.push({ s: { r: 11, c: startCol + 1 }, e: { r: 12, c: startCol + 1 } });
                headerRow2[startCol + 2] = 'Sáng'; merges.push({ s: { r: 11, c: startCol + 2 }, e: { r: 11, c: startCol + 3 } });
                headerRow2[startCol + 4] = 'Chiều'; merges.push({ s: { r: 11, c: startCol + 4 }, e: { r: 11, c: startCol + 5 } });
                headerRow2[startCol + 6] = 'Tăng ca'; merges.push({ s: { r: 11, c: startCol + 6 }, e: { r: 11, c: startCol + 7 } });

                const headerRow3 = ws_data[12] = ws_data[12] || [];
                headerRow3[startCol + 2] = 'Làm việc';
                headerRow3[startCol + 3] = 'Tan làm';
                headerRow3[startCol + 4] = 'Làm việc';
                headerRow3[startCol + 5] = 'Tan làm';
                headerRow3[startCol + 6] = 'Đánh dấu đến';
                headerRow3[startCol + 7] = 'Đánh dấu về';
                
                // Data Rows
                for (let day = 1; day <= daysInMonth; day++) {
                    const rowIndex = 12 + day;
                    const dataRow = ws_data[rowIndex] = ws_data[rowIndex] || [];
                    const date = new Date(year, month - 1, day);
                    const dayStr = formatDateCustom(date, 'dd EEE');
                    const record = emp[`day_${day}`] as DailyRecord | undefined;
                    
                    dataRow[startCol + 1] = dayStr;
                    dataRow[startCol + 2] = record?.checkIn || null;
                    dataRow[startCol + 5] = record?.checkOut || null;
                    dataRow[startCol + 6] = record?.overtimeCheckIn || null;
                    dataRow[startCol + 7] = record?.overtimeCheckOut || null;
                }
            });
            
            const ws = XLSX.utils.aoa_to_sheet(ws_data);
            ws['!merges'] = merges;
            XLSX.utils.book_append_sheet(wb, ws, `Sheet ${chunkIndex + 1}`);
        });
        
        XLSX.writeFile(wb, `Bang_cham_cong_thang_${month}-${year}.xlsx`);
        
        toast({
            title: "Xuất file thành công",
            description: `Đã xuất ${dataToExport.length} nhân viên sang Excel`,
        });
    };
    
    const handleConfirmImport = (
        importedData: Record<string, { day: number; checkIn?: string; checkOut?: string; overtimeCheckIn?: string; overtimeCheckOut?: string }[]>,
        date: Date
    ) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const baseAttendanceData = generateMockAttendance(employees, year, month, settings);

        const updatedData = baseAttendanceData.map(employeeRow => {
            const employeeUpdates = importedData[employeeRow.id];
            if (employeeUpdates) {
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
                    const hasTimeData = update.checkIn || update.checkOut;
                    
                    const newRecord: DailyRecord = { 
                        status: hasTimeData ? 'present' : 'absent',
                        checkIn: update.checkIn,
                        checkOut: update.checkOut,
                        overtimeCheckIn: update.overtimeCheckIn,
                        overtimeCheckOut: update.overtimeCheckOut,
                    };
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
        toast({
            title: "Nhập thành công",
            description: `Đã cập nhật chấm công cho tháng ${formatDateCustom(date, 'MM/yyyy')}`,
        });
    };

    // Bulk edit handlers
    const toggleCellSelection = React.useCallback((employeeId: string, day: number) => {
        if (!isSelectionMode || isLocked) return;
        
        const key = `${employeeId}-${day}`;
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

    const selectedCellsArray = React.useMemo(() => {
        return Object.keys(cellSelection).map(key => {
            const [employeeId, dayStr] = key.split('-');
            const employee = attendanceData.find(e => e.id === employeeId);
            return {
                employeeId,
                employeeName: employee?.fullName || '',
                day: parseInt(dayStr, 10),
            };
        });
    }, [cellSelection, attendanceData]);

    const handleBulkSave = (updates: Array<{ employeeId: string; day: number; record: DailyRecord }>) => {
        setAttendanceData(prevData =>
            prevData.map(row => {
                const employeeUpdates = updates.filter(u => u.employeeId === row.id);
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
            const employeeUpdates = updates.filter(u => u.employeeId === row.id);
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
        toast({
            title: "Cập nhật thành công",
            description: `Đã chỉnh sửa ${updates.length} ô`,
        });
    };

    const handleQuickFill = React.useCallback((employeeId: string, day: number) => {
        if (isLocked) return;
        
        // Double-click to quick fill with default work hours
        const defaultRecord: DailyRecord = {
            status: 'present',
            checkIn: settings.workStartTime,
            checkOut: settings.workEndTime,
        };

        setAttendanceData(prevData =>
            prevData.map(row => {
                if (row.id === employeeId) {
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
            if (row.id === employeeId) {
                const newRow = { ...row } as AnyAttendanceDataRow;
                newRow[`day_${day}`] = defaultRecord;
                const summary = recalculateSummary(newRow, currentDate.getFullYear(), currentDate.getMonth() + 1, settings);
                return { ...newRow, ...summary } as AttendanceDataRow;
            }
            return row;
        });
        saveAttendanceData(currentMonthKey, updatedData);

        toast({
            title: "Điền nhanh",
            description: "Đã áp dụng giờ làm việc mặc định",
        });
    }, [attendanceData, currentDate, settings, isLocked, currentMonthKey, saveAttendanceData, toast]);


    const pageActions = [
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
        <Button key="import" variant="outline" size="sm" className="h-9" disabled={isLocked} onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Nhập file
        </Button>,
        <Button key="export" variant="outline" size="sm" className="h-9" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Xuất file
        </Button>,
        <Button key="lock" size="sm" className="h-9" onClick={() => toggleLock(currentMonthKey)}>
            <Lock className="mr-2 h-4 w-4" />
            {isLocked ? 'Mở khóa' : 'Khóa'}
        </Button>
    ].filter(Boolean);

    usePageHeader({ actions: pageActions });


     React.useEffect(() => {
        // Load from store first, fallback to mock data
        const storedMonthData = getAttendanceData(currentMonthKey);
        if (storedMonthData && storedMonthData.length > 0) {
            setAttendanceData(storedMonthData);
        } else {
            const mockData = generateMockAttendance(employees, currentDate.getFullYear(), currentDate.getMonth() + 1, settings);
            setAttendanceData(mockData);
            saveAttendanceData(currentMonthKey, mockData); // Save initial mock data
        }
    }, [employees, currentDate, settings, currentMonthKey]);
    
    // Filtering logic with debounced search
    const filteredData = React.useMemo(() => {
        let data = attendanceData;
        if (departmentFilter !== 'all') {
            data = data.filter(row => row.department === departmentFilter);
        }
        if (debouncedGlobalFilter) {
            const fuse = new Fuse(data, { keys: ["fullName", "id"], threshold: 0.3 });
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
            if (aValue < bValue) return sorting.desc ? 1 : -1;
            if (aValue > bValue) return sorting.desc ? -1 : 1;
            return 0;
          });
        }
        return sorted;
     }, [filteredData, sorting]);

    const handleEditRecord = React.useCallback((employeeId: string, day: number) => {
        if (isLocked) return;
        
        // If in selection mode, toggle selection instead
        if (isSelectionMode) {
            toggleCellSelection(employeeId, day);
            return;
        }
        
        const employeeData = attendanceData.find(emp => emp.id === employeeId);
        if (employeeData) {
            setEditingRecordInfo({
                employeeId,
                day,
                record: employeeData[`day_${day}`] as DailyRecord,
            });
            setIsEditModalOpen(true);
        }
    }, [attendanceData, isLocked, isSelectionMode, toggleCellSelection]);

    const handleSaveRecord = (updatedRecord: DailyRecord) => {
        if (!editingRecordInfo) return;
    
        const updatedData = attendanceData.map(row => {
            if (row.id === editingRecordInfo.employeeId) {
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
        
        toast({
            title: "Cập nhật thành công",
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
        attendanceData.filter(att => rowSelection[att.id]),
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

            <DataTable
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
        </div>
    );
}
