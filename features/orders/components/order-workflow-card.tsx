import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { SubtaskList, type Subtask } from '../../../components/shared/subtask-list.tsx';
import type { Order } from '../types.ts';
import { getWorkflowTemplate } from '../../settings/printer/workflow-templates-page.tsx';
import { toast } from 'sonner';

interface OrderWorkflowCardProps {
  order: Order;
  onUpdateOrder: (systemId: string, updates: Partial<Order>) => void;
}

export function OrderWorkflowCard({
  order,
  onUpdateOrder,
}: OrderWorkflowCardProps) {
  // Initialize subtasks from template if empty
  const subtasks = React.useMemo((): Subtask[] => {
    if (order.subtasks && order.subtasks.length > 0) {
      // Convert order.subtasks to Subtask[] format
      return order.subtasks.map((s, index) => ({
        id: s.id,
        title: s.title,
        completed: s.completed,
        order: s.order ?? index,
        createdAt: s.createdAt ?? new Date(),
        completedAt: s.completedAt,
        assigneeId: s.assigneeId,
        assigneeName: s.assigneeName,
        parentId: s.parentId,
        metadata: s.metadata,
      }));
    }
    
    // Get default workflow template for orders
    const template = getWorkflowTemplate('orders');
    if (template.length > 0) {
      // Save to order
      onUpdateOrder(order.systemId, { subtasks: template });
      return template;
    }
    
    return [];
  }, [order.subtasks, order.systemId, onUpdateOrder]);

  const handleToggleComplete = React.useCallback(
    (id: string, completed: boolean) => {
      const toggledSubtask = subtasks.find((s) => s.id === id);
      if (!toggledSubtask) return;

      const updatedSubtasks = subtasks.map((subtask) =>
        subtask.id === id 
          ? { ...subtask, completed, completedAt: completed ? new Date() : undefined } 
          : subtask
      );

      onUpdateOrder(order.systemId, { subtasks: updatedSubtasks });

      const action = completed ? 'Hoàn thành bước' : 'Bỏ hoàn thành bước';
      toast.success(`${action}: ${toggledSubtask.title}`);
    },
    [subtasks, order.systemId, onUpdateOrder]
  );

  const handleAllCompleted = React.useCallback(() => {
    toast.success('Đã hoàn thành toàn bộ quy trình xử lý đơn hàng!');
  }, []);

  // Show message if no workflow template is configured for orders
  if (subtasks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Quy trình xử lý</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">Chưa cấu hình quy trình</p>
            <p className="text-xs mt-1">
              Vào <a href="/settings/workflow-templates" className="text-primary hover:underline">Cài đặt → Quy trình</a> để thiết lập
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Quy trình xử lý</CardTitle>
      </CardHeader>
      <CardContent>
        <SubtaskList
          subtasks={subtasks}
          onToggleComplete={handleToggleComplete}
          onAllCompleted={handleAllCompleted}
          showProgress
          readonly
          compact={false}
        />
      </CardContent>
    </Card>
  );
}
