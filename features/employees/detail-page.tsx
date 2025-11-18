import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Link } from 'react-router-dom';
import { formatDate, formatDateCustom, toISODate, toISODateTime, getMonthsDiff } from '../../lib/date-utils.ts';
import { useEmployeeStore } from './store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useRouteMeta } from '../../hooks/use-route-meta';
import { generateDetailBreadcrumb } from '../../lib/breadcrumb-generator'; // ✅ NEW
import { createSystemId } from '../../lib/id-config.ts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  Calendar,
  Building2,
  Briefcase,
  DollarSign,
  FileText,
  Download,
  Eye,
  File,
  Lock
} from 'lucide-react';
import { InfoItem } from '../../components/ui/info-card.tsx';
import { StatsCard } from '../../components/ui/stats-card.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.tsx';
import { RelatedDataTable } from '../../components/data-table/related-data-table.tsx';
import type { ColumnDef } from '../../components/data-table/types.ts';

import { usePenaltyStore } from '../settings/penalties/store.ts';
// REMOVED: import { useInternalTaskStore } from '../internal-tasks/store.ts';
import { useDocumentStore } from './document-store.ts';
import { useLeaveStore } from '../leaves/store.ts';
import { EmployeeDocuments } from './employee-documents.tsx';
import { EmployeeAccountTab } from './employee-account-tab.tsx';

import type { Penalty, PenaltyStatus } from '../settings/penalties/types.ts';
// REMOVED: import type { InternalTask, TaskStatus as InternalTaskStatus } from '../internal-tasks/types.ts';
import type { LeaveRequest, LeaveStatus } from '../leaves/types.ts';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return '-';
    return formatDateCustom(new Date(dateString), "dd/MM/yyyy");
};

const penaltyStatusVariants: Record<PenaltyStatus, "warning" | "success" | "secondary"> = {
    "Chưa thanh toán": "warning", "Đã thanh toán": "success", "Đã hủy": "secondary",
};

// REMOVED: Internal task status constants
// const internalTaskStatusNames: Record<InternalTaskStatus, string> = { 'To Do': 'Cần làm', 'In Progress': 'Đang làm', 'Done': 'Hoàn thành' };
// const internalTaskStatusVariants: Record<InternalTaskStatus, "default" | "secondary" | "warning" | "success"> = {
//     'To Do': "secondary", 'In Progress': "warning", 'Done': "success"
// };

const leaveStatusVariants: Record<LeaveStatus, "success" | "warning" | "destructive"> = {
    "Chờ duyệt": "warning",
    "Đã duyệt": "success",
    "Đã từ chối": "destructive",
};

