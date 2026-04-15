import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { SupplierCombobox } from "./supplier-combobox";
import { useSupplierFinder } from "../../suppliers/hooks/use-all-suppliers";
import { useSupplierStats } from "../../suppliers/hooks/use-supplier-stats";
import { SupplierStatsSection } from "../../suppliers/components/supplier-stats-section";
import { X } from "lucide-react";
import type { SystemId } from "@/lib/id-types";

interface SupplierSelectionCardProps {
  value?: SystemId | undefined;
  onChange: (supplierId: SystemId | null) => void;
}

export function SupplierSelectionCard({
  value,
  onChange,
}: SupplierSelectionCardProps) {
  const { findById } = useSupplierFinder();
  // ⚡ OPTIMIZED: Use server-calculated stats instead of loading all POs
  const { data: stats } = useSupplierStats(value);


  const selectedSupplier = value ? findById(value) : null;


  const handleClear = () => {
    onChange(null);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="shrink-0 py-3">
        <CardTitle size="sm">Thông tin nhà cung cấp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 overflow-y-auto pt-0">
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
            <div className="relative p-3 border rounded-lg">
              {/* X button at top-right corner */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-background border shadow-sm hover:bg-destructive/10"
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </Button>
              
              <div className="space-y-1 pr-4">
                <Link 
                  href={`/suppliers/${selectedSupplier.systemId}`}
                  className="font-semibold text-base text-primary hover:underline"
                >
                  {selectedSupplier.name}
                </Link>
                {selectedSupplier.phone && (
                  <p className="text-sm text-muted-foreground">
                    SĐT: {selectedSupplier.phone}
                  </p>
                )}
              </div>
            </div>

            {stats && (
              <SupplierStatsSection stats={stats} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
