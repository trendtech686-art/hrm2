import React from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import { SubtaskList } from '../../../components/shared/subtask-list.tsx';
import { getWorkflowTemplate } from '../../settings/templates/workflow-templates-page.tsx';
import { complaintStatusLabels } from '../types.ts';
import type { Complaint, ComplaintAction } from '../types.ts';
import { asSystemId } from '@/lib/id-types';

interface Props {
  complaint: Complaint;
  currentUser: any;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
}

export const ComplaintWorkflowSection: React.FC<Props> = ({ 
  complaint, 
  currentUser, 
  updateComplaint 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quy trình xử lý</CardTitle>
      </CardHeader>
      <CardContent>
        <SubtaskList
          subtasks={(() => {
            // Auto-initialize from template if empty
            if (!complaint.subtasks || complaint.subtasks.length === 0) {
              const template = getWorkflowTemplate('complaints');
              if (template.length > 0) {
                updateComplaint(complaint.systemId, { ...complaint, subtasks: template });
                return template;
              }
            }
            return complaint.subtasks || [];
          })()}
          readonly={true}
          onToggleComplete={(id, completed) => {
            // Prevent completing if not verified
            if (complaint.verification === "pending-verification") {
              toast.error("Vui lòng xác minh khiếu nại (đúng/sai) trước khi thực hiện quy trình xử lý");
              return;
            }
            
            const currentSubtasks = complaint.subtasks || getWorkflowTemplate('complaints');
            const toggledSubtask = currentSubtasks.find(s => s.id === id);
            if (!toggledSubtask) return;

            const updatedSubtasks = currentSubtasks.map(s =>
              s.id === id 
                ? { ...s, completed, completedAt: completed ? new Date() : undefined } 
                : s
            );

            // Check if this subtask has triggerStatus
            let statusToUpdate = complaint.status;
            if (completed && toggledSubtask.triggerStatus) {
              statusToUpdate = toggledSubtask.triggerStatus as any;
            }

            // Add to timeline
            const action = completed ? 'Hoàn thành bước' : 'Bỏ hoàn thành bước';
            const newAction: ComplaintAction = {
              id: asSystemId(Date.now().toString()),
              actionType: 'commented',
              performedBy: asSystemId(currentUser.systemId),
              performedAt: new Date(),
              note: `${action}: "${toggledSubtask.title}"`,
            };

            // Add status change to timeline if changed
            const actions = [newAction];
            if (statusToUpdate !== complaint.status) {
              actions.push({
                id: asSystemId((Date.now() + 1).toString()),
                actionType: 'status-changed',
                performedBy: asSystemId(currentUser.systemId),
                performedAt: new Date(),
                note: `Tự động chuyển trạng thái: ${complaintStatusLabels[statusToUpdate]}`,
              });
            }
            
            updateComplaint(complaint.systemId, {
              ...complaint,
              subtasks: updatedSubtasks,
              status: statusToUpdate,
              timeline: [...complaint.timeline, ...actions],
            });

            toast.success(`${action}: ${toggledSubtask.title}`);
            if (statusToUpdate !== complaint.status) {
              toast.info(`Tự động chuyển sang: ${complaintStatusLabels[statusToUpdate]}`);
            }
          }}
          onAllCompleted={() => {
            // Khi hoàn thành toàn bộ checklist → Tự động chuyển sang "resolved"
            if (complaint.status !== 'resolved') {
              const newAction: ComplaintAction = {
                id: asSystemId(Date.now().toString()),
                actionType: 'status-changed',
                performedBy: asSystemId(currentUser.systemId),
                performedAt: new Date(),
                note: 'Tự động chuyển trạng thái: Đã giải quyết (Hoàn thành toàn bộ quy trình)',
              };

              updateComplaint(complaint.systemId, {
                ...complaint,
                status: 'resolved',
                resolvedAt: new Date(),
                resolvedBy: currentUser.name,
                timeline: [...complaint.timeline, newAction],
              });

              toast.success('Hoàn thành toàn bộ quy trình! Khiếu nại đã được giải quyết.');
            }
          }}
          showProgress={true}
          compact={false}
        />
      </CardContent>
    </Card>
  );
};
