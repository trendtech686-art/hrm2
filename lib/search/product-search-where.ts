import type { Prisma } from '@/generated/prisma/client'
import { buildSearchWhere } from './build-search-where'

/**
 * Shortcut tokenize search cho sản phẩm — dùng `buildSearchWhere` helper chung.
 * Giữ file riêng để các route products vẫn `import { buildProductSearchWhere }` như cũ.
 */
const PRODUCT_SEARCH_FIELDS = [
  'name',
  'id',
  { key: 'barcode', caseSensitive: true },
  'nameVat',
] as const

export function buildProductSearchWhere(
  raw: string | null | undefined,
): Prisma.ProductWhereInput | undefined {
  return buildSearchWhere<Prisma.ProductWhereInput>(raw, PRODUCT_SEARCH_FIELDS)
}
