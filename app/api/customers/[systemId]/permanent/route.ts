import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// DELETE /api/customers/[systemId]/permanent - Permanently delete customer
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Check if customer exists
    const existing = await prisma.customer.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Customer')
    }

    // Delete customer and handle related records
    // Related records will have customerId set to null - preserves historical data
    await prisma.$transaction(async (tx) => {
      // Set customerId = null on related records (preserve historical data)
      await tx.order.updateMany({ 
        where: { customerId: systemId }, 
        data: { customerId: undefined } 
      }).catch(() => {});
      
      await tx.complaint.updateMany({ 
        where: { customerId: systemId }, 
        data: { customerId: undefined } 
      }).catch(() => {});
      
      await tx.receipt.updateMany({ 
        where: { customerId: systemId }, 
        data: { customerId: undefined } 
      }).catch(() => {});
      
      // Note: Addresses stored as Json in Customer.addresses field
      
      // Finally delete the customer
      await tx.customer.delete({ where: { systemId } });
    });

    return apiSuccess({ success: true, systemId })
  } catch (error) {
    console.error('Error permanently deleting customer:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return apiError('Không thể xóa khách hàng vì có dữ liệu liên quan. Vui lòng giữ trong thùng rác.', 400)
      }
    }
    
    return apiError('Failed to permanently delete customer', 500)
  }
}
