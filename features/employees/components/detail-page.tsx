'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, FileSpreadsheet } from 'lucide-react';
// XLSX is lazy loaded in export functions to reduce bundle size (~500KB)
import { toast } from 'sonner';
import { formatDate, formatDateCustom, getMonthsDiff } from '@/lib/date-utils';
import { useEmployee } from '../hooks/use-employees';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { usePageHeader } from '@/contexts/page-header-context';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { useResolvedPayrollProfile } from '../hooks/use-payroll-profiles';
import { useEmployeeSettings, DEFAULT_EMPLOYEE_SETTINGS } from '@/features/settings/employees/hooks/use-employee-settings';
import { attendanceSnapshotService } from '@/lib/attendance-snapshot-service';
import { useAttendanceStore } from '@/features/attendance/store';
import { usePayrollBatchStore } from '@/features/payroll/payroll-batch-store';
import { PayrollStatusBadge } from '@/features/payroll/components/status-badge';
import { ROUTES } from '@/lib/router';
import { useAuth } from '@/contexts/auth-context';
import { usePrint } from '@/lib/use-print';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
import { useAllPenalties } from '@/features/settings/penalties/hooks/use-all-penalties';
import { useAllLeaves } from '@/features/leaves/hooks/use-all-leaves';
import {
  convertPayslipForPrint,
  mapPayslipToPrintData,
  mapPayslipComponentLineItems,
  createStoreSettings,
} from '@/lib/print/payroll-print-helper';
import {
  convertAttendanceDetailForPrint,
  mapAttendanceDetailToPrintData,
  mapAttendanceDetailLineItems,
  createStoreSettings as createAttendanceStoreSettings,
} from '@/lib/print/attendance-print-helper';
import type { PrintData, PrintLineItem } from '@/lib/print-service';
import {
  convertPenaltyForPrint,
  mapPenaltyToPrintData,
  createStoreSettings as createPenaltyStoreSettings,
} from '@/lib/print/penalty-print-helper';
import {
  convertLeaveForPrint,
  mapLeaveToPrintData,
  createStoreSettings as createLeaveStoreSettings,
} from '@/lib/print/leave-print-helper';
import { Comments } from '@/components/Comments';
import { useComments } from '@/hooks/use-comments';
import { ActivityHistory } from '@/components/ActivityHistory';
import type { Employee, EmployeeAddress } from '@/lib/types/prisma-extended';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Eye,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { InfoItem } from '@/components/ui/info-card';
import { StatsCard } from '@/components/ui/stats-card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RelatedDataTable } from '@/components/data-table/related-data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ColumnDef } from '@/components/data-table/types';

import { useAllTasks } from '@/features/tasks/hooks/use-all-tasks';
import { EmployeeDocuments } from './employee-documents';
import { EmployeeAccountTab } from './employee-account-tab';

import type { Penalty, PenaltyStatus } from '@/features/settings/penalties/types';
import type { LeaveRequest, LeaveStatus } from '@/features/leaves/types';

// Import extracted components from detail folder
import {
  PayslipDetailDialog,
  AttendanceDetailDialog,
  type PayrollHistoryRow,
} from '../detail';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Helper functions to display enum values as Vietnamese text
const formatGenderDisplay = (gender?: string | null): string => {
  if (!gender) return '-';
  const map: Record<string, string> = {
    'MALE': 'Nam',
    'FEMALE': 'Nữ',
    'OTHER': 'Khác',
    'Nam': 'Nam',
    'Nữ': 'Nữ',
    'Khác': 'Khác',
  };
  return map[gender] || gender;
};

