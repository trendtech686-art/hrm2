'use client'

import type { Product } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
// Since page.tsx uses dynamic(() => import(...)) for ProductImportDialog/ProductExportDialog,
// all these dependencies (including XLSX from dialogs and 1211-line config) are lazy loaded
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { productImportExportConfig } from "../../../lib/import-export/configs/product.config";

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

interface ProductImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingData: Product[];
  onImport: (data: Partial<Product>[], mode: ImportMode, branchId?: string) => Promise<ImportResultData>;
  currentUser?: { systemId: SystemId; name: string };
}

export function ProductImportDialog({
  open,
  onOpenChange,
  existingData,
  onImport,
  currentUser,
}: ProductImportDialogProps) {
  return (
    <GenericImportDialogV2<Product>
      open={open}
      onOpenChange={onOpenChange}
      config={productImportExportConfig}
      existingData={existingData}
      onImport={onImport}
      currentUser={currentUser}
    />
  );
}

interface ProductExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: Product[];
  filteredData: Product[];
  currentPageData: Product[];
  selectedData: Product[];
  currentUser: { systemId: SystemId; name: string };
}

export function ProductExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: ProductExportDialogProps) {
  return (
    <GenericExportDialogV2<Product>
      open={open}
      onOpenChange={onOpenChange}
      config={productImportExportConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}
