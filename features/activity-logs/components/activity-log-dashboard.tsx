'use client'

import * as React from 'react'
import { usePaginatedActivityLogs, type ActivityLogFilters } from '@/hooks/use-activity-logs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Search,
  RefreshCw,
  History,
  User,
  Calendar,
  Eye,
  ArrowRight,
  Package,
  Users,
  ShoppingCart,
  Truck,
  Receipt,
  CreditCard,
  Warehouse,
  ClipboardList,
  RotateCcw,
  FileText,
  Settings,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react'

// Entity Types for filter
export const ENTITY_TYPES = [
  { value: 'order', label: 'Đơn hàng' },
  { value: 'customer', label: 'Khách hàng' },
  { value: 'product', label: 'Sản phẩm' },
  { value: 'employee', label: 'Nhân viên' },
  { value: 'payment', label: 'Thanh toán' },
  { value: 'receipt', label: 'Phiếu thu' },
  { value: 'shipment', label: 'Vận đơn' },
  { value: 'warranty', label: 'Bảo hành' },
  { value: 'complaint', label: 'Khiếu nại' },
  { value: 'inventory_check', label: 'Kiểm kê' },
  { value: 'inventory_receipt', label: 'Phiếu nhập kho' },
  { value: 'task', label: 'Công việc' },
  { value: 'purchase_order', label: 'Đơn nhập' },
  { value: 'supplier', label: 'Nhà cung cấp' },
  { value: 'wiki', label: 'Wiki' },
  { value: 'settings', label: 'Cài đặt' },
] as const

// Action Types for filter
export const ACTION_TYPES = [
  { value: 'created', label: 'Tạo mới', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'updated', label: 'Cập nhật', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'deleted', label: 'Xóa', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'status_changed', label: 'Đổi trạng thái', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'viewed', label: 'Xem', color: 'bg-gray-100 text-gray-800 border-gray-200' },
] as const

interface ActivityLogDashboardProps {
  initialFilters?: ActivityLogFilters
  initialPage?: number
  pageSize?: number
}

