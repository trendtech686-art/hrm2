/**
 * Fix payroll templates componentSystemIds
 * 
 * Problem: Seed stored componentSystemIds as metadata IDs (baseSalary, mealAllowance, bhxh...)
 * but salary components in SettingsData have different IDs (BASE_SALARY, ALLOWANCE_MEAL...)
 * and the UI uses systemId (UUID). Many needed components don't even exist.
 * 
 * Solution:
 * 1. Ensure all needed salary components exist in SettingsData
 * 2. Map template component IDs → actual systemIds
 * 3. Update payroll templates in Setting table
 */
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// Mapping from template component IDs → SettingsData records
// Each entry defines the salary component that should exist
const COMPONENT_DEFINITIONS: Record<string, {
  id: string
  name: string
  type: string
  metadata: Record<string, unknown>
}> = {
  // === EARNINGS ===
  baseSalary: {
    id: 'COMP_BASE_SALARY',
    name: 'Lương cơ bản',
    type: 'earning',
    metadata: { category: 'earning', type: 'fixed', amount: 0, taxable: true, sortOrder: 1 },
  },
  positionAllowance: {
    id: 'COMP_POSITION_ALLOWANCE',
    name: 'Phụ cấp chức vụ',
    type: 'earning',
    metadata: { category: 'earning', type: 'fixed', amount: 0, taxable: true, sortOrder: 2 },
  },
  seniorityAllowance: {
    id: 'COMP_SENIORITY_ALLOWANCE',
    name: 'Phụ cấp thâm niên',
    type: 'earning',
    metadata: { category: 'earning', type: 'percent', amount: 0, taxable: true, sortOrder: 3 },
  },
  mealAllowance: {
    id: 'COMP_MEAL_ALLOWANCE',
    name: 'Phụ cấp ăn trưa',
    type: 'earning',
    metadata: { category: 'earning', type: 'fixed', amount: 730000, taxable: false, sortOrder: 4 },
  },
  transportAllowance: {
    id: 'COMP_TRANSPORT_ALLOWANCE',
    name: 'Phụ cấp đi lại',
    type: 'earning',
    metadata: { category: 'earning', type: 'fixed', amount: 500000, taxable: true, sortOrder: 5 },
  },
  phoneAllowance: {
    id: 'COMP_PHONE_ALLOWANCE',
    name: 'Phụ cấp điện thoại',
    type: 'earning',
    metadata: { category: 'earning', type: 'fixed', amount: 300000, taxable: false, sortOrder: 6 },
  },
  overtime: {
    id: 'COMP_OVERTIME',
    name: 'Lương tăng ca',
    type: 'earning',
    metadata: { category: 'earning', type: 'calculated', amount: 0, taxable: true, sortOrder: 7 },
  },
  bonus: {
    id: 'COMP_BONUS',
    name: 'Thưởng',
    type: 'earning',
    metadata: { category: 'earning', type: 'fixed', amount: 0, taxable: true, sortOrder: 8 },
  },
  commission: {
    id: 'COMP_COMMISSION',
    name: 'Hoa hồng doanh số',
    type: 'earning',
    metadata: { category: 'earning', type: 'calculated', amount: 0, taxable: true, sortOrder: 9 },
  },
  kpiBonus: {
    id: 'COMP_KPI_BONUS',
    name: 'Thưởng KPI',
    type: 'earning',
    metadata: { category: 'earning', type: 'calculated', amount: 0, taxable: true, sortOrder: 10 },
  },

  // === DEDUCTIONS ===
  pit: {
    id: 'COMP_PIT',
    name: 'Thuế TNCN',
    type: 'deduction',
    metadata: { category: 'deduction', type: 'progressive', amount: 0, taxable: false, sortOrder: 20 },
  },
  unionFee: {
    id: 'COMP_UNION_FEE',
    name: 'Phí công đoàn (1%)',
    type: 'deduction',
    metadata: { category: 'deduction', type: 'percent', rate: 0.01, amount: 0, taxable: false, sortOrder: 21 },
  },
  advance: {
    id: 'COMP_ADVANCE',
    name: 'Tạm ứng',
    type: 'deduction',
    metadata: { category: 'deduction', type: 'fixed', amount: 0, taxable: false, sortOrder: 22 },
  },
  penalty: {
    id: 'COMP_PENALTY',
    name: 'Phạt vi phạm',
    type: 'deduction',
    metadata: { category: 'deduction', type: 'fixed', amount: 0, taxable: false, sortOrder: 23 },
  },

  // === CONTRIBUTIONS (Bảo hiểm) ===
  bhxh: {
    id: 'COMP_BHXH',
    name: 'BHXH (8%)',
    type: 'contribution',
    metadata: { category: 'contribution', type: 'percent', rate: 0.08, amount: 0, taxable: false, partOfSocialInsurance: true, sortOrder: 30 },
  },
  bhyt: {
    id: 'COMP_BHYT',
    name: 'BHYT (1.5%)',
    type: 'contribution',
    metadata: { category: 'contribution', type: 'percent', rate: 0.015, amount: 0, taxable: false, partOfSocialInsurance: true, sortOrder: 31 },
  },
  bhtn: {
    id: 'COMP_BHTN',
    name: 'BHTN (1%)',
    type: 'contribution',
    metadata: { category: 'contribution', type: 'percent', rate: 0.01, amount: 0, taxable: false, partOfSocialInsurance: true, sortOrder: 32 },
  },
}

