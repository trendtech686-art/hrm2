import { create } from 'zustand';
import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import { createCrudStore } from '../../../lib/store-factory';
import { getCurrentUserSystemId } from '../../../contexts/auth-context';
import type { Province, District, Ward } from '@/lib/types/prisma-extended';
import { PROVINCES_DATA } from './provinces-data';
import { DISTRICTS_DATA } from './districts-data';
import { WARDS_2LEVEL_DATA } from './wards-2level-data';
import { WARDS_3LEVEL_DATA } from './wards-3level-data';

const normalizedProvinces: Province[] = PROVINCES_DATA.map((province) => ({
  ...province,
}));

const normalizedDistricts: District[] = DISTRICTS_DATA.map((district) => ({
  ...district,
  systemId: asSystemId(district.systemId),
  provinceId: asBusinessId(district.provinceId),
}));

const normalizedWards: Ward[] = [
  ...WARDS_2LEVEL_DATA.map((ward) => ({
    systemId: asSystemId(ward.systemId),
    id: ward.id,
    name: ward.name,
    provinceId: asBusinessId(ward.provinceId),
    provinceName: ward.provinceName,
    level: '2-level' as const,
  })),
  ...WARDS_3LEVEL_DATA.map((ward) => ({
    systemId: asSystemId(ward.systemId),
    id: ward.id,
    name: ward.name,
    provinceId: asBusinessId(ward.provinceId),
    provinceName: ward.provinceName,
    districtId: ward.districtId,
    districtName: ward.districtName,
    level: '3-level' as const,
  })),
];

const provinceBaseStore = createCrudStore<Province>(normalizedProvinces, 'provinces', {
  businessIdField: 'id',
  persistKey: 'hrm-provinces',
  getCurrentUser: getCurrentUserSystemId,
});

const districtBaseStore = createCrudStore<District>(normalizedDistricts, 'districts', {
  persistKey: 'hrm-districts',
  getCurrentUser: getCurrentUserSystemId,
});

const wardBaseStore = createCrudStore<Ward>(normalizedWards, 'wards', {
  persistKey: 'hrm-wards',
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
