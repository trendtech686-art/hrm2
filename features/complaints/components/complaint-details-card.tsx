'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { Copy, Plus, AlertTriangle, FileText, Receipt, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge, COMPLAINT_STATUS_MAP } from "../../../components/StatusBadge";
import { generateTrackingUrl, getTrackingCode } from '../tracking-utils';
import {
  complaintPriorityColors,
  complaintPriorityLabels,
  complaintVerificationColors,
  complaintVerificationLabels,
  complaintTypeColors,
  complaintTypeLabels,
} from '../types';
import { getSLAStatusLabel } from '../hooks/use-complaint-time-tracking';
import type { Complaint } from '../types';

interface Props {
  complaint: Complaint;
  currentUser: { systemId: string; name: string };
  employees: Array<{ systemId: string; fullName: string }>;
  trackingEnabled?: boolean;
  onGenerateTrackingCode?: () => void;
  timeTracking?: {
    currentProcessingTimeFormatted?: string;
    resolutionStatus?: 'on-time' | 'warning' | 'overdue' | 'pending';
    responseStatus?: 'on-time' | 'warning' | 'overdue' | 'pending';
    responseTimeFormatted?: string;
    resolutionTimeFormatted?: string;
  } | null;
}

export const ComplaintDetailsCard: React.FC<Props> = React.memo(({ complaint, currentUser, employees, trackingEnabled, onGenerateTrackingCode, timeTracking }) => {
  const router = useRouter();

  // Extract all linked compensation entities from embedded data
  const entities = (complaint as unknown as { compensationEntities?: {
    payments: Record<string, { systemId: string; id: string; amount: number; status: string; cancelledAt?: string | null }>;
    receipts: Record<string, { systemId: string; id: string; amount: number; status: string; cancelledAt?: string | null }>;
    inventoryChecks: Record<string, { systemId: string; id: string; status: string; cancelledAt?: string | null; items: Array<{ productName: string; difference: number }> }>;
    penalties: Record<string, { systemId: string; id: string; amount: number; penaltyTypeName?: string | null; employeeName?: string | null; status?: string }>;
  } }).compensationEntities;

  const allPayments = entities ? Object.values(entities.payments) : [];
  const allReceipts = entities ? Object.values(entities.receipts) : [];
  const allInventoryChecks = entities ? Object.values(entities.inventoryChecks) : [];
  const allPenalties = entities ? Object.values(entities.penalties) : [];

  const hasLinkedEntities = allPayments.length > 0 || allReceipts.length > 0 || allInventoryChecks.length > 0 || allPenalties.length > 0;

  // Calculate totals (exclude cancelled)
  const totalPayments = allPayments.filter(p => p.status !== 'cancelled').reduce((sum, p) => sum + p.amount, 0);
  const totalReceipts = allReceipts.filter(r => r.status !== 'cancelled').reduce((sum, r) => sum + r.amount, 0);
  const totalPenalties = allPenalties.filter(p => p.status !== 'Đã hủy' && p.status?.toLowerCase() !== 'cancelled').reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader>
        <CardTitle size="lg">Thông tin phiếu khiếu nại</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mã phiếu + Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-primary text-lg">{complaint.id}</span>
          <StatusBadge status={complaint.status} statusMap={COMPLAINT_STATUS_MAP} />
          <Badge variant="outline" className={cn("border", complaintPriorityColors[complaint.priority])}>
            {complaintPriorityLabels[complaint.priority]}
          </Badge>
          {complaint.status !== 'cancelled' && (
            <>
              <Badge className={complaintVerificationColors[complaint.verification]}>
                {complaintVerificationLabels[complaint.verification]}
              </Badge>
              <Badge variant="outline" className={complaintTypeColors[complaint.type]}>
                {complaintTypeLabels[complaint.type]}
              </Badge>
            </>
          )}
        </div>

        {/* SLA Timer & Time Tracking Metrics */}
        {timeTracking && complaint.status !== 'resolved' && complaint.status !== 'ended' && complaint.status !== 'cancelled' && (
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">SLA:</span>
              <span className={cn(
                "font-medium",
                timeTracking.resolutionStatus === 'overdue' ? 'text-red-600' :
                timeTracking.resolutionStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'
              )}>
                {getSLAStatusLabel(timeTracking.resolutionStatus ?? 'pending')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Phản hồi:</span>
              <span className={cn(
                "font-medium",
                timeTracking.responseStatus === 'overdue' ? 'text-red-600' :
                timeTracking.responseStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'
              )}>{timeTracking.responseTimeFormatted === '-' ? 'Chưa phản hồi' : timeTracking.responseTimeFormatted}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Giải quyết:</span>
              <span className={cn(
                "font-medium",
                timeTracking.resolutionStatus === 'overdue' ? 'text-red-600' :
                timeTracking.resolutionStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'
              )}>{timeTracking.resolutionTimeFormatted === '-' ? 'Đang xử lý' : timeTracking.resolutionTimeFormatted}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Tổng:</span>
              <span className="font-semibold text-primary">{timeTracking.currentProcessingTimeFormatted}</span>
            </div>
          </div>
        )}

        {/* Tracking Link - Like warranty ticket-info-card */}
        {trackingEnabled && (
          <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Link theo dõi công khai</div>
                <div className="text-sm break-all">
                  {complaint.publicTrackingCode
                    ? generateTrackingUrl(complaint)
                    : <span className="text-orange-600">⚠️ Chưa có mã tra cứu</span>
                  }
                </div>
              </div>
              {complaint.publicTrackingCode ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(generateTrackingUrl(complaint));
                    toast.success(
                      <div className="flex flex-col gap-1">
                        <div className="font-semibold">Đã copy link tracking</div>
                        <div className="text-sm text-muted-foreground">Mã: {getTrackingCode(complaint.id)}</div>
                      </div>,
                      { duration: 3000 }
                    );
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onGenerateTrackingCode}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Tạo mã
                </Button>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              💡 Gửi link này cho khách hàng để họ theo dõi tiến độ xử lý khiếu nại
            </div>
          </div>
        )}
        
        {/* Meta info */}
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {complaint.orderCode && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Đơn hàng:</span>
              <button
                onClick={() => router.push(`/orders/${complaint.orderSystemId}`)}
                className="font-medium text-primary hover:underline"
              >
                {complaint.orderCode}
              </button>
            </div>
          )}
          {complaint.branchName && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Chi nhánh:</span>
              <span className="font-medium">{complaint.branchName}</span>
            </div>
          )}
          {complaint.assigneeName && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">NV xử lý:</span>
              {complaint.assignedTo ? (
                <button
                  onClick={() => router.push(`/employees/${complaint.assignedTo}`)}
                  className="font-medium text-primary hover:underline"
                >
                  {complaint.assigneeName}
                </button>
              ) : (
                <span className="font-medium">{complaint.assigneeName}</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Tạo bởi:</span>
            <span className="font-medium">
              {(() => {
                if (complaint.createdBy === currentUser.systemId) {
                  return currentUser.name;
                }
                const creator = employees.find(e => 
                  e.systemId === complaint.createdBy || 
                  e.fullName === complaint.createdBy
                );
                return creator ? creator.fullName : complaint.createdBy;
              })()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Tạo lúc:</span>
            <span className="font-medium">
              {new Date(complaint.createdAt).toLocaleString("vi-VN")}
            </span>
          </div>
          {complaint.resolvedAt && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Đóng lúc:</span>
              <span className="font-medium text-green-600">
                {new Date(complaint.resolvedAt).toLocaleString("vi-VN")}
              </span>
            </div>
          )}
          {complaint.endedAt && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Kết thúc lúc:</span>
              <span className="font-medium text-blue-600">
                {new Date(complaint.endedAt).toLocaleString("vi-VN")}
              </span>
            </div>
          )}
          {complaint.verification && complaint.verification !== 'pending-verification' && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Xác minh:</span>
              <span className={cn("font-medium", complaint.verification === 'verified-correct' ? "text-red-600" : "text-green-600")}>
                {complaint.verification === 'verified-correct' ? "Lỗi thật" : "Khách sai"}
              </span>
            </div>
          )}
          {complaint.responsibleUserId && (
            <div className="flex items-center gap-2 md:col-span-2">
              <span className="text-muted-foreground">Người chịu trách nhiệm:</span>
              <button
                onClick={() => router.push(`/employees/${complaint.responsibleUserId}`)}
                className="font-medium text-primary hover:underline"
              >
                {employees.find((e) => e.systemId === complaint.responsibleUserId)?.fullName}
              </button>
            </div>
          )}
        </div>
        {complaint.description && (
          <div className="text-sm">
            <span className="text-muted-foreground">Mô tả:</span>
            <p className="mt-1 text-foreground whitespace-pre-wrap">{complaint.description}</p>
          </div>
        )}

        {/* Linked Compensation Entities */}
        {hasLinkedEntities && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Chi phí liên quan</span>
            </div>
            <div className="space-y-1.5">
              {/* Phiếu chi (Payments) */}
              {allPayments.map((payment) => {
                const isCancelled = payment.status === 'cancelled';
                return (
                  <div
                    key={payment.systemId}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-md border transition-colors cursor-pointer",
                      isCancelled ? "bg-muted/50 opacity-60" : "bg-card hover:bg-accent"
                    )}
                    onClick={() => router.push(`/payments/${payment.systemId}`)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn("text-xs text-muted-foreground", isCancelled && "line-through")}>Phiếu chi:</span>
                      <span className={cn("text-sm font-medium text-primary hover:underline", isCancelled && "line-through")}>{payment.id}</span>
                      {isCancelled && <Badge variant="destructive" className="text-xs">Đã hủy</Badge>}
                    </div>
                    <span className={cn("text-sm font-medium shrink-0 ml-2", isCancelled ? "text-muted-foreground line-through" : "text-destructive")}>
                      -{payment.amount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                );
              })}

              {/* Phiếu thu (Receipts) */}
              {allReceipts.map((receipt) => {
                const isCancelled = receipt.status === 'cancelled';
                return (
                  <div
                    key={receipt.systemId}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-md border transition-colors cursor-pointer",
                      isCancelled ? "bg-muted/50 opacity-60" : "bg-card hover:bg-accent"
                    )}
                    onClick={() => router.push(`/receipts/${receipt.systemId}`)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn("text-xs text-muted-foreground", isCancelled && "line-through")}>Phiếu thu:</span>
                      <span className={cn("text-sm font-medium text-primary hover:underline", isCancelled && "line-through")}>{receipt.id}</span>
                      {isCancelled && <Badge variant="destructive" className="text-xs">Đã hủy</Badge>}
                    </div>
                    <span className={cn("text-sm font-medium shrink-0 ml-2", isCancelled ? "text-muted-foreground line-through" : "text-emerald-600 dark:text-emerald-400")}>
                      +{receipt.amount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                );
              })}

              {/* Phiếu kiểm kê (Inventory Checks) */}
              {allInventoryChecks.map((ic) => {
                const isCancelled = ic.status === 'cancelled';
                const needsBalance = !isCancelled && ic.status !== 'BALANCED' && ic.status !== 'balanced';
                return (
                  <div
                    key={ic.systemId}
                    className={cn(
                      "flex flex-col p-2.5 rounded-md border transition-colors cursor-pointer",
                      isCancelled ? "bg-muted/50 opacity-60" : "bg-card hover:bg-accent"
                    )}
                    onClick={() => router.push(`/inventory-checks/${ic.systemId}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <ClipboardList className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className={cn("text-xs text-muted-foreground", isCancelled && "line-through")}>Phiếu kiểm kê:</span>
                        <span className={cn("text-sm font-medium text-primary hover:underline", isCancelled && "line-through")}>{ic.id}</span>
                        {isCancelled && <Badge variant="destructive" className="text-xs">Đã hủy</Badge>}
                      </div>
                      {ic.items && ic.items.length > 0 && (
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">{ic.items.length} SP</span>
                      )}
                    </div>
                    {needsBalance && (
                      <div className="flex items-center gap-1.5 mt-1.5 ml-5.5">
                        <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                        <span className="text-xs text-amber-600">Cần cân bằng kho mới có hiệu lực</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Phiếu phạt (Penalties) */}
              {allPenalties.map((penalty) => {
                const isCancelled = penalty.status === 'Đã hủy' || penalty.status?.toLowerCase() === 'cancelled';
                return (
                  <div
                    key={penalty.systemId}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-md border transition-colors cursor-pointer",
                      isCancelled ? "bg-muted/50 opacity-60" : "bg-card hover:bg-accent"
                    )}
                    onClick={() => router.push(`/penalties/${penalty.systemId}`)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <AlertTriangle className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                      <span className={cn("text-sm font-medium text-primary hover:underline whitespace-nowrap", isCancelled && "line-through")}>{penalty.id}</span>
                      <span className={cn("text-sm text-muted-foreground truncate", isCancelled && "line-through")}>
                        {penalty.employeeName}{penalty.penaltyTypeName ? ` - ${penalty.penaltyTypeName}` : ''}
                      </span>
                      {isCancelled && <Badge variant="destructive" className="text-xs">Đã hủy</Badge>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={cn("text-sm font-medium", isCancelled ? "text-muted-foreground line-through" : "text-orange-600 dark:text-orange-400")}>
                        {Number(penalty.amount).toLocaleString('vi-VN')}đ
                      </span>
                      <Badge variant={isCancelled ? 'destructive' : penalty.status === 'Đã thanh toán' ? 'default' : 'outline'} className="text-xs">
                        {penalty.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total summary */}
            {(totalPayments > 0 || totalReceipts > 0 || totalPenalties > 0) && (
              <div className="flex items-center justify-between pt-2 border-t text-sm">
                <span className="text-muted-foreground font-medium">Tổng chi phí:</span>
                <div className="flex items-center gap-3">
                  {totalPayments > 0 && (
                    <span className="text-destructive font-medium">Chi: -{totalPayments.toLocaleString('vi-VN')}đ</span>
                  )}
                  {totalReceipts > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Thu: +{totalReceipts.toLocaleString('vi-VN')}đ</span>
                  )}
                  {totalPenalties > 0 && (
                    <span className="text-orange-600 dark:text-orange-400 font-medium">Phạt: {totalPenalties.toLocaleString('vi-VN')}đ</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
