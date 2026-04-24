/**
 * Helper tokenize search cho Prisma `where` clause.
 *
 * Mô hình: với raw query "wtp-009 s s26" và fields ['name', 'id', 'barcode']
 * sẽ build ra where dạng:
 *
 *   AND: [
 *     { OR: [ {name: {contains:'wtp-009',mode:'insensitive'}}, {id: ...}, {barcode: ...} ] },
 *     { OR: [ {name: {contains:'s',mode:'insensitive'}},       {id: ...}, {barcode: ...} ] },
 *     { OR: [ {name: {contains:'s26',mode:'insensitive'}},     {id: ...}, {barcode: ...} ] },
 *   ]
 *
 * → mọi token phải match ít nhất 1 field (case-insensitive).
 *
 * Dùng chung cho tất cả entity: product, customer, order, employee, supplier, …
 *
 * Lưu ý field:
 * - Mặc định dùng `mode: 'insensitive'` (Postgres ILIKE).
 * - Một số field phải so khớp chính xác chữ hoa/thường (vd mã hàng barcode, số thuế),
 *   khai báo dạng object `{ key: 'barcode', caseSensitive: true }` để bỏ `mode`.
 * - Field có thể là nested path: khai báo dạng `{ key: 'category.name' }` → helper sẽ
 *   tách `.` và bọc lồng đúng kiểu `{ category: { name: { contains: ... } } }`.
 */

export type SearchFieldSpec =
  | string
  | { key: string; caseSensitive?: boolean }

interface FieldDescriptor {
  path: string[]
  caseSensitive: boolean
}

function toDescriptor(spec: SearchFieldSpec): FieldDescriptor {
  if (typeof spec === 'string') {
    return { path: spec.split('.'), caseSensitive: false }
  }
  return {
    path: spec.key.split('.'),
    caseSensitive: spec.caseSensitive ?? false,
  }
}

function buildNestedContains(
  descriptor: FieldDescriptor,
  token: string,
): Record<string, unknown> {
  const leaf: Record<string, unknown> = {
    contains: token,
  }
  if (!descriptor.caseSensitive) {
    leaf.mode = 'insensitive'
  }
  // Dựng ngược từ leaf lên root để hỗ trợ nested relation (vd: 'brand.name').
  return descriptor.path.reduceRight<Record<string, unknown>>(
    (acc, segment) => ({ [segment]: acc }),
    leaf,
  )
}

/**
 * Tách query thành các token theo whitespace. Loại token rỗng, giữ nguyên thứ tự.
 */
export function tokenizeSearch(raw: string | null | undefined): string[] {
  if (!raw) return []
  return raw
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
}

/**
 * Build `where` fragment tokenize cho Prisma. Trả về `undefined` khi query rỗng.
 */
export function buildSearchWhere<T extends Record<string, unknown> = Record<string, unknown>>(
  raw: string | null | undefined,
  fields: readonly SearchFieldSpec[],
): T | undefined {
  const tokens = tokenizeSearch(raw)
  if (tokens.length === 0 || fields.length === 0) return undefined

  const descriptors = fields.map(toDescriptor)

  const fieldConditions = (token: string) =>
    descriptors.map((desc) => buildNestedContains(desc, token))

  if (tokens.length === 1) {
    return { OR: fieldConditions(tokens[0]) } as unknown as T
  }

  return {
    AND: tokens.map((token) => ({ OR: fieldConditions(token) })),
  } as unknown as T
}
