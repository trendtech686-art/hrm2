import * as React from 'react';
import { usePageHeader } from '../../../contexts/page-header-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { 
  AlertTriangle, 
  Clock, 
  UserX, 
  CreditCard, 
  HeartPulse,
  Download,
  RefreshCw
} from 'lucide-react';
import { ResponsiveDataTable } from '../../../components/data-table/responsive-data-table';
import { DataTableToolbar } from '../../../components/data-table/data-table-toolbar';
import { getSlaAlertColumns, getDebtAlertColumns, getHealthAlertColumns } from './columns';
import type { ReportTab, ReportSummary } from './types';
import { ROUTES } from '../../../lib/router';
import Fuse from 'fuse.js';
import { useCustomerSlaEvaluation } from '../../customers/sla/hooks';

const EMPTY_SUMMARY: ReportSummary = {
  totalCustomers: 0,
  followUpAlerts: 0,
  reEngagementAlerts: 0,
  debtAlerts: 0,
  healthAlerts: 0,
  criticalCount: 0,
};

export function CustomerSlaReportPage() {
  const slaEngine = useCustomerSlaEvaluation();
  const index = slaEngine.index;
  const summary = React.useMemo<ReportSummary>(() => slaEngine.summary ?? EMPTY_SUMMARY, [slaEngine.summary]);
  const followUpAlerts = index?.followUpAlerts ?? [];
  const reEngagementAlerts = index?.reEngagementAlerts ?? [];
  const debtAlerts = index?.debtAlerts ?? [];
  const healthAlerts = index?.healthAlerts ?? [];

  const [activeTab, setActiveTab] = React.useState<ReportTab>('follow-up');
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });

  // Current tab data and columns
  const { currentData, columns, fuse } = React.useMemo(() => {
    switch (activeTab) {
      case 'follow-up':
        return {
          currentData: followUpAlerts,
          columns: getSlaAlertColumns(),
          fuse: new Fuse(followUpAlerts, { 
            keys: ['customer.name', 'customer.id', 'customer.phone'], 
            threshold: 0.4 
          }),
        };
      case 're-engagement':
        return {
          currentData: reEngagementAlerts,
          columns: getSlaAlertColumns(),
          fuse: new Fuse(reEngagementAlerts, { 
            keys: ['customer.name', 'customer.id', 'customer.phone'], 
            threshold: 0.4 
          }),
        };
      case 'debt':
        return {
          currentData: debtAlerts,
          columns: getDebtAlertColumns(),
          fuse: new Fuse(debtAlerts, { 
            keys: ['customer.name', 'customer.id', 'customer.phone'], 
            threshold: 0.4 
          }),
        };
      case 'health':
        return {
          currentData: healthAlerts,
          columns: getHealthAlertColumns(),
          fuse: new Fuse(healthAlerts, { 
            keys: ['customer.name', 'customer.id', 'customer.segment'], 
            threshold: 0.4 
          }),
        };
      default:
        return { currentData: [], columns: [], fuse: null };
    }
  }, [activeTab, followUpAlerts, reEngagementAlerts, debtAlerts, healthAlerts]);

  // Filter data
  const filteredData = React.useMemo(() => {
    if (!globalFilter || !fuse) return currentData;
    return fuse.search(globalFilter).map(r => r.item);
  }, [currentData, globalFilter, fuse]);

  // Sorted data
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a: any, b: any) => {
        const aValue = a[sorting.id];
        const bValue = b[sorting.id];
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        // Special handling for date columns
        if (sorting.id === 'createdAt') {
          const aTime = aValue ? new Date(aValue).getTime() : 0;
          const bTime = bValue ? new Date(bValue).getTime() : 0;
          return sorting.desc ? bTime - aTime : aTime - bTime;
        }
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sorting]);

  // Pagination
  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = sortedData.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  // Actions
  const handleExport = React.useCallback(() => window.print(), []);
  const handleRefresh = React.useCallback(() => {
    // Force re-render by setting state
    setGlobalFilter('');
    setPagination({ pageIndex: 0, pageSize: 20 });
  }, []);

  const headerActions = React.useMemo(() => [
    <Button key="refresh" variant="outline" size="sm" className="h-9" onClick={handleRefresh}>
      <RefreshCw className="mr-2 h-4 w-4" />
      Làm mới
    </Button>,
    <Button key="export" size="sm" className="h-9" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Xuất báo cáo
    </Button>,
  ], [handleExport, handleRefresh]);

  // Page header
  usePageHeader(React.useMemo(() => ({
    title: 'Báo cáo cảnh báo khách hàng',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: '/reports' },
      { label: 'Cảnh báo khách hàng', href: '/reports/customer-sla', isCurrent: true },
    ],
    showBackButton: false,
    actions: headerActions,
  }), [headerActions]));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="cursor-pointer hover:border-primary" onClick={() => setActiveTab('follow-up')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cần liên hệ</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-h4 font-bold">{summary.followUpAlerts}</div>
            <p className="text-xs text-muted-foreground">Khách hàng cần follow-up</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary" onClick={() => setActiveTab('re-engagement')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kích hoạt lại</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-h4 font-bold">{summary.reEngagementAlerts}</div>
            <p className="text-xs text-muted-foreground">Khách không hoạt động</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary" onClick={() => setActiveTab('debt')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công nợ</CardTitle>
            <CreditCard className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-h4 font-bold">{summary.debtAlerts}</div>
            <p className="text-xs text-muted-foreground">Khách có nợ quá hạn</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary" onClick={() => setActiveTab('health')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rủi ro churn</CardTitle>
            <HeartPulse className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-h4 font-bold">{summary.healthAlerts}</div>
            <p className="text-xs text-muted-foreground">Khách có rủi ro rời bỏ</p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Nghiêm trọng</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-h4 font-bold text-destructive">{summary.criticalCount}</div>
            <p className="text-xs text-destructive">Cần xử lý ngay</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs with Data Tables */}
      <Card>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ReportTab)}>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Danh sách cảnh báo</CardTitle>
                <CardDescription>
                  Khách hàng cần được chú ý theo từng tiêu chí
                </CardDescription>
              </div>
              <TabsList>
                <TabsTrigger value="follow-up" className="gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Liên hệ</span>
                  <Badge variant="secondary" className="ml-1">{followUpAlerts.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="re-engagement" className="gap-2">
                  <UserX className="h-4 w-4" />
                  <span className="hidden sm:inline">Kích hoạt</span>
                  <Badge variant="secondary" className="ml-1">{reEngagementAlerts.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="debt" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Công nợ</span>
                  <Badge variant="secondary" className="ml-1">{debtAlerts.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="health" className="gap-2">
                  <HeartPulse className="h-4 w-4" />
                  <span className="hidden sm:inline">Sức khỏe</span>
                  <Badge variant="secondary" className="ml-1">{healthAlerts.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          
          <CardContent>
            <DataTableToolbar
              search={globalFilter}
              onSearchChange={setGlobalFilter}
              searchPlaceholder="Tìm theo tên, mã, SĐT..."
              numResults={filteredData.length}
            />
            
            <div className="mt-4">
              <ResponsiveDataTable
                data={paginatedData}
                columns={columns as any}
                rowCount={filteredData.length}
                pageCount={pageCount}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                rowSelection={{}}
                setRowSelection={() => {}}
                allSelectedRows={[]}
                expanded={{}}
                setExpanded={() => {}}
                columnVisibility={{}}
                setColumnVisibility={() => {}}
                columnOrder={[]}
                setColumnOrder={() => {}}
                pinnedColumns={[]}
                setPinnedColumns={() => {}}
                emptyTitle={
                  activeTab === 'follow-up' ? 'Không có khách hàng nào cần follow-up' :
                  activeTab === 're-engagement' ? 'Không có khách hàng nào cần kích hoạt lại' :
                  activeTab === 'debt' ? 'Không có khách hàng nào có công nợ cần theo dõi' :
                  'Không có khách hàng nào có rủi ro churn'
                }
              />
            </div>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

export default CustomerSlaReportPage;
