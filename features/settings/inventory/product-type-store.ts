import { create } from 'zustand';
import { asSystemId, asBusinessId as _asBusinessId, type SystemId } from '@/lib/id-types';
import type { ProductType } from './types';

const generateId = () => crypto.randomUUID();

interface ProductTypeState {
  data: ProductType[];
  add: (productType: Omit<ProductType, 'systemId'>) => ProductType;
  update: (systemId: SystemId, updates: Partial<ProductType>) => void;
  remove: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => ProductType | undefined;
  getActive: () => ProductType[];
}

// Seed data removed for production - use empty array
const initialData: ProductType[] = [];

export const useProductTypeStore = create<ProductTypeState>()(
  (set, get) => ({
      data: initialData,
      
      add: (productType) => {
        const newProductType: ProductType = {
          ...productType,
          systemId: asSystemId(generateId()),
          createdAt: new Date().toISOString(),
          isDeleted: false,
        };
        set((state) => ({ data: [...state.data, newProductType] }));
        return newProductType;
      },
      
      update: (systemId, updates) => {
        set((state) => ({
          data: state.data.map((item) =>
            item.systemId === systemId
              ? { ...item, ...updates, updatedAt: new Date().toISOString() }
              : item
          ),
        }));
      },
      
      remove: (systemId) => {
        set((state) => ({
          data: state.data.map((item) =>
            item.systemId === systemId
              ? { ...item, isDeleted: true, updatedAt: new Date().toISOString() }
              : item
          ),
        }));
      },
      
      findById: (systemId) => {
        return get().data.find((item) => item.systemId === systemId && !item.isDeleted);
      },
      
      getActive: () => {
        return get().data.filter((item) => !item.isDeleted && item.isActive !== false);
      },
    })
);
