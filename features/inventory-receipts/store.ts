import { createCrudStore } from '../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { InventoryReceipt, InventoryReceiptLineItem } from './types.ts';
import type { SystemId, BusinessId } from '../../lib/id-types.ts';

export const useInventoryReceiptStore = createCrudStore<InventoryReceipt>(
  initialData,
  'inventory-receipts',
  {
    persistKey: 'hrm-inventory-receipts', // ✅ Enable localStorage persistence
  }
);

type PurchaseOrderReference = {
  systemId: SystemId;
  id: BusinessId;
  branchSystemId?: SystemId;
  branchName?: string;
  supplierSystemId?: SystemId;
  supplierName?: string;
};

type ProductReference = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  sku?: string;
};

type InventoryReceiptBackfillInput = {
  purchaseOrders: PurchaseOrderReference[];
  products?: ProductReference[];
};

const normalizeKey = (value?: string | null) => (value ? value.trim().toLowerCase() : '');

const buildLookup = <T extends { systemId: SystemId; id: BusinessId }>(
  entries: T[],
  extraKeys?: (entry: T) => (string | undefined)[],
) => {
  const bySystemId = new Map<string, T>();
  const byAnyKey = new Map<string, T>();

  entries.forEach(entry => {
    const systemKey = normalizeKey(entry.systemId);
    const businessKey = normalizeKey(entry.id);
    if (systemKey) {
      bySystemId.set(systemKey, entry);
      byAnyKey.set(systemKey, entry);
    }
    if (businessKey) {
      byAnyKey.set(businessKey, entry);
    }
    (extraKeys?.(entry) ?? []).forEach(key => {
      const normalized = normalizeKey(key);
      if (normalized) {
        byAnyKey.set(normalized, entry);
      }
    });
  });

  return { bySystemId, byAnyKey };
};

const matchProduct = (
  item: InventoryReceiptLineItem,
  lookup: Map<string, ProductReference>,
) => {
  const candidates = [item.productSystemId, item.productId, item.productName];
  for (const candidate of candidates) {
    const normalized = normalizeKey(candidate);
    if (!normalized) continue;
    const product = lookup.get(normalized);
    if (product) {
      return product;
    }
  }
  return undefined;
};

/**
 * Ensure historical receipts keep dual IDs + branch context + correct product linkage.
 * Call once after purchase order & product stores are hydrated to migrate legacy data.
 */
export function syncInventoryReceiptsWithPurchaseOrders({
  purchaseOrders,
  products,
}: InventoryReceiptBackfillInput) {
  if (!purchaseOrders.length) return;

  const poLookup = buildLookup(purchaseOrders, po => [po.id]);
  const productLookup = buildLookup(products ?? [], product => [product.id, product.sku, product.name]);

  const storeState = useInventoryReceiptStore.getState();
  const updated = storeState.data.map(receipt => {
    let next = receipt;
    const matchedPo =
      poLookup.bySystemId.get(normalizeKey(receipt.purchaseOrderSystemId)) ||
      poLookup.byAnyKey.get(normalizeKey(receipt.purchaseOrderId));

    if (!matchedPo) {
      return receipt;
    }

    const updates: Partial<InventoryReceipt> = {};
    let mutated = false;

    if (receipt.purchaseOrderSystemId !== matchedPo.systemId) {
      updates.purchaseOrderSystemId = matchedPo.systemId;
      mutated = true;
    }

    if (receipt.purchaseOrderId !== matchedPo.id) {
      updates.purchaseOrderId = matchedPo.id;
      mutated = true;
    }

    if (matchedPo.branchSystemId && receipt.branchSystemId !== matchedPo.branchSystemId) {
      updates.branchSystemId = matchedPo.branchSystemId;
      mutated = true;
    }

    if (matchedPo.branchName && receipt.branchName !== matchedPo.branchName) {
      updates.branchName = matchedPo.branchName;
      mutated = true;
    }

    if (matchedPo.supplierSystemId && receipt.supplierSystemId !== matchedPo.supplierSystemId) {
      updates.supplierSystemId = matchedPo.supplierSystemId;
      mutated = true;
    }

    if (matchedPo.supplierName && receipt.supplierName !== matchedPo.supplierName) {
      updates.supplierName = matchedPo.supplierName;
      mutated = true;
    }

    if (products?.length) {
      const normalizedItems = next.items.map(item => {
        const matchedProduct = matchProduct(item, productLookup.byAnyKey);
        if (!matchedProduct) {
          return item;
        }

        if (
          item.productSystemId === matchedProduct.systemId &&
          item.productId === matchedProduct.id &&
          item.productName === matchedProduct.name
        ) {
          return item;
        }

        mutated = true;
        return {
          ...item,
          productSystemId: matchedProduct.systemId,
          productId: matchedProduct.id,
          productName: matchedProduct.name,
        };
      });

      const itemsChanged = normalizedItems.some((item, index) => item !== next.items[index]);
      if (itemsChanged) {
        updates.items = normalizedItems;
      }
    }

    return mutated ? { ...next, ...updates } : receipt;
  });

  const hasChanges = updated.some((receipt, index) => receipt !== storeState.data[index]);
  if (hasChanges) {
    useInventoryReceiptStore.setState({ data: updated });
  }
}
