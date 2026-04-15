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
    await client.query(`
      TRUNCATE
        "provinces","districts","wards",
        "settings","settings_data","role_settings",
        "units","taxes","shipping_partners","sales_channels",
        "pricing_policies","payment_methods",
        "penalty_type_settings","employee_type_settings",
        "complaint_type_settings","customer_settings",
        "stock_locations","user_preferences"
      CASCADE
    `);
    await client.query('COMMIT');
    console.log('✅ Đã xóa thêm settings & reference tables');

    console.log('\n── Kiểm tra sau xóa ──');
    for (const t of ['users', 'employees', 'branches', 'departments', 'job_titles']) {
      const r = await client.query(`SELECT COUNT(*) as cnt FROM "${t}"`);
      console.log(`  ✅ ${t}: ${r.rows[0].cnt} rows (giữ nguyên)`);
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
