import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { Construction } from 'lucide-react';

export function PrintTemplatesPage() {
  usePageHeader({
    title: 'Mẫu in',
    subtitle: 'Thiết lập và tùy chỉnh mẫu in theo chi nhánh',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Mẫu in', href: '/settings/print-templates', isCurrent: true }
    ]
  });

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Construction className="h-8 w-8 text-slate-600" />
            <div>
              <CardTitle>Mẫu in</CardTitle>
              <CardDescription>Chức năng đang được phát triển</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tính năng quản lý mẫu in sẽ sớm được cập nhật. Vui lòng quay lại sau.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
