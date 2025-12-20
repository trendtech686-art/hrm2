import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { Button } from '../../../../components/ui/button.tsx';
import { Input } from '../../../../components/ui/input.tsx';
import { Badge } from '../../../../components/ui/badge.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select.tsx';
import { ResponsiveDataTable } from '../../../../components/data-table/responsive-data-table.tsx';
import { PageFilters } from '../../../../components/layout/page-filters.tsx';
import type { ColumnDef } from '../../../../components/data-table/types.ts';
import { Search, CheckCircle2, XCircle, AlertCircle, RefreshCw, Globe, Link, Unlink, Save, Settings, DollarSign, Package, FileText, Info, User, Image } from 'lucide-react';
import { usePkgxSettingsStore } from '../store';
import type { PkgxSyncLog } from '../types';

// Extended type with systemId for ResponsiveDataTable
type PkgxSyncLogWithSystemId = PkgxSyncLog & { systemId: string };

export function LogTab() {
  const { settings } = usePkgxSettingsStore();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'success' | 'error' | 'partial' | 'info'>('all');
  const [actionFilter, setActionFilter] = React.useState<string>('all');
  
  // Pagination state
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'timestamp', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  
  // Convert logs to include systemId
  const allLogs = React.useMemo((): PkgxSyncLogWithSystemId[] => {
    return settings.logs.map(log => ({
      ...log,
      systemId: log.id,
    }));
  }, [settings.logs]);
  
  const filteredLogs = React.useMemo(() => {
    let logs = allLogs;
    
    // Filter by status
    if (statusFilter !== 'all') {
      logs = logs.filter((log) => log.status === statusFilter);
    }
    
    // Filter by action
    if (actionFilter !== 'all') {
      logs = logs.filter((log) => log.action === actionFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.message.toLowerCase().includes(term) ||
          log.action.toLowerCase().includes(term) ||
          (log.userName && log.userName.toLowerCase().includes(term))
      );
    }
    
    return logs;
  }, [allLogs, statusFilter, actionFilter, searchTerm]);
  
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
  
  const getStatusBadge = (status: PkgxSyncLog['status']) => {
    switch (status) {
      case 'success':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Thành công
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Lỗi
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="default" className="bg-yellow-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            Một phần
          </Badge>
        );
      case 'info':
        return (
          <Badge variant="secondary">
            <Info className="h-3 w-3 mr-1" />
            Thông tin
          </Badge>
        );
    }
  };
  
  const getActionIcon = (action: PkgxSyncLog['action']) => {
    switch (action) {
      case 'test_connection':
      case 'ping':
        return <Globe className="h-4 w-4 text-blue-500" />;
      case 'sync_price':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'sync_inventory':
        return <Package className="h-4 w-4 text-orange-500" />;
      case 'sync_seo':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'sync_images':
      case 'bulk_sync_images':
      case 'upload_image':
        return <Image className="h-4 w-4 text-pink-500" />;
      case 'create_product':
      case 'update_product':
        return <RefreshCw className="h-4 w-4 text-cyan-500" />;
      case 'link_product':
        return <Link className="h-4 w-4 text-blue-500" />;
      case 'unlink_product':
      case 'unlink_mapping':
      case 'batch_unlink':
        return <Unlink className="h-4 w-4 text-gray-500" />;
      case 'save_config':
      case 'save_mapping':
        return <Save className="h-4 w-4 text-emerald-500" />;
      case 'sync_categories':
      case 'sync_brands':
      case 'get_products':
      case 'sync_all':
      case 'bulk_sync_all':
      case 'bulk_sync_basic':
      case 'bulk_sync_price':
      case 'bulk_sync_inventory':
      case 'bulk_sync_seo':
      case 'bulk_sync_description':
      case 'bulk_sync_flags':
        return <RefreshCw className="h-4 w-4 text-indigo-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getActionLabel = (action: PkgxSyncLog['action']) => {
    const labels: Record<PkgxSyncLog['action'], string> = {
      test_connection: 'Test kết nối',
      ping: 'Ping server',
      sync_all: 'Đồng bộ tất cả',
      sync_price: 'Đồng bộ giá',
      sync_inventory: 'Đồng bộ tồn kho',
      sync_seo: 'Đồng bộ SEO',
      sync_description: 'Đồng bộ mô tả',
      sync_flags: 'Đồng bộ flags',
      sync_basic: 'Đồng bộ cơ bản',
      sync_basic_info: 'Đồng bộ cơ bản',
      sync_images: 'Đồng bộ ảnh',
      create_product: 'Tạo SP',
      update_product: 'Cập nhật SP',
      link_product: 'Liên kết SP',
      unlink_product: 'Hủy liên kết',
      unlink_mapping: 'Hủy mapping',
      batch_unlink: 'Hủy hàng loạt',
      bulk_sync_all: 'Bulk: Tất cả',
      bulk_sync_basic: 'Bulk: Cơ bản',
      bulk_sync_price: 'Bulk: Giá',
      bulk_sync_inventory: 'Bulk: Tồn kho',
      bulk_sync_seo: 'Bulk: SEO',
      bulk_sync_description: 'Bulk: Mô tả',
      bulk_sync_flags: 'Bulk: Flags',
      bulk_sync_images: 'Bulk: Ảnh',
      sync_categories: 'Đồng bộ danh mục',
      sync_brands: 'Đồng bộ thương hiệu',
      get_products: 'Lấy DS sản phẩm',
      upload_image: 'Upload ảnh',
      save_config: 'Lưu cấu hình',
      save_mapping: 'Lưu mapping',
    };
    return labels[action] || action;
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
  
  const getDetailsDisplay = (log: PkgxSyncLogWithSystemId) => {
    if (!log.details) return null;
    
    return (
      <div className="space-y-0.5 text-xs text-muted-foreground">
        {/* API details */}
        {log.details.method && log.details.url && (
          <div className="font-mono text-blue-600">
            {log.details.method} {log.details.url.length > 25 ? '...' + log.details.url.slice(-25) : log.details.url}
          </div>
        )}
        {log.details.httpStatus && (
          <div className={log.details.httpStatus >= 400 ? 'text-red-600' : 'text-green-600'}>
            HTTP: {log.details.httpStatus}
          </div>
        )}
        {log.details.responseTime !== undefined && (
          <div className="text-gray-500">{log.details.responseTime}ms</div>
        )}
        {/* Sync stats */}
        {log.details.total !== undefined && (
          <div>Tổng: {log.details.total}</div>
        )}
        {log.details.success !== undefined && log.details.success > 0 && (
          <div className="text-green-600">OK: {log.details.success}</div>
        )}
        {log.details.failed !== undefined && log.details.failed > 0 && (
          <div className="text-red-600">Lỗi: {log.details.failed}</div>
        )}
        {/* Product details */}
        {log.details.productId && (
          <div>SP: {log.details.productId}</div>
        )}
        {log.details.pkgxId && (
          <div>PKGX: {log.details.pkgxId}</div>
        )}
        {/* Error info */}
        {log.details.errorCode && (
          <div className="text-red-600">Mã: {log.details.errorCode}</div>
        )}
        {log.details.error && (
          <div className="text-red-600 truncate max-w-[150px]" title={log.details.error}>
            {log.details.error}
          </div>
        )}
      </div>
    );
  };

  // Define columns
  const columns: ColumnDef<PkgxSyncLogWithSystemId>[] = [
    {
      id: 'timestamp',
      accessorKey: 'timestamp',
      header: 'Thời gian',
      size: 150,
      cell: ({ row }) => (
        <span className="text-xs font-mono">
          {formatTimestamp(row.timestamp)}
        </span>
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
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            {getActionLabel(row.action)}
          </Badge>
        </div>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Trạng thái',
      size: 110,
      cell: ({ row }) => getStatusBadge(row.status),
    },
    {
      id: 'message',
      accessorKey: 'message',
      header: 'Thông báo',
      size: 280,
      cell: ({ row }) => (
        <span className="text-sm truncate block max-w-[260px]" title={row.message}>
          {row.message}
        </span>
      ),
    },
    {
      id: 'userName',
      accessorKey: 'userName',
      header: 'Người thực hiện',
      size: 130,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="truncate max-w-[100px]" title={row.userName || 'Hệ thống'}>
            {row.userName || 'Hệ thống'}
          </span>
        </div>
      ),
    },
    {
      id: 'details',
      accessorKey: 'details',
      header: 'Chi tiết',
      size: 180,
      cell: ({ row }) => getDetailsDisplay(row),
    },
  ];

  // Mobile card renderer
  const renderMobileCard = (log: PkgxSyncLogWithSystemId) => (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {getActionIcon(log.action)}
          <Badge variant="outline" className="text-xs">
            {getActionLabel(log.action)}
          </Badge>
        </div>
        {getStatusBadge(log.status)}
      </div>
      
      <div className="space-y-1.5">
        <p className="text-sm">{log.message}</p>
        <p className="text-xs text-muted-foreground font-mono">
          {formatTimestamp(log.timestamp)}
        </p>
      </div>
      
      {log.details && (
        <div className="pt-2 border-t">
          {getDetailsDisplay(log)}
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{log.userName || 'Hệ thống'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lịch sử đồng bộ</CardTitle>
          <CardDescription>
            Theo dõi hoạt động đồng bộ với PKGX
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <PageFilters>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v: 'all' | 'success' | 'error' | 'partial' | 'info') => setStatusFilter(v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="success">Thành công</SelectItem>
                <SelectItem value="error">Lỗi</SelectItem>
                <SelectItem value="partial">Một phần</SelectItem>
                <SelectItem value="info">Thông tin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Hành động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả hành động</SelectItem>
                <SelectItem value="test_connection">Test kết nối</SelectItem>
                <SelectItem value="ping">Ping server</SelectItem>
                <SelectItem value="save_config">Lưu cấu hình</SelectItem>
                <SelectItem value="save_mapping">Lưu mapping</SelectItem>
                <SelectItem value="create_product">Tạo sản phẩm</SelectItem>
                <SelectItem value="update_product">Cập nhật SP</SelectItem>
                <SelectItem value="link_product">Liên kết SP</SelectItem>
                <SelectItem value="unlink_product">Hủy liên kết</SelectItem>
                <SelectItem value="sync_all">Đồng bộ tất cả</SelectItem>
                <SelectItem value="sync_price">Đồng bộ giá</SelectItem>
                <SelectItem value="sync_inventory">Đồng bộ tồn kho</SelectItem>
                <SelectItem value="sync_seo">Đồng bộ SEO</SelectItem>
                <SelectItem value="sync_images">Đồng bộ ảnh</SelectItem>
                <SelectItem value="sync_categories">Đồng bộ danh mục</SelectItem>
                <SelectItem value="sync_brands">Đồng bộ thương hiệu</SelectItem>
                <SelectItem value="get_products">Lấy danh sách SP</SelectItem>
                <SelectItem value="upload_image">Upload ảnh</SelectItem>
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
          <ResponsiveDataTable<PkgxSyncLogWithSystemId>
            columns={columns}
            data={paginatedData}
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
            emptyTitle="Chưa có hoạt động"
            emptyDescription={
              searchTerm || statusFilter !== 'all' || actionFilter !== 'all'
                ? 'Không tìm thấy log nào phù hợp với bộ lọc'
                : 'Chưa có hoạt động đồng bộ nào'
            }
            emptyAction={
              allLogs.length === 0 ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <RefreshCw className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm">Bắt đầu đồng bộ để xem lịch sử hoạt động</p>
                </div>
              ) : undefined
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
