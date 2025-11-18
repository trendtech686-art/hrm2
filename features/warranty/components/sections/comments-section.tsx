import * as React from 'react';
import { Comments } from '../../../../components/Comments.tsx';
import type { WarrantyTicket } from '../../types.ts';

interface CurrentUser {
  name: string;
  systemId: string;
}

interface WarrantyCommentsSectionProps {
  ticket: WarrantyTicket;
  currentUser: CurrentUser;
  onUpdateTicket: (systemId: string, updates: Partial<WarrantyTicket>) => void;
  onAddHistory: (ticketSystemId: string, action: string, performedBy: string, note?: string) => void;
}

export function WarrantyCommentsSection({
  ticket,
  currentUser,
  onUpdateTicket,
  onAddHistory,
}: WarrantyCommentsSectionProps) {
  const mappedComments = React.useMemo(() => (
    (ticket.comments || []).map((comment, index) => ({
      id: comment.systemId,
      content: comment.contentText || comment.content,
      author: {
        systemId: comment.createdBySystemId,
        name: comment.createdBy,
      },
      createdAt: new Date(comment.createdAt),
      updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : undefined,
      parentId: comment.parentId,
      attachments: (comment.attachments || []).map((url) => ({
        id: url,
        name: url.split('/').pop() || `file-${index}`,
        url,
        type: 'image',
      })),
    }))
  ), [ticket.comments]);

  const handleAddComment = React.useCallback((content: string, parentId?: string) => {
    const newComment = {
      systemId: `WC_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      content,
      contentText: content,
      createdBy: currentUser.name,
      createdBySystemId: currentUser.systemId,
      createdAt: new Date().toISOString(),
      attachments: [],
      mentions: [],
      parentId,
    };

    const nextComments = [...(ticket.comments || []), newComment];
    onUpdateTicket(ticket.systemId, {
      comments: nextComments,
      updatedAt: new Date().toISOString(),
    });

    onAddHistory(ticket.systemId, 'Thêm bình luận', currentUser.name);
  }, [currentUser.name, currentUser.systemId, onAddHistory, onUpdateTicket, ticket]);

  const handleUpdateComment = React.useCallback((commentId: string, content: string) => {
    const nextComments = (ticket.comments || []).map((comment) => (
      comment.systemId === commentId
        ? { ...comment, content, contentText: content, updatedAt: new Date().toISOString() }
        : comment
    ));

    onUpdateTicket(ticket.systemId, {
      comments: nextComments,
      updatedAt: new Date().toISOString(),
    });

    onAddHistory(ticket.systemId, 'Sửa bình luận', currentUser.name);
  }, [currentUser.name, onAddHistory, onUpdateTicket, ticket]);

  const handleDeleteComment = React.useCallback((commentId: string) => {
    const nextComments = (ticket.comments || []).filter((comment) => comment.systemId !== commentId);

    onUpdateTicket(ticket.systemId, {
      comments: nextComments,
      updatedAt: new Date().toISOString(),
    });

    onAddHistory(ticket.systemId, 'Xóa bình luận', currentUser.name);
  }, [currentUser.name, onAddHistory, onUpdateTicket, ticket]);

  return (
    <Comments
      entityType="warranty"
      entityId={ticket.systemId}
      comments={mappedComments}
      onAddComment={handleAddComment}
      onUpdateComment={handleUpdateComment}
      onDeleteComment={handleDeleteComment}
      currentUser={currentUser}
      title="Bình luận"
    />
  );
}
