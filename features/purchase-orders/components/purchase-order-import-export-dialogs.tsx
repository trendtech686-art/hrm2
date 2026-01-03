'use client'

import * as React from "react"
import type { PurchaseOrder } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { purchaseOrderImportExportConfig } from "../../../lib/import-export/configs/purchase-order.config";

// Type aliases
type ImportMode = 'insert-only' | 'update-only' | 'upsert';

interface ImportResultData {
  success: number;
  failed: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: Array<{ row: number; message: string }>;
}

interface PurchaseOrderImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingData: PurchaseOrder[];
  branches: Array<{ systemId: SystemId; name: string }>;
  onImport: (data: Partial<PurchaseOrder>[], mode: ImportMode, branchId?: string) => Promise<ImportResultData>;
  currentUser: { systemId: SystemId; name: string };
}

export function PurchaseOrderImportDialog({
  open,
  onOpenChange,
  existingData,
  branches,
  onImport,
  currentUser,
}: PurchaseOrderImportDialogProps) {
  return (
    <GenericImportDialogV2<PurchaseOrder>
      open={open}
      onOpenChange={onOpenChange}
      config={purchaseOrderImportExportConfig}
      branches={branches}
      existingData={existingData}
      onImport={onImport}
      currentUser={currentUser}
    />
  );
}

interface PurchaseOrderExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: PurchaseOrder[];
  filteredData: PurchaseOrder[];
  currentPageData: PurchaseOrder[];
  selectedData: PurchaseOrder[];
  currentUser: { systemId: SystemId; name: string };
}

export function PurchaseOrderExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: PurchaseOrderExportDialogProps) {
  return (
    <GenericExportDialogV2<PurchaseOrder>
      open={open}
      onOpenChange={onOpenChange}
      config={purchaseOrderImportExportConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
