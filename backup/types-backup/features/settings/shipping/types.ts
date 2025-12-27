import type { ReactNode } from 'react';
import type { SystemId } from '@/lib/id-types';

export type ShippingPartnerStatus = 'Đang hợp tác' | 'Ngừng hợp tác';

export type ShippingService = {
  systemId?: SystemId | undefined;
  id: string;
  name: string;
};

export type CredentialField = {
    id: keyof ShippingPartner['credentials'];
    label: string;
    placeholder: string;
    required: boolean;
    type?: 'text' | 'password' | 'email' | undefined;
};

export type AdditionalService = {
  systemId?: SystemId | undefined;
  id: string;
  label: string;
  tooltip?: string | undefined;
  type?: 'checkbox' | 'radio' | 'select' | 'text' | 'number' | 'date' | undefined;
  options?: (string | { label: string; value: string })[] | undefined;
  placeholder?: string | undefined;
  buttonLabel?: string | undefined;
  disabled?: boolean | undefined;
  gridSpan?: 1 | 2 | undefined;
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
  contactPerson?: string | undefined;
  status: ShippingPartnerStatus;
  services: ShippingService[];
  isConnected: boolean;
  
  // Dynamic fields for connection
  config: PartnerConfiguration;
  credentials: Record<string, any>;
  configuration: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};
