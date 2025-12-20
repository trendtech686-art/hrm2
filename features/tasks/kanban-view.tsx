import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { SlaTimer } from '../../components/SlaTimer';
import { AssigneeAvatarGroup } from './components/AssigneeAvatarGroup';
import { loadCardColorSettings } from '../../features/settings/tasks/tasks-settings-page';
import { cn } from '../../lib/utils';
import { formatDate } from '@/lib/date-utils';
import { Clock, AlertCircle, Play, FileCheck, CheckCircle2, XCircle, Pause, GripVertical } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority } from './types';
import { toast } from 'sonner';

const taskStatusColumns: TaskStatus[] = [
  'Chưa bắt đầu',
  'Đang thực hiện',
  'Đang chờ',
  'Chờ duyệt',
  'Chờ xử lý',
  'Hoàn thành',
  'Đã hủy'
];

const statusIcons: Record<TaskStatus, React.ElementType> = {
  'Chưa bắt đầu': Clock,
  'Đang thực hiện': Play,
  'Đang chờ': Pause,
  'Chờ duyệt': FileCheck,
  'Chờ xử lý': AlertCircle,
  'Hoàn thành': CheckCircle2,
  'Đã hủy': XCircle,
};

const priorityVariants: Record<TaskPriority, "default" | "secondary" | "warning" | "destructive"> = {
  "Thấp": "secondary",
  "Trung bình": "default",
  "Cao": "warning",
  "Khẩn cấp": "destructive",
  low: "secondary",
  medium: "default",
  high: "warning",
  urgent: "destructive",
};

/**
 * Draggable Task Card Component
 */
