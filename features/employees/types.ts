/**
 * Re-export all Employee types from centralized prisma-extended.ts
 * This file exists for backwards compatibility during migration
 */
export {
  type Employee,
  type EmployeeRole,
  type EmployeeAddress,
  type TwoLevelAddress,
  type ThreeLevelAddress,
  type AddressInputLevel,
  isTwoLevelAddress,
  isThreeLevelAddress,
  createEmptyAddress,
} from '@/lib/types/prisma-extended';
