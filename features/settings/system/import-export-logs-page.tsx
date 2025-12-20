import * as React from 'react';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ResponsiveDataTable } from '../../../components/data-table/responsive-data-table';
import { PageFilters } from '../../../components/layout/page-filters';
import type { ColumnDef } from '../../../components/data-table/types';
import { 
  Search, CheckCircle2, XCircle, AlertCircle, 
  Upload, Download, FileSpreadsheet, Package, Users, 
  ShoppingCart, Truck, Receipt, CreditCard, Warehouse,
  ClipboardList, RotateCcw, User, FileText
} from 'lucide-react';
import { useImportExportStore } from '../../../lib/import-export/import-export-store';
import type { ImportLogEntry, ExportLogEntry } from '../../../lib/import-export/types';
import { formatBytes } from '../../../lib/format-utils';

type LogType = 'all' | 'import' | 'export';
type LogStatus = 'all' | 'success' | 'partial' | 'failed';

// Combined log type for display
type CombinedLog = (ImportLogEntry | ExportLogEntry) & { 
  _type: 'import' | 'export';
  systemId: string; // Required for ResponsiveDataTable
};

export function ImportExportLogsPage() {
  useSettingsPageHeader({
    title: 'Lịch sử nhập xuất',
  });

  const { importLogs, exportLogs, getRecentLogs } = useImportExportStore();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<LogType>('all');
  const [statusFilter, setStatusFilter] = React.useState<LogStatus>('all');
  const [entityFilter, setEntityFilter] = React.useState<string>('all');
  
  // Pagination state
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'performedAt', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  
  // Get all logs with type marker and add systemId
  const allLogs = React.useMemo((): CombinedLog[] => {
    const logs = getRecentLogs(500);
    return logs.map(log => ({
      ...log,
      systemId: log.id, // Use log id as systemId for table
    }));
  }, [importLogs, exportLogs, getRecentLogs]);
  
  // Get unique entity types for filter
  const entityTypes = React.useMemo(() => {
    const types = new Set<string>();
    allLogs.forEach((log) => types.add(log.entityType));
    return Array.from(types).sort();
  }, [allLogs]);
  
  // Filtered logs
  const filteredLogs = React.useMemo(() => {
    let logs = allLogs;
    
    // Filter by type (import/export)
    if (typeFilter !== 'all') {
      logs = logs.filter((log) => log._type === typeFilter);
    }
    
    // Filter by status (only for import logs)
    if (statusFilter !== 'all') {
      logs = logs.filter((log) => {
        if (log._type === 'import') {
          return (log as ImportLogEntry & { _type: 'import'; systemId: string }).status === statusFilter;
        }
        return statusFilter === 'success'; // Export logs are always "success"
      });
    }
    
    // Filter by entity
    if (entityFilter !== 'all') {
      logs = logs.filter((log) => log.entityType === entityFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.fileName.toLowerCase().includes(term) ||
          log.entityDisplayName.toLowerCase().includes(term) ||
          log.performedBy.toLowerCase().includes(term)
      );
    }
    
    return logs;
  }, [allLogs, typeFilter, statusFilter, entityFilter, searchTerm]);
  
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
  const getStatusBadge = (log: CombinedLog) => {
    if (log._type === 'export') {
      return (
        <Badge variant="default" className="bg-blue-500">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Thành công
        </Badge>
      );
    }
    
    const importLog = log as ImportLogEntry & { _type: 'import'; systemId: string };
    switch (importLog.status) {
      case 'success':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Thành công
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="default" className="bg-yellow-500">
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
        return <Warehouse className="h-4 w-4 text-slate-500" />;
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
        return <FileText className="h-4 w-4 text-gray-500" />;
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
    if (log._type === 'export') {
      const exportLog = log as ExportLogEntry & { _type: 'export'; systemId: string };
      const scopeLabels: Record<string, string> = {
        'all': 'Tất cả',
        'current-page': 'Trang hiện tại',
        'selected': 'Đã chọn',
        'filtered': 'Đã lọc',
      };
      return (
        <div className="space-y-0.5 text-xs">
          <div className="text-green-600 font-medium">{exportLog.totalRows} dòng</div>
          <div className="text-muted-foreground">{scopeLabels[exportLog.scope]}</div>
        </div>
      );
    }
    
    const importLog = log as ImportLogEntry & { _type: 'import'; systemId: string };
    return (
      <div className="space-y-0.5 text-xs">
        <div className="font-medium">Tổng: {importLog.totalRows}</div>
        {importLog.insertedCount > 0 && (
          <div className="text-green-600">+{importLog.insertedCount} mới</div>
        )}
        {importLog.updatedCount > 0 && (
          <div className="text-blue-600">~{importLog.updatedCount} cập nhật</div>
        )}
        {importLog.skippedCount > 0 && (
          <div className="text-yellow-600">⊘{importLog.skippedCount} bỏ qua</div>
        )}
        {importLog.errorCount > 0 && (
          <div className="text-red-600">✗{importLog.errorCount} lỗi</div>
        )}
      </div>
    );
  };
  
  const getModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      'insert-only': 'Chỉ thêm mới',
      'update-only': 'Chỉ cập nhật',
      'upsert': 'Thêm/Cập nhật',
    };
    return labels[mode] || mode;
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
      id: '_type',
      accessorKey: '_type',
      header: 'Loại',
      size: 90,
      cell: ({ row }) => (
        <Badge variant={row._type === 'import' ? 'default' : 'secondary'}>
          {row._type === 'import' ? (
            <Upload className="h-3 w-3 mr-1" />
          ) : (
            <Download className="h-3 w-3 mr-1" />
          )}
          {row._type === 'import' ? 'Nhập' : 'Xuất'}
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
          <div className="text-sm font-medium truncate max-w-[200px]" title={row.fileName}>
            {row.fileName}
          </div>
          {row.fileSize && (
            <div className="text-xs text-muted-foreground">
              {formatBytes(row.fileSize)}
            </div>
          )}
          {row._type === 'import' && (row as ImportLogEntry & { _type: 'import'; systemId: string }).mode && (
            <Badge variant="outline" className="text-xs">
              {getModeLabel((row as ImportLogEntry & { _type: 'import'; systemId: string }).mode)}
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: 'result',
      accessorKey: 'totalRows',
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
          <span className="truncate max-w-[100px]" title={row.performedBy}>
            {row.performedBy}
          </span>
        </div>
      ),
    },
  ];

  // Mobile card renderer
  const renderMobileCard = (log: CombinedLog) => (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {getEntityIcon(log.entityType)}
          <span className="font-medium">{log.entityDisplayName}</span>
        </div>
        <Badge variant={log._type === 'import' ? 'default' : 'secondary'} className="shrink-0">
          {log._type === 'import' ? (
            <Upload className="h-3 w-3 mr-1" />
          ) : (
            <Download className="h-3 w-3 mr-1" />
          )}
          {log._type === 'import' ? 'Nhập' : 'Xuất'}
        </Badge>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{log.fileName}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{formatTimestamp(log.performedAt)}</span>
          {log.fileSize && <span>{formatBytes(log.fileSize)}</span>}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusBadge(log)}
          {log._type === 'import' && (log as ImportLogEntry & { _type: 'import'; systemId: string }).mode && (
            <Badge variant="outline" className="text-xs">
              {getModeLabel((log as ImportLogEntry & { _type: 'import'; systemId: string }).mode)}
            </Badge>
          )}
        </div>
        {getResultSummary(log)}
      </div>
      
      <div className="flex items-center pt-2 border-t">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{log.performedBy}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Lịch sử nhập xuất dữ liệu</CardTitle>
            <CardDescription>
              Theo dõi hoạt động nhập/xuất file Excel
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <PageFilters>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên file, module..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v: LogType) => setTypeFilter(v)}>
            <SelectTrigger className="w-[130px]">
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
            <SelectTrigger className="w-[150px]">
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
            <SelectTrigger className="w-[170px]">
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
            <span>{importLogs.length} lần nhập</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{exportLogs.length} lần xuất</span>
          </div>
          <div className="ml-auto text-xs">
            {filteredLogs.length} / {allLogs.length} logs
          </div>
        </div>
        
        {/* ResponsiveDataTable */}
        <ResponsiveDataTable<CombinedLog>
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
          emptyTitle="Chưa có lịch sử"
          emptyDescription={
            searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || entityFilter !== 'all'
              ? 'Không tìm thấy log nào phù hợp với bộ lọc'
              : 'Chưa có hoạt động nhập xuất nào được ghi lại'
          }
          emptyAction={
            allLogs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm">Bắt đầu nhập hoặc xuất dữ liệu để xem lịch sử</p>
              </div>
            ) : undefined
          }
        />
      </CardContent>
    </Card>
  );
}
