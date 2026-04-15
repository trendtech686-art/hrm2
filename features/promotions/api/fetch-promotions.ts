const BASE_URL = '/api/promotions'

export interface PromotionItem {
  systemId: string
  id: string
  code: string
  description: string | null
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  minOrderAmount: number | null
  maxDiscount: number | null
  startDate: string | null
  endDate: string | null
  usageLimit: number | null
  usageCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ValidatePromotionResult {
  code: string
  description: string | null
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  discountAmount: number
}

export async function fetchPromotions(params?: { search?: string; activeOnly?: boolean; page?: number; limit?: number }) {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.activeOnly) searchParams.set('activeOnly', 'true')
  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.limit) searchParams.set('limit', params.limit.toString())

  const res = await fetch(`${BASE_URL}?${searchParams}`)
  if (!res.ok) throw new Error('Lỗi tải danh sách khuyến mãi')
  return res.json()
}

export async function validatePromotionCode(code: string, orderTotal: number): Promise<ValidatePromotionResult> {
  const res = await fetch(`${BASE_URL}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, orderTotal }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Mã giảm giá không hợp lệ')
  return json.data
}

export async function createPromotion(data: Omit<PromotionItem, 'systemId' | 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Lỗi tạo khuyến mãi')
  return json.data
}

export async function updatePromotion(systemId: string, data: Partial<PromotionItem>) {
  const res = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Lỗi cập nhật khuyến mãi')
  return json.data
}

export async function deletePromotion(systemId: string) {
  const res = await fetch(`${BASE_URL}/${systemId}`, { method: 'DELETE' })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Lỗi xóa khuyến mãi')
  return json.data
}
