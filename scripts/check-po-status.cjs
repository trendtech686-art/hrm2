require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { Pool } = require('pg');

let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
  connectionString = process.env.DATABASE_URL;
}
connectionString = connectionString.replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString });

async function main() {
  const p = pool;
  const posResult = await p.query('SELECT id, "paymentStatus", paid, debt, "grandTotal" FROM purchase_orders WHERE id LIKE \'PON%\' ORDER BY id DESC LIMIT 20');
  console.log('=== PO Payment Status (first 20 PON POs) ===');
  for (const po of posResult.rows) {
    console.log(po.id + ': paymentStatus="' + po.paymentStatus + '", paid=' + po.paid + ', debt=' + po.debt + ', grandTotal=' + po.grandTotal);
  }
  
  // Check if any PON POs have payments
  const paymentsResult = await p.query('SELECT id, amount, "purchaseOrderBusinessId", type FROM payments WHERE "purchaseOrderBusinessId" LIKE \'PON%\' LIMIT 10');
  console.log('\n=== Payments for PON POs ===');
  console.log('Found ' + paymentsResult.rows.length + ' payments');
  for (const pay of paymentsResult.rows) {
    console.log('Payment ' + pay.id + ': amount=' + pay.amount + ', PO=' + pay.purchaseOrderBusinessId + ', type=' + pay.type);
  }

  // Count payment statuses
  const statusResult = await p.query('SELECT "paymentStatus", COUNT(*) as cnt FROM purchase_orders WHERE id LIKE \'PON%\' GROUP BY "paymentStatus"');
  console.log('\n=== Payment Status Distribution ===');
  for (const s of statusResult.rows) {
    console.log('"' + s.paymentStatus + '": ' + s.cnt + ' POs');
  }

  // Check specific POs that have payments
  const paidPOs = await p.query("SELECT id, \"paymentStatus\", paid, debt, \"grandTotal\" FROM purchase_orders WHERE id IN ('PON00679','PON00668','PON00663','PON00662') ORDER BY id");
  console.log('\n=== POs with known payments ===');
  for (const po of paidPOs.rows) {
    console.log(po.id + ': paymentStatus="' + po.paymentStatus + '", paid=' + po.paid + ', debt=' + po.debt + ', grandTotal=' + po.grandTotal);
  }

  // Verify backfill: stock history count
  const shCount = await p.query("SELECT COUNT(*) as cnt FROM stock_history WHERE \"documentType\" = 'purchase_order' AND \"documentId\" LIKE 'PON%'");
  console.log('\n=== StockHistory for PON POs: ' + shCount.rows[0].cnt + ' entries ===');
  
  // Verify backfill: inventory receipts  
  const irCount = await p.query("SELECT COUNT(*) as cnt FROM inventory_receipts WHERE \"purchaseOrderId\" LIKE 'PON%'");
  console.log('InventoryReceipts for PON POs: ' + irCount.rows[0].cnt + ' receipts');

  // Sample: show stock history for product EW75 (from screenshot)
  const ew75 = await p.query("SELECT \"systemId\" FROM products WHERE id = 'EW75' LIMIT 1");
  if (ew75.rows.length > 0) {
    const sysId = ew75.rows[0].systemId;
    const sh = await p.query("SELECT action, source, \"quantityChange\", \"documentId\", \"createdAt\" FROM stock_history WHERE \"productId\" = $1 ORDER BY \"createdAt\" DESC LIMIT 5", [sysId]);
    console.log('\n=== StockHistory for EW75 ===');
    for (const row of sh.rows) {
      console.log(row.action + ' | ' + row.source + ' | qty=' + row.quantityChange + ' | doc=' + row.documentId + ' | ' + row.createdAt);
    }
    
    // Check inventory receipts for EW75
    const ir = await p.query("SELECT ir.id, ir.\"receiptDate\", ir.\"supplierName\", iri.\"unitCost\", iri.quantity FROM inventory_receipts ir JOIN inventory_receipt_items iri ON iri.\"receiptId\" = ir.\"systemId\" WHERE iri.\"productId\" = $1 ORDER BY ir.\"receiptDate\" DESC LIMIT 5", [sysId]);
    console.log('\n=== Price History (InventoryReceipts) for EW75 ===');
    for (const row of ir.rows) {
      console.log(row.id + ' | date=' + row.receiptDate + ' | supplier=' + row.supplierName + ' | price=' + row.unitCost + ' | qty=' + row.quantity);
    }
  }

  await p.end();
}

main().catch(e => { console.error(e); pool.end(); });
