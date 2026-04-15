require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
if (!process.env.DATABASE_URL) {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
}
const { Pool } = require('pg');
const pool = new Pool({ connectionString: (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '') });

async function main() {
  const r1 = await pool.query(`SELECT COUNT(*) as cnt FROM stock_history WHERE "documentType" = 'sales_order'`);
  console.log('Total sales_order stock history entries:', r1.rows[0].cnt);

  const r2 = await pool.query(`SELECT "documentId", action, "quantityChange", "newStockLevel" FROM stock_history WHERE "documentType" = 'sales_order' ORDER BY "createdAt" DESC LIMIT 5`);
  console.log('Sample entries:', JSON.stringify(r2.rows, null, 2));

  const r3 = await pool.query(`SELECT COUNT(DISTINCT "documentId") as cnt FROM stock_history WHERE "documentType" = 'sales_order'`);
  console.log('Distinct orders with stock history:', r3.rows[0].cnt);

  await pool.end();
}

main().catch(e => { console.error(e); pool.end(); });
