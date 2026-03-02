import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const testEmail = 'admin@erp.local';
  const testPassword = 'password123';
  
  const user = await prisma.user.findUnique({
    where: { email: testEmail }
  });
  
  if (!user) {
    console.log('User not found');
    return;
  }
  
  console.log('User found:', user.email);
  console.log('Stored hash:', user.password);
  
  const isValid = await bcrypt.compare(testPassword, user.password);
  console.log(`Password "${testPassword}" valid:`, isValid);
  
  // Try generating a new hash
  const newHash = await bcrypt.hash(testPassword, 10);
  console.log('New hash for password123:', newHash);
  
  // Verify new hash
  const isNewHashValid = await bcrypt.compare(testPassword, newHash);
  console.log('New hash valid:', isNewHashValid);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
