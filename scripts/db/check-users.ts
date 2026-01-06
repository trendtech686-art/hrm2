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
  
  users.forEach(u => {
  });
  
  await prisma.$disconnect();
}

main();
