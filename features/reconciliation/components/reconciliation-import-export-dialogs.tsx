'use client'

import type { SystemId } from "../../../lib/id-types"
import type { ReconciliationItem } from "../page"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { reconciliationConfig } from "../../../lib/import-export/configs/reconciliation.config";

interface ReconciliationExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: ReconciliationItem[];
  filteredData: ReconciliationItem[];
  currentPageData: ReconciliationItem[];
  selectedData: ReconciliationItem[];
  currentUser: { systemId: SystemId; name: string };
}

export function ReconciliationExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: ReconciliationExportDialogProps) {
  return (
    <GenericExportDialogV2<ReconciliationItem>
      open={open}
      onOpenChange={onOpenChange}
      config={reconciliationConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
