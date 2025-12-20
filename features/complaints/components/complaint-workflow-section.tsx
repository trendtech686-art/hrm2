import React from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { SubtaskList } from '../../../components/shared/subtask-list';
import { getWorkflowTemplate } from '../../settings/printer/workflow-templates-page';
import { complaintStatusLabels } from '../types';
import type { Complaint, ComplaintAction } from '../types';
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
            const currentSubtasks = complaint.subtasks || getWorkflowTemplate('complaints');
            const toggledSubtask = currentSubtasks.find(s => s.id === id);
            if (!toggledSubtask) return;

            const updatedSubtasks = currentSubtasks.map(s =>
              s.id === id 
                ? { ...s, completed, completedAt: completed ? new Date() : undefined } 
                : s
            );

            // Add to timeline
            const action = completed ? 'Hoàn thành bước' : 'Bỏ hoàn thành bước';
            const newAction: ComplaintAction = {
              id: asSystemId(Date.now().toString()),
              actionType: 'commented',
              performedBy: asSystemId(currentUser.systemId),
              performedAt: new Date(),
              note: `${action}: "${toggledSubtask.title}"`,
            };
            
            updateComplaint(complaint.systemId, {
              ...complaint,
              subtasks: updatedSubtasks,
              timeline: [...complaint.timeline, newAction],
            });

            toast.success(`${action}: ${toggledSubtask.title}`);
          }}
          showProgress={true}
          compact={false}
        />
      </CardContent>
    </Card>
  );
};
