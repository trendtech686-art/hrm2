/**
 * GenericExportDialog V2
 * 
 * Enhanced export dialog with:
 * - Column selection with groups
 * - Scope options (all/filtered/current-page/selected)
 * - Export history logging
 * - File size estimation
 */

import * as React from "react"
import { Download, FileSpreadsheet, Loader2 } from "lucide-react"
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
import { Badge } from "../ui/badge.tsx"
import * as XLSX from 'xlsx'
import { toast } from "sonner"
import {
  useImportExportStore,
  type ImportExportConfig,
  type FieldConfig,
  transformExportRow,
  generateExportFileName,
  formatFileSize,
} from '../../lib/import-export/index.ts'
import type { SystemId } from "../../lib/id-types.ts"

// ============================================
// TYPES
// ============================================

type ExportScope = 'all' | 'filtered' | 'current-page' | 'selected';

interface GenericExportDialogV2Props<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  
  // Configuration from ImportExportConfig
  config: ImportExportConfig<T>
  
  // Data sources
  allData: T[]
  filteredData: T[]       // After applying filters
  currentPageData: T[]    // Current page only
  selectedData: T[]       // Selected rows
  
  // Filters applied (for logging)
  appliedFilters?: Record<string, unknown>
  
  // Current user for logging
  currentUser: {
    name: string
    systemId: SystemId
  }
}

// ============================================
// COMPONENT
// ============================================

