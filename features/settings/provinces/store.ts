/**
 * @deprecated Use React Query hooks instead:
 * - `useProvinces()` for provinces
 * - `useDistricts()` for districts
 * - `useWards()` for wards
 * 
 * Import from: `@/features/settings/provinces/hooks/use-provinces`
 * or `@/features/settings/provinces/hooks/use-administrative-units`
 * 
 * This store will be removed in a future version.
 */
import { create } from 'zustand';
import { type SystemId, type BusinessId } from '@/lib/id-types';
import { createCrudStore } from '../../../lib/store-factory';
import { getCurrentUserSystemId } from '../../../contexts/auth-context';
import type { Province, District, Ward } from '@/lib/types/prisma-extended';

// Data is now loaded from API/database instead of static files
const API_BASE = '/api/administrative-units';

// Initialize with empty arrays - data will be loaded from API
const normalizedProvinces: Province[] = [];
const normalizedDistricts: District[] = [];
const normalizedWards: Ward[] = [];

// Track loading state across all data types
let dataLoadedState = {
  provinces: false,
  districts: false,
  wards: false,
};

const provinceBaseStore = createCrudStore<Province>(normalizedProvinces, 'provinces', {
  businessIdField: 'id',
  getCurrentUser: getCurrentUserSystemId,
});

const districtBaseStore = createCrudStore<District>(normalizedDistricts, 'districts', {
  getCurrentUser: getCurrentUserSystemId,
});

const wardBaseStore = createCrudStore<Ward>(normalizedWards, 'wards', {
  getCurrentUser: getCurrentUserSystemId,
});

export type AdministrativeImportPayload = {
  provinces: Array<Omit<Province, 'systemId'>>;
  wards: Array<Omit<Ward, 'systemId'>>;
};

function resetProvinceData(next: Array<Omit<Province, 'systemId'>>) {
  provinceBaseStore.setState((state) => ({
    ...state,
    data: [],
    _counters: { systemId: 0, businessId: 0 },
  }));

  if (next.length) {
    provinceBaseStore.getState().addMultiple(next);
  }
}

function replaceTwoLevelWards(next: Array<Omit<Ward, 'systemId'>>) {
  const retained = wardBaseStore.getState().data.filter((ward) => ward.level !== '2-level');

  wardBaseStore.setState((state) => ({
    ...state,
    data: retained,
  }));

  if (next.length) {
    const sanitized = next.map((ward) => ({
      ...ward,
      level: '2-level' as const,
    }));

    wardBaseStore.getState().addMultiple(sanitized);
  }
}

function applyAdministrativeImport(payload: AdministrativeImportPayload) {
  resetProvinceData(payload.provinces);
  replaceTwoLevelWards(payload.wards);
}

type AdministrativeUnitState = {
  data: Province[];
  wards: Ward[];
  districts: District[];
  // 3-level static data (63 provinces)
  provinces3Level: Province[];
  districts3Level: District[];
  wards3Level: Ward[];
  isLoading: boolean;
  isLoaded: boolean;
  loadData: () => Promise<void>;
  add: (province: Omit<Province, 'systemId'>) => Province;
  addMultiple: (provinces: Omit<Province, 'systemId'>[]) => void;
  update: (systemId: SystemId, province: Province) => void;
  remove: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => Province | undefined;
  addWard: (ward: Omit<Ward, 'systemId'>) => void;
  updateWard: (systemId: SystemId, ward: Ward) => void;
  removeWard: (systemId: SystemId) => void;
  addDistrict: (district: Omit<District, 'systemId'>) => void;
  updateDistrict: (systemId: SystemId, district: District) => void;
  removeDistrict: (systemId: SystemId) => void;
  // 2-level methods (34 provinces - from API)
  getProvinces2Level: () => Province[];
  getWards2Level: () => Ward[];
  getWards2LevelByProvinceId: (provinceId: BusinessId) => Ward[];
  // 3-level methods (63 provinces - from static data)
  getProvinces3Level: () => Province[];
  getWards3Level: () => Ward[];
  getWards3LevelByProvinceId: (provinceId: BusinessId) => Ward[];
  getWards3LevelByDistrictId: (districtId: number) => Ward[];
  getDistricts3LevelByProvinceId: (provinceId: BusinessId) => District[];
  // Generic methods
  getWardsByProvinceId: (provinceId: BusinessId) => Ward[];
  getDistrictsByProvinceId: (provinceId: BusinessId) => District[];
  getWardsByDistrictId: (districtId: number) => Ward[];
  getDistrictById: (districtId: number) => District | undefined;
  getProvinceById: (provinceId: BusinessId) => Province | undefined;
  getWardById: (wardId: string) => Ward | undefined;
  importAdministrativeUnits: (payload: AdministrativeImportPayload) => void;
};

// Track loading state
let loadingPromise: Promise<void> | null = null;

