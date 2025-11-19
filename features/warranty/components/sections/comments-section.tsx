import { Comments } from '../../../../components/Comments.tsx';
import type { WarrantyTicket } from '../../types.ts';
import { useWarrantyComments } from '../../hooks/use-warranty-comments.ts';

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
    />
  );
}
