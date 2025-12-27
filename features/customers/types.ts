// Re-export all customer types from central prisma-extended
export type {
  CustomerStatus,
  CustomerLifecycleStage,
  DebtStatus,
  DebtTransaction,
  DebtReminder,
  CustomerAddress,
  Customer,
} from '@/lib/types/prisma-extended'
