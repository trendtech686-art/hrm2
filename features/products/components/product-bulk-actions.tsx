'use client'

import * as React from "react"
import type { LucideIcon } from "lucide-react";
import { 
  Printer, 
  Trash2, 
  Play, 
  StopCircle,
  RefreshCw, 
  FileText, 
  DollarSign, 
  PackageSearch, 
  Search, 
  Flag, 
  Image, 
  ExternalLink, 
  Unlink,
  Upload 
} from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types/prisma-extended"
import type { BulkSyncActionKey } from "../../settings/pkgx/hooks/use-pkgx-bulk-sync"

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

export interface BulkAction {
  label: string;
  icon: LucideIcon;
  variant?: 'default' | 'destructive';
  onSelect: (selectedRows: Product[]) => void;
}

interface CreateBulkActionsParams {
  handlePrintLabels: (products: Product[]) => void;
  bulkDelete: (systemIds: string[]) => void;
  bulkUpdateStatus: (params: { systemIds: string[]; status: string }) => void;
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

interface CreatePkgxBulkActionsParams {
  triggerBulkSync: (entities: Product[], action: BulkSyncActionKey) => void;
  update: (systemId: string, data: Partial<Product>) => void;
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

// ═══════════════════════════════════════════════════════════════
// Bulk Actions Factory
// ═══════════════════════════════════════════════════════════════

export function createBulkActions({
  handlePrintLabels,
  bulkDelete,
  bulkUpdateStatus,
  setRowSelection,
}: CreateBulkActionsParams): BulkAction[] {
  return [
    {
      label: "In tem phụ sản phẩm",
      icon: Printer,
      onSelect: (selectedRows: Product[]) => {
        handlePrintLabels(selectedRows);
        toast.success(`Đang in tem cho ${selectedRows.length} sản phẩm`);
      }
    },
    {
      label: "Chuyển vào thùng rác",
      icon: Trash2,
      onSelect: (selectedRows: Product[]) => {
        bulkDelete(selectedRows.map(p => p.systemId));
        setRowSelection({});
      }
    },
    {
      label: "Đang hoạt động",
      icon: Play,
      onSelect: (selectedRows: Product[]) => {
        bulkUpdateStatus({ systemIds: selectedRows.map(p => p.systemId), status: 'ACTIVE' });
        setRowSelection({});
      }
    },
    {
      label: "Ngừng kinh doanh",
      icon: StopCircle,
      onSelect: (selectedRows: Product[]) => {
        bulkUpdateStatus({ systemIds: selectedRows.map(p => p.systemId), status: 'INACTIVE' });
        setRowSelection({});
      }
    }
  ];
}

// ═══════════════════════════════════════════════════════════════
// PKGX Bulk Actions Factory
// ═══════════════════════════════════════════════════════════════

export function createPkgxBulkActions({
  triggerBulkSync,
  update,
  setRowSelection,
}: CreatePkgxBulkActionsParams): BulkAction[] {
  return [
    {
      label: "Đăng lên PKGX",
      icon: Upload,
      onSelect: (selectedRows: Product[]) => {
        const notLinkedProducts = selectedRows.filter(p => !p.pkgxId);
        if (notLinkedProducts.length === 0) {
          toast.info('Tất cả sản phẩm đã được liên kết PKGX');
          return;
        }
        triggerBulkSync(notLinkedProducts, 'publish');
      }
    },
    {
      label: "Đồng bộ tất cả",
      icon: RefreshCw,
      onSelect: (selectedRows: Product[]) => {
        triggerBulkSync(selectedRows, 'sync_all');
      }
    },
    {
      label: "Thông tin cơ bản",
      icon: FileText,
      onSelect: (selectedRows: Product[]) => {
        triggerBulkSync(selectedRows, 'sync_basic');
      }
    },
    {
      label: "Giá",
      icon: DollarSign,
      onSelect: (selectedRows: Product[]) => {
        triggerBulkSync(selectedRows, 'sync_price');
      }
    },
    {
      label: "Tồn kho",
      icon: PackageSearch,
      onSelect: (selectedRows: Product[]) => {
        triggerBulkSync(selectedRows, 'sync_inventory');
      }
    },
    {
      label: "SEO",
      icon: Search,
      onSelect: (selectedRows: Product[]) => {
        triggerBulkSync(selectedRows, 'sync_seo');
      }
    },
    {
      label: "Mô tả",
      icon: FileText,
      onSelect: (selectedRows: Product[]) => {
        triggerBulkSync(selectedRows, 'sync_description');
      }
    },
    {
      label: "Flags",
      icon: Flag,
      onSelect: (selectedRows: Product[]) => {
        triggerBulkSync(selectedRows, 'sync_flags');
      }
    },
    {
      label: "Hình ảnh",
      icon: Image,
      onSelect: (selectedRows: Product[]) => {
        triggerBulkSync(selectedRows, 'sync_images');
      }
    },
    {
      label: "Xem trên PKGX",
      icon: ExternalLink,
      onSelect: (selectedRows: Product[]) => {
        const linkedProducts = selectedRows.filter(p => p.pkgxId);
        if (linkedProducts.length === 0) {
          toast.error('Không có sản phẩm nào đã liên kết PKGX');
          return;
        }
        
        if (linkedProducts.length === 1) {
          window.open(`https://phukiengiaxuong.com.vn/admin/goods.php?act=edit_goods&goods_id=${linkedProducts[0].pkgxId}`, '_blank');
        } else {
          toast.info(`Đã chọn ${linkedProducts.length} sản phẩm. Vui lòng chọn 1 sản phẩm để xem.`);
        }
      }
    },
    {
      label: "Hủy liên kết",
      icon: Unlink,
      variant: 'destructive' as const,
      onSelect: async (selectedRows: Product[]) => {
        const linkedProducts = selectedRows.filter(p => p.pkgxId);
        if (linkedProducts.length === 0) {
          toast.error('Không có sản phẩm nào đã liên kết PKGX');
          return;
        }
        
        if (!confirm(`Bạn có chắc muốn hủy liên kết ${linkedProducts.length} sản phẩm với PKGX?`)) {
          return;
        }
        
        let successCount = 0;
        
        for (const product of linkedProducts) {
          try {
            update(product.systemId, { pkgxId: undefined });
            successCount++;
          } catch {
            // ignore
          }
        }
        
        setRowSelection({});
        toast.success(`Đã hủy liên kết ${successCount} sản phẩm với PKGX`);
      }
    },
  ];
}
