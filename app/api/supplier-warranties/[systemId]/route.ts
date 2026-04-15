/**
 * API Routes for Supplier Warranty Detail
 * GET /api/supplier-warranties/[systemId] — Get detail
 */
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, serializeDecimals } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export const GET = apiHandler(async (_req, { params }) => {
  const { systemId } = await params

  const warranty = await prisma.supplierWarranty.findFirst({
    where: {
      OR: [
        { systemId: systemId as string },
        { id: systemId as string },
      ],
      isDeleted: false,
    },
    include: {
      items: true,
      packagings: {
        orderBy: { createdAt: 'desc' },
        select: {
          systemId: true, id: true, status: true, deliveryStatus: true,
          deliveryMethod: true, trackingCode: true, carrier: true, service: true,
          notes: true, cancelReason: true, requestingEmployeeName: true,
          confirmDate: true, cancelDate: true, deliveredDate: true,
          shippingFeeToPartner: true, codAmount: true, payer: true,
          reconciliationStatus: true, weight: true, dimensions: true, noteToShipper: true,
          createdAt: true,
        },
      },
    },
  })

  if (!warranty) {
    return apiError('Phiếu BH NCC không tồn tại', 404)
  }

  return apiSuccess(serializeDecimals(warranty))
}, { permission: 'view_supplier_warranty' })
