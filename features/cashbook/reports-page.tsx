'use client'

import * as React from 'react';
import { formatDate, formatDateCustom, toISODate, toISODateTime } from '../../lib/date-utils';
import { useNavigate } from '@/lib/next-compat';
import { ROUTES } from '../../lib/router';
import { startOfMonth, endOfMonth, isAfter, isBefore, isWithinInterval, isSameDay, differenceInMilliseconds, parse as dateParse } from 'date-fns';
import { usePageHeader } from '../../contexts/page-header-context';
import { useReceiptStore } from '../receipts/store';
import { usePaymentStore } from '../payments/store';
import { useBranchStore } from '../settings/branches/store';
import { useCustomerStore } from '../customers/store';
import { useReceiptTypeStore } from '../settings/receipt-types/store';
import { usePaymentTypeStore } from '../settings/payments/types/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DataTableDateFilter } from '../../components/data-table/data-table-date-filter';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users, FileText } from 'lucide-react';
import { useMediaQuery } from '../../lib/use-media-query';
import { Button } from '../../components/ui/button';

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

const COLORS = {
  receipt: '#10b981', // green-500
  payment: '#ef4444', // red-500
  approved: '#3b82f6', // blue-500
  pending: '#f59e0b', // amber-500
  cancelled: '#6b7280', // gray-500
};

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function CashbookReportsPage() {
  const navigate = useNavigate();

  const { data: receipts } = useReceiptStore();
  const { data: payments } = usePaymentStore();
  const vouchers = React.useMemo(() => [
    ...receipts.map(r => ({ ...r, type: 'receipt' as const })),
    ...payments.map(p => ({ ...p, type: 'payment' as const }))
  ], [receipts, payments]);
  const { data: branches } = useBranchStore();
  const { data: customers } = useCustomerStore();
  const { data: receiptTypes } = useReceiptTypeStore();
  const { data: paymentTypes } = usePaymentTypeStore();
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [branchFilter, setBranchFilter] = React.useState<string>('all');
  const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>([
    toISODate(startOfMonth(new Date())),
    toISODate(endOfMonth(new Date()))
  ]);
  
  // ✅ Filter vouchers by branch and date range
  const filteredVouchers = React.useMemo(() => {
    let result = vouchers;
    
    // Branch filter
    if (branchFilter && branchFilter !== 'all') {
      result = result.filter(v => v.branchSystemId === branchFilter);
    }
    
    // Date range filter
    if (dateRange && (dateRange[0] || dateRange[1])) {
      result = result.filter(v => {
        if (!v.date) return false;
        const voucherDate = new Date(v.date);
        const start = dateRange[0] ? new Date(dateRange[0]) : null;
        const end = dateRange[1] ? new Date(dateRange[1]) : null;
        
        if (start && end) {
          return isWithinInterval(voucherDate, { start, end });
        } else if (start) {
          return isAfter(voucherDate, start) || isSameDay(voucherDate, start);
        } else if (end) {
          return isBefore(voucherDate, end) || isSameDay(voucherDate, end);
        }
        return true;
      });
    }
    
    return result;
  }, [vouchers, branchFilter, dateRange]);
  
  // ✅ Calculate summary stats
  const summaryStats = React.useMemo(() => {
    const receipts = filteredVouchers.filter(v => v.type === 'receipt');
    const payments = filteredVouchers.filter(v => v.type === 'payment');
    
    const totalReceipts = receipts.reduce((sum, v) => sum + v.amount, 0);
    const totalPayments = payments.reduce((sum, v) => sum + v.amount, 0);
    const netBalance = totalReceipts - totalPayments;
    
    const receiptCount = receipts.length;
    const paymentCount = payments.length;
    
    return {
      totalReceipts,
      totalPayments,
      netBalance,
      receiptCount,
      paymentCount,
      totalTransactions: receiptCount + paymentCount
    };
  }, [filteredVouchers]);
  
  // ✅ Revenue by day (for line/area chart)
  const revenueByDay = React.useMemo(() => {
    const dayMap = new Map<string, { date: string; receipts: number; payments: number }>();
    
    filteredVouchers.forEach(v => {
      const day = formatDateCustom(new Date(v.date), 'dd/MM');
      const existing = dayMap.get(day) || { date: day, receipts: 0, payments: 0 };
      
      if (v.type === 'receipt') {
        existing.receipts += v.amount;
      } else {
        existing.payments += v.amount;
      }
      
      dayMap.set(day, existing);
    });
    
    return Array.from(dayMap.values()).sort((a, b) => {
      const dateA = dateParse(a.date, 'dd/MM', new Date());
      const dateB = dateParse(b.date, 'dd/MM', new Date());
      return differenceInMilliseconds(dateA, dateB);
    });
  }, [filteredVouchers]);
  
  // ✅ Receipts by type (pie chart)
  const receiptsByType = React.useMemo(() => {
    const typeMap = new Map<string, number>();
    
    filteredVouchers
      .filter(v => v.type === 'receipt')
      .forEach(v => {
        const typeName = v.paymentReceiptTypeName || 'Khác';
        typeMap.set(typeName, (typeMap.get(typeName) || 0) + v.amount);
      });
    
    return Array.from(typeMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredVouchers]);
  
  // ✅ Payments by type (pie chart)
  const paymentsByType = React.useMemo(() => {
    const typeMap = new Map<string, number>();
    
    filteredVouchers
      .filter(v => v.type === 'payment')
      .forEach(v => {
        const typeName = v.paymentReceiptTypeName || 'Khác';
        typeMap.set(typeName, (typeMap.get(typeName) || 0) + v.amount);
      });
    
    return Array.from(typeMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredVouchers]);
  
  // ✅ Top customers (bar chart)
  const topCustomers = React.useMemo(() => {
    const customerMap = new Map<string, { name: string; receipts: number; payments: number; total: number }>();
    
    filteredVouchers.forEach(v => {
      if (!v.customerSystemId) return;
      
      const existing = customerMap.get(v.customerSystemId) || { 
        name: v.customerName || 'Unknown', 
        receipts: 0, 
        payments: 0, 
        total: 0 
      };
      
      if (v.type === 'receipt') {
        existing.receipts += v.amount;
      } else {
        existing.payments += v.amount;
      }
      existing.total = existing.receipts - existing.payments;
      
      customerMap.set(v.customerSystemId, existing);
    });
    
    return Array.from(customerMap.values())
      .sort((a, b) => b.receipts - a.receipts)
      .slice(0, 10);
  }, [filteredVouchers]);

  const headerActions = React.useMemo(() => [
    <Button
      key="cashbook"
      variant="outline"
      size="sm"
      className="h-9 gap-2"
      onClick={() => navigate(ROUTES.FINANCE.CASHBOOK)}
    >
      <FileText className="mr-2 h-4 w-4" />
      Sổ quỹ
    </Button>,
    <Button
      key="receipt"
      size="sm"
      className="h-9 gap-2"
      onClick={() => navigate(ROUTES.FINANCE.RECEIPT_NEW)}
    >
      <DollarSign className="mr-2 h-4 w-4" />
      Lập phiếu thu
    </Button>,
    <Button
      key="payment"
      variant="outline"
      size="sm"
      className="h-9 gap-2"
      onClick={() => navigate(ROUTES.FINANCE.PAYMENT_NEW)}
    >
      <CreditCard className="mr-2 h-4 w-4" />
      Lập phiếu chi
    </Button>
  ], [navigate]);

  const breadcrumb = React.useMemo(() => ([
    { label: 'Trang chủ', href: ROUTES.ROOT },
    { label: 'Sổ quỹ', href: ROUTES.FINANCE.CASHBOOK },
    { label: 'Báo cáo thu chi', href: ROUTES.FINANCE.CASHBOOK_REPORTS },
  ]), []);

  usePageHeader({
    title: 'Báo cáo thu chi',
    showBackButton: true,
    backPath: ROUTES.FINANCE.CASHBOOK,
    breadcrumb,
    actions: headerActions,
  });
  
  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Chi nhánh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                {branches.map(b => (
                  <SelectItem key={b.systemId} value={b.systemId}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DataTableDateFilter 
              value={dateRange} 
              onChange={setDateRange}
              title="Khoảng thời gian"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng Thu</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(summaryStats.totalReceipts)}</p>
                <p className="text-xs text-muted-foreground mt-1">{summaryStats.receiptCount} phiếu</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng Chi</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(summaryStats.totalPayments)}</p>
                <p className="text-xs text-muted-foreground mt-1">{summaryStats.paymentCount} phiếu</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chênh lệch</p>
                <p className={`text-2xl font-bold ${summaryStats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(summaryStats.netBalance))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {summaryStats.netBalance >= 0 ? 'Dương' : 'Âm'}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${summaryStats.netBalance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {summaryStats.netBalance >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Giao dịch</p>
                <p className="text-2xl font-bold">{summaryStats.totalTransactions}</p>
                <p className="text-xs text-muted-foreground mt-1">Tổng số phiếu</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Row 1: Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng Thu Chi theo Ngày</CardTitle>
          <CardDescription>Biểu đồ doanh thu trong kỳ</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
            <AreaChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="receipts" 
                name="Thu" 
                stroke={COLORS.receipt} 
                fill={COLORS.receipt}
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="payments" 
                name="Chi" 
                stroke={COLORS.payment} 
                fill={COLORS.payment}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Charts Row 2: Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ Phiếu Thu theo Loại</CardTitle>
            <CardDescription>Top loại phiếu thu</CardDescription>
          </CardHeader>
          <CardContent>
            {receiptsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                <PieChart>
                  <Pie
                    data={receiptsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={isMobile ? 80 : 100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {receiptsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Không có dữ liệu
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ Phiếu Chi theo Loại</CardTitle>
            <CardDescription>Top loại phiếu chi</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                <PieChart>
                  <Pie
                    data={paymentsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={isMobile ? 80 : 100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Không có dữ liệu
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Row 3: Top Customers */}
      {topCustomers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Khách Hàng</CardTitle>
            <CardDescription>Theo tổng tiền thu</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
              <BarChart data={topCustomers} layout={isMobile ? "vertical" : "horizontal"}>
                <CartesianGrid strokeDasharray="3 3" />
                {isMobile ? (
                  <>
                    <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <YAxis type="category" dataKey="name" width={100} />
                  </>
                ) : (
                  <>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  </>
                )}
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Bar dataKey="receipts" name="Thu" fill={COLORS.receipt} />
                <Bar dataKey="payments" name="Chi" fill={COLORS.payment} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
