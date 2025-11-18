import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/date-utils';
import type { Penalty, PenaltyStatus } from './types';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { Button } from '../../../components/ui/button';
import { MoreHorizontal, User, Calendar, DollarSign, FileText } from 'lucide-react';

interface PenaltyCardProps {
  penalty: Penalty;
  onDelete?: (id: string) => void;
}

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const statusVariants: Record<PenaltyStatus, "warning" | "success" | "secondary"> = {
  "Chưa thanh toán": "warning",
  "Đã thanh toán": "success",
  "Đã hủy": "secondary",
};

export function PenaltyCard({ penalty, onDelete }: PenaltyCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/penalties/${penalty.systemId}`);
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        {/* Header: ID + Status + Menu */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="font-semibold text-sm font-mono">{penalty.id}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <Badge variant={statusVariants[penalty.status]} className="text-xs">
                {penalty.status}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  navigate(`/penalties/${penalty.systemId}`); 
                }}
              >
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  navigate(`/penalties/${penalty.systemId}/edit`); 
                }}
              >
                Chỉnh sửa
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onDelete(penalty.systemId); 
                  }}
                >
                  Xóa
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Employee Name */}
        <div className="flex items-center text-sm mb-2">
          <User className="h-3 w-3 mr-1.5 flex-shrink-0 text-muted-foreground" />
          <span className="font-medium truncate">{penalty.employeeName}</span>
        </div>

        {/* Divider */}
        <div className="border-t mb-3" />

        {/* Reason */}
        <div className="mb-3">
          <div className="flex items-start text-xs text-muted-foreground">
            <FileText className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{penalty.reason}</span>
          </div>
        </div>

        {/* Amount + Date */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="h-3 w-3 mr-1.5" />
              <span>Số tiền phạt</span>
            </div>
            <span className="font-semibold text-sm">{formatCurrency(penalty.amount)}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1.5" />
              <span>Ngày lập</span>
            </div>
            <span className="text-muted-foreground">{formatDate(penalty.issueDate)}</span>
          </div>

          {penalty.issuerName && (
            <div className="flex items-center justify-between text-xs pt-1 border-t">
              <span className="text-muted-foreground">Người lập</span>
              <span className="text-muted-foreground">{penalty.issuerName}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
