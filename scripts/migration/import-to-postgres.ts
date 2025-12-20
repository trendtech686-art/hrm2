/**
 * DATA MIGRATION SCRIPT: localStorage → PostgreSQL
 * 
 * Usage:
 * 1. Export data from browser using export-localstorage.js
 * 2. Place the exported JSON file in this directory
 * 3. Run: npx tsx scripts/migration/import-to-postgres.ts [filename.json]
 * 
 * Prerequisites:
 * - PostgreSQL running (docker-compose up -d)
 * - Prisma migrations applied (npx prisma migrate deploy)
 */

import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as fs from 'fs'
import * as path from 'path'
import * as bcrypt from 'bcryptjs'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// Get filename from command line args
const args = process.argv.slice(2)
const dataFile = args[0] || 'hrm2-data-export.json'

interface ExportedData {
  [key: string]: {
    state?: {
      data?: any[]
      items?: any[]
    }
  } | any[]
}

// Helper to extract array from zustand persist format
function extractItems(storeData: any): any[] {
  if (!storeData) return []
  if (Array.isArray(storeData)) return storeData
  if (storeData.state?.data) return storeData.state.data
  if (storeData.state?.items) return storeData.state.items
  if (storeData.state) return Object.values(storeData.state).find(v => Array.isArray(v)) || []
  return []
}

// Generate UUID if not exists
function ensureSystemId(item: any): string {
  return item.systemId || crypto.randomUUID()
}

