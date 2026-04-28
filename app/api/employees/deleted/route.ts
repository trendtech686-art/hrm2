import { prisma } from '@/lib/prisma'
import { apiPaginated } from '@/lib/api-utils'
import { parsePagination } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { API_MAX_PAGE_LIMIT } from '@/lib/pagination-constants'

// GET /api/employees/deleted - List employees in trash (excludes permanently archived)
export const GET = apiHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const { page, limit, skip } = parsePagination(searchParams)

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where: {
        isDeleted: true,
        permanentlyDeletedAt: null, // Chỉ hiện thùng rác, không hiện đã lưu trữ vĩnh viễn
      },
      orderBy: { deletedAt: 'desc' },
      skip,
      take: Math.min(limit, API_MAX_PAGE_LIMIT),
      select: {
        systemId: true, id: true, fullName: true, phone: true, personalEmail: true,
        workEmail: true, gender: true, avatarUrl: true, role: true,
        employmentStatus: true, employeeType: true, hireDate: true, startDate: true,
        endDate: true, terminationDate: true, reasonForLeaving: true,
        contractNumber: true, contractType: true, contractStartDate: true,
        contractEndDate: true, probationEndDate: true,
        personalTaxId: true, socialInsuranceNumber: true,
        socialInsuranceSalary: true, baseSalary: true, positionAllowance: true,
        mealAllowance: true, otherAllowances: true, numberOfDependents: true,
        annualLeaveBalance: true,
        nationalId: true, nationalIdIssueDate: true, nationalIdIssuePlace: true,
        maritalStatus: true, emergencyContactName: true, emergencyContactPhone: true,
        permanentAddress: true, temporaryAddress: true,
        bankAccountNumber: true, bankName: true, bankBranch: true,
        notes: true, isDeleted: true, deletedAt: true, permanentlyDeletedAt: true,
        createdAt: true, updatedAt: true, createdBy: true, updatedBy: true,
        departmentId: true, branchId: true, jobTitleId: true, managerId: true,
        department: { select: { systemId: true, name: true } },
        branch: { select: { systemId: true, name: true } },
        jobTitle: { select: { systemId: true, name: true } },
      },
    }),
    prisma.employee.count({
      where: {
        isDeleted: true,
        permanentlyDeletedAt: null,
      },
    }),
  ])

  return apiPaginated(employees, { page, limit, total })
})