export function ActivityLogDashboard({
  initialFilters = {},
  initialPage = 1,
  pageSize = 20,
}: ActivityLogDashboardProps) {
  // Filters state
  const [filters, setFilters] = React.useState<ActivityLogFilters>(initialFilters)
  const [page, setPage] = React.useState(initialPage)
  const [searchTerm, setSearchTerm] = React.useState('')

  // Detail sheet state
  const [selectedLog, setSelectedLog] = React.useState<{
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
  } | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  // Fetch logs
  const { data, isLoading, refetch, isFetching } = usePaginatedActivityLogs({
    filters,
    page,
    limit: pageSize,
  })

  const logs = data?.data ?? []
  const pagination = data?.pagination

  // Client-side search filter
  const filteredLogs = React.useMemo(() => {
    if (!searchTerm) return logs
    const term = searchTerm.toLowerCase()
    return logs.filter(
      (log) =>
        log.entityId.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        (log.note && log.note.toLowerCase().includes(term)) ||
        (log.metadata as Record<string, unknown> | null)?.userName?.toString().toLowerCase().includes(term)
    )
  }, [logs, searchTerm])

  // Update filter helper
  const updateFilter = (key: keyof ActivityLogFilters, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
    setPage(1) // Reset to first page on filter change
  }

  const clearFilters = () => {
    setFilters({})
    setPage(1)
    setSearchTerm('')
  }

  // Row click handler
  const handleRowClick = (log: typeof logs[0]) => {
    setSelectedLog(log)
    setIsSheetOpen(true)
  }

  // Helper functions
  const getEntityIcon = (entityType: string) => {
    const icons: Record<string, React.ReactNode> = {
      product: <Package className="h-4 w-4 text-green-500" />,
      employee: <Users className="h-4 w-4 text-blue-500" />,
      customer: <Users className="h-4 w-4 text-purple-500" />,
      supplier: <Truck className="h-4 w-4 text-orange-500" />,
      order: <ShoppingCart className="h-4 w-4 text-indigo-500" />,
      purchase_order: <ClipboardList className="h-4 w-4 text-cyan-500" />,
      inventory_check: <Warehouse className="h-4 w-4 text-amber-500" />,
      inventory_receipt: <Warehouse className="h-4 w-4 text-amber-500" />,
      receipt: <Receipt className="h-4 w-4 text-emerald-500" />,
      payment: <CreditCard className="h-4 w-4 text-red-500" />,
      shipment: <Truck className="h-4 w-4 text-lime-500" />,
      complaint: <FileText className="h-4 w-4 text-yellow-500" />,
      warranty: <FileText className="h-4 w-4 text-yellow-500" />,
      task: <ClipboardList className="h-4 w-4 text-violet-500" />,
      wiki: <FileText className="h-4 w-4 text-blue-400" />,
      settings: <Settings className="h-4 w-4 text-muted-foreground" />,
    }
    return icons[entityType] || <FileText className="h-4 w-4 text-muted-foreground" />
  }

  const getEntityLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      product: 'Sản phẩm',
      employee: 'Nhân viên',
      customer: 'Khách hàng',
      supplier: 'Nhà cung cấp',
      order: 'Đơn hàng',
      purchase_order: 'Đơn nhập',
      inventory_check: 'Kiểm kê',
      inventory_receipt: 'Phiếu nhập kho',
      receipt: 'Phiếu thu',
      payment: 'Phiếu chi',
      shipment: 'Vận đơn',
      complaint: 'Khiếu nại',
      warranty: 'Bảo hành',
      task: 'Công việc',
      wiki: 'Wiki',
      settings: 'Cài đặt',
    }
    return labels[entityType] || entityType
  }

  const getActionIcon = (action: string) => {
    if (action.includes('created') || action.includes('create')) {
      return <Plus className="h-3.5 w-3.5 text-green-500" />
    }
    if (action.includes('updated') || action.includes('update') || action.includes('changed')) {
      return <Pencil className="h-3.5 w-3.5 text-blue-500" />
    }
    if (action.includes('deleted') || action.includes('delete')) {
      return <Trash2 className="h-3.5 w-3.5 text-red-500" />
    }
    return <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
  }

  const getActionBadgeColor = (actionType: string | null | undefined) => {
    switch (actionType) {
      case 'create':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'update':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'delete':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'status':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-muted text-foreground border-border'
    }
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      created: 'Tạo mới',
      updated: 'Cập nhật',
      deleted: 'Xóa',
      restored: 'Khôi phục',
      status_changed: 'Đổi trạng thái',
      price_changed: 'Đổi giá',
      stock_changed: 'Đổi tồn kho',
      payment_added: 'Thanh toán',
      delivered: 'Giao hàng',
      cancelled: 'Hủy',
      completed: 'Hoàn thành',
    }
    return labels[action] || action.replace(/_/g, ' ')
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // Field label helper
  const getFieldLabel = (field: string): string => {
    const fieldLabels: Record<string, string> = {
      fullName: 'Họ tên',
      name: 'Tên',
      status: 'Trạng thái',
      phone: 'Điện thoại',
      email: 'Email',
      address: 'Địa chỉ',
      price: 'Giá',
      quantity: 'Số lượng',
      totalAmount: 'Tổng tiền',
      paidAmount: 'Đã thanh toán',
      notes: 'Ghi chú',
    }
    return fieldLabels[field] || field
  }

  // Format value for display
  const formatValue = (value: unknown, field: string): string => {
    if (value === null || value === undefined) return '(trống)'

    const dateFields = ['dob', 'hireDate', 'startDate', 'createdAt', 'updatedAt']
    if (dateFields.includes(field) || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value))) {
      try {
        const date = new Date(value as string)
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        }
      } catch {
        // fallback
      }
    }

    if (typeof value === 'boolean') {
      return value ? 'Có' : 'Không'
    }

    if (Array.isArray(value)) {
      return `${value.length} mục`
    }

    return String(value)
  }

  const renderChanges = (changes: Record<string, { from: unknown; to: unknown }> | null) => {
    if (!changes || Object.keys(changes).length === 0) {
      return <p className="text-sm text-muted-foreground">Không có thay đổi chi tiết</p>
    }

    return (
      <div className="space-y-2">
        {Object.entries(changes).map(([field, { from, to }]) => (
          <div
            key={field}
            className="flex items-start gap-2 text-sm p-2 rounded-md bg-muted/50"
          >
            <span className="font-medium min-w-32">{getFieldLabel(field)}:</span>
            <span className="text-red-600 line-through">{formatValue(from, field)}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-green-600">{formatValue(to, field)}</span>
          </div>
        ))}
      </div>
    )
  }

  // Pagination helpers
  const getPageNumbers = () => {
    if (!pagination) return []
    const { page: currentPage, totalPages } = pagination
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('ellipsis')
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis')
      pages.push(totalPages)
    }

    return pages
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== '')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle size="lg">Lịch sử hoạt động</CardTitle>
              <CardDescription>
                Theo dõi các thao tác trong hệ thống
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 min-w-50">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.entityType || 'all'}
              onValueChange={(v) => updateFilter('entityType', v === 'all' ? undefined : v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả module</SelectItem>
                {ENTITY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.action || 'all'}
              onValueChange={(v) => updateFilter('action', v === 'all' ? undefined : v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Hành động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {ACTION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="Từ ngày"
              value={filters.fromDate || ''}
              onChange={(e) => updateFilter('fromDate', e.target.value || undefined)}
              className="w-40"
            />
            <Input
              type="date"
              placeholder="Đến ngày"
              value={filters.toDate || ''}
              onChange={(e) => updateFilter('toDate', e.target.value || undefined)}
              className="w-40"
            />
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {pagination?.total ?? 0} logs
              {searchTerm &&
                filteredLogs.length !== logs.length &&
                ` (hiển thị: ${filteredLogs.length})`}
            </span>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground w-40">
                      Thời gian
                    </th>
                    <th className="text-left p-3 font-medium text-muted-foreground w-32">
                      Module
                    </th>
                    <th className="text-left p-3 font-medium text-muted-foreground w-36">
                      Hành động
                    </th>
                    <th className="text-left p-3 font-medium text-muted-foreground w-32">
                      ID
                    </th>
                    <th className="text-left p-3 font-medium text-muted-foreground">
                      Ghi chú
                    </th>
                    <th className="text-left p-3 font-medium text-muted-foreground w-28">
                      Người thực hiện
                    </th>
                    <th className="text-left p-3 font-medium text-muted-foreground w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        Đang tải...
                      </td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <History className="h-12 w-12 text-muted-foreground/50" />
                          <p>Chưa có hoạt động nào được ghi lại</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr
                        key={log.systemId}
                        className="hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => handleRowClick(log)}
                      >
                        <td className="p-3">
                          <span className="text-xs font-mono">
                            {formatTimestamp(log.createdAt)}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {getEntityIcon(log.entityType)}
                            <span className="text-sm">
                              {getEntityLabel(log.entityType)}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            <Badge
                              variant="outline"
                              className={`text-xs ${getActionBadgeColor(log.actionType)}`}
                            >
                              {getActionLabel(log.action)}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className="text-xs font-mono text-muted-foreground truncate block max-w-28"
                            title={log.entityId}
                          >
                            {log.entityId}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className="text-sm truncate block max-w-xs"
                            title={log.note || undefined}
                          >
                            {log.note || '-'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5 text-xs">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-24">
                              {((log.metadata as Record<string, unknown>)?.userName as string) ||
                                log.createdBy ||
                                'Hệ thống'}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRowClick(log)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>

                {getPageNumbers().map((p, idx) =>
                  p === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        onClick={() => setPage(p)}
                        isActive={page === p}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    className={
                      page >= pagination.totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-125 sm:max-w-125">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedLog && getEntityIcon(selectedLog.entityType)}
              Chi tiết hoạt động
            </SheetTitle>
            <SheetDescription>
              Thông tin chi tiết về thao tác trong hệ thống
            </SheetDescription>
          </SheetHeader>

          {selectedLog && (
            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
              <div className="space-y-6 pr-4">
                {/* Basic Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Thông tin chung
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Thời gian</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">
                          {formatTimestamp(selectedLog.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Module</span>
                      <div className="flex items-center gap-2">
                        {getEntityIcon(selectedLog.entityType)}
                        <span className="text-sm font-medium">
                          {getEntityLabel(selectedLog.entityType)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Hành động</span>
                      <Badge
                        variant="outline"
                        className={getActionBadgeColor(selectedLog.actionType)}
                      >
                        {getActionIcon(selectedLog.action)}
                        <span className="ml-1">{getActionLabel(selectedLog.action)}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">ID đối tượng</span>
                      <span className="text-sm font-mono">{selectedLog.entityId}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Người thực hiện</span>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {((selectedLog.metadata as Record<string, unknown>)?.userName as string) ||
                            selectedLog.createdBy ||
                            'Hệ thống'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Note */}
                {selectedLog.note && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Ghi chú
                    </h4>
                    <p className="text-sm p-3 rounded-lg bg-muted/50">{selectedLog.note}</p>
                  </div>
                )}

                {/* Changes */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Chi tiết thay đổi
                  </h4>
                  {renderChanges(selectedLog.changes)}
                </div>

                {/* Metadata */}
                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Metadata
                    </h4>
                    <pre className="text-xs p-3 rounded-lg bg-muted/50 overflow-x-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
