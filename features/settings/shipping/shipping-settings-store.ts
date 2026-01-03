import { create } from 'zustand';

export type ShippingSettings = {
    weightSource: 'product' | 'custom';
    customWeight: number;
    weightUnit: 'gram' | 'kilogram'; // Đơn vị khối lượng
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

const defaultSettings: ShippingSettings = {
    weightSource: 'product',
    customWeight: 100, // default to 100g
    weightUnit: 'gram', // Mặc định là gram
    length: 10,
    width: 10,
    height: 10,
    deliveryRequirement: 'CHOXEMHANGKHONGTHU',
    shippingNote: '',
    autoSyncStatus: true,
    autoCancelOrder: false,
    autoSyncCod: true,
    latePickupWarningDays: 1,
    lateDeliveryWarningDays: 1,
};


type ShippingSettingsState = {
  settings: ShippingSettings;
  setSettings: (newSettings: Partial<ShippingSettings>) => void;
};

export const useShippingSettingsStore = create<ShippingSettingsState>()(
    (set) => ({
      settings: defaultSettings,
      setSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings }})),
    })
);
