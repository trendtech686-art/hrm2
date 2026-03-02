// Test NextAuth login directly
import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function testAuthorize(email: string, password: string) {
  console.log("[Test] Testing authorize for:", email);
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        employee: {
          select: {
            systemId: true,
            fullName: true,
            department: { select: { systemId: true, name: true } },
            branch: { select: { systemId: true, name: true } },
            jobTitle: { select: { systemId: true, name: true } },
          },
        },
      },
    });

    console.log("[Test] User found:", user ? { email: user.email, isActive: user.isActive } : null);

    if (!user || !user.isActive) {
      console.log("[Test] User not found or inactive");
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("[Test] Password valid:", isValidPassword);
    
    if (!isValidPassword) {
      console.log("[Test] Invalid password");
      return null;
    }

    // Return user
    const returnUser = {
      id: user.systemId,
      email: user.email,
      name: user.employee?.fullName || user.email,
      role: user.role as string,
      employeeId: user.employeeId ?? undefined,
      employee: user.employee ? {
        systemId: user.employee.systemId,
        name: user.employee.fullName,
        fullName: user.employee.fullName,
        departmentName: user.employee.department?.name ?? null,
        branchName: user.employee.branch?.name ?? null,
        jobTitleName: user.employee.jobTitle?.name ?? null,
      } : undefined,
    };
    
    console.log("[Test] Success! User:", { id: returnUser.id, email: returnUser.email, role: returnUser.role });
    return returnUser;
  } catch (error) {
    console.error("[Test] Auth error:", error);
    return null;
  }
}

async function main() {
  console.log('\n=== Testing admin@erp.local with password123 ===');
  await testAuthorize('admin@erp.local', 'password123');
  
  console.log('\n=== Testing sales@erp.local with password123 ===');
  await testAuthorize('sales@erp.local', 'password123');
  
  console.log('\n=== Testing wrong password ===');
  await testAuthorize('admin@erp.local', 'wrongpassword');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
