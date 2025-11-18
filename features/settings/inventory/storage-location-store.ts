import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StorageLocation } from './storage-location-types.ts';

interface StorageLocationStore {
  data: StorageLocation[];
  add: (location: Omit<StorageLocation, 'systemId' | 'createdAt' | 'updatedAt'>) => void;
  update: (systemId: string, location: Partial<StorageLocation>) => void;
  remove: (systemId: string) => void;
  findById: (id: string) => StorageLocation | undefined;
  getActive: () => StorageLocation[];
}

const initialData: StorageLocation[] = [
  {
    systemId: crypto.randomUUID(),
    id: 'KHO-A',
    name: 'Kho A',
    description: 'Kho chính',
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
];

export const useStorageLocationStore = create<StorageLocationStore>()(
  persist(
    (set, get) => ({
      data: initialData,

      add: (location) => {
        const newLocation: StorageLocation = {
          ...location,
          systemId: crypto.randomUUID(),
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

      getActive: () => {
        return get().data.filter((loc) => !loc.isDeleted && loc.isActive);
      },
    }),
    {
      name: 'storage-location-storage',
    }
  )
);
