import * as React from 'react';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs.tsx';
import { SalesChannelsPageContent } from '../sales-channels/page-content.tsx';
import { SalesManagementSettings } from './sales-management-settings.tsx';
import { Card, CardContent } from '../../../components/ui/card.tsx';

export function SalesConfigPage() {
  usePageHeader({
    title: 'Cấu hình bán hàng',
    subtitle: 'Thiết lập quy trình và chính sách bán hàng',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Cấu hình bán hàng', href: '/settings/sales-config', isCurrent: true }
    ]
  });

  return (
    <Tabs defaultValue="sales-management-settings" className="md:flex md:gap-6">
      <TabsList className="flex-col h-auto p-1 bg-transparent space-y-1 items-start md:w-1/5 shrink-0 md:sticky md:top-6 self-start">
        <TabsTrigger value="sales-management-settings" className="w-full justify-start">
          Thiết lập quản lý bán hàng
        </TabsTrigger>
        <TabsTrigger value="sales-channels" className="w-full justify-start">
          Quản lý nguồn bán hàng
        </TabsTrigger>
      </TabsList>
      <div className="md:w-4/5 mt-4 md:mt-0">
        <TabsContent value="sales-management-settings" className="mt-0">
          <SalesManagementSettings />
        </TabsContent>
        <TabsContent value="sales-channels" className="mt-0">
          <Card>
            <CardContent className="p-4">
              <SalesChannelsPageContent />
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
