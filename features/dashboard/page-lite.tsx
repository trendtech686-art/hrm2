'use client'

/**
 * Lightweight Dashboard Page
 * 
 * KHÔNG import heavy stores như OrderStore, CustomerStore, EmployeeStore.
 * Thay vào đó, fetch aggregated data từ API.
 * 
 * Pattern này:
 * 1. Compile nhanh (không import 60+ stores)
 * 2. Scale được với triệu records (aggregation trên database)
 * 3. Memory efficient (chỉ giữ data đang hiển thị)
 */

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { usePageHeader } from '@/contexts/page-header-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Package, 
  Truck, 
  DollarSign, 
  Users, 
  UserCheck, 
  TrendingUp,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react'

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

const statusVariants: Record<string, "success" | "default" | "secondary" | "warning" | "destructive"> = {
  "Đặt hàng": "secondary",
  "Đang giao dịch": "warning",
  "Hoàn thành": "success",
  "Đã hủy": "destructive",
}

// Fetch dashboard data from API
function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard')
      if (!response.ok) throw new Error('Failed to fetch dashboard')
      const json = await response.json()
      return json.data
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Auto refresh every minute
  })
}

export function DashboardPageLite() {
  const router = useRouter()
  const { data, isLoading, error } = useDashboardData()

  const headerActions = React.useMemo(() => [
    <Button
      key="reports"
      variant="outline"
      size="sm"
      className="h-9"
      onClick={() => router.push('/reports')}
    >
      Xem báo cáo
    </Button>,
    <Button
      key="new-order"
      size="sm"
      className="h-9"
      onClick={() => router.push('/orders/new')}
    >
      Tạo đơn hàng
    </Button>,
  ], [router])

  usePageHeader({
    title: 'Tổng quan hoạt động',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Dashboard', href: '/dashboard', isCurrent: true },
    ],
    showBackButton: false,
    actions: headerActions,
  })

  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        Không thể tải dữ liệu dashboard. Vui lòng thử lại.
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Doanh thu hôm nay"
          value={isLoading ? undefined : formatCurrency(data?.summary?.totalRevenue || 0)}
          icon={DollarSign}
          loading={isLoading}
        />
        <StatsCard
          title="Đơn hàng"
          value={isLoading ? undefined : String(data?.summary?.totalOrders || 0)}
          icon={ShoppingCart}
          loading={isLoading}
        />
        <StatsCard
          title="Đang giao hàng"
          value={isLoading ? undefined : String(data?.summary?.shippingOrders || 0)}
          icon={Truck}
          loading={isLoading}
        />
        <StatsCard
          title="Nhân viên hoạt động"
          value={isLoading ? undefined : String(data?.summary?.activeEmployees || 0)}
          icon={UserCheck}
          loading={isLoading}
        />
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Đơn hàng gần đây</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push('/orders')}>
              Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead className="text-right">Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.recentOrders?.slice(0, 5).map((order: any) => (
                    <TableRow 
                      key={order.systemId}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/orders/${order.systemId}`)}
                    >
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName || 'Khách lẻ'}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(order.grandTotal)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[order.status] || 'default'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Sản phẩm bán chạy</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push('/products')}>
              Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className="text-right">SL bán</TableHead>
                    <TableHead className="text-right">Doanh thu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.topProducts?.map((product: any) => (
                    <TableRow 
                      key={product.systemId}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/products/${product.systemId}`)}
                    >
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.total_quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(Number(product.total_revenue))}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!data?.topProducts || data.topProducts.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Chưa có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Stats Card Component
function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  loading 
}: { 
  title: string
  value?: string
  icon: React.ElementType
  loading?: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardPageLite
