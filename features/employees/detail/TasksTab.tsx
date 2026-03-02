'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FileSpreadsheet } from 'lucide-react';
import { Eye, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useTasksByEmployee } from '@/features/tasks/hooks/use-all-tasks';
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
import type { Employee } from '@/lib/types/prisma-extended';
import { formatDateDisplay, type TaskRow } from './types';

interface TasksTabProps {
  employee: Employee;
}

export function TasksTab({ employee }: TasksTabProps) {
  const router = useRouter();
  const { data: serverTasks } = useTasksByEmployee(employee.systemId);

  const employeeTasks: TaskRow[] = React.useMemo(() => {
    return serverTasks.map(task => ({
      systemId: task.systemId,
      title: task.title,
      type: task.priority || 'Trung bình',
      dueDate: task.dueDate,
      statusVariant: (
        task.status === 'Hoàn thành' ? 'success' :
        task.status === 'Đang thực hiện' ? 'default' :
        task.status === 'Đang chờ' ? 'warning' :
        task.status === 'Đã hủy' ? 'destructive' : 'secondary'
      ) as TaskRow['statusVariant'],
      statusName: task.status,
      link: `/tasks/${task.systemId}`,
    }));
  }, [serverTasks]);

  const handleExportSingleTask = React.useCallback(async (row: TaskRow) => {
    const XLSX = await import('xlsx');
    const headers = ['Công việc', 'Độ ưu tiên', 'Hạn chót', 'Trạng thái'];
    const mappedData = [{
      'Công việc': row.title, 'Độ ưu tiên': row.type,
      'Hạn chót': formatDateDisplay(row.dueDate), 'Trạng thái': row.statusName,
    }];
    const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CongViec');
    XLSX.writeFile(wb, `CongViec_${row.systemId}.xlsx`);
    toast.success('Đã xuất công việc ra Excel');
  }, []);

  const taskColumns: ColumnDef<TaskRow>[] = React.useMemo(() => [
    { id: 'title', accessorKey: 'title', header: 'Công việc', cell: ({ row }) => <span className="font-medium">{row.title}</span>, meta: { displayName: 'Công việc' } },
    { id: 'type', accessorKey: 'type', header: 'Độ ưu tiên', cell: ({ row }) => row.type, meta: { displayName: 'Độ ưu tiên' } },
    { id: 'dueDate', accessorKey: 'dueDate', header: 'Hạn chót', cell: ({ row }) => formatDateDisplay(row.dueDate), meta: { displayName: 'Hạn chót' } },
    { id: 'status', accessorKey: 'statusName', header: 'Trạng thái', cell: ({ row }) => <Badge variant={row.statusVariant}>{row.statusName}</Badge>, meta: { displayName: 'Trạng thái' } },
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
              <DropdownMenuItem onClick={() => handleExportSingleTask(row)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Xuất Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(row.link)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ), 
      meta: { displayName: 'Thao tác', sticky: 'right' as const } 
    },
  ], [handleExportSingleTask, router]);

  const taskBulkActions = React.useMemo(() => {
    const handleExportExcel = async (rows: TaskRow[]) => {
      if (rows.length === 0) { toast.error('Chưa chọn công việc nào'); return; }
      const XLSX = await import('xlsx');
      const headers = ['Công việc', 'Độ ưu tiên', 'Hạn chót', 'Trạng thái'];
      const mappedData = rows.map(row => ({
        'Công việc': row.title, 'Độ ưu tiên': row.type,
        'Hạn chót': formatDateDisplay(row.dueDate), 'Trạng thái': row.statusName,
      }));
      const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'CongViec');
      XLSX.writeFile(wb, `CongViec_${employee.id}_selected.xlsx`);
      toast.success(`Đã xuất ${rows.length} công việc ra Excel`);
    };

    return [{ label: 'Xuất Excel', icon: FileSpreadsheet, onSelect: handleExportExcel }];
  }, [employee]);

  return (
    <Card>
      <CardContent className="p-4">
        <RelatedDataTable 
          data={employeeTasks} 
          columns={taskColumns} 
          searchKeys={['title', 'type']} 
          searchPlaceholder="Tìm công việc..." 
          dateFilterColumn="dueDate" 
          dateFilterTitle="Hạn chót" 
          exportFileName={`Cong_viec_${employee.id}`} 
          onRowClick={(row) => router.push(row.link)} 
          showCheckbox
          customBulkActions={taskBulkActions}
        />
      </CardContent>
    </Card>
  );
}

/**
 * Get task count and active count for stats display
 */
export function useTaskStats(employeeSystemId: string | undefined) {
  const { data: serverTasks } = useTasksByEmployee(employeeSystemId);
  
  return React.useMemo(() => ({
    total: serverTasks.length,
    active: serverTasks.filter(t => t.status !== 'Hoàn thành').length,
  }), [serverTasks]);
}
