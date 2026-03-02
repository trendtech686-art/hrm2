'use client'

import * as React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Search, Users, Crown, Eye, Copy, Check } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { SortableCard } from '../../../../components/settings/SortableCard';
import type { Department } from '@/lib/types/prisma-extended';
import type { Employee } from '../../../employees/types';

const getInitials = (name: string) => {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.length > 1 
    ? `${parts[parts.length - 2][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase();
};

// ==========================================
// CopyableDetailField Component
// ==========================================
export const CopyableDetailField = ({ label, value }: { label: string; value?: string }) => {
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

// ==========================================
// EmployeeCard Component
// ==========================================
export const EmployeeCard = React.memo(function EmployeeCard({ 
  employee, 
  onView, 
  isDragging 
}: { 
  employee: Employee; 
  onView: (employee: Employee) => void; 
  isDragging?: boolean 
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: employee.systemId,
    data: {
      type: 'employee',
      employee,
    },
  });

  const cardStyle = React.useMemo(() => ({
    transform: CSS.Translate.toString(transform),
    willChange: transform ? 'transform' : undefined,
  }), [transform]);

  const dragHandleProps = listeners as React.HTMLAttributes<HTMLButtonElement> | undefined;
  const dragProps = dragHandleProps ? { dragHandleProps } : {};
  const dragging = Boolean(isDragging);

  return (
    <SortableCard
      ref={setNodeRef}
      style={cardStyle}
      {...attributes}
      {...dragProps}
      title={employee.fullName}
      description={employee.jobTitle || 'Chưa có chức vụ'}
      media={
        <Avatar className="h-10 w-10 ring-2 ring-background">
          {employee.avatarUrl && <AvatarImage src={employee.avatarUrl} alt={employee.fullName} />}
          <AvatarFallback className="text-xs font-semibold">{getInitials(employee.fullName)}</AvatarFallback>
        </Avatar>
      }
      actions={
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(event) => {
            event.stopPropagation();
            onView(employee);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      }
      isDragging={dragging}
      className={cn('touch-none select-none')}
    />
  );
});

// ==========================================
// DropZone Component
// ==========================================
export const DropZone = React.memo(function DropZone({
  id,
  icon: Icon,
  title,
  count,
  children,
  isOver,
  helperText,
}: React.PropsWithChildren<{
  id: string;
  icon: React.ElementType;
  title: string;
  count: number;
  isOver?: boolean;
  helperText?: string;
}>) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-2xl border border-dashed border/70 bg-background/80 p-3 transition-all',
        'shadow-[inset_0_1px_0_rgba(0,0,0,0.02)]',
        isOver && 'border-primary/60 bg-primary/5 shadow-lg shadow-primary/10'
      )}
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="flex-1 text-sm text-foreground">{title}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
          {count}
        </span>
      </div>
      <div className="space-y-2">
        {children || (
          <div className="flex min-h-18 flex-col items-center justify-center rounded-xl border border-dashed border/60 p-4 text-center text-xs text-muted-foreground">
            <span>{helperText ?? 'Kéo thả để thêm vào nhóm này'}</span>
          </div>
        )}
      </div>
    </div>
  );
});

// ==========================================
// DepartmentColumn Component
// ==========================================
export const DepartmentColumn = React.memo(function DepartmentColumn({
  department,
  employees,
  onViewEmployee,
  activeId,
  overId,
}: {
  department: Department;
  employees: Employee[];
  onViewEmployee: (employee: Employee) => void;
  activeId: string | null;
  overId: string | null;
}) {
  const manager = React.useMemo(
    () => employees.find((employee) => employee.systemId === department.managerId),
    [employees, department.managerId],
  );
  const members = React.useMemo(
    () => employees.filter((employee) => employee.department === department.name && employee.systemId !== department.managerId),
    [employees, department],
  );

  const managerZoneId = `dept-${department.systemId}-manager`;
  const memberZoneId = `dept-${department.systemId}-members`;

  return (
    <Card className="flex h-full w-70 shrink-0 flex-col sm:w-75 md:w-80">
      <CardHeader className="border-b bg-muted/40 py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle>{department.name}</CardTitle>
            <CardDescription>{employees.length} thành viên</CardDescription>
          </div>
          <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary">
            {manager ? 'Đang có trưởng phòng' : 'Chưa có trưởng phòng'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden px-3 py-3">
        <ScrollArea className="flex-1">
          <div className="space-y-3 pr-2">
            <DropZone
              id={managerZoneId}
              icon={Crown}
              title="Trưởng phòng"
              count={manager ? 1 : 0}
              isOver={overId === managerZoneId}
              helperText="Kéo nhân viên bất kỳ để bổ nhiệm trưởng phòng"
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
              helperText="Thả nhân viên vào đây để thêm vào phòng ban"
            >
              {members.map((emp) => (
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
      </CardContent>
    </Card>
  );
});

// ==========================================
// UnassignedColumn Component
// ==========================================
export const UnassignedColumn = React.memo(function UnassignedColumn({
  employees,
  onViewEmployee,
  activeId,
  overId: _overId,
}: {
  employees: Employee[];
  onViewEmployee: (employee: Employee) => void;
  activeId: string | null;
  overId: string | null;
}) {
  const [search, setSearch] = React.useState('');
  const filteredEmployees = React.useMemo(
    () => (search ? employees.filter((employee) => employee.fullName.toLowerCase().includes(search.toLowerCase())) : employees),
    [employees, search],
  );

  const unassignedZoneId = 'unassigned';
  const { setNodeRef, isOver } = useDroppable({ id: unassignedZoneId });

  return (
    <Card className="flex h-full w-70 shrink-0 flex-col bg-linear-to-br from-orange-50/60 to-card dark:from-orange-950/20 dark:to-card sm:w-75 md:w-[320px]">
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-center justify-between">
          <CardTitle>Chưa có phòng ban</CardTitle>
          <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
            {employees.length}
          </span>
        </div>
        <CardDescription className="text-xs">
          Kéo nhân viên sang phòng ban phù hợp hoặc sử dụng ô tìm kiếm để lọc nhanh.
        </CardDescription>
        <div className="relative pt-3">
          <Search className="absolute left-2.5 top-5.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm nhân viên..."
            className="h-9 w-full pl-8"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col overflow-hidden px-3 py-3">
        <div
          ref={setNodeRef}
          className={cn(
            'flex-1 rounded-2xl border border-dashed border-orange-200/80 bg-background/70 p-3 transition-all dark:border-orange-900/50',
            isOver && 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/10'
          )}
        >
          <ScrollArea className="h-full" style={{ scrollbarGutter: 'stable' }}>
            <div className="space-y-2 pr-2">
              {filteredEmployees.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 bg-background/70 px-4 py-8 text-center text-sm text-muted-foreground">
                  {search ? 'Không tìm thấy nhân viên' : 'Tất cả nhân viên đã có phòng ban'}
                </div>
              ) : (
                filteredEmployees.map((emp) => (
                  <EmployeeCard
                    key={emp.systemId}
                    employee={emp}
                    onView={onViewEmployee}
                    isDragging={activeId === emp.systemId}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
});
