'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../../lib/router';
import { formatDate } from '../../../lib/date-utils'
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Phone, Mail, Building2, Calendar, MoreHorizontal } from "lucide-react"
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
}

export function MobileEmployeeCard({ employee, onDelete }: MobileEmployeeCardProps) {
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
      'Tạm nghỉ': 'secondary',
      'Đã nghỉ việc': 'destructive'
    };
    return map[status] || 'default';
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleRowClick}
    >
      <CardContent className="p-4">
        {/* Header: Avatar + Name + Code + Menu */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className="h-9 w-10 flex-shrink-0">
              <AvatarImage src={employee.avatarUrl} alt={employee.fullName} />
              <AvatarFallback className="text-body-xs">{getInitials(employee.fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <h3 className="font-semibold text-body-medium truncate">{employee.fullName}</h3>
              <span className="text-body-xs text-muted-foreground">•</span>
              <span className="text-body-xs text-muted-foreground font-mono">{employee.id}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TouchButton
                variant="ghost"
                size="sm"
                className="h-9 w-10 p-0 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </TouchButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/employees/${employee.systemId}/edit`); }}>
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(employee.systemId); }}>
                Chuyển vào thùng rác
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Job Title + Department */}
        <div className="text-body-xs text-muted-foreground mb-3 flex items-center">
          <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
          <span className="truncate">
            {typeof employee.jobTitle === 'object' ? (employee.jobTitle as { name?: string })?.name : employee.jobTitle}
            {' • '}
            {typeof employee.department === 'object' ? (employee.department as { name?: string })?.name : employee.department}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t mb-3" />

        {/* Contact Info */}
        <div className="space-y-2">
          {employee.workEmail && (
            <div className="flex items-center text-body-xs text-muted-foreground">
              <Mail className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{employee.workEmail}</span>
            </div>
          )}
          {employee.phone && (
            <div className="flex items-center text-body-xs text-muted-foreground">
              <Phone className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span>{employee.phone}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-body-xs pt-1">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1.5" />
              <span>{formatDate(employee.hireDate)}</span>
            </div>
            <Badge variant={getStatusVariant(employee.employmentStatus)} className="text-body-xs">
              {employee.employmentStatus}
            </Badge>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t">
          {employee.phone && (
            <TouchButton 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-body-xs"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${employee.phone}`;
              }}
            >
              <Phone className="h-3 w-3 mr-1.5" />
              Gọi
            </TouchButton>
          )}
          {employee.workEmail && (
            <TouchButton 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 text-body-xs"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `mailto:${employee.workEmail}`;
              }}
            >
              <Mail className="h-3 w-3 mr-1.5" />
              Email
            </TouchButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
