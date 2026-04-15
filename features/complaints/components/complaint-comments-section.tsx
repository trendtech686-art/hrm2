import React from 'react';
import { Comments } from '@/components/Comments';
import { useComments } from '@/hooks/use-comments';
import { useEmployeeFetchMentions } from '@/features/employees/hooks/use-employee-search';
import type { Complaint } from '../types';

interface Props {
  complaint: Complaint;
  employees: Array<{ systemId: string; fullName: string }>;
}

export const ComplaintCommentsSection: React.FC<Props> = React.memo(({ complaint, employees }) => {
  const fetchMentions = useEmployeeFetchMentions();

  const {
    comments,
    draft,
    addComment,
    updateComment,
    deleteComment,
  } = useComments('complaint', complaint.systemId);

  // Pre-index employees for O(1) lookup
  const employeeMap = React.useMemo(
    () => new Map(employees.map(e => [e.systemId, e.fullName])),
    [employees]
  );

  const mappedComments = React.useMemo(() => 
    comments.map(c => ({
      id: c.systemId,
      content: c.content,
      author: {
        systemId: c.createdBy || '',
        name: c.createdByName || (c.createdBy ? employeeMap.get(c.createdBy) : undefined) || 'Unknown',
      },
      createdAt: new Date(c.createdAt!),
      updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
      attachments: (c.attachments || []).map((url, idx) => ({
        id: `${c.systemId}-${idx}`,
        url,
        type: 'image' as const,
        name: `Attachment ${idx + 1}`,
      })),
    })),
    [comments, employeeMap]
  );

  return (
    <Comments
      entityType="complaint"
      entityId={complaint.systemId}
      comments={mappedComments}
      onAddComment={(content) => addComment(content)}
      onUpdateComment={(commentId, content) => updateComment(commentId, content)}
      onDeleteComment={(commentId) => deleteComment(commentId)}
      fetchMentions={fetchMentions}
      title="Bình luận"
      initialDraft={draft}
    />
  );
});

ComplaintCommentsSection.displayName = 'ComplaintCommentsSection';
