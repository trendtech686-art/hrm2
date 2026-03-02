import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Fix inventory receipts - update supplierSystemId/Name from referenceId (which should be PO systemId)
  const receipts = await prisma.inventoryReceipt.findMany({
    where: {
      OR: [
        { supplierSystemId: null },
        { supplierName: null },
      ]
    },
    select: { 
      systemId: true,
      id: true, 
      referenceId: true,
      referenceType: true,
      purchaseOrderSystemId: true,
      supplierSystemId: true,
      supplierName: true,
    },
  });
  
  console.log(`Found ${receipts.length} receipts missing supplier info`);
  
  let updated = 0;
  for (const receipt of receipts) {
    const poSystemId = receipt.purchaseOrderSystemId || receipt.referenceId;
    if (!poSystemId) {
      console.log(`${receipt.id}: No PO reference, skipping`);
      continue;
    }
    
    const po = await prisma.purchaseOrder.findUnique({
      where: { systemId: poSystemId },
      select: { 
        systemId: true,
        id: true,
        supplierSystemId: true, 
        supplier: { select: { name: true } },
      },
    });
    
    if (!po) {
      console.log(`${receipt.id}: PO ${poSystemId} not found, skipping`);
      continue;
    }
    
    if (po.supplierSystemId) {
      await prisma.inventoryReceipt.update({
        where: { systemId: receipt.systemId },
        data: {
          purchaseOrderSystemId: po.systemId,
          purchaseOrderId: po.id,
          supplierSystemId: po.supplierSystemId,
          supplierName: po.supplier?.name || null,
        },
      });
      console.log(`${receipt.id}: Updated with supplier ${po.supplier?.name} from PO ${po.id}`);
      updated++;
    }
  }
  
  console.log(`\nUpdated ${updated} receipts`);
  process.exit(0);
}

main();
