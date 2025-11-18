import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, isDateSame, isDateAfter, isDateBefore, addDays, subtractDays } from '../../lib/date-utils.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useOrderStore } from '../orders/store.ts';
import { useCustomerStore } from '../customers/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { ChartBar, ChartLine, ChartArea, ChartPie } from '../../components/ui/chart.tsx';
import { Package, Truck, DollarSign, Users, ChevronRight, UserCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { ResponsiveContainer } from '../../components/ui/responsive-container.tsx';
import { MobileGrid } from '../../components/mobile/mobile-grid.tsx';
import { TouchButton } from '../../components/mobile/touch-button.tsx';
import { useMediaQuery } from '../../lib/use-media-query.ts';
import { DebtAlertWidget } from './debt-alert-widget.tsx';
import type { OrderMainStatus } from '../orders/types.ts';
const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const statusVariants: Record<OrderMainStatus, "success" | "default" | "secondary" | "warning" | "destructive"> = {
    "Đặt hàng": "secondary",
    "Đang giao dịch": "warning",
    "Hoàn thành": "success",
    "Đã hủy": "destructive",
};

export function DashboardPage() {
    const { data: orders } = useOrderStore();
    const { data: customers } = useCustomerStore();
    const { data: employees } = useEmployeeStore();
    const navigate = useNavigate();
    
    usePageHeader({
        title: 'Dashboard',
    });

    const stats = React.useMemo(() => {
        const today = getCurrentDate();
        const todaysOrders = orders.filter(o => isDateSame(o.orderDate, today) && o.status !== 'Đã hủy');

        // Contract expiry alerts
        const in30Days = addDays(today, 30);
        const in60Days = addDays(today, 60);
        const in90Days = addDays(today, 90);
        
        const contractsExpiring30 = employees.filter(e => {
            if (!e.contractEndDate || e.employmentStatus !== 'Đang làm việc') return false;
            const endDate = new Date(e.contractEndDate);
            return isDateAfter(endDate, today) && isDateBefore(endDate, in30Days);
        }).length;
        
        const contractsExpiring60 = employees.filter(e => {
            if (!e.contractEndDate || e.employmentStatus !== 'Đang làm việc') return false;
            const endDate = new Date(e.contractEndDate);
            return isDateAfter(endDate, today) && isDateBefore(endDate, in60Days);
        }).length;
        
        const contractsExpiring90 = employees.filter(e => {
            if (!e.contractEndDate || e.employmentStatus !== 'Đang làm việc') return false;
            const endDate = new Date(e.contractEndDate);
            return isDateAfter(endDate, today) && isDateBefore(endDate, in90Days);
        }).length;

        return {
            revenue: todaysOrders.reduce((sum, o) => sum + o.grandTotal, 0),
            pendingPackaging: orders.filter(o => (o.packagings || []).some(p => p.status === 'Chờ đóng gói')).length,
            shipping: orders.filter(o => o.deliveryStatus === 'Đang giao hàng').length,
            newCustomers: customers.filter(c => isDateSame(c.createdAt, today)).length,
            activeEmployees: employees.filter(e => e.employmentStatus === 'Đang làm việc').length,
            totalEmployees: employees.length,
            contractsExpiring30,
            contractsExpiring60,
            contractsExpiring90,
        };
    }, [orders, customers, employees]);
    
    // Chart data
    const revenueChartData = React.useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = subtractDays(getCurrentDate(), i);
            const dayOrders = orders.filter(o => 
                isDateSame(o.orderDate, date) && 
                o.status !== 'Đã hủy'
            );
            return {
                name: formatDateCustom(date, 'dd/MM'),
                revenue: dayOrders.reduce((sum, o) => sum + o.grandTotal, 0) / 1000000, // Convert to millions
                orders: dayOrders.length,
            };
        }).reverse();
        return last7Days;
    }, [orders]);

    const employeeStatusData = React.useMemo(() => [
        { name: 'Đang làm việc', value: employees.filter(e => e.employmentStatus === 'Đang làm việc').length },
        { name: 'Tạm nghỉ', value: employees.filter(e => e.employmentStatus === 'Tạm nghỉ').length },
        { name: 'Đã nghỉ việc', value: employees.filter(e => e.employmentStatus === 'Đã nghỉ việc').length },
    ], [employees]);

    const departmentData = React.useMemo(() => {
        const deptCount = employees.reduce((acc, emp) => {
            acc[emp.department] = (acc[emp.department] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(deptCount).map(([name, value]) => ({ name, value }));
    }, [employees]);
    
    const recentOrders = React.useMemo(() => {
        return [...orders].sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).slice(0, 5);
    }, [orders]);
    
    const isMobile = !useMediaQuery("(min-width: 768px)");

    const StatCard = ({ title, value, icon: Icon, link, description, variant = 'default' }: { 
        title: string, 
        value: string | number, 
        icon: React.ElementType, 
        link?: string, 
        description?: string, 
        variant?: 'default' | 'destructive' | 'warning' 
    }) => {
        const variantStyles = {
            default: 'hover:shadow-lg',
            destructive: 'border-destructive/50 bg-destructive/5 hover:shadow-destructive/10',
            warning: 'border-yellow-500/50 bg-yellow-50 hover:shadow-yellow-500/10',
        };

        return (
            <Card 
                className={`group ${variantStyles[variant]} hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}
                onClick={link ? () => navigate(link) : undefined}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{title}</CardTitle>
                    <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} ${variant === 'destructive' ? 'text-destructive' : variant === 'warning' ? 'text-yellow-600' : 'text-muted-foreground'} group-hover:text-primary transition-colors`} />
                </CardHeader>
                <CardContent>
                    <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold ${variant === 'destructive' ? 'text-destructive' : variant === 'warning' ? 'text-yellow-700' : ''}`}>{value}</div>
                    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                    {link && <ChevronRight className="h-4 w-4 text-muted-foreground mt-2 group-hover:translate-x-1 transition-transform" />}
                </CardContent>
            </Card>
        );
    };

    // Mobile-friendly order card
    const MobileOrderCard = ({ order }: { order: typeof recentOrders[0] }) => (
        <Card 
            className="hover:shadow-md transition-shadow cursor-pointer" 
            onClick={() => navigate(`/orders/${order.systemId}`)}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <p className="font-medium text-sm">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.id}</p>
                    </div>
                    <Badge variant={statusVariants[order.status] as any}>{order.status}</Badge>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">Tổng tiền</span>
                    <span className="font-semibold text-sm">{formatCurrency(order.grandTotal)}</span>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <ResponsiveContainer size="fullDesktop" className="px-4 lg:px-6">
            <div className="space-y-6">
                {/* KPI Stats - Mobile Optimized Grid */}
                <MobileGrid minItemWidth={isMobile ? 150 : 200} gap="md">
                    <StatCard title="Doanh thu hôm nay" value={formatCurrency(stats.revenue)} icon={DollarSign} />
                    <StatCard title="Đơn chờ đóng gói" value={stats.pendingPackaging} icon={Package} link="/packaging" />
                    <StatCard title="Đơn đang giao" value={stats.shipping} icon={Truck} link="/shipments" />
                    <StatCard title="Khách hàng mới" value={`+${stats.newCustomers}`} icon={Users} link="/customers" />
                    <StatCard title="Nhân viên hoạt động" value={`${stats.activeEmployees}/${stats.totalEmployees}`} icon={UserCheck} link="/employees" />
                </MobileGrid>

                {/* Contract Expiry Alerts */}
                {(stats.contractsExpiring30 > 0 || stats.contractsExpiring60 > 0 || stats.contractsExpiring90 > 0) && (
                    <Card className="border-yellow-500/50 bg-yellow-50">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                                Cảnh báo hợp đồng sắp hết hạn
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MobileGrid minItemWidth={isMobile ? 150 : 180} gap="sm">
                                {stats.contractsExpiring30 > 0 && (
                                    <StatCard 
                                        title="Hết hạn trong 30 ngày" 
                                        value={stats.contractsExpiring30} 
                                        icon={AlertCircle}
                                        variant="destructive"
                                        link="/employees"
                                        description="Cần xử lý ngay"
                                    />
                                )}
                                {stats.contractsExpiring60 > 0 && (
                                    <StatCard 
                                        title="Hết hạn trong 60 ngày" 
                                        value={stats.contractsExpiring60} 
                                        icon={AlertCircle}
                                        variant="warning"
                                        link="/employees"
                                        description="Cần chuẩn bị"
                                    />
                                )}
                                {stats.contractsExpiring90 > 0 && (
                                    <StatCard 
                                        title="Hết hạn trong 90 ngày" 
                                        value={stats.contractsExpiring90} 
                                        icon={AlertCircle}
                                        link="/employees"
                                        description="Theo dõi"
                                    />
                                )}
                            </MobileGrid>
                        </CardContent>
                    </Card>
                )}

                {/* Debt Alert Widget */}
                <DebtAlertWidget />

                {/* Charts Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    <ChartLine
                        title="Doanh thu 7 ngày qua"
                        description="Triệu VNĐ"
                        data={revenueChartData}
                        lines={[
                            { dataKey: 'revenue', name: 'Doanh thu', color: 'hsl(var(--primary))' },
                        ]}
                        height={250}
                    />
                    <ChartBar
                        title="Đơn hàng 7 ngày qua"
                        data={revenueChartData}
                        bars={[
                            { dataKey: 'orders', name: 'Số đơn', color: 'hsl(var(--chart-1))' },
                        ]}
                        height={250}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <ChartPie
                        title="Tình trạng nhân viên"
                        data={employeeStatusData}
                        height={250}
                    />
                    <ChartPie
                        title="Phân bố theo phòng ban"
                        data={departmentData}
                        height={250}
                    />
                </div>

                {/* Recent Orders - Responsive Layout */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>Đơn hàng gần đây</CardTitle>
                        <TouchButton 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate('/orders')}
                        >
                            Xem tất cả
                        </TouchButton>
                    </CardHeader>
                    <CardContent>
                        {isMobile ? (
                            /* Mobile: Card layout */
                            <div className="space-y-3">
                                {recentOrders.map(order => (
                                    <MobileOrderCard key={order.systemId} order={order} />
                                ))}
                            </div>
                        ) : (
                            /* Desktop: Table layout */
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Khách hàng</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Tổng tiền</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders.map(order => (
                                        <TableRow key={order.systemId} onClick={() => navigate(`/orders/${order.systemId}`)} className="cursor-pointer">
                                            <TableCell>
                                                <div className="font-medium">{order.customerName}</div>
                                                <div className="text-xs text-muted-foreground">{order.id}</div>
                                            </TableCell>
                                            <TableCell><Badge variant={statusVariants[order.status] as any}>{order.status}</Badge></TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(order.grandTotal)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ResponsiveContainer>
    );
}
