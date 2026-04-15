/**
 * Reconciliation Sheet API Client
 * 
 * Read operations via API Routes.
 * Mutations (create, update, delete, confirm) also via API Routes (Hybrid pattern).
 */

const BASE_URL = '/api/reconciliation-sheets'

// ─── Types ─────────────────────────────────────────────────

export type ReconciliationSheetStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED'

export interface ReconciliationSheetItem {
  systemId: string
  sheetId: string
  packagingId: string
  trackingCode: string
  orderId: string
  orderSystemId: string
  customerName: string | null
  codSystem: number
  codPartner: number
  codDifference: number
  feeSystem: number
  feePartner: number
  feeDifference: number
  note: string | null
  createdAt: string
  updatedAt: string
  packaging?: {
    systemId: string
    deliveryStatus: string | null
    deliveredDate: string | null
    carrier: string | null
  }
}

export interface ReconciliationSheet {
  systemId: string
  id: string
  carrier: string
  branchId: string | null
  status: ReconciliationSheetStatus
  totalCodSystem: number
  totalCodPartner: number
  totalFeeSystem: number
  totalFeePartner: number
  codDifference: number
  feeDifference: number
  note: string | null
  tags: string[]
  createdBy: string | null
  createdByName: string | null
  updatedBy: string | null
  confirmedAt: string | null
  confirmedBy: string | null
  createdAt: string
  updatedAt: string
  items: ReconciliationSheetItem[]
  branch?: { systemId: string; name: string } | null
  _count?: { items: number }
}

export interface ReconciliationSheetsParams {
  page?: number
  limit?: number
  search?: string
  status?: ReconciliationSheetStatus
  carrier?: string
}

export interface ReconciliationSheetsResponse {
  data: ReconciliationSheet[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export interface CreateSheetItemInput {
  packagingId: string
  trackingCode: string
  orderId: string
  orderSystemId: string
  customerName?: string
  codSystem: number
  codPartner: number
  feeSystem: number
  feePartner: number
  note?: string
}

export interface CreateSheetInput {
  carrier: string
  branchId?: string
  note?: string
  tags?: string[]
  items: CreateSheetItemInput[]
}

export interface AvailableShipment {
  systemId: string
  id: string
  trackingCode: string | null
  carrier: string | null
  codAmount: number
  shippingFeeToPartner: number | null
  deliveredDate: string | null
  deliveryStatus: string | null
  reconciliationStatus: string | null
  orderId: string | null
  order: {
    systemId: string
    id: string
    customerName: string | null
  } | null
}

export interface AvailableShipmentsResponse {
  data: AvailableShipment[]
  total: number
  hasMore: boolean
}

// ─── Fetch Functions ───────────────────────────────────────

export async function fetchCarriers(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/carriers`)
  if (!res.ok) throw new Error('Không thể tải danh sách đối tác vận chuyển')
  return res.json()
}

export async function fetchReconciliationSheets(params: ReconciliationSheetsParams = {}): Promise<ReconciliationSheetsResponse> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)
  if (params.carrier) searchParams.set('carrier', params.carrier)

  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL
  const res = await fetch(url)
  if (!res.ok) throw new Error('Không thể tải danh sách phiếu đối soát')
  return res.json()
}

export async function fetchReconciliationSheet(systemId: string): Promise<ReconciliationSheet> {
  const res = await fetch(`${BASE_URL}/${systemId}`)
  if (!res.ok) throw new Error('Không thể tải chi tiết phiếu đối soát')
  return res.json()
}

export async function fetchAvailableShipments(params: { carrier?: string; search?: string; limit?: number; offset?: number } = {}): Promise<AvailableShipmentsResponse> {
  const searchParams = new URLSearchParams()
  if (params.carrier) searchParams.set('carrier', params.carrier)
  if (params.search) searchParams.set('search', params.search)
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.offset) searchParams.set('offset', String(params.offset))

  const url = searchParams.toString() ? `${BASE_URL}/available-shipments?${searchParams}` : `${BASE_URL}/available-shipments`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Không thể tải danh sách vận đơn')
  return res.json()
}

// ─── Mutations ─────────────────────────────────────────────

export async function createReconciliationSheet(data: CreateSheetInput): Promise<ReconciliationSheet> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error || 'Không thể tạo phiếu đối soát')
  }
  return res.json()
}

export async function deleteReconciliationSheet(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${systemId}`, { method: 'DELETE' })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error || 'Không thể xóa phiếu đối soát')
  }
}

export async function confirmReconciliationSheet(systemId: string): Promise<ReconciliationSheet> {
  const res = await fetch(`${BASE_URL}/${systemId}/confirm`, { method: 'POST' })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error || 'Không thể xác nhận phiếu đối soát')
  }
  return res.json()
}
