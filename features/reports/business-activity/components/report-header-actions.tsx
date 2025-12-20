/**
 * Report Header Actions Component
 * 
 * Nút xuất báo cáo, nhân bản, giải thích thuật ngữ
 */

import * as React from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Download, Copy, HelpCircle, Printer, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface ExportColumn {
  key: string;
  label: string;
  selected?: boolean;
}

interface ReportHeaderActionsProps {
  title: string;
  data: Record<string, unknown>[];
  columns: ExportColumn[];
  onDuplicate?: () => void;
  showDuplicate?: boolean;
  glossary?: { term: string; definition: string }[];
}

export function ReportHeaderActions({
  title,
  data,
  columns,
  onDuplicate,
  showDuplicate = false,
  glossary,
}: ReportHeaderActionsProps) {
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [glossaryOpen, setGlossaryOpen] = React.useState(false);
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(
    columns.filter(c => c.selected !== false).map(c => c.key)
  );
  
  const handleExportExcel = () => {
    try {
      // Filter columns
      const exportColumns = columns.filter(c => selectedColumns.includes(c.key));
      
      // Prepare data
      const exportData = data.map(row => {
        const obj: Record<string, unknown> = {};
        exportColumns.forEach(col => {
          obj[col.label] = row[col.key];
        });
        return obj;
      });
      
      // Create workbook
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo');
      
      // Generate filename
      const filename = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Save file
      XLSX.writeFile(wb, filename);
      
      toast.success('Xuất báo cáo thành công!');
      setExportDialogOpen(false);
    } catch (error) {
      toast.error('Lỗi khi xuất báo cáo');
      console.error(error);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const toggleColumn = (key: string) => {
    setSelectedColumns(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };
  
  const selectAllColumns = () => {
    setSelectedColumns(columns.map(c => c.key));
  };
  
  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };
  
  return (
    <div className="flex items-center gap-2">
      {/* Duplicate button */}
      {showDuplicate && onDuplicate && (
        <Button variant="outline" size="sm" onClick={onDuplicate}>
          <Copy className="h-4 w-4 mr-2" />
          Nhân bản
        </Button>
      )}
      
      {/* Export button */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xuất báo cáo Excel</DialogTitle>
            <DialogDescription>
              Chọn các cột dữ liệu bạn muốn xuất
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cột dữ liệu</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAllColumns}>
                  Chọn tất cả
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAllColumns}>
                  Bỏ chọn tất cả
                </Button>
              </div>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {columns.map(col => (
                <div key={col.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={col.key}
                    checked={selectedColumns.includes(col.key)}
                    onCheckedChange={() => toggleColumn(col.key)}
                  />
                  <Label htmlFor={col.key} className="text-sm cursor-pointer">
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleExportExcel} disabled={selectedColumns.length === 0}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Print button */}
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-2" />
        In
      </Button>
      
      {/* Glossary button */}
      {glossary && glossary.length > 0 && (
        <Dialog open={glossaryOpen} onOpenChange={setGlossaryOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Giải thích thuật ngữ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Giải thích thuật ngữ</DialogTitle>
              <DialogDescription>
                Định nghĩa các thuật ngữ trong báo cáo
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {glossary.map((item, index) => (
                <div key={index} className="space-y-1">
                  <h4 className="font-medium text-sm">{item.term}</h4>
                  <p className="text-sm text-muted-foreground">{item.definition}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Default glossary for sales reports
export const SALES_REPORT_GLOSSARY = [
  { term: 'Doanh thu', definition: 'Tổng tiền hàng bán ra trừ đi tiền hàng trả lại.' },
  { term: 'Lợi nhuận gộp', definition: 'Doanh thu trừ đi giá vốn hàng bán.' },
  { term: 'Tiền hàng', definition: 'Tổng giá trị các sản phẩm trong đơn hàng.' },
  { term: 'Tiền hàng trả lại', definition: 'Tổng giá trị các sản phẩm đã trả lại.' },
  { term: 'Tiền thuế', definition: 'Tổng tiền thuế VAT trong đơn hàng.' },
  { term: 'Phí giao hàng', definition: 'Chi phí vận chuyển đơn hàng.' },
  { term: 'SL đơn hàng', definition: 'Số lượng đơn hàng trong khoảng thời gian.' },
  { term: 'Giá vốn', definition: 'Chi phí mua hàng hoặc sản xuất sản phẩm.' },
];

export const DELIVERY_REPORT_GLOSSARY = [
  { term: 'Tỷ lệ giao thành công', definition: 'Số đơn giao thành công / Tổng số đơn x 100%.' },
  { term: 'COD', definition: 'Số tiền thu hộ khi giao hàng (Cash On Delivery).' },
  { term: 'Phí vận chuyển', definition: 'Chi phí vận chuyển đơn hàng.' },
  { term: 'Thời gian giao hàng', definition: 'Khoảng thời gian từ lúc xuất kho đến khi giao thành công.' },
];

export const PAYMENT_REPORT_GLOSSARY = [
  { term: 'Giao dịch', definition: 'Một lần thanh toán hoặc thu tiền.' },
  { term: 'Phương thức thanh toán', definition: 'Cách thức khách hàng thanh toán: tiền mặt, chuyển khoản, thẻ...' },
];

export default ReportHeaderActions;
