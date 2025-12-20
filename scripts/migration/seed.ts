/**
 * SEED SCRIPT: Sample data for development/testing
 * 
 * Usage: npx tsx scripts/migration/seed.ts
 * Or: npx prisma db seed (if configured in package.json)
 */

import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcryptjs'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function seed() {
  console.log('🌱 Seeding database with sample data...\n')

  // ===== 1. Branches =====
  console.log('📁 Creating branches...')
  const branchHN = await prisma.branch.upsert({
    where: { id: 'CN001' },
    update: {},
    create: {
      id: 'CN001',
      name: 'Chi nhánh Hà Nội',
      address: '123 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
      phone: '024-1234-5678',
      isDefault: true,
      province: 'Hà Nội',
      provinceId: '01',
    },
  })

  const branchHCM = await prisma.branch.upsert({
    where: { id: 'CN002' },
    update: {},
    create: {
      id: 'CN002',
      name: 'Chi nhánh Hồ Chí Minh',
      address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '028-8765-4321',
      isDefault: false,
      province: 'Hồ Chí Minh',
      provinceId: '79',
    },
  })
  console.log('  ✅ Created 2 branches')

  // ===== 2. Departments =====
  console.log('📁 Creating departments...')
  const deptSales = await prisma.department.upsert({
    where: { id: 'PB001' },
    update: {},
    create: {
      id: 'PB001',
      name: 'Phòng Kinh doanh',
      description: 'Phòng kinh doanh và bán hàng',
    },
  })

  const deptIT = await prisma.department.upsert({
    where: { id: 'PB002' },
    update: {},
    create: {
      id: 'PB002',
      name: 'Phòng IT',
      description: 'Phòng công nghệ thông tin',
    },
  })

  const deptHR = await prisma.department.upsert({
    where: { id: 'PB003' },
    update: {},
    create: {
      id: 'PB003',
      name: 'Phòng Nhân sự',
      description: 'Phòng nhân sự và hành chính',
    },
  })

  const deptWarehouse = await prisma.department.upsert({
    where: { id: 'PB004' },
    update: {},
    create: {
      id: 'PB004',
      name: 'Phòng Kho vận',
      description: 'Phòng quản lý kho và vận chuyển',
    },
  })
  console.log('  ✅ Created 4 departments')

  // ===== 3. Job Titles =====
  console.log('📁 Creating job titles...')
  const jtDirector = await prisma.jobTitle.upsert({
    where: { id: 'CV001' },
    update: {},
    create: { id: 'CV001', name: 'Giám đốc', description: 'Ban giám đốc' },
  })

  const jtManager = await prisma.jobTitle.upsert({
    where: { id: 'CV002' },
    update: {},
    create: { id: 'CV002', name: 'Trưởng phòng', description: 'Quản lý phòng ban' },
  })

  const jtStaff = await prisma.jobTitle.upsert({
    where: { id: 'CV003' },
    update: {},
    create: { id: 'CV003', name: 'Nhân viên', description: 'Nhân viên thường' },
  })

  const jtIntern = await prisma.jobTitle.upsert({
    where: { id: 'CV004' },
    update: {},
    create: { id: 'CV004', name: 'Thực tập sinh', description: 'Thực tập sinh' },
  })
  console.log('  ✅ Created 4 job titles')

  // ===== 4. Payment Methods =====
  console.log('📁 Creating payment methods...')
  await prisma.paymentMethod.upsert({
    where: { id: 'TT001' },
    update: {},
    create: { id: 'TT001', name: 'Tiền mặt', isActive: true },
  })
  await prisma.paymentMethod.upsert({
    where: { id: 'TT002' },
    update: {},
    create: { id: 'TT002', name: 'Chuyển khoản', isActive: true },
  })
  await prisma.paymentMethod.upsert({
    where: { id: 'TT003' },
    update: {},
    create: { id: 'TT003', name: 'Thẻ tín dụng', isActive: true },
  })
  await prisma.paymentMethod.upsert({
    where: { id: 'TT004' },
    update: {},
    create: { id: 'TT004', name: 'COD', isActive: true },
  })
  console.log('  ✅ Created 4 payment methods')

  // ===== 5. Employees =====
  console.log('📁 Creating employees...')
  const admin = await prisma.employee.upsert({
    where: { id: 'NV001' },
    update: {},
    create: {
      id: 'NV001',
      fullName: 'Nguyễn Văn Admin',
      gender: 'MALE',
      phone: '0901234567',
      workEmail: 'admin@erp.local',
      branchId: branchHN.systemId,
      departmentId: deptIT.systemId,
      jobTitleId: jtDirector.systemId,
      employeeType: 'FULLTIME',
      employmentStatus: 'ACTIVE',
      role: 'Admin',
      baseSalary: 50000000,
    },
  })

  const salesManager = await prisma.employee.upsert({
    where: { id: 'NV002' },
    update: {},
    create: {
      id: 'NV002',
      fullName: 'Trần Thị Sales',
      gender: 'FEMALE',
      phone: '0907654321',
      workEmail: 'sales@erp.local',
      branchId: branchHN.systemId,
      departmentId: deptSales.systemId,
      jobTitleId: jtManager.systemId,
      employeeType: 'FULLTIME',
      employmentStatus: 'ACTIVE',
      role: 'Manager',
      baseSalary: 30000000,
    },
  })

  const staffHR = await prisma.employee.upsert({
    where: { id: 'NV003' },
    update: {},
    create: {
      id: 'NV003',
      fullName: 'Lê Văn HR',
      gender: 'MALE',
      phone: '0912345678',
      workEmail: 'hr@erp.local',
      branchId: branchHN.systemId,
      departmentId: deptHR.systemId,
      jobTitleId: jtStaff.systemId,
      employeeType: 'FULLTIME',
      employmentStatus: 'ACTIVE',
      role: 'Nhân viên',
      baseSalary: 15000000,
    },
  })

  const warehouse = await prisma.employee.upsert({
    where: { id: 'NV004' },
    update: {},
    create: {
      id: 'NV004',
      fullName: 'Phạm Thị Kho',
      gender: 'FEMALE',
      phone: '0918765432',
      workEmail: 'warehouse@erp.local',
      branchId: branchHCM.systemId,
      departmentId: deptWarehouse.systemId,
      jobTitleId: jtStaff.systemId,
      employeeType: 'FULLTIME',
      employmentStatus: 'ACTIVE',
      role: 'Nhân viên',
      baseSalary: 12000000,
    },
  })
  console.log('  ✅ Created 4 employees')

  // ===== 6. Users =====
  console.log('📁 Creating users...')
  const passwordHash = await bcrypt.hash('123456', 10)

  await prisma.user.upsert({
    where: { email: 'admin@erp.local' },
    update: {},
    create: {
      email: 'admin@erp.local',
      password: passwordHash,
      role: 'ADMIN',
      isActive: true,
      employeeId: admin.systemId,
    },
  })

  await prisma.user.upsert({
    where: { email: 'sales@erp.local' },
    update: {},
    create: {
      email: 'sales@erp.local',
      password: passwordHash,
      role: 'MANAGER',
      isActive: true,
      employeeId: salesManager.systemId,
    },
  })

  await prisma.user.upsert({
    where: { email: 'staff@erp.local' },
    update: {},
    create: {
      email: 'staff@erp.local',
      password: passwordHash,
      role: 'STAFF',
      isActive: true,
      employeeId: staffHR.systemId,
    },
  })
  console.log('  ✅ Created 3 users (password: 123456)')

  // ===== 7. Brands =====
  console.log('📁 Creating brands...')
  const brandApple = await prisma.brand.upsert({
    where: { id: 'TH001' },
    update: {},
    create: {
      id: 'TH001',
      name: 'Apple',
      description: 'Thương hiệu công nghệ Mỹ',
      website: 'https://apple.com',
    },
  })

  const brandSamsung = await prisma.brand.upsert({
    where: { id: 'TH002' },
    update: {},
    create: {
      id: 'TH002',
      name: 'Samsung',
      description: 'Thương hiệu điện tử Hàn Quốc',
      website: 'https://samsung.com',
    },
  })

  const brandXiaomi = await prisma.brand.upsert({
    where: { id: 'TH003' },
    update: {},
    create: {
      id: 'TH003',
      name: 'Xiaomi',
      description: 'Thương hiệu công nghệ Trung Quốc',
      website: 'https://xiaomi.com',
    },
  })
  console.log('  ✅ Created 3 brands')

  // ===== 8. Categories =====
  console.log('📁 Creating categories...')
  const catPhone = await prisma.category.upsert({
    where: { id: 'DM001' },
    update: {},
    create: {
      id: 'DM001',
      name: 'Điện thoại',
      description: 'Điện thoại di động và smartphone',
    },
  })

  const catLaptop = await prisma.category.upsert({
    where: { id: 'DM002' },
    update: {},
    create: {
      id: 'DM002',
      name: 'Laptop',
      description: 'Máy tính xách tay',
    },
  })

  const catAccessory = await prisma.category.upsert({
    where: { id: 'DM003' },
    update: {},
    create: {
      id: 'DM003',
      name: 'Phụ kiện',
      description: 'Phụ kiện điện thoại và máy tính',
    },
  })
  console.log('  ✅ Created 3 categories')

  // ===== 9. Products =====
  console.log('📁 Creating products...')
  const iphone = await prisma.product.upsert({
    where: { id: 'SP001' },
    update: {},
    create: {
      id: 'SP001',
      name: 'iPhone 15 Pro Max 256GB',
      description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP',
      unit: 'Cái',
      costPrice: 28000000,
      sellingPrice: 32990000,
      brandId: brandApple.systemId,
      status: 'ACTIVE',
      isStockTracked: true,
      warrantyPeriodMonths: 12,
    },
  })

  const galaxy = await prisma.product.upsert({
    where: { id: 'SP002' },
    update: {},
    create: {
      id: 'SP002',
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Galaxy S24 Ultra với camera 200MP, S-Pen',
      unit: 'Cái',
      costPrice: 25000000,
      sellingPrice: 29990000,
      brandId: brandSamsung.systemId,
      status: 'ACTIVE',
      isStockTracked: true,
      warrantyPeriodMonths: 12,
    },
  })

  const macbook = await prisma.product.upsert({
    where: { id: 'SP003' },
    update: {},
    create: {
      id: 'SP003',
      name: 'MacBook Pro 14" M3 Pro',
      description: 'MacBook Pro với chip M3 Pro, 18GB RAM',
      unit: 'Cái',
      costPrice: 45000000,
      sellingPrice: 52990000,
      brandId: brandApple.systemId,
      status: 'ACTIVE',
      isStockTracked: true,
      warrantyPeriodMonths: 24,
    },
  })

  const airpods = await prisma.product.upsert({
    where: { id: 'SP004' },
    update: {},
    create: {
      id: 'SP004',
      name: 'AirPods Pro 2',
      description: 'Tai nghe AirPods Pro thế hệ 2 với USB-C',
      unit: 'Cái',
      costPrice: 5000000,
      sellingPrice: 6490000,
      brandId: brandApple.systemId,
      status: 'ACTIVE',
      isStockTracked: true,
      warrantyPeriodMonths: 12,
    },
  })
  console.log('  ✅ Created 4 products')

  // Product-Category relations
  await prisma.productCategory.upsert({
    where: { productId_categoryId: { productId: iphone.systemId, categoryId: catPhone.systemId } },
    update: {},
    create: { productId: iphone.systemId, categoryId: catPhone.systemId },
  })
  await prisma.productCategory.upsert({
    where: { productId_categoryId: { productId: galaxy.systemId, categoryId: catPhone.systemId } },
    update: {},
    create: { productId: galaxy.systemId, categoryId: catPhone.systemId },
  })
  await prisma.productCategory.upsert({
    where: { productId_categoryId: { productId: macbook.systemId, categoryId: catLaptop.systemId } },
    update: {},
    create: { productId: macbook.systemId, categoryId: catLaptop.systemId },
  })
  await prisma.productCategory.upsert({
    where: { productId_categoryId: { productId: airpods.systemId, categoryId: catAccessory.systemId } },
    update: {},
    create: { productId: airpods.systemId, categoryId: catAccessory.systemId },
  })

  // ===== 10. Suppliers =====
  console.log('📁 Creating suppliers...')
  await prisma.supplier.upsert({
    where: { id: 'NCC001' },
    update: {},
    create: {
      id: 'NCC001',
      name: 'FPT Distribution',
      phone: '024-3562-6000',
      email: 'sales@fpt.com.vn',
      address: '17 Duy Tân, Cầu Giấy, Hà Nội',
      contactPerson: 'Nguyễn Văn A',
      isActive: true,
    },
  })

  await prisma.supplier.upsert({
    where: { id: 'NCC002' },
    update: {},
    create: {
      id: 'NCC002',
      name: 'Digiworld Corporation',
      phone: '028-3636-6666',
      email: 'info@digiworld.com.vn',
      address: '63 Điện Biên Phủ, Đa Kao, Quận 1, TP.HCM',
      contactPerson: 'Trần Thị B',
      isActive: true,
    },
  })
  console.log('  ✅ Created 2 suppliers')

  // ===== 11. Customers =====
  console.log('📁 Creating customers...')
  await prisma.customer.upsert({
    where: { id: 'KH001' },
    update: {},
    create: {
      id: 'KH001',
      name: 'Công ty TNHH ABC',
      email: 'contact@abc.vn',
      phone: '024-1234-5678',
      company: 'Công ty TNHH ABC',
      taxCode: '0100000001',
      status: 'ACTIVE',
      lifecycleStage: 'REPEAT',
    },
  })

  await prisma.customer.upsert({
    where: { id: 'KH002' },
    update: {},
    create: {
      id: 'KH002',
      name: 'Nguyễn Văn Khách',
      email: 'khach@gmail.com',
      phone: '0909123456',
      status: 'ACTIVE',
      lifecycleStage: 'NEW',
    },
  })

  await prisma.customer.upsert({
    where: { id: 'KH003' },
    update: {},
    create: {
      id: 'KH003',
      name: 'Trần Thị VIP',
      email: 'vip@company.vn',
      phone: '0918765432',
      company: 'Tập đoàn XYZ',
      status: 'ACTIVE',
      lifecycleStage: 'VIP',
      pricingLevel: 'VIP',
      defaultDiscount: 10,
    },
  })
  console.log('  ✅ Created 3 customers')

  // ===== 12. Stock Locations =====
  console.log('📁 Creating stock locations...')
  await prisma.stockLocation.upsert({
    where: { id: 'VT001' },
    update: {},
    create: {
      id: 'VT001',
      name: 'Kho Hà Nội',
      address: '123 Trần Hưng Đạo, Hà Nội',
      branchId: branchHN.systemId,
      isDefault: true,
      isActive: true,
    },
  })

  await prisma.stockLocation.upsert({
    where: { id: 'VT002' },
    update: {},
    create: {
      id: 'VT002',
      name: 'Kho Hồ Chí Minh',
      address: '456 Nguyễn Huệ, TP.HCM',
      branchId: branchHCM.systemId,
      isDefault: false,
      isActive: true,
    },
  })
  console.log('  ✅ Created 2 stock locations')

  // ===== 13. Cash Accounts =====
  console.log('📁 Creating cash accounts...')
  await prisma.cashAccount.upsert({
    where: { id: 'TK001' },
    update: {},
    create: {
      id: 'TK001',
      name: 'Quỹ tiền mặt HN',
      type: 'CASH',
      branchId: branchHN.systemId,
      balance: 100000000,
      isDefault: true,
      isActive: true,
    },
  })

  await prisma.cashAccount.upsert({
    where: { id: 'TK002' },
    update: {},
    create: {
      id: 'TK002',
      name: 'Vietcombank HN',
      type: 'BANK',
      accountNumber: '0011002233445',
      bankName: 'Vietcombank',
      branchId: branchHN.systemId,
      balance: 500000000,
      isDefault: false,
      isActive: true,
    },
  })
  console.log('  ✅ Created 2 cash accounts')

  // ===== 14. ID Counters =====
  console.log('📁 Creating ID counters...')
  const counters = [
    { entityType: 'employee', prefix: 'NV', currentValue: 4 },
    { entityType: 'customer', prefix: 'KH', currentValue: 3 },
    { entityType: 'product', prefix: 'SP', currentValue: 4 },
    { entityType: 'order', prefix: 'DH', currentValue: 0 },
    { entityType: 'branch', prefix: 'CN', currentValue: 2 },
    { entityType: 'department', prefix: 'PB', currentValue: 4 },
    { entityType: 'supplier', prefix: 'NCC', currentValue: 2 },
    { entityType: 'brand', prefix: 'TH', currentValue: 3 },
    { entityType: 'category', prefix: 'DM', currentValue: 3 },
  ]

  for (const counter of counters) {
    await prisma.idCounter.upsert({
      where: { entityType: counter.entityType },
      update: { currentValue: counter.currentValue },
      create: counter,
    })
  }
  console.log('  ✅ Created ID counters')

  // ===== Summary =====
  console.log('\n' + '='.repeat(50))
  console.log('🌱 SEED COMPLETED!')
  console.log('='.repeat(50))
  console.log('\n📋 Test accounts:')
  console.log('   admin@erp.local / 123456 (Admin)')
  console.log('   sales@erp.local / 123456 (Manager)')
  console.log('   staff@erp.local / 123456 (Staff)')
  console.log('='.repeat(50))
}

// Run
seed()
  .catch((error) => {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
