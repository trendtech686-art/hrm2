import * as React from 'react';
import { Button } from '../ui/button.tsx';
import { Checkbox } from '../ui/checkbox.tsx';
import { Input } from '../ui/input.tsx';
import { Avatar, AvatarFallback } from '../ui/avatar.tsx';
import { Badge } from '../ui/badge.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.tsx';
import {
  Plus,
  GripVertical,
  Trash2,
  Edit2,
  Check,
  X,
  User,
  Copy,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

// ============================================================================
// Types
// ============================================================================

export type Subtask<T = any> = {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: Date;
  completedAt?: Date;
  assigneeId?: string;
  assigneeName?: string;
  parentId?: string; // For nested subtasks (1 level)
  metadata?: T; // Additional fields for specific use cases
  triggerStatus?: string; // Khi hoàn thành bước này, tự động chuyển status (VD: "resolved", "investigating")
};

export interface SubtaskListProps<T = any> {
  subtasks: Subtask<T>[];
  onAdd?: (title: string, parentId?: string) => void;
  onUpdate?: (id: string, updates: Partial<Subtask<T>>) => void;
  onDelete?: (id: string) => void;
  onReorder?: (reorderedSubtasks: Subtask<T>[]) => void;
  onToggleComplete?: (id: string, completed: boolean) => void;
  onAllCompleted?: () => void; // Callback khi tất cả subtasks được hoàn thành
  allowNested?: boolean; // Enable nested subtasks (1 level)
  showAssignee?: boolean; // Show assignee column
  showProgress?: boolean; // Show progress indicator
  readonly?: boolean; // Disable editing
  compact?: boolean; // Compact mode for mobile
  emptyMessage?: string;
  showStatusSelector?: boolean; // Show status selector for each subtask (settings mode)
  statusOptions?: Array<{ value: string; label: string }>; // Available status options
}

// ============================================================================
// Sortable Subtask Item
// ============================================================================

interface SortableSubtaskProps<T> {
  subtask: Subtask<T>;
  isNested?: boolean;
  onToggleComplete?: (id: string, completed: boolean) => void;
  onUpdate?: (id: string, updates: Partial<Subtask<T>>) => void;
  onDelete?: (id: string) => void;
  onAddNested?: (parentId: string) => void;
  showAssignee?: boolean;
  readonly?: boolean;
  compact?: boolean;
  showStatusSelector?: boolean;
  statusOptions?: Array<{ value: string; label: string }>;
}

function SortableSubtask<T>({
  subtask,
  isNested = false,
  onToggleComplete,
  onUpdate,
  onDelete,
  onAddNested,
  showAssignee,
  readonly,
  compact,
  showStatusSelector,
  statusOptions,
}: SortableSubtaskProps<T>) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(subtask.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subtask.id, disabled: readonly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editValue.trim() && editValue !== subtask.title) {
      onUpdate?.(subtask.id, { title: editValue.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(subtask.title);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${
        isNested ? 'ml-8 border-l-2 border-l-primary/30' : ''
      } ${compact ? 'p-2' : 'p-3'} ${onToggleComplete && !isEditing ? 'cursor-pointer' : ''}`}
      onClick={(e) => {
        // Only toggle if clicking on the row (not on buttons/inputs)
        if (!isEditing && onToggleComplete && e.target === e.currentTarget) {
          onToggleComplete(subtask.id, !subtask.completed);
        }
      }}
    >
      {/* Drag Handle */}
      {!readonly && (
        <button
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 pt-0.5"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className={`text-muted-foreground ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
        </button>
      )}

      {/* Checkbox */}
      <div className="flex-shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={subtask.completed}
          onCheckedChange={(checked) =>
            onToggleComplete?.(subtask.id, checked as boolean)
          }
          disabled={!onToggleComplete}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0" onClick={(e) => {
        // Allow toggle when clicking on title text
        if (!isEditing && onToggleComplete && (e.target as HTMLElement).tagName === 'P') {
          return; // Let the text onClick handle it
        }
        // Stop propagation for other clicks in this area
        if (isEditing || showStatusSelector) {
          e.stopPropagation();
        }
      }}>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              className={compact ? 'h-7 text-sm' : 'h-8'}
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              className={compact ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}
              onClick={handleSave}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={compact ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}
              onClick={handleCancel}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p
                className={`flex-1 text-sm ${
                  subtask.completed
                    ? 'line-through text-muted-foreground'
                    : 'font-medium'
                }`}
                onClick={() => {
                  if (onToggleComplete) {
                    onToggleComplete(subtask.id, !subtask.completed);
                  }
                }}
              >
                {subtask.title}
              </p>
              {/* Show status badge in detail mode (not settings) */}
              {!showStatusSelector && subtask.triggerStatus && statusOptions && statusOptions.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  → {statusOptions.find(opt => opt.value === subtask.triggerStatus)?.label || subtask.triggerStatus}
                </Badge>
              )}
              {/* Status Selector (Settings Mode) */}
              {showStatusSelector && statusOptions && statusOptions.length > 0 && (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">→</span>
                  <Select
                    value={subtask.triggerStatus || 'none'}
                    onValueChange={(value) => {
                      onUpdate?.(subtask.id, { triggerStatus: value === 'none' ? undefined : value });
                    }}
                  >
                    <SelectTrigger className="h-8 w-[180px]">
                      <SelectValue placeholder="Không chuyển TT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không chuyển</SelectItem>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* Copy Button */}
              <Button
                size="sm"
                variant="ghost"
                className={`${compact ? 'h-6 w-6 p-0' : 'h-7 w-7 p-0'} opacity-0 group-hover:opacity-100 transition-opacity`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(subtask.title);
                  // Could add toast here if needed
                }}
                title="Copy nội dung"
              >
                <Copy className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Assignee */}
      {showAssignee && subtask.assigneeName && (
        <div className="flex items-center gap-1.5 pt-0.5" onClick={(e) => e.stopPropagation()}>
          <Avatar className={compact ? 'h-5 w-5' : 'h-6 w-6'}>
            <AvatarFallback className={`text-[10px] font-medium bg-primary/10 text-primary`}>
              {getInitials(subtask.assigneeName)}
            </AvatarFallback>
          </Avatar>
          {!compact && (
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {subtask.assigneeName}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      {!readonly && !isEditing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          {!isNested && onAddNested && (
            <Button
              size="sm"
              variant="ghost"
              className={compact ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}
              onClick={() => onAddNested(subtask.id)}
              title="Thêm subtask con"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className={compact ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={`${compact ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'} text-destructive hover:text-destructive`}
            onClick={() => onDelete?.(subtask.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main SubtaskList Component
// ============================================================================

export function SubtaskList<T = any>({
  subtasks,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onToggleComplete,
  onAllCompleted,
  allowNested = false,
  showAssignee = false,
  showProgress = true,
  readonly = false,
  compact = false,
  emptyMessage = 'Chưa có subtask nào',
  showStatusSelector = false,
  statusOptions = [],
}: SubtaskListProps<T>) {
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);
  const [addingParentId, setAddingParentId] = React.useState<string | undefined>();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Separate parent and nested subtasks
  const parentSubtasks = React.useMemo(
    () => subtasks.filter((s) => !s.parentId).sort((a, b) => a.order - b.order),
    [subtasks]
  );

  const getNestedSubtasks = React.useCallback(
    (parentId: string) =>
      subtasks
        .filter((s) => s.parentId === parentId)
        .sort((a, b) => a.order - b.order),
    [subtasks]
  );

  // Calculate progress
  const progress = React.useMemo(() => {
    if (subtasks.length === 0) return 0;
    const completed = subtasks.filter((s) => s.completed).length;
    return Math.round((completed / subtasks.length) * 100);
  }, [subtasks]);

  // Check if all completed and trigger callback
  React.useEffect(() => {
    if (subtasks.length > 0 && progress === 100 && onAllCompleted) {
      onAllCompleted();
    }
  }, [progress, subtasks.length, onAllCompleted]);

  const handleAdd = () => {
    if (newSubtaskTitle.trim()) {
      onAdd?.(newSubtaskTitle.trim(), addingParentId);
      setNewSubtaskTitle('');
      setIsAdding(false);
      setAddingParentId(undefined);
    }
  };

  const handleAddNested = (parentId: string) => {
    setAddingParentId(parentId);
    setIsAdding(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parentSubtasks.findIndex((s) => s.id === active.id);
      const newIndex = parentSubtasks.findIndex((s) => s.id === over.id);

      const reordered = arrayMove(parentSubtasks, oldIndex, newIndex).map(
        (s, idx) => ({ ...s, order: idx })
      );

      // Include nested subtasks
      const allReordered = [
        ...reordered,
        ...subtasks.filter((s) => s.parentId),
      ];

      onReorder?.(allReordered);
    }
  };

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      {showProgress && subtasks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Tiến độ</span>
            <span className="text-muted-foreground">
              {subtasks.filter((s) => s.completed).length}/{subtasks.length} hoàn thành
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">{progress}%</p>
        </div>
      )}

      {/* Subtasks List */}
      {subtasks.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={parentSubtasks.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {parentSubtasks.map((subtask) => (
                <div key={subtask.id} className="space-y-2">
                  {/* Parent Subtask */}
                  <SortableSubtask
                    subtask={subtask}
                    onToggleComplete={onToggleComplete}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onAddNested={allowNested ? handleAddNested : undefined}
                    showAssignee={showAssignee}
                    readonly={readonly}
                    compact={compact}
                    showStatusSelector={showStatusSelector}
                    statusOptions={statusOptions}
                  />

                  {/* Nested Subtasks */}
                  {allowNested &&
                    getNestedSubtasks(subtask.id).map((nested) => (
                      <SortableSubtask
                        key={nested.id}
                        subtask={nested}
                        isNested
                        onToggleComplete={onToggleComplete}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        showAssignee={showAssignee}
                        readonly={readonly}
                        compact={compact}
                        showStatusSelector={showStatusSelector}
                        statusOptions={statusOptions}
                      />
                    ))}
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg">
          {emptyMessage}
        </div>
      )}

      {/* Add New Subtask */}
      {!readonly && (
        <div className="space-y-2">
          {isAdding ? (
            <div className={`flex items-center gap-2 ${addingParentId ? 'ml-8' : ''}`}>
              <Input
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd();
                  if (e.key === 'Escape') {
                    setIsAdding(false);
                    setAddingParentId(undefined);
                    setNewSubtaskTitle('');
                  }
                }}
                placeholder={
                  addingParentId ? 'Nhập subtask con...' : 'Nhập subtask mới...'
                }
                className={compact ? 'h-8 text-sm' : 'h-9'}
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={!newSubtaskTitle.trim()}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setAddingParentId(undefined);
                  setNewSubtaskTitle('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm subtask
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
