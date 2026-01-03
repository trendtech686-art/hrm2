'use client'

import type { InventoryCheck } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { inventoryCheckImportExportConfig } from "../../../lib/import-export/configs/inventory-check.config";

// Type aliases matching GenericImportDialogV2 expectations
type ImportMode = 'insert-only' | 'update-only' | 'upsert';

interface ImportResultData {
  success: number;
  failed: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: Array<{ row: number; message: string }>;
}

interface InventoryCheckImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingData: InventoryCheck[];
  branches?: { systemId: string; name: string }[];
  onImport: (data: Partial<InventoryCheck>[], mode: ImportMode, branchId?: string) => Promise<ImportResultData>;
  currentUser?: { systemId: SystemId; name: string };
}

export function InventoryCheckImportDialog({
  open,
  onOpenChange,
  existingData,
  branches,
  onImport,
  currentUser,
}: InventoryCheckImportDialogProps) {
  return (
    <GenericImportDialogV2<InventoryCheck>
      open={open}
      onOpenChange={onOpenChange}
      config={inventoryCheckImportExportConfig}
      branches={branches}
      existingData={existingData}
      onImport={onImport}
      currentUser={currentUser}
    />
  );
}

interface InventoryCheckExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: InventoryCheck[];
  filteredData: InventoryCheck[];
  currentPageData: InventoryCheck[];
  selectedData: InventoryCheck[];
  currentUser: { systemId: SystemId; name: string };
}

export function InventoryCheckExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: InventoryCheckExportDialogProps) {
  return (
    <GenericExportDialogV2<InventoryCheck>
      open={open}
      onOpenChange={onOpenChange}
      config={inventoryCheckImportExportConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
