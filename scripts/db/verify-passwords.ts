import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const testPassword = 'password123';
  
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      password: true,
    }
  });
  
  for (const user of users) {
    const isMatch = await bcrypt.compare(testPassword, user.password);
  }
  
  await prisma.$disconnect();
}

main();