const formatEmployeeTypeDisplay = (type?: string | null): string => {
  if (!type) return '-';
  const map: Record<string, string> = {
    'FULLTIME': 'Toàn thời gian',
    'PARTTIME': 'Bán thời gian',
    'INTERN': 'Thực tập',
    'PROBATION': 'Thử việc',
    'Chính thức': 'Toàn thời gian',
    'Toàn thời gian': 'Toàn thời gian',
    'Bán thời gian': 'Bán thời gian',
    'Thực tập sinh': 'Thực tập',
    'Thử việc': 'Thử việc',
  };
  return map[type] || type;
};

const formatEmploymentStatusDisplay = (status?: string | null): string => {
  if (!status) return '-';
  const map: Record<string, string> = {
    'ACTIVE': 'Đang làm việc',
    'ON_LEAVE': 'Tạm nghỉ',
    'TERMINATED': 'Đã nghỉ việc',
    'Đang làm việc': 'Đang làm việc',
    'Tạm nghỉ': 'Tạm nghỉ',
    'Đã nghỉ việc': 'Đã nghỉ việc',
    'Nghỉ việc': 'Đã nghỉ việc',
  };
  return map[status] || status;
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

// Helper function for lazy loading XLSX and exporting to Excel
async function exportToExcel<T extends Record<string, unknown>>(
    data: T[],
    headers: string[],
    sheetName: string,
    filename: string
) {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, filename);
}

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

// NOTE: PayrollHistoryRow and AttendanceHistoryRow types imported from ../detail


