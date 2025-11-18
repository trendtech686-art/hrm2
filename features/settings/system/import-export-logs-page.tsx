import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { Construction } from 'lucide-react';

export function ImportExportLogsPage() {
  usePageHeader({
    title: 'Lịch sử nhập xuất',
    subtitle: 'Xem lịch sử import/export dữ liệu',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Lịch sử nhập xuất', href: '/settings/import-export-logs', isCurrent: true }
    ]
  });

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Construction className="h-8 w-8 text-gray-600" />
            <div>
              <CardTitle>Lịch sử nhập xuất dữ liệu</CardTitle>
              <CardDescription>Chức năng đang được phát triển</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tính năng xem lịch sử import/export sẽ sớm được cập nhật. Vui lòng quay lại sau.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
