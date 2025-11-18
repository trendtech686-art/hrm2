import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { SubtaskList, type Subtask } from '../../../../components/shared/subtask-list.tsx';
import type { WarrantyTicket } from '../../types.ts';
import { getWorkflowTemplate } from '../../../settings/templates/workflow-templates-page.tsx';

interface WarrantyWorkflowCardProps {
  ticket: WarrantyTicket;
  currentUserName: string;
  onUpdateTicket: (systemId: string, updates: Partial<WarrantyTicket>) => void;
  onUpdateStatus: (systemId: string, status: WarrantyTicket['status'], note?: string) => void;
  onAddHistory: (systemId: string, action: string, performedBy: string, note?: string) => void;
}

function ensureSubtasks(ticket: WarrantyTicket, onUpdateTicket: WarrantyWorkflowCardProps['onUpdateTicket']) {
  if (ticket.subtasks && ticket.subtasks.length > 0) {
    return ticket.subtasks;
  }

  const template = getWorkflowTemplate('warranty');
  onUpdateTicket(ticket.systemId, { ...ticket, subtasks: template });
  return template as Subtask[];
}

export function WarrantyWorkflowCard({
  ticket,
  currentUserName,
  onUpdateTicket,
  onUpdateStatus,
  onAddHistory,
}: WarrantyWorkflowCardProps) {
  const subtasks = React.useMemo(() => ensureSubtasks(ticket, onUpdateTicket), [ticket, onUpdateTicket]);

  const handleToggleComplete = React.useCallback(
    (id: string, completed: boolean) => {
      const toggledSubtask = subtasks.find((s) => s.id === id);
      const updatedSubtasks = subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, completed, completedAt: completed ? new Date() : undefined } : subtask
      );

      let nextStatus: WarrantyTicket['status'] = ticket.status;
      if (completed && toggledSubtask?.triggerStatus) {
        nextStatus = toggledSubtask.triggerStatus as WarrantyTicket['status'];
      }

      if (nextStatus !== ticket.status) {
        onUpdateStatus(ticket.systemId, nextStatus);
      } else {
        onUpdateTicket(ticket.systemId, { ...ticket, subtasks: updatedSubtasks });
      }

      if (toggledSubtask) {
        const action = completed ? 'Hoàn thành bước' : 'Bỏ hoàn thành bước';
        onAddHistory(ticket.systemId, action, currentUserName, `"${toggledSubtask.title}"`);
      }
    },
    [subtasks, ticket, onUpdateStatus, onUpdateTicket, onAddHistory, currentUserName]
  );

  const handleAllCompleted = React.useCallback(() => {
    if (ticket.status !== 'returned') {
      onUpdateStatus(ticket.systemId, 'returned', 'Hoàn thành toàn bộ quy trình xử lý');
    }
  }, [ticket, onUpdateStatus]);

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
          statusOptions={[
            { value: 'new', label: 'Mới' },
            { value: 'pending', label: 'Chưa xử lý' },
            { value: 'processed', label: 'Đã xử lý' },
            { value: 'returned', label: 'Đã trả' },
          ]}
        />
      </CardContent>
    </Card>
  );
}
