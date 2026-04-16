/**
 * Seed Users and Employees
 * Dữ liệu lấy từ DB gốc (production).
 * SystemId cố định để seed idempotent.
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

// Dữ liệu từ DB gốc — systemId cố định
const EMPLOYEES = [
  {
    systemId: 'NV000001',
    id: 'NV000001',
    fullName: 'Nguyễn Hải Lăng',
    workEmail: 'nhlpkgx@gmail.com',
    phone: '0981239686',
    gender: 'MALE' as const,
    role: 'Admin',
    employeeType: 'FULLTIME' as const,
    employmentStatus: 'ACTIVE' as const,
  },
  {
    systemId: 'NV000002',
    id: 'NV000002',
    fullName: 'Nguyễn Thị Ngọc Lan',
    workEmail: 'lanbenho9397@gmail.com',
    phone: '0971569398',
    gender: 'FEMALE' as const,
    role: 'Admin',
    employeeType: 'FULLTIME' as const,
    employmentStatus: 'ACTIVE' as const,
  },
  {
    systemId: 'NV000003',
    id: 'NV000003',
    fullName: 'Dũng',
    workEmail: 'dung@gmail.com',
    phone: '0335282209',
    gender: 'MALE' as const,
    role: 'Warehouse',
    employeeType: 'FULLTIME' as const,
    employmentStatus: 'ACTIVE' as const,
  },
  {
    systemId: 'NV000004',
    id: 'NV000004',
    fullName: 'Hoàng Anh',
    workEmail: 'hoanganh@gmail.com',
    phone: '0976845297',
    gender: 'MALE' as const,
    role: 'Warehouse',
    employeeType: 'FULLTIME' as const,
    employmentStatus: 'ACTIVE' as const,
  },
];

const USERS = [
  {
    systemId: '606cb5bf-7956-473a-870a-f976dd65a6d5',
    email: 'nhlpkgx@gmail.com',
    role: 'ADMIN' as const,
    employeeSystemId: 'NV000001',
  },
];

async function main() {
  console.log('🚀 Seeding Users and Employees...\n');

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // ========================================
  // EMPLOYEES
  // ========================================
  console.log('👤 Creating/updating employees...');

  for (const emp of EMPLOYEES) {
    const result = await prisma.employee.upsert({
      where: { id: emp.id },
      update: { 
        fullName: emp.fullName,
        workEmail: emp.workEmail,
        phone: emp.phone,
        role: emp.role,
      },
      create: {
        systemId: emp.systemId,
        id: emp.id,
        fullName: emp.fullName,
        workEmail: emp.workEmail,
        phone: emp.phone,
        gender: emp.gender,
        employeeType: emp.employeeType,
        employmentStatus: emp.employmentStatus,
        role: emp.role,
        createdBy: 'SYSTEM',
      },
    });
    console.log(`   ✅ Employee: ${result.fullName} (${result.id}) — ${emp.role}`);
  }

  // ========================================
  // USERS
  // ========================================
  console.log('\n🔐 Creating/updating users...');

  for (const usr of USERS) {
    const result = await prisma.user.upsert({
      where: { email: usr.email },
      update: {
        password: hashedPassword,
        employeeId: usr.employeeSystemId,
      },
      create: {
        systemId: usr.systemId,
        email: usr.email,
        password: hashedPassword,
        role: usr.role,
        isActive: true,
        employeeId: usr.employeeSystemId,
      },
    });
    console.log(`   ✅ User: ${result.email} (role: ${result.role})`);
  }

  // ========================================
  // SUMMARY
  // ========================================
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 SEED COMPLETED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Employees:');
  for (const emp of EMPLOYEES) {
    console.log(`   • ${emp.id} - ${emp.fullName} (${emp.role})`);
  }
  console.log('Users:');
  for (const usr of USERS) {
    console.log(`   • ${usr.email} / ${DEFAULT_PASSWORD} (${usr.role})`);
  }
}

export async function seedUsers() {
  await main();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
