import * as React from 'react';
import { Badge } from '../../../components/ui/badge.tsx';
import type { PayrollBatchStatus } from '../../../lib/payroll-types.ts';
import { cn } from '../../../lib/utils.ts';

type PayrollStatusBadgeProps = {
  status: PayrollBatchStatus;
  className?: string;
};

const STATUS_LABEL: Record<PayrollBatchStatus, string> = {
  draft: 'Nháp',
  reviewed: 'Đang duyệt',
  locked: 'Đã khóa',
};

const STATUS_VARIANT: Record<PayrollBatchStatus, React.ComponentProps<typeof Badge>['variant']> = {
  draft: 'secondary',
  reviewed: 'warning',
  locked: 'success',
};

export function PayrollStatusBadge({ status, className }: PayrollStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={cn('text-xs font-medium', className)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
