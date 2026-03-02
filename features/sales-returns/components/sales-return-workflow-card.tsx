import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { SubtaskList, type Subtask } from '../../../components/shared/subtask-list';
import { getWorkflowTemplate } from '../../settings/printer/workflow-templates-page';
import { toast } from 'sonner';

interface SalesReturnWorkflowCardProps {
  subtasks: Subtask[];
  onSubtasksChange: (subtasks: Subtask[]) => void;
  readonly?: boolean;
}

export function SalesReturnWorkflowCard({
  subtasks,
  onSubtasksChange,
  readonly = false,
}: SalesReturnWorkflowCardProps) {
  // ✅ FIX: Use local state for immediate UI updates, sync to form via debounce
  const [localSubtasks, setLocalSubtasks] = React.useState<Subtask[]>(() => {
    if (subtasks && subtasks.length > 0) return subtasks;
    return getWorkflowTemplate('sales-returns');
  });
  
  // Track if initialized
  const initializedRef = React.useRef(false);
  const syncTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Initialize on mount if subtasks are empty
  React.useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    if (!subtasks || subtasks.length === 0) {
      const template = getWorkflowTemplate('sales-returns');
      if (template.length > 0) {
        setLocalSubtasks(template);
        // Sync to form after a short delay
        syncTimeoutRef.current = setTimeout(() => {
          onSubtasksChange(template);
        }, 100);
      }
    }
    
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [subtasks, onSubtasksChange]);
  
  // Sync from parent if subtasks change externally
  React.useEffect(() => {
    if (subtasks && subtasks.length > 0 && subtasks !== localSubtasks) {
      // Only update if the data is actually different (by comparing IDs and completed status)
      const isEqual = subtasks.length === localSubtasks.length &&
        subtasks.every((s, i) => s.id === localSubtasks[i]?.id && s.completed === localSubtasks[i]?.completed);
      if (!isEqual) {
        setLocalSubtasks(subtasks);
      }
    }
  }, [subtasks, localSubtasks]);

  const handleToggleComplete = React.useCallback(
    (id: string, completed: boolean) => {
      const toggledSubtask = localSubtasks.find((s) => s.id === id);
      if (!toggledSubtask) return;

      const updatedSubtasks = localSubtasks.map((subtask) =>
        subtask.id === id 
          ? { ...subtask, completed, completedAt: completed ? new Date() : undefined } 
          : subtask
      );

      // ✅ Update local state immediately for instant UI feedback
      setLocalSubtasks(updatedSubtasks);

      // ✅ Debounce sync to parent form to avoid expensive re-renders
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(() => {
        onSubtasksChange(updatedSubtasks);
      }, 300); // 300ms debounce

      const action = completed ? 'Hoàn thành bước' : 'Bỏ hoàn thành bước';
      toast.success(`${action}: ${toggledSubtask.title}`);
    },
    [localSubtasks, onSubtasksChange]
  );

  const handleAllCompleted = React.useCallback(() => {
    toast.success('Đã hoàn thành toàn bộ quy trình xử lý!');
  }, []);
  
  // Use local state for rendering
  const workflowSubtasks = localSubtasks;

  // Show message if no workflow template is configured
  if (workflowSubtasks.length === 0) {
    return (
      <Card className="h-full border-dashed">
        <CardHeader>
          <CardTitle>Quy trình xử lý</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">Chưa cấu hình quy trình</p>
            <p className="text-xs mt-1">
              Vào <Link href="/settings/workflow-templates" className="text-primary hover:underline">Cài đặt → Quy trình</Link> để thiết lập
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Quy trình xử lý</CardTitle>
      </CardHeader>
      <CardContent>
        <SubtaskList
          subtasks={workflowSubtasks}
          onToggleComplete={handleToggleComplete}
          onAllCompleted={handleAllCompleted}
          showProgress
          readonly={readonly}
          compact
        />
      </CardContent>
    </Card>
  );
}
