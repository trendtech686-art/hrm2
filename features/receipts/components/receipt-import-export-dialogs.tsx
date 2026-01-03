'use client'

import * as React from "react";
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { receiptImportExportConfig } from "../../../lib/import-export/configs/receipt.config";
import type { Receipt } from '@/lib/types/prisma-extended';
import type { SystemId } from "../../../lib/id-types";

// Props for ReceiptImportDialog
interface ReceiptImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    branches: Array<{ systemId: SystemId; name: string }>;
    existingData: Receipt[];
    onImport: (
        importedData: Partial<Receipt>[],
        mode: 'insert-only' | 'update-only' | 'upsert',
        branchId?: string
    ) => Promise<{
        success: number;
        failed: number;
        inserted: number;
        updated: number;
        skipped: number;
        errors: Array<{ row: number; message: string }>;
    }>;
    currentUser: {
        name: string;
        systemId: SystemId;
    };
}

// Props for ReceiptExportDialog
interface ReceiptExportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    allData: Receipt[];
    filteredData: Receipt[];
    currentPageData: Receipt[];
    selectedData: Receipt[];
    currentUser: {
        name: string;
        systemId: SystemId;
    };
}

export function ReceiptImportDialog({
    open,
    onOpenChange,
    branches,
    existingData,
    onImport,
    currentUser,
}: ReceiptImportDialogProps) {
    return (
        <GenericImportDialogV2<Receipt>
            open={open}
            onOpenChange={onOpenChange}
            config={receiptImportExportConfig}
            branches={branches}
            existingData={existingData}
            onImport={onImport}
            currentUser={currentUser}
        />
    );
}

export function ReceiptExportDialog({
    open,
    onOpenChange,
    allData,
    filteredData,
    currentPageData,
    selectedData,
    currentUser,
}: ReceiptExportDialogProps) {
    return (
        <GenericExportDialogV2<Receipt>
            open={open}
            onOpenChange={onOpenChange}
            config={receiptImportExportConfig}
            allData={allData}
            filteredData={filteredData}
            currentPageData={currentPageData}
            selectedData={selectedData}
            currentUser={currentUser}
        />
    );
}
