import { getCurrentDate, toISODateTime } from '../../../lib/date-utils';
import { useProductStore } from '../../products/store';
import { useStockHistoryStore } from '../../stock-history/store';
import { toast } from 'sonner';
import type { WarrantyTicket } from '../types';
import { getCurrentUserName } from './base-store';
import { asSystemId, type SystemId } from '../../../lib/id-types';

/**
 * Commit stock khi tạo warranty (reserve hàng cho đổi mới)
 * Reuse productStore.commitStock()
 */
export function commitWarrantyStock(ticket: WarrantyTicket) {
  const replaceProducts = ticket.products.filter(p => p.resolution === 'replace');
  
  if (replaceProducts.length > 0) {
    const productStore = useProductStore.getState();
    const productCache = new Map<string, { id: string; systemId: string; name: string; [key: string]: unknown }>();
    productStore.data.forEach(p => productCache.set(p.id, p));
    
    replaceProducts.forEach(warrantyProduct => {
      if (!warrantyProduct.sku) {
        return;
      }
      
      const product = productCache.get(warrantyProduct.sku);
      
      if (!product) {
        return;
      }
      
      const quantityToCommit = warrantyProduct.quantity || 1;
      
      // Reuse productStore.commitStock()
      productStore.commitStock(product.systemId as SystemId, ticket.branchSystemId, quantityToCommit);
      
    });
  }
}

/**
 * Uncommit stock khi xóa warranty (giải phóng hàng giữ chỗ)
 * Reuse productStore.uncommitStock()
 */
export function uncommitWarrantyStock(ticket: WarrantyTicket, options?: { silent?: boolean }) {
  const replaceProducts = ticket.products.filter(p => p.resolution === 'replace');
  
  if (replaceProducts.length > 0) {
    const productStore = useProductStore.getState();
    const productCache = new Map<string, { id: string; systemId: string; name: string; [key: string]: unknown }>();
    productStore.data.forEach(p => productCache.set(p.id, p));
    
    replaceProducts.forEach(warrantyProduct => {
      if (!warrantyProduct.sku) return;
      
      const product = productCache.get(warrantyProduct.sku);
      
      if (product) {
      const quantityToUncommit = warrantyProduct.quantity || 1;
      
      // Reuse productStore.uncommitStock()
      productStore.uncommitStock(product.systemId as SystemId, ticket.branchSystemId, quantityToUncommit);              }
    });
    
    if (!options?.silent) {
      toast.info('Đã giải phóng hàng giữ chỗ', {
        description: `${replaceProducts.length} sản phẩm đã được trả lại kho có thể bán`,
        duration: 3000
      });
    }
  }
}

/**
 * Xuất kho khi 'completed' - Dùng dispatchStock giống đơn hàng
 * NEW LOGIC: Bước 4 - Kết thúc
 */
