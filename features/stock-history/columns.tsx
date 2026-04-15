import { formatDate } from '@/lib/date-utils';
import Link from 'next/link';
import type { StockHistoryEntry } from '@/lib/types/prisma-extended';
import type { ColumnDef } from '../../components/data-table/types';



export const getStockHistoryColumns = (): ColumnDef<StockHistoryEntry>[] => [
    { id: 'date', accessorKey: 'date', header: 'Ngày ghi nhận', cell: ({ row }) => formatDate(row.date), meta: { displayName: 'Ngày ghi nhận' } },
    { id: 'employeeName', accessorKey: 'employeeName', header: 'Nhân viên', cell: ({ row }) => row.employeeName, meta: { displayName: 'Nhân viên' } },
    { id: 'action', accessorKey: 'action', header: 'Thao tác', cell: ({ row }) => row.action, meta: { displayName: 'Thao tác' } },
    { 
      id: 'quantityChange', 
      accessorKey: 'quantityChange', 
      header: 'SL thay đổi', 
      cell: ({ row }) => {
        // StockHistory only records actual stock changes (nhập/xuất kho)
        // "Giữ" (committed) is not recorded here - only shown in "Có thể bán"
        if (row.quantityChange === 0) {
          return <span className="text-muted-foreground">0</span>;
        }
        return (
          <span className={row.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}>
            {row.quantityChange > 0 ? `+${row.quantityChange}` : row.quantityChange}
          </span>
        );
      }, 
      meta: { displayName: 'SL thay đổi' } 
    },
    // ✅ newStockLevel is the actual stock level stored in DB at the time of the entry
    { id: 'newStockLevel', accessorKey: 'newStockLevel', header: 'Tồn kho', cell: ({ row }) => <span className="font-semibold">{row.newStockLevel}</span>, meta: { displayName: 'Tồn kho' } },
    { 
      id: 'documentId', 
      accessorKey: 'documentId', 
      header: 'Mã chứng từ', 
      cell: ({ row }) => {
        const docId = row.documentId;
        const docSystemId = row.documentSystemId;

        // ✅ documentSystemId is resolved server-side by the stock history API
        // No need to load 6 full entity tables for client-side lookups
        if (docSystemId) {
          let linkPath: string | null = null;

          if (docId.startsWith('PO')) linkPath = `/purchase-orders/${docSystemId}`;
          else if (docId.startsWith('PNK') || docId.startsWith('NK')) linkPath = `/inventory-receipts/${docSystemId}`;
          else if (docId.startsWith('DH')) linkPath = `/orders/${docSystemId}`;
          else if (docId.startsWith('BH')) linkPath = `/warranty/${docSystemId}`;
          else if (docId.startsWith('PKK') || docId.startsWith('INVCHECK')) linkPath = `/inventory-checks/${docSystemId}`;
          else if (docId.startsWith('PCK')) linkPath = `/stock-transfers/${docSystemId}`;
          else if (docId.startsWith('TH')) linkPath = `/sales-returns/${docSystemId}`;

          if (linkPath) {
            return (
              <Link href={linkPath} className="font-medium text-primary hover:underline">
                {docId}
              </Link>
            );
          }
        }

        return <span className="font-medium">{docId}</span>;
      }, 
      meta: { displayName: 'Mã chứng từ' } 
    },
    { id: 'branch', accessorKey: 'branch', header: 'Chi nhánh', cell: ({ row }) => row.branch, meta: { displayName: 'Chi nhánh' } },
];
