'use client'

import * as React from "react";
import { useRouter } from 'next/navigation';
import { useSettingsPageHeader } from "../use-settings-page-header";
import { useTabActionRegistry } from "../use-tab-action-registry";
import { TabsContent } from "@/components/ui/tabs";
import { SettingsVerticalTabs } from "@/components/settings/SettingsVerticalTabs";
import { SettingsHistoryContent } from "@/components/settings/SettingsHistoryContent";
import { UnitsTabContent, ProductTypesTabContent, ImportersTabContent, StorageLocationsTabContent, LogisticsSettingsTabContent, SlaSettingsTabContent, WarrantySettingsTabContent } from "./tabs";
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export function InventorySettingsPage() {
  const router = useRouter();
  const { can, isLoading: authLoading } = useAuth();
  const canEditSettings = can('edit_settings');
  React.useEffect(() => {
    if (!authLoading && !canEditSettings) {
      toast.error('Bạn không có quyền truy cập cài đặt kho hàng');
      router.replace('/products');
    }
  }, [authLoading, canEditSettings, router]);

  const [activeTab, setActiveTab] = React.useState('units');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);

  useSettingsPageHeader({ title: 'Cài đặt kho hàng', actions: headerActions });

  const tabs = React.useMemo(() => [
    { value: 'units', label: 'Đơn vị tính' },
    { value: 'types', label: 'Loại sản phẩm' },
    { value: 'importers', label: 'Công ty xuất nhập khẩu' },
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
    <>
    <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
      <TabsContent value="units" className="mt-0"><UnitsTabContent isActive={activeTab === 'units'} onRegisterActions={tabActionHandlers.units} /></TabsContent>
      <TabsContent value="types" className="mt-0"><ProductTypesTabContent isActive={activeTab === 'types'} onRegisterActions={tabActionHandlers.types} /></TabsContent>
      <TabsContent value="importers" className="mt-0"><ImportersTabContent isActive={activeTab === 'importers'} onRegisterActions={tabActionHandlers.importers} /></TabsContent>
      <TabsContent value="storage-locations" className="mt-0"><StorageLocationsTabContent isActive={activeTab === 'storage-locations'} onRegisterActions={tabActionHandlers.storage} /></TabsContent>
      <TabsContent value="logistics-settings" className="mt-0"><LogisticsSettingsTabContent isActive={activeTab === 'logistics-settings'} onRegisterActions={tabActionHandlers.logistics} /></TabsContent>
      <TabsContent value="warranty-settings" className="mt-0"><WarrantySettingsTabContent isActive={activeTab === 'warranty-settings'} onRegisterActions={tabActionHandlers.warranty} /></TabsContent>
      <TabsContent value="sla-settings" className="mt-0"><SlaSettingsTabContent isActive={activeTab === 'sla-settings'} onRegisterActions={tabActionHandlers.sla} /></TabsContent>
    </SettingsVerticalTabs>

    <SettingsHistoryContent entityTypes={['unit', 'storage_location', 'stock_location', 'category', 'brand', 'product_type', 'importer', 'logistics_settings', 'inventory_sla_settings']} />
    </>
  );
}