export function deductWarrantyStock(ticket: WarrantyTicket) {
  
  const replacedProducts = ticket.products.filter(p => p.resolution === 'replace');
  
  if (replacedProducts.length > 0) {
    const productStore = useProductStore.getState();
    const stockHistoryStore = useStockHistoryStore.getState();
    const productCache = new Map<string, { id: string; systemId: string; name: string; inventoryByBranch: Record<string, number>; [key: string]: unknown }>();
    productStore.data.forEach(p => productCache.set(p.id, p));
    
    const deductionResults: string[] = [];
    let hasErrors = false;
    
    replacedProducts.forEach(warrantyProduct => {
      if (!warrantyProduct.sku) {
        deductionResults.push(`Sản phẩm "${warrantyProduct.productName}" không có SKU`);
        hasErrors = true;
        return;
      }
      
      const product = productCache.get(warrantyProduct.sku);
      
      if (!product) {
        deductionResults.push(`Không tìm thấy SP SKU: ${warrantyProduct.sku}`);
        hasErrors = true;
        return;
      }
      
      const currentInventory = product.inventoryByBranch[ticket.branchSystemId] || 0;
      const quantityToDeduct = warrantyProduct.quantity || 1;
      
      
      if (currentInventory < quantityToDeduct) {
        deductionResults.push(`${product.name} (${product.id}): Không đủ hàng (Tồn: ${currentInventory}, Cần: ${quantityToDeduct})`);
        hasErrors = true;
        return;
      }
      
      // ✅ Xuất kho trực tiếp (không dùng dispatchStock vì warranty không có inTransit)
      // -Tồn kho
      productStore.updateInventory(product.systemId as SystemId, ticket.branchSystemId, -quantityToDeduct);
      // -Đang giao dịch (uncommit)
      productStore.uncommitStock(product.systemId as SystemId, ticket.branchSystemId, quantityToDeduct);
      
      // ✅ Lấy lại product sau khi update
      const freshProductStore = useProductStore.getState();
      const updatedProduct = freshProductStore.data.find(p => p.systemId === product.systemId);
      const newStockLevel = updatedProduct?.inventoryByBranch[ticket.branchSystemId] || currentInventory - quantityToDeduct;
      
      
      stockHistoryStore.addEntry({
        productId: asSystemId(product.systemId),
        date: toISODateTime(getCurrentDate()),
        employeeName: getCurrentUserName(),
        action: 'Xuất bảo hành (đổi mới)',
        quantityChange: -quantityToDeduct,
        newStockLevel,
        documentId: ticket.id, // Business ID for display (BH000001)
        branchSystemId: ticket.branchSystemId,
        branch: ticket.branchName,
      });
      
      deductionResults.push(`${product.name} (${product.id}): Trừ ${quantityToDeduct} cái (Còn: ${newStockLevel})`);
    });
    
    if (hasErrors) {
      toast.error('Có lỗi khi xuất kho', {
        description: deductionResults.join('\n'),
        duration: 6000,
      });
    } else {
      toast.success('Đã xuất kho sản phẩm thay thế', {
        description: `Xuất ${replacedProducts.length} sản phẩm tại chi nhánh ${ticket.branchName}`,
        duration: 4000,
      });
    }
  }
}

/**
 * Hoàn kho khi hủy warranty - Ngược lại với dispatchStock
 * NEW LOGIC: +Tồn kho + +Đang giao dịch
 */
export function rollbackWarrantyStock(ticket: WarrantyTicket) {
  
  const replacedProducts = ticket.products.filter(p => p.resolution === 'replace');
  
  if (replacedProducts.length > 0) {
    const productStore = useProductStore.getState();
    const stockHistoryStore = useStockHistoryStore.getState();
    const productCache = new Map<string, { id: string; systemId: string; name: string; inventoryByBranch: Record<string, number>; [key: string]: unknown }>();
    productStore.data.forEach(p => productCache.set(p.id, p));
    
    const rollbackResults: string[] = [];
    
    replacedProducts.forEach(warrantyProduct => {
      if (!warrantyProduct.sku) {
        rollbackResults.push(`Sản phẩm "${warrantyProduct.productName}" không có SKU`);
        return;
      }
      
      const product = productCache.get(warrantyProduct.sku);
      
      if (!product) {
        rollbackResults.push(`Không tìm thấy SP SKU: ${warrantyProduct.sku}`);
        return;
      }
      
      const quantityToRollback = warrantyProduct.quantity || 1;
      const currentInventory = product.inventoryByBranch[ticket.branchSystemId] || 0;
      
      
      // ✅ Hoàn kho: +Tồn kho (warranty xuất trực tiếp, không qua inTransit)
      productStore.updateInventory(product.systemId as SystemId, ticket.branchSystemId, quantityToRollback);
      
      // ✅ Lấy lại product sau khi update để có inventory mới
      const freshProductStore = useProductStore.getState();
      const updatedProduct = freshProductStore.data.find(p => p.systemId === product.systemId);
      const newStockLevel = updatedProduct?.inventoryByBranch[ticket.branchSystemId] || currentInventory + quantityToRollback;
      
      
      // Note: Không cần uncommit vì khi deduct đã uncommit rồi
      
      stockHistoryStore.addEntry({
        productId: asSystemId(product.systemId),
        date: toISODateTime(getCurrentDate()),
        employeeName: getCurrentUserName(),
        action: 'Hoàn kho (Hủy bảo hành)',
        quantityChange: quantityToRollback,
        newStockLevel,
        documentId: ticket.id,
        branchSystemId: ticket.branchSystemId,
        branch: ticket.branchName,
      });
      
      rollbackResults.push(`${product.name} (${product.id}): Hoàn ${quantityToRollback} cái`);
    });
    
    toast.info('Đã hoàn kho sản phẩm thay thế', {
      description: rollbackResults.join('\n'),
      duration: 4000,
    });
  }
}
