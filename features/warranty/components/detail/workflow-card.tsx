import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { SubtaskList, type Subtask } from '../../../../components/shared/subtask-list';
import type { WarrantyTicket } from '../../types';
import { getWorkflowTemplate } from '../../../settings/printer/workflow-templates-page';

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

      onUpdateTicket(ticket.systemId, { ...ticket, subtasks: updatedSubtasks });

      if (toggledSubtask) {
        const action = completed ? 'Hoàn thành bước' : 'Bỏ hoàn thành bước';
        onAddHistory(ticket.systemId, action, currentUserName, `"${toggledSubtask.title}"`);
      }
    },
    [subtasks, ticket, onUpdateTicket, onAddHistory, currentUserName]
  );

  const handleAllCompleted = React.useCallback(() => {
    if (ticket.status !== 'returned') {
      onUpdateStatus(ticket.systemId, 'returned', 'Hoàn thành toàn bộ quy trình xử lý');
    }
  }, [ticket, onUpdateStatus]);

  // Show message if no workflow template is configured
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
