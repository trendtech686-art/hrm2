import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createCrudStore } from '../../lib/store-factory';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, toISODate } from '../../lib/date-utils';
import { data as initialData } from './data';
import type { WikiArticle } from '@/lib/types/prisma-extended';
import { asSystemId, asBusinessId } from '../../lib/id-types';
import type { SystemId } from '../../lib/id-types';
type WikiState = {
  data: WikiArticle[];
  add: (item: Omit<WikiArticle, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>) => void;
  update: (systemId: SystemId, item: Partial<Omit<WikiArticle, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>>) => void;
  remove: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => WikiArticle | undefined;
};

export const useWikiStore = create<WikiState>()(
  persist(
    (set, get) => ({
      data: initialData,
      findById: (systemId) => get().data.find((item) => item.systemId === systemId),
      add: (item) =>
        set((state) => {
          const currentDate = toISODate(getCurrentDate());
          const displayId = `WIKI${String(state.data.length + 1).padStart(6, '0')}`;
          const newItem: WikiArticle = {
            ...item,
            systemId: asSystemId(`WIKI${String(Date.now()).slice(-6)}_${Math.random().toString(36).substr(2, 9)}`),
            id: asBusinessId(displayId),
            createdAt: currentDate,
            updatedAt: currentDate,
          };
          return { data: [...state.data, newItem] };
        }),
      update: (systemId, updatedFields) =>
        set((state) => ({
          data: state.data.map((item) =>
            item.systemId === systemId
              ? { ...item, ...updatedFields, updatedAt: toISODate(getCurrentDate()) }
              : item
          ),
        })),
      remove: (systemId) =>
        set((state) => ({
          data: state.data.filter((item) => item.systemId !== systemId),
        })),
    }),
    {
      name: 'hrm-wiki-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
