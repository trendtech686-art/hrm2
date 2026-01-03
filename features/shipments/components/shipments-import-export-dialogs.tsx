'use client'

import type { ShipmentView } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { shipmentConfig } from "../../../lib/import-export/configs/shipment.config";

interface ShipmentExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: ShipmentView[];
  filteredData: ShipmentView[];
  currentPageData: ShipmentView[];
  selectedData: ShipmentView[];
  currentUser: { systemId: SystemId; name: string };
}

export function ShipmentExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: ShipmentExportDialogProps) {
  return (
    <GenericExportDialogV2<ShipmentView>
      open={open}
      onOpenChange={onOpenChange}
      config={shipmentConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
