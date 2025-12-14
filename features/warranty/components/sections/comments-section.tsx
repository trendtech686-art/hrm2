import { Comments } from '../../../../components/Comments.tsx';
import type { WarrantyTicket } from '../../types.ts';
import { useWarrantyComments } from '../../hooks/use-warranty-comments.ts';
import { useEmployeeStore } from '../../../employees/store.ts';
import * as React from 'react';

import type { SystemId } from '@/lib/id-types';

interface CurrentUser {
  name: string;
  systemId: SystemId;
}

interface WarrantyCommentsSectionProps {
  ticket: WarrantyTicket;
  currentUser: CurrentUser;
  onUpdateTicket: (systemId: SystemId, updates: Partial<WarrantyTicket>) => void;
  onAddHistory: (ticketSystemId: SystemId, action: string, performedBy: string, note?: string) => void;
}

export function WarrantyCommentsSection({
  ticket,
  currentUser,
  onUpdateTicket,
  onAddHistory,
}: WarrantyCommentsSectionProps) {
  const { data: employees } = useEmployeeStore();

  // Get all employees for @mention in comments
  const employeeMentions = React.useMemo(() => {
    return employees
      .filter(e => !e.isDeleted)
      .map(e => ({
        id: e.systemId,
        label: e.fullName,
        avatar: e.avatarUrl,
      }));
  }, [employees]);

  const {
    comments,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
  } = useWarrantyComments({
    ticket,
    currentUser,
    onUpdateTicket,
    onAddHistory,
  });

  return (
    <Comments
      entityType="warranty"
      entityId={ticket.systemId}
      comments={comments}
      onAddComment={handleAddComment}
      onUpdateComment={handleUpdateComment}
      onDeleteComment={handleDeleteComment}
      currentUser={currentUser}
      title="Bình luận"
      mentions={employeeMentions}
    />
  );
}
