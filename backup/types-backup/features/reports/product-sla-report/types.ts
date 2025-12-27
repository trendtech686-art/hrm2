import type { SystemId } from '@/lib/id-types';

export type StockAlertReportRow = {
    systemId: string;
    productSystemId: SystemId;
    productName: string;
    sku: string;
    alertType: 'out_of_stock' | 'low_stock' | 'below_safety' | 'over_stock';
    alertLabel: string;
    severity: 'critical' | 'warning' | 'info';
    totalOnHand: number;
    totalAvailable: number;
    reorderLevel: number | null;
    safetyStock: number | null;
    maxStock: number | null;
    suggestedOrder: number;
    costPrice: number;
    unit: string;
    primarySupplierName?: string;
    lastPurchaseDate?: string;
};

export type StockAlertFilter = 'all' | 'out_of_stock' | 'low_stock' | 'below_safety' | 'over_stock';
