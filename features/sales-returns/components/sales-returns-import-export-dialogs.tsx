'use client'

import type { SalesReturn } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { salesReturnConfig } from "../../../lib/import-export/configs/sales-return.config";

interface SalesReturnExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: SalesReturn[];
  filteredData: SalesReturn[];
  currentPageData: SalesReturn[];
  selectedData: SalesReturn[];
  currentUser: { systemId: SystemId; name: string };
}

export function SalesReturnExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: SalesReturnExportDialogProps) {
  return (
    <GenericExportDialogV2<SalesReturn>
      open={open}
      onOpenChange={onOpenChange}
      config={salesReturnConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
