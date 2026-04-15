'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Printer, FileSpreadsheet } from 'lucide-react';
import { Eye, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { usePenaltiesByEmployee } from '@/features/settings/penalties/hooks/use-all-penalties';
import { usePrint } from '@/lib/use-print';
import { fetchPrintData } from '@/lib/lazy-print-data';
import {
  convertPenaltyForPrint,
  mapPenaltyToPrintData,
  createStoreSettings as createPenaltyStoreSettings,
} from '@/lib/print/penalty-print-helper';
import { RelatedDataTable } from '@/components/data-table/related-data-table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ColumnDef } from '@/components/data-table/types';
import type { Penalty } from '@/features/settings/penalties/types';
import type { Employee } from '@/lib/types/prisma-extended';
import { penaltyStatusVariants, formatCurrency, formatDateDisplay } from './types';

// Helper function for lazy loading XLSX
async function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  headers: string[],
  sheetName: string,
  filename: string
) {
  const XLSX = await import('xlsx');
  const ws = XLSX.utils.json_to_sheet(data, { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

interface PenaltiesTabProps {
  employee: Employee;
}

export function PenaltiesTab({ employee }: PenaltiesTabProps) {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const { data: employeePenalties, pagination } = usePenaltiesByEmployee(employee.systemId, page);
  // ⚡ OPTIMIZED: storeInfo lazy loaded in print handlers
  const { print, printMultiple } = usePrint();

  const handlePrintSinglePenalty = React.useCallback(async (row: Penalty) => {
    const { storeInfo } = await fetchPrintData();
    const penaltyStoreSettings = createPenaltyStoreSettings(storeInfo);
    const penaltyForPrint = convertPenaltyForPrint(row, { employee });
    print('penalty', {
      data: mapPenaltyToPrintData(penaltyForPrint, penaltyStoreSettings),
      lineItems: [],
    });
  }, [employee, print]);

  const handleExportSinglePenalty = React.useCallback(async (row: Penalty) => {
    const headers = ['Mã phiếu', 'Lý do', 'Ngày lập', 'Trạng thái', 'Số tiền'];
    const mappedData = [{
      'Mã phiếu': row.id,
      'Lý do': row.reason,
      'Ngày lập': formatDateDisplay(row.issueDate),
      'Trạng thái': row.status,
      'Số tiền': row.amount,
    }];
    await exportToExcel(mappedData, headers, 'PhieuPhat', `PhieuPhat_${row.id}.xlsx`);
    toast.success('Đã xuất phiếu phạt ra Excel');
  }, []);

  const penaltyColumns: ColumnDef<Penalty>[] = React.useMemo(() => [
    { id: 'id', accessorKey: 'id', header: 'Mã Phiếu', cell: ({ row }) => <span className="font-medium">{row.id}</span>, meta: { displayName: 'Mã Phiếu' } },
    { id: 'reason', accessorKey: 'reason', header: 'Lý do', cell: ({ row }) => row.reason, meta: { displayName: 'Lý do' } },
    { id: 'issueDate', accessorKey: 'issueDate', header: 'Ngày', cell: ({ row }) => formatDateDisplay(row.issueDate), meta: { displayName: 'Ngày' } },
    { id: 'status', accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <Badge variant={penaltyStatusVariants[row.status]}>{row.status}</Badge>, meta: { displayName: 'Trạng thái' } },
    { id: 'amount', accessorKey: 'amount', header: 'Số tiền', cell: ({ row }) => <span className="text-destructive font-semibold">{formatCurrency(row.amount)}</span>, meta: { displayName: 'Số tiền' } },
    { 
      id: 'actions', 
      header: () => <div className="text-center">Thao tác</div>, 
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handlePrintSinglePenalty(row)}>
                <Printer className="mr-2 h-4 w-4" />
                In phiếu phạt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportSinglePenalty(row)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Xuất Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/penalties/${row.systemId}`)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ), 
      meta: { displayName: 'Thao tác', sticky: 'right' as const } 
    },
  ], [handlePrintSinglePenalty, handleExportSinglePenalty, router]);

  const penaltyBulkActions = React.useMemo(() => {
    const handlePrintPenalties = async (rows: Penalty[]) => {
      if (rows.length === 0) { toast.error('Chưa chọn phiếu phạt nào'); return; }
      const { storeInfo } = await fetchPrintData();
      const penaltyStoreSettings = createPenaltyStoreSettings(storeInfo);
      const printOptionsList = rows.map(row => {
        const penaltyForPrint = convertPenaltyForPrint(row, { employee });
        return { data: mapPenaltyToPrintData(penaltyForPrint, penaltyStoreSettings), lineItems: [] };
      });
      printMultiple('penalty', printOptionsList);
      toast.success(`Đang in ${printOptionsList.length} phiếu phạt...`);
    };

    const handleExportExcel = async (rows: Penalty[]) => {
      if (rows.length === 0) { toast.error('Chưa chọn phiếu phạt nào'); return; }
      const headers = ['Mã phiếu', 'Lý do', 'Ngày lập', 'Trạng thái', 'Số tiền'];
      const mappedData = rows.map(row => ({
        'Mã phiếu': row.id, 'Lý do': row.reason, 'Ngày lập': formatDateDisplay(row.issueDate),
        'Trạng thái': row.status, 'Số tiền': row.amount,
      }));
      await exportToExcel(mappedData, headers, 'PhieuPhat', `PhieuPhat_${employee.id}_selected.xlsx`);
      toast.success(`Đã xuất ${rows.length} phiếu phạt ra Excel`);
    };

    return [
      { label: 'In phiếu phạt', icon: Printer, onSelect: handlePrintPenalties },
      { label: 'Xuất Excel', icon: FileSpreadsheet, onSelect: handleExportExcel },
    ];
  }, [employee, printMultiple]);

  return (
    <Card>
      <CardContent className="p-4">
        <RelatedDataTable 
          data={employeePenalties} 
          columns={penaltyColumns} 
          searchKeys={['reason', 'id']} 
          searchPlaceholder="Tìm theo lý do..." 
          dateFilterColumn="issueDate" 
          dateFilterTitle="Ngày lập phiếu" 
          exportFileName={`Lich_su_phat_${employee.id}`} 
          onRowClick={(row) => router.push(`/penalties/${row.systemId}`)} 
          showCheckbox
          customBulkActions={penaltyBulkActions}
          serverPagination={{
            page,
            pageSize: pagination.limit,
            totalItems: pagination.total,
            onPageChange: setPage,
          }}
        />
      </CardContent>
    </Card>
  );
}
