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

  // Memoize tab-specific action registrars so they stay stable while tab is active
  const tabActionHandlers = React.useMemo(() => ({
    units: registerActions('units'),
    types: registerActions('types'),
    importers: registerActions('importers'),
    storage: registerActions('storage-locations'),
    logistics: registerActions('logistics-settings'),
    warranty: registerActions('warranty-settings'),
    sla: registerActions('sla-settings'),
  }), [registerActions]);

  return (
    <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
      <TabsContent value="units" className="mt-0"><UnitsTabContent isActive={activeTab === 'units'} onRegisterActions={tabActionHandlers.units} /></TabsContent>
      <TabsContent value="types" className="mt-0"><ProductTypesTabContent isActive={activeTab === 'types'} onRegisterActions={tabActionHandlers.types} /></TabsContent>
      <TabsContent value="importers" className="mt-0"><ImportersTabContent isActive={activeTab === 'importers'} onRegisterActions={tabActionHandlers.importers} /></TabsContent>
      <TabsContent value="storage-locations" className="mt-0"><StorageLocationsTabContent isActive={activeTab === 'storage-locations'} onRegisterActions={tabActionHandlers.storage} /></TabsContent>
      <TabsContent value="logistics-settings" className="mt-0"><LogisticsSettingsTabContent isActive={activeTab === 'logistics-settings'} onRegisterActions={tabActionHandlers.logistics} /></TabsContent>
      <TabsContent value="warranty-settings" className="mt-0"><WarrantySettingsTabContent isActive={activeTab === 'warranty-settings'} onRegisterActions={tabActionHandlers.warranty} /></TabsContent>
      <TabsContent value="sla-settings" className="mt-0"><SlaSettingsTabContent isActive={activeTab === 'sla-settings'} onRegisterActions={tabActionHandlers.sla} /></TabsContent>
    </SettingsVerticalTabs>
  );
}
