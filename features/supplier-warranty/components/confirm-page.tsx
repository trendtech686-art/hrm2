'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { mobileBleedCardClass } from '@/components/layout/page-section';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LazyImage } from '@/components/ui/lazy-image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { usePageHeader } from '@/contexts/page-header-context'
import { useSupplierWarranty, useSupplierWarrantyMutations } from '../hooks/use-supplier-warranty'
import { formatDateCustom } from '@/lib/date-utils'
import { CheckCircle, Loader2, Package, ArrowLeft, Zap, ChevronDown, X } from 'lucide-react'
import { WARRANTY_RESULTS } from '../validation'
import type { ConfirmWarrantyItemInput } from '../validation'

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

interface SupplierWarrantyConfirmPageProps {
  systemId: string
}

export function SupplierWarrantyConfirmPage({ systemId }: SupplierWarrantyConfirmPageProps) {
  const router = useRouter()
  const { data: warranty, isLoading } = useSupplierWarranty(systemId)
  const { confirm } = useSupplierWarrantyMutations()

  const [confirmItems, setConfirmItems] = React.useState<ConfirmWarrantyItemInput[]>([])
  const [confirmNotes, setConfirmNotes] = React.useState('')

  // Initialize confirm items when warranty loads
  React.useEffect(() => {
    if (warranty?.items) {
      setConfirmItems(warranty.items.map(item => ({
        systemId: item.systemId,
        approvedQuantity: 0,
        returnedQuantity: 0,
        warrantyCost: 0,
        warrantyResult: '',
      })))
    }
  }, [warranty?.items])

  const updateConfirmItem = React.useCallback((index: number, field: keyof ConfirmWarrantyItemInput, value: number | string) => {
    setConfirmItems(prev => {
      const next = [...prev]
      const updated = { ...next[index], [field]: value }
      const sentQty = warranty?.items[index]?.sentQuantity ?? 0
      const unitPrice = warranty?.items[index]?.unitPrice ?? 0

      if (field === 'warrantyResult') {
        // Auto-fill quantities based on result type
        if (value === 'Trừ tiền') {
          updated.approvedQuantity = sentQty
          updated.returnedQuantity = 0
          updated.warrantyCost = unitPrice * sentQty
        } else if (value === 'Trả lại' || value === 'Đổi mới') {
          updated.approvedQuantity = sentQty
          updated.returnedQuantity = 0
          updated.warrantyCost = 0
        } else {
          updated.approvedQuantity = 0
          updated.returnedQuantity = 0
          updated.warrantyCost = 0
        }
      }

      if (field === 'approvedQuantity') {
        const qty = Math.min(Math.max(0, value as number), sentQty)
        updated.approvedQuantity = qty
        updated.returnedQuantity = sentQty - qty
        if (updated.warrantyResult === 'Trừ tiền') {
          updated.warrantyCost = unitPrice * qty
        }
      }

      next[index] = updated
      return next
    })
  }, [warranty?.items])

  // Quick fill: Tất cả trả lại (đã sửa)
  const handleQuickFillReturn = React.useCallback(() => {
    if (!warranty?.items) return
    setConfirmItems(prev => prev.map((ci, i) => ({
      ...ci,
      approvedQuantity: warranty.items[i].sentQuantity,
      returnedQuantity: 0,
      warrantyCost: 0,
      warrantyResult: 'Trả lại',
    })))
    toast.success('Đã điền: Tất cả trả lại (đã sửa)')
  }, [warranty?.items])

  // Quick fill: Tất cả đổi mới
  const handleQuickFillReplace = React.useCallback(() => {
    if (!warranty?.items) return
    setConfirmItems(prev => prev.map((ci, i) => ({
      ...ci,
      approvedQuantity: warranty.items[i].sentQuantity,
      returnedQuantity: 0,
      warrantyCost: 0,
      warrantyResult: 'Đổi mới',
    })))
    toast.success('Đã điền: Tất cả đổi mới')
  }, [warranty?.items])

  // Quick fill: Tất cả trừ tiền
  const handleQuickFillDeduct = React.useCallback(() => {
    if (!warranty?.items) return
    setConfirmItems(prev => prev.map((ci, i) => ({
      ...ci,
      approvedQuantity: warranty.items[i].sentQuantity,
      returnedQuantity: 0,
      warrantyCost: warranty.items[i].unitPrice * warranty.items[i].sentQuantity,
      warrantyResult: 'Trừ tiền',
    })))
    toast.success('Đã điền: Tất cả trừ tiền')
  }, [warranty?.items])

  const handleQuickFillReset = React.useCallback(() => {
    if (!warranty?.items) return
    setConfirmItems(warranty.items.map(item => ({
      systemId: item.systemId,
      approvedQuantity: 0,
      returnedQuantity: 0,
      warrantyCost: 0,
      warrantyResult: '',
    })))
    toast.success('Đã xóa tất cả')
  }, [warranty?.items])

  const totalWarrantyCost = React.useMemo(
    () => confirmItems.reduce((sum, item) => sum + (item.warrantyCost || 0), 0),
    [confirmItems]
  )

  const totalReturnedItems = React.useMemo(
    () => confirmItems.reduce((sum, item) => sum + (item.returnedQuantity || 0), 0),
    [confirmItems]
  )

  const totalApprovedItems = React.useMemo(
    () => confirmItems.reduce((sum, item) => sum + (item.approvedQuantity || 0), 0),
    [confirmItems]
  )

  const handleConfirm = React.useCallback(() => {
    if (confirmItems.length === 0) {
      toast.error('Chưa có dữ liệu sản phẩm để xác nhận')
      return
    }
    // Validate: each item's approved + returned <= sent
    if (warranty?.items) {
      for (let i = 0; i < warranty.items.length; i++) {
        const item = warranty.items[i]
        const ci = confirmItems[i]
        if (ci && (ci.approvedQuantity + ci.returnedQuantity) > item.sentQuantity) {
          toast.error(`SL xác nhận (${ci.approvedQuantity + ci.returnedQuantity}) vượt quá SL gửi (${item.sentQuantity}) cho ${item.productName}`)
          return
        }
        // Validate: warrantyCost only for "Trừ tiền"
        if (ci && ci.warrantyResult !== 'Trừ tiền' && ci.warrantyCost > 0) {
          toast.error(`"${item.productName}" kết quả "${ci.warrantyResult}" không thể có chi phí trừ tiền`)
          return
        }
      }
    }

    confirm.mutate({ systemId, data: { items: confirmItems, confirmNotes } }, {
      onSuccess: () => {
        toast.success('Đã xác nhận kết quả bảo hành')
        router.push(`/supplier-warranties/${systemId}`)
      },
      onError: (err) => toast.error(err.message),
    })
  }, [systemId, warranty, confirmItems, confirmNotes, confirm, router])

  // Page header with actions
  const headerActions = React.useMemo(() => [
    <Button key="cancel" size="sm" variant="outline" className="h-9" onClick={() => router.push(`/supplier-warranties/${systemId}`)}>
      <X className="mr-1.5 h-3.5 w-3.5" /> Hủy
    </Button>,
    <Button key="confirm" size="sm" className="h-9" onClick={handleConfirm} disabled={confirm.isPending || confirmItems.length === 0}>
      {confirm.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="mr-1.5 h-3.5 w-3.5" />}
      Xác nhận kết quả
    </Button>,
  ], [systemId, router, handleConfirm, confirm.isPending, confirmItems.length])

  usePageHeader({
    title: warranty ? `Xác nhận BH: ${warranty.id}` : 'Xác nhận BH NCC',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'BH Nhà cung cấp', href: '/supplier-warranties', isCurrent: false },
      { label: warranty?.id || '...', href: `/supplier-warranties/${systemId}`, isCurrent: false },
      { label: 'Xác nhận', href: '#', isCurrent: true },
    ],
    actions: headerActions,
  })

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  if (!warranty) {
    return <div className="text-center py-20 text-muted-foreground">Phiếu BH không tồn tại</div>
  }

  if (!['SENT', 'DELIVERED'].includes(warranty.status)) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted-foreground">Chỉ có thể xác nhận phiếu đã giao thành công</p>
        <Button variant="outline" onClick={() => router.push(`/supplier-warranties/${systemId}`)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button + warranty info */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/supplier-warranties/${systemId}`)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Quay lại
        </Button>
        <div className="text-sm text-muted-foreground">
          NCC: <span className="font-medium text-foreground">{warranty.supplierName}</span>
          {warranty.sentDate && <> · Ngày gửi: {formatDateCustom(new Date(warranty.sentDate), 'dd/MM/yyyy')}</>}
          {warranty.trackingNumber && <> · MVĐ: <span className="font-medium text-foreground">{warranty.trackingNumber}</span></>}
        </div>
      </div>

      {/* Product items table for confirmation */}
      <Card className={mobileBleedCardClass}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Xác nhận kết quả bảo hành ({warranty.items.length} sản phẩm)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Nhập số lượng được bảo hành, số lượng trả lại và chi phí cho từng sản phẩm.
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Zap className="mr-1.5 h-3.5 w-3.5" /> Điền nhanh <ChevronDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleQuickFillReturn}>
                  Tất cả: Trả lại (đã sửa)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleQuickFillReplace}>
                  Tất cả: Đổi mới
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleQuickFillDeduct}>
                  Tất cả: Trừ tiền
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleQuickFillReset}>
                  Xóa tất cả
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">STT</TableHead>
                  <TableHead className="min-w-[200px]">Sản phẩm</TableHead>
                  <TableHead className="w-16 text-center">SL gửi</TableHead>
                  <TableHead className="w-28 text-right">Giá nhập</TableHead>
                  <TableHead className="w-40">Kết quả</TableHead>
                  <TableHead className="w-24 text-center">SL được BH</TableHead>
                  <TableHead className="w-20 text-center">SL trả lại</TableHead>
                  <TableHead className="w-36 text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warranty.items.map((item, index) => {
                  const ci = confirmItems[index]
                  const isDeduct = ci?.warrantyResult === 'Trừ tiền'
                  const hasResult = !!ci?.warrantyResult
                  return (
                  <TableRow key={item.systemId}>
                    <TableCell className="text-center text-muted-foreground align-top pt-4">{index + 1}</TableCell>
                    <TableCell className="align-top pt-3">
                      <div className="flex items-start gap-3">
                        {item.productImage ? (
                          <div className="shrink-0 w-10 h-10 rounded-md overflow-hidden border border-muted">
                            <LazyImage src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="shrink-0 w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0 pt-0.5">
                          <p className="font-medium text-sm leading-snug">{item.productName}</p>
                          {item.productSystemId ? (
                            <Link href={`/products/${item.productSystemId}`} className="text-xs text-primary hover:underline">
                              {item.productId}
                            </Link>
                          ) : (
                            <span className="text-xs text-muted-foreground">{item.productId}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center align-top pt-4 font-medium">{item.sentQuantity}</TableCell>
                    <TableCell className="text-right align-top pt-4">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="align-top pt-3">
                      <Select
                        value={ci?.warrantyResult || ''}
                        onValueChange={v => updateConfirmItem(index, 'warrantyResult', v)}
                      >
                        <SelectTrigger className="h-9 w-36">
                          <SelectValue placeholder="Chọn kết quả..." />
                        </SelectTrigger>
                        <SelectContent>
                          {WARRANTY_RESULTS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="align-top pt-3 text-center">
                      {isDeduct ? (
                        <Input
                          type="number"
                          min={0}
                          max={item.sentQuantity}
                          className="h-9 text-center w-20 mx-auto"
                          value={ci?.approvedQuantity ?? 0}
                          onChange={e => updateConfirmItem(index, 'approvedQuantity', Math.min(parseInt(e.target.value) || 0, item.sentQuantity))}
                        />
                      ) : (
                        <span className="text-sm font-medium">{hasResult ? ci?.approvedQuantity : '—'}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center align-top pt-4">
                      <span className="text-sm text-muted-foreground">{hasResult ? (ci?.returnedQuantity ?? 0) : '—'}</span>
                    </TableCell>
                    <TableCell className="text-right align-top pt-4">
                      {isDeduct ? (
                        <span className="font-semibold text-primary">{formatCurrency(ci?.warrantyCost ?? 0)}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary + Notes + Receipt option */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={mobileBleedCardClass}>
          <CardContent className="pt-5 text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">SP được BH</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{totalApprovedItems}</p>
          </CardContent>
        </Card>
        <Card className={mobileBleedCardClass}>
          <CardContent className="pt-5 text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">SP trả lại (không BH)</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{totalReturnedItems}</p>
          </CardContent>
        </Card>
        <Card className={mobileBleedCardClass}>
          <CardContent className="pt-5 text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tổng tiền NCC trừ</p>
            <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(totalWarrantyCost)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card className={mobileBleedCardClass}>
        <CardContent className="pt-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Ghi chú xác nhận</p>
          <Textarea
            value={confirmNotes}
            onChange={e => setConfirmNotes(e.target.value)}
            placeholder="Ghi chú thêm về kết quả xác nhận..."
            rows={2}
          />
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 border-t pt-4">
        <Button variant="outline" onClick={() => router.push(`/supplier-warranties/${systemId}`)}>
          Hủy
        </Button>
        <Button onClick={handleConfirm} disabled={confirm.isPending || confirmItems.length === 0}>
          {confirm.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-1.5 h-4 w-4" />}
          Xác nhận kết quả
        </Button>
      </div>
    </div>
  )
}
