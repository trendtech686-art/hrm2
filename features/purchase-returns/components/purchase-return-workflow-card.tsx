import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { SubtaskList, type Subtask } from '../../../components/shared/subtask-list';
import { getWorkflowTemplate } from '../../settings/printer/workflow-templates-page';
import { toast } from 'sonner';

interface PurchaseReturnWorkflowCardProps {
  subtasks: Subtask[];
  onSubtasksChange: (subtasks: Subtask[]) => void;
  readonly?: boolean;
}

export function PurchaseReturnWorkflowCard({
  subtasks,
  onSubtasksChange,
  readonly = false,
}: PurchaseReturnWorkflowCardProps) {
  // Initialize subtasks from template if empty
  const workflowSubtasks = React.useMemo((): Subtask[] => {
    if (subtasks && subtasks.length > 0) {
      return subtasks;
    }
    
    // Get default workflow template for purchase-returns
    const template = getWorkflowTemplate('purchase-returns');
    if (template.length > 0) {
      // Auto-save to form
      onSubtasksChange(template);
      return template;
    }
    
    return [];
  }, [subtasks, onSubtasksChange]);

  const handleToggleComplete = React.useCallback(
    (id: string, completed: boolean) => {
      const toggledSubtask = workflowSubtasks.find((s) => s.id === id);
      if (!toggledSubtask) return;

      const updatedSubtasks = workflowSubtasks.map((subtask) =>
        subtask.id === id 
          ? { ...subtask, completed, completedAt: completed ? new Date() : undefined } 
          : subtask
      );

      onSubtasksChange(updatedSubtasks);

      const action = completed ? 'Hoàn thành bước' : 'Bỏ hoàn thành bước';
      toast.success(`${action}: ${toggledSubtask.title}`);
    },
    [workflowSubtasks, onSubtasksChange]
  );

  const handleAllCompleted = React.useCallback(() => {
    toast.success('Đã hoàn thành toàn bộ quy trình trả hàng NCC!');
  }, []);

  // Show message if no workflow template is configured
  if (workflowSubtasks.length === 0) {
    return (
      <Card className="h-full border-dashed">
        <CardHeader>
          <CardTitle className="text-h3">Quy trình xử lý</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-body-sm">Chưa cấu hình quy trình</p>
            <p className="text-body-xs mt-1">
              Vào <a href="/settings/workflow-templates" className="text-primary hover:underline">Cài đặt → Quy trình</a> để thiết lập
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-h3">Quy trình xử lý</CardTitle>
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
