'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import type { SupplierWarrantyItem } from '../types'

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0'
  return new Intl.NumberFormat('vi-VN').format(value)
}

interface ExportItemsButtonProps {
  items: SupplierWarrantyItem[]
  warrantyId: string
  status: string
}

export function ExportItemsButton({ items, warrantyId, status }: ExportItemsButtonProps) {
  const [exporting, setExporting] = React.useState(false)

  const handleExport = React.useCallback(async () => {
    if (items.length === 0) return
    setExporting(true)

    try {
      const XLSX = await import('xlsx')

      const showConfirmCols = ['CONFIRMED', 'COMPLETED'].includes(status)

      const mappedData = items.map((item, i) => {
        const base: Record<string, unknown> = {
          'STT': i + 1,
          'Sản phẩm': item.productName,
          'SKU': item.productId,
          'SL gửi': item.sentQuantity,
          'Đơn giá': formatCurrency(item.unitPrice),
          'Thành tiền': formatCurrency(item.unitPrice * item.sentQuantity),
        }

        if (showConfirmCols) {
          base['SL được BH'] = item.approvedQuantity
          base['SL trả lại'] = item.returnedQuantity
          base['Chi phí BH'] = formatCurrency(item.warrantyCost)
          base['Kết quả'] = item.warrantyResult || ''
        }

        base['Ghi chú'] = item.itemNote || ''
        return base
      })

      const worksheet = XLSX.utils.json_to_sheet(mappedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sản phẩm BH')
      XLSX.writeFile(workbook, `${warrantyId}_san-pham.xlsx`)
    } catch {
      // Silent fail — xlsx lazy load may fail on slow network
    } finally {
      setExporting(false)
    }
  }, [items, warrantyId, status])

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting || items.length === 0}>
      {exporting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-1.5 h-3.5 w-3.5" />}
      Xuất Excel
    </Button>
  )
}