export const useProvinceStore = create<AdministrativeUnitState>()((set, get) => {
  provinceBaseStore.subscribe(
    (state) => set({ data: state.data })
  );

  districtBaseStore.subscribe(
    (state) => set({ districts: state.data })
  );

  wardBaseStore.subscribe(
    (state) => set({ wards: state.data })
  );

  return {
    data: provinceBaseStore.getState().data,
    districts: districtBaseStore.getState().data,
    wards: wardBaseStore.getState().data,
    // 3-level data (63 provinces) - now loaded from database
    provinces3Level: [],
    districts3Level: [],
    wards3Level: [],
    isLoading: false,
    isLoaded: false,
    
    // Load data from API (database) for both 2-level and 3-level
    loadData: async () => {
      // Return existing promise if already loading
      if (loadingPromise) return loadingPromise;
      
      // Skip if already loaded
      if (dataLoadedState.provinces && dataLoadedState.districts && dataLoadedState.wards) {
        set({ isLoaded: true });
        return;
      }
      
      set({ isLoading: true });
      
      loadingPromise = (async () => {
        try {
          // Skip if running on server (no API available during SSR)
          if (typeof window === 'undefined') {
            set({ isLoading: false });
            return;
          }

          // Fetch all data from API in parallel (both 2-level and 3-level)
          const [provincesRes, districtsRes, wardsRes] = await Promise.all([
            fetch(`${API_BASE}/provinces`),
            fetch(`${API_BASE}/districts`),
            // Fetch wards with large limit to get all
            fetch(`${API_BASE}/wards?limit=20000`),
          ]);
          
          // Check for auth errors (401) - may happen if user not logged in yet
          if (provincesRes.status === 401 || districtsRes.status === 401 || wardsRes.status === 401) {
            console.warn('Administrative data API requires authentication - skipping load');
            set({ isLoading: false });
            return;
          }
          
          if (!provincesRes.ok || !districtsRes.ok || !wardsRes.ok) {
            console.warn('Failed to fetch administrative data - status:', 
              provincesRes.status, districtsRes.status, wardsRes.status);
            set({ isLoading: false });
            return;
          }
          
          const [provincesJson, districtsJson, wardsJson] = await Promise.all([
            provincesRes.json(),
            districtsRes.json(),
            wardsRes.json(),
          ]);
          
          const allProvinces: Province[] = provincesJson.data || [];
          const allDistricts: District[] = districtsJson.data || [];
          const allWards: Ward[] = wardsJson.data || [];
          
          // Split data by level
          const provinces2Level = allProvinces.filter(p => p.level === '2-level');
          const provinces3Level = allProvinces.filter(p => p.level === '3-level');
          const districts3Level = allDistricts.filter(d => d.level === '3-level');
          const _wards2Level = allWards.filter(w => w.level === '2-level');
          const wards3Level = allWards.filter(w => w.level === '3-level');
          
          // Update base stores with 2-level data
          provinceBaseStore.setState((state) => ({
            ...state,
            data: provinces2Level,
          }));
          
          districtBaseStore.setState((state) => ({
            ...state,
            data: allDistricts,
          }));
          
          wardBaseStore.setState((state) => ({
            ...state,
            data: allWards,
          }));
          
          // Mark all data as loaded
          dataLoadedState = { provinces: true, districts: true, wards: true };
          
          set({ 
            isLoading: false, 
            isLoaded: true,
            provinces3Level,
            districts3Level,
            wards3Level,
          });
        } catch (error) {
          console.error('Failed to load administrative data from API:', error);
          set({ isLoading: false });
        } finally {
          loadingPromise = null;
        }
      })();
      
      return loadingPromise;
    },
    
    add: (province) => provinceBaseStore.getState().add(province),
    addMultiple: (provinces) => provinceBaseStore.getState().addMultiple(provinces),
    update: (systemId, province) => provinceBaseStore.getState().update(systemId, province),
    remove: (systemId) => provinceBaseStore.getState().remove(systemId),
    findById: (systemId) => provinceBaseStore.getState().findById(systemId),
    addWard: (ward) => wardBaseStore.getState().add(ward),
    updateWard: (systemId, ward) => wardBaseStore.getState().update(systemId, ward),
    removeWard: (systemId) => wardBaseStore.getState().remove(systemId),
    addDistrict: (district) => districtBaseStore.getState().add(district),
    updateDistrict: (systemId, district) => districtBaseStore.getState().update(systemId, district),
    removeDistrict: (systemId) => districtBaseStore.getState().remove(systemId),
    
    // 2-level methods (34 provinces - from API/database)
    getProvinces2Level: () => get().data,
    getWards2Level: () => get().wards.filter((ward) => ward.level === '2-level'),
    getWards2LevelByProvinceId: (provinceId) =>
      get().wards.filter((ward) => ward.level === '2-level' && ward.provinceId === provinceId),
    
    // 3-level methods (63 provinces - from static data)
    getProvinces3Level: () => get().provinces3Level,
    getWards3Level: () => get().wards3Level,
    getWards3LevelByProvinceId: (provinceId) =>
      get().wards3Level.filter((ward) => ward.provinceId === provinceId),
    getWards3LevelByDistrictId: (districtId) =>
      get().wards3Level.filter((ward) => ward.districtId === districtId),
    getDistricts3LevelByProvinceId: (provinceId) =>
      get().districts3Level.filter((district) => district.provinceId === provinceId),
    
    // Generic methods (use API data)
    getWardsByProvinceId: (provinceId) =>
      get().wards.filter((ward) => ward.provinceId === provinceId),
    getDistrictsByProvinceId: (provinceId) =>
      get().districts.filter((district) => district.provinceId === provinceId),
    getWardsByDistrictId: (districtId) =>
      get().wards.filter((ward) => ward.districtId === districtId),
    getDistrictById: (districtId) => get().districts.find((district) => district.id === districtId),
    getProvinceById: (provinceId) => get().data.find((province) => province.id === provinceId),
    getWardById: (wardId) => get().wards.find((ward) => ward.id === wardId),
    importAdministrativeUnits: (payload) => applyAdministrativeImport(payload),
  };
});
