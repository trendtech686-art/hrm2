'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { useLeaveStore } from './store';
import { usePageHeader } from '../../contexts/page-header-context';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Edit } from 'lucide-react';
import { DetailField } from '../../components/ui/detail-field';
import { Badge } from '../../components/ui/badge';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory';
import { useAuth } from '../../contexts/auth-context';
import type { LeaveStatus } from '@/lib/types/prisma-extended';

const statusVariants: Record<LeaveStatus, "success" | "warning" | "destructive"> = {
    "Chờ duyệt": "warning",
    "Đã duyệt": "success",
    "Đã từ chối": "destructive",
};

export function LeaveDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { findById } = useLeaveStore();
  const { employee: authEmployee } = useAuth();
  const request = React.useMemo(() => (systemId ? findById(asSystemId(systemId)) : null), [systemId, findById]);

  // Comments state with localStorage persistence
  type LeaveComment = CommentType<SystemId>;
  const [comments, setComments] = React.useState<LeaveComment[]>(() => {
    const saved = localStorage.getItem(`leave-comments-${systemId}`);
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    if (systemId) {
      localStorage.setItem(`leave-comments-${systemId}`, JSON.stringify(comments));
    }
  }, [comments, systemId]);

  const handleAddComment = React.useCallback((content: string, parentId?: string) => {
    const newComment: LeaveComment = {
      id: asSystemId(`comment-${Date.now()}`),
      content,
      author: {
        systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
        name: authEmployee?.fullName || 'Hệ thống',
      },
      createdAt: new Date(),
      parentId: parentId as SystemId | undefined,
    };
    setComments(prev => [...prev, newComment]);
  }, [authEmployee]);

  const handleUpdateComment = React.useCallback((commentId: string, content: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, content, updatedAt: new Date() } : c
    ));
  }, []);

  const handleDeleteComment = React.useCallback((commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, []);

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
