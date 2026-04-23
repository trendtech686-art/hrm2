'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { WarrantyShippingCard, type WarrantyShippingCardRef } from './components/warranty-shipping-card'
import { WarrantyPackagingInfo } from './components/warranty-packaging-info'
import { CancelPackagingDialog } from '@/features/orders/components/cancel-packaging-dialog'
import type { DeliveryMethod } from '@/lib/types/prisma-extended'
import { usePageHeader } from '@/contexts/page-header-context'
import { ShareButton } from '@/components/shared/share-button'
import { DetailPageShell, mobileBleedCardClass } from '@/components/layout/page-section'
import { useAuth } from '@/contexts/auth-context'
import { useSupplierWarranty, useSupplierWarrantyMutations, useWarrantyReceipts } from './hooks/use-supplier-warranty'
import { useSupplierStats } from '@/features/suppliers/hooks/use-supplier-stats'
import { SupplierStatsSection } from '@/features/suppliers/components/supplier-stats-section'
import { ProductItemsCard } from './components/product-items-card'
import { ExportItemsButton } from './components/export-items-button'
import { SupplierWarrantyWorkflowCard } from './components/supplier-warranty-workflow-card'
import type { Subtask } from '@/components/shared/subtask-list'
import { formatDateCustom } from '@/lib/date-utils'
import { cn } from '@/lib/utils'
import { CheckCircle, X, Pencil, Trash2, Loader2, Copy, Truck, PackageCheck, Check, Banknote, ChevronRight, ChevronDown, ExternalLink, Package, ClipboardCheck, ArrowUpFromLine, Printer, MoreHorizontal } from 'lucide-react'
import type { SupplierWarranty } from './types'
import { usePrint } from '@/lib/use-print'
import { mapPackingToPrintData, mapPackingLineItems } from '@/lib/print-mappers/packing.mapper'
import { mapShippingLabelToPrintData } from '@/lib/print-mappers/shipping-label.mapper'
import { mapReceiptToPrintData } from '@/lib/print-mappers/receipt.mapper'
import type { ReceiptForPrint } from '@/lib/print-mappers/receipt.mapper'
import { fetchPrintData } from '@/lib/lazy-print-data'
import { numberToWords, formatTime } from '@/lib/print-service'
import type { StoreSettings } from '@/lib/print-service'
import { useBranchFinder } from '@/features/settings/branches/hooks/use-all-branches'
import { useAllCashAccounts } from '@/features/cashbook/hooks/use-all-cash-accounts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useBreakpoint } from '@/contexts/breakpoint-context'
import {
  DropdownMenu as DropdownMenuUI,
  DropdownMenuContent as DropdownMenuContentUI,
  DropdownMenuItem as DropdownMenuItemUI,
  DropdownMenuTrigger as DropdownMenuTriggerUI,
} from '@/components/ui/dropdown-menu'


const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  DRAFT: { label: 'Nháp', variant: 'secondary' },
  APPROVED: { label: 'Đã duyệt', variant: 'default' },
  PACKED: { label: 'Đã đóng gói', variant: 'default' },
  EXPORTED: { label: 'Đã xuất kho', variant: 'default' },
  SENT: { label: 'Đã gửi', variant: 'default' },
  DELIVERED: { label: 'Giao thành công', variant: 'default' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'outline' },
  COMPLETED: { label: 'Hoàn thành', variant: 'default' },
  CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
}

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// ── Status Stepper (7 steps) ──
function WarrantyStatusStepper({ warranty }: { warranty: SupplierWarranty }) {
  const isCancelled = warranty.status === 'CANCELLED'
  const steps = [
    { name: 'Tạo phiếu', date: warranty.createdAt },
    { name: 'Duyệt', date: warranty.approvedAt },
    { name: 'Đóng gói', date: warranty.packedAt },
    { name: 'Xuất kho', date: warranty.exportedAt },
    { name: 'Giao thành công', date: warranty.deliveredAt || warranty.sentDate },
    { name: 'Xác nhận NCC', date: warranty.confirmedAt },
    { name: 'Hoàn thành', date: warranty.completedAt },
  ]

  // Map status to step index (supports legacy SENT)
  const statusToStep: Record<string, number> = {
    DRAFT: 1, APPROVED: 2, PACKED: 3, EXPORTED: 4,
    SENT: 5, DELIVERED: 5, CONFIRMED: 6, COMPLETED: 7,
  }
  let currentStepIndex = statusToStep[warranty.status] ?? 0

  if (isCancelled) {
    // Show cancelled at the last completed step
    if (warranty.exportedAt) currentStepIndex = 4
    else if (warranty.packedAt) currentStepIndex = 3
    else if (warranty.approvedAt) currentStepIndex = 2
    else currentStepIndex = 1
  }

  return (
    <div className="flex items-start justify-between w-full px-2 pt-4 overflow-x-auto">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex
        const isCurrent = index === currentStepIndex
        const isCancelledStep = isCancelled && isCurrent
        return (
          <React.Fragment key={step.name}>
            <div className="flex flex-col items-center text-center min-w-[70px] w-20">
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-xs',
                isCancelledStep ? 'bg-red-100 border-red-500 text-red-500' :
                isCompleted ? 'bg-primary border-primary text-primary-foreground' :
                isCurrent ? 'border-primary text-primary' :
                'border-gray-300 bg-gray-100 text-gray-400'
              )}>
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <p className="text-xs mt-2 font-medium leading-tight">{step.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {step.date ? formatDateCustom(new Date(step.date), 'dd/MM HH:mm') : '-'}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                'flex-1 mt-4 h-0.5 min-w-[16px]',
                index < currentStepIndex ? 'bg-primary' : 'bg-gray-300',
              )} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