export function EmployeeDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { data: employeeFromQuery, isLoading } = useEmployee(systemId);
  const { data: branches } = useAllBranches();
  const { employee: authEmployee } = useAuth();
    const { profile: payrollProfile } = useResolvedPayrollProfile(systemId ? asSystemId(systemId) : undefined);
    const { data: rawSettings } = useEmployeeSettings();
    const settings = rawSettings ?? DEFAULT_EMPLOYEE_SETTINGS;
    const { info: storeInfo } = useStoreInfoData();
    const { print, printMultiple } = usePrint();
    
    // FIX: Split selectors to avoid object recreation on every render
    const lockedMonths = useAttendanceStore((state) => state.lockedMonths);
    const attendanceData = useAttendanceStore((state) => state.attendanceData);

    // Use React Query data directly
    const employee = React.useMemo(() => {
      if (systemId) {
        return employeeFromQuery || null;
      }
      return null;
    }, [systemId, employeeFromQuery]);

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

  // Fetch data for tabs
  const { data: allPenalties } = useAllPenalties();
  const { data: allTasks } = useAllTasks();
  const { data: allLeaveRequests } = useAllLeaves();
  
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

    const _payrollShift = React.useMemo(() => {
        if (!payrollProfile?.workShiftSystemId) {
            return null;
        }
        return settings.workShifts.find((shift) => shift.systemId === payrollProfile.workShiftSystemId) ?? null;
    }, [payrollProfile?.workShiftSystemId, settings.workShifts]);

    const _payrollComponents = React.useMemo(() => {
        if (!payrollProfile) {
            return [];
        }
        return settings.salaryComponents.filter((component) =>
            payrollProfile.salaryComponentSystemIds.includes(component.systemId)
        );
    }, [payrollProfile, settings.salaryComponents]);

    const _attendanceSnapshot = React.useMemo(() => {
        if (!employee) {
            return null;
        }
        return attendanceSnapshotService.getLatestLockedSnapshot(employee.systemId);
    }, [employee]);

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
    }, [employee, attendanceData, lockedMonths]);

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
        const attendanceForPrint = convertAttendanceDetailForPrint(row.monthKey, employeeRow as any);

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
                            <DropdownMenuItem onClick={() => router.push(`/attendance?month=${row.monthKey}`)}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Xem bảng chấm công
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ), 
            meta: { displayName: 'Thao tác', sticky: 'right' as const } 
        },
    ], [handlePrintSingleAttendance, router]);

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

                const attendanceForPrint = convertAttendanceDetailForPrint(row.monthKey, employeeRow as any);
                return {
                    data: mapAttendanceDetailToPrintData(attendanceForPrint, storeSettings),
                    lineItems: mapAttendanceDetailLineItems(attendanceForPrint.dailyDetails),
                };
            }).filter(Boolean) as Array<{ data: PrintData; lineItems: PrintLineItem[] }>;

            if (printOptionsList.length === 0) {
                toast.error('Không tìm thấy dữ liệu chấm công');
                return;
            }

            printMultiple('attendance', printOptionsList);
            toast.success(`Đang in ${printOptionsList.length} phiếu chấm công...`);
        };

        const handleExportExcel = async (rows: typeof attendanceHistory) => {
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

            await exportToExcel(mappedData, headers, 'ChamCong', `ChamCong_${employee?.id || 'NV'}_selected.xlsx`);
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

        const handleExportExcel = async (rows: Penalty[]) => {
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

            await exportToExcel(mappedData, headers, 'PhieuPhat', `PhieuPhat_${employee?.id || 'NV'}_selected.xlsx`);
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

        const handleExportExcel = async (rows: LeaveRequest[]) => {
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

            await exportToExcel(mappedData, headers, 'NghiPhep', `NghiPhep_${employee?.id || 'NV'}_selected.xlsx`);
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

    const handleExportSinglePenalty = React.useCallback(async (row: Penalty) => {
        const headers = ['Mã phiếu', 'Lý do', 'Ngày lập', 'Trạng thái', 'Số tiền'];
        const mappedData = [{
            'Mã phiếu': row.id,
            'Lý do': row.reason,
            'Ngày lập': formatDateDisplay(row.issueDate),
            'Trạng thái': row.status,
            'Số tiền': row.amount,
        }];
        await exportToExcel(mappedData, headers, 'PhieuPhat', `PhieuPhat_${row.id}.xlsx`);
        toast.success('Đã xuất phiếu phạt ra Excel');
    }, []);

    const handleExportSingleLeave = React.useCallback(async (row: LeaveRequest) => {
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
        await exportToExcel(mappedData, headers, 'NghiPhep', `NghiPhep_${row.id}.xlsx`);
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
                            <DropdownMenuItem onClick={() => router.push(`/penalties/${row.systemId}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ), 
            meta: { displayName: 'Thao tác', sticky: 'right' as const } 
        },
    ], [handlePrintSinglePenalty, handleExportSinglePenalty, router]);

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
                            <DropdownMenuItem onClick={() => router.push(`/leaves/${row.systemId}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ), 
            meta: { displayName: 'Thao tác', sticky: 'right' as const } 
        },
    ], [handlePrintSingleLeave, handleExportSingleLeave, router]);

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
        const handleExportExcel = async (rows: TaskRow[]) => {
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

            // Lazy load XLSX
            const XLSX = await import('xlsx');
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
    const handleExportSingleTask = React.useCallback(async (row: TaskRow) => {
        const headers = ['Công việc', 'Độ ưu tiên', 'Hạn chót', 'Trạng thái'];
        const mappedData = [{
            'Công việc': row.title,
            'Độ ưu tiên': row.type,
            'Hạn chót': formatDateDisplay(row.dueDate),
            'Trạng thái': row.statusName,
        }];
        // Lazy load XLSX
        const XLSX = await import('xlsx');
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
                            <DropdownMenuItem onClick={() => router.push(row.link)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ), 
            meta: { displayName: 'Thao tác', sticky: 'right' as const } 
        },
    ], [handleExportSingleTask, router]);

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

    const _latestPayslip = payrollHistory[0];
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
            <Link href={row.batchSystemId ? ROUTES.PAYROLL.DETAIL.replace(':systemId', row.batchSystemId) : '#'}
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
                                    router.push(ROUTES.PAYROLL.DETAIL.replace(':systemId', row.batchSystemId));
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
    ], [router, handlePrintSinglePayslip]);

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
            router.push(ROUTES.PAYROLL.DETAIL.replace(':systemId', batchSystemId));
        },
        [router]
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

        const handleExportExcel = async (rows: PayrollHistoryRow[]) => {
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

            // Lazy load XLSX
            const XLSX = await import('xlsx');
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
        <Button key="back" variant="outline" size="sm" className="h-9" onClick={() => router.push('/employees')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
        </Button>,
        <Button key="edit" size="sm" className="h-9" onClick={() => router.push(`/employees/${systemId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
        </Button>
    ], [router, systemId]);

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
      <div className="space-y-6 p-6">
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
        <Card>
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
                                    <Link href={`/branches/${employee.branchSystemId}`}
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
                            <Badge variant={(employee.employmentStatus as any) === "ACTIVE" || employee.employmentStatus?.includes("làm việc") ? "default" : (employee.employmentStatus as any) === "ON_LEAVE" || employee.employmentStatus?.includes("nghỉ") ? "secondary" : "destructive"}>
                                {formatEmploymentStatusDisplay(employee.employmentStatus)}
                            </Badge>
                            <Badge variant="outline">{formatEmployeeTypeDisplay(employee.employeeType)}</Badge>
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
                description={`${employeeTasks.filter((t) => t.statusName !== 'Hoàn thành').length} đang làm`}
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
                            <InfoItem label="Giới tính" value={formatGenderDisplay(employee.gender)} />
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
                                    <Link href={`/branches/${employee.branchSystemId}`}
                                        className="hover:underline text-primary"
                                    >
                                        {branchName}
                                    </Link>
                                ) : (
                                    <span>{branchName}</span>
                                )}
                            </InfoItem>
                            <InfoItem label="Phòng ban" value={typeof employee.department === 'object' ? (employee.department as { name?: string })?.name : employee.department} />
                            <InfoItem label="Chức danh" value={typeof employee.jobTitle === 'object' ? (employee.jobTitle as { name?: string })?.name : employee.jobTitle} />
                            <InfoItem label="Số hợp đồng" value={employee.contractNumber} />
                            <InfoItem label="Ngày ký HĐ" value={formatDate(employee.contractStartDate)} />
                            <InfoItem label="Ngày hết hạn HĐ" value={formatDate(employee.contractEndDate)} />
                            <InfoItem label="Ngày vào làm" value={formatDate(employee.hireDate)} />
                            <InfoItem label="Loại nhân viên" value={formatEmployeeTypeDisplay(employee.employeeType)} />
                            <InfoItem label="Trạng thái">
                                <Badge variant={(employee.employmentStatus as any) === "ACTIVE" || employee.employmentStatus?.includes("làm việc") ? "default" : (employee.employmentStatus as any) === "ON_LEAVE" || employee.employmentStatus?.includes("nghỉ") ? "secondary" : "destructive"}>
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
                            onRowClick={(row) => router.push(`/penalties/${row.systemId}`)} 
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
                            onRowClick={(row) => router.push(`/leaves/${row.systemId}`)} 
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
                                                        onRowClick={(row) => router.push(row.link)} 
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

                                {/* Thành phần lương & Thông tin trả lương - HIDDEN for now */}
                                {/* <div className="grid gap-4 md:grid-cols-2">
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
                                </div> */}
                        </TabsContent>

        {/* Payslip Detail Dialog - Using extracted component */}
        <PayslipDetailDialog
          open={isPayslipDialogOpen}
          onOpenChange={setIsPayslipDialogOpen}
          selectedPayslip={selectedPayslip}
          onViewPayroll={handleViewPayroll}
        />

        {/* Attendance Detail Dialog - Using extracted component */}
        <AttendanceDetailDialog
          open={isAttendanceDialogOpen}
          onOpenChange={setIsAttendanceDialogOpen}
          selectedAttendance={selectedAttendance}
          employee={{ fullName: employee.fullName, id: employee.id }}
          onPrintSingle={handlePrintSingleAttendance}
        />

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
