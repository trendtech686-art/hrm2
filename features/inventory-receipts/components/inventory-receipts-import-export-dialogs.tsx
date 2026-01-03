'use client'

import type { InventoryReceipt } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { inventoryReceiptConfig } from "../../../lib/import-export/configs/inventory-receipt.config";

interface InventoryReceiptExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: InventoryReceipt[];
  filteredData: InventoryReceipt[];
  currentPageData: InventoryReceipt[];
  selectedData: InventoryReceipt[];
  currentUser: { systemId: SystemId; name: string };
}

export function InventoryReceiptExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: InventoryReceiptExportDialogProps) {
  return (
    <GenericExportDialogV2<InventoryReceipt>
      open={open}
      onOpenChange={onOpenChange}
      config={inventoryReceiptConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
