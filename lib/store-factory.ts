import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  generateSystemId, 
  generateBusinessId, 
  isBusinessIdUnique,
  getMaxSystemIdCounter,
  getMaxBusinessIdCounter,
  findNextAvailableBusinessId,
  type EntityType 
} from './id-utils';
import { getPrefix } from './smart-prefix';
import { ID_CONFIG, type SystemId, type BusinessId, createSystemId, createBusinessId as brandBusinessId } from './id-config';

// Item with SystemId (branded type)
type ItemWithSystemId = { systemId: SystemId; [key: string]: any };

// ✅ Counter state for ID generation
export type CounterState = {
  systemId: number;
  businessId: number;
};

export type CrudState<T extends ItemWithSystemId> = {
  data: T[];
  _counters: CounterState; // ✅ Persisted counters
  add: (item: Omit<T, 'systemId'>) => T;
  addMultiple: (items: Omit<T, 'systemId'>[]) => void;
  update: (systemId: SystemId, item: T) => void; // ✅ Branded type
  remove: (systemId: SystemId) => void; // ✅ Branded type
  hardDelete: (systemId: SystemId) => void; // ✅ Branded type
  restore: (systemId: SystemId) => void; // ✅ Branded type
  findById: (systemId: SystemId) => T | undefined; // ✅ Branded type
  getActive: () => T[];
  getDeleted: () => T[];
};

