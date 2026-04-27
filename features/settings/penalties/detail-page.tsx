'use client'

import { useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDate, formatDateCustom } from '@/lib/date-utils';
import { usePenaltyById } from './hooks/use-penalties';
import { useAllPenaltyTypes } from './hooks/use-all-penalties';

import { usePageHeader } from '../../../contexts/page-header-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import type { PenaltyStatus as _PenaltyStatus } from './types';
import { penaltyCategoryLabels, penaltyCategoryColors } from './types';
import { Comments, type Comment as _CommentType } from '../../../components/Comments';
import { useComments } from '@/hooks/use-comments';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { DetailPageShell, mobileBleedCardClass } from '@/components/layout/page-section';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { useAuth } from '../../../contexts/auth-context';
import { usePrint } from '../../../lib/use-print';
import { 
  convertPenaltyForPrint,
  mapPenaltyToPrintData, 
  createStoreSettings 
} from '../../../lib/print/penalty-print-helper';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { Printer } from 'lucide-react';

import { ROUTES, generatePath } from '@/lib/router';

const formatCurrency = (value?: number | string) => {
  if (value === undefined || value === null) return '0';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0';
  return new Intl.NumberFormat('vi-VN').format(numValue);
};

const statusConfig: Record<string, { label: string; variant: "warning" | "success" | "secondary" }> = {
  "Chưa thanh toán": { label: "Chưa thanh toán", variant: "warning" },
  "Đã thanh toán": { label: "Đã thanh toán", variant: "success" },
  "Đã hủy": { label: "Đã hủy", variant: "secondary" },
  // Fallback for English status values (defensive)
  "pending": { label: "Chưa thanh toán", variant: "warning" },
  "paid": { label: "Đã thanh toán", variant: "success" },
  "cancelled": { label: "Đã hủy", variant: "secondary" },
};

const defaultStatusConfig = { label: "Không xác định", variant: "secondary" as const };

