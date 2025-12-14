import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Printer, FileSpreadsheet, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { formatDate, formatDateCustom, toISODate, toISODateTime, getMonthsDiff } from '../../lib/date-utils.ts';
import { useEmployeeStore } from './store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useRouteMeta } from '../../hooks/use-route-meta';
import { generateDetailBreadcrumb } from '../../lib/breadcrumb-generator'; // ✅ NEW
import { asSystemId, asBusinessId, type SystemId } from '../../lib/id-types';
import { useEmployeeCompStore } from './employee-comp-store.ts';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store.ts';
import { attendanceSnapshotService } from '../../lib/attendance-snapshot-service.ts';
import { useAttendanceStore } from '../attendance/store.ts';
import { usePayrollBatchStore } from '../payroll/payroll-batch-store.ts';
import type { Payslip, PayrollBatch } from '../../lib/payroll-types.ts';
import { PayrollStatusBadge } from '../payroll/components/status-badge.tsx';
import { PayslipPrintButton } from '../payroll/components/payslip-print-button.tsx';
import { ROUTES } from '../../lib/router.ts';
import { useAuth } from '../../contexts/auth-context.tsx';
import { usePrint } from '../../lib/use-print.ts';
import { useStoreInfoStore } from '../settings/store-info/store-info-store.ts';
import { useDepartmentStore } from '../settings/departments/store.ts';
import {
  convertPayslipForPrint,
  mapPayslipToPrintData,
  mapPayslipComponentLineItems,
  createStoreSettings,
} from '../../lib/print/payroll-print-helper.ts';
import {
  convertAttendanceDetailForPrint,
  mapAttendanceDetailToPrintData,
  mapAttendanceDetailLineItems,
  createStoreSettings as createAttendanceStoreSettings,
} from '../../lib/print/attendance-print-helper.ts';
import {
  convertPenaltyForPrint,
  mapPenaltyToPrintData,
  createStoreSettings as createPenaltyStoreSettings,
} from '../../lib/print/penalty-print-helper.ts';
import {
  convertLeaveForPrint,
  mapLeaveToPrintData,
  createStoreSettings as createLeaveStoreSettings,
} from '../../lib/print/leave-print-helper.ts';
import { Comments, type Comment as CommentType } from '../../components/Comments.tsx';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory.tsx';
import type { Employee, EmployeeAddress } from './types.ts';
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
  Lock,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { InfoItem } from '../../components/ui/info-card.tsx';
import { StatsCard } from '../../components/ui/stats-card.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.tsx';
import { RelatedDataTable } from '../../components/data-table/related-data-table.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu.tsx';
import type { ColumnDef } from '../../components/data-table/types.ts';

import { usePenaltyStore } from '../settings/penalties/store.ts';
import { useDocumentStore } from './document-store.ts';
import { useLeaveStore } from '../leaves/store.ts';
import { useTaskStore } from '../tasks/store.ts';
import { EmployeeDocuments } from './employee-documents.tsx';
import { EmployeeAccountTab } from './employee-account-tab.tsx';

import type { Penalty, PenaltyStatus } from '../settings/penalties/types.ts';
import type { LeaveRequest, LeaveStatus } from '../leaves/types.ts';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatMonthLabel = (monthKey?: string) => {
    if (!monthKey) return '—';
    const [year, month] = monthKey.split('-');
    return `Tháng ${month}/${year}`;
};

const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return '-';
    return formatDateCustom(new Date(dateString), "dd/MM/yyyy");
};

/**
 * Format EmployeeAddress thành chuỗi hiển thị
 * - 3-cấp: "123 ABC, Quận 7, Phường Tân Phú, TP.HCM" (đầy đủ District + Ward)
 * - 2-cấp: "123 ABC, Phường Tân Phú, TP.HCM" (chỉ Ward, bỏ District)
 */
