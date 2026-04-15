/**
 * Backfill script: Create StockHistory and update ProductInventory
 * for already-imported Sapo sales orders (SON*) that have stockOutStatus = 'STOCKED_OUT'
 * but are missing stock history records.
 * 
 * Usage: node scripts/backfill-order-stock-history.cjs
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
    // 1. Find all SON orders with stockOutStatus 'STOCKED_OUT'
    const ordersResult = await client.query(`
      SELECT o."systemId", o.id, o."stockOutStatus", o."branchId", o."branchName",
             o."dispatchedDate", o."orderDate", o."createdAt", o."createdBy"
      FROM orders o
      WHERE o.id LIKE 'SON%'
        AND o."stockOutStatus" = 'FULLY_STOCKED_OUT'
      ORDER BY o.id
    `);
    
    console.log(`Found ${ordersResult.rows.length} stocked-out SON orders to process`);

    let stockHistoryCreated = 0;
    let inventoryUpdated = 0;
    let skipped = 0;
    let errors = 0;

    for (const order of ordersResult.rows) {
      try {
        // Check if this order already has stock history entries
        const existingHistory = await client.query(
          `SELECT COUNT(*) as cnt FROM stock_history WHERE "documentId" = $1 AND "documentType" = 'sales_order'`,
          [order.id]
        );
        if (parseInt(existingHistory.rows[0].cnt) > 0) {
          skipped++;
          continue;
        }

        // Get order line items
        const itemsResult = await client.query(`
          SELECT oli."systemId", oli."productId", oli."productName", oli."productSku",
                 oli.quantity, oli."unitPrice", oli.discount, oli.total
          FROM order_line_items oli
          WHERE oli."orderId" = $1
        `, [order.systemId]);

        if (itemsResult.rows.length === 0) {
          skipped++;
          continue;
        }

        const branchId = order.branchId;
        if (!branchId) {
          console.log(`  Skipping ${order.id}: no branch`);
          skipped++;
          continue;
        }

        const stockOutDate = order.dispatchedDate || order.orderDate || order.createdAt;

        await client.query('BEGIN');

        for (const item of itemsResult.rows) {
          const productId = item.productId;
          const quantity = item.quantity;

          if (!productId || quantity <= 0) continue;

          // Deduct ProductInventory
          const existingInv = await client.query(`
            SELECT "onHand" FROM product_inventory
            WHERE "productId" = $1 AND "branchId" = $2
          `, [productId, branchId]);

          let newOnHand;
          if (existingInv.rows.length > 0) {
            await client.query(`
              UPDATE product_inventory
              SET "onHand" = "onHand" - $1, "updatedAt" = NOW()
              WHERE "productId" = $2 AND "branchId" = $3
            `, [quantity, productId, branchId]);
            newOnHand = existingInv.rows[0].onHand - quantity;
          } else {
            await client.query(`
              INSERT INTO product_inventory ("productId", "branchId", "onHand", committed, "inTransit", "inDelivery", "updatedAt")
              VALUES ($1, $2, $3, 0, 0, 0, NOW())
            `, [productId, branchId, -quantity]);
            newOnHand = -quantity;
          }
          inventoryUpdated++;

          // Create StockHistory (negative quantityChange for stock out)
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
            'Xuất kho bán hàng', 'Đơn hàng (Sapo import)',
            -quantity, newOnHand,
            order.id, 'sales_order',
            order.createdBy || 'System',
            `Xuất kho bán hàng - ${order.id}`,
            stockOutDate
          ]);
          stockHistoryCreated++;
        }

        await client.query('COMMIT');
        
        if ((inventoryUpdated % 500) === 0 && inventoryUpdated > 0) {
          console.log(`  Processed ${inventoryUpdated} line items...`);
        }
      } catch (err) {
        await client.query('ROLLBACK');
        errors++;
        console.error(`  Error processing ${order.id}:`, err.message);
      }
    }

    console.log('\n=== Backfill Complete ===');
    console.log(`Orders processed: ${ordersResult.rows.length}`);
    console.log(`Skipped (already had history): ${skipped}`);
    console.log(`StockHistory entries created: ${stockHistoryCreated}`);
    console.log(`ProductInventory updated: ${inventoryUpdated}`);
    console.log(`Errors: ${errors}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error(e); pool.end(); });
