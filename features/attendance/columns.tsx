import * as React from 'react';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, isDateSame } from '@/lib/date-utils';
import type { AttendanceDataRow, DailyRecord } from './types.ts';
import type { ColumnDef } from '../../components/data-table/types.ts';
import { DataTableColumnHeader } from '../../components/data-table/data-table-column-header.tsx';
import { DailyStatusCell } from './components/daily-status-cell.tsx';
import { Checkbox } from "../../components/ui/checkbox.tsx";
import { cn } from '../../lib/utils.ts';
import type { EmployeeSettings } from '../settings/employees/types.ts';
import { SummaryStat } from './components/summary-stat.tsx';
import type { SystemId } from '../../lib/id-types.ts';
export const getColumns = (
    year: number, 
    month: number, 
  onEdit: (employeeSystemId: SystemId, day: number) => void,
    settings: EmployeeSettings,
    isLocked: boolean,
    isSelectionMode: boolean = false,
    cellSelection: Record<string, boolean> = {},
  onQuickFill?: (employeeSystemId: SystemId, day: number) => void
): ColumnDef<AttendanceDataRow>[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const dayColumns: ColumnDef<AttendanceDataRow>[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const isWeekend = !settings.workingDays.includes(date.getDay());
    const isToday = isDateSame(date, getCurrentDate());

    dayColumns.push({
      id: `day_${day}`,
      header: () => (
        <div className={cn(
          "text-center w-full rounded-sm py-1 relative",
          isWeekend && "text-muted-foreground"
        )}>
          <div className="text-body-xs font-medium">{formatDateCustom(date, 'EEE')}</div>
          <div className="font-semibold">{day}</div>
          {isToday && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />}
        </div>
      ),
      cell: ({ row }) => {
        const record = row[`day_${day}`] as DailyRecord;
        const isEditable = !isLocked && record && record.status !== 'future' && record.status !== 'weekend';
        const cellKey = `${row.employeeSystemId}-${day}`;
        const isSelected = cellSelection[cellKey];

        return (
          <div
            className={cn(
              "h-12 w-full flex items-center justify-center rounded-md relative",
              isEditable && !isSelectionMode && "cursor-pointer hover:bg-accent/50",
              isSelectionMode && isEditable && "cursor-pointer hover:ring-2 hover:ring-primary",
              isWeekend && record?.status !== 'present' && record?.status !== 'leave' && "bg-muted/30",
              isSelected && "ring-2 ring-primary bg-primary/10"
            )}
            onClick={() => isEditable && onEdit(row.employeeSystemId, day)}
            onDoubleClick={(e) => {
              if (isEditable && !isSelectionMode && onQuickFill) {
                e.stopPropagation();
                onQuickFill(row.employeeSystemId, day);
              }
            }}
          >
            <DailyStatusCell record={record} />
            {isSelected && (
              <div className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
        );
      },
      size: 60,
      meta: { displayName: `Ngày ${day}` },
    });
  }

  const columns: ColumnDef<AttendanceDataRow>[] = [
    {
      id: 'select',
      header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll?.(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ isSelected, onToggleSelect }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Select row"
        />
      ),
      size: 48,
      meta: { displayName: "Chọn", sticky: 'left' },
    },
    {
      id: 'fullName',
      accessorKey: 'fullName',
      header: ({ sorting, setSorting }) => (
        <DataTableColumnHeader
          title="Nhân viên"
          sortKey="fullName"
          isSorted={sorting?.id === 'fullName'}
          sortDirection={sorting?.desc ? 'desc' : 'asc'}
          onSort={() => setSorting?.((s: any) => ({ id: 'fullName', desc: s.id === 'fullName' ? !s.desc : false }))}
        />
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.fullName}</div>
          <div className="text-body-xs text-muted-foreground">{row.employeeId}</div>
        </div>
      ),
      size: 200,
      meta: { displayName: "Nhân viên", sticky: 'left' },
    },
    ...dayColumns,
    {
      id: 'summary',
      header: () => <div className="text-center">Tổng kết</div>,
      cell: ({ row }) => {
        return (
          <div className="text-body-xs whitespace-nowrap p-1 text-left">
            <div>
              <span>Công: <span className="font-semibold">{row.workDays}</span>, </span>
              <span>Phép: <span className="font-semibold">{row.leaveDays}</span>, </span>
              <span>Vắng: <span className="font-semibold">{row.absentDays}</span></span>
            </div>
            <div>
              <span>Đi trễ: <span className="font-semibold">{row.lateArrivals}</span>, </span>
              <span>OT: <span className="font-semibold">{row.otHours}h</span></span>
            </div>
          </div>
        );
      },
      size: 180,
      meta: { displayName: 'Tổng kết', sticky: 'right' },
    },
  ];

  return columns;
};
