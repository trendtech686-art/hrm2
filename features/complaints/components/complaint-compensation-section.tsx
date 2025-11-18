import React from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import type { Complaint } from "../types.ts";
import { usePaymentStore } from "../../payments/store.ts";
import { useReceiptStore } from "../../receipts/store.ts";
import { useInventoryCheckStore } from "../../inventory-checks/store.ts";

interface Props {
  complaint: Complaint;
  actionTimestamp?: Date | string; // Neu co truyen timestamp cu the, dung cai do thay vi tim tu timeline
}

/**
 * Accordion hiển thị thông tin bù trừ khách hàng (phiếu chi/thu, kiểm kho)
 * 
 * LOGIC:
 * 1. Đọc inventoryAdjustment trước, nếu không có thì đọc từ inventoryHistory
 * 2. Load phiếu kiểm kho từ inventoryCheckSystemId (từ adjustment hoặc history)
 * 3. Load phiếu chi/thu từ compensationMetadata
 * 4. Hiển thị badge "Đã hủy" nếu timeline có action 'cancelled'
 */
export const ComplaintCompensationSection: React.FC<Props> = ({ complaint, actionTimestamp }) => {
  const navigate = useNavigate();
  
  // Neu co actionTimestamp truyen vao (tu history), dung cai do
  // Nguoc lai tim action verified-correct dau tien
  let verificationNote = "";
  let compensationDateTime = "N/A";
  let actionMetadata: any = null;
  
  if (actionTimestamp) {
    // Dung timestamp truyen vao
    compensationDateTime = new Date(actionTimestamp).toLocaleString("vi-VN", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    
    // Tim action tuong ung voi timestamp nay
    const matchingAction = complaint.timeline.find(
      a => a.actionType === 'verified-correct' && 
           new Date(a.performedAt).getTime() === new Date(actionTimestamp).getTime()
    );
    verificationNote = matchingAction?.note || "";
    actionMetadata = matchingAction?.metadata;
  } else {
    // Tim action verified-correct dau tien (backward compatibility)
    const firstVerifyAction = complaint.timeline.find(a => a.actionType === "verified-correct");
    verificationNote = firstVerifyAction?.note || "";
    actionMetadata = firstVerifyAction?.metadata;
    compensationDateTime = firstVerifyAction
      ? new Date(firstVerifyAction.performedAt).toLocaleString("vi-VN", {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      : "N/A";
  }
  
  // ============================================================
  // INVENTORY DATA - Đọc từ ACTION METADATA
  // ============================================================
  // ⚠️ CRITICAL: Đọc inventoryCheckSystemId từ actionMetadata, không dùng complaint.inventoryAdjustment
  const inventoryCheckSystemId = actionMetadata?.inventoryCheckSystemId;
  
  // ============================================================
  // COMPENSATION METADATA - Phiếu chi/thu (backward compatibility)
  // ============================================================
  const compensationMetadata = (complaint as any).compensationMetadata;
  
  // ============================================================
  // STATE - Subscribe directly to stores for real-time updates
  // ============================================================
  const payments = usePaymentStore(state => state.data);
  const receipts = useReceiptStore(state => state.data);
  const inventoryCheckStore = useInventoryCheckStore();
  const inventoryChecks = inventoryCheckStore.data;
  
  // ============================================================
  // PAYMENT/RECEIPT DATA - Find from store directly
  // ============================================================
  // ⚠️ CRITICAL: Lấy phiếu TỪ ACTION METADATA (paymentSystemId, receiptSystemId)
  // Đảm bảo mỗi card hiển thị đúng phiếu tại thời điểm action đó, kể cả đã bị hủy
  // Nếu không có metadata → Card chưa xử lý bù trừ
  const payment = actionMetadata?.paymentSystemId 
    ? payments.find(p => p.systemId === actionMetadata.paymentSystemId)
    : null;
  const receipt = actionMetadata?.receiptSystemId
    ? receipts.find(r => r.systemId === actionMetadata.receiptSystemId)
    : null;
  const inventoryCheck = inventoryCheckSystemId && Array.isArray(inventoryChecks)
    ? inventoryChecks.find(ic => ic.systemId === inventoryCheckSystemId)
    : null;
  
  // Debug
  console.log('[CompensationSection] Data check:', {
    paymentsCount: payments?.length,
    receiptsCount: receipts?.length,
    inventoryChecksCount: Array.isArray(inventoryChecks) ? inventoryChecks.length : 'not array',
    inventoryCheckSystemId,
    foundInventoryCheck: !!inventoryCheck,
  });
  
  // Check if this action has been processed (has payment/receipt)
  const hasBeenProcessed = !!actionMetadata?.paymentSystemId || !!actionMetadata?.receiptSystemId;
  
  const cancelledHistory = (complaint as any).cancelledPaymentsReceipts || [];
  
  // Debug payment/receipt loading
  console.log('[CompensationSection] Payment/Receipt:', {
    actionMetadata,
    hasBeenProcessed,
    paymentSystemId: actionMetadata?.paymentSystemId,
    receiptSystemId: actionMetadata?.receiptSystemId,
    foundPayment: !!payment,
    foundReceipt: !!receipt,
    totalPayments: payments.length,
    totalReceipts: receipts.length,
    paymentId: payment?.id,
    receiptId: receipt?.id,
  });
  
  // ============================================================
  // BADGE STATE - Đã hủy
  // ============================================================
  // Badge "Đã hủy" hiển thị khi phiếu có status = 'cancelled'
  const hasBeenCancelled = 
    payment?.status === 'cancelled' || 
    receipt?.status === 'cancelled' ||
    inventoryCheck?.status === 'cancelled';
  
  // Debug
  console.log('[CompensationSection] Badge check:', {
    hasBeenProcessed,
    hasBeenCancelled,
    paymentExists: !!payment,
    receiptExists: !!receipt,
    paymentStatus: payment?.status,
    receiptStatus: receipt?.status,
    paymentId: payment?.id,
    receiptId: receipt?.id,
    actionMetadata,
  });
  
  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-4 pt-4 border-t">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="compensation" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="text-left flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">Đã xác nhận đúng - {compensationDateTime}</span>
                  {hasBeenCancelled && (
                    <Badge variant="destructive" className="text-xs">
                      Đã hủy
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Ghi chú: {verificationNote || "Xác nhận đúng"}
                </div>
              </div>
            </div>
          </AccordionTrigger>
          
          <AccordionContent>
            {!hasBeenProcessed ? (
              // Chưa xử lý bù trừ
              <div className="pt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Chưa xử lý bù trừ. Vui lòng bấm nút "Xử lý bù trừ" hoặc "Xử lý tồn kho" ở trên.
                </p>
              </div>
            ) : (
              // Đã xử lý - Hiển thị phiếu
            <div className="space-y-4 pt-4">
              {/* Phiếu chi */}
              {payment && (
                <div 
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    payment.status === 'cancelled' 
                      ? 'bg-muted/50 opacity-60' 
                      : 'bg-card hover:bg-accent'
                  } transition-colors cursor-pointer`}
                  onClick={() => navigate(`/payments/${payment.systemId}`)}
                >
                  <div className="flex items-center gap-2 flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm text-muted-foreground ${payment.status === 'cancelled' ? 'line-through' : ''}`}>
                        Phiếu chi:
                      </span>
                      <span className={`text-sm text-primary hover:underline font-medium ${payment.status === 'cancelled' ? 'line-through' : ''}`}>
                        {payment.id}
                      </span>
                      {payment.status === 'cancelled' && (
                        <Badge variant="secondary" className="text-xs">
                          Đã hủy
                        </Badge>
                      )}
                    </div>
                    {payment.status === 'cancelled' && payment.cancelledAt && (
                      <span className="text-xs text-muted-foreground">
                        Hủy lúc: {new Date(payment.cancelledAt).toLocaleString('vi-VN')}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${payment.status === 'cancelled' ? 'text-muted-foreground line-through' : 'text-destructive'}`}>
                    -{payment.amount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              )}
              
              {/* Phiếu thu */}
              {receipt && (
                <div 
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    receipt.status === 'cancelled' 
                      ? 'bg-muted/50 opacity-60' 
                      : 'bg-card hover:bg-accent'
                  } transition-colors cursor-pointer`}
                  onClick={() => navigate(`/receipts/${receipt.systemId}`)}
                >
                  <div className="flex items-center gap-2 flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm text-muted-foreground ${receipt.status === 'cancelled' ? 'line-through' : ''}`}>
                        Phiếu thu:
                      </span>
                      <span className={`text-sm text-primary hover:underline font-medium ${receipt.status === 'cancelled' ? 'line-through' : ''}`}>
                        {receipt.id}
                      </span>
                      {receipt.status === 'cancelled' && (
                        <Badge variant="secondary" className="text-xs">
                          Đã hủy
                        </Badge>
                      )}
                    </div>
                    {receipt.status === 'cancelled' && receipt.cancelledAt && (
                      <span className="text-xs text-muted-foreground">
                        Hủy lúc: {new Date(receipt.cancelledAt).toLocaleString('vi-VN')}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${receipt.status === 'cancelled' ? 'text-muted-foreground line-through' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    +{receipt.amount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              )}
              
              {/* Phiếu kiểm hàng */}
              {inventoryCheck && (
                <div className="space-y-2">
                  <div 
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      inventoryCheck.status === 'cancelled' 
                        ? 'bg-muted/50 opacity-60' 
                        : 'bg-card hover:bg-accent'
                    } transition-colors cursor-pointer`}
                    onClick={() => navigate(`/inventory-checks/${inventoryCheck.systemId}`)}
                  >
                    <div className="flex items-center gap-2 flex-col items-start">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm text-muted-foreground ${inventoryCheck.status === 'cancelled' ? 'line-through' : ''}`}>
                          Phiếu kiểm hàng:
                        </span>
                        <span className={`text-sm text-primary hover:underline font-medium ${inventoryCheck.status === 'cancelled' ? 'line-through' : ''}`}>
                          {inventoryCheck.id}
                        </span>
                        {inventoryCheck.status === 'cancelled' && (
                          <Badge variant="secondary" className="text-xs">
                            Đã hủy
                          </Badge>
                        )}
                      </div>
                      {inventoryCheck.status === 'cancelled' && inventoryCheck.cancelledAt && (
                        <span className="text-xs text-muted-foreground">
                          Hủy lúc: {new Date(inventoryCheck.cancelledAt).toLocaleString('vi-VN')}
                        </span>
                      )}
                    </div>
                    <div className={`text-sm font-medium ${inventoryCheck.status === 'cancelled' ? 'text-muted-foreground' : ''}`}>
                      {inventoryCheck.items?.map((item: any, idx: number) => (
                        <div key={idx} className={inventoryCheck.status === 'cancelled' ? 'line-through' : ''}>
                          {item.productName}: {item.difference > 0 ? '+' : ''}{item.difference}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
