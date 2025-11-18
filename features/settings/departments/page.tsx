import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Search, Users, Crown, MoreHorizontal, PlusCircle, Eye, Copy, Check, GripVertical } from 'lucide-react';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { useDepartmentStore } from './store.ts';
import { useEmployeeStore } from '../../employees/store.ts';
import { useJobTitleStore } from '../job-titles/store.ts';
import type { Department } from './types.ts';
import type { Employee } from '../../employees/types.ts';
import type { JobTitle } from '../job-titles/types.ts';
import { cn } from '../../../lib/utils.ts';
import { Button } from '../../../components/ui/button.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar.tsx';
import { ScrollArea } from '../../../components/ui/scroll-area.tsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog.tsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog.tsx';
import { DepartmentForm, type DepartmentFormValues } from './department-form.tsx';
import { JobTitlesPageContent } from '../job-titles/page-content.tsx';
import { Separator } from '../../../components/ui/separator.tsx';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';


const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[parts.length - 2][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
};

const CopyableDetailField = ({ label, value }: { label: string; value?: string }) => {
    const [isCopied, setIsCopied] = React.useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (value) {
            navigator.clipboard.writeText(value);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <div className="grid grid-cols-3 items-center gap-2 group/item">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="col-span-2 text-sm font-medium flex items-center justify-between">
                <span className="truncate">{value || '-'}</span>
                {value && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover/item:opacity-100 transition-opacity" onClick={handleCopy}>
                        {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                )}
            </dd>
        </div>
    );
};

const EmployeeCard = React.memo(function EmployeeCard({ employee, onView, isDragging }: { employee: Employee, onView: (employee: Employee) => void, isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: employee.systemId,
    data: {
      type: 'employee',
      employee
    }
  });

  const style = React.useMemo(() => ({
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    // GPU acceleration for smoother animation
    willChange: transform ? 'transform' : 'auto',
  }), [transform, isDragging]);

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "group relative flex items-center gap-3 p-2.5 rounded-md border shadow-sm transition-all",
        "bg-card hover:shadow-md hover:border-primary/50",
        isDragging && "opacity-30 scale-95"
      )}
    >
      {/* Drag Handle */}
      <div 
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-background">
        {employee.avatarUrl && <AvatarImage src={employee.avatarUrl} alt={employee.fullName} />}
        <AvatarFallback className="text-xs">{getInitials(employee.fullName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{employee.fullName}</p>
        <p className="text-xs text-muted-foreground truncate">{employee.jobTitle || 'Chưa có chức vụ'}</p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" 
        onClick={(e) => { 
          e.stopPropagation(); 
          onView(employee); 
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );
});

const DropZone = React.memo(function DropZone({ 
  id, 
  icon: Icon, 
  title, 
  count, 
  children, 
  isOver 
}: React.PropsWithChildren<{ 
  id: string;
  icon: React.ElementType;
  title: string;
  count: number;
  isOver?: boolean;
}>) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "rounded-md p-2 transition-all border-2 border-dashed",
        isOver ? "border-primary bg-primary/5" : "border-transparent bg-muted/30"
      )}
    >
      <div className="flex items-center text-xs font-medium text-muted-foreground mb-2 px-1">
        <Icon className="h-3.5 w-3.5 mr-1.5" />
        <span className="flex-1">{title}</span>
        <span className="text-[10px] bg-muted rounded-full px-1.5 py-0.5">{count}</span>
      </div>
      <div className="space-y-2 min-h-[60px]">
        {children || (
          <div className="flex items-center justify-center h-[60px] text-xs text-muted-foreground">
            Kéo thả để thêm
          </div>
        )}
      </div>
    </div>
  );
});


