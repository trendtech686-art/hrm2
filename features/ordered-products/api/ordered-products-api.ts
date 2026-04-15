import type { OrderedProductItem, OrderedProductsParams } from '../types'

interface PaginatedResponse {
  data: OrderedProductItem[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export async function fetchOrderedProducts(params: OrderedProductsParams = {}): Promise<PaginatedResponse> {
  const sp = new URLSearchParams()
  if (params.page) sp.set('page', String(params.page))
  if (params.limit) sp.set('limit', String(params.limit))
  if (params.search) sp.set('search', params.search)
  if (params.supplierId) sp.set('supplierId', params.supplierId)
  if (params.status) sp.set('status', params.status)
  if (params.dateFrom) sp.set('dateFrom', params.dateFrom)
  if (params.dateTo) sp.set('dateTo', params.dateTo)
  if (params.sortBy) sp.set('sortBy', params.sortBy)
  if (params.sortOrder) sp.set('sortOrder', params.sortOrder)

  const res = await fetch(`/api/ordered-products?${sp}`, { credentials: 'include' })
  if (!res.ok) {
    throw new Error('Không thể tải danh sách hàng đặt')
  }
  return res.json()
}
