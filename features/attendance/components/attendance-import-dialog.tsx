import * as React from 'react';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getStartOfMonth, getEndOfMonth, toISODate, addMonths, subtractMonths } from '../../../lib/date-utils.ts';
import * as XLSX from 'xlsx';
import type { Employee } from '../../employees/types.ts';
import type { DailyRecord, ImportPreviewRow } from '../types.ts';
import { excelSerialToTime } from '../utils.ts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Upload, FileText, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, AlertTriangle, Download, MoreHorizontal, Edit, Trash2, Search } from 'lucide-react';
import { cn } from '../../../lib/utils.ts';
import { Spinner } from '../../../components/ui/spinner.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table.tsx';
import { ScrollArea, ScrollBar } from '../../../components/ui/scroll-area.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu.tsx';
import { AttendanceEditDialog } from './attendance-edit-dialog.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import type { SystemId } from '../../../lib/id-types.ts';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
const MonthYearPicker = ({ value, onChange }: { value: Date, onChange: (date: Date) => void }) => {
    return (
        <div className="flex items-center gap-2 justify-center">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => {
                const newDate = subtractMonths(value, 1);
                if (newDate) onChange(newDate);
            }}><ChevronLeft className="h-4 w-4" /></Button>
            <div className="font-semibold text-body-sm w-24 text-center">{formatDateCustom(value, 'MM/yyyy')}</div>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => {
                const newDate = addMonths(value, 1);
                if (newDate) onChange(newDate);
            }}><ChevronRight className="h-4 w-4" /></Button>
        </div>
    );
};

interface AttendanceImportDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    employees: Employee[];
    onConfirmImport: (
        importedData: Record<SystemId, { day: number; checkIn?: string; morningCheckOut?: string; afternoonCheckIn?: string; checkOut?: string; overtimeCheckIn?: string; overtimeCheckOut?: string }[]>,
        date: Date
    ) => void;
}

