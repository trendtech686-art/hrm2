/**
 * Seed Sample Employees - Tạo nhân viên mẫu để test
 */

import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const SAMPLE_EMPLOYEES = [
  {
    id: 'NV002',
    fullName: 'Nguyễn Văn Admin',
    workEmail: 'admin@company.com',
    role: 'Admin',
    departmentId: null,
  },
  {
    id: 'NV003',
    fullName: 'Trần Thị Quản Lý',
    workEmail: 'manager@company.com',
    role: 'Manager',
    departmentId: null,
  },
  {
    id: 'NV004', 
    fullName: 'Lê Văn Kinh Doanh',
    workEmail: 'sales1@company.com',
    role: 'Sales',
    departmentId: null,
  },
  {
    id: 'NV005',
    fullName: 'Phạm Thị Kinh Doanh',
    workEmail: 'sales2@company.com',
    role: 'Sales',
    departmentId: null,
  },
  {
    id: 'NV006',
    fullName: 'Hoàng Văn Kho',
    workEmail: 'warehouse1@company.com',
    role: 'Warehouse',
    departmentId: null,
  },
  {
    id: 'NV007',
    fullName: 'Đặng Thị Kho',
    workEmail: 'warehouse2@company.com',
    role: 'Warehouse',
    departmentId: null,
  },
]

async function seedEmployees() {
  console.log('🌱 Bắt đầu seed nhân viên mẫu...')

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    // Update existing admin employee role
    await prisma.employee.updateMany({
      where: { id: 'NV001' },
      data: { role: 'Admin' }
    })
    console.log('  ✅ Đã cập nhật NV001 thành Admin')

    // Seed new employees
    for (const emp of SAMPLE_EMPLOYEES) {
      await prisma.employee.upsert({
        where: { id: emp.id },
        update: {
          fullName: emp.fullName,
          workEmail: emp.workEmail,
          role: emp.role,
        },
        create: {
          systemId: crypto.randomUUID(),
          ...emp,
        },
      })
    }

    console.log(`  ✅ Đã seed ${SAMPLE_EMPLOYEES.length} nhân viên mẫu`)

    // Show summary
    const counts = await prisma.$queryRaw<{role: string; count: bigint}[]>`
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
