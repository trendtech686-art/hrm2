'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getDaysDiff, subtractDays } from '../../lib/date-utils';
import { FileSpreadsheet, Download, Upload, Eye, Trash2, Filter, RefreshCw } from "lucide-react"
import { usePageHeader } from "../../contexts/page-header-context"
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table"
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import type { ColumnDef } from '../../components/data-table/types';
import { toast } from "sonner"
import { 
  useImportExportStore,
  type ImportLogEntry,
  type ExportLogEntry,
  formatFileSize,
} from '../../lib/import-export/index';

// Unified log type for display (combines import and export logs)
export interface ImportExportLog {
  systemId: string
  fileName: string
  action: 'import' | 'export'
  module: string // "employees", "customers", "products", etc.
  moduleName: string // "Nhân viên", "Khách hàng", etc.
  performer: string // Người thao tác
  performerId: string
  timestamp: string
  status: 'success' | 'failed' | 'partial'
  recordCount: number
  successCount?: number | undefined
  failedCount?: number | undefined
  errorDetails?: string | undefined
  fileUrl?: string | undefined
  fileSize?: number | undefined
}

// Module name mapping
const MODULE_NAMES: Record<string, string> = {
  employees: 'Nhân viên',
  customers: 'Khách hàng',
  products: 'Sản phẩm',
  orders: 'Đơn hàng',
  attendance: 'Chấm công',
  departments: 'Phòng ban',
  suppliers: 'Nhà cung cấp',
  complaints: 'Khiếu nại',
}

