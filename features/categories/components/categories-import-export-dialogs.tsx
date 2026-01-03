'use client'

import type { ProductCategory } from "../../settings/inventory/types"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { categoryImportExportConfig } from "../../../lib/import-export/configs/category.config";

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

interface CategoryImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingData: ProductCategory[];
  onImport: (data: Partial<ProductCategory>[], mode: ImportMode) => Promise<ImportResultData>;
  currentUser?: { systemId: SystemId; name: string };
}

export function CategoryImportDialog({
  open,
  onOpenChange,
  existingData,
  onImport,
  currentUser,
}: CategoryImportDialogProps) {
  return (
    <GenericImportDialogV2<ProductCategory>
      open={open}
      onOpenChange={onOpenChange}
      config={categoryImportExportConfig}
      existingData={existingData}
      onImport={onImport}
      currentUser={currentUser}
    />
  );
}

interface CategoryExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: ProductCategory[];
  filteredData: ProductCategory[];
  currentPageData: ProductCategory[];
  selectedData: ProductCategory[];
  currentUser: { systemId: SystemId; name: string };
}

export function CategoryExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: CategoryExportDialogProps) {
  return (
    <GenericExportDialogV2<ProductCategory>
      open={open}
      onOpenChange={onOpenChange}
      config={categoryImportExportConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
