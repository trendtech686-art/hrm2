// Re-export all employee settings types from central prisma-extended
export type {
  WorkShift,
  LeaveType,
  SalaryComponentCategory,
  SalaryComponent,
  InsuranceRates,
  TaxBracket,
  TaxSettings,
  MinimumWageByRegion,
  LatePenaltyTier,
  EmployeeSettings,
} from '@/lib/types/prisma-extended';
