'use client'

import * as React from "react";
import { useSettingsPageHeader } from "../use-settings-page-header";
import { useTabActionRegistry } from "../use-tab-action-registry";
import { TabsContent } from "@/components/ui/tabs";
import { SettingsVerticalTabs } from "@/components/settings/SettingsVerticalTabs";
import { UnitsTabContent, ProductTypesTabContent, ImportersTabContent, StorageLocationsTabContent, LogisticsSettingsTabContent, SlaSettingsTabContent, WarrantySettingsTabContent } from "./tabs";

export function InventorySettingsPage() {
  const [activeTab, setActiveTab] = React.useState('units');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);

  const registerUnitActions = React.useMemo(() => registerActions('units'), [registerActions]);
  const registerTypeActions = React.useMemo(() => registerActions('types'), [registerActions]);
  const registerImporterActions = React.useMemo(() => registerActions('importers'), [registerActions]);
  const registerStorageActions = React.useMemo(() => registerActions('storage-locations'), [registerActions]);
  const registerSlaActions = React.useMemo(() => registerActions('sla-settings'), [registerActions]);
  const registerLogisticsActions = React.useMemo(() => registerActions('logistics-settings'), [registerActions]);
  const registerWarrantyActions = React.useMemo(() => registerActions('warranty-settings'), [registerActions]);

  useSettingsPageHeader({ title: 'Cài đặt kho hàng', actions: headerActions });

  const tabs = React.useMemo(() => [
    { value: 'units', label: 'Đơn vị tính' },
    { value: 'types', label: 'Loại sản phẩm' },
    { value: 'importers', label: 'Đơn vị nhập khẩu' },
    { value: 'storage-locations', label: 'Điểm lưu kho' },
    { value: 'logistics-settings', label: 'Khối lượng & kích thước' },
    { value: 'warranty-settings', label: 'Bảo hành' },
    { value: 'sla-settings', label: 'Cảnh báo tồn kho' },
  ], []);

  return (
    <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
      <TabsContent value="units" className="mt-0"><UnitsTabContent isActive={activeTab === 'units'} onRegisterActions={registerUnitActions} /></TabsContent>
      <TabsContent value="types" className="mt-0"><ProductTypesTabContent isActive={activeTab === 'types'} onRegisterActions={registerTypeActions} /></TabsContent>
      <TabsContent value="importers" className="mt-0"><ImportersTabContent isActive={activeTab === 'importers'} onRegisterActions={registerImporterActions} /></TabsContent>
      <TabsContent value="storage-locations" className="mt-0"><StorageLocationsTabContent isActive={activeTab === 'storage-locations'} onRegisterActions={registerStorageActions} /></TabsContent>
      <TabsContent value="logistics-settings" className="mt-0"><LogisticsSettingsTabContent isActive={activeTab === 'logistics-settings'} onRegisterActions={registerLogisticsActions} /></TabsContent>
      <TabsContent value="warranty-settings" className="mt-0"><WarrantySettingsTabContent isActive={activeTab === 'warranty-settings'} onRegisterActions={registerWarrantyActions} /></TabsContent>
      <TabsContent value="sla-settings" className="mt-0"><SlaSettingsTabContent isActive={activeTab === 'sla-settings'} onRegisterActions={registerSlaActions} /></TabsContent>
    </SettingsVerticalTabs>
  );
}
