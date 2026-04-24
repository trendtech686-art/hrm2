import type { Prisma } from '@/generated/prisma/client'

/**
 * Build Prisma `where` cho tìm kiếm sản phẩm theo ô search dạng free-text.
 *
 * Hỗ trợ tokenize theo khoảng trắng: chuỗi "wtp-009 s s26" sẽ match
 * sản phẩm "Cường Lực VN Wekome WTP-009 SAM S26 Plus" (AND các token, OR qua
 * các field: `name`, `id`, `barcode`, `nameVat`).
 *
 * Ghi chú:
 * - `contains` của Postgres với `mode: 'insensitive'` tương đương ILIKE %x%.
 * - Barcode không cần `mode` vì mã vạch thường là chữ + số, không có trường hợp case.
 * - Trả `undefined` khi query trống để caller quyết định có gắn filter hay không.
 */
export function buildProductSearchWhere(
  raw: string | null | undefined,
): Prisma.ProductWhereInput | undefined {
  if (!raw) return undefined
  const tokens = raw
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)

  if (tokens.length === 0) return undefined

  const fieldConditions = (t: string): Prisma.ProductWhereInput[] => [
    { name: { contains: t, mode: 'insensitive' } },
    { id: { contains: t, mode: 'insensitive' } },
    { barcode: { contains: t } },
    { nameVat: { contains: t, mode: 'insensitive' } },
  ]

  if (tokens.length === 1) {
    return { OR: fieldConditions(tokens[0]) }
  }

  return {
    AND: tokens.map((token) => ({ OR: fieldConditions(token) })),
  }
}
