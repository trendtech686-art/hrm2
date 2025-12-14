import * as React from 'react';
import type { DailyRecord, AttendanceStatus } from '../types.ts';
import { cn } from '../../../lib/utils.ts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip.tsx';

const statusStyles: Record<AttendanceStatus, { symbol: string; className: string, description: string; }> = {
  present: { symbol: '✓', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', description: 'Đi làm đủ' },
  absent: { symbol: 'V', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', description: 'Vắng' },
  leave: { symbol: 'P', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', description: 'Nghỉ phép' },
  'half-day': { symbol: '½', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', description: 'Nửa ngày' },
  weekend: { symbol: '', className: '', description: 'Cuối tuần' },
  holiday: { symbol: 'H', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300', description: 'Ngày lễ' },
  future: { symbol: '-', className: 'text-muted-foreground', description: '' },
};

export const DailyStatusCell: React.FC<{ record: DailyRecord }> = ({ record }) => {
  if (!record) {
    return <div className="text-center text-muted-foreground">-</div>;
  }
  
  const { status, checkIn, checkOut, overtimeCheckIn, overtimeCheckOut, notes } = record;
  const styleInfo = statusStyles[status] || statusStyles.future;

  if (status === 'weekend') {
    return null; // The background will be handled by the parent cell.
  }
  
  const hasDetails = checkIn || checkOut || notes || overtimeCheckIn || overtimeCheckOut;

  const content = (
    <div className={cn(
      "flex items-center justify-center w-6 h-6 rounded-full font-semibold text-body-xs",
      styleInfo.className
    )}>
      {styleInfo.symbol}
    </div>
  );

  if (hasDetails || status !== 'future') {
    const tooltipParts = [
      styleInfo.description,
      checkIn && `Vào: ${checkIn}`,
      checkOut && `Ra: ${checkOut}`,
      overtimeCheckIn && `Tăng ca vào: ${overtimeCheckIn}`,
      overtimeCheckOut && `Tăng ca ra: ${overtimeCheckOut}`,
      notes && `Ghi chú: ${notes}`,
    ].filter(Boolean);

    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center w-full h-full cursor-default">{content}</div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 p-1">
              {tooltipParts.map((part, i) => <p key={i}>{part}</p>)}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return <div className="flex items-center justify-center w-full h-full">{content}</div>;
};
