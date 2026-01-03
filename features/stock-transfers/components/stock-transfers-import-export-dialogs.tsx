'use client'

import type { StockTransfer } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { stockTransferImportExportConfig } from "../../../lib/import-export/configs/stock-transfer.config";

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

interface StockTransferImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingData: StockTransfer[];
  branches?: { systemId: string; name: string }[];
  onImport: (data: Partial<StockTransfer>[], mode: ImportMode, branchId?: string) => Promise<ImportResultData>;
  currentUser?: { systemId: SystemId; name: string };
}

export function StockTransferImportDialog({
  open,
  onOpenChange,
  existingData,
  branches,
  onImport,
  currentUser,
}: StockTransferImportDialogProps) {
  return (
    <GenericImportDialogV2<StockTransfer>
      open={open}
      onOpenChange={onOpenChange}
      config={stockTransferImportExportConfig}
      branches={branches}
      existingData={existingData}
      onImport={onImport}
      currentUser={currentUser}
    />
  );
}

interface StockTransferExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: StockTransfer[];
  filteredData: StockTransfer[];
  currentPageData: StockTransfer[];
  selectedData: StockTransfer[];
  currentUser: { systemId: SystemId; name: string };
}

export function StockTransferExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: StockTransferExportDialogProps) {
  return (
    <GenericExportDialogV2<StockTransfer>
      open={open}
      onOpenChange={onOpenChange}
      config={stockTransferImportExportConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
