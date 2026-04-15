'use client';

import * as React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { SettingsVerticalTabs } from '@/components/settings/SettingsVerticalTabs';
import { SettingsHistoryContent } from '@/components/settings/SettingsHistoryContent';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { useTabActionRegistry } from '../use-tab-action-registry';

// Import all tab components
import { GeneralTabContent } from './general-tab';
import { IntegrationTabContent } from './integration-tab';
import { SystemTabContent } from './system-tab';
// WebsiteTabContent: chưa implement backend → Sắp ra mắt

export function OtherSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);
  
  const registerGeneralActions = React.useMemo(() => registerActions('general'), [registerActions]);
  const registerIntegrationActions = React.useMemo(() => registerActions('integration'), [registerActions]);
  const registerSystemActions = React.useMemo(() => registerActions('system'), [registerActions]);


  useSettingsPageHeader({
    title: 'Cài đặt khác',
    actions: headerActions,
  });
  
  const tabs = React.useMemo(
    () => [
      { value: 'general', label: 'Chung' },
      { value: 'integration', label: 'Email SMTP' },
      { value: 'website', label: 'Website (Sắp ra mắt)' },
      { value: 'system', label: 'Hệ thống' },
    ],
    [],
  );

  return (<>
    <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
      <TabsContent value="general" className="mt-0">
        <GeneralTabContent 
          isActive={activeTab === 'general'} 
          onRegisterActions={registerGeneralActions} 
        />
      </TabsContent>

      <TabsContent value="integration" className="mt-0">
        <IntegrationTabContent 
          isActive={activeTab === 'integration'} 
          onRegisterActions={registerIntegrationActions} 
        />
      </TabsContent>

      <TabsContent value="website" className="mt-0">
        <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
          <p className="text-muted-foreground">Tính năng quản lý Website đang được phát triển.</p>
          <p className="text-xs text-muted-foreground mt-1">Sắp ra mắt trong phiên bản tới.</p>
        </div>
      </TabsContent>

      <TabsContent value="system" className="mt-0">
        <SystemTabContent 
          isActive={activeTab === 'system'} 
          onRegisterActions={registerSystemActions} 
        />
      </TabsContent>
    </SettingsVerticalTabs>

    {/* Lịch sử thay đổi — hiển thị dưới dạng card ở cuối trang */}
    <div className="mt-8">
      <SettingsHistoryContent entityTypes={['settings', 'website_settings', 'settings_data']} />
    </div>
  </>);
}
