/**
 * Order Print Button with Dropdown
 * Nút In với dropdown menu để chọn khổ giấy + Xuất Excel hóa đơn
 * ✅ Dùng chung hook useOrderPrintHandlers — không còn usePrint() riêng
 */

import * as React from 'react';
import { Button } from '../../../components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../../components/ui/dropdown-menu';
import { Printer, ChevronDown, Tag, FileSpreadsheet, Warehouse, FileText, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { PaperSize } from '../../settings/printer/types';
import type { Order } from '../types';
import { useOrderPrintHandlers } from '../hooks/use-order-print-handlers';
import { useAllTaxesData } from '../../settings/taxes/hooks/use-all-taxes';
import { useStoreInfoData } from '../../settings/store-info/hooks/use-store-info';
import { exportInvoiceExcel, type InvoiceExportMode } from '@/lib/invoice-export';

const PAPER_SIZES: { value: PaperSize; label: string }[] = [
  { value: 'A4', label: 'In hóa đơn bán hàng' },
];

interface OrderPrintButtonProps {
  order: Order;
  onPrintProductLabels?: () => void;
}

export function OrderPrintButton({
  order,
  onPrintProductLabels,
}: OrderPrintButtonProps) {
  const { handlePrintOrder } = useOrderPrintHandlers();
  const { getDefaultExcelExport } = useAllTaxesData();
  const { info: storeInfo } = useStoreInfoData();
  const [isExporting, setIsExporting] = React.useState(false);

  const handlePrint = React.useCallback((paperSize?: PaperSize) => {
    handlePrintOrder(order, paperSize);
  }, [order, handlePrintOrder]);

  const handleDefaultPrint = React.useCallback(() => {
    handlePrint();
  }, [handlePrint]);

  const handleExportInvoice = React.useCallback(async (mode: InvoiceExportMode) => {
    if (isExporting) return;

    const excelTax = getDefaultExcelExport();
    const vatRate = excelTax ? Number(excelTax.rate) : 0;

    if (mode === 'full-vat' && vatRate === 0) {
      toast.error('Chưa cài đặt thuế mặc định xuất Excel', {
        description: 'Vui lòng vào Cài đặt > Giá & Thuế > bật cột MĐ xuất Excel cho thuế suất mong muốn.',
      });
      return;
    }

    setIsExporting(true);
    try {
      const result = await exportInvoiceExcel({ order, storeInfo, mode, vatRate });
      toast.success('Xuất hóa đơn thành công', {
        description: result.fileName,
      });
      // Log activity
      try {
        const label = mode === 'full-vat' ? 'Xuất Excel Full VAT' : 'Xuất Excel chưa VAT';
        await fetch('/api/activity-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entityType: 'order',
            entityId: order.systemId,
            action: label,
            actionType: 'system',
            note: `${label} - ${result.fileName}`,
          }),
        });
        window.dispatchEvent(new CustomEvent('activity-log-updated', {
          detail: { entityType: 'order', entityId: order.systemId },
        }));
      } catch { /* ignore log errors */ }
    } catch (_error) {
      toast.error('Không thể xuất hóa đơn');
    } finally {
      setIsExporting(false);
    }
  }, [order, storeInfo, getDefaultExcelExport, isExporting]);

  return (
    <div className="flex">
      {/* Nút In chính - In đơn hàng với khổ giấy mặc định */}
      <Button
        variant="outline"
        size="sm"
        className="h-7 rounded-r-none border-r-0"
        onClick={handleDefaultPrint}
      >
        <Printer className="mr-2 h-4 w-4" />
        In
      </Button>

      {/* Dropdown để chọn khổ giấy */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-1.5 rounded-l-none"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {PAPER_SIZES.map((size) => (
            <DropdownMenuItem 
              key={size.value}
              onClick={() => handlePrint(size.value)}
            >
              <Printer className="mr-2 h-4 w-4" />
              {size.label}
            </DropdownMenuItem>
          ))}
          {onPrintProductLabels && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onPrintProductLabels}>
                <Tag className="mr-2 h-4 w-4" />
                In tem phụ
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handlePrintOrder(order, undefined, 'stock-out')}>
            <Warehouse className="mr-2 h-4 w-4" />
            In phiếu xuất kho
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePrintOrder(order, undefined, 'sales-contract')}>
            <FileText className="mr-2 h-4 w-4" />
            In hợp đồng mua bán
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePrintOrder(order, undefined, 'goods-handover-report')}>
            <ClipboardCheck className="mr-2 h-4 w-4" />
            In biên bản giao nhận
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleExportInvoice('no-vat')}
            disabled={isExporting}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Xuất Excel chưa VAT
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExportInvoice('full-vat')}
            disabled={isExporting}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Xuất Excel Full VAT
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
