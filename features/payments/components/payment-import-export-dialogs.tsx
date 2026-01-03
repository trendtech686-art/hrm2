'use client'

import * as React from "react";
import { GenericImportDialogV2 } from "../../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../../components/shared/generic-export-dialog-v2";
import { paymentImportExportConfig } from "../../../lib/import-export/configs/payment.config";
import type { Payment } from '@/lib/types/prisma-extended';
import type { SystemId } from "../../../lib/id-types";

// Props for PaymentImportDialog
interface PaymentImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    branches: Array<{ systemId: SystemId; name: string }>;
    existingData: Payment[];
    onImport: (
        importedData: Partial<Payment>[],
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

// Props for PaymentExportDialog
interface PaymentExportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    allData: Payment[];
    filteredData: Payment[];
    currentPageData: Payment[];
    selectedData: Payment[];
    currentUser: {
        name: string;
        systemId: SystemId;
    };
}

export function PaymentImportDialog({
    open,
    onOpenChange,
    branches,
    existingData,
    onImport,
    currentUser,
}: PaymentImportDialogProps) {
    return (
        <GenericImportDialogV2<Payment>
            open={open}
            onOpenChange={onOpenChange}
            config={paymentImportExportConfig}
            branches={branches}
            existingData={existingData}
            onImport={onImport}
            currentUser={currentUser}
        />
    );
}

export function PaymentExportDialog({
    open,
    onOpenChange,
    allData,
    filteredData,
    currentPageData,
    selectedData,
    currentUser,
}: PaymentExportDialogProps) {
    return (
        <GenericExportDialogV2<Payment>
            open={open}
            onOpenChange={onOpenChange}
            config={paymentImportExportConfig}
            allData={allData}
            filteredData={filteredData}
            currentPageData={currentPageData}
            selectedData={selectedData}
            currentUser={currentUser}
        />
    );
}
