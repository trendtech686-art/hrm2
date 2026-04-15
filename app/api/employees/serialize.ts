/**
 * Shared serialization for employee Decimal fields
 */

function convertDecimalToNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string') return parseFloat(value) || null
  if (typeof value === 'object' && value !== null && 'toNumber' in value) {
    return (value as { toNumber: () => number }).toNumber()
  }
  return null
}

export function serializeEmployee<T extends {
  baseSalary?: unknown;
  socialInsuranceSalary?: unknown;
  positionAllowance?: unknown;
  mealAllowance?: unknown;
  otherAllowances?: unknown;
  branchId?: string | null;
  departmentId?: string | null;
  jobTitleId?: string | null;
}>(employee: T) {
  return {
    ...employee,
    baseSalary: convertDecimalToNumber(employee.baseSalary),
    socialInsuranceSalary: convertDecimalToNumber(employee.socialInsuranceSalary),
    positionAllowance: convertDecimalToNumber(employee.positionAllowance),
    mealAllowance: convertDecimalToNumber(employee.mealAllowance),
    otherAllowances: convertDecimalToNumber(employee.otherAllowances),
    branchSystemId: employee.branchId,
    departmentSystemId: employee.departmentId,
    jobTitleSystemId: employee.jobTitleId,
  }
}