interface SupplierWarrantyDetailPageProps {
  systemId: string
}

export function SupplierWarrantyDetailPage({ systemId }: SupplierWarrantyDetailPageProps) {
  const router = useRouter()
  const { can } = useAuth()
  const { isMobile } = useBreakpoint()
  const { data: warranty, isLoading } = useSupplierWarranty(systemId)
  const { cancel, remove, complete, update, approve, pack, cancelPack, exportWarranty, deliver, createReceipt } = useSupplierWarrantyMutations()
  const { data: receipts, isLoading: isReceiptsLoading } = useWarrantyReceipts(systemId)
  const supplierSystemId = warranty?.supplierSystemId
  const { data: supplierStats } = useSupplierStats(supplierSystemId || '')

  // Print support
  const { findById: findBranchById } = useBranchFinder()
  const { print } = usePrint(warranty?.branchSystemId || undefined)

  // Complete dialog state
  const [showCompleteDialog, setShowCompleteDialog] = React.useState(false)

  // Pack dialog state
  const [showPackDialog, setShowPackDialog] = React.useState(false)
  const [packDeliveryMethod, setPackDeliveryMethod] = React.useState<DeliveryMethod>(
    (warranty?.deliveryMethod as DeliveryMethod) || 'deliver-later'
  )
  const [isPackSubmitting, setIsPackSubmitting] = React.useState(false)
  const shippingCardRef = React.useRef<WarrantyShippingCardRef>(null)

  // Cancel pack dialog state
  const [showCancelPackDialog, setShowCancelPackDialog] = React.useState(false)

  // Receipt expanded state
  const [expandedReceiptId, setExpandedReceiptId] = React.useState<string | null>(null)

  // Receipt creation dialog state
  const [showReceiptDialog, setShowReceiptDialog] = React.useState(false)
  const [selectedAccountId, setSelectedAccountId] = React.useState<string>('')
  const { accounts } = useAllCashAccounts()

  // Workflow subtasks
  const subtasks = React.useMemo((): Subtask[] => {
    if (warranty?.subtasks && warranty.subtasks.length > 0) {
      return warranty.subtasks.map((s, index) => ({
        id: s.id,
        title: s.title,
        completed: s.completed,
        order: index,
        createdAt: new Date(),
        completedAt: s.completedAt ? new Date(s.completedAt) : undefined,
      }))
    }
    return []
  }, [warranty?.subtasks])

  const handleSubtasksChange = React.useCallback((newSubtasks: Subtask[]) => {
    if (!warranty) return
    update.mutate({ systemId, data: { subtasks: newSubtasks } }, {
      onError: (err) => toast.error(err.message),
    })
  }, [systemId, warranty, update])

  // Active receipts (not cancelled)
  const activeReceipts = React.useMemo(
    () => receipts.filter(r => r.status !== 'cancelled'),
    [receipts]
  )
  const hasReceipt = activeReceipts.length > 0

  const handleCancel = React.useCallback(() => {
    if (!window.confirm('Bạn có chắc muốn hủy phiếu BH này?')) return
    cancel.mutate(systemId, {
      onSuccess: () => toast.success('Đã hủy phiếu BH'),
      onError: (err) => toast.error(err.message),
    })
  }, [systemId, cancel])

  const handleDelete = React.useCallback(() => {
    if (!window.confirm('Bạn có chắc muốn xóa phiếu BH này?')) return
    remove.mutate(systemId, {
      onSuccess: () => {
        toast.success('Đã xóa phiếu BH')
        router.push('/supplier-warranties')
      },
      onError: (err) => toast.error(err.message),
    })
  }, [systemId, remove, router])

  const handleComplete = React.useCallback(() => {
    complete.mutate({
      systemId,
      data: {},
    }, {
      onSuccess: () => {
        toast.success('Đã hoàn thành phiếu BH')
        setShowCompleteDialog(false)
      },
      onError: (err) => toast.error(err.message),
    })
  }, [systemId, complete])

  const handleCreateReceipt = React.useCallback(() => {
    setSelectedAccountId('')
    setShowReceiptDialog(true)
  }, [])

  const handleConfirmCreateReceipt = React.useCallback(() => {
    createReceipt.mutate({ systemId, data: { accountSystemId: selectedAccountId || undefined } }, {
      onSuccess: () => {
        toast.success('Đã tạo phiếu thu')
        setShowReceiptDialog(false)
      },
      onError: (err) => toast.error(err.message),
    })
  }, [systemId, createReceipt, selectedAccountId])

  const handlePrintReceipt = React.useCallback(async (receipt: import('@/lib/types/prisma-extended').Receipt) => {
    if (!warranty) return
    const branch = warranty.branchSystemId ? findBranchById(warranty.branchSystemId) : null
    const { storeInfo } = await fetchPrintData()
    const storeSettings: StoreSettings = {
      name: storeInfo?.brandName || storeInfo?.companyName || '',
      address: storeInfo?.headquartersAddress,
      phone: storeInfo?.hotline,
      email: storeInfo?.email,
      province: storeInfo?.province,
    }

    const receiptData: ReceiptForPrint = {
      code: receipt.id,
      createdAt: receipt.createdAt,
      issuedAt: receipt.createdAt,
      createdBy: receipt.createdByName || receipt.createdBy || '',
      payerName: receipt.payerName || warranty.supplierName,
      payerType: receipt.payerTypeName || 'Nhà cung cấp',
      groupName: receipt.paymentReceiptTypeName || 'Thu tiền bảo hành NCC',
      description: receipt.description,
      amount: receipt.amount,
      paymentMethod: receipt.paymentMethodName || 'Tiền mặt',
      documentRootCode: warranty.id,
      note: receipt.description,
      location: branch ? { name: branch.name, address: branch.address, province: branch.province } : undefined,
    }

    const printData = mapReceiptToPrintData(receiptData, storeSettings)
    printData['amount_text'] = numberToWords(receipt.amount)
    printData['print_date'] = formatDateCustom(new Date(), 'dd/MM/yyyy')
    printData['print_time'] = formatTime(new Date())
    printData['receipt_barcode'] = receipt.id
    printData['description'] = receipt.description
    printData['payment_method'] = receipt.paymentMethodName || 'Tiền mặt'

    print('receipt', { data: printData })
  }, [warranty, findBranchById, print])

  const handleApprove = React.useCallback(() => {
    approve.mutate({ systemId, data: {} }, {
      onSuccess: () => toast.success('Đã duyệt phiếu BH'),
      onError: (err) => toast.error(err.message),
    })
  }, [systemId, approve])

  const handlePack = React.useCallback(() => {
    setShowPackDialog(true)
  }, [])

  const handlePackSubmit = React.useCallback(async () => {
    setIsPackSubmitting(true)
    try {
      let trackingNumber: string | undefined

      let shippingFee: number | undefined

      // If shipping-partner selected → create GHTK order first
      if (packDeliveryMethod === 'shipping-partner') {
        const result = await shippingCardRef.current?.createShipment()
        if (!result) {
          setIsPackSubmitting(false)
          return // createShipment already showed toast
        }
        trackingNumber = result.trackingCode
        shippingFee = result.shippingFee
      }

      pack.mutate({ systemId, data: {
        deliveryMethod: packDeliveryMethod || undefined,
        trackingNumber,
        shippingFee,
        payer: packDeliveryMethod === 'shipping-partner' ? 'Người gửi' : undefined,
        carrier: packDeliveryMethod === 'shipping-partner' ? 'GHTK' : undefined,
      } }, {
        onSuccess: () => {
          toast.success('Đã đóng gói thành công', {
            description: trackingNumber ? `Mã vận đơn: ${trackingNumber}` : undefined,
          })
          setShowPackDialog(false)
          setIsPackSubmitting(false)
        },
        onError: (err) => {
          toast.error(err.message)
          setIsPackSubmitting(false)
        },
      })
    } catch {
      setIsPackSubmitting(false)
    }
  }, [systemId, pack, packDeliveryMethod])

  const handleCancelPack = React.useCallback((reason: string) => {
    cancelPack.mutate({ systemId, data: { reason } }, {
      onSuccess: () => toast.success('Đã hủy đóng gói'),
      onError: (err) => toast.error(err.message),
    })
  }, [systemId, cancelPack])

  const handleExport = React.useCallback(() => {
    exportWarranty.mutate({ systemId, data: {} }, {
      onSuccess: () => toast.success('Đã xuất kho'),
      onError: (err) => toast.error(err.message),
    })
  }, [systemId, exportWarranty])

  const handleDeliver = React.useCallback(() => {
    deliver.mutate({ systemId, data: {} }, {
      onSuccess: () => toast.success('Giao hàng thành công'),
      onError: (err) => toast.error(err.message),
    })
  }, [systemId, deliver])

  // ===== PRINT HANDLERS =====
  const branch = React.useMemo(() => 
    warranty?.branchSystemId ? findBranchById(warranty.branchSystemId) : null
  , [warranty?.branchSystemId, findBranchById])

  const storeSettings = React.useMemo(() => ({
    name: branch?.name || '',
    address: branch?.address || '',
    phone: branch?.phone || '',
    province: branch?.province || '',
  }), [branch])

  const handlePrintPacking = React.useCallback((packaging?: { id?: string; createdAt?: string | Date; confirmDate?: string | Date | null; requestingEmployeeName?: string | null; status?: string; notes?: string | null }) => {
    if (!warranty) return
    const pkg = packaging
    const packingData = {
      code: pkg?.id || warranty.id,
      createdAt: pkg?.createdAt || warranty.createdAt,
      packedAt: pkg?.confirmDate ?? undefined,
      createdBy: pkg?.requestingEmployeeName || warranty.createdByName || undefined,
      orderCode: warranty.id,
      fulfillmentStatus: pkg?.status || warranty.status,
      location: { name: branch?.name, address: branch?.address, province: branch?.province, phone: branch?.phone },
      customerName: warranty.supplierName,
      customerPhone: supplierStats?.supplier?.phone,
      customerAddress: supplierStats?.supplier?.address,
      shippingAddress: supplierStats?.supplier?.address || '',
      items: warranty.items.map(item => ({
        variantCode: item.productId,
        productName: item.productName,
        quantity: item.sentQuantity,
        price: item.unitPrice,
        amount: item.sentQuantity * item.unitPrice,
        note: item.itemNote ?? undefined,
      })),
      totalQuantity: warranty.items.reduce((sum, i) => sum + i.sentQuantity, 0),
      total: warranty.totalWarrantyCost,
      note: pkg?.notes ?? undefined,
      orderNote: warranty.notes ?? undefined,
    }
    const printData = mapPackingToPrintData(packingData, storeSettings)
    const lineItems = mapPackingLineItems(packingData.items)
    print('packing', { data: printData, lineItems })
  }, [warranty, branch, supplierStats, storeSettings, print])

  const handlePrintShippingLabel = React.useCallback((packaging?: { createdAt?: string | Date; requestingEmployeeName?: string | null; status?: string; trackingCode?: string | null; carrier?: string | null; service?: string | null }) => {
    if (!warranty) return
    const pkg = packaging
    const labelData = {
      orderCode: warranty.id,
      createdAt: pkg?.createdAt || warranty.createdAt,
      createdBy: pkg?.requestingEmployeeName || warranty.createdByName || undefined,
      status: pkg?.status || warranty.status,
      location: { name: branch?.name, address: branch?.address, phone: branch?.phone, province: branch?.province },
      customerName: warranty.supplierName,
      customerPhone: supplierStats?.supplier?.phone,
      shippingAddress: supplierStats?.supplier?.address || '',
      receiverName: warranty.supplierName,
      receiverPhone: supplierStats?.supplier?.phone,
      trackingCode: pkg?.trackingCode || warranty.trackingNumber || undefined,
      carrierName: pkg?.carrier ?? undefined,
      serviceName: pkg?.service ?? undefined,
      totalItems: warranty.items.reduce((sum, i) => sum + i.sentQuantity, 0),
      total: warranty.totalWarrantyCost,
      totalAmount: warranty.totalWarrantyCost,
    }
    const printData = mapShippingLabelToPrintData(labelData, storeSettings)
    print('shipping-label', { data: printData })
  }, [warranty, branch, supplierStats, storeSettings, print])

  // Page header — badge + actions on same line as title (like order detail)
  const headerBadge = React.useMemo(() => {
    if (!warranty) return undefined
    const statusConfig = STATUS_MAP[warranty.status] || { label: warranty.status, variant: 'secondary' as const }
    return (
      <div className="flex items-center gap-2">
        <ExportItemsButton items={warranty.items} warrantyId={warranty.id} status={warranty.status} />
        {can('create_supplier_warranty') && (
          <Button size="sm" variant="outline" className="h-7" onClick={() => router.push(`/supplier-warranties/new?copy=${warranty.systemId}`)}>
            <Copy className="mr-1.5 h-3.5 w-3.5" /> Sao chép
          </Button>
        )}
        <Badge variant={statusConfig.variant} className="uppercase tracking-wide">
          {statusConfig.label}
        </Badge>
      </div>
    )
  }, [warranty, can, router])

  const headerActions = React.useMemo(() => {
    if (!warranty) return []
    const actions: React.ReactNode[] = []

    actions.push(
      <ShareButton
        key="share"
        size="sm"
        className="h-9"
        title={`Bảo hành NCC ${warranty.id ?? warranty.systemId}`}
        text={`Phiếu bảo hành NCC ${warranty.id ?? warranty.systemId}`}
      />,
    )

    // Edit (DRAFT, APPROVED)
    if (['DRAFT', 'APPROVED'].includes(warranty.status) && can('edit_supplier_warranty')) {
      actions.push(
        <Button key="edit" size="sm" variant="outline" onClick={() => router.push(`/supplier-warranties/${systemId}/edit`)}>
          <Pencil className="mr-1.5 h-3.5 w-3.5" /> Sửa
        </Button>
      )
    }
    // Approve (DRAFT → APPROVED)
    if (warranty.status === 'DRAFT' && can('confirm_supplier_warranty')) {
      actions.push(
        <Button key="approve" size="sm" onClick={handleApprove} disabled={approve.isPending}>
          {approve.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />} Duyệt
        </Button>
      )
    }
    // Pack (APPROVED → PACKED)
    if (warranty.status === 'APPROVED' && can('edit_supplier_warranty')) {
      actions.push(
        <Button key="pack" size="sm" onClick={handlePack} disabled={pack.isPending}>
          {pack.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Package className="mr-1.5 h-3.5 w-3.5" />}
          Đóng gói
        </Button>
      )
    }

    // Confirm (DELIVERED/SENT → CONFIRMED)
    if (['DELIVERED', 'SENT'].includes(warranty.status) && can('confirm_supplier_warranty')) {
      actions.push(
        <Button key="confirm" size="sm" onClick={() => router.push(`/supplier-warranties/${systemId}/confirm`)}>
          <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Xác nhận từ NCC
        </Button>
      )
    }
    // Complete (CONFIRMED → COMPLETED)
    if (warranty.status === 'CONFIRMED' && can('confirm_supplier_warranty')) {
      actions.push(
        <Button key="complete" size="sm" onClick={() => setShowCompleteDialog(true)}>
          <PackageCheck className="mr-1.5 h-3.5 w-3.5" /> Hoàn thành
        </Button>
      )
    }
    // Cancel (DRAFT, APPROVED, PACKED)
    if (['DRAFT', 'APPROVED', 'PACKED'].includes(warranty.status) && can('edit_supplier_warranty')) {
      actions.push(
        <Button key="cancel" size="sm" variant="outline" className="text-destructive" onClick={handleCancel}>
          <X className="mr-1.5 h-3.5 w-3.5" /> Hủy
        </Button>
      )
    }
    // Delete (DRAFT only)
    if (warranty.status === 'DRAFT' && can('delete_supplier_warranty')) {
      actions.push(
        <Button key="delete" size="sm" variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Xóa
        </Button>
      )
    }

    return actions
  }, [warranty, can, systemId, router, handleCancel, handleDelete, handleApprove, handlePack, approve.isPending, pack.isPending])

  const mobileHeaderActions = React.useMemo(() => {
    if (!isMobile || !warranty) return []
    return [
      <DropdownMenuUI key="mobile-actions">
        <DropdownMenuTriggerUI asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTriggerUI>
        <DropdownMenuContentUI align="end">
          {['DRAFT', 'APPROVED'].includes(warranty.status) && can('edit_supplier_warranty') && (
            <DropdownMenuItemUI onClick={() => router.push(`/supplier-warranties/${systemId}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" /> Sửa
            </DropdownMenuItemUI>
          )}
          {warranty.status === 'DRAFT' && can('confirm_supplier_warranty') && (
            <DropdownMenuItemUI onClick={handleApprove} disabled={approve.isPending}>
              <ClipboardCheck className="mr-2 h-4 w-4" /> Duyệt
            </DropdownMenuItemUI>
          )}
          {warranty.status === 'APPROVED' && can('edit_supplier_warranty') && (
            <DropdownMenuItemUI onClick={handlePack} disabled={pack.isPending}>
              <Package className="mr-2 h-4 w-4" /> Đóng gói
            </DropdownMenuItemUI>
          )}
          {['DELIVERED', 'SENT'].includes(warranty.status) && can('confirm_supplier_warranty') && (
            <DropdownMenuItemUI onClick={() => router.push(`/supplier-warranties/${systemId}/confirm`)}>
              <CheckCircle className="mr-2 h-4 w-4" /> Xác nhận từ NCC
            </DropdownMenuItemUI>
          )}
          {warranty.status === 'CONFIRMED' && can('confirm_supplier_warranty') && (
            <DropdownMenuItemUI onClick={() => setShowCompleteDialog(true)}>
              <PackageCheck className="mr-2 h-4 w-4" /> Hoàn thành
            </DropdownMenuItemUI>
          )}
          {['DRAFT', 'APPROVED', 'PACKED'].includes(warranty.status) && can('edit_supplier_warranty') && (
            <DropdownMenuItemUI onClick={handleCancel} className="text-destructive">
              <X className="mr-2 h-4 w-4" /> Hủy
            </DropdownMenuItemUI>
          )}
          {warranty.status === 'DRAFT' && can('delete_supplier_warranty') && (
            <DropdownMenuItemUI onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Xóa
            </DropdownMenuItemUI>
          )}
        </DropdownMenuContentUI>
      </DropdownMenuUI>,
    ]
  }, [isMobile, warranty, can, systemId, router, handleCancel, handleDelete, handleApprove, handlePack, approve.isPending, pack.isPending])

  usePageHeader({
    title: warranty ? `Phiếu BH NCC: ${warranty.id}` : 'Chi tiết BH NCC',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'BH Nhà cung cấp', href: '/supplier-warranties', isCurrent: false },
      { label: warranty?.id || 'Chi tiết', href: '#', isCurrent: true },
    ],
    badge: headerBadge,
    actions: isMobile ? mobileHeaderActions : headerActions,
  })

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  if (!warranty) {
    return <div className="text-center py-20 text-muted-foreground">Phiếu BH không tồn tại</div>
  }

  return (
    <DetailPageShell gap="lg">
      {/* Row 1: Status stepper */}
      <Card className={mobileBleedCardClass}>
        <CardContent className="pb-4">
          <WarrantyStatusStepper warranty={warranty} />
        </CardContent>
      </Card>

      {/* Row 2: 3-card layout (NCC | Quy trình | Thông tin BH) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left: Thông tin NCC */}
        <Card className={cn("lg:col-span-4", mobileBleedCardClass)}>
          <CardHeader>
            <CardTitle className="text-base">Thông tin nhà cung cấp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <Link href={`/suppliers/${warranty.supplierSystemId}`} className="font-semibold text-base text-primary hover:underline">
                {warranty.supplierName}
              </Link>
              {supplierStats?.supplier?.phone && (
                <p className="text-muted-foreground">{supplierStats.supplier.phone}</p>
              )}
              {supplierStats?.supplier?.address && (
                <p className="text-muted-foreground">{supplierStats.supplier.address}</p>
              )}
            </div>

            {warranty.branchName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chi nhánh:</span>
                <span>{warranty.branchName}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Người tạo:</span>
              <span>{warranty.createdByName || '—'}</span>
            </div>

            {warranty.assignedToName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Người phụ trách:</span>
                <span>{warranty.assignedToName}</span>
              </div>
            )}

            {supplierStats && (
              <>
                <SupplierStatsSection stats={supplierStats} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Middle: Quy trình xử lý — from settings */}
        <div className="lg:col-span-3">
          <SupplierWarrantyWorkflowCard
            subtasks={subtasks}
            onSubtasksChange={handleSubtasksChange}
            readonly={['COMPLETED', 'CANCELLED'].includes(warranty.status)}
          />
        </div>

        {/* Right: Thông tin phiếu BH */}
        <Card className={cn("lg:col-span-3", mobileBleedCardClass)}>
          <CardHeader>
            <CardTitle className="text-base">Thông tin phiếu bảo hành</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {warranty.reason && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lý do:</span>
                <span className="text-right max-w-[60%]">{warranty.reason}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chi nhánh:</span>
              <span className="font-medium">{warranty.branchName || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày tạo:</span>
              <span>{formatDateCustom(new Date(warranty.createdAt), 'dd/MM/yyyy')}</span>
            </div>
            {warranty.approvedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày duyệt:</span>
                <span>{formatDateCustom(new Date(warranty.approvedAt), 'dd/MM/yyyy')}</span>
              </div>
            )}
            {warranty.approvedByName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Người duyệt:</span>
                <span>{warranty.approvedByName}</span>
              </div>
            )}
            {warranty.confirmedAt && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày xác nhận:</span>
                  <span>{formatDateCustom(new Date(warranty.confirmedAt), 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Người xác nhận:</span>
                  <span>{warranty.confirmedByName || '—'}</span>
                </div>
              </>
            )}
            {warranty.completedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hoàn thành:</span>
                <span>{formatDateCustom(new Date(warranty.completedAt), 'dd/MM/yyyy')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Số SP:</span>
              <span className="font-medium">{warranty.items.length}</span>
            </div>
            {warranty.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1">Ghi chú:</p>
                  <p>{warranty.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Financial/Payment card — like order payment section */}
      {warranty.status !== 'DRAFT' && (() => {
        const isResultConfirmed = ['CONFIRMED', 'COMPLETED'].includes(warranty.status)
        return (
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                {!isResultConfirmed ? (
                  <Banknote className="h-5 w-5 text-muted-foreground shrink-0" />
                ) : hasReceipt ? (
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                ) : warranty.totalWarrantyCost > 0 ? (
                  <Banknote className="h-5 w-5 text-amber-500 shrink-0" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                )}
                <CardTitle>
                  {!isResultConfirmed
                    ? 'Chờ xác nhận kết quả bảo hành'
                    : hasReceipt
                      ? 'Đã tạo phiếu thu'
                      : warranty.totalWarrantyCost > 0
                        ? 'Chờ tạo phiếu thu'
                        : 'Không có khoản trừ tiền'
                  }
                </CardTitle>
              </div>
              {isResultConfirmed && warranty.totalWarrantyCost > 0 && !hasReceipt && can('confirm_supplier_warranty') && (
                <Button size="sm" onClick={handleCreateReceipt} disabled={createReceipt.isPending}>
                  {createReceipt.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Banknote className="mr-1.5 h-4 w-4" />}
                  Tạo phiếu thu
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Summary grid */}
            <div className="grid grid-cols-1 gap-2 bg-muted/50 p-3 sm:p-4 rounded-md text-sm">
              {!isResultConfirmed ? (
                <p className="text-muted-foreground">
                  Khoản trừ tiền và kết quả bảo hành sẽ được xác định sau khi NCC xác nhận.
                </p>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tổng tiền NCC trừ:</span>
                    <span className="font-medium">{formatCurrency(warranty.totalWarrantyCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SP được bảo hành:</span>
                    <span className="font-medium">
                      {warranty.items.reduce((sum, i) => sum + i.approvedQuantity, 0)} sản phẩm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SP trả lại (không BH):</span>
                    <span className="font-medium text-amber-600">
                      {warranty.totalReturnedItems > 0 ? `${warranty.totalReturnedItems} sản phẩm` : '0'}
                    </span>
                  </div>
                  {warranty.totalWarrantyCost > 0 && (
                    <>
                      <div className="border-t my-1" />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Đã tạo phiếu thu:</span>
                        <span className={cn("font-medium", hasReceipt ? "text-green-600" : "text-muted-foreground")}>
                          {hasReceipt ? formatCurrency(activeReceipts.reduce((s, r) => s + r.amount, 0)) : 'Chưa tạo'}
                        </span>
                      </div>
                    </>
                  )}
                </>
              )}
              {warranty.confirmNotes && (
                <>
                  <div className="border-t my-1" />
                  <div>
                    <span className="text-muted-foreground">Ghi chú xác nhận: </span>
                    <span>{warranty.confirmNotes}</span>
                  </div>
                </>
              )}
            </div>

            {/* Receipt rows — like PaymentInfo */}
            {isReceiptsLoading ? (
              <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                <span>Đang tải phiếu thu...</span>
              </div>
            ) : activeReceipts.length > 0 ? (
              <div className="space-y-2 pt-2">
                {activeReceipts.map(receipt => {
                  const isExpanded = expandedReceiptId === receipt.systemId
                  return (
                    <div key={receipt.systemId} className="border rounded-md bg-background text-sm">
                      <div
                        role="button"
                        tabIndex={0}
                        className="flex items-center p-3 cursor-pointer"
                        onClick={() => setExpandedReceiptId(isExpanded ? null : receipt.systemId)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setExpandedReceiptId(isExpanded ? null : receipt.systemId) }}
                      >
                        <Banknote className="h-4 w-4 text-green-500 mr-3 shrink-0" />
                        <Link
                          href={`/receipts/${receipt.systemId}`}
                          className="font-semibold text-primary hover:underline"
                          onClick={e => e.stopPropagation()}
                        >
                          {receipt.id}
                        </Link>
                        <Badge variant="secondary" className="ml-2 text-xs">Bảo hành NCC</Badge>
                        <div className="grow text-right text-muted-foreground px-4">
                          {formatDateCustom(new Date(receipt.createdAt), 'dd/MM/yyyy')}
                        </div>
                        <div className="w-28 text-right font-semibold text-green-600">
                          +{formatCurrency(receipt.amount)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-2 shrink-0"
                          onClick={(e) => { e.stopPropagation(); handlePrintReceipt(receipt) }}
                          title="In phiếu thu"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      </div>
                      {isExpanded && (
                        <div className="p-4 border-t bg-muted/50 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                            <div className="flex justify-between py-1">
                              <span className="text-muted-foreground">Loại:</span>
                              <span>{receipt.paymentReceiptTypeName || 'Thu tiền bảo hành NCC'}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-muted-foreground">Người trả:</span>
                              <span>{receipt.payerName || warranty.supplierName}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-muted-foreground">Phương thức:</span>
                              <span>{receipt.paymentMethodName || '---'}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-muted-foreground">Người tạo:</span>
                              <span>{receipt.createdByName || receipt.createdBy || '---'}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-muted-foreground">Chi nhánh:</span>
                              <span>{receipt.branchName || '---'}</span>
                            </div>
                            {receipt.description && (
                              <div className="flex justify-between py-1 col-span-2">
                                <span className="text-muted-foreground">Diễn giải:</span>
                                <span className="text-right max-w-[60%]">{receipt.description}</span>
                              </div>
                            )}
                          </div>
                          <div className="pt-2">
                            <Link
                              href={`/receipts/${receipt.systemId}`}
                              className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                            >
                              <ExternalLink className="h-3.5 w-3.5" /> Xem phiếu thu
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : null}
          </CardContent>
        </Card>
        )
      })()}

      {/* Row 4: Đóng gói và Giao hàng — order-style collapsible row */}
      {warranty.status !== 'DRAFT' && (
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground shrink-0" />
                <CardTitle>Đóng gói và Giao hàng</CardTitle>
              </div>
              {can('edit_supplier_warranty') && (
                <div className="flex items-center gap-2">
                  {warranty.status === 'PACKED' && (
                    <>
                      <Button size="sm" variant="outline" className="h-8 text-destructive" onClick={() => setShowCancelPackDialog(true)}>
                        <X className="mr-1.5 h-3.5 w-3.5" /> Hủy đóng gói
                      </Button>
                      <Button size="sm" className="h-8" onClick={handleExport} disabled={exportWarranty.isPending}>
                        {exportWarranty.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <ArrowUpFromLine className="mr-1.5 h-3.5 w-3.5" />} Xuất kho
                      </Button>
                    </>
                  )}
                  {warranty.status === 'EXPORTED' && (
                    <Button size="sm" className="h-8" onClick={handleDeliver} disabled={deliver.isPending}>
                      {deliver.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Truck className="mr-1.5 h-3.5 w-3.5" />} Giao thành công
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <WarrantyPackagingInfo
              warranty={warranty}
              supplierAddress={supplierStats?.supplier?.address}
              supplierPhone={supplierStats?.supplier?.phone}
              onPrintPacking={handlePrintPacking}
              onPrintShippingLabel={handlePrintShippingLabel}
            />
          </CardContent>
        </Card>
      )}

      {/* Row 5: Product items table */}
      <ProductItemsCard items={warranty.items} status={warranty.status} />

      {/* Pack Dialog — full shipping card với GHTK + 3 phương thức */}
      <Dialog open={showPackDialog} onOpenChange={setShowPackDialog}>
        <DialogContent mobileFullScreen className="md:max-w-5xl! md:w-[85vw]! md:max-h-[90vh]! overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Đóng gói & Giao hàng</DialogTitle>
            <DialogDescription>Chọn phương thức giao hàng cho phiếu bảo hành</DialogDescription>
          </DialogHeader>
          <WarrantyShippingCard
            ref={shippingCardRef}
            deliveryMethod={packDeliveryMethod}
            onMethodChange={setPackDeliveryMethod}
            supplierName={warranty?.supplierName}
            supplierPhone={supplierStats?.supplier?.phone}
            supplierAddress={supplierStats?.supplier?.address}
            supplierAddressData={supplierStats?.supplier?.addressData as Record<string, unknown> | null}
            branchSystemId={warranty?.branchSystemId || undefined}
            warrantyId={warranty?.id}
            items={warranty?.items?.map(i => ({ name: i.productName, sentQuantity: i.sentQuantity, unitPrice: i.unitPrice })) || []}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPackDialog(false)}>Hủy</Button>
            <Button onClick={handlePackSubmit} disabled={pack.isPending || isPackSubmitting}>
              {(pack.isPending || isPackSubmitting) ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Package className="mr-1.5 h-4 w-4" />}
              Xác nhận đóng gói
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Pack Dialog */}
      <CancelPackagingDialog
        isOpen={showCancelPackDialog}
        onOpenChange={setShowCancelPackDialog}
        onConfirm={handleCancelPack}
      />

      {/* Receipt Creation Dialog — chọn tài khoản */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo phiếu thu bảo hành</DialogTitle>
            <DialogDescription>Chọn tài khoản nhận tiền cho phiếu thu</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Số tiền:</span>
              <span className="font-semibold">{formatCurrency(warranty.totalWarrantyCost)}</span>
            </div>
            <div className="space-y-2">
              <Label>Tài khoản nhận</Label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tài khoản..." />
                </SelectTrigger>
                <SelectContent>
                  {accounts.filter((acc: { isActive?: boolean }) => acc.isActive !== false).map((acc: { systemId: string; name: string; id?: string }) => (
                    <SelectItem key={acc.systemId} value={acc.systemId}>
                      {acc.name}{acc.id ? ` (${acc.id})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>Hủy</Button>
            <Button onClick={handleConfirmCreateReceipt} disabled={createReceipt.isPending}>
              {createReceipt.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Banknote className="mr-1.5 h-4 w-4" />}
              Tạo phiếu thu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent mobileFullScreen>
          <DialogHeader>
            <DialogTitle>Xác nhận hoàn thành BH</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Xác nhận rằng hàng bảo hành đã được xử lý xong. Phiếu sẽ chuyển sang trạng thái <strong>Hoàn thành</strong>.
            </p>
            {warranty.totalWarrantyCost > 0 && !hasReceipt && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-3 text-sm space-y-1">
                <p className="font-medium text-amber-700 dark:text-amber-400">Chưa tạo phiếu thu</p>
                <p className="text-xs text-muted-foreground">
                  Tổng tiền NCC trừ: {formatCurrency(warranty.totalWarrantyCost)}. Bạn có thể tạo phiếu thu trước hoặc sau khi hoàn thành.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>Hủy</Button>
            <Button onClick={handleComplete} disabled={complete.isPending}>
              {complete.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <PackageCheck className="mr-1.5 h-4 w-4" />}
              Xác nhận hoàn thành
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DetailPageShell>
  )
}
