import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Settings2, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useMediaQuery } from '../../../lib/use-media-query';
import { ShippingPartner } from './partner-config-dialog';
import { loadShippingConfig } from '@/lib/utils/shipping-config-migration';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton.tsx';
import type { RegisterTabActions } from '../use-tab-action-registry.ts';

type PartnerConnectionsPageContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export const PartnerConnectionsPageContent: React.FC<PartnerConnectionsPageContentProps> = ({ isActive, onRegisterActions }) => {
  const navigate = useNavigate();
  const [shippingConfig] = React.useState(() => loadShippingConfig());

  const isMobile = !useMediaQuery("(min-width: 768px)");

  const handleOpenConfig = React.useCallback((code: ShippingPartner) => {
    navigate(`/settings/shipping/partners/${code}`);
  }, [navigate]);

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
    { code: 'GHN' as ShippingPartner, name: 'Giao Hàng Nhanh', description: 'Kết nối giao hàng, thu hộ chuyên nghiệp trải dài mọi miền đất nước.' },
    { code: 'GHTK' as ShippingPartner, name: 'Giao Hàng Tiết Kiệm', description: 'Dịch vụ giao hàng thu tiền hộ; tốc độ nhanh, phủ sóng toàn quốc.' },
    { code: 'VTP' as ShippingPartner, name: 'Viettel Post', description: 'Dịch vụ nhận gửi, vận chuyển và phát nhanh hàng hóa, bưu phẩm trong nước.' },
    { code: 'J&T' as ShippingPartner, name: 'J&T Express', description: 'Hỗ trợ các hoạt động giao nhận hàng hóa nhanh chóng.' },
    { code: 'SPX' as ShippingPartner, name: 'SPX Express', description: 'Giải pháp vận chuyển thông minh, nhanh chóng (Shopee).' },
  ];

  const firstConnectedPartner = React.useMemo(() => {
    return partnerList.find(partner => getPartnerStatus(partner.code).isConnected);
  }, [shippingConfig]);

  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    const actions = [
      <SettingsActionButton key="connect" onClick={() => handleOpenConfig('GHN')}>
        <Plus className="h-4 w-4 mr-2" />
        Kết nối đối tác
      </SettingsActionButton>,
    ];

    if (firstConnectedPartner) {
      actions.push(
        <SettingsActionButton
          key="manage"
          variant="outline"
          onClick={() => handleOpenConfig(firstConnectedPartner.code)}
        >
          <Settings2 className="h-4 w-4 mr-2" />
          Quản lý kết nối
        </SettingsActionButton>,
      );
    }

    onRegisterActions(actions);
  }, [firstConnectedPartner, handleOpenConfig, isActive, onRegisterActions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kết nối đối tác vận chuyển</CardTitle>
        <CardDescription>
          Cấu hình API token và dịch vụ cho từng đối tác vận chuyển
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {partnerList.map(partner => {
          const status = getPartnerStatus(partner.code);
          
          return (
            <Card key={partner.code} className="relative">
              <CardHeader className={isMobile ? 'p-4 pb-3' : 'p-6 pb-4'}>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>
                      {partner.name}
                    </CardTitle>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {partner.code}
                    </Badge>
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
                    onClick={() => handleOpenConfig(partner.code)}
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
      </CardContent>
    </Card>
  );
};