export function PenaltyDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { data: penalty, isLoading } = usePenaltyById(systemId);
  const { data: penaltyTypes } = useAllPenaltyTypes();
  const { employee: authEmployee, can, isAdmin } = useAuth();
  const { print } = usePrint();
  // ⚡ OPTIMIZED: storeInfo lazy loaded in handlePrint
  

  const handlePrint = useCallback(async () => {
    if (!penalty) return;
    
    const { storeInfo } = await fetchPrintData();
    const storeSettings = createStoreSettings(storeInfo);
    const forPrint = convertPenaltyForPrint(penalty, {});
    
    print('penalty', { data: mapPenaltyToPrintData(forPrint, storeSettings) });
  }, [penalty, print]);

  // Comments from database
  const {
    comments: dbComments,
    addComment: dbAddComment,
    updateComment: dbUpdateComment,
    deleteComment: dbDeleteComment
  } = useComments('penalty', systemId || '');

  const comments = useMemo(() => 
    dbComments.map(c => ({
      id: c.systemId as unknown as SystemId,
      content: c.content,
      author: {
        systemId: (c.createdBy || 'system') as unknown as SystemId,
        name: c.createdByName || 'Hệ thống',
        avatar: undefined,
      },
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      attachments: c.attachments,
    })), 
    [dbComments]
  );

  const handleAddComment = useCallback((content: string, attachments?: string[], _parentId?: string) => {
    dbAddComment(content, attachments || []);
  }, [dbAddComment]);

  const handleUpdateComment = useCallback((commentId: string, content: string) => {
    dbUpdateComment(commentId, content);
  }, [dbUpdateComment]);

  const handleDeleteComment = useCallback((commentId: string) => {
    dbDeleteComment(commentId);
  }, [dbDeleteComment]);

  const commentCurrentUser = useMemo(() => ({
    systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
    name: authEmployee?.fullName || 'Hệ thống',
    avatar: authEmployee?.avatar,
  }), [authEmployee]);

  // Header actions
  const headerActions = useMemo(() => {
    const actions = [
      <Button 
        key="back" 
        variant="outline" 
        size="sm"
        onClick={() => router.push('/penalties')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>
    ];
    
    if (penalty) {
      actions.push(
        <Button 
          key="print" 
          variant="outline"
          size="sm"
          onClick={handlePrint}
        >
          <Printer className="mr-2 h-4 w-4" />
          In phiếu
        </Button>
      );
    }
    
    if (penalty && penalty.status !== 'Đã hủy' && (isAdmin || can('edit_settings'))) {
      actions.push(
        <Button 
          key="edit" 
          size="sm"
          onClick={() => router.push(`/penalties/${systemId}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>
      );
    }
    
    return actions;
  }, [router, systemId, penalty, handlePrint, isAdmin, can]);

  // Page header
  usePageHeader({
    title: penalty ? `Phiếu phạt ${penalty.id}` : 'Chi tiết phiếu phạt',
    badge: penalty ? <Badge variant={(statusConfig[penalty.status] || defaultStatusConfig).variant}>{(statusConfig[penalty.status] || defaultStatusConfig).label}</Badge> : undefined,
    breadcrumb: penalty ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu phạt', href: '/penalties', isCurrent: false },
      { label: penalty.id, href: `/penalties/${systemId}`, isCurrent: true }
    ] : [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu phạt', href: '/penalties', isCurrent: true }
    ],
    actions: headerActions,
    showBackButton: true,
    backPath: '/penalties'
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className={mobileBleedCardClass}>
          <CardHeader className="pb-4">
            <Skeleton className="h-7 w-48" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="md:col-span-2 p-4 rounded-lg bg-muted/30">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-40" />
            </div>
            <div><Skeleton className="h-4 w-32 mb-2" /><Skeleton className="h-5 w-48" /></div>
            <div><Skeleton className="h-4 w-32 mb-2" /><Skeleton className="h-5 w-36" /></div>
            <div><Skeleton className="h-4 w-32 mb-2" /><Skeleton className="h-5 w-44" /></div>
            <div><Skeleton className="h-4 w-32 mb-2" /><Skeleton className="h-5 w-28" /></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!penalty) {
    return (
      <Card className={mobileBleedCardClass}>
        <CardContent className="p-8 text-center text-muted-foreground">
          Không tìm thấy phiếu phạt
        </CardContent>
      </Card>
    );
  }

  const _penaltyType = penalty.penaltyTypeSystemId 
    ? penaltyTypes.find(pt => pt.systemId === penalty.penaltyTypeSystemId)
    : null;

  return (
    <DetailPageShell gap="lg">
      {/* Thông tin chính */}
      <Card className={mobileBleedCardClass}>
        <CardHeader className="pb-4">
          <CardTitle size="lg">Thông tin phiếu phạt</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Số tiền phạt - Highlighted */}
          <div className="md:col-span-2 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <p className="text-sm text-muted-foreground mb-1">Số tiền phạt</p>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(penalty.amount)} đ</p>
          </div>
          
          {/* Nhân viên bị phạt */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Nhân viên bị phạt</p>
            {penalty.employeeSystemId ? (
              <Link href={generatePath(ROUTES.HRM.EMPLOYEE_VIEW, { systemId: penalty.employeeSystemId })} 
                className="font-medium text-primary hover:underline"
              >
                {penalty.employeeName}
              </Link>
            ) : (
              <p className="font-medium">{penalty.employeeName}</p>
            )}
          </div>
          
          {/* Ngày lập phiếu */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ngày lập phiếu</p>
            <p className="font-medium">{formatDateCustom(new Date(penalty.issueDate), 'dd/MM/yyyy')}</p>
          </div>
          
          {/* Loại phạt */}
          {penalty.penaltyTypeName && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Loại phạt</p>
              <p className="font-medium">{penalty.penaltyTypeName}</p>
            </div>
          )}
          
          {/* Phân loại */}
          {penalty.category && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phân loại</p>
              <Badge variant="outline" className={penaltyCategoryColors[penalty.category]}>
                {penaltyCategoryLabels[penalty.category]}
              </Badge>
            </div>
          )}
          
          {/* Trạng thái */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Trạng thái</p>
            <Badge variant={(statusConfig[penalty.status] || defaultStatusConfig).variant}>
              {(statusConfig[penalty.status] || defaultStatusConfig).label}
            </Badge>
          </div>
          
          {/* Người lập phiếu */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Người lập phiếu</p>
            {penalty.issuerSystemId ? (
              <Link href={generatePath(ROUTES.HRM.EMPLOYEE_VIEW, { systemId: penalty.issuerSystemId! })} 
                className="font-medium text-primary hover:underline"
              >
                {penalty.issuerName}
              </Link>
            ) : (
              <p className="font-medium">{penalty.issuerName}</p>
            )}
          </div>
          
          {/* Lý do - Full width */}
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground mb-1">Lý do phạt</p>
            <p className="font-medium whitespace-pre-wrap bg-muted/50 rounded-md p-3">{penalty.reason}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Liên kết */}
      {(penalty.linkedComplaintSystemId || penalty.linkedOrderSystemId || penalty.deductedInPayrollId) && (
        <Card className={mobileBleedCardClass}>
          <CardHeader className="pb-4">
          <CardTitle size="lg">Liên kết</CardTitle>
        </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Khiếu nại liên quan */}
            {penalty.linkedComplaintSystemId && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Khiếu nại liên quan</p>
                <Link href={`/complaints/${penalty.linkedComplaintSystemId}`} 
                  className="font-medium font-mono text-primary hover:underline"
                >
                  {penalty.linkedComplaintSystemId}
                </Link>
              </div>
            )}
            
            {/* Đơn hàng liên quan */}
            {penalty.linkedOrderSystemId && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Đơn hàng liên quan</p>
                <Link href={`/orders/${penalty.linkedOrderSystemId}`} 
                  className="font-medium font-mono text-primary hover:underline"
                >
                  {penalty.linkedOrderSystemId}
                </Link>
              </div>
            )}
            
            {/* Đã trừ vào bảng lương */}
            {penalty.deductedInPayrollId && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Đã trừ vào bảng lương</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-success/15 text-success-foreground border-success/30">
                    Đã trừ lương
                  </Badge>
                  {penalty.deductedAt && (
                    <span className="text-sm text-muted-foreground">
                      ({formatDate(penalty.deductedAt)})
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Thông tin hệ thống */}
      <Card className={mobileBleedCardClass}>
        <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
          {penalty.createdAt && (
            <p>
              Ngày tạo:{' '}
              <span className="text-foreground font-medium">
                {formatDateCustom(new Date(penalty.createdAt), 'dd/MM/yyyy HH:mm')}
              </span>
            </p>
          )}
          {penalty.updatedAt && penalty.updatedAt !== penalty.createdAt && (
            <p>
              Cập nhật lần cuối:{' '}
              <span className="text-foreground font-medium">
                {formatDateCustom(new Date(penalty.updatedAt), 'dd/MM/yyyy HH:mm')}
              </span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Comments */}
      <Comments
        entityType="penalty"
        entityId={penalty.systemId}
        comments={comments}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        currentUser={commentCurrentUser}
        title="Bình luận"
        placeholder="Thêm bình luận về phiếu phạt..."
      />

      {/* Activity History */}
      <EntityActivityTable entityType="penalty" entityId={systemId} />
    </DetailPageShell>
  );
}
