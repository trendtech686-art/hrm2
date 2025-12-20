import * as React from 'react';
import { asSystemId, type SystemId } from '@/lib/id-types';
import type { WarrantyTicket } from '../types';

interface CurrentUser {
  name: string;
  systemId: SystemId;
}

interface UseWarrantyCommentsParams {
  ticket: WarrantyTicket | null;
  currentUser: CurrentUser;
  onUpdateTicket: (systemId: SystemId, updates: Partial<WarrantyTicket>) => void;
  onAddHistory: (ticketSystemId: SystemId, action: string, performedBy: string, note?: string | undefined) => void;
}

interface CommentAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file';
}

interface CommentViewModel {
  id: SystemId;
  content: string;
  author: {
    systemId: SystemId;
    name: string;
  };
  createdAt: Date;
  updatedAt?: Date | undefined;
  parentId?: SystemId | undefined;
  attachments: CommentAttachment[];
}

export function useWarrantyComments({
  ticket,
  currentUser,
  onUpdateTicket,
  onAddHistory,
}: UseWarrantyCommentsParams) {
  const mappedComments = React.useMemo<CommentViewModel[]>(() => {
    if (!ticket?.comments?.length) {
      return [];
    }

    return ticket.comments.map((comment, index) => ({
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
    }));
  }, [ticket?.comments]);

  const updateComments = React.useCallback((updater: (comments: NonNullable<WarrantyTicket['comments']>) => WarrantyTicket['comments']) => {
    if (!ticket) return;
    const nextComments = updater(ticket.comments || []);
    onUpdateTicket(ticket.systemId, {
      comments: nextComments,
      updatedAt: new Date().toISOString(),
    });
  }, [onUpdateTicket, ticket]);

  const handleAddComment = React.useCallback((content: string, parentId?: SystemId | undefined) => {
    if (!ticket) return;

    const newComment = {
      systemId: asSystemId(`WC_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`),
      content,
      contentText: content,
      createdBy: currentUser.name,
      createdBySystemId: currentUser.systemId,
      createdAt: new Date().toISOString(),
      attachments: [],
      mentions: [],
      parentId,
    };

    updateComments((comments) => [...comments, newComment]);
    onAddHistory(ticket.systemId, 'Thêm bình luận', currentUser.name);
  }, [currentUser.name, currentUser.systemId, onAddHistory, ticket, updateComments]);

  const handleUpdateComment = React.useCallback((commentId: SystemId, content: string) => {
    if (!ticket) return;

    updateComments((comments) => (
      comments.map((comment) => (
        comment.systemId === commentId
          ? { ...comment, content, contentText: content, updatedAt: new Date().toISOString() }
          : comment
      ))
    ));

    onAddHistory(ticket.systemId, 'Sửa bình luận', currentUser.name);
  }, [currentUser.name, onAddHistory, ticket, updateComments]);

  const handleDeleteComment = React.useCallback((commentId: SystemId) => {
    if (!ticket) return;

    updateComments((comments) => comments.filter((comment) => comment.systemId !== commentId));
    onAddHistory(ticket.systemId, 'Xóa bình luận', currentUser.name);
  }, [currentUser.name, onAddHistory, ticket, updateComments]);

  return {
    comments: mappedComments,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
  };
}