// Transform store logs to display format
function transformStoreLogs(
  importLogs: ImportLogEntry[],
  exportLogs: ExportLogEntry[]
): ImportExportLog[] {
  const logs: ImportExportLog[] = []
  
  // Transform import logs
  for (const log of importLogs) {
    logs.push({
      systemId: log.id,
      fileName: log.fileName,
      action: 'import',
      module: log.entityType,
      moduleName: MODULE_NAMES[log.entityType] || log.entityType,
      performer: log.performedBy,
      performerId: log.performedBy,
      timestamp: log.performedAt,
      status: log.status,
      recordCount: log.totalRows,
      successCount: log.successCount,
      failedCount: log.errorCount,
      errorDetails: log.errors?.slice(0, 3).map(e => e.message).join('; ') || undefined,
      fileUrl: undefined, // Import files are not stored
      fileSize: log.fileSize,
    })
  }
  
  // Transform export logs
  for (const log of exportLogs) {
    logs.push({
      systemId: log.id,
      fileName: log.fileName,
      action: 'export',
      module: log.entityType,
      moduleName: MODULE_NAMES[log.entityType] || log.entityType,
      performer: log.performedBy,
      performerId: log.performedBy,
      timestamp: log.performedAt,
      status: log.status,
      recordCount: log.totalRows,
      successCount: log.totalRows,
      failedCount: 0,
      errorDetails: undefined,
      fileUrl: undefined, // Would be blob URL, not persistent
      fileSize: log.fileSize,
    })
  }
  
  // Sort by timestamp desc
  return logs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export function ImportExportHistoryPage() {
  const router = useRouter();
  
  // Get logs from store
  const importLogs = useImportExportStore(state => state.importLogs)
  const exportLogs = useImportExportStore(state => state.exportLogs)
  const deleteLog = useImportExportStore(state => state.deleteLog)
  const clearLogs = useImportExportStore(state => state.clearLogs)
  
  // Transform store logs to display format
  const logs = React.useMemo(() => 
    transformStoreLogs(importLogs, exportLogs),
    [importLogs, exportLogs]
  )
  
  // Filters
  const [searchQuery, setSearchQuery] = React.useState('')
  const [actionFilter, setActionFilter] = React.useState<string>('all')
  const [moduleFilter, setModuleFilter] = React.useState<string>('all')
  const [performerFilter, setPerformerFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  
  // Table state
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'timestamp', desc: true })
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 })
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({})
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([])

  usePageHeader({
    title: 'Quản lý Xuất/Nhập',
    actions: logs.length > 0 ? [
      <Button 
        key="clear-all" 
        variant="outline" 
        size="sm"
        onClick={() => {
          if (confirm('Bạn có chắc muốn xóa tất cả lịch sử?')) {
            clearLogs()
            toast.success('Đã xóa tất cả lịch sử')
          }
        }}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Xóa tất cả
      </Button>
    ] : undefined
  });

  // Filtered data
  const filteredLogs = React.useMemo(() => {
    return logs.filter(log => {
      if (searchQuery && !log.fileName.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !log.performer.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (actionFilter !== 'all' && log.action !== actionFilter) return false;
      if (moduleFilter !== 'all' && log.module !== moduleFilter) return false
      if (performerFilter !== 'all' && log.performer !== performerFilter) return false
      if (statusFilter !== 'all' && log.status !== statusFilter) return false
      return true
    })
  }, [logs, searchQuery, actionFilter, moduleFilter, performerFilter, statusFilter])

  // Sorted & Paginated data
  const sortedData = React.useMemo(() => {
    let sorted = [...filteredLogs]
    if (sorting.id) {
      sorted.sort((a: any, b: any) => {
        const aVal = a[sorting.id]
        const bVal = b[sorting.id]
        // Special handling for date columns
        if (sorting.id === 'createdAt' || sorting.id === 'timestamp') {
          const aTime = aVal ? new Date(aVal).getTime() : 0
          const bTime = bVal ? new Date(bVal).getTime() : 0
          return sorting.desc ? bTime - aTime : aTime - bTime
        }
        if (aVal < bVal) return sorting.desc ? 1 : -1
        if (aVal > bVal) return sorting.desc ? -1 : 1
        return 0
      })
    }
    return sorted
  }, [filteredLogs, sorting])

  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return sortedData.slice(start, end)
  }, [sortedData, pagination])

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize)

  // Unique values for filters
  const uniqueModules = React.useMemo(() => 
    Array.from(new Set(logs.map(l => l.moduleName))).sort(),
    [logs]
  );
  
  const uniquePerformers = React.useMemo(() => 
    Array.from(new Set(logs.map(l => l.performer))).sort(),
    [logs]
  );

  // Actions
  const handleDelete = (systemId: string, action: 'import' | 'export') => {
    if (confirm('Bạn có chắc muốn xóa log này?')) {
      deleteLog(systemId, action)
      toast.success('Đã xóa log')
    }
  }

  // Columns
  const columns: ColumnDef<ImportExportLog>[] = [
    {
      id: "fileName",
      accessorKey: "fileName",
      header: ({ sorting, setSorting }) => (
        <DataTableColumnHeader 
          title="Tên file"
          sortKey="fileName"
          isSorted={sorting?.id === 'fileName'}
          sortDirection={sorting?.desc ? 'desc' : 'asc'}
          onSort={() => setSorting?.((s: any) => ({ id: 'fileName', desc: s.id === 'fileName' ? !s.desc : false }))}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.fileName}</span>
        </div>
      ),
      meta: { displayName: "Tên file" }
    },
    {
      id: "action",
      accessorKey: "action",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.action === 'import' ? (
            <>
              <Upload className="h-4 w-4 text-blue-600" />
              <span>Nhập file</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4 text-green-600" />
              <span>Xuất file</span>
            </>
          )}
        </div>
      ),
      meta: { displayName: "Thao tác" }
    },
    {
      id: "moduleName",
      accessorKey: "moduleName",
      header: "Chức năng",
      cell: ({ row }) => row.moduleName,
      meta: { displayName: "Chức năng" }
    },
    {
      id: "performer",
      accessorKey: "performer",
      header: "Người thao tác",
      cell: ({ row }) => row.performer,
      meta: { displayName: "Người thao tác" }
    },
    {
      id: "timestamp",
      accessorKey: "timestamp",
      header: ({ sorting, setSorting }) => (
        <DataTableColumnHeader 
          title="Thời gian"
          sortKey="timestamp"
          isSorted={sorting?.id === 'timestamp'}
          sortDirection={sorting?.desc ? 'desc' : 'asc'}
          onSort={() => setSorting?.((s: any) => ({ id: 'timestamp', desc: s.id === 'timestamp' ? !s.desc : false }))}
        />
      ),
      cell: ({ row }) => formatDateTime(row.timestamp),
      meta: { displayName: "Thời gian" }
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const variants: Record<string, "default" | "destructive" | "secondary"> = {
          success: "default",
          failed: "destructive",
          partial: "secondary"
        }
        const labels: Record<string, string> = {
          success: "Thành công",
          failed: "Thất bại",
          partial: "Một phần"
        }
        return (
          <Badge variant={variants[row.status]}>
            {labels[row.status]}
          </Badge>
        )
      },
      meta: { displayName: "Trạng thái" }
    },
    {
      id: "recordCount",
      accessorKey: "recordCount",
      header: "Số bản ghi",
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium">{row.recordCount}</div>
          {row.status !== 'success' && (
            <div className="text-xs text-muted-foreground">
              <span className="text-green-600">{row.successCount}</span> / 
              <span className="text-destructive ml-1">{row.failedCount}</span>
            </div>
          )}
        </div>
      ),
      meta: { displayName: "Số bản ghi" }
    },
    {
      id: "fileSize",
      accessorKey: "fileSize",
      header: "Kích thước",
      cell: ({ row }) => row.fileSize ? formatFileSize(row.fileSize) : '-',
      meta: { displayName: "Kích thước" }
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => handleDelete((row as unknown as ImportExportLog).systemId, (row as unknown as ImportExportLog).action)}
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      meta: { displayName: "Hành động" }
    },
  ]

  // Empty state
  if (logs.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <FileSpreadsheet className="h-16 w-16 text-muted-foreground" />
        <h3 className="text-lg font-medium">Chưa có lịch sử xuất/nhập</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Khi bạn xuất hoặc nhập dữ liệu từ các module như Nhân viên, Khách hàng, Sản phẩm... 
          lịch sử sẽ được ghi lại tại đây.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <Input
                placeholder="Tên file, người thao tác..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Action Filter */}
            <div className="space-y-2">
              <Label>Thao tác</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="import">Nhập file</SelectItem>
                  <SelectItem value="export">Xuất file</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Module Filter */}
            <div className="space-y-2">
              <Label>Chức năng</Label>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {uniqueModules.map(module => (
                    <SelectItem key={module} value={module}>{module}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Performer Filter */}
            <div className="space-y-2">
              <Label>Người thao tác</Label>
              <Select value={performerFilter} onValueChange={setPerformerFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {uniquePerformers.map(performer => (
                    <SelectItem key={performer} value={performer}>{performer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="success">Thành công</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                  <SelectItem value="partial">Một phần</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>
            Lịch sử ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ResponsiveDataTable
            columns={columns as any}
            data={paginatedData}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={sortedData.length}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            sorting={sorting}
            setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean; }>>}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
            expanded={expanded}
            setExpanded={setExpanded}
            allSelectedRows={[]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
