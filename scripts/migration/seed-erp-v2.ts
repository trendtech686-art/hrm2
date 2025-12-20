import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import { UserRole, Gender, EmployeeStatus } from '../src/generated/prisma/enums'
import { Pool } from 'pg'

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://erp_user:erp_password@localhost:5432/erp_dev'
})

// Create adapter and client
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// ============ SEED DATA FROM HRM2 ============

const branches = [
  { code: 'CN000001', name: 'Trụ sở chính', address: '123 Đường ABC, Quận 1, TP.HCM', phone: '02833334444' },
  { code: 'CN000002', name: 'Chi nhánh Hà Nội', address: '456 Đường XYZ, Quận Hai Bà Trưng, Hà Nội', phone: '02488889999' },
]

const departments = [
  { code: 'DEP000001', name: 'Kỹ thuật', description: 'Phòng Kỹ thuật' },
  { code: 'DEP000002', name: 'Kinh doanh', description: 'Phòng Kinh doanh' },
  { code: 'DEP000003', name: 'Nhân sự', description: 'Phòng Nhân sự' },
  { code: 'DEP000004', name: 'Marketing', description: 'Phòng Marketing' },
  { code: 'DEP000005', name: 'Kế toán', description: 'Phòng Kế toán' },
]

const jobTitles = [
  { code: 'CV000001', name: 'Nhân viên', description: 'Thực hiện các công việc chuyên môn được giao.' },
  { code: 'CV000002', name: 'Trưởng nhóm', description: 'Quản lý một nhóm nhỏ và chịu trách nhiệm về kết quả của nhóm.' },
  { code: 'CV000003', name: 'Trưởng phòng', description: 'Quản lý toàn bộ hoạt động của một phòng ban.' },
  { code: 'CV000004', name: 'Giám đốc', description: 'Chịu trách nhiệm quản lý cấp cao nhất của một khối hoặc toàn bộ công ty.' },
  { code: 'CV000005', name: 'Thực tập sinh', description: 'Nhân viên đang trong giai đoạn học việc và thử việc.' },
  { code: 'CV000006', name: 'Admin', description: 'Chịu trách nhiệm các công việc hành chính.' },
]

const categories = [
  { code: 'CAT001', name: 'Laptop', description: 'Máy tính xách tay' },
  { code: 'CAT002', name: 'Điện thoại', description: 'Điện thoại di động' },
  { code: 'CAT003', name: 'Phụ kiện', description: 'Phụ kiện công nghệ' },
  { code: 'CAT004', name: 'Bàn phím', description: 'Bàn phím cơ và phụ kiện' },
]

