import { create } from 'zustand';
// persist, createJSONStorage removed - database is now source of truth
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

const SYSTEM_FALLBACK_ID: SystemId = createSystemId('SYS000000');

const asSystemIdFallback = (): SystemId => SYSTEM_FALLBACK_ID;

// ✅ API Sync helper for store-factory
async function syncToAPI<T>(
  apiEndpoint: string,
  action: 'create' | 'update' | 'delete' | 'restore',
  data: T | { systemId: SystemId },
  systemId?: SystemId
): Promise<boolean> {
  try {
    const endpoint = action === 'create' 
      ? apiEndpoint 
      : `${apiEndpoint}/${systemId || (data as any).systemId}`;
    
    const method = action === 'create' ? 'POST' 
      : action === 'update' ? 'PATCH' 
      : action === 'delete' ? 'DELETE'
      : 'PATCH'; // restore uses PATCH
    
    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: action !== 'delete' ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      console.warn(`[Store Factory API] ${action} failed for ${apiEndpoint}:`, response.status);
    }
    return response.ok;
  } catch (error) {
    console.error(`[Store Factory API] ${action} error for ${apiEndpoint}:`, error);
    return false;
  }
}

// Item with SystemId (branded type)
export type ItemWithSystemId = { systemId: SystemId; [key: string]: any };

// ✅ Counter state for ID generation
export type CounterState = {
  systemId: number;
  businessId: number;
};

export type CrudState<T extends ItemWithSystemId> = {
  data: T[];
  _counters: CounterState; // ✅ Persisted counters
  _initialized: boolean; // ✅ Track if loaded from API
  add: (item: Omit<T, 'systemId'>) => T;
  addMultiple: (items: Omit<T, 'systemId'>[]) => void;
  update: (systemId: SystemId, item: Partial<T>) => void; // ✅ Accept partial updates
  remove: (systemId: SystemId) => void; // ✅ Branded type
  hardDelete: (systemId: SystemId) => void; // ✅ Branded type
  restore: (systemId: SystemId) => void; // ✅ Branded type
  findById: (systemId: SystemId | string) => T | undefined; // ✅ Branded type
  getActive: () => T[];
  getDeleted: () => T[];
  loadFromAPI: () => Promise<void>; // ✅ Load data from database
};

