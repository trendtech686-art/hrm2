/**
 * Script xóa toàn bộ Phiếu phạt và Chấm công để test
 * Run: npx tsx reset-attendance-penalties.ts
 */

import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  console.log('🗑️  Bắt đầu xóa dữ liệu test...\n');

  // 1. Xóa toàn bộ Phiếu phạt
  const deletedPenalties = await prisma.penalty.deleteMany({});
  console.log(`✅ Đã xóa ${deletedPenalties.count} phiếu phạt`);

  // 2. Xóa toàn bộ Chấm công
  const deletedAttendance = await prisma.attendanceRecord.deleteMany({});
  console.log(`✅ Đã xóa ${deletedAttendance.count} bản ghi chấm công`);

  // 3. Reset counter cho penalties và attendance
  await prisma.idCounter.deleteMany({
    where: {
      entityType: {
        in: ['penalties', 'attendance']
      }
    }
  });
  console.log('✅ Đã reset ID counter cho penalties và attendance');

  console.log('\n🎉 Hoàn tất! Bạn có thể test import lại.');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  });
