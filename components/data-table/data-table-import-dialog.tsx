import * as React from 'react';
import { toast } from 'sonner';
import { Upload, FileText, X } from 'lucide-react';
// XLSX is lazy loaded in parseFileForPreview and handleDownloadTemplate to reduce bundle size (~500KB)
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { cn } from '../../lib/utils';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

export type ImportConfig<TData> = {
  importer: (data: Omit<TData, 'id'>[]) => void;
  fileName: string;
  existingData?: TData[]; // For checking duplicates
  getUniqueKey?: (item: TData | Omit<TData, 'id'>) => string; // Function to get unique identifier
  templateUrl?: string; // URL to download template file (e.g., '/templates/Mau_Nhap_Khach_Hang.xlsx')
};

interface DataTableImportDialogProps<TData> {
  children?: React.ReactNode;
  config: ImportConfig<TData>;
}

type PreviewRow = {
  id: string;
  data: Record<string, unknown>;
  status: 'new' | 'update' | 'duplicate';
};

export function DataTableImportDialog<TData>({ children, config }: DataTableImportDialogProps<TData>) {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [previewData, setPreviewData] = React.useState<PreviewRow[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [step, setStep] = React.useState<'upload' | 'preview'>('upload');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && (selectedFile.type.includes('spreadsheet') || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls') || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile);
      // Parse file immediately for preview
      parseFileForPreview(selectedFile);
      setStep('preview');
    } else {
      setFile(null);
      toast.error("Vui lòng chọn một file Excel hợp lệ (.xlsx, .xls, .csv).");
    }
  };

  const parseFileForPreview = async (file: File) => {
    // Lazy load XLSX to reduce bundle size (~500KB)
    const XLSX = await import('xlsx');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet);
        
        // Check for duplicates and updates
        const previews: PreviewRow[] = json.map((row, index) => {
          const rowId = `row-${index}`;
          let status: 'new' | 'update' | 'duplicate' = 'new';
          
          if (config.existingData && config.getUniqueKey) {
            const uniqueKey = config.getUniqueKey(row as Omit<TData, 'id'>);
            const exists = config.existingData.some(item => 
              config.getUniqueKey!(item) === uniqueKey
            );
            
            if (exists) {
              status = 'update'; // Will update existing record
            }
          }
          
          return {
            id: rowId,
            data: row,
            status
          };
        });
        
        setPreviewData(previews);
        // Select all by default
        setSelectedRows(new Set(previews.map(p => p.id)));
        setStep('preview');
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        toast.error("Đã có lỗi xảy ra khi đọc file. Vui lòng kiểm tra định dạng file và thử lại.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleImport = () => {
    const selectedData = previewData
      .filter(row => selectedRows.has(row.id))
      .map(row => row.data);
    
    if (selectedData.length === 0) {
      toast.error("Vui lòng chọn ít nhất một dòng để nhập.");
      return;
    }
    
    config.importer(selectedData as Omit<TData, 'id'>[]);
    toast.success(`Nhập thành công ${selectedData.length} mục!`);
    handleClose();
  };
  
  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setPreviewData([]);
    setSelectedRows(new Set());
    setStep('upload');
  };
  
  const toggleRow = (rowId: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };
  
  const toggleAll = () => {
    if (selectedRows.size === previewData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(previewData.map(p => p.id)));
    }
  };
  
  const removeRow = (rowId: string) => {
    setPreviewData(prev => prev.filter(row => row.id !== rowId));
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(rowId);
      return newSet;
    });
  };
  
  const handleDownloadTemplate = async () => {
    // If templateUrl is provided, download from that URL
    if (config.templateUrl) {
      const link = document.createElement('a');
      link.href = config.templateUrl;
      link.download = config.templateUrl.split('/').pop() || `${config.fileName}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    // Lazy load XLSX to reduce bundle size (~500KB)
    const XLSX = await import('xlsx');
    
    // Fallback: Create a basic template
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["name", "manager"], // Example for departments
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${config.fileName}.xlsx`);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); else setOpen(true); }}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Nhập file
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={cn("sm:max-w-2xl", step === 'preview' && "max-w-4xl")}>
        <DialogHeader>
          <DialogTitle>
            {step === 'upload' ? 'Nhập file' : 'Xem trước dữ liệu'}
          </DialogTitle>
          <DialogDescription>
            {step === 'upload' 
              ? 'Tải lên file Excel để thêm dữ liệu hàng loạt.'
              : `${selectedRows.size} / ${previewData.length} dòng được chọn. Chọn các dòng bạn muốn nhập.`
            }
          </DialogDescription>
        </DialogHeader>
        
        {step === 'upload' ? (
          <div className="py-4 space-y-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 space-y-2">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Hướng dẫn nhập file
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>Tải mẫu file nhập <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 dark:text-blue-400" onClick={handleDownloadTemplate}>tại đây</Button> để đảm bảo đúng định dạng.</li>
                <li>File hỗ trợ định dạng: <strong>.XLSX, .XLS, .CSV</strong></li>
                <li>Dung lượng tối đa: <strong>2MB</strong></li>
                <li>Hệ thống sẽ tự động phát hiện dữ liệu trùng lặp và đề xuất cập nhật</li>
              </ul>
            </div>

            <div 
              className={cn(
                  "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all",
                  isDragging 
                    ? "border-primary bg-primary/10 scale-[1.02]" 
                    : "bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/50"
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {file ? (
                  <div className="text-center space-y-2">
                      <FileText className="mx-auto h-12 w-12 text-primary" />
                      <div>
                        <p className="text-sm font-semibold">{file.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          setPreviewData([]);
                        }}
                      >
                        Chọn file khác
                      </Button>
                  </div>
              ) : (
                  <div className="text-center space-y-2 p-6">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-semibold">Kéo thả file vào đây</p>
                        <p className="text-xs text-muted-foreground mt-1">hoặc nhấn để chọn file từ máy tính</p>
                      </div>
                  </div>
              )}
              <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".xlsx, .xls, .csv"
                  onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
              />
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border bg-card p-3">
                <div className="text-2xl font-bold text-green-600">
                  {previewData.filter(r => r.status === 'new').length}
                </div>
                <div className="text-xs text-muted-foreground">Dữ liệu mới</div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="text-2xl font-bold text-yellow-600">
                  {previewData.filter(r => r.status === 'update').length}
                </div>
                <div className="text-xs text-muted-foreground">Cập nhật</div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedRows.size}
                </div>
                <div className="text-xs text-muted-foreground">Đã chọn</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={selectedRows.size === previewData.length}
                  onCheckedChange={toggleAll}
                />
                <span className="text-sm font-medium">
                  Chọn tất cả ({previewData.length} dòng)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStep('upload');
                  setFile(null);
                  setPreviewData([]);
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Chọn file khác
              </Button>
            </div>
            
            <ScrollArea className="h-[420px] border rounded-lg">
              <div className="p-4 space-y-2">
                {previewData.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-3 opacity-50" />
                    <p>Không có dữ liệu để hiển thị</p>
                  </div>
                ) : (
                  previewData.map((row, index) => (
                    <div
                      key={row.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border transition-all",
                        selectedRows.has(row.id) 
                          ? "bg-primary/5 border-primary/50 shadow-sm" 
                          : "bg-background hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Checkbox 
                          checked={selectedRows.has(row.id)}
                          onCheckedChange={() => toggleRow(row.id)}
                          className="mt-1 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-muted-foreground">#{index + 1}</span>
                            {row.status === 'update' && (
                              <Badge variant="warning" className="text-xs">
                                🔄 Cập nhật
                              </Badge>
                            )}
                            {row.status === 'new' && (
                              <Badge variant="success" className="text-xs">
                                ✨ Mới
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            {Object.entries(row.data).slice(0, 4).map(([key, value]) => (
                              <div key={key} className="flex gap-2 min-w-0">
                                <span className="font-medium text-muted-foreground shrink-0">{key}:</span>
                                <span className="truncate">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeRow(row.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}
        
        <DialogFooter className="sm:justify-between">
          <div className="flex-1">
            {step === 'preview' && selectedRows.size === 0 && (
              <p className="text-sm text-destructive">⚠️ Vui lòng chọn ít nhất một dòng để nhập</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            {step === 'preview' && (
              <Button 
                type="button" 
                onClick={handleImport} 
                disabled={selectedRows.size === 0}
                className="min-w-[120px]"
              >
                <Upload className="mr-2 h-4 w-4" />
                Nhập {selectedRows.size} dòng
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
