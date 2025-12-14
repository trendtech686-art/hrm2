import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { asSystemId, type SystemId } from '@/lib/id-types';
import type { Importer } from './types';

interface ImporterState {
  data: Importer[];
  add: (importer: Omit<Importer, 'systemId' | 'createdAt' | 'updatedAt'>) => void;
  update: (systemId: SystemId, importer: Partial<Importer>) => void;
  remove: (systemId: SystemId) => void;
  setDefault: (systemId: SystemId) => void;
  getActive: () => Importer[];
  getDefault: () => Importer | undefined;
  findById: (systemId: SystemId) => Importer | undefined;
}

export const useImporterStore = create<ImporterState>()(
  persist(
    (set, get) => ({
      data: [],
      
      add: (importer) => set((state) => {
        // Nếu đây là item đầu tiên hoặc isDefault = true, set làm default
        const isFirstItem = state.data.filter(d => !d.isDeleted).length === 0;
        const shouldBeDefault = isFirstItem || importer.isDefault;
        
        // Nếu item mới là default, bỏ default của các item khác
        const updatedData = shouldBeDefault
          ? state.data.map(item => ({ ...item, isDefault: false }))
          : state.data;
        
        return {
          data: [
            ...updatedData,
            {
              ...importer,
              systemId: asSystemId(nanoid()),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: importer.isActive ?? true,
              isDefault: shouldBeDefault,
              isDeleted: false,
            },
          ],
        };
      }),
      
      update: (systemId, importer) => set((state) => ({
        data: state.data.map((item) =>
          item.systemId === systemId
            ? { ...item, ...importer, updatedAt: new Date().toISOString() }
            : item
        ),
      })),
      
      remove: (systemId) => set((state) => ({
        data: state.data.map((item) =>
          item.systemId === systemId
            ? { ...item, isDeleted: true, updatedAt: new Date().toISOString() }
            : item
        ),
      })),
      
      setDefault: (systemId) => set((state) => ({
        data: state.data.map((item) => ({
          ...item,
          isDefault: item.systemId === systemId,
          updatedAt: item.systemId === systemId ? new Date().toISOString() : item.updatedAt,
        })),
      })),
      
      getActive: () => get().data.filter((item) => !item.isDeleted && item.isActive),
      
      getDefault: () => get().data.find((item) => !item.isDeleted && item.isDefault),
      
      findById: (systemId) => get().data.find((item) => item.systemId === systemId),
    }),
    {
      name: 'importer-storage',
    }
  )
);
