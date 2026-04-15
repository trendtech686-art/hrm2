/**
 * Shipping Partner Detail Page
 * Full page for managing a single partner's configuration
 */

'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { Plus, Building2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { loadShippingConfig } from '@/lib/utils/shipping-config-migration';
import { AccountList } from './components/account-list';
import { PartnerConfigDialog, ShippingPartner } from './partner-config-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

const PARTNER_INFO: Record<string, { name: string; description: string; website?: string }> = {
  'GHN': { 
    name: 'Giao Hàng Nhanh', 
    description: 'Kết nối giao hàng, thu hộ chuyên nghiệp trải dài mọi miền đất nước.',
    website: 'https://ghn.vn'
  },
  'GHTK': { 
    name: 'Giao Hàng Tiết Kiệm', 
    description: 'Dịch vụ giao hàng thu tiền hộ; tốc độ nhanh, phủ sóng toàn quốc.',
    website: 'https://ghtk.vn'
  },
  'VTP': { 
    name: 'Viettel Post', 
    description: 'Dịch vụ nhận gửi, vận chuyển và phát nhanh hàng hóa, bưu phẩm trong nước.',
    website: 'https://viettelpost.vn'
  },
  'J&T': { 
    name: 'J&T Express', 
    description: 'Hỗ trợ các hoạt động giao nhận hàng hóa nhanh chóng.',
    website: 'https://jtexpress.vn'
  },
  'SPX': { 
    name: 'SPX Express', 
    description: 'Giải pháp vận chuyển thông minh, nhanh chóng (Shopee).',
    website: 'https://spx.vn'
  },

};

export function ShippingPartnerDetailPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  
  const [config, setConfig] = React.useState(() => loadShippingConfig());
  const [accountDialogOpen, setAccountDialogOpen] = React.useState(false);
  const [editingAccountId, setEditingAccountId] = React.useState<string | undefined>();
  
  const partnerCode = code?.toUpperCase() as ShippingPartner;
  const partnerInfo = PARTNER_INFO[partnerCode] || { name: partnerCode, description: '' };
  const partnerName = partnerInfo.name;
  const accounts = config.partners[partnerCode]?.accounts || [];
  const activeAccounts = accounts.filter(a => a.active);
  const hasConnection = activeAccounts.length > 0;

  const handleAddAccount = React.useCallback(() => {
    setEditingAccountId(undefined);
    setAccountDialogOpen(true);
  }, []);

  useSettingsPageHeader({
    title: `Quản lý ${partnerName}`,
    breadcrumb: [
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Đối tác vận chuyển', href: '/settings/shipping' },
      { label: partnerName, href: `/settings/shipping/partners/${code}` }
    ],
    actions: [
      <SettingsActionButton key="add" onClick={handleAddAccount}>
        <Plus className="h-4 w-4" />
        Thêm tài khoản
      </SettingsActionButton>
    ]
  });

  const handleRefresh = () => {
    const freshConfig = loadShippingConfig();
    setConfig(freshConfig);
  };

  const handleEditAccount = (accountId: string) => {
    setEditingAccountId(accountId);
    setAccountDialogOpen(true);
  };

  const handleAccountSaved = () => {
    handleRefresh();
    setAccountDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Partner Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{partnerName}</CardTitle>
                  <Badge variant="outline" className="text-xs">{partnerCode}</Badge>
                  {hasConnection ? (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Đã kết nối
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <XCircle className="h-3 w-3 mr-1" />
                      Chưa kết nối
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1">{partnerInfo.description}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push('/settings/shipping')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </CardHeader>
        {accounts.length > 0 && (
          <CardContent className="pt-0">
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Tổng tài khoản:</span>{' '}
                <span className="font-medium">{accounts.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Đang hoạt động:</span>{' '}
                <span className="font-medium text-green-600">{activeAccounts.length}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Account List Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle size="lg">Danh sách tài khoản</CardTitle>
              <CardDescription>
                Quản lý các tài khoản API và địa chỉ lấy hàng cho {partnerName}
              </CardDescription>
            </div>
            {accounts.length > 0 && (
              <Button onClick={handleAddAccount} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Thêm tài khoản
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Chưa có tài khoản nào</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Thêm tài khoản API để bắt đầu sử dụng dịch vụ vận chuyển của {partnerName}
              </p>
              <Button onClick={handleAddAccount}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm tài khoản đầu tiên
              </Button>
            </div>
          ) : (
            <AccountList
              partnerCode={partnerCode}
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onEditAccount={handleEditAccount}
              onAccountsChange={handleRefresh}
            />
          )}
        </CardContent>
      </Card>

      {/* Account Config Dialog */}
      <PartnerConfigDialog
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
        partnerCode={partnerCode}
        partnerName={partnerName}
        accountId={editingAccountId}
        onSave={handleAccountSaved}
      />
    </div>
  );
}
