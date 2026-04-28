import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Copy, Plus } from 'lucide-react';
import type { WarrantyTicket } from '../../types';
import type { WarrantyHistory } from '../../../../lib/types/prisma-extended';
import { formatDateTime } from '../../../../lib/date-utils';
import { mobileBleedCardClass } from '@/components/layout/page-section';

interface TicketInfoCardProps {
  ticket: WarrantyTicket;
  linkedOrderLabel?: string | undefined;
  publicTrackingUrl?: string | null | undefined;
  onCopyPublicLink: () => void;
  onGenerateTrackingCode: () => void;
  onNavigateEmployee: () => void;
  onNavigateOrder?: (() => void) | undefined;
  children?: React.ReactNode;
}

export function TicketInfoCard({
  ticket,
  linkedOrderLabel,
  publicTrackingUrl,
  onCopyPublicLink,
  onGenerateTrackingCode,
  onNavigateEmployee: _onNavigateEmployee,
  onNavigateOrder: _onNavigateOrder,
  children,
}: TicketInfoCardProps) {
  const trackingInfo = React.useMemo(() => {
    if (!ticket.publicTrackingCode) {
      return {
        display: <span className="text-orange-600">⚠️ Chưa có mã tra cứu</span>,
        hasCode: false,
      };
    }

    return {
      display: publicTrackingUrl,
      hasCode: true,
    };
  }, [ticket.publicTrackingCode, publicTrackingUrl]);

  const orderLabel = linkedOrderLabel || 'N/A';

  // Extract who performed key status changes from history
  const actionPerformers = React.useMemo(() => {
    const history = (ticket.history as WarrantyHistory[] | null) || [];
    const result: Record<string, string> = {};
    for (const entry of history) {
      if (entry.action?.startsWith('STATUS_CHANGE_')) {
        const status = entry.action.replace('STATUS_CHANGE_', '');
        result[status] = entry.performedBy;
      }
    }
    return result;
  }, [ticket.history]);

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader>
        <CardTitle>Thông Tin Phiếu Bảo hành</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-3">
            <div className="bg-muted/50 p-3 rounded-lg border">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Link theo dõi công khai</div>
                  <div className="text-sm break-all">{trackingInfo.display}</div>
                </div>

                {trackingInfo.hasCode ? (
                  <Button type="button" size="sm" variant="outline" onClick={onCopyPublicLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" size="sm" variant="outline" onClick={onGenerateTrackingCode}>
                    <Plus className="h-4 w-4 mr-1" />
                    Tạo mã
                  </Button>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                💡 Gửi link này cho khách hàng để họ theo dõi tiến độ xử lý
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Mã phiếu</p>
            <p className="font-bold text-primary">{ticket.id || '(Chưa có mã)'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Chi nhánh</p>
            <p className="font-medium text-sm">{ticket.branchName || '(Chưa có chi nhánh)'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Nhân viên</p>
            <Link href={`/employees/${ticket.employeeSystemId}`} className="font-medium text-sm text-blue-600 hover:underline">
              {ticket.employeeName}
            </Link>
          </div>

          {ticket.trackingCode && (
            <div>
              <p className="text-xs text-muted-foreground">Mã vận đơn</p>
              <p className="text-sm">{ticket.trackingCode}</p>
            </div>
          )}

          {ticket.shippingFee !== undefined && ticket.shippingFee > 0 && (
            <div>
              <p className="text-xs text-muted-foreground">Phí ship gửi về</p>
              <p className="font-medium text-sm">{ticket.shippingFee.toLocaleString('vi-VN')} đ</p>
            </div>
          )}

          {ticket.referenceUrl && (
            <div className="col-span-3">
              <p className="text-xs text-muted-foreground">Đường dẫn tham chiếu</p>
              <a href={ticket.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                {ticket.referenceUrl}
              </a>
            </div>
          )}

          {ticket.externalReference && (
            <div>
              <p className="text-xs text-muted-foreground">Mã tham chiếu</p>
              <p className="text-sm">{ticket.externalReference}</p>
            </div>
          )}

          {ticket.linkedOrderSystemId ? (
            <div>
              <p className="text-xs text-muted-foreground">Trả bảo hành vào đơn hàng</p>
              <Link href={`/orders/${ticket.linkedOrderSystemId}`} className="font-medium text-sm text-green-600 hover:underline">
                {orderLabel}
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-xs text-muted-foreground">Trả bảo hành vào đơn hàng</p>
              <span className="text-sm text-muted-foreground italic">Chưa liên kết</span>
            </div>
          )}

          {ticket.status === 'RETURNED' && (
            <div>
              <p className="text-xs text-muted-foreground">Phương thức trả hàng</p>
              <p className="text-sm font-medium">
                {ticket.linkedOrderSystemId ? `Giao qua đơn hàng (${orderLabel})` : 'Khách lấy trực tiếp tại cửa hàng'}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground">Ngày tạo</p>
            <p className="text-sm">{formatDateTime(ticket.createdAt)}</p>
          </div>

          {ticket.processingStartedAt && (
            <div>
              <p className="text-xs text-muted-foreground">Bắt đầu xử lý</p>
              <p className="text-sm">{formatDateTime(ticket.processingStartedAt)}</p>
              {actionPerformers['PROCESSING'] && (
                <p className="text-xs text-muted-foreground mt-0.5">bởi {actionPerformers['PROCESSING']}</p>
              )}
            </div>
          )}

          {ticket.processedAt && (
            <div>
              <p className="text-xs text-muted-foreground">Xử lý xong</p>
              <p className="text-sm">{formatDateTime(ticket.processedAt)}</p>
              {actionPerformers['COMPLETED'] && (
                <p className="text-xs text-muted-foreground mt-0.5">bởi {actionPerformers['COMPLETED']}</p>
              )}
            </div>
          )}

          {ticket.returnedAt && (
            <div>
              <p className="text-xs text-muted-foreground">Đã trả hàng</p>
              <p className="text-sm">{formatDateTime(ticket.returnedAt)}</p>
              {actionPerformers['RETURNED'] && (
                <p className="text-xs text-muted-foreground mt-0.5">bởi {actionPerformers['RETURNED']}</p>
              )}
            </div>
          )}

          {ticket.completedAt && (
            <div>
              <p className="text-xs text-muted-foreground">Kết thúc phiếu</p>
              <p className="text-sm text-blue-600">{formatDateTime(ticket.completedAt)}</p>
              {actionPerformers['COMPLETED'] && (
                <p className="text-xs text-muted-foreground mt-0.5">bởi {actionPerformers['COMPLETED']}</p>
              )}
            </div>
          )}

          {ticket.cancelledAt && (
            <div>
              <p className="text-xs text-muted-foreground">Đã hủy</p>
              <p className="text-sm text-red-600">{formatDateTime(ticket.cancelledAt)}</p>
              {actionPerformers['CANCELLED'] && (
                <p className="text-xs text-muted-foreground mt-0.5">bởi {actionPerformers['CANCELLED']}</p>
              )}
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground">Cập nhật</p>
            <p className="text-sm">{formatDateTime(ticket.updatedAt)}</p>
            {ticket.updatedBy && (
              <p className="text-xs text-muted-foreground mt-0.5">bởi {ticket.updatedBy}</p>
            )}
          </div>

          {ticket.createdBy && (
            <div>
              <p className="text-xs text-muted-foreground">Người tạo</p>
              <p className="text-sm font-medium">{ticket.createdBy}</p>
            </div>
          )}

          {ticket.notes && (
            <div className="col-span-3">
              <p className="text-xs text-muted-foreground">Ghi chú</p>
              <p className="text-sm whitespace-pre-wrap">{ticket.notes}</p>
            </div>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
