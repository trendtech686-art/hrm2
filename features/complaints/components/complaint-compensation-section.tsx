'use client'

import React from "react";
import { useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Info } from "lucide-react";
import type { Complaint } from "../types";
import { useAllPayments } from "../../payments/hooks/use-all-payments";
import { useAllReceipts } from "../../receipts/hooks/use-all-receipts";
import { useAllInventoryChecks } from "../../inventory-checks/hooks/use-all-inventory-checks";
import { usePenaltiesByIds } from "../../settings/penalties/hooks/use-penalties";
import { formatDateTimeForDisplay } from "@/lib/date-utils";

interface Props {
  complaint: Complaint;
  actionTimestamp?: Date | string; // Neu co truyen timestamp cu the, dung cai do thay vi tim tu timeline
}

// Helper: check if penalty is cancelled (handles both Vietnamese and English status)
const isPenaltyCancelled = (status?: string) => 
  status === 'Đã hủy' || status?.toLowerCase() === 'cancelled';

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
  const router = useRouter();
  
  // Neu co actionTimestamp truyen vao (tu history), dung cai do
  // Nguoc lai tim action verified-correct dau tien
  let verificationNote = "";
  let compensationDateTime = "N/A";
  type ActionMetadataType = { paymentSystemId?: string; receiptSystemId?: string; inventoryCheckSystemId?: string; penaltySystemIds?: string[] };
  let actionMetadata: ActionMetadataType | null = null;
  
  if (actionTimestamp) {
    // Dung timestamp truyen vao
    compensationDateTime = new Date(actionTimestamp).toLocaleString("vi-VN", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    
    // Tim action tuong ung voi timestamp nay - ✅ Add null check
    const matchingAction = complaint.timeline?.find(
      a => a.actionType === 'verified-correct' && 
           new Date(a.performedAt).getTime() === new Date(actionTimestamp).getTime()
    );
    verificationNote = matchingAction?.note || "";
    actionMetadata = (matchingAction?.metadata ?? null) as ActionMetadataType | null;
  } else {
    // Tim action verified-correct dau tien (backward compatibility) - ✅ Add null check
    const firstVerifyAction = complaint.timeline?.find(a => a.actionType === "verified-correct");
    verificationNote = firstVerifyAction?.note || "";
    actionMetadata = (firstVerifyAction?.metadata ?? null) as ActionMetadataType | null;
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
  const _compensationMetadata = (complaint as unknown as { compensationMetadata?: unknown }).compensationMetadata;
  
  // ============================================================
  // STATE - Use React Query hooks for data fetching from DB
  // ============================================================
  const { data: payments = [] } = useAllPayments();
  const { data: receipts } = useAllReceipts();
  const { data: inventoryChecks = [] } = useAllInventoryChecks();
  const { data: allPenalties = [] } = usePenaltiesByIds(actionMetadata?.penaltySystemIds || []);
  
  // ============================================================
  // PAYMENT/RECEIPT/PENALTY DATA - Find from store directly
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

  // ⭐ Penalties fetched by IDs from action metadata (server-side)
  const penalties = allPenalties as Array<{ systemId: string; id: string; amount: number; penaltyTypeName?: string | null; employeeName?: string | null; status?: string }>;
  
  // Debug
  
  // Check if this action has been processed (has payment/receipt OR inventory check OR penalties)
  const hasBeenProcessed = !!actionMetadata?.paymentSystemId || !!actionMetadata?.receiptSystemId || !!actionMetadata?.inventoryCheckSystemId || (actionMetadata?.penaltySystemIds?.length ?? 0) > 0;
  
  const _cancelledHistory = complaint.cancelledPaymentsReceipts || [];
  
  // Debug payment/receipt loading
  
  // ============================================================
  // BADGE STATE - Đã hủy
  // ============================================================
  // Badge "Đã hủy" hiển thị khi phiếu có status = 'cancelled'
  // ⚠️ Inventory check status is Prisma enum (UPPERCASE), others may be lowercase
  const icStatus = inventoryCheck?.status?.toLowerCase();
  const hasBeenCancelled = 
    payment?.status === 'cancelled' || 
    receipt?.status === 'cancelled' ||
    icStatus === 'cancelled' ||
    penalties.some(p => p.status === 'Đã hủy' || p.status === 'cancelled');
  
  // Debug
  
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
                  <span className="text-sm font-medium">Đã xác nhận đúng - {compensationDateTime}</span>
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
                  onClick={() => router.push(`/payments/${payment.systemId}`)}
                >
                  <div className="flex gap-2 flex-col items-start">
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
                        Hủy lúc: {formatDateTimeForDisplay(payment.cancelledAt)}
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
                  onClick={() => router.push(`/receipts/${receipt.systemId}`)}
                >
                  <div className="flex gap-2 flex-col items-start">
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
                        Hủy lúc: {formatDateTimeForDisplay(receipt.cancelledAt)}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${receipt.status === 'cancelled' ? 'text-muted-foreground line-through' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    +{receipt.amount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              )}
              
              {/* Phiếu kiểm hàng */}
              {inventoryCheck && (() => {
                const icCancelled = inventoryCheck.status?.toLowerCase() === 'cancelled';
                const icBalanced = inventoryCheck.status?.toLowerCase() === 'balanced';
                return (
                <div className="space-y-2">
                  <div 
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      icCancelled 
                        ? 'bg-muted/50 opacity-60' 
                        : 'bg-card hover:bg-accent'
                    } transition-colors cursor-pointer`}
                    onClick={() => router.push(`/inventory-checks/${inventoryCheck.systemId}`)}
                  >
                    <div className="flex gap-2 flex-col items-start">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm text-muted-foreground ${icCancelled ? 'line-through' : ''}`}>
                          Phiếu kiểm hàng:
                        </span>
                        <span className={`text-sm text-primary hover:underline font-medium ${icCancelled ? 'line-through' : ''}`}>
                          {inventoryCheck.id}
                        </span>
                        {icCancelled && (
                          <Badge variant="secondary" className="text-xs">
                            Đã hủy
                          </Badge>
                        )}
                        {!icCancelled && !icBalanced && (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                            Cần cân bằng
                          </Badge>
                        )}
                        {inventoryCheck.items && inventoryCheck.items.length > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center" onClick={(e) => e.stopPropagation()}>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <div className="text-xs space-y-1">
                                  <p className="font-medium mb-1">Sản phẩm kiểm kê:</p>
                                  {inventoryCheck.items.map((item: { productName: string; difference: number }, idx: number) => (
                                    <div key={idx}>
                                      {item.productName}: <span className={item.difference > 0 ? 'text-green-600' : 'text-red-600'}>{item.difference > 0 ? '+' : ''}{item.difference}</span>
                                    </div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      {icCancelled && inventoryCheck.cancelledAt && (
                        <span className="text-xs text-muted-foreground">
                          Hủy lúc: {formatDateTimeForDisplay(inventoryCheck.cancelledAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                );
              })()}
              
              {/* Phiếu phạt */}
              {penalties.length > 0 && penalties.map((penalty) => {
                const penCancelled = isPenaltyCancelled(penalty.status);
                return (
                <div 
                  key={penalty.systemId}
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    penCancelled 
                      ? 'bg-muted/50 opacity-60' 
                      : 'bg-card hover:bg-accent'
                  } transition-colors cursor-pointer`}
                  onClick={() => router.push(`/penalties/${penalty.systemId}`)}
                >
                  <div className="flex gap-2 flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm text-muted-foreground ${penCancelled ? 'line-through' : ''}`}>
                        Phiếu phạt:
                      </span>
                      <span className={`text-sm text-primary hover:underline font-medium ${penCancelled ? 'line-through' : ''}`}>
                        {penalty.id}
                      </span>
                      {penalty.penaltyTypeName && (
                        <Badge variant="outline" className="text-xs">
                          {penalty.penaltyTypeName}
                        </Badge>
                      )}
                      {penCancelled && (
                        <Badge variant="secondary" className="text-xs">
                          Đã hủy
                        </Badge>
                      )}
                    </div>
                    {penalty.employeeName && (
                      <span className={`text-xs text-muted-foreground ${penCancelled ? 'line-through' : ''}`}>
                        NV: {penalty.employeeName}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${penCancelled ? 'text-muted-foreground line-through' : 'text-orange-600 dark:text-orange-400'}`}>
                    {Number(penalty.amount).toLocaleString('vi-VN')} đ
                  </span>
                </div>
                );
              })}
            </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
