import { create } from 'zustand';
import { type SystemId, type BusinessId } from '@/lib/id-types';
import { createCrudStore } from '../../../lib/store-factory';
import { getCurrentUserSystemId } from '../../../contexts/auth-context';
import type { Province, District, Ward } from '@/lib/types/prisma-extended';

// Data is now loaded from API instead of static files to reduce bundle size (~3MB)
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
  getWards2Level: () => Ward[];
  getWards2LevelByProvinceId: (provinceId: BusinessId) => Ward[];
  getWards3Level: () => Ward[];
  getWards3LevelByProvinceId: (provinceId: BusinessId) => Ward[];
  getWards3LevelByDistrictId: (districtId: number) => Ward[];
  getDistricts3LevelByProvinceId: (provinceId: BusinessId) => District[];
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
    isLoading: false,
    isLoaded: false,
    
    // Load data from API (database) instead of static files
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
          // Fetch all data from API in parallel
          const [provincesRes, districtsRes, wardsRes] = await Promise.all([
            fetch(`${API_BASE}/provinces`),
            fetch(`${API_BASE}/districts`),
            // Fetch wards with large limit to get all
            fetch(`${API_BASE}/wards?limit=20000`),
          ]);
          
          if (!provincesRes.ok || !districtsRes.ok || !wardsRes.ok) {
            throw new Error('Failed to fetch administrative data from API');
          }
          
          const [provincesJson, districtsJson, wardsJson] = await Promise.all([
            provincesRes.json(),
            districtsRes.json(),
            wardsRes.json(),
          ]);
          
          const provinces: Province[] = provincesJson.data || [];
          const districts: District[] = districtsJson.data || [];
          const wards: Ward[] = wardsJson.data || [];
          
          // Update base stores with loaded data
          provinceBaseStore.setState((state) => ({
            ...state,
            data: provinces,
          }));
          
          districtBaseStore.setState((state) => ({
            ...state,
            data: districts,
          }));
          
          wardBaseStore.setState((state) => ({
            ...state,
            data: wards,
          }));
          
          // Mark all data as loaded
          dataLoadedState = { provinces: true, districts: true, wards: true };
          
          set({ isLoading: false, isLoaded: true });
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
    getWards2Level: () => get().wards.filter((ward) => ward.level === '2-level'),
    getWards2LevelByProvinceId: (provinceId) =>
      get().wards.filter((ward) => ward.level === '2-level' && ward.provinceId === provinceId),
    getWards3Level: () => get().wards.filter((ward) => ward.level === '3-level'),
    getWards3LevelByProvinceId: (provinceId) =>
      get().wards.filter((ward) => ward.level === '3-level' && ward.provinceId === provinceId),
    getWards3LevelByDistrictId: (districtId) =>
      get().wards.filter((ward) => ward.level === '3-level' && ward.districtId === districtId),
    getDistricts3LevelByProvinceId: (provinceId) =>
      get().districts.filter((district) => district.provinceId === provinceId),
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
