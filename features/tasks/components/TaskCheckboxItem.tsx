import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MessageSquare, Image, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import type { Task } from '../types';
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
  
  const priorityColors = {
    'Thấp': 'bg-blue-100 text-blue-800',
    'Trung bình': 'bg-yellow-100 text-yellow-800',
    'Cao': 'bg-orange-100 text-orange-800',
    'Khẩn cấp': 'bg-red-100 text-red-800',
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
        isOverdue && "border-red-300",
        isPendingApproval && "border-yellow-300 bg-yellow-50",
        isRejected && "border-orange-300 bg-orange-50"
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
                isPendingApproval && "border-yellow-500"
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
                className={priorityColors[task.priority]}
              >
                {task.priority}
              </Badge>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-body-sm text-muted-foreground line-clamp-2 mb-2">
                {task.description}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 text-body-sm text-muted-foreground">
              {/* Due date */}
              <div className={cn(
                "flex items-center gap-1",
                isOverdue && "text-red-600 font-medium"
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
                <div className="flex items-center gap-1 text-green-600">
                  <Image className="h-4 w-4" />
                  <span>{task.completionEvidence.images.length} ảnh</span>
                </div>
              )}
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {isPendingApproval && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  <Clock className="h-3 w-3 mr-1" />
                  Chờ admin duyệt
                </Badge>
              )}
              
              {isRejected && (
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Admin yêu cầu làm lại
                </Badge>
              )}
              
              {isCompleted && task.approvalStatus === 'approved' && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
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
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-body-sm">
                <strong className="text-orange-800">Lý do từ chối:</strong>
                <p className="text-orange-700 mt-1">{task.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