export function AttendanceImportDialog({ isOpen, onOpenChange, employees, onConfirmImport }: AttendanceImportDialogProps) {
    const [step, setStep] = React.useState<'upload' | 'preview'>('upload');
    const [file, setFile] = React.useState<File | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [previewData, setPreviewData] = React.useState<ImportPreviewRow[]>([]);
    const [selectedMonth, setSelectedMonth] = React.useState(getCurrentDate());
    const [error, setError] = React.useState<string | null>(null);
    
    // Summary state
    const [foundEmployeeCount, setFoundEmployeeCount] = React.useState(0);
    const [employeesWithDataCount, setEmployeesWithDataCount] = React.useState(0);

    // State for preview interactions
    const [rowSelection, setRowSelection] = React.useState<Record<number, boolean>>({}); // index as key
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [editingRowIndex, setEditingRowIndex] = React.useState<number | null>(null);

    // Search and pagination state
    const [searchQuery, setSearchQuery] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState<number>(20);

    React.useEffect(() => {
        if (!isOpen) {
            setStep('upload');
            setFile(null);
            setPreviewData([]);
            setError(null);
            setRowSelection({});
            setEditingRowIndex(null);
            setSearchQuery('');
            setCurrentPage(1);
        }
    }, [isOpen]);

    const handleFileChange = (selectedFile: File | null) => {
        if (selectedFile) {
            if (selectedFile.type.includes('spreadsheet') || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
                setFile(selectedFile);
                setError(null);
            } else {
                setError("Định dạng file không hợp lệ. Vui lòng chọn file Excel.");
            }
        }
    };
    
    const handleDownloadTemplate = () => {
        const wb = XLSX.utils.book_new();
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth() + 1;
        const daysInMonth = (new Date(year, month, 0).getDate());
        const startDate = toISODate(getStartOfMonth(selectedMonth));
        const endDate = toISODate(getEndOfMonth(selectedMonth));
    
        const employeeChunks: Employee[][] = [];
        for (let i = 0; i < employees.length; i += 3) {
            employeeChunks.push(employees.slice(i, i + 3));
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
                // Machine format: 15 cols per employee
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
                ws_data[4][startCol + 9] = emp.id;
                
                // Row 5-6: Summary headers (Nghỉ không phép, Nghỉ phép, Công tác, Đi làm, Tăng ca, Đến muộn, Về sớm)
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
                
                // Row 7: Summary data (empty for template)
                ws_data[7] = ws_data[7] || [];
                
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
                
                // Data Rows - start from row 12
                for (let day = 1; day <= daysInMonth; day++) {
                    const rowIndex = 11 + day;
                    const dataRow = ws_data[rowIndex] = ws_data[rowIndex] || [];
                    const date = new Date(year, month - 1, day);
                    const dayOfWeek = date.getDay();
                    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                    dataRow[startCol + 0] = `${String(day).padStart(2, '0')} ${dayNames[dayOfWeek]}`;
                }
            });
            
            const ws = XLSX.utils.aoa_to_sheet(ws_data);
            ws['!merges'] = merges;
            XLSX.utils.book_append_sheet(wb, ws, chunkIndex === 0 ? '1,2,3' : `${chunkIndex * 3 + 1},${chunkIndex * 3 + 2},${chunkIndex * 3 + 3}`);
        });

        XLSX.writeFile(wb, `Mau_cham_cong_thang_${month}-${year}.xlsx`);
    };

    const handleProcessFile = () => {
        if (!file) { setError("Vui lòng chọn một file."); return; }
        setIsLoading(true);
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
                let fileDate: Date | null = null;

                // Find date from the first sheet - support both formats
                const firstWs = workbook.Sheets[workbook.SheetNames[0]];
                const firstJsonData: any[][] = XLSX.utils.sheet_to_json(firstWs, { header: 1, defval: null });
                for (let i = 0; i < 5 && i < firstJsonData.length; i++) {
                    const row = firstJsonData[i];
                    if (!row) continue;
                    // Format 1: "Chấm công từ:YYYY-MM-DD~YYYY-MM-DD" (template chuẩn)
                    // Format 2: "Ngày thống kê:YYYY-MM-DD~YYYY-MM-DD" (file máy chấm công)
                    const dateCell = row.find(cell => 
                        typeof cell === 'string' && 
                        (cell.startsWith('Chấm công từ:') || cell.startsWith('Ngày thống kê:'))
                    );
                    if (dateCell) {
                        const dateMatch = dateCell.match(/(\d{4}-\d{2}-\d{2})/);
                        if (dateMatch) {
                            fileDate = parseDate(dateMatch[1]);
                            if (fileDate) setSelectedMonth(fileDate);
                            break;
                        }
                    }
                }
                if (!fileDate) throw new Error('Không tìm thấy định dạng ngày "Chấm công từ:" hoặc "Ngày thống kê:" trong file.');

                const newPreviewData: ImportPreviewRow[] = [];
                const foundEmployeeSystemIds = new Set<SystemId>();
                const employeeSystemIdsWithData = new Set<SystemId>();
                
                // Detect file format: check if sheet names are like "1,2,3" (máy chấm công) or "Sheet 1" (template)
                const isMachineFormat = workbook.SheetNames.some(name => /^\d+,\d+/.test(name));
                
                // Skip summary sheets for machine format
                const sheetsToProcess = isMachineFormat 
                    ? workbook.SheetNames.filter(name => /^\d+,\d+/.test(name))
                    : workbook.SheetNames;
                
                for (const sheetName of sheetsToProcess) {
                    const ws = workbook.Sheets[sheetName];
                    const jsonData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
                    
                    // Process 3 employees horizontally
                    // Both formats now use 15 cols/employee
                    const colsPerEmployee = 15;
                    
                    for (let empIndex = 0; empIndex < 3; empIndex++) {
                        const startCol = empIndex * colsPerEmployee;
                        
                        // Get employee ID and Name based on format
                        // Machine format: 
                        //   - Row 3 (index 3): "Họ tên" at startCol + 9
                        //   - Row 4 (index 4): "Mã" at startCol + 9
                        // Template format:
                        //   - Row 4 (index 4): "Họ tên" at startCol + 6, "Mã NV" at startCol + 10
                        
                        let employeeIdRaw: any;
                        let employeeNameRaw: any;
                        
                        if (isMachineFormat) {
                            const nameRow = jsonData[3] || [];
                            const idRow = jsonData[4] || [];
                            employeeNameRaw = nameRow[startCol + 9];
                            employeeIdRaw = idRow[startCol + 9];
                        } else {
                            // Template format: same positions as machine format
                            const nameRow = jsonData[3] || [];
                            const idRow = jsonData[4] || [];
                            employeeNameRaw = nameRow[startCol + 9];
                            employeeIdRaw = idRow[startCol + 9];
                        }
                        
                        if (!employeeIdRaw && !employeeNameRaw) continue;

                        // Find employee: Match by EXACT ID only (primary key)
                        // Không tự động convert "7" → "NV000007", phải khớp chính xác
                        let employee: Employee | undefined;
                        
                        // 1. Try matching by exact ID only
                        if (employeeIdRaw) {
                            const rawIdStr = String(employeeIdRaw).trim();
                            
                            // Exact match only - "7" must match "7", "NV000007" must match "NV000007"
                            employee = employees.find(e => String(e.id).trim() === rawIdStr);
                        }
                        
                        // 2. Fallback: Try matching by exact name only (no partial match)
                        if (!employee && employeeNameRaw) {
                            const normalizedName = String(employeeNameRaw).toLowerCase().trim();
                            employee = employees.find(e => 
                                e.fullName.toLowerCase().trim() === normalizedName
                            );
                        }
                        
                        if (!employee) {
                             const displayId = employeeIdRaw ? `Mã: ${employeeIdRaw}` : '';
                             const displayName = employeeNameRaw ? `Tên: ${employeeNameRaw}` : '';
                             newPreviewData.push({ 
                                 excelRow: 5, 
                                 sheetName, 
                                 day: 0, 
                                 status: 'warning', 
                                 message: `Không tìm thấy nhân viên trong hệ thống (${[displayId, displayName].filter(Boolean).join(', ')})`, 
                                 rawData: jsonData[4] || [] 
                             });
                             continue;
                        }

                        foundEmployeeSystemIds.add(employee.systemId);
                        let hasDataForEmployee = false;
                        
                        // Data starts from row 12 for both formats now
                        const tableStartRow = 12;
                        const daysInMonth = new Date(fileDate.getFullYear(), fileDate.getMonth() + 1, 0).getDate();
                        
                        for (let i = 0; i < daysInMonth; i++) {
                            const rowIdx = tableStartRow + i;
                            if (rowIdx >= jsonData.length || !jsonData[rowIdx]) continue;
                            const dataRow = jsonData[rowIdx];
                            
                            // Day string is at startCol + 0 for both formats
                            const dayStrCell = dataRow[startCol + 0];
                            if (!dayStrCell || typeof dayStrCell !== 'string') continue;
                            
                            const day = parseInt(dayStrCell.substring(0, 2), 10);
                            if (isNaN(day)) continue;

                            let checkIn: string | undefined;
                            let morningCheckOut: string | undefined;
                            let afternoonCheckIn: string | undefined;
                            let checkOut: string | undefined;
                            let overtimeCheckIn: string | undefined;
                            let overtimeCheckOut: string | undefined;
                            
                            if (isMachineFormat) {
                                // Machine format columns (15 cols per employee):
                                // startCol + 0: Ngày Thứ
                                // startCol + 1: Sáng Làm việc (check-in sáng)
                                // startCol + 3: Sáng Tan làm (check-out sáng)
                                // startCol + 6: Chiều Làm việc (check-in chiều)
                                // startCol + 8: Chiều Tan làm (check-out cuối ngày)
                                // startCol + 10: Tăng ca Đánh dấu đến
                                // startCol + 12: Tăng ca Đánh dấu về
                                checkIn = excelSerialToTime(dataRow[startCol + 1]);
                                morningCheckOut = excelSerialToTime(dataRow[startCol + 3]);
                                afternoonCheckIn = excelSerialToTime(dataRow[startCol + 6]);
                                checkOut = excelSerialToTime(dataRow[startCol + 8]);
                                overtimeCheckIn = excelSerialToTime(dataRow[startCol + 10]);
                                overtimeCheckOut = excelSerialToTime(dataRow[startCol + 12]);
                            } else {
                                // Template format: same column positions as machine format (15 cols per employee)
                                checkIn = excelSerialToTime(dataRow[startCol + 1]);
                                morningCheckOut = excelSerialToTime(dataRow[startCol + 3]);
                                afternoonCheckIn = excelSerialToTime(dataRow[startCol + 6]);
                                checkOut = excelSerialToTime(dataRow[startCol + 8]);
                                overtimeCheckIn = excelSerialToTime(dataRow[startCol + 10]);
                                overtimeCheckOut = excelSerialToTime(dataRow[startCol + 12]);
                            }

                            if (checkIn || morningCheckOut || afternoonCheckIn || checkOut || overtimeCheckIn || overtimeCheckOut) {
                                hasDataForEmployee = true;
                                newPreviewData.push({
                                    excelRow: rowIdx + 1, sheetName,
                                    employeeSystemId: employee.systemId,
                                    employeeId: employee.id,
                                    employeeName: employee.fullName,
                                    day, checkIn, morningCheckOut, afternoonCheckIn, checkOut, overtimeCheckIn, overtimeCheckOut,
                                    status: 'ok', message: 'Hợp lệ', rawData: dataRow,
                                });
                            }
                        }
                        if(hasDataForEmployee) {
                            employeeSystemIdsWithData.add(employee.systemId);
                        }
                    }
                }
                setFoundEmployeeCount(foundEmployeeSystemIds.size);
                setEmployeesWithDataCount(employeeSystemIdsWithData.size);
                setPreviewData(newPreviewData);
                setStep('preview');
            } catch (err: any) {
                setError(err.message || "Lỗi khi đọc file. Vui lòng kiểm tra lại cấu trúc file.");
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsBinaryString(file);
    };
    
    const handleConfirm = () => {
        const validData = previewData.filter(row => row.status === 'ok' && row.employeeSystemId);
        const groupedData: Record<SystemId, { day: number; checkIn?: string; morningCheckOut?: string; afternoonCheckIn?: string; checkOut?: string; overtimeCheckIn?: string; overtimeCheckOut?: string }[]> = {};
        
        validData.forEach(row => {
            const key = row.employeeSystemId!;
            if (!groupedData[key]) groupedData[key] = [];
            
            const entry: { day: number; checkIn?: string; morningCheckOut?: string; afternoonCheckIn?: string; checkOut?: string; overtimeCheckIn?: string; overtimeCheckOut?: string } = {
                day: row.day
            };
            if (row.checkIn) entry.checkIn = row.checkIn;
            if (row.morningCheckOut) entry.morningCheckOut = row.morningCheckOut;
            if (row.afternoonCheckIn) entry.afternoonCheckIn = row.afternoonCheckIn;
            if (row.checkOut) entry.checkOut = row.checkOut;
            if (row.overtimeCheckIn) entry.overtimeCheckIn = row.overtimeCheckIn;
            if (row.overtimeCheckOut) entry.overtimeCheckOut = row.overtimeCheckOut;
            
            groupedData[key].push(entry);
        });

        onConfirmImport(groupedData, selectedMonth);
        onOpenChange(false);
    };

    const summary = React.useMemo(() => {
        const okRows = previewData.filter(r => r.status === 'ok');
        const uniqueOkEntries = new Set(okRows.map(r => `${r.employeeSystemId}-${r.day}`)).size;
        const errorCount = previewData.filter(r => r.status === 'error' || r.status === 'warning').length;
        return { okCount: uniqueOkEntries, errorCount };
    }, [previewData]);

    // Filtered data based on search query
    const filteredData = React.useMemo(() => {
        if (!searchQuery.trim()) return previewData;
        const query = searchQuery.toLowerCase().trim();
        return previewData.filter(row => 
            row.employeeName?.toLowerCase().includes(query) ||
            row.employeeId?.toLowerCase().includes(query) ||
            String(row.day).includes(query) ||
            row.message?.toLowerCase().includes(query)
        );
    }, [previewData, searchQuery]);

    // Paginated data
    const paginatedData = React.useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    // Reset page when search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const statusIcons = {
        ok: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
        error: <AlertCircle className="h-4 w-4 text-red-500" />,
    };

    // Handlers for preview interactions
    const handleEdit = (index: number) => {
        const row = previewData[index];
        if (!row?.employeeSystemId) {
            return;
        }
        setEditingRowIndex(index);
        setIsEditDialogOpen(true);
    };
    
    const handleDelete = (index: number) => {
        setPreviewData(prev => prev.filter((_, i) => i !== index));
    };

    const handleBulkDelete = () => {
        const selectedIndices = Object.keys(rowSelection).map(Number);
        setPreviewData(prev => prev.filter((_, i) => !selectedIndices.includes(i)));
        setRowSelection({});
    };

    const handleSaveEdit = (updatedRecord: DailyRecord) => {
        if (editingRowIndex === null) return;
    
        setPreviewData((prev: ImportPreviewRow[]) => prev.map((row, index) => {
            if (index === editingRowIndex) {
                const hasTimeData = updatedRecord.checkIn || updatedRecord.morningCheckOut || updatedRecord.afternoonCheckIn || updatedRecord.checkOut || updatedRecord.overtimeCheckIn || updatedRecord.overtimeCheckOut;
                return {
                    ...row,
                    checkIn: updatedRecord.checkIn || undefined,
                    morningCheckOut: updatedRecord.morningCheckOut || undefined,
                    afternoonCheckIn: updatedRecord.afternoonCheckIn || undefined,
                    checkOut: updatedRecord.checkOut || undefined,
                    overtimeCheckIn: updatedRecord.overtimeCheckIn || undefined,
                    overtimeCheckOut: updatedRecord.overtimeCheckOut || undefined,
                    status: hasTimeData ? 'ok' : 'warning',
                    message: hasTimeData ? 'Đã chỉnh sửa' : 'Không có giờ chấm công'
                };
            }
            return row;
        }));
    
        setIsEditDialogOpen(false);
        setEditingRowIndex(null);
    };

    const editingRecordData = React.useMemo(() => {
        if (editingRowIndex === null) return null;
        const row = previewData[editingRowIndex];
        if (!row?.employeeSystemId) {
            return null;
        }
        return {
            employeeSystemId: row.employeeSystemId,
            day: row.day,
            record: {
                status: ((row.checkIn || row.checkOut) ? 'present' : 'absent') as 'present' | 'absent',
                checkIn: row.checkIn,
                morningCheckOut: row.morningCheckOut,
                afternoonCheckIn: row.afternoonCheckIn,
                checkOut: row.checkOut,
                overtimeCheckIn: row.overtimeCheckIn,
                overtimeCheckOut: row.overtimeCheckOut,
                notes: row.status === 'ok' ? '' : row.message,
            }
        };
    }, [editingRowIndex, previewData]);
    
    const numSelected = Object.keys(rowSelection).length;
    const isAllSelected = previewData.length > 0 && numSelected === previewData.length;
    const isSomeSelected = numSelected > 0 && numSelected < previewData.length;
    
    const toggleAll = (checked: boolean) => {
        if (checked) {
            const newSelection: Record<number, boolean> = {};
            previewData.forEach((_, index) => { newSelection[index] = true; });
            setRowSelection(newSelection);
        } else {
            setRowSelection({});
        }
    };
    
    const toggleRow = (index: number) => {
        setRowSelection(prev => {
            const newSelection = { ...prev };
            if (newSelection[index]) {
                delete newSelection[index];
            } else {
                newSelection[index] = true;
            }
            return newSelection;
        });
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col p-0">
                    <DialogHeader className="px-4 pt-4 pb-2">
                        <DialogTitle className="text-base">Nhập file chấm công</DialogTitle>
                        {step === 'upload' && (
                            <>
                                <DialogDescription className="text-xs">Chọn tháng và tải lên file Excel để cập nhật chấm công hàng loạt.</DialogDescription>
                                <div className="text-xs text-muted-foreground pt-1">
                                    Bạn chưa có file?  
                                    <Button variant="link" type="button" className="p-0 h-auto px-1 text-xs" onClick={handleDownloadTemplate}>
                                        <Download className="mr-1 h-3 w-3" />
                                        Tải file mẫu tại đây
                                    </Button>.
                                </div>
                            </>
                        )}
                        {step === 'preview' && 
                        <DialogDescription className="text-xs">
                            Đã tìm thấy {foundEmployeeCount} nhân viên trong file. {employeesWithDataCount > 0 ? `Xem trước dữ liệu cho ${employeesWithDataCount} nhân viên.` : 'Không có nhân viên nào có dữ liệu chấm công.'} Các dòng lỗi sẽ không được nhập. Nhấn "Xác nhận" để hoàn tất.
                        </DialogDescription>}
                    </DialogHeader>
                    
                    {step === 'upload' && (
                        <div className="flex-grow flex flex-col justify-center items-center gap-4 px-4 py-6">
                            <MonthYearPicker value={selectedMonth} onChange={setSelectedMonth} />
                            <div 
                                className={cn(
                                    "flex flex-col items-center justify-center w-full max-w-md h-36 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/75 transition-colors",
                                    isDragging && "border-primary bg-primary/10"
                                )}
                                onClick={() => fileInputRef.current?.click()}
                                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e.dataTransfer.files?.[0] || null); }}
                            >
                                {file ? (
                                    <div className="text-center">
                                        <FileText className="mx-auto h-8 w-8 text-primary" />
                                        <p className="mt-1.5 text-sm font-medium">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</p>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground p-4">
                                        <Upload className="mx-auto h-8 w-8" />
                                        <p className="mt-1.5 text-sm">Kéo thả file vào đây hoặc nhấn để chọn file</p>
                                        <p className="text-xs mt-1">Định dạng hỗ trợ: .xlsx, .xls</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
                            </div>
                            {error && <p className="text-xs text-destructive">{error}</p>}
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="flex-grow flex flex-col min-h-0 px-4">
                            {/* Header with title and summary */}
                            <div className="flex-shrink-0 flex justify-between items-center mb-2">
                                <h3 className="text-sm font-semibold">Xem trước dữ liệu cho tháng {formatDateCustom(selectedMonth, 'MM/yyyy')}</h3>
                                <div className="flex items-center gap-3 text-xs">
                                    {numSelected > 0 && (
                                        <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={handleBulkDelete}>
                                            <Trash2 className="mr-1.5 h-3 w-3" />Xóa {numSelected} mục
                                        </Button>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> {summary.okCount} Hợp lệ
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <AlertCircle className="h-3.5 w-3.5 text-red-500" /> {summary.errorCount} Lỗi/Cảnh báo
                                    </span>
                                </div>
                            </div>

                            {/* Search bar */}
                            <div className="flex-shrink-0 flex items-center gap-2 mb-2">
                                <div className="relative flex-1 max-w-xs">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm theo tên, mã NV, ngày..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-8 h-8 text-xs"
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {filteredData.length} dòng {searchQuery && `(lọc từ ${previewData.length})`}
                                </span>
                            </div>

                            {/* Table with horizontal and vertical scroll */}
                            <ScrollArea className="flex-grow border rounded-md h-[350px]">
                                <div className="min-w-[800px]">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-muted z-10">
                                            <TableRow className="hover:bg-muted">
                                                <TableHead className="w-10 text-center p-2">
                                                    <Checkbox 
                                                        checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false} 
                                                        onCheckedChange={(checked) => toggleAll(!!checked)} 
                                                        className="h-3.5 w-3.5"
                                                    />
                                                </TableHead>
                                                <TableHead className="w-16 p-2 text-xs">Trạng thái</TableHead>
                                                <TableHead className="p-2 text-xs min-w-[120px]">Nhân viên</TableHead>
                                                <TableHead className="w-14 p-2 text-xs text-center">Ngày</TableHead>
                                                <TableHead className="w-16 p-2 text-xs text-center">Sáng vào</TableHead>
                                                <TableHead className="w-16 p-2 text-xs text-center">Sáng ra</TableHead>
                                                <TableHead className="w-16 p-2 text-xs text-center">Chiều vào</TableHead>
                                                <TableHead className="w-16 p-2 text-xs text-center">Chiều ra</TableHead>
                                                <TableHead className="w-16 p-2 text-xs text-center">TC vào</TableHead>
                                                <TableHead className="w-16 p-2 text-xs text-center">TC ra</TableHead>
                                                <TableHead className="p-2 text-xs min-w-[100px]">Ghi chú</TableHead>
                                                <TableHead className="w-16 p-2 text-xs text-right">Hành động</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedData.map((row) => {
                                                // Find original index in previewData for selection
                                                const originalIndex = previewData.findIndex(r => r === row);
                                                return (
                                                    <TableRow 
                                                        key={`${row.excelRow}-${row.sheetName}-${originalIndex}`} 
                                                        className={cn(
                                                            "hover:bg-muted/50",
                                                            row.status === 'error' && 'bg-red-50',
                                                            row.status === 'warning' && 'bg-yellow-50'
                                                        )}
                                                    >
                                                        <TableCell className="text-center p-2">
                                                            <Checkbox 
                                                                checked={!!rowSelection[originalIndex]} 
                                                                onCheckedChange={() => toggleRow(originalIndex)}
                                                                className="h-3.5 w-3.5"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-center p-2">{statusIcons[row.status]}</TableCell>
                                                        <TableCell className="p-2 text-xs">{row.employeeName || '-'}</TableCell>
                                                        <TableCell className="p-2 text-xs text-center">{row.day || '-'}</TableCell>
                                                        <TableCell className="p-2 text-xs text-center font-mono">{row.checkIn || '-'}</TableCell>
                                                        <TableCell className="p-2 text-xs text-center font-mono">{row.morningCheckOut || '-'}</TableCell>
                                                        <TableCell className="p-2 text-xs text-center font-mono">{row.afternoonCheckIn || '-'}</TableCell>
                                                        <TableCell className="p-2 text-xs text-center font-mono">{row.checkOut || '-'}</TableCell>
                                                        <TableCell className="p-2 text-xs text-center font-mono">{row.overtimeCheckIn || '-'}</TableCell>
                                                        <TableCell className="p-2 text-xs text-center font-mono">{row.overtimeCheckOut || '-'}</TableCell>
                                                        <TableCell className={cn("p-2 text-xs", row.status !== 'ok' ? 'text-destructive' : 'text-muted-foreground')}>
                                                            {row.message}
                                                        </TableCell>
                                                        <TableCell className="text-right p-2">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                                                        <MoreHorizontal className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onSelect={() => handleEdit(originalIndex)} className="text-xs">
                                                                        <Edit className="mr-2 h-3.5 w-3.5" />Sửa
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onSelect={() => handleDelete(originalIndex)} className="text-destructive text-xs">
                                                                        <Trash2 className="mr-2 h-3.5 w-3.5" />Xóa
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            {paginatedData.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={12} className="text-center py-6 text-xs text-muted-foreground">
                                                        {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Không có dữ liệu'}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <ScrollBar orientation="horizontal" />
                                <ScrollBar orientation="vertical" />
                            </ScrollArea>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex-shrink-0 flex items-center justify-between mt-2 py-2 border-t">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>Hiển thị</span>
                                        <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                                            <SelectTrigger className="h-7 w-16 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PAGE_SIZE_OPTIONS.map(size => (
                                                    <SelectItem key={size} value={String(size)} className="text-xs">{size}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <span>/ trang</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-3.5 w-3.5" />
                                        </Button>
                                        <span className="text-xs px-2">
                                            Trang {currentPage} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <DialogFooter className="px-4 py-3 border-t">
                        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => onOpenChange(false)}>Thoát</Button>
                        {step === 'upload' && (
                            <Button size="sm" className="h-8 text-xs" onClick={handleProcessFile} disabled={!file || isLoading}>
                                {isLoading && <Spinner className="mr-1.5 h-3 w-3"/>}Tiếp tục
                            </Button>
                        )}
                        {step === 'preview' && (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setStep('upload')}>Quay lại</Button>
                                <Button size="sm" className="h-8 text-xs" onClick={handleConfirm} disabled={summary.okCount === 0}>
                                    Xác nhận & Nhập {summary.okCount} dòng
                                </Button>
                            </div>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AttendanceEditDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                recordData={editingRecordData}
                onSave={handleSaveEdit}
                monthDate={selectedMonth}
            />
        </>
    );
}
