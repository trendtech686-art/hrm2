'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  DndContext, 
  DragOverlay,
  useSensor, 
  useSensors, 
  PointerSensor,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent
} from '@dnd-kit/core';
import { formatDate } from '@/lib/date-utils';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { useAllDepartments } from './hooks/use-all-departments';
import { useDepartmentMutations } from './hooks/use-departments';
import { useMeiliEmployeeSearch } from '@/hooks/use-meilisearch'
import { useEmployeeMutations } from '../../employees/hooks/use-employees';
import { asSystemId } from '@/lib/id-types';
import type { Department } from '@/lib/types/prisma-extended';
import type { Employee } from '../../employees/types';
import { Users } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Separator } from '../../../components/ui/separator';
import { toast } from 'sonner';
import {
  CopyableDetailField,
  EmployeeCard,
  DepartmentColumn,
  UnassignedColumn,
} from './components/department-columns';
import {
  ManageDepartmentsDialog,
  ManageJobTitlesDialog,
} from './components/department-dialogs';
import { useAuth } from '@/contexts/auth-context';


const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[parts.length - 2][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
};


export function DepartmentsPage() {
  const { can, isLoading: authLoading } = useAuth();
  const canEditSettings = can('edit_settings');
  const { data: departments } = useAllDepartments();
  const { update: updateDepartmentMutation } = useDepartmentMutations({});
  const updateDepartment = React.useCallback((systemId: string, data: Partial<Department>) => {
    updateDepartmentMutation.mutate({ systemId, data });
  }, [updateDepartmentMutation]);
  const { data: employeesData } = useMeiliEmployeeSearch({ query: '', enabled: false, limit: 100 });
  const employees = employeesData?.data || [];
  const { update: updateEmployeeMutation } = useEmployeeMutations({});
  const router = useRouter();

  React.useEffect(() => {
    if (!authLoading && !canEditSettings) {
      toast.error('Bạn không có quyền truy cập cài đặt phòng ban');
      router.replace('/employees');
    }
  }, [authLoading, canEditSettings, router]);

  // Wrapper to match the old store API signature
  const updateEmployee = React.useCallback((systemId: string, data: Partial<Employee>) => {
    updateEmployeeMutation.mutate({ systemId, ...data });
  }, [updateEmployeeMutation]);

  const [isDeptFormOpen, setIsDeptFormOpen] = React.useState(false);
  const [isJobTitleFormOpen, setIsJobTitleFormOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);

  // DND-Kit state
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);
  const [activeEmployee, setActiveEmployee] = React.useState<typeof employees[number] | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }  // Prevent accidental drags
    })
  );

  const unassignedEmployees = React.useMemo(() => employees.filter(e => !e.department), [employees]);
  
  // Memoize stats to prevent re-calculation
  const stats = React.useMemo(() => ({
    totalDepartments: departments.length,
    totalEmployees: employees.length,
    assigned: employees.length - unassignedEmployees.length,
    unassigned: unassignedEmployees.length
  }), [departments.length, employees.length, unassignedEmployees.length]);
  
  // Memoized callbacks to prevent re-renders
  const handleViewEmployee = React.useCallback((employee: typeof employees[number]) => {
    setSelectedEmployee(employee as unknown as Employee);
    setIsDetailDialogOpen(true);
  }, []);

  const handleDrop = React.useCallback((employeeId: string, departmentId: string, isManager: boolean) => {
    const employee = employees.find(e => e.systemId === employeeId);
    const department = departments.find(d => d.systemId === departmentId);
    if (!employee || !department) return;

    // ✅ Validation: Check if employee is already manager elsewhere
    const isManagerElsewhere = departments.find(d => 
      d.managerId === employee.systemId && d.systemId !== departmentId
    );
    
    if (isManager && isManagerElsewhere) {
      toast.warning("Nhân viên đã là trưởng phòng", {
        description: `${employee.fullName} đang quản lý ${isManagerElsewhere.name}. Hãy gỡ vai trò trưởng phòng cũ trước.`,
        action: {
          label: "Gỡ và chuyển",
          onClick: () => {
            // Demote old position
            updateDepartment(isManagerElsewhere.systemId, { 
              ...isManagerElsewhere, 
              managerId: undefined 
            });
            // Perform the drop
            performActualDrop(employee, department, isManager, employeeId, departmentId);
            toast.info("Đã chuyển vai trò", {
              description: `${employee.fullName} không còn quản lý ${isManagerElsewhere.name}`
            });
          }
        }
      });
      return;
    }

    performActualDrop(employee, department, isManager, employeeId, departmentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- performActualDrop is defined after but stable since it uses same deps
  }, [employees, departments, updateEmployee, updateDepartment]);

  const performActualDrop = (employee: typeof employees[number], department: Department, isManager: boolean, employeeId: string, departmentId: string) => {
    // Update employee's department
    updateEmployee(employee.systemId, { ...employee, department: department.name as Employee['department'] } as Partial<Employee>);

    // Update manager status
    if (isManager) {
        // If there was an old manager, demote them
        const oldManager = employees.find(e => e.systemId === department.managerId);
        if(oldManager && oldManager.systemId !== employeeId) {
            updateEmployee(oldManager.systemId, { jobTitle: 'Nhân viên' });
            toast.info("Đã hạ chức trưởng phòng cũ", {
              description: `${oldManager.fullName} không còn là trưởng phòng ${department.name}`
            });
        }
        updateDepartment(asSystemId(departmentId), { ...department, managerId: employee.systemId as SystemId });
        updateEmployee(asSystemId(employeeId), { department: department.name as Employee['department'], jobTitle: 'Trưởng phòng' });
        toast.success("Đã bổ nhiệm trưởng phòng", {
          description: `${employee.fullName} là trưởng phòng ${department.name}`
        });
    } else {
        // If the dropped employee was the manager, unset them
        if (department.managerId === employee.systemId) {
            updateDepartment(asSystemId(departmentId), { ...department, managerId: undefined });
        }
        toast.success("Đã thêm nhân viên", {
          description: `${employee.fullName} vào ${department.name}`
        });
    }
  };

  const handleUnassign = React.useCallback((employeeId: string) => {
    const employee = employees.find(e => e.systemId === employeeId);
    if (!employee) return;
    
    // Check if they are a manager and unset them
    const managedDept = departments.find(d => d.managerId === employee.systemId);
    if(managedDept) {
        updateDepartment(managedDept.systemId, { ...managedDept, managerId: undefined });
        toast.info("Đã gỡ chức trưởng phòng", {
          description: `${employee.fullName} không còn quản lý ${managedDept.name}`
        });
    }

    updateEmployee(employee.systemId, { department: undefined } as Partial<Employee>);
    toast.success("Đã gỡ phòng ban", {
      description: `${employee.fullName} chuyển về chưa có phòng ban`
    });
  }, [employees, departments, updateEmployee, updateDepartment]);

  const headerActions = React.useMemo(() => [
    <SettingsActionButton 
      key="manage-job-titles"
      variant="outline" 
      onClick={() => setIsJobTitleFormOpen(true)}
    >
      Quản lý Chức vụ
    </SettingsActionButton>,
    <SettingsActionButton 
      key="manage-departments"
      variant="outline" 
      onClick={() => setIsDeptFormOpen(true)}
    >
      Quản lý Phòng ban
    </SettingsActionButton>,
    <SettingsActionButton 
      key="view-org-chart"
      onClick={() => router.push('/departments/organization-chart')}
    >
      <Users className="h-4 w-4" />
      Sơ đồ tổ chức
    </SettingsActionButton>
  ], [router]);

  useSettingsPageHeader({
    title: 'Quản lý Phòng ban',
    breadcrumb: [
      { label: 'Phòng ban', href: '/departments', isCurrent: true }
    ],
    actions: headerActions,
  });

  const SimpleDetailField = ({ label, value }: { label: string; value?: React.ReactNode }) => (
    <div className="grid grid-cols-3 items-center gap-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm font-medium">{value || '-'}</dd>
    </div>
  );

  // DND-Kit event handlers
  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    const emp = employees.find(e => e.systemId === event.active.id);
    setActiveEmployee(emp || null);
  }, [employees]);

  const handleDragOver = React.useCallback((event: DragOverEvent) => {
    setOverId(event.over?.id as string | null);
  }, []);

  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setOverId(null);
      setActiveEmployee(null);
      return;
    }

    const employeeId = active.id as string;
    const zoneId = over.id as string;

    // Parse zone ID: 'unassigned' or 'dept-{id}-manager' or 'dept-{id}-members'
    if (zoneId === 'unassigned') {
      handleUnassign(employeeId);
    } else if (zoneId.startsWith('dept-')) {
      const parts = zoneId.split('-');
      const deptId = parts[1];
      const isManager = parts[2] === 'manager';
      handleDrop(employeeId, deptId, isManager);
    }

    setActiveId(null);
    setOverId(null);
    setActiveEmployee(null);
  }, [handleUnassign, handleDrop]);
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex flex-col gap-4 p-4 md:p-0">
        {/* Mobile: Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:hidden">
          <div className="bg-card rounded-lg border p-3 shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">Tổng phòng ban</div>
            <div className="text-2xl font-bold">{stats.totalDepartments}</div>
          </div>
          <div className="bg-card rounded-lg border p-3 shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">Tổng nhân viên</div>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          </div>
          <div className="bg-card rounded-lg border p-3 shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">Có phòng ban</div>
            <div className="text-2xl font-bold text-green-600">{stats.assigned}</div>
          </div>
          <div className="bg-card rounded-lg border p-3 shadow-sm">
            <div className="text-xs text-muted-foreground mb-1">Chưa phân bổ</div>
            <div className="text-2xl font-bold text-orange-600">{stats.unassigned}</div>
          </div>
        </div>

        {/* Desktop & Mobile: Columns */}
        <div 
          className="grow flex items-stretch gap-3 md:gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0"
          style={{
            overflowX: 'scroll',  // Force horizontal scrollbar always visible
            scrollbarWidth: 'thin',  // Firefox
          }}
        >
          <UnassignedColumn 
            employees={unassignedEmployees} 
            onViewEmployee={handleViewEmployee}
            activeId={activeId}
            overId={overId}
          />
          {departments.map(dept => {
            const deptEmployees = employees.filter(e => e.department === dept.name);
            return (
              <React.Fragment key={dept.systemId}>
                <DepartmentColumn 
                  department={dept} 
                  employees={deptEmployees} 
                  onViewEmployee={handleViewEmployee}
                  activeId={activeId}
                  overId={overId}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* DragOverlay for visual feedback during drag */}
      <DragOverlay>
        {activeEmployee && (
          <div 
            className="cursor-grabbing rotate-3 opacity-90"
            style={{ pointerEvents: 'none' }}  // Prevent interference with drop detection
          >
            <EmployeeCard 
              employee={activeEmployee}
              onView={() => {}}
              isDragging={false}
            />
          </div>
        )}
      </DragOverlay>

      <ManageDepartmentsDialog isOpen={isDeptFormOpen} onOpenChange={setIsDeptFormOpen} />
      <ManageJobTitlesDialog isOpen={isJobTitleFormOpen} onOpenChange={setIsJobTitleFormOpen} />

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Thông tin nhân viên</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
                <div className="py-4 space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            {selectedEmployee.avatarUrl && <AvatarImage src={selectedEmployee.avatarUrl} alt={selectedEmployee.fullName} />}
                            <AvatarFallback className="text-xl">{getInitials(selectedEmployee.fullName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-lg">{selectedEmployee.fullName}</p>
                            <p className="text-sm text-muted-foreground">{selectedEmployee.jobTitle}</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="text-sm space-y-2">
                        <CopyableDetailField label="Mã NV" value={selectedEmployee.id} />
                        <CopyableDetailField label="SĐT" value={selectedEmployee.phone} />
                        <CopyableDetailField label="Email" value={selectedEmployee.workEmail} />
                        <SimpleDetailField label="Phòng ban" value={selectedEmployee.department} />
                        <SimpleDetailField label="Ngày vào làm" value={formatDate(selectedEmployee.hireDate)} />
                    </div>
                </div>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>Đóng</Button>
                <Button onClick={() => {
                    setIsDetailDialogOpen(false);
                    router.push(`/employees/${selectedEmployee!.systemId}`);
                }}>Xem chi tiết</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}
