'use client'

import { useQuery } from '@tanstack/react-query'

export interface ActivityLogEntry {
  systemId: string
  entityType: string
  entityId: string
  action: string
  actionType: string | null
  changes: Record<string, { from: unknown; to: unknown }> | null
  metadata: Record<string, unknown> | null
  note: string | null
  createdAt: string
  createdBy: string | null
  // Computed fields
  userName: string
  description: string
}

interface ActivityLogsResponse {
  data: ActivityLogEntry[]
  total: number
  limit: number
  offset: number
}

const fieldLabels: Record<string, string> = {
  name: 'Tên khách hàng',
  email: 'Email',
  phone: 'Số điện thoại',
  zaloPhone: 'Zalo',
  company: 'Công ty',
  companyName: 'Tên công ty',
  taxCode: 'Mã số thuế',
  representative: 'Người đại diện',
  position: 'Chức vụ',
  gender: 'Giới tính',
  dateOfBirth: 'Ngày sinh',
  address: 'Địa chỉ',
  province: 'Tỉnh/Thành phố',
  district: 'Quận/Huyện',
  ward: 'Phường/Xã',
  addresses: 'Danh sách địa chỉ',
  contacts: 'Người liên hệ',
  currentDebt: 'Công nợ hiện tại',
  maxDebt: 'Hạn mức công nợ',
  status: 'Trạng thái',
  type: 'Loại khách hàng',
  customerGroup: 'Nhóm khách hàng',
  pricingLevel: 'Mức giá',
  pricingPolicyId: 'Chính sách giá',
  defaultDiscount: 'Giảm giá mặc định',
  source: 'Nguồn khách hàng',
  campaign: 'Chiến dịch',
  referredBy: 'Người giới thiệu',
  bankName: 'Ngân hàng',
  bankAccount: 'Số tài khoản',
  paymentTerms: 'Hạn thanh toán',
  creditRating: 'Xếp hạng tín dụng',
  allowCredit: 'Cho phép công nợ',
  lifecycleStage: 'Giai đoạn vòng đời',
  contract: 'Hợp đồng',
  businessProfiles: 'Thông tin doanh nghiệp',
  images: 'Hình ảnh',
  social: 'Mạng xã hội',
  lastContactDate: 'Ngày liên hệ cuối',
  nextFollowUpDate: 'Ngày theo dõi tiếp',
  followUpReason: 'Lý do theo dõi',
  followUpAssigneeId: 'Người phụ trách',
  notes: 'Ghi chú',
  tags: 'Thẻ',
  accountManagerId: 'NV phụ trách',
}

const actionDescriptions: Record<string, string> = {
  created: 'Tạo mới khách hàng',
  updated: 'Cập nhật thông tin',
  deleted: 'Xóa khách hàng',
  status_changed: 'Thay đổi trạng thái',
  restored: 'Khôi phục khách hàng',
}

function buildDescription(log: Omit<ActivityLogEntry, 'userName' | 'description'>): string {
  const base = actionDescriptions[log.action] || log.action

  if (log.note) {
    return log.note
  }

  if (log.changes && typeof log.changes === 'object') {
    const changedFields = Object.keys(log.changes)
      .map((k) => fieldLabels[k] || k)
      .slice(0, 3)
    
    if (changedFields.length > 0) {
      const suffix = changedFields.length < Object.keys(log.changes).length
        ? ` (+${Object.keys(log.changes).length - changedFields.length} trường khác)`
        : ''
      return `${base}: ${changedFields.join(', ')}${suffix}`
    }
  }

  return base
}

function enrichLog(log: Omit<ActivityLogEntry, 'userName' | 'description'>): ActivityLogEntry {
  const userName = (log.metadata as Record<string, unknown>)?.userName as string | undefined
  return {
    ...log,
    userName: userName || log.createdBy || 'Hệ thống',
    description: buildDescription(log),
  }
}

interface UseCustomerActivityOptions {
  page: number
  pageSize: number
}

export function useCustomerActivity(
  customerSystemId: string | undefined,
  options: UseCustomerActivityOptions = { page: 0, pageSize: 10 }
) {
  const { page, pageSize } = options
  const offset = page * pageSize

  return useQuery({
    queryKey: ['activity-logs', 'customer', customerSystemId, page, pageSize],
    queryFn: async (): Promise<ActivityLogsResponse> => {
      const res = await fetch(
        `/api/activity-logs?entityType=customer&entityId=${customerSystemId}&limit=${pageSize}&offset=${offset}`
      )
      if (!res.ok) throw new Error('Failed to fetch activity logs')
      const json = await res.json()
      return {
        ...json,
        data: json.data.map(enrichLog),
      }
    },
    enabled: !!customerSystemId,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  })
}
