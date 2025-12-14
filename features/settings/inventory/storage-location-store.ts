import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import type { StorageLocation } from './storage-location-types.ts';

interface StorageLocationStore {
  data: StorageLocation[];
  add: (location: Omit<StorageLocation, 'systemId' | 'createdAt' | 'updatedAt'>) => void;
  update: (systemId: SystemId, location: Partial<StorageLocation>) => void;
  remove: (systemId: SystemId) => void;
  findById: (id: BusinessId) => StorageLocation | undefined;
  findBySystemId: (systemId: SystemId) => StorageLocation | undefined;
  getActive: () => StorageLocation[];
}

const rawData = [
  {
    systemId: crypto.randomUUID(),
    id: 'KHO-A',
    name: 'Kho A',
    description: 'Kho chính',
    isDefault: true,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: crypto.randomUUID(),
    id: 'KHO-B',
    name: 'Kho B',
    description: 'Kho phụ',
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
] as const;

const initialData: StorageLocation[] = rawData.map((item) => ({
  ...item,
  systemId: asSystemId(item.systemId),
  id: asBusinessId(item.id),
}));

export const useStorageLocationStore = create<StorageLocationStore>()(
  persist(
    (set, get) => ({
      data: initialData,

      add: (location) => {
        const newLocation: StorageLocation = {
          ...location,
          systemId: asSystemId(crypto.randomUUID()),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ data: [...state.data, newLocation] }));
      },

      update: (systemId, updates) => {
        set((state) => ({
          data: state.data.map((loc) =>
            loc.systemId === systemId
              ? { ...loc, ...updates, updatedAt: new Date().toISOString() }
              : loc
          ),
        }));
      },

      remove: (systemId) => {
        set((state) => ({
          data: state.data.map((loc) =>
            loc.systemId === systemId
              ? { ...loc, isDeleted: true, updatedAt: new Date().toISOString() }
              : loc
          ),
        }));
      },

      findById: (id) => {
        return get().data.find((loc) => loc.id === id && !loc.isDeleted);
      },

      findBySystemId: (systemId) => {
        return get().data.find((loc) => loc.systemId === systemId && !loc.isDeleted);
      },

      getActive: () => {
        return get().data.filter((loc) => !loc.isDeleted && loc.isActive);
      },
    }),
    {
      name: 'storage-location-storage',
    }
  )
);
