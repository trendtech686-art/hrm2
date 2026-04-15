import 'dotenv/config';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Pool } = require('pg');

const connectionString = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString, max: 2 });

// Clear conflicting data first, then run seed
const client = await pool.connect();
await client.query('TRUNCATE "job_titles", "departments", "employee_type_settings", "penalty_type_settings", "customer_settings" CASCADE');
client.release();
await pool.end();
console.log('✅ Cleared existing settings tables\n');

import { seedEmployeeSettings } from '../prisma/seeds/seed-employee-settings.ts';

seedEmployeeSettings()
  .then(() => { console.log('\n✅ Employee settings seeded!'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
