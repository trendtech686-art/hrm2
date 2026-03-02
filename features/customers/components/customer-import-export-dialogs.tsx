'use client'

import type { Customer } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
// Since page.tsx uses dynamic(() => import(...)) for CustomerImportDialog/CustomerExportDialog,
// all these dependencies (including XLSX from dialogs and config) are lazy loaded
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { customerImportExportConfig } from "../../../lib/import-export/configs/customer.config";

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

interface CustomerImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branches: Array<{ systemId: string; name: string }>;
  existingData: Customer[];
  onImport: (data: Partial<Customer>[], mode: ImportMode, branchId?: string) => Promise<ImportResultData>;
  currentUser?: { systemId: SystemId; name: string };
}

export function CustomerImportDialog({
  open,
  onOpenChange,
  branches,
  existingData,
  onImport,
  currentUser,
}: CustomerImportDialogProps) {
  return (
    <GenericImportDialogV2<Customer>
      open={open}
      onOpenChange={onOpenChange}
      config={customerImportExportConfig}
      branches={branches}
      existingData={existingData}
      onImport={onImport}
      currentUser={currentUser}
      showAddressLevelOption={true}
    />
  );
}

interface CustomerExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: Customer[];
  filteredData: Customer[];
  currentPageData: Customer[];
  selectedData: Customer[];
  currentUser: { systemId: SystemId; name: string };
}

export function CustomerExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: CustomerExportDialogProps) {
  return (
    <GenericExportDialogV2<Customer>
      open={open}
      onOpenChange={onOpenChange}
      config={customerImportExportConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
