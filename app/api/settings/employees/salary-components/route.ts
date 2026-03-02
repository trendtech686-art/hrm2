import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { NextRequest } from 'next/server'

// Salary component types in SettingsData
const SALARY_COMPONENT_TYPES = [
  'salary_component',    // Main type
  'earning',             // Thu nhập
  'deduction',           // Khấu trừ  
  'allowance',           // Phụ cấp
  'contribution',        // Đóng góp
  'minimum_wage',        // Lương tối thiểu
  'base_salary',         // Lương cơ sở
];

// GET /api/settings/employees/salary-components - Get all salary components
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const components = await prisma.settingsData.findMany({
      where: {
        type: { in: SALARY_COMPONENT_TYPES },
        isDeleted: false,
      },
      orderBy: [
        { createdAt: 'asc' },
      ],
    })

    // Transform to match SalaryComponent interface
    const transformed = components.map((item, index) => {
      const metadata = (item.metadata as Record<string, unknown>) ?? {}
      return {
        systemId: item.systemId,
        id: item.id,
        name: item.name,
        description: item.description,
        category: metadata.category ?? 'earning',
        type: metadata.type ?? 'fixed',
        amount: metadata.amount ?? 0,
        formula: metadata.formula ?? null,
        taxable: metadata.taxable ?? true,
        partOfSocialInsurance: metadata.partOfSocialInsurance ?? false,
        isActive: item.isActive,
        sortOrder: (metadata.sortOrder as number) ?? index + 1,
        applicableDepartmentSystemIds: [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }
    })

    return apiSuccess(transformed)
  } catch (error) {
    console.error('Error fetching salary components:', error)
    return apiError('Failed to fetch salary components', 500)
  }
}

// POST /api/settings/employees/salary-components - Create new salary component
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    
    // Count existing for sortOrder
    const count = await prisma.settingsData.count({
      where: { type: { in: SALARY_COMPONENT_TYPES } },
    })
    
    const sortOrder = count + 1
    
    const component = await prisma.settingsData.create({
      data: {
        id: body.id || `SC${String(sortOrder).padStart(4, '0')}`,
        name: body.name,
        description: body.description,
        type: 'salary_component',
        isDefault: body.isDefault ?? false,
        isActive: true,
        metadata: {
          category: body.category ?? 'earning',
          type: body.type ?? 'fixed',
          amount: body.amount ?? 0,
          formula: body.formula ?? null,
          taxable: body.taxable ?? true,
          partOfSocialInsurance: body.partOfSocialInsurance ?? false,
          sortOrder,
        },
        createdBy: session.user?.id,
      },
    })

    const metadata = (component.metadata as Record<string, unknown>) ?? {}
    return apiSuccess({
      systemId: component.systemId,
      id: component.id,
      name: component.name,
      description: component.description,
      category: metadata.category ?? 'earning',
      type: metadata.type ?? 'fixed',
      amount: metadata.amount ?? 0,
      formula: metadata.formula ?? null,
      taxable: metadata.taxable ?? true,
      partOfSocialInsurance: metadata.partOfSocialInsurance ?? false,
      isActive: component.isActive,
      sortOrder: (metadata.sortOrder as number) ?? sortOrder,
      applicableDepartmentSystemIds: [],
      createdAt: component.createdAt,
      updatedAt: component.updatedAt,
    })
  } catch (error) {
    console.error('Error creating salary component:', error)
    return apiError('Failed to create salary component', 500)
  }
}
