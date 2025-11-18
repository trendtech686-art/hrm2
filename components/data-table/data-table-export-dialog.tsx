import * as React from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '../ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog.tsx';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group.tsx';
import { Label } from '../ui/label.tsx';
import { Checkbox } from '../ui/checkbox.tsx';
import type { ColumnDef } from './types.ts';

export type ExportConfig<TData> = {
  fileName: string;
  columns: ColumnDef<TData>[];
};

interface DataTableExportDialogProps<TData> {
  children?: React.ReactNode;
  allData: TData[];
  filteredData: TData[];
  pageData: TData[];
  config: ExportConfig<TData>;
}

export function DataTableExportDialog<TData>({ 
  children,
  allData, 
  filteredData,
  pageData,
  config 
}: DataTableExportDialogProps<TData>) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<'scope' | 'columns'>('scope');
  const [exportScope, setExportScope] = React.useState<'all' | 'filtered' | 'page'>('filtered');
  const [selectedColumns, setSelectedColumns] = React.useState<Record<string, boolean>>({});

  const exportableColumns = React.useMemo(
    () => config.columns.filter(c => c.id !== 'select' && c.id !== 'actions' && c.id !== 'expander' && c.id !== 'settings'),
    [config.columns]
  );
  
  React.useEffect(() => {
    if (open) {
      const initialSelection = Object.fromEntries(
        exportableColumns.map(c => [c.id, true])
      );
      setSelectedColumns(initialSelection);
    }
  }, [open, exportableColumns]);

  const handleExport = () => {
    let dataToExport: TData[];
    switch (exportScope) {
      case 'all':
        dataToExport = allData;
        break;
      case 'page':
        dataToExport = pageData;
        break;
      case 'filtered':
      default:
        dataToExport = filteredData;
        break;
    }

    const columnsToExport = exportableColumns.filter(c => selectedColumns[c.id]);
    
    const headers = columnsToExport.map(col => col.meta?.displayName ?? col.id);
    
    const mappedData = dataToExport.map(row => {
        const rowData: Record<string, any> = {};
        columnsToExport.forEach(col => {
            const key = col.accessorKey as keyof TData;
            rowData[col.meta?.displayName ?? col.id] = (row as any)[key as string];
        });
        return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(mappedData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${config.fileName}.xlsx`);

    setOpen(false);
  };
  
  const toggleSelectAll = (checked: boolean) => {
    const newSelection = Object.fromEntries(exportableColumns.map(c => [c.id, checked]));
    setSelectedColumns(newSelection);
  }
  
  const areAllSelected = exportableColumns.every(c => selectedColumns[c.id]);
  const isSomeSelected = exportableColumns.some(c => selectedColumns[c.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="ml-auto gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Xuất file</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {view === 'scope' ? (
          <>
            <DialogHeader>
              <DialogTitle>Xuất file danh sách</DialogTitle>
              <DialogDescription>
                Chọn phạm vi và tùy chọn các trường dữ liệu bạn muốn xuất ra file Excel.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Giới hạn kết quả xuất</Label>
                <RadioGroup value={exportScope} onValueChange={(v) => setExportScope(v as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="filtered" id="filtered" />
                    <Label htmlFor="filtered">Kết quả đã lọc ({filteredData.length} dòng)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="page" id="page" />
                    <Label htmlFor="page">Chỉ trang này ({pageData.length} dòng)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">Tất cả ({allData.length} dòng)</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button variant="link" className="p-0 h-auto" onClick={() => setView('columns')}>
                Tùy chọn trường hiển thị
              </Button>
            </div>
            <DialogFooter className="sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Thoát
              </Button>
              <Button type="button" onClick={handleExport}>
                Xuất file
              </Button>
            </DialogFooter>
          </>
        ) : (
           <>
            <DialogHeader>
              <div className="flex items-center -ml-4">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setView('scope')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle>Tùy chọn trường hiển thị</DialogTitle>
              </div>
              <DialogDescription>
                Chọn các cột bạn muốn đưa vào file xuất.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="select-all-columns"
                        checked={areAllSelected ? true : isSomeSelected ? "indeterminate" : false}
                        onCheckedChange={(value) => toggleSelectAll(!!value)}
                    />
                    <Label htmlFor="select-all-columns" className="font-semibold">Chọn tất cả</Label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-2">
                    {exportableColumns.map(col => (
                        <div key={col.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`col-${col.id}`}
                                checked={selectedColumns[col.id] || false}
                                onCheckedChange={(checked) => setSelectedColumns(prev => ({...prev, [col.id]: !!checked}))}
                            />
                            <Label htmlFor={`col-${col.id}`} className="text-sm font-normal">
                                {col.meta?.displayName ?? col.id}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
            <DialogFooter className="sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => setView('scope')}>
                Quay lại
              </Button>
              <Button type="button" onClick={handleExport}>
                Xuất file
              </Button>
            </DialogFooter>
           </>
        )}
      </DialogContent>
    </Dialog>
  );
}
