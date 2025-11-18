import React, { useState, useMemo } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import type { TaskAssignee, AssigneeRole } from '../types';

interface Employee {
  systemId: string;
  name: string;
  avatar?: string;
}

interface AssigneeMultiSelectProps {
  assignees: TaskAssignee[];
  availableEmployees: Employee[];
  onChange: (assignees: TaskAssignee[]) => void;
  maxAssignees?: number;
  showRoles?: boolean;
}

const roleLabels: Record<AssigneeRole, string> = {
  owner: 'Chủ sở hữu',
  contributor: 'Thành viên',
  reviewer: 'Kiểm duyệt',
};

const roleColors: Record<AssigneeRole, string> = {
  owner: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  contributor: 'bg-green-100 text-green-800 hover:bg-green-200',
  reviewer: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
};

export const AssigneeMultiSelect: React.FC<AssigneeMultiSelectProps> = ({
  assignees,
  availableEmployees,
  onChange,
  maxAssignees = 10,
  showRoles = true,
}) => {
  const [open, setOpen] = useState(false);

  // Get employees not yet assigned
  const unassignedEmployees = useMemo(() => {
    const assignedIds = new Set(assignees.map(a => a.employeeSystemId));
    return availableEmployees.filter(emp => !assignedIds.has(emp.systemId));
  }, [assignees, availableEmployees]);

  // Add assignee with default role
  const handleAddAssignee = (employeeId: string) => {
    const employee = availableEmployees.find(e => e.systemId === employeeId);
    if (!employee) return;

    // First assignee is owner, rest are contributors
    const role: AssigneeRole = assignees.length === 0 ? 'owner' : 'contributor';

    const newAssignee: TaskAssignee = {
      systemId: `assignee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      employeeSystemId: employee.systemId,
      employeeName: employee.name,
      role,
      assignedAt: new Date().toISOString(),
      assignedBy: 'CURRENT_USER', // Will be replaced by actual user in store
    };

    onChange([...assignees, newAssignee]);
    setOpen(false);
  };

  // Remove assignee
  const handleRemoveAssignee = (assigneeId: string) => {
    onChange(assignees.filter(a => a.systemId !== assigneeId));
  };

  // Update assignee role
  const handleRoleChange = (assigneeId: string, newRole: AssigneeRole) => {
    onChange(
      assignees.map(a =>
        a.systemId === assigneeId ? { ...a, role: newRole } : a
      )
    );
  };

  const canAddMore = assignees.length < maxAssignees;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {assignees.map((assignee) => (
          <div
            key={assignee.systemId}
            className="flex items-center gap-2 rounded-md border bg-background p-2"
          >
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {assignee.employeeName.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <span className="text-sm font-medium">{assignee.employeeName}</span>

            {/* Role Selector */}
            {showRoles && (
              <Select
                value={assignee.role}
                onValueChange={(role) =>
                  handleRoleChange(assignee.systemId, role as AssigneeRole)
                }
              >
                <SelectTrigger className="h-6 w-32 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">
                    <span className="text-xs">{roleLabels.owner}</span>
                  </SelectItem>
                  <SelectItem value="contributor">
                    <span className="text-xs">{roleLabels.contributor}</span>
                  </SelectItem>
                  <SelectItem value="reviewer">
                    <span className="text-xs">{roleLabels.reviewer}</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => handleRemoveAssignee(assignee.systemId)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {/* Add Assignee Button */}
        {canAddMore && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 border-dashed"
              >
                <Plus className="mr-1 h-4 w-4" />
                Thêm người
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Command>
                <CommandInput placeholder="Tìm nhân viên..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy nhân viên.</CommandEmpty>
                  <CommandGroup>
                    {unassignedEmployees.map((employee) => (
                      <CommandItem
                        key={employee.systemId}
                        onSelect={() => handleAddAssignee(employee.systemId)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {employee.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{employee.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Role Legend */}
      {showRoles && assignees.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className={roleColors.owner}>
            {roleLabels.owner}
          </Badge>
          <Badge variant="outline" className={roleColors.contributor}>
            {roleLabels.contributor}
          </Badge>
          <Badge variant="outline" className={roleColors.reviewer}>
            {roleLabels.reviewer}
          </Badge>
        </div>
      )}

      {/* Limits Warning */}
      {assignees.length >= maxAssignees && (
        <p className="text-xs text-muted-foreground">
          Đã đạt giới hạn {maxAssignees} người được phân công.
        </p>
      )}
    </div>
  );
};
