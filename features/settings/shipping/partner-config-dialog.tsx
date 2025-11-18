/**
 * Partner Configuration Dialog (V2 Multi-Account)
 * Supports multiple accounts per partner
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PartnerInfoTab } from './tabs/partner-info-tab';
import { 
  loadShippingConfig, 
  saveShippingConfig,
  addPartnerAccount,
  updatePartnerAccount,
} from '@/lib/utils/shipping-config-migration';
import type { ShippingConfig, PartnerAccount } from '@/lib/types/shipping-config';
import { useState } from 'react';

export type ShippingPartner = 'GHN' | 'GHTK' | 'VTP' | 'J&T' | 'SPX' | 'VNPOST' | 'NINJA_VAN' | 'AHAMOVE';

interface PartnerConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerCode: ShippingPartner;
  partnerName: string;
  accountId?: string; // Optional: Edit existing account
  onSave: () => void;
}

export function PartnerConfigDialog({
  open,
  onOpenChange,
  partnerCode,
  partnerName,
  accountId,
  onSave,
}: PartnerConfigDialogProps) {
  const [config, setConfig] = useState<ShippingConfig>(() => loadShippingConfig());
  
  // Find account to edit
  const account = accountId 
    ? config.partners[partnerCode]?.accounts.find(a => a.id === accountId)
    : undefined;

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleAccountUpdate = (updatedAccount: PartnerAccount) => {
    let newConfig: ShippingConfig;
    
    if (accountId) {
      // Update existing account
      newConfig = updatePartnerAccount(config, partnerCode, accountId, updatedAccount);
    } else {
      // Add new account
      newConfig = addPartnerAccount(config, partnerCode, updatedAccount);
    }
    
    setConfig(newConfig);
  };

  const handleSave = (finalConfig: ShippingConfig) => {
    saveShippingConfig(finalConfig);
    onSave();
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {accountId ? 'Chỉnh sửa' : 'Thêm'} tài khoản {partnerName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <PartnerInfoTab
            partnerCode={partnerCode}
            config={config}
            account={account}
            onAccountUpdate={handleAccountUpdate}
            onSave={handleSave}
            onClose={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
