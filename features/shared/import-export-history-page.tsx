import * as React from "react"
import { useNavigate } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getDaysDiff, subtractDays } from '../../lib/date-utils.ts';
import { FileSpreadsheet, Download, Upload, Eye, Trash2, Filter } from "lucide-react"
import { usePageHeader } from "../../contexts/page-header-context.tsx"
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx"
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header.tsx"
import { Button } from "../../components/ui/button.tsx"
import { Badge } from "../../components/ui/badge.tsx"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx"
import { Input } from "../../components/ui/input.tsx"
import { Label } from "../../components/ui/label.tsx"
import { Separator } from "../../components/ui/separator.tsx"
import type { ColumnDef } from '../../components/data-table/types.ts';
import { toast } from "sonner"
// Types
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
  successCount?: number
  failedCount?: number
  errorDetails?: string
  fileUrl?: string
  fileSize?: number
}

// Sample data generator
function generateSampleLogs(): ImportExportLog[] {
  const modules = [
    { id: 'employees', name: 'Nhân viên' },
    { id: 'customers', name: 'Khách hàng' },
    { id: 'products', name: 'Sản phẩm' },
    { id: 'orders', name: 'Đơn hàng' },
  ]
  
  const performers = ['Hoco', 'Ian', 'Admin']
  const actions: ('import' | 'export')[] = ['import', 'export']
  const statuses: ('success' | 'failed' | 'partial')[] = ['success', 'failed', 'partial']
  
  const logs: ImportExportLog[] = []
  
  for (let i = 0; i < 50; i++) {
    const module = modules[Math.floor(Math.random() * modules.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const recordCount = Math.floor(Math.random() * 500) + 10
    
    logs.push({
      systemId: `LOG${String(i + 1).padStart(8, '0')}`,
      fileName: action === 'import' 
        ? `import_${module.id}_${i + 1}.xlsx`
        : `export_${module.id}_${Date.now()}.xlsx`,
      action,
      module: module.id,
      moduleName: module.name,
      performer: performers[Math.floor(Math.random() * performers.length)],
      performerId: `USER${Math.floor(Math.random() * 100)}`,
      timestamp: subtractDays(getCurrentDate(), Math.floor(Math.random() * 30))?.toISOString() || new Date().toISOString(),
      status,
      recordCount,
      successCount: status === 'success' ? recordCount : Math.floor(recordCount * 0.8),
      failedCount: status === 'failed' ? recordCount : status === 'partial' ? Math.floor(recordCount * 0.2) : 0,
      errorDetails: status !== 'success' ? 'Một số dòng có lỗi định dạng' : undefined,
      fileUrl: `/uploads/import-export/${module.id}/${action}_${i + 1}.xlsx`,
      fileSize: Math.floor(Math.random() * 500000) + 10000,
    })
  }
  
  return logs.sort((a, b) => getDaysDiff(parseDate(b.timestamp), parseDate(a.timestamp)));
}

export function ImportExportHistoryPage() {
  const navigate = useNavigate();
  const [logs] = React.useState<ImportExportLog[]>(generateSampleLogs())
  
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
    subtitle: 'Lịch sử import và export dữ liệu',
    actions: []
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
  const handleDownload = (log: ImportExportLog) => {
    if (log.fileUrl) {
      toast.success(`Đang tải file: ${log.fileName}`);
      // In real app: window.open(log.fileUrl)
    } else {
      toast.error('File không tồn tại');
    }
  };

  const handleViewDetails = (log: ImportExportLog) => {
    toast.info(`Xem chi tiết: ${log.fileName}`);
    // Navigate to detail page or open modal
  }

  const handleDelete = (systemId: string) => {
    if (confirm('Bạn có chắc muốn xóa log này?')) {
      toast.success('Đã xóa log')
      // In real app: call API to delete
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
          isSorted={sorting.id === 'fileName'}
          sortDirection={sorting.desc ? 'desc' : 'asc'}
          onSort={() => setSorting((s: any) => ({ id: 'fileName', desc: s.id === 'fileName' ? !s.desc : false }))}
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
          isSorted={sorting.id === 'timestamp'}
          sortDirection={sorting.desc ? 'desc' : 'asc'}
          onSort={() => setSorting((s: any) => ({ id: 'timestamp', desc: s.id === 'timestamp' ? !s.desc : false }))}
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
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleDownload(row as unknown as ImportExportLog)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleViewDetails(row as unknown as ImportExportLog)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => handleDelete((row as unknown as ImportExportLog).systemId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      meta: { displayName: "Hành động" }
    },
  ]

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
