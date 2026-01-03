'use client'

import * as React from "react"
import type { Employee } from "@/lib/types/prisma-extended"
import type { SystemId } from "../../../lib/id-types"

// ✅ These imports are only loaded when this wrapper component is dynamically imported
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { employeeImportExportConfig } from "../../../lib/import-export/configs/employee.config";

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

interface EmployeeImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingData: Employee[];
  branches: Array<{ systemId: SystemId; name: string }>;
  requireBranch?: boolean;
  defaultBranchId?: SystemId;
  onImport: (data: Partial<Employee>[], mode: ImportMode, branchId?: string) => Promise<ImportResultData>;
  currentUser: { systemId: SystemId; name: string };
}

export function EmployeeImportDialog({
  open,
  onOpenChange,
  existingData,
  branches,
  requireBranch,
  defaultBranchId,
  onImport,
  currentUser,
}: EmployeeImportDialogProps) {
  return (
    <GenericImportDialogV2<Employee>
      open={open}
      onOpenChange={onOpenChange}
      config={employeeImportExportConfig}
      branches={branches}
      requireBranch={requireBranch}
      defaultBranchId={defaultBranchId}
      existingData={existingData}
      onImport={onImport}
      currentUser={currentUser}
    />
  );
}

interface AppliedFilters extends Record<string, unknown> {
  branch?: string;
  department?: string[];
  jobTitle?: string[];
  status?: string[];
  search?: string;
}

interface EmployeeExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: Employee[];
  filteredData: Employee[];
  currentPageData: Employee[];
  selectedData: Employee[];
  appliedFilters?: AppliedFilters;
  currentUser: { systemId: SystemId; name: string };
}

export function EmployeeExportDialog({
  open,
  onOpenChange,
  allData,
  filteredData,
  currentPageData,
  selectedData,
  appliedFilters,
  currentUser,
}: EmployeeExportDialogProps) {
  return (
    <GenericExportDialogV2<Employee>
      open={open}
      onOpenChange={onOpenChange}
      config={employeeImportExportConfig}
      allData={allData}
      filteredData={filteredData}
      currentPageData={currentPageData}
      selectedData={selectedData}
      appliedFilters={appliedFilters}
      currentUser={currentUser}
    />
  );
}
