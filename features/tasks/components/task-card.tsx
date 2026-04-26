import * as React from 'react';
import type { Task } from '../types';
import type { SystemId } from '@/lib/id-types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MobileCard, MobileCardBody, MobileCardHeader } from '@/components/mobile/mobile-card';

interface TaskCardProps {
  task: Task;
  onDelete: (id: SystemId) => void;
}

const PRIORITY_BORDER: Record<string, string> = {
  'Khẩn cấp': 'border-l-destructive',
  'Cao': 'border-l-warning',
  'Trung bình': 'border-l-warning/50',
  'Thấp': 'border-l-info',
};

const PRIORITY_DOT: Record<string, string> = {
  'Khẩn cấp': 'bg-destructive',
  'Cao': 'bg-warning',
  'Trung bình': 'bg-warning',
  'Thấp': 'bg-info',
};

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  'Chưa bắt đầu': { bg: 'bg-muted', text: 'text-foreground' },
  'Đang thực hiện': { bg: 'bg-info/10', text: 'text-info-foreground' },
  'Đang chờ': { bg: 'bg-warning/10', text: 'text-warning-foreground' },
  'Chờ duyệt': { bg: 'bg-warning/10', text: 'text-warning-foreground' },
  'Chờ xử lý': { bg: 'bg-warning/25', text: 'text-warning-foreground' },
  'Hoàn thành': { bg: 'bg-success/10', text: 'text-success-foreground' },
  'Đã hủy': { bg: 'bg-muted', text: 'text-muted-foreground' },
};

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const router = useRouter();
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Hoàn thành';
  const dueDate = new Date(task.dueDate);
  const dueDateStr = format(dueDate, 'dd/MM', { locale: vi });
  const dueTimeRelative = isOverdue
    ? `Trễ ${formatDistanceToNow(dueDate, { locale: vi })}`
    : formatDistanceToNow(dueDate, { locale: vi, addSuffix: true });
  const statusStyle = STATUS_STYLE[task.status] || STATUS_STYLE['Chưa bắt đầu'];
  const isCompleted = task.status === 'Hoàn thành' || task.status === 'Đã hủy';

  return (
    <MobileCard
      emphasis={isOverdue ? 'destructive' : 'none'}
      className={cn(
        'border-l-[3px]',
        PRIORITY_BORDER[task.priority] || 'border-l-border',
        isOverdue && 'bg-destructive/10',
      )}
      onClick={() => router.push(`/tasks/${task.systemId}`)}
    >
      <MobileCardHeader className="items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <span className="font-mono">{task.id}</span>
            <div
              className={cn('h-2 w-2 rounded-full shrink-0', PRIORITY_DOT[task.priority] || 'bg-muted-foreground')}
              title={task.priority}
            />
          </div>
          <h3
            className={cn(
              'mt-0.5 text-sm font-semibold text-foreground leading-snug line-clamp-2',
              isCompleted && 'line-through text-muted-foreground',
            )}
          >
            {task.title}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-11 w-11 p-0 -mr-2 -mt-1 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/tasks/${task.systemId}`); }}>
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/tasks/${task.systemId}/edit`); }}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(task.systemId); }}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </MobileCardHeader>

      <MobileCardBody>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn('inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium', statusStyle.bg, statusStyle.text)}>
            {task.status}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full',
              isOverdue ? 'bg-destructive/10 text-destructive font-medium' : 'bg-muted text-muted-foreground',
            )}
          >
            <Calendar className="h-3 w-3" />
            {dueDateStr}
          </span>
          <span className={cn('text-xs', isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground')}>
            {dueTimeRelative}
          </span>
        </div>

        {(task.assigneeName || task.progress > 0) && (
          <div className="flex items-center gap-3 mt-2.5">
            {task.assigneeName && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground truncate">
                <User className="h-3 w-3 shrink-0" />
                <span className="truncate">{task.assigneeName}</span>
              </span>
            )}
            {task.progress > 0 && (
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', task.progress >= 100 ? 'bg-success' : 'bg-primary')}
                    style={{ width: `${Math.min(task.progress, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{task.progress}%</span>
              </div>
            )}
          </div>
        )}
      </MobileCardBody>
    </MobileCard>
  );
}
