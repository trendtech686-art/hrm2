/**
 * Seed Sample Employees — email / chi nhánh / phòng ban lấy từ cấu hình đang có trong DB
 * (Cài đặt > Cửa hàng: domain email; chi nhánh mặc định; phòng ban đã seed)
 */

import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'
import {
  getDefaultBranchForSeed,
  loadStoreInfo,
  workEmailForSampleUser,
} from '../prisma/seeds/lib/read-db-settings'

const DEPT_ID_BY_ROLE: Record<string, string> = {
  Admin: 'BGD',
  Manager: 'KD',
  Sales: 'KD',
  Warehouse: 'KHO',
}

const SAMPLE_EMPLOYEES = [
  { id: 'NV002', fullName: 'Nguyễn Văn Admin', emailLocal: 'admin', role: 'Admin' },
  { id: 'NV003', fullName: 'Trần Thị Quản Lý', emailLocal: 'manager', role: 'Manager' },
  { id: 'NV004', fullName: 'Lê Văn Kinh Doanh', emailLocal: 'sales1', role: 'Sales' },
  { id: 'NV005', fullName: 'Phạm Thị Kinh Doanh', emailLocal: 'sales2', role: 'Sales' },
  { id: 'NV006', fullName: 'Hoàng Văn Kho', emailLocal: 'warehouse1', role: 'Warehouse' },
  { id: 'NV007', fullName: 'Đặng Thị Kho', emailLocal: 'warehouse2', role: 'Warehouse' },
] as const

async function seedEmployees() {
  console.log('🌱 Bắt đầu seed nhân viên mẫu (theo cài đặt DB)...')

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const store = await loadStoreInfo(prisma)
    if (store?.email) {
      console.log(`  → Domain email mẫu: @${String(store.email).split('@').pop() ?? '…'}`)
    } else {
      console.log('  → Chưa có email công ty trong Cài đặt — dùng @company.com cho workEmail mẫu')
    }

    const branch = await getDefaultBranchForSeed(prisma)
    if (branch) {
      console.log(`  → Gán chi nhánh mặc định: ${branch.name}`)
    }

    const nv1 = await prisma.employee.findFirst({ where: { id: 'NV001' } })
    if (nv1) {
      await prisma.employee.update({ where: { id: 'NV001' }, data: { role: 'Admin' } })
      console.log('  ✅ Đã cập nhật NV001 thành Admin')
    } else {
      console.log('  ⏭ Không tìm thấy NV001 — bỏ qua bước cập nhật Admin cho NV001')
    }

    for (const emp of SAMPLE_EMPLOYEES) {
      const workEmail = workEmailForSampleUser(emp.emailLocal, store)
      const deptKey = DEPT_ID_BY_ROLE[emp.role] ?? 'KD'
      const department = await prisma.department.findFirst({
        where: { id: deptKey, isDeleted: false },
      })
      await prisma.employee.upsert({
        where: { id: emp.id },
        update: {
          fullName: emp.fullName,
          workEmail,
          role: emp.role,
          branchId: branch?.systemId ?? undefined,
          departmentId: department?.systemId ?? undefined,
        },
        create: {
          systemId: crypto.randomUUID(),
          id: emp.id,
          fullName: emp.fullName,
          workEmail,
          role: emp.role,
          branchId: branch?.systemId ?? undefined,
          departmentId: department?.systemId ?? undefined,
        },
      })
    }

    console.log(`  ✅ Đã seed / cập nhật ${SAMPLE_EMPLOYEES.length} nhân viên mẫu`)

    const counts = await prisma.$queryRaw<{ role: string; count: bigint }[]>`
      SELECT role, COUNT(*) as count
      FROM employees
      WHERE is_deleted = false
      GROUP BY role
    `

    console.log('\n📊 Thống kê nhân viên theo vai trò:')
    for (const row of counts) {
      console.log(`   - ${row.role}: ${row.count} người`)
    }

    console.log('\n✨ Seed nhân viên hoàn tất!')
  } catch (error) {
    console.error('❌ Lỗi khi seed nhân viên:', error)
    throw error
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

seedEmployees().catch(console.error)
