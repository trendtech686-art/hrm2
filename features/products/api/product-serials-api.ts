export type ProductSerialItem = {
  systemId: string
  productId: string
  branchId: string
  serialNumber: string
  status: 'IN_STOCK' | 'SOLD' | 'IN_WARRANTY' | 'RETURNED' | 'DAMAGED' | 'TRANSFERRED'
  purchaseOrderId: string | null
  orderId: string | null
  warrantyId: string | null
  customerId: string | null
  supplierName: string | null
  costPrice: number | null
  soldPrice: number | null
  soldDate: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export async function fetchProductSerials(params: {
  productId?: string
  branchId?: string
  status?: string
  search?: string
  orderId?: string
  page?: number
  limit?: number
}): Promise<{ data: ProductSerialItem[]; total: number }> {
  const sp = new URLSearchParams()
  if (params.productId) sp.set('productId', params.productId)
  if (params.branchId) sp.set('branchId', params.branchId)
  if (params.status) sp.set('status', params.status)
  if (params.search) sp.set('search', params.search)
  if (params.orderId) sp.set('orderId', params.orderId)
  if (params.page) sp.set('page', String(params.page))
  if (params.limit) sp.set('limit', String(params.limit))

  const res = await fetch(`/api/product-serials?${sp}`)
  if (!res.ok) throw new Error('Không thể tải danh sách serial')
  const json = await res.json()
  return { data: json.data, total: json.pagination?.total ?? json.data.length }
}

export async function createProductSerial(data: {
  productId: string
  branchId: string
  serialNumber: string
  purchaseOrderId?: string
  supplierName?: string
  costPrice?: number
  notes?: string
}): Promise<ProductSerialItem> {
  const res = await fetch('/api/product-serials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Không thể tạo serial')
  }
  const json = await res.json()
  return json.data
}

export async function bulkCreateSerials(data: {
  productId: string
  branchId: string
  serialNumbers: string[]
  purchaseOrderId?: string
  supplierName?: string
  costPrice?: number
}): Promise<{ count: number }> {
  const res = await fetch('/api/product-serials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Không thể tạo serial')
  }
  const json = await res.json()
  return json.data
}

export async function updateProductSerial(
  systemId: string,
  data: Partial<Pick<ProductSerialItem, 'status' | 'branchId' | 'orderId' | 'warrantyId' | 'customerId' | 'notes'> & {
    soldPrice: number | null
    soldDate: string | null
  }>
): Promise<ProductSerialItem> {
  const res = await fetch(`/api/product-serials/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Không thể cập nhật serial')
  }
  const json = await res.json()
  return json.data
}

export async function deleteProductSerial(systemId: string): Promise<void> {
  const res = await fetch(`/api/product-serials/${systemId}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Không thể xóa serial')
  }
}
