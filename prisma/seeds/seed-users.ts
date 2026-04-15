/**
 * Seed Users and Employees
 * - 2 users: admin@erp.local (ADMIN), sales@erp.local (STAFF)
 * - 2 employees linked to users
 * 
 * Run: npx tsx prisma/seeds/seed-users.ts
 */

import { config } from 'dotenv';
config();

import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = 'password123';

async function main() {
  console.log('🚀 Seeding Users and Employees...\n');

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // ========================================
  // EMPLOYEES
  // ========================================
  console.log('👤 Creating/updating employees...');

  const adminEmployee = await prisma.employee.upsert({
    where: { workEmail: 'nhlpkgx@gmail.com' },
    update: {},
    create: {
      systemId: crypto.randomUUID(),
      id: 'NV001',
      fullName: 'Quản trị viên',
      workEmail: 'nhlpkgx@gmail.com',
      phone: '0901234567',
      gender: 'MALE',
      employeeType: 'FULLTIME',
      employmentStatus: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      baseSalary: 20000000,
      createdBy: 'SYSTEM',
    },
  });
  console.log(`   ✅ Admin employee: ${adminEmployee.fullName} (${adminEmployee.id})`);

  const salesEmployee = await prisma.employee.upsert({
    where: { id: 'NV002' },
    update: {},
    create: {
      systemId: crypto.randomUUID(),
      id: 'NV002',
      fullName: 'Nhân viên bán hàng',
      workEmail: 'sales@erp.local',
      phone: '0901234568',
      gender: 'FEMALE',
      employeeType: 'FULLTIME',
      employmentStatus: 'ACTIVE',
      startDate: new Date('2024-01-15'),
      baseSalary: 12000000,
      createdBy: 'SYSTEM',
    },
  });
  console.log(`   ✅ Sales employee: ${salesEmployee.fullName} (${salesEmployee.id})`);

  // ========================================
  // USERS
  // ========================================
  console.log('\n🔐 Creating users...');

  const adminUser = await prisma.user.upsert({
    where: { email: 'nhlpkgx@gmail.com' },
    update: {
      password: hashedPassword,
      employeeId: adminEmployee.systemId,
    },
    create: {
      systemId: crypto.randomUUID(),
      email: 'nhlpkgx@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      employeeId: adminEmployee.systemId,
    },
  });
  console.log(`   ✅ Admin user: ${adminUser.email} (role: ${adminUser.role})`);

  const salesUser = await prisma.user.upsert({
    where: { email: 'sales@erp.local' },
    update: {
      password: hashedPassword,
      employeeId: salesEmployee.systemId,
    },
    create: {
      systemId: crypto.randomUUID(),
      email: 'sales@erp.local',
      password: hashedPassword,
      role: 'STAFF',
      isActive: true,
      employeeId: salesEmployee.systemId,
    },
  });
  console.log(`   ✅ Sales user: ${salesUser.email} (role: ${salesUser.role})`);

  // ========================================
  // SUMMARY
  // ========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 SEED COMPLETED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Users:');
  console.log(`   • nhlpkgx@gmail.com / ${DEFAULT_PASSWORD} (ADMIN)`);
  console.log(`   • sales@erp.local / ${DEFAULT_PASSWORD} (STAFF)`);
  console.log('Employees:');
  console.log(`   • NV001 - Quản trị viên`);
  console.log(`   • NV002 - Nhân viên bán hàng`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
