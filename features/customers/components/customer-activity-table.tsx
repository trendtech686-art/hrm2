'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mobileBleedCardClass } from '@/components/layout/page-section'
import { Badge } from '@/components/ui/badge'
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ColumnDef } from '@/components/data-table/types'
import { useCustomerActivity, type ActivityLogEntry } from '../hooks/use-customer-activity'
import { formatDistanceToNow, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { 
  History, Plus, Pencil, Trash2, FileText, User, Calendar, 
  ArrowRight, Eye, RotateCcw
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomerActivityTableProps {
  customerSystemId: string | undefined
}

// Field labels for Vietnamese display
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

// Format value for display (dates, etc.)
const formatValue = (value: unknown, field: string): string => {
  if (value === null || value === undefined) return '(trống)'
  
  const dateFields = ['dateOfBirth', 'lastContactDate', 'nextFollowUpDate', 'createdAt', 'updatedAt']
  
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
  
  // Format boolean
  if (typeof value === 'boolean') {
    return value ? 'Có' : 'Không'
  }
  
  // Format array
  if (Array.isArray(value)) {
    return `${value.length} mục`
  }
  
  // Format object
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  
  return String(value)
}

export function CustomerActivityTable({ customerSystemId }: CustomerActivityTableProps) {
  // Pagination state
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true })
  
  // Detail sheet
  const [selectedLog, setSelectedLog] = React.useState<ActivityLogEntry | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  
  // Fetch data
  const { data, isLoading } = useCustomerActivity(customerSystemId, {
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  })
  
  const logs = data?.data ?? []
  const total = data?.total ?? 0
  const pageCount = Math.ceil(total / pagination.pageSize)
  
  // Get action icon and color
  const getActionStyle = (action: string) => {
    const styles: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
      created: { icon: Plus, color: 'text-green-600', bgColor: 'bg-green-100' },
      updated: { icon: Pencil, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      deleted: { icon: Trash2, color: 'text-red-600', bgColor: 'bg-red-100' },
      status_changed: { icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-100' },
      restored: { icon: RotateCcw, color: 'text-teal-600', bgColor: 'bg-teal-100' },
    }
    return styles[action] || { icon: FileText, color: 'text-muted-foreground', bgColor: 'bg-muted' }
  }
  
  // Get action label
  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      created: 'Tạo mới',
      updated: 'Cập nhật',
      deleted: 'Xóa',
      status_changed: 'Đổi trạng thái',
      restored: 'Khôi phục',
    }
    return labels[action] || action
  }
  
  // Handle row click
  const handleRowClick = React.useCallback((log: ActivityLogEntry) => {
    setSelectedLog(log)
    setIsSheetOpen(true)
  }, [])
  
  // Columns definition
  const columns: ColumnDef<ActivityLogEntry>[] = React.useMemo(() => [
    {
      id: 'createdAt',
      header: 'Thời gian',
      accessorKey: 'createdAt',
      cell: ({ row }) => {
        const date = new Date(row.createdAt)
        return (
          <div className="flex flex-col">
            <span className="text-sm">{format(date, 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true, locale: vi })}
            </span>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      id: 'action',
      header: 'Hành động',
      accessorKey: 'action',
      cell: ({ row }) => {
        const style = getActionStyle(row.action)
        const Icon = style.icon
        return (
          <Badge variant="outline" className={cn('gap-1', style.color)}>
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
      cell: ({ row }) => (
        <span className="text-sm line-clamp-2">{row.description}</span>
      ),
    },
    {
      id: 'userName',
      header: 'Người thực hiện',
      accessorKey: 'userName',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3 w-3 text-muted-foreground" />
          </div>
          <span className="text-sm">{row.userName}</span>
        </div>
      ),
    },
  ], [])
  
  // Render changes detail
  const renderChanges = (changes: Record<string, { from: unknown; to: unknown }> | null) => {
    if (!changes || Object.keys(changes).length === 0) {
      return <p className="text-muted-foreground text-sm">Không có chi tiết thay đổi</p>
    }
    
    return (
      <div className="space-y-3">
        {Object.entries(changes).map(([field, change]) => (
          <div key={field} className="border rounded-lg p-3 bg-muted/30">
            <div className="font-medium text-sm mb-2">{fieldLabels[field] || field}</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded line-through">
                {formatValue(change.from, field)}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                {formatValue(change.to, field)}
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  // Mobile card render
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
            Lịch sử hoạt động
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
