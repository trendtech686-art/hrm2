import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Province, Ward, District } from './types.ts';
import { PROVINCES_DATA } from './provinces-data';
import { DISTRICTS_DATA } from './districts-data';
import { DISTRICTS_2LEVEL_DATA } from './districts-2level-data';
import { WARDS_2LEVEL_DATA } from './wards-2level-data';
import { WARDS_3LEVEL_DATA } from './wards-3level-data';

type AdministrativeUnitState = {
  data: Province[];
  wards: Ward[];
  districts: District[];
  setData: (provinces: Province[], wards: Ward[]) => void;
  // 2-level specific getters (3,321 wards - NO districtId, 2 cấp: Tỉnh → Phường)
  getWards2Level: () => Ward[];
  getWards2LevelByProvinceId: (provinceId: string) => Ward[];
  // 3-level specific getters (10,035 wards - WITH districtId, 3 cấp: Tỉnh → Quận → Phường)
  getWards3Level: () => Ward[];
  getWards3LevelByProvinceId: (provinceId: string) => Ward[];
  getWards3LevelByDistrictId: (districtId: number) => Ward[];
  getDistricts3LevelByProvinceId: (provinceId: string) => District[];
  // Original getters (for backward compatibility)
  getWardsByProvinceId: (provinceId: string) => Ward[];
  getDistrictsByProvinceId: (provinceId: string) => District[];
  getWardsByDistrictId: (districtId: number) => Ward[];
  getDistrictById: (districtId: number) => District | undefined;
  getProvinceById: (provinceId: string) => Province | undefined;
  getWardById: (wardId: string) => Ward | undefined; // NEW: Get ward by ID (search both 2-level and 3-level)
  add: (province: Omit<Province, 'systemId'>) => void;
  addMultiple: (provinces: Omit<Province, 'systemId'>[]) => void;
  update: (systemId: string, province: Province) => void;
  remove: (systemId: string) => void;
  findById: (systemId: string) => Province | undefined;
  addWard: (ward: Omit<Ward, 'systemId'>) => void;
  updateWard: (systemId: string, ward: Ward) => void;
  removeWard: (systemId: string) => void;
  addDistrict: (district: Omit<District, 'systemId'>) => void;
  updateDistrict: (systemId: string, district: District) => void;
  removeDistrict: (systemId: string) => void;
};

let provinceIdCounter = PROVINCES_DATA.length;

// Districts already generated from import
const initialDistricts = DISTRICTS_DATA;

// 2-LEVEL Districts (696 districts from 2-level data)
const districts2Level: District[] = DISTRICTS_2LEVEL_DATA.map(d => ({
  systemId: d.systemId,
  id: Number(d.id),
  name: d.name,
  provinceId: d.provinceId,
}));

// SEPARATED DATA for 2-level vs 3-level
// - 2-LEVEL: 3,321 wards (Luật 2025 - sau sáp nhập) - NO districtId (Tỉnh → Phường)
// - 3-LEVEL: 10,035 wards (Legacy - trước sáp nhập) - WITH districtId (Tỉnh → Quận → Phường)
const wards2Level: Ward[] = WARDS_2LEVEL_DATA.map(w => ({
  systemId: w.systemId,
  id: w.id,
  name: w.name,
  provinceId: w.provinceId,
  level: '2-level' as const,
}));

const wards3Level: Ward[] = WARDS_3LEVEL_DATA.map(w => ({
  systemId: w.systemId,
  id: w.id,
  name: w.name,
  provinceId: w.provinceId,
  districtId: w.districtId,
  level: '3-level' as const,
}));

console.log('[Store Init] Data loaded:', {
  provinces: PROVINCES_DATA.length,
  wards2Level: wards2Level.length,
  wards3Level: wards3Level.length,
  total: wards2Level.length + wards3Level.length,
  hanoi2Level: wards2Level.filter(w => w.provinceId === '08').length,
  hanoi3Level: wards3Level.filter(w => w.provinceId === '08').length,
  hcm2Level: wards2Level.filter(w => w.provinceId === '24').length,
  hcm3Level: wards3Level.filter(w => w.provinceId === '24').length,
  sample2Level: wards2Level.slice(0, 2),
  sample3Level: wards3Level.slice(0, 2),
});

// FORCE CLEAR old cache (remove after testing)
if (typeof window !== 'undefined') {
  const oldVersion = localStorage.getItem('hrm-administrative-units-storage-version');
  if (!oldVersion || parseInt(oldVersion) < 6) {
    console.log('[Store] Clearing old localStorage cache (v6 - reimport from FILE1/FILE2/FILE3)...');
    localStorage.removeItem('hrm-administrative-units-storage');
    localStorage.setItem('hrm-administrative-units-storage-version', '6');
  }
}

// Default: Load ALL for backward compatibility (can be removed later)
const initialWards: Ward[] = [...wards2Level, ...wards3Level];