export const createCrudStore = <T extends ItemWithSystemId>(
  initialData: T[],
  entityType: EntityType, // Changed from idPrefix to entityType
  options?: {
    businessIdField?: keyof T; // Field name for business ID (default: 'id')
    persistKey?: string; // Key for localStorage persistence (e.g., 'hrm-employees')
    getCurrentUser?: () => string | undefined; // Function to get current user systemId
  }
) => {
  const businessPrefix = getPrefix(entityType); // Vietnamese prefix for Business ID (NV, KH, DH)
  const config = ID_CONFIG[entityType];
  const systemIdPrefix = config?.systemIdPrefix || entityType.toUpperCase(); // English prefix for SystemId (EMP, CUSTOMER, ORDER)
  
  const businessIdField = options?.businessIdField ?? 'id';
  const persistKey = options?.persistKey;
  const getCurrentUser = options?.getCurrentUser;

  const storeConfig = (set: any, get: any) => ({
    data: initialData,
    // ✅ Persist counters in state (will be saved to localStorage)
    _counters: {
      systemId: getMaxSystemIdCounter(initialData, systemIdPrefix),
      businessId: options?.businessIdField 
        ? getMaxBusinessIdCounter(initialData as any[], businessPrefix)
        : 0
    },
    add: (item: Omit<T, 'systemId'>): T => {
        // ✅ Get counters from state (persisted)
        const currentCounters = get()._counters;
        const newSystemIdCounter = currentCounters.systemId + 1;
        const newSystemId = createSystemId(generateSystemId(entityType, newSystemIdCounter));
        
        // Generate or validate Business ID (if field exists)
        let finalItem = { ...item } as any;
        let newBusinessIdCounter = currentCounters.businessId;
        
        if (businessIdField in item) {
          const customId = (item as any)[businessIdField];
          const existingIds = get().data.map((d: any) => d[businessIdField]);
          
          // ✅ If customId provided, validate uniqueness
          if (customId && customId.trim()) {
            if (!isBusinessIdUnique(customId, existingIds)) {
              throw new Error(`Mã "${customId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
            }
            finalItem[businessIdField] = customId.trim().toUpperCase();
          } else {
            // ✅ Auto-generate with findNextAvailableBusinessId
            const digitCount = 6; // All entities use 6 digits
            const result = findNextAvailableBusinessId(businessPrefix, existingIds, newBusinessIdCounter, digitCount);
            finalItem[businessIdField] = result.nextId;
            newBusinessIdCounter = result.updatedCounter;
          }
        }
        
        const now = new Date().toISOString();
        const currentUser = getCurrentUser?.();
        const newItem = { 
          ...finalItem, 
          systemId: newSystemId, // ✅ Branded SystemId
          createdAt: finalItem.createdAt || now,
          updatedAt: now,
          createdBy: finalItem.createdBy || currentUser,
          updatedBy: currentUser,
        } as unknown as T;
        
        // ✅ Update both data and counters atomically
        set((state: any) => ({ 
          data: [...state.data, newItem],
          _counters: {
            systemId: newSystemIdCounter,
            businessId: newBusinessIdCounter
          }
        }));
        return newItem;
    },
    addMultiple: (items: Omit<T, 'systemId'>[]) => 
        set((state: any) => {
            const now = new Date().toISOString();
            const currentUser = getCurrentUser?.();
            const newItems: T[] = [];
            const digitCount = 6; // All entities use 6 digits
            
            // ✅ Start from current counters
            let currentSystemIdCounter = state._counters.systemId;
            let currentBusinessIdCounter = state._counters.businessId;
            
            items.forEach(item => {
                // ✅ Generate SystemId from current counter
                currentSystemIdCounter++;
                const newSystemId = createSystemId(generateSystemId(entityType, currentSystemIdCounter));
                
                // Generate or validate Business ID (if field exists)
                let finalItem = { ...item } as any;
                if (businessIdField in item) {
                  const customId = (item as any)[businessIdField];
                  
                  // Collect existing IDs (from state + already added in this batch)
                  const existingIds = [
                    ...state.data.map((d: any) => d[businessIdField]),
                    ...newItems.map((d: any) => d[businessIdField])
                  ];
                  
                  // ✅ If customId provided, validate uniqueness
                  if (customId && customId.trim()) {
                    if (!isBusinessIdUnique(customId, existingIds)) {
                      throw new Error(`Mã "${customId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                    }
                    finalItem[businessIdField] = customId.trim().toUpperCase();
                  } else {
                    // ✅ Auto-generate with findNextAvailableBusinessId
                    const result = findNextAvailableBusinessId(businessPrefix, existingIds, currentBusinessIdCounter, digitCount);
                    finalItem[businessIdField] = result.nextId;
                    currentBusinessIdCounter = result.updatedCounter;
                  }
                }
                
                newItems.push({ 
                  ...finalItem, 
                  systemId: newSystemId,
                  createdAt: now,
                  updatedAt: now,
                  createdBy: currentUser,
                  updatedBy: currentUser,
                } as unknown as T);
            });
            
            // ✅ Update both data and counters
            return { 
              data: [...state.data, ...newItems],
              _counters: {
                systemId: currentSystemIdCounter,
                businessId: currentBusinessIdCounter
              }
            };
        }),
    update: (systemId: string, updatedItem: T) => {
      // Validate unique business ID (case-insensitive, skip self)
      if (businessIdField in updatedItem) {
        const businessId = (updatedItem as any)[businessIdField];
        const existingIds = get().data
          .filter((d: any) => d.systemId !== systemId)
          .map((d: any) => d[businessIdField]);
        
        if (businessId && !isBusinessIdUnique(businessId, existingIds)) {
          throw new Error(`Mã "${businessId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
        }
      }

      const now = new Date().toISOString();
      const currentUser = getCurrentUser?.();
      set((state: any) => ({
        data: state.data.map((item: T) =>
          item.systemId === systemId 
            ? { ...item, ...updatedItem, updatedAt: now, updatedBy: currentUser } as T
            : item
        ),
      }));
    },
    remove: (systemId: string) => {
      // Soft delete - mark as deleted
      const now = new Date().toISOString();
      set((state: any) => ({
        data: state.data.map((item: T) =>
          item.systemId === systemId
            ? { ...item, isDeleted: true, deletedAt: now } as T
            : item
        ),
      }));
    },
    hardDelete: (systemId: string) =>
      // Permanent delete - remove from array
      set((state: any) => ({
        data: state.data.filter((item: T) => item.systemId !== systemId),
      })),
    restore: (systemId: string) => {
      // Restore soft-deleted item
      set((state: any) => ({
        data: state.data.map((item: T) =>
          item.systemId === systemId
            ? { ...item, isDeleted: false, deletedAt: null } as T
            : item
        ),
      }));
    },
    getActive: () => get().data.filter((item: any) => !item.isDeleted),
    getDeleted: () => get().data.filter((item: any) => item.isDeleted),
    findById: (id: string) => get().data.find((item: T) => item.systemId === id || (item as any).id === id),
  });

  // Return with or without persistence
  if (persistKey) {
    return create<CrudState<T>>()(
      persist(
        storeConfig,
        {
          name: persistKey,
          storage: createJSONStorage(() => localStorage),
          // ✅ Migration: Add _counters for old data
          migrate: (persistedState: any, version: number) => {
            if (!persistedState || !persistedState.data) {
              return { 
                data: initialData,
                _counters: {
                  systemId: getMaxSystemIdCounter(initialData, systemIdPrefix),
                  businessId: options?.businessIdField 
                    ? getMaxBusinessIdCounter(initialData as any[], businessPrefix)
                    : 0
                }
              };
            }
            
            // ✅ If old version without _counters, compute and add
            if (!persistedState._counters) {
              console.warn(`[${persistKey}] Migrating to version ${version}: adding _counters`);
              const systemIdCounter = getMaxSystemIdCounter(persistedState.data, systemIdPrefix);
              const businessIdCounter = options?.businessIdField
                ? getMaxBusinessIdCounter(persistedState.data as any[], businessPrefix)
                : 0;
              
              return {
                ...persistedState,
                _counters: {
                  systemId: systemIdCounter,
                  businessId: businessIdCounter
                }
              };
            }
            
            return persistedState;
          },
          version: 2, // ✅ Bump version to trigger migration
        }
      )
    );
  }

  return create<CrudState<T>>(storeConfig);
};
