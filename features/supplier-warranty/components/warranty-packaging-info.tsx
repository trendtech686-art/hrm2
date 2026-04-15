'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatDateCustom } from '@/lib/date-utils'
import { Button } from '@/components/ui/button'
import { DetailField } from '@/components/ui/detail-field'
import { Separator } from '@/components/ui/separator'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

import {
  Package,
  PackageCheck,
  ArrowUpFromLine,
  Truck,
  CheckCircle,
  Ban,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Printer,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { SupplierWarranty, WarrantyPackagingSlip } from '../types'

// ── Delivery method labels (warranty-level strings + Prisma enum values) ──
const DELIVERY_METHOD_LABELS: Record<string, string> = {
  // Warranty-level string values
  'shipping-partner': 'Đối tác vận chuyển',
  'external': 'Giao hàng ngoài',
  'pickup': 'Nhận tại cửa hàng',
  'in-store': 'Nhận tại cửa hàng',
  'deliver-later': 'Giao sau',
  // Prisma DeliveryMethod enum values (stored in Packaging model)
  'SHIPPING': 'Đối tác vận chuyển',
  'IN_STORE_PICKUP': 'Nhận tại cửa hàng',
  'PICKUP': 'Khách tự đến lấy',
}

// ── DeliveryStatus → display info ──
const DELIVERY_STATUS_MAP: Record<string, { text: string; color: string; icon: React.ElementType }> = {
  PENDING_PACK: { text: 'Chờ đóng gói', color: 'text-amber-500', icon: Package },
  PACKED: { text: 'Đã đóng gói', color: 'text-green-500', icon: PackageCheck },
  PENDING_SHIP: { text: 'Chờ lấy hàng', color: 'text-amber-500', icon: Package },
  SHIPPING: { text: 'Đang giao hàng', color: 'text-blue-500', icon: Truck },
  DELIVERED: { text: 'Giao thành công', color: 'text-green-500', icon: CheckCircle },
  RESCHEDULED: { text: 'Chờ giao lại', color: 'text-amber-500', icon: Truck },
  CANCELLED: { text: 'Đã hủy', color: 'text-red-500', icon: Ban },
}

function getPackagingStatusInfo(pkg: WarrantyPackagingSlip) {
  if (pkg.status === 'CANCELLED') return DELIVERY_STATUS_MAP.CANCELLED
  const ds = pkg.deliveryStatus as string | null
  if (ds && DELIVERY_STATUS_MAP[ds]) return DELIVERY_STATUS_MAP[ds]
  return { text: 'Đã đóng gói', color: 'text-green-500', icon: PackageCheck }
}

// ── Legacy status config (warranty-level, backward compat) ──
const STATUS_ICONS: Record<string, React.ElementType> = {
  APPROVED: Package, PACKED: PackageCheck, EXPORTED: ArrowUpFromLine,
  SENT: Truck, DELIVERED: CheckCircle, CONFIRMED: CheckCircle,
  COMPLETED: CheckCircle, CANCELLED: Ban,
}
const STATUS_COLORS: Record<string, string> = {
  APPROVED: 'text-amber-500', PACKED: 'text-green-500', EXPORTED: 'text-blue-500',
  SENT: 'text-blue-500', DELIVERED: 'text-green-500', CONFIRMED: 'text-green-500',
  COMPLETED: 'text-green-500', CANCELLED: 'text-red-500',
}
const STATUS_LABELS: Record<string, string> = {
  APPROVED: 'Chờ đóng gói', PACKED: 'Đã đóng gói', EXPORTED: 'Đã xuất kho',
  SENT: 'Đang vận chuyển', DELIVERED: 'Giao thành công', CONFIRMED: 'NCC đã nhận',
  COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy',
}

// ═══════════════════════════════════════════════
// Individual Packaging Row (Packaging model)
// ═══════════════════════════════════════════════
interface PackagingRowProps {
  packaging: WarrantyPackagingSlip
  displayIndex: number
  onPrintPacking?: (packaging: WarrantyPackagingSlip) => void
  onPrintShippingLabel?: (packaging: WarrantyPackagingSlip) => void
}

function PackagingRow({ packaging, displayIndex, onPrintPacking, onPrintShippingLabel }: PackagingRowProps) {
  const isCancelled = packaging.status === 'CANCELLED'
  const [isExpanded, setIsExpanded] = React.useState(!isCancelled)
  const [isCopied, setIsCopied] = React.useState(false)

  // Collapse when packaging becomes cancelled (status change after mount)
  React.useEffect(() => {
    if (isCancelled) setIsExpanded(false)
  }, [isCancelled])

  const statusInfo = getPackagingStatusInfo(packaging)
  const Icon = statusInfo.icon

  const displayDate = isCancelled
    ? packaging.cancelDate
    : packaging.deliveredDate || packaging.confirmDate || packaging.createdAt

  const handleCopy = React.useCallback(() => {
    if (packaging.trackingCode) {
      navigator.clipboard.writeText(packaging.trackingCode)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }, [packaging.trackingCode])

  return (
    <div className="border rounded-md bg-background">
      {/* Header row */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-2 grow cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded) } }}
        >
          <Icon className={cn('h-5 w-5', statusInfo.color)} />
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">#{displayIndex} — {statusInfo.text}</p>
            {displayDate && (
              <p className="text-sm text-muted-foreground">
                {formatDateCustom(new Date(displayDate), 'dd/MM/yyyy HH:mm')}
              </p>
            )}
          </div>
          {packaging.trackingCode && (
            <>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <div className="flex items-center gap-1">
                <span className="text-sm text-primary">{packaging.trackingCode}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={e => { e.stopPropagation(); handleCopy() }}
                >
                  {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-4 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 text-sm gap-x-6 gap-y-1">
            <DetailField label="Mã đóng gói" className="py-1 border-0">
              <div className="flex items-center gap-1">
                <Link href={`/packaging/${packaging.systemId}`} className="text-primary hover:underline font-medium">
                  {packaging.id}
                </Link>
                {onPrintPacking && !isCancelled && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onPrintPacking(packaging)}>
                          <Printer className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>In phiếu đóng gói</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </DetailField>
            <DetailField label="Mã vận đơn" className="py-1 border-0">
              {packaging.trackingCode ? (
                <div className="flex items-center gap-1">
                  <span>{packaging.trackingCode}</span>
                  {onPrintShippingLabel && !isCancelled && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onPrintShippingLabel(packaging)}>
                            <Printer className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>In vận đơn</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">---</span>
              )}
            </DetailField>
            <DetailField
              label="Phương thức giao"
              value={packaging.deliveryMethod ? DELIVERY_METHOD_LABELS[packaging.deliveryMethod] || packaging.deliveryMethod : '---'}
              className="py-1 border-0"
            />
            <DetailField label="Phí trả ĐTVC" value={formatCurrency(packaging.shippingFeeToPartner ?? 0)} className="py-1 border-0" />
            <DetailField label="Vận chuyển bởi" value={packaging.carrier || '-'} className="py-1 border-0" />
            <DetailField label="Tổng tiền thu hộ COD" value={formatCurrency(packaging.codAmount ?? 0)} className="py-1 border-0" />
            <DetailField label="Người trả phí" value={packaging.payer || '-'} className="py-1 border-0" />
            <DetailField label="Đối soát" value={packaging.reconciliationStatus || 'Chưa đối soát'} className="py-1 border-0" />
            <DetailField label="Hình thức giao" value={packaging.deliveryMethod ? DELIVERY_METHOD_LABELS[packaging.deliveryMethod] || packaging.deliveryMethod : '-'} className="py-1 border-0" />
            {packaging.service && (
              <DetailField label="Dịch vụ giao hàng" value={packaging.service} className="py-1 border-0" />
            )}
            {packaging.weight && (
              <DetailField label="Trọng lượng" value={`${packaging.weight}g`} className="py-1 border-0" />
            )}
            {packaging.dimensions && (
              <DetailField label="Kích thước" value={packaging.dimensions} className="py-1 border-0" />
            )}
            <DetailField label="Người tạo" value={packaging.requestingEmployeeName || '-'} className="py-1 border-0" />
            <DetailField label="Đóng gói lúc" value={packaging.confirmDate ? formatDateCustom(new Date(packaging.confirmDate), 'dd/MM/yyyy HH:mm') : '-'} className="py-1 border-0" />
            {packaging.deliveredDate && (
              <DetailField label="Giao hàng lúc" value={formatDateCustom(new Date(packaging.deliveredDate), 'dd/MM/yyyy HH:mm')} className="py-1 border-0" />
            )}
            {packaging.cancelReason && (
              <DetailField label="Lý do hủy" value={packaging.cancelReason} className="py-1 border-0 col-span-full" />
            )}
            <DetailField label="Ghi chú" value={packaging.noteToShipper || packaging.notes || '-'} className="py-1 border-0 col-span-full" />
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════
// Legacy Packaging Info (warranty-level, for backward compat)
// Shown when warranty has NO packagings[] yet
// ═══════════════════════════════════════════════
interface LegacyPackagingInfoProps {
  warranty: SupplierWarranty
  supplierAddress?: string | null
  supplierPhone?: string | null
}

function LegacyPackagingInfo({
  warranty, supplierAddress, supplierPhone,
}: LegacyPackagingInfoProps) {
  const isCancelled = warranty.status === 'CANCELLED'
  const [isExpanded, setIsExpanded] = React.useState(!isCancelled)
  const [isCopied, setIsCopied] = React.useState(false)

  const Icon = STATUS_ICONS[warranty.status] || Package
  const color = STATUS_COLORS[warranty.status] || 'text-muted-foreground'
  const statusText = STATUS_LABELS[warranty.status] || warranty.status

  const displayDate = React.useMemo(() => {
    if (isCancelled) return warranty.cancelledAt
    switch (warranty.status) {
      case 'COMPLETED': return warranty.completedAt
      case 'CONFIRMED': return warranty.confirmedAt
      case 'DELIVERED': return warranty.deliveredAt || warranty.sentDate
      case 'SENT': return warranty.deliveredAt || warranty.sentDate
      case 'EXPORTED': return warranty.exportedAt
      case 'PACKED': return warranty.packedAt
      case 'APPROVED': return warranty.approvedAt
      default: return warranty.createdAt
    }
  }, [warranty, isCancelled])

  const handleCopy = React.useCallback(() => {
    if (warranty.trackingNumber) {
      navigator.clipboard.writeText(warranty.trackingNumber)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }, [warranty.trackingNumber])

  return (
    <div className="border rounded-md bg-background">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-2 grow cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded) } }}
        >
          <Icon className={cn('h-5 w-5', color)} />
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{statusText}</p>
            {displayDate && (
              <p className="text-sm text-muted-foreground">
                {formatDateCustom(new Date(displayDate), 'dd/MM/yyyy HH:mm')}
              </p>
            )}
          </div>
          {warranty.trackingNumber && (
            <>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <div className="flex items-center gap-1">
                <span className="text-sm text-primary">{warranty.trackingNumber}</span>
                <Button
                  variant="ghost" size="icon" className="h-7 w-7"
                  onClick={e => { e.stopPropagation(); handleCopy() }}
                >
                  {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 text-sm gap-x-6 gap-y-1">
            <DetailField label="Mã phiếu BH" value={warranty.id} className="py-1 border-0" />
            <DetailField label="Mã vận đơn" value={warranty.trackingNumber || '---'} className="py-1 border-0" />
            <DetailField
              label="Phương thức giao"
              value={warranty.deliveryMethod ? DELIVERY_METHOD_LABELS[warranty.deliveryMethod] || warranty.deliveryMethod : '---'}
              className="py-1 border-0"
            />
            <DetailField
              label="Số SP gửi"
              value={`${warranty.items.length} sản phẩm (${warranty.items.reduce((s, i) => s + i.sentQuantity, 0)} đơn vị)`}
              className="py-1 border-0"
            />
            <DetailField label="Nhà cung cấp" value={warranty.supplierName} className="py-1 border-0" />
            {supplierPhone && <DetailField label="SĐT NCC" value={supplierPhone} className="py-1 border-0" />}
            {supplierAddress && <DetailField label="Địa chỉ nhận hàng" value={supplierAddress} className="py-1 border-0 col-span-full" />}
            {warranty.branchName && <DetailField label="Chi nhánh gửi" value={warranty.branchName} className="py-1 border-0" />}
            {warranty.packedAt && (
              <DetailField label="Đóng gói lúc" value={formatDateCustom(new Date(warranty.packedAt), 'dd/MM/yyyy HH:mm')} className="py-1 border-0" />
            )}
            {warranty.exportedAt && (
              <DetailField label="Xuất kho lúc" value={formatDateCustom(new Date(warranty.exportedAt), 'dd/MM/yyyy HH:mm')} className="py-1 border-0" />
            )}
            {(warranty.deliveredAt || warranty.sentDate) && (
              <DetailField
                label="Giao hàng lúc"
                value={formatDateCustom(new Date((warranty.deliveredAt || warranty.sentDate)!), 'dd/MM/yyyy HH:mm')}
                className="py-1 border-0"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════
// Main export: WarrantyPackagingInfo
// Renders multi-packaging rows or legacy single-record
// ═══════════════════════════════════════════════
interface WarrantyPackagingInfoProps {
  warranty: SupplierWarranty
  supplierAddress?: string | null
  supplierPhone?: string | null
  onPrintPacking?: (packaging: WarrantyPackagingSlip) => void
  onPrintShippingLabel?: (packaging: WarrantyPackagingSlip) => void
}

export function WarrantyPackagingInfo({
  warranty, supplierAddress, supplierPhone,
  onPrintPacking, onPrintShippingLabel,
}: WarrantyPackagingInfoProps) {
  const packagings = warranty.packagings || []

  // Multi-packaging: render each as a row (like orders)
  if (packagings.length > 0) {
    // Sort: cancelled to bottom, newest first
    const sorted = [...packagings].sort((a, b) => {
      const aCancelled = a.status === 'CANCELLED'
      const bCancelled = b.status === 'CANCELLED'
      if (aCancelled && !bCancelled) return 1
      if (!aCancelled && bCancelled) return -1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return (
      <div className="space-y-3">
        {sorted.map((pkg, idx) => (
          <PackagingRow
            key={pkg.systemId}
            packaging={pkg}
            displayIndex={packagings.length - idx}
            onPrintPacking={onPrintPacking}
            onPrintShippingLabel={onPrintShippingLabel}
          />
        ))}
      </div>
    )
  }

  // Fallback: legacy single-record display (backward compat for old data)
  if (warranty.status === 'APPROVED' && !warranty.packedAt) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Chưa có yêu cầu đóng gói.
      </div>
    )
  }

  return (
    <LegacyPackagingInfo
      warranty={warranty}
      supplierAddress={supplierAddress}
      supplierPhone={supplierPhone}
    />
  )
}
