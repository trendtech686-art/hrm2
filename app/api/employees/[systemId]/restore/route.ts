import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'

// POST /api/employees/[systemId]/restore - Restore deleted employee
export const POST = apiHandler(async (_request, { session, params }) => {
    const { systemId } = params

    // Check if employee exists and is deleted
    const existing = await prisma.employee.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Employee')
    }

    if (!existing.isDeleted) {
      return apiError('Nhân viên chưa bị xóa', 400)
    }

    if (existing.permanentlyDeletedAt) {
      return apiError('Nhân viên đã được lưu trữ vĩnh viễn, không thể khôi phục', 400)
    }

    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
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
    })

    // Sync: reactivate linked user account
    await prisma.user.updateMany({
      where: { employeeId: systemId },
      data: { isActive: true },
    })

    // Log activity
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'employee',
          entityId: systemId,
          action: 'restored',
          actionType: 'update',
          note: `Khôi phục nhân viên`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] employee restored failed', e))

    return apiSuccess(employee)
}, { permission: 'edit_employees' })
