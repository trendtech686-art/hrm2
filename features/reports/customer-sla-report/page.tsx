'use client'

import * as React from 'react';
import { usePageHeader } from '../../../contexts/page-header-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../../lib/router';
import Link from 'next/link';

export function CustomerSlaReportPage() {
  // Page header
  usePageHeader(React.useMemo(() => ({
    title: 'Báo cáo cảnh báo khách hàng',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: '/reports' },
      { label: 'Cảnh báo khách hàng', href: '/reports/customer-sla', isCurrent: true },
    ],
    showBackButton: false,
  }), []));

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Tính năng đã chuyển đổi</CardTitle>
          <CardDescription className="text-base">
            Hệ thống SLA cảnh báo khách hàng đã được thay thế bằng hệ thống bình luận trực tiếp.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Nhân viên có thể bình luận và tag trực tiếp vào trang chi tiết khách hàng để theo dõi và chăm sóc khách hàng một cách nhanh chóng và hiệu quả hơn.
          </p>
          <div className="flex justify-center">
            <Link href={ROUTES.SALES.CUSTOMERS}>
              <Button>
                Đi đến danh sách khách hàng
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomerSlaReportPage;
