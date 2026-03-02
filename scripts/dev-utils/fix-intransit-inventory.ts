/**
 * Fix inventory for IN_TRANSIT stock transfers
 * 
 * The old code incorrectly added inTransit to SOURCE branch instead of DESTINATION branch.
 * This script fixes existing transfers by:
 * 1. Moving inTransit from source to destination branch
 * 
 * Run: npx tsx fix-intransit-inventory.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixInTransitInventory() {
  console.log('🔍 Finding IN_TRANSIT stock transfers...');
  
  const inTransitTransfers = await prisma.stockTransfer.findMany({
    where: { status: 'IN_TRANSIT' },
    include: { items: true },
  });

  console.log(`Found ${inTransitTransfers.length} IN_TRANSIT transfers`);

  for (const transfer of inTransitTransfers) {
    console.log(`\n📦 Processing transfer ${transfer.id}:`);
    console.log(`   From: ${transfer.fromBranchName || transfer.fromBranchId}`);
    console.log(`   To: ${transfer.toBranchName || transfer.toBranchId}`);
    
    for (const item of transfer.items) {
      if (!item.productId) continue;
      
      const product = await prisma.product.findUnique({
        where: { systemId: item.productId },
        select: { name: true, id: true },
      });
      
      console.log(`\n   Product: ${product?.id || item.productId} - ${product?.name || 'Unknown'}`);
      console.log(`   Quantity: ${item.quantity}`);
      
      // Check source branch inventory
      const sourceInventory = await prisma.productInventory.findUnique({
        where: {
          productId_branchId: {
            productId: item.productId,
            branchId: transfer.fromBranchId,
          },
        },
      });
      
      console.log(`   Source inTransit: ${sourceInventory?.inTransit || 0}`);
      
      // Check destination branch inventory
      const destInventory = await prisma.productInventory.findUnique({
        where: {
          productId_branchId: {
            productId: item.productId,
            branchId: transfer.toBranchId,
          },
        },
      });
      
      console.log(`   Dest inTransit: ${destInventory?.inTransit || 0}`);
      
      // If source has inTransit but dest doesn't, we need to move it
      if ((sourceInventory?.inTransit || 0) >= item.quantity && (destInventory?.inTransit || 0) < item.quantity) {
        console.log(`   ⚠️ Fixing: Moving inTransit from source to destination...`);
        
        await prisma.$transaction(async (tx) => {
          // Remove inTransit from source
          await tx.productInventory.update({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: transfer.fromBranchId,
              },
            },
            data: {
              inTransit: { decrement: item.quantity },
              updatedAt: new Date(),
            },
          });
          
          // Add inTransit to destination
          await tx.productInventory.upsert({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: transfer.toBranchId,
              },
            },
            update: {
              inTransit: { increment: item.quantity },
              updatedAt: new Date(),
            },
            create: {
              productId: item.productId,
              branchId: transfer.toBranchId,
              onHand: 0,
              inTransit: item.quantity,
            },
          });
        });
        
        console.log(`   ✅ Fixed!`);
      } else if ((destInventory?.inTransit || 0) >= item.quantity) {
        console.log(`   ✅ Already correct (dest has inTransit)`);
      } else {
        console.log(`   ℹ️ Creating inTransit at destination...`);
        
        await prisma.productInventory.upsert({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: transfer.toBranchId,
            },
          },
          update: {
            inTransit: { increment: item.quantity },
            updatedAt: new Date(),
          },
          create: {
            productId: item.productId,
            branchId: transfer.toBranchId,
            onHand: 0,
            inTransit: item.quantity,
          },
        });
        
        console.log(`   ✅ Created!`);
      }
    }
  }
  
  console.log('\n✅ Done fixing IN_TRANSIT inventory!');
}

fixInTransitInventory()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
