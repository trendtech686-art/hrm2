import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })

async function main() {
  // 1. Check user record  
  const user = await prisma.user.findUnique({
    where: { email: 'nhlpkgx@gmail.com' },
    select: { systemId: true, email: true, password: true, role: true, isActive: true, employeeId: true }
  })
  console.log('=== User record ===')
  console.log(user ? { ...user, password: user.password.substring(0, 20) + '...' } : 'NOT FOUND')

  if (!user) return

  // 2. Test bcrypt
  const valid = await bcrypt.compare('password123', user.password)
  console.log(`\nPassword "password123" valid: ${valid}`)

  // 3. Check employee with full relations (same query as auth.ts)
  console.log('\n=== Employee with relations (auth.ts query) ===')
  try {
    const userWithEmp = await prisma.user.findUnique({
      where: { email: 'nhlpkgx@gmail.com' },
      include: {
        employee: {
          select: {
            systemId: true,
            fullName: true,
            workEmail: true,
            role: true,
            department: { select: { systemId: true, name: true } },
            branch: { select: { systemId: true, name: true } },
            jobTitle: { select: { systemId: true, name: true } },
          },
        },
      },
    })
    console.log('Query succeeded:', JSON.stringify(userWithEmp?.employee, null, 2))
  } catch (err) {
    console.log('❌ Query FAILED:', err)
  }

  // 4. Check employee raw  
  console.log('\n=== Employee raw ===')
  const emp = await prisma.employee.findUnique({
    where: { systemId: user.employeeId! },
    select: { 
      systemId: true, id: true, fullName: true, workEmail: true, role: true,
      departmentId: true, branchId: true, jobTitleId: true 
    }
  })
  console.log(emp)
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect() })
