import { createRequire } from 'module';
import 'dotenv/config';
const require = createRequire(import.meta.url);
const { Pool } = require('pg');

const connectionString = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString, max: 2 });

async function main() {
  const client = await pool.connect();
  try {
    // Check current value
    const current = await client.query(
      `SELECT key, "group", value FROM settings WHERE key = 'otp_login' AND "group" = 'security'`
    );
    console.log('Current OTP setting:', current.rows[0] || 'NOT FOUND');

    if (current.rows.length > 0) {
      await client.query(
        `UPDATE settings SET value = $1 WHERE key = 'otp_login' AND "group" = 'security'`,
        [JSON.stringify({ enabled: false })]
      );
      console.log('✅ OTP login đã được TẮT');
    } else {
      console.log('ℹ️ Không tìm thấy setting otp_login — chưa bật bao giờ');
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
