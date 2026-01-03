'use client'

import type { PackagingSlip } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { packagingConfig } from "../../../lib/import-export/configs/packaging.config";

interface PackagingExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: PackagingSlip[];
  filteredData: PackagingSlip[];
  currentPageData: PackagingSlip[];
  selectedData: PackagingSlip[];
  currentUser: { systemId: SystemId; name: string };
}

export function PackagingExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: PackagingExportDialogProps) {
  return (
    <GenericExportDialogV2<PackagingSlip>
      open={open}
      onOpenChange={onOpenChange}
      config={packagingConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
