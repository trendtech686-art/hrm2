import * as React from 'react';
import { formatDate } from '@/lib/date-utils';
import type { Task } from './types';
import type { SystemId } from '../../lib/id-types';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { MoreVertical, Calendar, Clock, User, Flag } from 'lucide-react';
import { useNavigate } from '@/lib/next-compat';

interface TaskCardProps {
  task: Task;
  onDelete: (id: SystemId) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const navigate = useNavigate();

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      'Thấp': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
      'Trung bình': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      'Cao': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
      'Khẩn cấp': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    };
    return colors[priority];
  };

  const getStatusVariant = (status: Task['status']): "default" | "secondary" | "warning" | "success" | "outline" => {
    const map = {
      'Chưa bắt đầu': 'outline' as const,
      'Đang thực hiện': 'warning' as const,
      'Đang chờ': 'secondary' as const,
      'Hoàn thành': 'success' as const,
      'Đã hủy': 'default' as const,
    };
    return map[status];
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Hoàn thành';

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/tasks/${task.systemId}`)}
    >
      <CardContent className="p-4">
        {/* Header: ID + Priority + Menu */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-body-sm font-semibold text-muted-foreground">{task.id}</span>
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-body-xs font-medium ${getPriorityColor(task.priority)}`}>
              <Flag className="h-3 w-3" />
              {task.priority}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                navigate(`/tasks/${task.systemId}`);
              }}>
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                navigate(`/tasks/${task.systemId}/edit`);
              }}>
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.systemId);
                }}
              >
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-h4 mb-2 line-clamp-2">{task.title}</h3>

        {/* Status + Progress */}
        <div className="flex items-center gap-3 mb-3">
          <Badge variant={getStatusVariant(task.status)} className="shrink-0">
            {task.status}
          </Badge>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Progress value={task.progress} className="h-2 flex-1" />
            <span className="text-body-xs text-muted-foreground shrink-0">{task.progress}%</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-2 text-body-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">{task.assigneeName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Bắt đầu: {formatDate(task.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 shrink-0 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`} />
            <span className={isOverdue ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
              Deadline: {formatDate(task.dueDate)}
              {isOverdue && <span className="ml-1">(Quá hạn)</span>}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
