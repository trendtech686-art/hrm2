/**
 * Purge all business data — keep only:
 *   ✅ Users, Employees, Branches, Departments, JobTitles
 *   ✅ Provinces, Districts, Wards
 *   ✅ Settings, Roles, PaymentMethods, PenaltyTypes, EmployeeTypes
 *   ✅ Units, Taxes, ShippingPartners, SalesChannels, PricingPolicies
 *   ✅ ComplaintTypes, CustomerSettings, StockLocations
 *   ✅ Pkgx* tables (marketplace sync)
 *   ✅ IdCounters (reset values to 0)
 *
 * Run:  node scripts/purge-business-data.mjs
 */
import { createRequire } from 'module';
import 'dotenv/config';
const require = createRequire(import.meta.url);
const { Pool } = require('pg');

const connectionString = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString, max: 2 });

// ── Tables to TRUNCATE (children → parents order for readability) ──
const TABLES_TO_PURGE = [
  // ─── Operations: reconciliation ───
  'reconciliation_sheet_items',
  'reconciliation_sheets',

  // ─── Operations: packaging ───
  'packaging_items',
  'packagings',

  // ─── Operations: shipments ───
  'shipments',

  // ─── Sales: order details ───
  'order_line_items',
  'order_payments',

  // ─── Sales: returns ───
  'sales_return_items',
  'sales_returns',

  // ─── Sales: orders ───
  'orders',

  // ─── Sales: promotions ───
  'promotions',

  // ─── Procurement: purchase return details ───
  'purchase_return_items',
  'purchase_returns',

  // ─── Procurement: purchase order details ───
  'purchase_order_items',
  'purchase_orders',

  // ─── Procurement: supplier warranty ───
  'supplier_warranty_items',
  'supplier_warranties',

  // ─── Inventory: receipt details ───
  'inventory_receipt_items',
  'inventory_receipts',

  // ─── Inventory: check details ───
  'inventory_check_items',
  'inventory_checks',

  // ─── Inventory: cost adjustments ───
  'cost_adjustment_items',
  'cost_adjustments',

  // ─── Inventory: price adjustments ───
  'price_adjustment_items',
  'price_adjustments',

  // ─── Inventory: stock transfers ───
  'stock_transfer_items',
  'stock_transfers',

  // ─── Inventory: stock data ───
  'stock_history',
  'product_inventory',
  'inventory',

  // ─── Inventory: product details ───
  'product_serials',
  'product_batches',
  'product_conversions',
  'product_prices',
  'product_categories',

  // ─── Inventory: products ───
  'products',

  // ─── Inventory: brands & categories ───
  'brands',
  'categories',

  // ─── Operations: warranties & complaints ───
  'warranties',
  'complaints',

  // ─── Finance: receipts & payments ───
  'receipts',
  'payments',
  'cash_transactions',
  'cash_accounts',

  // ─── HRM: attendance & leave ───
  'attendance_records',
  'attendance_locks',
  'leaves',

  // ─── HRM: payroll ───
  'payroll_items',
  'payrolls',

  // ─── HRM: penalties ───
  'penalties',

  // ─── Operations: tasks ───
  'tasks',
  'task_boards',
  'recurring_tasks',
  'task_templates',

  // ─── System: logs & misc ───
  'activity_logs',
  'audit_logs',
  'notifications',
  'comments',
  'files',
  'import_export_logs',
  'active_timers',

  // ─── Wiki ───
  'wikis',
];

async function main() {
  const client = await pool.connect();
  try {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║   PURGE ALL BUSINESS DATA                          ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('');

    // ── 1. Count rows before delete ──
    console.log('── Đếm dữ liệu trước khi xóa ──');
    let totalRows = 0;
    for (const table of TABLES_TO_PURGE) {
      try {
        const res = await client.query(`SELECT COUNT(*) as cnt FROM "${table}"`);
        const cnt = parseInt(res.rows[0].cnt, 10);
        if (cnt > 0) {
          console.log(`  📊 ${table}: ${cnt.toLocaleString()} rows`);
          totalRows += cnt;
        }
      } catch {
        console.log(`  ⚠️  ${table}: không tồn tại (bỏ qua)`);
      }
    }
    console.log(`\n  📦 Tổng: ${totalRows.toLocaleString()} rows sẽ bị xóa\n`);

    if (totalRows === 0) {
      console.log('  ✅ Không có dữ liệu để xóa.');
      return;
    }

    // ── 2. TRUNCATE inside transaction ──
    console.log('── Bắt đầu xóa dữ liệu ──');
    await client.query('BEGIN');

    // Filter to only existing tables
    const existingTables = [];
    for (const table of TABLES_TO_PURGE) {
      const res = await client.query(
        `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1) as ok`,
        [table]
      );
      if (res.rows[0].ok) existingTables.push(table);
    }

    if (existingTables.length > 0) {
      const tableList = existingTables.map((t) => `"${t}"`).join(', ');
      await client.query(`TRUNCATE ${tableList} CASCADE`);
      console.log(`  🗑️  TRUNCATED ${existingTables.length} tables`);
    }

    // ── 3. Reset ID counters ──
    console.log('\n── Reset ID counters ──');
    const counterRes = await client.query(
      `UPDATE id_counters SET "currentValue" = 0`
    );
    console.log(`  🔄 Reset ${counterRes.rowCount} counters về 0`);

    // ── 4. Commit ──
    await client.query('COMMIT');
    console.log('\n  ✅ HOÀN TẤT — Đã xóa toàn bộ dữ liệu kinh doanh.');

    // ── 5. Verify ──
    console.log('\n── Kiểm tra sau xóa ──');
    const keepTables = [
      'users', 'employees', 'branches', 'departments', 'job_titles',
      'provinces', 'districts', 'wards',
      'settings', 'settings_data', 'role_settings',
    ];
    for (const table of keepTables) {
      try {
        const res = await client.query(`SELECT COUNT(*) as cnt FROM "${table}"`);
        console.log(`  ✅ ${table}: ${parseInt(res.rows[0].cnt, 10).toLocaleString()} rows (giữ nguyên)`);
      } catch {
        // skip
      }
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n  ❌ LỖI — Đã rollback:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(() => process.exit(1));
