export type StockLocation = {
    systemId: string;
    id: string; // user-facing id
    name: string; // e.g., "Kệ A, Tầng 1"
    branchSystemId: string; // ✅ Branch systemId
};
