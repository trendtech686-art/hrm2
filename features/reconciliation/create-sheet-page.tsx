'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { usePageHeader } from '@/contexts/page-header-context'
import { useCreateSheet, useInfiniteAvailableShipments, useCarriers } from './hooks/use-reconciliation-sheets'
import type { AvailableShipment, CreateSheetItemInput } from './api/reconciliation-sheets-api'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { VirtualizedCombobox, type ComboboxOption } from '@/components/ui/virtualized-combobox'
import { Save, Trash2, Package, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ROUTES } from '@/lib/router'
import { formatCurrency } from '@/lib/format-utils'
import { CurrencyInput } from '@/components/ui/currency-input'
import { ShipmentSelectionDialog } from './components/shipment-selection-dialog'
import { mobileBleedCardClass } from '@/components/layout/page-section';

interface SheetItem extends CreateSheetItemInput {
  _tempId: string
}

export function CreateReconciliationSheetPage() {
  const router = useRouter()
  const createSheet = useCreateSheet()
  const { data: carriers = [] } = useCarriers()

  // Form state
  const [carrier, setCarrier] = React.useState('')
  const [note, setNote] = React.useState('')
  const [items, setItems] = React.useState<SheetItem[]>([])

  // "Chọn nhanh" dialog state
  const [isSelectionOpen, setIsSelectionOpen] = React.useState(false)

  // Server-side search for VirtualizedCombobox
  const [comboboxSearch, setComboboxSearch] = React.useState('')

  // Infinite query — server-side search + pagination
  const {
    data: shipmentPages,
    isLoading: isLoadingShipments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAvailableShipments(
    { carrier, search: comboboxSearch || undefined },
    !!carrier,
  )

  // Flatten all pages → single array
  const allShipments = React.useMemo(
    () => shipmentPages?.pages.flatMap(p => p.data) ?? [],
    [shipmentPages],
  )

  // Total count from API (first page has it)
  const totalAvailable = shipmentPages?.pages[0]?.total ?? 0

  // Filter out already-added items
  const addedPackagingIds = React.useMemo(() => new Set(items.map(i => i.packagingId)), [items])

  // Convert shipments → ComboboxOption for VirtualizedCombobox (server already filtered)
  const shipmentOptions: ComboboxOption[] = React.useMemo(() => {
    return allShipments
      .filter(s => !addedPackagingIds.has(s.systemId))
      .map(s => ({
        value: s.systemId,
        label: s.trackingCode || 'Chưa có mã vận đơn',
        subtitle: `${s.order?.id || '-'} | ${s.order?.customerName || '-'}`,
        metadata: s,
      }))
  }, [allShipments, addedPackagingIds])

  // Custom render for shipment option in combobox
  const renderShipmentOption = React.useCallback((option: ComboboxOption) => {
    const s = option.metadata as AvailableShipment
    return (
      <div className="flex items-center gap-3 w-full py-1">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm font-mono truncate">{option.label}</p>
          <p className="text-xs text-muted-foreground">{option.subtitle}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-semibold text-sm text-primary">{formatCurrency(Number(s.codAmount) || 0)}</p>
          <p className="text-xs text-muted-foreground">Phí: {formatCurrency(Number(s.shippingFeeToPartner) || 0)}</p>
        </div>
      </div>
    )
  }, [])

  // Handle combobox selection — add shipment immediately, don't keep selected
  const handleComboboxSelect = React.useCallback((option: ComboboxOption | null) => {
    if (!option) return
    const shipment = option.metadata as AvailableShipment
    addShipment(shipment)
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

  // Header
  usePageHeader(React.useMemo(() => ({
    title: 'Tạo phiếu đối soát',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Đối soát COD', href: ROUTES.INTERNAL.RECONCILIATION },
      { label: 'Tạo phiếu đối soát', href: '', isCurrent: true },
    ],
    showBackButton: true,
    actions: [
      <Button
        key="save"
        size="sm"
        onClick={handleSave}
        disabled={createSheet.isPending || !carrier || items.length === 0}
      >
        {createSheet.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</> : <><Save className="mr-2 h-4 w-4" /> Lưu phiếu</>}
      </Button>,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [carrier, items.length, createSheet.isPending]))

  // Totals calculation
  const totals = React.useMemo(() => {
    let codSystem = 0, codPartner = 0, feeSystem = 0, feePartner = 0
    for (const item of items) {
      codSystem += item.codSystem || 0
      codPartner += item.codPartner || 0
      feeSystem += item.feeSystem || 0
      feePartner += item.feePartner || 0
    }
    return {
      codSystem,
      codPartner,
      codDifference: codPartner - codSystem,
      feeSystem,
      feePartner,
      feeDifference: feePartner - feeSystem,
    }
  }, [items])

  function addShipment(shipment: AvailableShipment) {
    const newItem: SheetItem = {
      _tempId: shipment.systemId,
      packagingId: shipment.systemId,
      trackingCode: shipment.trackingCode || '',
      orderId: shipment.order?.id || '',
      orderSystemId: shipment.order?.systemId || '',
      customerName: shipment.order?.customerName || '',
      codSystem: Number(shipment.codAmount) || 0,
      codPartner: Number(shipment.codAmount) || 0,
      feeSystem: Number(shipment.shippingFeeToPartner) || 0,
      feePartner: Number(shipment.shippingFeeToPartner) || 0,
    }
    setItems(prev => [...prev, newItem])
  }

  function addShipments(shipments: AvailableShipment[]) {
    const newItems: SheetItem[] = shipments.map(s => ({
      _tempId: s.systemId,
      packagingId: s.systemId,
      trackingCode: s.trackingCode || '',
      orderId: s.order?.id || '',
      orderSystemId: s.order?.systemId || '',
      customerName: s.order?.customerName || '',
      codSystem: Number(s.codAmount) || 0,
      codPartner: Number(s.codAmount) || 0,
      feeSystem: Number(s.shippingFeeToPartner) || 0,
      feePartner: Number(s.shippingFeeToPartner) || 0,
    }))
    setItems(prev => [...prev, ...newItems])
    toast.success(`Đã thêm ${newItems.length} vận đơn`)
  }

  function removeItem(tempId: string) {
    setItems(prev => prev.filter(i => i._tempId !== tempId))
  }

  function updateItemField(tempId: string, field: 'codPartner' | 'feePartner' | 'note', value: number | string) {
    setItems(prev => prev.map(item => {
      if (item._tempId !== tempId) return item
      return { ...item, [field]: value }
    }))
  }

  function handleSave() {
    if (!carrier) {
      toast.error('Vui lòng chọn đối tác vận chuyển')
      return
    }
    if (items.length === 0) {
      toast.error('Phiếu đối soát phải có ít nhất 1 vận đơn')
      return
    }

    const payload = {
      carrier,
      note: note || undefined,
      items: items.map(({ _tempId, ...rest }) => rest),
    }

    createSheet.mutate(payload, {
      onSuccess: (sheet) => {
        toast.success(`Tạo phiếu đối soát ${sheet.id} thành công`)
        router.push(ROUTES.INTERNAL.RECONCILIATION)
      },
      onError: (err) => {
        toast.error(err.message)
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Form header section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle size="sm">Thông tin chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Đối tác vận chuyển <span className="text-destructive">*</span></Label>
              <Select value={carrier} onValueChange={(v) => { setCarrier(v); setItems([]) }}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đối tác vận chuyển" />
                </SelectTrigger>
                <SelectContent>
                  {carriers.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú cho phiếu đối soát..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Totals summary */}
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle size="sm">Tổng hợp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">COD hệ thống</div>
                  <div className="text-lg font-semibold">{formatCurrency(totals.codSystem)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">COD đối tác</div>
                  <div className="text-lg font-semibold">{formatCurrency(totals.codPartner)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Chênh lệch COD</div>
                  <div className={`text-lg font-semibold ${totals.codDifference !== 0 ? 'text-destructive' : 'text-green-600'}`}>
                    {formatCurrency(totals.codDifference)}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Phí GH hệ thống</div>
                  <div className="text-lg font-semibold">{formatCurrency(totals.feeSystem)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Phí GH đối tác</div>
                  <div className="text-lg font-semibold">{formatCurrency(totals.feePartner)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Chênh lệch phí GH</div>
                  <div className={`text-lg font-semibold ${totals.feeDifference !== 0 ? 'text-destructive' : 'text-green-600'}`}>
                    {formatCurrency(totals.feeDifference)}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
              Tổng vận đơn: <span className="font-semibold text-foreground">{items.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items table */}
      <Card className={mobileBleedCardClass}>
        <CardHeader className="pb-4">
          <CardTitle size="sm">Danh sách vận đơn</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Inline search — VirtualizedCombobox like order product picker */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <VirtualizedCombobox
                options={shipmentOptions}
                value={null}
                onChange={handleComboboxSelect}
                onSearchChange={setComboboxSearch}
                placeholder={carrier ? `Thêm vận đơn (${totalAvailable} vận đơn khả dụng)` : 'Chọn đối tác vận chuyển trước'}
                searchPlaceholder="Tìm mã vận đơn, mã đơn hàng, khách hàng..."
                emptyPlaceholder="Không tìm thấy vận đơn phù hợp"
                disabled={!carrier}
                isLoading={isLoadingShipments}
                renderOption={renderShipmentOption}
                estimatedItemHeight={56}
                maxHeight={320}
                onLoadMore={() => fetchNextPage()}
                hasMore={!!hasNextPage}
                isLoadingMore={isFetchingNextPage}
              />
              <Button
                type="button"
                variant="outline"
                className="h-9 shrink-0"
                onClick={() => setIsSelectionOpen(true)}
                disabled={!carrier}
              >
                Chọn nhanh
              </Button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed rounded-md">
              <Package className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-sm">{carrier ? 'Chưa có vận đơn nào. Tìm kiếm bên trên để thêm.' : 'Vui lòng chọn đối tác vận chuyển trước.'}</p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Mã vận đơn</TableHead>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead className="text-right">COD HT</TableHead>
                    <TableHead className="text-right w-33">COD ĐT</TableHead>
                    <TableHead className="text-right">Lệch COD</TableHead>
                    <TableHead className="text-right">Phí HT</TableHead>
                    <TableHead className="text-right w-33">Phí ĐT</TableHead>
                    <TableHead className="text-right">Lệch phí</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, idx) => {
                    const codDiff = (item.codPartner || 0) - (item.codSystem || 0)
                    const feeDiff = (item.feePartner || 0) - (item.feeSystem || 0)
                    return (
                      <TableRow key={item._tempId}>
                        <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell className="font-mono text-sm">{item.trackingCode}</TableCell>
                        <TableCell className="font-mono text-sm">{item.orderId}</TableCell>
                        <TableCell className="max-w-37 truncate">{item.customerName}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.codSystem)}</TableCell>
                        <TableCell className="text-right">
                          <CurrencyInput
                            value={item.codPartner}
                            onChange={(v) => updateItemField(item._tempId, 'codPartner', v)}
                            className="h-8 w-33"
                          />
                        </TableCell>
                        <TableCell className={`text-right font-medium ${codDiff !== 0 ? 'text-destructive' : 'text-green-600'}`}>
                          {formatCurrency(codDiff)}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(item.feeSystem)}</TableCell>
                        <TableCell className="text-right">
                          <CurrencyInput
                            value={item.feePartner}
                            onChange={(v) => updateItemField(item._tempId, 'feePartner', v)}
                            className="h-8 w-33"
                          />
                        </TableCell>
                        <TableCell className={`text-right font-medium ${feeDiff !== 0 ? 'text-destructive' : 'text-green-600'}`}>
                          {formatCurrency(feeDiff)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item._tempId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* "Chọn nhanh" dialog */}
      <ShipmentSelectionDialog
        isOpen={isSelectionOpen}
        onOpenChange={setIsSelectionOpen}
        onSelect={addShipments}
        carrier={carrier}
        excludeIds={addedPackagingIds}
      />
    </div>
  )
}
