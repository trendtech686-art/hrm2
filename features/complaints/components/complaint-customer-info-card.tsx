'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import { useCustomerStats } from '../../customers/hooks/use-customer-stats';
import { useCustomerSearch } from '../../customers/hooks/use-customers';
import type { Complaint } from '../types';

const fmt = new Intl.NumberFormat('vi-VN');

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN');
}

interface Props {
  complaint: Complaint;
  orderCustomerSystemId?: string | null;
}

export const ComplaintCustomerInfoCard: React.FC<Props> = React.memo(({ complaint, orderCustomerSystemId }) => {
  const directCustomerId = complaint.customerSystemId || orderCustomerSystemId;

  // Fallback: search by phone if no customerId
  const { data: searchResults } = useCustomerSearch(
    !directCustomerId && complaint.customerPhone ? complaint.customerPhone : '',
    1,
  );
  const resolvedCustomerId = directCustomerId || searchResults?.[0]?.systemId;

  const { data: stats, isLoading } = useCustomerStats(resolvedCustomerId);
  const customer = stats.customer;
  const maxDebt = customer?.maxDebt ? Number(customer.maxDebt) : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Thông tin khách hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Basic info */}
        <div>
          <p className="font-medium">{complaint.customerName}</p>
          <p className="text-sm text-muted-foreground">{complaint.customerPhone}</p>
        </div>

        {/* Stats grid */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5" />
            ))}
          </div>
        ) : (
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nhóm KH:</span>
              <span className="font-medium">{stats.customerGroupName || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Công nợ/Hạn mức:</span>
              <span className={`font-medium ${stats.financial.currentDebt > 0 ? 'text-red-600' : ''}`}>
                {fmt.format(stats.financial.currentDebt)}
                {maxDebt !== null ? `/${fmt.format(maxDebt)}` : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tổng chi tiêu:</span>
              <span className="font-medium">{fmt.format(stats.financial.totalSpent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tổng số đơn đặt:</span>
              <span className="font-medium">{stats.orders.total}</span>
            </div>
            {stats.orders.total > 0 && (
              <p className="text-xs text-muted-foreground pl-2">
                {stats.orders.pending > 0 && `${stats.orders.pending} đặt hàng`}
                {stats.orders.inProgress > 0 && `${stats.orders.pending > 0 ? ', ' : ''}${stats.orders.inProgress} đang giao dịch`}
                {stats.orders.completed > 0 && `${(stats.orders.pending + stats.orders.inProgress) > 0 ? ', ' : ''}${stats.orders.completed} hoàn thành`}
                {stats.orders.cancelled > 0 && `${(stats.orders.pending + stats.orders.inProgress + stats.orders.completed) > 0 ? ', ' : ''}${stats.orders.cancelled} đã hủy`}
              </p>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bảo hành (đang xử lý/tổng):</span>
              <span className="font-medium">{stats.warranties.active}/{stats.warranties.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Khiếu nại (đang xử lý/tổng):</span>
              <span className="font-medium">{stats.complaints.active}/{stats.complaints.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lần đặt đơn gần nhất:</span>
              <span className="font-medium">{formatDate(stats.orders.lastOrderDate)}</span>
            </div>
            {complaint.assigneeName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">NV phụ trách:</span>
                <span className="font-medium">{complaint.assigneeName}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ComplaintCustomerInfoCard.displayName = 'ComplaintCustomerInfoCard';
