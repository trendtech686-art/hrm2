import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MessageSquare, Image, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import type { Task, TaskPriorityVi } from '../types';
import { normalizeTaskPriority } from '../types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface TaskCheckboxItemProps {
  task: Task;
  onComplete: (task: Task) => void;
  onViewDetails: (task: Task) => void;
}

export function TaskCheckboxItem({ task, onComplete, onViewDetails }: TaskCheckboxItemProps) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Hoàn thành';
  const isCompleted = task.status === 'Hoàn thành';
  const isPendingApproval = task.approvalStatus === 'pending';
  const isRejected = task.approvalStatus === 'rejected';
  
  const priorityColors: Record<TaskPriorityVi, string> = {
    'Thấp': 'bg-info/15 text-info-foreground',
    'Trung bình': 'bg-warning/15 text-warning-foreground',
    'Cao': 'bg-warning/25 text-warning-foreground',
    'Khẩn cấp': 'bg-destructive/15 text-destructive',
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted && !isPendingApproval) {
      onComplete(task);
    }
  };

  return (
    <Card 
      className={cn(
        "mb-2 cursor-pointer hover:shadow-md transition-shadow",
        isOverdue && "border-destructive/30",
        isPendingApproval && "border-warning/30 bg-warning/10",
        isRejected && "border-warning/30 bg-warning/10"
      )}
      onClick={() => onViewDetails(task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="pt-1" onClick={handleCheckboxClick}>
            <Checkbox
              checked={isCompleted || isPendingApproval}
              disabled={isCompleted || isPendingApproval}
              className={cn(
                "h-5 w-5",
                isPendingApproval && "border-warning"
              )}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title & Priority */}
            <div className="flex items-start gap-2 mb-2">
              <h3 className={cn(
                "font-medium flex-1",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              <Badge 
                variant="outline" 
                className={priorityColors[normalizeTaskPriority(task.priority)]}
              >
                {task.priority}
              </Badge>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {task.description}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {/* Due date */}
              <div className={cn(
                "flex items-center gap-1",
                isOverdue && "text-destructive font-medium"
              )}>
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: vi })}
                  {isOverdue && " 🔴 Quá hạn"}
                </span>
              </div>

              {/* Assigner */}
              {task.assignerName && (
                <div className="flex items-center gap-1">
                  <span>👤 {task.assignerName}</span>
                </div>
              )}

              {/* Comments count */}
              {task.comments && task.comments.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{task.comments.length}</span>
                </div>
              )}

              {/* Evidence submitted */}
              {task.completionEvidence && (
                <div className="flex items-center gap-1 text-success">
                  <Image className="h-4 w-4" />
                  <span>{task.completionEvidence.images.length} ảnh</span>
                </div>
              )}
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {isPendingApproval && (
                <Badge variant="outline" className="bg-warning/15 text-warning-foreground border-warning/30">
                  <Clock className="h-3 w-3 mr-1" />
                  Chờ admin duyệt
                </Badge>
              )}
              
              {isRejected && (
                <Badge variant="outline" className="bg-warning/25 text-warning-foreground border-warning/30">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Admin yêu cầu làm lại
                </Badge>
              )}
              
              {isCompleted && task.approvalStatus === 'approved' && (
                <Badge variant="outline" className="bg-success/15 text-success-foreground border-success/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Admin đã duyệt
                </Badge>
              )}

              {/* Progress */}
              {task.progress > 0 && task.progress < 100 && (
                <Badge variant="outline">
                  {task.progress}% hoàn thành
                </Badge>
              )}

              {/* Subtasks */}
              {task.subtasks && task.subtasks.length > 0 && (
                <Badge variant="outline">
                  {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
                </Badge>
              )}
            </div>

            {/* Rejection reason */}
            {isRejected && task.rejectionReason && (
              <div className="mt-2 p-2 bg-warning/10 border border-warning/30 rounded text-sm">
                <strong className="text-warning-foreground">Lý do từ chối:</strong>
                <p className="text-warning-foreground mt-1">{task.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
