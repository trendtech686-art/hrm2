import { createRequire } from 'module';
import 'dotenv/config';
const require = createRequire(import.meta.url);
const { Pool } = require('pg');

const connectionString = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString, max: 2 });

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Xóa hết employees trước (vì users FK → employees)
    // Nhưng employees có self-ref managerId, nên clear managerId trước
    await client.query(`UPDATE "employees" SET "managerId" = NULL`);

    // Xóa departments self-ref
    await client.query(`UPDATE "departments" SET "parentId" = NULL`);

    // Truncate tất cả
    await client.query(`
      TRUNCATE
        "users",
        "employees",
        "branches",
        "departments",
        "job_titles"
      CASCADE
    `);

    await client.query('COMMIT');
    console.log('✅ Đã xóa toàn bộ dữ liệu còn lại');

    // Verify
    console.log('\n── Kiểm tra ──');
    for (const t of ['users', 'employees', 'branches', 'departments', 'job_titles']) {
      const r = await client.query(`SELECT COUNT(*) as cnt FROM "${t}"`);
      console.log(`  ${t}: ${r.rows[0].cnt} rows`);
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ LỖI:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
