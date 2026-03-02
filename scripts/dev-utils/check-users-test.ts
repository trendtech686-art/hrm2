import { prisma } from './lib/prisma';

async function main() {
  const users = await prisma.user.findMany({ 
    select: { 
      email: true, 
      isActive: true, 
      role: true,
      password: true
    } 
  });
  console.log('Users:', JSON.stringify(users, null, 2));
  
  // Check if passwords are hashed
  for (const user of users) {
    console.log(`User ${user.email}: password starts with $2 (bcrypt): ${user.password?.startsWith('$2')}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