function DraggableTaskCard({
  task,
  employees,
  onTaskClick,
}: {
  task: Task;
  employees: Array<{ systemId: string; fullName: string }>;
  onTaskClick: (task: Task) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.systemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Hoàn thành';
  const priorityVariants: Record<TaskPriority, "default" | "secondary" | "warning" | "destructive"> = {
    "Thấp": "secondary",
    "Trung bình": "default",
    "Cao": "warning",
    "Khẩn cấp": "destructive",
    low: "secondary",
    medium: "default",
    high: "warning",
    urgent: "destructive",
  };

  // Load card color settings
  const colorSettings = React.useMemo(() => loadCardColorSettings(), []);
  
  // Determine card color class: overdue > priority > status
  const cardColorClass = React.useMemo(() => {
    // Priority 1: Overdue color (if enabled and task is overdue)
    if (colorSettings.enableOverdueColor && isOverdue) {
      return colorSettings.overdueColor;
    }
    
    // Priority 2: Priority colors (if enabled)
    if (colorSettings.enablePriorityColors) {
      return colorSettings.priorityColors[task.priority];
    }
    
    // Priority 3: Status colors (if enabled)
    if (colorSettings.enableStatusColors) {
      return colorSettings.statusColors[task.status];
    }
    
    // Default: no custom color
    return '';
  }, [colorSettings, isOverdue, task.priority, task.status]);

  return (
    <div ref={setNodeRef} style={style} className="pb-3">
      <Card
        className={cn(
          "p-4 cursor-pointer transition-colors hover:bg-accent",
          cardColorClass,
          isOverdue && !colorSettings.enableOverdueColor && "border-destructive",
          isDragging && "shadow-lg"
        )}
      >
        {/* Drag Handle + Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div 
              {...attributes} 
              {...listeners}
              className="cursor-grab active:cursor-grabbing touch-none"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div 
              className="text-sm font-semibold flex-1"
              onClick={() => onTaskClick(task)}
            >
              {task.id}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap justify-end">
            <Badge variant={priorityVariants[task.priority]} className="text-xs">
              {task.priority}
            </Badge>
            {task.approvalStatus === 'pending' && (
              <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                Chờ duyệt
              </Badge>
            )}
            {task.approvalStatus === 'rejected' && (
              <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300">
                Làm lại
              </Badge>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="mb-2" onClick={() => onTaskClick(task)}>
          <div className="text-sm font-medium text-foreground line-clamp-2">
            {task.title}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2" onClick={() => onTaskClick(task)}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Tiến độ</span>
            <span className="text-xs font-medium">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>

        {/* Timer Badge - Show if timer is running */}
        {task.timerRunning && (
          <div 
            className="mb-2 flex items-center gap-1.5 text-xs bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-2 py-1 rounded"
            onClick={() => onTaskClick(task)}
          >
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
            <Clock className="h-3 w-3" />
            <span className="font-medium">Đang đếm giờ</span>
          </div>
        )}

        {/* SLA Timer */}
        <div onClick={() => onTaskClick(task)}>
          <SlaTimer
            startTime={task.startDate}
            targetMinutes={task.estimatedHours ? task.estimatedHours * 60 : 480}
            isCompleted={task.status === 'Hoàn thành'}
            completedLabel="Đã hoàn thành"
            className="mb-2"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs" onClick={() => onTaskClick(task)}>
          <div className="flex items-center gap-2">
            <AssigneeAvatarGroup 
              assignees={task.assignees || []} 
              maxVisible={2} 
              size="sm"
              showRoles={false}
            />
          </div>
          <div className={cn(
            "text-muted-foreground",
            isOverdue && "text-destructive font-semibold"
          )}>
            {isOverdue && "⚠️ "}
            {formatDate(task.dueDate)}
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * Kanban Column Component for Tasks
 */
function KanbanColumn({
  status,
  tasks,
  onTaskClick,
  employees,
}: {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  employees: Array<{ systemId: string; fullName: string }>;
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const { setNodeRef } = useSortable({
    id: status,
    data: { type: 'column', status },
  });
  
  const StatusIcon = statusIcons[status];
  
  // Filter tasks based on local search
  const filteredTasks = React.useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    
    const query = searchQuery.toLowerCase();
    return tasks.filter(t => 
      t.id.toLowerCase().includes(query) ||
      t.title.toLowerCase().includes(query) ||
      t.assigneeName.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);
  
  // Virtual scrolling setup
  const virtualizer = useVirtualizer({
    count: filteredTasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180,
    overscan: 5,
  });

  return (
    <div ref={setNodeRef} className="flex-1 min-w-[300px] flex flex-col max-h-[calc(100vh-320px)]">
      {/* Header */}
      <div className="text-sm font-semibold px-4 py-3 mb-2 rounded-lg border bg-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className="h-4 w-4" />
          {status}
        </div>
        <span className="text-sm font-normal bg-background h-6 w-6 flex items-center justify-center rounded-full">
          {filteredTasks.length}
        </span>
      </div>
      
      {/* Search Input */}
      <div className="mb-2">
        <Input
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Scrollable Cards Area */}
      <div 
        ref={parentRef}
        className="flex-1 overflow-y-auto pb-2"
        style={{ 
          height: '100%',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const task = filteredTasks[virtualItem.index];
            
            return (
              <div
                key={task.systemId}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <DraggableTaskCard
                  task={task}
                  employees={employees}
                  onTaskClick={onTaskClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Main Kanban View Component
 */
export function TaskKanbanView({
  tasks,
  onTaskClick,
  employees,
  onTaskUpdate,
}: {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  employees: Array<{ systemId: string; fullName: string }>;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  // Group tasks by status
  const tasksByStatus = React.useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      'Chưa bắt đầu': [],
      'Đang thực hiện': [],
      'Đang chờ': [],
      'Chờ duyệt': [],
      'Chờ xử lý': [],
      'Hoàn thành': [],
      'Đã hủy': [],
    };
    
    tasks.forEach(task => {
      grouped[task.status].push(task);
    });
    
    return grouped;
  }, [tasks]);

  // Handle drag end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    // Get task being dragged
    const taskId = active.id;
    const task = tasks.find(t => t.systemId === taskId);
    
    if (!task) {
      setActiveId(null);
      return;
    }

    // Get target status from over column
    const newStatus = over.data.current?.status || over.id;
    
    // If status changed, update task
    if (newStatus && newStatus !== task.status) {
      onTaskUpdate(taskId, { ...task, status: newStatus as TaskStatus });
      toast.success('Đã chuyển trạng thái', {
        description: `${task.id} đã chuyển sang "${newStatus}"`,
      });
    }

    setActiveId(null);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  // Get active task for drag overlay
  const activeTask = activeId ? tasks.find(t => t.systemId === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {taskStatusColumns.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onTaskClick={onTaskClick}
            employees={employees}
          />
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask && (
          <div className="opacity-90">
            <DraggableTaskCard
              task={activeTask}
              employees={employees}
              onTaskClick={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
