import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asSystemId, asBusinessId, type SystemId } from '@/lib/id-types';
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

const rawData = [
  {
    systemId: generateId(),
    id: 'PT001',
    name: 'Hàng hóa',
    description: 'Sản phẩm vật lý có tồn kho',
    isDefault: true,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    systemId: generateId(),
    id: 'PT002',
    name: 'Dịch vụ',
    description: 'Dịch vụ không có tồn kho',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    systemId: generateId(),
    id: 'PT003',
    name: 'Digital',
    description: 'Sản phẩm số (ebook, khóa học online...)',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
] as const;

const initialData: ProductType[] = rawData.map((item) => ({
  ...item,
  systemId: asSystemId(item.systemId),
  id: asBusinessId(item.id),
}));

export const useProductTypeStore = create<ProductTypeState>()(
  persist(
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
    }),
    {
      name: 'product-type-storage',
    }
  )
);
