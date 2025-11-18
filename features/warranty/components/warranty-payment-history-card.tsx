/**
 * WarrantyPaymentHistoryCard
 * 
 * Card hiển thị lịch sử thanh toán (phiếu chi/thu) của warranty
 * Tương tự ComplaintProcessingCard bên complaints
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { FileText, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePaymentStore } from '../../payments/store.ts';
import { useReceiptStore } from '../../receipts/store.ts';
import { PAYMENT_STATUS_LABELS } from '../../payments/types.ts';
import type { Payment } from '../../payments/types.ts';

interface WarrantyPaymentHistoryCardProps {
  warrantySystemId: string;
  warrantyId: string;
}

export function WarrantyPaymentHistoryCard({
  warrantySystemId,
  warrantyId,
}: WarrantyPaymentHistoryCardProps) {
  const navigate = useNavigate();
  const { data: payments } = usePaymentStore();
  const { data: receipts } = useReceiptStore();

  // Filter payments/receipts for this warranty (exclude cancelled)
  const warrantyPayments = React.useMemo(() => 
    payments.filter(p => p.linkedWarrantySystemId === warrantySystemId && p.status !== 'cancelled')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [payments, warrantySystemId]
  );

  const warrantyReceipts = React.useMemo(() => 
    receipts.filter(r => (r as any).linkedWarrantySystemId === warrantySystemId && (r as any).status !== 'cancelled')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [receipts, warrantySystemId]
  );

  // Combine and sort by date
  const allTransactions = React.useMemo(() => {
    const combined = [
      ...warrantyPayments.map(p => ({ type: 'payment' as const, data: p, date: p.createdAt })),
      ...warrantyReceipts.map(r => ({ type: 'receipt' as const, data: r, date: r.createdAt })),
    ];
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [warrantyPayments, warrantyReceipts]);

  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { label: 'Chờ xử lý', variant: 'secondary' as const },
      pending_approval: { label: 'Chờ duyệt', variant: 'default' as const },
      approved: { label: 'Đã duyệt', variant: 'default' as const },
      completed: { label: 'Hoàn thành', variant: 'default' as const },
      cancelled: { label: 'Đã hủy', variant: 'destructive' as const },
    };
    const config = variants[status as keyof typeof variants] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (allTransactions.length === 0) {
    return null; // Không hiển thị card nếu chưa có giao dịch
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Lịch sử thanh toán</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {allTransactions.map((transaction, index) => {
          const isPayment = transaction.type === 'payment';
          const doc = transaction.data as any;
          const amount = doc.amount || 0;
          const date = new Date(doc.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={`${transaction.type}-${doc.systemId}`}
              className="flex items-start justify-between gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">
                    {isPayment ? 'Phiếu chi' : 'Phiếu thu'}: {doc.id}
                  </span>
                  {getStatusBadge(doc.status)}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {doc.description || (isPayment ? 'Hoàn tiền bảo hành' : 'Thu tiền bảo hành')}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{date}</span>
                  <span>•</span>
                  <span className={isPayment ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                    {isPayment ? '-' : '+'}{amount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => navigate(isPayment ? `/payments/${doc.systemId}` : `/receipts/${doc.systemId}`)}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
