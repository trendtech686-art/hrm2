/**
 * Script để xóa tất cả khách hàng
 * 
 * Chạy: npx tsx delete-all-customers.ts
 */

import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function deleteAllCustomers() {
  console.log('🗑️  Bắt đầu xóa tất cả khách hàng...\n')

  try {
    // Đếm số lượng khách hàng hiện tại
    const count = await prisma.customer.count()
    console.log(`📊 Tổng số khách hàng hiện tại: ${count}`)

    if (count === 0) {
      console.log('✅ Không có khách hàng nào để xóa.')
      return
    }

    // Xác nhận trước khi xóa
    console.log('\n⚠️  CẢNH BÁO: Thao tác này sẽ xóa TẤT CẢ khách hàng!')
    console.log('   Đang tiến hành xóa...\n')

    // Xóa tất cả khách hàng
    const result = await prisma.customer.deleteMany({})

    console.log(`✅ Đã xóa thành công ${result.count} khách hàng!`)
  } catch (error) {
    console.error('❌ Lỗi khi xóa khách hàng:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Chạy script
deleteAllCustomers()
  .then(() => {
    console.log('\n🏁 Hoàn tất!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script thất bại:', error)
    process.exit(1)
  })