export const useProvinceStore = create<AdministrativeUnitState>()(
  persist(
    (set, get) => ({
      data: PROVINCES_DATA,
      wards: initialWards,
      districts: initialDistricts,
      setData: (provinces, wards) => set({ data: provinces, wards }),
      
      // 2-LEVEL getters (3,321 wards - NO districtId, 2 cấp: Tỉnh → Phường)
      getWards2Level: () => wards2Level,
      getWards2LevelByProvinceId: (provinceId) => {
        const result = wards2Level.filter(w => w.provinceId === provinceId);
        
        console.log('[2-LEVEL] getWards2LevelByProvinceId:', { 
          requestedProvinceId: provinceId,
          totalWards2Level: wards2Level.length,
          foundWards: result.length,
          sample: result.slice(0, 3).map(w => ({ id: w.id, name: w.name, provinceId: w.provinceId })),
        });
        return result;
      },
      
      // 3-LEVEL getters (10,035 wards - WITH districtId, 3 cấp: Tỉnh → Quận → Phường)
      getWards3Level: () => wards3Level,
      getWards3LevelByProvinceId: (provinceId) => wards3Level.filter(w => w.provinceId === provinceId),
      getWards3LevelByDistrictId: (districtId) => {
        const result = wards3Level.filter(w => w.districtId === districtId);
        console.log('[3-LEVEL] getWards3LevelByDistrictId:', { 
          requestedDistrictId: districtId,
          foundWards: result.length,
          sample: result.slice(0, 3).map(w => ({ id: w.id, name: w.name, districtId: w.districtId })),
        });
        return result;
      },
      getDistricts3LevelByProvinceId: (provinceId) => {
        const result = get().districts.filter(d => d.provinceId === provinceId);
        console.log('[3-LEVEL] getDistricts3LevelByProvinceId:', { 
          requestedProvinceId: provinceId,
          foundDistricts: result.length,
          sample: result.slice(0, 3).map(d => ({ id: d.id, name: d.name })),
        });
        return result;
      },
      
      // Original getters (for backward compatibility - return ALL)
      getWardsByProvinceId: (provinceId) => get().wards.filter(w => w.provinceId === provinceId),
      getDistrictsByProvinceId: (provinceId) => {
        const result = get().districts.filter(d => d.provinceId === provinceId);
        console.log('[BACKWARD-COMPAT] getDistrictsByProvinceId:', { 
          requestedProvinceId: provinceId,
          totalDistricts: get().districts.length,
          foundDistricts: result.length,
          sample: result.slice(0, 5).map(d => ({ id: d.id, name: d.name, provinceId: d.provinceId })),
          allProvinceIds: [...new Set(get().districts.map(d => d.provinceId))].sort().slice(0, 10),
        });
        return result;
      },
      getWardsByDistrictId: (districtId) => {
        // Filter wards by districtId (only 3-level wards have districtId)
        return get().wards.filter(w => w.districtId === districtId);
      },
      getDistrictById: (districtId) => get().districts.find(d => d.id === districtId),
      getProvinceById: (provinceId) => get().data.find(p => p.id === provinceId),
      getWardById: (wardId) => {
        // Search in 2-level first, then 3-level
        const ward2 = wards2Level.find(w => w.id === wardId);
        if (ward2) return ward2;
        return wards3Level.find(w => w.id === wardId);
      },
      add: (province) => set((state) => {
        provinceIdCounter++;
        const newSystemId = `T${provinceIdCounter.toString().padStart(8, '0')}`;
        const newProvince = { ...province, systemId: newSystemId } as Province;
        return { data: [...state.data, newProvince] };
      }),
      addMultiple: (provinces) => set(state => {
        const newProvinces = provinces.map(p => {
          provinceIdCounter++;
          const newSystemId = `T${provinceIdCounter.toString().padStart(8, '0')}`;
          return { ...p, systemId: newSystemId } as Province;
        });
        return { data: [...state.data, ...newProvinces] };
      }),
      update: (systemId, updated) => set(state => ({
        data: state.data.map(p => p.systemId === systemId ? updated : p),
      })),
      remove: (systemId) => set(state => {
        const provinceToRemove = state.data.find(p => p.systemId === systemId);
        if (!provinceToRemove) return state;
        return {
          data: state.data.filter(p => p.systemId !== systemId),
          wards: state.wards.filter(w => w.provinceId !== provinceToRemove.id),
        };
      }),
      findById: (systemId: string) => get().data.find(p => p.systemId === systemId),
      addWard: (ward) => set(state => ({
        wards: [...state.wards, { ...ward, systemId: `WARD_${Date.now()}_${Math.random()}` } as Ward],
      })),
      updateWard: (systemId, updated) => set(state => ({
        wards: state.wards.map(w => w.systemId === systemId ? updated : w),
      })),
      removeWard: (systemId) => set(state => ({
        wards: state.wards.filter(w => w.systemId !== systemId),
      })),
      addDistrict: (district) => set(state => ({
        districts: [...state.districts, { ...district, systemId: `DISTRICT_${Date.now()}_${Math.random()}` } as District],
      })),
      updateDistrict: (systemId, updated) => set(state => ({
        districts: state.districts.map(d => d.systemId === systemId ? updated : d),
      })),
      removeDistrict: (systemId) => set(state => {
        const districtToRemove = state.districts.find(d => d.systemId === systemId);
        if (!districtToRemove) return state;
        return {
          districts: state.districts.filter(d => d.systemId !== systemId),
          wards: state.wards.filter(w => w.districtId !== districtToRemove.id),
        };
      }),
    }),
    {
      name: 'hrm-administrative-units-storage',
      storage: createJSONStorage(() => localStorage),
      version: 6, // v6: Reimport from FILE1/FILE2/FILE3 with NAME-based matching
      migrate: (persistedState: any, version: number) => {
        // Always reload fresh data
        console.log('[Store] Migrating to v6 - FORCE RELOAD with FILE1/FILE2/FILE3 data');
        return {
          data: PROVINCES_DATA,
          wards: initialWards,
          districts: initialDistricts,
        };
      },
    }
  )
);
