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
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import type { Complaint } from "./types.ts";
import type { SystemId } from "@/lib/id-types";

interface ConfirmCorrectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint | null;
  onConfirm: (note: string, confirmedQuantities: Record<SystemId, number>) => void;
}

export function ConfirmCorrectDialog({
  open,
  onOpenChange,
  complaint,
  onConfirm,
}: ConfirmCorrectDialogProps) {
  const [confirmed, setConfirmed] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [confirmedQuantities, setConfirmedQuantities] = React.useState<Record<SystemId, number>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize confirmed quantities khi mở dialog
  React.useEffect(() => {
    if (open && complaint?.affectedProducts && complaint.affectedProducts.length > 0) {
      const initialQty: Record<SystemId, number> = {};
      complaint.affectedProducts.forEach(p => {
        const qty = p.issueType === 'excess' 
          ? p.quantityExcess 
          : p.issueType === 'missing'
          ? p.quantityMissing
          : p.issueType === 'defective'
          ? p.quantityDefective
          : 0;
        initialQty[p.productSystemId] = qty;
      });
      setConfirmedQuantities(initialQty);
    }
  }, [open, complaint]);

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    try {
      await onConfirm(note, confirmedQuantities);
      handleClose();
    } catch (error) {
      console.error('[CONFIRM-CORRECT-DIALOG] Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Don't close while submitting
    setNote("");
    setConfirmedQuantities({});
    setIsSubmitting(false);
    onOpenChange(false);
  };

  // Tính tổng số lượng xác nhận
  const totalConfirmed = React.useMemo(() => {
    return Object.values(confirmedQuantities).reduce((sum, qty) => sum + qty, 0);
  }, [confirmedQuantities]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Xác nhận khiếu nại đúng
          </DialogTitle>
          <DialogDescription>
            Xác nhận rằng khiếu nại này là hợp lệ và đúng sự thật. Vui lòng xác minh lại số lượng sản phẩm.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Products Table */}
          {complaint?.affectedProducts && complaint.affectedProducts.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Xác minh lại số lượng sản phẩm</Label>
              
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left font-medium">Sản phẩm</th>
                      <th className="p-3 text-center font-medium w-24">Loại</th>
                      <th className="p-3 text-center font-medium w-24">Báo</th>
                      <th className="p-3 text-center font-medium w-32">Thực tế</th>
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
                      
                      const confirmedQty = confirmedQuantities[item.productSystemId] ?? customerReported;
                      
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
                              value={confirmedQty}
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                setConfirmedQuantities(prev => ({
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

              {/* Summary */}
              <div className="p-3 rounded-lg border bg-primary/5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tổng số lượng xác nhận:</span>
                  <span className="text-lg font-bold text-primary">{totalConfirmed}</span>
                </div>
              </div>
            </div>
          )}

          {/* Ghi chú */}
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú xác minh (tùy chọn)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú về việc xác minh..."
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="h-9" onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button className="h-9" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
