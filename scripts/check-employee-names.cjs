require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
if (!process.env.DATABASE_URL) {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
}
const { Pool } = require('pg');
const pool = new Pool({ connectionString: (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '') });

async function main() {
  const r1 = await pool.query(`SELECT DISTINCT "createdBy" FROM orders WHERE id LIKE 'SON%' LIMIT 10`);
  console.log('Order createdBy values:', r1.rows);

  const r2 = await pool.query(`SELECT "systemId", id, "fullName" FROM employees LIMIT 10`);
  console.log('Employees:', r2.rows);

  const r3 = await pool.query(`SELECT DISTINCT "employeeName" FROM stock_history WHERE "documentType" = 'sales_order' LIMIT 10`);
  console.log('Stock history employeeNames:', r3.rows);

  const r4 = await pool.query(`SELECT "createdBy", "salespersonName", "salespersonId" FROM orders WHERE id = 'SON08302' LIMIT 1`);
  console.log('SON08302 details:', r4.rows);

  const r5 = await pool.query(`SELECT DISTINCT "employeeName" FROM stock_history WHERE "documentType" = 'purchase_order' LIMIT 10`);
  console.log('PO stock history employeeNames:', r5.rows);

  await pool.end();
}

main().catch(e => { console.error(e); pool.end(); });