// Same template definitions as in seed
const TEMPLATE_COMPONENTS: Record<string, string[]> = {
  TEMPLATE_BASIC: ['baseSalary', 'mealAllowance', 'bhxh', 'bhyt', 'bhtn', 'pit'],
  TEMPLATE_FULL: ['baseSalary', 'positionAllowance', 'seniorityAllowance', 'mealAllowance', 'transportAllowance', 'phoneAllowance', 'overtime', 'bonus', 'bhxh', 'bhyt', 'bhtn', 'unionFee', 'pit', 'advance', 'penalty'],
  TEMPLATE_RETAIL: ['baseSalary', 'commission', 'kpiBonus', 'mealAllowance', 'bhxh', 'bhyt', 'bhtn', 'pit'],
}

async function main() {
  console.log('🔧 Fix Payroll Template componentSystemIds\n')

  // Step 1: Ensure all needed salary components exist
  console.log('📋 Step 1: Ensure salary components exist in SettingsData...')
  const componentIdToSystemId: Record<string, string> = {}

  for (const [templateKey, def] of Object.entries(COMPONENT_DEFINITIONS)) {
    // Check if already exists by id
    let existing = await prisma.settingsData.findFirst({
      where: { id: def.id, isDeleted: false },
    })

    if (!existing) {
      // Create the salary component
      existing = await prisma.settingsData.create({
        data: {
          id: def.id,
          name: def.name,
          type: def.type,
          description: def.name,
          metadata: def.metadata as Record<string, string | number | boolean>,
          isActive: true,
          isDefault: false,
        },
      })
      console.log(`   ✅ Created: ${def.name} (${def.id}) → systemId: ${existing.systemId}`)
    } else {
      console.log(`   ⏭️  Exists: ${def.name} (${def.id}) → systemId: ${existing.systemId}`)
    }

    componentIdToSystemId[templateKey] = existing.systemId
  }

  console.log(`\n   Total components: ${Object.keys(componentIdToSystemId).length}`)

  // Step 2: Read current payroll templates from Setting table
  console.log('\n📋 Step 2: Read payroll templates from Setting table...')
  const setting = await prisma.setting.findFirst({
    where: { key: 'payroll-templates', group: 'hrm' },
  })

  if (!setting) {
    console.log('   ❌ No payroll-templates setting found! Nothing to fix.')
    return
  }

  const templates = setting.value as Array<{
    systemId: string
    id: string
    name: string
    description: string
    componentSystemIds: string[]
    isDefault: boolean
    createdAt: string
    updatedAt: string
  }>

  console.log(`   Found ${templates.length} templates:`)
  for (const t of templates) {
    console.log(`   - ${t.id}: ${t.name} (${t.componentSystemIds.length} components)`)
    console.log(`     Old componentSystemIds: [${t.componentSystemIds.join(', ')}]`)
  }

  // Step 3: Fix componentSystemIds
  console.log('\n📋 Step 3: Fix componentSystemIds...')
  const updatedTemplates = templates.map(t => {
    const templateComponents = TEMPLATE_COMPONENTS[t.id]
    if (!templateComponents) {
      console.log(`   ⚠️  Unknown template ID: ${t.id} — skipping`)
      return t
    }

    const newSystemIds = templateComponents
      .map(compKey => {
        const systemId = componentIdToSystemId[compKey]
        if (!systemId) {
          console.log(`   ⚠️  No systemId found for component: ${compKey}`)
          return null
        }
        return systemId
      })
      .filter(Boolean) as string[]

    console.log(`   ✅ ${t.id}: ${newSystemIds.length} components mapped`)
    console.log(`     New componentSystemIds: [${newSystemIds.join(', ')}]`)

    return {
      ...t,
      componentSystemIds: newSystemIds,
      updatedAt: new Date().toISOString(),
    }
  })

  // Step 4: Update Setting
  console.log('\n📋 Step 4: Update Setting table...')
  await prisma.setting.update({
    where: { systemId: setting.systemId },
    data: { value: updatedTemplates },
  })
  console.log('   ✅ Payroll templates updated successfully!')

  // Step 5: Verify
  console.log('\n📋 Step 5: Verify...')
  const verifyTemplates = await prisma.setting.findFirst({
    where: { key: 'payroll-templates', group: 'hrm' },
  })
  const verifiedValue = verifyTemplates?.value as Array<{ id: string, componentSystemIds: string[] }>
  for (const t of verifiedValue) {
    // Verify all systemIds exist in SettingsData
    const count = await prisma.settingsData.count({
      where: { systemId: { in: t.componentSystemIds }, isDeleted: false },
    })
    console.log(`   ${t.id}: ${count}/${t.componentSystemIds.length} components verified ✅`)
  }

  console.log('\n🎉 Done! Payroll templates now reference correct salary component systemIds.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
