import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
import { SubtaskList, type Subtask } from '@/components/shared/subtask-list';
import { getWorkflowTemplate } from '@/features/settings/printer/workflow-templates-page';
import { toast } from 'sonner';

interface SupplierWarrantyWorkflowCardProps {
  subtasks: Subtask[];
  onSubtasksChange: (subtasks: Subtask[]) => void;
  readonly?: boolean;
}

export function SupplierWarrantyWorkflowCard({
  subtasks,
  onSubtasksChange,
  readonly = false,
}: SupplierWarrantyWorkflowCardProps) {
  const workflowSubtasks = React.useMemo((): Subtask[] => {
    if (subtasks && subtasks.length > 0) {
      return subtasks;
    }
    const template = getWorkflowTemplate('supplier-warranty');
    if (template.length > 0) {
      return template;
    }
    return [];
  }, [subtasks]);

  React.useEffect(() => {
    if ((!subtasks || subtasks.length === 0) && workflowSubtasks.length > 0) {
      onSubtasksChange(workflowSubtasks);
    }
  }, [subtasks, workflowSubtasks, onSubtasksChange]);

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
    toast.success('Đã hoàn thành toàn bộ quy trình!');
  }, []);

  if (workflowSubtasks.length === 0) {
    return (
      <Card className={cn(mobileBleedCardClass, 'h-full border-dashed')}>
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
    <Card className={cn(mobileBleedCardClass, 'h-full')}>
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
