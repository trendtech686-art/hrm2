import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Construction } from 'lucide-react';

export function OtherSettingsPage() {
  usePageHeader({
    title: 'Cài đặt khác',
    subtitle: 'Các thiết lập nâng cao và cấu hình hệ thống',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Cài đặt khác', href: '/settings/other', isCurrent: true }
    ]
  });

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Construction className="h-8 w-8 text-gray-500" />
            <div>
              <CardTitle>Cài đặt khác</CardTitle>
              <CardDescription>Chức năng đang được phát triển</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Các thiết lập nâng cao sẽ sớm được cập nhật. Vui lòng quay lại sau.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
