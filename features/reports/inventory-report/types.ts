export type InventoryReportRow = {
    systemId: string;
    productName: string;
    sku: string;
    branchName: string;
    onHand: number;
    committed: number;
    available: number;
    costPrice: number;
};
