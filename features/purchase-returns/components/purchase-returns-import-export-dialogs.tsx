'use client'

import type { PurchaseReturn } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { purchaseReturnConfig } from "../../../lib/import-export/configs/purchase-return.config";

interface PurchaseReturnExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: PurchaseReturn[];
  filteredData: PurchaseReturn[];
  currentPageData: PurchaseReturn[];
  selectedData: PurchaseReturn[];
  currentUser: { systemId: SystemId; name: string };
}

export function PurchaseReturnExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: PurchaseReturnExportDialogProps) {
  return (
    <GenericExportDialogV2<PurchaseReturn>
      open={open}
      onOpenChange={onOpenChange}
      config={purchaseReturnConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
