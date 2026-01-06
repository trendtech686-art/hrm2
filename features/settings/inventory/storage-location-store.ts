import { create } from 'zustand';
import { asSystemId, asBusinessId as _asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import type { StorageLocation } from './storage-location-types';

interface StorageLocationStore {
  data: StorageLocation[];
  add: (location: Omit<StorageLocation, 'systemId' | 'createdAt' | 'updatedAt'>) => void;
  update: (systemId: SystemId, location: Partial<StorageLocation>) => void;
  remove: (systemId: SystemId) => void;
  findById: (id: BusinessId) => StorageLocation | undefined;
  findBySystemId: (systemId: SystemId) => StorageLocation | undefined;
  getActive: () => StorageLocation[];
}

// Seed data removed for production - use empty array
const initialData: StorageLocation[] = [];

export const useStorageLocationStore = create<StorageLocationStore>()(
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
    })
);
