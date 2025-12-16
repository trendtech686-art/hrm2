import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import type { ProductCategory } from './types';

const generateSystemId = (counter: number): SystemId => {
  return asSystemId(`CATEGORY${String(counter + 1).padStart(6, '0')}`);
};

const generateBusinessId = (counter: number): BusinessId => {
  return asBusinessId(`DM${String(counter + 1).padStart(6, '0')}`);
};

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
  counter: number;
  add: (category: Omit<ProductCategory, 'systemId' | 'id' | 'path' | 'level'> & { id?: string }) => ProductCategory;
  update: (systemId: SystemId, updates: Partial<ProductCategory>) => void;
  remove: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => ProductCategory | undefined;
  findByBusinessId: (id: BusinessId) => ProductCategory | undefined;
  getActive: () => ProductCategory[];
  getByParent: (parentId?: SystemId) => ProductCategory[];
  updateSortOrder: (systemId: SystemId, newSortOrder: number) => void;
  moveCategory: (systemId: SystemId, newParentId: SystemId | undefined, newSortOrder: number) => void;
  recalculatePaths: () => void;
  getNextId: () => BusinessId;
  isBusinessIdExists: (id: string) => boolean;
}

const rawData = [
  // Level 0 - Root categories
  {
    systemId: 'CATEGORY000001',
    id: 'DM000001',
    name: 'Điện tử',
    description: 'Thiết bị điện tử, phụ kiện điện thoại',
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
    systemId: 'CATEGORY000002',
    id: 'DM000002',
    name: 'Phụ kiện điện thoại',
    description: 'Ốp lưng, cường lực, sạc cáp',
    color: '#6366f1',
    sortOrder: 1,
    parentId: 'CATEGORY000001',
    path: 'Điện tử > Phụ kiện điện thoại',
    level: 1,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CATEGORY000003',
    id: 'DM000003',
    name: 'Ốp lưng',
    description: 'Ốp lưng các loại',
    color: '#8b5cf6',
    sortOrder: 1,
    parentId: 'CATEGORY000002',
    path: 'Điện tử > Phụ kiện điện thoại > Ốp lưng',
    level: 2,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CATEGORY000004',
    id: 'DM000004',
    name: 'Cường lực',
    description: 'Kính cường lực, dán màn hình',
    color: '#a855f7',
    sortOrder: 2,
    parentId: 'CATEGORY000002',
    path: 'Điện tử > Phụ kiện điện thoại > Cường lực',
    level: 2,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CATEGORY000005',
    id: 'DM000005',
    name: 'Sạc & Cáp',
    description: 'Củ sạc, dây cáp các loại',
    color: '#c084fc',
    sortOrder: 3,
    parentId: 'CATEGORY000002',
    path: 'Điện tử > Phụ kiện điện thoại > Sạc & Cáp',
    level: 2,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CATEGORY000006',
    id: 'DM000006',
    name: 'Tai nghe',
    description: 'Tai nghe có dây, bluetooth',
    color: '#22d3ee',
    sortOrder: 2,
    parentId: 'CATEGORY000001',
    path: 'Điện tử > Tai nghe',
    level: 1,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CATEGORY000007',
    id: 'DM000007',
    name: 'Tai nghe Bluetooth',
    description: 'Airpods, TWS các loại',
    color: '#06b6d4',
    sortOrder: 1,
    parentId: 'CATEGORY000006',
    path: 'Điện tử > Tai nghe > Tai nghe Bluetooth',
    level: 2,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CATEGORY000008',
    id: 'DM000008',
    name: 'Tai nghe có dây',
    description: 'Tai nghe jack 3.5mm, Type-C',
    color: '#14b8a6',
    sortOrder: 2,
    parentId: 'CATEGORY000006',
    path: 'Điện tử > Tai nghe > Tai nghe có dây',
    level: 2,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CATEGORY000009',
    id: 'DM000009',
    name: 'Loa & Âm thanh',
    description: 'Loa bluetooth, soundbar',
    color: '#10b981',
    sortOrder: 3,
    parentId: 'CATEGORY000001',
    path: 'Điện tử > Loa & Âm thanh',
    level: 1,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Level 0 - Thời trang
  {
    systemId: 'CATEGORY000010',
    id: 'DM000010',
    name: 'Thời trang',
    description: 'Quần áo, giày dép, phụ kiện',
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
    systemId: 'CATEGORY000011',
    id: 'DM000011',
    name: 'Đồng hồ',
    description: 'Đồng hồ nam, nữ, smartwatch',
    color: '#f472b6',
    sortOrder: 1,
    parentId: 'CATEGORY000010',
    path: 'Thời trang > Đồng hồ',
    level: 1,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CATEGORY000012',
    id: 'DM000012',
    name: 'Túi xách',
    description: 'Túi xách, balo',
    color: '#f9a8d4',
    sortOrder: 2,
    parentId: 'CATEGORY000010',
    path: 'Thời trang > Túi xách',
    level: 1,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Level 0 - Gia dụng
  {
    systemId: 'CATEGORY000013',
    id: 'DM000013',
    name: 'Gia dụng',
    description: 'Đồ gia dụng, nội thất',
    color: '#f97316',
    sortOrder: 3,
    path: 'Gia dụng',
    level: 0,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CATEGORY000014',
    id: 'DM000014',
    name: 'Đèn chiếu sáng',
    description: 'Đèn bàn, đèn LED',
    color: '#fb923c',
    sortOrder: 1,
    parentId: 'CATEGORY000013',
    path: 'Gia dụng > Đèn chiếu sáng',
    level: 1,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CATEGORY000015',
    id: 'DM000015',
    name: 'Quạt',
    description: 'Quạt mini, quạt bàn',
    color: '#fdba74',
    sortOrder: 2,
    parentId: 'CATEGORY000013',
    path: 'Gia dụng > Quạt',
    level: 1,
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
  parentId: 'parentId' in item && item.parentId ? asSystemId(item.parentId) : undefined,
}));

const INITIAL_COUNTER = rawData.length;

export const useProductCategoryStore = create<ProductCategoryState>()(
  persist(
    (set, get) => ({
      data: initialData,
      counter: INITIAL_COUNTER,
      
      add: (category) => {
        const currentCounter = get().counter;
        const allData = get().data;
        const { id, ...rest } = category;
        
        const businessId = id && id.trim() 
          ? asBusinessId(id.trim())
          : generateBusinessId(currentCounter);
        
        const { path, level } = calculatePathAndLevel(
          { ...rest, systemId: 'temp' as SystemId, id: businessId, path: '', level: 0 } as ProductCategory,
          allData
        );
        
        const newCategory: ProductCategory = {
          ...rest,
          systemId: generateSystemId(currentCounter),
          id: businessId,
          path,
          level,
          createdAt: new Date().toISOString(),
          isDeleted: false,
          isActive: category.isActive !== undefined ? category.isActive : true,
        };
        set((state) => ({ 
          data: [...state.data, newCategory],
          counter: state.counter + 1,
        }));
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
      
      findByBusinessId: (id) => {
        return get().data.find((item) => item.id === id && !item.isDeleted);
      },
      
      getActive: () => {
        return get().data.filter((item) => !item.isDeleted && item.isActive);
      },
      
      getByParent: (parentId) => {
        return get().data.filter(
          (item) => !item.isDeleted && item.isActive && item.parentId === parentId
        ).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
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
      
      getNextId: () => generateBusinessId(get().counter),
      
      isBusinessIdExists: (id: string) => get().data.some((item) => String(item.id) === id),
    }),
    {
      name: 'product-category-storage',
    }
  )
);
