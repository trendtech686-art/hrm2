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
import { Package } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useProductImage } from "@/features/products/components/product-image";
import { useProductsByIds } from "@/features/products/hooks/use-products";
import type { Complaint } from "../types";
import type { SystemId } from "@/lib/id-types";

/** Row component — uses useProductImage hook per product */
function ProductCell({ item, product }: {
  item: { productSystemId: string; productId: string; productName: string };
  product?: { id?: string; thumbnailImage?: string; galleryImages?: string[]; images?: string[] } | null;
}) {
  const imageUrl = useProductImage(item.productSystemId, product);
  // Show real SKU from product DB, falling back to item.productId
  const displaySku = product?.id || item.productId;
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-9 shrink-0 rounded-md overflow-hidden border border-muted bg-muted/30 flex items-center justify-center">
        {imageUrl ? (
          <OptimizedImage src={imageUrl} alt={item.productName} className="w-full h-full object-cover" width={40} height={36} />
        ) : (
          <Package className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div>
        <div className="font-medium">{item.productName}</div>
        <div className="text-xs text-muted-foreground">{displaySku}</div>
      </div>
    </div>
  );
}

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

  // Batch-fetch product data (image + real SKU) for all affected products
  const productSystemIds = React.useMemo(
    () => (complaint?.affectedProducts || []).map(p => p.productSystemId).filter(Boolean),
    [complaint?.affectedProducts]
  );
  const { productsMap } = useProductsByIds(productSystemIds);

  // Initialize adjustments khi mở dialog - use unique key (productSystemId_index) to avoid conflicts
  React.useEffect(() => {
    if (open && complaint?.affectedProducts && complaint.affectedProducts.length > 0) {
      const initialAdj: Record<string, number> = {};
      complaint.affectedProducts.forEach((p, idx) => {
        // Use composite key to handle duplicate productSystemId
        const key = `${p.productSystemId || p.productId || 'unknown'}_${idx}`;
        initialAdj[key] = 0; // Mặc định 0
      });
      setInventoryAdjustments(initialAdj as Record<SystemId, number>);
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
      <DialogContent mobileFullScreen className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                      
                      // Use composite key to handle duplicate productSystemId
                      const itemKey = `${item.productSystemId || item.productId || 'unknown'}_${idx}`;
                      const adjustQty = inventoryAdjustments[itemKey as SystemId] ?? 0;
                      
                      return (
                        <tr key={itemKey} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <ProductCell item={item} product={productsMap.get(item.productSystemId)} />
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
                                  [itemKey]: value
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
                      .map(([compositeKey, qty]) => {
                        // compositeKey format: "productSystemId_index"
                        const idx = parseInt(compositeKey.split('_').pop() || '0', 10);
                        const product = complaint?.affectedProducts?.[idx];
                        const qtyDisplay = qty > 0 ? `+${qty}` : qty;
                        const color = qty > 0 ? 'text-green-600' : 'text-red-600';
                        const productName = product?.productName || product?.productId || compositeKey;
                        return (
                          <div key={compositeKey} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{productName}:</span>
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
