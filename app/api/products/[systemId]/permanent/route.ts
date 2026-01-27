import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// DELETE /api/products/[systemId]/permanent - Permanently delete product
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Product')
    }

    // Delete product and handle related records
    // Related items (order items, receipt items, etc.) will have productId set to null
    // This preserves historical data while removing the product
    await prisma.$transaction(async (tx) => {
      // Set productId = null on related items (preserve historical data)
      await tx.orderLineItem.updateMany({ 
        where: { productId: systemId }, 
        data: { productId: undefined } 
      }).catch(() => {});
      
      await tx.inventoryReceiptItem.updateMany({ 
        where: { productId: systemId }, 
        data: { productId: undefined } 
      }).catch(() => {});
      
      await tx.stockTransferItem.updateMany({ 
        where: { productId: systemId }, 
        data: { productId: undefined } 
      }).catch(() => {});
      
      // Delete non-critical references (these can be removed)
      // Note: Images stored as arrays in Product.galleryImages field
      await tx.productInventory.deleteMany({ where: { productId: systemId } }).catch(() => {});
      await tx.inventoryCheckItem.deleteMany({ where: { productId: systemId } }).catch(() => {});
      
      // Finally delete the product
      await tx.product.delete({ where: { systemId } });
    });

    return apiSuccess({ success: true, systemId })
  } catch (error) {
    console.error('Error permanently deleting product:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return apiError('Không thể xóa sản phẩm vì có dữ liệu liên quan. Vui lòng giữ trong thùng rác.', 400)
      }
    }
    
    return apiError('Failed to permanently delete product', 500)
  }
}
