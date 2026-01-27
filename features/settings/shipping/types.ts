// Re-export shipping types from central prisma-extended
export type {
  ShippingPartnerStatus,
  ShippingService,
  CredentialField,
  AdditionalService,
  PartnerConfiguration,
  ShippingPartner,
} from '@/lib/types/prisma-extended';

// Shipping settings type (migrated from store)
export type ShippingSettings = {
  weightSource: 'product' | 'custom';
  customWeight: number;
  weightUnit: 'gram' | 'kilogram';
  length: number;
  width: number;
  height: number;
  deliveryRequirement: string;
  shippingNote: string;
  autoSyncStatus: boolean;
  autoCancelOrder: boolean;
  autoSyncCod: boolean;
  latePickupWarningDays: number;
  lateDeliveryWarningDays: number;
};
