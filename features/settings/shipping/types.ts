import type { ReactNode } from 'react';
import type { SystemId } from '@/lib/id-types';

export type ShippingPartnerStatus = 'Đang hợp tác' | 'Ngừng hợp tác';

export type ShippingService = {
  systemId?: SystemId;
  id: string;
  name: string;
};

export type CredentialField = {
    id: keyof ShippingPartner['credentials'];
    label: string;
    placeholder: string;
    required: boolean;
    type?: 'text' | 'password' | 'email';
};

export type AdditionalService = {
  systemId?: SystemId;
  id: string;
  label: string;
  tooltip?: string;
  type?: 'checkbox' | 'radio' | 'select' | 'text' | 'number' | 'date';
  options?: (string | { label: string; value: string })[];
  placeholder?: string;
  buttonLabel?: string;
  disabled?: boolean;
  gridSpan?: 1 | 2;
};

export type PartnerConfiguration = {
  credentialFields: CredentialField[];
  payerOptions: ('shop' | 'customer')[];
  additionalServices: AdditionalService[];
};

export type ShippingPartner = {
  systemId: SystemId;
  id: string; // e.g., "GHN", "VTP"
  name: string;
  logoUrl: string;
  description: string;
  phone: string;
  address: string;
  contactPerson?: string;
  status: ShippingPartnerStatus;
  services: ShippingService[];
  isConnected: boolean;
  
  // Dynamic fields for connection
  config: PartnerConfiguration;
  credentials: Record<string, any>;
  configuration: Record<string, any>;
};
