"use client";

import * as React from 'react';
import { TabsContent } from '../../../components/ui/tabs';
import { TrendingUp } from 'lucide-react';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs';
import { SettingsHistoryContent } from '../../../components/settings/SettingsHistoryContent';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { GeneralConfigTab } from './components/general-config-tab';
import { CategoryMappingTab } from './components/category-mapping-tab';
import { BrandMappingTab } from './components/brand-mapping-tab';
import { PriceMappingTab } from './components/price-mapping-tab';
import { ProductMappingTab } from './components/product-mapping-tab';
import { SyncSettingsTab } from './components/sync-settings-tab';

const TRENDTECH_TABS = [
  { value: 'general', label: 'Cấu hình chung' },
  { value: 'category-mapping', label: 'Mapping danh mục' },
  { value: 'brand-mapping', label: 'Mapping thương hiệu' },
  { value: 'price-mapping', label: 'Mapping giá' },
  { value: 'product-mapping', label: 'Sản phẩm đã liên kết' },
  { value: 'sync', label: 'Auto Sync' },
];

export function TrendtechSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');

  useSettingsPageHeader({
    title: 'Website Trendtech',
    icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
    breadcrumb: [
      { label: 'Tích hợp Trendtech', href: '/settings/trendtech', isCurrent: true },
    ],
  });

  return (
    <>
      <SettingsVerticalTabs
        value={activeTab}
        onValueChange={setActiveTab}
        tabs={TRENDTECH_TABS}
      >
        <TabsContent value="general" className="mt-0">
          <GeneralConfigTab />
        </TabsContent>

        <TabsContent value="category-mapping" className="mt-0">
          {activeTab === 'category-mapping' && <CategoryMappingTab />}
        </TabsContent>

        <TabsContent value="brand-mapping" className="mt-0">
          {activeTab === 'brand-mapping' && <BrandMappingTab />}
        </TabsContent>

        <TabsContent value="price-mapping" className="mt-0">
          {activeTab === 'price-mapping' && <PriceMappingTab />}
        </TabsContent>

        <TabsContent value="product-mapping" className="mt-0">
          {activeTab === 'product-mapping' && <ProductMappingTab />}
        </TabsContent>

        <TabsContent value="sync" className="mt-0">
          {activeTab === 'sync' && <SyncSettingsTab />}
        </TabsContent>
      </SettingsVerticalTabs>

      <div className="mt-6">
        <SettingsHistoryContent entityTypes={['trendtech_settings']} />
      </div>
    </>
  );
}
