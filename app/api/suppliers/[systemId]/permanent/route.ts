import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// DELETE /api/suppliers/[systemId]/permanent - Permanently delete supplier
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Check if supplier exists
    const existing = await prisma.supplier.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Supplier')
    }

    // Delete supplier and handle related records
    // Related records will have supplierId set to null - preserves historical data
    await prisma.$transaction(async (tx) => {
      // Set supplierSystemId = null on related records (preserve historical data)
      await tx.inventoryReceipt.updateMany({ 
        where: { supplierSystemId: systemId }, 
        data: { supplierSystemId: undefined } 
      }).catch(() => {});
      
      await tx.payment.updateMany({ 
        where: { supplierId: systemId }, 
        data: { supplierId: null } 
      }).catch(() => {});
      
      // Finally delete the supplier
      await tx.supplier.delete({ where: { systemId } });
    });

    return apiSuccess({ success: true, systemId })
  } catch (error) {
    console.error('Error permanently deleting supplier:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return apiError('Không thể xóa nhà cung cấp vì có dữ liệu liên quan. Vui lòng giữ trong thùng rác.', 400)
      }
    }
    
    return apiError('Failed to permanently delete supplier', 500)
  }
}
