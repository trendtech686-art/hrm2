export type ProductBatchItem = {
  systemId: string
  productId: string
  branchId: string
  batchNumber: string
  manufactureDate: string | null
  expiryDate: string | null
  quantity: number
  initialQty: number
  supplierName: string | null
  notes: string | null
  status: 'ACTIVE' | 'EXPIRED' | 'DEPLETED' | 'DISPOSED'
  createdAt: string
  updatedAt: string
}

export async function fetchProductBatches(params: {
  productId?: string
  branchId?: string
  status?: string
  nearExpiry?: number
  page?: number
  limit?: number
}): Promise<{ data: ProductBatchItem[]; total: number }> {
  const sp = new URLSearchParams()
  if (params.productId) sp.set('productId', params.productId)
  if (params.branchId) sp.set('branchId', params.branchId)
  if (params.status) sp.set('status', params.status)
  if (params.nearExpiry) sp.set('nearExpiry', String(params.nearExpiry))
  if (params.page) sp.set('page', String(params.page))
  if (params.limit) sp.set('limit', String(params.limit))

  const res = await fetch(`/api/product-batches?${sp}`)
  if (!res.ok) throw new Error('Không thể tải danh sách lô hàng')
  const json = await res.json()
  return { data: json.data, total: json.pagination?.total ?? json.data.length }
}

export async function createProductBatch(data: {
  productId: string
  branchId: string
  batchNumber: string
  manufactureDate?: string
  expiryDate?: string
  quantity: number
  supplierName?: string
  notes?: string
}): Promise<ProductBatchItem> {
  const res = await fetch('/api/product-batches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Không thể tạo lô hàng')
  }
  const json = await res.json()
  return json.data
}

export async function updateProductBatch(
  systemId: string,
  data: Partial<Pick<ProductBatchItem, 'batchNumber' | 'quantity' | 'supplierName' | 'notes' | 'status'> & {
    manufactureDate: string | null
    expiryDate: string | null
  }>
): Promise<ProductBatchItem> {
  const res = await fetch(`/api/product-batches/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Không thể cập nhật lô hàng')
  }
  const json = await res.json()
  return json.data
}

export async function deleteProductBatch(systemId: string): Promise<void> {
  const res = await fetch(`/api/product-batches/${systemId}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Không thể xóa lô hàng')
  }
}
