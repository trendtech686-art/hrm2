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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Progress } from '../../../components/ui/progress';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { ResponsiveDataTable } from '../../../components/data-table/responsive-data-table';
import { PageFilters } from '../../../components/layout/page-filters';
import type { ColumnDef } from '../../../components/data-table/types';
import { 
  Search, CheckCircle2, XCircle, AlertCircle, 
  Upload, Download, FileSpreadsheet, Package, Users, 
  ShoppingCart, Truck, Receipt, CreditCard, Warehouse,
  ClipboardList, RotateCcw, User, FileText, RefreshCw,
  Eye, Calendar, File, AlertTriangle
} from 'lucide-react';

// Type for import/export log from DB
interface ImportExportLogDB {
  id: string;
  type: 'import' | 'export';
  entityType: string;
  performedAt: string;
  performedBy: string;
  userId: string;
  status: 'success' | 'partial' | 'failed' | 'pending' | 'processing' | 'completed' | 'cancelled';
  totalRecords: number;
  successCount: number;
  errorCount: number;
  skippedCount?: number;
  insertedCount?: number;
  updatedCount?: number;
  progress?: number;
  processedRecords?: number;
  currentChunk?: number;
  totalChunks?: number;
  startedAt?: string | null;
  completedAt?: string | null;
  errors: string | null;
  filePath: string | null;
  fileName: string | null;
  fileSize?: number | null;
  notes: string | null;
  duplicateHandling: string | null;
  importMode?: string | null;
  format: string | null;
  filters: string | null;
}

// Combined log type for display
type CombinedLog = ImportExportLogDB & { 
  systemId: string;
  id: string;
  entityDisplayName: string;
};

// Filter types
type LogType = 'all' | 'import' | 'export';
type LogStatus = 'all' | 'success' | 'partial' | 'failed' | 'pending' | 'processing' | 'completed' | 'cancelled';

// Fetch logs from DB
async function fetchImportExportLogs(params: {
  type?: string;
  entityType?: string;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params.type) searchParams.set('type', params.type);
  if (params.entityType) searchParams.set('entityType', params.entityType);
  if (params.limit) searchParams.set('limit', String(params.limit));
  
  const url = searchParams.toString() ? `/api/import-export-logs/db?${searchParams}` : '/api/import-export-logs/db';
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch logs');
  }
  
  return response.json() as Promise<{ data: ImportExportLogDB[]; total: number }>;
}

export function ImportExportLogsPage() {
  useSettingsPageHeader({
    title: 'Lịch sử nhập xuất',
  });

  return <ImportExportLogsContent />;
}