export const createCrudStore = <T extends ItemWithSystemId>(
  _initialData: T[], // @deprecated - Kept for backward compatibility but NO LONGER USED
  entityType: EntityType, // Changed from idPrefix to entityType
  options?: {
    businessIdField?: keyof T; // Field name for business ID (default: 'id')
    persistKey?: string; // @deprecated - No longer used, kept for backward compatibility
    getCurrentUser?: () => string | undefined; // Function to get current user systemId
    apiEndpoint?: string; // ✅ API endpoint for database sync (e.g., '/api/employees')
  }
) => {
  const businessPrefix = getPrefix(entityType); // Vietnamese prefix for Business ID (NV, KH, DH)
  const config = ID_CONFIG[entityType];
  const systemIdPrefix = config?.systemIdPrefix || entityType.toUpperCase(); // English prefix for SystemId (EMP, CUSTOMER, ORDER)
  
  const businessIdField = options?.businessIdField ?? 'id';
  // const persistKey = options?.persistKey; // @deprecated - No longer used
  const getCurrentUser = options?.getCurrentUser;
  const apiEndpoint = options?.apiEndpoint;

  // ✅ CHANGED: Start with empty array - database is source of truth
  // Mock data files (data.ts) are NO LONGER USED for runtime
  const normalizedInitialData: T[] = [];

  const storeConfig = (set: any, get: any) => ({
    data: normalizedInitialData, // ✅ Start empty - data loaded via React Query
    // ✅ Counters start at 0 - will be initialized from API via loadFromAPI()
    _counters: {
      systemId: 0,
      businessId: 0
    },
    _initialized: false, // ✅ Track API initialization
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
        
        // ✅ Sync to API in background
        if (apiEndpoint) {
          syncToAPI(apiEndpoint, 'create', newItem).catch(console.error);
        }
        
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
            const result = { 
              data: [...state.data, ...newItems],
              _counters: {
                systemId: currentSystemIdCounter,
                businessId: currentBusinessIdCounter
              }
            };
            
            // ✅ Sync to API in background (batch)
            if (apiEndpoint) {
              newItems.forEach(item => {
                syncToAPI(apiEndpoint, 'create', item).catch(console.error);
              });
            }
            
            return result;
        }),
    update: (systemId: SystemId, updatedItem: Partial<T>) => {
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
      
      // ✅ Sync to API in background
      if (apiEndpoint) {
        const fullItem = get().data.find((item: T) => item.systemId === systemId);
        if (fullItem) {
          syncToAPI(apiEndpoint, 'update', fullItem, systemId).catch(console.error);
        }
      }
    },
    remove: (systemId: SystemId) => {
      // Soft delete - mark as deleted
      const now = new Date().toISOString();
      set((state: any) => ({
        data: state.data.map((item: T) =>
          item.systemId === systemId
            ? { ...item, isDeleted: true, deletedAt: now } as T
            : item
        ),
      }));
      
      // ✅ Sync to API in background
      if (apiEndpoint) {
        const item = get().data.find((item: T) => item.systemId === systemId);
        if (item) {
          syncToAPI(apiEndpoint, 'update', { ...item, isDeleted: true, deletedAt: now }, systemId).catch(console.error);
        }
      }
    },
    hardDelete: (systemId: SystemId) => {
      // Permanent delete - remove from array
      set((state: any) => ({
        data: state.data.filter((item: T) => item.systemId !== systemId),
      }));
      
      // ✅ Sync to API in background
      if (apiEndpoint) {
        syncToAPI(apiEndpoint, 'delete', { systemId }, systemId).catch(console.error);
      }
    },
    restore: (systemId: SystemId) => {
      // Restore soft-deleted item
      set((state: any) => ({
        data: state.data.map((item: T) =>
          item.systemId === systemId
            ? { ...item, isDeleted: false, deletedAt: null } as T
            : item
        ),
      }));
      
      // ✅ Sync to API in background
      if (apiEndpoint) {
        const item = get().data.find((item: T) => item.systemId === systemId);
        if (item) {
          syncToAPI(apiEndpoint, 'restore', { ...item, isDeleted: false, deletedAt: null }, systemId).catch(console.error);
        }
      }
    },
    getActive: () => get().data.filter((item: any) => !item.isDeleted),
    getDeleted: () => get().data.filter((item: any) => item.isDeleted),
    findById: (id: SystemId | string) => get().data.find((item: T) => item.systemId === id || (item as any).id === id),
    
    // ✅ Load data from database API - OPTIMIZED: No more limit=10000!
    // This is now only used for counter initialization, NOT for loading all data
    // Use React Query hooks for data fetching with proper pagination
    loadFromAPI: async () => {
      if (!apiEndpoint) return;
      if (get()._initialized) return;
      
      try {
        // Only fetch minimal data needed to initialize counters
        // Actual data loading should be done via React Query hooks
        const response = await fetch(`${apiEndpoint}?limit=1&sortBy=systemId&sortOrder=desc`, {
          credentials: 'include',
        });
        if (response.ok) {
          const json = await response.json();
          const pagination = json.pagination || {};
          const lastItem = json.data?.[0];
          
          // Initialize counters from the latest item (highest IDs)
          const newCounters = {
            systemId: lastItem ? getMaxSystemIdCounter([lastItem], systemIdPrefix) : 0,
            businessId: (lastItem && options?.businessIdField)
              ? getMaxBusinessIdCounter([lastItem] as any[], businessPrefix)
              : 0
          };
          
          set({ 
            data: [], // Don't store data in Zustand anymore - use React Query
            _counters: newCounters,
            _initialized: true 
          });
          
          console.log(`[Store Factory] ${apiEndpoint} initialized. Total records: ${pagination.total || 'unknown'}`);
        }
      } catch (error) {
        console.error(`[Store Factory] loadFromAPI error for ${apiEndpoint}:`, error);
        // Still mark as initialized to prevent infinite retry
        set({ _initialized: true });
      }
    },
  });

  // ✅ SIMPLIFIED: No localStorage persistence, database is source of truth
  // Data is loaded via ApiSyncProvider on app init
  return create<CrudState<T>>(storeConfig);
};
