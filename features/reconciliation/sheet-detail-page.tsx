'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { usePageHeader } from '@/contexts/page-header-context'
import { useReconciliationSheet, useConfirmSheet, useDeleteSheet } from './hooks/use-reconciliation-sheets'
import type { ReconciliationSheetItem } from './api/reconciliation-sheets-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CheckCircle2, Trash2, Loader2 } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { ROUTES } from '@/lib/router'
import { formatCurrency } from '@/lib/format-utils'
import { formatDateTime } from '@/lib/date-utils'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  DRAFT: { label: 'Nháp', variant: 'secondary' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'default' },
  CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
}

export function SheetDetailPage() {
  const router = useRouter()
  const params = useParams<{ systemId: string }>()
  const systemId = params.systemId
  const { can } = useAuth()

  const { data: sheet, isLoading } = useReconciliationSheet(systemId)
  const confirmSheet = useConfirmSheet()
  const deleteSheet = useDeleteSheet()

  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const isDraft = sheet?.status === 'DRAFT'
  const canEdit = can('create_reconciliation')
  const canApprove = can('approve_reconciliation')

  // Page header
  usePageHeader(React.useMemo(() => ({
    title: sheet ? `Phiếu ${sheet.id}` : 'Chi tiết phiếu đối soát',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Đối soát COD', href: ROUTES.INTERNAL.RECONCILIATION },
      { label: sheet?.id || '...', href: '', isCurrent: true },
    ],
    showBackButton: true,
    actions: sheet ? [
      isDraft && canApprove && <Button
        key="confirm"
        size="sm"
        onClick={() => setConfirmDialogOpen(true)}
        disabled={confirmSheet.isPending}
      >
        <CheckCircle2 className="mr-2 h-4 w-4" />
        Xác nhận
      </Button>,
      isDraft && canEdit && <Button
        key="delete"
        size="sm"
        variant="destructive"
        onClick={() => setDeleteDialogOpen(true)}
        disabled={deleteSheet.isPending}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Xóa
      </Button>,
    ].filter(Boolean) : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [sheet?.id, sheet?.status, confirmSheet.isPending, deleteSheet.isPending]))

  const handleConfirm = () => {
    if (!systemId) return
    confirmSheet.mutate(systemId, {
      onSuccess: () => {
        toast.success('Đã xác nhận phiếu đối soát')
        setConfirmDialogOpen(false)
      },
      onError: (err) => toast.error(err.message),
    })
  }

  const handleDelete = () => {
    if (!systemId) return
    deleteSheet.mutate(systemId, {
      onSuccess: () => {
        toast.success('Đã xóa phiếu đối soát')
        router.push(ROUTES.INTERNAL.RECONCILIATION)
      },
      onError: (err) => toast.error(err.message),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!sheet) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <p className="text-lg font-medium">Không tìm thấy phiếu đối soát</p>
        <Button variant="link" onClick={() => router.push(ROUTES.INTERNAL.RECONCILIATION)}>
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  const status = statusConfig[sheet.status] || statusConfig.DRAFT

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin chung */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle size="sm">Thông tin chung</CardTitle>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Mã phiếu" value={sheet.id} mono />
            <InfoRow label="Đối tác vận chuyển" value={sheet.carrier} />
            <InfoRow label="Số vận đơn" value={String(sheet.items?.length ?? 0)} />
            <InfoRow label="Người tạo" value={sheet.createdByName || '-'} />
            <InfoRow label="Ngày tạo" value={formatDateTime(sheet.createdAt)} />
            {sheet.confirmedAt && (
              <InfoRow label="Ngày xác nhận" value={formatDateTime(sheet.confirmedAt)} />
            )}
            {sheet.note && (
              <InfoRow label="Ghi chú" value={sheet.note} />
            )}
          </CardContent>
        </Card>

        {/* Tổng hợp */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">Tổng hợp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <SummaryItem label="COD hệ thống" value={formatCurrency(sheet.totalCodSystem)} />
                <SummaryItem label="COD đối tác" value={formatCurrency(sheet.totalCodPartner)} />
                <SummaryItem
                  label="Chênh lệch COD"
                  value={formatCurrency(sheet.codDifference)}
                  highlight={sheet.codDifference !== 0}
                />
              </div>
              <div className="space-y-3">
                <SummaryItem label="Phí GH hệ thống" value={formatCurrency(sheet.totalFeeSystem)} />
                <SummaryItem label="Phí GH đối tác" value={formatCurrency(sheet.totalFeePartner)} />
                <SummaryItem
                  label="Chênh lệch phí GH"
                  value={formatCurrency(sheet.feeDifference)}
                  highlight={sheet.feeDifference !== 0}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items table */}
      <Card>
        <CardHeader>
          <CardTitle size="sm">Danh sách vận đơn ({sheet.items?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {(!sheet.items || sheet.items.length === 0) ? (
            <div className="text-center py-8 text-muted-foreground">
              Phiếu đối soát chưa có vận đơn nào.
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
                    <TableHead className="text-right">COD ĐT</TableHead>
                    <TableHead className="text-right">Lệch COD</TableHead>
                    <TableHead className="text-right">Phí HT</TableHead>
                    <TableHead className="text-right">Phí ĐT</TableHead>
                    <TableHead className="text-right">Lệch phí</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sheet.items.map((item, idx) => (
                    <ItemRow key={item.systemId} item={item} index={idx} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận phiếu đối soát?</AlertDialogTitle>
            <AlertDialogDescription>
              Xác nhận phiếu {sheet.id} với {sheet.items?.length ?? 0} vận đơn.
              Tất cả vận đơn sẽ được đánh dấu &quot;Đã đối soát&quot;. Không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={confirmSheet.isPending}>
              {confirmSheet.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...</> : 'Xác nhận'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa phiếu đối soát?</AlertDialogTitle>
            <AlertDialogDescription>
              Xóa phiếu {sheet.id}. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteSheet.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteSheet.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xóa...</> : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────────

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? 'font-mono font-medium' : 'font-medium'}>{value}</span>
    </div>
  )
}

function SummaryItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={`text-lg font-semibold ${highlight ? 'text-destructive' : ''}`}>{value}</div>
    </div>
  )
}

const ItemRow = React.memo(function ItemRow({ item, index }: { item: ReconciliationSheetItem; index: number }) {
  const codDiff = (item.codPartner || 0) - (item.codSystem || 0)
  const feeDiff = (item.feePartner || 0) - (item.feeSystem || 0)

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
      <TableCell className="font-mono text-sm">{item.trackingCode || '-'}</TableCell>
      <TableCell>
        {item.orderSystemId ? (
          <Link href={`/orders/${item.orderSystemId}`} className="text-primary hover:underline">
            {item.orderId || '-'}
          </Link>
        ) : (
          item.orderId || '-'
        )}
      </TableCell>
      <TableCell>{item.customerName || '-'}</TableCell>
      <TableCell className="text-right">{formatCurrency(item.codSystem)}</TableCell>
      <TableCell className="text-right">{formatCurrency(item.codPartner)}</TableCell>
      <TableCell className={`text-right font-medium ${codDiff !== 0 ? 'text-destructive' : 'text-green-600'}`}>
        {formatCurrency(codDiff)}
      </TableCell>
      <TableCell className="text-right">{formatCurrency(item.feeSystem)}</TableCell>
      <TableCell className="text-right">{formatCurrency(item.feePartner)}</TableCell>
      <TableCell className={`text-right font-medium ${feeDiff !== 0 ? 'text-destructive' : 'text-green-600'}`}>
        {formatCurrency(feeDiff)}
      </TableCell>
    </TableRow>
  )
})
