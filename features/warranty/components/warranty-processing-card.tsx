/**
 * WarrantyProcessingCard
 * 
 * Card xử lý bảo hành - Hiển thị các action và lịch sử thanh toán
 * REFACTORED: Logic tách ra warranty-processing-logic.ts
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { CreatePaymentVoucherDialog } from './create-payment-voucher-dialog.tsx';
import { CreateReceiptVoucherDialog } from './create-receipt-voucher-dialog.tsx';
import { usePaymentStore } from '../../payments/store.ts';
import { useReceiptStore } from '../../receipts/store.ts';
import { useOrderStore } from '../../orders/store.ts';
import { useAuth } from '../../../contexts/auth-context.tsx';
import type { WarrantyTicket } from '../types.ts';
import { 
  calculateWarrantyProcessingState,
  debugWarrantyProcessing 
} from './warranty-processing-logic.ts';

interface WarrantyProcessingCardProps {
  warrantyId: string;
  warrantySystemId: string;
  ticketStatus: string;
  customer: {
    name: string;
    phone: string;
  };
  totalPayment: number; // Số tiền cần thanh toán (dương = chi, âm = thu)
  linkedOrderSystemId?: string;
  branchSystemId?: string;
  branchName?: string;
  ticket?: WarrantyTicket; // Add ticket to get cancelReason
}

export function WarrantyProcessingCard({
  warrantyId,
  warrantySystemId,
  ticketStatus,
  customer,
  totalPayment,
  linkedOrderSystemId,
  branchSystemId,
  branchName,
  ticket,
}: WarrantyProcessingCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const payments = usePaymentStore(state => state.data);
  const receipts = useReceiptStore(state => state.data);
  const { data: orders } = useOrderStore();

  // ============================================================
  // TẤT CẢ LOGIC TÍNH TOÁN CHUYỂN SANG warranty-processing-logic.ts
  // ============================================================
  const state = React.useMemo(() => 
    calculateWarrantyProcessingState(ticket || null, payments, receipts, totalPayment),
    [ticket, payments, receipts, totalPayment]
  );

  // DEBUG: Log để kiểm tra
  React.useEffect(() => {
    console.log('💳 [WARRANTY PROCESSING CARD] State:', {
      totalPayment,
      remainingAmount: state.remainingAmount,
      totalPayments: state.warrantyPayments.reduce((sum, p) => p.status !== 'cancelled' ? sum + p.amount : sum, 0),
      totalReceipts: state.warrantyReceipts.reduce((sum, r) => r.status !== 'cancelled' ? sum + r.amount : sum, 0),
      paymentsCount: state.warrantyPayments.length,
      receiptsCount: state.warrantyReceipts.length,
      isFullyPaid: state.remainingAmount <= 0
    });
  }, [state, totalPayment]);

  // Get current user name and current time
  const currentUserName = user?.name || 'Người dùng';
  const currentTime = new Date().toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Group transactions: Theo PHIÊN LÀM VIỆC
  // - Phiên làm việc = các actions liên tiếp KHÔNG có hủy/mở ở giữa
  // - Khi gặp action HỦY → đóng phiên, tạo accordion "Đã hủy"
  // - Khi gặp action MỞ HOẶC REOPEN → bắt đầu phiên mới
  // - Mỗi phiên = 1 accordion riêng biệt
  const transactionGroups = React.useMemo(() => {
    // Lấy ALL history actions có liên quan đến phiếu chi/thu và trạng thái
    const relevantActions = ticket?.history?.filter(h => 
      h.action.includes('Tạo phiếu chi') || 
      h.action.includes('Tạo phiếu thu') ||
      h.action.includes('Hủy') ||
      h.action.includes('Mở lại') ||
      h.action.includes('Reopen')
    ) || [];
    
    if (relevantActions.length === 0) {
      // Fallback: Nếu không có history, gộp tất cả vào 1 group
      const allTransactions = [...state.warrantyPayments, ...state.warrantyReceipts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      if (allTransactions.length === 0) return [];
      
      const allCancelled = allTransactions.every(t => t.status === 'cancelled');
      const firstCancelled = allTransactions.find(t => t.status === 'cancelled');
      const cancelReason = firstCancelled?.description?.match(/\[HỦY\]\s*(.+?)(?:\s*\|\s*Gốc:|$)/)?.[1]?.trim();
      
      return [{
        id: 'default_group',
        transactions: allTransactions,
        allCancelled,
        cancelReason,
        createdAt: allTransactions[0].createdAt,
        performedBy: allTransactions[0].createdBy || currentUserName,
      }];
    }
    
    // Sort actions theo thời gian (cũ → mới) để xử lý theo thứ tự
    const sortedActions = [...relevantActions].sort((a, b) => 
      new Date(a.performedAt).getTime() - new Date(b.performedAt).getTime()
    );
    
    // Group theo phiên làm việc
    const sessions: any[] = [];
    let currentSession: any = null;
    
    sortedActions.forEach((action) => {
      const isCancel = action.action.includes('Hủy');
      const isReopen = action.action.includes('Mở lại') || action.action.includes('Reopen');
      const isCreateVoucher = action.action.includes('Tạo phiếu chi') || action.action.includes('Tạo phiếu thu');
      
      if (isReopen) {
        // Bắt đầu phiên mới khi mở lại
        if (currentSession) {
          sessions.push(currentSession);
        }
        currentSession = {
          actions: [],
          startTime: action.performedAt,
          endTime: action.performedAt,
          isCancelled: false,
        };
      } else if (isCancel) {
        // Đóng phiên hiện tại khi hủy
        if (currentSession) {
          currentSession.isCancelled = true;
          currentSession.endTime = action.performedAt;
          currentSession.cancelAction = action;
          sessions.push(currentSession);
          currentSession = null;
        }
      } else if (isCreateVoucher) {
        // Thêm action tạo phiếu vào phiên hiện tại
        if (!currentSession) {
          // Nếu chưa có phiên → tạo phiên mới
          currentSession = {
            actions: [],
            startTime: action.performedAt,
            endTime: action.performedAt,
            isCancelled: false,
          };
        }
        currentSession.actions.push(action);
        currentSession.endTime = action.performedAt;
      }
    });
    
    // Push phiên cuối cùng (nếu có)
    if (currentSession) {
      sessions.push(currentSession);
    }
    
    // Convert sessions thành groups với transactions
    const groups = sessions.map((session, index) => {
      const allTransactions: any[] = [];
      
      // Lấy tất cả transactions từ các actions trong phiên
      session.actions.forEach((action: any) => {
        const actionMetadata = action.metadata || {};
        const paymentSystemId = actionMetadata.paymentSystemId;
        const receiptSystemId = actionMetadata.receiptSystemId;
        
        if (paymentSystemId || receiptSystemId) {
          if (paymentSystemId) {
            const payment = state.warrantyPayments.find(p => p.systemId === paymentSystemId);
            if (payment) allTransactions.push(payment);
          }
          if (receiptSystemId) {
            const receipt = state.warrantyReceipts.find(r => r.systemId === receiptSystemId);
            if (receipt) allTransactions.push(receipt);
          }
        } else {
          // Fallback: Parse từ action string
          const voucherIds: string[] = action.action.match(/[A-Z]{2}\d{6}/g) || [];
          const transactions = [...state.warrantyPayments, ...state.warrantyReceipts]
            .filter(t => voucherIds.includes(t.id as string));
          allTransactions.push(...transactions);
        }
      });
      
      if (allTransactions.length === 0) return null;
      
      allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const allCancelled = session.isCancelled;
      // Lấy lý do hủy từ ticket history (entry "Hủy phiếu bảo hành")
      let cancelReason: string | undefined;
      
      if (allCancelled && ticket?.history) {
        // Tìm history entry "Hủy phiếu bảo hành" gần thời gian cancel nhất
        const cancelHistoryEntry = ticket.history
          .filter(h => h.action === 'Hủy phiếu bảo hành' && h.note?.includes('Lý do hủy:'))
          .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
          .find(h => {
            const historyTime = new Date(h.performedAt).getTime();
            const sessionTime = new Date(session.endTime).getTime();
            // Match nếu trong vòng 1 phút
            return Math.abs(historyTime - sessionTime) < 60000;
          });
        
        if (cancelHistoryEntry?.note) {
          cancelReason = cancelHistoryEntry.note.replace('Lý do hủy:', '').trim();
        }
      }
      
      console.log('[WARRANTY PROCESSING] Session cancel info:', {
        isCancelled: session.isCancelled,
        hasAction: !!session.cancelAction,
        note: session.cancelAction?.note,
        action: session.cancelAction?.action,
        foundCancelReason: cancelReason,
      });
      
      // Fallback: Lấy từ description của transaction nếu không tìm thấy
      if (!cancelReason && allCancelled) {
        const firstCancelled = allTransactions.find(t => t.status === 'cancelled');
        const match = firstCancelled?.description?.match(/\[HỦY\]\s*(.+?)(?:\s*\|\s*Gốc:|$)/);
        cancelReason = match?.[1]?.trim();
        
        console.log('[WARRANTY PROCESSING] Fallback from description:', {
          description: firstCancelled?.description,
          match: match,
          cancelReason,
        });
      }
      
      console.log('[WARRANTY PROCESSING] Final cancelReason:', cancelReason);
      
      const firstAction = session.actions[0];
      
      return {
        id: `session_${index}_${session.startTime}`,
        transactions: allTransactions,
        allCancelled,
        cancelReason,
        createdAt: session.endTime, // Dùng thời gian cuối cùng của phiên
        performedBy: firstAction?.performedBy || currentUserName,
      };
    }).filter(Boolean);
    
    // Sort: Mới nhất lên trên đầu
    return groups.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) as any[];
  }, [state.warrantyPayments, state.warrantyReceipts, ticket?.history, currentUserName]);

  // ============================================================
  // SỬ DỤNG STATE TỪ LOGIC FILE - KHÔNG CẦN TÍNH LẠI
  // ============================================================
  
  // 1️⃣ Check điều kiện ẨN CARD
  if (state.shouldHideCard) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Xử lý bảo hành
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Action Buttons - Hiện khi đã xử lý */}
          {state.canShowActionButtons && (
            <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/50 rounded-lg border">
              {/* Nút tạo phiếu chi - Hiện khi cần trả tiền khách */}
              {state.canShowPaymentButton && (
                <CreatePaymentVoucherDialog
                  warrantyId={warrantyId}
                  warrantySystemId={warrantySystemId}
                  customer={customer}
                  defaultAmount={state.remainingAmount} // Dùng số tiền còn lại
                  linkedOrderId={linkedOrderSystemId}
                  branchSystemId={branchSystemId}
                  branchName={branchName}
                  existingPayments={[]}
                />
              )}

              {/* Nút tạo phiếu thu - Hiện khi cần thu tiền khách */}
              {state.canShowReceiptButton && (
                <CreateReceiptVoucherDialog
                  warrantyId={warrantyId}
                  warrantySystemId={warrantySystemId}
                  customer={customer}
                  defaultAmount={state.remainingAmount} // Dùng số tiền còn lại
                  linkedOrderId={linkedOrderSystemId}
                  branchSystemId={branchSystemId}
                  branchName={branchName}
                  existingReceipts={[]}
                />
              )}
            </div>
          )}

          {/* Transaction History - Multiple Accordions (one per group) */}
          {state.hasTransactions && (
            <div className="space-y-4 pt-4 border-t">
              {transactionGroups.map((group, groupIndex) => {
                // ✅ CORRECT LOGIC FOR WARRANTY:
                // In warranty, totalPayment > 0 = Shop owes customer → count PAYMENTS (phiếu chi)
                const groupTotalPaid = group.transactions
                  .filter(t => t.status !== 'cancelled')
                  .reduce((sum, t) => {
                    const isPayment = 'recipientName' in t;
                    // Warranty context: count payments (chi tiền cho khách)
                    return sum + (isPayment ? t.amount : 0);
                  }, 0);
                
                const groupTime = new Date(group.createdAt).toLocaleString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                });
                
                return (
                  <Accordion key={group.id} type="single" collapsible className="w-full">
                    <AccordionItem value={group.id} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 flex-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <div className="text-left flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-medium ${group.allCancelled ? 'line-through text-muted-foreground' : ''}`}>
                                Xử lý bảo hành - {group.performedBy || currentUserName} - {groupTime}
                              </span>
                              {group.allCancelled && (
                                <Badge variant="secondary" className="text-xs">
                                  Đã hủy
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {group.transactions.length} giao dịch
                              {' • '}
                              Đã trả: {groupTotalPaid.toLocaleString('vi-VN')} đ / {Math.abs(totalPayment).toLocaleString('vi-VN')} đ
                              {group.allCancelled && group.cancelReason && (
                                <>
                                  {' • '}
                                  <span className="font-medium text-foreground">Lý do: {group.cancelReason}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent>
                        <div className="space-y-3 pt-4">
                          {/* Each payment/receipt as a separate card */}
                          {group.transactions
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((transaction) => {
                              // Check if it's a payment by checking for payment-specific field
                              // Payment has 'recipientName', Receipt has 'payerName'
                              const isPayment = 'recipientName' in transaction;
                              const linkedOrder = isPayment && transaction.linkedOrderSystemId 
                                ? orders.find(o => o.systemId === transaction.linkedOrderSystemId)
                                : null;
                              
                              return (
                                <div 
                                  key={transaction.systemId}
                                  className={`p-3 rounded-md border ${
                                    transaction.status === 'cancelled' 
                                      ? 'bg-muted/50 opacity-60' 
                                      : 'bg-card'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex flex-col gap-1.5 flex-1">
                                      {/* Header: Loại phiếu + ID */}
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-sm font-medium ${transaction.status === 'cancelled' ? 'line-through' : ''}`}>
                                          {isPayment ? 'Phiếu chi:' : 'Phiếu thu:'}
                                        </span>
                                        <Link 
                                          to={isPayment ? `/payments/${transaction.systemId}` : `/receipts/${transaction.systemId}`}
                                          className={`text-sm text-primary hover:underline font-semibold ${transaction.status === 'cancelled' ? 'line-through' : ''}`}
                                        >
                                          {transaction.id}
                                        </Link>
                                        {transaction.status === 'cancelled' && (
                                          <Badge variant="secondary" className="text-xs">
                                            Đã hủy
                                          </Badge>
                                        )}
                                      </div>
                                      
                                      {/* Phương thức thanh toán */}
                                      <div className="flex items-center gap-1 text-xs">
                                        <span className="text-muted-foreground">Phương thức:</span>
                                        <span className="font-medium">
                                          {isPayment 
                                            ? (linkedOrder ? `Trừ vào đơn hàng` : transaction.paymentMethodName || 'N/A')
                                            : transaction.paymentMethodName || 'N/A'
                                          }
                                        </span>
                                      </div>
                                      
                                      {/* Link đơn hàng (nếu có) */}
                                      {linkedOrder && (
                                        <div className="flex items-center gap-1 text-xs">
                                          <span className="text-muted-foreground">Đơn hàng:</span>
                                          <Link 
                                            to={`/orders/${linkedOrder.systemId}`}
                                            className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {linkedOrder.id}
                                            <ExternalLink className="h-3 w-3" />
                                          </Link>
                                        </div>
                                      )}
                                      
                                      {/* Ngày giờ - Người thao tác */}
                                      <div className="text-xs text-muted-foreground">
                                        {new Date(transaction.createdAt).toLocaleString('vi-VN', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                        })}
                                        {transaction.createdBy && (
                                          <span> - {transaction.createdBy}</span>
                                        )}
                                      </div>
                                      
                                      {/* Thời gian hủy */}
                                      {transaction.status === 'cancelled' && transaction.cancelledAt && (
                                        <span className="text-xs text-muted-foreground">
                                          Hủy lúc: {new Date(transaction.cancelledAt).toLocaleString('vi-VN')}
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Số tiền */}
                                    <span className={`text-sm font-semibold whitespace-nowrap ${
                                      transaction.status === 'cancelled' 
                                        ? 'text-muted-foreground line-through' 
                                        : isPayment 
                                          ? 'text-destructive' 
                                          : 'text-emerald-600 dark:text-emerald-400'
                                    }`}>
                                      {isPayment ? '-' : '+'}{transaction.amount.toLocaleString('vi-VN')} đ
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
