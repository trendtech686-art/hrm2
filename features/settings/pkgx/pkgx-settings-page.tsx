import * as React from 'react';
import { TabsContent } from '../../../components/ui/tabs.tsx';
import { Globe } from 'lucide-react';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs.tsx';
import { useSettingsPageHeader } from '../use-settings-page-header.tsx';
import {
  GeneralConfigTab,
  CategoryMappingTab,
  BrandMappingTab,
  PriceMappingTab,
  ProductMappingTab,
  SyncSettingsTab,
  LogTab,
} from './components';

const PKGX_TABS = [
  { value: 'general', label: 'Cấu hình chung' },
  { value: 'category-mapping', label: 'Mapping danh mục' },
  { value: 'brand-mapping', label: 'Mapping thương hiệu' },
  { value: 'price-mapping', label: 'Mapping giá' },
  { value: 'product-mapping', label: 'Sản phẩm đã liên kết' },
  { value: 'sync', label: 'Auto Sync' },
  { value: 'logs', label: 'Logs' },
];

export function PkgxSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');

  useSettingsPageHeader({
    title: 'Website phukiengiaxuong.com.vn',
    icon: <Globe className="h-5 w-5 text-rose-600" />,
    breadcrumb: [
      { label: 'Tích hợp PKGX', href: '/settings/pkgx', isCurrent: true },
    ],
  });

  return (
    <SettingsVerticalTabs
      value={activeTab}
      onValueChange={setActiveTab}
      tabs={PKGX_TABS}
    >
      <TabsContent value="general" className="mt-0">
        <GeneralConfigTab />
      </TabsContent>

      <TabsContent value="category-mapping" className="mt-0">
        <CategoryMappingTab />
      </TabsContent>

      <TabsContent value="brand-mapping" className="mt-0">
        <BrandMappingTab />
      </TabsContent>

      <TabsContent value="price-mapping" className="mt-0">
        <PriceMappingTab />
      </TabsContent>

      <TabsContent value="product-mapping" className="mt-0">
        <ProductMappingTab />
      </TabsContent>

      <TabsContent value="sync" className="mt-0">
        <SyncSettingsTab />
      </TabsContent>

      <TabsContent value="logs" className="mt-0">
        <LogTab />
      </TabsContent>
    </SettingsVerticalTabs>
  );
}
