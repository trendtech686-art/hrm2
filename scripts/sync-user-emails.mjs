import { createRequire } from 'module';
import 'dotenv/config';
const require = createRequire(import.meta.url);
const { Pool } = require('pg');

const connectionString = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString, max: 2 });

async function main() {
  const client = await pool.connect();
  try {
    // Check employee email vs user email
    const result = await client.query(`
      SELECT 
        e."systemId" as emp_id,
        e."fullName",
        e."workEmail" as employee_email,
        u.email as user_email,
        CASE WHEN e."workEmail" != u.email THEN '❌ MISMATCH' ELSE '✅ OK' END as status
      FROM employees e
      INNER JOIN users u ON u."employeeId" = e."systemId"
      WHERE e."isDeleted" = false
      ORDER BY e."fullName"
    `);
    
    console.log('=== Employee Email vs User Email ===');
    for (const r of result.rows) {
      console.log(`${r.status} | ${r.fullName} | Employee: ${r.employee_email} | User: ${r.user_email}`);
    }
    
    // Fix mismatches
    const mismatches = result.rows.filter(r => r.employee_email !== r.user_email);
    if (mismatches.length > 0) {
      console.log(`\n⚠️  Found ${mismatches.length} mismatch(es). Syncing...`);
      for (const m of mismatches) {
        await client.query(
          `UPDATE users SET email = $1 WHERE "employeeId" = $2`,
          [m.employee_email, m.emp_id]
        );
        console.log(`  ✅ Synced: ${m.fullName} → ${m.employee_email}`);
      }
    } else {
      console.log('\n✅ All emails are in sync!');
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
