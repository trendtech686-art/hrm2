import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
  let connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    connectionString = connectionString.replace(/^["']|["']$/g, '');
  }
  
  const pool = new Pool({ connectionString });
  
  const result = await pool.query(`
    SELECT id, "goodsSn", "goodsNumber", name 
    FROM pkgx_products 
    LIMIT 5
  `);
  
  console.log('Sample data:');
  console.table(result.rows);
  
  await pool.end();
}

main().catch(console.error);
