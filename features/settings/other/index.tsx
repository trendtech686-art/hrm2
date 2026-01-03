'use client';

import * as React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { SettingsVerticalTabs } from '@/components/settings/SettingsVerticalTabs';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { useTabActionRegistry } from '../use-tab-action-registry';

// Import all tab components
import { GeneralTabContent } from './general-tab';
import { SecurityTabContent } from './security-tab';
import { MediaTabContent } from './media-tab';
import { IntegrationTabContent } from './integration-tab';
import { SystemTabContent } from './system-tab';
import { NotificationTabContent } from './notification-tab';
import { EmailTemplateTabContent } from './email-template-tab';
import { WebsiteTabContent } from './website-tab';

export function OtherSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);
  
  const registerGeneralActions = React.useMemo(() => registerActions('general'), [registerActions]);
  const registerNotificationActions = React.useMemo(() => registerActions('notifications'), [registerActions]);
  const registerSecurityActions = React.useMemo(() => registerActions('security'), [registerActions]);
  const registerMediaActions = React.useMemo(() => registerActions('media'), [registerActions]);
  const registerIntegrationActions = React.useMemo(() => registerActions('integration'), [registerActions]);
  const registerEmailTemplateActions = React.useMemo(() => registerActions('email-templates'), [registerActions]);
  const registerSystemActions = React.useMemo(() => registerActions('system'), [registerActions]);
  const registerWebsiteActions = React.useMemo(() => registerActions('website'), [registerActions]);

  useSettingsPageHeader({
    title: 'Cài đặt khác',
    actions: headerActions,
  });
  
  const tabs = React.useMemo(
    () => [
      { value: 'general', label: 'Chung' },
      { value: 'notifications', label: 'Thông báo' },
      { value: 'security', label: 'Bảo mật' },
      { value: 'media', label: 'Tệp tin' },
      { value: 'integration', label: 'Email SMTP' },
      { value: 'email-templates', label: 'Mẫu Email' },
      { value: 'website', label: 'Website' },
      { value: 'system', label: 'Hệ thống' },
    ],
    [],
  );

  return (
    <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
      <TabsContent value="general" className="mt-0">
        <GeneralTabContent 
          isActive={activeTab === 'general'} 
          onRegisterActions={registerGeneralActions} 
        />
      </TabsContent>

      <TabsContent value="notifications" className="mt-0">
        <NotificationTabContent 
          isActive={activeTab === 'notifications'} 
          onRegisterActions={registerNotificationActions} 
        />
      </TabsContent>

      <TabsContent value="security" className="mt-0">
        <SecurityTabContent 
          isActive={activeTab === 'security'} 
          onRegisterActions={registerSecurityActions} 
        />
      </TabsContent>

      <TabsContent value="media" className="mt-0">
        <MediaTabContent 
          isActive={activeTab === 'media'} 
          onRegisterActions={registerMediaActions} 
        />
      </TabsContent>

      <TabsContent value="integration" className="mt-0">
        <IntegrationTabContent 
          isActive={activeTab === 'integration'} 
          onRegisterActions={registerIntegrationActions} 
        />
      </TabsContent>

      <TabsContent value="email-templates" className="mt-0">
        <EmailTemplateTabContent 
          isActive={activeTab === 'email-templates'} 
          onRegisterActions={registerEmailTemplateActions} 
        />
      </TabsContent>

      <TabsContent value="website" className="mt-0">
        <WebsiteTabContent 
          isActive={activeTab === 'website'} 
          onRegisterActions={registerWebsiteActions} 
        />
      </TabsContent>

      <TabsContent value="system" className="mt-0">
        <SystemTabContent 
          isActive={activeTab === 'system'} 
          onRegisterActions={registerSystemActions} 
        />
      </TabsContent>
    </SettingsVerticalTabs>
  );
}
