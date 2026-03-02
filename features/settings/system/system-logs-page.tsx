"use client";

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { useColumnLayout } from '../../../hooks/use-column-visibility';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../../components/ui/sheet';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { ResponsiveDataTable } from '../../../components/data-table/responsive-data-table';
import { PageFilters } from '../../../components/layout/page-filters';
import type { ColumnDef } from '../../../components/data-table/types';
import { 
  Search, Plus, Pencil, Trash2, RefreshCw, History, User, 
  Package, Users, ShoppingCart, Truck, Receipt, CreditCard, 
  Warehouse, ClipboardList, RotateCcw, FileText, Settings, 
  ArrowRight, Calendar, Eye
} from 'lucide-react';

// Activity Log type based on Prisma model
interface ActivityLog {
  systemId: string;
  entityType: string;
  entityId: string;
  action: string;
  actionType: string | null;
  changes: Record<string, { from: unknown; to: unknown }> | null;
  metadata: Record<string, unknown> | null;
  note: string | null;
  createdAt: string;
  createdBy: string | null;
}

// Fetch activity logs
async function fetchActivityLogs(params: {
  entityType?: string;
  actionType?: string;
  limit?: number;
  offset?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params.entityType) searchParams.set('entityType', params.entityType);
  if (params.actionType) searchParams.set('actionType', params.actionType);
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.offset) searchParams.set('offset', String(params.offset));
  
  const url = searchParams.toString() ? `/api/activity-logs?${searchParams}` : '/api/activity-logs';
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch activity logs');
  }
  
  return response.json() as Promise<{ data: ActivityLog[]; total: number; limit: number; offset: number }>;
}

