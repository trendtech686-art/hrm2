'use client';

import * as React from 'react';
import { formatDate as formatDateUtil } from '@/lib/date-utils';
import { ExternalLink, Building2 } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { CopyableText } from '../../../components/shared/copy-button';
import type { Customer } from '@/lib/types/prisma-extended';
import { formatCurrency } from './types';
import { mobileBleedCardClass } from '@/components/layout/page-section';

// Simple detail item component
const DetailItem = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="space-y-1">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm font-medium">
      {value !== null && value !== undefined && value !== '' ? value : '—'}
    </dd>
  </div>
);

export interface BusinessTabProps {
  customer: Customer;
}

export function BusinessTab({ customer }: BusinessTabProps) {
  return (
    <div className="space-y-6">
      {(customer.company || customer.taxCode || customer.representative || customer.position) ? (
        <Card className={mobileBleedCardClass}>
          <CardHeader className="pb-3">
            <CardTitle>Thông tin doanh nghiệp</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
              <CopyableText label="Công ty" value={customer.company} />
              <CopyableText label="Mã số thuế" value={customer.taxCode} />
              <DetailItem label="Người đại diện" value={customer.representative} />
              <DetailItem label="Chức vụ" value={customer.position} />
            </dl>
          </CardContent>
        </Card>
      ) : (
        <Card className={mobileBleedCardClass}>
          <CardContent className="p-0">
            <div className="flex min-h-[240px] flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground">
              <Building2 className="mb-3 h-12 w-12 text-muted-foreground/60" strokeWidth={1.5} />
              <p className="text-sm">Chưa có thông tin doanh nghiệp</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hợp đồng */}
      {customer.contract && (
        <Card className={mobileBleedCardClass}>
          <CardHeader className="pb-3">
            <CardTitle>Hợp đồng</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
              <DetailItem label="Số hợp đồng" value={customer.contract.number} />
              <DetailItem label="Ngày bắt đầu" value={formatDateUtil(customer.contract.startDate)} />
              <DetailItem label="Ngày kết thúc" value={formatDateUtil(customer.contract.endDate)} />
              <DetailItem label="Giá trị" value={formatCurrency(customer.contract.value)} />
              {customer.contract.fileUrl && (
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">File hợp đồng</dt>
                  <dd>
                    <a 
                      href={customer.contract.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Xem tài liệu <ExternalLink className="h-3 w-3" />
                    </a>
                  </dd>
                </div>
              )}
              {customer.contract.status && (
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Trạng thái</dt>
                  <dd>
                    <Badge variant={
                      customer.contract.status === 'Active' ? 'success' :
                      customer.contract.status === 'Expired' ? 'destructive' :
                      customer.contract.status === 'Pending' ? 'warning' :
                      'secondary'
                    }>
                      {customer.contract.status === 'Active' ? 'Đang hiệu lực' : 
                       customer.contract.status === 'Expired' ? 'Hết hạn' :
                       customer.contract.status === 'Pending' ? 'Chờ duyệt' :
                       customer.contract.status === 'Cancelled' ? 'Đã hủy' : customer.contract.status}
                    </Badge>
                  </dd>
                </div>
              )}
            </dl>
            {customer.contract.details && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-1">Chi tiết điều khoản</div>
                <p className="text-sm whitespace-pre-wrap">{customer.contract.details}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