const brands = [
  { code: 'BRAND001', name: 'Apple', description: 'Apple Inc.' },
  { code: 'BRAND002', name: 'Dell', description: 'Dell Technologies' },
  { code: 'BRAND003', name: 'Logitech', description: 'Logitech International' },
  { code: 'BRAND004', name: 'Keychron', description: 'Keychron' },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productStock.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.department.deleteMany()
  await prisma.jobTitle.deleteMany()
  await prisma.branch.deleteMany()
  await prisma.customer.deleteMany()

  // Seed Branches
  console.log('🏢 Seeding branches...')
  const createdBranches: Record<string, { id: string }> = {}
  for (const branch of branches) {
    const created = await prisma.branch.create({ data: branch })
    createdBranches[branch.code] = created
  }

  // Seed Departments
  console.log('🏛️  Seeding departments...')
  const createdDepartments: Record<string, { id: string }> = {}
  for (const dept of departments) {
    const created = await prisma.department.create({ data: dept })
    createdDepartments[dept.code] = created
  }

  // Seed Job Titles
  console.log('💼 Seeding job titles...')
  const createdJobTitles: Record<string, { id: string }> = {}
  for (const jt of jobTitles) {
    const created = await prisma.jobTitle.create({ data: jt })
    createdJobTitles[jt.code] = created
  }

  // Seed Categories
  console.log('📁 Seeding categories...')
  const createdCategories: Record<string, { id: string }> = {}
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat })
    createdCategories[cat.code] = created
  }

  // Seed Brands
  console.log('🏷️  Seeding brands...')
  const createdBrands: Record<string, { id: string }> = {}
  for (const brand of brands) {
    const created = await prisma.brand.create({ data: brand })
    createdBrands[brand.code] = created
  }

  // Seed Employees
  console.log('👥 Seeding employees...')
  const employees = [
    {
      code: 'EMP000001',
      firstName: 'Văn A',
      lastName: 'Nguyễn',
      fullName: 'Nguyễn Văn A',
      email: 'nva@example.com',
      phone: '0901234567',
      gender: Gender.MALE,
      status: EmployeeStatus.ACTIVE,
      departmentId: createdDepartments['DEP000002'].id,
      jobTitleId: createdJobTitles['CV000004'].id,
      branchId: createdBranches['CN000001'].id,
      hireDate: new Date('2020-01-01'),
    },
    {
      code: 'EMP000002',
      firstName: 'Thị B',
      lastName: 'Trần',
      fullName: 'Trần Thị B',
      email: 'ttb@example.com',
      phone: '0912345678',
      gender: Gender.FEMALE,
      status: EmployeeStatus.ACTIVE,
      departmentId: createdDepartments['DEP000002'].id,
      jobTitleId: createdJobTitles['CV000003'].id,
      branchId: createdBranches['CN000001'].id,
      hireDate: new Date('2019-01-01'),
    },
    {
      code: 'EMP000003',
      firstName: 'Văn C',
      lastName: 'Lê',
      fullName: 'Lê Văn C',
      email: 'lvc@example.com',
      phone: '0923456789',
      gender: Gender.MALE,
      status: EmployeeStatus.ACTIVE,
      departmentId: createdDepartments['DEP000001'].id,
      jobTitleId: createdJobTitles['CV000001'].id,
      branchId: createdBranches['CN000002'].id,
      hireDate: new Date('2021-01-01'),
    },
  ]

  const createdEmployees: Record<string, { id: string }> = {}
  for (const emp of employees) {
    const created = await prisma.employee.create({ data: emp })
    createdEmployees[emp.code] = created
  }

  // Seed Users (linked to employees)
  console.log('🔐 Seeding users...')
  await prisma.user.createMany({
    data: [
      { email: 'admin@example.com', password: 'admin123', role: UserRole.ADMIN, employeeId: createdEmployees['EMP000001'].id },
      { email: 'manager@example.com', password: 'manager123', role: UserRole.MANAGER, employeeId: createdEmployees['EMP000002'].id },
      { email: 'staff@example.com', password: 'staff123', role: UserRole.STAFF, employeeId: createdEmployees['EMP000003'].id },
    ],
  })

  // Seed Customers
  console.log('👤 Seeding customers...')
  const customers = [
    { code: 'KH000001', name: 'Công ty Cổ phần Bất động sản Hưng Thịnh', phone: '0901112233', email: 'info@hungthinhcorp.vn', address: 'TP.HCM' },
    { code: 'KH000002', name: 'Chuỗi cà phê The Coffee House', phone: '02871087088', email: 'contact@thecoffeehouse.vn', address: 'TP.HCM' },
    { code: 'KH000003', name: 'Anh Trần Minh Hoàng', phone: '0987123456', email: 'tmhoang.dev@gmail.com', address: 'Hà Nội' },
  ]
  await prisma.customer.createMany({ data: customers })

  // Seed Products
  console.log('📦 Seeding products...')
  const products = [
    { code: 'SP000001', name: 'Laptop Dell Inspiron 15', price: 15000000, costPrice: 12000000, unit: 'Chiếc', categoryId: createdCategories['CAT001'].id, brandId: createdBrands['BRAND002'].id },
    { code: 'SP000002', name: 'Chuột Logitech MX Master 3', price: 2000000, costPrice: 1500000, unit: 'Chiếc', categoryId: createdCategories['CAT003'].id, brandId: createdBrands['BRAND003'].id },
    { code: 'SP000003', name: 'Điện thoại iPhone 15 Pro', price: 28000000, costPrice: 25000000, unit: 'Chiếc', categoryId: createdCategories['CAT002'].id, brandId: createdBrands['BRAND001'].id },
    { code: 'SP000004', name: 'Ốp lưng iPhone 15 Pro', price: 300000, costPrice: 200000, unit: 'Chiếc', categoryId: createdCategories['CAT003'].id, brandId: createdBrands['BRAND001'].id },
    { code: 'SP000005', name: 'Máy tính bảng iPad Air', price: 18000000, costPrice: 15000000, unit: 'Chiếc', categoryId: createdCategories['CAT002'].id, brandId: createdBrands['BRAND001'].id },
    { code: 'SP000006', name: 'Đồng hồ Apple Watch Series 9', price: 12000000, costPrice: 10000000, unit: 'Chiếc', categoryId: createdCategories['CAT003'].id, brandId: createdBrands['BRAND001'].id },
    { code: 'SP000007', name: 'Tai nghe AirPods Pro', price: 6000000, costPrice: 5000000, unit: 'Chiếc', categoryId: createdCategories['CAT003'].id, brandId: createdBrands['BRAND001'].id },
    { code: 'SP000008', name: 'Bàn phím cơ Keychron K2', price: 2500000, costPrice: 2000000, unit: 'Chiếc', categoryId: createdCategories['CAT004'].id, brandId: createdBrands['BRAND004'].id },
  ]
  
  for (const prod of products) {
    await prisma.product.create({ data: prod })
  }

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