export function GenericExportDialogV2<T>({
  open,
  onOpenChange,
  config,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  appliedFilters,
  currentUser,
}: GenericExportDialogV2Props<T>) {
  // Store
  const addExportLog = useImportExportStore(state => state.addExportLog)
  
  // State
  const [exportScope, setExportScope] = React.useState<ExportScope>('filtered')
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>([])
  const [isExporting, setIsExporting] = React.useState(false)

  // Initialize selected columns from config (all non-hidden fields)
  React.useEffect(() => {
    if (open && selectedColumns.length === 0) {
      const defaultColumns = config.fields
        .filter(f => !f.hidden && f.exportable !== false)
        .map(f => f.key as string)
      setSelectedColumns(defaultColumns)
    }
  }, [open, config.fields])

  // Reset scope when dialog opens
  React.useEffect(() => {
    if (open) {
      // Default to filtered if has filters, else all
      if (filteredData.length < allData.length) {
        setExportScope('filtered')
      } else if (selectedData.length > 0) {
        setExportScope('selected')
      } else {
        setExportScope('all')
      }
    }
  }, [open, allData.length, filteredData.length, selectedData.length])

  // Group fields by category
  const groupedFields = React.useMemo(() => {
    const groups: Record<string, FieldConfig<T>[]> = {}
    
    config.fields.forEach(field => {
      if (field.hidden || field.exportable === false) return
      
      const group = field.group || field.exportGroup || 'Khác'
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(field)
    })
    
    return groups
  }, [config.fields])

  // Exportable fields (non-hidden)
  const exportableFields = React.useMemo(() => 
    config.fields.filter(f => !f.hidden && f.exportable !== false),
    [config.fields]
  )

  // Data count by scope
  const getDataByScope = React.useCallback((scope: ExportScope): T[] => {
    switch (scope) {
      case 'all':
        return allData
      case 'filtered':
        return filteredData
      case 'current-page':
        return currentPageData
      case 'selected':
        return selectedData
    }
  }, [allData, filteredData, currentPageData, selectedData])

  const dataToExport = getDataByScope(exportScope)

  // ============================================
  // HANDLERS
  // ============================================

  const handleToggleColumn = (columnKey: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(k => k !== columnKey)
        : [...prev, columnKey]
    )
  }

  const handleToggleGroup = (groupFields: FieldConfig<T>[]) => {
    const groupKeys = groupFields.map(f => f.key as string)
    const allSelected = groupKeys.every(k => selectedColumns.includes(k))
    
    if (allSelected) {
      setSelectedColumns(prev => prev.filter(k => !groupKeys.includes(k)))
    } else {
      setSelectedColumns(prev => [...new Set([...prev, ...groupKeys])])
    }
  }

  const handleToggleAll = () => {
    if (selectedColumns.length === exportableFields.length) {
      setSelectedColumns([])
    } else {
      setSelectedColumns(exportableFields.map(f => f.key as string))
    }
  }

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 cột để xuất')
      return
    }

    if (dataToExport.length === 0) {
      toast.error('Không có dữ liệu để xuất')
      return
    }

    setIsExporting(true)

    try {
      // Get selected fields config
      const selectedFields = config.fields.filter(f => 
        selectedColumns.includes(f.key as string)
      )

      // Transform data
      const transformedData = dataToExport.map(item => 
        transformExportRow(item, selectedFields)
      )

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
            key.length + 2,
            ...transformedData.slice(0, 100).map(row => String(row[key] || '').length)
          )
        )
      }))
      ws['!cols'] = colWidths

      // Generate filename
      const fileName = generateExportFileName(config.entityType, exportScope)

      // Write file and get blob for size
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([wbout], { type: 'application/octet-stream' })
      
      // Download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Log to store
      addExportLog({
        entityType: config.entityType,
        entityDisplayName: config.entityDisplayName,
        fileName,
        fileSize: blob.size,
        totalRows: dataToExport.length,
        scope: exportScope,
        columnsExported: selectedColumns,
        filters: appliedFilters,
        performedBy: currentUser.name,
        performedById: currentUser.systemId,
        performedAt: new Date().toISOString(),
        status: 'success',
      })

      toast.success('Xuất file thành công', {
        description: `Đã xuất ${dataToExport.length} ${config.entityDisplayName}`
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Có lỗi khi xuất file')
    } finally {
      setIsExporting(false)
    }
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Xuất {config.entityDisplayName} ra Excel
          </DialogTitle>
          <DialogDescription>
            Chọn phạm vi và các cột cần xuất
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6 p-1">
          {/* Export Scope */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Giới hạn kết quả xuất</Label>
            <RadioGroup 
              value={exportScope} 
              onValueChange={(v) => setExportScope(v as ExportScope)}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="scope-all" />
                  <Label htmlFor="scope-all" className="font-normal cursor-pointer">
                    Tất cả dữ liệu
                  </Label>
                </div>
                <Badge variant="secondary">{allData.length}</Badge>
              </div>
              
              {filteredData.length < allData.length && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="filtered" id="scope-filtered" />
                    <Label htmlFor="scope-filtered" className="font-normal cursor-pointer">
                      Kết quả đã lọc
                    </Label>
                  </div>
                  <Badge variant="secondary">{filteredData.length}</Badge>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current-page" id="scope-page" />
                  <Label htmlFor="scope-page" className="font-normal cursor-pointer">
                    Trang hiện tại
                  </Label>
                </div>
                <Badge variant="secondary">{currentPageData.length}</Badge>
              </div>
              
              {selectedData.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="selected" id="scope-selected" />
                    <Label htmlFor="scope-selected" className="font-normal cursor-pointer">
                      Các dòng đã chọn
                    </Label>
                  </div>
                  <Badge variant="default">{selectedData.length}</Badge>
                </div>
              )}
            </RadioGroup>
          </div>

          <Separator />

          {/* Column Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Chọn cột xuất ({selectedColumns.length}/{exportableFields.length})
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleAll}
              >
                {selectedColumns.length === exportableFields.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </Button>
            </div>

            <ScrollArea className="h-[280px] rounded-md border p-4">
              <div className="space-y-4">
                {Object.entries(groupedFields).map(([group, fields]) => {
                  const groupKeys = fields.map(f => f.key as string)
                  const selectedCount = groupKeys.filter(k => selectedColumns.includes(k)).length
                  const allSelected = selectedCount === fields.length
                  const someSelected = selectedCount > 0 && selectedCount < fields.length
                  
                  return (
                    <div key={group} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`group-${group}`}
                          checked={allSelected}
                          // @ts-ignore - indeterminate is valid HTML attribute
                          ref={(el) => el && (el.indeterminate = someSelected)}
                          onCheckedChange={() => handleToggleGroup(fields)}
                        />
                        <Label 
                          htmlFor={`group-${group}`}
                          className="text-sm font-semibold text-muted-foreground cursor-pointer"
                        >
                          {group} ({selectedCount}/{fields.length})
                        </Label>
                      </div>
                      <div className="grid grid-cols-2 gap-2 ml-6">
                        {fields.map(field => (
                          <div key={field.key as string} className="flex items-center space-x-2">
                            <Checkbox
                              id={field.key as string}
                              checked={selectedColumns.includes(field.key as string)}
                              onCheckedChange={() => handleToggleColumn(field.key as string)}
                            />
                            <Label
                              htmlFor={field.key as string}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {field.label}
                              {field.required && <span className="text-destructive">*</span>}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
            <p className="text-muted-foreground">
              <strong>Sẽ xuất:</strong> {dataToExport.length} {config.entityDisplayName} với {selectedColumns.length} cột
            </p>
            {selectedColumns.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Cột: {selectedColumns.slice(0, 5).map(k => {
                  const field = config.fields.find(f => f.key === k)
                  return field?.label || k
                }).join(', ')}
                {selectedColumns.length > 5 && ` và ${selectedColumns.length - 5} cột khác`}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Hủy
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={selectedColumns.length === 0 || dataToExport.length === 0 || isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xuất...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel ({dataToExport.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
