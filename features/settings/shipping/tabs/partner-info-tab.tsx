/**
 * Partner Info Tab - Routes to partner-specific forms (V2)
 */

import { ShippingConfig, PartnerAccount } from '@/lib/types/shipping-config';
import { GHTKConfigForm } from '../forms/ghtk-config-form';
import { JNTConfigForm } from '../forms/jnt-config-form';
import { GHNConfigForm } from '../forms/ghn-config-form';
import { VTPConfigForm } from '../forms/vtp-config-form';

interface PartnerInfoTabProps {
  partnerCode: string;
  config: ShippingConfig;
  account?: PartnerAccount | undefined;
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
    case 'GHN':
      return <GHNConfigForm {...commonProps} />;
    
    case 'GHTK':
      return <GHTKConfigForm {...commonProps} />;
    
    case 'J&T':
      return <JNTConfigForm {...commonProps} />;
    
    case 'VTP':
      return <VTPConfigForm {...commonProps} />;
    
    default:
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Đối tác này chưa được hỗ trợ cấu hình
        </div>
      );
  }
}
