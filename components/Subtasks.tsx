import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CheckCircle2, Circle, Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDateTimeForDisplay } from '@/lib/date-utils';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date | undefined;
  order: number;
  createdAt: Date;
}

interface SubtasksProps {
  subtasks: Subtask[];
  onToggle?: (subtaskId: string, completed: boolean) => void;
  onAdd?: (title: string) => void;
  onRemove?: (subtaskId: string) => void;
  onReorder?: (subtasks: Subtask[]) => void;
  readOnly?: boolean;
  title?: string;
  emptyMessage?: string;
  className?: string;
}

/**
 * Generic Subtasks Component
 * 
 * Dùng chung cho: Warranty, Orders, Complaints, Projects...
 * 
 * Features:
 * - Toggle complete/incomplete
 * - Add new subtask
 * - Remove subtask
 * - Drag & drop reorder (optional)
 * - Progress indicator
 * - Read-only mode
 * 
 * Usage:
 * ```tsx
 * <Subtasks
 *   subtasks={ticket.subtasks}
 *   onToggle={(id, completed) => updateSubtask(id, { completed })}
 *   onAdd={(title) => addSubtask(title)}
 *   onRemove={(id) => removeSubtask(id)}
 *   title="Quy trình xử lý"
 * />
 * ```
 */
export function Subtasks({
  subtasks = [],
  onToggle,
  onAdd,
  onRemove,
  onReorder,
  readOnly = false,
  title = 'Công việc cần làm',
  emptyMessage = 'Chưa có công việc nào',
  className,
}: SubtasksProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);

  // Calculate progress
  const completedCount = subtasks.filter(s => s.completed).length;
  const totalCount = subtasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Sort subtasks by order
  const sortedSubtasks = React.useMemo(() => {
    return [...subtasks].sort((a, b) => a.order - b.order);
  }, [subtasks]);

  const handleAdd = () => {
    if (!newSubtaskTitle.trim() || !onAdd) return;
    
    onAdd(newSubtaskTitle.trim());
    setNewSubtaskTitle('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewSubtaskTitle('');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-h5 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {title}
          </CardTitle>
          
          {totalCount > 0 && (
            <Badge variant={progressPercent === 100 ? 'default' : 'secondary'} className="text-xs">
              {completedCount}/{totalCount} ({progressPercent}%)
            </Badge>
          )}
        </div>
        
        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                progressPercent === 100 ? "bg-green-600" : "bg-blue-600"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-2">
        {sortedSubtasks.length === 0 && !isAdding && (
          <div className="text-sm text-muted-foreground text-center py-4">
            {emptyMessage}
          </div>
        )}
        
        {/* Subtasks list */}
        {sortedSubtasks.map((subtask, index) => (
          <div
            key={subtask.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-md border transition-colors",
              subtask.completed ? "bg-muted/50" : "bg-card hover:bg-muted/30"
            )}
          >
            {/* Drag handle (if reorder enabled) */}
            {onReorder && !readOnly && (
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            )}
            
            {/* Checkbox */}
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={(checked) => {
                if (onToggle && !readOnly) {
                  onToggle(subtask.id, checked as boolean);
                }
              }}
              disabled={readOnly}
              className="mt-0.5"
            />
            
            {/* Icon */}
            {subtask.completed ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
            
            {/* Title */}
            <div className="flex-1 min-w-0">
              <div className={cn(
                "text-sm",
                subtask.completed && "line-through text-muted-foreground"
              )}>
                {subtask.title}
              </div>
              
              {subtask.completed && subtask.completedAt && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  Hoàn thành: {formatDateTimeForDisplay(subtask.completedAt)}
                </div>
              )}
            </div>
            
            {/* Remove button */}
            {onRemove && !readOnly && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(subtask.id)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}
        
        {/* Add new subtask */}
        {!readOnly && onAdd && (
          <div className="pt-2">
            {isAdding ? (
              <div className="flex items-center gap-2">
                <Input
                  autoFocus
                  placeholder="Nhập tên công việc..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleAdd} disabled={!newSubtaskTitle.trim()}>
                  Thêm
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setIsAdding(false);
                    setNewSubtaskTitle('');
                  }}
                >
                  Hủy
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm công việc
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
