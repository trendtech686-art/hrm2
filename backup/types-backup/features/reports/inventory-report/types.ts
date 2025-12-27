export type InventoryReportRow = {
    systemId: string;
    productSystemId: string;
    productName: string;
    sku: string;
    branchName: string;
    branchSystemId: string;
    onHand: number;
    committed: number;
    available: number;
    inTransit: number;
    costPrice: number;
    isCombo: boolean;
    // Combo specific fields
    comboAvailable?: number; // Tồn kho ảo của combo tại chi nhánh
    bottleneckProducts?: string[]; // SP con đang giới hạn số lượng combo
};

export type ProductTypeFilter = 'all' | 'single' | 'combo';
