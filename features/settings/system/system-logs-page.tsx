import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { Construction } from 'lucide-react';

export function SystemLogsPage() {
  usePageHeader({
    title: 'Nhật ký hệ thống',
    subtitle: 'Theo dõi lịch sử hoạt động và thay đổi',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Nhật ký hệ thống', href: '/settings/system-logs', isCurrent: true }
    ]
  });

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Construction className="h-8 w-8 text-stone-600" />
            <div>
              <CardTitle>Nhật ký hệ thống</CardTitle>
              <CardDescription>Chức năng đang được phát triển</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tính năng nhật ký hệ thống sẽ sớm được cập nhật. Vui lòng quay lại sau.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
