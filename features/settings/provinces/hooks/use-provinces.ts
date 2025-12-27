/**
 * Provinces React Query Hooks
 * Provides data fetching for provinces, districts, wards
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchProvinces,
  fetchProvinceById,
  fetchAllProvinces,
  fetchDistricts,
  fetchDistrictsByProvince,
  fetchWards,
  fetchWardsByDistrict,
  fetchWardsByProvince,
  fetchAllWards,
  createProvince,
  updateProvince,
  deleteProvince,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  createWard,
  updateWard,
  deleteWard,
  importAdministrativeUnits,
  type ProvinceFilters,
  type DistrictFilters,
  type WardFilters,
  type AdministrativeImportPayload,
} from '../api/provinces-api';
import type { Province, District, Ward } from '@/lib/types/prisma-extended';

// Query keys factory
export const locationKeys = {
  all: ['locations'] as const,
  provinces: () => [...locationKeys.all, 'provinces'] as const,
  provinceList: (filters: ProvinceFilters) => [...locationKeys.provinces(), 'list', filters] as const,
  provinceDetail: (id: string) => [...locationKeys.provinces(), 'detail', id] as const,
  allProvinces: () => [...locationKeys.provinces(), 'all'] as const,
  districts: () => [...locationKeys.all, 'districts'] as const,
  districtList: (filters: DistrictFilters) => [...locationKeys.districts(), 'list', filters] as const,
  districtsByProvince: (provinceId: string) => [...locationKeys.districts(), 'province', provinceId] as const,
  wards: () => [...locationKeys.all, 'wards'] as const,
  wardList: (filters: WardFilters) => [...locationKeys.wards(), 'list', filters] as const,
  wardsByDistrict: (districtId: number) => [...locationKeys.wards(), 'district', districtId] as const,
  wardsByProvince: (provinceId: string) => [...locationKeys.wards(), 'province', provinceId] as const,
  allWards: () => [...locationKeys.wards(), 'all'] as const,
};

// ============== Province Hooks ==============

export function useProvinces(filters: ProvinceFilters = {}) {
  return useQuery({
    queryKey: locationKeys.provinceList(filters),
    queryFn: () => fetchProvinces(filters),
    staleTime: 1000 * 60 * 60, // 1 hour - provinces rarely change
  });
}

export function useAllProvinces() {
  return useQuery({
    queryKey: locationKeys.allProvinces(),
    queryFn: fetchAllProvinces,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useProvinceById(systemId: string | undefined) {
  return useQuery({
    queryKey: locationKeys.provinceDetail(systemId!),
    queryFn: () => fetchProvinceById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 60,
  });
}

// ============== District Hooks ==============

export function useDistricts(filters: DistrictFilters = {}) {
  return useQuery({
    queryKey: locationKeys.districtList(filters),
    queryFn: () => fetchDistricts(filters),
    staleTime: 1000 * 60 * 60,
  });
}

export function useDistrictsByProvince(provinceId: string | undefined) {
  return useQuery({
    queryKey: locationKeys.districtsByProvince(provinceId!),
    queryFn: () => fetchDistrictsByProvince(provinceId!),
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60,
  });
}

// ============== Ward Hooks ==============

export function useWards(filters: WardFilters = {}) {
  return useQuery({
    queryKey: locationKeys.wardList(filters),
    queryFn: () => fetchWards(filters),
    staleTime: 1000 * 60 * 60,
  });
}

export function useWardsByDistrict(districtId: number | undefined) {
  return useQuery({
    queryKey: locationKeys.wardsByDistrict(districtId!),
    queryFn: () => fetchWardsByDistrict(districtId!),
    enabled: !!districtId,
    staleTime: 1000 * 60 * 60,
  });
}

export function useWardsByProvince(provinceId: string | undefined) {
  return useQuery({
    queryKey: locationKeys.wardsByProvince(provinceId!),
    queryFn: () => fetchWardsByProvince(provinceId!),
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60,
  });
}

export function useAllWards() {
  return useQuery({
    queryKey: locationKeys.allWards(),
    queryFn: fetchAllWards,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - wards rarely change
  });
}

// ============== Province Mutations ==============

interface UseProvinceMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useProvinceMutations(options: UseProvinceMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: locationKeys.provinces() });
  };

  const add = useMutation({
    mutationFn: (data: Omit<Province, 'systemId'>) => createProvince(data),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Province> }) =>
      updateProvince(systemId, data),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteProvince(systemId),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return { add, update, remove };
}

// ============== District Mutations ==============

interface UseDistrictMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDistrictMutations(options: UseDistrictMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: locationKeys.districts() });
  };

  const add = useMutation({
    mutationFn: (data: Omit<District, 'systemId'>) => createDistrict(data),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<District> }) =>
      updateDistrict(systemId, data),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteDistrict(systemId),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return { add, update, remove };
}

// ============== Ward Mutations ==============

interface UseWardMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useWardMutations(options: UseWardMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: locationKeys.wards() });
  };

  const add = useMutation({
    mutationFn: (data: Omit<Ward, 'systemId'>) => createWard(data),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Ward> }) =>
      updateWard(systemId, data),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteWard(systemId),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return { add, update, remove };
}

// ============== Import Mutation ==============

export function useAdministrativeImportMutation(options: UseProvinceMutationsOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdministrativeImportPayload) => importAdministrativeUnits(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });
}