const DepartmentColumn = React.memo(function DepartmentColumn({ 
  department, 
  employees, 
  onViewEmployee,
  activeId,
  overId
}: { 
  department: Department;
  employees: Employee[];
  onViewEmployee: (employee: Employee) => void;
  activeId: string | null;
  overId: string | null;
}) {
  const manager = React.useMemo(() => employees.find(e => e.systemId === department.managerId), [employees, department.managerId]);
  const members = React.useMemo(() => employees.filter(e => e.department === department.name && e.systemId !== department.managerId), [employees, department]);

  const managerZoneId = `dept-${department.systemId}-manager`;
  const memberZoneId = `dept-${department.systemId}-members`;

  return (
    <div className={cn(
      "w-[280px] sm:w-[300px] md:w-[320px] h-full flex-shrink-0 rounded-lg p-3 flex flex-col transition-all border shadow-sm",
      "bg-gradient-to-br from-card to-card/50"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 mb-3 rounded-md bg-muted/50">
        <h3 className="font-semibold text-sm md:text-base truncate">{department.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium bg-primary/10 text-primary rounded-full px-2 py-0.5">
            {employees.length}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <ScrollArea className="flex-grow pr-2">
        <div className="space-y-3">
          <DropZone 
            id={managerZoneId}
            icon={Crown} 
            title="Trưởng phòng" 
            count={manager ? 1 : 0}
            isOver={overId === managerZoneId}
          >
            {manager && (
              <EmployeeCard 
                employee={manager} 
                onView={onViewEmployee}
                isDragging={activeId === manager.systemId}
              />
            )}
          </DropZone>
          <DropZone 
            id={memberZoneId}
            icon={Users} 
            title="Nhân viên" 
            count={members.length}
            isOver={overId === memberZoneId}
          >
            {members.map(emp => (
              <EmployeeCard 
                key={emp.systemId}
                employee={emp} 
                onView={onViewEmployee}
                isDragging={activeId === emp.systemId}
              />
            ))}
          </DropZone>
        </div>
      </ScrollArea>
    </div>
  );
});

const UnassignedColumn = React.memo(function UnassignedColumn({ 
  employees, 
  onViewEmployee,
  activeId,
  overId
}: { 
  employees: Employee[];
  onViewEmployee: (employee: Employee) => void;
  activeId: string | null;
  overId: string | null;
}) {
    const [search, setSearch] = React.useState('');
    const filteredEmployees = React.useMemo(() => 
        search ? employees.filter(e => e.fullName.toLowerCase().includes(search.toLowerCase())) : employees,
    [employees, search]);

    const unassignedZoneId = 'unassigned';

    return (
        <div className={cn(
          "w-[280px] sm:w-[300px] md:w-[320px] h-full flex-shrink-0 rounded-lg p-3 flex flex-col transition-all border shadow-sm",
          "bg-gradient-to-br from-orange-50 to-card dark:from-orange-950/20 dark:to-card"
        )}>
            {/* Header */}
            <div className="p-2 mb-3 rounded-md bg-orange-100 dark:bg-orange-950/30">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm md:text-base">Chưa có phòng ban</h3>
                    <span className="text-xs font-medium bg-orange-500 text-white rounded-full px-2 py-0.5">
                        {employees.length}
                    </span>
                </div>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Tìm nhân viên..." 
                        className="w-full pl-8 h-9 bg-background" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>
            </div>
            
            {/* Content */}
            <div className="flex-grow overflow-y-auto pr-2 space-y-2" style={{ scrollbarGutter: 'stable' }}>
                {filteredEmployees.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        {search ? 'Không tìm thấy nhân viên' : 'Tất cả nhân viên đã có phòng ban'}
                    </div>
                ) : (
                    filteredEmployees.map(emp => (
                        <EmployeeCard 
                            key={emp.systemId}
                            employee={emp} 
                            onView={onViewEmployee}
                            isDragging={activeId === emp.systemId}
                        />
                    ))
                )}
            </div>
        </div>
    );
});

const ManageDepartmentsDialog = React.memo(function ManageDepartmentsDialog({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void; }) {
    const { data, add, update, remove } = useDepartmentStore();
    const [editingDepartment, setEditingDepartment] = React.useState<Department | null>(null);

    const handleFormSubmit = (values: DepartmentFormValues) => {
        if (editingDepartment) {
            update(editingDepartment.systemId, { ...editingDepartment, ...values });
        } else {
            add(values as Omit<Department, 'systemId'>);
        }
        setEditingDepartment(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Quản lý Phòng ban</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6 pt-4">
                    <div>
                         <h4 className="font-semibold mb-2">{editingDepartment ? 'Chỉnh sửa' : 'Thêm mới'}</h4>
                        <React.Fragment key={editingDepartment?.systemId || 'new'}>
                          <DepartmentForm
                              initialData={editingDepartment ? { ...editingDepartment, jobTitleIds: [] } : undefined}
                              onSubmit={handleFormSubmit}
                          />
                        </React.Fragment>
                        <DialogFooter className="mt-4">
                           {editingDepartment && <Button variant="outline" onClick={() => setEditingDepartment(null)}>Hủy sửa</Button>}
                            <Button type="submit" form="department-form">Lưu</Button>
                        </DialogFooter>
                    </div>
                    <div>
                         <h4 className="font-semibold mb-2">Danh sách phòng ban</h4>
                        <ScrollArea className="h-72 border rounded-md">
                            {data.map(dep => (
                                <div key={dep.systemId} className="flex items-center p-2 border-b">
                                    <span className="flex-grow">{dep.name}</span>
                                    <Button variant="ghost" size="sm" onClick={() => setEditingDepartment(dep)}>Sửa</Button>
                                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(dep.systemId)}>Xóa</Button>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});

const ManageJobTitlesDialog = React.memo(function ManageJobTitlesDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Quản lý Chức vụ</DialogTitle>
                    <DialogDescription>Thêm, sửa, xóa các chức vụ trong công ty.</DialogDescription>
                </DialogHeader>
                <JobTitlesPageContent />
            </DialogContent>
        </Dialog>
    );
});


export function DepartmentsPage() {
  const { setPageHeader } = usePageHeader();
  
  const { data: departments, update: updateDepartment } = useDepartmentStore();
  const { data: employees, update: updateEmployee } = useEmployeeStore();
  const navigate = useNavigate();

  const [isDeptFormOpen, setIsDeptFormOpen] = React.useState(false);
  const [isJobTitleFormOpen, setIsJobTitleFormOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);

  // DND-Kit state
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);
  const [activeEmployee, setActiveEmployee] = React.useState<Employee | null>(null);

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
  const handleViewEmployee = React.useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
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
  }, [employees, departments, updateEmployee, updateDepartment]);

  const performActualDrop = (employee: any, department: any, isManager: boolean, employeeId: string, departmentId: string) => {
    // Update employee's department
    updateEmployee(employee.systemId, { ...employee, department: department.name } as any);

    // Update manager status
    if (isManager) {
        // If there was an old manager, demote them
        const oldManager = employees.find(e => e.systemId === department.managerId);
        if(oldManager && oldManager.systemId !== employeeId) {
            updateEmployee(oldManager.systemId, {...oldManager, jobTitle: 'Nhân viên'} as any);
            toast.info("Đã hạ chức trưởng phòng cũ", {
              description: `${oldManager.fullName} không còn là trưởng phòng ${department.name}`
            });
        }
        updateDepartment(departmentId as any, { ...department, managerId: employee.systemId });
        updateEmployee(employeeId as any, { ...employee, department: department.name, jobTitle: 'Trưởng phòng' } as any);
        toast.success("Đã bổ nhiệm trưởng phòng", {
          description: `${employee.fullName} là trưởng phòng ${department.name}`
        });
    } else {
        // If the dropped employee was the manager, unset them
        if (department.managerId === employee.systemId) {
            updateDepartment(departmentId as any, { ...department, managerId: undefined });
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

    updateEmployee(employee.systemId, { ...employee, department: undefined });
    toast.success("Đã gỡ phòng ban", {
      description: `${employee.fullName} chuyển về chưa có phòng ban`
    });
  }, [employees, departments, updateEmployee, updateDepartment]);
  
  // Setup page header
  React.useEffect(() => {
    setPageHeader({
      title: 'Quản lý Phòng ban',
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Quản lý', href: '/departments' },
        { label: 'Phòng ban', href: '/departments' }
      ],
      actions: [
        <Button 
          key="manage-job-titles"
          variant="outline" 
          size="sm"
          onClick={() => setIsJobTitleFormOpen(true)}
        >
          Quản lý Chức vụ
        </Button>,
        <Button 
          key="manage-departments"
          variant="outline" 
          size="sm"
          onClick={() => setIsDeptFormOpen(true)}
        >
          Quản lý Phòng ban
        </Button>,
        <Button 
          key="view-org-chart"
          size="sm"
          onClick={() => navigate('/departments/organization-chart')}
        >
          <Users className="mr-2 h-4 w-4" />
          Sơ đồ tổ chức
        </Button>
      ]
    });
  }, [setPageHeader, navigate]);

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
          className="flex-grow flex items-stretch gap-3 md:gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0"
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
                    navigate(`/employees/${selectedEmployee!.systemId}`);
                }}>Xem chi tiết</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}
