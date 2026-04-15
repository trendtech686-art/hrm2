/**
 * Backfill script: Create StockHistory, InventoryReceipt, and update ProductInventory
 * for already-imported Sapo POs (PON*) that have deliveryStatus = 'Đã nhập'
 * but are missing inventory records.
 * 
 * Usage: node scripts/backfill-po-inventory.cjs
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
if (!process.env.DATABASE_URL) {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
}
const { Pool } = require('pg');

const connectionString = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString });

async function main() {
  const client = await pool.connect();
  
  try {
    // 1. Find all PON POs with deliveryStatus 'Đã nhập' or 'Nhập một phần'
    const posResult = await client.query(`
      SELECT po."systemId", po.id, po."deliveryStatus", po."supplierSystemId", po."supplierName",
             po."branchSystemId", po."branchName", po."creatorName", po."createdBy",
             po."receivedDate", po."orderDate", po."createdAt",
             po."shippingFee", po.tax
      FROM purchase_orders po
      WHERE po.id LIKE 'PON%'
        AND (po."deliveryStatus" = 'Đã nhập' OR po."deliveryStatus" = 'Nhập một phần')
      ORDER BY po.id
    `);
    
    console.log(`Found ${posResult.rows.length} received PON POs to process`);

    let stockHistoryCreated = 0;
    let inventoryReceiptsCreated = 0;
    let inventoryUpdated = 0;
    let productsUpdated = 0;
    let skipped = 0;
    let errors = 0;

    for (const po of posResult.rows) {
      try {
        // Check if this PO already has stock history entries
        const existingHistory = await client.query(
          `SELECT COUNT(*) as cnt FROM stock_history WHERE "documentId" = $1 AND "documentType" = 'purchase_order'`,
          [po.id]
        );
        if (parseInt(existingHistory.rows[0].cnt) > 0) {
          skipped++;
          continue;
        }

        // Get PO items
        const itemsResult = await client.query(`
          SELECT poi."systemId", poi."productId", poi."productName", poi."productSku",
                 poi.quantity, poi."receivedQty", poi."unitPrice", poi.discount, poi.total
          FROM purchase_order_items poi
          WHERE poi."purchaseOrderId" = $1
        `, [po.systemId]);

        if (itemsResult.rows.length === 0) {
          skipped++;
          continue;
        }

        const branchId = po.branchSystemId;
        if (!branchId) {
          console.log(`  Skipping ${po.id}: no branch`);
          skipped++;
          continue;
        }

        const receiptDate = po.receivedDate || po.orderDate || po.createdAt;
        const totalQty = itemsResult.rows.reduce((sum, li) => sum + li.quantity, 0);
        const totalFees = (parseFloat(po.shippingFee) || 0) + (parseFloat(po.tax) || 0);
        const feePerUnit = totalQty > 0 ? totalFees / totalQty : 0;

        await client.query('BEGIN');

        // Create InventoryReceipt
        // Generate a unique ID for the receipt
        const irIdResult = await client.query(`
          SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 3) AS INTEGER)), 0) + 1 as next_num
          FROM inventory_receipts
          WHERE id LIKE 'IR%' AND SUBSTRING(id FROM 3) ~ '^[0-9]+$'
        `);
        const nextIrNum = irIdResult.rows[0].next_num;
        const irBizId = 'IR' + String(nextIrNum).padStart(6, '0');
        const irSysId = 'IRREC' + String(100000 + nextIrNum);

        await client.query(`
          INSERT INTO inventory_receipts (
            "systemId", id, type, "branchId", "branchSystemId", "branchName",
            "receiptDate", "receivedDate", status,
            "purchaseOrderId", "purchaseOrderSystemId",
            "supplierSystemId", "supplierName",
            "receiverName", "createdAt", "createdBy", notes, "updatedAt"
          ) VALUES ($1, $2, 'PURCHASE', $3, $4, $5, $6, $7, 'CONFIRMED', $8, $9, $10, $11, $12, $13, $14, $15, NOW())
        `, [
          irSysId, irBizId, branchId, branchId, po.branchName,
          receiptDate, receiptDate,
          po.id, po.systemId,
          po.supplierSystemId, po.supplierName,
          po.creatorName || po.createdBy || 'System',
          po.createdAt, po.createdBy || 'System',
          `Nhập kho từ đơn nhập hàng Sapo ${po.id}`
        ]);
        inventoryReceiptsCreated++;

        for (const item of itemsResult.rows) {
          const productId = item.productId;
          const quantity = item.quantity;
          const unitPrice = parseFloat(item.unitPrice) || 0;

          if (!productId || quantity <= 0) continue;

          // Create InventoryReceiptItem
          const itemSysId = 'IRI' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
          await client.query(`
            INSERT INTO inventory_receipt_items (
              "systemId", "receiptId", "productId", "productName", "productSku",
              quantity, "unitCost", "totalCost"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            itemSysId, irSysId, productId, item.productName, item.productSku,
            quantity, unitPrice, quantity * unitPrice
          ]);

          // Update ProductInventory
          const existingInv = await client.query(`
            SELECT "onHand" FROM product_inventory
            WHERE "productId" = $1 AND "branchId" = $2
          `, [productId, branchId]);

          let newOnHand;
          if (existingInv.rows.length > 0) {
            await client.query(`
              UPDATE product_inventory
              SET "onHand" = "onHand" + $1, "updatedAt" = NOW()
              WHERE "productId" = $2 AND "branchId" = $3
            `, [quantity, productId, branchId]);
            newOnHand = existingInv.rows[0].onHand + quantity;
          } else {
            await client.query(`
              INSERT INTO product_inventory ("productId", "branchId", "onHand", committed, "inTransit", "inDelivery", "updatedAt")
              VALUES ($1, $2, $3, 0, 0, 0, NOW())
            `, [productId, branchId, quantity]);
            newOnHand = quantity;
          }
          inventoryUpdated++;

          // Create StockHistory
          const shSysId = 'SH' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
          await client.query(`
            INSERT INTO stock_history (
              "systemId", "productId", "branchId", action, source,
              "quantityChange", "newStockLevel",
              "documentId", "documentType", "employeeName", note,
              "createdAt", "updatedAt"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
          `, [
            shSysId, productId, branchId,
            'Nhập kho', 'Đơn nhập hàng (Sapo import)',
            quantity, newOnHand,
            po.id, 'purchase_order',
            po.creatorName || po.createdBy || 'System',
            `Nhập kho từ đơn nhập hàng ${po.id}`,
            receiptDate
          ]);
          stockHistoryCreated++;

          // Update Product cost price
          if (unitPrice > 0) {
            const costPrice = Math.round(unitPrice + feePerUnit);
            await client.query(`
              UPDATE products
              SET "lastPurchasePrice" = $1, "lastPurchaseDate" = $2, "costPrice" = $3
              WHERE "systemId" = $4
            `, [unitPrice, receiptDate, costPrice, productId]);
            productsUpdated++;
          }
        }

        await client.query('COMMIT');
        
        if ((inventoryReceiptsCreated % 50) === 0) {
          console.log(`  Processed ${inventoryReceiptsCreated} POs...`);
        }
      } catch (err) {
        await client.query('ROLLBACK');
        errors++;
        console.error(`  Error processing ${po.id}:`, err.message);
      }
    }

    console.log('\n=== Backfill Complete ===');
    console.log(`POs processed: ${posResult.rows.length}`);
    console.log(`Skipped (already had history): ${skipped}`);
    console.log(`InventoryReceipts created: ${inventoryReceiptsCreated}`);
    console.log(`StockHistory entries created: ${stockHistoryCreated}`);
    console.log(`ProductInventory updated: ${inventoryUpdated}`);
    console.log(`Products cost updated: ${productsUpdated}`);
    console.log(`Errors: ${errors}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error(e); pool.end(); });
