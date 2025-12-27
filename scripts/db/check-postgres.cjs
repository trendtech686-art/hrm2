// Check PostgreSQL Database - Uses ESM
import('dotenv/config').then(() => {
  return Promise.all([
    import('./generated/prisma/client.js'),
    import('@prisma/adapter-pg')
  ]);
}).then(([{ PrismaClient }, { PrismaPg }]) => {
  const connectionString = process.env.DATABASE_URL || 'postgresql://erp_user:erp_password@localhost:5433/erp_db?schema=public';
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });
  
  return checkDatabase(prisma);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

async function checkDatabase(prisma) {
  
  try {
    console.log('=== DATABASE CHECK ===\n');
    
    // Count records in main tables
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.employee.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.branch.count(),
      prisma.department.count(),
    ]);
    
    console.log('Table Record Counts:');
    console.log(`  users:       ${counts[0]}`);
    console.log(`  employees:   ${counts[1]}`);
    console.log(`  products:    ${counts[2]}`);
    console.log(`  orders:      ${counts[3]}`);
    console.log(`  customers:   ${counts[4]}`);
    console.log(`  branches:    ${counts[5]}`);
    console.log(`  departments: ${counts[6]}`);
    
    // Check users data
    console.log('\n=== USERS ===');
    const users = await prisma.user.findMany({
      include: { employee: true }
    });
    users.forEach(u => {
      console.log(`  ${u.email} | Role: ${u.role} | Active: ${u.isActive} | Employee: ${u.employee?.id || 'None'}`);
    });
    
    // Check if relations work
    console.log('\n=== RELATION TEST ===');
    const ordersWithRelations = await prisma.order.findFirst({
      include: {
        customer: true,
        branch: true,
        lineItems: true,
      }
    });
    if (ordersWithRelations) {
      console.log(`  Order: ${ordersWithRelations.id}`);
      console.log(`  Customer: ${ordersWithRelations.customer?.name || 'None'}`);
      console.log(`  Branch: ${ordersWithRelations.branch?.name || 'None'}`);
      console.log(`  Line Items: ${ordersWithRelations.lineItems?.length || 0}`);
    } else {
      console.log('  No orders found');
    }
    
    console.log('\n✅ Database connection OK!');
    
  } catch (error) {
    console.error('❌ Database Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
