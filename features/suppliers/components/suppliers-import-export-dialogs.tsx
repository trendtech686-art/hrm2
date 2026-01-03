'use client'

import type { Supplier } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { supplierImportExportConfig } from "../../../lib/import-export/configs/supplier.config";

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

interface SupplierImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingData: Supplier[];
  branches?: { systemId: string; name: string }[];
  onImport: (data: Partial<Supplier>[], mode: ImportMode, branchId?: string) => Promise<ImportResultData>;
  currentUser?: { systemId: SystemId; name: string };
}

export function SupplierImportDialog({
  open,
  onOpenChange,
  existingData,
  branches,
  onImport,
  currentUser,
}: SupplierImportDialogProps) {
  return (
    <GenericImportDialogV2<Supplier>
      open={open}
      onOpenChange={onOpenChange}
      config={supplierImportExportConfig}
      branches={branches}
      existingData={existingData}
      onImport={onImport}
      currentUser={currentUser}
    />
  );
}

interface SupplierExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: Supplier[];
  filteredData: Supplier[];
  currentPageData: Supplier[];
  selectedData: Supplier[];
  currentUser: { systemId: SystemId; name: string };
}

export function SupplierExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: SupplierExportDialogProps) {
  return (
    <GenericExportDialogV2<Supplier>
      open={open}
      onOpenChange={onOpenChange}
      config={supplierImportExportConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
