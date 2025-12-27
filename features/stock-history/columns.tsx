import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import Link from 'next/link';
import type { StockHistoryEntry } from '@/lib/types/prisma-extended';
import type { ColumnDef } from '../../components/data-table/types';
import type { PurchaseOrder } from '../purchase-orders/types';
import type { InventoryReceipt } from '../inventory-receipts/types';
import type { Order } from '../orders/types';
import type { WarrantyTicket } from '../warranty/types';
import type { InventoryCheck } from '../inventory-checks/types';
import type { StockTransfer } from '../stock-transfers/types';



export const getStockHistoryColumns = (
    purchaseOrders: PurchaseOrder[],
    inventoryReceipts: InventoryReceipt[],
    orders: Order[],
    warranties: WarrantyTicket[] = [],
    inventoryChecks: InventoryCheck[] = [],
    stockTransfers: StockTransfer[] = [] // ✅ Add stock transfers parameter
): ColumnDef<StockHistoryEntry>[] => [
    { id: 'date', accessorKey: 'date', header: 'Ngày ghi nhận', cell: ({ row }) => formatDate(row.date), meta: { displayName: 'Ngày ghi nhận' } },
    { id: 'employeeName', accessorKey: 'employeeName', header: 'Nhân viên', cell: ({ row }) => row.employeeName, meta: { displayName: 'Nhân viên' } },
    { id: 'action', accessorKey: 'action', header: 'Thao tác', cell: ({ row }) => row.action, meta: { displayName: 'Thao tác' } },
    { id: 'quantityChange', accessorKey: 'quantityChange', header: 'SL thay đổi', cell: ({ row }) => <span className={row.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}>{row.quantityChange > 0 ? `+${row.quantityChange}` : row.quantityChange}</span>, meta: { displayName: 'SL thay đổi' } },
    { id: 'newStockLevel', accessorKey: 'newStockLevel', header: 'Tồn kho', cell: ({ row }) => <span className="font-semibold">{row.newStockLevel}</span>, meta: { displayName: 'Tồn kho' } },
    { 
      id: 'documentId', 
      accessorKey: 'documentId', 
      header: 'Mã chứng từ', 
      cell: ({ row }) => {
        const docId = row.documentId;
        let linkPath: string | null = null;

        if (docId.startsWith('PO')) {
            const po = purchaseOrders.find(p => p.id === docId);
            if (po) linkPath = `/purchase-orders/${po.systemId}`;
        } else if (docId.startsWith('PNK')) {
            const receipt = inventoryReceipts.find(r => r.id === docId);
            if (receipt) linkPath = `/inventory-receipts/${receipt.systemId}`;
        } else if (docId.startsWith('DH')) {
            const order = orders.find(o => o.id === docId);
            if (order) linkPath = `/orders/${order.systemId}`;
        } else if (docId.startsWith('BH')) {
            // ✅ Add warranty link support
            const warranty = warranties.find(w => w.id === docId);
            if (warranty) linkPath = `/warranty/${warranty.systemId}`;
        } else if (docId.startsWith('PKK')) {
            // ✅ Add inventory check link support
            const invCheck = inventoryChecks.find(ic => ic.id === docId);
            if (invCheck) linkPath = `/inventory-checks/${invCheck.systemId}`;
        } else if (docId.startsWith('PCK')) {
            // ✅ Add stock transfer link support
            const stockTransfer = stockTransfers.find(st => st.id === docId);
            if (stockTransfer) linkPath = `/stock-transfers/${stockTransfer.systemId}`;
        }
        
        if (linkPath) {
            return (
                <Link href={linkPath} className="font-medium text-primary hover:underline">
                    {docId}
                </Link>
            );
        }

        return <span className="font-medium">{docId}</span>;
      }, 
      meta: { displayName: 'Mã chứng từ' } 
    },
    { id: 'branch', accessorKey: 'branch', header: 'Chi nhánh', cell: ({ row }) => row.branch, meta: { displayName: 'Chi nhánh' } },
];
