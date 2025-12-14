import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { asSystemId, type SystemId } from '@/lib/id-types';
import type { Brand } from './types';

interface BrandState {
  data: Brand[];
  add: (brand: Omit<Brand, 'systemId' | 'createdAt' | 'updatedAt'>) => void;
  update: (systemId: SystemId, brand: Partial<Brand>) => void;
  remove: (systemId: SystemId) => void;
  getActive: () => Brand[];
  findById: (systemId: SystemId) => Brand | undefined;
}

export const useBrandStore = create<BrandState>()(
  persist(
    (set, get) => ({
      data: [],
      
      add: (brand) => set((state) => ({
        data: [
          ...state.data,
          {
            ...brand,
            systemId: asSystemId(nanoid()),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: brand.isActive ?? true,
            isDeleted: false,
          },
        ],
      })),
      
      update: (systemId, brand) => set((state) => ({
        data: state.data.map((item) =>
          item.systemId === systemId
            ? { ...item, ...brand, updatedAt: new Date().toISOString() }
            : item
        ),
      })),
      
      remove: (systemId) => set((state) => ({
        data: state.data.map((item) =>
          item.systemId === systemId
            ? { ...item, isDeleted: true, updatedAt: new Date().toISOString() }
            : item
        ),
      })),
      
      getActive: () => get().data.filter((item) => !item.isDeleted && item.isActive),
      
      findById: (systemId) => get().data.find((item) => item.systemId === systemId),
    }),
    {
      name: 'brand-storage',
    }
  )
);
