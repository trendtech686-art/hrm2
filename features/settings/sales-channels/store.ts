import type { UseBoundStore, StoreApi } from 'zustand';
import { data as initialData } from './data';
import type { SalesChannel } from '@/lib/types/prisma-extended';
import { createCrudStore, type CrudState } from '../../../lib/store-factory';
import { getCurrentUserSystemId } from '../../../contexts/auth-context';
import type { SystemId } from '@/lib/id-types';

type SalesChannelStore = CrudState<SalesChannel> & {
  setDefault: (systemId: SystemId) => void;
};

const baseStore = createCrudStore<SalesChannel>(initialData, 'sales-channels', {
  businessIdField: 'id',
  persistKey: 'hrm-sales-channel-storage',
  getCurrentUser: getCurrentUserSystemId,
}) as UseBoundStore<StoreApi<SalesChannelStore>>;

const originalAdd = baseStore.getState().add;
const originalUpdate = baseStore.getState().update;
const originalRemove = baseStore.getState().remove;

const setDefaultAction = (systemId: SystemId) => {
  baseStore.setState((current) => {
    const exists = current.data.some((channel) => channel.systemId === systemId);
    if (!exists) return current;

    return {
      ...current,
      data: current.data.map((channel) => ({
        ...channel,
        isDefault: channel.systemId === systemId,
      })),
    };
  });
};

const ensureDefaultExists = () => {
  const { data } = baseStore.getState();
  if (!data.length) return;
  if (!data.some((channel) => channel.isDefault)) {
    setDefaultAction(data[0].systemId);
  }
};

const enhancedAdd: typeof originalAdd = (item) => {
  const newItem = originalAdd(item);
  if (item.isDefault) {
    setDefaultAction(newItem.systemId);
  } else {
    ensureDefaultExists();
  }
  return newItem;
};

const enhancedUpdate: typeof originalUpdate = (systemId, updatedChannel) => {
  originalUpdate(systemId, updatedChannel);
  if (updatedChannel.isDefault) {
    setDefaultAction(systemId);
  } else {
    ensureDefaultExists();
  }
};

const enhancedRemove: typeof originalRemove = (systemId) => {
  originalRemove(systemId);
  ensureDefaultExists();
};

baseStore.setState((state) => ({
  ...state,
  add: enhancedAdd,
  update: enhancedUpdate,
  remove: enhancedRemove,
  setDefault: setDefaultAction,
}));

export const useSalesChannelStore = baseStore;
