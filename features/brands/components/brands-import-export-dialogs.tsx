'use client'

import type { Brand } from "../../settings/inventory/types"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { brandImportExportConfig } from "../../../lib/import-export/configs/brand.config";

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

interface BrandImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingData: Brand[];
  onImport: (data: Partial<Brand>[], mode: ImportMode) => Promise<ImportResultData>;
  currentUser?: { systemId: SystemId; name: string };
}

export function BrandImportDialog({
  open,
  onOpenChange,
  existingData,
  onImport,
  currentUser,
}: BrandImportDialogProps) {
  return (
    <GenericImportDialogV2<Brand>
      open={open}
      onOpenChange={onOpenChange}
      config={brandImportExportConfig}
      existingData={existingData}
      onImport={onImport}
      currentUser={currentUser}
    />
  );
}

interface BrandExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: Brand[];
  filteredData: Brand[];
  currentPageData: Brand[];
  selectedData: Brand[];
  currentUser: { systemId: SystemId; name: string };
}

export function BrandExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: BrandExportDialogProps) {
  return (
    <GenericExportDialogV2<Brand>
      open={open}
      onOpenChange={onOpenChange}
      config={brandImportExportConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
