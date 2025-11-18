/**
 * Partner Info Tab - Routes to partner-specific forms (V2)
 */

import { ShippingConfig, PartnerAccount } from '@/lib/types/shipping-config';
import { GHTKConfigForm } from '../forms/ghtk-config-form';

interface PartnerInfoTabProps {
  partnerCode: string;
  config: ShippingConfig;
  account?: PartnerAccount;
  onAccountUpdate: (account: PartnerAccount) => void;
  onSave: (config: ShippingConfig) => void;
  onClose: () => void;
}

export function PartnerInfoTab({
  partnerCode,
  config,
  account,
  onAccountUpdate,
  onSave,
  onClose,
}: PartnerInfoTabProps) {
  const commonProps = {
    config,
    account,
    onAccountUpdate,
    onSave,
    onClose,
  };

  switch (partnerCode) {
    case 'GHTK':
      return <GHTKConfigForm {...commonProps} />;
    
    default:
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Đối tác này chưa được hỗ trợ cấu hình
        </div>
      );
  }
}
