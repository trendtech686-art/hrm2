'use client'

import * as React from "react"
import type { Order } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
// Since page.tsx uses dynamic(() => import(...)), all dependencies are lazy loaded
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { orderImportExportConfig, flattenOrdersForExport } from "../../../lib/import-export/configs/order.config";
import { sapoOrderImportConfig } from "../../../lib/import-export/configs/order-sapo.config";

// Re-export for external use
export { flattenOrdersForExport };

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

interface StoreContext {
  customerStore: { data: unknown[] | undefined };
  productStore: { data: unknown[] | undefined };
  branchStore: { data: unknown[] | undefined };
  employeeStore: { data: unknown[] | undefined };
}

interface OrderImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingData: Order[];
  onImport: (data: Partial<Order>[], mode: ImportMode, branchId?: string) => Promise<ImportResultData>;
  currentUser?: { systemId: SystemId; name: string };
  storeContext: StoreContext;
}

export function OrderImportDialog({
  open,
  onOpenChange,
  existingData,
  onImport,
  currentUser,
  storeContext,
}: OrderImportDialogProps) {
  const configWithStores = React.useMemo(() => ({
    ...orderImportExportConfig,
    storeContext,
  }), [storeContext]);

  return (
    <GenericImportDialogV2<Order>
      open={open}
      onOpenChange={onOpenChange}
      config={configWithStores}
      existingData={existingData}
      onImport={onImport}
      currentUser={currentUser}
    />
  );
}

interface OrderExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: Order[];
  filteredData: Order[];
  currentPageData: Order[];
  selectedData: Order[];
  currentUser: { systemId: SystemId; name: string };
}

export function OrderExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  currentUser,
}: OrderExportDialogProps) {
  return (
    <GenericExportDialogV2<Order>
      open={open}
      onOpenChange={onOpenChange}
      config={orderImportExportConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      currentUser={currentUser}
    />
  );
}

interface SapoOrderImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingData: Order[];
  onImport: (data: Partial<Order>[], mode: ImportMode, branchId?: string) => Promise<ImportResultData>;
  currentUser?: { systemId: SystemId; name: string };
  storeContext: StoreContext;
}

export function SapoOrderImportDialog({
  open,
  onOpenChange,
  existingData,
  onImport,
  currentUser,
  storeContext,
}: SapoOrderImportDialogProps) {
  const configWithStores = React.useMemo(() => ({
    ...sapoOrderImportConfig,
    storeContext,
  }), [storeContext]);

  return (
    <GenericImportDialogV2<Order>
      open={open}
      onOpenChange={onOpenChange}
      config={configWithStores}
      existingData={existingData}
      onImport={onImport}
      currentUser={currentUser}
    />
  );
}
