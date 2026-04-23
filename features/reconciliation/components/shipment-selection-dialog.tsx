'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Package, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format-utils'
import { useDebounce } from '@/hooks/use-debounce'
import { useInfiniteAvailableShipments } from '../hooks/use-reconciliation-sheets'
import type { AvailableShipment } from '../api/reconciliation-sheets-api'

interface ShipmentSelectionDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (shipments: AvailableShipment[]) => void
  carrier: string
  /** Danh sách packagingId đã thêm (để loại trừ) */
  excludeIds?: Set<string>
}

export function ShipmentSelectionDialog({
  isOpen,
  onOpenChange,
  onSelect,
  carrier,
  excludeIds = new Set(),
}: ShipmentSelectionDialogProps) {
  const [search, setSearch] = React.useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // Server-side search + infinite scroll
  const {
    data: pages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAvailableShipments(
    { carrier, search: debouncedSearch || undefined },
    isOpen && !!carrier,
  )

  // Flatten all pages → single array, exclude already-added
  const allShipments = React.useMemo(
    () => (pages?.pages.flatMap(p => p.data) ?? []).filter(s => !excludeIds.has(s.systemId)),
    [pages, excludeIds],
  )

  const totalAvailable = pages?.pages[0]?.total ?? 0

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      setSearch('')
      setSelectedIds(new Set())
    }
  }, [isOpen])

  // Infinite scroll handler
  const handleScroll = React.useCallback(() => {
    const container = scrollContainerRef.current
    if (!container || !hasNextPage || isFetchingNextPage) return
    const { scrollTop, scrollHeight, clientHeight } = container
    if (scrollHeight - scrollTop - clientHeight < 100) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Toggle select all visible
  const allSelected = allShipments.length > 0 && allShipments.every(s => selectedIds.has(s.systemId))

  function handleSelectAll(checked: boolean) {
    if (checked) {
      const newSelected = new Set(selectedIds)
      allShipments.forEach(s => newSelected.add(s.systemId))
      setSelectedIds(newSelected)
    } else {
      const newSelected = new Set(selectedIds)
      allShipments.forEach(s => newSelected.delete(s.systemId))
      setSelectedIds(newSelected)
    }
  }

  function handleToggle(id: string) {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  function handleConfirm() {
    if (selectedIds.size === 0) return
    const selected = allShipments.filter(s => selectedIds.has(s.systemId))
    onSelect(selected)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent mobileFullScreen className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chọn nhanh vận đơn</DialogTitle>
          <DialogDescription>
            Đối tác: <span className="font-semibold">{carrier}</span> · Tổng: {totalAvailable} vận đơn · Đã chọn: {selectedIds.size}
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Tìm mã vận đơn, mã đơn hàng, tên khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
            autoFocus
          />
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden flex-1 flex flex-col">
          {/* Select all header */}
          <div
            className="bg-muted/50 border-b border-border px-4 py-2 flex items-center gap-4 cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => handleSelectAll(!allSelected)}
          >
            <Checkbox
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-sm font-medium flex-1">Chọn tất cả</span>
            <span className="text-xs text-muted-foreground">Mã đơn</span>
            <span className="text-xs text-muted-foreground w-20 text-right">COD</span>
            <span className="text-xs text-muted-foreground w-20 text-right">Phí GH</span>
          </div>

          {/* Shipment list with infinite scroll */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto"
            onScroll={handleScroll}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-3" />
                <p>Đang tải vận đơn...</p>
              </div>
            ) : allShipments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mb-3" />
                <p>Không tìm thấy vận đơn</p>
              </div>
            ) : (
              <>
                {allShipments.map(s => {
                  const isSelected = selectedIds.has(s.systemId)
                  return (
                    <div
                      key={s.systemId}
                      className={cn(
                        'flex items-center gap-4 px-4 py-2.5 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors',
                        isSelected && 'bg-primary/5',
                      )}
                      onClick={() => handleToggle(s.systemId)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(s.systemId)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium font-mono truncate">
                          {s.trackingCode || 'Chưa có mã vận đơn'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.order?.customerName || '-'}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground font-mono shrink-0">
                        {s.order?.id || '-'}
                      </span>
                      <span className="text-sm font-medium w-20 text-right shrink-0">
                        {formatCurrency(Number(s.codAmount) || 0)}
                      </span>
                      <span className="text-sm text-muted-foreground w-20 text-right shrink-0">
                        {formatCurrency(Number(s.shippingFeeToPartner) || 0)}
                      </span>
                    </div>
                  )
                })}

                {/* Loading more indicator */}
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center py-3 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Đang tải thêm...</span>
                  </div>
                )}

                {/* Info footer */}
                <div className="border-t border-border px-4 py-2 text-center">
                  <span className="text-sm text-muted-foreground">
                    Hiển thị {allShipments.length} / {totalAvailable} vận đơn
                    {hasNextPage && ' · Cuộn xuống để tải thêm'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Thoát
          </Button>
          <Button onClick={handleConfirm} disabled={selectedIds.size === 0}>
            Xác nhận ({selectedIds.size} vận đơn)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
