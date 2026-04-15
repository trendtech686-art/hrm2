'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { PartnerConnectionsPageContent } from './partner-connections';
import { GlobalShippingConfigTab } from './tabs/global-shipping-config';
import { TabsContent } from '../../../components/ui/tabs';
import { useTabActionRegistry } from '../use-tab-action-registry';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs';
import { SettingsHistoryContent } from '../../../components/settings/SettingsHistoryContent';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export function ShippingPartnersPage() {
  const router = useRouter();
  const { can, isLoading: authLoading } = useAuth();
  const canEditSettings = can('edit_settings');
  React.useEffect(() => {
    if (!authLoading && !canEditSettings) {
      toast.error('Bạn không có quyền truy cập cài đặt vận chuyển');
      router.replace('/shipments');
    }
  }, [authLoading, canEditSettings, router]);

  const [activeTab, setActiveTab] = React.useState('connections');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);
  const registerConnectionsActions = React.useMemo(() => registerActions('connections'), [registerActions]);
  const registerGlobalConfigActions = React.useMemo(() => registerActions('global-config'), [registerActions]);

  useSettingsPageHeader({
    title: 'Cài đặt vận chuyển',
    actions: headerActions,
  });

  const tabs = React.useMemo(
    () => [
      { value: 'connections', label: 'Kết nối đối tác' },
      { value: 'global-config', label: 'Cấu hình chung' },
    ],
    [],
  );

  return (
    <>
      <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
        <TabsContent value="connections" className="mt-0">
          <PartnerConnectionsPageContent
            isActive={activeTab === 'connections'}
            onRegisterActions={registerConnectionsActions}
          />
        </TabsContent>

        <TabsContent value="global-config" className="mt-0">
          <GlobalShippingConfigTab
            isActive={activeTab === 'global-config'}
            onRegisterActions={registerGlobalConfigActions}
          />
        </TabsContent>
      </SettingsVerticalTabs>

      <div className="mt-6">
        <SettingsHistoryContent entityTypes={['shipping_settings', 'shipping_config', 'shipping_partner']} />
      </div>
    </>
  );
}
