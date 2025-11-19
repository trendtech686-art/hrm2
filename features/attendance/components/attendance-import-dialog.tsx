import * as React from 'react';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getStartOfMonth, getEndOfMonth, toISODate, addMonths, subtractMonths } from '../../../lib/date-utils.ts';
import * as XLSX from 'xlsx';
import type { Employee } from '../../employees/types.ts';
import type { DailyRecord, ImportPreviewRow } from '../types.ts';
import { excelSerialToTime } from '../utils.ts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Upload, FileText, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, AlertTriangle, Download, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils.ts';
import { Spinner } from '../../../components/ui/spinner.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table.tsx';
import { ScrollArea } from '../../../components/ui/scroll-area.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu.tsx';
import { AttendanceEditDialog } from './attendance-edit-dialog.tsx';
import type { SystemId } from '../../../lib/id-types.ts';
const MonthYearPicker = ({ value, onChange }: { value: Date, onChange: (date: Date) => void }) => {
    return (
        <div className="flex items-center gap-2 justify-center">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onChange(subtractMonths(value, 1))}><ChevronLeft className="h-4 w-4" /></Button>
            <div className="font-semibold text-sm w-24 text-center">{formatDateCustom(value, 'MM/yyyy')}</div>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onChange(addMonths(value, 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
    );
};

interface AttendanceImportDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    employees: Employee[];
    onConfirmImport: (
        importedData: Record<SystemId, { day: number; checkIn?: string; checkOut?: string; overtimeCheckIn?: string; overtimeCheckOut?: string }[]>,
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

    React.useEffect(() => {
        if (!isOpen) {
            setStep('upload');
            setFile(null);
            setPreviewData([]);
            setError(null);
            setRowSelection({});
            setEditingRowIndex(null);
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
    
        const employeeChunks = [];
        for (let i = 0; i < employees.length; i += 3) {
            employeeChunks.push(employees.slice(i, i + 3));
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
                
                const summaryHeaders = ['Nghỉ không phép (ngày)', 'Công tác (ngày)', 'Đi muộn (Lần)', 'Về sớm (Lần)'];
                for(let i = 0; i < summaryHeaders.length; i++) {
                    ws_data[6] = ws_data[6] || [];
                    ws_data[6][startCol + 1 + (i*2)] = summaryHeaders[i];
                }

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
                    dataRow[startCol + 1] = formatDateCustom(date, 'dd EEE');
                }
            });
            
            const ws = XLSX.utils.aoa_to_sheet(ws_data);
            ws['!merges'] = merges;
            XLSX.utils.book_append_sheet(wb, ws, `Sheet ${chunkIndex + 1}`);
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

                // Find date from the first sheet
                const firstWs = workbook.Sheets[workbook.SheetNames[0]];
                const firstJsonData: any[][] = XLSX.utils.sheet_to_json(firstWs, { header: 1, defval: null });
                for (let i = 0; i < 5 && i < firstJsonData.length; i++) { // Search in top 5 rows
                    const row = firstJsonData[i];
                    if (!row) continue;
                    const dateCell = row.find(cell => typeof cell === 'string' && cell.startsWith('Chấm công từ:'));
                    if (dateCell) {
                        const dateMatch = dateCell.match(/(\d{4}-\d{2}-\d{2})/);
                        if (dateMatch) {
                            fileDate = parseDate(dateMatch[1]);
                            setSelectedMonth(fileDate);
                            break;
                        }
                    }
                }
                if (!fileDate) throw new Error('Không tìm thấy định dạng ngày "Chấm công từ: YYYY-MM-DD~YYYY-MM-DD" trong file.');

                const newPreviewData: ImportPreviewRow[] = [];
                const foundEmployeeSystemIds = new Set<SystemId>();
                const employeeSystemIdsWithData = new Set<SystemId>();
                
                for (const sheetName of workbook.SheetNames) {
                    const ws = workbook.Sheets[sheetName];
                    const jsonData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
                    
                    // Process 3 employees horizontally
                    for (let empIndex = 0; empIndex < 3; empIndex++) {
                        const startCol = empIndex * 13;
                        
                        // Mã NV is in row 5 (index 4), a specific column
                        const idRow = jsonData[4] || [];
                        const employeeIdRaw = idRow[startCol + 10]; 
                        
                        if (!employeeIdRaw) continue;

                        const employee = employees.find(e => String(e.id).replace(/^NV0*/, '') === String(employeeIdRaw).replace(/^NV0*/, ''));
                        
                        if (!employee) {
                             newPreviewData.push({ excelRow: 5, sheetName, day: 0, status: 'warning', message: `Không tìm thấy nhân viên có mã '${employeeIdRaw}'.`, rawData: idRow });
                             continue;
                        }

                        foundEmployeeSystemIds.add(employee.systemId);
                        let hasDataForEmployee = false;
                        
                        // Data starts from row 14 (index 13)
                        const tableStartRow = 13;
                        for (let i = 0; i < (new Date(fileDate.getFullYear(), fileDate.getMonth() + 1, 0).getDate()); i++) {
                            const rowIdx = tableStartRow + i;
                            if (rowIdx >= jsonData.length || !jsonData[rowIdx]) continue;
                            const dataRow = jsonData[rowIdx];
                            
                            const dayStrCell = dataRow[startCol + 1];
                            if (!dayStrCell || typeof dayStrCell !== 'string') continue;
                            
                            const day = parseInt(dayStrCell.substring(0, 2), 10);
                            if (isNaN(day)) continue;

                            const checkIn = excelSerialToTime(dataRow[startCol + 2]);
                            // checkOut is in Chiều - Tan làm
                            const checkOut = excelSerialToTime(dataRow[startCol + 5]);
                            const overtimeCheckIn = excelSerialToTime(dataRow[startCol + 6]);
                            const overtimeCheckOut = excelSerialToTime(dataRow[startCol + 7]);

                            if (checkIn || checkOut || overtimeCheckIn || overtimeCheckOut) {
                                hasDataForEmployee = true;
                                newPreviewData.push({
                                    excelRow: rowIdx + 1, sheetName,
                                    employeeSystemId: employee.systemId,
                                    employeeId: employee.id,
                                    employeeName: employee.fullName,
                                    day, checkIn, checkOut, overtimeCheckIn, overtimeCheckOut,
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
        const groupedData: Record<SystemId, { day: number; checkIn?: string; checkOut?: string; overtimeCheckIn?: string; overtimeCheckOut?: string }[]> = {};
        
        validData.forEach(row => {
            const key = row.employeeSystemId!;
            if (!groupedData[key]) groupedData[key] = [];
            groupedData[key].push({ 
                day: row.day, 
                checkIn: row.checkIn, 
                checkOut: row.checkOut,
                overtimeCheckIn: row.overtimeCheckIn,
                overtimeCheckOut: row.overtimeCheckOut,
            });
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
    
        setPreviewData(prev => prev.map((row, index) => {
            if (index === editingRowIndex) {
                const hasTimeData = updatedRecord.checkIn || updatedRecord.checkOut || updatedRecord.overtimeCheckIn || updatedRecord.overtimeCheckOut;
                return {
                    ...row,
                    checkIn: updatedRecord.checkIn,
                    checkOut: updatedRecord.checkOut,
                    overtimeCheckIn: updatedRecord.overtimeCheckIn,
                    overtimeCheckOut: updatedRecord.overtimeCheckOut,
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
                <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Nhập file chấm công</DialogTitle>
                        {step === 'upload' && (
                            <>
                                <DialogDescription>Chọn tháng và tải lên file Excel để cập nhật chấm công hàng loạt.</DialogDescription>
                                <div className="text-sm text-muted-foreground pt-2">
                                    Bạn chưa có file? 
                                    <Button variant="link" type="button" className="p-0 h-auto px-1" onClick={handleDownloadTemplate}>
                                        <Download className="mr-1 h-3 w-3" />
                                        Tải file mẫu tại đây
                                    </Button>.
                                </div>
                            </>
                        )}
                        {step === 'preview' && 
                        <DialogDescription>
                            Đã tìm thấy {foundEmployeeCount} nhân viên trong file. {employeesWithDataCount > 0 ? `Xem trước dữ liệu cho ${employeesWithDataCount} nhân viên.` : 'Không có nhân viên nào có dữ liệu chấm công.'} Các dòng lỗi sẽ không được nhập. Nhấn "Xác nhận" để hoàn tất.
                        </DialogDescription>}
                    </DialogHeader>
                    
                    {step === 'upload' && (
                        <div className="flex-grow flex flex-col justify-center items-center gap-6">
                            <MonthYearPicker value={selectedMonth} onChange={setSelectedMonth} />
                            <div 
                                className={cn(
                                    "flex flex-col items-center justify-center w-full max-w-lg h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/75",
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
                                        <FileText className="mx-auto h-9 w-10 text-primary" />
                                        <p className="mt-2 font-semibold">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</p>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground p-4">
                                        <Upload className="mx-auto h-9 w-10" />
                                        <p className="mt-2">Kéo thả file vào đây hoặc nhấn để chọn file</p>
                                        <p className="text-xs mt-1">Định dạng hỗ trợ: .xlsx, .xls</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
                            </div>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="flex-grow flex flex-col min-h-0">
                            <div className="flex-shrink-0 flex justify-between items-center mb-2">
                                <h3 className="font-semibold">Xem trước dữ liệu cho tháng {formatDateCustom(selectedMonth, 'MM/yyyy')}</h3>
                                <div className="flex items-center gap-4 text-sm">
                                    {numSelected > 0 && <Button variant="destructive" size="sm" onClick={handleBulkDelete}><Trash2 className="mr-2 h-4 w-4" />Xóa {numSelected} mục</Button>}
                                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> {summary.okCount} Hợp lệ</span>
                                    <span className="flex items-center gap-1.5"><AlertCircle className="h-4 w-4 text-red-500" /> {summary.errorCount} Lỗi/Cảnh báo</span>
                                </div>
                            </div>
                            <ScrollArea className="flex-grow border rounded-md">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-muted z-10">
                                        <TableRow>
                                            <TableHead className="w-12 text-center">
                                                <Checkbox checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false} onCheckedChange={(checked) => toggleAll(!!checked)} />
                                            </TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Nhân viên</TableHead>
                                            <TableHead>Ngày</TableHead>
                                            <TableHead>Giờ vào</TableHead>
                                            <TableHead>Giờ ra</TableHead>
                                            <TableHead>Giờ OT vào</TableHead>
                                            <TableHead>Giờ OT ra</TableHead>
                                            <TableHead>Ghi chú</TableHead>
                                            <TableHead className="w-20 text-right">Hành động</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {previewData.map((row, i) => (
                                            <TableRow key={`${row.excelRow}-${row.sheetName}-${i}`} className={row.status === 'error' ? 'bg-red-50' : row.status === 'warning' ? 'bg-yellow-50' : ''}>
                                                <TableCell className="text-center">
                                                    <Checkbox checked={!!rowSelection[i]} onCheckedChange={() => toggleRow(i)} />
                                                </TableCell>
                                                <TableCell className="text-center">{statusIcons[row.status]}</TableCell>
                                                <TableCell>{row.employeeName}</TableCell>
                                                <TableCell>{row.day || '-'}</TableCell>
                                                <TableCell>{row.checkIn || '-'}</TableCell>
                                                <TableCell>{row.checkOut || '-'}</TableCell>
                                                <TableCell>{row.overtimeCheckIn || '-'}</TableCell>
                                                <TableCell>{row.overtimeCheckOut || '-'}</TableCell>
                                                <TableCell className={row.status !== 'ok' ? 'text-destructive' : 'text-muted-foreground'}>{row.message}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onSelect={() => handleEdit(i)}><Edit className="mr-2 h-4 w-4" />Sửa</DropdownMenuItem>
                                                            <DropdownMenuItem onSelect={() => handleDelete(i)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Xóa</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    )}
                    
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>Thoát</Button>
                        {step === 'upload' && <Button onClick={handleProcessFile} disabled={!file || isLoading}>{isLoading && <Spinner className="mr-2 h-4 w-4"/>}Tiếp tục</Button>}
                        {step === 'preview' && (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={() => setStep('upload')}>Quay lại</Button>
                                <Button onClick={handleConfirm} disabled={summary.okCount === 0}>Xác nhận & Nhập {summary.okCount} dòng</Button>
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
            />
        </>
    );
}
