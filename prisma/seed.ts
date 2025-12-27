import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Helper functions
function generateSystemId(): string {
  return randomUUID();
}

function generateBusinessId(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(3, '0')}`;
}

function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min: number, max: number, decimals = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Vietnamese name generators
const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const middleNames = ['Văn', 'Thị', 'Hữu', 'Minh', 'Thanh', 'Quốc', 'Đức', 'Hoàng', 'Ngọc', 'Thành', 'Xuân', 'Kim', 'Anh', 'Thu', 'Hải', 'Phương'];
const firstNames = ['An', 'Bình', 'Chi', 'Dung', 'Em', 'Phong', 'Giang', 'Hà', 'Hùng', 'Khoa', 'Lan', 'Minh', 'Nam', 'Oanh', 'Phúc', 'Quân', 'Sơn', 'Tâm', 'Uyên', 'Việt', 'Xuân', 'Yến', 'Hải', 'Thảo', 'Trang', 'Tuấn', 'Long', 'Hiếu', 'Đạt', 'Hưng'];

function generateVietnameseName(): string {
  return `${randomElement(lastNames)} ${randomElement(middleNames)} ${randomElement(firstNames)}`;
}

function generateEmail(name: string, domain: string): string {
  const normalized = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/\s+/g, '.')
    + randomInt(1, 99);
  return `${normalized}@${domain}`;
}

function generatePhone(): string {
  const prefixes = ['090', '091', '093', '094', '096', '097', '098', '086', '083', '084', '085', '088', '089'];
  return `${randomElement(prefixes)}${randomInt(1000000, 9999999)}`;
}

// Product names
const productCategories = ['Laptop', 'Điện thoại', 'Máy tính bảng', 'Màn hình', 'Bàn phím', 'Chuột', 'Tai nghe', 'Loa', 'Webcam', 'Ổ cứng', 'USB', 'Cáp sạc', 'Pin sạc dự phòng', 'Ốp lưng', 'Miếng dán màn hình'];
const productAdjectives = ['Pro', 'Plus', 'Max', 'Ultra', 'Lite', 'Mini', 'Air', 'Elite', 'Premium', 'Basic'];

function generateProductName(): string {
  return `${randomElement(productCategories)} ${randomElement(productAdjectives)} ${randomInt(1, 20)}`;
}

// Company names
const companyTypes = ['Công ty TNHH', 'Công ty CP', 'DNTN', 'Hộ kinh doanh'];
const companyNames = ['Thành Công', 'Phát Đạt', 'Hưng Thịnh', 'Minh Quang', 'Đại Việt', 'An Phú', 'Hoàng Long', 'Vĩnh Phát', 'Tân Tiến', 'Kim Ngân', 'Phú Quý', 'Bảo Minh', 'Thái Bình', 'Nhật Minh', 'Tiến Phát'];

function generateCompanyName(): string {
  return `${randomElement(companyTypes)} ${randomElement(companyNames)} ${randomInt(1, 99)}`;
}

// Address generator
const provinces = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai', 'Long An', 'Bà Rịa - Vũng Tàu', 'Khánh Hòa'];
const streets = ['Nguyễn Huệ', 'Lê Lợi', 'Trần Hưng Đạo', 'Nguyễn Trãi', 'Lý Thường Kiệt', 'Hai Bà Trưng', 'Điện Biên Phủ', 'Võ Văn Tần', 'Nguyễn Đình Chiểu', 'Cách Mạng Tháng 8'];

function generateAddress(): object {
  return {
    street: `${randomInt(1, 500)} ${randomElement(streets)}`,
    ward: `Phường ${randomInt(1, 20)}`,
    district: `Quận ${randomInt(1, 12)}`,
    province: randomElement(provinces),
  };
}

async function seed() {
  console.log('🌱 Starting seed...\n');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️ Clearing existing data...');
  await prisma.$executeRaw`TRUNCATE TABLE "attendance_records" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "leaves" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "order_line_items" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "orders" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "customers" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "employees" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "products" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "brands" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "categories" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "departments" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "job_titles" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "branches" CASCADE`;

  // 1. Create Branches
  console.log('🏢 Creating branches...');
  const branches = await Promise.all([
    prisma.branch.create({
      data: {
        systemId: generateSystemId(),
        id: 'BR-001',
        name: 'Chi nhánh Quận 1',
        address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        phone: '028 3822 1234',
        isDefault: true,
      },
    }),
    prisma.branch.create({
      data: {
        systemId: generateSystemId(),
        id: 'BR-002',
        name: 'Chi nhánh Quận 7',
        address: '456 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh',
        phone: '028 3773 5678',
      },
    }),
    prisma.branch.create({
      data: {
        systemId: generateSystemId(),
        id: 'BR-003',
        name: 'Chi nhánh Hà Nội',
        address: '789 Lý Thường Kiệt, Phường Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội',
        phone: '024 3926 9999',
      },
    }),
  ]);
  console.log(`   ✓ Created ${branches.length} branches`);

  // 2. Create Departments
  console.log('🏛️ Creating departments...');
  const departmentData = [
    { id: 'DEP-001', name: 'Ban Giám đốc' },
    { id: 'DEP-002', name: 'Phòng Kinh doanh' },
    { id: 'DEP-003', name: 'Phòng Kỹ thuật' },
    { id: 'DEP-004', name: 'Phòng Nhân sự' },
    { id: 'DEP-005', name: 'Phòng Kế toán' },
    { id: 'DEP-006', name: 'Phòng Marketing' },
    { id: 'DEP-007', name: 'Phòng Chăm sóc khách hàng' },
    { id: 'DEP-008', name: 'Kho vận' },
  ];

  const departments = await Promise.all(
    departmentData.map((dep) =>
      prisma.department.create({
        data: {
          systemId: generateSystemId(),
          id: dep.id,
          name: dep.name,
        },
      })
    )
  );
  console.log(`   ✓ Created ${departments.length} departments`);

  // 3. Create Job Titles
  console.log('💼 Creating job titles...');
  const jobTitleData = [
    { id: 'JOB-001', name: 'Giám đốc' },
    { id: 'JOB-002', name: 'Phó Giám đốc' },
    { id: 'JOB-003', name: 'Trưởng phòng' },
    { id: 'JOB-004', name: 'Phó phòng' },
    { id: 'JOB-005', name: 'Nhân viên kinh doanh' },
    { id: 'JOB-006', name: 'Nhân viên kỹ thuật' },
    { id: 'JOB-007', name: 'Nhân viên kế toán' },
    { id: 'JOB-008', name: 'Nhân viên Marketing' },
    { id: 'JOB-009', name: 'Nhân viên CSKH' },
    { id: 'JOB-010', name: 'Nhân viên kho' },
    { id: 'JOB-011', name: 'Thực tập sinh' },
  ];

  const jobTitles = await Promise.all(
    jobTitleData.map((job) =>
      prisma.jobTitle.create({
        data: {
          systemId: generateSystemId(),
          id: job.id,
          name: job.name,
        },
      })
    )
  );
  console.log(`   ✓ Created ${jobTitles.length} job titles`);

  // 4. Create Brands
  console.log('🏷️ Creating brands...');
  const brandData = [
    { id: 'BRD-001', name: 'Apple' },
    { id: 'BRD-002', name: 'Samsung' },
    { id: 'BRD-003', name: 'Dell' },
    { id: 'BRD-004', name: 'HP' },
    { id: 'BRD-005', name: 'Lenovo' },
    { id: 'BRD-006', name: 'Asus' },
    { id: 'BRD-007', name: 'Acer' },
    { id: 'BRD-008', name: 'Sony' },
    { id: 'BRD-009', name: 'LG' },
    { id: 'BRD-010', name: 'Xiaomi' },
  ];

  const brandRecords = await Promise.all(
    brandData.map((brand) =>
      prisma.brand.create({
        data: {
          systemId: generateSystemId(),
          id: brand.id,
          name: brand.name,
        },
      })
    )
  );
  console.log(`   ✓ Created ${brandRecords.length} brands`);

  // 5. Create Categories
  console.log('📁 Creating categories...');
  const categoryData = [
    { id: 'CAT-001', name: 'Laptop' },
    { id: 'CAT-002', name: 'Điện thoại' },
    { id: 'CAT-003', name: 'Máy tính bảng' },
    { id: 'CAT-004', name: 'Phụ kiện' },
    { id: 'CAT-005', name: 'Thiết bị văn phòng' },
    { id: 'CAT-006', name: 'Gaming' },
    { id: 'CAT-007', name: 'Màn hình' },
    { id: 'CAT-008', name: 'Linh kiện' },
  ];

  const categories = await Promise.all(
    categoryData.map((cat) =>
      prisma.category.create({
        data: {
          systemId: generateSystemId(),
          id: cat.id,
          name: cat.name,
        },
      })
    )
  );
  console.log(`   ✓ Created ${categories.length} categories`);

  // 6. Create 100 Employees
  console.log('👥 Creating 100 employees...');
  const employees: any[] = [];
  const employeeTypes = ['FULLTIME', 'PROBATION', 'INTERN', 'PARTTIME'] as const;
  const genders = ['MALE', 'FEMALE'] as const;

  for (let i = 1; i <= 100; i++) {
    const fullName = generateVietnameseName();
    const dob = randomDate(new Date(1980, 0, 1), new Date(2000, 11, 31));
    const hireDate = randomDate(new Date(2020, 0, 1), new Date(2024, 11, 31));

    employees.push({
      systemId: generateSystemId(),
      id: generateBusinessId('EMP', i),
      fullName,
      dob,
      gender: randomElement(genders),
      phone: generatePhone(),
      personalEmail: generateEmail(fullName, 'gmail.com'),
      workEmail: generateEmail(fullName, 'company.com'),
      departmentId: randomElement(departments).systemId,
      jobTitleId: randomElement(jobTitles).systemId,
      branchId: randomElement(branches).systemId,
      hireDate,
      startDate: hireDate,
      employeeType: randomElement(employeeTypes),
      employmentStatus: 'ACTIVE',
      baseSalary: randomInt(8000000, 50000000),
      permanentAddress: generateAddress(),
    });
  }

  await prisma.employee.createMany({ data: employees });
  const createdEmployees = await prisma.employee.findMany();
  console.log(`   ✓ Created ${createdEmployees.length} employees`);

  // 7. Create 1000 Customers
  console.log('👤 Creating 1000 customers...');
  const customers: any[] = [];
  const customerStatuses = ['ACTIVE', 'INACTIVE'] as const;
  const lifecycleStages = ['LEAD', 'NEW', 'REPEAT', 'LOYAL', 'VIP'] as const;

  for (let i = 1; i <= 1000; i++) {
    const name = randomInt(0, 1) === 0 ? generateVietnameseName() : generateCompanyName();
    const isCompany = name.includes('Công ty') || name.includes('DNTN');

    customers.push({
      systemId: generateSystemId(),
      id: generateBusinessId('KH', i),
      name,
      email: generateEmail(name.split(' ')[0], isCompany ? 'company.vn' : 'gmail.com'),
      phone: generatePhone(),
      company: isCompany ? name : null,
      status: randomElement(customerStatuses),
      lifecycleStage: randomElement(lifecycleStages),
      addresses: generateAddress(),
      totalOrders: 0,
      totalSpent: 0,
    });
  }

  await prisma.customer.createMany({ data: customers });
  const createdCustomers = await prisma.customer.findMany();
  console.log(`   ✓ Created ${createdCustomers.length} customers`);

  // 8. Create 1000 Products
  console.log('📦 Creating 1000 products...');
  const products: any[] = [];
  const productStatuses = ['ACTIVE', 'INACTIVE'] as const;
  const productTypes = ['PHYSICAL', 'SERVICE'] as const;

  for (let i = 1; i <= 1000; i++) {
    const costPrice = randomInt(100000, 50000000);
    const sellingPrice = Math.round(costPrice * randomDecimal(1.1, 1.5));

    products.push({
      systemId: generateSystemId(),
      id: generateBusinessId('SP', i),
      sku: `SKU${String(i).padStart(5, '0')}`,
      name: `${generateProductName()} #${i}`,
      description: `Mô tả sản phẩm ${i}`,
      type: randomElement(productTypes),
      brandId: randomElement(brandRecords).systemId,
      unit: randomElement(['Cái', 'Chiếc', 'Bộ', 'Hộp']),
      costPrice,
      sellingPrice,
      status: randomElement(productStatuses),
      isStockTracked: true,
      warrantyPeriodMonths: randomElement([6, 12, 24, 36]),
    });
  }

  await prisma.product.createMany({ data: products });
  const createdProducts = await prisma.product.findMany();
  console.log(`   ✓ Created ${createdProducts.length} products`);

  // 9. Create 1000 Orders
  console.log('🛒 Creating 1000 orders...');
  const orderStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'] as const;
  const paymentStatuses = ['UNPAID', 'PARTIAL', 'PAID'] as const;

  for (let i = 1; i <= 1000; i++) {
    const customer = randomElement(createdCustomers);
    const salesperson = randomElement(createdEmployees);
    const branch = randomElement(branches);
    const orderDate = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
    const status = randomElement(orderStatuses);

    // Create 1-5 line items per order
    const numItems = randomInt(1, 5);
    const lineItems: any[] = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const product = randomElement(createdProducts);
      const quantity = randomInt(1, 10);
      const unitPrice = Number(product.sellingPrice || product.costPrice);
      const total = quantity * unitPrice;
      subtotal += total;

      lineItems.push({
        systemId: generateSystemId(),
        productId: product.systemId,
        productSku: product.sku || product.id,
        productName: product.name,
        quantity,
        unitPrice,
        discount: 0,
        tax: 0,
        total,
      });
    }

    const discount = randomInt(0, 1) === 1 ? Math.round(subtotal * randomDecimal(0.05, 0.15)) : 0;
    const shippingFee = randomElement([0, 20000, 30000, 50000]);
    const grandTotal = subtotal - discount + shippingFee;
    const paidAmount = status === 'COMPLETED' ? grandTotal : (status === 'PROCESSING' ? Math.round(grandTotal * 0.5) : 0);

    await prisma.order.create({
      data: {
        systemId: generateSystemId(),
        id: generateBusinessId('DH', i),
        customerId: customer.systemId,
        customerName: customer.name,
        branchId: branch.systemId,
        branchName: branch.name,
        salespersonId: salesperson.systemId,
        salespersonName: salesperson.fullName,
        orderDate,
        status,
        paymentStatus: paidAmount >= grandTotal ? 'PAID' : (paidAmount > 0 ? 'PARTIAL' : 'UNPAID'),
        subtotal,
        discount,
        shippingFee,
        grandTotal,
        paidAmount,
        shippingAddress: generateAddress(),
        lineItems: {
          create: lineItems,
        },
      },
    });

    if (i % 100 === 0) {
      console.log(`   ... Created ${i} orders`);
    }
  }
  console.log(`   ✓ Created 1000 orders`);

  // 10. Create Attendance Records for December 2024
  console.log('📅 Creating attendance records for December 2024...');
  const attendanceStatuses = ['PRESENT', 'LATE', 'EARLY_LEAVE', 'ABSENT', 'WORK_FROM_HOME'] as const;
  const attendanceRecords: any[] = [];

  // December 2024 working days (excluding weekends)
  const december2024 = [];
  for (let day = 1; day <= 31; day++) {
    const date = new Date(2024, 11, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      december2024.push(date);
    }
  }

  for (const employee of createdEmployees) {
    for (const date of december2024) {
      const status = randomElement(attendanceStatuses);
      let checkIn: Date | null = null;
      let checkOut: Date | null = null;
      let workHours: number | null = null;

      if (status !== 'ABSENT') {
        const checkInHour = status === 'LATE' ? randomInt(9, 10) : 8;
        const checkInMinute = status === 'LATE' ? randomInt(0, 59) : randomInt(0, 15);
        checkIn = new Date(date);
        checkIn.setHours(checkInHour, checkInMinute, 0);

        const checkOutHour = status === 'EARLY_LEAVE' ? randomInt(15, 16) : randomInt(17, 19);
        const checkOutMinute = randomInt(0, 59);
        checkOut = new Date(date);
        checkOut.setHours(checkOutHour, checkOutMinute, 0);

        workHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
      }

      attendanceRecords.push({
        systemId: generateSystemId(),
        employeeId: employee.systemId,
        date,
        checkIn,
        checkOut,
        workHours: workHours ? Number(workHours.toFixed(2)) : null,
        status,
      });
    }
  }

  // Batch insert attendance records
  const batchSize = 1000;
  for (let i = 0; i < attendanceRecords.length; i += batchSize) {
    const batch = attendanceRecords.slice(i, i + batchSize);
    await prisma.attendanceRecord.createMany({ data: batch });
    console.log(`   ... Created ${Math.min(i + batchSize, attendanceRecords.length)} attendance records`);
  }
  console.log(`   ✓ Created ${attendanceRecords.length} attendance records`);

  // 11. Create Leave Records
  console.log('🏖️ Creating leave records...');
  const leaveTypes = ['ANNUAL', 'SICK', 'UNPAID', 'OTHER'] as const;
  const leaveStatuses = ['PENDING', 'APPROVED', 'REJECTED'] as const;
  const leaves: any[] = [];

  for (let i = 0; i < 200; i++) {
    const employee = randomElement(createdEmployees);
    const startDate = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 20));
    const totalDays = randomInt(1, 5);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + totalDays - 1);

    leaves.push({
      systemId: generateSystemId(),
      id: generateBusinessId('NP', i + 1),
      employeeId: employee.systemId,
      leaveType: randomElement(leaveTypes),
      startDate,
      endDate,
      totalDays,
      reason: `Lý do nghỉ phép #${i + 1}`,
      status: randomElement(leaveStatuses),
    });
  }

  await prisma.leave.createMany({ data: leaves });
  console.log(`   ✓ Created ${leaves.length} leave records`);

  // 12. Create Users
  console.log('👤 Creating users...');
  
  // Hash password using bcrypt (same as auth.ts uses bcrypt.compare)
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@erp.local' },
    update: { password: hashedPassword },
    create: {
      systemId: generateSystemId(),
      email: 'admin@erp.local',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'sales@erp.local' },
    update: { password: hashedPassword },
    create: {
      systemId: generateSystemId(),
      email: 'sales@erp.local',
      password: hashedPassword,
      role: 'STAFF',
      isActive: true,
    },
  });

  console.log(`   ✓ Created 2 users (admin@erp.local, sales@erp.local)`);

  // Summary
  console.log('\n✅ Seed completed successfully!\n');
  console.log('Summary:');
  console.log(`   - Branches: ${branches.length}`);
  console.log(`   - Departments: ${departments.length}`);
  console.log(`   - Job Titles: ${jobTitles.length}`);
  console.log(`   - Brands: ${brandRecords.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Employees: ${createdEmployees.length}`);
  console.log(`   - Customers: ${createdCustomers.length}`);
  console.log(`   - Products: ${createdProducts.length}`);
  console.log(`   - Orders: 1000`);
  console.log(`   - Attendance Records: ${attendanceRecords.length}`);
  console.log(`   - Leave Records: ${leaves.length}`);
  console.log(`   - Users: 2 (admin@erp.local, sales@erp.local)`);
}

seed()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
