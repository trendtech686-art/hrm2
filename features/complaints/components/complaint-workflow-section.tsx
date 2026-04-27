import React from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { SubtaskList } from '../../../components/shared/subtask-list';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { getWorkflowTemplate } from '../../settings/printer/workflow-templates-page';
import type { Complaint, ComplaintAction } from '../types';
import { asSystemId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';

interface Props {
  complaint: Complaint;
  currentUser: { systemId: string; name: string };
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
}

export const ComplaintWorkflowSection: React.FC<Props> = ({ 
  complaint, 
  currentUser, 
  updateComplaint 
}) => {
  // Track if we've already initialized to prevent double-init
  const hasInitializedRef = React.useRef(false);
  
  // Auto-initialize subtasks from template if empty (in useEffect, not during render)
  React.useEffect(() => {
    if (hasInitializedRef.current) return;
    
    if (!complaint.subtasks || complaint.subtasks.length === 0) {
      const template = getWorkflowTemplate('complaints');
      if (template.length > 0) {
        hasInitializedRef.current = true;
        updateComplaint(complaint.systemId, { subtasks: template });
      }
    }
  }, [complaint.systemId, complaint.subtasks, updateComplaint]);

  // Get current subtasks (use template as fallback for display while initializing)
  const currentSubtasks = React.useMemo(() => {
    if (complaint.subtasks && complaint.subtasks.length > 0) {
      return complaint.subtasks;
    }
    // Return template for display (will be saved by useEffect)
    return getWorkflowTemplate('complaints');
  }, [complaint.subtasks]);

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader>
        <CardTitle size="lg">Quy trình xử lý</CardTitle>
      </CardHeader>
      <CardContent>
        <SubtaskList
          subtasks={currentSubtasks}
          readonly={true}
          onToggleComplete={(id, completed) => {
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
              id: asSystemId(generateSubEntityId('ACTION')),
              actionType: 'commented',
              performedBy: asSystemId(currentUser.systemId),
              performedAt: new Date(),
              note: `${action}: "${toggledSubtask.title}"`,
            };
            
            updateComplaint(complaint.systemId, {
              subtasks: updatedSubtasks,
              timeline: [...(complaint.timeline || []), newAction],
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
