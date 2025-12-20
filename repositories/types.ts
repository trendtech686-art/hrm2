import type { SystemId } from '../lib/id-types';

/**
 * Generic repository interface để store gọi thay vì thao tác trực tiếp với mock store.
 * Các method cố ý trả Promise để có thể thay thế bằng API/DB bất kỳ lúc nào.
 */
export interface CrudRepository<
  TEntity,
  TCreateInput = Omit<TEntity, 'systemId'>,
  TUpdateInput = Partial<TEntity>
> {
  list(): Promise<TEntity[]>;
  getById(systemId: SystemId): Promise<TEntity | undefined>;
  create(payload: TCreateInput): Promise<TEntity>;
  update(systemId: SystemId, payload: TUpdateInput): Promise<TEntity>;
  softDelete(systemId: SystemId): Promise<void>;
  restore(systemId: SystemId): Promise<TEntity | undefined>;
  hardDelete(systemId: SystemId): Promise<void>;
}
