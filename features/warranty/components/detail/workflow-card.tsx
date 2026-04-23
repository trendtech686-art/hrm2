import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { SubtaskList, type Subtask } from '../../../../components/shared/subtask-list';
import type { WarrantyTicket } from '../../types';
import { getWorkflowTemplate } from '../../../settings/printer/workflow-templates-page';
import { mobileBleedCardClass } from '@/components/layout/page-section';

interface WarrantyWorkflowCardProps {
  ticket: WarrantyTicket;
  currentUserName: string;
  onUpdateTicket: (systemId: string, updates: Partial<WarrantyTicket>) => void;
  onUpdateStatus: (systemId: string, status: WarrantyTicket['status'], note?: string) => void;
  onAddHistory: (systemId: string, action: string, performedBy: string, note?: string) => void;
}

export function WarrantyWorkflowCard({
  ticket,
  currentUserName,
  onUpdateTicket,
  onUpdateStatus,
  onAddHistory,
}: WarrantyWorkflowCardProps) {
  // ✅ Get subtasks from ticket or fallback to empty array
  const subtasks = React.useMemo((): Subtask[] => {
    if (ticket.subtasks && ticket.subtasks.length > 0) {
      return ticket.subtasks;
    }
    return [];
  }, [ticket.subtasks]);

  // ✅ Initialize from template in useEffect (not during render!)
  // Using refs to avoid triggering effect on every ticket/callback change
  const ticketRef = React.useRef(ticket);
  const onUpdateTicketRef = React.useRef(onUpdateTicket);
  React.useEffect(() => {
    ticketRef.current = ticket;
    onUpdateTicketRef.current = onUpdateTicket;
  });

  React.useEffect(() => {
    const currentTicket = ticketRef.current;
    if (!currentTicket.subtasks || currentTicket.subtasks.length === 0) {
      const template = getWorkflowTemplate('warranty');
      if (template.length > 0) {
        onUpdateTicketRef.current(currentTicket.systemId, { subtasks: template });
      }
    }
  }, [ticket.systemId]); // Only run on mount or when ticket systemId changes

  const handleToggleComplete = React.useCallback(
    (id: string, completed: boolean) => {
      const toggledSubtask = subtasks.find((s) => s.id === id);
      const updatedSubtasks = subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, completed, completedAt: completed ? new Date() : undefined } : subtask
      );

      onUpdateTicket(ticket.systemId, { subtasks: updatedSubtasks });

      if (toggledSubtask) {
        const action = completed ? 'Hoàn thành bước' : 'Bỏ hoàn thành bước';
        onAddHistory(ticket.systemId, action, currentUserName, `"${toggledSubtask.title}"`);
      }
    },
    [subtasks, ticket, onUpdateTicket, onAddHistory, currentUserName]
  );

  const handleAllCompleted = React.useCallback(() => {
    if (ticket.status !== 'RETURNED') {
      onUpdateStatus(ticket.systemId, 'RETURNED', 'Hoàn thành toàn bộ quy trình xử lý');
    }
  }, [ticket, onUpdateStatus]);

  // Show message if no workflow template is configured
  if (subtasks.length === 0) {
    return (
      <Card className="border-dashed">
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
