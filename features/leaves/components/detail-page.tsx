'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatDate } from '@/lib/date-utils';
import { useLeaveById, useLeaveMutations } from '../hooks/use-leaves';
import { usePageHeader } from '@/contexts/page-header-context';
import { asSystemId, type SystemId } from '@/lib/id-types';
import {
  DetailPageShell,
  MobileSectionCard,
  MobileSectionHeader,
  MobileSectionTitle,
} from '@/components/layout/page-section';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Edit, Ban, Loader2, MoreHorizontal } from 'lucide-react';
import { DetailField } from '@/components/ui/detail-field';
import { Badge } from '@/components/ui/badge';
import { Comments, type Comment as CommentType } from '@/components/Comments';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { useAuth } from '@/contexts/auth-context';
import type { LeaveStatus } from '@/lib/types/prisma-extended';
import { useComments } from '@/hooks/use-comments';
import { toast } from 'sonner';
import { useBreakpoint } from '@/contexts/breakpoint-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

const statusVariants: Record<string, "success" | "secondary" | "destructive"> = {
    "Chờ duyệt": "secondary",
    "Đã duyệt": "success",
    "Đã từ chối": "destructive",
    "Đã hủy": "destructive",
};

export function LeaveDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { data: request, isLoading } = useLeaveById(systemId);
  const { user, can } = useAuth();
  const { employee: authEmployee } = useAuth();
  const { isMobile } = useBreakpoint();
  const mutations = useLeaveMutations();
  const canApprove = can('approve_leaves');

  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');

  const currentUserName = user?.name || user?.email || 'Unknown';

  const handleApprove = React.useCallback(() => {
    if (!systemId) return;
    mutations.approve.mutate(
      { systemId, approvedBy: currentUserName },
      {
        onSuccess: () => toast.success('Đã duyệt đơn nghỉ phép'),
        onError: (err) => toast.error('Lỗi', { description: err.message }),
      }
    );
  }, [systemId, currentUserName, mutations.approve]);

  const handleReject = React.useCallback(() => {
    if (!systemId || !rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    mutations.reject.mutate(
      { systemId, rejectedBy: currentUserName, reason: rejectReason.trim() },
      {
        onSuccess: () => {
          toast.success('Đã từ chối đơn nghỉ phép');
          setRejectDialogOpen(false);
          setRejectReason('');
        },
        onError: (err) => toast.error('Lỗi', { description: err.message }),
      }
    );
  }, [systemId, rejectReason, currentUserName, mutations.reject]);

  const handleCancel = React.useCallback(() => {
    if (!systemId) return;
    mutations.cancel.mutate(systemId, {
      onSuccess: () => toast.success('Đã hủy đơn nghỉ phép'),
      onError: (err) => toast.error('Lỗi', { description: err.message }),
    });
  }, [systemId, mutations.cancel]);

  // Comments
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

  const handleAddComment = React.useCallback((content: string, attachments?: string[]) => {
    dbAddComment(content, attachments || []);
  }, [dbAddComment]);

  const handleDeleteComment = React.useCallback((commentId: string) => {
    dbDeleteComment(commentId);
  }, [dbDeleteComment]);

  const commentCurrentUser = React.useMemo(() => ({
    systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
    name: authEmployee?.fullName || 'Hệ thống',
  }), [authEmployee]);

  // Header actions based on status
  const isPending = request?.status === 'Chờ duyệt';
  const isApproved = request?.status === 'Đã duyệt';

  const headerActions = React.useMemo(() => {
    if (!request) return null;
    const actions: React.ReactNode[] = [];

    if (isPending && canApprove) {
      actions.push(
        <Button
          key="approve"
          size="sm"
          onClick={handleApprove}
          disabled={mutations.approve.isPending}
        >
          {mutations.approve.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
          {mutations.approve.isPending ? 'Đang duyệt...' : 'Duyệt'}
        </Button>
      );
      actions.push(
        <Button
          key="reject"
          size="sm"
          variant="destructive"
          onClick={() => setRejectDialogOpen(true)}
          disabled={mutations.reject.isPending}
        >
          {mutations.reject.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
          {mutations.reject.isPending ? 'Đang xử lý...' : 'Từ chối'}
        </Button>
      );
    }

    if (isPending) {
      actions.push(
        <Button
          key="edit"
          size="sm"
          variant="outline"
          onClick={() => router.push(`/leaves/${systemId}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Sửa
        </Button>
      );
    }

    if (isApproved) {
      actions.push(
        <Button
          key="cancel"
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={mutations.cancel.isPending}
        >
          {mutations.cancel.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ban className="mr-2 h-4 w-4" />}
          {mutations.cancel.isPending ? 'Đang hủy...' : 'Hủy đơn'}
        </Button>
      );
    }

    return actions;
  }, [request, isPending, isApproved, canApprove, handleApprove, handleCancel, mutations, router, systemId]);

  const statusBadge = React.useMemo(() => {
    if (!request) return undefined;
    return <Badge variant={statusVariants[request.status] || 'secondary'}>{request.status}</Badge>;
  }, [request]);

  const mobileHeaderActions = React.useMemo(() => {
    if (!isMobile || !request) return [];
    return [
      <DropdownMenu key="mobile-actions">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isPending && canApprove && (
            <>
              <DropdownMenuItem onClick={handleApprove} disabled={mutations.approve.isPending}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {mutations.approve.isPending ? 'Đang duyệt...' : 'Duyệt'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRejectDialogOpen(true)} disabled={mutations.reject.isPending} className="text-destructive">
                <XCircle className="mr-2 h-4 w-4" />
                {mutations.reject.isPending ? 'Đang xử lý...' : 'Từ chối'}
              </DropdownMenuItem>
            </>
          )}
          {isPending && (
            <DropdownMenuItem onClick={() => router.push(`/leaves/${systemId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Sửa
            </DropdownMenuItem>
          )}
          {isApproved && (
            <DropdownMenuItem onClick={handleCancel} disabled={mutations.cancel.isPending}>
              <Ban className="mr-2 h-4 w-4" />
              {mutations.cancel.isPending ? 'Đang hủy...' : 'Hủy đơn'}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>,
    ];
  }, [isMobile, request, isPending, isApproved, canApprove, handleApprove, handleCancel, mutations, router, systemId]);

  usePageHeader({
    title: request ? `Đơn nghỉ phép ${request.id}` : 'Chi tiết đơn nghỉ phép',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nghỉ phép', href: '/leaves', isCurrent: false },
      { label: request?.id || 'Chi tiết', href: '', isCurrent: true }
    ],
    badge: statusBadge,
    actions: isMobile ? mobileHeaderActions : headerActions,
  });

  if (isLoading) {
    return (
      <MobileSectionCard className="p-8 text-center text-muted-foreground">Đang tải...</MobileSectionCard>
    );
  }

  if (!request) {
    return (
      <MobileSectionCard className="p-8 text-center">
        <h2 className="text-h3 font-bold">Không tìm thấy đơn nghỉ phép</h2>
        <Button onClick={() => router.push('/leaves')} className="mt-4">Quay về danh sách</Button>
      </MobileSectionCard>
    );
  }

  return (
    <DetailPageShell>
    <div className="grid gap-3 md:gap-4 md:grid-cols-2">
      {/* Thông tin đơn */}
      <MobileSectionCard>
        <MobileSectionHeader>
          <MobileSectionTitle>Thông tin đơn</MobileSectionTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Mã đơn: {request.id}</p>
        </MobileSectionHeader>
        <dl>
          <DetailField label="Trạng thái">
            <Badge variant={statusVariants[request.status] || 'secondary'}>{request.status}</Badge>
          </DetailField>
          <DetailField label="Loại phép" value={request.leaveTypeName} />
          <DetailField label="Có lương">
            {request.leaveTypeIsPaid ? <Badge variant="success">Có</Badge> : <Badge variant="secondary">Không</Badge>}
          </DetailField>
          <DetailField label="Ngày tạo đơn" value={formatDate(request.requestDate)} />
        </dl>
      </MobileSectionCard>

      {/* Thông tin nhân viên */}
      <MobileSectionCard>
        <MobileSectionHeader>
          <MobileSectionTitle>Nhân viên</MobileSectionTitle>
        </MobileSectionHeader>
        <dl>
          <DetailField label="Họ tên" value={request.employeeName} />
          <DetailField label="Mã nhân viên" value={request.employeeId} />
          <DetailField label="Thời gian nghỉ" value={`${formatDate(request.startDate)} → ${formatDate(request.endDate)}`} />
          <DetailField label="Số ngày nghỉ" value={`${request.numberOfDays} ngày`} />
        </dl>
      </MobileSectionCard>
    </div>

    {/* Lý do */}
    <MobileSectionCard>
      <MobileSectionHeader>
        <MobileSectionTitle>Lý do nghỉ phép</MobileSectionTitle>
      </MobileSectionHeader>
      <p className="text-sm whitespace-pre-wrap">{request.reason || 'Không có lý do'}</p>
    </MobileSectionCard>

    {/* Comments */}
    <Comments
      entityType="leave"
      entityId={request.systemId}
      comments={comments}
      onAddComment={handleAddComment}
      onUpdateComment={() => {}}
      onDeleteComment={handleDeleteComment}
      currentUser={commentCurrentUser}
      title="Bình luận"
      placeholder="Thêm bình luận về đơn nghỉ phép..."
    />

    {/* Activity History */}
    <EntityActivityTable entityType="leave" entityId={systemId} />

    {/* Reject Dialog */}
    <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Từ chối đơn nghỉ phép</AlertDialogTitle>
          <AlertDialogDescription>
            Vui lòng nhập lý do từ chối đơn nghỉ phép của {request.employeeName}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Nhập lý do từ chối..."
          className="min-h-20"
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setRejectReason('')}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            disabled={!rejectReason.trim() || mutations.reject.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Từ chối
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </DetailPageShell>
  );
}
