import { Prisma } from '@/generated/prisma/client'

type ComboItem = {
  productSystemId: string
  quantity: number
}

type LineItemForStock = {
  productId: string | null
  productName?: string | null
  quantity: number
}

/**
 * Resolve line items to actual stock items.
 * For combo products, expands into child component products with multiplied quantities.
 * For normal products, returns as-is.
 */
export async function resolveStockItems(
  tx: Prisma.TransactionClient,
  lineItems: LineItemForStock[]
): Promise<Array<{ productId: string; quantity: number; productName: string }>> {
  const productIds = lineItems.map(i => i.productId).filter(Boolean) as string[]
  if (productIds.length === 0) return []

  // Fetch product type and comboItems for all line items
  const products = await tx.product.findMany({
    where: { systemId: { in: productIds } },
    select: { systemId: true, type: true, comboItems: true, name: true },
  })
  const productMap = new Map(products.map(p => [p.systemId, p]))

  const stockItems: Array<{ productId: string; quantity: number; productName: string }> = []

  for (const item of lineItems) {
    if (!item.productId) continue
    const product = productMap.get(item.productId)
    if (!product) continue

    if (product.type === 'COMBO' && product.comboItems) {
      // Expand combo into child products
      const comboChildren = product.comboItems as ComboItem[]
      for (const child of comboChildren) {
        // Each child quantity = child.quantity * ordered combo quantity
        const childProduct = await tx.product.findUnique({
          where: { systemId: child.productSystemId },
          select: { systemId: true, name: true },
        })
        stockItems.push({
          productId: child.productSystemId,
          quantity: child.quantity * item.quantity,
          productName: childProduct?.name || child.productSystemId,
        })
      }
    } else {
      // Normal product — pass through
      stockItems.push({
        productId: item.productId,
        quantity: item.quantity,
        productName: item.productName || product.name,
      })
    }
  }

  // Merge duplicate productIds (same child might appear in multiple combos)
  const merged = new Map<string, { productId: string; quantity: number; productName: string }>()
  for (const si of stockItems) {
    const existing = merged.get(si.productId)
    if (existing) {
      existing.quantity += si.quantity
    } else {
      merged.set(si.productId, { ...si })
    }
  }

  return Array.from(merged.values())
}
