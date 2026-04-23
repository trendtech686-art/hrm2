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
  'Khẩn cấp': 'border-l-red-500',
  'Cao': 'border-l-orange-500',
  'Trung bình': 'border-l-yellow-500',
  'Thấp': 'border-l-blue-400',
};

const PRIORITY_DOT: Record<string, string> = {
  'Khẩn cấp': 'bg-red-500',
  'Cao': 'bg-orange-500',
  'Trung bình': 'bg-yellow-400',
  'Thấp': 'bg-blue-400',
};

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  'Chưa bắt đầu': { bg: 'bg-slate-100', text: 'text-slate-700' },
  'Đang thực hiện': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Đang chờ': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'Chờ duyệt': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'Chờ xử lý': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'Hoàn thành': { bg: 'bg-green-100', text: 'text-green-700' },
  'Đã hủy': { bg: 'bg-gray-100', text: 'text-gray-500' },
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
        PRIORITY_BORDER[task.priority] || 'border-l-slate-300',
        isOverdue && 'bg-red-50/50',
      )}
      onClick={() => router.push(`/tasks/${task.systemId}`)}
    >
      <MobileCardHeader className="items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <span className="font-mono">{task.id}</span>
            <div
              className={cn('h-2 w-2 rounded-full shrink-0', PRIORITY_DOT[task.priority] || 'bg-slate-400')}
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
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 -mr-2 -mt-1 shrink-0">
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
              isOverdue ? 'bg-red-100 text-red-700 font-medium' : 'bg-muted text-muted-foreground',
            )}
          >
            <Calendar className="h-3 w-3" />
            {dueDateStr}
          </span>
          <span className={cn('text-xs', isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground')}>
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
                    className={cn('h-full rounded-full transition-all', task.progress >= 100 ? 'bg-green-500' : 'bg-blue-500')}
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
