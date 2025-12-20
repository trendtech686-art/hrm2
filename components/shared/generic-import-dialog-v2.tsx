/**
 * GenericImportDialog V2
 * 
 * Enhanced import dialog with:
 * - Preview step with data table
 * - Upsert mode (insert/update/upsert)
 * - Stop on error option
 * - Import history logging
 * - Better field configuration support
 */

import * as React from "react"
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
  Eye,
  Loader2,
  Pencil,
  Check,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Progress } from "../ui/progress"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Badge } from "../ui/badge"
import { Checkbox } from "../ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import * as XLSX from 'xlsx'
import { toast } from "sonner"
import { cn } from "../../lib/utils"
import { 
  useImportExportStore,
  type ImportPreviewResult,
  type ImportPreviewRow,
  type ImportExportConfig,
  type FieldConfig,
  previewImportData,
} from '../../lib/import-export/index'
import type { SystemId } from "../../lib/id-types"
import { ExcelFileDropzone, type ExcelFile } from './excel-file-dropzone'
import { useBranchStore } from "../../features/settings/branches/store"
import { usePricingPolicyStore } from "../../features/settings/pricing/store"

// ============================================
// EDITABLE CELL COMPONENT (Memoized for performance)
// ============================================

interface EditableCellProps {
  cellValue: string
  fieldKey: string
  fieldLabel: string
  fieldRequired?: boolean
  onSave: (fieldKey: string, newValue: string) => void
}

const EditableCell = React.memo(function EditableCell({
  cellValue,
  fieldKey,
  fieldLabel,
  fieldRequired,
  onSave,
}: EditableCellProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [editValue, setEditValue] = React.useState(cellValue)
  const [error, setError] = React.useState('')

  // Reset value when opening
  const handleOpenChange = React.useCallback((open: boolean) => {
    if (open) {
      setEditValue(cellValue)
      setError('')
    }
    setIsOpen(open)
  }, [cellValue])

  const handleSave = React.useCallback(() => {
    // Basic validation
    if (fieldRequired && !editValue.trim()) {
      setError(`${fieldLabel} là bắt buộc`)
      return
    }
    onSave(fieldKey, editValue)
    setIsOpen(false)
  }, [editValue, fieldKey, fieldLabel, fieldRequired, onSave])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }, [handleSave])

  const isLongText = editValue.length > 50 || editValue.includes('\n')

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full h-full px-4 py-2 text-left relative flex items-center gap-2 group transition-colors cursor-pointer hover:bg-muted/50"
        >
          <span className="block truncate flex-1">
            {cellValue || <span className="text-muted-foreground italic">—</span>}
          </span>
          <Pencil className="h-3 w-3 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] p-3" 
        align="start"
        sideOffset={4}
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              {fieldLabel} {fieldRequired && <span className="text-destructive">*</span>}
            </Label>
            {isLongText ? (
              <Textarea
                autoFocus
                value={editValue}
                onChange={(e) => {
                  setEditValue(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault()
                    handleSave()
                  } else if (e.key === 'Escape') {
                    setIsOpen(false)
                  }
                }}
                placeholder={`Nhập ${fieldLabel.toLowerCase()}...`}
                className={cn("min-h-[80px] resize-y", error && "border-destructive")}
                rows={3}
              />
            ) : (
              <Input
                autoFocus
                value={editValue}
                onChange={(e) => {
                  setEditValue(e.target.value)
                  setError('')
                }}
                onKeyDown={handleKeyDown}
                placeholder={`Nhập ${fieldLabel.toLowerCase()}...`}
                className={cn("h-9", error && "border-destructive")}
              />
            )}
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="h-8 px-2"
            >
              <Check className="h-4 w-4 mr-1" />
              Lưu
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
})

// ============================================
// PREVIEW TABLE ROW COMPONENT (Memoized)
// ============================================

interface PreviewTableRowProps<T> {
  row: ImportPreviewRow<T>
  isSelected: boolean
  isUnselectable: boolean
  visibleFields: FieldConfig<T>[]
  onToggleSelection: (rowNumber: number) => void
  onCellSave: (rowNumber: number, fieldKey: string, newValue: string) => void
  getStatusBadge: (status: string, errors?: any[], warnings?: any[]) => React.ReactNode
}

