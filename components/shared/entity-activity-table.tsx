'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table'
import { mobileBleedCardClass } from '@/components/layout/page-section'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ColumnDef } from '@/components/data-table/types'
import { formatDistanceToNow, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  History, Plus, Pencil, Trash2, FileText, User, Calendar,
  Eye, RotateCcw, Upload
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

// ==========================================
// TYPES
// ==========================================

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

export interface EntityActivityTableProps {
  entityType?: 'customer' | 'employee' | 'product' | 'supplier' | 'order'
    | 'purchase_order' | 'purchase_return' | 'sales_return' | 'stock_transfer'
    | 'inventory_check' | 'inventory_receipt' | 'receipt' | 'payment'
    | 'payroll' | 'attendance' | 'leave' | 'penalty' | 'task'
    | 'shipment' | 'packaging' | 'complaint' | 'warranty' | 'return_method'
    | 'wiki' | 'price_adjustment' | 'cost_adjustment' | 'status'
  entityTypes?: string[]
  entityId?: string | undefined
  fieldLabels?: Record<string, string>
  title?: string
}

// ==========================================
// DEFAULT FIELD LABELS
// ==========================================

const defaultFieldLabels: Record<string, string> = {
  // Common fields
  id: 'Mã SKU',
  name: 'Tên',
  email: 'Email',
  phone: 'Số điện thoại',
  status: 'Trạng thái',
  notes: 'Ghi chú',
  tags: 'Thẻ',
  createdAt: 'Ngày tạo',
  updatedAt: 'Ngày cập nhật',
  
  // Customer fields
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
  businessProfiles: 'Thông tin doanh nghiệp',
  images: 'Hình ảnh',
  social: 'Mạng xã hội',
  lastContactDate: 'Ngày liên hệ cuối',
  nextFollowUpDate: 'Ngày theo dõi tiếp',
  followUpReason: 'Lý do theo dõi',
  followUpAssigneeId: 'Người phụ trách',
  accountManagerId: 'NV phụ trách',
  
  // Employee fields
  fullName: 'Họ tên',
  firstName: 'Tên',
  lastName: 'Họ',
  dob: 'Ngày sinh',
  placeOfBirth: 'Nơi sinh',
  personalEmail: 'Email cá nhân',
  workEmail: 'Email công việc',
  nationalId: 'Số CCCD/CMND',
  nationalIdIssueDate: 'Ngày cấp CCCD',
  nationalIdIssuePlace: 'Nơi cấp CCCD',
  avatarUrl: 'Ảnh đại diện',
  permanentAddress: 'Địa chỉ thường trú',
  temporaryAddress: 'Địa chỉ tạm trú',
  departmentId: 'Phòng ban',
  jobTitleId: 'Chức danh',
  branchId: 'Chi nhánh',
  managerId: 'Quản lý trực tiếp',
  hireDate: 'Ngày vào làm',
  startDate: 'Ngày bắt đầu',
  employeeType: 'Loại nhân viên',
  role: 'Vai trò hệ thống',
  baseSalary: 'Lương cơ bản',
  socialInsuranceSalary: 'Lương đóng BHXH',
  positionAllowance: 'Phụ cấp chức vụ',
  mealAllowance: 'Phụ cấp ăn trưa',
  otherAllowances: 'Phụ cấp khác',
  numberOfDependents: 'Số người phụ thuộc',
  contractNumber: 'Số hợp đồng',
  contractStartDate: 'Ngày bắt đầu HĐ',
  contractEndDate: 'Ngày hết hạn HĐ',
  contractType: 'Loại hợp đồng',
  probationEndDate: 'Ngày kết thúc thử việc',
  terminationDate: 'Ngày nghỉ việc',
  bankAccountNumber: 'Số tài khoản',
  bankBranch: 'Chi nhánh NH',
  personalTaxId: 'Mã số thuế',
  socialInsuranceNumber: 'Số sổ BHXH',
  employmentStatus: 'Trạng thái làm việc',
  annualLeaveBalance: 'Số ngày phép',
  maritalStatus: 'Tình trạng hôn nhân',
  
  // Product fields
  description: 'Mô tả',
  shortDescription: 'Mô tả ngắn',
  thumbnailImage: 'Ảnh thumbnail',
  imageUrl: 'Ảnh chính',
  galleryImages: 'Ảnh gallery',
  brandId: 'Thương hiệu',
  unit: 'Đơn vị',
  costPrice: 'Giá vốn',
  lastPurchasePrice: 'Giá nhập gần nhất',
  isStockTracked: 'Theo dõi tồn kho',
  reorderLevel: 'Mức đặt hàng lại',
  safetyStock: 'Tồn kho an toàn',
  maxStock: 'Tồn kho tối đa',
  weight: 'Trọng lượng',
  weightUnit: 'Đơn vị trọng lượng',
  barcode: 'Mã vạch',
  warrantyPeriodMonths: 'Bảo hành (tháng)',
  primarySupplierId: 'Nhà cung cấp chính',
  isPublished: 'Đăng bán',
  isFeatured: 'Nổi bật',
  isOnSale: 'Đang giảm giá',
  isBestSeller: 'Bán chạy',
  isNewArrival: 'Mới về',
  publishedAt: 'Ngày đăng web',
  launchedDate: 'Ngày ra mắt',
  sortOrder: 'Thứ tự hiển thị',
  categories: 'Danh mục',
  slug: 'Slug',
  ktitle: 'Tiêu đề SEO',
  productTypeSystemId: 'Loại sản phẩm',
  storageLocationSystemId: 'Vị trí kho',
  dimensions: 'Kích thước',
  videoLinks: 'Link video',
  discontinuedDate: 'Ngày ngừng kinh doanh',
  sellerNote: 'Ghi chú nội bộ',
  seoDescription: 'Mô tả SEO',
  seoKeywords: 'Từ khóa SEO',
  nameVat: 'Tên hàng hóa (VAT)',
  origin: 'Xuất xứ',
  importerName: 'Đơn vị nhập khẩu',
  importerAddress: 'Địa chỉ nhập khẩu',
  usageGuide: 'Hướng dẫn sử dụng',
  seoPkgx: 'SEO PKGX',
  seoTrendtech: 'SEO Trendtech',
}

const actionDescriptions: Record<string, string> = {
  created: 'Tạo mới',
  updated: 'Cập nhật thông tin',
  deleted: 'Xóa',
  status_changed: 'Thay đổi trạng thái',
  restored: 'Khôi phục',
  document_uploaded: 'Tải lên tài liệu',
  document_deleted: 'Xóa tài liệu',
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function buildDescription(
  log: Omit<ActivityLogEntry, 'userName' | 'description'>,
  fieldLabels: Record<string, string>
): string {
  const base = actionDescriptions[log.action] || log.action

  if (log.note) {
    return log.note
  }

  if (log.changes && typeof log.changes === 'object') {
    const changedFields = Object.keys(log.changes)
      .map((k) => fieldLabels[k] || defaultFieldLabels[k] || k)
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

function enrichLog(
  log: Omit<ActivityLogEntry, 'userName' | 'description'>,
  fieldLabels: Record<string, string>
): ActivityLogEntry {
  const userName = (log.metadata as Record<string, unknown>)?.userName as string | undefined
  return {
    ...log,
    userName: userName || log.createdBy || '(không xác định)',
    description: buildDescription(log, fieldLabels),
  }
}

// Value label maps for common enum/setting values
const valueLabels: Record<string, Record<string, string>> = {
  status: { ACTIVE: 'Đang giao dịch', INACTIVE: 'Ngừng giao dịch' },
  customerGroup: { VIP: 'VIP', REGULAR: 'Thường xuyên', NEW: 'Khách mới', POTENTIAL: 'Tiềm năng', INACTIVE: 'Không hoạt động' },
  type: { INDIVIDUAL: 'Cá nhân', BUSINESS: 'Doanh nghiệp', WHOLESALE: 'Đại lý/Bán sỉ', PARTNER: 'Đối tác' },
  source: { WALK_IN: 'Đến trực tiếp', WEBSITE: 'Website', FACEBOOK: 'Facebook', ZALO: 'Zalo', REFERRAL: 'Giới thiệu', ADS: 'Quảng cáo', PHONE: 'Điện thoại' },
  pricingLevel: { RETAIL: 'Bán lẻ', WHOLESALE: 'Bán sỉ', VIP: 'VIP', PARTNER: 'Đối tác' },
  paymentTerms: { COD: 'Thanh toán ngay', NET7: 'Net 7', NET15: 'Net 15', NET30: 'Net 30', NET45: 'Net 45', NET60: 'Net 60' },
  creditRating: { AAA: 'AAA - Xuất sắc', AA: 'AA - Rất tốt', A: 'A - Tốt', B: 'B - Trung bình', C: 'C - Thấp', D: 'D - Xấu' },
  gender: { Nam: 'Nam', 'Nữ': 'Nữ', 'Khác': 'Khác' },
  employmentStatus: { ACTIVE: 'Đang làm việc', ON_LEAVE: 'Nghỉ phép', TERMINATED: 'Đã nghỉ việc', PROBATION: 'Thử việc' },
}

function formatValue(value: unknown, field: string): string {
  if (value === null || value === undefined) return '(trống)'

  // Treat empty string as empty
  if (typeof value === 'string' && value.trim() === '') return '(trống)'
  
  const dateFields = ['dateOfBirth', 'dob', 'hireDate', 'startDate', 'terminationDate',
    'contractStartDate', 'contractEndDate', 'probationEndDate', 'nationalIdIssueDate',
    'lastContactDate', 'nextFollowUpDate', 'createdAt', 'updatedAt']
  
  if (dateFields.includes(field) || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value))) {
    try {
      const date = new Date(value as string)
      if (!isNaN(date.getTime())) {
        return format(date, 'dd/MM/yyyy', { locale: vi })
      }
    } catch {
      // fallback to string
    }
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Có' : 'Không'
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) return '(trống)'
    return `${value.length} mục`
  }
  
  if (typeof value === 'object') {
    if (Object.keys(value as object).length === 0) return '(trống)'
    // Format object as readable key: value pairs
    const entries = Object.entries(value as Record<string, unknown>)
    return entries.map(([k, v]) => {
      const displayVal = typeof v === 'boolean' ? (v ? 'Bật' : 'Tắt') : String(v ?? '')
      return `${k}: ${displayVal}`
    }).join('\n')
  }

  // Look up Vietnamese labels for known enum values
  const fieldMap = valueLabels[field]
  if (fieldMap) {
    const label = fieldMap[String(value)]
    if (label) return label
  }
  
  return String(value)
}

// ==========================================
// HOOK
// ==========================================

function useEntityActivity(
  entityType: string | undefined,
  entityTypes: string[] | undefined,
  entityId: string | undefined,
  options: { page: number; pageSize: number },
  fieldLabels: Record<string, string>
) {
  const { page, pageSize } = options
  const offset = page * pageSize
  const typeParam = entityTypes?.length ? entityTypes.join(',') : entityType

  return useQuery({
    queryKey: ['activity-logs', typeParam, entityId, page, pageSize],
    queryFn: async (): Promise<ActivityLogsResponse> => {
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String(offset),
      })
      if (typeParam) params.set('entityType', typeParam)
      if (entityId) params.set('entityId', entityId)
      const res = await fetch(`/api/activity-logs?${params}`)
      if (!res.ok) throw new Error('Failed to fetch activity logs')
      const json = await res.json()
      return {
        ...json,
        data: json.data.map((log: Omit<ActivityLogEntry, 'userName' | 'description'>) => 
          enrichLog(log, fieldLabels)
        ),
      }
    },
    enabled: !!(entityId || typeParam),
    staleTime: 0,
    placeholderData: (previousData) => previousData,
  })
}

