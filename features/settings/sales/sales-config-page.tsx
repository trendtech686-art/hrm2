import * as React from 'react';
import { useSettingsPageHeader } from '../use-settings-page-header.tsx';
import { TabsContent } from '../../../components/ui/tabs.tsx';
import { SalesChannelsPageContent } from '../sales-channels/page-content.tsx';
import { SalesManagementSettings } from './sales-management-settings.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.tsx';
import { useTabActionRegistry } from '../use-tab-action-registry.ts';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs.tsx';

export function SalesConfigPage() {
  const [activeTab, setActiveTab] = React.useState('sales-management-settings');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);

  useSettingsPageHeader({
    title: 'Cấu hình bán hàng',
    subtitle: 'Thiết lập quy trình và chính sách bán hàng',
    actions: headerActions,
  });

  const tabs = React.useMemo(
    () => [
      { value: 'sales-management-settings', label: 'Thiết lập quản lý bán hàng' },
      { value: 'sales-channels', label: 'Quản lý nguồn bán hàng' },
    ],
    [],
  );

  return (
    <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
      <TabsContent value="sales-management-settings" className="mt-0">
        <SalesManagementSettings
          isActive={activeTab === 'sales-management-settings'}
          onRegisterActions={registerActions('sales-management-settings')}
        />
      </TabsContent>
      <TabsContent value="sales-channels" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Quản lý nguồn bán hàng</CardTitle>
            <CardDescription>Thiết lập các nguồn tạo ra đơn hàng của cửa hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChannelsPageContent
              isActive={activeTab === 'sales-channels'}
              onRegisterActions={registerActions('sales-channels')}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </SettingsVerticalTabs>
  );
}
