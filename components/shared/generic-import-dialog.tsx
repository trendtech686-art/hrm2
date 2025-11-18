import * as React from "react"
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
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
import { Input } from "../ui/input.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.tsx"
import { Progress } from "../ui/progress.tsx"
import { ScrollArea } from "../ui/scroll-area.tsx"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert.tsx"
import * as XLSX from 'xlsx'
import { toast } from "sonner"

interface ImportError {
  row: number
  field: string
  value: any
  message: string
}

interface ValidationResult {
  valid: boolean
  errors: ImportError[]
  warnings: ImportError[]
  validCount: number
  totalCount: number
}

interface Branch {
  systemId: string
  name: string
}

interface GenericImportDialogProps<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  
  // Configuration
  entityName: string // "nhân viên", "khách hàng"
  templateFileName: string // "Mau_Nhap_Nhan_vien.xlsx"
  
  // Branch selection (optional)
  branches?: Branch[]
  requireBranch?: boolean
  
  // Template & Validation
  templateData: Record<string, any>[] // Sample data for template
  templateHeaders: Record<string, string> // { "id": "Mã NV", "fullName": "Họ và tên" }
  validateRow: (row: Record<string, any>, rowIndex: number) => ImportError[]
  
  // Import handler
  onImport: (data: T[], branchId?: string) => Promise<{ success: number; failed: number }>
  
  // Data transformer
  transformImportData: (rows: Record<string, any>[]) => T[]
}

