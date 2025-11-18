import * as React from 'react';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { PartnerConnectionsPageContent } from './partner-connections.tsx';
import { GlobalShippingConfigTab } from './tabs/global-shipping-config.tsx';
import { ShippingFeeConfigPageContent } from './shipping-fee-config.tsx';
import { ResponsiveContainer } from '../../../components/mobile/responsive-container.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

export function ShippingPartnersPage() {
  const { setPageHeader } = usePageHeader();
  const [activeTab, setActiveTab] = React.useState('connections');

  React.useEffect(() => {
    setPageHeader({
      title: 'Cài đặt vận chuyển',
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Cài đặt', href: '/settings' },
        { label: 'Cài đặt vận chuyển', href: '/settings/shipping', isCurrent: true }
      ]
    });
    
    console.log('[ShippingPartnersPage] Page mounted, header set');
    
    return () => {
      console.log('[ShippingPartnersPage] Page unmounted');
    };
  }, [setPageHeader]);

  return (
    <ResponsiveContainer maxWidth="full" padding="md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
          <TabsTrigger value="connections">Kết nối đối tác</TabsTrigger>
          <TabsTrigger value="global-config">Cấu hình chung</TabsTrigger>
          <TabsTrigger value="fees">Phí vận chuyển</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          <PartnerConnectionsPageContent />
        </TabsContent>

        <TabsContent value="global-config" className="space-y-4">
          <GlobalShippingConfigTab />
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <ShippingFeeConfigPageContent />
        </TabsContent>
      </Tabs>
    </ResponsiveContainer>
  );
}