// ==========================================
// COMPONENT
// ==========================================

const EMPTY_FIELD_LABELS: Record<string, string> = {}

export function EntityActivityTable({ 
  entityType, 
  entityTypes,
  entityId, 
  fieldLabels = EMPTY_FIELD_LABELS,
  title = 'Lịch sử hoạt động'
}: EntityActivityTableProps) {
  // Merge field labels
  const mergedFieldLabels = React.useMemo(
    () => ({ ...defaultFieldLabels, ...fieldLabels }),
    [fieldLabels]
  )
  
  // Pagination state
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true })
  
  // Detail sheet
  const [selectedLog, setSelectedLog] = React.useState<ActivityLogEntry | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  
  // Fetch data
  const { data, isLoading } = useEntityActivity(entityType, entityTypes, entityId, {
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  }, mergedFieldLabels)
  
  const logs = data?.data ?? []
  const total = data?.total ?? 0
  const pageCount = Math.ceil(total / pagination.pageSize)
  
  // Get action icon and color
  const getActionStyle = (action: string) => {
    const styles: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
      created: { icon: Plus, color: 'text-success', bgColor: 'bg-success/15' },
      updated: { icon: Pencil, color: 'text-info', bgColor: 'bg-info/15' },
      deleted: { icon: Trash2, color: 'text-destructive', bgColor: 'bg-destructive/15' },
      status_changed: { icon: FileText, color: 'text-warning', bgColor: 'bg-warning/15' },
      restored: { icon: RotateCcw, color: 'text-info', bgColor: 'bg-info/15' },
      document_uploaded: { icon: Upload, color: 'text-info', bgColor: 'bg-info/15' },
      document_deleted: { icon: Trash2, color: 'text-destructive', bgColor: 'bg-destructive/15' },
    }
    return styles[action] || { icon: FileText, color: 'text-muted-foreground', bgColor: 'bg-muted' }
  }
  
  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      created: 'Tạo mới',
      updated: 'Cập nhật',
      deleted: 'Xóa',
      status_changed: 'Đổi trạng thái',
      restored: 'Khôi phục',
      document_uploaded: 'Tải lên tài liệu',
      document_deleted: 'Xóa tài liệu',
    }
    return labels[action] || action
  }
  
  const getActionBadgeColor = (action: string) => {
    const colors: Record<string, string> = {
      created: 'bg-success/15 text-success-foreground border-success/30',
      updated: 'bg-info/15 text-info-foreground border-info/30',
      deleted: 'bg-destructive/15 text-destructive border-destructive/30',
      status_changed: 'bg-warning/15 text-warning-foreground border-warning/30',
      restored: 'bg-info/15 text-info-foreground border-info/30',
      document_uploaded: 'bg-info/15 text-info-foreground border-info/30',
      document_deleted: 'bg-destructive/15 text-destructive border-destructive/30',
    }
    return colors[action] || 'bg-muted text-muted-foreground border-border'
  }
  
  // Handle row click
  const handleRowClick = React.useCallback((log: ActivityLogEntry) => {
    setSelectedLog(log)
    setIsSheetOpen(true)
  }, [])
  
  // Render changes detail
  const renderChanges = (changes: Record<string, { from: unknown; to: unknown }> | null) => {
    if (!changes || Object.keys(changes).length === 0) {
      return <p className="text-muted-foreground text-sm">Không có chi tiết thay đổi</p>
    }
    
    return (
      <div className="space-y-3">
        {Object.entries(changes).map(([field, change]) => (
          <div key={field} className="border rounded-lg p-3 bg-muted/30 overflow-hidden">
            <div className="font-medium text-sm mb-2">{mergedFieldLabels[field] || field}</div>
            <div className="flex flex-col gap-2 text-sm">
              <span className="px-2 py-1 bg-destructive/10 text-destructive rounded line-through break-all whitespace-pre-wrap">
                {formatValue(change.from, field)}
              </span>
              <span className="px-2 py-1 bg-success/10 text-success-foreground rounded break-all whitespace-pre-wrap">
                {formatValue(change.to, field)}
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  // Columns definition
  const columns: ColumnDef<ActivityLogEntry>[] = React.useMemo(() => [
    {
      id: 'createdAt',
      header: 'Thời gian',
      accessorKey: 'createdAt',
      size: 140,
      cell: ({ row }) => {
        const date = new Date(row.createdAt)
        return (
          <div className="text-xs">
            <div className="font-mono">{format(date, 'HH:mm dd/MM/yyyy', { locale: vi })}</div>
            <div className="text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true, locale: vi })}
            </div>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      id: 'action',
      header: 'Hành động',
      accessorKey: 'action',
      size: 130,
      cell: ({ row }) => {
        const style = getActionStyle(row.action)
        const Icon = style.icon
        return (
          <Badge variant="outline" className={cn('gap-1', getActionBadgeColor(row.action))}>
            <Icon className="h-3 w-3" />
            {getActionLabel(row.action)}
          </Badge>
        )
      },
    },
    {
      id: 'description',
      header: 'Mô tả',
      accessorKey: 'description',
      size: 300,
      cell: ({ row }) => (
        <div className="text-sm line-clamp-2">{row.description}</div>
      ),
    },
    {
      id: 'userName',
      header: 'Người thực hiện',
      accessorKey: 'userName',
      size: 130,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="truncate max-w-24">{row.userName}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 50,
      cell: ({ row }) => (
        <button
          onClick={() => handleRowClick(row)}
          className="p-1 hover:bg-muted rounded"
        >
          <Eye className="h-4 w-4 text-muted-foreground" />
        </button>
      ),
    },
  ], [handleRowClick])
  
  // Mobile card renderer
  const renderMobileCard = React.useCallback((log: ActivityLogEntry) => {
    const style = getActionStyle(log.action)
    const Icon = style.icon
    const date = new Date(log.createdAt)
    
    return (
      <button
        type="button"
        className="p-4 border-b last:border-b-0 w-full text-left hover:bg-muted/50 transition-colors"
        onClick={() => handleRowClick(log)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={cn('p-1.5 rounded', style.bgColor)}>
              <Icon className={cn('h-4 w-4', style.color)} />
            </div>
            <div>
              <div className="font-medium text-sm">{getActionLabel(log.action)}</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(date, { addSuffix: true, locale: vi })}
              </div>
            </div>
          </div>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{log.description}</p>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          {log.userName}
        </div>
      </button>
    )
  }, [handleRowClick])
  
  return (
    <>
      <Card className={mobileBleedCardClass}>
        <CardHeader className="pb-3">
          <CardTitle size="sm" className="font-medium flex items-center gap-2">
            <History className="h-4 w-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveDataTable<ActivityLogEntry>
            columns={columns}
            data={logs}
            renderMobileCard={renderMobileCard}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={total}
            sorting={sorting}
            setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>}
            isLoading={isLoading}
            emptyTitle="Chưa có lịch sử hoạt động"
            mobileInfiniteScroll
          />
        </CardContent>
      </Card>
      
      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedLog && (() => {
                const style = getActionStyle(selectedLog.action)
                const Icon = style.icon
                return (
                  <>
                    <div className={cn('p-1.5 rounded', style.bgColor)}>
                      <Icon className={cn('h-4 w-4', style.color)} />
                    </div>
                    {getActionLabel(selectedLog.action)}
                  </>
                )
              })()}
            </SheetTitle>
            <SheetDescription>
              {selectedLog && format(new Date(selectedLog.createdAt), "dd/MM/yyyy 'lúc' HH:mm:ss", { locale: vi })}
            </SheetDescription>
          </SheetHeader>
          
          {selectedLog && (
            <ScrollArea className="h-[calc(100vh-150px)] mt-6">
              <div className="space-y-6 pr-4">
                {/* User info */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{selectedLog.userName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(selectedLog.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Mô tả</h4>
                  <p className="text-sm text-muted-foreground">{selectedLog.description}</p>
                </div>
                
                {/* Note */}
                {selectedLog.note && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Ghi chú</h4>
                    <p className="text-sm text-muted-foreground">{selectedLog.note}</p>
                  </div>
                )}
                
                {/* Changes */}
                {selectedLog.changes && Object.keys(selectedLog.changes).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Chi tiết thay đổi</h4>
                    {renderChanges(selectedLog.changes)}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
