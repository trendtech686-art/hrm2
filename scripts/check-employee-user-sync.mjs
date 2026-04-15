import { createRequire } from 'module';
import 'dotenv/config';
const require = createRequire(import.meta.url);
const { Pool } = require('pg');

const connectionString = (process.env.DATABASE_URL || '').replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString, max: 2 });

async function main() {
  const client = await pool.connect();
  try {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║   EMPLOYEE ↔ USER SYNC AUDIT                       ║');
    console.log('╚══════════════════════════════════════════════════════╝');

    // 1. Email mismatch
    console.log('\n── 1. Email Mismatch (employee.workEmail ≠ user.email) ──');
    const emailMismatch = await client.query(`
      SELECT e."systemId", e."fullName", e."workEmail", u.email as user_email
      FROM employees e
      INNER JOIN users u ON u."employeeId" = e."systemId"
      WHERE e."workEmail" IS NOT NULL AND e."workEmail" != u.email
      ORDER BY e."fullName"
    `);
    if (emailMismatch.rows.length === 0) {
      console.log('  ✅ Không có mismatch');
    } else {
      for (const r of emailMismatch.rows) {
        console.log(`  ❌ ${r.fullName} | Employee: ${r.workEmail} | User: ${r.user_email}`);
      }
    }

    // 2. Deleted employee but user still active
    console.log('\n── 2. Deleted Employee + Active User (SECURITY!) ──');
    const deletedActive = await client.query(`
      SELECT e."systemId", e."fullName", e."isDeleted", e."employmentStatus", u."isActive" as user_active, u.email
      FROM employees e
      INNER JOIN users u ON u."employeeId" = e."systemId"
      WHERE (e."isDeleted" = true OR e."employmentStatus" = 'TERMINATED') AND u."isActive" = true
      ORDER BY e."fullName"
    `);
    if (deletedActive.rows.length === 0) {
      console.log('  ✅ Không có vấn đề');
    } else {
      for (const r of deletedActive.rows) {
        console.log(`  ❌ ${r.fullName} (${r.email}) | deleted=${r.isDeleted} status=${r.employmentStatus} | user.isActive=true`);
      }
    }

    // 3. Active employee but user deactivated
    console.log('\n── 3. Active Employee + Deactivated User ──');
    const activeDeactivated = await client.query(`
      SELECT e."systemId", e."fullName", e."employmentStatus", u."isActive" as user_active, u.email
      FROM employees e
      INNER JOIN users u ON u."employeeId" = e."systemId"
      WHERE e."isDeleted" = false AND e."employmentStatus"::text IN ('ACTIVE', 'ON_LEAVE') AND u."isActive" = false
      ORDER BY e."fullName"
    `);
    if (activeDeactivated.rows.length === 0) {
      console.log('  ✅ Không có vấn đề');
    } else {
      for (const r of activeDeactivated.rows) {
        console.log(`  ❌ ${r.fullName} (${r.email}) | status=${r.employmentStatus} | user.isActive=false`);
      }
    }

    // 4. Employees without user account
    console.log('\n── 4. Employees Without User Account ──');
    const noUser = await client.query(`
      SELECT e."systemId", e."fullName", e."workEmail", e."employmentStatus"
      FROM employees e
      LEFT JOIN users u ON u."employeeId" = e."systemId"
      WHERE u."systemId" IS NULL AND e."isDeleted" = false
      ORDER BY e."fullName"
    `);
    if (noUser.rows.length === 0) {
      console.log('  ✅ Tất cả nhân viên đều có user account');
    } else {
      console.log(`  ⚠️ ${noUser.rows.length} nhân viên chưa có user account:`);
      for (const r of noUser.rows) {
        console.log(`    - ${r.fullName} | ${r.workEmail || '(no email)'} | ${r.employmentStatus}`);
      }
    }

    // 5. Users without employee (orphan users)
    console.log('\n── 5. Orphan Users (no linked employee) ──');
    const orphanUsers = await client.query(`
      SELECT u."systemId", u.email, u.role, u."isActive"
      FROM users u
      WHERE u."employeeId" IS NULL
      ORDER BY u.email
    `);
    if (orphanUsers.rows.length === 0) {
      console.log('  ✅ Không có orphan user');
    } else {
      for (const r of orphanUsers.rows) {
        console.log(`  ⚠️ ${r.email} | role=${r.role} | active=${r.isActive}`);
      }
    }

    // Summary (User table không có column `name` — JWT lấy fullName từ Employee)
    const totalIssues = emailMismatch.rows.length + deletedActive.rows.length + activeDeactivated.rows.length;
    console.log('\n══════════════════════════════════════════════════════════');
    if (totalIssues === 0) {
      console.log(`✅ TỔNG KẾT: Không có vấn đề sync nào`);
    } else {
      console.log(`❌ TỔNG KẾT: ${totalIssues} vấn đề cần sửa`);
    }
    console.log(`   Nhân viên chưa có user: ${noUser.rows.length}`);
    console.log(`   Orphan users: ${orphanUsers.rows.length}`);
    console.log('');

  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
