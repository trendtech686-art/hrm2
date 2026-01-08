import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@erp.local';
  const password = 'password123';
  
  console.log(`Testing login with: ${email} / ${password}`);
  
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    console.log('❌ User not found!');
    await prisma.$disconnect();
    return;
  }
  
  console.log(`✓ User found: ${user.email}`);
  console.log(`  - isActive: ${user.isActive}`);
  console.log(`  - Password hash: ${user.password}`);
  
  const isValidPassword = await bcrypt.compare(password, user.password);
  console.log(`  - Password valid: ${isValidPassword}`);
  
  // Test hashing the same password
  const newHash = await bcrypt.hash(password, 10);
  console.log(`  - New hash for same password: ${newHash}`);
  const testCompare = await bcrypt.compare(password, newHash);
  console.log(`  - New hash compare result: ${testCompare}`);
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
