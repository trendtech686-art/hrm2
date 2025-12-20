import * as React from 'react';
import { Badge } from '../../../components/ui/badge';
import type { PayrollBatchStatus } from '../../../lib/payroll-types';
import { cn } from '../../../lib/utils';

type PayrollStatusBadgeProps = {
  status: PayrollBatchStatus;
  className?: string;
};

const STATUS_LABEL: Record<PayrollBatchStatus, string> = {
  draft: 'Nháp',
  reviewed: 'Đang duyệt',
  locked: 'Đã khóa',
  cancelled: 'Đã hủy',
};

const STATUS_VARIANT: Record<PayrollBatchStatus, React.ComponentProps<typeof Badge>['variant']> = {
  draft: 'secondary',
  reviewed: 'warning',
  locked: 'success',
  cancelled: 'destructive',
};

export function PayrollStatusBadge({ status, className }: PayrollStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={cn('text-body-xs font-medium', className)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
