import * as React from 'react';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { PartnerConnectionsPageContent } from './partner-connections';
import { GlobalShippingConfigTab } from './tabs/global-shipping-config';
import { ShippingFeeConfigPageContent } from './shipping-fee-config';
import { TabsContent } from '../../../components/ui/tabs';
import { useTabActionRegistry } from '../use-tab-action-registry';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs';

export function ShippingPartnersPage() {
  const [activeTab, setActiveTab] = React.useState('connections');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);
  const registerConnectionsActions = React.useMemo(() => registerActions('connections'), [registerActions]);
  const registerGlobalConfigActions = React.useMemo(() => registerActions('global-config'), [registerActions]);
  const registerFeesActions = React.useMemo(() => registerActions('fees'), [registerActions]);

  useSettingsPageHeader({
    title: 'Cài đặt vận chuyển',
    actions: headerActions,
  });

  const tabs = React.useMemo(
    () => [
      { value: 'connections', label: 'Kết nối đối tác' },
      { value: 'global-config', label: 'Cấu hình chung' },
      { value: 'fees', label: 'Phí vận chuyển' },
    ],
    [],
  );

  return (
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

      <TabsContent value="fees" className="mt-0">
        <ShippingFeeConfigPageContent
          isActive={activeTab === 'fees'}
          onRegisterActions={registerFeesActions}
        />
      </TabsContent>
    </SettingsVerticalTabs>
  );
}