export function GenericImportDialog<T>({
  open,
  onOpenChange,
  entityName,
  templateFileName,
  branches,
  requireBranch = false,
  templateData,
  templateHeaders,
  validateRow,
  onImport,
  transformImportData,
}: GenericImportDialogProps<T>) {
  const [step, setStep] = React.useState<'upload' | 'validate' | 'import' | 'result'>('upload')
  const [selectedBranchId, setSelectedBranchId] = React.useState<string>('')
  const [file, setFile] = React.useState<File | null>(null)
  const [parsedData, setParsedData] = React.useState<Record<string, any>[]>([])
  const [validationResult, setValidationResult] = React.useState<ValidationResult | null>(null)
  const [importProgress, setImportProgress] = React.useState(0)
  const [importResult, setImportResult] = React.useState<{ success: number; failed: number } | null>(null)
  
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Reset when dialog closes
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep('upload')
        setSelectedBranchId('')
        setFile(null)
        setParsedData([])
        setValidationResult(null)
        setImportProgress(0)
        setImportResult(null)
      }, 200)
    }
  }, [open])

  const handleDownloadTemplate = () => {
    try {
      // Create workbook with headers and sample data
      const ws = XLSX.utils.json_to_sheet(templateData, { header: Object.keys(templateHeaders) })
      
      // Rename headers to Vietnamese
      const range = XLSX.utils.decode_range(ws['!ref']!)
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1"
        if (ws[address]) {
          const fieldKey = ws[address].v
          ws[address].v = templateHeaders[fieldKey] || fieldKey
        }
      }
      
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Data')
      
      // Auto-size columns
      const maxWidth = 30
      const colWidths = Object.values(templateHeaders).map(header => ({
        wch: Math.min(maxWidth, header.length + 5)
      }))
      ws['!cols'] = colWidths
      
      XLSX.writeFile(wb, templateFileName)
      toast.success('Đã tải file mẫu')
    } catch (error) {
      console.error('Error generating template:', error)
      toast.error('Có lỗi khi tạo file mẫu')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]
    
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Vui lòng chọn file Excel (.xlsx hoặc .xls)')
      return
    }

    setFile(selectedFile)
  }

  const handleParseFile = async () => {
    if (!file) return
    
    if (requireBranch && !selectedBranchId) {
      toast.error('Vui lòng chọn chi nhánh')
      return
    }

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

      if (jsonData.length === 0) {
        toast.error('File không có dữ liệu')
        return
      }

      // Map Vietnamese headers back to field keys
      const headerMap: Record<string, string> = {}
      Object.entries(templateHeaders).forEach(([key, vnLabel]) => {
        headerMap[vnLabel] = key
      })

      const mappedData = jsonData.map((row: any) => {
        const mappedRow: Record<string, any> = {}
        Object.entries(row).forEach(([vnKey, value]) => {
          const fieldKey = headerMap[vnKey] || vnKey
          mappedRow[fieldKey] = value
        })
        return mappedRow
      })

      setParsedData(mappedData)
      
      // Validate immediately
      validateData(mappedData)
      setStep('validate')
      
    } catch (error) {
      console.error('Error parsing file:', error)
      toast.error('Không thể đọc file. Vui lòng kiểm tra định dạng file.')
    }
  }

  const validateData = (data: Record<string, any>[]) => {
    const errors: ImportError[] = []
    const warnings: ImportError[] = []
    
    data.forEach((row, index) => {
      const rowErrors = validateRow(row, index + 2) // +2 because row 1 is header
      rowErrors.forEach(error => {
        if (error.message.startsWith('[Warning]')) {
          warnings.push(error)
        } else {
          errors.push(error)
        }
      })
    })

    setValidationResult({
      valid: errors.length === 0,
      errors,
      warnings,
      validCount: data.length - errors.length,
      totalCount: data.length
    })
  }

  const handleImport = async () => {
    if (!validationResult?.valid) {
      toast.error('Vui lòng sửa các lỗi trước khi nhập')
      return
    }

    setStep('import')
    setImportProgress(0)

    try {
      // Transform data
      const transformedData = transformImportData(parsedData)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      // Import
      const result = await onImport(transformedData, selectedBranchId)
      
      clearInterval(progressInterval)
      setImportProgress(100)
      setImportResult(result)
      setStep('result')
      
      toast.success(`Đã nhập thành công ${result.success} ${entityName}`)
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Có lỗi khi nhập dữ liệu')
      setStep('validate')
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Nhập dữ liệu từ Excel
          </DialogTitle>
          <DialogDescription>
            {step === 'upload' && `Tải file mẫu và chọn file để nhập ${entityName}`}
            {step === 'validate' && 'Kiểm tra dữ liệu trước khi nhập'}
            {step === 'import' && 'Đang nhập dữ liệu...'}
            {step === 'result' && 'Kết quả nhập dữ liệu'}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="space-y-6">
            {/* Branch Selection */}
            {branches && branches.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="branch">
                  Chọn chi nhánh {requireBranch && <span className="text-destructive">*</span>}
                </Label>
                <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                  <SelectTrigger id="branch">
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
              </div>
            )}

            {/* Download Template */}
            <div className="rounded-lg border-2 border-dashed p-6 text-center">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Bước 1: Tải file mẫu</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tải file Excel mẫu, điền thông tin {entityName} vào file
              </p>
              <Button variant="outline" onClick={handleDownloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Tải file mẫu
              </Button>
            </div>

            {/* Upload File */}
            <div className="space-y-2">
              <Label htmlFor="file">Bước 2: Chọn file đã điền</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {file && (
                  <Button onClick={handleParseFile}>
                    Kiểm tra file
                  </Button>
                )}
              </div>
              {file && (
                <p className="text-sm text-muted-foreground">
                  Đã chọn: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Validate */}
        {step === 'validate' && validationResult && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {validationResult.validCount}
                </div>
                <div className="text-sm text-muted-foreground">Hợp lệ</div>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-destructive">
                  {validationResult.errors.length}
                </div>
                <div className="text-sm text-muted-foreground">Lỗi</div>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {validationResult.warnings.length}
                </div>
                <div className="text-sm text-muted-foreground">Cảnh báo</div>
              </div>
            </div>

            {/* Errors */}
            {validationResult.errors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Có {validationResult.errors.length} lỗi cần sửa</AlertTitle>
                <AlertDescription>
                  <ScrollArea className="h-[200px] mt-2">
                    <div className="space-y-2">
                      {validationResult.errors.map((error, idx) => (
                        <div key={idx} className="text-sm">
                          <strong>Dòng {error.row}:</strong> {error.field} - {error.message}
                          {error.value && <span className="text-muted-foreground"> (Giá trị: "{error.value}")</span>}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </AlertDescription>
              </Alert>
            )}

            {/* Warnings */}
            {validationResult.warnings.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{validationResult.warnings.length} cảnh báo</AlertTitle>
                <AlertDescription>
                  <ScrollArea className="h-[150px] mt-2">
                    <div className="space-y-2">
                      {validationResult.warnings.map((warning, idx) => (
                        <div key={idx} className="text-sm">
                          <strong>Dòng {warning.row}:</strong> {warning.message}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </AlertDescription>
              </Alert>
            )}

            {/* Success */}
            {validationResult.valid && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">Dữ liệu hợp lệ</AlertTitle>
                <AlertDescription className="text-green-800">
                  Tất cả {validationResult.totalCount} dòng đều hợp lệ. Bạn có thể tiến hành nhập dữ liệu.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Step 3: Import Progress */}
        {step === 'import' && (
          <div className="space-y-4 py-8">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-primary animate-pulse mb-4" />
              <h3 className="text-lg font-semibold mb-2">Đang nhập dữ liệu...</h3>
              <p className="text-sm text-muted-foreground">Vui lòng đợi</p>
            </div>
            <Progress value={importProgress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">
              {importProgress}%
            </p>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 'result' && importResult && (
          <div className="space-y-4">
            <div className="text-center py-6">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nhập dữ liệu thành công!</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 text-center bg-green-50">
                <div className="text-3xl font-bold text-green-600">
                  {importResult.success}
                </div>
                <div className="text-sm text-muted-foreground">Thành công</div>
              </div>
              <div className="rounded-lg border p-4 text-center bg-red-50">
                <div className="text-3xl font-bold text-destructive">
                  {importResult.failed}
                </div>
                <div className="text-sm text-muted-foreground">Thất bại</div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'upload' && (
            <Button variant="outline" onClick={handleClose}>
              Đóng
            </Button>
          )}
          
          {step === 'validate' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Chọn lại file
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={!validationResult?.valid}
              >
                Nhập dữ liệu
              </Button>
            </>
          )}
          
          {step === 'result' && (
            <Button onClick={handleClose}>
              Đóng
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
