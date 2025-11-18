import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { data as initialData } from './data.ts';
import type { SalesChannel } from './types.ts';

interface SalesChannelState {
  data: SalesChannel[];
  add: (item: Omit<SalesChannel, 'systemId'>) => void;
  update: (systemId: string, updatedChannel: Omit<SalesChannel, 'systemId'>) => void;
  remove: (systemId: string) => void;
  setDefault: (systemId: string) => void;
}

let idCounter = initialData.length;

export const useSalesChannelStore = create<SalesChannelState>()(
  persist(
    (set) => ({
      data: initialData,
      add: (item) => set((state) => {
        idCounter++;
        const newSystemId = `SC${idCounter.toString().padStart(8, '0')}`;
        let newData = [...state.data, { ...item, systemId: newSystemId }];
        if (item.isDefault) {
          newData = newData.map(channel => 
            channel.systemId === newSystemId ? channel : { ...channel, isDefault: false }
          );
        }
        return { data: newData };
      }),
      update: (systemId, updatedFields) => set((state) => {
        let newData = state.data.map(p => p.systemId === systemId ? { ...p, ...updatedFields } : p);
        if (updatedFields.isDefault) {
            newData = newData.map(channel => 
              channel.systemId === systemId ? channel : { ...channel, isDefault: false }
            );
        }
        return { data: newData };
      }),
      remove: (systemId) => set((state) => ({
        data: state.data.filter((p) => p.systemId !== systemId),
      })),
      setDefault: (systemId) => set((state) => ({
        data: state.data.map(p => ({ ...p, isDefault: p.systemId === systemId })),
      })),
    }),
    {
      name: 'hrm-sales-channel-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
