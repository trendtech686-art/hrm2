'use client'

/**
 * Dashboard Page
 *
 * Sections:
 * 1. KPI cards (Doanh thu, Đơn hàng mới, Đơn trả, Đơn hủy)
 * 2. Revenue bar chart (7 ngày / 14 ngày / 30 ngày)
 * 3. Order pipeline (Chờ duyệt → Đang giao → Hủy giao)
 * 4. Top sản phẩm bán chạy
 * 5. Thông tin kho
 * 6. Đơn hàng gần đây
 * 7. Tổng quan vận hành (Tasks, Warranty, Complaints)
 * 8. Nhân sự (Đơn nghỉ phép chờ duyệt)
 *
 * KHÔNG import heavy stores — dùng API aggregation.
 */

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { format, subDays, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears } from 'date-fns'
import { vi } from 'date-fns/locale'
import { usePageHeader } from '@/contexts/page-header-context'
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import {
  Truck,
  DollarSign,
  ShoppingCart,
  ArrowRight,
  Undo2,
  XCircle,
  ClipboardCheck,
  CreditCard,
  Package,
  PackageCheck,
  AlertTriangle,
  CalendarIcon,
  ListTodo,
  Shield,
  MessageSquareWarning,
  TreePalm,
  TrendingUp,
} from 'lucide-react'
import { ProductImage } from '@/features/products/components/product-image'
import { NotificationBellIcon } from '@/components/mobile/mobile-top-bar'
import { useTaskDashboardStats } from '@/features/tasks/hooks/use-tasks'
import { useWarrantyStats } from '@/features/warranty/hooks/use-warranties'
import { useComplaintStats } from '@/features/complaints/hooks/use-complaints'
import { useLeaves } from '@/features/leaves/hooks/use-leaves'
import { DynamicReportChart as ReportChart } from '@/features/reports/business-activity/components/dynamic-report-chart'
import type { ChartType } from '@/features/reports/business-activity/types'

// ── Types ────────────────────────────────────────────────────────────

interface DashboardKPI {
  totalRevenue: number
  totalOrders: number
  newOrders: number
  returnCount: number
  cancelCount: number
  activeEmployees: number
}

interface DashboardPipeline {
  pending: number
  confirmed: number
  packing: number
  readyForPickup: number
  shipping: number
  failedDelivery: number
}

interface DashboardTopProduct {
  systemId: string
  code: string
  name: string
  thumbnailImage: string | null
  quantity: number
  revenue: number
}

interface DashboardInventory {
  totalOnHand: number
  totalValue: number
  lowStockCount: number
  outOfStockCount: number
}

interface DashboardChartPoint {
  date: string
  orders: number
  revenue: number
}

interface RecentOrder {
  systemId: string
  id: string
  customerName: string | null
  grandTotal: number
  status: string
  orderDate: string
}

interface DashboardData {
  kpi: DashboardKPI
  recentOrders: RecentOrder[]
  topProducts: DashboardTopProduct[]
  pipeline: DashboardPipeline
  chartData: DashboardChartPoint[]
  inventory: DashboardInventory
}

// ── Hooks ────────────────────────────────────────────────────────────

interface DateRange {
  from: string
  to: string
  label: string
}

const fmt = (d: Date) => format(d, 'yyyy-MM-dd')
const fmtDisplay = (d: Date) => format(d, 'dd/MM/yyyy')

function getPresets(today: Date): Array<{ label: string; range: () => DateRange }> {
  return [
    { label: 'Hôm nay', range: () => ({ from: fmt(today), to: fmt(today), label: 'Hôm nay' }) },
    { label: 'Hôm qua', range: () => { const d = subDays(today, 1); return { from: fmt(d), to: fmt(d), label: 'Hôm qua' } } },
    { label: '7 ngày qua', range: () => ({ from: fmt(subDays(today, 6)), to: fmt(today), label: '7 ngày qua' }) },
    { label: '30 ngày qua', range: () => ({ from: fmt(subDays(today, 29)), to: fmt(today), label: '30 ngày qua' }) },
    { label: 'Tháng trước', range: () => { const m = subMonths(today, 1); return { from: fmt(startOfMonth(m)), to: fmt(endOfMonth(m)), label: 'Tháng trước' } } },
    { label: 'Tháng này', range: () => ({ from: fmt(startOfMonth(today)), to: fmt(today), label: 'Tháng này' }) },
    { label: 'Năm trước', range: () => { const y = subYears(today, 1); return { from: fmt(startOfYear(y)), to: fmt(endOfYear(y)), label: 'Năm trước' } } },
    { label: 'Năm nay', range: () => ({ from: fmt(startOfYear(today)), to: fmt(today), label: 'Năm nay' }) },
  ]
}

