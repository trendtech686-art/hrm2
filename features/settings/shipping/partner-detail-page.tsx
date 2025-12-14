/**
 * Shipping Partner Detail Page
 * Full page for managing a single partner's configuration
 */

import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { loadShippingConfig } from '@/lib/utils/shipping-config-migration';
import { AccountList } from './components/account-list';
import { PartnerConfigDialog, ShippingPartner } from './partner-config-dialog';
import type { PartnerAccount } from '@/lib/types/shipping-config';

const PARTNER_NAMES: Record<string, string> = {
  'GHN': 'Giao Hàng Nhanh',
  'GHTK': 'Giao Hàng Tiết Kiệm',
  'VTP': 'Viettel Post',
  'J&T': 'J&T Express',
  'SPX': 'SPX Express',
  'VNPOST': 'VNPost',
  'NINJA_VAN': 'Ninja Van',
  'AHAMOVE': 'Ahamove',
};

export function ShippingPartnerDetailPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  
  const [config, setConfig] = React.useState(() => loadShippingConfig());
  const [accountDialogOpen, setAccountDialogOpen] = React.useState(false);
  const [editingAccountId, setEditingAccountId] = React.useState<string | undefined>();
  
  const partnerCode = code?.toUpperCase() as ShippingPartner;
  const partnerName = PARTNER_NAMES[partnerCode] || partnerCode;
  const accounts = config.partners[partnerCode]?.accounts || [];

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
    console.log('[PartnerDetailPage] Refreshing config...');
    const freshConfig = loadShippingConfig();
    console.log('[PartnerDetailPage] Fresh accounts:', freshConfig.partners[partnerCode]?.accounts?.length);
    setConfig(freshConfig);
  };

  const handleEditAccount = (accountId: string) => {
    setEditingAccountId(accountId);
    setAccountDialogOpen(true);
  };

  const handleAccountSaved = () => {
    console.log('[PartnerDetailPage] Account saved, refreshing...');
    handleRefresh();
    setAccountDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Account List */}
      <AccountList
        partnerCode={partnerCode}
        accounts={accounts}
        onAddAccount={handleAddAccount}
        onEditAccount={handleEditAccount}
        onAccountsChange={handleRefresh}
      />

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