export function ImportExportLogsContent() {

  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<LogType>('all');
  const [statusFilter, setStatusFilter] = React.useState<LogStatus>('all');
  const [entityFilter, setEntityFilter] = React.useState<string>('all');
  
  // Pagination state
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'performedAt', desc: true });
  const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = useColumnLayout('import-export-logs');
  
  // Detail dialog
  const [selectedLog, setSelectedLog] = React.useState<CombinedLog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  // Fetch logs with React Query from DB
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['import-export-logs-db', typeFilter, entityFilter],
    queryFn: () => fetchImportExportLogs({
      type: typeFilter !== 'all' ? typeFilter : undefined,
      entityType: entityFilter !== 'all' ? entityFilter : undefined,
    }),
    staleTime: 30 * 1000,
  });
  
  // Auto-refresh when there are pending/processing jobs
  const hasActiveJobs = React.useMemo(() => {
    return (data?.data ?? []).some(log => log.status === 'pending' || log.status === 'processing');
  }, [data?.data]);
  
  // Polling effect for active jobs - only poll when tab is visible
  React.useEffect(() => {
    if (!hasActiveJobs) return;
    
    // Don't poll when tab is not visible
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      return;
    }
    
    const POLL_INTERVAL = 15_000; // 15 seconds - less aggressive polling
    
    const interval = setInterval(() => {
      // Check visibility before refetching
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        refetch();
      }
    }, POLL_INTERVAL);
    
    // Also refetch when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasActiveJobs, refetch]);
  
  // Entity display names
  const getEntityDisplayName = (entityType: string) => {
    const names: Record<string, string> = {
      'employees': 'Nhân viên',
      'products': 'Sản phẩm',
      'customers': 'Khách hàng',
      'suppliers': 'Nhà cung cấp',
      'orders': 'Đơn hàng',
      'purchase-orders': 'Đơn nhập',
      'stock-transfers': 'Chuyển kho',
      'inventory-checks': 'Kiểm kê',
      'receipts': 'Phiếu thu',
      'payments': 'Phiếu chi',
      'inventory-receipts': 'Phiếu nhập kho',
      'sales-returns': 'Trả hàng',
      'purchase-returns': 'Trả hàng NCC',
      'attendance': 'Chấm công',
      'shipments': 'Vận chuyển',
      'packaging': 'Đóng gói',
      'cod-reconciliation': 'Đối soát COD',
    };
    return names[entityType] || entityType;
  };
  
  // Get all logs with type marker and add systemId
  const allLogs = React.useMemo((): CombinedLog[] => {
    const logs = data?.data ?? [];
    return logs.map(log => ({
      ...log,
      systemId: log.id,
      entityDisplayName: getEntityDisplayName(log.entityType),
    }));
  }, [data?.data]);
  
  // Get unique entity types for filter
  const entityTypes = React.useMemo(() => {
    const types = new Set<string>();
    allLogs.forEach((log) => types.add(log.entityType));
    return Array.from(types).sort();
  }, [allLogs]);
  
  // Filtered logs
  const filteredLogs = React.useMemo(() => {
    let logs = allLogs;
    
    // Filter by status
    if (statusFilter !== 'all') {
      logs = logs.filter((log) => log.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      logs = logs.filter(
        (log) =>
          (log.fileName?.toLowerCase().includes(term) ?? false) ||
          log.entityDisplayName.toLowerCase().includes(term) ||
          log.performedBy.toLowerCase().includes(term)
      );
    }
    
    return logs;
  }, [allLogs, statusFilter, searchTerm]);
  
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
  
  // Handler for row click
  const handleRowClick = (log: CombinedLog) => {
    setSelectedLog(log);
    setIsDialogOpen(true);
  };
  
  // Helper functions
  const getStatusBadge = (log: CombinedLog) => {
    switch (log.status) {
      case 'pending':
        return (
          <Badge variant="outline" className="border-border text-muted-foreground">
            <RefreshCw className="h-3 w-3 mr-1" />
            Chờ xử lý
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="default" className="bg-info/15 text-info-foreground animate-pulse">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Đang xử lý {log.progress || 0}%
          </Badge>
        );
      case 'success':
      case 'completed':
        return (
          <Badge variant="default" className="bg-success/15 text-success-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Thành công
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="default" className="bg-warning/15 text-warning-foreground">
            <AlertCircle className="h-3 w-3 mr-1" />
            Một phần
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Thất bại
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'employees':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'products':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'customers':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'suppliers':
        return <Truck className="h-4 w-4 text-orange-500" />;
      case 'orders':
        return <ShoppingCart className="h-4 w-4 text-indigo-500" />;
      case 'purchase-orders':
        return <ClipboardList className="h-4 w-4 text-cyan-500" />;
      case 'stock-transfers':
        return <RotateCcw className="h-4 w-4 text-teal-500" />;
      case 'inventory-checks':
        return <ClipboardList className="h-4 w-4 text-amber-500" />;
      case 'receipts':
        return <Receipt className="h-4 w-4 text-emerald-500" />;
      case 'payments':
        return <CreditCard className="h-4 w-4 text-red-500" />;
      case 'inventory-receipts':
        return <Warehouse className="h-4 w-4 text-muted-foreground" />;
      case 'sales-returns':
        return <RotateCcw className="h-4 w-4 text-pink-500" />;
      case 'purchase-returns':
        return <RotateCcw className="h-4 w-4 text-rose-500" />;
      case 'attendance':
        return <FileSpreadsheet className="h-4 w-4 text-violet-500" />;
      case 'shipments':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'packaging':
        return <Package className="h-4 w-4 text-amber-600" />;
      case 'cod-reconciliation':
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
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
  
  const getResultSummary = (log: CombinedLog) => {
    // Show progress bar for pending/processing jobs
    if (log.status === 'pending' || log.status === 'processing') {
      return (
        <div className="space-y-1 text-xs min-w-30">
          <div className="font-medium">Tổng: {log.totalRecords}</div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${log.progress || 0}%` }}
            />
          </div>
          <div className="text-muted-foreground">
            {log.processedRecords || 0} / {log.totalRecords} ({log.progress || 0}%)
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-0.5 text-xs">
        <div className="font-medium">Tổng: {log.totalRecords}</div>
        {(log.insertedCount || 0) > 0 && (
          <div className="text-green-600">+ {log.insertedCount} thêm mới</div>
        )}
        {(log.updatedCount || 0) > 0 && (
          <div className="text-blue-600">↻ {log.updatedCount} cập nhật</div>
        )}
        {log.successCount > 0 && !log.insertedCount && !log.updatedCount && (
          <div className="text-green-600">✓ {log.successCount} thành công</div>
        )}
        {(log.skippedCount || 0) > 0 && (
          <div className="text-yellow-600">⊘ {log.skippedCount} bỏ qua</div>
        )}
        {log.errorCount > 0 && (
          <div className="text-red-600">✗ {log.errorCount} lỗi</div>
        )}
      </div>
    );
  };
  
  const getDuplicateHandlingLabel = (handling: string | null) => {
    const labels: Record<string, string> = {
      'skip': 'Bỏ qua trùng',
      'update': 'Cập nhật trùng',
      'error': 'Báo lỗi trùng',
    };
    return handling ? labels[handling] || handling : null;
  };

  // Define columns
  const columns: ColumnDef<CombinedLog>[] = [
    {
      id: 'performedAt',
      accessorKey: 'performedAt',
      header: 'Thời gian',
      size: 150,
      cell: ({ row }) => (
        <span className="text-xs font-mono">
          {formatTimestamp(row.performedAt)}
        </span>
      ),
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Loại',
      size: 90,
      cell: ({ row }) => (
        <Badge variant={row.type === 'import' ? 'default' : 'secondary'}>
          {row.type === 'import' ? (
            <Upload className="h-3 w-3 mr-1" />
          ) : (
            <Download className="h-3 w-3 mr-1" />
          )}
          {row.type === 'import' ? 'Nhập' : 'Xuất'}
        </Badge>
      ),
    },
    {
      id: 'entityType',
      accessorKey: 'entityType',
      header: 'Module',
      size: 140,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getEntityIcon(row.entityType)}
          <span className="text-sm">{row.entityDisplayName}</span>
        </div>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Trạng thái',
      size: 110,
      cell: ({ row }) => getStatusBadge(row),
    },
    {
      id: 'fileName',
      accessorKey: 'fileName',
      header: 'Tên file',
      size: 220,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <div className="text-sm font-medium truncate max-w-50" title={row.fileName || undefined}>
            {row.fileName || '-'}
          </div>
          {row.duplicateHandling && (
            <Badge variant="outline" className="text-xs">
              {getDuplicateHandlingLabel(row.duplicateHandling)}
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: 'result',
      accessorKey: 'totalRecords',
      header: 'Kết quả',
      size: 120,
      cell: ({ row }) => getResultSummary(row),
    },
    {
      id: 'performedBy',
      accessorKey: 'performedBy',
      header: 'Người thực hiện',
      size: 130,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="truncate max-w-25" title={row.performedBy}>
            {row.performedBy}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      accessorKey: 'id',
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
  const renderMobileCard = (log: CombinedLog) => (
    <div
      className="p-4 space-y-3 cursor-pointer"
      onClick={() => handleRowClick(log)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleRowClick(log); }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {getEntityIcon(log.entityType)}
          <span className="font-medium">{log.entityDisplayName}</span>
        </div>
        <Badge variant={log.type === 'import' ? 'default' : 'secondary'} className="shrink-0">
          {log.type === 'import' ? (
            <Upload className="h-3 w-3 mr-1" />
          ) : (
            <Download className="h-3 w-3 mr-1" />
          )}
          {log.type === 'import' ? 'Nhập' : 'Xuất'}
        </Badge>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{log.fileName || '-'}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{formatTimestamp(log.performedAt)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusBadge(log)}
          {log.duplicateHandling && (
            <Badge variant="outline" className="text-xs">
              {getDuplicateHandlingLabel(log.duplicateHandling)}
            </Badge>
          )}
        </div>
        {getResultSummary(log)}
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{log.performedBy}</span>
        </div>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
  
  // Parse errors for display
  const parseErrors = (errorsJson: string | null): string[] => {
    if (!errorsJson) return [];
    try {
      const parsed = JSON.parse(errorsJson);
      if (Array.isArray(parsed)) {
        return parsed.map((err: unknown) => {
          if (typeof err === 'string') return err;
          if (typeof err === 'object' && err !== null) {
            const errObj = err as { row?: number; message?: string };
            if (errObj.row && errObj.message) {
              return `Dòng ${errObj.row}: ${errObj.message}`;
            }
            return JSON.stringify(err);
          }
          return String(err);
        });
      }
      return [String(parsed)];
    } catch {
      return [errorsJson];
    }
  };

  return (
    <div className="space-y-6">
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle size="lg">Lịch sử nhập xuất dữ liệu</CardTitle>
            <CardDescription>
              Theo dõi hoạt động nhập/xuất file Excel
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
              placeholder="Tìm theo tên file, module..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v: LogType) => setTypeFilter(v)}>
            <SelectTrigger className="w-32.5">
              <SelectValue placeholder="Loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="import">
                <div className="flex items-center gap-2">
                  <Upload className="h-3 w-3" />
                  Nhập file
                </div>
              </SelectItem>
              <SelectItem value="export">
                <div className="flex items-center gap-2">
                  <Download className="h-3 w-3" />
                  Xuất file
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v: LogStatus) => setStatusFilter(v)}>
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="success">Thành công</SelectItem>
              <SelectItem value="partial">Một phần</SelectItem>
              <SelectItem value="failed">Thất bại</SelectItem>
            </SelectContent>
          </Select>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-42.5">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả module</SelectItem>
              {entityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center gap-2">
                    {getEntityIcon(type)}
                    <span className="capitalize">{type.replace(/-/g, ' ')}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PageFilters>
        
        {/* Stats summary */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Upload className="h-4 w-4" />
            <span>{allLogs.filter(l => l.type === 'import').length} lần nhập</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{allLogs.filter(l => l.type === 'export').length} lần xuất</span>
          </div>
          <div className="ml-auto text-xs">
            {filteredLogs.length} / {allLogs.length} logs
          </div>
        </div>
        
        {/* ResponsiveDataTable */}
        <ResponsiveDataTable<CombinedLog>
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
          emptyTitle="Chưa có lịch sử"
          emptyDescription={
            searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || entityFilter !== 'all'
              ? 'Không tìm thấy log nào phù hợp với bộ lọc'
              : 'Chưa có hoạt động nhập xuất nào được ghi lại'
          }
          emptyAction={
            allLogs.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm">Bắt đầu nhập hoặc xuất dữ liệu để xem lịch sử</p>
              </div>
            ) : undefined
          }
        />
      </CardContent>
    </Card>
    
    {/* Detail Dialog */}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedLog && (
              <>
                {selectedLog.type === 'import' ? (
                  <Upload className="h-5 w-5 text-primary" />
                ) : (
                  <Download className="h-5 w-5 text-primary" />
                )}
                Chi tiết {selectedLog.type === 'import' ? 'nhập' : 'xuất'} dữ liệu
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về hoạt động nhập/xuất file
          </DialogDescription>
        </DialogHeader>
        
        {selectedLog && (
          <ScrollArea className="h-[calc(90vh-140px)] pr-4">
            <div className="space-y-6">
              {/* Progress Bar for Processing Jobs */}
              {(selectedLog.status === 'pending' || selectedLog.status === 'processing') && (
                <div className="space-y-3 p-4 rounded-lg bg-muted border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedLog.status === 'pending' ? 'Đang chờ xử lý...' : 'Đang xử lý...'}
                    </span>
                    <span className="text-sm font-semibold">{selectedLog.progress || 0}%</span>
                  </div>
                  <Progress value={selectedLog.progress || 0} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{selectedLog.processedRecords || 0} / {selectedLog.totalRecords} dòng</span>
                    <span>Phần {selectedLog.currentChunk || 0} / {selectedLog.totalChunks || 1}</span>
                  </div>
                </div>
              )}
              
              {/* Basic Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Thông tin chung
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Thời gian</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatTimestamp(selectedLog.performedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Module</span>
                    <div className="flex items-center gap-2">
                      {getEntityIcon(selectedLog.entityType)}
                      <span className="text-sm font-medium">{selectedLog.entityDisplayName}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Loại</span>
                    <Badge variant={selectedLog.type === 'import' ? 'default' : 'secondary'}>
                      {selectedLog.type === 'import' ? (
                        <Upload className="h-3 w-3 mr-1" />
                      ) : (
                        <Download className="h-3 w-3 mr-1" />
                      )}
                      {selectedLog.type === 'import' ? 'Nhập file' : 'Xuất file'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Trạng thái</span>
                    {getStatusBadge(selectedLog)}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 col-span-2">
                    <span className="text-sm text-muted-foreground">Người thực hiện</span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedLog.performedBy}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* File Info */}
              {(selectedLog.fileName || selectedLog.format || selectedLog.duplicateHandling || selectedLog.importMode) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Thông tin file
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 col-span-2">
                      <span className="text-sm text-muted-foreground">Tên file</span>
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate max-w-72">{selectedLog.fileName || '-'}</span>
                      </div>
                    </div>
                    {selectedLog.format && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Định dạng</span>
                        <Badge variant="outline">{selectedLog.format.toUpperCase()}</Badge>
                      </div>
                    )}
                    {selectedLog.importMode && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Chế độ</span>
                        <Badge variant="outline">
                          {selectedLog.importMode === 'insert-only' ? 'Chỉ thêm mới' : 
                           selectedLog.importMode === 'update-only' ? 'Chỉ cập nhật' : 'Thêm & Cập nhật'}
                        </Badge>
                      </div>
                    )}
                    {selectedLog.duplicateHandling && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Xử lý trùng</span>
                        <Badge variant="outline">{getDuplicateHandlingLabel(selectedLog.duplicateHandling)}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Results */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Kết quả
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <div className="text-2xl font-bold">{selectedLog.totalRecords}</div>
                    <div className="text-xs text-muted-foreground">Tổng số</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <div className="text-2xl font-bold">{selectedLog.insertedCount || 0}</div>
                    <div className="text-xs text-muted-foreground">Thêm mới</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <div className="text-2xl font-bold">{selectedLog.updatedCount || 0}</div>
                    <div className="text-xs text-muted-foreground">Cập nhật</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <div className="text-2xl font-bold">{selectedLog.errorCount}</div>
                    <div className="text-xs text-muted-foreground">Lỗi</div>
                  </div>
                </div>
                {(selectedLog.skippedCount || 0) > 0 && (
                  <div className="text-sm text-muted-foreground text-center">
                    + {selectedLog.skippedCount} dòng bỏ qua
                  </div>
                )}
              </div>
              
              {/* Duration/Time Info */}
              {(selectedLog.startedAt || selectedLog.completedAt) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Thời gian xử lý
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedLog.startedAt && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Bắt đầu</span>
                        <span className="text-sm">{formatTimestamp(selectedLog.startedAt)}</span>
                      </div>
                    )}
                    {selectedLog.completedAt && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Hoàn thành</span>
                        <span className="text-sm">{formatTimestamp(selectedLog.completedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Errors */}
              {selectedLog.errors && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Chi tiết lỗi
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {parseErrors(selectedLog.errors).map((error, index) => (
                      <div key={index} className="p-2 rounded-md bg-destructive/10 text-sm text-destructive border border-destructive/20">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Notes */}
              {selectedLog.notes && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Ghi chú
                  </h4>
                  <p className="text-sm p-3 rounded-lg bg-muted/50">{selectedLog.notes}</p>
                </div>
              )}
              
              {/* Filters (for export) */}
              {selectedLog.filters && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Bộ lọc đã dùng
                  </h4>
                  <pre className="text-xs p-3 rounded-lg bg-muted/50 overflow-x-auto">
                    {JSON.stringify(JSON.parse(selectedLog.filters), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
    </div>
  );
}