// Helper to get default chart range - computed lazily inside component
function getDefaultChartRange(today: Date): DateRange {
  return {
    from: fmt(subDays(today, 6)),
    to: fmt(today),
    label: '7 ngày qua',
  }
}

// Helper to get default top product range - computed lazily inside component
function getDefaultTopProductRange(today: Date): DateRange {
  return {
    from: fmt(subDays(today, 6)),
    to: fmt(today),
    label: '7 ngày qua',
  }
}

/**
 * Dashboard API hooks - Tách riêng để tối ưu loading
 */
interface DashboardQueryParams {
  branchId: string | null
  chartRange: DateRange
  topProductRange: DateRange
}

function buildQueryString(params: DashboardQueryParams): URLSearchParams {
  const today = new Date().toISOString().split('T')[0]
  const sp = new URLSearchParams()
  sp.set('startDate', today)
  sp.set('endDate', today)
  sp.set('chartFrom', params.chartRange.from)
  sp.set('chartTo', params.chartRange.to)
  sp.set('topFrom', params.topProductRange.from)
  sp.set('topTo', params.topProductRange.to)
  if (params.branchId) sp.set('branchId', params.branchId)
  return sp
}

// KPI & Chart data - useQuery riêng để control loading
function useDashboardKPI(branchId: string | null, chartRange: DateRange, topProductRange: DateRange) {
  return useQuery<DashboardData>({
    // NOTE: Không include 'today' trong key để tránh refetch không cần thiết
    queryKey: ['dashboard-kpi', branchId, chartRange.from, chartRange.to, topProductRange.from, topProductRange.to],
    queryFn: async () => {
      const params: DashboardQueryParams = { branchId, chartRange, topProductRange }
      const res = await fetch(`/api/dashboard?${buildQueryString(params)}`)
      if (!res.ok) throw new Error('Failed to fetch dashboard')
      const json = await res.json()
      return json.data ?? json
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - dashboard không cần real-time
    gcTime: 10 * 60 * 1000,
  })
}

// ── Formats ──────────────────────────────────────────────────────────

const fmtCurrency = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)

const fmtNumber = (v: number) =>
  new Intl.NumberFormat('vi-VN').format(v)

// ── Entry ────────────────────────────────────────────────────────────

export interface DashboardPageLiteProps {
  initialStats?: unknown
}

export function DashboardPageLite(_props: DashboardPageLiteProps) {
  return <AdminDashboard />
}

// ── Admin Dashboard ──────────────────────────────────────────────────