export function SystemLogsPage() {
  useSettingsPageHeader({
    title: 'Nhật ký hệ thống',
  });

  const [searchTerm, setSearchTerm] = React.useState('');
  const [entityFilter, setEntityFilter] = React.useState<string>('all');
  const [actionTypeFilter, setActionTypeFilter] = React.useState<string>('all');
  
  // Pagination state
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = useColumnLayout('system-logs');
  
  // Detail sheet
  const [selectedLog, setSelectedLog] = React.useState<ActivityLog | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  
  // Fetch logs with React Query
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['activity-logs', entityFilter, actionTypeFilter, pagination.pageSize],
    queryFn: () => fetchActivityLogs({
      entityType: entityFilter !== 'all' ? entityFilter : undefined,
      actionType: actionTypeFilter !== 'all' ? actionTypeFilter : undefined,
    }),
    staleTime: 30 * 1000,
  });
  
  const allLogs = React.useMemo(() => data?.data ?? [], [data?.data]);
  
  // Filter logs client-side for search
  const filteredLogs = React.useMemo(() => {
    let logs = allLogs;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.entityId.toLowerCase().includes(term) ||
          log.action.toLowerCase().includes(term) ||
          (log.note && log.note.toLowerCase().includes(term))
      );
    }
    
    return logs;
  }, [allLogs, searchTerm]);
  
  // Sorted data
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredLogs];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aVal = (a as unknown as Record<string, unknown>)[sorting.id];
        const bVal = (b as unknown as Record<string, unknown>)[sorting.id];
        
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        const comparison = String(aVal).localeCompare(String(bVal));
        return sorting.desc ? -comparison : comparison;
      });
    }
    return sorted;
  }, [filteredLogs, sorting]);
  
  // Paginated data
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return sortedData.slice(start, start + pagination.pageSize);
  }, [sortedData, pagination]);
  
  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  
  // Helper functions
  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'product':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'employee':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'customer':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'supplier':
        return <Truck className="h-4 w-4 text-orange-500" />;
      case 'order':
        return <ShoppingCart className="h-4 w-4 text-indigo-500" />;
      case 'purchase':
      case 'purchase-order':
        return <ClipboardList className="h-4 w-4 text-cyan-500" />;
      case 'stock-transfer':
        return <RotateCcw className="h-4 w-4 text-teal-500" />;
      case 'inventory':
      case 'inventory-check':
        return <Warehouse className="h-4 w-4 text-amber-500" />;
      case 'receipt':
        return <Receipt className="h-4 w-4 text-emerald-500" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-red-500" />;
      case 'settings':
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getActionIcon = (action: string) => {
    if (action.includes('created') || action.includes('create')) {
      return <Plus className="h-3.5 w-3.5 text-green-500" />;
    }
    if (action.includes('updated') || action.includes('update') || action.includes('changed')) {
      return <Pencil className="h-3.5 w-3.5 text-blue-500" />;
    }
    if (action.includes('deleted') || action.includes('delete')) {
      return <Trash2 className="h-3.5 w-3.5 text-red-500" />;
    }
    return <RefreshCw className="h-3.5 w-3.5 text-gray-500" />;
  };
  
  const getActionBadgeColor = (actionType: string | null) => {
    switch (actionType) {
      case 'create':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delete':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'status':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  const getEntityLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      'product': 'Sản phẩm',
      'employee': 'Nhân viên',
      'customer': 'Khách hàng',
      'supplier': 'Nhà cung cấp',
      'order': 'Đơn hàng',
      'purchase': 'Đơn nhập',
      'purchase-order': 'Đơn nhập',
      'stock-transfer': 'Chuyển kho',
      'inventory': 'Tồn kho',
      'inventory-check': 'Kiểm kê',
      'receipt': 'Phiếu thu',
      'payment': 'Phiếu chi',
      'settings': 'Cài đặt',
    };
    return labels[entityType] || entityType;
  };
  
  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'created': 'Tạo mới',
      'updated': 'Cập nhật',
      'deleted': 'Xóa',
      'status_changed': 'Đổi trạng thái',
      'price_changed': 'Đổi giá',
      'stock_changed': 'Đổi tồn kho',
      'payment_added': 'Thêm thanh toán',
      'delivered': 'Giao hàng',
      'cancelled': 'Hủy',
      'completed': 'Hoàn thành',
    };
    return labels[action] || action.replace(/_/g, ' ');
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  
  const handleRowClick = (log: ActivityLog) => {
    setSelectedLog(log);
    setIsSheetOpen(true);
  };
  
  // Render changes in detail view
  const renderChanges = (changes: Record<string, { from: unknown; to: unknown }> | null) => {
    if (!changes || Object.keys(changes).length === 0) {
      return <p className="text-sm text-muted-foreground">Không có thay đổi chi tiết</p>;
    }
    
    return (
      <div className="space-y-2">
        {Object.entries(changes).map(([field, { from, to }]) => (
          <div key={field} className="flex items-start gap-2 text-sm p-2 rounded-md bg-muted/50">
            <span className="font-medium min-w-24">{field}:</span>
            <span className="text-red-600 line-through">{String(from ?? '(trống)')}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-green-600">{String(to ?? '(trống)')}</span>
          </div>
        ))}
      </div>
    );
  };

  // Define columns
  const columns: ColumnDef<ActivityLog>[] = [
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'Thời gian',
      size: 150,
      cell: ({ row }) => (
        <span className="text-xs font-mono">
          {formatTimestamp(row.createdAt)}
        </span>
      ),
    },
    {
      id: 'entityType',
      accessorKey: 'entityType',
      header: 'Module',
      size: 120,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getEntityIcon(row.entityType)}
          <span className="text-sm">{getEntityLabel(row.entityType)}</span>
        </div>
      ),
    },
    {
      id: 'action',
      accessorKey: 'action',
      header: 'Hành động',
      size: 150,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getActionIcon(row.action)}
          <Badge variant="outline" className={`text-xs ${getActionBadgeColor(row.actionType)}`}>
            {getActionLabel(row.action)}
          </Badge>
        </div>
      ),
    },
    {
      id: 'entityId',
      accessorKey: 'entityId',
      header: 'ID',
      size: 130,
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground truncate block max-w-28" title={row.entityId}>
          {row.entityId}
        </span>
      ),
    },
    {
      id: 'note',
      accessorKey: 'note',
      header: 'Ghi chú',
      size: 200,
      cell: ({ row }) => (
        <span className="text-sm truncate block max-w-45" title={row.note || undefined}>
          {row.note || '-'}
        </span>
      ),
    },
    {
      id: 'createdBy',
      accessorKey: 'createdBy',
      header: 'Người thực hiện',
      size: 130,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="truncate max-w-25">
            {row.createdBy || 'Hệ thống'}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      accessorKey: 'systemId',
      header: '',
      size: 50,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(row);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  // Mobile card renderer
  const renderMobileCard = (log: ActivityLog) => (
    <div className="p-4 space-y-3" onClick={() => handleRowClick(log)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {getEntityIcon(log.entityType)}
          <span className="font-medium">{getEntityLabel(log.entityType)}</span>
        </div>
        <Badge variant="outline" className={`text-xs ${getActionBadgeColor(log.actionType)}`}>
          {getActionLabel(log.action)}
        </Badge>
      </div>
      
      <div className="space-y-1.5">
        <p className="text-xs font-mono text-muted-foreground">ID: {log.entityId}</p>
        {log.note && <p className="text-sm">{log.note}</p>}
        <p className="text-xs text-muted-foreground">
          {formatTimestamp(log.createdAt)}
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{log.createdBy || 'Hệ thống'}</span>
        </div>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

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
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <PageFilters>
            <div className="relative flex-1 min-w-50">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả module</SelectItem>
                <SelectItem value="product">Sản phẩm</SelectItem>
                <SelectItem value="employee">Nhân viên</SelectItem>
                <SelectItem value="customer">Khách hàng</SelectItem>
                <SelectItem value="supplier">Nhà cung cấp</SelectItem>
                <SelectItem value="order">Đơn hàng</SelectItem>
                <SelectItem value="purchase">Đơn nhập</SelectItem>
                <SelectItem value="inventory">Tồn kho</SelectItem>
                <SelectItem value="receipt">Phiếu thu</SelectItem>
                <SelectItem value="payment">Phiếu chi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Loại thao tác" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="create">Tạo mới</SelectItem>
                <SelectItem value="update">Cập nhật</SelectItem>
                <SelectItem value="delete">Xóa</SelectItem>
                <SelectItem value="status">Đổi trạng thái</SelectItem>
              </SelectContent>
            </Select>
          </PageFilters>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{filteredLogs.length} logs</span>
            {filteredLogs.length !== allLogs.length && (
              <span className="text-xs">(tổng: {allLogs.length})</span>
            )}
          </div>
          
          {/* ResponsiveDataTable */}
          <ResponsiveDataTable<ActivityLog>
            columns={columns}
            data={paginatedData}
            isLoading={isLoading}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={sortedData.length}
            sorting={sorting}
            setSorting={setSorting}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
            renderMobileCard={renderMobileCard}
            onRowClick={handleRowClick}
            emptyTitle="Chưa có hoạt động"
            emptyDescription={
              searchTerm || entityFilter !== 'all' || actionTypeFilter !== 'all'
                ? 'Không tìm thấy log nào phù hợp với bộ lọc'
                : 'Chưa có hoạt động nào được ghi lại'
            }
            emptyAction={
              allLogs.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <History className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm">Các thao tác sẽ được ghi nhận tự động</p>
                </div>
              ) : undefined
            }
          />
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
                        <span className="text-sm font-mono">{formatTimestamp(selectedLog.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Module</span>
                      <div className="flex items-center gap-2">
                        {getEntityIcon(selectedLog.entityType)}
                        <span className="text-sm font-medium">{getEntityLabel(selectedLog.entityType)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Hành động</span>
                      <Badge variant="outline" className={getActionBadgeColor(selectedLog.actionType)}>
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
                        <span className="text-sm">{selectedLog.createdBy || 'Hệ thống'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
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
  );
}
