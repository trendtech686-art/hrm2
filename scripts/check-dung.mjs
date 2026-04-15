import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Pool } = require('pg');

const connectionString = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString, max: 2 });

async function main() {
  const client = await pool.connect();
  try {
    // Find ALL employees
    const allEmps = await client.query(
      `SELECT "systemId", "fullName", role, "branchId" FROM employees ORDER BY "fullName"`
    );
    console.log('=== ALL Employees ===');
    for (const e of allEmps.rows) console.log(e.fullName, '|', e.role, '|', e.systemId);

    // Find their user accounts
    if (allEmps.rows.length > 0) {
      const ids = allEmps.rows.map(e => e.systemId);
      const users = await client.query(
        `SELECT "systemId", email, role, "employeeId" FROM users WHERE "employeeId" = ANY($1)`, [ids]
      );
      console.log('\n=== User accounts ===');
      for (const u of users.rows) console.log(JSON.stringify(u));
    }

    // Data counts
    const wc = await client.query(`SELECT count(*) FROM warranties WHERE "isDeleted" = false`);
    const cc = await client.query(`SELECT count(*) FROM complaints WHERE "isDeleted" = false`);
    console.log('\nWarranties (not deleted):', wc.rows[0].count);
    console.log('Complaints (not deleted):', cc.rows[0].count);

    // Role settings
    const rs = await client.query(`SELECT value FROM settings WHERE key = 'roles' LIMIT 1`);
    if (rs.rows.length > 0) {
      console.log('\n=== Custom Role Settings ===');
      const val = typeof rs.rows[0].value === 'string' ? JSON.parse(rs.rows[0].value) : rs.rows[0].value;
      for (const role of val) {
        console.log('Role:', role.name, '(id:', role.id + '), perms:', role.permissions?.length);
        if (role.id === 'Warehouse' || role.name === 'Kho') {
          console.log('  Warehouse perms:', JSON.stringify(role.permissions));
        }
      }
    } else {
      console.log('\nNo custom role settings in DB');
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
