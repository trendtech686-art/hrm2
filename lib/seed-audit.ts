import { asSystemId, type SystemId } from './id-types.ts';

export const DEFAULT_SEED_AUTHOR = asSystemId('EMP000001');

type SeedAuditInput = {
  createdAt: string;
  createdBy?: SystemId;
  updatedAt?: string;
  updatedBy?: SystemId;
};

export const buildSeedAuditFields = ({
  createdAt,
  createdBy = DEFAULT_SEED_AUTHOR,
  updatedAt,
  updatedBy,
}: SeedAuditInput) => ({
  createdAt,
  updatedAt: updatedAt ?? createdAt,
  createdBy,
  updatedBy: updatedBy ?? createdBy,
});
