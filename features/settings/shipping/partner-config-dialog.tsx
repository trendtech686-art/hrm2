/**
 * Partner Configuration Dialog (V2 Multi-Account)
 * Supports multiple accounts per partner
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PartnerInfoTab } from './tabs/partner-info-tab';
import { 
  loadShippingConfig, 
  saveShippingConfig,
  addPartnerAccount,
  updatePartnerAccount,
} from '@/lib/utils/shipping-config-migration';
import type { ShippingConfig, PartnerAccount } from '@/lib/types/shipping-config';
import { useState, useEffect } from 'react';

export type ShippingPartner = 'GHN' | 'GHTK' | 'VTP' | 'J&T' | 'SPX';

interface PartnerOption {
  code: ShippingPartner;
  name: string;
}

interface PartnerConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerCode: ShippingPartner | null; // null = show partner selection
  partnerName?: string;
  accountId?: string | undefined; // Optional: Edit existing account
  onSave: () => void;
  partnerOptions?: PartnerOption[]; // Available partners for selection
}

export function PartnerConfigDialog({
  open,
  onOpenChange,
  partnerCode: initialPartnerCode,
  partnerName: initialPartnerName,
  accountId,
  onSave,
  partnerOptions = [],
}: PartnerConfigDialogProps) {
  const [config, setConfig] = useState<ShippingConfig>(() => loadShippingConfig());
  const [selectedPartnerCode, setSelectedPartnerCode] = useState<ShippingPartner | null>(initialPartnerCode);
  
  // Reset selected partner when dialog opens/closes or initialPartnerCode changes
  useEffect(() => {
    if (open) {
      setConfig(loadShippingConfig());
      setSelectedPartnerCode(initialPartnerCode);
    }
  }, [open, initialPartnerCode]);
  
  // Determine effective partner code and name
  const effectivePartnerCode = selectedPartnerCode;
  const effectivePartnerName = selectedPartnerCode 
    ? (partnerOptions.find(p => p.code === selectedPartnerCode)?.name || initialPartnerName || selectedPartnerCode)
    : '';
  
  // Find account to edit
  const account = accountId && effectivePartnerCode
    ? config.partners[effectivePartnerCode]?.accounts?.find(a => a.id === accountId)
    : undefined;

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleAccountUpdate = (updatedAccount: PartnerAccount) => {
    if (!effectivePartnerCode) return;
    
    let newConfig: ShippingConfig;
    
    if (accountId) {
      // Update existing account
      newConfig = updatePartnerAccount(config, effectivePartnerCode, accountId, updatedAccount);
    } else {
      // Add new account
      newConfig = addPartnerAccount(config, effectivePartnerCode, updatedAccount);
    }
    
    setConfig(newConfig);
  };

  const handleSave = async (finalConfig: ShippingConfig) => {
    await saveShippingConfig(finalConfig);
    onSave();
    handleClose();
  };

  const isAddingNew = !accountId;
  const showPartnerSelection = isAddingNew && !initialPartnerCode && partnerOptions.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {accountId ? 'Chỉnh sửa' : 'Thêm'} tài khoản {effectivePartnerName ? `- ${effectivePartnerName}` : ''}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Partner Selection (when adding new without pre-selected partner) */}
          {showPartnerSelection && (
            <div className="space-y-2 pb-4 border-b border-border">
              <Label>Chọn đối tác vận chuyển</Label>
              <Select
                value={selectedPartnerCode || ''}
                onValueChange={(value) => setSelectedPartnerCode(value as ShippingPartner)}
              >
                <SelectTrigger className="focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Chọn đối tác..." />
                </SelectTrigger>
                <SelectContent>
                  {partnerOptions.map((partner) => (
                    <SelectItem key={partner.code} value={partner.code}>
                      {partner.name} ({partner.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Partner Form (show when partner is selected) */}
          {effectivePartnerCode ? (
            <PartnerInfoTab
              partnerCode={effectivePartnerCode}
              config={config}
              account={account}
              onAccountUpdate={handleAccountUpdate}
              onSave={handleSave}
              onClose={handleClose}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Vui lòng chọn đối tác vận chuyển để tiếp tục
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