const PlaceholderTabContent = ({ title }: { title: string }) => (
    <Card className="mt-4">
        <CardContent className="p-0">
            <div className="flex h-40 items-center justify-center rounded-lg border-dashed">
                <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
                    <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                    <p className="text-sm">Chức năng đang được phát triển.</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

// Column definitions for tabs
const penaltyColumns: ColumnDef<Penalty>[] = [
    { id: 'id', accessorKey: 'id', header: 'Mã Phiếu', cell: ({ row }) => <span className="font-medium">{row.id}</span>, meta: { displayName: 'Mã Phiếu' } },
    { id: 'reason', accessorKey: 'reason', header: 'Lý do', cell: ({ row }) => row.reason, meta: { displayName: 'Lý do' } },
    { id: 'issueDate', accessorKey: 'issueDate', header: 'Ngày', cell: ({ row }) => formatDateDisplay(row.issueDate), meta: { displayName: 'Ngày' } },
    { id: 'status', accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <Badge variant={penaltyStatusVariants[row.status]}>{row.status}</Badge>, meta: { displayName: 'Trạng thái' } },
    { id: 'amount', accessorKey: 'amount', header: 'Số tiền', cell: ({ row }) => <span className="text-destructive font-semibold">{formatCurrency(row.amount)}</span>, meta: { displayName: 'Số tiền' } },
];
const taskColumns: ColumnDef<{
  systemId: string;
  title: string;
  type: string;
  dueDate?: string;
  statusVariant: "default" | "secondary" | "warning" | "success" | "destructive";
  statusName: string;
  link: string;
}>[] = [
    { id: 'title', accessorKey: 'title', header: 'Công việc', cell: ({ row }) => <span className="font-medium">{row.title}</span>, meta: { displayName: 'Công việc' } },
    { id: 'type', accessorKey: 'type', header: 'Loại', cell: ({ row }) => row.type, meta: { displayName: 'Loại' } },
    { id: 'dueDate', accessorKey: 'dueDate', header: 'Hạn chót', cell: ({ row }) => formatDateDisplay(row.dueDate), meta: { displayName: 'Hạn chót' } },
    { id: 'status', accessorKey: 'statusName', header: 'Trạng thái', cell: ({ row }) => <Badge variant={row.statusVariant}>{row.statusName}</Badge>, meta: { displayName: 'Trạng thái' } },
];

const leaveColumns: ColumnDef<LeaveRequest>[] = [
    { id: 'id', accessorKey: 'id', header: 'Mã đơn', cell: ({ row }) => <span className="font-medium">{row.id}</span>, meta: { displayName: 'Mã đơn' } },
    { id: 'leaveTypeName', accessorKey: 'leaveTypeName', header: 'Loại phép', cell: ({ row }) => row.leaveTypeName, meta: { displayName: 'Loại phép' } },
    { id: 'dateRange', header: 'Thời gian', cell: ({ row }) => `${formatDateDisplay(row.startDate)} - ${formatDateDisplay(row.endDate)}`, meta: { displayName: 'Thời gian' } },
    { id: 'numberOfDays', accessorKey: 'numberOfDays', header: 'Số ngày', cell: ({ row }) => row.numberOfDays, meta: { displayName: 'Số ngày' } },
    { id: 'reason', accessorKey: 'reason', header: 'Lý do', cell: ({ row }) => <span className="truncate max-w-[200px] block">{row.reason}</span>, meta: { displayName: 'Lý do' } },
    { id: 'status', accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <Badge variant={leaveStatusVariants[row.status]}>{row.status}</Badge>, meta: { displayName: 'Trạng thái' } },
];


export function EmployeeDetailPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const routeMeta = useRouteMeta();
  const { findById } = useEmployeeStore();
  const { data: branches } = useBranchStore();
  const employee = React.useMemo(() => (systemId ? findById(createSystemId(systemId)) : null), [systemId, findById]);

  // Fetch data for tabs
  const { data: allPenalties } = usePenaltyStore();
  // REMOVED: const { tasks: allInternalTasks } = useInternalTaskStore();
  const { data: allLeaveRequests } = useLeaveStore();
  
  const employeePenalties = React.useMemo(() => allPenalties.filter(p => p.employeeSystemId === employee?.systemId), [allPenalties, employee?.systemId]);
  
  const employeeTasks = React.useMemo(() => {
      // REMOVED: Internal tasks functionality
      // const internal = allInternalTasks
      //   .filter(t => t.assigneeId === employee?.systemId)
      //   .map(t => ({ ...t, systemId: t.id, type: 'Nội bộ', statusVariant: internalTaskStatusVariants[t.status], statusName: internalTaskStatusNames[t.status], link: `/internal-tasks`, dueDate: t.dueDate }));
      
      // Note: Warranty tasks removed - warranty tickets don't have assignees
      
      return [] as any; // Empty array since internal tasks are removed
  }, [employee?.systemId]);

  const employeeLeaves = React.useMemo(() => 
    allLeaveRequests
      .filter(l => l.employeeSystemId === employee?.systemId)
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()),
  [allLeaveRequests, employee?.systemId]);

  const branchName = React.useMemo(() => {
    if (!employee?.branchSystemId) return 'Chưa phân công';
    return branches.find(b => b.systemId === employee.branchSystemId)?.name || 'Không tìm thấy';
  }, [employee, branches]);

  // Actions for detail page
  const headerActions = React.useMemo(() => [
    <Button key="back" variant="outline" size="sm" onClick={() => navigate('/employees')}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Quay lại
    </Button>,
    <Button key="edit" size="sm" onClick={() => navigate(`/employees/${systemId}/edit`)}>
      <Edit className="mr-2 h-4 w-4" />
      Chỉnh sửa
    </Button>
  ], [navigate, systemId]);

  // ✅ Auto-generate breadcrumb
  const breadcrumb = React.useMemo(() => {
    if (!employee || !systemId) return routeMeta?.breadcrumb as any;
    return generateDetailBreadcrumb('employees', systemId, 'Nhân viên').map((label, index, arr) => ({
      label,
      href: index === arr.length - 1 ? '' : (index === 0 ? '/employees' : ''),
      isCurrent: index === arr.length - 1
    }));
  }, [employee, systemId, routeMeta]);

  usePageHeader({
    title: employee ? `Chi tiết nhân viên: ${employee.fullName}` : 'Chi tiết nhân viên',
    context: {
      name: employee?.fullName,
    },
    actions: headerActions,
    breadcrumb
  });

  if (!employee) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Không tìm thấy nhân viên</h2>
          <p className="text-muted-foreground mt-2">Nhân viên bạn đang tìm kiếm không tồn tại.</p>
          <Button onClick={() => navigate('/employees')} className="mt-4" size="sm">
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
    <div className="w-full h-full">
      <div className="space-y-6">
        {/* Profile Card */}
        <Card>
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
                                {employee.branchSystemId ? (
                                    <Link 
                                        to={`/branches/${employee.branchSystemId}`}
                                        className="hover:underline text-primary"
                                    >
                                        {branchName}
                                    </Link>
                                ) : (
                                    <span>{branchName}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Làm việc {calculateWorkDuration()}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant={employee.employmentStatus === "Đang làm việc" ? "default" : employee.employmentStatus === "Tạm nghỉ" ? "secondary" : "destructive"}>
                                {employee.employmentStatus}
                            </Badge>
                            <Badge variant="outline">{employee.employeeType}</Badge>
                            <Badge variant="outline">{employee.id}</Badge>
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
                value={employeeTasks.length}
                icon={Briefcase}
                description={`${employeeTasks.filter((t: any) => t.statusName !== 'Hoàn thành').length} đang làm`}
            />
        </div>

        <Tabs defaultValue="personal">
            <div className="w-full overflow-x-auto">
                <TabsList className="w-auto">
                    <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
                    <TabsTrigger value="work">Thông tin công việc</TabsTrigger>
                    <TabsTrigger value="account">
                      <Lock className="mr-2 h-4 w-4" />
                      Thông tin đăng nhập
                    </TabsTrigger>
                    <TabsTrigger value="documents">Tài liệu</TabsTrigger>
                    <TabsTrigger value="penalties">Phiếu phạt</TabsTrigger>
                    <TabsTrigger value="leaves">Lịch sử nghỉ phép</TabsTrigger>
                    <TabsTrigger value="kpi">KPI</TabsTrigger>
                    <TabsTrigger value="tasks">Công việc</TabsTrigger>
                    <TabsTrigger value="attendance">Chấm công</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="personal" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <InfoItem label="Giới tính" value={employee.gender} />
                            <InfoItem label="Ngày sinh" value={formatDate(employee.dob)} />
                            <InfoItem label="Nơi sinh" value={employee.placeOfBirth} />
                            <InfoItem label="Tình trạng hôn nhân" value={employee.maritalStatus} />
                            <InfoItem label="Số điện thoại" value={employee.phone} />
                            <InfoItem label="Email cá nhân" value={employee.personalEmail} />
                            <InfoItem label="Địa chỉ thường trú" value={employee.permanentAddress} />
                            <InfoItem label="Địa chỉ tạm trú" value={employee.temporaryAddress} />
                        </CardContent>
                    </Card>

                    {/* Identification & Bank */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Định danh & Ngân hàng</CardTitle>
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
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base">Liên hệ khẩn cấp</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <InfoItem label="Tên người thân" value={employee.emergencyContactName} />
                            <InfoItem label="SĐT người thân" value={employee.emergencyContactPhone} />
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="work" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Work Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Thông tin công việc</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <InfoItem label="Email công việc" value={employee.workEmail} />
                            <InfoItem label="Chi nhánh">
                                {employee.branchSystemId ? (
                                    <Link 
                                        to={`/branches/${employee.branchSystemId}`}
                                        className="hover:underline text-primary"
                                    >
                                        {branchName}
                                    </Link>
                                ) : (
                                    <span>{branchName}</span>
                                )}
                            </InfoItem>
                            <InfoItem label="Phòng ban" value={employee.department} />
                            <InfoItem label="Chức danh" value={employee.jobTitle} />
                            <InfoItem label="Ngày vào làm" value={formatDate(employee.hireDate)} />
                            <InfoItem label="Loại nhân viên" value={employee.employeeType} />
                            <InfoItem label="Trạng thái">
                                <Badge variant={employee.employmentStatus === "Đang làm việc" ? "default" : employee.employmentStatus === "Tạm nghỉ" ? "secondary" : "destructive"}>
                                    {employee.employmentStatus}
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Lương & Phụ cấp</CardTitle>
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
                <Card>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={employeePenalties} 
                            columns={penaltyColumns} 
                            searchKeys={['reason', 'id']} 
                            searchPlaceholder="Tìm theo lý do..." 
                            dateFilterColumn="issueDate" 
                            dateFilterTitle="Ngày lập phiếu" 
                            exportFileName={`Lich_su_phat_${employee.id}`} 
                            onRowClick={(row) => navigate(`/penalties/${row.systemId}`)} 
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="leaves" className="space-y-4">
                <Card>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={employeeLeaves} 
                            columns={leaveColumns} 
                            searchKeys={['id', 'leaveTypeName', 'reason']} 
                            searchPlaceholder="Tìm theo mã đơn, loại phép..." 
                            dateFilterColumn="startDate" 
                            dateFilterTitle="Ngày bắt đầu" 
                            exportFileName={`Lich_su_nghi_phep_${employee.id}`} 
                            onRowClick={(row) => navigate(`/leaves/${row.systemId}`)} 
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="kpi" className="space-y-4">
                <PlaceholderTabContent title="Đánh giá KPI" />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
                <Card>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={employeeTasks} 
                            columns={taskColumns} 
                            searchKeys={['title', 'type']} 
                            searchPlaceholder="Tìm công việc..." 
                            dateFilterColumn="dueDate" 
                            dateFilterTitle="Hạn chót" 
                            exportFileName={`Cong_viec_${employee.id}`} 
                            onRowClick={(row) => navigate(row.link)} 
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
                <PlaceholderTabContent title="Lịch sử Chấm công" />
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
