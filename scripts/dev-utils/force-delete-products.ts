import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Direct connection string (bypass dotenv parsing issues)
const connectionString = process.env.DATABASE_URL?.split('"')[1] || process.env.DATABASE_URL || 'postgresql://erp_user:erp_password@localhost:5433/erp_db';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== DELETING ALL PRODUCTS ===\n');
  console.log('Using connection:', connectionString.replace(/:[^:@]+@/, ':****@'));
  
  // Delete using raw SQL to bypass any soft-delete logic
  const prices = await prisma.$executeRaw`DELETE FROM "product_prices"`;
  console.log(`Deleted from product_prices: ${prices}`);
  
  const inventory = await prisma.$executeRaw`DELETE FROM "product_inventory"`;
  console.log(`Deleted from product_inventory: ${inventory}`);
  
  const categories = await prisma.$executeRaw`DELETE FROM "product_categories"`;
  console.log(`Deleted from product_categories: ${categories}`);
  
  const products = await prisma.$executeRaw`DELETE FROM "products"`;
  console.log(`Deleted from products: ${products}`);
  
  // Verify
  const remaining = await prisma.product.count();
  console.log(`\n=== VERIFICATION ===`);
  console.log(`Remaining products: ${remaining}`);
  
  if (remaining === 0) {
    console.log('✅ All products deleted successfully!');
  } else {
    console.log('❌ Still have products in DB!');
  }
}

main().finally(() => prisma.$disconnect());
