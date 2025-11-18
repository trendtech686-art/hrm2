import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Construction } from 'lucide-react';

export function TaxesPage() {
  usePageHeader({
    title: 'Thuế',
    subtitle: 'Cấu hình các mức thuế suất đầu vào và đầu ra',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Thuế', href: '/settings/taxes', isCurrent: true }
    ]
  });

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Construction className="h-8 w-8 text-cyan-600" />
            <div>
              <CardTitle>Quản lý thuế</CardTitle>
              <CardDescription>Chức năng đang được phát triển</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tính năng quản lý thuế suất sẽ sớm được cập nhật. Vui lòng quay lại sau.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
