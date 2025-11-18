import * as React from "react"
import { Download, FileSpreadsheet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.tsx"
import { Button } from "../ui/button.tsx"
import { Label } from "../ui/label.tsx"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group.tsx"
import { Checkbox } from "../ui/checkbox.tsx"
import { ScrollArea } from "../ui/scroll-area.tsx"
import { Separator } from "../ui/separator.tsx"
import * as XLSX from 'xlsx'
import { toast } from "sonner"

interface ExportColumn {
  id: string
  label: string
  group?: string
}

interface GenericExportDialogProps<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  
  // Data
  allData: T[]
  currentPageData: T[]
  
  // Configuration
  columns: ExportColumn[]
  fileName: string
  entityName: string // "nhân viên", "khách hàng", etc.
  
  // Data transformer
  transformData: (items: T[], selectedColumns: string[]) => Record<string, any>[]
}

export function GenericExportDialog<T>({
  open,
  onOpenChange,
  allData,
  currentPageData,
  columns,
  fileName,
  entityName,
  transformData,
}: GenericExportDialogProps<T>) {
  const [exportScope, setExportScope] = React.useState<'all' | 'current'>('current')
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(
    columns.map(c => c.id)
  )

  // Group columns by category
  const groupedColumns = React.useMemo(() => {
    const groups: Record<string, ExportColumn[]> = {}
    
    columns.forEach(col => {
      const group = col.group || 'Khác'
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(col)
    })
    
    return groups
  }, [columns])

  const handleToggleColumn = (columnId: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    )
  }

  const handleToggleAll = () => {
    if (selectedColumns.length === columns.length) {
      setSelectedColumns([])
    } else {
      setSelectedColumns(columns.map(c => c.id))
    }
  }

  const handleExport = () => {
    if (selectedColumns.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 cột để xuất')
      return
    }

    try {
      // Get data based on scope
      const dataToExport = exportScope === 'all' ? allData : currentPageData
      
      if (dataToExport.length === 0) {
        toast.error('Không có dữ liệu để xuất')
        return
      }

      // Transform data
      const transformedData = transformData(dataToExport, selectedColumns)

      // Create workbook
      const ws = XLSX.utils.json_to_sheet(transformedData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Data')

      // Auto-size columns
      const maxWidth = 50
      const colWidths = Object.keys(transformedData[0] || {}).map(key => ({
        wch: Math.min(
          maxWidth,
          Math.max(
            key.length,
            ...transformedData.map(row => String(row[key] || '').length)
          )
        )
      }))
      ws['!cols'] = colWidths

      // Download
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const fullFileName = `${fileName}_${timestamp}.xlsx`
      XLSX.writeFile(wb, fullFileName)

      toast.success('Xuất file thành công', {
        description: `Đã xuất ${dataToExport.length} ${entityName}`
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Có lỗi khi xuất file')
    }
  }

  const dataCount = exportScope === 'all' ? allData.length : currentPageData.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Xuất dữ liệu Excel
          </DialogTitle>
          <DialogDescription>
            Chọn phạm vi và các cột cần xuất
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Scope */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Giới hạn kết quả xuất</Label>
            <RadioGroup value={exportScope} onValueChange={(v) => setExportScope(v as 'all' | 'current')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="current" />
                <Label htmlFor="current" className="font-normal cursor-pointer">
                  Trang này ({currentPageData.length} {entityName})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal cursor-pointer">
                  Tất cả ({allData.length} {entityName})
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Column Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Tùy chọn loại hiển thị ({selectedColumns.length}/{columns.length})
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleAll}
              >
                {selectedColumns.length === columns.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </Button>
            </div>

            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {Object.entries(groupedColumns).map(([group, cols]) => (
                  <div key={group} className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      {group}
                    </h4>
                    <div className="space-y-2 ml-2">
                      {cols.map(col => (
                        <div key={col.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={col.id}
                            checked={selectedColumns.includes(col.id)}
                            onCheckedChange={() => handleToggleColumn(col.id)}
                          />
                          <Label
                            htmlFor={col.id}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {col.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="text-muted-foreground">
              <strong>Sẽ xuất:</strong> {dataCount} {entityName} với {selectedColumns.length} cột
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleExport} disabled={selectedColumns.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