function PreviewTableRowComponent<T>({
  row,
  isSelected,
  isUnselectable,
  visibleFields,
  onToggleSelection,
  onCellSave,
  getStatusBadge,
}: PreviewTableRowProps<T>) {
  const isErrorRow = row.status === 'error'
  const isDuplicateRow = row.status === 'duplicate'
  
  return (
    <TableRow 
      className={cn(
        !isSelected && !isUnselectable && "opacity-50",
        isErrorRow && "bg-destructive/5",
        isDuplicateRow && "bg-muted/50"
      )}
    >
      <TableCell className="sticky left-0 bg-card z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(row.rowNumber)}
          disabled={isUnselectable}
          aria-label={`Chọn dòng ${row.rowNumber}`}
        />
      </TableCell>
      <TableCell className="font-medium sticky left-10 bg-card z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
        {row.rowNumber}
      </TableCell>
      <TableCell className="sticky left-24 bg-card z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
        {getStatusBadge(row.status, row.errors, row.warnings)}
      </TableCell>
      {visibleFields.map(field => {
        const fieldKey = field.key as string
        const cellValue = String(row.rawData[fieldKey] ?? row.rawData[field.label] ?? '')
        
        return (
          <TableCell 
            key={fieldKey} 
            className="whitespace-nowrap p-0 max-w-[200px]"
          >
            <EditableCell
              cellValue={cellValue}
              fieldKey={fieldKey}
              fieldLabel={field.label}
              fieldRequired={field.required}
              onSave={(fk, newVal) => onCellSave(row.rowNumber, fk, newVal)}
            />
          </TableCell>
        )
      })}
    </TableRow>
  )
}

// Memoize the row component to prevent unnecessary re-renders
const PreviewTableRow = React.memo(PreviewTableRowComponent) as typeof PreviewTableRowComponent

// ============================================
// TYPES
// ============================================

type ImportMode = 'insert-only' | 'update-only' | 'upsert';
type ImportStep = 'upload' | 'preview' | 'import' | 'result';

interface Branch {
  systemId: string
  name: string
}

interface ImportResultData {
  success: number
  failed: number
  inserted: number
  updated: number
  skipped: number
  errors: Array<{ row: number; message: string }>
}

interface GenericImportDialogV2Props<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  
  // Configuration from ImportExportConfig
  config: ImportExportConfig<T>
  
  // Branch selection (optional)
  branches?: Branch[]
  requireBranch?: boolean
  defaultBranchId?: string // Chi nhánh mặc định (auto-fill)
  
  // Existing data for duplicate checking
  existingData?: T[]
  
  // Import handler
  onImport: (
    data: Partial<T>[], 
    mode: ImportMode,
    branchId?: string
  ) => Promise<ImportResultData>
  
  // Current user for logging
  currentUser: {
    name: string
    systemId: SystemId
  }
}

// ============================================
// COMPONENT
// ============================================

