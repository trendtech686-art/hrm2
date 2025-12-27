import { prisma } from '../../lib/prisma';

async function main() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      isActive: true,
      password: true,
    }
  });
  
  console.log('Users in database:');
  users.forEach(u => {
    console.log(`- ${u.email} (${u.role}) - Active: ${u.isActive}`);
    console.log(`  Password hash: ${u.password.substring(0, 20)}...`);
  });
  
  await prisma.$disconnect();
}

main();
