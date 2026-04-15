'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../../lib/router';
import { formatDate } from '../../../lib/date-utils'
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Phone, Building2, Calendar, MoreHorizontal } from "lucide-react"
import { TouchButton } from "../../../components/mobile/touch-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import type { Employee } from '@/lib/types/prisma-extended'

interface MobileEmployeeCardProps {
  employee: Employee;
  onDelete: (systemId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function MobileEmployeeCard({ employee, onDelete, canEdit = true, canDelete = true }: MobileEmployeeCardProps) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(ROUTES.HRM.EMPLOYEE_VIEW.replace(':systemId', employee.systemId));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'Đang làm việc': 'default',
      'ACTIVE': 'default',
      'Tạm nghỉ': 'secondary',
      'ON_LEAVE': 'secondary',
      'Đã nghỉ việc': 'destructive',
      'TERMINATED': 'destructive'
    };
    return map[status] || 'default';
  };

  const getStatusLabel = (status: string): string => {
    const map: Record<string, string> = {
      'ACTIVE': 'Đang làm việc',
      'ON_LEAVE': 'Tạm nghỉ',
      'TERMINATED': 'Đã nghỉ việc',
    };
    return map[status] || status;
  };

  return (
    <div 
      className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.98] transition-transform touch-manipulation cursor-pointer"
      onClick={handleRowClick}
    >
      {/* Header: Avatar + Info + Menu */}
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11 shrink-0">
          <AvatarImage src={employee.avatarUrl} alt={employee.fullName} />
          <AvatarFallback className="text-xs">{getInitials(employee.fullName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm truncate">{employee.fullName}</h3>
            {(canEdit || canDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchButton
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 -mr-2 -mt-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </TouchButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/employees/${employee.systemId}/edit`); }}>
                  Chỉnh sửa
                </DropdownMenuItem>
                )}
                {canDelete && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(employee.systemId); }}>
                  Chuyển vào thùng rác
                </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-mono">{employee.id}</span>
          <div className="text-xs text-muted-foreground mt-0.5 flex items-center">
            <Building2 className="h-3 w-3 mr-1 shrink-0" />
            <span className="truncate">
              {[typeof employee.jobTitle === 'object' ? (employee.jobTitle as { name?: string })?.name : employee.jobTitle, typeof employee.department === 'object' ? (employee.department as { name?: string })?.name : employee.department].filter(Boolean).join(' • ') || 'Chưa phân công'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Hire date + Status + Quick call */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{employee.hireDate ? formatDate(employee.hireDate) : 'Chưa có'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(employee.employmentStatus)} className="text-xs">
            {getStatusLabel(employee.employmentStatus)}
          </Badge>
          {employee.phone && (
            <TouchButton 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${employee.phone}`;
              }}
            >
              <Phone className="h-3.5 w-3.5" />
            </TouchButton>
          )}
        </div>
      </div>
    </div>
  );
}
