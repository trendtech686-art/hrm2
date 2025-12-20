import type { SystemId } from '../lib/id-types';
import type { CrudState, ItemWithSystemId } from '../lib/store-factory';
import type { CrudRepository } from './types';

/**
 * Adapter mặc định dùng trực tiếp Zustand store để giả lập tầng persistence.
 * Giữ cùng signature với repository interface để sau này thay bằng API/DB dễ dàng.
 */
export const createInMemoryRepository = <TEntity extends ItemWithSystemId>(
  stateGetter: () => CrudState<TEntity>
): CrudRepository<TEntity, Omit<TEntity, 'systemId'>, Partial<TEntity>> => {
  const getStore = () => stateGetter();

  const ensureEntity = (systemId: SystemId): TEntity => {
    const entity = getStore().findById(systemId);
    if (!entity) {
      throw new Error(`Không tìm thấy entity với systemId=${systemId}`);
    }
    return entity;
  };

  return {
    async list() {
      return [...getStore().data];
    },
    async getById(systemId) {
      return getStore().findById(systemId);
    },
    async create(payload) {
      return getStore().add(payload as Omit<TEntity, 'systemId'>);
    },
    async update(systemId, payload) {
      ensureEntity(systemId);
      getStore().update(systemId, payload);
      return ensureEntity(systemId);
    },
    async softDelete(systemId) {
      ensureEntity(systemId);
      getStore().remove(systemId);
    },
    async restore(systemId) {
      ensureEntity(systemId);
      getStore().restore(systemId);
      return getStore().findById(systemId);
    },
    async hardDelete(systemId) {
      ensureEntity(systemId);
      getStore().hardDelete(systemId);
    },
  };
};