const formatAddressDisplay = (addr: EmployeeAddress | null | undefined): string => {
  if (!addr) return '-';
  
  const { street, ward, district, province, inputLevel } = addr;
  
  if (inputLevel === '3-level') {
    // 3-cấp: Hiển thị District + Ward
    return [street, district, ward, province].filter(Boolean).join(', ') || '-';
  } else {
    // 2-cấp: Chỉ hiển thị Ward (bỏ District)
    return [street, ward, province].filter(Boolean).join(', ') || '-';
  }
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

const employmentStatusBadgeVariants: Record<Employee["employmentStatus"], "default" | "secondary" | "destructive"> = {
    "Đang làm việc": "default",
    "Tạm nghỉ": "secondary",
    "Đã nghỉ việc": "destructive",
};

const renderEmploymentStatusBadge = (status?: Employee["employmentStatus"]) => {
    if (!status) return undefined;
    return (
        <Badge variant={employmentStatusBadgeVariants[status] ?? "secondary"}>
            {status}
        </Badge>
    );
};

const PlaceholderTabContent = ({ title }: { title: string }) => (
    <Card className="mt-4">
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

// Column definitions for tabs (static - no actions)
// taskColumns moved to dynamic inside component

// Payroll history row type for RelatedDataTable
interface PayrollHistoryRow {
    systemId: string;
    batchId: string;
    monthLabel: string;
    payDate: string;
    status: 'draft' | 'reviewed' | 'locked' | 'cancelled';
    grossEarnings: number;
    totalInsurance: number;
    personalIncomeTax: number;
    otherDeductions: number;
    totalDeductions: number;
    netPay: number;
    batchSystemId?: string;
    payslipSystemId: string;
    // For print functionality
    slip: Payslip;
    batch?: PayrollBatch;
}


export function EmployeeDetailPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const routeMeta = useRouteMeta();
  const { findById } = useEmployeeStore();
  const { data: branches } = useBranchStore();
  const { employee: authEmployee } = useAuth();
    const getPayrollProfile = useEmployeeCompStore((state) => state.getPayrollProfile);
    const { settings } = useEmployeeSettingsStore();
    const { info: storeInfo } = useStoreInfoStore();
    const { data: departments } = useDepartmentStore();
    const { print, printMultiple } = usePrint();
    
    // FIX: Split selectors to avoid object recreation on every render
    const lockedMonths = useAttendanceStore((state) => state.lockedMonths);
    const attendanceData = useAttendanceStore((state) => state.attendanceData);

    const employee = React.useMemo(() => (systemId ? findById(asSystemId(systemId)) : null), [systemId, findById]);

  // Comments state with localStorage persistence
  type EmployeeComment = CommentType<SystemId>;
  const [comments, setComments] = React.useState<EmployeeComment[]>(() => {
    const saved = localStorage.getItem(`employee-comments-${systemId}`);
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    if (systemId) {
      localStorage.setItem(`employee-comments-${systemId}`, JSON.stringify(comments));
    }
  }, [comments, systemId]);

  const handleAddComment = React.useCallback((content: string, parentId?: string) => {
    const newComment: EmployeeComment = {
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

  // Fetch data for tabs
  const { data: allPenalties } = usePenaltyStore();
  const { data: allTasks } = useTaskStore();
  const { data: allLeaveRequests } = useLeaveStore();
  
  const employeePenalties = React.useMemo(() => allPenalties.filter(p => p.employeeSystemId === employee?.systemId), [allPenalties, employee?.systemId]);
  
  // Lọc công việc được giao cho nhân viên này (kiểm tra trong assignees array)
  const employeeTasks = React.useMemo(() => {
      if (!employee?.systemId) return [];
      return allTasks
        .filter(task => 
          task.assignees?.some(a => a.employeeSystemId === employee.systemId) ||
          task.assigneeId === employee.systemId
        )
        .map(task => ({
          systemId: task.systemId,
          title: task.title,
          type: task.priority || 'Trung bình',
          dueDate: task.dueDate,
          statusVariant: (
            task.status === 'Hoàn thành' ? 'success' :
            task.status === 'Đang thực hiện' ? 'default' :
            task.status === 'Đang chờ' ? 'warning' :
            task.status === 'Đã hủy' ? 'destructive' : 'secondary'
          ) as 'default' | 'secondary' | 'warning' | 'success' | 'destructive',
          statusName: task.status,
          link: `/tasks/${task.systemId}`,
        }));
  }, [allTasks, employee?.systemId]);

  const employeeLeaves = React.useMemo(() => 
    allLeaveRequests
      .filter(l => l.employeeSystemId === employee?.systemId)
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()),
  [allLeaveRequests, employee?.systemId]);

  const branchName = React.useMemo(() => {
    if (!employee?.branchSystemId) return 'Chưa phân công';
    return branches.find(b => b.systemId === employee.branchSystemId)?.name || 'Không tìm thấy';
  }, [employee, branches]);

    const payrollProfile = React.useMemo(() => (employee ? getPayrollProfile(employee.systemId) : null), [employee, getPayrollProfile]);

    const payrollShift = React.useMemo(() => {
        if (!payrollProfile?.workShiftSystemId) {
            return null;
        }
        return settings.workShifts.find((shift) => shift.systemId === payrollProfile.workShiftSystemId) ?? null;
    }, [payrollProfile?.workShiftSystemId, settings.workShifts]);

    const payrollComponents = React.useMemo(() => {
        if (!payrollProfile) {
            return [];
        }
        return settings.salaryComponents.filter((component) =>
            payrollProfile.salaryComponentSystemIds.includes(component.systemId)
        );
    }, [payrollProfile, settings.salaryComponents]);

    const attendanceSnapshot = React.useMemo(() => {
        if (!employee) {
            return null;
        }
        return attendanceSnapshotService.getLatestLockedSnapshot(employee.systemId);
    }, [employee?.systemId, lockedMonths, attendanceData]);

    // ✅ Lịch sử chấm công của nhân viên - lấy tất cả các tháng có dữ liệu
    const attendanceHistory = React.useMemo(() => {
        if (!employee) return [];
        
        const history: Array<{
            systemId: string;
            monthKey: string;
            monthLabel: string;
            workDays: number;
            leaveDays: number;
            absentDays: number;
            lateArrivals: number;
            earlyDepartures: number;
            otHours: number;
            locked: boolean;
        }> = [];

        // Duyệt qua tất cả các tháng có dữ liệu
        Object.entries(attendanceData).forEach(([monthKey, rows]) => {
            const employeeRow = rows?.find(r => r.employeeSystemId === employee.systemId);
            if (employeeRow) {
                const [year, month] = monthKey.split('-');
                history.push({
                    systemId: `${monthKey}-${employee.systemId}`,
                    monthKey,
                    monthLabel: `Tháng ${month}/${year}`,
                    workDays: employeeRow.workDays ?? 0,
                    leaveDays: employeeRow.leaveDays ?? 0,
                    absentDays: employeeRow.absentDays ?? 0,
                    lateArrivals: employeeRow.lateArrivals ?? 0,
                    earlyDepartures: employeeRow.earlyDepartures ?? 0,
                    otHours: employeeRow.otHours ?? 0,
                    locked: Boolean(lockedMonths[monthKey]),
                });
            }
        });

        // Sắp xếp theo tháng mới nhất
        return history.sort((a, b) => b.monthKey.localeCompare(a.monthKey));
    }, [employee?.systemId, attendanceData, lockedMonths]);

    // ✅ Handler in phiếu chấm công đơn lẻ
    const handlePrintSingleAttendance = React.useCallback((row: typeof attendanceHistory[number]) => {
        if (!employee) {
            toast.error('Không thể in', { description: 'Không tìm thấy dữ liệu nhân viên.' });
            return;
        }

        // Lấy dữ liệu chấm công của tháng này
        const monthRows = attendanceData[row.monthKey];
        const employeeRow = monthRows?.find(r => r.employeeSystemId === employee.systemId);
        
        if (!employeeRow) {
            toast.error('Không thể in', { description: 'Không tìm thấy dữ liệu chấm công.' });
            return;
        }

        const storeSettings = createAttendanceStoreSettings(storeInfo);
        const attendanceForPrint = convertAttendanceDetailForPrint(row.monthKey, employeeRow);

        print('attendance', {
            data: mapAttendanceDetailToPrintData(attendanceForPrint, storeSettings),
            lineItems: mapAttendanceDetailLineItems(attendanceForPrint.dailyDetails),
        });

        toast.success('Đang in phiếu chấm công...', { description: `${employee.fullName} - ${row.monthLabel}` });
    }, [employee, attendanceData, storeInfo, print]);

    // ✅ Columns cho bảng chấm công
    const attendanceColumns: ColumnDef<typeof attendanceHistory[number]>[] = React.useMemo(() => [
        { id: 'monthLabel', accessorKey: 'monthLabel', header: 'Kỳ chấm công', size: 130, cell: ({ row }) => <span className="font-medium">{row.monthLabel}</span>, meta: { displayName: 'Kỳ chấm công' } },
        { id: 'locked', accessorKey: 'locked', header: 'Trạng thái', size: 100, cell: ({ row }) => (
            <Badge variant={row.locked ? 'default' : 'outline'} className={row.locked ? 'bg-green-600' : ''}>
                {row.locked ? 'Đã khóa' : 'Chưa khóa'}
            </Badge>
        ), meta: { displayName: 'Trạng thái' } },
        { id: 'workDays', accessorKey: 'workDays', header: () => <span className="text-right w-full block">Ngày công</span>, size: 90, cell: ({ row }) => <span className="text-right block tabular-nums font-medium text-green-600">{row.workDays}</span>, meta: { displayName: 'Ngày công' } },
        { id: 'leaveDays', accessorKey: 'leaveDays', header: () => <span className="text-right w-full block">Nghỉ phép</span>, size: 90, cell: ({ row }) => <span className="text-right block tabular-nums text-blue-600">{row.leaveDays}</span>, meta: { displayName: 'Nghỉ phép' } },
        { id: 'absentDays', accessorKey: 'absentDays', header: () => <span className="text-right w-full block">Vắng</span>, size: 80, cell: ({ row }) => <span className={`text-right block tabular-nums ${row.absentDays > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>{row.absentDays}</span>, meta: { displayName: 'Vắng' } },
        { id: 'lateArrivals', accessorKey: 'lateArrivals', header: () => <span className="text-right w-full block">Đi trễ</span>, size: 80, cell: ({ row }) => <span className={`text-right block tabular-nums ${row.lateArrivals > 0 ? 'text-orange-600' : 'text-muted-foreground'}`}>{row.lateArrivals}</span>, meta: { displayName: 'Đi trễ' } },
        { id: 'earlyDepartures', accessorKey: 'earlyDepartures', header: () => <span className="text-right w-full block">Về sớm</span>, size: 80, cell: ({ row }) => <span className={`text-right block tabular-nums ${row.earlyDepartures > 0 ? 'text-orange-600' : 'text-muted-foreground'}`}>{row.earlyDepartures}</span>, meta: { displayName: 'Về sớm' } },
        { id: 'otHours', accessorKey: 'otHours', header: () => <span className="text-right w-full block">Làm thêm</span>, size: 80, cell: ({ row }) => <span className={`text-right block tabular-nums ${row.otHours > 0 ? 'text-purple-600 font-medium' : 'text-muted-foreground'}`}>{row.otHours}h</span>, meta: { displayName: 'Giờ làm thêm' } },
        { 
            id: 'actions', 
            header: '', 
            size: 50,
            cell: ({ row }) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                                setSelectedAttendance(row);
                                setIsAttendanceDialogOpen(true);
                            }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrintSingleAttendance(row)}>
                                <Printer className="mr-2 h-4 w-4" />
                                In phiếu chấm công
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/attendance?month=${row.monthKey}`)}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Xem bảng chấm công
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ), 
            meta: { displayName: 'Thao tác', sticky: 'right' as const } 
        },
    ], [handlePrintSingleAttendance, navigate]);

    // ✅ Custom bulk actions cho bảng chấm công
    const attendanceBulkActions = React.useMemo(() => {
        const handlePrintAttendances = (rows: typeof attendanceHistory) => {
            if (rows.length === 0) {
                toast.error('Chưa chọn kỳ chấm công nào');
                return;
            }

            const storeSettings = createAttendanceStoreSettings(storeInfo);

            const printOptionsList = rows.map(row => {
                const monthRows = attendanceData[row.monthKey];
                const employeeRow = monthRows?.find(r => r.employeeSystemId === employee?.systemId);
                
                if (!employeeRow) return null;

                const attendanceForPrint = convertAttendanceDetailForPrint(row.monthKey, employeeRow);
                return {
                    data: mapAttendanceDetailToPrintData(attendanceForPrint, storeSettings),
                    lineItems: mapAttendanceDetailLineItems(attendanceForPrint.dailyDetails),
                };
            }).filter(Boolean) as Array<{ data: any; lineItems: any[] }>;

            if (printOptionsList.length === 0) {
                toast.error('Không tìm thấy dữ liệu chấm công');
                return;
            }

            printMultiple('attendance', printOptionsList);
            toast.success(`Đang in ${printOptionsList.length} phiếu chấm công...`);
        };

        const handleExportExcel = (rows: typeof attendanceHistory) => {
            if (rows.length === 0) {
                toast.error('Chưa chọn dữ liệu nào');
                return;
            }

            const headers = ['Kỳ chấm công', 'Trạng thái', 'Ngày công', 'Nghỉ phép', 'Vắng', 'Đi trễ', 'Về sớm', 'Giờ làm thêm'];
            const mappedData = rows.map(row => ({
                'Kỳ chấm công': row.monthLabel,
                'Trạng thái': row.locked ? 'Đã khóa' : 'Chưa khóa',
                'Ngày công': row.workDays,
                'Nghỉ phép': row.leaveDays,
                'Vắng': row.absentDays,
                'Đi trễ': row.lateArrivals,
                'Về sớm': row.earlyDepartures,
                'Giờ làm thêm': row.otHours,
            }));

            const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'ChamCong');
            XLSX.writeFile(wb, `ChamCong_${employee?.id || 'NV'}_selected.xlsx`);
            toast.success(`Đã xuất ${rows.length} dòng ra Excel`);
        };

        return [
            {
                label: 'In phiếu chấm công',
                icon: Printer,
                onSelect: handlePrintAttendances,
            },
            {
                label: 'Xuất Excel',
                icon: FileSpreadsheet,
                onSelect: handleExportExcel,
            },
        ];
    }, [employee, attendanceData, storeInfo, printMultiple]);

    // ✅ Custom bulk actions cho tab Phiếu phạt
    const penaltyBulkActions = React.useMemo(() => {
        const handlePrintPenalties = (rows: Penalty[]) => {
            if (rows.length === 0) {
                toast.error('Chưa chọn phiếu phạt nào');
                return;
            }

            const penaltyStoreSettings = createPenaltyStoreSettings(storeInfo);
            const printOptionsList = rows.map(row => {
                const penaltyForPrint = convertPenaltyForPrint(row, { employee });
                return {
                    data: mapPenaltyToPrintData(penaltyForPrint, penaltyStoreSettings),
                    lineItems: [],
                };
            });

            printMultiple('penalty', printOptionsList);
            toast.success(`Đang in ${printOptionsList.length} phiếu phạt...`);
        };

        const handleExportExcel = (rows: Penalty[]) => {
            if (rows.length === 0) {
                toast.error('Chưa chọn phiếu phạt nào');
                return;
            }

            const headers = ['Mã phiếu', 'Lý do', 'Ngày lập', 'Trạng thái', 'Số tiền'];
            const mappedData = rows.map(row => ({
                'Mã phiếu': row.id,
                'Lý do': row.reason,
                'Ngày lập': formatDateDisplay(row.issueDate),
                'Trạng thái': row.status,
                'Số tiền': row.amount,
            }));

            const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'PhieuPhat');
            XLSX.writeFile(wb, `PhieuPhat_${employee?.id || 'NV'}_selected.xlsx`);
            toast.success(`Đã xuất ${rows.length} phiếu phạt ra Excel`);
        };

        return [
            {
                label: 'In phiếu phạt',
                icon: Printer,
                onSelect: handlePrintPenalties,
            },
            {
                label: 'Xuất Excel',
                icon: FileSpreadsheet,
                onSelect: handleExportExcel,
            },
        ];
    }, [employee, storeInfo, printMultiple]);

    // ✅ Custom bulk actions cho tab Lịch sử nghỉ phép
    const leaveBulkActions = React.useMemo(() => {
        const handlePrintLeaves = (rows: LeaveRequest[]) => {
            if (rows.length === 0) {
                toast.error('Chưa chọn đơn nghỉ phép nào');
                return;
            }

            const leaveStoreSettings = createLeaveStoreSettings(storeInfo);
            const printOptionsList = rows.map(row => {
                const leaveForPrint = convertLeaveForPrint(row, { employee });
                return {
                    data: mapLeaveToPrintData(leaveForPrint, leaveStoreSettings),
                    lineItems: [],
                };
            });

            printMultiple('leave', printOptionsList);
            toast.success(`Đang in ${printOptionsList.length} đơn nghỉ phép...`);
        };

        const handleExportExcel = (rows: LeaveRequest[]) => {
            if (rows.length === 0) {
                toast.error('Chưa chọn đơn nghỉ phép nào');
                return;
            }

            const headers = ['Mã đơn', 'Loại phép', 'Từ ngày', 'Đến ngày', 'Số ngày', 'Lý do', 'Trạng thái'];
            const mappedData = rows.map(row => ({
                'Mã đơn': row.id,
                'Loại phép': row.leaveTypeName,
                'Từ ngày': formatDateDisplay(row.startDate),
                'Đến ngày': formatDateDisplay(row.endDate),
                'Số ngày': row.numberOfDays,
                'Lý do': row.reason,
                'Trạng thái': row.status,
            }));

            const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'NghiPhep');
            XLSX.writeFile(wb, `NghiPhep_${employee?.id || 'NV'}_selected.xlsx`);
            toast.success(`Đã xuất ${rows.length} đơn nghỉ phép ra Excel`);
        };

        return [
            {
                label: 'In đơn nghỉ phép',
                icon: Printer,
                onSelect: handlePrintLeaves,
            },
            {
                label: 'Xuất Excel',
                icon: FileSpreadsheet,
                onSelect: handleExportExcel,
            },
        ];
    }, [employee, storeInfo, printMultiple]);

    // ✅ Helper functions cho in đơn lẻ
    const handlePrintSinglePenalty = React.useCallback((row: Penalty) => {
        const penaltyStoreSettings = createPenaltyStoreSettings(storeInfo);
        const penaltyForPrint = convertPenaltyForPrint(row, { employee });
        print('penalty', {
            data: mapPenaltyToPrintData(penaltyForPrint, penaltyStoreSettings),
            lineItems: [],
        });
    }, [employee, storeInfo, print]);

    const handlePrintSingleLeave = React.useCallback((row: LeaveRequest) => {
        const leaveStoreSettings = createLeaveStoreSettings(storeInfo);
        const leaveForPrint = convertLeaveForPrint(row, { employee });
        print('leave', {
            data: mapLeaveToPrintData(leaveForPrint, leaveStoreSettings),
            lineItems: [],
        });
    }, [employee, storeInfo, print]);

    const handleExportSinglePenalty = React.useCallback((row: Penalty) => {
        const headers = ['Mã phiếu', 'Lý do', 'Ngày lập', 'Trạng thái', 'Số tiền'];
        const mappedData = [{
            'Mã phiếu': row.id,
            'Lý do': row.reason,
            'Ngày lập': formatDateDisplay(row.issueDate),
            'Trạng thái': row.status,
            'Số tiền': row.amount,
        }];
        const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'PhieuPhat');
        XLSX.writeFile(wb, `PhieuPhat_${row.id}.xlsx`);
        toast.success('Đã xuất phiếu phạt ra Excel');
    }, []);

    const handleExportSingleLeave = React.useCallback((row: LeaveRequest) => {
        const headers = ['Mã đơn', 'Loại phép', 'Từ ngày', 'Đến ngày', 'Số ngày', 'Lý do', 'Trạng thái'];
        const mappedData = [{
            'Mã đơn': row.id,
            'Loại phép': row.leaveTypeName,
            'Từ ngày': formatDateDisplay(row.startDate),
            'Đến ngày': formatDateDisplay(row.endDate),
            'Số ngày': row.numberOfDays,
            'Lý do': row.reason,
            'Trạng thái': row.status,
        }];
        const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'NghiPhep');
        XLSX.writeFile(wb, `NghiPhep_${row.id}.xlsx`);
        toast.success('Đã xuất đơn nghỉ phép ra Excel');
    }, []);

    // ✅ Dynamic columns cho Phiếu phạt (có action column)
    const penaltyColumns: ColumnDef<Penalty>[] = React.useMemo(() => [
        { id: 'id', accessorKey: 'id', header: 'Mã Phiếu', cell: ({ row }) => <span className="font-medium">{row.id}</span>, meta: { displayName: 'Mã Phiếu' } },
        { id: 'reason', accessorKey: 'reason', header: 'Lý do', cell: ({ row }) => row.reason, meta: { displayName: 'Lý do' } },
        { id: 'issueDate', accessorKey: 'issueDate', header: 'Ngày', cell: ({ row }) => formatDateDisplay(row.issueDate), meta: { displayName: 'Ngày' } },
        { id: 'status', accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <Badge variant={penaltyStatusVariants[row.status]}>{row.status}</Badge>, meta: { displayName: 'Trạng thái' } },
        { id: 'amount', accessorKey: 'amount', header: 'Số tiền', cell: ({ row }) => <span className="text-destructive font-semibold">{formatCurrency(row.amount)}</span>, meta: { displayName: 'Số tiền' } },
        { 
            id: 'actions', 
            header: () => <div className="text-center">Thao tác</div>, 
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePrintSinglePenalty(row)}>
                                <Printer className="mr-2 h-4 w-4" />
                                In phiếu phạt
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportSinglePenalty(row)}>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Xuất Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/penalties/${row.systemId}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ), 
            meta: { displayName: 'Thao tác', sticky: 'right' as const } 
        },
    ], [handlePrintSinglePenalty, handleExportSinglePenalty, navigate]);

    // ✅ Dynamic columns cho Lịch sử nghỉ phép (có action column)
    const leaveColumns: ColumnDef<LeaveRequest>[] = React.useMemo(() => [
        { id: 'id', accessorKey: 'id', header: 'Mã đơn', cell: ({ row }) => <span className="font-medium">{row.id}</span>, meta: { displayName: 'Mã đơn' } },
        { id: 'leaveTypeName', accessorKey: 'leaveTypeName', header: 'Loại phép', cell: ({ row }) => row.leaveTypeName, meta: { displayName: 'Loại phép' } },
        { id: 'dateRange', header: 'Thời gian', cell: ({ row }) => `${formatDateDisplay(row.startDate)} - ${formatDateDisplay(row.endDate)}`, meta: { displayName: 'Thời gian' } },
        { id: 'numberOfDays', accessorKey: 'numberOfDays', header: 'Số ngày', cell: ({ row }) => row.numberOfDays, meta: { displayName: 'Số ngày' } },
        { id: 'reason', accessorKey: 'reason', header: 'Lý do', cell: ({ row }) => <span className="truncate max-w-[200px] block">{row.reason}</span>, meta: { displayName: 'Lý do' } },
        { id: 'status', accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <Badge variant={leaveStatusVariants[row.status]}>{row.status}</Badge>, meta: { displayName: 'Trạng thái' } },
        { 
            id: 'actions', 
            header: () => <div className="text-center">Thao tác</div>, 
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePrintSingleLeave(row)}>
                                <Printer className="mr-2 h-4 w-4" />
                                In đơn nghỉ phép
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportSingleLeave(row)}>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Xuất Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/leaves/${row.systemId}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ), 
            meta: { displayName: 'Thao tác', sticky: 'right' as const } 
        },
    ], [handlePrintSingleLeave, handleExportSingleLeave, navigate]);

    // ✅ Task row type for RelatedDataTable
    type TaskRow = {
        systemId: string;
        title: string;
        type: string;
        dueDate?: string;
        statusVariant: "default" | "secondary" | "warning" | "success" | "destructive";
        statusName: string;
        link: string;
    };

    // ✅ Bulk actions cho tab Công việc
    const taskBulkActions = React.useMemo(() => {
        const handleExportExcel = (rows: TaskRow[]) => {
            if (rows.length === 0) {
                toast.error('Chưa chọn công việc nào');
                return;
            }

            const headers = ['Công việc', 'Độ ưu tiên', 'Hạn chót', 'Trạng thái'];
            const mappedData = rows.map(row => ({
                'Công việc': row.title,
                'Độ ưu tiên': row.type,
                'Hạn chót': formatDateDisplay(row.dueDate),
                'Trạng thái': row.statusName,
            }));

            const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'CongViec');
            XLSX.writeFile(wb, `CongViec_${employee?.id || 'NV'}_selected.xlsx`);
            toast.success(`Đã xuất ${rows.length} công việc ra Excel`);
        };

        return [
            {
                label: 'Xuất Excel',
                icon: FileSpreadsheet,
                onSelect: handleExportExcel,
            },
        ];
    }, [employee]);

    // ✅ Helper export single task
    const handleExportSingleTask = React.useCallback((row: TaskRow) => {
        const headers = ['Công việc', 'Độ ưu tiên', 'Hạn chót', 'Trạng thái'];
        const mappedData = [{
            'Công việc': row.title,
            'Độ ưu tiên': row.type,
            'Hạn chót': formatDateDisplay(row.dueDate),
            'Trạng thái': row.statusName,
        }];
        const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'CongViec');
        XLSX.writeFile(wb, `CongViec_${row.systemId}.xlsx`);
        toast.success('Đã xuất công việc ra Excel');
    }, []);

    // ✅ Dynamic columns cho Công việc (có action column)
    const taskColumns: ColumnDef<TaskRow>[] = React.useMemo(() => [
        { id: 'title', accessorKey: 'title', header: 'Công việc', cell: ({ row }) => <span className="font-medium">{row.title}</span>, meta: { displayName: 'Công việc' } },
        { id: 'type', accessorKey: 'type', header: 'Độ ưu tiên', cell: ({ row }) => row.type, meta: { displayName: 'Độ ưu tiên' } },
        { id: 'dueDate', accessorKey: 'dueDate', header: 'Hạn chót', cell: ({ row }) => formatDateDisplay(row.dueDate), meta: { displayName: 'Hạn chót' } },
        { id: 'status', accessorKey: 'statusName', header: 'Trạng thái', cell: ({ row }) => <Badge variant={row.statusVariant}>{row.statusName}</Badge>, meta: { displayName: 'Trạng thái' } },
        { 
            id: 'actions', 
            header: () => <div className="text-center">Thao tác</div>, 
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExportSingleTask(row)}>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Xuất Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(row.link)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ), 
            meta: { displayName: 'Thao tác', sticky: 'right' as const } 
        },
    ], [handleExportSingleTask, navigate]);

    const { batches: payrollBatches, payslips: payrollPayslips } = usePayrollBatchStore();
    const payrollHistory = React.useMemo(() => {
        if (!employee) return [] as Array<{ slip: typeof payrollPayslips[number]; batch?: typeof payrollBatches[number] }>;
        return payrollPayslips
            .filter((slip) => slip.employeeSystemId === employee.systemId)
            .map((slip) => ({
                slip,
                batch: payrollBatches.find((batch) => batch.systemId === slip.batchSystemId),
            }))
            .sort((a, b) => {
                const dateA = new Date(a.batch?.payrollDate ?? a.slip.createdAt).getTime();
                const dateB = new Date(b.batch?.payrollDate ?? b.slip.createdAt).getTime();
                return dateB - dateA;
            });
    }, [employee, payrollPayslips, payrollBatches]);

    const latestPayslip = payrollHistory[0];
    const displayedPayrollHistory = payrollHistory.slice(0, 5);

    // State for payslip detail dialog
    const [selectedPayslip, setSelectedPayslip] = React.useState<typeof payrollHistory[number] | null>(null);
    const [isPayslipDialogOpen, setIsPayslipDialogOpen] = React.useState(false);

    // State for attendance detail dialog
    const [selectedAttendance, setSelectedAttendance] = React.useState<typeof attendanceHistory[number] | null>(null);
    const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = React.useState(false);

    // Transform payroll history for RelatedDataTable
    const payrollHistoryTableData: PayrollHistoryRow[] = React.useMemo(() => 
        displayedPayrollHistory.map(({ slip, batch }) => ({
            systemId: slip.systemId,
            batchId: batch?.id ?? '—',
            monthLabel: formatMonthLabel(batch?.payPeriod.monthKey ?? slip.periodMonthKey),
            payDate: formatDate(batch?.payrollDate || slip.createdAt) || '—',
            status: batch?.status ?? 'draft',
            grossEarnings: slip.totals.grossEarnings ?? slip.totals.earnings ?? 0,
            totalInsurance: slip.totals.totalEmployeeInsurance ?? 0,
            personalIncomeTax: slip.totals.personalIncomeTax ?? 0,
            otherDeductions: (slip.totals.penaltyDeductions ?? 0) + (slip.totals.otherDeductions ?? 0),
            totalDeductions: slip.totals.deductions ?? 0,
            netPay: slip.totals.netPay,
            batchSystemId: batch?.systemId,
            payslipSystemId: slip.systemId,
            slip,
            batch,
        })),
    [displayedPayrollHistory]);

    // Handle print payslip
    // ✅ Handler in phiếu lương đơn lẻ - sử dụng 4-layer print system
    const handlePrintSinglePayslip = React.useCallback((row: PayrollHistoryRow) => {
        if (!row.slip || !employee) {
            toast.error('Không thể in', { description: 'Không tìm thấy dữ liệu phiếu lương.' });
            return;
        }

        const storeSettings = createStoreSettings(storeInfo);
        const payslipForPrint = convertPayslipForPrint(
            row.slip,
            row.batch || {
                systemId: '',
                id: row.batchId,
                title: `Bảng lương ${row.monthLabel}`,
                status: row.status,
                payPeriod: { monthKey: row.slip.periodMonthKey },
                payrollDate: row.payDate,
            },
            {
                employee: {
                    fullName: employee.fullName,
                    id: employee.id,
                    department: employee.department,
                    position: employee.positionName,
                },
                departmentName: employee.department,
            }
        );

        print('payslip', {
            data: mapPayslipToPrintData(payslipForPrint, storeSettings),
            lineItems: mapPayslipComponentLineItems(payslipForPrint.components || []),
        });

        toast.success('Đang in phiếu lương...', { description: `${employee.fullName} - ${row.monthLabel}` });
    }, [employee, storeInfo, print]);

    // Payroll columns for RelatedDataTable
    const payrollColumns: ColumnDef<PayrollHistoryRow>[] = React.useMemo(() => [
        { id: 'batchId', accessorKey: 'batchId', header: 'Mã BL', size: 95, cell: ({ row }) => (
            <Link 
                to={row.batchSystemId ? ROUTES.PAYROLL.DETAIL.replace(':systemId', row.batchSystemId) : '#'}
                className="font-mono text-xs text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
            >
                {row.batchId}
            </Link>
        ), meta: { displayName: 'Mã BL' } },
        { id: 'monthLabel', accessorKey: 'monthLabel', header: 'Kỳ lương', size: 110, cell: ({ row }) => <span className="whitespace-nowrap">{row.monthLabel}</span>, meta: { displayName: 'Kỳ lương' } },
        { id: 'payDate', accessorKey: 'payDate', header: 'Ngày trả', size: 100, cell: ({ row }) => <span className="whitespace-nowrap">{row.payDate}</span>, meta: { displayName: 'Ngày trả' } },
        { id: 'status', accessorKey: 'status', header: 'Trạng thái', size: 90, cell: ({ row }) => <PayrollStatusBadge status={row.status} />, meta: { displayName: 'Trạng thái' } },
        { id: 'grossEarnings', accessorKey: 'grossEarnings', header: () => <span className="text-right w-full block">Tổng TN</span>, size: 115, cell: ({ row }) => <span className="text-right block tabular-nums">{formatCurrency(row.grossEarnings)}</span>, meta: { displayName: 'Tổng thu nhập' } },
        { id: 'totalInsurance', accessorKey: 'totalInsurance', header: () => <span className="text-right w-full block">Bảo hiểm</span>, size: 100, cell: ({ row }) => <span className="text-right block tabular-nums text-orange-600">{row.totalInsurance > 0 ? `-${formatCurrency(row.totalInsurance)}` : '—'}</span>, meta: { displayName: 'Bảo hiểm' } },
        { id: 'personalIncomeTax', accessorKey: 'personalIncomeTax', header: () => <span className="text-right w-full block">Thuế TNCN</span>, size: 100, cell: ({ row }) => <span className="text-right block tabular-nums text-purple-600">{row.personalIncomeTax > 0 ? `-${formatCurrency(row.personalIncomeTax)}` : '—'}</span>, meta: { displayName: 'Thuế TNCN' } },
        { id: 'otherDeductions', accessorKey: 'otherDeductions', header: () => <span className="text-right w-full block">Khác</span>, size: 90, cell: ({ row }) => <span className="text-right block tabular-nums text-gray-600">{row.otherDeductions > 0 ? `-${formatCurrency(row.otherDeductions)}` : '—'}</span>, meta: { displayName: 'Khấu trừ khác' } },
        { id: 'totalDeductions', accessorKey: 'totalDeductions', header: () => <span className="text-right w-full block">Tổng trừ</span>, size: 110, cell: ({ row }) => <span className="text-right block tabular-nums text-destructive font-medium">{formatCurrency(row.totalDeductions)}</span>, meta: { displayName: 'Tổng khấu trừ' } },
        { id: 'netPay', accessorKey: 'netPay', header: () => <span className="text-right w-full block">Thực lĩnh</span>, size: 120, cell: ({ row }) => <span className="text-right block tabular-nums font-bold text-green-600">{formatCurrency(row.netPay)}</span>, meta: { displayName: 'Thực lĩnh' } },
        { 
            id: 'actions', 
            header: '', 
            size: 50,
            cell: ({ row }) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                                setSelectedPayslip({ slip: row.slip, batch: row.batch });
                                setIsPayslipDialogOpen(true);
                            }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrintSinglePayslip(row)}>
                                <Printer className="mr-2 h-4 w-4" />
                                In phiếu lương
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                if (row.batchSystemId) {
                                    navigate(ROUTES.PAYROLL.DETAIL.replace(':systemId', row.batchSystemId));
                                }
                            }}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Xem bảng lương
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ), 
            meta: { displayName: 'Thao tác', sticky: 'right' as const } 
        },
    ], [navigate, handlePrintSinglePayslip]);

    const handlePayrollRowClick = React.useCallback((row: PayrollHistoryRow) => {
        const historyItem = displayedPayrollHistory.find(h => h.slip.systemId === row.systemId);
        if (historyItem) {
            setSelectedPayslip(historyItem);
            setIsPayslipDialogOpen(true);
        }
    }, [displayedPayrollHistory]);

    const handleViewPayroll = React.useCallback(
        (batchSystemId?: string) => {
            if (!batchSystemId) return;
            navigate(ROUTES.PAYROLL.DETAIL.replace(':systemId', batchSystemId));
        },
        [navigate]
    );

    // ✅ Custom bulk actions for payroll table - sử dụng 4-layer print system
    const payrollBulkActions = React.useMemo(() => {
        const handlePrintPayslips = (rows: PayrollHistoryRow[]) => {
            if (rows.length === 0) {
                toast.error('Chưa chọn phiếu lương nào');
                return;
            }

            const storeSettings = createStoreSettings(storeInfo);

            // In nhiều phiếu lương cùng lúc
            const printOptionsList = rows.map(row => {
                const payslipForPrint = convertPayslipForPrint(
                    row.slip,
                    row.batch || {
                        systemId: '',
                        id: row.batchId,
                        title: `Bảng lương ${row.monthLabel}`,
                        status: row.status,
                        payPeriod: { monthKey: row.slip.periodMonthKey },
                        payrollDate: row.payDate,
                    },
                    {
                        employee: employee ? {
                            fullName: employee.fullName,
                            id: employee.id,
                            department: employee.department,
                            position: employee.positionName,
                        } : undefined,
                        departmentName: employee?.department,
                    }
                );

                return {
                    data: mapPayslipToPrintData(payslipForPrint, storeSettings),
                    lineItems: mapPayslipComponentLineItems(payslipForPrint.components || []),
                };
            });

            // Sử dụng printMultiple để in nhiều phiếu cùng lúc
            printMultiple('payslip', printOptionsList);
            toast.success(`Đang in ${rows.length} phiếu lương...`);
        };

        const handleExportExcel = (rows: PayrollHistoryRow[]) => {
            if (rows.length === 0) {
                toast.error('Chưa chọn dữ liệu nào');
                return;
            }

            const headers = ['Mã BL', 'Kỳ lương', 'Ngày trả', 'Trạng thái', 'Tổng TN', 'Bảo hiểm', 'Thuế TNCN', 'Khấu trừ khác', 'Tổng trừ', 'Thực lĩnh'];
            const mappedData = rows.map(row => ({
                'Mã BL': row.batchId,
                'Kỳ lương': row.monthLabel,
                'Ngày trả': row.payDate,
                'Trạng thái': row.status,
                'Tổng TN': row.grossEarnings,
                'Bảo hiểm': row.totalInsurance,
                'Thuế TNCN': row.personalIncomeTax,
                'Khấu trừ khác': row.otherDeductions,
                'Tổng trừ': row.totalDeductions,
                'Thực lĩnh': row.netPay,
            }));

            const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Lương');
            XLSX.writeFile(wb, `Luong_${employee?.id || 'NV'}_selected.xlsx`);
            toast.success(`Đã xuất ${rows.length} dòng ra Excel`);
        };

        return [
            {
                label: 'In phiếu lương',
                icon: Printer,
                onSelect: handlePrintPayslips,
            },
            {
                label: 'Xuất Excel',
                icon: FileSpreadsheet,
                onSelect: handleExportExcel,
            },
        ];
    }, [employee, storeInfo, printMultiple]);

    // Actions for detail page
    const headerActions = React.useMemo(() => [
        <Button key="back" variant="outline" size="sm" className="h-9" onClick={() => navigate('/employees')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
        </Button>,
        <Button key="edit" size="sm" className="h-9" onClick={() => navigate(`/employees/${systemId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
        </Button>
    ], [navigate, systemId]);

  // ✅ Auto-generate breadcrumb
  const breadcrumb = React.useMemo(() => {
    if (!employee) return routeMeta?.breadcrumb as any;
    return [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: false },
            { label: employee.fullName, href: '', isCurrent: true }
    ];
  }, [employee, routeMeta]);

    const headerBadge = React.useMemo(() => renderEmploymentStatusBadge(employee?.employmentStatus), [employee?.employmentStatus]);

  usePageHeader({
        title: employee?.fullName || 'Chi tiết Nhân viên',
        badge: headerBadge,
    actions: headerActions,
        breadcrumb
  });

  if (!employee) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-h3 font-bold">Không tìm thấy nhân viên</h2>
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
            <div className="w-full overflow-x-auto overflow-y-hidden mb-4 pb-1" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}>
                <TabsList className="inline-flex w-auto gap-1 p-1 h-auto justify-start">
                    <TabsTrigger value="personal" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">Thông tin cá nhân</TabsTrigger>
                    <TabsTrigger value="addresses" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">Địa chỉ</TabsTrigger>
                    <TabsTrigger value="work" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">Thông tin công việc</TabsTrigger>
                    <TabsTrigger value="account" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">Thông tin đăng nhập</TabsTrigger>
                    <TabsTrigger value="documents" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">Tài liệu</TabsTrigger>
                    <TabsTrigger value="penalties" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">Phiếu phạt</TabsTrigger>
                    <TabsTrigger value="leaves" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">Lịch sử nghỉ phép</TabsTrigger>
                    <TabsTrigger value="kpi" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">KPI</TabsTrigger>
                    <TabsTrigger value="tasks" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">Công việc</TabsTrigger>
                    <TabsTrigger value="payroll" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">Lương & chấm công</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="personal" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-h6">Thông tin cá nhân</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <InfoItem label="Giới tính" value={employee.gender} />
                            <InfoItem label="Ngày sinh" value={formatDate(employee.dob)} />
                            <InfoItem label="Nơi sinh" value={employee.placeOfBirth} />
                            <InfoItem label="Tình trạng hôn nhân" value={employee.maritalStatus} />
                            <InfoItem label="Số điện thoại" value={employee.phone} />
                            <InfoItem label="Email cá nhân" value={employee.personalEmail} />
                        </CardContent>
                    </Card>

                    {/* Identification & Bank */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-h6">Định danh & Ngân hàng</CardTitle>
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
                            <CardTitle className="text-h6">Liên hệ khẩn cấp</CardTitle>
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-h6">Địa chỉ thường trú</CardTitle>
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-h6">Địa chỉ tạm trú</CardTitle>
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-h6">Thông tin công việc</CardTitle>
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
                            <InfoItem label="Số hợp đồng" value={employee.contractNumber} />
                            <InfoItem label="Ngày ký HĐ" value={formatDate(employee.contractStartDate)} />
                            <InfoItem label="Ngày hết hạn HĐ" value={formatDate(employee.contractEndDate)} />
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
                            <CardTitle className="text-h6">Lương & Phụ cấp</CardTitle>
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
                            showCheckbox
                            customBulkActions={penaltyBulkActions}
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
                            showCheckbox
                            customBulkActions={leaveBulkActions}
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
                                                        showCheckbox
                                                        customBulkActions={taskBulkActions}
                                                />
                                        </CardContent>
                                </Card>
                        </TabsContent>

                        <TabsContent value="payroll" className="space-y-4">
                                {/* Bảng lương gần đây - ĐẶT LÊN ĐẦU */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-h6">Bảng lương gần đây</CardTitle>
                                        <CardDescription>
                                            Hiển thị tối đa 5 kỳ gần nhất mà nhân viên tham gia. Click vào dòng để xem chi tiết.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {payrollHistoryTableData.length === 0 ? (
                                            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                                                <p className="text-sm text-muted-foreground">
                                                    Nhân viên chưa có phiếu lương nào được tạo.
                                                </p>
                                            </div>
                                        ) : (
                                            <RelatedDataTable
                                                data={payrollHistoryTableData}
                                                columns={payrollColumns}
                                                searchKeys={['batchId', 'monthLabel']}
                                                searchPlaceholder="Tìm bảng lương..."
                                                exportFileName={`Luong_${employee.id}`}
                                                onRowClick={handlePayrollRowClick}
                                                showCheckbox
                                                defaultSorting={{ id: 'payDate', desc: true }}
                                                customBulkActions={payrollBulkActions}
                                            />
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Lịch sử chấm công */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-h6">Lịch sử chấm công</CardTitle>
                                        <CardDescription>
                                            Hiển thị dữ liệu chấm công theo từng tháng. Click vào dòng để xem chi tiết.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {attendanceHistory.length === 0 ? (
                                            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                                                <p className="text-sm text-muted-foreground">
                                                    Chưa có dữ liệu chấm công cho nhân viên này.
                                                </p>
                                            </div>
                                        ) : (
                                            <RelatedDataTable
                                                data={attendanceHistory}
                                                columns={attendanceColumns}
                                                searchKeys={['monthLabel']}
                                                searchPlaceholder="Tìm theo tháng..."
                                                exportFileName={`ChamCong_${employee.id}`}
                                                onRowClick={(row) => {
                                                    setSelectedAttendance(row);
                                                    setIsAttendanceDialogOpen(true);
                                                }}
                                                showCheckbox
                                                defaultSorting={{ id: 'monthKey', desc: true }}
                                                customBulkActions={attendanceBulkActions}
                                            />
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Thành phần lương & Thông tin trả lương */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-h6">Thành phần lương đang áp dụng</CardTitle>
                                            <CardDescription>
                                                {payrollProfile?.usesDefaultComponents
                                                    ? 'Đang dùng cấu hình mặc định từ Cài đặt > Nhân viên'
                                                    : 'Được cấu hình riêng cho nhân viên này'}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {payrollComponents.length === 0 && (
                                                <p className="text-sm text-muted-foreground">Chưa thiết lập thành phần lương.</p>
                                            )}
                                            
                                            {/* Khoản thu nhập */}
                                            {payrollComponents.filter(c => c.category === 'earning').length > 0 && (
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-semibold text-green-700 flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4" /> Thu nhập
                                                    </h4>
                                                    {payrollComponents.filter(c => c.category === 'earning').map((component) => (
                                                        <div
                                                            key={component.systemId}
                                                            className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50/50 p-3"
                                                        >
                                                            <div>
                                                                <p className="font-medium">{component.name}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {component.type === 'fixed'
                                                                        ? formatCurrency(component.amount)
                                                                        : component.formula || 'Theo công thức'}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Badge variant={component.taxable ? 'default' : 'secondary'} className="text-xs">
                                                                    {component.taxable ? 'Tính thuế' : 'Không thuế'}
                                                                </Badge>
                                                                {component.partOfSocialInsurance && (
                                                                    <Badge variant="outline" className="text-xs">Đóng BH</Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Khoản khấu trừ */}
                                            {payrollComponents.filter(c => c.category === 'deduction').length > 0 && (
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-semibold text-red-700 flex items-center gap-2">
                                                        <FileText className="h-4 w-4" /> Khấu trừ
                                                    </h4>
                                                    {payrollComponents.filter(c => c.category === 'deduction').map((component) => (
                                                        <div
                                                            key={component.systemId}
                                                            className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/50 p-3"
                                                        >
                                                            <div>
                                                                <p className="font-medium">{component.name}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {component.type === 'fixed'
                                                                        ? formatCurrency(component.amount)
                                                                        : component.formula || 'Theo công thức'}
                                                                </p>
                                                            </div>
                                                            <Badge variant="destructive" className="text-xs">
                                                                Khấu trừ
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Khoản đóng góp */}
                                            {payrollComponents.filter(c => c.category === 'contribution').length > 0 && (
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                                                        <Building2 className="h-4 w-4" /> Đóng góp
                                                    </h4>
                                                    {payrollComponents.filter(c => c.category === 'contribution').map((component) => (
                                                        <div
                                                            key={component.systemId}
                                                            className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/50 p-3"
                                                        >
                                                            <div>
                                                                <p className="font-medium">{component.name}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {component.type === 'fixed'
                                                                        ? formatCurrency(component.amount)
                                                                        : component.formula || 'Theo công thức'}
                                                                </p>
                                                            </div>
                                                            <Badge variant="secondary" className="text-xs">
                                                                Đóng góp
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="space-y-1">
                                            <CardTitle className="text-h6">Thông tin trả lương</CardTitle>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Lock className="h-4 w-4" />
                                                <span>Hình thức: {payrollProfile?.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            {payrollProfile?.paymentMethod === 'cash' ? (
                                                <p className="text-muted-foreground">Trả lương trực tiếp, không cần tài khoản ngân hàng.</p>
                                            ) : (
                                                <>
                                                    <InfoItem label="Số tài khoản" value={payrollProfile?.payrollBankAccount?.accountNumber || employee.bankAccountNumber || '—'} />
                                                    <InfoItem label="Ngân hàng" value={payrollProfile?.payrollBankAccount?.bankName || employee.bankName || '—'} />
                                                    <InfoItem label="Chi nhánh" value={payrollProfile?.payrollBankAccount?.bankBranch || employee.bankBranch || '—'} />
                                                </>
                                            )}
                                            {payrollShift ? (
                                                <InfoItem
                                                    label="Ca mặc định"
                                                    value={`${payrollShift.name} (${payrollShift.startTime} - ${payrollShift.endTime})`}
                                                />
                                            ) : (
                                                <InfoItem label="Ca mặc định" value="Theo cài đặt chung" />
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                        </TabsContent>

        {/* Payslip Detail Dialog */}
        <Dialog open={isPayslipDialogOpen} onOpenChange={setIsPayslipDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chi tiết phiếu lương</DialogTitle>
                    <DialogDescription>
                        {selectedPayslip?.batch?.id ?? 'Phiếu lương'} - {formatMonthLabel(selectedPayslip?.batch?.payPeriod.monthKey ?? selectedPayslip?.slip.periodMonthKey)}
                    </DialogDescription>
                </DialogHeader>
                {selectedPayslip && (
                    <div className="space-y-4">
                        {/* Thông tin chung */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm border rounded-lg p-4 bg-muted/30">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Mã bảng lương:</span>
                                <span className="font-medium">{selectedPayslip.batch?.id ?? '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Trạng thái:</span>
                                {selectedPayslip.batch ? <PayrollStatusBadge status={selectedPayslip.batch.status} /> : <Badge variant="outline">Chưa xác định</Badge>}
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kỳ lương:</span>
                                <span className="font-medium">{formatMonthLabel(selectedPayslip.batch?.payPeriod.monthKey ?? selectedPayslip.slip.periodMonthKey)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Ngày trả lương:</span>
                                <span className="font-medium">{formatDate(selectedPayslip.batch?.payrollDate || selectedPayslip.slip.createdAt) || '—'}</span>
                            </div>
                        </div>
                        
                        {/* Chi tiết các thành phần lương */}
                        <div className="space-y-3">
                            {/* Các khoản thu nhập */}
                            <div className="rounded-lg border p-4">
                                <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Các khoản thu nhập
                                </h4>
                                <div className="space-y-2 text-sm">
                                    {selectedPayslip.slip.components && selectedPayslip.slip.components
                                        .filter(c => c.category === 'earning')
                                        .map((comp, idx) => (
                                            <div key={idx} className="flex justify-between py-1 border-b border-dashed last:border-0">
                                                <span className="text-muted-foreground">{comp.label}</span>
                                                <span className="font-medium tabular-nums text-green-600">{formatCurrency(comp.amount)}</span>
                                            </div>
                                        ))}
                                    {/* Nếu không có components chi tiết, hiển thị tổng thu nhập */}
                                    {(!selectedPayslip.slip.components || selectedPayslip.slip.components.filter(c => c.category === 'earning').length === 0) && (
                                        <div className="flex justify-between py-1 border-b border-dashed">
                                            <span className="text-muted-foreground">Thu nhập gộp</span>
                                            <span className="font-medium tabular-nums text-green-600">{formatCurrency(selectedPayslip.slip.totals.grossEarnings)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 font-semibold border-t">
                                        <span>Tổng thu nhập</span>
                                        <span className="tabular-nums text-green-600">{formatCurrency(selectedPayslip.slip.totals.grossEarnings)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Các khoản khấu trừ */}
                            <div className="rounded-lg border p-4">
                                <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Các khoản khấu trừ
                                </h4>
                                <div className="space-y-2 text-sm">
                                    {selectedPayslip.slip.components && selectedPayslip.slip.components
                                        .filter(c => c.category === 'deduction')
                                        .map((comp, idx) => (
                                            <div key={idx} className="flex justify-between py-1 border-b border-dashed last:border-0">
                                                <span className="text-muted-foreground">{comp.label}</span>
                                                <span className="font-medium tabular-nums text-red-600">-{formatCurrency(comp.amount)}</span>
                                            </div>
                                        ))}
                                    {/* Bảo hiểm chi tiết */}
                                    {selectedPayslip.slip.totals.employeeSocialInsurance > 0 && (
                                        <div className="flex justify-between py-1 border-b border-dashed">
                                            <span className="text-muted-foreground">BHXH (8%)</span>
                                            <span className="font-medium tabular-nums text-red-600">-{formatCurrency(selectedPayslip.slip.totals.employeeSocialInsurance)}</span>
                                        </div>
                                    )}
                                    {selectedPayslip.slip.totals.employeeHealthInsurance > 0 && (
                                        <div className="flex justify-between py-1 border-b border-dashed">
                                            <span className="text-muted-foreground">BHYT (1.5%)</span>
                                            <span className="font-medium tabular-nums text-red-600">-{formatCurrency(selectedPayslip.slip.totals.employeeHealthInsurance)}</span>
                                        </div>
                                    )}
                                    {selectedPayslip.slip.totals.employeeUnemploymentInsurance > 0 && (
                                        <div className="flex justify-between py-1 border-b border-dashed">
                                            <span className="text-muted-foreground">BHTN (1%)</span>
                                            <span className="font-medium tabular-nums text-red-600">-{formatCurrency(selectedPayslip.slip.totals.employeeUnemploymentInsurance)}</span>
                                        </div>
                                    )}
                                    {/* Thuế TNCN */}
                                    {selectedPayslip.slip.totals.personalIncomeTax > 0 && (
                                        <div className="flex justify-between py-1 border-b border-dashed">
                                            <span className="text-muted-foreground">Thuế TNCN</span>
                                            <span className="font-medium tabular-nums text-red-600">-{formatCurrency(selectedPayslip.slip.totals.personalIncomeTax)}</span>
                                        </div>
                                    )}
                                    {/* Khấu trừ phạt */}
                                    {selectedPayslip.slip.totals.penaltyDeductions > 0 && (
                                        <div className="flex justify-between py-1 border-b border-dashed">
                                            <span className="text-muted-foreground">Khấu trừ phạt</span>
                                            <span className="font-medium tabular-nums text-red-600">-{formatCurrency(selectedPayslip.slip.totals.penaltyDeductions)}</span>
                                        </div>
                                    )}
                                    {/* Khấu trừ khác */}
                                    {selectedPayslip.slip.totals.otherDeductions > 0 && (
                                        <div className="flex justify-between py-1 border-b border-dashed">
                                            <span className="text-muted-foreground">Khấu trừ khác</span>
                                            <span className="font-medium tabular-nums text-red-600">-{formatCurrency(selectedPayslip.slip.totals.otherDeductions)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 font-semibold border-t">
                                        <span>Tổng khấu trừ</span>
                                        <span className="tabular-nums text-red-600">-{formatCurrency(selectedPayslip.slip.totals.deductions)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin bổ sung */}
                            <div className="rounded-lg border p-4 bg-muted/20">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Thông tin chi tiết
                                </h4>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Mức đóng BHXH:</span>
                                        <span className="tabular-nums">{formatCurrency(selectedPayslip.slip.totals.socialInsuranceBase)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Thu nhập chịu thuế:</span>
                                        <span className="tabular-nums">{formatCurrency(selectedPayslip.slip.totals.taxableIncome)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Giảm trừ bản thân:</span>
                                        <span className="tabular-nums">{formatCurrency(selectedPayslip.slip.totals.personalDeduction)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Giảm trừ NPT ({selectedPayslip.slip.totals.numberOfDependents}):</span>
                                        <span className="tabular-nums">{formatCurrency(selectedPayslip.slip.totals.dependentDeduction)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Đóng góp (nếu có) */}
                            {selectedPayslip.slip.components && selectedPayslip.slip.components.filter(c => c.category === 'contribution').length > 0 && (
                                <div className="rounded-lg border p-4">
                                    <h4 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        Các khoản đóng góp
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        {selectedPayslip.slip.components
                                            .filter(c => c.category === 'contribution')
                                            .map((comp, idx) => (
                                                <div key={idx} className="flex justify-between py-1 border-b border-dashed last:border-0">
                                                    <span className="text-muted-foreground">{comp.label}</span>
                                                    <span className="font-medium tabular-nums">{formatCurrency(comp.amount)}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tổng kết */}
                        <div className="rounded-lg border-2 border-primary/30 p-4 bg-primary/5">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">THỰC LĨNH</span>
                                <span className="text-2xl font-bold text-primary tabular-nums">{formatCurrency(selectedPayslip.slip.totals.netPay)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between gap-2 pt-2">
                            <PayslipPrintButton
                                payslipData={selectedPayslip.slip}
                                batchData={selectedPayslip.batch}
                                variant="outline"
                                className="flex-1"
                            />
                            <Button 
                                variant="default" 
                                className="flex-1"
                                onClick={() => {
                                    setIsPayslipDialogOpen(false);
                                    if (selectedPayslip.batch?.systemId) {
                                        handleViewPayroll(selectedPayslip.batch.systemId);
                                    }
                                }}
                            >
                                Xem bảng lương
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>

        {/* Attendance Detail Dialog */}
        <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Chi tiết chấm công
                    </DialogTitle>
                    <DialogDescription>
                        {selectedAttendance?.monthLabel} - {selectedAttendance?.locked ? 'Đã khóa' : 'Chưa khóa'}
                    </DialogDescription>
                </DialogHeader>
                {selectedAttendance && (
                    <div className="space-y-4">
                        {/* Thông tin chung */}
                        <div className="grid grid-cols-2 gap-4 text-sm border rounded-lg p-4 bg-muted/30">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nhân viên:</span>
                                <span className="font-medium">{employee.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Mã NV:</span>
                                <span className="font-mono">{employee.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kỳ chấm công:</span>
                                <span className="font-medium">{selectedAttendance.monthLabel}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Trạng thái:</span>
                                <Badge variant={selectedAttendance.locked ? 'default' : 'outline'} className={selectedAttendance.locked ? 'bg-green-600' : ''}>
                                    {selectedAttendance.locked ? 'Đã khóa' : 'Chưa khóa'}
                                </Badge>
                            </div>
                        </div>

                        {/* Thống kê chi tiết */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950 border">
                                <p className="text-2xl font-bold text-green-600">{selectedAttendance.workDays}</p>
                                <p className="text-xs text-muted-foreground">Ngày công</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border">
                                <p className="text-2xl font-bold text-blue-600">{selectedAttendance.leaveDays}</p>
                                <p className="text-xs text-muted-foreground">Nghỉ phép</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950 border">
                                <p className="text-2xl font-bold text-destructive">{selectedAttendance.absentDays}</p>
                                <p className="text-xs text-muted-foreground">Vắng</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border">
                                <p className="text-2xl font-bold text-orange-600">{selectedAttendance.lateArrivals}</p>
                                <p className="text-xs text-muted-foreground">Đi trễ</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border">
                                <p className="text-2xl font-bold text-orange-600">{selectedAttendance.earlyDepartures}</p>
                                <p className="text-xs text-muted-foreground">Về sớm</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950 border">
                                <p className="text-2xl font-bold text-purple-600">{selectedAttendance.otHours}</p>
                                <p className="text-xs text-muted-foreground">Giờ làm thêm</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between gap-2 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => handlePrintSingleAttendance(selectedAttendance)}
                            >
                                <Printer className="mr-2 h-4 w-4" />
                                In phiếu
                            </Button>
                            <Button 
                                variant="default" 
                                className="flex-1"
                                onClick={() => {
                                    setIsAttendanceDialogOpen(false);
                                    navigate(`/attendance?month=${selectedAttendance.monthKey}`);
                                }}
                            >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Xem bảng chấm công
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>

        </Tabs>

        {/* Comments */}
        <Comments
          entityType="employee"
          entityId={employee.systemId}
          comments={comments}
          onAddComment={handleAddComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          currentUser={commentCurrentUser}
          title="Bình luận"
          placeholder="Thêm bình luận về nhân viên..."
        />

        {/* Activity History */}
        <ActivityHistory
          history={employee.activityHistory || []}
          title="Lịch sử hoạt động"
          emptyMessage="Chưa có lịch sử hoạt động"
          groupByDate
          maxHeight="400px"
        />
      </div>
    </div>
  );
}