function AdminDashboard() {
  const router = useRouter()
  const [branchId, setBranchId] = React.useState<string | null>(null)

  // Client-only date for hydration safety
  const [today, setToday] = React.useState<Date | null>(null)
  React.useEffect(() => {
    setToday(new Date())
  }, [])

  const [chartRange, setChartRange] = React.useState<DateRange>(() => getDefaultChartRange(today ?? new Date()))
  const [topProductRange, setTopProductRange] = React.useState<DateRange>(() => getDefaultTopProductRange(today ?? new Date()))
  const [chartType, setChartType] = React.useState<ChartType>('bar')

  // Update chart ranges when today is available
  React.useEffect(() => {
    if (today) {
      setChartRange(getDefaultChartRange(today))
      setTopProductRange(getDefaultTopProductRange(today))
    }
  }, [today])

  // KPI & main data query - không auto refetch
  const { data: branches = [] } = useAllBranches()
  const { data, isLoading, error, isFetching } = useDashboardKPI(branchId, chartRange, topProductRange)

  // Chart data transformation - memoized để tránh re-render
  const chartData = React.useMemo(() => {
    if (!data?.chartData) return []
    return data.chartData.map((d) => ({
      name: d.date,
      label: format(new Date(d.date), 'dd/MM', { locale: vi }),
      revenue: d.revenue,
    }))
  }, [data?.chartData])

  // Operations & HR hooks
  const { data: taskStats, isLoading: taskStatsLoading } = useTaskDashboardStats()
  const { data: warrantyStats, isLoading: warrantyLoading } = useWarrantyStats()
  const { data: complaintStats, isLoading: complaintLoading } = useComplaintStats()
  const { data: pendingLeaves, isLoading: leavesLoading } = useLeaves({ status: 'pending', limit: 5, sortBy: 'createdAt', sortOrder: 'desc' })

  usePageHeader({
    title: 'Tổng quan',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Dashboard', href: '/dashboard', isCurrent: true },
    ],
    showBackButton: false,
    actions: [<NotificationBellIcon key="bell" />],
  })

  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        Không thể tải dữ liệu dashboard. Vui lòng thử lại.
      </div>
    )
  }

  const kpi = data?.kpi
  const pipeline = data?.pipeline
  const topProducts = data?.topProducts ?? []
  const inventory = data?.inventory
  const recentOrders = data?.recentOrders ?? []

  return (
    <div className="space-y-4 md:space-y-6 py-2 md:py-0">

      {/* ─── Section 1: KPI Cards ─── */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Kết quả kinh doanh trong ngày
          </CardTitle>
          <BranchSelect branches={branches} value={branchId} onChange={setBranchId} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiItem
              icon={<DollarSign className="h-5 w-5" />}
              iconBg="bg-primary/10 text-primary"
              label="Doanh thu"
              value={isLoading ? undefined : fmtCurrency(kpi?.totalRevenue ?? 0)}
              loading={isLoading}
            />
            <KpiItem
              icon={<ShoppingCart className="h-5 w-5" />}
              iconBg="bg-primary/10 text-primary"
              label="Đơn hàng mới"
              value={isLoading ? undefined : String(kpi?.newOrders ?? 0)}
              loading={isLoading}
            />
            <KpiItem
              icon={<Undo2 className="h-5 w-5" />}
              iconBg="bg-primary/10 text-primary"
              label="Đơn trả hàng"
              value={isLoading ? undefined : String(kpi?.returnCount ?? 0)}
              loading={isLoading}
            />
            <KpiItem
              icon={<XCircle className="h-5 w-5" />}
              iconBg="bg-primary/10 text-primary"
              label="Đơn hủy"
              value={isLoading ? undefined : String(kpi?.cancelCount ?? 0)}
              loading={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* ─── Section 2: Revenue Chart ─── */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Doanh thu bán hàng</CardTitle>
            {isFetching && !isLoading && (
              <span className="text-xs text-muted-foreground animate-pulse">Đang tải...</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <BranchSelect branches={branches} value={branchId} onChange={setBranchId} />
            <DateRangeSelect value={chartRange} onChange={setChartRange} today={today} />
            <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
              <SelectTrigger className="w-40 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Biểu đồ cột</SelectItem>
                <SelectItem value="line">Biểu đồ đường</SelectItem>
                <SelectItem value="area">Biểu đồ vùng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ReportChart
            data={chartData}
            chartType={chartType}
            height={280}
            showLegend={false}
            isCollapsible={false}
            displayOptions={[
              { key: 'revenue', label: 'Doanh thu', color: 'var(--chart-1)', type: 'bar' as const },
            ]}
            selectedOptions={['revenue']}
          />
        </CardContent>
      </Card>

      {/* ─── Section 3: Order Pipeline ─── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Đơn hàng chờ xử lý
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <PipelineItem icon={ClipboardCheck} label="Chờ duyệt" count={pipeline?.pending ?? 0} />
              <PipelineItem icon={CreditCard} label="Chờ thanh toán" count={pipeline?.confirmed ?? 0} />
              <PipelineItem icon={Package} label="Chờ đóng gói" count={pipeline?.packing ?? 0} />
              <PipelineItem icon={PackageCheck} label="Chờ lấy hàng" count={pipeline?.readyForPickup ?? 0} />
              <PipelineItem icon={Truck} label="Đang giao hàng" count={pipeline?.shipping ?? 0} />
              <PipelineItem icon={XCircle} label="Hủy giao" count={pipeline?.failedDelivery ?? 0} isDestructive />
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Section 4+5: Top Products + Inventory ─── */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-5">
        {/* Top Products */}
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Top sản phẩm
            </CardTitle>
            <div className="flex items-center gap-2">
              <DateRangeSelect value={topProductRange} onChange={setTopProductRange} today={today} />
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => router.push('/reports/sales/product')}
              >
                Xem tất cả <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Chưa có dữ liệu bán hàng
              </p>
            ) : (
              <div className="space-y-1">
                {topProducts.map((product, index) => (
                  <div
                    key={product.systemId}
                    role="button"
                    tabIndex={0}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/products/${product.systemId}`)}
                    onKeyDown={(e) => e.key === 'Enter' && router.push(`/products/${product.systemId}`)}
                  >
                    <span
                      className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold text-primary-foreground shrink-0 ${
                        index === 0
                          ? 'bg-primary'
                          : index === 1
                            ? 'bg-primary/80'
                            : index === 2
                              ? 'bg-primary/60'
                              : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <ProductImage
                      productSystemId={product.systemId}
                      productData={{ thumbnailImage: product.thumbnailImage ?? undefined }}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.code}</p>
                    </div>
                    <span className="text-sm font-bold tabular-nums shrink-0">
                      {fmtNumber(product.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Info */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Thông tin kho
            </CardTitle>
            <BranchSelect branches={branches} value={branchId} onChange={setBranchId} />
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <>
                <InventoryCard
                  label="Sản phẩm dưới định mức"
                  value={fmtNumber(inventory?.lowStockCount ?? 0)}
                  icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
                  variant="warning"
                />
                <InventoryCard
                  label="Số tồn kho chi nhánh"
                  value={fmtNumber(inventory?.totalOnHand ?? 0)}
                  variant="info"
                />
                <InventoryCard
                  label="Giá trị tồn kho chi nhánh"
                  value={fmtCurrency(inventory?.totalValue ?? 0)}
                  variant="info"
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Section 6: Recent Orders ─── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle size="lg">Đơn hàng gần đây</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/reports/sales/order')}
          >
            Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Chưa có đơn hàng
            </p>
          ) : (
            <div className="divide-y">
              {recentOrders.map((order) => (
                <div
                  key={order.systemId}
                  role="button"
                  tabIndex={0}
                  className="flex items-center justify-between py-3 cursor-pointer hover:bg-muted/30 transition-colors px-1 rounded"
                  onClick={() => router.push(`/orders/${order.systemId}`)}
                  onKeyDown={(e) => e.key === 'Enter' && router.push(`/orders/${order.systemId}`)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {order.customerName || 'Khách lẻ'}
                    </p>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="text-sm font-semibold tabular-nums">
                      {fmtCurrency(order.grandTotal)}
                    </p>
                    <Badge
                      variant={STATUS_VARIANT[order.status] ?? 'default'}
                      className="text-xs mt-0.5"
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Section 7: Operations Overview ─── */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        {/* Tasks Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Công việc
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push('/tasks')}>
              <ListTodo className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {taskStatsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            ) : !taskStats ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Chưa có dữ liệu</p>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tổng</span>
                  <span className="text-sm font-medium">{taskStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Đang thực hiện</span>
                  <span className="text-sm font-medium text-primary">{taskStats.byStatus.inProgress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quá hạn</span>
                  <span className={`text-sm font-medium ${taskStats.overdue > 0 ? 'text-destructive' : ''}`}>{taskStats.overdue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ưu tiên cao</span>
                  <span className={`text-sm font-medium ${taskStats.highPriority > 0 ? 'text-warning' : ''}`}>{taskStats.highPriority}</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</span>
                  <span className="text-sm font-bold text-primary">{taskStats.completionRate}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warranty Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Bảo hành
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push('/warranty')}>
              <Shield className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {warrantyLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            ) : !warrantyStats ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Chưa có dữ liệu</p>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tổng</span>
                  <span className="text-sm font-medium">{warrantyStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Chờ xử lý</span>
                  <span className={`text-sm font-medium ${warrantyStats.pending > 0 ? 'text-warning' : ''}`}>{warrantyStats.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Đang xử lý</span>
                  <span className="text-sm font-medium text-primary">{warrantyStats.processed}</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Đã hoàn thành</span>
                  <span className="text-sm font-bold text-primary">{warrantyStats.completed}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Complaint Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Khiếu nại
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push('/complaints')}>
              <MessageSquareWarning className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {complaintLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            ) : !complaintStats ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Chưa có dữ liệu</p>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tổng</span>
                  <span className="text-sm font-medium">{complaintStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Chờ xử lý</span>
                  <span className={`text-sm font-medium ${complaintStats.pending > 0 ? 'text-warning' : ''}`}>{complaintStats.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Đang xử lý</span>
                  <span className="text-sm font-medium text-primary">{complaintStats.inProgress}</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Đã giải quyết</span>
                  <span className="text-sm font-bold text-primary">{complaintStats.resolved}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Section 8: Pending Leave Requests ─── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Đơn nghỉ phép chờ duyệt
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/leaves')}
          >
            <TreePalm className="h-4 w-4 mr-1" />
            Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {leavesLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !pendingLeaves?.data || pendingLeaves.data.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Không có đơn nghỉ phép chờ duyệt
            </p>
          ) : (
            <div className="divide-y">
              {pendingLeaves.data.map((leave) => (
                <div
                  key={leave.systemId}
                  role="button"
                  tabIndex={0}
                  className="flex items-center justify-between py-3 cursor-pointer hover:bg-muted/30 transition-colors px-1 rounded"
                  onClick={() => router.push(`/leaves/${leave.systemId}`)}
                  onKeyDown={(e) => e.key === 'Enter' && router.push(`/leaves/${leave.systemId}`)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{leave.employeeName || 'Nhân viên'}</p>
                    <p className="text-xs text-muted-foreground">
                      {leave.leaveTypeName} · {leave.numberOfDays || 1} ngày
                    </p>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {new Date(leave.startDate).toLocaleDateString('vi-VN')}
                      {leave.startDate !== leave.endDate && ` - ${new Date(leave.endDate).toLocaleDateString('vi-VN')}`}
                    </p>
                    <Badge variant="warning" className="text-xs mt-0.5">
                      Chờ duyệt
                    </Badge>
                  </div>
                </div>
              ))}
              {pendingLeaves.pagination.total > 5 && (
                <p className="pt-2 text-center text-xs text-muted-foreground">
                  Còn {pendingLeaves.pagination.total - 5} đơn khác
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chờ duyệt',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  PACKING: 'Đang đóng gói',
  PACKED: 'Đã đóng gói',
  READY_FOR_PICKUP: 'Chờ lấy hàng',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  FAILED_DELIVERY: 'Giao thất bại',
  RETURNED: 'Trả hàng',
  CANCELLED: 'Đã hủy',
}

const STATUS_VARIANT: Record<string, 'success' | 'default' | 'secondary' | 'warning' | 'destructive'> = {
  PENDING: 'secondary',
  CONFIRMED: 'secondary',
  PROCESSING: 'warning',
  PACKING: 'warning',
  PACKED: 'warning',
  READY_FOR_PICKUP: 'warning',
  SHIPPING: 'warning',
  DELIVERED: 'success',
  COMPLETED: 'success',
  FAILED_DELIVERY: 'destructive',
  RETURNED: 'destructive',
  CANCELLED: 'destructive',
}

function KpiItem({
  icon,
  iconBg,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value?: string
  loading?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        {loading ? (
          <Skeleton className="h-6 w-16 mt-0.5" />
        ) : (
          <p className="text-base font-bold truncate">{value}</p>
        )}
      </div>
    </div>
  )
}

function PipelineItem({
  icon: Icon,
  label,
  count,
  isDestructive,
}: {
  icon: React.ElementType
  label: string
  count: number
  isDestructive?: boolean
}) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5 py-2">
      <Icon className={`h-6 w-6 ${isDestructive ? 'text-destructive' : 'text-primary'}`} />
      <span className="text-xs text-muted-foreground leading-tight">{label}</span>
      <span className={`text-lg font-bold ${isDestructive ? 'text-destructive' : ''}`}>{count}</span>
    </div>
  )
}

function InventoryCard({
  label,
  value,
  icon,
  variant,
}: {
  label: string
  value: string
  icon?: React.ReactNode
  variant: 'warning' | 'info'
}) {
  return (
    <div
      className={`rounded-lg p-4 ${
        variant === 'warning'
          ? 'bg-warning/10 text-warning'
          : 'bg-primary/10 text-primary'
      }`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className={`text-xs ${variant === 'warning' ? 'text-warning/80' : 'text-primary/80'}`}>{label}</span>
      </div>
      <p className="text-xl font-bold tabular-nums">{value}</p>
    </div>
  )
}

function BranchSelect({
  branches,
  value,
  onChange,
}: {
  branches: Array<{ systemId: string; name: string }>
  value: string | null
  onChange: (v: string | null) => void
}) {
  if (branches.length <= 1) return null
  return (
    <Select
      value={value ?? 'all'}
      onValueChange={(v) => onChange(v === 'all' ? null : v)}
    >
      <SelectTrigger className="w-40 h-8">
        <SelectValue placeholder="Tất cả chi nhánh" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả chi nhánh</SelectItem>
        {branches.map((b) => (
          <SelectItem key={b.systemId} value={b.systemId}>
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function DateRangeSelect({
  value,
  onChange,
  today,
}: {
  value: DateRange
  onChange: (v: DateRange) => void
  today: Date | null
}) {
  const [open, setOpen] = React.useState(false)
  const [showCustom, setShowCustom] = React.useState(false)
  const [customFrom, setCustomFrom] = React.useState(value.from)
  const [customTo, setCustomTo] = React.useState(value.to)
  const presets = React.useMemo(
    () => today ? getPresets(today) : [],
    [today]
  )

  const handlePreset = (preset: ReturnType<typeof getPresets>[number]) => {
    const range = preset.range()
    onChange(range)
    setShowCustom(false)
    setOpen(false)
  }

  const handleCustomApply = () => {
    if (customFrom && customTo && customFrom <= customTo) {
      onChange({
        from: customFrom,
        to: customTo,
        label: `${fmtDisplay(new Date(customFrom))} - ${fmtDisplay(new Date(customTo))}`,
      })
      setOpen(false)
    }
  }

  const displayLabel = value.label.length > 20
    ? `${fmtDisplay(new Date(value.from))} - ${fmtDisplay(new Date(value.to))}`
    : value.label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-normal">
          <CalendarIcon className="h-3.5 w-3.5" />
          {displayLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-70 p-3" align="end">
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant={value.label === preset.label ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => handlePreset(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <div className="mt-2 border-t pt-2">
          <Button
            variant={showCustom ? 'default' : 'outline'}
            size="sm"
            className="w-full h-8 text-xs"
            onClick={() => {
              setShowCustom(!showCustom)
              setCustomFrom(value.from)
              setCustomTo(value.to)
            }}
          >
            Tùy chọn
          </Button>
          {showCustom && (
            <div className="mt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="dr-from" className="text-xs text-muted-foreground">Từ ngày</label>
                  <Input
                    id="dr-from"
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="dr-to" className="text-xs text-muted-foreground">Đến ngày</label>
                  <Input
                    id="dr-to"
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <Button
                size="sm"
                className="w-full h-8 text-xs"
                onClick={handleCustomApply}
                disabled={!customFrom || !customTo || customFrom > customTo}
              >
                Lọc
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DashboardPageLite
