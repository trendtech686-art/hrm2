'use client'

import type { CostAdjustment } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { costAdjustmentImportExportConfig } from "../../../lib/import-export/configs/cost-adjustment.config";

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

interface CostAdjustmentImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingData: CostAdjustment[];
  branches?: { systemId: string; name: string }[];
  onImport: (data: Partial<CostAdjustment>[], mode: ImportMode, branchId?: string) => Promise<ImportResultData>;
  currentUser?: { systemId: SystemId; name: string };
}

export function CostAdjustmentImportDialog({
  open,
  onOpenChange,
  existingData,
  branches,
  onImport,
  currentUser,
}: CostAdjustmentImportDialogProps) {
  return (
    <GenericImportDialogV2<CostAdjustment>
      open={open}
      onOpenChange={onOpenChange}
      config={costAdjustmentImportExportConfig}
      branches={branches}
      existingData={existingData}
      onImport={onImport}
      currentUser={currentUser}
    />
  );
}

interface CostAdjustmentExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: CostAdjustment[];
  filteredData: CostAdjustment[];
  currentPageData: CostAdjustment[];
  selectedData: CostAdjustment[];
  currentUser: { systemId: SystemId; name: string };
}

export function CostAdjustmentExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: CostAdjustmentExportDialogProps) {
  return (
    <GenericExportDialogV2<CostAdjustment>
      open={open}
      onOpenChange={onOpenChange}
      config={costAdjustmentImportExportConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
