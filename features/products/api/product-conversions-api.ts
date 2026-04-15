
export type ProductConversionItem = {
  systemId: string
  baseProductId: string
  conversionUnit: string
  conversionRate: number
  sku: string | null
  barcode: string | null
  name: string | null
  sellingPrice: number | null
  costPrice: number | null
  weight: number | null
  weightUnit: string | null
  thumbnailImage: string | null
  isActive: boolean
  sortOrder: number | null
  baseProduct?: { systemId: string; id: string; name: string; unit: string }
}

export async function fetchProductConversions(baseProductId: string): Promise<ProductConversionItem[]> {
  const res = await fetch(`/api/product-conversions?baseProductId=${baseProductId}`)
  if (!res.ok) throw new Error('Không thể tải sản phẩm quy đổi')
  const json = await res.json()
  return json.data
}

export async function createProductConversion(data: {
  baseProductId: string
  conversionUnit: string
  conversionRate: number
  sku?: string
  barcode?: string
  name?: string
  sellingPrice?: number
  costPrice?: number
  weight?: number
  weightUnit?: string
}): Promise<ProductConversionItem> {
  const res = await fetch('/api/product-conversions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Không thể tạo sản phẩm quy đổi')
  }
  const json = await res.json()
  return json.data
}

export async function updateProductConversion(
  systemId: string,
  data: Partial<Omit<ProductConversionItem, 'systemId' | 'baseProductId' | 'baseProduct'>>
): Promise<ProductConversionItem> {
  const res = await fetch(`/api/product-conversions/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Không thể cập nhật sản phẩm quy đổi')
  }
  const json = await res.json()
  return json.data
}

export async function deleteProductConversion(systemId: string): Promise<void> {
  const res = await fetch(`/api/product-conversions/${systemId}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Không thể xóa sản phẩm quy đổi')
  }
}
