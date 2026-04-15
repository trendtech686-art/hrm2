import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'

/**
 * DELETE /api/employees/[systemId]/permanent - Lưu trữ vĩnh viễn nhân viên
 *
 * KHÔNG xóa cứng (hard-delete) record khỏi DB.
 * Thay vào đó:
 * 1. Xóa thông tin cá nhân nhạy cảm (PII) — phone, email, CCCD, bank, address...
 * 2. Giữ lại: systemId, id, fullName, department, branch — để đơn hàng, task, v.v.
 *    vẫn hiển thị đúng tên nhân viên.
 * 3. Set permanentlyDeletedAt — để phân biệt "thùng rác" vs "đã lưu trữ".
 * 4. Gỡ liên kết User account (nếu có).
 *
 * Lý do: Employee có FK bắt buộc từ Order.salespersonId, Task.creatorId, v.v.
 * Hard-delete sẽ phá vỡ tất cả dữ liệu liên quan.
 */
export const DELETE = apiHandler(async (_request, { session, params }) => {
    const { systemId } = params

    const existing = await prisma.employee.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Employee')
    }

    if (!existing.isDeleted) {
      return apiError('Nhân viên phải ở trong thùng rác trước khi lưu trữ vĩnh viễn', 400)
    }

    if (existing.permanentlyDeletedAt) {
      return apiError('Nhân viên đã được lưu trữ vĩnh viễn', 400)
    }

    await prisma.$transaction(async (tx) => {
      // Gỡ liên kết User account — nhân viên đã xóa không cần login
      await tx.user.updateMany({
        where: { employeeId: systemId },
        data: { employeeId: null },
      }).catch(() => {});

      // Gỡ subordinates — không còn quản lý ai
      await tx.employee.updateMany({
        where: { managerId: systemId },
        data: { managerId: null },
      }).catch(() => {});

      // Lưu trữ: xóa PII nhạy cảm, giữ lại tên + mã + phòng ban + chi nhánh
      await tx.employee.update({
        where: { systemId },
        data: {
          permanentlyDeletedAt: new Date(),
          // Xóa PII nhạy cảm
          phone: null,
          personalEmail: null,
          workEmail: null,
          nationalId: null,
          nationalIdIssueDate: null,
          nationalIdIssuePlace: null,
          dob: null,
          placeOfBirth: null,
          permanentAddress: Prisma.JsonNull,
          temporaryAddress: Prisma.JsonNull,
          bankAccountNumber: null,
          bankName: null,
          bankBranch: null,
          personalTaxId: null,
          socialInsuranceNumber: null,
          emergencyContactName: null,
          emergencyContactPhone: null,
          avatarUrl: null,
          avatar: null,
          // Xóa dữ liệu lương
          baseSalary: null,
          socialInsuranceSalary: null,
          positionAllowance: null,
          mealAllowance: null,
          otherAllowances: null,
          // Xóa dữ liệu skills/notes
          skills: Prisma.JsonNull,
          certifications: Prisma.JsonNull,
          notes: null,
          // GIỮ LẠI: systemId, id, fullName, departmentId, branchId, jobTitleId
          // → Đơn hàng, task, v.v. vẫn hiển thị đúng tên nhân viên
        },
      });
    });

    // Log activity
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'employee',
          entityId: systemId,
          action: 'permanently_archived',
          actionType: 'delete',
          note: `Lưu trữ vĩnh viễn nhân viên: ${existing.fullName} (${existing.id})`,
          metadata: { userName },
          createdBy: userName,
        },
      })
    ).catch(e => logError('[ActivityLog] permanent archive failed', e))

    return apiSuccess({ success: true, systemId })
}, { permission: 'delete_employees' })