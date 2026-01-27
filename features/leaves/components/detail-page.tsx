'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatDate } from '@/lib/date-utils';
import { useLeaveById } from '../hooks/use-leaves';
import { usePageHeader } from '@/contexts/page-header-context';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { DetailField } from '@/components/ui/detail-field';
import { Badge } from '@/components/ui/badge';
import { Comments, type Comment as CommentType } from '@/components/Comments';
import { ActivityHistory } from '@/components/ActivityHistory';
import { useAuth } from '@/contexts/auth-context';
import type { LeaveStatus } from '@/lib/types/prisma-extended';
import { useComments } from '@/hooks/use-comments';

const statusVariants: Record<LeaveStatus, "success" | "warning" | "destructive"> = {
    "Chờ duyệt": "warning",
    "Đã duyệt": "success",
    "Đã từ chối": "destructive",
};

export function LeaveDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { data: request } = useLeaveById(systemId);
  const { employee: authEmployee } = useAuth();

  // ✅ Sử dụng useComments hook thay vì localStorage trực tiếp
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('leave', systemId || '');
  
  type LeaveComment = CommentType<SystemId>;
  const comments = React.useMemo<LeaveComment[]>(() => 
    dbComments.map(c => ({
      id: asSystemId(c.systemId),
      content: c.content,
      author: {
        systemId: asSystemId(c.createdBy || 'system'),
        name: c.createdByName || 'Hệ thống',
      },
      createdAt: new Date(c.createdAt),
      updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
      attachments: c.attachments,
    })), 
    [dbComments]
  );

  const handleAddComment = React.useCallback((content: string, attachments?: string[], _parentId?: string) => {
    dbAddComment(content, attachments || []);
  }, [dbAddComment]);

  const handleUpdateComment = React.useCallback((_commentId: string, _content: string) => {
  }, []);

  const handleDeleteComment = React.useCallback((commentId: string) => {
    dbDeleteComment(commentId);
  }, [dbDeleteComment]);

  const commentCurrentUser = React.useMemo(() => ({
    systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
    name: authEmployee?.fullName || 'Hệ thống',
  }), [authEmployee]);

  const headerActions = React.useMemo(() => {
    if (!request) return [];
    return [
      <Button
        key="edit"
        size="sm"
        className="h-9"
        onClick={() => router.push('/leaves')}
      >
        <Edit className="mr-2 h-4 w-4" />
        Sửa đơn
      </Button>
    ];
  }, [request, router]);

  const statusBadge = React.useMemo(() => {
    if (!request) return undefined;
    return <Badge variant={statusVariants[request.status]}>{request.status}</Badge>;
  }, [request]);

  usePageHeader({
    title: request ? `Đơn nghỉ phép ${request.id}` : 'Chi tiết đơn nghỉ phép',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nghỉ phép', href: '/leaves', isCurrent: false },
      { label: request?.id || 'Chi tiết', href: '', isCurrent: true }
    ],
    badge: statusBadge,
    actions: headerActions,
  });

  if (!request) {
    return (
        <div className="text-center p-8">
            <h2 className="text-h3 font-bold">Không tìm thấy đơn nghỉ phép</h2>
            <Button onClick={() => router.push('/leaves')} className="mt-4">Quay về danh sách</Button>
        </div>
    );
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="text-h4">Thông tin đơn</CardTitle>
        <CardDescription>
          Thời gian nghỉ: {formatDate(request.startDate)} - {formatDate(request.endDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
          <dl>
            <DetailField label="Ngày tạo đơn" value={formatDate(request.requestDate)} />
            <DetailField label="Loại phép" value={request.leaveTypeName} />
            <DetailField label="Thời gian nghỉ" value={`${formatDate(request.startDate)} - ${formatDate(request.endDate)}`} />
            <DetailField label="Số ngày nghỉ" value={`${request.numberOfDays} ngày`} />
            <DetailField label="Lý do" value={request.reason} />
            <DetailField label="Trạng thái">
                <Badge variant={statusVariants[request.status]}>{request.status}</Badge>
            </DetailField>
          </dl>
      </CardContent>
    </Card>

    {/* Comments */}
    <Comments
      entityType="leave"
      entityId={request.systemId}
      comments={comments}
      onAddComment={handleAddComment}
      onUpdateComment={handleUpdateComment}
      onDeleteComment={handleDeleteComment}
      currentUser={commentCurrentUser}
      title="Bình luận"
      placeholder="Thêm bình luận về đơn nghỉ phép..."
    />

    {/* Activity History */}
    <ActivityHistory
      history={request.activityHistory || []}
      title="Lịch sử hoạt động"
      emptyMessage="Chưa có lịch sử hoạt động"
      groupByDate
      maxHeight="400px"
    />
    </>
  );
}
