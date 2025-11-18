import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductType } from './types';

const generateId = () => crypto.randomUUID();

interface ProductTypeState {
  data: ProductType[];
  add: (productType: Omit<ProductType, 'systemId'>) => ProductType;
  update: (systemId: string, updates: Partial<ProductType>) => void;
  remove: (systemId: string) => void;
  findById: (systemId: string) => ProductType | undefined;
  getActive: () => ProductType[];
}

const initialData: ProductType[] = [
  {
    systemId: generateId(),
    id: 'PT001',
    name: 'Hàng hóa',
    description: 'Sản phẩm vật lý có tồn kho',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    systemId: generateId(),
    id: 'PT002',
    name: 'Dịch vụ',
    description: 'Dịch vụ không có tồn kho',
    createdAt: new Date().toISOString(),
  },
  {
    systemId: generateId(),
    id: 'PT003',
    name: 'Digital',
    description: 'Sản phẩm số (ebook, khóa học online...)',
    createdAt: new Date().toISOString(),
  },
];

export const useProductTypeStore = create<ProductTypeState>()(
  persist(
    (set, get) => ({
      data: initialData,
      
      add: (productType) => {
        const newProductType: ProductType = {
          ...productType,
          systemId: generateId(),
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
        return get().data.filter((item) => !item.isDeleted);
      },
    }),
    {
      name: 'product-type-storage',
    }
  )
);
