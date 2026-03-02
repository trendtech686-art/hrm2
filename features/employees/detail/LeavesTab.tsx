'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Printer, FileSpreadsheet } from 'lucide-react';
import { Eye, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useLeavesByEmployee } from '@/features/leaves/hooks/use-all-leaves';
import { usePrint } from '@/lib/use-print';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
import {
  convertLeaveForPrint,
  mapLeaveToPrintData,
  createStoreSettings as createLeaveStoreSettings,
} from '@/lib/print/leave-print-helper';
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
import type { LeaveRequest } from '@/features/leaves/types';
import type { Employee } from '@/lib/types/prisma-extended';
import { leaveStatusVariants, formatDateDisplay } from './types';

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

interface LeavesTabProps {
  employee: Employee;
}

export function LeavesTab({ employee }: LeavesTabProps) {
  const router = useRouter();
  const { data: employeeLeaves } = useLeavesByEmployee(employee.systemId);
  const { info: storeInfo } = useStoreInfoData();
  const { print, printMultiple } = usePrint();

  const sortedLeaves = React.useMemo(() => 
    [...employeeLeaves].sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()),
    [employeeLeaves]
  );

  const handlePrintSingleLeave = React.useCallback((row: LeaveRequest) => {
    const leaveStoreSettings = createLeaveStoreSettings(storeInfo);
    const leaveForPrint = convertLeaveForPrint(row, { employee });
    print('leave', {
      data: mapLeaveToPrintData(leaveForPrint, leaveStoreSettings),
      lineItems: [],
    });
  }, [employee, storeInfo, print]);

  const handleExportSingleLeave = React.useCallback(async (row: LeaveRequest) => {
    const headers = ['Mã đơn', 'Loại phép', 'Từ ngày', 'Đến ngày', 'Số ngày', 'Lý do', 'Trạng thái'];
    const mappedData = [{
      'Mã đơn': row.id, 'Loại phép': row.leaveTypeName,
      'Từ ngày': formatDateDisplay(row.startDate), 'Đến ngày': formatDateDisplay(row.endDate),
      'Số ngày': row.numberOfDays, 'Lý do': row.reason, 'Trạng thái': row.status,
    }];
    await exportToExcel(mappedData, headers, 'NghiPhep', `NghiPhep_${row.id}.xlsx`);
    toast.success('Đã xuất đơn nghỉ phép ra Excel');
  }, []);

  const leaveColumns: ColumnDef<LeaveRequest>[] = React.useMemo(() => [
    { id: 'id', accessorKey: 'id', header: 'Mã đơn', cell: ({ row }) => <span className="font-medium">{row.id}</span>, meta: { displayName: 'Mã đơn' } },
    { id: 'leaveTypeName', accessorKey: 'leaveTypeName', header: 'Loại phép', cell: ({ row }) => row.leaveTypeName, meta: { displayName: 'Loại phép' } },
    { id: 'dateRange', header: 'Thời gian', cell: ({ row }) => `${formatDateDisplay(row.startDate)} - ${formatDateDisplay(row.endDate)}`, meta: { displayName: 'Thời gian' } },
    { id: 'numberOfDays', accessorKey: 'numberOfDays', header: 'Số ngày', cell: ({ row }) => row.numberOfDays, meta: { displayName: 'Số ngày' } },
    { id: 'reason', accessorKey: 'reason', header: 'Lý do', cell: ({ row }) => <span className="truncate max-w-50 block">{row.reason}</span>, meta: { displayName: 'Lý do' } },
    { id: 'status', accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <Badge variant={leaveStatusVariants[row.status]}>{row.status}</Badge>, meta: { displayName: 'Trạng thái' } },
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
              <DropdownMenuItem onClick={() => handlePrintSingleLeave(row)}>
                <Printer className="mr-2 h-4 w-4" />
                In đơn nghỉ phép
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportSingleLeave(row)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Xuất Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/leaves/${row.systemId}`)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ), 
      meta: { displayName: 'Thao tác', sticky: 'right' as const } 
    },
  ], [handlePrintSingleLeave, handleExportSingleLeave, router]);

  const leaveBulkActions = React.useMemo(() => {
    const handlePrintLeaves = (rows: LeaveRequest[]) => {
      if (rows.length === 0) { toast.error('Chưa chọn đơn nghỉ phép nào'); return; }
      const leaveStoreSettings = createLeaveStoreSettings(storeInfo);
      const printOptionsList = rows.map(row => {
        const leaveForPrint = convertLeaveForPrint(row, { employee });
        return { data: mapLeaveToPrintData(leaveForPrint, leaveStoreSettings), lineItems: [] };
      });
      printMultiple('leave', printOptionsList);
      toast.success(`Đang in ${printOptionsList.length} đơn nghỉ phép...`);
    };

    const handleExportExcel = async (rows: LeaveRequest[]) => {
      if (rows.length === 0) { toast.error('Chưa chọn đơn nghỉ phép nào'); return; }
      const headers = ['Mã đơn', 'Loại phép', 'Từ ngày', 'Đến ngày', 'Số ngày', 'Lý do', 'Trạng thái'];
      const mappedData = rows.map(row => ({
        'Mã đơn': row.id, 'Loại phép': row.leaveTypeName,
        'Từ ngày': formatDateDisplay(row.startDate), 'Đến ngày': formatDateDisplay(row.endDate),
        'Số ngày': row.numberOfDays, 'Lý do': row.reason, 'Trạng thái': row.status,
      }));
      await exportToExcel(mappedData, headers, 'NghiPhep', `NghiPhep_${employee.id}_selected.xlsx`);
      toast.success(`Đã xuất ${rows.length} đơn nghỉ phép ra Excel`);
    };

    return [
      { label: 'In đơn nghỉ phép', icon: Printer, onSelect: handlePrintLeaves },
      { label: 'Xuất Excel', icon: FileSpreadsheet, onSelect: handleExportExcel },
    ];
  }, [employee, storeInfo, printMultiple]);

  return (
    <Card>
      <CardContent className="p-4">
        <RelatedDataTable 
          data={sortedLeaves} 
          columns={leaveColumns} 
          searchKeys={['id', 'leaveTypeName', 'reason']} 
          searchPlaceholder="Tìm theo mã đơn, loại phép..." 
          dateFilterColumn="startDate" 
          dateFilterTitle="Ngày bắt đầu" 
          exportFileName={`Lich_su_nghi_phep_${employee.id}`} 
          onRowClick={(row) => router.push(`/leaves/${row.systemId}`)} 
          showCheckbox
          customBulkActions={leaveBulkActions}
        />
      </CardContent>
    </Card>
  );
}
