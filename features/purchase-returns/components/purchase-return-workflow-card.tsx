import * as React from 'react';
import Link from 'next/link';
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
  // Use subtasks directly, fallback to empty array - wrapped in useMemo to stabilize reference
  const workflowSubtasks = React.useMemo(
    () => (subtasks && subtasks.length > 0 ? subtasks : []),
    [subtasks]
  );

  // Initialize subtasks from template if empty (using useEffect to avoid setState during render)
  React.useEffect(() => {
    if ((!subtasks || subtasks.length === 0)) {
      const template = getWorkflowTemplate('purchase-returns');
      if (template.length > 0) {
        onSubtasksChange(template);
      }
    }
  }, [subtasks, onSubtasksChange]); // Include dependencies

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
          <CardTitle size="lg">Quy trình xử lý</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-body-sm">Chưa cấu hình quy trình</p>
            <p className="text-body-xs mt-1">
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
        <CardTitle size="lg">Quy trình xử lý</CardTitle>
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