async function importData() {
  console.log('🚀 Starting data import to PostgreSQL...\n')

  // Read export file
  const filePath = path.join(__dirname, dataFile)
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    console.log('💡 Please export data first using export-localstorage.js')
    process.exit(1)
  }

  const data: ExportedData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  console.log(`📂 Loaded export file: ${dataFile}\n`)

  // Stats
  const stats: Record<string, number> = {}

  // ===== PHASE 1: Settings / Master Data =====
  console.log('📁 PHASE 1: Importing Settings...')

  // 1.1 Branches
  const branches = extractItems(data['branches-storage'])
  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { id: branch.id },
      create: {
        systemId: ensureSystemId(branch),
        id: branch.id,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        isDefault: branch.isDefault || false,
        province: branch.province,
        provinceId: branch.provinceId,
        district: branch.district,
        districtId: branch.districtId ? parseInt(branch.districtId) : null,
        ward: branch.ward,
        wardCode: branch.wardCode,
      },
      update: {},
    })
  }
  stats['branches'] = branches.length
  console.log(`  ✅ Branches: ${branches.length}`)

  // 1.2 Departments
  const departments = extractItems(data['departments-storage'])
  for (const dept of departments) {
    await prisma.department.upsert({
      where: { id: dept.id },
      create: {
        systemId: ensureSystemId(dept),
        id: dept.id,
        name: dept.name,
        description: dept.description,
        managerId: dept.managerId,
      },
      update: {},
    })
  }
  stats['departments'] = departments.length
  console.log(`  ✅ Departments: ${departments.length}`)

  // 1.3 Job Titles
  const jobTitles = extractItems(data['job-titles-storage'])
  for (const jt of jobTitles) {
    await prisma.jobTitle.upsert({
      where: { id: jt.id },
      create: {
        systemId: ensureSystemId(jt),
        id: jt.id,
        name: jt.name,
        description: jt.description,
      },
      update: {},
    })
  }
  stats['jobTitles'] = jobTitles.length
  console.log(`  ✅ Job Titles: ${jobTitles.length}`)

  // 1.4 Payment Methods
  const paymentMethods = extractItems(data['payment-methods-storage'])
  for (const pm of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { id: pm.id },
      create: {
        systemId: ensureSystemId(pm),
        id: pm.id,
        name: pm.name,
        isActive: pm.isActive ?? true,
      },
      update: {},
    })
  }
  stats['paymentMethods'] = paymentMethods.length
  console.log(`  ✅ Payment Methods: ${paymentMethods.length}`)

  // 1.5 Pricing Policies
  const pricingPolicies = extractItems(data['pricing-storage'])
  for (const pp of pricingPolicies) {
    await prisma.pricingPolicy.upsert({
      where: { id: pp.id },
      create: {
        systemId: ensureSystemId(pp),
        id: pp.id,
        name: pp.name,
        description: pp.description,
        isDefault: pp.isDefault || false,
      },
      update: {},
    })
  }
  stats['pricingPolicies'] = pricingPolicies.length
  console.log(`  ✅ Pricing Policies: ${pricingPolicies.length}`)

  // ===== PHASE 2: Categories & Brands =====
  console.log('\n📁 PHASE 2: Importing Categories & Brands...')

  // 2.1 Brands
  const brands = extractItems(data['brands-storage'])
  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { id: brand.id },
      create: {
        systemId: ensureSystemId(brand),
        id: brand.id,
        name: brand.name,
        logo: brand.logo,
        description: brand.description,
        website: brand.website,
        thumbnail: brand.thumbnail,
        sortOrder: brand.sortOrder || 0,
      },
      update: {},
    })
  }
  stats['brands'] = brands.length
  console.log(`  ✅ Brands: ${brands.length}`)

  // 2.2 Categories (handle hierarchy)
  const categories = extractItems(data['categories-storage'])
  // First pass: create all without parent
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      create: {
        systemId: ensureSystemId(cat),
        id: cat.id,
        name: cat.name,
        description: cat.description,
        thumbnail: cat.thumbnail || cat.image,
        sortOrder: cat.sortOrder || 0,
      },
      update: {},
    })
  }
  // Second pass: update parent relations
  for (const cat of categories) {
    if (cat.parentId) {
      const parent = await prisma.category.findUnique({ where: { id: cat.parentId } })
      if (parent) {
        await prisma.category.update({
          where: { id: cat.id },
          data: { parentId: parent.systemId },
        })
      }
    }
  }
  stats['categories'] = categories.length
  console.log(`  ✅ Categories: ${categories.length}`)

  // ===== PHASE 3: Employees & Users =====
  console.log('\n📁 PHASE 3: Importing Employees...')

  const employees = extractItems(data['employees-storage'])
  for (const emp of employees) {
    // Find branch and department by id
    const branch = emp.branchId ? await prisma.branch.findUnique({ where: { id: emp.branchId } }) : null
    const dept = emp.departmentId ? await prisma.department.findUnique({ where: { id: emp.departmentId } }) : null
    const jobTitle = emp.jobTitleId ? await prisma.jobTitle.findUnique({ where: { id: emp.jobTitleId } }) : null

    const employee = await prisma.employee.upsert({
      where: { id: emp.id },
      create: {
        systemId: ensureSystemId(emp),
        id: emp.id,
        fullName: emp.fullName,
        dob: emp.dob ? new Date(emp.dob) : null,
        placeOfBirth: emp.placeOfBirth,
        gender: emp.gender || 'OTHER',
        phone: emp.phone,
        personalEmail: emp.personalEmail,
        workEmail: emp.workEmail,
        nationalId: emp.nationalId,
        nationalIdIssueDate: emp.nationalIdIssueDate ? new Date(emp.nationalIdIssueDate) : null,
        nationalIdIssuePlace: emp.nationalIdIssuePlace,
        avatarUrl: emp.avatarUrl,
        avatar: emp.avatar,
        permanentAddress: emp.permanentAddress,
        temporaryAddress: emp.temporaryAddress,
        branchId: branch?.systemId,
        departmentId: dept?.systemId,
        jobTitleId: jobTitle?.systemId,
        hireDate: emp.hireDate ? new Date(emp.hireDate) : null,
        startDate: emp.startDate ? new Date(emp.startDate) : null,
        employeeType: emp.employeeType || 'FULLTIME',
        employmentStatus: emp.employmentStatus || 'ACTIVE',
        role: emp.role || 'Nhân viên',
        baseSalary: emp.baseSalary,
        socialInsuranceSalary: emp.socialInsuranceSalary,
        positionAllowance: emp.positionAllowance,
        mealAllowance: emp.mealAllowance,
        otherAllowances: emp.otherAllowances,
        numberOfDependents: emp.numberOfDependents,
        contractNumber: emp.contractNumber,
        contractType: emp.contractType,
        bankAccountNumber: emp.bankAccountNumber,
        bankName: emp.bankName,
        bankBranch: emp.bankBranch,
        personalTaxId: emp.personalTaxId,
        socialInsuranceNumber: emp.socialInsuranceNumber,
        annualLeaveBalance: emp.annualLeaveBalance || 12,
        notes: emp.notes,
        isDeleted: emp.isDeleted || false,
      },
      update: {},
    })

    // Create user account if has email
    if (emp.workEmail) {
      await prisma.user.upsert({
        where: { email: emp.workEmail },
        create: {
          systemId: crypto.randomUUID(),
          email: emp.workEmail,
          password: await bcrypt.hash('123456', 10), // Default password
          role: emp.role === 'Admin' ? 'ADMIN' : emp.role === 'Manager' ? 'MANAGER' : 'STAFF',
          isActive: true,
          employeeId: employee.systemId,
        },
        update: {},
      })
    }
  }
  stats['employees'] = employees.length
  console.log(`  ✅ Employees: ${employees.length}`)

  // ===== PHASE 4: Customers =====
  console.log('\n📁 PHASE 4: Importing Customers...')

  const customers = extractItems(data['customers-storage'])
  for (const cust of customers) {
    await prisma.customer.upsert({
      where: { id: cust.id },
      create: {
        systemId: ensureSystemId(cust),
        id: cust.id,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        company: cust.company,
        status: cust.status || 'ACTIVE',
        taxCode: cust.taxCode,
        representative: cust.representative,
        position: cust.position,
        addresses: cust.addresses,
        currentDebt: cust.currentDebt || 0,
        maxDebt: cust.maxDebt,
        lifecycleStage: cust.lifecycleStage || 'LEAD',
        pricingLevel: cust.pricingLevel,
        defaultDiscount: cust.defaultDiscount,
        tags: cust.tags || [],
        notes: cust.notes,
        isDeleted: cust.isDeleted || false,
      },
      update: {},
    })
  }
  stats['customers'] = customers.length
  console.log(`  ✅ Customers: ${customers.length}`)

  // ===== PHASE 5: Suppliers =====
  console.log('\n📁 PHASE 5: Importing Suppliers...')

  const suppliers = extractItems(data['suppliers-storage'])
  for (const sup of suppliers) {
    await prisma.supplier.upsert({
      where: { id: sup.id },
      create: {
        systemId: ensureSystemId(sup),
        id: sup.id,
        name: sup.name,
        phone: sup.phone,
        email: sup.email,
        address: sup.address,
        taxCode: sup.taxCode,
        contactPerson: sup.contactPerson,
        bankAccount: sup.bankAccount,
        website: sup.website,
        isActive: sup.isActive ?? true,
        isDeleted: sup.isDeleted || false,
      },
      update: {},
    })
  }
  stats['suppliers'] = suppliers.length
  console.log(`  ✅ Suppliers: ${suppliers.length}`)

  // ===== PHASE 6: Products =====
  console.log('\n📁 PHASE 6: Importing Products...')

  const products = extractItems(data['products-storage'])
  for (const prod of products) {
    const brand = prod.brandId ? await prisma.brand.findUnique({ where: { id: prod.brandId } }) : null

    const product = await prisma.product.upsert({
      where: { id: prod.id },
      create: {
        systemId: ensureSystemId(prod),
        id: prod.id,
        name: prod.name,
        description: prod.description,
        shortDescription: prod.shortDescription,
        thumbnailImage: prod.thumbnailImage || prod.thumbnail,
        galleryImages: prod.galleryImages || [],
        type: prod.type || 'PHYSICAL',
        brandId: brand?.systemId,
        unit: prod.unit || 'Cái',
        costPrice: prod.costPrice || 0,
        sellingPrice: prod.sellingPrice,
        minPrice: prod.minPrice,
        taxRate: prod.taxRate,
        isStockTracked: prod.isStockTracked ?? true,
        reorderLevel: prod.reorderLevel,
        safetyStock: prod.safetyStock,
        weight: prod.weight,
        barcode: prod.barcode,
        warrantyPeriodMonths: prod.warrantyPeriodMonths || 12,
        isPublished: prod.isPublished || false,
        isFeatured: prod.isFeatured || false,
        sortOrder: prod.sortOrder,
        seoTitle: prod.seoTitle,
        seoDescription: prod.seoDescription,
        slug: prod.slug,
        status: prod.status || 'ACTIVE',
        isDeleted: prod.isDeleted || false,
      },
      update: {},
    })

    // Create category relations
    if (prod.categoryIds?.length) {
      for (const catId of prod.categoryIds) {
        const cat = await prisma.category.findUnique({ where: { id: catId } })
        if (cat) {
          await prisma.productCategory.upsert({
            where: { productId_categoryId: { productId: product.systemId, categoryId: cat.systemId } },
            create: { productId: product.systemId, categoryId: cat.systemId },
            update: {},
          })
        }
      }
    }
  }
  stats['products'] = products.length
  console.log(`  ✅ Products: ${products.length}`)

  // ===== PHASE 7: Stock Locations =====
  console.log('\n📁 PHASE 7: Importing Stock Locations...')

  const stockLocations = extractItems(data['stock-locations-storage'])
  for (const loc of stockLocations) {
    await prisma.stockLocation.upsert({
      where: { id: loc.id },
      create: {
        systemId: ensureSystemId(loc),
        id: loc.id,
        name: loc.name,
        address: loc.address,
        branchId: loc.branchId,
        description: loc.description,
        isDefault: loc.isDefault || false,
        isActive: loc.isActive ?? true,
      },
      update: {},
    })
  }
  stats['stockLocations'] = stockLocations.length
  console.log(`  ✅ Stock Locations: ${stockLocations.length}`)

  // ===== PHASE 8: Orders (skip for now - complex) =====
  console.log('\n📁 PHASE 8: Importing Orders...')
  const orders = extractItems(data['orders-storage'])
  // TODO: Implement order import with line items, payments
  stats['orders'] = orders.length
  console.log(`  ⏭️  Orders: ${orders.length} (skipped - implement separately)`)

  // ===== PHASE 9: Attendance =====
  console.log('\n📁 PHASE 9: Importing Attendance...')

  const attendance = extractItems(data['attendance-storage'])
  for (const att of attendance) {
    const employee = att.employeeId ? await prisma.employee.findUnique({ where: { id: att.employeeId } }) : null
    if (employee) {
      await prisma.attendanceRecord.upsert({
        where: { employeeId_date: { employeeId: employee.systemId, date: new Date(att.date) } },
        create: {
          systemId: ensureSystemId(att),
          employeeId: employee.systemId,
          date: new Date(att.date),
          checkIn: att.checkIn ? new Date(att.checkIn) : null,
          checkOut: att.checkOut ? new Date(att.checkOut) : null,
          workHours: att.workHours,
          status: att.status || 'PRESENT',
          notes: att.notes,
        },
        update: {},
      })
    }
  }
  stats['attendance'] = attendance.length
  console.log(`  ✅ Attendance: ${attendance.length}`)

  // ===== PHASE 10: Leaves =====
  console.log('\n📁 PHASE 10: Importing Leaves...')

  const leaves = extractItems(data['leaves-storage'])
  for (const leave of leaves) {
    const employee = leave.employeeId ? await prisma.employee.findUnique({ where: { id: leave.employeeId } }) : null
    if (employee) {
      await prisma.leave.upsert({
        where: { id: leave.id },
        create: {
          systemId: ensureSystemId(leave),
          id: leave.id,
          employeeId: employee.systemId,
          leaveType: leave.leaveType || 'ANNUAL',
          startDate: new Date(leave.startDate),
          endDate: new Date(leave.endDate),
          totalDays: leave.totalDays || 1,
          reason: leave.reason,
          status: leave.status || 'PENDING',
        },
        update: {},
      })
    }
  }
  stats['leaves'] = leaves.length
  console.log(`  ✅ Leaves: ${leaves.length}`)

  // ===== PHASE 11: Tasks =====
  console.log('\n📁 PHASE 11: Importing Tasks...')

  const tasks = extractItems(data['tasks-storage'])
  for (const task of tasks) {
    const assignee = task.assigneeId ? await prisma.employee.findUnique({ where: { id: task.assigneeId } }) : null
    const creator = task.creatorId ? await prisma.employee.findUnique({ where: { id: task.creatorId } }) : null
    
    if (creator) {
      await prisma.task.upsert({
        where: { id: task.id },
        create: {
          systemId: ensureSystemId(task),
          id: task.id,
          title: task.title,
          description: task.description,
          assigneeId: assignee?.systemId,
          creatorId: creator.systemId,
          status: task.status || 'TODO',
          priority: task.priority || 'MEDIUM',
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          tags: task.tags || [],
        },
        update: {},
      })
    }
  }
  stats['tasks'] = tasks.length
  console.log(`  ✅ Tasks: ${tasks.length}`)

  // ===== PHASE 12: Wiki =====
  console.log('\n📁 PHASE 12: Importing Wiki...')

  const wikis = extractItems(data['wiki-storage'])
  for (const wiki of wikis) {
    await prisma.wiki.upsert({
      where: { id: wiki.id },
      create: {
        systemId: ensureSystemId(wiki),
        id: wiki.id,
        slug: wiki.slug,
        title: wiki.title,
        content: wiki.content || '',
        category: wiki.category,
        tags: wiki.tags || [],
        isPublished: wiki.isPublished || false,
        viewCount: wiki.viewCount || 0,
      },
      update: {},
    })
  }
  stats['wikis'] = wikis.length
  console.log(`  ✅ Wiki: ${wikis.length}`)

  // ===== PHASE 13: Settings =====
  console.log('\n📁 PHASE 13: Importing Settings...')

  const appearance = data['appearance-storage'] as { state?: Record<string, any> } | undefined
  if (appearance?.state) {
    const settings = Object.entries(appearance.state)
    for (const [key, value] of settings) {
      if (typeof value !== 'function') {
        await prisma.setting.upsert({
          where: { key_group: { key, group: 'appearance' } },
          create: {
            systemId: crypto.randomUUID(),
            key,
            group: 'appearance',
            category: 'appearance',
            type: typeof value,
            value: value as any,
          },
          update: { value: value as any },
        })
      }
    }
  }
  console.log(`  ✅ Settings: imported`)

  // ===== Create default admin user if none exists =====
  console.log('\n📁 Creating default admin user...')
  const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  if (!adminExists) {
    await prisma.user.create({
      data: {
        systemId: crypto.randomUUID(),
        email: 'admin@erp.local',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
        isActive: true,
      },
    })
    console.log('  ✅ Created admin@erp.local (password: admin123)')
  } else {
    console.log('  ⏭️  Admin user already exists')
  }

  // ===== Summary =====
  console.log('\n' + '='.repeat(50))
  console.log('📊 IMPORT SUMMARY')
  console.log('='.repeat(50))
  Object.entries(stats).forEach(([key, count]) => {
    console.log(`  ${key}: ${count}`)
  })
  console.log('='.repeat(50))
  console.log('✅ Import completed successfully!')
}

// Run
importData()
  .catch((error) => {
    console.error('\n❌ Import failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
