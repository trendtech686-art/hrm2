'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDate, formatDateCustom } from '@/lib/date-utils';
import { usePenaltyStore, usePenaltyTypeStore } from './store';
import { useEmployeeStore } from '../../employees/store';
import { usePageHeader } from '../../../contexts/page-header-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import type { PenaltyStatus } from './types';
import { penaltyCategoryLabels, penaltyCategoryColors } from './types';
import { Comments, type Comment as CommentType } from '../../../components/Comments';
import { ActivityHistory } from '../../../components/ActivityHistory';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { useAuth } from '../../../contexts/auth-context';
import { usePrint } from '../../../lib/use-print';
import { 
  convertPenaltyForPrint,
  mapPenaltyToPrintData, 
  createStoreSettings 
} from '../../../lib/print/penalty-print-helper';
import { useStoreInfoStore } from '../store-info/store-info-store';
import { Printer } from 'lucide-react';

import { ROUTES, generatePath } from '@/lib/router';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const statusConfig: Record<PenaltyStatus, { label: string; variant: "warning" | "success" | "secondary" }> = {
  "Chua thanh toán": { label: "Chua thanh toán", variant: "warning" },
  "Ðã thanh toán": { label: "Ðã thanh toán", variant: "success" },
  "Ðã h?y": { label: "Ðã h?y", variant: "secondary" },
};

