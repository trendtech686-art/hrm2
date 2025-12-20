import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { SupplierCombobox } from "./supplier-combobox";
import { useSupplierStore } from "../../suppliers/store";
import { usePurchaseOrderStore } from "../store";
import { usePurchaseReturnStore } from "../../purchase-returns/store";
import { Separator } from "../../../components/ui/separator";
import { X } from "lucide-react";
import type { SystemId } from "@/lib/id-types";

interface SupplierSelectionCardProps {
  value?: SystemId | undefined;
  onChange: (supplierId: SystemId | null) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export function SupplierSelectionCard({
  value,
  onChange,
}: SupplierSelectionCardProps) {
  const { findById } = useSupplierStore();
  const { data: purchaseOrders } = usePurchaseOrderStore();
  const { data: purchaseReturns } = usePurchaseReturnStore();

  console.log('SupplierSelectionCard - value:', value);

  const selectedSupplier = value ? findById(value) : null;

  console.log('SupplierSelectionCard - selectedSupplier:', selectedSupplier);

  // Calculate supplier statistics
  const supplierStats = React.useMemo(() => {
    if (!selectedSupplier) {
      return { debt: 0, totalPurchase: 0, totalReturn: 0 };
    }

    // Calculate total purchase orders
    const supplierPOs = purchaseOrders.filter(
      (po) => po.supplierSystemId === selectedSupplier.systemId
    );
    const totalPurchase = supplierPOs.reduce((sum, po) => sum + po.grandTotal, 0);
    const totalPaid = supplierPOs.reduce(
      (sum, po) => sum + po.payments.reduce((pSum, p) => pSum + p.amount, 0),
      0
    );

    // Calculate total returns
    const supplierReturns = purchaseReturns.filter(
      (pr) => pr.supplierSystemId === selectedSupplier.systemId
    );
    const totalReturn = supplierReturns.reduce((sum, pr) => sum + pr.totalReturnValue, 0);

    // Debt = Total Purchase - Total Paid
    const debt = totalPurchase - totalPaid;

    return { debt, totalPurchase, totalReturn };
  }, [selectedSupplier, purchaseOrders, purchaseReturns]);

  const handleClear = () => {
    onChange(null);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-base">Thông tin nhà cung cấp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 overflow-y-auto">
        {!selectedSupplier ? (
          // Show combobox when no supplier selected
          <div className="space-y-2">
            <Label>Tìm kiếm nhà cung cấp</Label>
            <SupplierCombobox
              value={value}
              onValueChange={onChange}
              placeholder="Tìm theo tên, SĐT, mã nhà cung cấp... (F4)"
            />
          </div>
        ) : (
          // Show selected supplier info with X button
          <>
            <div className="flex items-start justify-between gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-primary">
                    {selectedSupplier.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-6 w-6 p-0 hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
                {selectedSupplier.address && (
                  <p className="text-sm text-muted-foreground">
                    Địa chỉ: {selectedSupplier.address}
                  </p>
                )}
                {selectedSupplier.phone && (
                  <p className="text-sm text-muted-foreground">
                    SĐT: {selectedSupplier.phone}
                  </p>
                )}
              </div>
            </div>

            <Separator />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Nợ hiện tại</p>
                <p className="text-sm font-semibold text-destructive">
                  {formatCurrency(supplierStats.debt)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Tổng đơn nhập</p>
                <p className="text-sm font-semibold">
                  {formatCurrency(supplierStats.totalPurchase)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Trả hàng</p>
                <p className="text-sm font-semibold text-orange-600">
                  {formatCurrency(supplierStats.totalReturn)}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