export function GenericImportDialogV2<T>({
  open,
  onOpenChange,
  config,
  branches: branchesProp,
  requireBranch = false,
  defaultBranchId,
  existingData = [],
  onImport,
  currentUser,
}: GenericImportDialogV2Props<T>) {
  // Store
  const addImportLog = useImportExportStore(state => state.addImportLog)
  
  // Auto-fetch branches if not provided
  const { data: storeBranches } = useBranchStore()
  const branches = branchesProp || storeBranches.map(b => ({ systemId: b.systemId, name: b.name, isDefault: b.isDefault }))
  
  // Get default branch from settings (isDefault = true) or fallback to prop
  const defaultBranch = React.useMemo(() => {
    if (defaultBranchId) return defaultBranchId
    const defaultFromSettings = storeBranches.find(b => b.isDefault === true)
    return defaultFromSettings?.systemId || ''
  }, [defaultBranchId, storeBranches])
  
  // State
  const [step, setStep] = React.useState<ImportStep>('upload')
  const [selectedBranchId, setSelectedBranchId] = React.useState<string>(defaultBranch)
  const [branchError, setBranchError] = React.useState<string>('')
  const [excelFile, setExcelFile] = React.useState<ExcelFile | null>(null)
  const [importMode, setImportMode] = React.useState<ImportMode>('upsert')
  
  // Preview state
  const [previewResult, setPreviewResult] = React.useState<ImportPreviewResult<T> | null>(null)
  const [previewTab, setPreviewTab] = React.useState<'all' | 'valid' | 'error' | 'warning'>('all')
  const [previewPage, setPreviewPage] = React.useState(0)
  const [previewPageSize, setPreviewPageSize] = React.useState(20)
  
  // Row selection state (for preview step)
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set())
  
  // Import state
  const [isImporting, setIsImporting] = React.useState(false)
  const [importProgress, setImportProgress] = React.useState(0)
  const [importResult, setImportResult] = React.useState<ImportResultData | null>(null)

  // Auto-fill chi nhánh mặc định khi mở dialog hoặc khi store load xong
  React.useEffect(() => {
    if (open && !selectedBranchId && defaultBranch) {
      setSelectedBranchId(defaultBranch)
    }
  }, [open, defaultBranch, selectedBranchId])

  // Reset when dialog closes
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep('upload')
        setSelectedBranchId(defaultBranch)
        setBranchError('')
        setExcelFile(null)
        setImportMode('upsert')
        setPreviewResult(null)
        setPreviewTab('all')
        setPreviewPage(0)
        setPreviewPageSize(20)
        setSelectedRows(new Set())
        setIsImporting(false)
        setImportProgress(0)
        setImportResult(null)
      }, 200)
    }
  }, [open, defaultBranchId])

  // Initialize selected rows when preview result changes (select all valid rows by default)
  React.useEffect(() => {
    if (previewResult) {
      const validRowNumbers = new Set(
        previewResult.rows
          .filter(r => r.status === 'valid' || r.status === 'warning' || r.status === 'will-update' || r.status === 'will-insert')
          .map(r => r.rowNumber)
      )
      setSelectedRows(validRowNumbers)
    }
  }, [previewResult])

  // Re-validate when import mode changes (need to recalculate statuses)
  React.useEffect(() => {
    if (previewResult && step === 'preview') {
      // Get raw data from current preview result
      const rawData = previewResult.rows.map(r => r.rawData)
      
      // Re-run validation with new mode
      const revalidatedResult = previewImportData(
        rawData,
        config,
        existingData,
        importMode,
        selectedBranchId
      )
      
      setPreviewResult(revalidatedResult)
    }
  }, [importMode]) // Only re-run when mode changes

  // Get visible fields for preview table - show ALL non-hidden fields
  const visibleFields = React.useMemo(() => {
    return config.fields.filter(f => !f.hidden)
  }, [config.fields])

  // Filtered preview rows based on current tab
  const filteredPreviewRows = React.useMemo(() => {
    if (!previewResult) return []
    
    switch (previewTab) {
      case 'valid':
        return previewResult.rows.filter(r => 
          r.status === 'valid' || r.status === 'will-insert' || r.status === 'will-update'
        )
      case 'error':
        return previewResult.rows.filter(r => r.status === 'error')
      case 'warning':
        return previewResult.rows.filter(r => r.status === 'warning' || r.status === 'duplicate')
      default:
        return previewResult.rows
    }
  }, [previewResult, previewTab])

  // ============================================
  // ROW SELECTION & INLINE EDIT HANDLERS
  // ============================================

  // Toggle single row selection - memoized to prevent unnecessary re-renders
  const handleToggleRowSelection = React.useCallback((rowNumber: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev)
      if (next.has(rowNumber)) {
        next.delete(rowNumber)
      } else {
        next.add(rowNumber)
      }
      return next
    })
  }, [])

  // Toggle all rows in current filtered view
  const handleToggleAllRows = (checked: boolean) => {
    if (!previewResult) return
    
    const currentFilteredRowNumbers = filteredPreviewRows.map(r => r.rowNumber)
    
    setSelectedRows(prev => {
      const next = new Set(prev)
      if (checked) {
        // Add all filtered rows that are not error status
        currentFilteredRowNumbers.forEach(rowNum => {
          const row = previewResult.rows.find(r => r.rowNumber === rowNum)
          if (row && row.status !== 'error') {
            next.add(rowNum)
          }
        })
      } else {
        // Remove all filtered rows
        currentFilteredRowNumbers.forEach(rowNum => next.delete(rowNum))
      }
      return next
    })
  }

  // Check if all filtered rows are selected
  const isAllFilteredSelected = React.useMemo(() => {
    if (!previewResult || filteredPreviewRows.length === 0) return false
    const selectableRows = filteredPreviewRows.filter(r => r.status !== 'error')
    if (selectableRows.length === 0) return false
    return selectableRows.every(r => selectedRows.has(r.rowNumber))
  }, [previewResult, filteredPreviewRows, selectedRows])

  // Handle cell save from EditableCell component
  // Use useCallback to prevent unnecessary re-renders
  const handleCellSave = React.useCallback((rowNumber: number, fieldKey: string, newValue: string) => {
    if (!previewResult) return
    
    // Update the raw data
    const updatedRawData = previewResult.rows.map(row => {
      if (row.rowNumber === rowNumber) {
        return {
          ...row.rawData,
          [fieldKey]: newValue,
        }
      }
      return row.rawData
    })
    
    // Use startTransition to keep UI responsive during revalidation
    React.startTransition(() => {
      // Re-run full validation to update row statuses
      const revalidatedResult = previewImportData(
        updatedRawData,
        config,
        existingData,
        importMode,
        selectedBranchId
      )
      
      setPreviewResult(revalidatedResult)
      
      // Update selected rows - keep previously selected rows that are still valid
      setSelectedRows(prev => {
        const newSelected = new Set<number>()
        revalidatedResult.rows.forEach(row => {
          // Keep selected if was selected and still valid (not error/duplicate)
          if (prev.has(row.rowNumber) && row.status !== 'error' && row.status !== 'duplicate') {
            newSelected.add(row.rowNumber)
          }
        })
        // Auto-select the edited row if it's now valid (not error/duplicate)
        const editedRow = revalidatedResult.rows.find(r => r.rowNumber === rowNumber)
        if (editedRow && editedRow.status !== 'error' && editedRow.status !== 'duplicate') {
          newSelected.add(editedRow.rowNumber)
        }
        return newSelected
      })
      
      // Show appropriate message
      const editedRow = revalidatedResult.rows.find(r => r.rowNumber === rowNumber)
      if (editedRow?.status === 'error') {
        toast.info('Đã cập nhật. Dòng vẫn có lỗi khác.')
      } else if (editedRow?.status === 'duplicate') {
        toast.info('Đã cập nhật. Dòng vẫn bị trùng.')
      } else {
        toast.success('Đã cập nhật thành công')
      }
    })
  }, [previewResult, config, existingData, importMode, selectedBranchId])

  // ============================================
  // HANDLERS
  // ============================================

  const handleDownloadTemplate = () => {
    try {
      // Create template with headers only
      const headers: Record<string, string> = {}
      const visibleFields = config.fields.filter(field => !field.hidden)
      
      visibleFields.forEach(field => {
        headers[field.key as string] = field.label
      })
      
      // ===== DYNAMIC PRICING COLUMNS (chỉ cho products) =====
      const pricingColumns: Array<{ key: string; label: string; example: string }> = []
      if (config.entityType === 'products') {
        const pricingPolicies = usePricingPolicyStore.getState().data.filter(p => p.isActive)
        pricingPolicies.forEach(policy => {
          const key = `price_${policy.systemId}`
          const label = `Giá: ${policy.name}`
          headers[key] = label
          pricingColumns.push({
            key,
            label,
            example: policy.type === 'Bán hàng' ? '250000' : '150000',
          })
        })
      }
      
      // Sample row: Example values (dữ liệu mẫu từ field.example)
      // Note: Required fields are marked with (*) in the label
      const exampleRow: Record<string, any> = {}
      visibleFields.forEach(field => {
        if (field.example) {
          exampleRow[field.key as string] = field.example
        } else if (field.defaultValue !== undefined) {
          // Fallback to defaultValue or enumLabels
          if (field.enumLabels && field.defaultValue) {
            exampleRow[field.key as string] = field.enumLabels[field.defaultValue as string] || field.defaultValue
          } else {
            exampleRow[field.key as string] = field.defaultValue
          }
        } else {
          exampleRow[field.key as string] = ''
        }
      })
      // Add pricing columns examples
      pricingColumns.forEach(col => {
        exampleRow[col.key] = col.example
      })
      
      // Combine all column keys
      const allColumnKeys = [...Object.keys(headers).filter(k => !k.startsWith('price_')), ...pricingColumns.map(c => c.key)]
      
      // Tạo worksheet với 1 dòng mẫu (không cần dòng hướng dẫn Bắt buộc/Tùy chọn)
      const ws = XLSX.utils.json_to_sheet([exampleRow], { header: allColumnKeys })
      
      // Rename headers to Vietnamese
      const range = XLSX.utils.decode_range(ws['!ref']!)
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1"
        if (ws[address]) {
          const fieldKey = ws[address].v
          ws[address].v = headers[fieldKey] || fieldKey
        }
      }
      
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Data')
      
      // Auto-size columns based on header length and example values
      const allFields = [...visibleFields, ...pricingColumns.map(c => ({ label: c.label, example: c.example }))]
      const colWidths = allFields.map(field => {
        const headerLen = field.label.length
        const exampleLen = String(field.example || '').length
        return {
          wch: Math.min(40, Math.max(12, headerLen + 3, exampleLen + 2))
        }
      })
      ws['!cols'] = colWidths
      
      const fileName = config.templateFileName || `Mau_Nhap_${config.entityDisplayName}.xlsx`
      XLSX.writeFile(wb, fileName)
      toast.success('Đã tải file mẫu')
    } catch (error) {
      console.error('Error generating template:', error)
      toast.error('Có lỗi khi tạo file mẫu')
    }
  }

  const handleParseAndPreview = async () => {
    if (!excelFile) return
    
    if (requireBranch && !selectedBranchId) {
      setBranchError('Vui lòng chọn chi nhánh')
      toast.error('Vui lòng chọn chi nhánh')
      return
    }
    setBranchError('')

    try {
      const data = await excelFile.file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

      if (jsonData.length === 0) {
        toast.error('File không có dữ liệu')
        return
      }

      // Create header map (Vietnamese → field key)
      // Support both with and without (*) marker
      const headerMap: Record<string, string> = {}
      config.fields.forEach(field => {
        if (!field.hidden) {
          const label = field.label.toLowerCase()
          const labelWithoutStar = label.replace(/\s*\(\*\)\s*$/, '')
          headerMap[label] = field.key as string
          headerMap[labelWithoutStar] = field.key as string
        }
      })

      // Map data - normalize Excel headers by stripping (*) and lowercasing
      const mappedData = jsonData.map((row: any) => {
        const mappedRow: Record<string, any> = {}
        Object.entries(row).forEach(([vnKey, value]) => {
          const normalizedKey = vnKey.toLowerCase().replace(/\s*\(\*\)\s*$/, '')
          const fieldKey = headerMap[normalizedKey] || headerMap[vnKey.toLowerCase()] || vnKey
          mappedRow[fieldKey] = value
        })
        return mappedRow
      })

      // Preview with validation
      const result = previewImportData(
        mappedData,
        config,
        existingData,
        importMode,
        selectedBranchId
      )
      
      setPreviewResult(result)
      setPreviewPage(0)
      setStep('preview')
      
    } catch (error) {
      console.error('Error parsing file:', error)
      toast.error('Không thể đọc file. Vui lòng kiểm tra định dạng file.')
    }
  }

  const handleImport = async () => {
    if (!previewResult) return
    
    // Note: Errors will be skipped, details saved to import history

    setStep('import')
    setIsImporting(true)
    setImportProgress(0)

    try {
      // Get selected valid rows only (must be selected AND have valid status)
      const validRows = previewResult.rows
        .filter(r => 
          selectedRows.has(r.rowNumber) && // Must be selected
          (r.status === 'valid' || r.status === 'warning' || r.status === 'will-update' || r.status === 'will-insert')
        )
        .map(r => r.transformedData)
        .filter((d): d is Partial<T> => d !== null)

      if (validRows.length === 0) {
        toast.error('Không có dữ liệu được chọn để nhập')
        setStep('preview')
        setIsImporting(false)
        return
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 5, 90))
      }, 100)

      // Import
      const result = await onImport(validRows, importMode, selectedBranchId || undefined)
      
      clearInterval(progressInterval)
      setImportProgress(100)
      setImportResult(result)
      setIsImporting(false)
      
      // Log to store
      const branch = branches?.find(b => b.systemId === selectedBranchId)
      addImportLog({
        entityType: config.entityType,
        entityDisplayName: config.entityDisplayName,
        fileName: excelFile?.file.name || 'unknown',
        fileSize: excelFile?.file.size || 0,
        totalRows: validRows.length, // Only count selected rows
        successCount: result.success,
        errorCount: result.failed,
        skippedCount: result.skipped,
        insertedCount: result.inserted,
        updatedCount: result.updated,
        mode: importMode,
        performedBy: currentUser.name,
        performedById: currentUser.systemId,
        performedAt: new Date().toISOString(),
        branchId: selectedBranchId || undefined,
        branchName: branch?.name,
        errors: result.errors.slice(0, 50).map(e => ({
          row: e.row,
          message: e.message,
        })),
        status: result.failed === 0 ? 'success' : result.success > 0 ? 'partial' : 'failed',
      })
      
      setStep('result')
      
      if (result.failed === 0) {
        toast.success(`Đã nhập thành công ${result.success} ${config.entityDisplayName}`)
      } else {
        toast.warning(`Đã nhập ${result.success} ${config.entityDisplayName}, ${result.failed} lỗi`)
      }
    } catch (error) {
      console.error('Import error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi khi nhập dữ liệu'
      toast.error(errorMessage)
      setStep('preview')
      setIsImporting(false)
    }
  }

  // ============================================
  // PREVIEW DATA HELPERS
  // ============================================

  const paginatedPreviewRows = React.useMemo(() => {
    const start = previewPage * previewPageSize
    return filteredPreviewRows.slice(start, start + previewPageSize)
  }, [filteredPreviewRows, previewPage, previewPageSize])

  const previewPageCount = Math.ceil(filteredPreviewRows.length / previewPageSize)

  // Memoized getStatusBadge to prevent re-renders
  const getStatusBadge = React.useCallback((status: ImportPreviewRow<T>['status'], errors?: Array<{ field?: string; message: string }>, warnings?: Array<{ field?: string; message: string }>) => {
    const badge = (() => {
      switch (status) {
        case 'valid':
        case 'will-insert':
          return <Badge variant="default">Hợp lệ</Badge>
        case 'will-update':
          return <Badge variant="secondary">Cập nhật</Badge>
        case 'error':
          return <Badge variant="destructive">Lỗi</Badge>
        case 'warning':
          return <Badge variant="outline">Cảnh báo</Badge>
        case 'duplicate':
          return <Badge variant="outline">Trùng</Badge>
        default:
          return <Badge variant="outline">{status}</Badge>
      }
    })()
    
    // Show tooltip with error/warning details
    const messages = [...(errors || []), ...(warnings || [])]
    if (messages.length > 0) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{badge}</span>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <ul className="text-xs space-y-1">
                {messages.map((m, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-destructive">•</span>
                    <span>{m.field ? `${m.field}: ${m.message}` : m.message}</span>
                  </li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
    
    return badge
  }, [])

  // ============================================
  // RENDER
  // ============================================

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Nhập {config.entityDisplayName} từ Excel
          </DialogTitle>
          <DialogDescription>
            {step === 'upload' && 'Chọn file và cấu hình import'}
            {step === 'preview' && 'Rà soát dữ liệu trước khi nhập'}
            {step === 'import' && 'Đang nhập dữ liệu...'}
            {step === 'result' && 'Kết quả nhập dữ liệu'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {/* Step 1: Upload & Configure */}
          {step === 'upload' && (
            <div className="space-y-4 p-1">
              {/* Branch Selection */}
              {branches && branches.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="branch">
                    Chọn chi nhánh {requireBranch && <span className="text-destructive">*</span>}
                  </Label>
                  <Select 
                    value={selectedBranchId} 
                    onValueChange={(value) => {
                      setSelectedBranchId(value)
                      setBranchError('')
                    }}
                  >
                    <SelectTrigger id="branch" className={cn(branchError && "border-destructive")}>
                      <SelectValue placeholder="-- Chọn chi nhánh --" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.systemId} value={branch.systemId}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {branchError && (
                    <p className="text-sm text-destructive">{branchError}</p>
                  )}
                </div>
              )}

              {/* Download Template Link - Small */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Chưa có file mẫu?</span>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={handleDownloadTemplate}
                  className="h-auto p-0 text-primary"
                >
                  <Download className="mr-1 h-3 w-3" />
                  Tải file mẫu
                </Button>
              </div>

              {/* Upload File - Full Width Dropzone */}
              <ExcelFileDropzone
                value={excelFile}
                onChange={setExcelFile}
                uploadToServer={false}
              />

              {/* Import Options */}
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  <h3 className="font-semibold">Tùy chọn Import</h3>
                </div>
                
                {/* Import Mode */}
                {config.upsertKey && (
                  <div className="space-y-2">
                    <Label>Chế độ Import</Label>
                    <RadioGroup
                      value={importMode}
                      onValueChange={(v) => setImportMode(v as ImportMode)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="insert-only" id="insert-only" />
                        <Label htmlFor="insert-only" className="font-normal cursor-pointer">
                          Chỉ thêm mới
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="update-only" id="update-only" />
                        <Label htmlFor="update-only" className="font-normal cursor-pointer">
                          Chỉ cập nhật
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="upsert" id="upsert" />
                        <Label htmlFor="upsert" className="font-normal cursor-pointer">
                          Thêm mới + Cập nhật
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      {importMode === 'insert-only' && 'Bỏ qua các bản ghi đã tồn tại'}
                      {importMode === 'update-only' && 'Chỉ cập nhật bản ghi đã tồn tại, bỏ qua bản ghi mới'}
                      {importMode === 'upsert' && 'Cập nhật bản ghi đã tồn tại, thêm mới bản ghi chưa có'}
                    </p>
                  </div>
                )}
                
                {/* Info about error handling */}
                <p className="text-xs text-muted-foreground border-t pt-3">
                  💡 Các dòng lỗi sẽ bị bỏ qua, chỉ import dòng hợp lệ. Chi tiết lỗi được lưu trong lịch sử import.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && previewResult && (
            <div className="space-y-4 p-1">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <div className="text-2xl font-bold">{previewResult.totalRows}</div>
                  <div className="text-xs text-muted-foreground">Tổng dòng</div>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">{previewResult.validCount}</div>
                  <div className="text-xs text-muted-foreground">Hợp lệ</div>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <div className="text-2xl font-bold text-destructive">{previewResult.errorCount}</div>
                  <div className="text-xs text-muted-foreground">Lỗi</div>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <div className="text-2xl font-bold text-amber-600">{previewResult.warningCount}</div>
                  <div className="text-xs text-muted-foreground">Cảnh báo</div>
                </div>
              </div>

              {/* Alerts */}
              {previewResult.errorCount > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Có {previewResult.errorCount} dòng lỗi</AlertTitle>
                  <AlertDescription>
                    Các dòng lỗi sẽ được bỏ qua khi import. 
                    Chỉ {previewResult.validCount + previewResult.warningCount} dòng hợp lệ sẽ được nhập.
                    Chi tiết lỗi sẽ được lưu trong lịch sử.
                  </AlertDescription>
                </Alert>
              )}

              {previewResult.isValid && previewResult.errorCount === 0 && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Dữ liệu hợp lệ</AlertTitle>
                  <AlertDescription>
                    Tất cả {previewResult.totalRows} dòng đều hợp lệ. Bạn có thể tiến hành nhập dữ liệu.
                  </AlertDescription>
                </Alert>
              )}

              {/* Selection summary */}
              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">
                  Đã chọn <span className="font-medium text-foreground">{selectedRows.size}</span> / {previewResult.totalRows} dòng để nhập
                </div>
                <div className="text-xs text-muted-foreground">
                  💡 Hover vào ô rồi click vào ô để sửa nội dung
                </div>
              </div>

              {/* Preview Table with Tabs */}
              <Tabs value={previewTab} onValueChange={(v) => { 
                React.startTransition(() => {
                  setPreviewTab(v as any)
                  setPreviewPage(0)
                })
              }}>
                <TabsList>
                  <TabsTrigger value="all">
                    Tất cả ({previewResult.totalRows})
                  </TabsTrigger>
                  <TabsTrigger value="valid">
                    Hợp lệ ({previewResult.validCount})
                  </TabsTrigger>
                  <TabsTrigger value="error">
                    Lỗi ({previewResult.errorCount})
                  </TabsTrigger>
                  <TabsTrigger value="warning">
                    Cảnh báo ({previewResult.warningCount})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={previewTab} className="mt-4">
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-auto max-h-[300px]">
                      <div className="min-w-max">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-10 sticky left-0 bg-card z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                <Checkbox
                                  checked={isAllFilteredSelected}
                                  onCheckedChange={handleToggleAllRows}
                                  aria-label="Chọn tất cả"
                                />
                              </TableHead>
                              <TableHead className="w-14 sticky left-10 bg-card z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Dòng</TableHead>
                              <TableHead className="w-20 sticky left-24 bg-card z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Trạng thái</TableHead>
                              {visibleFields.map(field => (
                                <TableHead key={field.key as string} className="min-w-[120px] max-w-[200px] whitespace-nowrap">
                                  {field.label}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedPreviewRows.length === 0 ? (
                              <TableRow>
                                <TableCell 
                                  colSpan={visibleFields.length + 3} 
                                  className="text-center py-8 text-muted-foreground"
                                >
                                  Không có dữ liệu
                                </TableCell>
                              </TableRow>
                            ) : (
                              paginatedPreviewRows.map((row) => (
                                <PreviewTableRow
                                  key={row.rowNumber}
                                  row={row}
                                  isSelected={selectedRows.has(row.rowNumber)}
                                  isUnselectable={row.status === 'error' || row.status === 'duplicate'}
                                  visibleFields={visibleFields}
                                  onToggleSelection={handleToggleRowSelection}
                                  onCellSave={handleCellSave}
                                  getStatusBadge={getStatusBadge}
                                />
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        Hiển thị {filteredPreviewRows.length > 0 ? previewPage * previewPageSize + 1 : 0} - {Math.min((previewPage + 1) * previewPageSize, filteredPreviewRows.length)} / {filteredPreviewRows.length} dòng
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={String(previewPageSize)} onValueChange={(v) => { setPreviewPageSize(Number(v)); setPreviewPage(0); }}>
                          <SelectTrigger className="w-[100px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 dòng</SelectItem>
                            <SelectItem value="20">20 dòng</SelectItem>
                            <SelectItem value="50">50 dòng</SelectItem>
                            <SelectItem value="100">100 dòng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {previewPageCount > 1 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Trang {previewPage + 1}/{previewPageCount}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewPage(0)}
                          disabled={previewPage === 0}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewPage(p => Math.max(0, p - 1))}
                          disabled={previewPage === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewPage(p => Math.min(previewPageCount - 1, p + 1))}
                          disabled={previewPage >= previewPageCount - 1}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewPage(previewPageCount - 1)}
                          disabled={previewPage >= previewPageCount - 1}
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 3: Import Progress */}
          {step === 'import' && (
            <div className="space-y-4 py-12 text-center">
              <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
              <h3 className="text-lg font-semibold">Đang nhập dữ liệu...</h3>
              <p className="text-sm text-muted-foreground">Vui lòng đợi</p>
              <Progress value={importProgress} className="w-full max-w-md mx-auto" />
              <p className="text-sm text-muted-foreground">{importProgress}%</p>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 'result' && importResult && (
            <div className="space-y-6 py-6">
              <div className="text-center">
                {importResult.failed === 0 ? (
                  <CheckCircle2 className="mx-auto h-16 w-16 text-green-600 mb-4" />
                ) : importResult.success > 0 ? (
                  <AlertCircle className="mx-auto h-16 w-16 text-amber-600 mb-4" />
                ) : (
                  <XCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
                )}
                <h3 className="text-xl font-semibold mb-2">
                  {importResult.failed === 0 ? 'Nhập dữ liệu thành công!' : 
                   importResult.success > 0 ? 'Nhập dữ liệu hoàn tất' : 'Nhập dữ liệu thất bại'}
                </h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{importResult.success}</div>
                  <div className="text-sm text-muted-foreground">Thành công</div>
                  {importResult.inserted > 0 && (
                    <div className="text-xs text-muted-foreground">
                      ({importResult.inserted} mới, {importResult.updated} cập nhật)
                    </div>
                  )}
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-3xl font-bold text-destructive">{importResult.failed}</div>
                  <div className="text-sm text-muted-foreground">Thất bại</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-3xl font-bold text-muted-foreground">{importResult.skipped}</div>
                  <div className="text-sm text-muted-foreground">Bỏ qua</div>
                </div>
              </div>
              
              {/* Error Details */}
              {importResult.errors.length > 0 && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Chi tiết lỗi</AlertTitle>
                  <AlertDescription>
                    <ScrollArea className="h-[150px] mt-2">
                      <div className="space-y-1">
                        {importResult.errors.map((error, idx) => (
                          <div key={idx} className="text-sm">
                            <strong>Dòng {error.row}:</strong> {error.message}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {step === 'upload' && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
              <Button 
                onClick={handleParseAndPreview}
                disabled={!excelFile || (requireBranch && !selectedBranchId)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Rà soát
              </Button>
            </>
          )}
          
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <Button 
                onClick={handleImport}
                disabled={selectedRows.size === 0}
              >
                <Upload className="mr-2 h-4 w-4" />
                Nhập {selectedRows.size} dòng
              </Button>
            </>
          )}
          
          {step === 'result' && (
            <Button onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
