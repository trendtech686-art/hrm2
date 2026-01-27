import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// DELETE /api/employees/[systemId]/permanent - Permanently delete employee
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Check if employee exists
    const existing = await prisma.employee.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Employee')
    }

    // Delete employee and handle related records
    // Related records will have employeeId set to null - preserves historical data
    await prisma.$transaction(async (tx) => {
      // HRM related - set employeeId = null (preserve historical data)
      await tx.attendanceRecord.updateMany({ 
        where: { employeeId: systemId }, 
        data: { employeeId: undefined } 
      }).catch(() => {});
      
      await tx.leave.updateMany({ 
        where: { employeeId: systemId }, 
        data: { employeeId: undefined } 
      }).catch(() => {});
      
      await tx.payrollItem.updateMany({ 
        where: { employeeId: systemId }, 
        data: { employeeId: undefined } 
      }).catch(() => {});
      
      await tx.penalty.updateMany({ 
        where: { employeeId: systemId }, 
        data: { employeeId: undefined } 
      }).catch(() => {});
      
      // Finance related - set employeeId = null
      await tx.payment.updateMany({ 
        where: { employeeId: systemId }, 
        data: { employeeId: undefined } 
      }).catch(() => {});
      
      await tx.receipt.updateMany({ 
        where: { employeeId: systemId }, 
        data: { employeeId: undefined } 
      }).catch(() => {});
      
      // Inventory related - set employeeId = null
      await tx.costAdjustment.updateMany({ 
        where: { employeeId: systemId }, 
        data: { employeeId: undefined } 
      }).catch(() => {});
      
      await tx.inventoryCheck.updateMany({ 
        where: { employeeId: systemId }, 
        data: { employeeId: null } 
      }).catch(() => {});
      
      await tx.inventoryReceipt.updateMany({ 
        where: { employeeId: systemId }, 
        data: { employeeId: null } 
      }).catch(() => {});
      
      await tx.stockTransfer.updateMany({ 
        where: { employeeId: systemId }, 
        data: { employeeId: null } 
      }).catch(() => {});
      
      // Operations related - set employeeId = null
      await tx.packaging.updateMany({ 
        where: { employeeId: systemId }, 
        data: { employeeId: null } 
      }).catch(() => {});
      
      // Auth - unlink user from employee
      await tx.user.updateMany({ 
        where: { employeeId: systemId }, 
        data: { employeeId: null } 
      }).catch(() => {});
      
      // Delete user preferences
      await tx.userPreference.deleteMany({ where: { userId: systemId } }).catch(() => {});
      
      // Update subordinates - remove manager reference
      await tx.employee.updateMany({ 
        where: { managerId: systemId }, 
        data: { managerId: null } 
      }).catch(() => {});
      
      // Finally delete the employee
      await tx.employee.delete({ where: { systemId } });
    });

    return apiSuccess({ success: true, systemId })
  } catch (error) {
    console.error('Error permanently deleting employee:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return apiError('Không thể xóa nhân viên vì có dữ liệu liên quan. Vui lòng giữ trong thùng rác.', 400)
      }
    }
    
    return apiError('Failed to permanently delete employee', 500)
  }
}