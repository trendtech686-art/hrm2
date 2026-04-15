/**
 * Product Expiry Check API
 * 
 * POST /api/products/expiry-check
 * 
 * Checks if products have expired or near-expiry batches.
 * Frontend can call this before order creation to warn the user.
 */

import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { z } from 'zod'

const expiryCheckSchema = z.object({
  productIds: z.array(z.string()).min(1),
  branchId: z.string().optional(),
  warningDays: z.number().optional().default(30),
})

export const POST = apiHandler(async (request) => {
  const validation = await validateBody(request, expiryCheckSchema)
  if (!validation.success) return apiError(validation.error, 400)

  const { productIds, branchId, warningDays } = validation.data
    const now = new Date()
    const warningDate = new Date(now.getTime() + warningDays * 24 * 60 * 60 * 1000)

    // Get product names for display
    const products = await prisma.product.findMany({
      where: { systemId: { in: productIds } },
      select: { systemId: true, name: true },
    })
    const productNameMap = new Map(products.map(p => [p.systemId, p.name]))

    const batches = await prisma.productBatch.findMany({
      where: {
        productId: { in: productIds },
        ...(branchId ? { branchId } : {}),
        status: 'ACTIVE',
        expiryDate: { not: null },
      },
      select: {
        productId: true,
        batchNumber: true,
        expiryDate: true,
        quantity: true,
      },
      orderBy: { expiryDate: 'asc' },
    })

    const warnings: Array<{
      productId: string
      productName: string
      batchNumber: string
      expiryDate: string
      quantity: number
      status: 'expired' | 'near_expiry'
      daysRemaining: number
    }> = []

    for (const batch of batches) {
      if (!batch.expiryDate || batch.quantity <= 0) continue
      const daysRemaining = Math.ceil((batch.expiryDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))

      if (batch.expiryDate <= now) {
        warnings.push({
          productId: batch.productId,
          productName: productNameMap.get(batch.productId) || '',
          batchNumber: batch.batchNumber,
          expiryDate: batch.expiryDate.toISOString(),
          quantity: batch.quantity,
          status: 'expired',
          daysRemaining,
        })
      } else if (batch.expiryDate <= warningDate) {
        warnings.push({
          productId: batch.productId,
          productName: productNameMap.get(batch.productId) || '',
          batchNumber: batch.batchNumber,
          expiryDate: batch.expiryDate.toISOString(),
          quantity: batch.quantity,
          status: 'near_expiry',
          daysRemaining,
        })
      }
    }

    return apiSuccess({
      hasWarnings: warnings.length > 0,
      hasExpired: warnings.some(w => w.status === 'expired'),
      warnings,
    })
})