export function PenaltyDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { findById } = usePenaltyStore();
  const { data: penaltyTypes } = usePenaltyTypeStore();
  const { findById: findEmployeeById } = useEmployeeStore();
  const { employee: authEmployee } = useAuth();
  const { print } = usePrint();
  const { info: storeInfo } = useStoreInfoStore();
  
  const penalty = React.useMemo(() => (systemId ? findById(systemId as any) : null), [systemId, findById]);
  
  // Get employee details
  const penalizedEmployee = React.useMemo(() => {
    if (!penalty?.employeeSystemId) return null;
    return findEmployeeById(penalty.employeeSystemId);
  }, [penalty?.employeeSystemId, findEmployeeById]);
  
  const issuerEmployee = React.useMemo(() => {
    if (!penalty?.issuerSystemId) return null;
    return findEmployeeById(penalty.issuerSystemId);
  }, [penalty?.issuerSystemId, findEmployeeById]);

  const handlePrint = () => {
    if (!penalty) return;
    
    const storeSettings = createStoreSettings(storeInfo);
    const forPrint = convertPenaltyForPrint(penalty, {
      employee: penalizedEmployee,
      issuer: issuerEmployee,
    });
    
    print('penalty', { data: mapPenaltyToPrintData(forPrint, storeSettings) });
  };

  // Comments state with localStorage persistence
  type PenaltyComment = CommentType<SystemId>;
  const [comments, setComments] = React.useState<PenaltyComment[]>(() => {
    const saved = localStorage.getItem(`penalty-comments-${systemId}`);
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    if (systemId) {
      localStorage.setItem(`penalty-comments-${systemId}`, JSON.stringify(comments));
    }
  }, [comments, systemId]);

  const handleAddComment = React.useCallback((content: string, attachments?: string[], parentId?: string) => {
    const newComment: PenaltyComment = {
      id: asSystemId(`comment-${Date.now()}`),
      content,
      author: {
        systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
        name: authEmployee?.fullName || 'H? th?ng',
        avatar: authEmployee?.avatar,
      },
      createdAt: new Date().toISOString(),
      attachments,
      parentId: parentId as SystemId | undefined,
    };
    setComments(prev => [...prev, newComment]);
  }, [authEmployee]);

  const handleUpdateComment = React.useCallback((commentId: string, content: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, content, updatedAt: new Date().toISOString() } : c
    ));
  }, []);

  const handleDeleteComment = React.useCallback((commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, []);

  const commentCurrentUser = React.useMemo(() => ({
    systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
    name: authEmployee?.fullName || 'H? th?ng',
    avatar: authEmployee?.avatar,
  }), [authEmployee]);

  // Header actions
  const headerActions = React.useMemo(() => {
    const actions = [
      <Button 
        key="back" 
        variant="outline" 
        size="sm"
        className="h-9"
        onClick={() => router.push('/penalties')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay l?i
      </Button>
    ];
    
    if (penalty) {
      actions.push(
        <Button 
          key="print" 
          variant="outline"
          size="sm"
          className="h-9"
          onClick={handlePrint}
        >
          <Printer className="mr-2 h-4 w-4" />
          In phi?u
        </Button>
      );
    }
    
    if (penalty && penalty.status !== 'Ðã h?y') {
      actions.push(
        <Button 
          key="edit" 
          size="sm"
          className="h-9"
          onClick={() => router.push(`/penalties/${systemId}/edit`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Ch?nh s?a
        </Button>
      );
    }
    
    return actions;
  }, [router, systemId, penalty]);

  // Page header
  usePageHeader({
    title: penalty ? `Phi?u ph?t ${penalty.id}` : 'Chi ti?t phi?u ph?t',
    badge: penalty ? <Badge variant={statusConfig[penalty.status].variant}>{statusConfig[penalty.status].label}</Badge> : undefined,
    breadcrumb: penalty ? [
      { label: 'Trang ch?', href: '/', isCurrent: false },
      { label: 'Phi?u ph?t', href: '/penalties', isCurrent: false },
      { label: penalty.id, href: `/penalties/${systemId}`, isCurrent: true }
    ] : [
      { label: 'Trang ch?', href: '/', isCurrent: false },
      { label: 'Phi?u ph?t', href: '/penalties', isCurrent: true }
    ],
    actions: headerActions,
    showBackButton: true,
    backPath: '/penalties'
  });

  if (!penalty) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Không tìm th?y phi?u ph?t
        </CardContent>
      </Card>
    );
  }

  const penaltyType = penalty.penaltyTypeSystemId 
    ? penaltyTypes.find(pt => pt.systemId === penalty.penaltyTypeSystemId)
    : null;

  return (
    <div className="space-y-6">
      {/* Thông tin chính */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Thông tin phi?u ph?t</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* S? ti?n ph?t - Highlighted */}
          <div className="md:col-span-2 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <p className="text-sm text-muted-foreground mb-1">S? ti?n ph?t</p>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(penalty.amount)} ?</p>
          </div>
          
          {/* Nhân viên b? ph?t */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Nhân viên b? ph?t</p>
            {penalizedEmployee ? (
              <Link href={generatePath(ROUTES.HRM.EMPLOYEE_VIEW, { systemId: penalty.employeeSystemId })} 
                className="font-medium text-primary hover:underline"
              >
                {penalty.employeeName}
              </Link>
            ) : (
              <p className="font-medium">{penalty.employeeName}</p>
            )}
          </div>
          
          {/* Ngày l?p phi?u */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ngày l?p phi?u</p>
            <p className="font-medium">{formatDateCustom(new Date(penalty.issueDate), 'dd/MM/yyyy')}</p>
          </div>
          
          {/* Lo?i ph?t */}
          {penalty.penaltyTypeName && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Lo?i ph?t</p>
              <p className="font-medium">{penalty.penaltyTypeName}</p>
            </div>
          )}
          
          {/* Phân lo?i */}
          {penalty.category && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phân lo?i</p>
              <Badge variant="outline" className={penaltyCategoryColors[penalty.category]}>
                {penaltyCategoryLabels[penalty.category]}
              </Badge>
            </div>
          )}
          
          {/* Tr?ng thái */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tr?ng thái</p>
            <Badge variant={statusConfig[penalty.status].variant}>
              {statusConfig[penalty.status].label}
            </Badge>
          </div>
          
          {/* Ngu?i l?p phi?u */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ngu?i l?p phi?u</p>
            {issuerEmployee ? (
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
            <p className="text-sm text-muted-foreground mb-1">Lý do ph?t</p>
            <p className="font-medium whitespace-pre-wrap bg-muted/50 rounded-md p-3">{penalty.reason}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Liên k?t */}
      {(penalty.linkedComplaintSystemId || penalty.linkedOrderSystemId || penalty.deductedInPayrollId) && (
        <Card>
          <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Liên k?t</CardTitle>
        </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Khi?u n?i liên quan */}
            {penalty.linkedComplaintSystemId && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Khi?u n?i liên quan</p>
                <Link href={`/complaints/${penalty.linkedComplaintSystemId}`} 
                  className="font-medium font-mono text-primary hover:underline"
                >
                  {penalty.linkedComplaintSystemId}
                </Link>
              </div>
            )}
            
            {/* Ðon hàng liên quan */}
            {penalty.linkedOrderSystemId && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ðon hàng liên quan</p>
                <Link href={`/orders/${penalty.linkedOrderSystemId}`} 
                  className="font-medium font-mono text-primary hover:underline"
                >
                  {penalty.linkedOrderSystemId}
                </Link>
              </div>
            )}
            
            {/* Ðã tr? vào b?ng luong */}
            {penalty.deductedInPayrollId && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ðã tr? vào b?ng luong</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
                    Ðã tr? luong
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
      
      {/* Thông tin h? th?ng */}
      <Card>
        <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
          {penalty.createdAt && (
            <p>
              Ngày t?o:{' '}
              <span className="text-foreground font-medium">
                {formatDateCustom(new Date(penalty.createdAt), 'dd/MM/yyyy HH:mm')}
              </span>
            </p>
          )}
          {penalty.updatedAt && penalty.updatedAt !== penalty.createdAt && (
            <p>
              C?p nh?t l?n cu?i:{' '}
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
        title="Bình lu?n"
        placeholder="Thêm bình lu?n v? phi?u ph?t..."
      />

      {/* Activity History */}
      <ActivityHistory
        history={penalty.activityHistory || []}
        title="L?ch s? ho?t d?ng"
        emptyMessage="Chua có l?ch s? ho?t d?ng"
        showFilters={false}
        groupByDate
        maxHeight="400px"
      />
    </div>
  );
}
