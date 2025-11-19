import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Complaint } from "./types.ts";
import type { SystemId } from "@/lib/id-types";

interface InventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint | null;
  onSubmit: (inventoryAdjustments: Record<SystemId, number>, reason: string) => void;
}

export function InventoryDialog({
  open,
  onOpenChange,
  complaint,
  onSubmit,
}: InventoryDialogProps) {
  const [inventoryAdjustments, setInventoryAdjustments] = React.useState<Record<SystemId, number>>({});
  const [reason, setReason] = React.useState("");

  // Initialize adjustments khi mở dialog
  React.useEffect(() => {
    if (open && complaint?.affectedProducts && complaint.affectedProducts.length > 0) {
      const initialAdj: Record<SystemId, number> = {};
      complaint.affectedProducts.forEach(p => {
        initialAdj[p.productSystemId] = 0; // Mặc định 0
      });
      setInventoryAdjustments(initialAdj);
    }
  }, [open, complaint]);

  const handleSubmit = () => {
    // Check if any adjustment is made
    const hasAdjustments = Object.values(inventoryAdjustments).some(qty => qty !== 0);
    
    if (!hasAdjustments) {
      toast.error("Vui lòng nhập số lượng điều chỉnh cho ít nhất 1 sản phẩm");
      return;
    }

    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do điều chỉnh kho");
      return;
    }

    onSubmit(inventoryAdjustments, reason);
    handleClose();
  };

  const handleClose = () => {
    setInventoryAdjustments({});
    setReason("");
    onOpenChange(false);
  };

  // Tính tổng điều chỉnh
  const totalAdjustment = React.useMemo(() => {
    return Object.values(inventoryAdjustments).reduce((sum, qty) => sum + Math.abs(qty), 0);
  }, [inventoryAdjustments]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Xử lý tồn kho
          </DialogTitle>
          <DialogDescription>
            Điều chỉnh số lượng tồn kho cho các sản phẩm bị ảnh hưởng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Products Table */}
          {complaint?.affectedProducts && complaint.affectedProducts.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sản phẩm cần điều chỉnh</Label>
              
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left font-medium">Sản phẩm</th>
                      <th className="p-3 text-center font-medium">Vấn đề</th>
                      <th className="p-3 text-center font-medium">SL báo</th>
                      <th className="p-3 text-center font-medium w-32">Điều chỉnh kho</th>
                      <th className="p-3 text-left font-medium">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {complaint.affectedProducts.map((item, idx) => {
                      const customerReported = item.issueType === 'excess' 
                        ? item.quantityExcess 
                        : item.issueType === 'missing'
                        ? item.quantityMissing
                        : item.issueType === 'defective'
                        ? item.quantityDefective
                        : 0;
                      
                      const issueLabel = {
                        excess: 'Thừa',
                        missing: 'Thiếu', 
                        defective: 'Hỏng',
                        other: 'Khác'
                      }[item.issueType] || item.issueType;
                      
                      const adjustQty = inventoryAdjustments[item.productSystemId] ?? 0;
                      
                      return (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-xs text-muted-foreground">{item.productId}</div>
                          </td>
                          <td className="p-3 text-center">
                            <span className="text-xs px-2 py-1 rounded-md bg-muted">
                              {issueLabel}
                            </span>
                          </td>
                          <td className="p-3 text-center text-muted-foreground font-medium">
                            {customerReported || 0}
                          </td>
                          <td className="p-3">
                            <Input
                              type="number"
                              className="h-9 text-center font-medium"
                              value={adjustQty}
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                setInventoryAdjustments(prev => ({
                                  ...prev,
                                  [item.productSystemId]: value
                                }));
                              }}
                              placeholder="0"
                            />
                          </td>
                          <td className="p-3 text-xs text-muted-foreground">
                            {item.note || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Help text */}
              <div className="flex items-start gap-2 p-3 rounded-lg border bg-muted/50">
                <div className="text-xs space-y-1">
                  <p className="font-medium">Cách nhập:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                    <li>Số dương (+): Cộng vào kho (ví dụ: 5 = cộng 5)</li>
                    <li>Số âm (-): Trừ khỏi kho (ví dụ: -3 = trừ 3)</li>
                    <li>Số 0: Không điều chỉnh</li>
                  </ul>
                </div>
              </div>

              {/* Summary */}
              {totalAdjustment > 0 && (
                <div className="p-3 rounded-lg border bg-primary/5 space-y-2">
                  <p className="text-sm font-medium">Chi tiết điều chỉnh:</p>
                  <div className="space-y-1">
                    {Object.entries(inventoryAdjustments)
                      .filter(([_, qty]) => qty !== 0)
                      .map(([productId, qty]) => {
                        const product = complaint?.affectedProducts?.find(p => p.productSystemId === productId);
                        const qtyDisplay = qty > 0 ? `+${qty}` : qty;
                        const color = qty > 0 ? 'text-green-600' : 'text-red-600';
                        return (
                          <div key={productId} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{product?.productName || productId}:</span>
                            <span className={`font-semibold ${color}`}>{qtyDisplay}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="flex items-center gap-2">
              Lý do điều chỉnh
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do điều chỉnh tồn kho..."
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            Xác nhận điều chỉnh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
