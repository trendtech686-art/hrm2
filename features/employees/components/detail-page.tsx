'use client'

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDate, getMonthsDiff } from '@/lib/date-utils';
import { useEmployee } from '../hooks/use-employees';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { usePageHeader } from '@/contexts/page-header-context';
import { DetailPageShell, mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { useAuth } from '@/contexts/auth-context';
import { Comments } from '@/components/Comments';
import { useComments } from '@/hooks/use-comments';
import { useEmployeeFetchMentions } from '../hooks/use-employee-search';

import type { Employee, EmployeeAddress } from '@/lib/types/prisma-extended';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  Calendar,
  Building2,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import { InfoItem } from '@/components/ui/info-card';
import { StatsCard } from '@/components/ui/stats-card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MobileTabsList, MobileTabsTrigger } from '@/components/layout/page-section';

import { EmployeeDocuments } from './employee-documents';
import { EmployeeAccountTab } from './employee-account-tab';

// ✅ Lazy-load heavy tab components — only loaded when user clicks the tab
const PenaltiesTab = dynamic(() => import('../detail/PenaltiesTab').then(m => ({ default: m.PenaltiesTab })), {
  loading: () => <TabLoadingSkeleton />,
});
const LeavesTab = dynamic(() => import('../detail/LeavesTab').then(m => ({ default: m.LeavesTab })), {
  loading: () => <TabLoadingSkeleton />,
});
const TasksTab = dynamic(() => import('../detail/TasksTab').then(m => ({ default: m.TasksTab })), {
  loading: () => <TabLoadingSkeleton />,
});
const PayrollAttendanceTab = dynamic(() => import('../detail/PayrollAttendanceTab').then(m => ({ default: m.PayrollAttendanceTab })), {
  loading: () => <TabLoadingSkeleton />,
});
const HistoryTab = dynamic(() => import('../detail/HistoryTab').then(m => ({ default: m.HistoryTab })), {
  loading: () => <TabLoadingSkeleton />,
});

// Task stats hook (lightweight, stays in main bundle for stats card)
import { useTaskStats } from '../detail/TasksTab';

// Type for Employee with optional branch relation from API includes
type EmployeeWithBranchRelation = Employee & {
  branchId?: string;
  branch?: { name?: string; systemId?: string };
};

// ============ Helper Functions ============

const getEmploymentStatusBadgeVariant = (status?: string | null): "default" | "secondary" | "destructive" => {
  if (!status) return "destructive";
  const normalizedStatus = status.toUpperCase();
  if (normalizedStatus === "ACTIVE" || status.includes("làm việc")) return "default";
  if (normalizedStatus === "ON_LEAVE" || status.includes("nghỉ") && !status.includes("Đã nghỉ việc")) return "secondary";
  return "destructive";
};

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '-';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatGenderDisplay = (gender?: string | null): string => {
  if (!gender) return '-';
  const map: Record<string, string> = { 'MALE': 'Nam', 'FEMALE': 'Nữ', 'OTHER': 'Khác', 'Nam': 'Nam', 'Nữ': 'Nữ', 'Khác': 'Khác' };
  return map[gender] || gender;
};

const formatEmployeeTypeDisplay = (type?: string | null): string => {
  if (!type) return '-';
  const map: Record<string, string> = {
    'FULLTIME': 'Toàn thời gian', 'PARTTIME': 'Bán thời gian', 'INTERN': 'Thực tập', 'PROBATION': 'Thử việc',
    'Chính thức': 'Toàn thời gian', 'Toàn thời gian': 'Toàn thời gian', 'Bán thời gian': 'Bán thời gian', 'Thực tập sinh': 'Thực tập', 'Thử việc': 'Thử việc',
  };
  return map[type] || type;
};

const formatEmploymentStatusDisplay = (status?: string | null): string => {
  if (!status) return '-';
  const map: Record<string, string> = {
    'ACTIVE': 'Đang làm việc', 'ON_LEAVE': 'Tạm nghỉ', 'TERMINATED': 'Đã nghỉ việc',
    'Đang làm việc': 'Đang làm việc', 'Tạm nghỉ': 'Tạm nghỉ', 'Đã nghỉ việc': 'Đã nghỉ việc', 'Nghỉ việc': 'Đã nghỉ việc',
  };
  return map[status] || status;
};

const formatAddressDisplay = (addr: EmployeeAddress | null | undefined): string => {
  if (!addr) return '-';
  const { street, ward, district, province, inputLevel } = addr;
  if (inputLevel === '3-level') return [street, district, ward, province].filter(Boolean).join(', ') || '-';
  return [street, ward, province].filter(Boolean).join(', ') || '-';
};

const renderEmploymentStatusBadge = (status?: Employee["employmentStatus"]) => {
  if (!status) return undefined;
  return <Badge variant={getEmploymentStatusBadgeVariant(status)}>{formatEmploymentStatusDisplay(status)}</Badge>;
};

const PlaceholderTabContent = ({ title }: { title: string }) => (
  <Card className={cn("mt-4", mobileBleedCardClass)}>
    <CardContent className="p-0">
      <div className="flex h-40 items-center justify-center rounded-lg border-dashed">
        <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
          <h3 className="text-h4 font-semibold tracking-tight">{title}</h3>
          <p className="text-sm">Chức năng đang được phát triển.</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TabLoadingSkeleton = () => (
  <Card className={mobileBleedCardClass}>
    <CardContent className="p-4 space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-8 w-1/2" />
    </CardContent>
  </Card>
);

export function EmployeeDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { data: employeeFromQuery, isLoading } = useEmployee(systemId);
  const { data: branches } = useAllBranches();
  const { employee: authEmployee, can, isAdmin } = useAuth();

  const employee = React.useMemo(() => {
    if (systemId) return employeeFromQuery || null;
    return null;
  }, [systemId, employeeFromQuery]);

  // Task stats for the stats card (lightweight hook)
  const taskStats = useTaskStats(employee?.systemId);

  // Async @mention search for comments
  const fetchMentions = useEmployeeFetchMentions();

  // Comments from database
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('employee', systemId || '');

  const comments = React.useMemo(() => 
    dbComments.map(c => ({
      id: c.systemId as unknown as SystemId,
      content: c.content,
      author: {
        systemId: (c.createdBy || 'system') as unknown as SystemId,
        name: c.createdByName || 'Hệ thống',
      },
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
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

  const branchName = React.useMemo(() => {
    // Support both branchSystemId and branchId (Prisma foreign key), and branch object from API
    type EmployeeWithBranch = Employee & { 
      branchId?: string; 
      branch?: { name?: string; systemId?: string } 
    };
    const emp = employee as EmployeeWithBranch | null;
    const branchId = emp?.branchSystemId || emp?.branchId;
    const branchObj = emp?.branch;
    
    // If we have branch object from API with include, use it directly
    if (branchObj && typeof branchObj === 'object' && branchObj.name) {
      return branchObj.name;
    }
    
    if (!branchId) return 'Chưa phân công';
    return branches.find(b => b.systemId === branchId)?.name || 'Không tìm thấy';
  }, [employee, branches]);

    // Actions for detail page
    const headerActions = React.useMemo(() => {
        const actions: React.ReactNode[] = [
            <Button key="back" variant="outline" size="sm" className="h-9" onClick={() => router.push('/employees')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
            </Button>
        ];
        if (isAdmin || can('edit_employees')) {
            actions.push(
                <Button key="edit" size="sm" className="h-9" onClick={() => router.push(`/employees/${systemId}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                </Button>
            );
        }
        return actions;
    }, [router, systemId, isAdmin, can]);

  // ✅ Auto-generate breadcrumb
  const breadcrumb = React.useMemo(() => {
    if (!employee) return [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: false },
      { label: 'Chi tiết', href: '', isCurrent: true }
    ];
    return [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: false },
            { label: employee.fullName, href: '', isCurrent: true }
    ];
  }, [employee]);

    const headerBadge = React.useMemo(() => renderEmploymentStatusBadge(employee?.employmentStatus), [employee?.employmentStatus]);

  usePageHeader({
        title: employee?.fullName || 'Chi tiết Nhân viên',
        badge: headerBadge,
    actions: headerActions,
        breadcrumb
  });

  // Loading state while React Query is fetching
  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-h3 font-bold">Không tìm thấy nhân viên</h2>
          <p className="text-muted-foreground mt-2">Nhân viên bạn đang tìm kiếm không tồn tại.</p>
          <Button onClick={() => router.push('/employees')} className="mt-4" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay về danh sách
          </Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const calculateWorkDuration = () => {
    if (!employee.hireDate) return '0 tháng';
    const months = getMonthsDiff(employee.hireDate, new Date());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0) {
      return `${years} năm ${remainingMonths > 0 ? `${remainingMonths} tháng` : ''}`;
    }
    return `${months} tháng`;
  };

  return (
    <DetailPageShell className="w-full h-full">
      <div className="space-y-6">
        {/* Profile Card */}
        <Card className={mobileBleedCardClass}>
            <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={employee.avatarUrl} alt={employee.fullName} />
                        <AvatarFallback>{getInitials(employee.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                        <div className="grid gap-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{employee.workEmail || '—'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>{employee.phone || '—'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                {(() => {
                                    const emp = employee as EmployeeWithBranchRelation;
                                    const branchId = emp.branchSystemId || emp.branchId || emp.branch?.systemId;
                                    return branchId ? (
                                        <Link href={`/branches/${branchId}`}
                                            className="hover:underline text-primary"
                                        >
                                            {branchName}
                                        </Link>
                                    ) : (
                                        <span>{branchName}</span>
                                    );
                                })()}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Làm việc {calculateWorkDuration()}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{formatEmployeeTypeDisplay(employee.employeeType)}</Badge>
                            <Badge variant="outline">Mã NV: {employee.id}</Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Lương cơ bản"
                value={formatCurrency(employee.baseSalary)}
                icon={DollarSign}
                description="/ tháng"
            />
            <StatsCard
                title="Ngày phép còn lại"
                value={12 - (employee.leaveTaken || 0)}
                icon={Calendar}
                description={`Đã dùng ${employee.leaveTaken || 0}/12 ngày`}
            />
            <StatsCard
                title="Công việc"
                value={taskStats.total}
                icon={Briefcase}
                description={`${taskStats.active} đang làm`}
            />
        </div>

        <Tabs defaultValue="personal">
            <MobileTabsList className="mb-4">
                <MobileTabsTrigger value="personal">Thông tin cá nhân</MobileTabsTrigger>
                <MobileTabsTrigger value="addresses">Địa chỉ</MobileTabsTrigger>
                <MobileTabsTrigger value="work">Thông tin công việc</MobileTabsTrigger>
                <MobileTabsTrigger value="account">Thông tin đăng nhập</MobileTabsTrigger>
                <MobileTabsTrigger value="documents">Tài liệu</MobileTabsTrigger>
                <MobileTabsTrigger value="penalties">Phiếu phạt</MobileTabsTrigger>
                <MobileTabsTrigger value="leaves">Lịch sử nghỉ phép</MobileTabsTrigger>
                <MobileTabsTrigger value="kpi">KPI</MobileTabsTrigger>
                <MobileTabsTrigger value="tasks">Công việc</MobileTabsTrigger>
                <MobileTabsTrigger value="payroll">Lương & chấm công</MobileTabsTrigger>
            </MobileTabsList>

            <TabsContent value="personal" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Personal Information */}
                    <Card className={mobileBleedCardClass}>
                        <CardHeader>
                            <CardTitle>Thông tin cá nhân</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <InfoItem label="Giới tính" value={formatGenderDisplay(employee.gender)} />
                            <InfoItem label="Ngày sinh" value={formatDate(employee.dob)} />
                            <InfoItem label="Nơi sinh" value={employee.placeOfBirth} />
                            <InfoItem label="Tình trạng hôn nhân" value={employee.maritalStatus} />
                            <InfoItem label="Số điện thoại" value={employee.phone} />
                            <InfoItem label="Email cá nhân" value={employee.personalEmail} />
                        </CardContent>
                    </Card>

                    {/* Identification & Bank */}
                    <Card className={mobileBleedCardClass}>
                        <CardHeader>
                            <CardTitle>Định danh & Ngân hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <InfoItem label="Số CCCD" value={employee.nationalId} />
                            <InfoItem label="Ngày cấp" value={formatDate(employee.nationalIdIssueDate)} />
                            <InfoItem label="Nơi cấp" value={employee.nationalIdIssuePlace} />
                            <InfoItem label="Mã số thuế" value={employee.personalTaxId} />
                            <InfoItem label="Số sổ BHXH" value={employee.socialInsuranceNumber} />
                            <InfoItem label="Ngân hàng" value={employee.bankName} />
                            <InfoItem label="Chi nhánh" value={employee.bankBranch} />
                            <InfoItem label="Số tài khoản" value={employee.bankAccountNumber} />
                        </CardContent>
                    </Card>

                    {/* Emergency Contact */}
                    <Card className={cn("md:col-span-2", mobileBleedCardClass)}>
                        <CardHeader>
                            <CardTitle>Liên hệ khẩn cấp</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <InfoItem label="Tên người thân" value={employee.emergencyContactName} />
                            <InfoItem label="SĐT người thân" value={employee.emergencyContactPhone} />
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="addresses" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className={mobileBleedCardClass}>
                        <CardHeader>
                            <CardTitle>Địa chỉ thường trú</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                             {employee.permanentAddress ? (
                                <>
                                    <InfoItem label="Số nhà, đường" value={employee.permanentAddress.street} />
                                    <InfoItem label="Phường/Xã" value={employee.permanentAddress.ward} />
                                    {employee.permanentAddress.inputLevel === '3-level' && (
                                        <InfoItem label="Quận/Huyện" value={employee.permanentAddress.district} />
                                    )}
                                    <InfoItem label="Tỉnh/Thành phố" value={employee.permanentAddress.province} />
                                    <InfoItem label="Đầy đủ" value={formatAddressDisplay(employee.permanentAddress)} />
                                </>
                             ) : (
                                 <p className="text-sm text-muted-foreground">Chưa cập nhật</p>
                             )}
                        </CardContent>
                    </Card>
                    <Card className={mobileBleedCardClass}>
                        <CardHeader>
                            <CardTitle>Địa chỉ tạm trú</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                             {employee.temporaryAddress ? (
                                <>
                                    <InfoItem label="Số nhà, đường" value={employee.temporaryAddress.street} />
                                    <InfoItem label="Phường/Xã" value={employee.temporaryAddress.ward} />
                                    {employee.temporaryAddress.inputLevel === '3-level' && (
                                        <InfoItem label="Quận/Huyện" value={employee.temporaryAddress.district} />
                                    )}
                                    <InfoItem label="Tỉnh/Thành phố" value={employee.temporaryAddress.province} />
                                    <InfoItem label="Đầy đủ" value={formatAddressDisplay(employee.temporaryAddress)} />
                                </>
                             ) : (
                                 <p className="text-sm text-muted-foreground">Chưa cập nhật</p>
                             )}
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="work" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Work Information */}
                    <Card className={mobileBleedCardClass}>
                        <CardHeader>
                            <CardTitle>Thông tin công việc</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <InfoItem label="Email công việc" value={employee.workEmail} />
                            <InfoItem label="Chi nhánh">
                                {(() => {
                                    const emp = employee as EmployeeWithBranchRelation;
                                    const branchId = emp.branchSystemId || emp.branchId || emp.branch?.systemId;
                                    return branchId ? (
                                        <Link href={`/branches/${branchId}`}
                                            className="hover:underline text-primary"
                                        >
                                            {branchName}
                                        </Link>
                                    ) : (
                                        <span>{branchName}</span>
                                    );
                                })()}
                            </InfoItem>
                            <InfoItem label="Phòng ban" value={typeof employee.department === 'object' ? (employee.department as { name?: string })?.name : employee.department} />
                            <InfoItem label="Chức danh" value={typeof employee.jobTitle === 'object' ? (employee.jobTitle as { name?: string })?.name : employee.jobTitle} />
                            <InfoItem label="Số hợp đồng" value={employee.contractNumber} />
                            <InfoItem label="Ngày ký HĐ" value={formatDate(employee.contractStartDate)} />
                            <InfoItem label="Ngày hết hạn HĐ" value={formatDate(employee.contractEndDate)} />
                            <InfoItem label="Ngày vào làm" value={formatDate(employee.hireDate)} />
                            <InfoItem label="Loại nhân viên" value={formatEmployeeTypeDisplay(employee.employeeType)} />
                            <InfoItem label="Trạng thái">
                                <Badge variant={getEmploymentStatusBadgeVariant(employee.employmentStatus)}>
                                    {formatEmploymentStatusDisplay(employee.employmentStatus)}
                                </Badge>
                            </InfoItem>
                            {employee.terminationDate && (
                                <InfoItem label="Ngày nghỉ việc" value={formatDate(employee.terminationDate)} />
                            )}
                            {employee.reasonForLeaving && (
                                <InfoItem label="Lý do nghỉ việc" value={employee.reasonForLeaving} />
                            )}
                        </CardContent>
                    </Card>

                    {/* Salary & Allowances */}
                    <Card className={mobileBleedCardClass}>
                        <CardHeader>
                            <CardTitle>Lương & Phụ cấp</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <InfoItem label="Lương cơ bản" value={formatCurrency(employee.baseSalary)} />
                            <InfoItem label="Lương đóng BHXH" value={formatCurrency(employee.socialInsuranceSalary)} />
                            <InfoItem label="Phụ cấp chức vụ" value={formatCurrency(employee.positionAllowance)} />
                            <InfoItem label="Phụ cấp ăn trưa" value={formatCurrency(employee.mealAllowance)} />
                            <InfoItem label="Phụ cấp khác" value={formatCurrency(employee.otherAllowances)} />
                            <InfoItem label="Phép đã nghỉ" value={`${employee.leaveTaken || 0} / 12 ngày`} />
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="account" className="space-y-4">
                <EmployeeAccountTab employee={employee} />
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
                <EmployeeDocuments employeeSystemId={employee.systemId || employee.id} />
            </TabsContent>

            <TabsContent value="penalties" className="space-y-4">
                <PenaltiesTab employee={employee} />
            </TabsContent>

            <TabsContent value="leaves" className="space-y-4">
                <LeavesTab employee={employee} />
            </TabsContent>
            
            <TabsContent value="kpi" className="space-y-4">
                <PlaceholderTabContent title="Đánh giá KPI" />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
                <TasksTab employee={employee} />
            </TabsContent>

            <TabsContent value="payroll" className="space-y-4">
                <PayrollAttendanceTab employee={employee} />
            </TabsContent>

        </Tabs>

        {/* Lịch sử hoạt động */}
        <HistoryTab employee={employee} />

        {/* Comments */}
        <Comments
          entityType="employee"
          entityId={employee.systemId}
          comments={comments}
          onAddComment={handleAddComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          currentUser={commentCurrentUser}
          fetchMentions={fetchMentions}
          title="Bình luận"
          placeholder="Thêm bình luận về nhân viên..."
        />


      </div>
    </DetailPageShell>
  );
}
