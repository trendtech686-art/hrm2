import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })
  
  try {
    const count = await prisma.employee.count()
    console.log('Employee count:', count)
    
    if (count > 0) {
      const employees = await prisma.employee.findMany({ take: 5 })
      console.log('Sample employees:', employees.map(e => ({ id: e.id, fullName: e.fullName, role: e.role })))
    }
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

check()
