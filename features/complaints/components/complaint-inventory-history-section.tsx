import React from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { Complaint } from "../types.ts";

interface ComplaintInventoryHistorySectionProps {
  complaint: Complaint;
}

export const ComplaintInventoryHistorySection: React.FC<ComplaintInventoryHistorySectionProps> = ({ complaint }) => {
  const navigate = useNavigate();
  
  const inventoryHistory = (complaint as any).inventoryHistory || [];
  const cancelledPaymentsReceipts = (complaint as any).cancelledPaymentsReceipts || [];
  
  if (inventoryHistory.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      {inventoryHistory.map((entry: any, entryIdx: number) => {
        // Find matching cancelled payments/receipts for this event
        const eventPaymentsReceipts = cancelledPaymentsReceipts.filter((v: any) => {
          const cancelledDate = new Date(v.cancelledAt);
          const entryDate = new Date(entry.adjustedAt);
          // Match if cancelled within same minute
          return Math.abs(cancelledDate.getTime() - entryDate.getTime()) < 60000;
        });
        
        return (
          <Accordion key={entryIdx} type="single" collapsible className="w-full">
            <AccordionItem value={`event-${entryIdx}`} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <div className="text-sm font-medium">{entry.reason}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(entry.adjustedAt).toLocaleString('vi-VN')} • {entry.items.length} sản phẩm
                      {eventPaymentsReceipts.length > 0 && ` • ${eventPaymentsReceipts.length} phiếu`}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {/* Phiếu chi/thu */}
                  {eventPaymentsReceipts.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground">Phiếu chi/thu đã hủy</Label>
                      <div className="space-y-2">
                        {eventPaymentsReceipts.map((item: any, idx: number) => (
                          <div 
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-md border bg-card hover:bg-accent transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <a
                                  href={item.type === 'payment' ? `/payments/${item.paymentReceiptSystemId}` : `/receipts/${item.paymentReceiptSystemId}`}
                                  className="text-sm font-medium text-primary hover:underline truncate"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigate(item.type === 'payment' ? `/payments/${item.paymentReceiptSystemId}` : `/receipts/${item.paymentReceiptSystemId}`);
                                  }}
                                >
                                  {item.paymentReceiptId}
                                </a>
                                <Badge variant="outline" className="text-xs shrink-0">
                                  {item.type === 'payment' ? 'Phiếu chi' : 'Phiếu thu'}
                                </Badge>
                                <Badge variant="destructive" className="text-xs shrink-0">
                                  Đã hủy
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {item.cancelledReason}
                              </div>
                            </div>
                            <div className="text-sm font-semibold shrink-0 sm:text-right">
                              {item.amount.toLocaleString('vi-VN')} đ
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Điều chỉnh kho */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Điều chỉnh kho</Label>
                    <div className="space-y-2">
                      {entry.items.map((item: any, itemIdx: number) => (
                        <div
                          key={itemIdx}
                          className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent transition-colors gap-3"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <a
                              href={`/products/${item.productSystemId}`}
                              className="text-sm font-medium text-primary hover:underline truncate"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/products/${item.productSystemId}`);
                              }}
                            >
                              {item.productId || item.productSystemId}
                            </a>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-sm truncate">{item.productName || 'N/A'}</span>
                          </div>
                          <Badge 
                            variant={item.quantity > 0 ? "default" : "destructive"}
                            className="shrink-0 min-w-[50px] justify-center"
                          >
                            {item.quantity > 0 ? '+' : ''}{item.quantity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
};
