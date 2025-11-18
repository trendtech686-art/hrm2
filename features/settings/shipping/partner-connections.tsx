import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Settings2, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '../../../hooks/use-toast';
import { useMediaQuery } from '../../../lib/use-media-query';
import { ShippingPartner } from './partner-config-dialog';
import { loadShippingConfig } from '@/lib/utils/shipping-config-migration';

export const PartnerConnectionsPageContent: React.FC = () => {
  const navigate = useNavigate();
  const [shippingConfig, setShippingConfig] = React.useState(() => loadShippingConfig());

  const { toast } = useToast();
  const isMobile = !useMediaQuery("(min-width: 768px)");

  const handleOpenConfig = (code: ShippingPartner, name: string, hasAccounts: boolean) => {
    // ✅ Always navigate to detail page (no popup)
    navigate(`/settings/shipping/partners/${code}`);
  };

  const getPartnerStatus = (partnerCode: ShippingPartner) => {
    // ✅ V2: Check if partner has any active accounts
    const partnerData = shippingConfig.partners[partnerCode];
    const hasAccounts = partnerData?.accounts && partnerData.accounts.length > 0;
    const hasActiveAccounts = partnerData?.accounts?.some(acc => acc.active) || false;
    
    return {
      isConnected: hasActiveAccounts,
      hasConfig: hasAccounts,
      accountCount: partnerData?.accounts?.length || 0,
    };
  };

  const partnerList = [
    { code: 'GHN' as ShippingPartner, name: 'Giao Hàng Nhanh', logo: '🚀', description: 'Kết nối giao hàng, thu hộ chuyên nghiệp trải dài mọi miền đất nước.' },
    { code: 'GHTK' as ShippingPartner, name: 'Giao Hàng Tiết Kiệm', logo: '📦', description: 'Dịch vụ giao hàng thu tiền hộ; tốc độ nhanh, phủ sóng toàn quốc.' },
    { code: 'VTP' as ShippingPartner, name: 'Viettel Post', logo: '✉️', description: 'Dịch vụ nhận gửi, vận chuyển và phát nhanh hàng hóa, bưu phẩm trong nước.' },
    { code: 'J&T' as ShippingPartner, name: 'J&T Express', logo: '🚚', description: 'Hỗ trợ các hoạt động giao nhận hàng hóa nhanh chóng.' },
    { code: 'SPX' as ShippingPartner, name: 'SPX Express', logo: '📮', description: 'Giải pháp vận chuyển thông minh, nhanh chóng (Shopee).' },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
          Kết nối đối tác vận chuyển
        </h2>
        <p className="text-sm text-muted-foreground">
          Cấu hình API token và dịch vụ cho từng đối tác vận chuyển
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partnerList.map(partner => {
          const status = getPartnerStatus(partner.code);
          
          return (
            <Card key={partner.code} className="relative">
              <CardHeader className={isMobile ? 'p-4 pb-3' : 'p-6 pb-4'}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{partner.logo}</div>
                    <div>
                      <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>
                        {partner.name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {partner.code}
                      </Badge>
                    </div>
                  </div>
                  {status.isConnected && (
                    <Badge variant="default" className="text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Đã kết nối
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className={isMobile ? 'p-4 pt-0' : 'p-6 pt-0'}>
                <CardDescription className="text-sm mb-4">
                  {partner.description}
                </CardDescription>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleOpenConfig(partner.code, partner.name, status.hasConfig)}
                    variant={status.isConnected ? 'outline' : 'default'}
                    className="w-full"
                    size="sm"
                  >
                    {status.isConnected ? (
                      <>
                        <Settings2 className="h-4 w-4 mr-2" />
                        Quản lý
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Kết nối
                      </>
                    )}
                  </Button>
                  {status.accountCount > 0 && (
                    <div className="text-xs text-center text-muted-foreground">
                      {status.accountCount} tài khoản
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
