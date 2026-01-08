import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users in database:');
  users.forEach(u => {
    console.log(`- ${u.email} | Role: ${u.role} | Active: ${u.isActive} | Password hash: ${u.password.substring(0, 20)}...`);
  });
  
  if (users.length === 0) {
    console.log('No users found! Please run: npx prisma db seed');
  }
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
