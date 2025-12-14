import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as React from 'react';

export interface GlobalSettings {
  /** Số dòng mỗi trang mặc định cho tất cả data tables */
  defaultPageSize: number;
  /** Các option page size cho dropdown */
  pageSizeOptions: number[];
}

const DEFAULT_SETTINGS: GlobalSettings = {
  defaultPageSize: 20,
  pageSizeOptions: [5, 10, 20, 50, 100],
};

interface GlobalSettingsStore {
  settings: GlobalSettings;
  setDefaultPageSize: (size: number) => void;
  setPageSizeOptions: (options: number[]) => void;
  resetSettings: () => void;
}

export const useGlobalSettingsStore = create<GlobalSettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      setDefaultPageSize: (size) => 
        set((state) => ({
          settings: { ...state.settings, defaultPageSize: size },
        })),
      setPageSizeOptions: (options) =>
        set((state) => ({
          settings: { ...state.settings, pageSizeOptions: options },
        })),
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'global-settings',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

/** Hook để lấy default page size */
export function useDefaultPageSize() {
  return useGlobalSettingsStore((state) => state.settings.defaultPageSize);
}

/** Hook để lấy page size options */
export function usePageSizeOptions() {
  return useGlobalSettingsStore((state) => state.settings.pageSizeOptions);
}

/** 
 * Hook để quản lý pagination state với default page size từ global settings
 * @returns [pagination, setPagination]
 */
export function usePaginationWithGlobalDefault() {
  const defaultPageSize = useDefaultPageSize();
  return React.useState({ pageIndex: 0, pageSize: defaultPageSize });
}
