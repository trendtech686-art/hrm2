/**
 * API Validation Schemas for Employees
 */
import { z } from 'zod'

// Query params for listing employees
export const listEmployeesSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  departmentId: z.string().optional(),
  branchId: z.string().optional(),
})

// Address schema for reuse
const addressSchema = z.object({
  street: z.string().optional(),
  province: z.string().optional(),
  provinceId: z.string().optional(),
  district: z.string().optional(),
  districtId: z.union([z.string(), z.number()]).optional(),
  ward: z.string().optional(),
  wardId: z.string().optional(),
  inputLevel: z.string().optional(),
})

// Create employee schema
export const createEmployeeSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, 'Họ tên là bắt buộc'),
  dob: z.string().optional(),
  placeOfBirth: z.string().optional(),
  gender: z.string().optional().default('OTHER'),
  phone: z.string().optional(),
  personalEmail: z.string().optional(),
  workEmail: z.string().optional(),
  nationalId: z.string().optional(),
  nationalIdIssueDate: z.string().optional(),
  nationalIdIssuePlace: z.string().optional(),
  avatarUrl: z.string().optional(),
  permanentAddress: z.union([addressSchema, z.null()]).optional(),
  temporaryAddress: z.union([addressSchema, z.null()]).optional(),
  // Relations
  departmentId: z.string().optional(),
  department: z.string().optional(), // Support both field names
  jobTitleId: z.string().optional(),
  jobTitle: z.string().optional(),
  branchId: z.string().optional(),
  branchSystemId: z.string().optional(),
  managerId: z.string().optional(),
  // Employment dates
  hireDate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  terminationDate: z.string().optional(),
  reasonForLeaving: z.string().optional(),
  // Employment type
  employeeType: z.string().optional().default('FULLTIME'),
  employmentStatus: z.string().optional().default('ACTIVE'),
  role: z.string().optional().default('Nhân viên'),
  // Salary & Allowances
  baseSalary: z.number().optional(),
  socialInsuranceSalary: z.number().optional(),
  positionAllowance: z.number().optional(),
  mealAllowance: z.number().optional(),
  otherAllowances: z.number().optional(),
  numberOfDependents: z.number().optional(),
  // Contract
  contractNumber: z.string().optional(),
  contractType: z.string().optional(),
  contractStartDate: z.string().optional(),
  contractEndDate: z.string().optional(),
  probationEndDate: z.string().optional(),
  // Bank info
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  bankBranch: z.string().optional(),
  // Tax & Insurance
  personalTaxId: z.string().optional(),
  socialInsuranceNumber: z.string().optional(),
  // Personal info
  maritalStatus: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  // Leave
  annualLeaveBalance: z.number().optional(),
  // Other
  notes: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  password: z.string().optional(), // For creating user account
})

// Update employee schema
export const updateEmployeeSchema = createEmployeeSchema.partial()

export type ListEmployeesInput = z.infer<typeof listEmployeesSchema>
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>
