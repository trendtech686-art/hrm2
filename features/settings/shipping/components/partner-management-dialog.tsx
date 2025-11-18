/**
 * Partner Management Dialog - V2
 * Main dialog for managing partner accounts and pickup addresses
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AccountList } from './account-list';
import { PartnerConfigDialog } from '../partner-config-dialog';
import { loadShippingConfig } from '@/lib/utils/shipping-config-migration';
import type { ShippingPartner } from '../partner-config-dialog';

interface PartnerManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerCode: ShippingPartner;
  partnerName: string;
}

export function PartnerManagementDialog({
  open,
  onOpenChange,
  partnerCode,
  partnerName,
}: PartnerManagementDialogProps) {
  const [config, setConfig] = useState(() => loadShippingConfig());
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | undefined>();

  const accounts = config.partners[partnerCode]?.accounts || [];

  const handleRefresh = () => {
    console.log('[PartnerManagementDialog] Refreshing config...');
    const freshConfig = loadShippingConfig();
    console.log('[PartnerManagementDialog] Fresh accounts:', freshConfig.partners[partnerCode]?.accounts?.length);
    setConfig(freshConfig);
  };

  const handleAddAccount = () => {
    setEditingAccountId(undefined);
    setAccountDialogOpen(true);
  };

  const handleEditAccount = (accountId: string) => {
    setEditingAccountId(accountId);
    setAccountDialogOpen(true);
  };

  const handleAccountSaved = () => {
    console.log('[PartnerManagementDialog] Account saved, refreshing...');
    handleRefresh();
    setAccountDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Quản lý {partnerName}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <AccountList
              partnerCode={partnerCode}
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onEditAccount={handleEditAccount}
              onAccountsChange={handleRefresh}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Account Config Dialog */}
      <PartnerConfigDialog
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
        partnerCode={partnerCode}
        partnerName={partnerName}
        accountId={editingAccountId}
        onSave={handleAccountSaved}
      />
    </>
  );
}
