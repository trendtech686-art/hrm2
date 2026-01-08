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
  avatarUrl: z.string().optional(),
  permanentAddress: z.string().optional(),
  temporaryAddress: z.string().optional(),
  departmentId: z.string().optional(),
  jobTitleId: z.string().optional(),
  branchId: z.string().optional(),
  managerId: z.string().optional(),
  hireDate: z.string().optional(),
  startDate: z.string().optional(),
  employeeType: z.string().optional().default('FULLTIME'),
  employmentStatus: z.string().optional().default('ACTIVE'),
  role: z.string().optional().default('Nhân viên'),
  baseSalary: z.number().optional(),
  contractNumber: z.string().optional(),
  contractType: z.string().optional(),
  notes: z.string().optional(),
  createdBy: z.string().optional(),
})

// Update employee schema
export const updateEmployeeSchema = createEmployeeSchema.partial()

export type ListEmployeesInput = z.infer<typeof listEmployeesSchema>
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>
