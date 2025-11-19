import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asSystemId, asBusinessId, type SystemId } from '@/lib/id-types';
import type { ProductCategory } from './types';

const generateId = () => crypto.randomUUID();

// Helper to calculate path and level
const calculatePathAndLevel = (category: ProductCategory, allCategories: ProductCategory[]): { path: string; level: number } => {
  if (!category.parentId) {
    return { path: category.name, level: 0 };
  }
  
  const parent = allCategories.find(c => c.systemId === category.parentId);
  if (!parent) {
    return { path: category.name, level: 0 };
  }
  
  const parentInfo = calculatePathAndLevel(parent, allCategories);
  return {
    path: `${parentInfo.path} > ${category.name}`,
    level: parentInfo.level + 1
  };
};

interface ProductCategoryState {
  data: ProductCategory[];
  add: (category: Omit<ProductCategory, 'systemId' | 'path' | 'level'>) => ProductCategory;
  update: (systemId: SystemId, updates: Partial<ProductCategory>) => void;
  remove: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => ProductCategory | undefined;
  getActive: () => ProductCategory[];
  getByParent: (parentId?: SystemId) => ProductCategory[];
  updateSortOrder: (systemId: SystemId, newSortOrder: number) => void;
  moveCategory: (systemId: SystemId, newParentId: SystemId | undefined, newSortOrder: number) => void;
  recalculatePaths: () => void;
}

const rawData = [
  {
    systemId: generateId(),
    id: 'CAT001',
    name: 'Điện tử',
    description: 'Thiết bị điện tử',
    color: '#3b82f6',
    sortOrder: 1,
    path: 'Điện tử',
    level: 0,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: generateId(),
    id: 'CAT002',
    name: 'Thời trang',
    description: 'Quần áo, phụ kiện',
    color: '#ec4899',
    sortOrder: 2,
    path: 'Thời trang',
    level: 0,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: generateId(),
    id: 'CAT003',
    name: 'Gia dụng',
    description: 'Đồ gia dụng, nội thất',
    color: '#10b981',
    sortOrder: 3,
    path: 'Gia dụng',
    level: 0,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
] as const;

const initialData: ProductCategory[] = rawData.map((item) => ({
  ...item,
  systemId: asSystemId(item.systemId),
  id: asBusinessId(item.id),
}));

export const useProductCategoryStore = create<ProductCategoryState>()(
  persist(
    (set, get) => ({
      data: initialData,
      
      add: (category) => {
        const allData = get().data;
        const { path, level } = calculatePathAndLevel(
          { ...category, systemId: 'temp', path: '', level: 0 } as ProductCategory,
          allData
        );
        
        const newCategory: ProductCategory = {
          ...category,
          systemId: asSystemId(generateId()),
          path,
          level,
          createdAt: new Date().toISOString(),
          isDeleted: false,
          isActive: category.isActive !== undefined ? category.isActive : true,
        };
        set((state) => ({ data: [...state.data, newCategory] }));
        get().recalculatePaths();
        return newCategory;
      },
      
      update: (systemId, updates) => {
        set((state) => ({
          data: state.data.map((item) =>
            item.systemId === systemId
              ? { ...item, ...updates, updatedAt: new Date().toISOString() }
              : item
          ),
        }));
        get().recalculatePaths();
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
        return get().data.filter((item) => !item.isDeleted && item.isActive);
      },
      
      getByParent: (parentId) => {
        return get().data.filter(
          (item) => !item.isDeleted && item.isActive && item.parentId === parentId
        ).sort((a, b) => a.sortOrder - b.sortOrder);
      },

      updateSortOrder: (systemId, newSortOrder) => {
        set((state) => ({
          data: state.data.map((item) =>
            item.systemId === systemId
              ? { ...item, sortOrder: newSortOrder, updatedAt: new Date().toISOString() }
              : item
          ),
        }));
      },

      moveCategory: (systemId, newParentId, newSortOrder) => {
        set((state) => ({
          data: state.data.map((item) =>
            item.systemId === systemId
              ? { 
                  ...item, 
                  parentId: newParentId, 
                  sortOrder: newSortOrder,
                  updatedAt: new Date().toISOString() 
                }
              : item
          ),
        }));
        get().recalculatePaths();
      },

      recalculatePaths: () => {
        set((state) => {
          const allData = [...state.data];
          const updated = allData.map(cat => {
            if (cat.isDeleted) return cat;
            const { path, level } = calculatePathAndLevel(cat, allData);
            return { ...cat, path, level };
          });
          return { data: updated };
        });
      },
    }),
    {
      name: 'product-category-storage',
    }
  )
);
