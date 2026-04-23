import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
import { SubtaskList, type Subtask } from '../../../components/shared/subtask-list';
import type { Order } from '../types';
import { getWorkflowTemplate } from '../../settings/printer/workflow-templates-page';
import { toast } from 'sonner';

interface OrderWorkflowCardProps {
  order: Order;
  onUpdateOrder: (systemId: string, updates: Partial<Order>) => void;
}

export function OrderWorkflowCard({
  order,
  onUpdateOrder,
}: OrderWorkflowCardProps) {
  // Track if we need to initialize from template
  const needsTemplateInit = React.useRef(false);
  
  // Calculate subtasks - don't call onUpdateOrder inside useMemo!
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
        metadata: (s.metadata as Record<string, unknown>) ?? undefined,
      })) satisfies Subtask[];
    }
    
    // Get default workflow template for orders
    const template = getWorkflowTemplate('orders');
    if (template.length > 0) {
      // Mark for initialization in useEffect (not during render!)
      needsTemplateInit.current = true;
      return template;
    }
    
    return [];
  }, [order.subtasks]);

  // Initialize subtasks from template AFTER render (in useEffect)
  React.useEffect(() => {
    if (needsTemplateInit.current && (!order.subtasks || order.subtasks.length === 0)) {
      const template = getWorkflowTemplate('orders');
      if (template.length > 0) {
        const orderSubtasks = template.map(t => ({
          ...t,
          metadata: (t.metadata as Record<string, unknown>) ?? undefined,
        }));
        onUpdateOrder(order.systemId, { subtasks: orderSubtasks });
      }
      needsTemplateInit.current = false;
    }
  }, [order.systemId, order.subtasks, onUpdateOrder]);

  const handleToggleComplete = React.useCallback(
    (id: string, completed: boolean) => {
      const toggledSubtask = subtasks.find((s) => s.id === id);
      if (!toggledSubtask) return;

      const updatedSubtasks = subtasks.map((subtask) =>
        subtask.id === id 
          ? { ...subtask, completed, completedAt: completed ? new Date() : undefined } 
          : subtask
      );

      // Cast to Order's subtasks format
      const orderSubtasks = updatedSubtasks.map(s => ({
        ...s,
        metadata: (s.metadata as Record<string, unknown>) ?? undefined,
      }));
      onUpdateOrder(order.systemId, { subtasks: orderSubtasks });

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
      <Card className={cn(mobileBleedCardClass, "border-dashed")}>
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
    <Card className={mobileBleedCardClass}>
      <CardHeader>
        <CardTitle>Quy trình xử lý</CardTitle>
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
